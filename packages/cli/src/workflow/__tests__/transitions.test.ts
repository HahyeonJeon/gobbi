import { describe, it, expect } from 'bun:test';

import { initialState } from '../state.js';
import type { WorkflowState, WorkflowStep, EvalConfig } from '../state.js';
import { ACTIVE_STEPS } from '../state.js';
import { findTransition, TRANSITION_TABLE } from '../transitions.js';
import type { TransitionRule } from '../transitions.js';
import { defaultPredicates, validatePredicateReferences } from '../predicates.js';
import type { PredicateRegistry } from '../predicates.js';
import { WORKFLOW_EVENTS } from '../events/workflow.js';
import { DECISION_EVENTS } from '../events/decision.js';
import type { Event } from '../events/index.js';

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

function withEvalConfig(
  state: WorkflowState,
  config: EvalConfig,
): WorkflowState {
  return { ...state, evalConfig: config };
}

// Event factory helpers — produce minimal typed Event objects

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

function finish(): Event {
  return { type: WORKFLOW_EVENTS.FINISH, data: {} };
}

function abort(): Event {
  return { type: WORKFLOW_EVENTS.ABORT, data: {} };
}

function resume(targetStep: string): Event {
  return {
    type: WORKFLOW_EVENTS.RESUME,
    data: { targetStep, fromError: true },
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
    data: { verdict: 'revise', loopTarget },
  };
}

// ---------------------------------------------------------------------------
// Normal workflow progression
// ---------------------------------------------------------------------------

describe('normal workflow progression', () => {
  it('idle -> ideation via workflow.start', () => {
    const state = stateAt('idle');
    const rule = findTransition('idle', workflowStart(), state, defaultPredicates);
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('ideation');
  });

  it('ideation -> ideation_eval when evalConfig.ideation is true', () => {
    const state = withEvalConfig(stateAt('ideation'), { ideation: true, plan: false });
    const rule = findTransition('ideation', stepExit('ideation'), state, defaultPredicates);
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('ideation_eval');
  });

  it('ideation -> plan when evalConfig.ideation is false', () => {
    const state = withEvalConfig(stateAt('ideation'), { ideation: false, plan: false });
    const rule = findTransition('ideation', stepExit('ideation'), state, defaultPredicates);
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('plan');
  });

  it('ideation -> plan when evalConfig is null (ideation eval disabled by default)', () => {
    const state = stateAt('ideation');
    const rule = findTransition('ideation', stepExit('ideation'), state, defaultPredicates);
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('plan');
  });

  it('ideation_eval -> ideation on revise verdict', () => {
    const state = stateAt('ideation_eval');
    const rule = findTransition('ideation_eval', verdictRevise(), state, defaultPredicates);
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('ideation');
  });

  it('ideation_eval -> plan on pass verdict', () => {
    const state = stateAt('ideation_eval');
    const rule = findTransition('ideation_eval', verdictPass(), state, defaultPredicates);
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('plan');
  });

  it('plan -> plan_eval when evalConfig.plan is true', () => {
    const state = withEvalConfig(stateAt('plan'), { ideation: false, plan: true });
    const rule = findTransition('plan', stepExit('plan'), state, defaultPredicates);
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('plan_eval');
  });

  it('plan -> execution when evalConfig.plan is false', () => {
    const state = withEvalConfig(stateAt('plan'), { ideation: false, plan: false });
    const rule = findTransition('plan', stepExit('plan'), state, defaultPredicates);
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('execution');
  });

  it('plan_eval -> plan on revise verdict', () => {
    const state = stateAt('plan_eval');
    const rule = findTransition('plan_eval', verdictRevise(), state, defaultPredicates);
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('plan');
  });

  it('plan_eval -> execution on pass verdict', () => {
    const state = stateAt('plan_eval');
    const rule = findTransition('plan_eval', verdictPass(), state, defaultPredicates);
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('execution');
  });

  it('execution -> execution_eval always (no condition)', () => {
    const state = stateAt('execution');
    const rule = findTransition('execution', stepExit('execution'), state, defaultPredicates);
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('execution_eval');
  });

  it('execution_eval -> memorization on pass verdict', () => {
    const state = stateAt('execution_eval');
    const rule = findTransition('execution_eval', verdictPass(), state, defaultPredicates);
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('memorization');
  });

  it('memorization -> done via workflow.finish', () => {
    const state = stateAt('memorization');
    const rule = findTransition('memorization', finish(), state, defaultPredicates);
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('done');
  });
});

