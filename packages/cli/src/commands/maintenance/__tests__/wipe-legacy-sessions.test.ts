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
 *   - Refusal path: ANY active legacy session causes exit 1 and the
 *     protected session id + currentStep appear on stderr.
 *   - Happy path: inactive legacy sessions are deleted; `.gobbi/projects/`
 *     is never touched, even when a per-project session is active.
 *   - `--dry-run`: prints the plan and deletes nothing.
 *   - Summary line: `"N session(s) wiped"` (no "protected" clause — the
 *     refuse-all safety model means the clause would always be 0).
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
  renderActiveLegacyError,
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

function seedLegacy(
  repo: string,
  sessionId: string,
  currentStep: string,
): string {
  const dir = join(repo, '.gobbi', 'sessions', sessionId);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, 'state.json'),
    JSON.stringify({
      schemaVersion: 4,
      sessionId,
      currentStep,
      currentSubstate: null,
      completedSteps: [],
      evalConfig: { ideation: false, plan: false },
      activeSubagents: [],
      artifacts: {},
      violations: [],
      feedbackRound: 0,
      maxFeedbackRounds: 3,
      lastVerdictOutcome: null,
      verificationResults: {},
    }),
    'utf8',
  );
  return dir;
}

function seedProject(
  repo: string,
  projectName: string,
  sessionId: string,
  currentStep: string,
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
  writeFileSync(
    join(dir, 'state.json'),
    JSON.stringify({
      schemaVersion: 4,
      sessionId,
      currentStep,
      currentSubstate: null,
      completedSteps: [],
      evalConfig: { ideation: false, plan: false },
      activeSubagents: [],
      artifacts: {},
      violations: [],
      feedbackRound: 0,
      maxFeedbackRounds: 3,
      lastVerdictOutcome: null,
      verificationResults: {},
    }),
    'utf8',
  );
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
// Refusal path: active legacy session blocks wipe
// ===========================================================================

describe('runWipeLegacySessions — refuses when a legacy session is active', () => {
  test('exit 1 + stderr lists the protected session id, currentStep, and path', async () => {
    const repo = makeRepo();
    const activeDir = seedLegacy(repo, 'active-plan', 'plan');
    const terminalDir = seedLegacy(repo, 'finished', 'done');

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('active-plan');
    expect(captured.stderr).toContain('currentStep: plan');
    expect(captured.stderr).toContain(activeDir);
    expect(captured.stderr).toContain('Options:');

    // Nothing deleted — neither the active nor the terminal session.
    expect(existsSync(activeDir)).toBe(true);
    expect(existsSync(terminalDir)).toBe(true);
  });

  test('exit 1 lists every active legacy session', async () => {
    const repo = makeRepo();
    seedLegacy(repo, 'active-a', 'ideation');
    seedLegacy(repo, 'active-b', 'execution');
    seedLegacy(repo, 'finished', 'done');

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('active-a');
    expect(captured.stderr).toContain('active-b');
    // Terminal session should not appear in the refusal output.
    expect(captured.stderr).not.toContain('finished');
  });

  test('missing state.json also blocks (protect by default)', async () => {
    const repo = makeRepo();
    const dir = join(repo, '.gobbi', 'sessions', 'no-state');
    mkdirSync(dir, { recursive: true });
    // No state.json — conservative rule protects it.

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('no-state');
    expect(existsSync(dir)).toBe(true);
  });

  test('active session in the per-project layer does NOT block the wipe', async () => {
    const repo = makeRepo();
    seedLegacy(repo, 'finished', 'done');
    // Active session in the new layer — must be ignored by the wipe
    // refusal (the wipe never touches .gobbi/projects/).
    const projectSession = seedProject(repo, 'foo', 'live', 'execution');

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );

    // No refusal — wipe proceeded successfully.
    expect(captured.exitCode).toBeNull();
    // Legacy terminal session was deleted.
    expect(
      existsSync(join(repo, '.gobbi', 'sessions', 'finished')),
    ).toBe(false);
    // Project session was left strictly alone.
    expect(existsSync(projectSession)).toBe(true);
  });
});

// ===========================================================================
// Happy path: deletes only inactive legacy sessions
// ===========================================================================

