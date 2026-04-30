/**
 * Unit tests for `gobbi maintenance verify-state-projections` — registry
 * wiring, dispatcher routing, pre-flight error envelopes, happy + drift
 * paths, `--json` contract, and idempotency.
 *
 * Test surface (9) per PR-CFM-C ideation §5.6:
 *
 *   1. Subcommand registry lists `verify-state-projections`.
 *   2. Dispatcher routes `--help` and the new name correctly.
 *   3. Happy path: scratch repo with no divergences exits 0.
 *   4. Drift detected: scratch repo with hand-edited project.json exits 1
 *      with divergence.
 *   5. Missing state.db exits 1 with `DB_MISSING` envelope under `--json`.
 *   6. Missing project.json exits 1 with `PROJECT_MISSING` envelope.
 *   7. `parseArgs` failure exits 2 with `PARSE_ARGS` envelope.
 *   8. `--json` shape matches `VerifyStateProjectionsResult` contract.
 *   9. Idempotency: re-running on the same scratch produces deterministic
 *      result (modulo `elapsedMs`).
 *
 * Tests build a scratch state.db with raw SQL (mirroring
 * `wipe-legacy-sessions.test.ts::makeStateDb`) plus a project.json on
 * disk via `writeProjectJson`. The reducer is the real `reduce` for
 * non-throwing paths.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { Database } from 'bun:sqlite';
import { existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  MAINTENANCE_COMMANDS,
  runMaintenanceWithRegistry,
} from '../../maintenance.js';
import {
  runVerifyStateProjectionsWithOptions,
  verifyStateProjectionsAt,
  type VerifyStateProjectionsResult,
} from '../verify-state-projections.js';
import {
  writeProjectJson,
  type ProjectJson,
  type ProjectJsonSession,
} from '../../../lib/json-memory.js';
import { reduce } from '../../../workflow/reducer.js';

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

function makeRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-verify-state-'));
  scratchDirs.push(dir);
  return dir;
}

interface SeedEvent {
  readonly sessionId: string;
  readonly projectId: string;
  readonly type: string;
  readonly step?: string | null;
  readonly data?: Record<string, unknown>;
  readonly ts?: string;
}

/**
 * Build a v5-shape state.db at `<repo>/.gobbi/state.db` and seed it with
 * the supplied events. Mirrors `wipe-legacy-sessions.test.ts::makeStateDb`
 * with the addition of `step` + `data` columns so we can drive the
 * reducer through a real workflow sequence.
 *
 * The EventStore opening this file later will idempotently upgrade the
 * schema to v7 via `ensureSchemaV5/V6/V7`, so v5 columns are sufficient.
 */
function seedStateDb(repo: string, rows: readonly SeedEvent[]): string {
  const gobbiDir = join(repo, '.gobbi');
  mkdirSync(gobbiDir, { recursive: true });
  const dbPath = join(gobbiDir, 'state.db');
  const db = new Database(dbPath, { strict: true });
  try {
    db.run(
      `CREATE TABLE events (
         seq INTEGER PRIMARY KEY,
         ts TEXT NOT NULL,
         schema_version INTEGER NOT NULL,
         type TEXT NOT NULL,
         step TEXT,
         data TEXT NOT NULL DEFAULT '{}',
         actor TEXT NOT NULL,
         parent_seq INTEGER,
         idempotency_key TEXT NOT NULL UNIQUE,
         session_id TEXT,
         project_id TEXT
       )`,
    );
    const stmt = db.query(
      `INSERT INTO events (ts, schema_version, type, step, data, actor, idempotency_key, session_id, project_id)
       VALUES ($ts, 5, $type, $step, $data, 'test', $key, $sessionId, $projectId)`,
    );
    let seq = 0;
    for (const row of rows) {
      seq += 1;
      const data = row.data ?? {
        sessionId: row.sessionId,
        timestamp: row.ts ?? '2026-04-29T10:00:00.000Z',
      };
      stmt.run({
        ts: row.ts ?? '2026-04-29T10:00:00.000Z',
        type: row.type,
        step: row.step ?? null,
        data: JSON.stringify(data),
        key: `${row.sessionId}:${seq}:${row.type}`,
        sessionId: row.sessionId,
        projectId: row.projectId,
      });
    }
  } finally {
    db.close();
  }
  return dbPath;
}

/**
 * Build a complete `idle → done` event stream for a single session,
 * matching the reducer's accepted transitions. Mirrors `buildDoneStream`
 * in `lib/__tests__/memory-projection-diff.test.ts` so the diff library
 * exercises the same fixture shape on both sides of the boundary.
 */
