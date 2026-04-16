import { describe, it, expect } from 'bun:test';

import { reduce } from '../reducer.js';
import type { ReducerResult } from '../reducer.js';
import { initialState } from '../state.js';
import type { WorkflowState, WorkflowStep, EvalConfig } from '../state.js';
import { defaultPredicates } from '../predicates.js';
import type { Event } from '../events/index.js';
import { WORKFLOW_EVENTS } from '../events/workflow.js';
import { DELEGATION_EVENTS } from '../events/delegation.js';
import { ARTIFACT_EVENTS } from '../events/artifact.js';
import { DECISION_EVENTS } from '../events/decision.js';
import { GUARD_EVENTS } from '../events/guard.js';
import { SESSION_EVENTS } from '../events/session.js';

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

function stepEnter(step: string, loopFrom?: string): Event {
  return {
    type: WORKFLOW_EVENTS.STEP_ENTER,
    data: loopFrom !== undefined ? { step, loopFrom } : { step },
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
): Event {
  return {
    type: DELEGATION_EVENTS.SPAWN,
    data: { subagentId, agentType, step },
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
      evalConfig: { ideation: false, plan: false },
    });
    const next = expectOk(reduce(state, stepExit('ideation')));
    expect(next.currentStep).toBe('plan');
    expect(next.completedSteps).toEqual(['ideation']);
    expect(next.currentSubstate).toBeNull();
  });

  it('ideation -> ideation_eval (eval enabled)', () => {
    const state = stateAt('ideation', {
      evalConfig: { ideation: true, plan: false },
    });
    const next = expectOk(reduce(state, stepExit('ideation')));
    expect(next.currentStep).toBe('ideation_eval');
  });

  it('rejects when step does not match currentStep', () => {
    const state = stateAt('ideation');
    const error = expectErr(reduce(state, stepExit('plan')));
    expect(error).toContain('does not match');
  });

  it('clears currentSubstate on exit', () => {
    const state = stateAt('ideation', {
      currentSubstate: 'discussing',
      evalConfig: { ideation: false, plan: false },
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
      completedSteps: ['ideation', 'plan'],
      evalConfig: { ideation: false, plan: false },
    });
    const next = expectOk(reduce(state, stepExit('execution')));
    expect(next.completedSteps).toEqual(['ideation', 'plan', 'execution']);
  });
});

// ---------------------------------------------------------------------------
// 4. workflow.eval.decide: sets evalConfig, immutable on second call
// ---------------------------------------------------------------------------

describe('workflow.eval.decide', () => {
  it('sets evalConfig when null', () => {
    const state = stateAt('ideation');
    const next = expectOk(reduce(state, evalDecide(true, false)));
    expect(next.evalConfig).toEqual({ ideation: true, plan: false });
  });

  it('is immutable — second call does not change evalConfig', () => {
    const state = stateAt('ideation', {
      evalConfig: { ideation: true, plan: false },
    });
    const next = expectOk(reduce(state, evalDecide(false, true)));
    expect(next.evalConfig).toEqual({ ideation: true, plan: false });
  });
});

// ---------------------------------------------------------------------------
// 5. workflow.finish: memorization -> done
// ---------------------------------------------------------------------------

describe('workflow.finish', () => {
  it('transitions memorization -> done', () => {
    const state = stateAt('memorization');
    const next = expectOk(reduce(state, finish()));
    expect(next.currentStep).toBe('done');
    expect(next.currentSubstate).toBeNull();
  });

  it('rejects finish from non-memorization step', () => {
    const state = stateAt('execution');
    const error = expectErr(reduce(state, finish()));
    expect(error).toContain('memorization');
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
    expect(next.currentStep).toBe('plan');
  });

  it('plan_eval -> execution on pass', () => {
    const state = stateAt('plan_eval');
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
    const next = expectOk(reduce(state, verdictRevise('plan')));
    expect(next.currentStep).toBe('plan');
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
    const state = stateAt('plan_eval');
    const next = expectOk(reduce(state, verdictRevise()));
    expect(next.currentStep).toBe('plan');
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
    const next = expectOk(reduce(state, verdictRevise('plan')));
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
          step: 'plan',
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
    'plan',
    'plan_eval',
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
    const error = expectErr(reduce(state, resume('plan')));
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
      expect(result.error).toContain('memorization');
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
    const result = reduce(stateAt('plan'), stepExit('execution'));
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
    const state = stateAt('plan');
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
