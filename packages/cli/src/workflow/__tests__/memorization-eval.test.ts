/**
 * PR-FIN-2a-i T-2a.7 — `memorization_eval` step coverage.
 *
 * Locks the new state-machine surface that gates the optional
 * memorization-evaluation loop on `evalConfig.memorization`:
 *
 *   1. `EvalConfig.memorization` slot — additive, write-once, default-absent.
 *   2. `EvalDecideData.memorization` payload field — optional, merged into
 *      state via the existing `state.evalConfig === null` write-once rule.
 *   3. `evalMemorizationEnabled` / `evalMemorizationDisabled` predicates —
 *      mirror `evalExecutionEnabled` / `evalExecutionDisabled` semantics.
 *   4. Graph routing — `findTransition(memorization, STEP_EXIT)` lands on
 *      `memorization_eval` when enabled and `handoff` when disabled.
 *   5. Verdict routing — `memorization_eval` accepts pass/revise verdicts,
 *      pass routes to `handoff`, revise routes back to `memorization` with
 *      feedback flag set.
 *
 * The companion settings cascade test
 * (`packages/cli/src/__tests__/features/q2-evalconfig-e2e.test.ts`)
 * covers the `gobbi config set workflow.memorization.evaluate.mode <mode>`
 * → `resolveEvalDecision` translation flow at the same coverage tier as
 * the other three steps.
 */

import { describe, it, test, expect } from 'bun:test';

import { reduce } from '../reducer.js';
import type { ReducerResult } from '../reducer.js';
import { initialState } from '../state.js';
import type { WorkflowState } from '../state.js';
import { defaultPredicates } from '../predicates.js';
import { findTransition } from '../transitions.js';
import { WORKFLOW_EVENTS } from '../events/workflow.js';
import { DECISION_EVENTS } from '../events/decision.js';
import type { Event } from '../events/index.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function baseState(): WorkflowState {
  return { ...initialState('memorization-eval-session'), currentStep: 'ideation' };
}

function expectOk(result: ReducerResult): WorkflowState {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error('Expected ok reducer result');
  return result.state;
}

function evalDecideMemorization(
  ideation: boolean,
  plan: boolean,
  memorization: boolean,
): Event {
  return {
    type: WORKFLOW_EVENTS.EVAL_DECIDE,
    data: { ideation, plan, memorization },
  };
}

function stepExit(step: string): Event {
  return { type: WORKFLOW_EVENTS.STEP_EXIT, data: { step } };
}

function verdictPass(): Event {
  return { type: DECISION_EVENTS.EVAL_VERDICT, data: { verdict: 'pass' } };
}

function verdictRevise(): Event {
  return { type: DECISION_EVENTS.EVAL_VERDICT, data: { verdict: 'revise' } };
}

// ---------------------------------------------------------------------------
// Reducer — EVAL_DECIDE memorization slot
// ---------------------------------------------------------------------------

describe('EVAL_DECIDE — memorization slot (T-2a.7)', () => {
  it('legacy 2-field payload leaves the memorization slot absent', () => {
    const next = expectOk(
      reduce(baseState(), {
        type: WORKFLOW_EVENTS.EVAL_DECIDE,
        data: { ideation: false, plan: false },
      }),
    );
    expect(next.evalConfig).toEqual({ ideation: false, planning: false });
    expect(next.evalConfig !== null && 'memorization' in next.evalConfig).toBe(false);
  });

  it('new payload writes memorization=true into state.evalConfig.memorization', () => {
    const next = expectOk(
      reduce(baseState(), evalDecideMemorization(false, false, true)),
    );
    expect(next.evalConfig?.memorization).toBe(true);
  });

  it('preserves the false memorization value verbatim', () => {
    const next = expectOk(
      reduce(baseState(), evalDecideMemorization(true, true, false)),
    );
    expect(next.evalConfig?.memorization).toBe(false);
  });

  it('first 2-field + second carrying memorization merges the slot', () => {
    const afterFirst = expectOk(
      reduce(baseState(), {
        type: WORKFLOW_EVENTS.EVAL_DECIDE,
        data: { ideation: true, plan: false },
      }),
    );
    const afterSecond = expectOk(
      reduce(afterFirst, evalDecideMemorization(false, true, true)),
    );
    expect(afterSecond.evalConfig).toEqual({
      ideation: true, // locked at first call
      planning: false, // locked at first call
      memorization: true, // merged from second call
    });
  });

  it('second EVAL_DECIDE when memorization already set is a no-op on the slot', () => {
    const afterFirst = expectOk(
      reduce(baseState(), evalDecideMemorization(true, false, false)),
    );
    const afterSecond = expectOk(
      reduce(afterFirst, evalDecideMemorization(false, true, true)),
    );
    expect(afterSecond.evalConfig?.memorization).toBe(false);
  });

  it('execution + memorization slots merge independently from one EVAL_DECIDE', () => {
    const next = expectOk(
      reduce(baseState(), {
        type: WORKFLOW_EVENTS.EVAL_DECIDE,
        data: { ideation: true, plan: false, execution: true, memorization: true },
      }),
    );
    expect(next.evalConfig).toEqual({
      ideation: true,
      planning: false,
      execution: true,
      memorization: true,
    });
  });
});

// ---------------------------------------------------------------------------
// Predicates — evalMemorizationEnabled / evalMemorizationDisabled
// ---------------------------------------------------------------------------

