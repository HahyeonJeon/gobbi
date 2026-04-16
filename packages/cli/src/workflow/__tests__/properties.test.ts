/**
 * Property-based tests for the workflow state machine using fast-check.
 *
 * Generates random event sequences and verifies that state machine
 * invariants hold regardless of which events are accepted or rejected.
 * The reducer returns { ok: false } for invalid events — properties
 * only assert on states produced by accepted (ok: true) events.
 */

import { describe, it, expect } from 'bun:test';
import fc from 'fast-check';

import { initialState } from '../state.js';
import type { WorkflowState, EvalConfig } from '../state.js';
import { reduce } from '../reducer.js';
import type { Event } from '../events/index.js';
import { WORKFLOW_EVENTS } from '../events/workflow.js';
import { DELEGATION_EVENTS } from '../events/delegation.js';
import { ARTIFACT_EVENTS } from '../events/artifact.js';
import { DECISION_EVENTS } from '../events/decision.js';
import { GUARD_EVENTS } from '../events/guard.js';
import { SESSION_EVENTS } from '../events/session.js';
import {
  createStepTimeoutEvent,
  eventsToReach,
  applyEvents,
  STATES,
} from './fixtures.js';

// ---------------------------------------------------------------------------
// Active step constants — used in arbitraries
// ---------------------------------------------------------------------------

const ACTIVE_STEP_NAMES = [
  'ideation',
  'ideation_eval',
  'plan',
  'plan_eval',
  'execution',
  'execution_eval',
  'memorization',
] as const;

const ALL_STEP_NAMES = [
  ...ACTIVE_STEP_NAMES,
  'idle',
  'done',
  'error',
] as const;

// ---------------------------------------------------------------------------
// Event arbitraries — one per event type
// ---------------------------------------------------------------------------

function arbitraryWorkflowStart(): fc.Arbitrary<Event> {
  return fc.record({
    type: fc.constant(WORKFLOW_EVENTS.START),
    data: fc.record({
      sessionId: fc.uuid(),
      timestamp: fc.date().map((d) => d.toISOString()),
    }),
  });
}

function arbitraryStepEnter(): fc.Arbitrary<Event> {
  return fc.record({
    type: fc.constant(WORKFLOW_EVENTS.STEP_ENTER),
    data: fc.record({
      step: fc.constantFrom(...ALL_STEP_NAMES),
      loopFrom: fc.option(fc.constantFrom(...ACTIVE_STEP_NAMES), {
        nil: undefined,
      }),
    }),
  });
}

function arbitraryStepExit(): fc.Arbitrary<Event> {
  return fc.record({
    type: fc.constant(WORKFLOW_EVENTS.STEP_EXIT),
    data: fc.record({
      step: fc.constantFrom(...ALL_STEP_NAMES),
    }),
  });
}

function arbitraryStepSkip(): fc.Arbitrary<Event> {
  return fc.record({
    type: fc.constant(WORKFLOW_EVENTS.STEP_SKIP),
    data: fc.record({
      step: fc.constantFrom(...ALL_STEP_NAMES),
    }),
  });
}

function arbitraryStepTimeout(): fc.Arbitrary<Event> {
  return fc.record({
    type: fc.constant(WORKFLOW_EVENTS.STEP_TIMEOUT),
    data: fc.record({
      step: fc.constantFrom(...ALL_STEP_NAMES),
      elapsedMs: fc.nat({ max: 1000000 }),
      configuredTimeoutMs: fc.nat({ max: 1000000 }),
    }),
  });
}

function arbitraryEvalDecide(): fc.Arbitrary<Event> {
  return fc.record({
    type: fc.constant(WORKFLOW_EVENTS.EVAL_DECIDE),
    data: fc.record({
      ideation: fc.boolean(),
      plan: fc.boolean(),
    }),
  });
}

function arbitraryFinish(): fc.Arbitrary<Event> {
  return fc.record({
    type: fc.constant(WORKFLOW_EVENTS.FINISH),
    data: fc.constant({} as Record<string, never>),
  });
}

function arbitraryAbort(): fc.Arbitrary<Event> {
  return fc.record({
    type: fc.constant(WORKFLOW_EVENTS.ABORT),
    data: fc.record({
      reason: fc.option(fc.string({ maxLength: 50 }), { nil: undefined }),
    }),
  });
}

