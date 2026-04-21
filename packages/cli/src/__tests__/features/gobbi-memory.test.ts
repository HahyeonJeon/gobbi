/**
 * Integration-style tests for the gobbi-memory feature's code surface.
 *
 * Scope (feature scenarios `G-MEM-{H|Edge}-NN` in
 * `.claude/project/gobbi/design/v050-features/gobbi-memory/scenarios.md`):
 *
 *   - Per-session directory layout — `gobbi workflow init` writes
 *     `metadata.json`, `state.json`, `gobbi.db` and does not eagerly
 *     scaffold step subdirs or an `events.jsonl` sidecar
 *     (G-MEM-H-01, G-MEM-H-02, G-MEM-H-03, G-MEM-H-04).
 *   - `ensureSessionStepDir` lazy step-subdir helper creates
 *     `<step>/rawdata/` idempotently and returns the step path
 *     (G-MEM-H-05).
 *   - Schema v5 adds `session_id` + `project_id` columns to the
 *     events table, populated on every insert (G-MEM-H-06, G-MEM-H-07).
 *   - `events.jsonl` sidecar has been fully removed — no append path
 *     writes it (G-MEM-H-08).
 *   - Resume replays events when `state.json` and its backup are both
 *     absent — events are the source of truth (G-MEM-Edge-01).
 *   - Two sessions in the same repo partition by directory — no cross-
 *     session lock contention or row mixing (G-MEM-Edge-02).
 *
 * Every test uses `mkdtempSync` under the OS tmpdir so no test touches
 * the actual checkout's `.gobbi/` tree, and every test cleans up in
 * `afterEach`. Production code is invoked via direct module imports
 * (`runInitWithOptions`, `EventStore`, `ensureSessionStepDir`,
 * `resolveState`) — no `Bun.$` subprocess calls. Raw SQL inspection
 * follows `workflow/__tests__/store.test.ts`'s sibling-`Database`
 * pattern (read-only connection against the on-disk file).
 *
 * Pattern references:
 *   - `packages/cli/src/__tests__/features/one-command-install.test.ts`
 *     (describe grouping + `import.meta.dir` discipline)
 *   - `packages/cli/src/commands/workflow/__tests__/init.test.ts`
 *     (tmpdir repo + `runInitWithOptions({ repoRoot })` plumbing)
 *   - `packages/cli/src/workflow/__tests__/store.test.ts`
 *     (raw `Database({ readonly: true })` + `PRAGMA table_info`)
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { Database } from 'bun:sqlite';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  unlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { ensureSessionStepDir } from '../../lib/session-dirs.js';
import { runInitWithOptions, readMetadata } from '../../commands/workflow/init.js';
import { EventStore } from '../../workflow/store.js';
import type { EventRow } from '../../workflow/store.js';
import { resolveState, initialState } from '../../workflow/state.js';
import { reduce } from '../../workflow/reducer.js';

// ---------------------------------------------------------------------------
// Tmpdir scaffolding — every test gets a fresh tmpdir under the OS tmpdir.
// The `afterEach` tears it down so `/tmp/gobbi-memory-test-*` leaves no trace.
// ---------------------------------------------------------------------------

const scratchDirs: string[] = [];
let origSessionIdEnv: string | undefined;

function makeScratchRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-memory-test-'));
  scratchDirs.push(dir);
  return dir;
}

beforeEach(() => {
  // `resolveSessionId` in init.ts falls back to the env var when no
  // `--session-id` flag is passed — delete it so the tests never leak
  // the host Claude Code session id into the fixture.
  origSessionIdEnv = process.env['CLAUDE_SESSION_ID'];
  delete process.env['CLAUDE_SESSION_ID'];
});

afterEach(() => {
  if (origSessionIdEnv === undefined) {
    delete process.env['CLAUDE_SESSION_ID'];
  } else {
    process.env['CLAUDE_SESSION_ID'] = origSessionIdEnv;
  }
  while (scratchDirs.length > 0) {
    const d = scratchDirs.pop();
    if (d !== undefined) {
      try {
        rmSync(d, { recursive: true, force: true });
      } catch {
        // best-effort — tmpdir is reaped by the OS regardless
      }
    }
  }
});

/**
 * Run `gobbi workflow init` against a tmpdir repo for a given session id.
 * Returns the resolved session directory path. Uses the `--task` flag
 * with a fixed string so `configSnapshot.task` is assertable.
 */