describe('evalMemorizationEnabled / evalMemorizationDisabled predicates', () => {
  const enabled = defaultPredicates['evalMemorizationEnabled'];
  const disabled = defaultPredicates['evalMemorizationDisabled'];
  if (enabled === undefined) {
    throw new Error('evalMemorizationEnabled predicate not registered');
  }
  if (disabled === undefined) {
    throw new Error('evalMemorizationDisabled predicate not registered');
  }

  test('both predicates are functions', () => {
    expect(typeof enabled).toBe('function');
    expect(typeof disabled).toBe('function');
  });

  test('enabled=false / disabled=true when evalConfig is null', () => {
    const s: WorkflowState = { ...baseState(), evalConfig: null };
    expect(enabled(s)).toBe(false);
    expect(disabled(s)).toBe(true);
  });

  test('enabled=false / disabled=true when memorization slot absent', () => {
    const s: WorkflowState = {
      ...baseState(),
      evalConfig: { ideation: true, planning: true },
    };
    expect(enabled(s)).toBe(false);
    expect(disabled(s)).toBe(true);
  });

  test('enabled=false / disabled=true when memorization=false', () => {
    const s: WorkflowState = {
      ...baseState(),
      evalConfig: { ideation: false, planning: false, memorization: false },
    };
    expect(enabled(s)).toBe(false);
    expect(disabled(s)).toBe(true);
  });

  test('enabled=true / disabled=false when memorization=true', () => {
    const s: WorkflowState = {
      ...baseState(),
      evalConfig: { ideation: false, planning: false, memorization: true },
    };
    expect(enabled(s)).toBe(true);
    expect(disabled(s)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Graph routing — memorization → memorization_eval | handoff
// ---------------------------------------------------------------------------

describe('graph routing — memorization step exit', () => {
  it('routes to memorization_eval when evalConfig.memorization is true', () => {
    const state: WorkflowState = {
      ...baseState(),
      currentStep: 'memorization',
      evalConfig: { ideation: false, planning: false, memorization: true },
    };
    const rule = findTransition(
      'memorization',
      stepExit('memorization'),
      state,
      defaultPredicates,
    );
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('memorization_eval');
  });

  it('routes to handoff when evalConfig.memorization is false', () => {
    const state: WorkflowState = {
      ...baseState(),
      currentStep: 'memorization',
      evalConfig: { ideation: false, planning: false, memorization: false },
    };
    const rule = findTransition(
      'memorization',
      stepExit('memorization'),
      state,
      defaultPredicates,
    );
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('handoff');
  });

  it('routes to handoff when evalConfig.memorization slot is absent', () => {
    const state: WorkflowState = {
      ...baseState(),
      currentStep: 'memorization',
      evalConfig: { ideation: false, planning: false },
    };
    const rule = findTransition(
      'memorization',
      stepExit('memorization'),
      state,
      defaultPredicates,
    );
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('handoff');
  });

  it('routes to handoff when evalConfig is null', () => {
    const state: WorkflowState = {
      ...baseState(),
      currentStep: 'memorization',
      evalConfig: null,
    };
    const rule = findTransition(
      'memorization',
      stepExit('memorization'),
      state,
      defaultPredicates,
    );
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('handoff');
  });
});

// ---------------------------------------------------------------------------
// Graph routing — memorization_eval verdict edges
// ---------------------------------------------------------------------------

describe('graph routing — memorization_eval verdicts', () => {
  it('PASS routes memorization_eval to handoff', () => {
    const state: WorkflowState = {
      ...baseState(),
      currentStep: 'memorization_eval',
    };
    const rule = findTransition(
      'memorization_eval',
      verdictPass(),
      state,
      defaultPredicates,
    );
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('handoff');
  });

  it('REVISE routes memorization_eval back to memorization', () => {
    const state: WorkflowState = {
      ...baseState(),
      currentStep: 'memorization_eval',
    };
    const rule = findTransition(
      'memorization_eval',
      verdictRevise(),
      state,
      defaultPredicates,
    );
    expect(rule).not.toBeNull();
    expect(rule!.to).toBe('memorization');
  });
});

// ---------------------------------------------------------------------------
// Reducer — verdicts at memorization_eval transition state correctly
// ---------------------------------------------------------------------------

describe('reducer — memorization_eval verdicts', () => {
  it('PASS verdict from memorization_eval lands at handoff with lastVerdictOutcome=pass', () => {
    const state: WorkflowState = {
      ...baseState(),
      currentStep: 'memorization_eval',
    };
    const next = expectOk(reduce(state, verdictPass()));
    expect(next.currentStep).toBe('handoff');
    expect(next.lastVerdictOutcome).toBe('pass');
  });

  it('REVISE verdict from memorization_eval lands at memorization with lastVerdictOutcome=revise', () => {
    const state: WorkflowState = {
      ...baseState(),
      currentStep: 'memorization_eval',
    };
    const next = expectOk(reduce(state, verdictRevise()));
    expect(next.currentStep).toBe('memorization');
    expect(next.lastVerdictOutcome).toBe('revise');
  });

  it('does NOT increment feedbackRound on REVISE from memorization_eval (only execution_eval does)', () => {
    const state: WorkflowState = {
      ...baseState(),
      currentStep: 'memorization_eval',
      feedbackRound: 0,
      maxFeedbackRounds: 3,
    };
    const next = expectOk(reduce(state, verdictRevise()));
    // feedbackRound increment is reserved for the execution-eval cap loop
    // (CV-11 invariant); memorization-eval revise re-enters memorization
    // without consuming a feedback budget.
    expect(next.feedbackRound).toBe(0);
  });
});