function arbitraryResume(): fc.Arbitrary<Event> {
  return fc.record({
    type: fc.constant(WORKFLOW_EVENTS.RESUME),
    data: fc.record({
      targetStep: fc.constantFrom(...ALL_STEP_NAMES),
      fromError: fc.boolean(),
    }),
  });
}

function arbitraryDelegationSpawn(): fc.Arbitrary<Event> {
  return fc.record({
    type: fc.constant(DELEGATION_EVENTS.SPAWN),
    data: fc.record({
      agentType: fc.constantFrom('executor', 'researcher', 'evaluator'),
      step: fc.constantFrom(...ACTIVE_STEP_NAMES),
      subagentId: fc.uuid(),
    }),
  });
}

function arbitraryDelegationComplete(): fc.Arbitrary<Event> {
  return fc.record({
    type: fc.constant(DELEGATION_EVENTS.COMPLETE),
    data: fc.record({
      subagentId: fc.uuid(),
      artifactPath: fc.option(fc.string({ maxLength: 100 }), {
        nil: undefined,
      }),
      tokensUsed: fc.option(fc.nat({ max: 100000 }), { nil: undefined }),
      cacheHitRatio: fc.option(fc.double({ min: 0, max: 1 }), {
        nil: undefined,
      }),
    }),
  });
}

function arbitraryDelegationFail(): fc.Arbitrary<Event> {
  return fc.record({
    type: fc.constant(DELEGATION_EVENTS.FAIL),
    data: fc.record({
      subagentId: fc.uuid(),
      reason: fc.constantFrom('timeout', 'crash', 'scope-violation'),
      transcriptPath: fc.option(fc.string({ maxLength: 100 }), {
        nil: undefined,
      }),
    }),
  });
}

function arbitraryArtifactWrite(): fc.Arbitrary<Event> {
  return fc.record({
    type: fc.constant(ARTIFACT_EVENTS.WRITE),
    data: fc.record({
      step: fc.constantFrom(...ACTIVE_STEP_NAMES),
      filename: fc.string({ minLength: 1, maxLength: 50 }).map(
        (s) => s.replace(/[^a-z0-9-]/g, 'x') + '.md',
      ),
      artifactType: fc.constantFrom('note', 'markdown', 'json'),
    }),
  });
}

function arbitraryArtifactOverwrite(): fc.Arbitrary<Event> {
  return fc.record({
    type: fc.constant(ARTIFACT_EVENTS.OVERWRITE),
    data: fc.record({
      step: fc.constantFrom(...ACTIVE_STEP_NAMES),
      filename: fc.string({ minLength: 1, maxLength: 50 }).map(
        (s) => s.replace(/[^a-z0-9-]/g, 'x') + '.md',
      ),
      previousFilename: fc.option(
        fc.string({ minLength: 1, maxLength: 50 }).map(
          (s) => s.replace(/[^a-z0-9-]/g, 'x') + '.md',
        ),
        { nil: undefined },
      ),
    }),
  });
}

function arbitraryDecisionUser(): fc.Arbitrary<Event> {
  return fc.record({
    type: fc.constant(DECISION_EVENTS.USER),
    data: fc.record({
      decision: fc.constantFrom(
        'approve' as const,
        'reject' as const,
        'defer' as const,
      ),
      context: fc.option(fc.string({ maxLength: 100 }), { nil: undefined }),
    }),
  });
}

function arbitraryEvalVerdict(): fc.Arbitrary<Event> {
  return fc.record({
    type: fc.constant(DECISION_EVENTS.EVAL_VERDICT),
    data: fc.record({
      verdict: fc.constantFrom(
        'pass' as const,
        'revise' as const,
        'escalate' as const,
      ),
      loopTarget: fc.option(
        fc.constantFrom('ideation', 'plan', 'execution'),
        { nil: undefined },
      ),
      evaluatorId: fc.option(fc.uuid(), { nil: undefined }),
    }),
  });
}

function arbitraryEvalSkip(): fc.Arbitrary<Event> {
  return fc.record({
    type: fc.constant(DECISION_EVENTS.EVAL_SKIP),
    data: fc.record({
      step: fc.constantFrom(...ALL_STEP_NAMES),
    }),
  });
}