// ---------------------------------------------------------------------------
// Feedback loops from execution_eval
// ---------------------------------------------------------------------------

describe('feedback loops from execution_eval', () => {
  it('execution_eval -> ideation on revise with loopTarget=ideation', () => {
    const state = stateAt('execution_eval');
    const rule = findTransition(
      'execution_eval',
      verdictRevise('ideation'),
      state,
      defaultPredicates,
    );
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('ideation');
  });

  it('execution_eval -> plan on revise with loopTarget=plan', () => {
    const state = stateAt('execution_eval');
    const rule = findTransition(
      'execution_eval',
      verdictRevise('plan'),
      state,
      defaultPredicates,
    );
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('plan');
  });

  it('execution_eval -> execution on revise with loopTarget=execution', () => {
    const state = stateAt('execution_eval');
    const rule = findTransition(
      'execution_eval',
      verdictRevise('execution'),
      state,
      defaultPredicates,
    );
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('execution');
  });
});

// ---------------------------------------------------------------------------
// Feedback cap
// ---------------------------------------------------------------------------

describe('feedback cap', () => {
  it('execution_eval -> error when feedbackRound >= maxFeedbackRounds', () => {
    const state = stateAt('execution_eval', {
      feedbackRound: 3,
      maxFeedbackRounds: 3,
    });
    const rule = findTransition(
      'execution_eval',
      verdictRevise('execution'),
      state,
      defaultPredicates,
    );
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('error');
  });

  it('execution_eval -> error even when feedbackRound exceeds max', () => {
    const state = stateAt('execution_eval', {
      feedbackRound: 5,
      maxFeedbackRounds: 3,
    });
    const rule = findTransition(
      'execution_eval',
      verdictRevise('plan'),
      state,
      defaultPredicates,
    );
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('error');
  });

  it('execution_eval -> loopTarget when feedbackRound < maxFeedbackRounds', () => {
    const state = stateAt('execution_eval', {
      feedbackRound: 2,
      maxFeedbackRounds: 3,
    });
    const rule = findTransition(
      'execution_eval',
      verdictRevise('execution'),
      state,
      defaultPredicates,
    );
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('execution');
  });

  it('feedback cap does not affect pass verdict', () => {
    const state = stateAt('execution_eval', {
      feedbackRound: 3,
      maxFeedbackRounds: 3,
    });
    const rule = findTransition('execution_eval', verdictPass(), state, defaultPredicates);
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('memorization');
  });
});

// ---------------------------------------------------------------------------
// Terminal state
// ---------------------------------------------------------------------------

