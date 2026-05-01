/**
 * Unit tests for `gobbi memory backfill <session-id>` — registry wiring,
 * dispatcher routing, pre-flight error envelopes, happy + force paths,
 * `--finished-at` override (explicit + event-derived), `BACKFILL_FAILED`
 * envelope, `--json` contract, and the pure-core helper.
 *
 * Test surface (14) per PR-CFM-B synthesis §4.8:
 *
 *   1.  Subcommand registry lists `backfill`.
 *   2.  Dispatcher: `gobbi memory --help` lists both `check` and `backfill`.
 *   3.  Dispatcher: `gobbi memory backfill --help` exits 0 with usage.
 *   4.  Happy path: stub-only session-id with events → exit 0,
 *       `wrote: true`, session.json populated, project.json upserted.
 *   5.  `BACKFILL_NO_STUB`: stub absent → exit 1.
 *   6.  `BACKFILL_NO_EVENTS`: stub present but per-session gobbi.db
 *       missing OR empty → exit 1.
 *   7.  `BACKFILL_ALREADY_POPULATED` without `--force`: stub populated
 *       (`steps[]` present) → exit 1.
 *   8.  `--force` overrides `BACKFILL_ALREADY_POPULATED`: exit 0,
 *       target overwritten.
 *   9.  `BACKFILL_FAILED`: writer throws (project.json directory blocks
 *       atomic write) → exit 1, code BACKFILL_FAILED.
 *   10. `PARSE_ARGS`: missing `<session-id>` positional → exit 2.
 *   11. `--finished-at <ISO>` override threads through to the writer.
 *   12. `finishedAt`-from-events (Project F3): session with
 *       `workflow.finish` row, no `--finished-at` flag → session.json
 *       finishedAt equals event ts.
 *   13. `--json` envelope shape: success result has the locked fields.
 *   14. Pure-core helper `backfillMemoryAt` callable directly.
 *
 * The fixtures mirror `workflow/__tests__/session-json-writer.test.ts`:
 * a scratch repoRoot under tmpdir, a real `EventStore` opened against
 * the per-session `<sessionDir>/gobbi.db`, and the production
 * `writeSessionStub` helper to materialise the init-time stub.
 */

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
} from 'bun:test';
import { Database } from 'bun:sqlite';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { MEMORY_COMMANDS, runMemoryWithRegistry } from '../../memory.js';
import {
  backfillMemoryAt,
  BackfillNoStubError,
  runMemoryBackfillWithOptions,
  type MemoryBackfillResult,
} from '../backfill.js';
import {
  projectJsonPath,
  readProjectJson,
  readSessionJson,
  sessionJsonPath,
  writeSessionJson,
  writeSessionStub,
  type SessionJson,
} from '../../../lib/json-memory.js';
import { EventStore } from '../../../workflow/store.js';

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
let origLog: typeof console.log;
let origExit: typeof process.exit;

beforeEach(() => {
  captured = { stdout: '', stderr: '', exitCode: null };
  origStdoutWrite = process.stdout.write;
  origStderrWrite = process.stderr.write;
  origLog = console.log;
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
  console.log = (...args: unknown[]): void => {
    captured.stdout += args.map(String).join(' ') + '\n';
  };
  process.exit = ((code?: number | string | null): never => {
    captured.exitCode = typeof code === 'number' ? code : 0;
    throw new ExitCalled(captured.exitCode);
  }) as typeof process.exit;
});

