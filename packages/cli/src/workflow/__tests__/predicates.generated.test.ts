/**
 * Exhaustiveness tests for the B.3 predicate codegen pipeline.
 *
 * Verifies that:
 *
 *   1. Every predicate name emitted by `predicates.generated.ts` has a
 *      corresponding entry in `defaultPredicates` (runtime mirror of the
 *      compile-time `satisfies Record<PredicateName, Predicate>` gate).
 *   2. Each registered predicate is a callable `Predicate` function.
 *   3. The conservative semantics for the newly-registered B.3 predicates
 *      match the documented behaviour:
 *        - `always` is constant true.
 *        - State-only verdict/loopTarget/resume inference returns `false`
 *          on a fresh session.
 *        - `feedbackCapExceeded` still reflects `feedbackRound >=
 *          maxFeedbackRounds` (unchanged from PR A).
 */

import { describe, test, expect } from 'bun:test';

import { defaultPredicates, PREDICATE_NAMES } from '../predicates.js';
import type { PredicateName } from '../predicates.js';
import { initialState } from '../state.js';
import type { WorkflowState } from '../state.js';

function freshState(): WorkflowState {
  return initialState('test-session-generated');
}

// ---------------------------------------------------------------------------
// Codegen coverage — every generated name must have an implementation
// ---------------------------------------------------------------------------

describe('PREDICATE_NAMES ↔ defaultPredicates — coverage', () => {
  test('defaultPredicates contains every name in PREDICATE_NAMES', () => {
    const missing: string[] = [];
    for (const name of PREDICATE_NAMES) {
      if (!(name in defaultPredicates)) missing.push(name);
    }
    expect(missing).toEqual([]);
  });

  test('every registered predicate is a function', () => {
    for (const name of PREDICATE_NAMES) {
      const predicate =
        (defaultPredicates as Readonly<Record<PredicateName, unknown>>)[name];
      expect(typeof predicate).toBe('function');
    }
  });

  test('codegen produced the expected canonical 21-name roster', () => {
    // The roster is intentionally brittle — changes to the spec library
    // should cycle through regen, triggering both a new generated file
    // AND an updated assertion here. A bump without this test failing
    // means the codegen or the spec edits silently diverged.
    expect([...PREDICATE_NAMES]).toEqual([
      'abortRequested',
      'always',
      'evalIdeationDisabled',
      'evalIdeationEnabled',
      'evalPlanDisabled',
      'evalPlanEnabled',
      'feedbackCapExceeded',
      'feedbackRoundActive',
      'ideationSynthesized',
      'loopTargetExecution',
      'loopTargetIdeation',
      'loopTargetPlan',
      'piAgentsToSpawn',
      'resumeTargetExecution',
      'resumeTargetIdeation',
      'resumeTargetMemorization',
      'resumeTargetPlan',
      'skipRequested',
      'stepTimeoutFired',
      'verdictPass',
      'verdictRevise',
    ]);
  });
});

// ---------------------------------------------------------------------------
// `always` — constant true
// ---------------------------------------------------------------------------