function arbitraryGuardViolation(): fc.Arbitrary<Event> {
  return fc.record({
    type: fc.constant(GUARD_EVENTS.VIOLATION),
    data: fc.record({
      guardId: fc.uuid(),
      toolName: fc.constantFrom('Write', 'Read', 'Edit', 'Bash'),
      reason: fc.string({ minLength: 1, maxLength: 100 }),
      step: fc.constantFrom(...ACTIVE_STEP_NAMES),
    }),
  });
}

function arbitraryGuardOverride(): fc.Arbitrary<Event> {
  return fc.record({
    type: fc.constant(GUARD_EVENTS.OVERRIDE),
    data: fc.record({
      guardId: fc.uuid(),
      toolName: fc.constantFrom('Write', 'Read', 'Edit', 'Bash'),
      reason: fc.string({ minLength: 1, maxLength: 100 }),
    }),
  });
}

function arbitraryHeartbeat(): fc.Arbitrary<Event> {
  return fc.record({
    type: fc.constant(SESSION_EVENTS.HEARTBEAT),
    data: fc.record({
      timestamp: fc.date().map((d) => d.toISOString()),
    }),
  });
}

// ---------------------------------------------------------------------------
// Composite arbitraries
// ---------------------------------------------------------------------------

/**
 * Single random event — may or may not be valid for the current state.
 * Covers all 20 event types with equal weight.
 */
function arbitraryEvent(): fc.Arbitrary<Event> {
  return fc.oneof(
    // Workflow (9)
    arbitraryWorkflowStart(),
    arbitraryStepEnter(),
    arbitraryStepExit(),
    arbitraryStepSkip(),
    arbitraryStepTimeout(),
    arbitraryEvalDecide(),
    arbitraryFinish(),
    arbitraryAbort(),
    arbitraryResume(),
    // Delegation (3)
    arbitraryDelegationSpawn(),
    arbitraryDelegationComplete(),
    arbitraryDelegationFail(),
    // Artifact (2)
    arbitraryArtifactWrite(),
    arbitraryArtifactOverwrite(),
    // Decision (3)
    arbitraryDecisionUser(),
    arbitraryEvalVerdict(),
    arbitraryEvalSkip(),
    // Guard (2)
    arbitraryGuardViolation(),
    arbitraryGuardOverride(),
    // Session (1)
    arbitraryHeartbeat(),
  );
}

/**
 * Sequence of random events. Most will be rejected by the reducer,
 * which is intentional — properties test invariants that hold
 * regardless of whether individual events are accepted or rejected.
 */
function arbitraryEventSequence(): fc.Arbitrary<readonly Event[]> {
  return fc.array(arbitraryEvent(), { minLength: 1, maxLength: 20 });
}

/**
 * Sequence that starts with workflow.start and eval.decide (so the
 * workflow actually progresses) followed by random events.
 * This increases the chance of reaching deeper states.
 */
function arbitrarySeededSequence(): fc.Arbitrary<readonly Event[]> {
  return fc
    .tuple(
      fc.boolean(),
      fc.boolean(),
      fc.array(arbitraryEvent(), { minLength: 0, maxLength: 18 }),
    )
    .map(([evalIdeation, evalPlan, rest]) => [
      {
        type: WORKFLOW_EVENTS.START,
        data: {
          sessionId: 'prop-test',
          timestamp: new Date().toISOString(),
        },
      } as Event,
      {
        type: WORKFLOW_EVENTS.EVAL_DECIDE,
        data: { ideation: evalIdeation, plan: evalPlan },
      } as Event,
      ...rest,
    ]);
}

// ---------------------------------------------------------------------------
// Helper: apply events, collecting all intermediate states
// ---------------------------------------------------------------------------

function collectStates(
  events: readonly Event[],
  sessionId: string = 'prop-test',
): WorkflowState[] {
  const states: WorkflowState[] = [];
  let state = initialState(sessionId);
  states.push(state);
  for (const event of events) {
    const result = reduce(state, event);
    if (result.ok) {
      state = result.state;
      states.push(state);
    }
  }
  return states;
}

// ===========================================================================
// Property-based tests
// ===========================================================================

