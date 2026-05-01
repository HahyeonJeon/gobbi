/**
 * Unit tests for `gobbi workflow transition` — keyword → event mapping,
 * idempotency formula selection, reducer-rejection exit code, and
 * dispatcher registration.
 *
 * Coverage:
 *   - buildEvent — every keyword produces the expected typed event.
 *   - runTransitionWithOptions — COMPLETE from a fresh ideation session
 *     fires `workflow.step.exit` and advances state.
 *   - runTransitionWithOptions — REVISE with --loop-target carries the
 *     loopTarget into EvalVerdictData.
 *   - runTransitionWithOptions — PASS with --tool-call-id uses the
 *     'tool-call' idempotency formula (second invocation with the same
 *     id dedupes — no duplicate event).
 *   - runTransitionWithOptions — reducer rejection (RESUME without the
 *     error state) exits 1 with an informative stderr message.
 *   - runTransitionWithOptions — unknown keyword exits 2 with the
 *     supported list.
 *   - WORKFLOW_COMMANDS — the `transition` entry is registered.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { rmSync } from 'node:fs';
import { basename, join } from 'node:path';

import { runInitWithOptions } from '../init.js';
import { makeConformingTmpRepo } from '../../../__tests__/helpers/conforming-tmpdir.js';
import { sessionDir as sessionDirForProject } from '../../../lib/workspace-paths.js';
import {
  buildEvent,
  runTransitionWithOptions,
  TRANSITION_KEYWORDS,
} from '../transition.js';
import { WORKFLOW_COMMANDS } from '../../workflow.js';
import { EventStore } from '../../../workflow/store.js';
import { resolveWorkflowState } from '../../../workflow/engine.js';
import { initialState } from '../../../workflow/state-derivation.js';
import type { WorkflowState } from '../../../workflow/state-derivation.js';

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
// Scratch dirs
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
  const dir = makeConformingTmpRepo('gobbi-transition-test');
  scratchDirs.push(dir);
  return dir;
}

async function initScratchSession(
  sessionId: string,
): Promise<{ sessionDir: string; repo: string; projectId: string }> {
  const repo = makeScratchRepo();
  const projectId = basename(repo);
  await captureExit(() =>
    runInitWithOptions(
      ['--session-id', sessionId, '--task', 'transition-test'],
      { repoRoot: repo },
    ),
  );
  const sessionDir = sessionDirForProject(repo, projectId, sessionId);
  captured = { stdout: '', stderr: '', exitCode: null };
  return { sessionDir, repo, projectId };
}

/**
 * Open the per-session event store with explicit partition keys (PR-FIN-
 * 2a-ii / T-2a.9.unified Option α). Tests pass the same `(sessionId,
 * projectId)` pair init stamped at write time so the partition-aware
 * read filter admits the session's events.
 */
function openStore(
  sessionDir: string,
  sessionId: string,
  projectId: string,
): EventStore {
  return new EventStore(join(sessionDir, 'gobbi.db'), {
    sessionId,
    projectId,
  });
}

// ===========================================================================
// buildEvent — pure mapping table
// ===========================================================================