function buildDoneEvents(sessionId: string, projectId: string): SeedEvent[] {
  return [
    { sessionId, projectId, type: 'workflow.start' },
    {
      sessionId,
      projectId,
      type: 'workflow.step.exit',
      step: 'ideation',
      data: { step: 'ideation' },
    },
    {
      sessionId,
      projectId,
      type: 'workflow.step.exit',
      step: 'planning',
      data: { step: 'planning' },
    },
    {
      sessionId,
      projectId,
      type: 'workflow.step.exit',
      step: 'execution',
      data: { step: 'execution' },
    },
    {
      sessionId,
      projectId,
      type: 'decision.eval.verdict',
      step: 'execution_eval',
      data: { verdict: 'pass' },
    },
    {
      sessionId,
      projectId,
      type: 'workflow.step.exit',
      step: 'memorization',
      data: { step: 'memorization' },
    },
    {
      sessionId,
      projectId,
      type: 'workflow.finish',
      ts: '2026-04-29T11:00:00.000Z',
      data: {},
    },
  ];
}

/**
 * Write a `project.json` for the supplied repo + project name with the
 * given session rows. Returns the path the file was written to so tests
 * can manipulate it directly.
 */
function seedProjectJson(
  repo: string,
  projectName: string,
  sessions: readonly ProjectJsonSession[],
): string {
  const projectDir = join(repo, '.gobbi', 'projects', projectName);
  mkdirSync(projectDir, { recursive: true });
  const filePath = join(projectDir, 'project.json');
  const value: ProjectJson = {
    schemaVersion: 1,
    projectName,
    projectId: projectName,
    sessions,
    gotchas: [],
    decisions: [],
    learnings: [],
  };
  writeProjectJson(filePath, value);
  return filePath;
}

// ===========================================================================
// 1. Registry presence
// ===========================================================================

describe('MAINTENANCE_COMMANDS — registry includes verify-state-projections', () => {
  test('exposes `verify-state-projections` with a non-empty summary', () => {
    const names = MAINTENANCE_COMMANDS.map((c) => c.name);
    expect(names).toContain('verify-state-projections');
    const entry = MAINTENANCE_COMMANDS.find(
      (c) => c.name === 'verify-state-projections',
    );
    expect(entry).toBeDefined();
    expect(entry?.summary.length).toBeGreaterThan(0);
  });
});

// ===========================================================================
// 2. Dispatcher wiring
// ===========================================================================

describe('runMaintenanceWithRegistry — verify-state-projections wiring', () => {
  test('--help lists verify-state-projections alongside the other entries', async () => {
    await captureExit(() =>
      runMaintenanceWithRegistry(['--help'], MAINTENANCE_COMMANDS),
    );
    expect(captured.stdout).toContain('verify-state-projections');
    expect(captured.stdout).toContain('migrate-state-db');
    expect(captured.stdout).toContain('wipe-legacy-sessions');
  });

  test('verify-state-projections --help prints command-specific usage', async () => {
    await captureExit(() =>
      runMaintenanceWithRegistry(
        ['verify-state-projections', '--help'],
        MAINTENANCE_COMMANDS,
      ),
    );
    expect(captured.stdout).toContain(
      'Usage: gobbi maintenance verify-state-projections',
    );
    expect(captured.stdout).toContain('--db');
    expect(captured.stdout).toContain('--project');
    expect(captured.stdout).toContain('--project-name');
    expect(captured.stdout).toContain('--json');
    // The pre-pivot caveat must surface in USAGE per Project eval F2.
    expect(captured.stdout).toContain(
      'sessions predating the JSON memory pivot may appear as row-missing',
    );
  });
});

// ===========================================================================
// 3. Happy path — no divergences
// ===========================================================================

