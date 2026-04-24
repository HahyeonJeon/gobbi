/**
 * Unit tests for `gobbi workflow init` — idempotent session initialisation.
 *
 * Coverage:
 *   - Fresh init writes metadata.json with schemaVersion 2, projectRoot, and
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
  test('writes metadata.json with schema v2, empty techStack, and the given flags', async () => {
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

    const metaPath = join(repo, '.gobbi', 'sessions', 'fresh-happy', 'metadata.json');
    const meta = readMetadata(metaPath);
    expect(meta).not.toBeNull();
    expect(meta!.schemaVersion).toBe(2);
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

    const dbPath = join(repo, '.gobbi', 'sessions', 'fresh-events', 'gobbi.db');
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

    const dbPath = join(repo, '.gobbi', 'sessions', 'idem', 'gobbi.db');
    const metaPath = join(repo, '.gobbi', 'sessions', 'idem', 'metadata.json');
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
    const sessionDir = join(repo, '.gobbi', 'sessions', 'broken');
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
// W2.3 — Bootstrap contract + projects.active resolution + --project flag
// ---------------------------------------------------------------------------

describe('runInit — W2.3 project name resolution', () => {
  /**
   * Helper — read the workspace `.gobbi/settings.json` from the scratch repo
   * as a loosely-typed record. Tests assert on `projects.active` / `known`
   * after init; we parse defensively because the file is AJV-validated on
   * write and should always be shape-correct by the time this reads.
   */
  function readWorkspaceSettings(repo: string): {
    projects?: { active?: unknown; known?: unknown };
  } | null {
    const p = join(repo, '.gobbi', 'settings.json');
    const raw = readFileSync(p, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (parsed !== null && typeof parsed === 'object') {
      return parsed as { projects?: { active?: unknown; known?: unknown } };
    }
    return null;
  }

  /**
   * Helper — write a workspace `.gobbi/settings.json` with an explicit
   * `projects.active` before running init. Used by tests that want the
   * workspace-read branch (step 2 of the ladder) to fire rather than
   * bootstrap. The file must satisfy the unified AJV schema — projects is
   * required, schemaVersion must equal 1.
   */
  function seedWorkspaceSettings(repo: string, active: string | null, known: readonly string[]): void {
    const dir = join(repo, '.gobbi');
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, 'settings.json'),
      `${JSON.stringify(
        { schemaVersion: 1, projects: { active, known } },
        null,
        2,
      )}\n`,
      'utf8',
    );
  }

  test('[1] fresh init with no .gobbi/settings.json bootstraps basename(repoRoot)', async () => {
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

    // projects.active + projects.known in workspace settings
    const settings = readWorkspaceSettings(repo);
    expect(settings?.projects?.active).toBe(expectedName);
    expect(settings?.projects?.known).toEqual([expectedName]);

    // stderr bootstrap message
    expect(captured.stderr).toContain(
      `[gobbi workflow init] bootstrapped default project '${expectedName}' in .gobbi/settings.json`,
    );
  });

  test('[2] fresh init with existing projects.active uses it and does NOT re-write settings', async () => {
    const repo = makeScratchRepo();
    // Pre-seed workspace with active=foo, known=[foo]. Capture the exact bytes
    // so we can assert the bootstrap branch did not re-write the file.
    seedWorkspaceSettings(repo, 'foo', ['foo']);
    const settingsPath = join(repo, '.gobbi', 'settings.json');
    const beforeBytes = readFileSync(settingsPath, 'utf8');

    await captureExit(() =>
      runInitWithOptions(['--session-id', 'use-active'], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();

    const metaPath = join(
      repo,
      '.gobbi',
      'projects',
      'foo',
      'sessions',
      'use-active',
      'metadata.json',
    );
    const meta = readMetadata(metaPath);
    expect(meta).not.toBeNull();
    expect(meta!.projectName).toBe('foo');

    // Workspace settings.json unchanged (byte-for-byte) — bootstrap did not fire.
    expect(readFileSync(settingsPath, 'utf8')).toBe(beforeBytes);

    // No bootstrap stderr message.
    expect(captured.stderr).not.toContain('bootstrapped default project');
  });

  test('[3] fresh init with --project bar uses bar and does NOT cascade into projects.active', async () => {
    const repo = makeScratchRepo();
    // Pre-seed workspace with a distinct active=foo so we can prove the flag
    // overrode it for the session but did NOT mutate the registry.
    seedWorkspaceSettings(repo, 'foo', ['foo']);
    const settingsPath = join(repo, '.gobbi', 'settings.json');
    const beforeBytes = readFileSync(settingsPath, 'utf8');

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

    // projects.active unchanged — flag is per-invocation, not cascaded.
    expect(readFileSync(settingsPath, 'utf8')).toBe(beforeBytes);
    const settings = readWorkspaceSettings(repo);
    expect(settings?.projects?.active).toBe('foo');
    expect(settings?.projects?.known).toEqual(['foo']);
  });

  test('[4] existing session re-init with no --project is a silent no-op', async () => {
    const repo = makeScratchRepo();
    seedWorkspaceSettings(repo, 'foo', ['foo']);

    // Birth the session.
    await captureExit(() =>
      runInitWithOptions(['--session-id', 'noop-foo'], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();

    const metaPath = join(
      repo,
      '.gobbi',
      'projects',
      'foo',
      'sessions',
      'noop-foo',
      'metadata.json',
    );
    const firstMeta = readFileSync(metaPath, 'utf8');

    // Re-init with no flag — silent no-op.
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runInitWithOptions(['--session-id', 'noop-foo'], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe('');
    expect(captured.stderr).toBe('');
    expect(readFileSync(metaPath, 'utf8')).toBe(firstMeta);
  });

  test('[5] existing session re-init with mismatching --project exits 2', async () => {
    const repo = makeScratchRepo();
    seedWorkspaceSettings(repo, 'foo', ['foo']);

    await captureExit(() =>
      runInitWithOptions(['--session-id', 'mism-foo'], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();

    // Re-init with --project bar — mismatch gate.
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runInitWithOptions(
        ['--session-id', 'mism-foo', '--project', 'bar'],
        { repoRoot: repo },
      ),
    );
    expect(captured.exitCode).toBe(2);
    expect(captured.stderr).toContain(
      "session mism-foo is bound to project 'foo'; --project=bar not allowed",
    );
  });

  test('[6] existing session re-init with matching --project proceeds normally', async () => {
    const repo = makeScratchRepo();
    seedWorkspaceSettings(repo, 'foo', ['foo']);

    await captureExit(() =>
      runInitWithOptions(['--session-id', 'match-foo'], { repoRoot: repo }),
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

    // Re-init with --project foo — should be a silent no-op.
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

  test('[7] bootstrap deduplicates projects.known when the name already appears', async () => {
    const repo = makeScratchRepo();
    const expectedName = basename(repo);
    // Pre-seed workspace with active=null but the bootstrap name ALREADY in
    // known. This simulates a prior session that added the name to known
    // but the user later cleared projects.active manually. Bootstrap must
    // dedup rather than double-insert.
    seedWorkspaceSettings(repo, null, [expectedName]);

    await captureExit(() =>
      runInitWithOptions(['--session-id', 'dedup'], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();

    const settings = readWorkspaceSettings(repo);
    expect(settings?.projects?.active).toBe(expectedName);
    // Exactly one entry — no duplicate.
    expect(settings?.projects?.known).toEqual([expectedName]);
  });

  test('[8] bootstrap stderr latch does not bleed across sibling repos', async () => {
    // Two fresh repos in sibling tmpdirs. Each fresh init must emit its own
    // bootstrap stderr message independently — no module-scoped latch may
    // silence the second emit. Critical for test isolation under bun:test
    // which reuses a single Bun process across files.
    const repoA = makeScratchRepo();
    const repoB = makeScratchRepo();
    const nameA = basename(repoA);
    const nameB = basename(repoB);

    await captureExit(() =>
      runInitWithOptions(['--session-id', 'latch-A'], { repoRoot: repoA }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stderr).toContain(
      `[gobbi workflow init] bootstrapped default project '${nameA}' in .gobbi/settings.json`,
    );

    // Reset capture and run a second fresh init in a DIFFERENT repo.
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runInitWithOptions(['--session-id', 'latch-B'], { repoRoot: repoB }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stderr).toContain(
      `[gobbi workflow init] bootstrapped default project '${nameB}' in .gobbi/settings.json`,
    );
  });
});