describe('terminal state', () => {
  it('done rejects workflow.start', () => {
    const rule = findTransition('done', workflowStart(), stateAt('done'), defaultPredicates);
    expect(rule).toBeNull();
  });

  it('done rejects workflow.resume', () => {
    const rule = findTransition('done', resume('ideation'), stateAt('done'), defaultPredicates);
    expect(rule).toBeNull();
  });

  it('done rejects workflow.abort', () => {
    const rule = findTransition('done', abort(), stateAt('done'), defaultPredicates);
    expect(rule).toBeNull();
  });

  it('done rejects step.skip', () => {
    const rule = findTransition('done', stepSkip('ideation'), stateAt('done'), defaultPredicates);
    expect(rule).toBeNull();
  });

  it('done rejects step.timeout', () => {
    const rule = findTransition(
      'done',
      stepTimeout('memorization'),
      stateAt('done'),
      defaultPredicates,
    );
    expect(rule).toBeNull();
  });

  it('done rejects verdict events', () => {
    const rule = findTransition('done', verdictPass(), stateAt('done'), defaultPredicates);
    expect(rule).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Error reachability — timeout from any active step
// ---------------------------------------------------------------------------

describe('error reachability via timeout', () => {
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
      const rule = findTransition(step, stepTimeout(step), state, defaultPredicates);
      expect(rule).not.toBeNull();
      expect(rule!.to).toBe('error');
    });
  }

  it('idle does not transition to error on timeout (not in table)', () => {
    const rule = findTransition(
      'idle',
      stepTimeout('idle'),
      stateAt('idle'),
      defaultPredicates,
    );
    expect(rule).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Error recovery
// ---------------------------------------------------------------------------

describe('error recovery', () => {
  it('error -> done via workflow.abort', () => {
    const state = stateAt('error');
    const rule = findTransition('error', abort(), state, defaultPredicates);
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('done');
  });

  it('error -> prior step via workflow.resume with valid targetStep', () => {
    const state = stateAt('error');
    const rule = findTransition('error', resume('execution'), state, defaultPredicates);
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('execution');
    expect(rule!.from).toBe('error');
    expect(rule!.trigger).toBe(WORKFLOW_EVENTS.RESUME);
  });

  it('error -> ideation via workflow.resume', () => {
    const state = stateAt('error');
    const rule = findTransition('error', resume('ideation'), state, defaultPredicates);
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('ideation');
  });

  it('resume with invalid targetStep returns null', () => {
    const state = stateAt('error');
    const rule = findTransition('error', resume('done'), state, defaultPredicates);
    expect(rule).toBeNull();
  });

  it('resume with idle as targetStep returns null', () => {
    const state = stateAt('error');
    const rule = findTransition('error', resume('idle'), state, defaultPredicates);
    expect(rule).toBeNull();
  });

  it('resume from non-error state returns null', () => {
    const state = stateAt('ideation');
    const rule = findTransition('ideation', resume('plan'), state, defaultPredicates);
    expect(rule).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Skip transitions
// ---------------------------------------------------------------------------

describe('skip transitions', () => {
  const skippableSteps: WorkflowStep[] = [
    'ideation_eval',
    'plan',
    'plan_eval',
    'execution',
    'execution_eval',
    'memorization',
  ];

  for (const step of skippableSteps) {
    it(`${step} -> ideation via step.skip`, () => {
      const state = stateAt(step);
      const rule = findTransition(step, stepSkip('ideation'), state, defaultPredicates);
      expect(rule).not.toBeNull();
      expect(rule!.to).toBe('ideation');
    });
  }

  it('self-skip from ideation is rejected (no rule)', () => {
    const state = stateAt('ideation');
    const rule = findTransition('ideation', stepSkip('ideation'), state, defaultPredicates);
    expect(rule).toBeNull();
  });

  it('skip from idle is rejected', () => {
    const state = stateAt('idle');
    const rule = findTransition('idle', stepSkip('ideation'), state, defaultPredicates);
    expect(rule).toBeNull();
  });

  it('skip from error is rejected', () => {
    const state = stateAt('error');
    const rule = findTransition('error', stepSkip('ideation'), state, defaultPredicates);
    expect(rule).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Priority — error takes precedence over skip
// ---------------------------------------------------------------------------

describe('priority rules', () => {
  it('timeout rules have lower priority number than skip rules', () => {
    const timeoutRules = TRANSITION_TABLE.filter(
      (r) => r.trigger === WORKFLOW_EVENTS.STEP_TIMEOUT,
    );
    const skipRules = TRANSITION_TABLE.filter(
      (r) => r.trigger === WORKFLOW_EVENTS.STEP_SKIP,
    );

    for (const tr of timeoutRules) {
      for (const sr of skipRules) {
        expect(tr.priority).toBeLessThan(sr.priority);
      }
    }
  });

  it('feedback cap error has lower priority than loopTarget transitions', () => {
    const capRule = TRANSITION_TABLE.find(
      (r) =>
        r.from === 'execution_eval' &&
        r.to === 'error' &&
        r.condition === 'feedbackCapExceeded',
    );
    const loopRules = TRANSITION_TABLE.filter(
      (r) =>
        r.from === 'execution_eval' &&
        r.verdict === 'revise' &&
        r.loopTarget !== undefined,
    );

    expect(capRule).toBeDefined();
    for (const lr of loopRules) {
      expect(capRule!.priority).toBeLessThan(lr.priority);
    }
  });
});

// ---------------------------------------------------------------------------
// Invalid transitions — no matching rule
// ---------------------------------------------------------------------------

describe('invalid transitions', () => {
  it('idle rejects step.exit', () => {
    const rule = findTransition(
      'idle',
      stepExit('idle'),
      stateAt('idle'),
      defaultPredicates,
    );
    expect(rule).toBeNull();
  });

  it('idle rejects verdict events', () => {
    const rule = findTransition('idle', verdictPass(), stateAt('idle'), defaultPredicates);
    expect(rule).toBeNull();
  });

  it('ideation rejects workflow.start', () => {
    const rule = findTransition(
      'ideation',
      workflowStart(),
      stateAt('ideation'),
      defaultPredicates,
    );
    expect(rule).toBeNull();
  });

  it('plan rejects verdict events', () => {
    const rule = findTransition('plan', verdictPass(), stateAt('plan'), defaultPredicates);
    expect(rule).toBeNull();
  });

  it('execution rejects verdict events', () => {
    const rule = findTransition(
      'execution',
      verdictRevise('execution'),
      stateAt('execution'),
      defaultPredicates,
    );
    expect(rule).toBeNull();
  });

  it('memorization rejects step.exit', () => {
    const rule = findTransition(
      'memorization',
      stepExit('memorization'),
      stateAt('memorization'),
      defaultPredicates,
    );
    expect(rule).toBeNull();
  });

  it('error rejects workflow.start', () => {
    const rule = findTransition(
      'error',
      workflowStart(),
      stateAt('error'),
      defaultPredicates,
    );
    expect(rule).toBeNull();
  });

  it('error rejects step.exit', () => {
    const rule = findTransition(
      'error',
      stepExit('error'),
      stateAt('error'),
      defaultPredicates,
    );
    expect(rule).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Predicate evaluation — evalConfig routing
// ---------------------------------------------------------------------------

describe('predicate evaluation', () => {
  it('ideation routes to ideation_eval when ideation eval enabled', () => {
    const state = withEvalConfig(stateAt('ideation'), { ideation: true, plan: true });
    const rule = findTransition('ideation', stepExit('ideation'), state, defaultPredicates);
    expect(rule!.to).toBe('ideation_eval');
  });

  it('ideation routes to plan when ideation eval disabled', () => {
    const state = withEvalConfig(stateAt('ideation'), { ideation: false, plan: true });
    const rule = findTransition('ideation', stepExit('ideation'), state, defaultPredicates);
    expect(rule!.to).toBe('plan');
  });

  it('plan routes to plan_eval when plan eval enabled', () => {
    const state = withEvalConfig(stateAt('plan'), { ideation: true, plan: true });
    const rule = findTransition('plan', stepExit('plan'), state, defaultPredicates);
    expect(rule!.to).toBe('plan_eval');
  });

  it('plan routes to execution when plan eval disabled', () => {
    const state = withEvalConfig(stateAt('plan'), { ideation: true, plan: false });
    const rule = findTransition('plan', stepExit('plan'), state, defaultPredicates);
    expect(rule!.to).toBe('execution');
  });

  it('missing predicate in registry treats rule as non-matching', () => {
    // Custom registry missing a predicate referenced by a rule
    const sparseRegistry: PredicateRegistry = {
      evalIdeationEnabled: (s) => s.evalConfig?.ideation === true,
      // evalIdeationDisabled intentionally missing
    };
    const state = withEvalConfig(stateAt('ideation'), { ideation: false, plan: false });
    const rule = findTransition('ideation', stepExit('ideation'), state, sparseRegistry);
    // evalIdeationEnabled returns false, evalIdeationDisabled is missing -> both fail
    expect(rule).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Predicate validation — static check for missing references
// ---------------------------------------------------------------------------

describe('validatePredicateReferences', () => {
  it('returns empty array when all predicates exist', () => {
    const errors = validatePredicateReferences(TRANSITION_TABLE, defaultPredicates);
    expect(errors).toEqual([]);
  });

  it('detects missing predicates', () => {
    const emptyRegistry: PredicateRegistry = {};
    const errors = validatePredicateReferences(TRANSITION_TABLE, emptyRegistry);
    expect(errors.length).toBeGreaterThan(0);
    // Should reference the specific missing predicate names
    expect(errors.some((e) => e.includes('evalIdeationEnabled'))).toBe(true);
    expect(errors.some((e) => e.includes('evalIdeationDisabled'))).toBe(true);
    expect(errors.some((e) => e.includes('evalPlanEnabled'))).toBe(true);
    expect(errors.some((e) => e.includes('evalPlanDisabled'))).toBe(true);
    expect(errors.some((e) => e.includes('feedbackCapExceeded'))).toBe(true);
  });

  it('reports which transition references the missing predicate', () => {
    const partialRegistry: PredicateRegistry = {
      evalIdeationEnabled: () => false,
      evalIdeationDisabled: () => true,
      evalPlanEnabled: () => false,
      evalPlanDisabled: () => true,
      // feedbackCapExceeded intentionally missing
    };
    const errors = validatePredicateReferences(TRANSITION_TABLE, partialRegistry);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('feedbackCapExceeded');
    expect(errors[0]).toContain('execution_eval');
    expect(errors[0]).toContain('error');
  });
});

// ---------------------------------------------------------------------------
// Transition table structural integrity
// ---------------------------------------------------------------------------

describe('transition table integrity', () => {
  it('all active steps are covered by timeout rules', () => {
    const timeoutFromSteps = new Set(
      TRANSITION_TABLE
        .filter((r) => r.trigger === WORKFLOW_EVENTS.STEP_TIMEOUT)
        .map((r) => r.from),
    );
    for (const step of ACTIVE_STEPS) {
      expect(timeoutFromSteps.has(step)).toBe(true);
    }
  });

  it('no duplicate rules (same from+trigger+verdict+loopTarget+condition)', () => {
    const keys = TRANSITION_TABLE.map(
      (r) => `${r.from}|${r.trigger}|${r.verdict ?? ''}|${r.loopTarget ?? ''}|${r.condition ?? ''}`,
    );
    const unique = new Set(keys);
    expect(unique.size).toBe(keys.length);
  });

  it('all transition targets are valid WorkflowStep values', () => {
    const validSteps: ReadonlySet<string> = new Set([
      'idle', 'ideation', 'ideation_eval', 'plan', 'plan_eval',
      'execution', 'execution_eval', 'memorization', 'done', 'error',
    ]);
    for (const rule of TRANSITION_TABLE) {
      expect(validSteps.has(rule.from)).toBe(true);
      expect(validSteps.has(rule.to)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Initial state factory
// ---------------------------------------------------------------------------

describe('initialState', () => {
  it('creates state at idle with correct defaults', () => {
    const state = initialState('sess-123');
    expect(state.schemaVersion).toBe(2);
    expect(state.sessionId).toBe('sess-123');
    expect(state.currentStep).toBe('idle');
    expect(state.currentSubstate).toBeNull();
    expect(state.completedSteps).toEqual([]);
    expect(state.evalConfig).toBeNull();
    expect(state.activeSubagents).toEqual([]);
    expect(state.artifacts).toEqual({});
    expect(state.violations).toEqual([]);
    expect(state.feedbackRound).toBe(0);
    expect(state.maxFeedbackRounds).toBe(3);
    expect(state.lastVerdictOutcome).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Compile-time verdict-predicate exclusion (C.3-d)
//
// TransitionRule.condition is narrowed to `Exclude<PredicateName,
// VerdictPredicateName>`. Authoring a rule with `condition: 'verdictPass'`
// or `condition: 'verdictRevise'` must fail at `tsc`. The `@ts-expect-error`
// comments below BOTH assert the error and document the hazard — if the
// narrowing is ever removed, `@ts-expect-error` flips to a typecheck error
// because it expected an error that no longer exists.
//
// This describe block is intentionally empty of runtime behaviour — it is a
// type-level test container, exercised by `tsc --noEmit`.
// ---------------------------------------------------------------------------

describe('TransitionRule.condition — verdict-predicate exclusion (type-level)', () => {
  it('rejects verdictPass as a condition (compile-time)', () => {
    const _rule: TransitionRule = {
      from: 'idle',
      to: 'ideation',
      trigger: WORKFLOW_EVENTS.START,
      // @ts-expect-error — verdictPass is a VerdictPredicateName and is excluded
      // from TransitionRule.condition. Verdict routing uses rule.verdict against
      // the event payload in findTransition(), not condition-predicate lookup.
      condition: 'verdictPass',
      priority: 0,
    };
    // The runtime body is a placeholder — `_rule` reference keeps the binding
    // from being tree-shaken in strict-unused-locals environments.
    expect(_rule.from).toBe('idle');
  });

  it('rejects verdictRevise as a condition (compile-time)', () => {
    const _rule: TransitionRule = {
      from: 'idle',
      to: 'ideation',
      trigger: WORKFLOW_EVENTS.START,
      // @ts-expect-error — verdictRevise is excluded; use rule.verdict instead.
      condition: 'verdictRevise',
      priority: 0,
    };
    expect(_rule.to).toBe('ideation');
  });

  it('accepts non-verdict predicate names (evalIdeationEnabled)', () => {
    const rule: TransitionRule = {
      from: 'ideation',
      to: 'ideation_eval',
      trigger: WORKFLOW_EVENTS.STEP_EXIT,
      condition: 'evalIdeationEnabled',
      priority: 0,
    };
    expect(rule.condition).toBe('evalIdeationEnabled');
  });
});