describe('state machine properties', () => {
  // -------------------------------------------------------------------------
  // Property 1: completedSteps never shrinks
  // -------------------------------------------------------------------------

  it('completedSteps is monotonically non-decreasing', () => {
    fc.assert(
      fc.property(arbitrarySeededSequence(), (events) => {
        let state = initialState('prop-test');
        let prevLength = 0;
        for (const event of events) {
          const result = reduce(state, event);
          if (result.ok) {
            expect(result.state.completedSteps.length).toBeGreaterThanOrEqual(
              prevLength,
            );
            prevLength = result.state.completedSteps.length;
            state = result.state;
          }
        }
      }),
      { numRuns: 100 },
    );
  });

  // -------------------------------------------------------------------------
  // Property 2: evalConfig is immutable once set
  // -------------------------------------------------------------------------

  it('evalConfig never changes after first assignment', () => {
    fc.assert(
      fc.property(arbitrarySeededSequence(), (events) => {
        let state = initialState('prop-test');
        let configSet = false;
        let savedConfig: EvalConfig | null = null;
        for (const event of events) {
          const result = reduce(state, event);
          if (result.ok) {
            if (!configSet && result.state.evalConfig !== null) {
              configSet = true;
              savedConfig = result.state.evalConfig;
            } else if (configSet) {
              expect(result.state.evalConfig).toEqual(savedConfig);
            }
            state = result.state;
          }
        }
      }),
      { numRuns: 100 },
    );
  });

  // -------------------------------------------------------------------------
  // Property 3: terminal state absorption — done accepts nothing
  // -------------------------------------------------------------------------

  it('done state rejects all subsequent events', () => {
    fc.assert(
      fc.property(arbitraryEvent(), (event) => {
        const doneState: WorkflowState = {
          ...initialState('prop-test'),
          currentStep: 'done',
        };
        const result = reduce(doneState, event);
        expect(result.ok).toBe(false);
      }),
      { numRuns: 200 },
    );
  });

  // -------------------------------------------------------------------------
  // Property 4: feedbackRound never decreases
  // -------------------------------------------------------------------------

  it('feedbackRound is monotonically non-decreasing', () => {
    fc.assert(
      fc.property(arbitrarySeededSequence(), (events) => {
        let state = initialState('prop-test');
        let prevRound = 0;
        for (const event of events) {
          const result = reduce(state, event);
          if (result.ok) {
            expect(result.state.feedbackRound).toBeGreaterThanOrEqual(
              prevRound,
            );
            prevRound = result.state.feedbackRound;
            state = result.state;
          }
        }
      }),
      { numRuns: 100 },
    );
  });

  // -------------------------------------------------------------------------
  // Property 5: error is reachable from any active step via timeout
  // -------------------------------------------------------------------------

  it('error is reachable from any active step via timeout', () => {
    for (const step of ACTIVE_STEP_NAMES) {
      const state: WorkflowState = {
        ...initialState('prop-test'),
        currentStep: step,
      };
      const timeoutEvent = createStepTimeoutEvent(step);
      const result = reduce(state, timeoutEvent);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.state.currentStep).toBe('error');
      }
    }
  });

  // -------------------------------------------------------------------------
  // Property 6: reducer never throws — always returns a result
  // -------------------------------------------------------------------------

  it('reducer never throws for any random event from any state', () => {
    fc.assert(
      fc.property(
        arbitraryEvent(),
        fc.constantFrom(...ALL_STEP_NAMES),
        (event, step) => {
          const state: WorkflowState = {
            ...initialState('prop-test'),
            currentStep: step,
          };
          // Should not throw — just return ok or error result
          const result = reduce(state, event);
          expect(typeof result.ok).toBe('boolean');
        },
      ),
      { numRuns: 200 },
    );
  });

  // -------------------------------------------------------------------------
  // Property 7: violations never shrink
  // -------------------------------------------------------------------------

  it('violations array is monotonically non-decreasing', () => {
    fc.assert(
      fc.property(arbitrarySeededSequence(), (events) => {
        let state = initialState('prop-test');
        let prevLength = 0;
        for (const event of events) {
          const result = reduce(state, event);
          if (result.ok) {
            expect(result.state.violations.length).toBeGreaterThanOrEqual(
              prevLength,
            );
            prevLength = result.state.violations.length;
            state = result.state;
          }
        }
      }),
      { numRuns: 100 },
    );
  });

  // -------------------------------------------------------------------------
  // Property 8: schemaVersion and sessionId are invariant
  // -------------------------------------------------------------------------

  it('schemaVersion and sessionId never change', () => {
    fc.assert(
      fc.property(arbitrarySeededSequence(), (events) => {
        const sessionId = 'prop-test';
        let state = initialState(sessionId);
        const origSchema = state.schemaVersion;
        for (const event of events) {
          const result = reduce(state, event);
          if (result.ok) {
            expect(result.state.schemaVersion).toBe(origSchema);
            expect(result.state.sessionId).toBe(sessionId);
            state = result.state;
          }
        }
      }),
      { numRuns: 100 },
    );
  });

  // -------------------------------------------------------------------------
  // Property 9: maxFeedbackRounds never changes
  // -------------------------------------------------------------------------

  it('maxFeedbackRounds is invariant', () => {
    fc.assert(
      fc.property(arbitrarySeededSequence(), (events) => {
        let state = initialState('prop-test');
        const origMax = state.maxFeedbackRounds;
        for (const event of events) {
          const result = reduce(state, event);
          if (result.ok) {
            expect(result.state.maxFeedbackRounds).toBe(origMax);
            state = result.state;
          }
        }
      }),
      { numRuns: 100 },
    );
  });

  // -------------------------------------------------------------------------
  // Property 10: currentStep is always a valid WorkflowStep
  // -------------------------------------------------------------------------

  it('currentStep is always a valid workflow step', () => {
    const validSteps = new Set(ALL_STEP_NAMES);
    fc.assert(
      fc.property(arbitrarySeededSequence(), (events) => {
        let state = initialState('prop-test');
        for (const event of events) {
          const result = reduce(state, event);
          if (result.ok) {
            expect(validSteps.has(result.state.currentStep)).toBe(true);
            state = result.state;
          }
        }
      }),
      { numRuns: 100 },
    );
  });
});