describe('buildEvent — keyword mapping', () => {
  const baseState: WorkflowState = {
    ...initialState('sess-map'),
    currentStep: 'ideation',
    currentSubstate: 'discussing',
  };

  test('COMPLETE → workflow.step.exit carrying currentStep', () => {
    const event = buildEvent('COMPLETE', baseState, ['COMPLETE']);
    expect(event.type).toBe('workflow.step.exit');
    if (event.type === 'workflow.step.exit') {
      expect(event.data.step).toBe('ideation');
    }
  });

  test('PASS → decision.eval.verdict verdict=pass', () => {
    const event = buildEvent('PASS', baseState, ['PASS']);
    expect(event.type).toBe('decision.eval.verdict');
    if (event.type === 'decision.eval.verdict') {
      expect(event.data.verdict).toBe('pass');
    }
  });

  test('REVISE without --loop-target → verdict=revise, no loopTarget', () => {
    const event = buildEvent('REVISE', baseState, ['REVISE']);
    expect(event.type).toBe('decision.eval.verdict');
    if (event.type === 'decision.eval.verdict') {
      expect(event.data.verdict).toBe('revise');
      expect(event.data.loopTarget).toBeUndefined();
    }
  });

  test('REVISE with loopTarget override carries it onto EvalVerdictData', () => {
    const event = buildEvent('REVISE', baseState, ['REVISE'], {
      loopTarget: 'ideation',
    });
    expect(event.type).toBe('decision.eval.verdict');
    if (event.type === 'decision.eval.verdict') {
      expect(event.data.verdict).toBe('revise');
      expect(event.data.loopTarget).toBe('ideation');
    }
  });

  test('ESCALATE → verdict=escalate', () => {
    const event = buildEvent('ESCALATE', baseState, ['ESCALATE']);
    expect(event.type).toBe('decision.eval.verdict');
    if (event.type === 'decision.eval.verdict') {
      expect(event.data.verdict).toBe('escalate');
    }
  });

  test('SKIP → workflow.step.skip carrying currentStep', () => {
    const event = buildEvent('SKIP', baseState, ['SKIP']);
    expect(event.type).toBe('workflow.step.skip');
    if (event.type === 'workflow.step.skip') {
      expect(event.data.step).toBe('ideation');
    }
  });

  test('TIMEOUT → workflow.step.timeout with 0 elapsed and 0 configured', () => {
    const event = buildEvent('TIMEOUT', baseState, ['TIMEOUT']);
    expect(event.type).toBe('workflow.step.timeout');
    if (event.type === 'workflow.step.timeout') {
      expect(event.data.step).toBe('ideation');
      expect(event.data.elapsedMs).toBe(0);
      expect(event.data.configuredTimeoutMs).toBe(0);
    }
  });

  test('FINISH → workflow.finish with empty data', () => {
    const event = buildEvent('FINISH', baseState, ['FINISH']);
    expect(event.type).toBe('workflow.finish');
  });

  test('ABORT with reason override carries the reason', () => {
    const event = buildEvent('ABORT', baseState, ['ABORT'], {
      reason: 'operator stopped session',
    });
    expect(event.type).toBe('workflow.abort');
    if (event.type === 'workflow.abort') {
      expect(event.data.reason).toBe('operator stopped session');
    }
  });

  test('ABORT without reason yields empty AbortData', () => {
    const event = buildEvent('ABORT', baseState, ['ABORT']);
    expect(event.type).toBe('workflow.abort');
    if (event.type === 'workflow.abort') {
      expect(event.data.reason).toBeUndefined();
    }
  });

  test('RESUME <target> → workflow.resume with targetStep', () => {
    const errorState: WorkflowState = {
      ...initialState('sess-resume'),
      currentStep: 'error',
    };
    const event = buildEvent('RESUME', errorState, ['RESUME', 'ideation']);
    expect(event.type).toBe('workflow.resume');
    if (event.type === 'workflow.resume') {
      expect(event.data.targetStep).toBe('ideation');
      expect(event.data.fromError).toBe(true);
    }
  });

  test('RESUME without target throws a build error', () => {
    expect(() => buildEvent('RESUME', baseState, ['RESUME'])).toThrow(
      /RESUME requires a target/,
    );
  });
});

// ===========================================================================
// runTransitionWithOptions — end-to-end against a real session
// ===========================================================================

