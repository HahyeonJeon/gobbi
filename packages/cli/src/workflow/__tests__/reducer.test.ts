import { describe, it, expect } from 'bun:test';

import { reduce } from '../reducer.js';
import type { ReducerResult } from '../reducer.js';
import { initialState, isValidState } from '../state.js';
import type { WorkflowState, WorkflowStep, EvalConfig } from '../state.js';
import { defaultPredicates } from '../predicates.js';
import type { Event } from '../events/index.js';
import { WORKFLOW_EVENTS } from '../events/workflow.js';
import { DELEGATION_EVENTS } from '../events/delegation.js';
import { ARTIFACT_EVENTS } from '../events/artifact.js';
import { DECISION_EVENTS } from '../events/decision.js';
import { GUARD_EVENTS } from '../events/guard.js';
import { SESSION_EVENTS } from '../events/session.js';
import {
  STEP_ADVANCEMENT_EVENTS,
  createStepAdvancementObserved,
} from '../events/step-advancement.js';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function stateAt(
  step: WorkflowStep,
  overrides: Partial<WorkflowState> = {},
): WorkflowState {
  return {
    ...initialState('test-session'),
    currentStep: step,
    ...overrides,
  };
}

function expectOk(result: ReducerResult): WorkflowState {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error('Expected ok result');
  return result.state;
}

function expectErr(result: ReducerResult): string {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error('Expected error result');
  return result.error;
}

// Event factory helpers

function workflowStart(): Event {
  return {
    type: WORKFLOW_EVENTS.START,
    data: { sessionId: 'test-session', timestamp: '2026-01-01T00:00:00.000Z' },
  };
}

function stepExit(step: string): Event {
  return { type: WORKFLOW_EVENTS.STEP_EXIT, data: { step } };
}

function stepSkip(step: string): Event {
  return { type: WORKFLOW_EVENTS.STEP_SKIP, data: { step } };
}

function stepTimeout(step: string): Event {
  return {
    type: WORKFLOW_EVENTS.STEP_TIMEOUT,
    data: { step, elapsedMs: 999999, configuredTimeoutMs: 600000 },
  };
}

function evalDecide(ideation: boolean, plan: boolean): Event {
  return {
    type: WORKFLOW_EVENTS.EVAL_DECIDE,
    data: { ideation, plan },
  };
}

function finish(): Event {
  return { type: WORKFLOW_EVENTS.FINISH, data: {} };
}

function abort(reason?: string): Event {
  return {
    type: WORKFLOW_EVENTS.ABORT,
    data: reason !== undefined ? { reason } : {},
  };
}

function resume(targetStep: string): Event {
  return {
    type: WORKFLOW_EVENTS.RESUME,
    data: { targetStep, fromError: true },
  };
}

function delegationSpawn(
  subagentId: string,
  agentType: string = 'executor',
  step: string = 'execution',
  timestamp: string = '2026-01-01T00:00:00.000Z',
): Event {
  return {
    type: DELEGATION_EVENTS.SPAWN,
    data: { subagentId, agentType, step, timestamp },
  };
}

function delegationComplete(subagentId: string): Event {
  return {
    type: DELEGATION_EVENTS.COMPLETE,
    data: { subagentId },
  };
}

function delegationFail(subagentId: string, reason: string = 'timeout'): Event {
  return {
    type: DELEGATION_EVENTS.FAIL,
    data: { subagentId, reason },
  };
}

function artifactWrite(step: string, filename: string): Event {
  return {
    type: ARTIFACT_EVENTS.WRITE,
    data: { step, filename, artifactType: 'note' },
  };
}

function artifactOverwrite(
  step: string,
  filename: string,
  previousFilename?: string,
): Event {
  return {
    type: ARTIFACT_EVENTS.OVERWRITE,
    data:
      previousFilename !== undefined
        ? { step, filename, previousFilename }
        : { step, filename },
  };
}

function verdictPass(): Event {
  return {
    type: DECISION_EVENTS.EVAL_VERDICT,
    data: { verdict: 'pass' },
  };
}

function verdictRevise(loopTarget?: string): Event {
  return {
    type: DECISION_EVENTS.EVAL_VERDICT,
    data: loopTarget !== undefined
      ? { verdict: 'revise', loopTarget }
      : { verdict: 'revise' },
  };
}

function decisionUser(): Event {
  return {
    type: DECISION_EVENTS.USER,
    data: { decision: 'approve' },
  };
}

function evalSkip(step: string): Event {
  return {
    type: DECISION_EVENTS.EVAL_SKIP,
    data: { step },
  };
}

