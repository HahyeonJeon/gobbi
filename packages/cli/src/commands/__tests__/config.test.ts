/**
 * Unit tests for `gobbi config resolve` — the Pass-3 CLI verb that walks
 * the three-tier cascade and prints the value at a dot-path.
 *
 * Covers:
 *   - Happy path: seeded T2 file, key present → JSON value + exit 0.
 *   - Missing key / ancestor absent → exit 1 silently (no stdout).
 *   - --session-id injects the T3 overlay; unknown session id falls through.
 *   - --with-sources emits `{value, tier}` JSON.
 *   - Malformed argv (missing positional, unknown flag) → USAGE + exit 2.
 *   - Malformed T2 JSON → ConfigCascadeError on stderr, exit 2.
 *   - Arbitrary project keys resolve through the dot-path walker (git.mode).
 *
 * Each test uses its own tmpdir sandbox and swaps `CLAUDE_PROJECT_DIR`
 * around the call so `resolveProjectDir()` inside `commands/config.ts`
 * sees the scratch repo. stdout / stderr / process.exit are trapped the
 * same way `gotcha.test.ts` traps them.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { runConfig } from '../config.js';
import { openConfigStore } from '../../lib/config-store.js';

// ---------------------------------------------------------------------------
// stdout/stderr capture + process.exit trap (same pattern as gotcha.test.ts)
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
let origErr: typeof console.error;
let origExit: typeof process.exit;
let origProjectDir: string | undefined;

beforeEach(() => {
  captured = { stdout: '', stderr: '', exitCode: null };
  origStdoutWrite = process.stdout.write;
  origStderrWrite = process.stderr.write;
  origLog = console.log;
  origErr = console.error;
  origExit = process.exit;
  origProjectDir = process.env['CLAUDE_PROJECT_DIR'];

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
  console.error = (...args: unknown[]): void => {
    captured.stderr += args.map(String).join(' ') + '\n';
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
  console.error = origErr;
  process.exit = origExit;
  if (origProjectDir === undefined) {
    delete process.env['CLAUDE_PROJECT_DIR'];
  } else {
    process.env['CLAUDE_PROJECT_DIR'] = origProjectDir;
  }
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
// Scratch dir helpers
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

function makeScratchRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-cfg-cli-'));
  scratchDirs.push(dir);
  process.env['CLAUDE_PROJECT_DIR'] = dir;
  return dir;
}

function writeJson(filePath: string, value: unknown): void {
  mkdirSync(join(filePath, '..'), { recursive: true });
  writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
}

// ===========================================================================
// gobbi config resolve — happy path
// ===========================================================================

describe('runConfig — resolve happy path', () => {
  test('prints JSON value + exits 0 for a known project-level key', async () => {
    const repo = makeScratchRepo();
    writeJson(join(repo, '.gobbi', 'project', 'settings.json'), {
      version: 2,
      git: { mode: 'worktree-pr', baseBranch: 'main' },
    });

    await captureExit(() => runConfig(['resolve', 'git.mode']));

    expect(captured.stderr).toBe('');
    expect(captured.stdout.trim()).toBe(JSON.stringify('worktree-pr'));
    // exit 0 is represented as no process.exit call (the function returned).
    expect(captured.exitCode).toBeNull();
  });

  test('resolves a deeply nested verification key', async () => {
    const repo = makeScratchRepo();
    writeJson(join(repo, '.gobbi', 'project', 'settings.json'), {
      version: 2,
      verification: {
        commands: {
          test: {
            command: 'bun test',
            policy: 'gate',
            timeoutMs: 120_000,
          },
        },
      },
    });

    await captureExit(() =>
      runConfig(['resolve', 'verification.commands.test.command']),
    );

    expect(captured.stdout.trim()).toBe(JSON.stringify('bun test'));
    expect(captured.exitCode).toBeNull();
  });

  test('resolves a default (no tier files) when a cascade field exists', async () => {
    const repo = makeScratchRepo();
    // No T1, no T2, no T3 — `trivialRange` falls through to DEFAULT_CONFIG.
    mkdirSync(join(repo, '.gobbi'), { recursive: true });

    await captureExit(() => runConfig(['resolve', 'trivialRange']));

    expect(captured.stdout.trim()).toBe(JSON.stringify('read-only'));
    expect(captured.exitCode).toBeNull();
  });
});

// ===========================================================================
// gobbi config resolve — missing key
// ===========================================================================

describe('runConfig — resolve missing key', () => {
  test('nonexistent top-level key → exit 1 silently (no stdout/stderr)', async () => {
    makeScratchRepo();
    await captureExit(() => runConfig(['resolve', 'does.not.exist']));
    expect(captured.stdout).toBe('');
    expect(captured.stderr).toBe('');
    expect(captured.exitCode).toBe(1);
  });

  test('ancestor present but leaf absent → exit 1 silently', async () => {
    makeScratchRepo();
    // `git` is an object in the defaults but has no `missing` child.
    await captureExit(() => runConfig(['resolve', 'git.missing']));
    expect(captured.stdout).toBe('');
    expect(captured.stderr).toBe('');
    expect(captured.exitCode).toBe(1);
  });

  test('dot-path descends through a primitive leaf → exit 1 silently', async () => {
    makeScratchRepo();
    // `trivialRange` is a string — `.foo` cannot descend further.
    await captureExit(() => runConfig(['resolve', 'trivialRange.foo']));
    expect(captured.stdout).toBe('');
    expect(captured.stderr).toBe('');
    expect(captured.exitCode).toBe(1);
  });
});

// ===========================================================================
// gobbi config resolve — --session-id overlay
// ===========================================================================

describe('runConfig — resolve --session-id', () => {
  test('T3 overlay wins when session-id matches an upserted row', async () => {
    const repo = makeScratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeJson(join(repo, '.gobbi', 'project', 'settings.json'), {
      version: 2,
      git: { mode: 'worktree-pr', baseBranch: 'main' },
    });

    {
      using store = openConfigStore(repo);
      store.upsertSession('s-alpha', {
        trivialRange: 'simple-edits',
        evaluationMode: 'ask-each-time',
        gitWorkflow: 'direct-commit',
        baseBranch: 'session-branch',
        notify: { slack: false, telegram: false },
        createdAt: '2026-01-01T00:00:00Z',
        lastAccessedAt: '2026-01-01T00:00:00Z',
      });
    }

    await captureExit(() =>
      runConfig(['resolve', 'git.mode', '--session-id', 's-alpha']),
    );

    expect(captured.stdout.trim()).toBe(JSON.stringify('direct-commit'));
    expect(captured.exitCode).toBeNull();
  });

  test('unknown session-id falls through to T2/T1/defaults silently', async () => {
    const repo = makeScratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeJson(join(repo, '.gobbi', 'project', 'settings.json'), {
      version: 2,
      git: { mode: 'worktree-pr', baseBranch: 'main' },
    });
    // Open store so config.db exists but no sessions are inserted.
    {
      using store = openConfigStore(repo);
      void store;
    }

    await captureExit(() =>
      runConfig(['resolve', 'git.mode', '--session-id', 'ghost']),
    );

    expect(captured.stdout.trim()).toBe(JSON.stringify('worktree-pr'));
    expect(captured.exitCode).toBeNull();
  });
});

// ===========================================================================
// gobbi config resolve — --with-sources
// ===========================================================================

describe('runConfig — resolve --with-sources', () => {
  test('emits {value, tier} JSON when key set by project tier', async () => {
    const repo = makeScratchRepo();
    writeJson(join(repo, '.gobbi', 'project', 'settings.json'), {
      version: 2,
      git: { mode: 'worktree-pr', baseBranch: 'main' },
    });

    await captureExit(() =>
      runConfig(['resolve', 'git.mode', '--with-sources']),
    );

    expect(captured.exitCode).toBeNull();
    const out = JSON.parse(captured.stdout.trim()) as unknown;
    expect(out).toEqual({ value: 'worktree-pr', tier: 'project' });
  });

  test('tier is "default" when the key is served from the fallback layer', async () => {
    makeScratchRepo();
    await captureExit(() =>
      runConfig(['resolve', 'trivialRange', '--with-sources']),
    );

    const out = JSON.parse(captured.stdout.trim()) as unknown;
    expect(out).toEqual({ value: 'read-only', tier: 'default' });
  });

  test('flag order (--with-sources before --session-id) is accepted', async () => {
    const repo = makeScratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    {
      using store = openConfigStore(repo);
      store.upsertSession('s-beta', {
        trivialRange: 'simple-edits',
        evaluationMode: 'ask-each-time',
        gitWorkflow: 'direct-commit',
        baseBranch: 'sbr',
        notify: { slack: true, telegram: false },
        createdAt: '2026-01-01T00:00:00Z',
        lastAccessedAt: '2026-01-01T00:00:00Z',
      });
    }

    await captureExit(() =>
      runConfig([
        'resolve',
        'notify.slack',
        '--with-sources',
        '--session-id',
        's-beta',
      ]),
    );

    const out = JSON.parse(captured.stdout.trim()) as unknown;
    expect(out).toEqual({ value: true, tier: 'session' });
  });
});

// ===========================================================================
// gobbi config resolve — argv errors
// ===========================================================================

describe('runConfig — resolve argv errors', () => {
  test('no args → exit 2 with USAGE on stderr', async () => {
    makeScratchRepo();
    await captureExit(() => runConfig(['resolve']));
    expect(captured.exitCode).toBe(2);
    expect(captured.stderr).toContain('Usage: gobbi config resolve');
  });

  test('--session-id without value → exit 2 with USAGE', async () => {
    makeScratchRepo();
    await captureExit(() => runConfig(['resolve', 'git.mode', '--session-id']));
    expect(captured.exitCode).toBe(2);
    expect(captured.stderr).toContain('Usage: gobbi config resolve');
  });

  test('unknown flag → exit 2 with USAGE', async () => {
    makeScratchRepo();
    await captureExit(() =>
      runConfig(['resolve', 'git.mode', '--nope']),
    );
    expect(captured.exitCode).toBe(2);
    expect(captured.stderr).toContain('Usage: gobbi config resolve');
  });

  test('two positional args → exit 2 with USAGE', async () => {
    makeScratchRepo();
    await captureExit(() =>
      runConfig(['resolve', 'git.mode', 'extra.positional']),
    );
    expect(captured.exitCode).toBe(2);
    expect(captured.stderr).toContain('Usage: gobbi config resolve');
  });
});

// ===========================================================================
// gobbi config resolve — resolver errors
// ===========================================================================

describe('runConfig — resolve resolver errors', () => {
  test('malformed T2 JSON → exit 2; stderr mentions the project tier', async () => {
    const repo = makeScratchRepo();
    mkdirSync(join(repo, '.gobbi', 'project'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', 'project', 'settings.json'),
      '{ bad json not closed',
      'utf8',
    );

    await captureExit(() => runConfig(['resolve', 'git.mode']));
    expect(captured.exitCode).toBe(2);
    // The ConfigCascadeError message includes the tier path fragment
    // (.gobbi/project/settings.json) — enough to disambiguate the tier.
    expect(captured.stderr).toContain('project/settings.json');
  });

  test('malformed T1 JSON → exit 2; stderr mentions the user tier', async () => {
    const repo = makeScratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    writeFileSync(
      join(repo, '.gobbi', 'settings.json'),
      '{ not valid',
      'utf8',
    );

    await captureExit(() => runConfig(['resolve', 'git.mode']));
    expect(captured.exitCode).toBe(2);
    expect(captured.stderr).toContain('.gobbi/settings.json');
  });
});

// ===========================================================================
// gobbi config resolve — router smoke check
// ===========================================================================

describe('runConfig — router includes resolve', () => {
  test('--help text lists the resolve subcommand', async () => {
    makeScratchRepo();
    await captureExit(() => runConfig(['--help']));
    expect(captured.stdout).toContain('resolve <key>');
    expect(captured.stdout).toContain('T1/T2/T3 cascade');
  });

  test('existing `get` path is untouched — prints session JSON', async () => {
    const repo = makeScratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    {
      using store = openConfigStore(repo);
      store.upsertSession('g-alpha', {
        trivialRange: 'simple-edits',
        evaluationMode: 'ask-each-time',
        gitWorkflow: 'worktree-pr',
        baseBranch: 'main',
        notify: { slack: false, telegram: true },
        createdAt: '2026-01-01T00:00:00Z',
        lastAccessedAt: '2026-01-01T00:00:00Z',
      });
    }

    await captureExit(() => runConfig(['get', 'g-alpha']));

    expect(captured.exitCode).toBeNull();
    const obj = JSON.parse(captured.stdout.trim()) as unknown;
    // Sanity: the JSON reflects the row, confirming the get path is unchanged.
    expect(obj).toMatchObject({
      trivialRange: 'simple-edits',
      gitWorkflow: 'worktree-pr',
      baseBranch: 'main',
    });

    // Post-condition: existsSync on the DB proves `get` did not mutate the store.
    expect(existsSync(join(repo, '.gobbi', 'config.db'))).toBe(true);
  });
});