afterEach(() => {
  process.stdout.write = origStdoutWrite;
  process.stderr.write = origStderrWrite;
  console.log = origLog;
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
// Scratch-repo fixtures
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

function makeRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-memory-backfill-'));
  scratchDirs.push(dir);
  return dir;
}

interface SessionFixture {
  readonly repoRoot: string;
  readonly projectName: string;
  readonly sessionId: string;
  readonly sessionDir: string;
}

/**
 * Materialise a session directory at the canonical
 * `<repoRoot>/.gobbi/projects/<projectName>/sessions/<sessionId>` layout
 * and write the init-time stub via the production helper. Mirrors the
 * `workflow/__tests__/session-json-writer.test.ts` fixture shape.
 */
function makeSession(
  repoRoot: string,
  projectName: string,
  sessionId: string,
  task = 'fixture task',
  createdAt = '2026-04-29T00:00:00.000Z',
): SessionFixture {
  const sessionDir = join(
    repoRoot,
    '.gobbi',
    'projects',
    projectName,
    'sessions',
    sessionId,
  );
  mkdirSync(sessionDir, { recursive: true });
  writeSessionStub({
    repoRoot,
    projectName,
    sessionId,
    task,
    gobbiVersion: '0.0.0-test',
    createdAt,
  });
  return { repoRoot, projectName, sessionId, sessionDir };
}

/**
 * Open the per-session gobbi.db, opening + immediately closing an
 * `EventStore` is the production way to materialise the v5+ schema
 * (the constructor stamps schema_meta + creates tables). Used as a
 * one-shot prep so subsequent raw-SQL inserts have a table to write to.
 */
function ensureSchema(dbPath: string): void {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = new EventStore(dbPath);
  store.close();
}

interface SeedRow {
  readonly type: string;
  readonly step?: string | null;
  readonly data?: Record<string, unknown>;
  readonly ts?: string;
}

/**
 * Insert a sequence of events into a per-session `<sessionDir>/gobbi.db`
 * via raw SQL. Mirrors `commands/memory/__tests__/check.test.ts::seedStateDb`
 * but writes to the per-session DB shape (the EventStore's path-derived
 * sessionId fallback stamps `session_id` correctly when the EventStore
 * is opened against this DB). Bypassing the engine reducer keeps these
 * fixtures simple — `aggregateSessionJson` walks rows directly via
 * `rowBelongsToSession`.
 */
function seedRawEvents(
  fixture: SessionFixture,
  rows: readonly SeedRow[],
): void {
  const dbPath = join(fixture.sessionDir, 'gobbi.db');
  ensureSchema(dbPath);

  // The per-session EventStore stamps `session_id` from the path-derived
  // basename (matches `fixture.sessionId`) and leaves `project_id` NULL
  // (no path-derivation fallback after PR-FIN-2a-ii). Match that
  // partition shape exactly so the partition-bound `replayAll` /
  // `eventCount` queries see the seeded rows.
  const db = new Database(dbPath, { strict: true });
  try {
    const stmt = db.query(
      `INSERT INTO events (ts, schema_version, type, step, data, actor, idempotency_key, session_id, project_id)
       VALUES ($ts, 5, $type, $step, $data, 'test', $key, $sessionId, NULL)`,
    );
    let seq = 0;
    for (const row of rows) {
      seq += 1;
      const data = row.data ?? {};
      stmt.run({
        ts: row.ts ?? '2026-04-29T10:00:00.000Z',
        type: row.type,
        step: row.step ?? null,
        data: JSON.stringify(data),
        key: `${fixture.sessionId}:${seq}:${row.type}`,
        sessionId: fixture.sessionId,
      });
    }
  } finally {
    db.close();
  }
}

/**
 * Append a single workflow.start row so the per-session EventStore has
 * a non-zero count (satisfies pre-flight C).
 */
function seedStartEvent(fixture: SessionFixture): void {
  seedRawEvents(fixture, [
    { type: 'workflow.start', ts: '2026-04-29T00:00:01.000Z' },
  ]);
}

/**
 * Seed start + finish rows; the aggregator infers `finishedAt` from the
 * `workflow.finish` row's `ts`. Returns the finish ts the test pins.
 */
function seedStartAndFinish(
  fixture: SessionFixture,
  finishTs = '2026-04-29T01:00:00.000Z',
): string {
  seedRawEvents(fixture, [
    { type: 'workflow.start', ts: '2026-04-29T00:00:01.000Z' },
    { type: 'workflow.finish', ts: finishTs },
  ]);
  return finishTs;
}

/**
 * Force-overwrite the on-disk stub with a populated `SessionJson` (so
 * pre-flight B's `isPopulated` returns true). Bypasses the writer.
 */
function forcePopulated(fixture: SessionFixture): void {
  const stubPath = sessionJsonPath(
    fixture.repoRoot,
    fixture.projectName,
    fixture.sessionId,
  );
  const existing = readSessionJson(stubPath);
  if (existing === null) throw new Error('stub absent in forcePopulated');
  const populated: SessionJson = {
    ...existing,
    steps: [],
  };
  writeSessionJson(stubPath, populated);
}

// ===========================================================================
// 1. Registry presence
// ===========================================================================

describe('MEMORY_COMMANDS — registry includes backfill', () => {
  test('exposes `backfill` with a non-empty summary', () => {
    const names = MEMORY_COMMANDS.map((c) => c.name);
    expect(names).toContain('backfill');
    const entry = MEMORY_COMMANDS.find((c) => c.name === 'backfill');
    expect(entry).toBeDefined();
    expect(entry?.summary.length).toBeGreaterThan(0);
  });
});

// ===========================================================================
// 2-3. Dispatcher wiring
// ===========================================================================

describe('runMemoryWithRegistry — dispatcher wiring for backfill', () => {
  test('--help lists both check and backfill', async () => {
    await captureExit(() => runMemoryWithRegistry(['--help'], MEMORY_COMMANDS));
    expect(captured.stdout).toContain('check');
    expect(captured.stdout).toContain('backfill');
    expect(captured.stdout).toContain('Usage: gobbi memory');
  });

  test('backfill --help prints command-specific usage', async () => {
    await captureExit(() =>
      runMemoryWithRegistry(['backfill', '--help'], MEMORY_COMMANDS),
    );
    expect(captured.stdout).toContain('Usage: gobbi memory backfill');
    expect(captured.stdout).toContain('<session-id>');
    expect(captured.stdout).toContain('--project-name');
    expect(captured.stdout).toContain('--finished-at');
    expect(captured.stdout).toContain('--force');
    expect(captured.stdout).toContain('--json');
  });
});

// ===========================================================================
// 4. Happy path — stub-only session-id with events
// ===========================================================================

describe('runMemoryBackfill — happy path', () => {
  test('stub-only session-id with events: populates session.json + upserts project.json', async () => {
    const repoRoot = makeRepo();
    const projectName = 'gobbi';
    const sessionId = 'sess-happy';
    const fixture = makeSession(repoRoot, projectName, sessionId, 'happy task');
    seedStartEvent(fixture);

    await captureExit(() =>
      runMemoryBackfillWithOptions(
        [sessionId, '--project-name', projectName],
        { repoRoot },
      ),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('gobbi memory backfill');
    expect(captured.stdout).toContain(`session:      ${sessionId}`);
    expect(captured.stdout).toContain('wrote:        yes');

    const written = readSessionJson(
      sessionJsonPath(repoRoot, projectName, sessionId),
    );
    expect(written).not.toBeNull();
    expect(Array.isArray(written!.steps)).toBe(true);
    expect(written!.task).toBe('happy task');

    const project = readProjectJson(projectJsonPath(repoRoot, projectName));
    expect(project).not.toBeNull();
    expect(project!.sessions.map((s) => s.sessionId)).toContain(sessionId);
  });
});

// ===========================================================================
// 5. BACKFILL_NO_STUB
// ===========================================================================

describe('runMemoryBackfill — BACKFILL_NO_STUB', () => {
  test('--json with stub absent emits structured envelope, exits 1', async () => {
    const repoRoot = makeRepo();
    const projectName = 'gobbi';
    const sessionId = 'sess-no-stub';

    await captureExit(() =>
      runMemoryBackfillWithOptions(
        [sessionId, '--json', '--project-name', projectName],
        { repoRoot },
      ),
    );

    expect(captured.exitCode).toBe(1);
    const lines = captured.stderr.split('\n').filter((l) => l.length > 0);
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0] as string) as Record<string, unknown>;
    expect(parsed['status']).toBe('error');
    expect(parsed['code']).toBe('BACKFILL_NO_STUB');
    expect(typeof parsed['message']).toBe('string');
    expect(typeof parsed['path']).toBe('string');
    expect(captured.stdout).toBe('');
  });
});

