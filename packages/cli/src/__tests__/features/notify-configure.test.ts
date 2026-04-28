/**
 * Feature-level tests for `gobbi notify configure` (PR-FIN-1d.4).
 *
 * Eight scenarios:
 *
 *   CFG-N-1 — Round-trip: --enable / --status / --disable produce the
 *             expected `.claude/settings.json` shape and the table
 *             reflects the toggle state.
 *   CFG-N-2 — Trust-boundary read: a pre-existing `claude-trace` hook
 *             entry is preserved verbatim across an unrelated --enable.
 *   CFG-N-3 — Trust-boundary status: --status output never lists a
 *             non-gobbi (e.g., `claude-trace`) command.
 *   CFG-N-4 — Validation: --enable Bogus exits 2 with a stderr message
 *             that names the rejected token and hints at valid events.
 *   CFG-N-5 — Idempotency: --enable Y twice yields exactly one entry.
 *   CFG-N-6 — Idempotency: --disable Y on a fresh file is a silent
 *             no-op (exit 0) and the file stays untouched.
 *   CFG-N-7 — Golden-file: enable Stop → enable SessionEnd → disable
 *             Stop produces a fixed expected JSON shape.
 *   CFG-N-8 — Multi-mode: --enable Stop --disable SessionEnd in one
 *             invocation exits 2 with stderr error.
 *
 * Test isolation: every test file scratches a private tmpdir under
 * `os.tmpdir()` and routes the mocked `getRepoRoot` to that path via a
 * `globalThis`-scoped pointer (mirrors the `gobbi-config.test.ts`
 * pattern — module-level memoisation in `lib/repo.ts` is shared across
 * `bun test` files in a single run).
 */

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, mock, test } from 'bun:test';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// ---------------------------------------------------------------------------
// Mocked getRepoRoot — points at this test file's per-test scratch repo.
// Pattern matches gobbi-config.test.ts so module-level memoisation in
// `lib/repo.ts` is sandboxed per file.
// ---------------------------------------------------------------------------

interface ScratchState {
  readonly root: string | null;
}
const GLOBAL_KEY = '__gobbiNotifyConfigureScratchRoot__';
function setGlobalScratch(root: string | null): void {
  (globalThis as unknown as Record<string, ScratchState>)[GLOBAL_KEY] = { root };
}
function getGlobalScratch(): string | null {
  const entry = (globalThis as unknown as Record<string, ScratchState | undefined>)[GLOBAL_KEY];
  return entry?.root ?? null;
}
mock.module('../../lib/repo.js', () => ({
  getRepoRoot: () => {
    const scratch = getGlobalScratch();
    if (scratch !== null) return scratch;
    try {
      return execSync('git rev-parse --show-toplevel', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      }).trim();
    } catch {
      return process.cwd();
    }
  },
  getClaudeDir: () => {
    const scratch = getGlobalScratch();
    const root = scratch ?? (() => {
      try {
        return execSync('git rev-parse --show-toplevel', {
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'],
        }).trim();
      } catch {
        return process.cwd();
      }
    })();
    return join(root, '.claude');
  },
}));

import { runNotify } from '../../commands/notify.js';

// ---------------------------------------------------------------------------
// stdout / stderr / process.exit capture
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

let captured: Captured = { stdout: '', stderr: '', exitCode: null };
let origStdoutWrite: typeof process.stdout.write;
let origStderrWrite: typeof process.stderr.write;
let origLog: typeof console.log;
let origExit: typeof process.exit;

async function captureExit(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (err) {
    if (err instanceof ExitCalled) return;
    throw err;
  }
}

function resetCapture(): void {
  captured = { stdout: '', stderr: '', exitCode: null };
}

// ---------------------------------------------------------------------------
// Scratch repo lifecycle
// ---------------------------------------------------------------------------

let scratchRepo: string | null = null;
let origCwd: string | null = null;

beforeAll(() => {
  origCwd = process.cwd();
  scratchRepo = mkdtempSync(join(tmpdir(), 'gobbi-notify-cfg-'));
  execSync('git init -q', { cwd: scratchRepo });
  process.chdir(scratchRepo);
  setGlobalScratch(scratchRepo);
});

afterAll(() => {
  setGlobalScratch(null);
  if (origCwd !== null) {
    try {
      process.chdir(origCwd);
    } catch {
      // best-effort
    }
  }
  if (scratchRepo !== null) {
    try {
      rmSync(scratchRepo, { recursive: true, force: true });
    } catch {
      // best-effort
    }
  }
});