// ===========================================================================
// Fixtures snapshot tests — verify eventsToReach produces correct states
// ===========================================================================

describe('fixtures: STATES snapshots', () => {
  it('idle state is at idle step', () => {
    expect(STATES.idle.currentStep).toBe('idle');
  });

  it('ideation state is at ideation step with discussing substate', () => {
    expect(STATES.ideation.currentStep).toBe('ideation');
    expect(STATES.ideation.currentSubstate).toBe('discussing');
  });

  it('ideation_eval state is at ideation_eval step', () => {
    expect(STATES.ideation_eval.currentStep).toBe('ideation_eval');
  });

  it('plan state is at plan step', () => {
    expect(STATES.plan.currentStep).toBe('plan');
    expect(STATES.plan.completedSteps).toContain('ideation');
  });

  it('plan_eval state is at plan_eval step', () => {
    expect(STATES.plan_eval.currentStep).toBe('plan_eval');
  });

  it('execution state is at execution step', () => {
    expect(STATES.execution.currentStep).toBe('execution');
    expect(STATES.execution.completedSteps).toContain('ideation');
    expect(STATES.execution.completedSteps).toContain('plan');
  });

  it('execution_eval state is at execution_eval step', () => {
    expect(STATES.execution_eval.currentStep).toBe('execution_eval');
    expect(STATES.execution_eval.completedSteps).toContain('execution');
  });

  it('memorization state is at memorization step', () => {
    expect(STATES.memorization.currentStep).toBe('memorization');
  });

  it('done state is at done step', () => {
    expect(STATES.done.currentStep).toBe('done');
  });

  it('error state is at error step', () => {
    expect(STATES.error.currentStep).toBe('error');
  });
});

// ===========================================================================
// Fixtures: eventsToReach + applyEvents round-trip
// ===========================================================================

describe('fixtures: eventsToReach round-trip', () => {
  const steps: readonly string[] = [
    'idle',
    'ideation',
    'ideation_eval',
    'plan',
    'plan_eval',
    'execution',
    'execution_eval',
    'memorization',
    'done',
    'error',
  ];

  for (const step of steps) {
    it(`eventsToReach('${step}') produces state at '${step}'`, () => {
      const events = eventsToReach(step, 'rt-test');
      const state = applyEvents(events, 'rt-test');
      expect(state.currentStep as string).toBe(step);
    });
  }
});
