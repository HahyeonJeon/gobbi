/**
 * Unit tests for `gobbi maintenance wipe-legacy-sessions` — the registry
 * wiring, subcommand dispatch, and the command body itself.
 *
 * Covers:
 *   - Top-level registry: `maintenance` appears in `COMMAND_ORDER` and
 *     `COMMANDS_BY_NAME`.
 *   - Subcommand registry: `wipe-legacy-sessions` appears in
 *     `MAINTENANCE_COMMANDS`.
 *   - Dispatcher: `--help` lists subcommands; unknown subcommand exits 1.
 *   - Happy path: every legacy session is deleted; `.gobbi/projects/`
 *     is never touched, even when a per-project session exists there.
 *   - `--dry-run`: prints the plan and deletes nothing.
 *   - Summary line: `"N session(s) wiped"`.
 *
 * Post-PR-FIN-2a-i T-2a.1.5: the active-session guard was removed.
 * The wipe is now an unconditional `rm -rf .gobbi/sessions/<id>/` for
 * every legacy directory; tests that asserted the refusal path were
 * deleted alongside the helpers.
 *
 * All tests operate against scratch directories in the OS temp dir.
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

import { COMMAND_ORDER, COMMANDS_BY_NAME } from '../../../cli.js';
import {
  MAINTENANCE_COMMANDS,
  runMaintenanceWithRegistry,
  type MaintenanceCommand,
} from '../../maintenance.js';
import {
  renderSummary,
  runWipeLegacySessionsWithOptions,
} from '../wipe-legacy-sessions.js';

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
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-wipe-legacy-'));
  scratchDirs.push(dir);
  return dir;
}

/** Seed a legacy session directory; the contents do not matter for the
 *  unconditional wipe (T-2a.1.5 dropped the state.json reads). A marker
 *  file is written so each scratch directory is non-empty and the
 *  recursive delete has something tangible to remove. */
function seedLegacy(repo: string, sessionId: string): string {
  const dir = join(repo, '.gobbi', 'sessions', sessionId);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'marker'), sessionId, 'utf8');
  return dir;
}

function seedProject(
  repo: string,
  projectName: string,
  sessionId: string,
): string {
  const dir = join(
    repo,
    '.gobbi',
    'projects',
    projectName,
    'sessions',
    sessionId,
  );
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'marker'), sessionId, 'utf8');
  return dir;
}

// ===========================================================================
// Registry presence
// ===========================================================================

describe('top-level registry', () => {
  test('`maintenance` is registered in COMMAND_ORDER and COMMANDS_BY_NAME', () => {
    expect(COMMAND_ORDER).toContain('maintenance');
    expect(COMMANDS_BY_NAME.maintenance.name).toBe('maintenance');
    expect(COMMANDS_BY_NAME.maintenance.summary.length).toBeGreaterThan(0);
  });
});

describe('MAINTENANCE_COMMANDS', () => {
  test('exposes `wipe-legacy-sessions` with a non-empty summary', () => {
    const names = MAINTENANCE_COMMANDS.map((c) => c.name);
    expect(names).toContain('wipe-legacy-sessions');
    for (const cmd of MAINTENANCE_COMMANDS) {
      expect(cmd.name.length).toBeGreaterThan(0);
      expect(cmd.summary.length).toBeGreaterThan(0);
    }
  });
});

// ===========================================================================
// Dispatcher
// ===========================================================================

describe('runMaintenanceWithRegistry — help', () => {
  test('--help lists every registered subcommand', async () => {
    const registry: MaintenanceCommand[] = [
      {
        name: 'alpha',
        summary: 'stub alpha',
        run: async (): Promise<void> => undefined,
      },
      {
        name: 'beta',
        summary: 'stub beta',
        run: async (): Promise<void> => undefined,
      },
    ];
    await captureExit(() => runMaintenanceWithRegistry(['--help'], registry));
    expect(captured.stdout).toContain('alpha');
    expect(captured.stdout).toContain('stub alpha');
    expect(captured.stdout).toContain('beta');
  });

  test('empty args produces help output', async () => {
    await captureExit(() =>
      runMaintenanceWithRegistry([], MAINTENANCE_COMMANDS),
    );
    expect(captured.stdout).toContain('Usage: gobbi maintenance');
    expect(captured.stdout).toContain('wipe-legacy-sessions');
  });
});