function makeScratchRepo(): string {
  if (scratchRepo === null) {
    throw new Error('beforeAll did not initialise scratchRepo');
  }
  // Wipe the .claude/ between tests so each starts from a clean slate.
  const claudeDir = join(scratchRepo, '.claude');
  if (existsSync(claudeDir)) {
    rmSync(claudeDir, { recursive: true, force: true });
  }
  if (process.cwd() !== scratchRepo) {
    process.chdir(scratchRepo);
  }
  setGlobalScratch(scratchRepo);
  return scratchRepo;
}

function settingsPath(repo: string): string {
  return join(repo, '.claude', 'settings.json');
}

function writeSettings(repo: string, value: unknown): void {
  const dir = join(repo, '.claude');
  mkdirSync(dir, { recursive: true });
  writeFileSync(settingsPath(repo), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function readSettings(repo: string): unknown {
  return JSON.parse(readFileSync(settingsPath(repo), 'utf8'));
}

beforeEach(() => {
  resetCapture();
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

// ===========================================================================
// CFG-N-1: round-trip enable / status / disable
// ===========================================================================

describe('CFG-N-1: enable / status / disable round-trip', () => {
  test('CFG-N-1: --enable SessionEnd writes the canonical entry; --status reflects yes; --disable removes it', async () => {
    const repo = makeScratchRepo();

    // Start: no .claude/settings.json file at all.
    expect(existsSync(settingsPath(repo))).toBe(false);

    // --enable SessionEnd
    await captureExit(async () => {
      await runNotify(['configure', '--enable', 'SessionEnd']);
    });
    expect(captured.exitCode).toBeNull();
    expect(existsSync(settingsPath(repo))).toBe(true);
    expect(readSettings(repo)).toEqual({
      hooks: {
        SessionEnd: [
          {
            hooks: [
              {
                type: 'command',
                command: 'gobbi hook session-end',
                timeout: 10,
              },
            ],
          },
        ],
      },
    });

    // --status — table includes SessionEnd: yes
    resetCapture();
    await captureExit(async () => {
      await runNotify(['configure', '--status']);
    });
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('SessionEnd');
    // SessionEnd row says "yes" with the canonical command. Match the
    // whole substring rather than just "yes" so a foreign event with
    // "yes" doesn't make this assertion accidentally pass.
    expect(captured.stdout).toMatch(/SessionEnd\s+yes\s+gobbi hook session-end/);
    // Other events still report "no" with the em-dash placeholder.
    expect(captured.stdout).toMatch(/Stop\s+no\s+—/);

    // --disable SessionEnd → file is empty after the mutation.
    resetCapture();
    await captureExit(async () => {
      await runNotify(['configure', '--disable', 'SessionEnd']);
    });
    expect(captured.exitCode).toBeNull();
    // hooks key was the only key; with hooks empty the key is dropped,
    // leaving an empty object. The file stays present (we don't delete
    // it) so subsequent reads round-trip cleanly.
    expect(readSettings(repo)).toEqual({});

    // --status — SessionEnd back to "no"
    resetCapture();
    await captureExit(async () => {
      await runNotify(['configure', '--status']);
    });
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toMatch(/SessionEnd\s+no\s+—/);
  });
});

// ===========================================================================
// CFG-N-2: trust-boundary read — claude-trace entry preserved
// ===========================================================================

describe('CFG-N-2: trust boundary — non-gobbi entries are not modified', () => {
  test('CFG-N-2: pre-existing claude-trace hook is preserved across --enable Stop', async () => {
    const repo = makeScratchRepo();

    // Seed a non-gobbi hook entry under a different event (Stop) and a
    // permissions block. Both must survive untouched.
    writeSettings(repo, {
      permissions: { allow: ['Skill(_orchestration)'] },
      hooks: {
        Stop: [
          {
            hooks: [
              {
                type: 'command',
                command: 'claude-trace --capture',
                timeout: 5,
              },
            ],
          },
        ],
      },
    });

    await captureExit(async () => {
      await runNotify(['configure', '--enable', 'Stop']);
    });
    expect(captured.exitCode).toBeNull();

    const onDisk = readSettings(repo) as {
      readonly permissions?: unknown;
      readonly hooks?: { readonly Stop?: readonly unknown[] };
    };

    // permissions block untouched.
    expect(onDisk.permissions).toEqual({ allow: ['Skill(_orchestration)'] });

    // Stop now has TWO blocks: the original claude-trace block and the
    // newly-appended gobbi block. Both content and order matter.
    expect(onDisk.hooks?.Stop).toEqual([
      {
        hooks: [
          {
            type: 'command',
            command: 'claude-trace --capture',
            timeout: 5,
          },
        ],
      },
      {
        hooks: [
          {
            type: 'command',
            command: 'gobbi hook stop',
            timeout: 10,
          },
        ],
      },
    ]);
  });
});

// ===========================================================================
// CFG-N-3: --status excludes non-gobbi entries
// ===========================================================================

describe('CFG-N-3: --status excludes non-gobbi entries', () => {
  test('CFG-N-3: claude-trace command never appears in --status output', async () => {
    const repo = makeScratchRepo();

    writeSettings(repo, {
      hooks: {
        Stop: [
          {
            hooks: [
              {
                type: 'command',
                command: 'claude-trace --capture',
                timeout: 5,
              },
            ],
          },
        ],
      },
    });

    await captureExit(async () => {
      await runNotify(['configure', '--status']);
    });
    expect(captured.exitCode).toBeNull();
    // The table must not mention claude-trace.
    expect(captured.stdout).not.toContain('claude-trace');
    // Stop should still report "no" — a foreign command does not flip
    // gobbi's view of "configured".
    expect(captured.stdout).toMatch(/Stop\s+no\s+—/);
  });
});

// ===========================================================================
// CFG-N-4: validation — unknown event exits 2
// ===========================================================================

describe('CFG-N-4: --enable on unknown event rejected', () => {
  test('CFG-N-4: --enable Bogus exits 2 with stderr referencing the bad token', async () => {
    makeScratchRepo();

    await captureExit(async () => {
      await runNotify(['configure', '--enable', 'Bogus']);
    });
    expect(captured.exitCode).toBe(2);
    expect(captured.stderr).toContain('Bogus');
    // Stderr must hint at valid events — pick a representative one
    // from the canonical list.
    expect(captured.stderr).toContain('SessionStart');
  });
});

// ===========================================================================
// CFG-N-5: idempotency — --enable twice
// ===========================================================================

describe('CFG-N-5: --enable twice is idempotent', () => {
  test('CFG-N-5: enabling SessionEnd twice produces exactly one block', async () => {
    const repo = makeScratchRepo();

    await captureExit(async () => {
      await runNotify(['configure', '--enable', 'SessionEnd']);
    });
    expect(captured.exitCode).toBeNull();

    resetCapture();
    await captureExit(async () => {
      await runNotify(['configure', '--enable', 'SessionEnd']);
    });
    expect(captured.exitCode).toBeNull();

    const onDisk = readSettings(repo) as {
      readonly hooks: { readonly SessionEnd: readonly unknown[] };
    };
    // Exactly one block — re-enabling did not append a duplicate.
    expect(onDisk.hooks.SessionEnd).toHaveLength(1);
  });
});

// ===========================================================================
// CFG-N-6: idempotency — --disable on absent entry is silent no-op
// ===========================================================================

describe('CFG-N-6: --disable on absent entry is a silent no-op', () => {
  test('CFG-N-6: disabling SessionEnd on a fresh file does not write the file', async () => {
    const repo = makeScratchRepo();

    // No file at all — disable should be a silent no-op (exit 0, no write).
    expect(existsSync(settingsPath(repo))).toBe(false);

    await captureExit(async () => {
      await runNotify(['configure', '--disable', 'SessionEnd']);
    });
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe('');
    expect(captured.stderr).toBe('');
    // Still no file — readClaudeSettings of a missing file returned `{}`
    // and the disable path short-circuited before writing.
    expect(existsSync(settingsPath(repo))).toBe(false);
  });
});

// ===========================================================================
// CFG-N-7: golden-file shape after a sequence of operations
// ===========================================================================

describe('CFG-N-7: golden-file fixture after enable/enable/disable', () => {
  test('CFG-N-7: enable Stop → enable SessionEnd → disable Stop matches a fixed JSON', async () => {
    const repo = makeScratchRepo();

    await captureExit(async () => {
      await runNotify(['configure', '--enable', 'Stop']);
    });
    resetCapture();
    await captureExit(async () => {
      await runNotify(['configure', '--enable', 'SessionEnd']);
    });
    resetCapture();
    await captureExit(async () => {
      await runNotify(['configure', '--disable', 'Stop']);
    });

    expect(readSettings(repo)).toEqual({
      hooks: {
        SessionEnd: [
          {
            hooks: [
              {
                type: 'command',
                command: 'gobbi hook session-end',
                timeout: 10,
              },
            ],
          },
        ],
      },
    });
  });
});

// ===========================================================================
// CFG-N-8: multi-mode rejected
// ===========================================================================

describe('CFG-N-8: multi-mode invocation rejected', () => {
  test('CFG-N-8: --enable Stop --disable SessionEnd exits 2 with stderr error', async () => {
    makeScratchRepo();

    await captureExit(async () => {
      await runNotify([
        'configure',
        '--enable',
        'Stop',
        '--disable',
        'SessionEnd',
      ]);
    });
    expect(captured.exitCode).toBe(2);
    expect(captured.stderr).toContain('only one of');
  });
});
