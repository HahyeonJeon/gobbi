/**
 * Unit tests for the `gobbi workflow` dispatcher — registry shape,
 * `--help` rendering derived from the registry, unknown-subcommand
 * handling, and extensibility smoke test.
 *
 * The dispatcher is a single file (`commands/workflow.ts`) whose routing
 * logic is exercised through `runWorkflowWithRegistry` — we pass a
 * per-test registry rather than running the real CLI, which would spawn
 * a subprocess and intercept stdout/stderr.
 */

import { describe, test, expect, beforeEach, afterEach } from 'bun:test';

import {
  runWorkflowWithRegistry,
  WORKFLOW_COMMANDS,
  type WorkflowCommand,
} from '../../workflow.js';

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
): WorkflowCommand {
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
// Help rendering
// ===========================================================================

describe('runWorkflowWithRegistry — help', () => {
  test('--help lists every registered subcommand by name and summary', async () => {
    const registry: WorkflowCommand[] = [
      stub('alpha'),
      stub('beta'),
      stub('gamma'),
    ];
    await captureExit(() => runWorkflowWithRegistry(['--help'], registry));
    expect(captured.stdout).toContain('alpha');
    expect(captured.stdout).toContain('stub summary for alpha');
    expect(captured.stdout).toContain('beta');
    expect(captured.stdout).toContain('gamma');
    expect(captured.exitCode).toBeNull(); // help path does not exit explicitly
  });

  test('empty args produces the same help output as --help', async () => {
    const registry: WorkflowCommand[] = [stub('foo')];
    await captureExit(() => runWorkflowWithRegistry([], registry));
    expect(captured.stdout).toContain('Usage: gobbi workflow');
    expect(captured.stdout).toContain('foo');
  });

  test('-h is a short alias for --help', async () => {
    const registry: WorkflowCommand[] = [stub('foo')];
    await captureExit(() => runWorkflowWithRegistry(['-h'], registry));
    expect(captured.stdout).toContain('foo');
  });

  test('empty registry still renders a usable help screen', async () => {
    await captureExit(() => runWorkflowWithRegistry(['--help'], []));
    expect(captured.stdout).toContain('Usage: gobbi workflow');
  });
});

// ===========================================================================
// Subcommand dispatch
// ===========================================================================

describe('runWorkflowWithRegistry — dispatch', () => {
  test('routes to the matching registry entry and forwards trailing args', async () => {
    const state: { ran?: boolean; args?: string[] } = {};
    const registry: WorkflowCommand[] = [
      { ...stub('foo', state), name: 'foo' },
    ];
    await captureExit(() =>
      runWorkflowWithRegistry(['foo', '--flag', 'value'], registry),
    );
    expect(state.ran).toBe(true);
    expect(state.args).toEqual(['--flag', 'value']);
  });

  test('unknown subcommand exits 1 with an error line on stderr', async () => {
    const registry: WorkflowCommand[] = [stub('only-known')];
    await captureExit(() =>
      runWorkflowWithRegistry(['mystery'], registry),
    );
    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('Unknown subcommand: mystery');
    // Help should still be included so users see what IS available.
    expect(captured.stderr).toContain('only-known');
  });
});

// ===========================================================================
// Extensibility smoke test — PR C registers new subcommands without
// restructuring the dispatcher. Verify by adding a second entry to an
// in-test registry and asserting both dispatch correctly.
// ===========================================================================

describe('runWorkflowWithRegistry — extensibility', () => {
  test('a fresh registry entry is dispatchable without code changes elsewhere', async () => {
    const s1: { ran?: boolean } = {};
    const s2: { ran?: boolean } = {};
    const registry: WorkflowCommand[] = [
      { name: 'validate', summary: 'stub', run: async (): Promise<void> => { s1.ran = true; } },
      { name: 'next', summary: 'stub', run: async (): Promise<void> => { s2.ran = true; } },
    ];

    await captureExit(() => runWorkflowWithRegistry(['validate'], registry));
    expect(s1.ran).toBe(true);
    expect(s2.ran).toBeUndefined();

    // Reset captured state between dispatches.
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() => runWorkflowWithRegistry(['next'], registry));
    expect(s2.ran).toBe(true);
  });

  test('the canonical WORKFLOW_COMMANDS registry exposes validate', () => {
    const names = WORKFLOW_COMMANDS.map((c) => c.name);
    expect(names).toContain('validate');
  });

  test('every canonical subcommand declares a non-empty summary', () => {
    for (const cmd of WORKFLOW_COMMANDS) {
      expect(cmd.name.length).toBeGreaterThan(0);
      expect(cmd.summary.length).toBeGreaterThan(0);
    }
  });
});