describe('runTransitionWithOptions — happy paths', () => {
  test('COMPLETE from fresh ideation fires workflow.step.exit and advances state', async () => {
    const { sessionDir, projectId } = await initScratchSession('trans-complete');

    await captureExit(() =>
      runTransitionWithOptions(['COMPLETE'], { sessionDir }),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('workflow.step.exit');
    expect(captured.stdout).toContain('Step: plan');

    // Verify the event landed in the store.
    const store = openStore(sessionDir, 'trans-complete', projectId);
    try {
      const last = store.last('workflow.step.exit');
      expect(last).not.toBeNull();
      expect(last!.step).toBe('ideation');
    } finally {
      store.close();
    }
  });

  test('SKIP from plan fires workflow.step.skip and lands back at ideation', async () => {
    const { sessionDir, projectId } = await initScratchSession('trans-skip');

    // Advance to plan via COMPLETE first.
    await captureExit(() =>
      runTransitionWithOptions(['COMPLETE'], { sessionDir }),
    );
    captured = { stdout: '', stderr: '', exitCode: null };

    // Now SKIP back to ideation.
    await captureExit(() =>
      runTransitionWithOptions(['SKIP'], { sessionDir }),
    );

    expect(captured.exitCode).toBeNull();
    const store = openStore(sessionDir, 'trans-skip', projectId);
    try {
      const last = store.last('workflow.step.skip');
      expect(last).not.toBeNull();
      expect(last!.step).toBe('planning');
    } finally {
      store.close();
    }
  });

  // CV-10 / issue #188 regression — pre-fix the handoff footer
  // instructed `gobbi workflow transition COMPLETE`, but the runtime
  // routed `handoff → done` only on `workflow.finish` (FINISH). The
  // session looped without terminating because COMPLETE from handoff
  // emitted `workflow.invalid_transition` while the agent retried.
  // This test drives the full workflow through to handoff and asserts
  // FINISH terminates the session.
  test('FINISH from handoff fires workflow.finish and reaches `done`', async () => {
    const { sessionDir, projectId } = await initScratchSession('trans-handoff-finish');

    // Drive ideation → planning → execution → execution_eval. The
    // execution → execution_eval edge is unconditional in the
    // transition graph (see `transitions.ts:176`), so even with eval
    // disabled the workflow lands at execution_eval after three
    // COMPLETEs.
    for (let i = 0; i < 3; i += 1) {
      captured = { stdout: '', stderr: '', exitCode: null };
      await captureExit(() =>
        runTransitionWithOptions(['COMPLETE'], { sessionDir }),
      );
      expect(captured.exitCode).toBeNull();
    }

    // execution_eval → memorization via PASS verdict.
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runTransitionWithOptions(['PASS'], { sessionDir }),
    );
    expect(captured.exitCode).toBeNull();

    // memorization → memorization_eval via COMPLETE (DEFAULTS keep
    // memorization eval mode at 'always', so the runtime routes through
    // the optional eval branch). PR-FIN-2a-i T-2a.7 added this branch.
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runTransitionWithOptions(['COMPLETE'], { sessionDir }),
    );
    expect(captured.exitCode).toBeNull();

    // memorization_eval → handoff via PASS verdict.
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runTransitionWithOptions(['PASS'], { sessionDir }),
    );
    expect(captured.exitCode).toBeNull();

    // FINISH from handoff terminates. Pre-fix the handoff footer
    // instructed COMPLETE which routed `workflow.step.exit` from
    // `handoff` — there is no transition rule for that pair, so the
    // reducer rejected and the agent looped retrying COMPLETE.
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runTransitionWithOptions(['FINISH'], { sessionDir }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('workflow.finish');
    // After FINISH the runtime transition graph routes handoff → done.
    expect(captured.stdout).toContain('done');

    const store = openStore(sessionDir, 'trans-handoff-finish', projectId);
    try {
      const finishRow = store.last('workflow.finish');
      expect(finishRow).not.toBeNull();
      // The finish event was emitted while still at the handoff step
      // (the reducer transitions to `done` AFTER applying the event).
      expect(finishRow!.step).toBe('handoff');
    } finally {
      store.close();
    }

    // PR-FIN-2a-ii (T-2a.9.unified) retired `state.json`; derive the
    // terminal step by replaying the partition-filtered event stream.
    {
      const store = openStore(sessionDir, 'trans-handoff-finish', projectId);
      try {
        const finalState = resolveWorkflowState(
          sessionDir,
          store,
          'trans-handoff-finish',
        );
        expect(finalState.currentStep).toBe('done');
      } finally {
        store.close();
      }
    }
  });

  test('REVISE with --loop-target carries the target to EvalVerdictData', async () => {
    const { sessionDir, projectId } = await initScratchSession('trans-revise');

    // Drive to execution_eval so REVISE is meaningful. The state machine
    // path from a fresh session without eval flags is:
    // ideation --COMPLETE--> plan --COMPLETE--> execution --COMPLETE-->
    // execution_eval.
    for (let i = 0; i < 3; i += 1) {
      captured = { stdout: '', stderr: '', exitCode: null };
      await captureExit(() =>
        runTransitionWithOptions(['COMPLETE'], { sessionDir }),
      );
    }

    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runTransitionWithOptions(
        ['REVISE', '--loop-target', 'ideation'],
        { sessionDir },
      ),
    );

    expect(captured.exitCode).toBeNull();
    const store = openStore(sessionDir, 'trans-revise', projectId);
    try {
      const last = store.last('decision.eval.verdict');
      expect(last).not.toBeNull();
      const data = JSON.parse(last!.data) as {
        verdict?: unknown;
        loopTarget?: unknown;
      };
      expect(data.verdict).toBe('revise');
      expect(data.loopTarget).toBe('ideation');
    } finally {
      store.close();
    }
  });

  test('--json emits a structured result on stdout', async () => {
    const { sessionDir, projectId } = await initScratchSession('trans-json');

    await captureExit(() =>
      runTransitionWithOptions(['COMPLETE', '--json'], { sessionDir }),
    );

    expect(captured.exitCode).toBeNull();
    const parsed = JSON.parse(captured.stdout) as {
      keyword?: unknown;
      eventType?: unknown;
      persisted?: unknown;
      idempotencyKind?: unknown;
      state?: { currentStep?: unknown };
    };
    expect(parsed.keyword).toBe('COMPLETE');
    expect(parsed.eventType).toBe('workflow.step.exit');
    expect(parsed.persisted).toBe(true);
    expect(parsed.idempotencyKind).toBe('system');
    expect(parsed.state?.currentStep).toBe('planning');
  });
});

// ===========================================================================
// runTransitionWithOptions — idempotency
// ===========================================================================

