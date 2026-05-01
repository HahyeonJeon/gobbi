/**
 * Unit tests for the `gobbi memory` dispatcher framework — distinct from
 * the per-command dispatcher-wiring tests in `check.test.ts`.
 *
 * `check.test.ts` exercises the real `MEMORY_COMMANDS` registry to
 * verify the wiring of `check` end-to-end. This file exercises the
 * registry-parameterised dispatcher contract via `runMemoryWithRegistry`
 * with a custom registry to assert the dispatcher framework itself
 * behaves correctly independently of the registered subcommand set.
 *
 * Test surface (3) per PR-CFM-B synthesis §3.3 + plan T4:
 *
 *   1. `runMemoryWithRegistry` test seam works against a custom registry
 *      — the dispatcher invokes the registered handler with the trimmed
 *      argv slice.
 *   2. `gobbi memory --help` listing prints exactly one subcommand at
 *      this commit (`check`) — guards against the next commit adding
 *      `backfill` to the listing prematurely.
 *   3. Unknown subcommand fails with exit 1 — registry-agnostic guard.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';

import {
  MEMORY_COMMANDS,
  runMemoryWithRegistry,
  type MemoryCommand,
} from '../../memory.js';

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

// ===========================================================================
// 1. runMemoryWithRegistry — custom registry seam
// ===========================================================================

describe('runMemoryWithRegistry — custom registry', () => {
  test('routes the matched subcommand to its handler with trimmed argv', async () => {
    const received: string[][] = [];
    const fakeRegistry: readonly MemoryCommand[] = [
      {
        name: 'fake-cmd',
        summary: 'a stand-in subcommand for the dispatcher framework test',
        run: async (args: string[]): Promise<void> => {
          received.push(args);
        },
      },
    ];

    await captureExit(() =>
      runMemoryWithRegistry(['fake-cmd', 'a', '--flag'], fakeRegistry),
    );

    expect(received).toHaveLength(1);
    expect(received[0]).toEqual(['a', '--flag']);
    expect(captured.exitCode).toBeNull();
  });
});

// ===========================================================================
// 2. --help listing — only `check` at this commit
// ===========================================================================

describe('runMemoryWithRegistry — --help listing', () => {
  test('lists exactly one subcommand at this commit (check)', async () => {
    await captureExit(() => runMemoryWithRegistry(['--help'], MEMORY_COMMANDS));

    expect(captured.stdout).toContain('check');
    // Backfill is intentionally NOT registered yet — guards against the
    // next commit registering it before its handler module exists.
    expect(captured.stdout).not.toContain('backfill');
    // Registry holds exactly one entry at this commit.
    expect(MEMORY_COMMANDS).toHaveLength(1);
  });
});

// ===========================================================================
// 3. Unknown subcommand — exits 1 (registry-agnostic)
// ===========================================================================

describe('runMemoryWithRegistry — unknown subcommand', () => {
  test('unknown subcommand fails with exit 1 against any registry', async () => {
    const fakeRegistry: readonly MemoryCommand[] = [
      {
        name: 'only-thing',
        summary: 'a stand-in',
        run: async (): Promise<void> => {
          // never called
        },
      },
    ];

    await captureExit(() =>
      runMemoryWithRegistry(['no-such-thing'], fakeRegistry),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('Unknown subcommand: no-such-thing');
    // Help is appended to stderr on the unknown-subcommand path.
    expect(captured.stderr).toContain('only-thing');
  });
});
