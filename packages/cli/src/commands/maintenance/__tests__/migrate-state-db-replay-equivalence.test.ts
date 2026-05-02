/**
 * Replay-equivalence integration test for `gobbi maintenance
 * migrate-state-db` — closes the SC-ORCH-21 design contract (#248,
 * Option A).
 *
 * # What is asserted
 *
 *   1. The argv shell auto-creates `<dbPath>.bak` before any schema
 *      write (Stage 3a in `migrate-state-db.ts`). The bak is a verbatim
 *      copy of the pre-migration `dbPath`, including its v6
 *      `schema_meta` stamp.
 *   2. The migrated `dbPath` carries a v7 `schema_meta` stamp; the
 *      `prompt_patches` table that v7 introduces exists.
 *   3. Replaying the seeded events through `workflow/reducer::reduce`
 *      yields identical `WorkflowState` whether sourced from:
 *        - the original v6 db (snapshot taken before migrate),
 *        - the v6 `.bak` snapshot the auto-bak produced,
 *        - the post-migration v7 db.
 *   4. The events table content is byte-identical between the .bak and
 *      the originally-seeded db (modulo the v6→v7 schema_meta stamp and
 *      the new prompt_patches table — neither of which lives in the
 *      events table).
 *   5. Negative path — when `<dbPath>.bak` already exists, the argv
 *      shell exits 1 with `BAK_EXISTS` and never touches `dbPath`.
 *
 * # Why a separate file
 *
 * The existing `migrate-state-db.test.ts` covers the argv shell's
 * structural behaviour (parse, exits, JSON envelope shape, downgrade
 * preflight). This file is an integration test that exercises the
 * end-to-end "v6 db → migrate → replay both sides → assert equivalence"
 * loop, which requires hand-seeding a v6 db (the `EventStore`
 * constructor auto-migrates to v7 on open and so cannot produce a v6
 * fixture). Splitting keeps the shell-shape unit tests fast and the
 * replay-equivalence integration test self-contained.
 *
 * Mirrors the replay pattern from `lib/memory-projection-diff.ts`
 * (`replayAll() → reduce()`), but compares two stores against each
 * other instead of store-vs-projection.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { Database } from 'bun:sqlite';
import { randomBytes } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { runMigrateStateDbWithOptions } from '../migrate-state-db.js';
import { WorkspaceReadStore } from '../../../lib/workspace-read-store.js';
import {
  CURRENT_SCHEMA_VERSION,
  ensureSchemaV5,
  ensureSchemaV6,
} from '../../../workflow/migrations.js';
import { reduce } from '../../../workflow/reducer.js';
import {
  initialState,
  rowToEvent,
  type WorkflowState,
} from '../../../workflow/state-derivation.js';
import type { EventRow } from '../../../workflow/migrations.js';

// ---------------------------------------------------------------------------
// stdout/stderr capture + process.exit trap
// ---------------------------------------------------------------------------

interface Captured {
  stdout: string;
  stderr: string;
  exitCode: number | null;
}

class ExitCalled extends Error {
  constructor(readonly code: number) {
    super(`process.exit(${code})`);
  }
}

let captured: Captured;
let origStdoutWrite: typeof process.stdout.write;
let origStderrWrite: typeof process.stderr.write;
let origExit: typeof process.exit;

beforeEach(() => {
  captured = { stdout: '', stderr: '', exitCode: null };
  origStdoutWrite = process.stdout.write;
  origStderrWrite = process.stderr.write;
  origExit = process.exit;

  process.stdout.write = ((chunk: string | Uint8Array): boolean => {
    captured.stdout +=
      typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
    return true;
  }) as typeof process.stdout.write;
  process.stderr.write = ((chunk: string | Uint8Array): boolean => {
    captured.stderr +=
      typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
    return true;
  }) as typeof process.stderr.write;
  process.exit = ((code?: number | string | null): never => {
    captured.exitCode = typeof code === 'number' ? code : 0;
    throw new ExitCalled(captured.exitCode);
  }) as typeof process.exit;
});

afterEach(() => {
  process.stdout.write = origStdoutWrite;
  process.stderr.write = origStderrWrite;
  process.exit = origExit;
});

async function captureExit(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (err) {
    if (err instanceof ExitCalled) return;
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Scratch repo helpers
// ---------------------------------------------------------------------------

const scratchDirs: string[] = [];

afterEach(() => {
  while (scratchDirs.length > 0) {
    const d = scratchDirs.pop();
    if (d !== undefined) {
      try {
        rmSync(d, { recursive: true, force: true });
      } catch {
        // best-effort
      }
    }
  }
});

/**
 * Create a tmpdir with a deterministic-lowercase suffix per the
 * `mkdtemp-suffix-fails-name-pattern.md` gotcha. Even though the
 * migrate command does not flow basenames through a NAME_PATTERN
 * validator, sticking to the documented pattern keeps every fixture
 * across the codebase consistent.
 */