describe('runTransitionWithOptions — idempotency', () => {
  test('PASS with --tool-call-id uses the tool-call formula and dedupes on repeat', async () => {
    const { sessionDir, projectId } = await initScratchSession('trans-idem');

    // Drive fresh session (ideation/discussing) to ideation_eval so PASS is
    // a valid verdict with a matching transition. The plan-off default
    // means ideation --COMPLETE--> plan; we need an eval step, so enable
    // eval-ideation on a new session.
    const evalRepo = makeScratchRepo();
    await captureExit(() =>
      runInitWithOptions(
        [
          '--session-id',
          'trans-idem-eval',
          '--task',
          'idem-eval',
          '--eval-ideation',
        ],
        { repoRoot: evalRepo },
      ),
    );
    const evalProjectId = basename(evalRepo);
    const evalSessionDir = sessionDirForProject(
      evalRepo,
      evalProjectId,
      'trans-idem-eval',
    );
    captured = { stdout: '', stderr: '', exitCode: null };

    // ideation --COMPLETE--> ideation_eval
    await captureExit(() =>
      runTransitionWithOptions(['COMPLETE'], {
        sessionDir: evalSessionDir,
      }),
    );

    // First PASS with tool-call id — should land.
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runTransitionWithOptions(
        ['PASS', '--tool-call-id', 'tc-123', '--json'],
        { sessionDir: evalSessionDir },
      ),
    );
    expect(captured.exitCode).toBeNull();
    const first = JSON.parse(captured.stdout) as {
      persisted?: unknown;
      idempotencyKind?: unknown;
    };
    expect(first.persisted).toBe(true);
    expect(first.idempotencyKind).toBe('tool-call');

    // Count events after first PASS.
    const store1 = openStore(evalSessionDir, 'trans-idem-eval', evalProjectId);
    const countAfterFirst = store1.byType('decision.eval.verdict').length;
    store1.close();

    // Second PASS with the SAME tool-call-id — the tool-call formula is
    // `${sessionId}:${toolCallId}:${eventType}` so the idempotency key
    // collides with the first and the INSERT is a no-op.
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runTransitionWithOptions(
        ['PASS', '--tool-call-id', 'tc-123', '--json'],
        { sessionDir: evalSessionDir },
      ),
    );
    expect(captured.exitCode).toBeNull();
    const second = JSON.parse(captured.stdout) as { persisted?: unknown };
    expect(second.persisted).toBe(false);

    const store2 = openStore(evalSessionDir, 'trans-idem-eval', evalProjectId);
    try {
      expect(store2.byType('decision.eval.verdict').length).toBe(
        countAfterFirst,
      );
    } finally {
      store2.close();
    }

    // Cleanup — evalRepo is separate from scratchDirs, remove it.
    rmSync(evalRepo, { recursive: true, force: true });
  });
});

// ===========================================================================
// runTransitionWithOptions — reducer rejection + argv failure
// ===========================================================================

describe('runTransitionWithOptions — error paths', () => {
  test('RESUME from a non-error state exits 1 with the reducer error on stderr', async () => {
    const { sessionDir, projectId } = await initScratchSession('trans-reject');

    // Fresh init lands at ideation/discussing — not error, so RESUME fails
    // the reducer guard at `reducer.ts:177-187`.
    await captureExit(() =>
      runTransitionWithOptions(['RESUME', 'ideation'], { sessionDir }),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('workflow.resume requires error state');
  });

  test('unknown keyword exits 2 with the supported list on stderr', async () => {
    const { sessionDir, projectId } = await initScratchSession('trans-unknown');

    await captureExit(() =>
      runTransitionWithOptions(['FLY_AWAY'], { sessionDir }),
    );

    expect(captured.exitCode).toBe(2);
    expect(captured.stderr).toContain('unknown keyword');
    // Error message enumerates every supported keyword.
    for (const kw of TRANSITION_KEYWORDS) {
      expect(captured.stderr).toContain(kw);
    }
  });

  test('missing positional keyword exits 2 with usage', async () => {
    const { sessionDir, projectId } = await initScratchSession('trans-miss');

    await captureExit(() =>
      runTransitionWithOptions([], { sessionDir }),
    );

    expect(captured.exitCode).toBe(2);
    expect(captured.stderr).toContain('missing keyword');
  });
});

// ===========================================================================
// Dispatcher integration
// ===========================================================================

describe('WORKFLOW_COMMANDS — transition registration', () => {
  test('registers the transition subcommand', () => {
    const entry = WORKFLOW_COMMANDS.find((c) => c.name === 'transition');
    expect(entry).toBeDefined();
    expect(entry!.summary.length).toBeGreaterThan(0);
  });
});
