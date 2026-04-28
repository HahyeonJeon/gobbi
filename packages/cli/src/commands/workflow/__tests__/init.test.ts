/**
 * Unit tests for `gobbi workflow init` — idempotent session initialisation.
 *
 * Coverage:
 *   - Fresh init writes metadata.json with schemaVersion 3, projectRoot, and
 *     an empty techStack (C.2c fills techStack in a follow-up commit).
 *   - Fresh init opens gobbi.db and emits workflow.start + workflow.eval.decide
 *     atomically; the session reaches `ideation`.
 *   - Re-running against an existing directory is a silent no-op (no new
 *     events, no rewrite of metadata.json).
 *   - Malformed existing metadata.json exits 1.
 *   - CLI flags --task / --eval-ideation / --eval-planning / --context land on
 *     metadata.configSnapshot.
 *
 * Tests use the `runInitWithOptions({ repoRoot })` test hook so we never
 * touch the actual checkout's `.gobbi/` tree.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';

import { EventStore } from '../../../workflow/store.js';
import { runInitWithOptions, readMetadata, resolveSessionId } from '../init.js';
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

  test('generates a UUID when neither override nor env', () => {
    delete process.env['CLAUDE_SESSION_ID'];
    const id = resolveSessionId(undefined);
    expect(id.length).toBeGreaterThan(10);
    expect(id.split('-').length).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// Fresh init happy path
// ---------------------------------------------------------------------------

describe('runInit — fresh session', () => {
  test('writes metadata.json with schema v3, empty techStack, and the given flags', async () => {
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

    const metaPath = join(
      sessionDirForProject(repo, basename(repo), 'fresh-happy'),
      'metadata.json',
    );
    const meta = readMetadata(metaPath);
    expect(meta).not.toBeNull();
    expect(meta!.schemaVersion).toBe(3);
    expect(meta!.sessionId).toBe('fresh-happy');
    expect(meta!.projectRoot).toBe(repo);
    // C.2c populates techStack; for now it's empty.
    expect(meta!.techStack).toEqual([]);
    expect(meta!.configSnapshot.task).toBe('demo task');
    expect(meta!.configSnapshot.evalIdeation).toBe(true);
    expect(meta!.configSnapshot.evalPlanning).toBe(false);
    expect(meta!.configSnapshot.context).toBe('ctx line');
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
    const metaPath = join(idemSessionDir, 'metadata.json');
    const firstMeta = readFileSync(metaPath, 'utf8');

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

    // Metadata file unchanged.
    expect(readFileSync(metaPath, 'utf8')).toBe(firstMeta);

    // No duplicate events.
    const store = new EventStore(dbPath);
    try {
      const rows = store.replayAll();
      expect(rows).toHaveLength(2);
    } finally {
      store.close();
    }
  });

  test('malformed existing metadata.json exits 1', async () => {
    const repo = makeScratchRepo();
    const sessionDir = sessionDirForProject(repo, basename(repo), 'broken');
    mkdirSync(sessionDir, { recursive: true });
    writeFileSync(join(sessionDir, 'metadata.json'), 'not json', 'utf8');

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

    // metadata.projectName = basename(repoRoot)
    const metaPath = join(
      repo,
      '.gobbi',
      'projects',
      expectedName,
      'sessions',
      'boot-1',
      'metadata.json',
    );
    const meta = readMetadata(metaPath);
    expect(meta).not.toBeNull();
    expect(meta!.projectName).toBe(expectedName);

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

    const metaPath = join(
      repo,
      '.gobbi',
      'projects',
      'bar',
      'sessions',
      'flag-bar',
      'metadata.json',
    );
    const meta = readMetadata(metaPath);
    expect(meta).not.toBeNull();
    expect(meta!.projectName).toBe('bar');
  });

  test('[4] existing session re-init with no --project is a silent no-op', async () => {
    const repo = makeScratchRepo();
    const expectedName = basename(repo);

    await captureExit(() =>
      runInitWithOptions(['--session-id', 'noop'], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();

    const metaPath = join(
      repo,
      '.gobbi',
      'projects',
      expectedName,
      'sessions',
      'noop',
      'metadata.json',
    );
    const firstMeta = readFileSync(metaPath, 'utf8');

    // Re-init with no flag — silent no-op.
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runInitWithOptions(['--session-id', 'noop'], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe('');
    expect(readFileSync(metaPath, 'utf8')).toBe(firstMeta);
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

    const metaPath = join(
      repo,
      '.gobbi',
      'projects',
      'foo',
      'sessions',
      'match-foo',
      'metadata.json',
    );
    const firstMeta = readFileSync(metaPath, 'utf8');

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
    expect(readFileSync(metaPath, 'utf8')).toBe(firstMeta);
  });
});