function makeRepo(): string {
  const dir = join(
    tmpdir(),
    `gobbi-migrate-replay-${randomBytes(4).toString('hex')}`,
  );
  mkdirSync(dir, { recursive: true });
  scratchDirs.push(dir);
  return dir;
}

/**
 * Build a v6-shape `state.db` at `<repo>/.gobbi/state.db`.
 *
 * Steps:
 *   1. Raw `CREATE TABLE events (...)` — same shape as the legacy v4
 *      events table the migration chain expects to find.
 *   2. `ensureSchemaV5(db)` — adds `session_id` + `project_id` columns.
 *   3. `ensureSchemaV6(db, fixedNow)` — creates the four v6 tables and
 *      stamps `schema_meta` at v6.
 *
 * Crucially we do NOT call `ensureSchemaV7` — the goal is a v6
 * fixture so the migrate run actually has work to do (v6→v7) and the
 * pre-migration `.bak` carries a meaningful v6 stamp.
 */
function seedV6StateDb(repo: string, fixedNow: number): string {
  const gobbiDir = join(repo, '.gobbi');
  mkdirSync(gobbiDir, { recursive: true });
  const dbPath = join(gobbiDir, 'state.db');
  const db = new Database(dbPath);
  try {
    db.run(`
      CREATE TABLE events (
        seq INTEGER PRIMARY KEY,
        ts TEXT NOT NULL,
        schema_version INTEGER NOT NULL,
        type TEXT NOT NULL,
        step TEXT,
        data TEXT NOT NULL DEFAULT '{}',
        actor TEXT NOT NULL,
        parent_seq INTEGER REFERENCES events(seq),
        idempotency_key TEXT NOT NULL UNIQUE,
        session_id TEXT,
        project_id TEXT
      )
    `);
    ensureSchemaV5(db);
    ensureSchemaV6(db, fixedNow);
  } finally {
    db.close();
  }
  return dbPath;
}

interface SeedEventInput {
  readonly ts: string;
  readonly type: string;
  readonly step: string | null;
  readonly data: string;
  readonly idempotencyKey: string;
}

/**
 * Insert a single event row at `schema_version = 6` so the seeded
 * stream genuinely represents a pre-migration db. Using raw SQL (not
 * EventStore.append) lets us choose the schema_version stamp; the
 * EventStore constructor would have stamped CURRENT_SCHEMA_VERSION (7).
 */
function insertV6Event(
  dbPath: string,
  sessionId: string,
  projectId: string,
  input: SeedEventInput,
): void {
  const db = new Database(dbPath);
  try {
    db.run(
      `INSERT INTO events
         (ts, schema_version, type, step, data, actor, parent_seq, idempotency_key, session_id, project_id)
       VALUES (?, 6, ?, ?, ?, 'integration-test', NULL, ?, ?, ?)`,
      [
        input.ts,
        input.type,
        input.step,
        input.data,
        input.idempotencyKey,
        sessionId,
        projectId,
      ],
    );
  } finally {
    db.close();
  }
}

/**
 * Seed a small but realistic event stream for one session: workflow
 * start, then two productive step exits (ideation → planning →
 * execution). With `evalConfig === null` (the initial state has no
 * eval config and no EVAL_DECIDE event has fired), the
 * `evalIdeationDisabled` and `evalPlanningDisabled` predicates fire,
 * so the STEP_EXIT events advance the state machine through the
 * non-eval branches in `workflow/transitions.ts`.
 */
