/**
 * Unit tests for `gobbi workflow init` — idempotent session initialisation.
 *
 * Coverage (PR-FIN-2a-ii T-2a.8.5 — JSON memory pivot):
 *   - Fresh init writes `session.json` (NOT `metadata.json`) carrying exactly
 *     the 6 required-at-all-stages fields per the ideation lock
 *     (`schemaVersion`, `sessionId`, `projectId`, `createdAt`,
 *     `gobbiVersion`, `task`) plus `finishedAt: null`. No legacy
 *     `metadata.json` is written.
 *   - Fresh init opens `gobbi.db` and emits `workflow.start` +
 *     `workflow.eval.decide` atomically.
 *   - Re-running against an existing directory is a silent no-op.
 *   - Malformed existing `session.json` exits 1.
 *   - Mismatched `--project` flag still exits 2 (compared against the
 *     stamped `session.json.projectId`).
 *   - The CLI flags `--task / --eval-ideation / --eval-planning / --context`
 *     reach the expected destinations: `task` lands on `session.json.task`;
 *     the eval booleans drive the `workflow.eval.decide` event payload but
 *     are NOT carried into session.json (ideation lock 5 — minimal
 *     carry-forward).
 *
 * Tests use the `runInitWithOptions({ repoRoot })` test hook so we never
 * touch the actual checkout's `.gobbi/` tree.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';

import { EventStore } from '../../../workflow/store.js';
import { runInitWithOptions, resolveSessionId } from '../init.js';
import { readSessionJson, sessionJsonPath } from '../../../lib/json-memory.js';
import { sessionDir as sessionDirForProject } from '../../../lib/workspace-paths.js';

// ---------------------------------------------------------------------------
// stdout/stderr capture + process.exit trap
// ---------------------------------------------------------------------------

let captured: { stdout: string; stderr: string; exitCode: number | null };
let origStdoutWrite: typeof process.stdout.write;
let origStderrWrite: typeof process.stderr.write;
let origExit: typeof process.exit;

class ExitCalled extends Error {
  constructor(readonly code: number) {
    super(`process.exit(${code})`);
  }
}

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
// Per-test scratch repo (clean slate per test).
// ---------------------------------------------------------------------------

const scratchDirs: string[] = [];
let origSessionIdEnv: string | undefined;

function makeScratchRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-init-test-'));
  scratchDirs.push(dir);
  return dir;
}

beforeEach(() => {
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
        // best-effort
      }
    }
  }
});

// ---------------------------------------------------------------------------
// resolveSessionId — unit level
// ---------------------------------------------------------------------------

describe('resolveSessionId', () => {
  test('returns the explicit override when provided', () => {
    expect(resolveSessionId('explicit-id')).toBe('explicit-id');
  });

  test('reads CLAUDE_SESSION_ID when no override', () => {
    process.env['CLAUDE_SESSION_ID'] = 'env-id';
    expect(resolveSessionId(undefined)).toBe('env-id');
    delete process.env['CLAUDE_SESSION_ID'];
  });

  test('flag override takes priority over env', () => {
    process.env['CLAUDE_SESSION_ID'] = 'env-id';
    try {
      expect(resolveSessionId('flag-wins')).toBe('flag-wins');
    } finally {
      delete process.env['CLAUDE_SESSION_ID'];
    }
  });

  test('exits 2 with remediation when neither override nor env', async () => {
    delete process.env['CLAUDE_SESSION_ID'];
    await captureExit(async () => {
      // Wrap in a promise so the captureExit harness intercepts the
      // ExitCalled throw thrown inside `process.exit`.
      resolveSessionId(undefined);
    });
    expect(captured.exitCode).toBe(2);
    expect(captured.stderr).toContain('cannot resolve session id');
    expect(captured.stderr).toContain('--session-id');
    expect(captured.stderr).toContain('CLAUDE_SESSION_ID');
    // Target-state §6.3: name the SessionStart hook + $CLAUDE_ENV_FILE
    // mechanism so users have a concrete next step.
    expect(captured.stderr).toContain('SessionStart hook');
    expect(captured.stderr).toContain('gobbi hook session-start');
    expect(captured.stderr).toContain('$CLAUDE_ENV_FILE');
  });
});

// ---------------------------------------------------------------------------
// Fresh init happy path — session.json shape (T-2a.8.5)
// ---------------------------------------------------------------------------

describe('runInit — fresh session (session.json)', () => {
  test('writes session.json with schema v1 and exactly the 6 required fields + finishedAt', async () => {
    const repo = makeScratchRepo();
    await captureExit(() =>
      runInitWithOptions(
        [
          '--session-id',
          'fresh-happy',
          '--task',
          'demo task',
          '--eval-ideation',
          '--context',
          'ctx line',
        ],
        { repoRoot: repo },
      ),
    );
    expect(captured.exitCode).toBeNull();

    const sessionPath = sessionJsonPath(repo, basename(repo), 'fresh-happy');
    const session = readSessionJson(sessionPath);
    expect(session).not.toBeNull();
    if (session === null) return;

    // The 6 required-at-all-stages fields per ideation lock + finishedAt:null.
    expect(session.schemaVersion).toBe(1);
    expect(session.sessionId).toBe('fresh-happy');
    expect(session.projectId).toBe(basename(repo));
    expect(session.task).toBe('demo task');
    expect(session.finishedAt).toBeNull();
    expect(typeof session.createdAt).toBe('string');
    expect(session.createdAt.length).toBeGreaterThan(0);
    expect(typeof session.gobbiVersion).toBe('string');
    expect(session.gobbiVersion.length).toBeGreaterThan(0);

    // `steps` is absent in the stub (lock 43 — readers infer "stub" from the
    // missing `steps` field; no separate `status` discriminant).
    expect(session.steps).toBeUndefined();

    // The init-only fields from previous metadata.json — `evalIdeation`,
    // `evalPlanning`, `context`, `projectRoot`, `techStack`,
    // `configSnapshot` — are intentionally not on session.json (ideation
    // lock 5 — minimal carry-forward, only `task`).
    const raw = JSON.parse(readFileSync(sessionPath, 'utf8')) as Record<
      string,
      unknown
    >;
    expect(raw['configSnapshot']).toBeUndefined();
    expect(raw['projectRoot']).toBeUndefined();
    expect(raw['techStack']).toBeUndefined();
  });

  test('NO legacy metadata.json is written', async () => {
    const repo = makeScratchRepo();
    await captureExit(() =>
      runInitWithOptions(
        ['--session-id', 'no-legacy', '--task', 'demo'],
        { repoRoot: repo },
      ),
    );
    expect(captured.exitCode).toBeNull();

    const sDir = sessionDirForProject(repo, basename(repo), 'no-legacy');
    expect(existsSync(join(sDir, 'metadata.json'))).toBe(false);
    expect(existsSync(join(sDir, 'session.json'))).toBe(true);
  });

  test('opens gobbi.db and appends workflow.start + workflow.eval.decide', async () => {
    const repo = makeScratchRepo();
    await captureExit(() =>
      runInitWithOptions(
        ['--session-id', 'fresh-events', '--task', 'demo'],
        { repoRoot: repo },
      ),
    );

    const dbPath = join(
      sessionDirForProject(repo, basename(repo), 'fresh-events'),
      'gobbi.db',
    );
    const store = new EventStore(dbPath);
    try {
      const rows = store.replayAll();
      expect(rows).toHaveLength(2);
      expect(rows[0]?.type).toBe('workflow.start');
      expect(rows[1]?.type).toBe('workflow.eval.decide');
    } finally {
      store.close();
    }
  });

  test('--eval-ideation flag drives the eval.decide payload (not session.json)', async () => {
    const repo = makeScratchRepo();
    await captureExit(() =>
      runInitWithOptions(
        ['--session-id', 'eval-flags', '--eval-ideation'],
        { repoRoot: repo },
      ),
    );

    const dbPath = join(
      sessionDirForProject(repo, basename(repo), 'eval-flags'),
      'gobbi.db',
    );
    const store = new EventStore(dbPath);
    try {
      const rows = store.replayAll();
      const decideRow = rows.find((row) => row.type === 'workflow.eval.decide');
      expect(decideRow).toBeDefined();
      if (decideRow !== undefined) {
        const data = JSON.parse(decideRow.data) as Record<string, unknown>;
        expect(data['ideation']).toBe(true);
        expect(data['plan']).toBe(false);
      }
    } finally {
      store.close();
    }

    // session.json is the 6-field stub — no eval flags carry through.
    const sessionPath = sessionJsonPath(repo, basename(repo), 'eval-flags');
    const raw = JSON.parse(readFileSync(sessionPath, 'utf8')) as Record<
      string,
      unknown
    >;
    expect(raw['evalIdeation']).toBeUndefined();
    expect(raw['evalPlanning']).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Idempotency
// ---------------------------------------------------------------------------

describe('runInit — idempotency', () => {
  test('re-running against an existing session is a silent no-op', async () => {
    const repo = makeScratchRepo();
    await captureExit(() =>
      runInitWithOptions(
        ['--session-id', 'idem', '--task', 'first'],
        { repoRoot: repo },
      ),
    );

    const idemSessionDir = sessionDirForProject(repo, basename(repo), 'idem');
    const dbPath = join(idemSessionDir, 'gobbi.db');
    const sessionPath = sessionJsonPath(repo, basename(repo), 'idem');
    const firstSessionJson = readFileSync(sessionPath, 'utf8');

    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runInitWithOptions(
        ['--session-id', 'idem', '--task', 'second-will-not-land'],
        { repoRoot: repo },
      ),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe('');
    expect(captured.stderr).toBe('');

    // session.json bytes unchanged — re-init does not rewrite the stub.
    expect(readFileSync(sessionPath, 'utf8')).toBe(firstSessionJson);

    // No duplicate events.
    const store = new EventStore(dbPath);
    try {
      const rows = store.replayAll();
      expect(rows).toHaveLength(2);
    } finally {
      store.close();
    }
  });

  test('malformed existing session.json exits 1', async () => {
    const repo = makeScratchRepo();
    const sDir = sessionDirForProject(repo, basename(repo), 'broken');
    mkdirSync(sDir, { recursive: true });
    writeFileSync(join(sDir, 'session.json'), 'not json', 'utf8');

    await captureExit(() =>
      runInitWithOptions(['--session-id', 'broken'], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('malformed');
  });
});

// ---------------------------------------------------------------------------
// PR-FIN-1c — project name resolution: --project flag → basename(repoRoot)
// ---------------------------------------------------------------------------

describe('runInit — PR-FIN-1c project name resolution', () => {
  test('[1] fresh init with no flag uses basename(repoRoot)', async () => {
    const repo = makeScratchRepo();
    const expectedName = basename(repo);

    await captureExit(() =>
      runInitWithOptions(['--session-id', 'boot-1'], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();

    // session.json.projectId = basename(repoRoot)
    const session = readSessionJson(
      sessionJsonPath(repo, expectedName, 'boot-1'),
    );
    expect(session).not.toBeNull();
    if (session !== null) {
      expect(session.projectId).toBe(expectedName);
    }

    // PR-FIN-1c: no projects registry in settings.json — minimum shape
    // is just `{schemaVersion: 1}`.
    const settingsRaw = readFileSync(
      join(repo, '.gobbi', 'settings.json'),
      'utf8',
    );
    const settings = JSON.parse(settingsRaw) as Record<string, unknown>;
    expect(settings['schemaVersion']).toBe(1);
    expect(settings['projects']).toBeUndefined();

    // PR-FIN-1c: no bootstrap stderr message — there is no bootstrap.
    expect(captured.stderr).not.toContain('bootstrapped');
  });

  test('[3] fresh init with --project bar uses bar', async () => {
    const repo = makeScratchRepo();

    await captureExit(() =>
      runInitWithOptions(
        ['--session-id', 'flag-bar', '--project', 'bar'],
        { repoRoot: repo },
      ),
    );
    expect(captured.exitCode).toBeNull();

    const session = readSessionJson(sessionJsonPath(repo, 'bar', 'flag-bar'));
    expect(session).not.toBeNull();
    if (session !== null) {
      expect(session.projectId).toBe('bar');
    }
  });

  test('[4] existing session re-init with no --project is a silent no-op', async () => {
    const repo = makeScratchRepo();
    const expectedName = basename(repo);

    await captureExit(() =>
      runInitWithOptions(['--session-id', 'noop'], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();

    const sessionPath = sessionJsonPath(repo, expectedName, 'noop');
    const firstSessionJson = readFileSync(sessionPath, 'utf8');

    // Re-init with no flag — silent no-op.
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runInitWithOptions(['--session-id', 'noop'], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe('');
    expect(readFileSync(sessionPath, 'utf8')).toBe(firstSessionJson);
  });

  test('[5] existing session re-init with mismatching --project exits 2', async () => {
    const repo = makeScratchRepo();
    const expectedName = basename(repo);

    await captureExit(() =>
      runInitWithOptions(['--session-id', 'mism'], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();

    // Re-init with --project bar — mismatch gate.
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runInitWithOptions(
        ['--session-id', 'mism', '--project', 'bar'],
        { repoRoot: repo },
      ),
    );
    expect(captured.exitCode).toBe(2);
    expect(captured.stderr).toContain(
      `session mism is bound to project '${expectedName}'; --project=bar not allowed`,
    );
  });

  test('[6] existing session re-init with matching --project proceeds normally', async () => {
    const repo = makeScratchRepo();

    await captureExit(() =>
      runInitWithOptions(
        ['--session-id', 'match-foo', '--project', 'foo'],
        { repoRoot: repo },
      ),
    );
    expect(captured.exitCode).toBeNull();

    const sessionPath = sessionJsonPath(repo, 'foo', 'match-foo');
    const firstSessionJson = readFileSync(sessionPath, 'utf8');

    // Re-init with same --project foo — silent no-op.
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runInitWithOptions(
        ['--session-id', 'match-foo', '--project', 'foo'],
        { repoRoot: repo },
      ),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stderr).toBe('');
    expect(readFileSync(sessionPath, 'utf8')).toBe(firstSessionJson);
  });
});

// ---------------------------------------------------------------------------
// #178 — project_id partition key sourced from session.projectId, not
// basename(repoRoot). A multi-project workspace stamps every event with
// the actual project the session belongs to, so cross-project queries
// against state.db can partition by `project_id`.
// ---------------------------------------------------------------------------

describe('runInit — project_id stamping (#178)', () => {
  test('--project foo stamps every event with project_id="foo"', async () => {
    const repo = makeScratchRepo();
    await captureExit(() =>
      runInitWithOptions(
        ['--session-id', 'sess-foo', '--project', 'foo', '--task', 'demo'],
        { repoRoot: repo },
      ),
    );
    expect(captured.exitCode).toBeNull();

    const dbPath = join(
      sessionDirForProject(repo, 'foo', 'sess-foo'),
      'gobbi.db',
    );
    const store = new EventStore(dbPath);
    try {
      const rows = store.replayAll();
      // workflow init emits workflow.start + workflow.eval.decide.
      expect(rows.length).toBeGreaterThan(0);
      // EVERY row must carry project_id='foo' — the bug was every event
      // landing on the same project_id (basename(repoRoot)) regardless of
      // which project the session belonged to.
      for (const row of rows) {
        expect(row.project_id).toBe('foo');
        expect(row.session_id).toBe('sess-foo');
      }
    } finally {
      store.close();
    }
  });

  test('--project bar stamps every event with project_id="bar" (cross-project sanity)', async () => {
    const repo = makeScratchRepo();
    await captureExit(() =>
      runInitWithOptions(
        ['--session-id', 'sess-bar', '--project', 'bar', '--task', 'demo'],
        { repoRoot: repo },
      ),
    );
    expect(captured.exitCode).toBeNull();

    const dbPath = join(
      sessionDirForProject(repo, 'bar', 'sess-bar'),
      'gobbi.db',
    );
    const store = new EventStore(dbPath);
    try {
      const rows = store.replayAll();
      expect(rows.length).toBeGreaterThan(0);
      for (const row of rows) {
        expect(row.project_id).toBe('bar');
        expect(row.session_id).toBe('sess-bar');
      }
    } finally {
      store.close();
    }
  });

  test('project_id matches session.projectId, not basename(repoRoot)', async () => {
    // The hard regression case from issue #178: a repo named gobbi-repo
    // initialised under --project=foo must stamp project_id='foo', NOT
    // 'gobbi-repo' (basename(repoRoot)).
    const repo = mkdtempSync(join(tmpdir(), 'gobbi-repo-'));
    scratchDirs.push(repo);
    expect(basename(repo).startsWith('gobbi-repo-')).toBe(true);

    await captureExit(() =>
      runInitWithOptions(
        ['--session-id', 'sess-178', '--project', 'foo'],
        { repoRoot: repo },
      ),
    );
    expect(captured.exitCode).toBeNull();

    const dbPath = join(
      sessionDirForProject(repo, 'foo', 'sess-178'),
      'gobbi.db',
    );
    const store = new EventStore(dbPath);
    try {
      const rows = store.replayAll();
      expect(rows.length).toBeGreaterThan(0);
      for (const row of rows) {
        // Issue #178: this MUST be 'foo' (session.projectId) — never
        // basename(repo) which would be `gobbi-repo-<random>`.
        expect(row.project_id).toBe('foo');
        expect(row.project_id).not.toMatch(/^gobbi-repo-/);
      }
    } finally {
      store.close();
    }
  });
});