function guardViolation(guardId: string = 'g-1'): Event {
  return {
    type: GUARD_EVENTS.VIOLATION,
    data: {
      guardId,
      toolName: 'Write',
      reason: 'Scope violation',
      step: 'execution',
      timestamp: '2026-01-01T00:00:00.000Z',
    },
  };
}

function guardOverride(): Event {
  return {
    type: GUARD_EVENTS.OVERRIDE,
    data: {
      guardId: 'g-1',
      toolName: 'Write',
      reason: 'User approved',
    },
  };
}

function heartbeat(): Event {
  return {
    type: SESSION_EVENTS.HEARTBEAT,
    data: { timestamp: '2026-01-01T00:00:00.000Z' },
  };
}

// ---------------------------------------------------------------------------
// 1. workflow.start: idle -> ideation with discussing substate
// ---------------------------------------------------------------------------

describe('workflow.start', () => {
  it('transitions idle -> ideation with discussing substate', () => {
    const state = stateAt('idle');
    const next = expectOk(reduce(state, workflowStart()));
    expect(next.currentStep).toBe('ideation');
    expect(next.currentSubstate).toBe('discussing');
  });

  it('rejects start when not idle', () => {
    const state = stateAt('ideation');
    const error = expectErr(reduce(state, workflowStart()));
    expect(error).toContain('idle');
  });
});

// ---------------------------------------------------------------------------
// 2. workflow.step.exit: transition via findTransition
// ---------------------------------------------------------------------------