describe('runVerifyStateProjections — happy path', () => {
  test('scratch repo with matching project.json exits 0 with no divergences', async () => {
    const repo = makeRepo();
    const projectName = 'gobbi';
    const sessionId = 'sess-happy';

    seedStateDb(repo, buildDoneEvents(sessionId, projectName));
    seedProjectJson(repo, projectName, [
      {
        sessionId,
        createdAt: '2026-04-29T10:00:00.000Z',
        finishedAt: '2026-04-29T11:00:00.000Z',
        task: 'demo',
      },
    ]);

    await captureExit(() =>
      runVerifyStateProjectionsWithOptions(
        ['--project-name', projectName],
        { repoRoot: repo },
      ),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('divergences: 0');
    expect(captured.stdout).toContain('sessions checked: 1');
  });
});

// ===========================================================================
// 4. Drift detected — exits 1 with divergence
// ===========================================================================

describe('runVerifyStateProjections — drift detected', () => {
  test('scratch repo with hand-edited project.json (finishedAt: null) exits 1', async () => {
    const repo = makeRepo();
    const projectName = 'gobbi';
    const sessionId = 'sess-drift';

    seedStateDb(repo, buildDoneEvents(sessionId, projectName));
    // Hand-edit: workflow.finish committed but row finishedAt is null.
    seedProjectJson(repo, projectName, [
      {
        sessionId,
        createdAt: '2026-04-29T10:00:00.000Z',
        finishedAt: null,
        task: 'demo',
      },
    ]);

    await captureExit(() =>
      runVerifyStateProjectionsWithOptions(
        ['--project-name', projectName],
        { repoRoot: repo },
      ),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stdout).toContain('divergences: 1');
    expect(captured.stdout).toContain(sessionId);
    expect(captured.stdout).toContain('finishedAt');
  });
});

// ===========================================================================
// 5. Missing state.db — DB_MISSING under --json
// ===========================================================================

describe('runVerifyStateProjections — DB_MISSING', () => {
  test('--json with missing state.db emits structured envelope, exits 1', async () => {
    const repo = makeRepo();
    const projectName = 'gobbi';
    // project.json present, state.db absent.
    seedProjectJson(repo, projectName, []);
    const missingDb = join(repo, '.gobbi', 'state.db');
    expect(existsSync(missingDb)).toBe(false);

    await captureExit(() =>
      runVerifyStateProjectionsWithOptions(
        ['--json', '--project-name', projectName],
        { repoRoot: repo },
      ),
    );

    expect(captured.exitCode).toBe(1);
    const lines = captured.stderr.split('\n').filter((l) => l.length > 0);
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0] as string) as Record<string, unknown>;
    expect(parsed['status']).toBe('error');
    expect(parsed['code']).toBe('DB_MISSING');
    expect(typeof parsed['message']).toBe('string');
    expect(parsed['path']).toBe(missingDb);
    // stdout stays clean on the failure path.
    expect(captured.stdout).toBe('');
  });
});

// ===========================================================================
// 6. Missing project.json — PROJECT_MISSING under --json
// ===========================================================================

describe('runVerifyStateProjections — PROJECT_MISSING', () => {
  test('--json with missing project.json emits structured envelope, exits 1', async () => {
    const repo = makeRepo();
    const projectName = 'gobbi';
    // state.db present (empty events), project.json absent.
    seedStateDb(repo, []);
    const missingProject = join(
      repo,
      '.gobbi',
      'projects',
      projectName,
      'project.json',
    );
    expect(existsSync(missingProject)).toBe(false);

    await captureExit(() =>
      runVerifyStateProjectionsWithOptions(
        ['--json', '--project-name', projectName],
        { repoRoot: repo },
      ),
    );

    expect(captured.exitCode).toBe(1);
    const lines = captured.stderr.split('\n').filter((l) => l.length > 0);
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0] as string) as Record<string, unknown>;
    expect(parsed['status']).toBe('error');
    expect(parsed['code']).toBe('PROJECT_MISSING');
    expect(typeof parsed['message']).toBe('string');
    expect(parsed['path']).toBe(missingProject);
    expect(captured.stdout).toBe('');
  });
});

// ===========================================================================
// 7. parseArgs failure — PARSE_ARGS exits 2
// ===========================================================================

describe('runVerifyStateProjections — PARSE_ARGS', () => {
  test('unknown flag under --json emits envelope without USAGE, exits 2', async () => {
    const repo = makeRepo();

    await captureExit(() =>
      runVerifyStateProjectionsWithOptions(
        ['--json', '--no-such-flag'],
        { repoRoot: repo },
      ),
    );

    expect(captured.exitCode).toBe(2);
    // The JSON failure path must NOT dump the prose USAGE block.
    expect(captured.stderr).not.toContain(
      'Usage: gobbi maintenance verify-state-projections',
    );
    const lines = captured.stderr.split('\n').filter((l) => l.length > 0);
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0] as string) as Record<string, unknown>;
    expect(parsed['status']).toBe('error');
    expect(parsed['code']).toBe('PARSE_ARGS');
    expect(typeof parsed['message']).toBe('string');
    // path is not yet resolved at parseArgs failure time — must be absent.
    expect('path' in parsed).toBe(false);
  });
});

// ===========================================================================
// 8. --json shape contract
// ===========================================================================