describe('runWipeLegacySessions — deletes inactive legacy sessions', () => {
  test('deletes every terminal session and reports N wiped', async () => {
    const repo = makeRepo();
    const done = seedLegacy(repo, 'done-1', 'done');
    const errored = seedLegacy(repo, 'err-1', 'error');
    const another = seedLegacy(repo, 'done-2', 'done');

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    expect(existsSync(done)).toBe(false);
    expect(existsSync(errored)).toBe(false);
    expect(existsSync(another)).toBe(false);

    // Summary reflects the 3 deletions.
    expect(captured.stdout).toContain('3 sessions wiped');
  });

  test('does NOT touch .gobbi/projects/ even when it contains terminal sessions', async () => {
    const repo = makeRepo();
    seedLegacy(repo, 'legacy-done', 'done');
    const terminalProject = seedProject(repo, 'foo', 'also-done', 'done');

    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    expect(
      existsSync(join(repo, '.gobbi', 'sessions', 'legacy-done')),
    ).toBe(false);
    // Per-project terminal session still present — out of scope for this
    // command, intentionally.
    expect(existsSync(terminalProject)).toBe(true);
  });

  test('no legacy sessions on disk → exits 0 with zero wiped summary', async () => {
    const repo = makeRepo();
    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('0 sessions wiped');
    // No "protected" clause under the refuse-all safety model.
    expect(captured.stdout).not.toContain('protected');
  });

  test('singular pluralization for exactly one session', async () => {
    const repo = makeRepo();
    seedLegacy(repo, 'only', 'done');
    await captureExit(() =>
      runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('1 session wiped');
  });
});

// ===========================================================================
// --dry-run
// ===========================================================================

describe('runWipeLegacySessions — --dry-run', () => {
  test('prints planned deletions but deletes nothing', async () => {
    const repo = makeRepo();
    const done = seedLegacy(repo, 'done-1', 'done');
    const errored = seedLegacy(repo, 'err-1', 'error');

    await captureExit(() =>
      runWipeLegacySessionsWithOptions(['--dry-run'], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('Would wipe');
    expect(captured.stdout).toContain('done-1');
    expect(captured.stdout).toContain('err-1');
    expect(captured.stdout).toContain('[dry-run]');
    expect(captured.stdout).toContain('2 sessions wiped');

    // Nothing deleted.
    expect(existsSync(done)).toBe(true);
    expect(existsSync(errored)).toBe(true);
  });

  test('--dry-run + active legacy session still exits 1 (refusal wins)', async () => {
    const repo = makeRepo();
    const activeDir = seedLegacy(repo, 'active-1', 'plan');

    await captureExit(() =>
      runWipeLegacySessionsWithOptions(['--dry-run'], { repoRoot: repo }),
    );

    expect(captured.exitCode).toBe(1);
    expect(existsSync(activeDir)).toBe(true);
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

  test('refuse-all model does not emit a "protected" clause', () => {
    // Under the refuse-all safety model the summary is only ever
    // rendered when no legacy session is active — reporting a
    // "protected" count would always read 0. The clause is omitted
    // entirely rather than kept as a dead field.
    const out = renderSummary({ wiped: 5, dryRun: false });
    expect(out).not.toContain('protected');
    expect(out).not.toContain('active');
  });

  test('dry-run prefix', () => {
    const out = renderSummary({ wiped: 3, dryRun: true });
    expect(out.startsWith('[dry-run] ')).toBe(true);
  });
});

describe('renderActiveLegacyError', () => {
  test('includes one block per active session + one Options block', () => {
    const msg = renderActiveLegacyError([
      {
        sessionId: 'one',
        sessionDir: '/tmp/sessions/one',
        projectName: null,
        currentStep: 'plan',
      },
      {
        sessionId: 'two',
        sessionDir: '/tmp/sessions/two',
        projectName: null,
        currentStep: null,
      },
    ]);
    expect(msg).toContain('Active legacy session: one');
    expect(msg).toContain('currentStep: plan');
    expect(msg).toContain('path: /tmp/sessions/one');
    expect(msg).toContain('Active legacy session: two');
    expect(msg).toContain('currentStep: (missing or malformed state.json)');

    // Exactly one Options block.
    const occurrences = msg.split('Options:').length - 1;
    expect(occurrences).toBe(1);
  });
});