function seedSession(
  dbPath: string,
  sessionId: string,
  projectId: string,
): void {
  insertV6Event(dbPath, sessionId, projectId, {
    ts: '2026-05-02T10:00:00.000Z',
    type: 'workflow.start',
    step: null,
    data: JSON.stringify({
      sessionId,
      timestamp: '2026-05-02T10:00:00.000Z',
    }),
    idempotencyKey: `${sessionId}:workflow.start`,
  });
  insertV6Event(dbPath, sessionId, projectId, {
    ts: '2026-05-02T10:05:00.000Z',
    type: 'workflow.step.exit',
    step: 'ideation',
    data: JSON.stringify({ step: 'ideation' }),
    idempotencyKey: `${sessionId}:exit-ideation`,
  });
  insertV6Event(dbPath, sessionId, projectId, {
    ts: '2026-05-02T10:10:00.000Z',
    type: 'workflow.step.exit',
    step: 'planning',
    data: JSON.stringify({ step: 'planning' }),
    idempotencyKey: `${sessionId}:exit-planning`,
  });
}

/**
 * Replay every row stored under `sessionId` through the production
 * reducer, returning the final `WorkflowState`. Mirrors the replay
 * pattern in `lib/memory-projection-diff.ts::safeReplay`, but without
 * the divergence-bookkeeping wrapper.
 *
 * The cross-partition `WorkspaceReadStore` returns rows for every
 * session; we filter to the test's session id to keep the fixture
 * single-session even though the underlying table model is multi-tenant.
 */
function replayThroughReducer(
  rows: readonly EventRow[],
  sessionId: string,
): WorkflowState {
  const filtered = rows.filter((r) => r.session_id === sessionId);
  let state = initialState(sessionId);
  for (const row of filtered) {
    const event = rowToEvent(row);
    if (event === null) continue;
    const result = reduce(state, event, row.ts);
    if (result.ok) {
      state = result.state;
    }
  }
  return state;
}

function readSchemaMetaVersion(dbPath: string): number | null {
  const db = new Database(dbPath, { strict: true, readonly: true });
  try {
    const tableExists = db
      .query<{ name: string }, [string]>(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
      )
      .get('schema_meta');
    if (tableExists === null) return null;
    interface MetaRow {
      readonly schema_version: number;
    }
    const row = db
      .query<MetaRow, [string]>(
        'SELECT schema_version FROM schema_meta WHERE id = ?',
      )
      .get('state_db');
    return row === null ? null : row.schema_version;
  } finally {
    db.close();
  }
}

function readAllEventRows(dbPath: string): EventRow[] {
  const db = new Database(dbPath, { strict: true, readonly: true });
  try {
    return db
      .query<EventRow, []>('SELECT * FROM events ORDER BY seq ASC')
      .all();
  } finally {
    db.close();
  }
}

function tableExists(dbPath: string, name: string): boolean {
  const db = new Database(dbPath, { strict: true, readonly: true });
  try {
    const row = db
      .query<{ name: string }, [string]>(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
      )
      .get(name);
    return row !== null;
  } finally {
    db.close();
  }
}

// ===========================================================================
// Replay equivalence — happy path (#248 SC-ORCH-21 Option A)
// ===========================================================================