describe('runMaintenanceWithRegistry — dispatch', () => {
  test('unknown subcommand exits 1 with error line on stderr', async () => {
    await captureExit(() =>
      runMaintenanceWithRegistry(['nope'], MAINTENANCE_COMMANDS),
    );
    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('Unknown subcommand: nope');
    expect(captured.stderr).toContain('wipe-legacy-sessions');
  });

  test('routes to matching registry entry and forwards trailing args', async () => {
    const state: { ran?: boolean; args?: string[] } = {};
    const registry: MaintenanceCommand[] = [
      {
        name: 'foo',
        summary: 'stub',
        run: async (args: string[]): Promise<void> => {
          state.ran = true;
          state.args = args;
        },
      },
    ];
    await captureExit(() =>
      runMaintenanceWithRegistry(['foo', '--x', '1'], registry),
    );
    expect(state.ran).toBe(true);
    expect(state.args).toEqual(['--x', '1']);
  });
});

// ===========================================================================
// Happy path: deletes every legacy session unconditionally
// ===========================================================================

describe('runWipeLegacySessions — deletes every legacy session', () => {
  test('deletes every legacy session and reports N wiped', async () => {
    const repo = makeRepo();
    const a = seedLegacy(repo, 'one');
    const b = seedLegacy(repo, 'two');
    const c = seedLegacy(repo, 'three');

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    expect(existsSync(a)).toBe(false);
    expect(existsSync(b)).toBe(false);
    expect(existsSync(c)).toBe(false);

    // Summary reflects the 3 deletions.
    expect(captured.stdout).toContain('3 sessions wiped');
  });

  test('does NOT touch .gobbi/projects/ even when it contains sessions', async () => {
    const repo = makeRepo();
    seedLegacy(repo, 'legacy');
    const projectSession = seedProject(repo, 'foo', 'live');

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    expect(existsSync(join(repo, '.gobbi', 'sessions', 'legacy'))).toBe(false);
    // Per-project session still present — out of scope for this command,
    // intentionally.
    expect(existsSync(projectSession)).toBe(true);
  });

  test('no legacy sessions on disk → exits 0 with zero wiped summary', async () => {
    const repo = makeRepo();
    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('0 sessions wiped');
  });

  test('singular pluralization for exactly one session', async () => {
    const repo = makeRepo();
    seedLegacy(repo, 'only');
    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('1 session wiped');
  });

  test('wipes regardless of state.json contents (no guard post-T-2a.1.5)', async () => {
    // Seed a session whose state.json claims it is mid-flight; under the
    // pre-T-2a.1.5 design this would have blocked the wipe. After dropping
    // the active-sessions helpers, the wipe deletes it unconditionally.
    const repo = makeRepo();
    const dir = seedLegacy(repo, 'mid-flight');
    writeFileSync(
      join(dir, 'state.json'),
      JSON.stringify({ currentStep: 'execution' }),
      'utf8',
    );

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    expect(existsSync(dir)).toBe(false);
  });
});

// ===========================================================================
// --dry-run
// ===========================================================================

describe('runWipeLegacySessions — --dry-run', () => {
  test('prints planned deletions but deletes nothing', async () => {
    const repo = makeRepo();
    const a = seedLegacy(repo, 'one');
    const b = seedLegacy(repo, 'two');

    await captureExit(() =>
      runWipeLegacySessionsWithOptions(['--dry-run'], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('Would wipe');
    expect(captured.stdout).toContain('one');
    expect(captured.stdout).toContain('two');
    expect(captured.stdout).toContain('[dry-run]');
    expect(captured.stdout).toContain('2 sessions wiped');

    // Nothing deleted.
    expect(existsSync(a)).toBe(true);
    expect(existsSync(b)).toBe(true);
  });
});

// ===========================================================================
// Helpers (renderers)
// ===========================================================================

describe('renderSummary', () => {
  test('singular form when wiped is 1', () => {
    const out = renderSummary({ wiped: 1, dryRun: false });
    expect(out).toBe('1 session wiped\n');
  });

  test('plural form when wiped is not 1', () => {
    const out = renderSummary({ wiped: 0, dryRun: false });
    expect(out).toBe('0 sessions wiped\n');
  });

  test('dry-run prefix', () => {
    const out = renderSummary({ wiped: 3, dryRun: true });
    expect(out.startsWith('[dry-run] ')).toBe(true);
  });
});
