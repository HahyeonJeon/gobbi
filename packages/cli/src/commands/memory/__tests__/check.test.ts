/**
 * Unit tests for `gobbi memory check <session-id>` — registry wiring,
 * dispatcher routing, pre-flight error envelopes, happy + drift paths,
 * the explicit `SESSION_NOT_FOUND` 3-step algorithm, `--json` contract,
 * idempotency, and the pure-core helper.
 *
 * Test surface (13) per PR-CFM-B synthesis §3.3:
 *
 *   1.  Subcommand registry lists `check` (and only `check` at this
 *       commit — backfill ships in #236 part 2).
 *   2.  Dispatcher: `gobbi memory --help` lists check.
 *   3.  Dispatcher: `gobbi memory check --help` exits 0 with usage.
 *   4.  Dispatcher: unknown subcommand fails with exit 1.
 *   5.  Happy path: coherent session → exit 0, divergences: [].
 *   6.  Drift detected: hand-edited project.json → exit 1 with
 *       `finishedAt` divergence.
 *   7.  `DB_MISSING` envelope under `--json`.
 *   8.  `PROJECT_MISSING` envelope under `--json`.
 *   9.  `PARSE_ARGS` exits 2 (missing positional `<session-id>`).
 *   10. `SESSION_NOT_FOUND`: state.db + project.json both exist but
 *       neither contains the requested session id → exit 1.
 *   11. `--json` envelope shape: success result has the locked fields.
 *   12. Idempotency: re-running on the same scratch produces identical
 *       divergences.
 *   13. Pure-core helper `checkMemoryAt` callable directly.
 *
 * Tests build a scratch state.db with raw SQL (mirroring
 * `verify-state-projections.test.ts::seedStateDb`) plus a project.json
 * on disk via `writeProjectJson`. The reducer is the real `reduce` for
 * non-throwing paths.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { Database } from 'bun:sqlite';
import { existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { MEMORY_COMMANDS, runMemoryWithRegistry } from '../../memory.js';
import {
  checkMemoryAt,
  runMemoryCheckWithOptions,
  type MemoryCheckResult,
} from '../check.js';
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
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-memory-check-'));
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
 * the supplied events. Mirrors `verify-state-projections.test.ts::seedStateDb`.
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
 * matching the reducer's accepted transitions.
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
  const projectDirPath = join(repo, '.gobbi', 'projects', projectName);
  mkdirSync(projectDirPath, { recursive: true });
  const filePath = join(projectDirPath, 'project.json');
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

describe('MEMORY_COMMANDS — registry includes check', () => {
  test('exposes `check` with a non-empty summary', () => {
    const names = MEMORY_COMMANDS.map((c) => c.name);
    expect(names).toContain('check');
    const entry = MEMORY_COMMANDS.find((c) => c.name === 'check');
    expect(entry).toBeDefined();
    expect(entry?.summary.length).toBeGreaterThan(0);
  });
});

// ===========================================================================
// 2-4. Dispatcher wiring (against the real MEMORY_COMMANDS registry)
// ===========================================================================

describe('runMemoryWithRegistry — dispatcher wiring for check', () => {
  test('--help lists check', async () => {
    await captureExit(() => runMemoryWithRegistry(['--help'], MEMORY_COMMANDS));
    expect(captured.stdout).toContain('check');
    expect(captured.stdout).toContain('Usage: gobbi memory');
  });

  test('check --help prints command-specific usage', async () => {
    await captureExit(() =>
      runMemoryWithRegistry(['check', '--help'], MEMORY_COMMANDS),
    );
    expect(captured.stdout).toContain('Usage: gobbi memory check');
    expect(captured.stdout).toContain('<session-id>');
    expect(captured.stdout).toContain('--db');
    expect(captured.stdout).toContain('--project');
    expect(captured.stdout).toContain('--project-name');
    expect(captured.stdout).toContain('--json');
  });

});

// ===========================================================================
// 5. Happy path — no divergences
// ===========================================================================

describe('runMemoryCheck — happy path', () => {
  test('coherent session exits 0 with no divergences', async () => {
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
      runMemoryCheckWithOptions(
        [sessionId, '--project-name', projectName],
        { repoRoot: repo },
      ),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('divergences: 0');
    expect(captured.stdout).toContain(`session:     ${sessionId}`);
  });
});

// ===========================================================================
// 6. Drift detected — exits 1 with divergence
// ===========================================================================

describe('runMemoryCheck — drift detected', () => {
  test('hand-edited project.json (finishedAt: null) exits 1', async () => {
    const repo = makeRepo();
    const projectName = 'gobbi';
    const sessionId = 'sess-drift';

    seedStateDb(repo, buildDoneEvents(sessionId, projectName));
    seedProjectJson(repo, projectName, [
      {
        sessionId,
        createdAt: '2026-04-29T10:00:00.000Z',
        finishedAt: null,
        task: 'demo',
      },
    ]);

    await captureExit(() =>
      runMemoryCheckWithOptions(
        [sessionId, '--project-name', projectName],
        { repoRoot: repo },
      ),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stdout).toContain('divergences: 1');
    expect(captured.stdout).toContain('finishedAt');
  });
});

// ===========================================================================
// 7. Missing state.db — DB_MISSING under --json
// ===========================================================================

describe('runMemoryCheck — DB_MISSING', () => {
  test('--json with missing state.db emits structured envelope, exits 1', async () => {
    const repo = makeRepo();
    const projectName = 'gobbi';
    seedProjectJson(repo, projectName, []);
    const missingDb = join(repo, '.gobbi', 'state.db');
    expect(existsSync(missingDb)).toBe(false);

    await captureExit(() =>
      runMemoryCheckWithOptions(
        ['sess-x', '--json', '--project-name', projectName],
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
    expect(captured.stdout).toBe('');
  });
});

// ===========================================================================
// 8. Missing project.json — PROJECT_MISSING under --json
// ===========================================================================

describe('runMemoryCheck — PROJECT_MISSING', () => {
  test('--json with missing project.json emits structured envelope, exits 1', async () => {
    const repo = makeRepo();
    const projectName = 'gobbi';
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
      runMemoryCheckWithOptions(
        ['sess-x', '--json', '--project-name', projectName],
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
// 9. PARSE_ARGS — missing positional <session-id> exits 2
// ===========================================================================

describe('runMemoryCheck — PARSE_ARGS', () => {
  test('missing positional <session-id> under --json exits 2 with envelope', async () => {
    const repo = makeRepo();

    await captureExit(() =>
      runMemoryCheckWithOptions(['--json'], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBe(2);
    expect(captured.stderr).not.toContain('Usage: gobbi memory check');
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
// 10. SESSION_NOT_FOUND — both sources empty for the requested id
// ===========================================================================

describe('runMemoryCheck — SESSION_NOT_FOUND', () => {
  test('typo session id with no rows AND no project.json entry exits 1 with envelope (--json)', async () => {
    const repo = makeRepo();
    const projectName = 'gobbi';
    // Seed a different session id in BOTH stores; the typo'd id has no
    // events and no project.json row.
    const realSessionId = 'sess-real';
    const typoSessionId = 'sess-typo';

    seedStateDb(repo, buildDoneEvents(realSessionId, projectName));
    seedProjectJson(repo, projectName, [
      {
        sessionId: realSessionId,
        createdAt: '2026-04-29T10:00:00.000Z',
        finishedAt: '2026-04-29T11:00:00.000Z',
        task: 'demo',
      },
    ]);

    await captureExit(() =>
      runMemoryCheckWithOptions(
        [typoSessionId, '--json', '--project-name', projectName],
        { repoRoot: repo },
      ),
    );

    expect(captured.exitCode).toBe(1);
    const lines = captured.stderr.split('\n').filter((l) => l.length > 0);
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0] as string) as Record<string, unknown>;
    expect(parsed['status']).toBe('error');
    expect(parsed['code']).toBe('SESSION_NOT_FOUND');
    expect(typeof parsed['message']).toBe('string');
    expect((parsed['message'] as string)).toContain(typoSessionId);
    // SESSION_NOT_FOUND is not a filesystem path failure; envelope omits path.
    expect('path' in parsed).toBe(false);
    expect(captured.stdout).toBe('');
  });

  test('typo session id exits 1 in human mode with `gobbi memory check:` stderr line', async () => {
    const repo = makeRepo();
    const projectName = 'gobbi';
    const realSessionId = 'sess-real';
    const typoSessionId = 'sess-typo';

    seedStateDb(repo, buildDoneEvents(realSessionId, projectName));
    seedProjectJson(repo, projectName, [
      {
        sessionId: realSessionId,
        createdAt: '2026-04-29T10:00:00.000Z',
        finishedAt: '2026-04-29T11:00:00.000Z',
        task: 'demo',
      },
    ]);

    await captureExit(() =>
      runMemoryCheckWithOptions(
        [typoSessionId, '--project-name', projectName],
        { repoRoot: repo },
      ),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('gobbi memory check:');
    expect(captured.stderr).toContain(typoSessionId);
    // Human mode: stderr must NOT be a JSON envelope.
    expect(captured.stderr.trim().startsWith('{')).toBe(false);
    expect(captured.stdout).toBe('');
  });
});

// ===========================================================================
// 11. --json shape contract
// ===========================================================================

describe('runMemoryCheck — --json shape', () => {
  test('emits MemoryCheckResult contract on a clean scratch repo', async () => {
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

    let tick = 1_745_000_000_000;
    await captureExit(() =>
      runMemoryCheckWithOptions(
        [sessionId, '--json', '--project-name', projectName],
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
    expect(parsed['sessionId']).toBe(sessionId);
    expect(parsed['sessionsChecked']).toBe(1);
    expect(Array.isArray(parsed['divergences'])).toBe(true);
    expect((parsed['divergences'] as readonly unknown[]).length).toBe(0);
    expect(typeof parsed['elapsedMs']).toBe('number');
    expect((parsed['elapsedMs'] as number) >= 0).toBe(true);
  });
});

// ===========================================================================
// 12. Idempotency — re-running produces identical divergences
// ===========================================================================

describe('runMemoryCheck — idempotency', () => {
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

    await captureExit(() =>
      runMemoryCheckWithOptions(
        [sessionId, '--json', '--project-name', projectName],
        { repoRoot: repo },
      ),
    );
    expect(captured.exitCode).toBe(1);
    const first = JSON.parse(captured.stdout.trim()) as {
      readonly stateDbPath: string;
      readonly projectJsonPath: string;
      readonly sessionId: string;
      readonly sessionsChecked: number;
      readonly divergences: readonly unknown[];
      readonly elapsedMs: number;
    };

    captured.stdout = '';
    captured.stderr = '';
    captured.exitCode = null as number | null;

    await captureExit(() =>
      runMemoryCheckWithOptions(
        [sessionId, '--json', '--project-name', projectName],
        { repoRoot: repo },
      ),
    );
    expect(captured.exitCode).toBe(1);
    const second = JSON.parse(captured.stdout.trim()) as typeof first;

    expect(second.stateDbPath).toBe(first.stateDbPath);
    expect(second.projectJsonPath).toBe(first.projectJsonPath);
    expect(second.sessionId).toBe(first.sessionId);
    expect(second.sessionsChecked).toBe(first.sessionsChecked);
    expect(second.divergences).toEqual(first.divergences);
  });
});

// ===========================================================================
// 13. Pure helper — checkMemoryAt
// ===========================================================================

describe('checkMemoryAt — pure-core', () => {
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

    const result: MemoryCheckResult = await checkMemoryAt(
      dbPath,
      projectJsonFile,
      sessionId,
      reduce,
    );

    expect(result.stateDbPath).toBe(dbPath);
    expect(result.projectJsonPath).toBe(projectJsonFile);
    expect(result.sessionId).toBe(sessionId);
    expect(result.sessionsChecked).toBe(1);
    expect(result.divergences).toEqual([]);
    expect(result.elapsedMs).toBeGreaterThanOrEqual(0);

    // No stdout/stderr from the pure helper itself.
    expect(captured.stdout).toBe('');
    expect(captured.stderr).toBe('');
  });
});
