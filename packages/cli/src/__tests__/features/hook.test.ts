/**
 * Feature-level integration tests for `gobbi hook <event>` (PR-FIN-1b).
 *
 * Six scenarios:
 *
 *   HOOK-1 — `gobbi hook session-start` reads stdin, persists CLAUDE_*
 *            env vars via `gobbi config env`, and invokes
 *            `gobbi workflow init`. Asserts the env file contains the
 *            expected lines and the session metadata.json was written.
 *   HOOK-2 — `gobbi hook pre-tool-use` invokes guard with the parsed
 *            payload; asserts the canonical fail-open allow JSON appears
 *            on stdout (no real session means matcher returns nothing →
 *            allow).
 *   HOOK-3 — generic stub `gobbi hook session-end` exits 0 silently with
 *            no file writes (notify dispatch is the PR-FIN-1d landing
 *            site; in PR-FIN-1b the stub body just drains stdin).
 *   HOOK-4 — unknown subcommand exits 1 + help text on stderr.
 *   HOOK-5 — `gobbi hook --help` renders all 28 subcommand names.
 *   HOOK-6 — End-to-end: `runHookSessionStart` with a sample payload
 *            persists CLAUDE_* env vars and creates the session dir
 *            under `.gobbi/projects/<basename>/sessions/<id>/`.
 *
 * Test isolation: per-test scratch repo (mkdtempSync), `process.chdir`
 * to it, mock `lib/repo.ts::getRepoRoot` to return the scratch path,
 * point `$CLAUDE_ENV_FILE` at a per-test file, restore env on teardown.
 */

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, mock, test } from 'bun:test';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';

import { sessionDir as sessionDirForProject } from '../../lib/workspace-paths.js';

// ---------------------------------------------------------------------------
// Mocked getRepoRoot (mirrors gobbi-config.test.ts pattern — module-level
// memoization in `lib/repo.ts` is shared across `bun test` files).
// ---------------------------------------------------------------------------

interface ScratchState {
  readonly root: string | null;
}
const GLOBAL_KEY = '__gobbiHookScratchRoot__';
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

// ---------------------------------------------------------------------------
// Mocked stdin — bun:test's stdin is a TTY/internal stream, so the production
// `lib/stdin.ts::readStdin` path returns null. To exercise the full
// session-start chain end-to-end (HOOK-1, HOOK-6), tests can queue a synthetic
// payload via `setStdinPayload()`. Default returns null (no piped input),
// matching the production behaviour outside of hook invocations.
// ---------------------------------------------------------------------------

