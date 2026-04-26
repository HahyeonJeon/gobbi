/**
 * Unit tests for the top-level `gobbi` dispatcher — registry shape,
 * `--help` rendering derived from the registry, unknown-command
 * handling, and extensibility smoke test.
 *
 * Mirrors the test shape in `commands/workflow/__tests__/dispatcher.test.ts`
 * — we pass a per-test registry to `runWithRegistry` rather than running
 * the real CLI (which would spawn a subprocess).
 */

import { describe, test, expect, beforeEach, afterEach } from 'bun:test';

import {
  runWithRegistry,
  renderHelp,
  TOP_LEVEL_COMMANDS,
  COMMANDS_BY_NAME,
  COMMAND_ORDER,
  type CommandDef,
  type CommandName,
} from '../cli.js';

// ---------------------------------------------------------------------------
// Console/process-exit hijack helpers — restore originals after each test.
// ---------------------------------------------------------------------------

interface Captured {
  stdout: string;
  stderr: string;
  exitCode: number | null;
}

type ProcessExit = (code?: number | string | null) => never;

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
  }) as ProcessExit;
});

afterEach(() => {
  process.stdout.write = origStdoutWrite;
  process.stderr.write = origStderrWrite;
  console.log = origLog;
  process.exit = origExit;
});

class ExitCalled extends Error {
  constructor(readonly code: number) {
    super(`process.exit(${code})`);
  }
}

