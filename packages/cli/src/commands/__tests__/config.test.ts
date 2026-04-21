/**
 * Unit tests for `gobbi config` — Wave C.1 rewrite.
 *
 * Coverage:
 *
 *   - `coerceValue` exhaustive: booleans, null, numbers (int / decimal /
 *     signed / leading-zero reject), JSON arrays + objects, fallthrough
 *     to string, `SyntaxError` on malformed JSON.
 *   - `runConfig` top-level dispatch: `--help`, `-h`, absent verb,
 *     unknown verb exit-2 diagnostic.
 *   - `runConfig` verb-help: `get --help` and `set --help` emit
 *     verb-scoped usage to stdout.
 *   - `runConfig get`: missing `<key>` exit 2; cascade resolve of a
 *     default key emits the default; cascade miss emits nothing and
 *     exit 1; explicit `--level project` on a fresh repo (no file) exits
 *     1 silently.
 *   - `runConfig set`: missing args exit 2; invalid enum value exits 2
 *     with validator errors on stderr; `--level workspace` + JSON-array
 *     value round-trips through the AJV validator and lands in the
 *     atomic write at the expected path; `--level session` without any
 *     session-id source exits 2.
 *   - Registry presence: `config` is wired in `COMMANDS_BY_NAME` and
 *     `COMMAND_ORDER`, so the top-level dispatcher can resolve it.
 *
 * Feature-level tests for the full CLI matrix land in Wave D.2
 * (`__tests__/features/gobbi-config.test.ts`).
 */

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'bun:test';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { COMMAND_ORDER, COMMANDS_BY_NAME } from '../../cli.js';
import { coerceValue, runConfig } from '../config.js';

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
// Scratch-repo helpers — ONE hermetic git repo reused across every test that
// touches disk. `lib/repo.ts::getRepoRoot` memoizes the result of
// `git rev-parse --show-toplevel` on first call; subsequent calls ignore
// `process.chdir()`. Creating a fresh tmp-repo per test would race against
// that cache. Instead we create a single tmp-repo in `beforeAll`, chdir
// into it before any config call runs, and `rm -rf` its `.gobbi/` between
// tests so every test starts from a clean cascade.
// ---------------------------------------------------------------------------

let scratchRepo: string | null = null;
let origCwd: string | null = null;

beforeAll(() => {
  origCwd = process.cwd();
  scratchRepo = mkdtempSync(join(tmpdir(), 'gobbi-config-'));
  execSync('git init -q', { cwd: scratchRepo });
  process.chdir(scratchRepo);
});