// ===========================================================================
// 6. BACKFILL_NO_EVENTS
// ===========================================================================

describe('runMemoryBackfill — BACKFILL_NO_EVENTS', () => {
  test('stub present but per-session gobbi.db absent → exits 1', async () => {
    const repoRoot = makeRepo();
    const projectName = 'gobbi';
    const sessionId = 'sess-no-events';
    makeSession(repoRoot, projectName, sessionId);

    await captureExit(() =>
      runMemoryBackfillWithOptions(
        [sessionId, '--json', '--project-name', projectName],
        { repoRoot },
      ),
    );

    expect(captured.exitCode).toBe(1);
    const lines = captured.stderr.split('\n').filter((l) => l.length > 0);
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0] as string) as Record<string, unknown>;
    expect(parsed['status']).toBe('error');
    expect(parsed['code']).toBe('BACKFILL_NO_EVENTS');
    expect(typeof parsed['message']).toBe('string');
    expect(captured.stdout).toBe('');
  });
});

// ===========================================================================
// 7. BACKFILL_ALREADY_POPULATED without --force
// ===========================================================================

describe('runMemoryBackfill — BACKFILL_ALREADY_POPULATED', () => {
  test('stub already populated, no --force → exits 1', async () => {
    const repoRoot = makeRepo();
    const projectName = 'gobbi';
    const sessionId = 'sess-populated';
    const fixture = makeSession(repoRoot, projectName, sessionId);
    seedStartEvent(fixture);
    forcePopulated(fixture);

    await captureExit(() =>
      runMemoryBackfillWithOptions(
        [sessionId, '--json', '--project-name', projectName],
        { repoRoot },
      ),
    );

    expect(captured.exitCode).toBe(1);
    const lines = captured.stderr.split('\n').filter((l) => l.length > 0);
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0] as string) as Record<string, unknown>;
    expect(parsed['status']).toBe('error');
    expect(parsed['code']).toBe('BACKFILL_ALREADY_POPULATED');
    expect(typeof parsed['message']).toBe('string');
    expect(captured.stdout).toBe('');
  });
});