async function initSession(
  repo: string,
  sessionId: string,
): Promise<string> {
  await runInitWithOptions(
    ['--session-id', sessionId, '--task', 'memory test'],
    { repoRoot: repo },
  );
  return join(repo, '.gobbi', 'sessions', sessionId);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('gobbi-memory feature — code surface', () => {
  // -------------------------------------------------------------------------
  // Layout — per-session directory contents after `gobbi workflow init`.
  // -------------------------------------------------------------------------
  describe('session dir layout', () => {
    // Scenario: G-MEM-H-01
    test('init creates metadata.json + state.json + gobbi.db; no step subdirs; no events.jsonl', async () => {
      const repo = makeScratchRepo();
      const sessionDir = await initSession(repo, 'layout-h01');

      // Locked file set — present.
      expect(existsSync(join(sessionDir, 'metadata.json'))).toBe(true);
      expect(existsSync(join(sessionDir, 'state.json'))).toBe(true);
      expect(existsSync(join(sessionDir, 'gobbi.db'))).toBe(true);

      // Sidecar regression guard — must NOT exist post schema v5.
      expect(existsSync(join(sessionDir, 'events.jsonl'))).toBe(false);

      // Step subdirs are lazy — none should exist after a bare init.
      const steps = ['ideation', 'plan', 'execution', 'evaluation', 'memorization'];
      for (const step of steps) {
        expect(existsSync(join(sessionDir, step))).toBe(false);
      }

      // `artifacts/` is also lazy (created on first delegation).
      expect(existsSync(join(sessionDir, 'artifacts'))).toBe(false);
    });

    // Scenario: G-MEM-H-02
    test('event store is per-session; no workspace-level .gobbi/gobbi.db', async () => {
      const repo = makeScratchRepo();
      const sessionDir = await initSession(repo, 'layout-h02');

      // Per-session DB present at the expected path.
      expect(existsSync(join(sessionDir, 'gobbi.db'))).toBe(true);

      // Workspace-level DB must NOT exist — the locked contract is
      // per-session partitioning only.
      expect(existsSync(join(repo, '.gobbi', 'gobbi.db'))).toBe(false);
    });

    // Scenario: G-MEM-H-03
    test('metadata.json shape: schemaVersion 2 + required fields', async () => {
      const repo = makeScratchRepo();
      const sessionDir = await initSession(repo, 'layout-h03');

      const meta = readMetadata(join(sessionDir, 'metadata.json'));
      // `readMetadata` returns `null` if parsing or validation fails.
      // A fresh init MUST produce a well-formed metadata file.
      expect(meta).not.toBeNull();
      if (meta === null) throw new Error('metadata.json failed to parse');

      expect(meta.schemaVersion).toBe(2);
      expect(meta.sessionId).toBe('layout-h03');
      expect(meta.projectRoot).toBe(repo);
      expect(typeof meta.createdAt).toBe('string');
      expect(meta.createdAt.length).toBeGreaterThan(0);
      expect(Array.isArray(meta.techStack)).toBe(true);
      expect(meta.configSnapshot.task).toBe('memory test');
      expect(meta.configSnapshot.evalIdeation).toBe(false);
      expect(meta.configSnapshot.evalPlan).toBe(false);
      expect(typeof meta.configSnapshot.context).toBe('string');
    });

    // Scenario: G-MEM-H-04
    test('idempotent re-init — silent no-op, mtimes preserved', async () => {
      const repo = makeScratchRepo();
      const sessionDir = await initSession(repo, 'layout-h04');

      const metaPath = join(sessionDir, 'metadata.json');
      const firstMtimeMs = statSync(metaPath).mtimeMs;
      const firstBytes = readFileSync(metaPath, 'utf8');

      // Second init with the same session id should take the existing-
      // metadata fast-path and leave the file byte-identical.
      await initSession(repo, 'layout-h04');

      const secondMtimeMs = statSync(metaPath).mtimeMs;
      expect(secondMtimeMs).toBe(firstMtimeMs);
      expect(readFileSync(metaPath, 'utf8')).toBe(firstBytes);

      // Event count unchanged — init's opening pair (workflow.start +
      // workflow.eval.decide) should remain at 2 rows total.
      const store = new EventStore(join(sessionDir, 'gobbi.db'));
      try {
        expect(store.eventCount()).toBe(2);
      } finally {
        store.close();
      }
    });
  });

  // -------------------------------------------------------------------------
  // Helper — `ensureSessionStepDir` behaves as a lazy, idempotent creator.
  // -------------------------------------------------------------------------
  describe('ensureSessionStepDir helper', () => {
    // Scenario: G-MEM-H-05
    test('creates step dir + rawdata, is idempotent, returns step path', async () => {
      const repo = makeScratchRepo();
      const sessionDir = await initSession(repo, 'helper-h05');

      // First call — must materialise both directories.
      const first = ensureSessionStepDir(sessionDir, 'ideation');
      expect(first).toBe(join(sessionDir, 'ideation'));
      expect(existsSync(first)).toBe(true);
      expect(existsSync(join(first, 'rawdata'))).toBe(true);

      // Second call — no throw, same returned path, files still in place.
      const second = ensureSessionStepDir(sessionDir, 'ideation');
      expect(second).toBe(first);
      expect(existsSync(second)).toBe(true);
      expect(existsSync(join(second, 'rawdata'))).toBe(true);

      // Sibling step subdirs MUST NOT be created as a side-effect.
      expect(existsSync(join(sessionDir, 'plan'))).toBe(false);
      expect(existsSync(join(sessionDir, 'execution'))).toBe(false);
      expect(existsSync(join(sessionDir, 'evaluation'))).toBe(false);
      expect(existsSync(join(sessionDir, 'memorization'))).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // Schema — events table carries session_id + project_id at schema v5,
  // populated on every insert.
  // -------------------------------------------------------------------------
  describe('schema v5 partition columns', () => {
    // Scenario: G-MEM-H-06
    test('events table — session_id + project_id columns present', async () => {
      const repo = makeScratchRepo();
      const sessionDir = await initSession(repo, 'schema-h06');
      const dbPath = join(sessionDir, 'gobbi.db');

      // Sibling read-only connection — the writer in the init call has
      // already closed, so the DB is quiescent. WAL mode permits a
      // concurrent reader even when a writer is open (pattern from
      // `store.test.ts::schema v5`).
      const inspector = new Database(dbPath, { readonly: true });
      try {
        interface ColumnInfo {
          readonly name: string;
          readonly type: string;
          readonly notnull: number;
        }
        const cols = inspector
          .query<ColumnInfo, []>('PRAGMA table_info(events)')
          .all();
        const names = new Set(cols.map((c) => c.name));
        expect(names.has('session_id')).toBe(true);
        expect(names.has('project_id')).toBe(true);

        // Legacy column set must still be present — v4 → v5 is strictly
        // additive.
        expect(names.has('seq')).toBe(true);
        expect(names.has('ts')).toBe(true);
        expect(names.has('idempotency_key')).toBe(true);
      } finally {
        inspector.close();
      }
    });

    // Scenario: G-MEM-H-07
    test('event append populates session_id + project_id on every row', async () => {
      const repo = makeScratchRepo();
      const sessionDir = await initSession(repo, 'schema-h07');
      const dbPath = join(sessionDir, 'gobbi.db');

      // Init pre-seeds workflow.start (seq=1) + workflow.eval.decide
      // (seq=2) — inspecting those covers both the "every row" clause
      // (not just the first one) and the real append code path
      // (no manual `store.append` with a hand-crafted ts/toolCallId).
      const inspector = new Database(dbPath, { readonly: true });
      try {
        interface PartitionRow {
          readonly seq: number;
          readonly session_id: string | null;
          readonly project_id: string | null;
        }
        const rows = inspector
          .query<PartitionRow, []>(
            'SELECT seq, session_id, project_id FROM events ORDER BY seq ASC',
          )
          .all();

        expect(rows.length).toBeGreaterThanOrEqual(2);
        for (const row of rows) {
          // `session_id` derives from the session directory name on
          // every v5 insert — never null for a real session.
          expect(row.session_id).toBe('schema-h07');
          // `project_id` is `basename(metadata.projectRoot)`; the
          // tmpdir basename is whatever `mkdtempSync` produced —
          // assert shape rather than a hard-coded value.
          expect(typeof row.project_id).toBe('string');
          expect(row.project_id).not.toBeNull();
        }
      } finally {
        inspector.close();
      }
    });

    // Scenario: G-MEM-H-08
    test('events.jsonl is NOT written by any append path', async () => {
      const repo = makeScratchRepo();
      const sessionDir = await initSession(repo, 'schema-h08');

      // Init alone already appends two events — enough to trip any
      // lingering jsonl mirror. Assert the sidecar is absent.
      expect(existsSync(join(sessionDir, 'events.jsonl'))).toBe(false);

      // Confirm events actually landed in the DB — otherwise the
      // negative assertion above would be vacuously true.
      const store = new EventStore(join(sessionDir, 'gobbi.db'));
      try {
        expect(store.eventCount()).toBe(2);
      } finally {
        store.close();
      }

      // Secondary sanity — no `events.jsonl.backup` or other regression
      // shapes under the session dir.
      expect(existsSync(join(sessionDir, 'events.jsonl.backup'))).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // Resume — `resolveState` replays events when state.json is absent.
  // -------------------------------------------------------------------------
  describe('resume from crash', () => {
    // Scenario: G-MEM-Edge-01
    test('resolveState replays events when state.json and backup absent', async () => {
      const repo = makeScratchRepo();
      const sessionDir = await initSession(repo, 'resume-e01');

      // Control snapshot — derived state before any crash simulation.
      // `resolveState`'s fast-path reads state.json; this call returns
      // the on-disk snapshot written by `appendEventAndUpdateState`.
      const store = new EventStore(join(sessionDir, 'gobbi.db'));
      try {
        const events = store.replayAll();
        expect(events.length).toBeGreaterThanOrEqual(2);

        const control = resolveState(sessionDir, events, 'resume-e01', reduce);
        expect(control.sessionId).toBe('resume-e01');

        // Simulate a crash — both snapshots gone. `resolveState` must
        // fall all the way through to event replay.
        unlinkSync(join(sessionDir, 'state.json'));
        if (existsSync(join(sessionDir, 'state.json.backup'))) {
          unlinkSync(join(sessionDir, 'state.json.backup'));
        }

        const derived = resolveState(sessionDir, events, 'resume-e01', reduce);

        // The derived state must match the control — equivalence through
        // JSON round-trip covers readonly-array / readonly-record shape
        // differences that `toEqual` would otherwise reject.
        expect(JSON.parse(JSON.stringify(derived))).toEqual(
          JSON.parse(JSON.stringify(control)),
        );
        expect(derived.sessionId).toBe('resume-e01');

        // Defensive — `deriveState` on zero events returns the
        // initial state for the same session; a populated event log
        // must advance past that floor.
        const floor = initialState('resume-e01');
        expect(derived.currentStep).not.toBe(floor.currentStep);
      } finally {
        store.close();
      }
    });
  });

  // -------------------------------------------------------------------------
  // Isolation — two concurrent sessions in the same repo do not collide.
  // -------------------------------------------------------------------------
  describe('per-session isolation', () => {
    // Scenario: G-MEM-Edge-02
    test('two concurrent sessions in same repo keep DBs separated — no SQLITE_BUSY', async () => {
      const repo = makeScratchRepo();
      const dirA = await initSession(repo, 'iso-e02-a');
      const dirB = await initSession(repo, 'iso-e02-b');

      const dbPathA = join(dirA, 'gobbi.db');
      const dbPathB = join(dirB, 'gobbi.db');

      expect(existsSync(dbPathA)).toBe(true);
      expect(existsSync(dbPathB)).toBe(true);
      expect(dbPathA).not.toBe(dbPathB);

      // Open both stores concurrently — per-session partitioning means
      // each DB has its own WAL + `busy_timeout`, so holding both
      // handles simultaneously must not throw SQLITE_BUSY.
      const storeA = new EventStore(dbPathA);
      const storeB = new EventStore(dbPathB);
      try {
        const rowsA = storeA.replayAll();
        const rowsB = storeB.replayAll();

        // Each store has its own seed pair (workflow.start +
        // workflow.eval.decide).
        expect(rowsA.length).toBe(2);
        expect(rowsB.length).toBe(2);

        // Neither DB contains the other session's rows. The
        // `session_id` column exposes the partition key directly.
        const sessionIdsA = new Set(rowsA.map((r: EventRow) => r.session_id));
        const sessionIdsB = new Set(rowsB.map((r: EventRow) => r.session_id));
        expect(sessionIdsA.has('iso-e02-a')).toBe(true);
        expect(sessionIdsA.has('iso-e02-b')).toBe(false);
        expect(sessionIdsB.has('iso-e02-b')).toBe(true);
        expect(sessionIdsB.has('iso-e02-a')).toBe(false);
      } finally {
        storeA.close();
        storeB.close();
      }
    });
  });
});