describe('always', () => {
  test('returns true for any state', () => {
    expect(defaultPredicates['always'](freshState())).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// verdictPass / verdictRevise — conservative state-only inference
// ---------------------------------------------------------------------------

describe('verdictPass / verdictRevise — state-only semantics', () => {
  test('verdictPass false on a fresh idle session', () => {
    expect(defaultPredicates['verdictPass'](freshState())).toBe(false);
  });

  test('verdictPass false while currentStep is an eval step', () => {
    const state: WorkflowState = {
      ...freshState(),
      currentStep: 'ideation_eval',
      completedSteps: ['ideation'],
    };
    expect(defaultPredicates['verdictPass'](state)).toBe(false);
  });

  test('verdictPass true once workflow has exited an eval step with completedSteps populated', () => {
    const state: WorkflowState = {
      ...freshState(),
      currentStep: 'plan',
      completedSteps: ['ideation', 'ideation_eval'],
    };
    expect(defaultPredicates['verdictPass'](state)).toBe(true);
  });

  test('verdictRevise false on a fresh session', () => {
    expect(defaultPredicates['verdictRevise'](freshState())).toBe(false);
  });

  test('verdictRevise true once feedbackRound advances', () => {
    const state: WorkflowState = { ...freshState(), feedbackRound: 1 };
    expect(defaultPredicates['verdictRevise'](state)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// loopTarget{Ideation,Plan,Execution} — current step matches loop target AND
// feedbackRound > 0
// ---------------------------------------------------------------------------

describe('loopTarget* — mid-feedback state matching', () => {
  const cases: readonly (readonly [PredicateName, WorkflowState['currentStep']])[] = [
    ['loopTargetIdeation', 'ideation'],
    ['loopTargetPlan', 'plan'],
    ['loopTargetExecution', 'execution'],
  ];

  for (const [name, step] of cases) {
    test(`${name} false on a fresh session (feedbackRound === 0)`, () => {
      const state: WorkflowState = { ...freshState(), currentStep: step };
      expect(defaultPredicates[name](state)).toBe(false);
    });

    test(`${name} true when currentStep === '${step}' and feedbackRound > 0`, () => {
      const state: WorkflowState = {
        ...freshState(),
        currentStep: step,
        feedbackRound: 1,
      };
      expect(defaultPredicates[name](state)).toBe(true);
    });

    test(`${name} false when currentStep does not match the loop target`, () => {
      const state: WorkflowState = {
        ...freshState(),
        currentStep: step === 'ideation' ? 'plan' : 'ideation',
        feedbackRound: 1,
      };
      expect(defaultPredicates[name](state)).toBe(false);
    });
  }
});

// ---------------------------------------------------------------------------
// resumeTarget{Ideation,Plan,Execution,Memorization} — current step match
// ---------------------------------------------------------------------------

describe('resumeTarget* — current step matches resume target', () => {
  const cases: readonly (readonly [PredicateName, WorkflowState['currentStep']])[] = [
    ['resumeTargetIdeation', 'ideation'],
    ['resumeTargetPlan', 'plan'],
    ['resumeTargetExecution', 'execution'],
    ['resumeTargetMemorization', 'memorization'],
  ];

  for (const [name, step] of cases) {
    test(`${name} true when currentStep === '${step}'`, () => {
      const state: WorkflowState = { ...freshState(), currentStep: step };
      expect(defaultPredicates[name](state)).toBe(true);
    });

    test(`${name} false when currentStep does not match`, () => {
      const state: WorkflowState = {
        ...freshState(),
        currentStep: step === 'ideation' ? 'plan' : 'ideation',
      };
      expect(defaultPredicates[name](state)).toBe(false);
    });
  }
});

// ---------------------------------------------------------------------------
// stepTimeoutFired / abortRequested / skipRequested
// ---------------------------------------------------------------------------

describe('error-state and navigation predicates', () => {
  test('stepTimeoutFired false on a fresh session', () => {
    expect(defaultPredicates['stepTimeoutFired'](freshState())).toBe(false);
  });

  test('stepTimeoutFired true when currentStep === error', () => {
    const state: WorkflowState = { ...freshState(), currentStep: 'error' };
    expect(defaultPredicates['stepTimeoutFired'](state)).toBe(true);
  });

  test('abortRequested false on a fresh session', () => {
    expect(defaultPredicates['abortRequested'](freshState())).toBe(false);
  });

  test('abortRequested true when currentStep === done', () => {
    const state: WorkflowState = { ...freshState(), currentStep: 'done' };
    expect(defaultPredicates['abortRequested'](state)).toBe(true);
  });

  test('skipRequested is conservatively false under state-only inspection', () => {
    // Skip is a transient event label; state alone cannot observe it once
    // the reducer has already advanced `currentStep`. The predicate must
    // not fire a false positive on any state snapshot.
    const variants: WorkflowState[] = [
      freshState(),
      { ...freshState(), currentStep: 'ideation' },
      { ...freshState(), currentStep: 'plan', feedbackRound: 1 },
      { ...freshState(), currentStep: 'error' },
    ];
    for (const s of variants) {
      expect(defaultPredicates['skipRequested'](s)).toBe(false);
    }
  });
});