// ===========================================================================
// 8. --force overrides BACKFILL_ALREADY_POPULATED
// ===========================================================================

describe('runMemoryBackfill — --force overrides populated', () => {
  test('--force lets the writer overwrite a populated stub', async () => {
    const repoRoot = makeRepo();
    const projectName = 'gobbi';
    const sessionId = 'sess-force';
    const fixture = makeSession(repoRoot, projectName, sessionId, 'force task');
    seedStartEvent(fixture);
    forcePopulated(fixture);

    await captureExit(() =>
      runMemoryBackfillWithOptions(
        [sessionId, '--project-name', projectName, '--force'],
        { repoRoot },
      ),
    );

    expect(captured.exitCode).toBeNull();
    const written = readSessionJson(
      sessionJsonPath(repoRoot, projectName, sessionId),
    );
    expect(written).not.toBeNull();
    expect(Array.isArray(written!.steps)).toBe(true);
    expect(written!.task).toBe('force task');
  });
});

// ===========================================================================
// 9. BACKFILL_FAILED — writer throws
// ===========================================================================

describe('runMemoryBackfill — BACKFILL_FAILED envelope', () => {
  test('aggregator/writer throw surfaces as BACKFILL_FAILED, exit 1', async () => {
    const repoRoot = makeRepo();
    const projectName = 'gobbi';
    const sessionId = 'sess-fail';
    const fixture = makeSession(repoRoot, projectName, sessionId);
    seedStartEvent(fixture);

    // Force the writer to throw by pre-creating project.json as a
    // directory: the atomic temp+rename inside `writeProjectJson`
    // raises EISDIR on rename. Mirrors the precedent in
    // `workflow/__tests__/session-json-writer.test.ts:374-383`.
    const projectFile = projectJsonPath(repoRoot, projectName);
    mkdirSync(projectFile, { recursive: true });

    await captureExit(() =>
      runMemoryBackfillWithOptions(
        [sessionId, '--json', '--project-name', projectName],
        { repoRoot },
      ),
    );

    expect(captured.exitCode).toBe(1);
    const lines = captured.stderr.split('\n').filter((l) => l.length > 0);
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0] as string) as Record<string, unknown>;
    expect(parsed['status']).toBe('error');
    expect(parsed['code']).toBe('BACKFILL_FAILED');
    expect(typeof parsed['message']).toBe('string');
    // The failure surface is the writer call, not a single path.
    expect('path' in parsed).toBe(false);
  });
});