afterAll(() => {
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

/**
 * Ensure we are inside the shared scratch repo and its `.gobbi/` directory
 * is fresh. Call at the top of every test that reads / writes settings
 * files; the reset is a cheap `rm -rf` of `.gobbi/`, not a new repo.
 */
function makeScratchRepo(): string {
  if (scratchRepo === null) {
    throw new Error('beforeAll did not initialize scratchRepo');
  }
  // Reset `.gobbi/` so each test starts from an empty cascade.
  const gobbiDir = join(scratchRepo, '.gobbi');
  if (existsSync(gobbiDir)) {
    rmSync(gobbiDir, { recursive: true, force: true });
  }
  // Make sure we are inside the scratch repo — prior tests might have
  // chdir'd elsewhere.
  if (process.cwd() !== scratchRepo) {
    process.chdir(scratchRepo);
  }
  return scratchRepo;
}

// ===========================================================================
// coerceValue — pure unit tests
// ===========================================================================

describe('coerceValue', () => {
  test('"true" / "false" coerce to booleans', () => {
    expect(coerceValue('true')).toBe(true);
    expect(coerceValue('false')).toBe(false);
  });

  test('"null" coerces to null', () => {
    expect(coerceValue('null')).toBeNull();
  });

  test('integer strings coerce to number', () => {
    expect(coerceValue('60000')).toBe(60000);
    expect(coerceValue('0')).toBe(0);
    expect(coerceValue('-42')).toBe(-42);
  });

  test('decimal strings coerce to number', () => {
    expect(coerceValue('3.14')).toBe(3.14);
    expect(coerceValue('-0.5')).toBe(-0.5);
  });

  test('leading-zero numeric-looking strings fall through to string', () => {
    // Preserve zero-padded ids (e.g. "007") as strings — `Number` would
    // silently lose the padding.
    expect(coerceValue('007')).toBe('007');
    expect(coerceValue('01')).toBe('01');
  });

  test('hex / exponential numeric forms fall through to string', () => {
    // Defensive: only plain decimal is treated as number.
    expect(coerceValue('0x1f')).toBe('0x1f');
    expect(coerceValue('1e10')).toBe('1e10');
  });

  test('leading-[ coerces to JSON array', () => {
    expect(coerceValue('["a","b"]')).toEqual(['a', 'b']);
    expect(coerceValue('[]')).toEqual([]);
    expect(coerceValue('  [1, 2, 3]')).toEqual([1, 2, 3]);
  });

  test('leading-{ coerces to JSON object', () => {
    expect(coerceValue('{"k":1}')).toEqual({ k: 1 });
    expect(coerceValue('{}')).toEqual({});
  });

  test('invalid JSON after leading [ / { throws SyntaxError', () => {
    expect(() => coerceValue('[bad json')).toThrow();
    expect(() => coerceValue('{not: valid')).toThrow();
  });

  test('plain strings pass through verbatim', () => {
    expect(coerceValue('hello')).toBe('hello');
    expect(coerceValue('main')).toBe('main');
    expect(coerceValue('agent')).toBe('agent');
    expect(coerceValue('')).toBe('');
  });
});

// ===========================================================================
// Top-level dispatch — runConfig argv
// ===========================================================================

describe('runConfig top-level dispatch', () => {
  test('no verb prints usage to stdout and returns (exit unchanged)', async () => {
    await captureExit(async () => {
      await runConfig([]);
    });
    expect(captured.stdout).toContain('Usage: gobbi config <verb> [options]');
    expect(captured.stdout).toContain('get <key>');
    expect(captured.stdout).toContain('set <key> <value>');
    expect(captured.stderr).toBe('');
    expect(captured.exitCode).toBeNull();
  });

  test('--help prints usage to stdout', async () => {
    await captureExit(async () => {
      await runConfig(['--help']);
    });
    expect(captured.stdout).toContain('Usage: gobbi config <verb> [options]');
    expect(captured.stderr).toBe('');
  });

  test('-h prints usage to stdout', async () => {
    await captureExit(async () => {
      await runConfig(['-h']);
    });
    expect(captured.stdout).toContain('Usage: gobbi config <verb> [options]');
  });

  test('unknown verb writes diagnostic to stderr and exits 2', async () => {
    await captureExit(async () => {
      await runConfig(['delete', 'something']);
    });
    expect(captured.stderr).toContain('unknown verb "delete"');
    expect(captured.exitCode).toBe(2);
  });
});

// ===========================================================================
// Verb-scoped help
// ===========================================================================

describe('runConfig verb-scoped help', () => {
  test('get --help prints get-specific usage', async () => {
    await captureExit(async () => {
      await runConfig(['get', '--help']);
    });
    expect(captured.stdout).toContain(
      'Usage: gobbi config get <key> [--level',
    );
    expect(captured.stdout).toContain('cascade-resolved value');
    expect(captured.stderr).toBe('');
  });

  test('set --help prints set-specific usage', async () => {
    await captureExit(async () => {
      await runConfig(['set', '--help']);
    });
    expect(captured.stdout).toContain(
      'Usage: gobbi config set <key> <value> [--level',
    );
    expect(captured.stdout).toContain('Value coercion');
    expect(captured.stderr).toBe('');
  });
});

// ===========================================================================
// Registry presence — `config` is wired into the top-level dispatcher
// ===========================================================================

describe('registry', () => {
  test('config is registered in COMMAND_ORDER and COMMANDS_BY_NAME', () => {
    expect(COMMAND_ORDER).toContain('config');
    expect(COMMANDS_BY_NAME.config.name).toBe('config');
    expect(typeof COMMANDS_BY_NAME.config.run).toBe('function');
  });
});

// ===========================================================================
// runConfig get — positional + flag validation
// ===========================================================================

describe('runConfig get argument validation', () => {
  test('missing <key> exits 2 with diagnostic', async () => {
    await captureExit(async () => {
      await runConfig(['get']);
    });
    expect(captured.stderr).toContain('missing required argument <key>');
    expect(captured.exitCode).toBe(2);
  });

  test('extra positional exits 2 with diagnostic', async () => {
    await captureExit(async () => {
      await runConfig(['get', 'schemaVersion', 'extra']);
    });
    expect(captured.stderr).toContain('unexpected extra arguments');
    expect(captured.exitCode).toBe(2);
  });

  test('invalid --level exits 2 with diagnostic', async () => {
    await captureExit(async () => {
      await runConfig(['get', 'schemaVersion', '--level', 'bogus']);
    });
    expect(captured.stderr).toContain(
      '--level must be one of workspace, project, session',
    );
    expect(captured.exitCode).toBe(2);
  });

  test('--level session without session-id exits 2 with diagnostic', async () => {
    const origEnv = process.env['CLAUDE_SESSION_ID'];
    delete process.env['CLAUDE_SESSION_ID'];
    try {
      await captureExit(async () => {
        await runConfig(['get', 'schemaVersion', '--level', 'session']);
      });
      expect(captured.stderr).toContain('requires CLAUDE_SESSION_ID env or --session-id');
      expect(captured.exitCode).toBe(2);
    } finally {
      if (origEnv !== undefined) process.env['CLAUDE_SESSION_ID'] = origEnv;
    }
  });
});

// ===========================================================================
// runConfig get — cascade + single-level reads against a scratch repo
// ===========================================================================

describe('runConfig get read paths', () => {
  test('cascade resolve returns the built-in default', async () => {
    makeScratchRepo();
    await captureExit(async () => {
      await runConfig(['get', 'workflow.ideation.discuss.mode']);
    });
    expect(captured.stdout).toBe('"user"\n');
    expect(captured.stderr).toBe('');
    expect(captured.exitCode).toBeNull();
  });

  test('cascade miss exits 1 with silent stdout', async () => {
    makeScratchRepo();
    await captureExit(async () => {
      await runConfig(['get', 'nonexistent.deeply.nested.key']);
    });
    expect(captured.stdout).toBe('');
    expect(captured.stderr).toBe('');
    expect(captured.exitCode).toBe(1);
  });

  test('--level workspace with no file exits 1 silently (no cascade fallthrough)', async () => {
    makeScratchRepo();
    await captureExit(async () => {
      // git.workflow.mode exists in DEFAULTS as 'direct-commit' but --level
      // workspace reads only the workspace file which does not exist.
      await runConfig(['get', 'git.workflow.mode', '--level', 'workspace']);
    });
    expect(captured.stdout).toBe('');
    expect(captured.exitCode).toBe(1);
  });

  test('subtree walk prints JSON for intermediate objects', async () => {
    makeScratchRepo();
    await captureExit(async () => {
      await runConfig(['get', 'workflow.ideation.discuss']);
    });
    // A subtree — parse and compare rather than relying on key ordering.
    const parsed = JSON.parse(captured.stdout.trim()) as unknown;
    expect(parsed).toEqual({ mode: 'user', model: 'auto', effort: 'auto' });
  });
});

// ===========================================================================
// runConfig set — argument validation + happy-path round-trip
// ===========================================================================

describe('runConfig set argument validation', () => {
  test('missing <key> <value> exits 2', async () => {
    await captureExit(async () => {
      await runConfig(['set']);
    });
    expect(captured.stderr).toContain('missing required arguments');
    expect(captured.exitCode).toBe(2);
  });

  test('missing <value> exits 2', async () => {
    await captureExit(async () => {
      await runConfig(['set', 'notify.slack.enabled']);
    });
    expect(captured.stderr).toContain('missing required arguments');
    expect(captured.exitCode).toBe(2);
  });

  test('--level session without session-id exits 2 with diagnostic', async () => {
    makeScratchRepo();
    const origEnv = process.env['CLAUDE_SESSION_ID'];
    delete process.env['CLAUDE_SESSION_ID'];
    try {
      await captureExit(async () => {
        // Default level is `session`, so no --level is enough to trigger.
        await runConfig(['set', 'notify.slack.enabled', 'true']);
      });
      expect(captured.stderr).toContain('requires CLAUDE_SESSION_ID env or --session-id');
      expect(captured.exitCode).toBe(2);
    } finally {
      if (origEnv !== undefined) process.env['CLAUDE_SESSION_ID'] = origEnv;
    }
  });

  test('invalid enum value exits 2 with AJV diagnostic', async () => {
    makeScratchRepo();
    await captureExit(async () => {
      await runConfig([
        'set',
        'workflow.ideation.discuss.mode',
        'NOT_A_VALID_ENUM',
        '--level',
        'workspace',
      ]);
    });
    expect(captured.stderr).toContain('validation failed');
    expect(captured.stderr).toContain('/workflow/ideation/discuss/mode');
    expect(captured.exitCode).toBe(2);
  });

  test('workspace set + get round-trips through the AJV validator', async () => {
    const repo = makeScratchRepo();
    await captureExit(async () => {
      await runConfig([
        'set',
        'workflow.ideation.discuss.mode',
        'agent',
        '--level',
        'workspace',
      ]);
    });
    expect(captured.exitCode).toBeNull();
    expect(captured.stderr).toBe('');

    const filePath = join(repo, '.gobbi', 'settings.json');
    expect(existsSync(filePath)).toBe(true);
    const parsed = JSON.parse(readFileSync(filePath, 'utf8')) as unknown;
    expect(parsed).toEqual({
      schemaVersion: 1,
      workflow: {
        ideation: {
          discuss: {
            mode: 'agent',
          },
        },
      },
    });

    // Reset captures and read it back.
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(async () => {
      await runConfig([
        'get',
        'workflow.ideation.discuss.mode',
        '--level',
        'workspace',
      ]);
    });
    expect(captured.stdout).toBe('"agent"\n');
    expect(captured.exitCode).toBeNull();
  });

  test('JSON-array value round-trips and validates', async () => {
    const repo = makeScratchRepo();
    await captureExit(async () => {
      await runConfig([
        'set',
        'notify.slack.events',
        '["workflow.complete","error"]',
        '--level',
        'workspace',
      ]);
    });
    expect(captured.exitCode).toBeNull();
    expect(captured.stderr).toBe('');

    const filePath = join(repo, '.gobbi', 'settings.json');
    const parsed = JSON.parse(readFileSync(filePath, 'utf8')) as {
      readonly notify: { readonly slack: { readonly events: readonly string[] } };
    };
    expect(parsed.notify.slack.events).toEqual(['workflow.complete', 'error']);
  });

  test('session write + session-id flag lands at sessions/<id>/settings.json', async () => {
    const repo = makeScratchRepo();
    await captureExit(async () => {
      await runConfig([
        'set',
        'workflow.plan.discuss.mode',
        'agent',
        '--session-id',
        'test-session',
      ]);
    });
    expect(captured.exitCode).toBeNull();
    expect(captured.stderr).toBe('');

    const filePath = join(repo, '.gobbi', 'sessions', 'test-session', 'settings.json');
    expect(existsSync(filePath)).toBe(true);
    const parsed = JSON.parse(readFileSync(filePath, 'utf8')) as {
      readonly workflow: { readonly plan: { readonly discuss: { readonly mode: string } } };
    };
    expect(parsed.workflow.plan.discuss.mode).toBe('agent');
  });

  test('set coerces numeric, boolean, null values', async () => {
    const repo = makeScratchRepo();
    // enabled: boolean
    await captureExit(async () => {
      await runConfig([
        'set',
        'notify.slack.enabled',
        'true',
        '--level',
        'workspace',
      ]);
    });
    expect(captured.exitCode).toBeNull();
    // channel: null explicit leaf
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(async () => {
      await runConfig([
        'set',
        'notify.slack.channel',
        'null',
        '--level',
        'workspace',
      ]);
    });
    expect(captured.exitCode).toBeNull();

    const filePath = join(repo, '.gobbi', 'settings.json');
    const parsed = JSON.parse(readFileSync(filePath, 'utf8')) as {
      readonly notify: { readonly slack: { readonly enabled: boolean; readonly channel: string | null } };
    };
    expect(parsed.notify.slack.enabled).toBe(true);
    expect(parsed.notify.slack.channel).toBeNull();
  });
});