describe('workflow.step.exit', () => {
  it('ideation -> plan (eval disabled), appends to completedSteps', () => {
    const state = stateAt('ideation', {
      evalConfig: { ideation: false, planning: false },
    });
    const next = expectOk(reduce(state, stepExit('ideation')));
    expect(next.currentStep).toBe('planning');
    expect(next.completedSteps).toEqual(['ideation']);
    expect(next.currentSubstate).toBeNull();
  });

  it('ideation -> ideation_eval (eval enabled)', () => {
    const state = stateAt('ideation', {
      evalConfig: { ideation: true, planning: false },
    });
    const next = expectOk(reduce(state, stepExit('ideation')));
    expect(next.currentStep).toBe('ideation_eval');
  });

  it('rejects when step does not match currentStep', () => {
    const state = stateAt('ideation');
    const error = expectErr(reduce(state, stepExit('planning')));
    expect(error).toContain('does not match');
  });

  it('clears currentSubstate on exit', () => {
    const state = stateAt('ideation', {
      currentSubstate: 'discussing',
      evalConfig: { ideation: false, planning: false },
    });
    const next = expectOk(reduce(state, stepExit('ideation')));
    expect(next.currentSubstate).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 3. workflow.step.exit: appends to completedSteps, clears currentSubstate
// ---------------------------------------------------------------------------

describe('workflow.step.exit completedSteps accumulation', () => {
  it('accumulates completed steps across multiple exits', () => {
    // Start at ideation with one previous completion
    const state = stateAt('execution', {
      completedSteps: ['ideation', 'planning'],
      evalConfig: { ideation: false, planning: false },
    });
    const next = expectOk(reduce(state, stepExit('execution')));
    expect(next.completedSteps).toEqual(['ideation', 'planning', 'execution']);
  });
});

// ---------------------------------------------------------------------------
// 4. workflow.eval.decide: sets evalConfig, immutable on second call
// ---------------------------------------------------------------------------

describe('workflow.eval.decide', () => {
  it('sets evalConfig when null', () => {
    const state = stateAt('ideation');
    const next = expectOk(reduce(state, evalDecide(true, false)));
    expect(next.evalConfig).toEqual({ ideation: true, planning: false });
  });

  it('is immutable — second call does not change evalConfig', () => {
    const state = stateAt('ideation', {
      evalConfig: { ideation: true, planning: false },
    });
    const next = expectOk(reduce(state, evalDecide(false, true)));
    expect(next.evalConfig).toEqual({ ideation: true, planning: false });
  });
});

// ---------------------------------------------------------------------------
// 5. workflow.finish: handoff -> done (Wave A.1.5 split memorization → handoff → done)
// ---------------------------------------------------------------------------

describe('workflow.finish', () => {
  it('transitions handoff -> done', () => {
    const state = stateAt('handoff');
    const next = expectOk(reduce(state, finish()));
    expect(next.currentStep).toBe('done');
    expect(next.currentSubstate).toBeNull();
  });

  it('rejects finish from memorization (must STEP_EXIT to handoff first)', () => {
    const state = stateAt('memorization');
    const error = expectErr(reduce(state, finish()));
    expect(error).toContain('handoff');
  });

  it('rejects finish from non-handoff step', () => {
    const state = stateAt('execution');
    const error = expectErr(reduce(state, finish()));
    expect(error).toContain('handoff');
  });
});

// ---------------------------------------------------------------------------
// 6. Terminal rejection: done state rejects all events
// ---------------------------------------------------------------------------

describe('terminal state rejection', () => {
  it('rejects workflow.start', () => {
    const error = expectErr(reduce(stateAt('done'), workflowStart()));
    expect(error).toContain('terminal');
  });

  it('rejects delegation.spawn', () => {
    const error = expectErr(reduce(stateAt('done'), delegationSpawn('a-1')));
    expect(error).toContain('terminal');
  });

  it('rejects artifact.write', () => {
    const error = expectErr(
      reduce(stateAt('done'), artifactWrite('execution', 'file.md')),
    );
    expect(error).toContain('terminal');
  });

  it('rejects decision.eval.verdict', () => {
    const error = expectErr(reduce(stateAt('done'), verdictPass()));
    expect(error).toContain('terminal');
  });

  it('rejects guard.violation', () => {
    const error = expectErr(reduce(stateAt('done'), guardViolation()));
    expect(error).toContain('terminal');
  });

  it('rejects session.heartbeat', () => {
    const error = expectErr(reduce(stateAt('done'), heartbeat()));
    expect(error).toContain('terminal');
  });
});

// ---------------------------------------------------------------------------
// 7. delegation.spawn/complete/fail: adds/removes from activeSubagents
// ---------------------------------------------------------------------------

describe('delegation events', () => {
  it('spawn adds to activeSubagents', () => {
    const state = stateAt('execution');
    const next = expectOk(
      reduce(state, delegationSpawn('agent-1', 'executor', 'execution')),
    );
    expect(next.activeSubagents).toHaveLength(1);
    expect(next.activeSubagents[0]!.subagentId).toBe('agent-1');
    expect(next.activeSubagents[0]!.agentType).toBe('executor');
    expect(next.activeSubagents[0]!.step).toBe('execution');
  });

  it('complete removes from activeSubagents by subagentId', () => {
    const state = stateAt('execution', {
      activeSubagents: [
        {
          subagentId: 'agent-1',
          agentType: 'executor',
          step: 'execution',
          spawnedAt: '2026-01-01T00:00:00.000Z',
        },
        {
          subagentId: 'agent-2',
          agentType: 'researcher',
          step: 'execution',
          spawnedAt: '2026-01-01T00:00:01.000Z',
        },
      ],
    });
    const next = expectOk(reduce(state, delegationComplete('agent-1')));
    expect(next.activeSubagents).toHaveLength(1);
    expect(next.activeSubagents[0]!.subagentId).toBe('agent-2');
  });

  it('fail removes from activeSubagents by subagentId', () => {
    const state = stateAt('execution', {
      activeSubagents: [
        {
          subagentId: 'agent-1',
          agentType: 'executor',
          step: 'execution',
          spawnedAt: '2026-01-01T00:00:00.000Z',
        },
      ],
    });
    const next = expectOk(reduce(state, delegationFail('agent-1', 'crash')));
    expect(next.activeSubagents).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// 8. artifact.write/overwrite: updates artifacts map
// ---------------------------------------------------------------------------

describe('artifact events', () => {
  it('write adds filename to artifacts[step]', () => {
    const state = stateAt('execution');
    const next = expectOk(
      reduce(state, artifactWrite('execution', 'research.md')),
    );
    expect(next.artifacts['execution']).toEqual(['research.md']);
  });

  it('write accumulates filenames', () => {
    const state = stateAt('execution', {
      artifacts: { execution: ['research.md'] },
    });
    const next = expectOk(
      reduce(state, artifactWrite('execution', 'plan.md')),
    );
    expect(next.artifacts['execution']).toEqual(['research.md', 'plan.md']);
  });

  it('overwrite replaces previousFilename with new filename', () => {
    const state = stateAt('execution', {
      artifacts: { execution: ['draft-v1.md', 'notes.md'] },
    });
    const next = expectOk(
      reduce(state, artifactOverwrite('execution', 'draft-v2.md', 'draft-v1.md')),
    );
    expect(next.artifacts['execution']).toEqual(['draft-v2.md', 'notes.md']);
  });

  it('overwrite without previousFilename appends', () => {
    const state = stateAt('execution', {
      artifacts: { execution: ['existing.md'] },
    });
    const next = expectOk(
      reduce(state, artifactOverwrite('execution', 'new.md')),
    );
    expect(next.artifacts['execution']).toEqual(['existing.md', 'new.md']);
  });
});

// ---------------------------------------------------------------------------
// 9. decision.eval.verdict (pass): advances to next step
// ---------------------------------------------------------------------------

describe('decision.eval.verdict pass', () => {
  it('execution_eval -> memorization on pass', () => {
    const state = stateAt('execution_eval');
    const next = expectOk(reduce(state, verdictPass()));
    expect(next.currentStep).toBe('memorization');
  });

  it('ideation_eval -> plan on pass', () => {
    const state = stateAt('ideation_eval');
    const next = expectOk(reduce(state, verdictPass()));
    expect(next.currentStep).toBe('planning');
  });

  it('plan_eval -> execution on pass', () => {
    const state = stateAt('planning_eval');
    const next = expectOk(reduce(state, verdictPass()));
    expect(next.currentStep).toBe('execution');
  });
});

// ---------------------------------------------------------------------------
// 10. decision.eval.verdict (revise): loops back, increments feedbackRound
// ---------------------------------------------------------------------------

describe('decision.eval.verdict revise', () => {
  it('execution_eval -> execution on revise with loopTarget=execution', () => {
    const state = stateAt('execution_eval');
    const next = expectOk(reduce(state, verdictRevise('execution')));
    expect(next.currentStep).toBe('execution');
    expect(next.feedbackRound).toBe(1);
  });

  it('execution_eval -> plan on revise with loopTarget=plan', () => {
    const state = stateAt('execution_eval');
    const next = expectOk(reduce(state, verdictRevise('planning')));
    expect(next.currentStep).toBe('planning');
    expect(next.feedbackRound).toBe(1);
  });

  it('execution_eval -> ideation on revise with loopTarget=ideation', () => {
    const state = stateAt('execution_eval');
    const next = expectOk(reduce(state, verdictRevise('ideation')));
    expect(next.currentStep).toBe('ideation');
    expect(next.currentSubstate).toBe('discussing');
    expect(next.feedbackRound).toBe(1);
  });

  it('ideation_eval revise does NOT increment feedbackRound', () => {
    const state = stateAt('ideation_eval');
    const next = expectOk(reduce(state, verdictRevise()));
    expect(next.currentStep).toBe('ideation');
    expect(next.feedbackRound).toBe(0);
  });

  it('plan_eval revise does NOT increment feedbackRound', () => {
    const state = stateAt('planning_eval');
    const next = expectOk(reduce(state, verdictRevise()));
    expect(next.currentStep).toBe('planning');
    expect(next.feedbackRound).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 11. Feedback cap: revise with feedbackRound >= maxFeedbackRounds -> error
// ---------------------------------------------------------------------------

describe('feedback cap', () => {
  it('execution_eval revise -> error when feedbackRound >= maxFeedbackRounds', () => {
    const state = stateAt('execution_eval', {
      feedbackRound: 3,
      maxFeedbackRounds: 3,
    });
    const next = expectOk(reduce(state, verdictRevise('execution')));
    expect(next.currentStep).toBe('error');
  });

  it('execution_eval revise -> error when feedbackRound exceeds max', () => {
    const state = stateAt('execution_eval', {
      feedbackRound: 5,
      maxFeedbackRounds: 3,
    });
    const next = expectOk(reduce(state, verdictRevise('planning')));
    expect(next.currentStep).toBe('error');
  });

  it('feedback cap does not affect pass verdict', () => {
    const state = stateAt('execution_eval', {
      feedbackRound: 3,
      maxFeedbackRounds: 3,
    });
    const next = expectOk(reduce(state, verdictPass()));
    expect(next.currentStep).toBe('memorization');
  });
});

// ---------------------------------------------------------------------------
// 12. guard.violation: appends to violations
// ---------------------------------------------------------------------------

describe('guard events', () => {
  it('violation appends to violations array', () => {
    const state = stateAt('execution');
    const next = expectOk(reduce(state, guardViolation('guard-scope')));
    expect(next.violations).toHaveLength(1);
    expect(next.violations[0]!.guardId).toBe('guard-scope');
    expect(next.violations[0]!.toolName).toBe('Write');
    expect(next.violations[0]!.reason).toBe('Scope violation');
    expect(next.violations[0]!.step).toBe('execution');
  });

  it('violations accumulate', () => {
    const state = stateAt('execution', {
      violations: [
        {
          guardId: 'g-prev',
          toolName: 'Read',
          reason: 'prior violation',
          step: 'planning',
          timestamp: '2026-01-01T00:00:00.000Z',
        },
      ],
    });
    const next = expectOk(reduce(state, guardViolation('g-new')));
    expect(next.violations).toHaveLength(2);
    expect(next.violations[1]!.guardId).toBe('g-new');
  });

  it('override does not change state', () => {
    const state = stateAt('execution');
    const next = expectOk(reduce(state, guardOverride()));
    expect(next).toEqual(state);
  });
});

// ---------------------------------------------------------------------------
// 13. session.heartbeat: no state change, ok result
// ---------------------------------------------------------------------------

describe('session.heartbeat', () => {
  it('returns ok with unchanged state', () => {
    const state = stateAt('execution');
    const next = expectOk(reduce(state, heartbeat()));
    expect(next).toEqual(state);
  });
});

// ---------------------------------------------------------------------------
// 14. workflow.step.timeout: any active -> error
// ---------------------------------------------------------------------------

describe('workflow.step.timeout', () => {
  const activeSteps: WorkflowStep[] = [
    'ideation',
    'ideation_eval',
    'planning',
    'planning_eval',
    'execution',
    'execution_eval',
    'memorization',
  ];

  for (const step of activeSteps) {
    it(`${step} -> error via step.timeout`, () => {
      const state = stateAt(step);
      const next = expectOk(reduce(state, stepTimeout(step)));
      expect(next.currentStep).toBe('error');
      expect(next.currentSubstate).toBeNull();
    });
  }

  it('rejects timeout from idle (not an active step)', () => {
    const state = stateAt('idle');
    const error = expectErr(reduce(state, stepTimeout('idle')));
    expect(error).toContain('active step');
  });
});

// ---------------------------------------------------------------------------
// 15. workflow.abort: error -> done
// ---------------------------------------------------------------------------

describe('workflow.abort', () => {
  it('transitions error -> done', () => {
    const state = stateAt('error');
    const next = expectOk(reduce(state, abort()));
    expect(next.currentStep).toBe('done');
    expect(next.currentSubstate).toBeNull();
  });

  it('rejects abort from non-error step', () => {
    const state = stateAt('execution');
    const error = expectErr(reduce(state, abort()));
    expect(error).toContain('error state');
  });
});

// ---------------------------------------------------------------------------
// 15b. workflow.invalid_transition: audit record, state unchanged
// ---------------------------------------------------------------------------

describe('workflow.invalid_transition', () => {
  it('is an observational no-op — state does not change', () => {
    const state = stateAt('error', {
      feedbackRound: 2,
      completedSteps: ['ideation', 'planning'],
    });
    const event: Event = {
      type: WORKFLOW_EVENTS.INVALID_TRANSITION,
      data: {
        rejectedEventType: 'workflow.abort',
        rejectedEventSeq: null,
        stepAtRejection: 'ideation',
        reducerMessage: 'workflow.abort requires error state, got ideation',
        timestamp: '2026-01-01T00:00:00.000Z',
      },
    };
    const next = expectOk(reduce(state, event));
    // Structural equality — every field preserved, no mutation.
    expect(next).toEqual(state);
  });

  it('applies cleanly from any active step (replay-safe)', () => {
    // The audit event is emitted regardless of current step; reducer must
    // tolerate replay from any non-terminal step.
    const state = stateAt('execution');
    const event: Event = {
      type: WORKFLOW_EVENTS.INVALID_TRANSITION,
      data: {
        rejectedEventType: 'workflow.finish',
        rejectedEventSeq: null,
        stepAtRejection: 'execution',
        reducerMessage: 'workflow.finish requires handoff state, got execution',
        timestamp: '2026-01-01T00:00:00.000Z',
      },
    };
    const next = expectOk(reduce(state, event));
    expect(next).toEqual(state);
  });
});

// ---------------------------------------------------------------------------
// 16. workflow.resume: error -> targetStep
// ---------------------------------------------------------------------------

describe('workflow.resume', () => {
  it('transitions error -> targetStep', () => {
    const state = stateAt('error');
    const next = expectOk(reduce(state, resume('execution')));
    expect(next.currentStep).toBe('execution');
  });

  it('sets discussing substate when resuming to ideation', () => {
    const state = stateAt('error');
    const next = expectOk(reduce(state, resume('ideation')));
    expect(next.currentStep).toBe('ideation');
    expect(next.currentSubstate).toBe('discussing');
  });

  it('rejects resume from non-error step', () => {
    const state = stateAt('execution');
    const error = expectErr(reduce(state, resume('planning')));
    expect(error).toContain('error state');
  });

  it('rejects resume to invalid targetStep (done)', () => {
    const state = stateAt('error');
    const error = expectErr(reduce(state, resume('done')));
    expect(error).toContain('not a valid active step');
  });

  it('rejects resume to idle', () => {
    const state = stateAt('error');
    const error = expectErr(reduce(state, resume('idle')));
    expect(error).toContain('not a valid active step');
  });
});

// ---------------------------------------------------------------------------
// 17. Invalid transition: returns error result, not throw
// ---------------------------------------------------------------------------

describe('invalid transitions return error, not throw', () => {
  it('workflow.finish from idle returns error', () => {
    const result = reduce(stateAt('idle'), finish());
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('handoff');
    }
  });

  it('verdict pass from execution returns error (not an eval step)', () => {
    const result = reduce(stateAt('execution'), verdictPass());
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('No valid transition');
    }
  });

  it('step.exit with wrong step returns error', () => {
    const result = reduce(stateAt('planning'), stepExit('execution'));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('does not match');
    }
  });
});

// ---------------------------------------------------------------------------
// Informational events: decision.user, decision.eval.skip
// ---------------------------------------------------------------------------

describe('informational events', () => {
  it('decision.user is a no-op', () => {
    const state = stateAt('ideation');
    const next = expectOk(reduce(state, decisionUser()));
    expect(next).toEqual(state);
  });

  it('decision.eval.skip is a no-op', () => {
    const state = stateAt('ideation');
    const next = expectOk(reduce(state, evalSkip('ideation')));
    expect(next).toEqual(state);
  });

  it('decision.eval.skip with priorError is a no-op (CP11 reversibility)', () => {
    // Schema v3 extension — the `priorError` snapshot carries full
    // ErrorPathway context for the force-memorization audit trail, but
    // the reducer MUST NOT project any of it into state. The audit is on
    // the event itself; state is already correct because the caller emits
    // a `workflow.resume` in the same transaction which drives the actual
    // step transition.
    const state = stateAt('error');
    const skipWithPriorError: Event = {
      type: DECISION_EVENTS.EVAL_SKIP,
      data: {
        step: 'memorization',
        priorError: {
          pathway: {
            kind: 'crash',
            stepAtCrash: 'execution',
            lastEventSeqs: [1, 2, 3],
            heartbeatEventSeq: null,
          },
          capturedAt: '2026-02-01T00:00:00.000Z',
          stepAtError: 'error',
          witnessEventSeqs: [1, 2, 3],
        },
      },
    };
    const next = expectOk(reduce(state, skipWithPriorError));
    // State is byte-for-byte unchanged — including no new fields derived
    // from the priorError payload.
    expect(next).toEqual(state);
    expect(next).toBe(state);
  });

  it('decision.eval.skip with priorError round-trips through JSON without loss', () => {
    // Guards the wire-format invariant that CP11 reconstruction
    // (later read via `store.lastN('decision.eval.skip', 1)[0].data`) sees
    // the exact nested ErrorPathway shape the caller emitted.
    const priorError = {
      pathway: {
        kind: 'timeout' as const,
        timedOutStep: 'execution',
        elapsedMs: 12_000,
        configuredTimeoutMs: 10_000,
        timeoutEventSeq: 42,
        inProgressArtifacts: ['work.md'],
      },
      capturedAt: '2026-02-01T00:00:00.000Z',
      stepAtError: 'error',
      witnessEventSeqs: [42],
    };
    const payload = { step: 'memorization', priorError };
    const reparsed = JSON.parse(JSON.stringify(payload)) as typeof payload;
    expect(reparsed).toEqual(payload);
    expect(reparsed.priorError.pathway.kind).toBe('timeout');
    expect(reparsed.priorError.witnessEventSeqs).toEqual([42]);
  });
});

// ---------------------------------------------------------------------------
// Immutability verification
// ---------------------------------------------------------------------------

describe('immutability', () => {
  it('reduce never mutates the input state', () => {
    const state = stateAt('idle');
    const frozen = Object.freeze({ ...state });
    // Object.freeze is shallow, but the reducer should use spread
    const result = reduce(frozen, workflowStart());
    expect(result.ok).toBe(true);
    // Original state unchanged
    expect(frozen.currentStep).toBe('idle');
    expect(frozen.currentSubstate).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// workflow.step.skip: validated via findTransition
// ---------------------------------------------------------------------------

describe('workflow.step.skip', () => {
  it('skips from plan to ideation', () => {
    const state = stateAt('planning');
    const next = expectOk(reduce(state, stepSkip('ideation')));
    expect(next.currentStep).toBe('ideation');
    expect(next.currentSubstate).toBe('discussing');
  });

  it('rejects self-skip from ideation', () => {
    const state = stateAt('ideation');
    const error = expectErr(reduce(state, stepSkip('ideation')));
    expect(error).toContain('No valid transition');
  });
});

// ---------------------------------------------------------------------------
// E.10 — stepStartedAt state field (per L13)
//
// The reducer stamps `stepStartedAt` with the event's wall-clock timestamp
// at two transition points:
//   - `workflow.step.exit` — the entry timestamp of the NEXT step
//   - `workflow.resume`   — the entry timestamp of the resume TARGET step
// No new event type carries the timestamp; it is supplied as the third
// argument to `reduce()` by the engine (`effectiveTs`) and by `deriveState`
// (EventRow.ts) during replay. Direct test call sites that omit `ts` see
// the prior value preserved — the field is a monotonic witness.
// ---------------------------------------------------------------------------

describe('E.10 — stepStartedAt', () => {
  it('initialState has stepStartedAt === null', () => {
    const state = initialState('test-session');
    expect(state.stepStartedAt).toBeNull();
  });

  it('STEP_EXIT stamps stepStartedAt with the supplied ts for the next step', () => {
    // From a fresh ideation state with stepStartedAt=null, exit to plan
    // with an explicit ts. The new state records the ts as the plan
    // entry time.
    const state = stateAt('ideation', {
      evalConfig: { ideation: false, planning: false },
      stepStartedAt: null,
    });
    const exitTs = '2026-04-18T13:35:00.000Z';
    const next = expectOk(reduce(state, stepExit('ideation'), exitTs));
    expect(next.currentStep).toBe('planning');
    expect(next.stepStartedAt).toBe(exitTs);
  });

  it('subsequent STEP_EXIT overwrites stepStartedAt with the newer ts', () => {
    // Simulate a session that already had an earlier stepStartedAt stamp
    // (e.g. from entering plan), then exits plan to execution. The field
    // advances to the new event's ts — never moves backward.
    const earlier = '2026-04-18T13:35:00.000Z';
    const later = '2026-04-18T14:00:00.000Z';
    const state = stateAt('planning', {
      evalConfig: { ideation: false, planning: false },
      stepStartedAt: earlier,
    });
    const next = expectOk(reduce(state, stepExit('planning'), later));
    expect(next.currentStep).toBe('execution');
    expect(next.stepStartedAt).toBe(later);
    // Sanity — original state frozen semantics, not mutated.
    expect(state.stepStartedAt).toBe(earlier);
  });

  it('workflow.resume stamps stepStartedAt with the supplied ts on the target step', () => {
    // Error → execution resume. The target step's entry is timestamped
    // even though the prior state was `error` (which was NOT stamped by
    // STEP_EXIT — reducer only stamps STEP_EXIT/RESUME productive entries).
    const resumeTs = '2026-04-18T15:00:00.000Z';
    const state = stateAt('error', { stepStartedAt: null });
    const next = expectOk(reduce(state, resume('execution'), resumeTs));
    expect(next.currentStep).toBe('execution');
    expect(next.stepStartedAt).toBe(resumeTs);
  });

  it('reduce with omitted ts preserves prior stepStartedAt on STEP_EXIT', () => {
    // Legacy call sites that omit `ts` (most unit tests) must not clobber
    // a previously-stamped stepStartedAt to null — the field stays as a
    // monotonic witness. This guards the signature's backward-compat.
    const prior = '2026-04-18T13:35:00.000Z';
    const state = stateAt('ideation', {
      evalConfig: { ideation: false, planning: false },
      stepStartedAt: prior,
    });
    const next = expectOk(reduce(state, stepExit('ideation')));
    expect(next.currentStep).toBe('planning');
    expect(next.stepStartedAt).toBe(prior);
  });

  it('stepStartedAt round-trips through JSON.stringify / JSON.parse unchanged', () => {
    // ISO-string choice (over epoch-number) is explicitly justified for
    // round-trip safety in state.ts. Guard it at the reducer-output level
    // so any future switch to epoch-ms is caught here.
    const ts = '2026-04-18T13:35:00.000Z';
    const state = stateAt('ideation', {
      evalConfig: { ideation: false, planning: false },
    });
    const next = expectOk(reduce(state, stepExit('ideation'), ts));
    const reparsed = JSON.parse(JSON.stringify(next)) as WorkflowState;
    expect(reparsed.stepStartedAt).toBe(ts);
    expect(reparsed.stepStartedAt).toBe(next.stepStartedAt);
  });

  it('isValidState accepts null and ISO strings, rejects non-string non-null values', () => {
    // isValidState is the gate against corrupted on-disk state.json. A
    // non-null non-string stepStartedAt (numbers, objects, booleans) must
    // be rejected so restoreBackup / readState fall through to the next
    // layer rather than handing corrupted state to the reducer.
    const base = initialState('s1') as unknown as Record<string, unknown>;

    expect(isValidState({ ...base, stepStartedAt: null })).toBe(true);
    expect(
      isValidState({ ...base, stepStartedAt: '2026-04-18T13:35:00.000Z' }),
    ).toBe(true);
    // `undefined` is tolerated for v1/v2/v3 on-disk compat (normalised to
    // `null` on read).
    const withoutField = { ...base };
    delete withoutField['stepStartedAt'];
    expect(isValidState(withoutField)).toBe(true);

    // Rejections.
    expect(isValidState({ ...base, stepStartedAt: 1700000000000 })).toBe(false);
    expect(isValidState({ ...base, stepStartedAt: {} })).toBe(false);
    expect(isValidState({ ...base, stepStartedAt: true })).toBe(false);
    expect(isValidState({ ...base, stepStartedAt: [] })).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Audit-only event runtime fence (Wave A.1.3)
//
// `step.advancement.observed` is committed via `store.append()` directly
// per orchestration NOTE-2. It is NOT a member of the reducer-typed `Event`
// union, so callers normally cannot pass it to `reduce()` at compile time.
// These tests cover the runtime-fence branch in `reduce()` that returns the
// state unchanged when an audit-only event somehow does reach the reducer
// (e.g. through a cast, a JSON-roundtrip replay, or a future regression).
// The expectation: state is unchanged, `result.ok === true`, and the reducer
// MUST NOT throw — defending against the silent-fail mode that
// state-db-redesign.md §1 documents.
// ---------------------------------------------------------------------------

describe('audit-only events bypass the reducer (Wave A.1.3)', () => {
  // The runtime fence treats audit-only events as observability-only:
  // state is returned unchanged regardless of step. We construct the event
  // and cast it through the union via `unknown` because the type system
  // (correctly) rejects passing an `AuditOnlyEvent` to a parameter typed
  // as `Event`. The cast simulates the on-the-wire replay path that
  // discards the type-level discriminator.
  const advanceObservedEvent = createStepAdvancementObserved({
    step: 'planning',
    toolCallId: 'tc-pa-1',
    timestamp: '2026-04-25T12:00:00.000Z',
  }) as unknown as Event;

  it('returns ok with state unchanged when handed step.advancement.observed at an active step', () => {
    const state = stateAt('planning');
    const result = reduce(state, advanceObservedEvent);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('expected ok');
    expect(result.state).toEqual(state);
    // Same identity reference — the fence skips the spread that
    // sub-reducers use, so callers that depend on `===` for cache
    // invalidation can rely on a referential no-op.
    expect(result.state).toBe(state);
  });

  it('returns ok with state unchanged when handed step.advancement.observed at idle', () => {
    const state = stateAt('idle');
    const result = reduce(state, advanceObservedEvent);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('expected ok');
    expect(result.state).toBe(state);
  });

  it('returns ok with state unchanged even at terminal states (audit fence runs before terminal-state rejection)', () => {
    // Audit-only events are observability-only — they have no business
    // logic and must persist regardless of state. The `done` / `error`
    // terminal-state guard would otherwise reject every event with a
    // step error message; the audit fence must intercept BEFORE that
    // guard. This is the architectural ordering invariant.
    const doneState = stateAt('done');
    const r1 = reduce(doneState, advanceObservedEvent);
    expect(r1.ok).toBe(true);
    if (r1.ok) expect(r1.state).toBe(doneState);

    const errorState = stateAt('error');
    const r2 = reduce(errorState, advanceObservedEvent);
    expect(r2.ok).toBe(true);
    if (r2.ok) expect(r2.state).toBe(errorState);
  });

  it('does not throw when handed an audit-only event (defense-in-depth against silent-fail mode)', () => {
    // The reducer's `assertNever` would throw a plain Error if the audit
    // event reached the bottom of the dispatch chain. The fence at the
    // top of `reduce()` is the runtime guarantee that this throw cannot
    // surface — the test calls `reduce()` directly and asserts NO throw.
    const state = stateAt('execution');
    expect(() => reduce(state, advanceObservedEvent)).not.toThrow();
  });

  it('STEP_ADVANCEMENT_EVENTS.OBSERVED is the constant the reducer fence narrows', () => {
    // Sanity check — the test fixtures above use the typed factory; this
    // assertion documents the type-string the runtime fence checks for.
    expect(STEP_ADVANCEMENT_EVENTS.OBSERVED).toBe('step.advancement.observed');
  });
});