async function captureExit(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (err) {
    if (err instanceof ExitCalled) return;
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Test fixtures — minimal registries for dispatcher behaviour.
// ---------------------------------------------------------------------------

function stub(
  name: string,
  result: { ran?: boolean; args?: string[] } = {},
): CommandDef {
  return {
    name,
    summary: `stub summary for ${name}`,
    run: async (args: string[]): Promise<void> => {
      result.ran = true;
      result.args = args;
    },
  };
}

// ===========================================================================
// Help rendering — derived from registry, not a hand-maintained string.
// ===========================================================================

describe('renderHelp — derivation from registry', () => {
  test('includes every registered command name and summary', () => {
    const registry: CommandDef[] = [
      stub('alpha'),
      stub('beta'),
      stub('gamma'),
    ];
    const help = renderHelp(registry);
    for (const cmd of registry) {
      expect(help).toContain(cmd.name);
      expect(help).toContain(cmd.summary);
    }
  });

  test('empty registry renders a usable help screen', () => {
    const help = renderHelp([]);
    expect(help).toContain('Usage: gobbi');
    expect(help).toContain('(no commands registered)');
  });

  test('preserves registry ordering in output', () => {
    const registry: CommandDef[] = [stub('zebra'), stub('alpha')];
    const help = renderHelp(registry);
    expect(help.indexOf('zebra')).toBeLessThan(help.indexOf('alpha'));
  });

  test('renders canonical TOP_LEVEL_COMMANDS with every name and summary', () => {
    const help = renderHelp(TOP_LEVEL_COMMANDS);
    for (const cmd of TOP_LEVEL_COMMANDS) {
      expect(help).toContain(cmd.name);
      expect(help).toContain(cmd.summary);
    }
  });
});

// ===========================================================================
// Command dispatch
// ===========================================================================

describe('runWithRegistry — dispatch', () => {
  test('routes to the matching registry entry and forwards trailing args', async () => {
    const state: { ran?: boolean; args?: string[] } = {};
    const registry: CommandDef[] = [stub('foo', state)];
    await captureExit(() =>
      runWithRegistry(['foo', '--flag', 'value'], registry),
    );
    expect(state.ran).toBe(true);
    expect(state.args).toEqual(['--flag', 'value']);
  });

  test('unknown command exits non-zero with an error line on stderr', async () => {
    const registry: CommandDef[] = [stub('only-known')];
    await captureExit(() =>
      runWithRegistry(['mystery-command'], registry),
    );
    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('Unknown command: mystery-command');
    // Help should still be included so users see what IS available.
    expect(captured.stderr).toContain('only-known');
    expect(captured.stderr).toContain('stub summary for only-known');
  });

  test('no command prints help to stdout and exits 0', async () => {
    const registry: CommandDef[] = [stub('foo')];
    await captureExit(() => runWithRegistry([], registry));
    expect(captured.exitCode).toBe(0);
    expect(captured.stdout).toContain('Usage: gobbi');
    expect(captured.stdout).toContain('foo');
  });

  test('--help prints help to stdout and exits 0', async () => {
    const registry: CommandDef[] = [stub('foo'), stub('bar')];
    await captureExit(() => runWithRegistry(['--help'], registry));
    expect(captured.exitCode).toBe(0);
    expect(captured.stdout).toContain('foo');
    expect(captured.stdout).toContain('bar');
  });
});

// ===========================================================================
// Extensibility — new commands register without restructuring the dispatcher.
// ===========================================================================

describe('runWithRegistry — extensibility', () => {
  test('a fresh registry entry is dispatchable without code changes elsewhere', async () => {
    const s1: { ran?: boolean } = {};
    const s2: { ran?: boolean } = {};
    const registry: CommandDef[] = [
      {
        name: 'workflow',
        summary: 'stub',
        run: async (): Promise<void> => {
          s1.ran = true;
        },
      },
      {
        name: 'gotcha',
        summary: 'stub',
        run: async (): Promise<void> => {
          s2.ran = true;
        },
      },
    ];

    await captureExit(() => runWithRegistry(['workflow'], registry));
    expect(s1.ran).toBe(true);
    expect(s2.ran).toBeUndefined();

    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() => runWithRegistry(['gotcha'], registry));
    expect(s2.ran).toBe(true);
  });
});

// ===========================================================================
// Canonical registry invariants.
// ===========================================================================

describe('TOP_LEVEL_COMMANDS — canonical registry', () => {
  test('every entry declares a non-empty name and summary', () => {
    for (const cmd of TOP_LEVEL_COMMANDS) {
      expect(cmd.name.length).toBeGreaterThan(0);
      expect(cmd.summary.length).toBeGreaterThan(0);
    }
  });

  test('names are unique', () => {
    const names = TOP_LEVEL_COMMANDS.map((c) => c.name);
    expect(new Set(names).size).toBe(names.length);
  });

  test('COMMAND_ORDER and COMMANDS_BY_NAME agree on the set of names', () => {
    const orderSet = new Set<string>(COMMAND_ORDER);
    const mapSet = new Set(Object.keys(COMMANDS_BY_NAME));
    expect(orderSet).toEqual(mapSet);
  });

  test('TOP_LEVEL_COMMANDS matches COMMAND_ORDER sequence', () => {
    const orderNames = [...COMMAND_ORDER];
    const registryNames = TOP_LEVEL_COMMANDS.map((c) => c.name);
    expect(registryNames).toEqual(orderNames);
  });

  test('exposes the PR C command set (Wave 9 adds `gotcha`, Pass-2 W3.3 adds `maintenance`)', () => {
    // C.1 refactored the dispatch layer; Wave 9 (C.9) added the top-level
    // `gotcha` namespace. v0.5.0 Pass-2 W3.3 added the top-level
    // `maintenance` namespace for out-of-session cleanup commands
    // (wipe-legacy-sessions). W5.5 added `install` (template-bundle
    // lay-down + 3-way merge) and `project` (list / create / switch)
    // as top-level multi-project verbs. v0.5.0 Wave C.1.5 added
    // `prompt` (render / patch / rebuild — operator-only spec.json
    // mutation surface for the prompts-as-data feature). Workflow
    // subcommands (Waves 2–8) extend the inner `workflow` registry
    // and do not surface here. If this test fails, verify the change
    // belongs in this PR before updating it.
    const expected: readonly CommandName[] = [
      'config',
      'session',
      'notify',
      'note',
      'validate',
      'workflow',
      'gotcha',
      'maintenance',
      'prompt',
      'install',
      'project',
      'image',
      'video',
      'web',
    ];
    const names = TOP_LEVEL_COMMANDS.map((c) => c.name);
    expect(names).toEqual([...expected]);
  });
});