// ===========================================================================
// 10. PARSE_ARGS — missing positional
// ===========================================================================

describe('runMemoryBackfill — PARSE_ARGS', () => {
  test('missing positional <session-id> under --json exits 2', async () => {
    const repoRoot = makeRepo();

    await captureExit(() =>
      runMemoryBackfillWithOptions(['--json'], { repoRoot }),
    );

    expect(captured.exitCode).toBe(2);
    const lines = captured.stderr.split('\n').filter((l) => l.length > 0);
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0] as string) as Record<string, unknown>;
    expect(parsed['status']).toBe('error');
    expect(parsed['code']).toBe('PARSE_ARGS');
    expect(typeof parsed['message']).toBe('string');
    expect('path' in parsed).toBe(false);
  });
});

// ===========================================================================
// 11. --finished-at override threads through
// ===========================================================================

describe('runMemoryBackfill — --finished-at override', () => {
  test('--finished-at <ISO> overrides aggregator inference', async () => {
    const repoRoot = makeRepo();
    const projectName = 'gobbi';
    const sessionId = 'sess-finished-at';
    const fixture = makeSession(repoRoot, projectName, sessionId);
    seedStartEvent(fixture);

    const override = '2027-01-01T00:00:00.000Z';
    await captureExit(() =>
      runMemoryBackfillWithOptions(
        [
          sessionId,
          '--project-name',
          projectName,
          '--finished-at',
          override,
        ],
        { repoRoot },
      ),
    );

    expect(captured.exitCode).toBeNull();
    const written = readSessionJson(
      sessionJsonPath(repoRoot, projectName, sessionId),
    );
    expect(written!.finishedAt).toBe(override);
    const project = readProjectJson(projectJsonPath(repoRoot, projectName));
    expect(project!.sessions[0]!.finishedAt).toBe(override);
  });
});

// ===========================================================================
// 12. finishedAt-from-events (Project F3 lock)
// ===========================================================================

describe('runMemoryBackfill — finishedAt from workflow.finish event', () => {
  test('session with workflow.finish committed: backfill stamps finishedAt = event ts', async () => {
    const repoRoot = makeRepo();
    const projectName = 'gobbi';
    const sessionId = 'sess-finish-event';
    const fixture = makeSession(repoRoot, projectName, sessionId);
    const finishTs = '2026-05-01T00:00:00.000Z';
    seedStartAndFinish(fixture, finishTs);

    await captureExit(() =>
      runMemoryBackfillWithOptions(
        [sessionId, '--project-name', projectName],
        { repoRoot },
      ),
    );

    expect(captured.exitCode).toBeNull();
    const written = readSessionJson(
      sessionJsonPath(repoRoot, projectName, sessionId),
    );
    expect(written!.finishedAt).toBe(finishTs);
    const project = readProjectJson(projectJsonPath(repoRoot, projectName));
    expect(project!.sessions[0]!.finishedAt).toBe(finishTs);
  });
});

