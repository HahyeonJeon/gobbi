/**
 * Unit tests for `gobbi workflow next` — compile pipeline + error-branch
 * dispatch + dispatcher smoke.
 *
 * Coverage:
 *   - compileCurrentStep — productive step path (ideation, no overlay) produces
 *     a compiled prompt whose text contains the expected section markers.
 *   - compileCurrentStep — substate overlay path (ideation + discussing) applies
 *     the overlay; the compiled prompt's text contains an overlay-added line.
 *   - compileCurrentStep — error branch calls compileErrorPrompt which throws
 *     with "not implemented".
 *   - runWorkflowWithRegistry — `next` is dispatchable via the registry.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { runInitWithOptions } from '../init.js';
import {
  compileCurrentStep,
  DEFAULT_SPECS_DIR,
  runNextWithOptions,
} from '../next.js';
import {
  runWorkflowWithRegistry,
  type WorkflowCommand,
} from '../../workflow.js';
import { resolveWorkflowState } from '../../../workflow/engine.js';
import { initialState } from '../../../workflow/state.js';
import type { WorkflowState } from '../../../workflow/state.js';
import { EventStore } from '../../../workflow/store.js';

// ---------------------------------------------------------------------------
// stdout/stderr capture helpers — restore originals after each test.
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
let origExit: typeof process.exit;

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
// scratch dirs
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
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-next-test-'));
  scratchDirs.push(dir);
  return dir;
}

// ---------------------------------------------------------------------------
// Helpers — init a session and return its on-disk paths.
// ---------------------------------------------------------------------------

async function initScratchSession(
  sessionId: string,
): Promise<{ sessionDir: string; repo: string }> {
  const repo = makeScratchRepo();
  await captureExit(() =>
    runInitWithOptions(
      ['--session-id', sessionId, '--task', 'next-test'],
      { repoRoot: repo },
    ),
  );
  const sessionDir = join(repo, '.gobbi', 'sessions', sessionId);
  // Reset capture between init and the test's real assertions.
  captured = { stdout: '', stderr: '', exitCode: null };
  return { sessionDir, repo };
}

function openStore(sessionDir: string): EventStore {
  return new EventStore(join(sessionDir, 'gobbi.db'));
}

// ===========================================================================
// compileCurrentStep — productive step path
// ===========================================================================

describe('compileCurrentStep — productive step', () => {
  test('compiles ideation spec when state.currentStep is ideation', async () => {
    const { sessionDir } = await initScratchSession('next-ideation');
    const store = openStore(sessionDir);
    try {
      // Fresh init lands at ideation/discussing. Strip the substate for the
      // no-overlay fixture to exercise the base-spec branch directly.
      const resolved = resolveWorkflowState(sessionDir, store, 'next-ideation');
      const state: WorkflowState = { ...resolved, currentSubstate: null };
      const text = await compileCurrentStep(state, store, DEFAULT_SPECS_DIR);

      // The ideation step's `completion` block always emits this header.
      expect(text).toContain('Criteria:');
      // Session summary section markers — present regardless of substate.
      expect(text).toContain('session.currentStep=ideation');
      expect(text).toContain('session.currentSubstate=null');
      // The base ideation spec does NOT include the discussing overlay's
      // substate marker. Overlay is NOT applied on this path.
      expect(text).not.toContain('Substate: discussing.');
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// compileCurrentStep — substate overlay path
// ===========================================================================

describe('compileCurrentStep — substate overlay', () => {
  test('applies the discussing.overlay.json when currentSubstate is "discussing"', async () => {
    const { sessionDir } = await initScratchSession('next-overlay');
    const store = openStore(sessionDir);
    try {
      const resolved = resolveWorkflowState(sessionDir, store, 'next-overlay');
      // Fresh init already lands on discussing per the reducer. Assert it
      // so the fixture captures the reducer's authoritative substate.
      expect(resolved.currentSubstate).toBe('discussing');

      const text = await compileCurrentStep(resolved, store, DEFAULT_SPECS_DIR);

      // Overlay-added line — `discussing.overlay.json` appends a static block
      // whose content begins with "Substate: discussing." exactly.
      expect(text).toContain('Substate: discussing.');
      // Session summary reflects the substate.
      expect(text).toContain('session.currentSubstate=discussing');
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// compileCurrentStep — error branch
// ===========================================================================

describe('compileCurrentStep — error branch', () => {
  test('dispatches to compileErrorPrompt which throws "not implemented"', async () => {
    const { sessionDir } = await initScratchSession('next-error');
    const store = openStore(sessionDir);
    try {
      // Construct a synthetic error state — the reducer path to `error` lives
      // in C.4/D; here we assemble a WorkflowState literal.
      const errorState: WorkflowState = {
        ...initialState('next-error'),
        currentStep: 'error',
      };
      await expect(
        compileCurrentStep(errorState, store, DEFAULT_SPECS_DIR),
      ).rejects.toThrow(/not implemented/);
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// runNextWithOptions — CLI surface end-to-end
// ===========================================================================

describe('runNextWithOptions', () => {
  test('emits a compiled prompt to stdout for a fresh session', async () => {
    const { sessionDir } = await initScratchSession('next-cli');
    await captureExit(() =>
      runNextWithOptions([], { sessionDir, specsDir: DEFAULT_SPECS_DIR }),
    );

    // Compiled prompt lands on stdout. The ideation/discussing overlay fires.
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('Substate: discussing.');
    expect(captured.stdout).toContain('session.currentStep=ideation');
  });
});

// ===========================================================================
// Dispatcher integration — the registry-based dispatch recognises `next`.
// ===========================================================================

describe('runWorkflowWithRegistry — next registration', () => {
  test('`next` token routes to the next handler', async () => {
    const state: { ran?: boolean; args?: string[] } = {};
    const registry: WorkflowCommand[] = [
      {
        name: 'next',
        summary: 'stub',
        run: async (args: string[]): Promise<void> => {
          state.ran = true;
          state.args = args;
        },
      },
    ];
    await captureExit(() =>
      runWorkflowWithRegistry(['next', '--session-id', 'foo'], registry),
    );
    expect(state.ran).toBe(true);
    expect(state.args).toEqual(['--session-id', 'foo']);
  });
});