describe('runVerifyStateProjections — --json shape', () => {
  test('emits VerifyStateProjectionsResult contract on a clean scratch repo', async () => {
    const repo = makeRepo();
    const projectName = 'gobbi';
    const sessionId = 'sess-json';

    const dbPath = seedStateDb(repo, buildDoneEvents(sessionId, projectName));
    const projectJsonFile = seedProjectJson(repo, projectName, [
      {
        sessionId,
        createdAt: '2026-04-29T10:00:00.000Z',
        finishedAt: '2026-04-29T11:00:00.000Z',
        task: 'demo',
      },
    ]);

    // Deterministic clock so elapsedMs is predictable.
    let tick = 1_745_000_000_000;
    await captureExit(() =>
      runVerifyStateProjectionsWithOptions(
        ['--json', '--project-name', projectName],
        {
          repoRoot: repo,
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

    expect(parsed['stateDbPath']).toBe(dbPath);
    expect(parsed['projectJsonPath']).toBe(projectJsonFile);
    expect(parsed['sessionsChecked']).toBe(1);
    expect(Array.isArray(parsed['divergences'])).toBe(true);
    expect((parsed['divergences'] as readonly unknown[]).length).toBe(0);
    expect(typeof parsed['elapsedMs']).toBe('number');
    expect((parsed['elapsedMs'] as number) >= 0).toBe(true);
  });
});

// ===========================================================================
// 9. Idempotency — re-running produces the same result (modulo elapsedMs)
// ===========================================================================

describe('runVerifyStateProjections — idempotency', () => {
  test('re-running on the same scratch produces identical divergences', async () => {
    const repo = makeRepo();
    const projectName = 'gobbi';
    const sessionId = 'sess-idem';

    seedStateDb(repo, buildDoneEvents(sessionId, projectName));
    seedProjectJson(repo, projectName, [
      {
        sessionId,
        createdAt: '2026-04-29T10:00:00.000Z',
        // Force one divergence — finishedAt null when finish event committed.
        finishedAt: null,
        task: 'demo',
      },
    ]);

    // First run.
    await captureExit(() =>
      runVerifyStateProjectionsWithOptions(
        ['--json', '--project-name', projectName],
        { repoRoot: repo },
      ),
    );
    expect(captured.exitCode).toBe(1);
    const first = JSON.parse(captured.stdout.trim()) as {
      readonly stateDbPath: string;
      readonly projectJsonPath: string | null;
      readonly sessionsChecked: number;
      readonly divergences: readonly unknown[];
      readonly elapsedMs: number;
    };

    // Reset capture between runs.
    captured.stdout = '';
    captured.stderr = '';
    captured.exitCode = null as number | null;

    // Second run on the same scratch.
    await captureExit(() =>
      runVerifyStateProjectionsWithOptions(
        ['--json', '--project-name', projectName],
        { repoRoot: repo },
      ),
    );
    expect(captured.exitCode).toBe(1);
    const second = JSON.parse(captured.stdout.trim()) as typeof first;

    // Everything except elapsedMs must match exactly.
    expect(second.stateDbPath).toBe(first.stateDbPath);
    expect(second.projectJsonPath).toBe(first.projectJsonPath);
    expect(second.sessionsChecked).toBe(first.sessionsChecked);
    expect(second.divergences).toEqual(first.divergences);
  });
});

// ===========================================================================
// Pure helper — verifyStateProjectionsAt
// ===========================================================================

describe('verifyStateProjectionsAt', () => {
  test('returns the structured result without writing to stdout', async () => {
    const repo = makeRepo();
    const projectName = 'gobbi';
    const sessionId = 'sess-pure';

    const dbPath = seedStateDb(repo, buildDoneEvents(sessionId, projectName));
    const projectJsonFile = seedProjectJson(repo, projectName, [
      {
        sessionId,
        createdAt: '2026-04-29T10:00:00.000Z',
        finishedAt: '2026-04-29T11:00:00.000Z',
        task: 'demo',
      },
    ]);

    const result: VerifyStateProjectionsResult = verifyStateProjectionsAt(
      dbPath,
      projectJsonFile,
      reduce,
    );

    expect(result.stateDbPath).toBe(dbPath);
    expect(result.projectJsonPath).toBe(projectJsonFile);
    expect(result.sessionsChecked).toBe(1);
    expect(result.divergences).toEqual([]);
    expect(result.elapsedMs).toBeGreaterThanOrEqual(0);

    // No stdout/stderr from the pure helper itself.
    expect(captured.stdout).toBe('');
    expect(captured.stderr).toBe('');
  });
});