// ===========================================================================
// 13. --json shape
// ===========================================================================

describe('runMemoryBackfill — --json shape', () => {
  test('emits MemoryBackfillResult contract on a clean scratch repo', async () => {
    const repoRoot = makeRepo();
    const projectName = 'gobbi';
    const sessionId = 'sess-json';
    const fixture = makeSession(repoRoot, projectName, sessionId);
    seedStartEvent(fixture);

    let tick = 1_745_000_000_000;
    await captureExit(() =>
      runMemoryBackfillWithOptions(
        [sessionId, '--json', '--project-name', projectName],
        {
          repoRoot,
          now: () => {
            tick += 7;
            return tick;
          },
        },
      ),
    );

    expect(captured.exitCode).toBeNull();
    const trimmed = captured.stdout.trim();
    const parsed = JSON.parse(trimmed) as Record<string, unknown>;

    expect(parsed['sessionDir']).toBe(fixture.sessionDir);
    expect(parsed['sessionJsonPath']).toBe(
      sessionJsonPath(repoRoot, projectName, sessionId),
    );
    expect(parsed['projectJsonPath']).toBe(
      projectJsonPath(repoRoot, projectName),
    );
    expect(parsed['sessionId']).toBe(sessionId);
    expect(parsed['wrote']).toBe(true);
    expect(typeof parsed['elapsedMs']).toBe('number');
    expect((parsed['elapsedMs'] as number) >= 0).toBe(true);
  });
});

// ===========================================================================
// 14. Pure helper — backfillMemoryAt
// ===========================================================================

describe('backfillMemoryAt — pure-core', () => {
  test('returns structured result on happy path AND throws BackfillNoStubError on missing stub', async () => {
    const repoRoot = makeRepo();
    const projectName = 'gobbi';
    const sessionId = 'sess-pure';
    const fixture = makeSession(repoRoot, projectName, sessionId);
    seedStartEvent(fixture);

    const dbPath = join(fixture.sessionDir, 'gobbi.db');
    const store = new EventStore(dbPath);
    let result: MemoryBackfillResult;
    try {
      result = await backfillMemoryAt(
        fixture.sessionDir,
        store,
        undefined,
        false,
      );
    } finally {
      store.close();
    }

    expect(result.sessionDir).toBe(fixture.sessionDir);
    expect(result.sessionJsonPath).toBe(
      sessionJsonPath(repoRoot, projectName, sessionId),
    );
    expect(result.projectJsonPath).toBe(
      projectJsonPath(repoRoot, projectName),
    );
    expect(result.sessionId).toBe(sessionId);
    expect(result.wrote).toBe(true);
    expect(result.elapsedMs).toBeGreaterThanOrEqual(0);

    expect(captured.stdout).toBe('');
    expect(captured.stderr).toBe('');

    // Same pure-core surface, missing-stub branch — assert the typed
    // throw shape callers rely on.
    const otherSessionId = 'sess-pure-no-stub';
    const otherSessionDir = join(
      repoRoot,
      '.gobbi',
      'projects',
      projectName,
      'sessions',
      otherSessionId,
    );
    mkdirSync(otherSessionDir, { recursive: true });
    const otherStore = new EventStore(join(otherSessionDir, 'gobbi.db'));
    try {
      await expect(
        backfillMemoryAt(otherSessionDir, otherStore, undefined, false),
      ).rejects.toBeInstanceOf(BackfillNoStubError);
    } finally {
      otherStore.close();
    }
    expect(
      existsSync(sessionJsonPath(repoRoot, projectName, otherSessionId)),
    ).toBe(false);
  });
});