describe('migrate-state-db replay equivalence (#248)', () => {
  test('v6 → v7 migration preserves reducer-derived state across .bak / migrated / pre-migration snapshots', async () => {
    const repo = makeRepo();
    const fixedNow = 1745000000000;
    const sessionId = 'replay-equiv-1';
    const projectId = 'test-project';

    // 1. Seed a v6 state.db with a small but realistic event stream.
    const dbPath = seedV6StateDb(repo, fixedNow);
    seedSession(dbPath, sessionId, projectId);

    // Sanity — the seed left us at v6, NOT v7 (the migrate run must
    // have actual work to do for the test to be meaningful).
    expect(readSchemaMetaVersion(dbPath)).toBe(6);
    expect(tableExists(dbPath, 'prompt_patches')).toBe(false);

    // 2. Snapshot golden state₀ from the original v6 db.
    const preStore = new WorkspaceReadStore(dbPath);
    let state0: WorkflowState;
    let preRows: EventRow[];
    try {
      preRows = preStore.replayAll();
      state0 = replayThroughReducer(preRows, sessionId);
    } finally {
      preStore.close();
    }

    // The reducer should have advanced past `idle`. Verifies the seed
    // is non-trivial — a no-op state₀ would let any post-migration
    // state₂ trivially match.
    expect(state0.currentStep).not.toBe('idle');
    expect(state0.completedSteps).toContain('ideation');
    expect(state0.completedSteps).toContain('planning');

    // 3. Run the argv shell — auto-bak fires, migration runs to v7.
    const bakPath = `${dbPath}.bak`;
    expect(existsSync(bakPath)).toBe(false);

    await captureExit(() =>
      runMigrateStateDbWithOptions([], {
        repoRoot: repo,
        now: () => fixedNow,
      }),
    );

    expect(captured.exitCode).toBeNull();

    // 4. Verify the post-migration filesystem layout.
    expect(existsSync(bakPath)).toBe(true);
    // The bak preserves the pre-migration v6 stamp.
    expect(readSchemaMetaVersion(bakPath)).toBe(6);
    // The migrated main file is at v7.
    expect(readSchemaMetaVersion(dbPath)).toBe(CURRENT_SCHEMA_VERSION);
    expect(CURRENT_SCHEMA_VERSION).toBe(7);
    // v7 added `prompt_patches`. The bak does NOT have it; the
    // migrated file does.
    expect(tableExists(bakPath, 'prompt_patches')).toBe(false);
    expect(tableExists(dbPath, 'prompt_patches')).toBe(true);

    // 5. Replay both sides through the reducer.
    const bakStore = new WorkspaceReadStore(bakPath);
    let state1: WorkflowState;
    let bakRows: EventRow[];
    try {
      bakRows = bakStore.replayAll();
      state1 = replayThroughReducer(bakRows, sessionId);
    } finally {
      bakStore.close();
    }

    const migratedStore = new WorkspaceReadStore(dbPath);
    let state2: WorkflowState;
    let migratedRows: EventRow[];
    try {
      migratedRows = migratedStore.replayAll();
      state2 = replayThroughReducer(migratedRows, sessionId);
    } finally {
      migratedStore.close();
    }

    // 6. The replay-equivalence assertion. The .bak's reducer state
    // matches the pre-migration snapshot (the auto-bak is a verbatim
    // copy); the migrated db's reducer state matches as well (the
    // schema migration is non-destructive on the events table).
    expect(state1).toEqual(state0);
    expect(state2).toEqual(state0);
    expect(state1).toEqual(state2);

    // 7. Events-table content equivalence — every row in the .bak
    // should match the originally-seeded db. We compare via the rows
    // returned by `WorkspaceReadStore.replayAll()` (the SQL is
    // `SELECT * FROM events ORDER BY seq ASC`, so column ordering is
    // stable). The migrated file's events table should also match —
    // the v6→v7 chain is additive on tables, never on row data.
    expect(bakRows).toEqual(preRows);
    expect(migratedRows).toEqual(preRows);

    // Also double-check via raw SQL (defensive — the
    // WorkspaceReadStore could in principle filter rows under future
    // changes; raw SELECT cannot).
    const rawBak = readAllEventRows(bakPath);
    const rawMigrated = readAllEventRows(dbPath);
    expect(rawBak).toEqual(preRows);
    expect(rawMigrated).toEqual(preRows);
  });

  test('BAK_EXISTS — auto-bak refuses when <dbPath>.bak already exists; main db stays at v6', async () => {
    const repo = makeRepo();
    const fixedNow = 1745000000000;
    const dbPath = seedV6StateDb(repo, fixedNow);
    seedSession(dbPath, 'replay-equiv-2', 'test-project');

    // Plant a pre-existing bak. The contents do not need to be a
    // valid sqlite file — the existsSync gate fires before any open.
    const bakPath = `${dbPath}.bak`;
    writeFileSync(bakPath, 'pre-existing operator backup');

    await captureExit(() =>
      runMigrateStateDbWithOptions(['--json'], {
        repoRoot: repo,
        now: () => fixedNow,
      }),
    );

    // Refusal — exit 1, structured envelope.
    expect(captured.exitCode).toBe(1);
    expect(captured.stdout).toBe('');
    const envelope = JSON.parse(captured.stderr.trim()) as Record<
      string,
      unknown
    >;
    expect(envelope['status']).toBe('error');
    expect(envelope['code']).toBe('BAK_EXISTS');
    expect(envelope['path']).toBe(dbPath);

    // Main db is untouched — still at v6, no prompt_patches table.
    expect(readSchemaMetaVersion(dbPath)).toBe(6);
    expect(tableExists(dbPath, 'prompt_patches')).toBe(false);
  });
});