interface StdinState {
  payload: string | null;
}
const STDIN_KEY = '__gobbiHookStdinPayload__';
function setStdinPayload(payload: object | null): void {
  (globalThis as unknown as Record<string, StdinState>)[STDIN_KEY] = {
    payload: payload === null ? null : JSON.stringify(payload),
  };
}
function consumeStdinPayload(): string | null {
  const entry = (globalThis as unknown as Record<string, StdinState | undefined>)[STDIN_KEY];
  const raw = entry?.payload ?? null;
  // One-shot: clear after consume so subsequent reads in the same chain
  // see null (matching the drained-stdin behaviour in production).
  if (entry !== undefined) entry.payload = null;
  return raw;
}
mock.module('../../lib/stdin.js', () => ({
  readStdin: async (): Promise<string | null> => consumeStdinPayload(),
  readStdinJson: async <T,>(): Promise<T | null> => {
    const raw = consumeStdinPayload();
    if (raw === null || raw.trim() === '') return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
}));

import { runHook, runHookWithRegistry, HOOK_COMMANDS } from '../../commands/hook.js';
import { runHookSessionStart } from '../../commands/hook/session-start.js';

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
let origStdinIsTTY: boolean | undefined;

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
// Shared scratch repo
// ---------------------------------------------------------------------------

let scratchRepo: string | null = null;
let origCwd: string | null = null;
const ORIG_ENV: Readonly<Record<string, string | undefined>> = {
  CLAUDE_SESSION_ID: process.env['CLAUDE_SESSION_ID'],
  CLAUDE_TRANSCRIPT_PATH: process.env['CLAUDE_TRANSCRIPT_PATH'],
  CLAUDE_CWD: process.env['CLAUDE_CWD'],
  CLAUDE_HOOK_EVENT_NAME: process.env['CLAUDE_HOOK_EVENT_NAME'],
  CLAUDE_PROJECT_DIR: process.env['CLAUDE_PROJECT_DIR'],
  CLAUDE_PLUGIN_ROOT: process.env['CLAUDE_PLUGIN_ROOT'],
  CLAUDE_PLUGIN_DATA: process.env['CLAUDE_PLUGIN_DATA'],
  CLAUDE_ENV_FILE: process.env['CLAUDE_ENV_FILE'],
};

beforeAll(() => {
  origCwd = process.cwd();
  scratchRepo = mkdtempSync(join(tmpdir(), 'gobbi-hook-feat-'));
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
  const gobbiDir = join(scratchRepo, '.gobbi');
  if (existsSync(gobbiDir)) {
    rmSync(gobbiDir, { recursive: true, force: true });
  }
  if (process.cwd() !== scratchRepo) {
    process.chdir(scratchRepo);
  }
  setGlobalScratch(scratchRepo);
  return scratchRepo;
}

beforeEach(() => {
  resetCapture();
  origStdoutWrite = process.stdout.write;
  origStderrWrite = process.stderr.write;
  origLog = console.log;
  origExit = process.exit;

  // Mock process.stdin.isTTY = true so `readStdin` returns null
  // immediately rather than listening for piped data (which would hang
  // forever inside bun:test where stdin is the test runner's internal
  // stream). Production hook handlers always run with piped JSON from
  // Claude Code, so this only affects tests.
  origStdinIsTTY = process.stdin.isTTY;
  Object.defineProperty(process.stdin, 'isTTY', {
    configurable: true,
    value: true,
  });

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

  // Default — clear ambient CLAUDE_* env between tests so leakage from
  // sibling tests doesn't change the env-file body. Each test sets the
  // env vars it needs.
  delete process.env['CLAUDE_SESSION_ID'];
  delete process.env['CLAUDE_TRANSCRIPT_PATH'];
  delete process.env['CLAUDE_CWD'];
  delete process.env['CLAUDE_HOOK_EVENT_NAME'];
  delete process.env['CLAUDE_PROJECT_DIR'];
  delete process.env['CLAUDE_PLUGIN_ROOT'];
  delete process.env['CLAUDE_PLUGIN_DATA'];
  delete process.env['CLAUDE_ENV_FILE'];

  // Default — no queued stdin payload. Tests that exercise the stdin-fed
  // chain call `setStdinPayload({...})` explicitly.
  setStdinPayload(null);
});

afterEach(() => {
  process.stdout.write = origStdoutWrite;
  process.stderr.write = origStderrWrite;
  console.log = origLog;
  process.exit = origExit;

  // Restore process.stdin.isTTY to whatever bun:test had it set to.
  Object.defineProperty(process.stdin, 'isTTY', {
    configurable: true,
    value: origStdinIsTTY,
  });

  // Restore original env from baseline snapshot (prevents leakage into
  // sibling test files).
  for (const [name, original] of Object.entries(ORIG_ENV)) {
    if (original !== undefined) {
      process.env[name] = original;
    } else {
      delete process.env[name];
    }
  }
});

// ===========================================================================
// HOOK-1: session-start chain — env file persisted + workflow init succeeds
// ===========================================================================

describe('HOOK-1: gobbi hook session-start chains config env + workflow init', () => {
  test('HOOK-1: stdin payload via runHookSessionStart populates env file + creates session dir', async () => {
    const repo = makeScratchRepo();
    const envFile = join(repo, 'claude-env-hook-1.txt');
    process.env['CLAUDE_ENV_FILE'] = envFile;
    process.env['CLAUDE_PROJECT_DIR'] = repo;

    // Feed a synthetic SessionStart payload through the mocked
    // `readStdinJson`. The full chain runs end-to-end:
    //   1. parseHookEnvPayload narrows the JSON to HookEnvPayload
    //   2. session-start.ts sets process.env.CLAUDE_SESSION_ID from
    //      payload.session_id
    //   3. runConfigEnv writes CLAUDE_* lines (stdin-derived + native
    //      passthrough) to $CLAUDE_ENV_FILE
    //   4. runInitWithOptions resolves session id from env and creates
    //      the session directory
    setStdinPayload({
      session_id: 'hook-1-sess',
      transcript_path: '/tmp/hook-1-transcript.jsonl',
      cwd: repo,
      hook_event_name: 'SessionStart',
    });

    await captureExit(async () => {
      await runHookSessionStart([]);
    });
    // Hook contract — must always exit 0 (never call process.exit).
    expect(captured.exitCode).toBeNull();

    // The env file must be written with every CLAUDE_* line derived from
    // the stdin payload + native passthrough. This is the assertion the
    // file-header docstring promises HOOK-1 covers.
    expect(existsSync(envFile)).toBe(true);
    const body = readFileSync(envFile, 'utf8');
    expect(body).toContain('CLAUDE_SESSION_ID=hook-1-sess\n');
    expect(body).toContain('CLAUDE_TRANSCRIPT_PATH=/tmp/hook-1-transcript.jsonl\n');
    expect(body).toContain(`CLAUDE_CWD=${repo}\n`);
    expect(body).toContain('CLAUDE_HOOK_EVENT_NAME=SessionStart\n');
    expect(body).toContain(`CLAUDE_PROJECT_DIR=${repo}\n`);

    // workflow init created the session directory and metadata.json.
    const projectName = basename(repo);
    const metaPath = join(
      sessionDirForProject(repo, projectName, 'hook-1-sess'),
      'metadata.json',
    );
    expect(existsSync(metaPath)).toBe(true);
    const meta = JSON.parse(readFileSync(metaPath, 'utf8')) as {
      readonly sessionId: string;
      readonly projectName: string;
    };
    expect(meta.sessionId).toBe('hook-1-sess');
    expect(meta.projectName).toBe(projectName);
  });
});

// ===========================================================================
// HOOK-2: pre-tool-use chain — guard invocation, fail-open allow
// ===========================================================================

describe('HOOK-2: gobbi hook pre-tool-use chains workflow guard', () => {
  test('HOOK-2: missing session yields fail-open allow JSON on stdout', async () => {
    makeScratchRepo();

    // No session directory exists in the scratch repo. guard's resolveSessionDir
    // returns null → emitAllow() is the fail-open default.
    const { runHookPreToolUse } = await import('../../commands/hook/pre-tool-use.js');
    await captureExit(async () => {
      await runHookPreToolUse([]);
    });
    expect(captured.exitCode).toBeNull();
    // Even with no payload (TTY null + guard's `!isPreToolUsePayload` fallback),
    // guard emits allow JSON. Confirms the chain reached guard.
    expect(captured.stdout).toContain('"hookEventName":"PreToolUse"');
    expect(captured.stdout).toContain('"permissionDecision":"allow"');
  });
});

// ===========================================================================
// HOOK-3: generic stub session-end — silent exit 0, no file writes
// ===========================================================================

describe('HOOK-3: gobbi hook session-end (stub) drains stdin and exits 0', () => {
  test('HOOK-3: stub body returns without writing files or stdout', async () => {
    const repo = makeScratchRepo();
    const envFile = join(repo, 'env-file-hook-3.txt');
    process.env['CLAUDE_ENV_FILE'] = envFile;

    const { runHookSessionEnd } = await import('../../commands/hook/session-end.js');
    await captureExit(async () => {
      await runHookSessionEnd([]);
    });
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe('');
    expect(captured.stderr).toBe('');
    // Stub does NOT write the env file (notify dispatch is PR-FIN-1d).
    expect(existsSync(envFile)).toBe(false);
  });
});

// ===========================================================================
// HOOK-4: unknown subcommand exits 1 + help text
// ===========================================================================

describe('HOOK-4: unknown subcommand exits 1 with help text', () => {
  test('HOOK-4: gobbi hook bogus exits 1 + stderr includes "Unknown subcommand"', async () => {
    makeScratchRepo();
    await captureExit(async () => {
      await runHook(['bogus']);
    });
    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('Unknown subcommand: bogus');
    // Help text is rendered via console.log in the dispatcher's --help path,
    // and process.stderr.write in the unknown path. Both go to our captured
    // streams; the unknown branch writes the help text to stderr.
    expect(captured.stderr).toContain('session-start');
  });
});

// ===========================================================================
// HOOK-5: --help renders all 28 subcommand names
// ===========================================================================

describe('HOOK-5: gobbi hook --help renders all 28 subcommands', () => {
  test('HOOK-5: every registered hook event name appears in help output', async () => {
    makeScratchRepo();
    await captureExit(async () => {
      await runHookWithRegistry(['--help'], HOOK_COMMANDS);
    });
    expect(captured.exitCode).toBeNull();
    // The dispatcher writes help via console.log in this branch — captured
    // into captured.stdout by the console.log mock above.
    expect(HOOK_COMMANDS).toHaveLength(28);
    for (const cmd of HOOK_COMMANDS) {
      expect(captured.stdout).toContain(cmd.name);
    }
  });
});

// ===========================================================================
// HOOK-6: End-to-end session-start with payload override
// ===========================================================================
//
// Exercises the full chain when called from in-process: parse payload →
// set env → write env file → call workflow init. We skip stdin by
// importing `runConfigEnv` + `runInitWithOptions` directly, but the
// integration shape mirrors what `runHookSessionStart` does. The
// canonical end-to-end version uses `runHookSessionStart([])` and
// relies on the process.env CLAUDE_SESSION_ID fallback (since
// bun:test's stdin is TTY).

describe('HOOK-6: end-to-end SessionStart chain', () => {
  test('HOOK-6: env file lines + session dir both materialise', async () => {
    const repo = makeScratchRepo();
    const envFile = join(repo, 'env-file-hook-6.txt');
    process.env['CLAUDE_ENV_FILE'] = envFile;
    process.env['CLAUDE_PROJECT_DIR'] = repo;

    // Set CLAUDE_SESSION_ID directly because bun:test's stdin is TTY,
    // so runHookSessionStart's readStdinJson returns null and the
    // payload extraction yields an empty object — we'd never set
    // CLAUDE_SESSION_ID otherwise. Real Claude Code passes session_id
    // via stdin JSON; we simulate via env here.
    process.env['CLAUDE_SESSION_ID'] = 'hook-6-sess';

    await captureExit(async () => {
      await runHookSessionStart([]);
    });
    expect(captured.exitCode).toBeNull();
    // `ensureSettingsCascade` may write info lines to stderr (e.g.,
    // `[ensure-settings-cascade] seeded .gobbi/settings.json`). The
    // hook entrypoint itself MUST NOT emit any error line — assert no
    // `gobbi hook session-start: ` prefix appears.
    expect(captured.stderr).not.toContain('gobbi hook session-start:');

    // Env file: only the native passthrough vars present in env get
    // persisted — stdin payload is empty in TTY mode. CLAUDE_PROJECT_DIR
    // is set above and should appear.
    expect(existsSync(envFile)).toBe(true);
    const body = readFileSync(envFile, 'utf8');
    expect(body).toContain(`CLAUDE_PROJECT_DIR=${repo}\n`);

    // Session dir created by workflow init.
    const projectName = basename(repo);
    const metaPath = join(
      sessionDirForProject(repo, projectName, 'hook-6-sess'),
      'metadata.json',
    );
    expect(existsSync(metaPath)).toBe(true);
    const meta = JSON.parse(readFileSync(metaPath, 'utf8')) as {
      readonly sessionId: string;
    };
    expect(meta.sessionId).toBe('hook-6-sess');
  });
});
