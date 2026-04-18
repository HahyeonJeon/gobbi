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
  CURRENT_SCHEMA_VERSION,
  migrateEvent,
  type EventRow,
} from '../migrations.js';
import {
  SyncScheduler,
  type VerificationTask,
} from '../verification-scheduler.js';
import type { VerificationResultData } from '../events/verification.js';
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
      timestamp: fc.date({ noInvalidDate: true }).map((d) => d.toISOString()),
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
      timestamp: fc.date({ noInvalidDate: true }).map((d) => d.toISOString()),
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
      timestamp: fc.date({ noInvalidDate: true }).map((d) => d.toISOString()),
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
      timestamp: fc.date({ noInvalidDate: true }).map((d) => d.toISOString()),
    }),
  });
}

// ---------------------------------------------------------------------------
// Composite arbitraries
// ---------------------------------------------------------------------------

/**
 * Single random event — may or may not be valid for the current state.
 * Covers all 19 event types with equal weight.
 */
function arbitraryEvent(): fc.Arbitrary<Event> {
  return fc.oneof(
    // Workflow (8)
    arbitraryWorkflowStart(),
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

// ===========================================================================
// E.7 properties (per plan §E.7 and research `e7-properties-and-e2e-patterns.md`)
//
// Three additional properties exercising PR E surface:
//
//   1. Schema v4 identity migration idempotence — `migrateEvent` is
//      idempotent for any row whose schema_version is in the
//      registered range (1 .. CURRENT_SCHEMA_VERSION).
//   2. VerificationResultData JSON round-trip — the event payload
//      survives JSON.stringify / JSON.parse with deep equality, so
//      replaying a stream rebuilds the same entries the reducer
//      originally wrote.
//   3. SyncScheduler SIGTERM invariant — for any timeoutMs in a small
//      range, running a sleep command of 2x the timeout reports
//      `timedOut: true` and returns within `timeoutMs + 3000ms` of
//      spawn. Spawns real subprocesses; numRuns is capped to keep the
//      overall suite time bounded.
// ===========================================================================

describe('properties: schema v4 migration idempotence', () => {
  it('migrateEvent(migrateEvent(row)) === migrateEvent(row) for any registered schema_version', () => {
    // Arbitrary row generator — parametrises the fields that the
    // migrator actually reads (`schema_version`, `data`). Other columns
    // are filled with plausible-but-opaque values so the returned row is
    // structurally valid for downstream EventRow consumers.
    const arbitraryEventRow: fc.Arbitrary<EventRow> = fc
      .record({
        seq: fc.nat({ max: 100_000 }),
        ts: fc
          .integer({
            min: Date.UTC(2020, 0, 1),
            max: Date.UTC(2030, 11, 31),
          })
          .map((ms) => new Date(ms).toISOString()),
        schema_version: fc.integer({
          min: 1,
          max: CURRENT_SCHEMA_VERSION,
        }),
        type: fc.constantFrom(
          WORKFLOW_EVENTS.START,
          WORKFLOW_EVENTS.STEP_EXIT,
          DELEGATION_EVENTS.COMPLETE,
          ARTIFACT_EVENTS.WRITE,
        ),
        step: fc.option(
          fc.constantFrom(
            'idle',
            'ideation',
            'plan',
            'execution',
            'memorization',
          ),
          { nil: null },
        ),
        data: fc
          .record({
            foo: fc.option(fc.string({ maxLength: 20 }), { nil: undefined }),
            n: fc.option(fc.nat({ max: 1000 }), { nil: undefined }),
          })
          .map((obj) => JSON.stringify(obj)),
        actor: fc.constantFrom('cli', 'hook', 'user', 'system'),
        parent_seq: fc.option(fc.nat({ max: 100_000 }), { nil: null }),
        idempotency_key: fc.string({ minLength: 1, maxLength: 60 }),
      });

    fc.assert(
      fc.property(arbitraryEventRow, (row) => {
        const once = migrateEvent(row);
        const twice = migrateEvent(once);
        // Deep-equal — the registered hops are identities on event data,
        // so once and twice must agree on every field including the JSON
        // payload (string-compared).
        expect(twice).toEqual(once);
      }),
      { numRuns: 100 },
    );
  });
});

describe('properties: VerificationResultData JSON round-trip', () => {
  it('JSON.parse(JSON.stringify(data)) deeply equals the original', () => {
    const arbitraryVerificationResultData: fc.Arbitrary<VerificationResultData> =
      fc.record({
        subagentId: fc.uuid(),
        command: fc.string({ minLength: 1, maxLength: 80 }),
        commandKind: fc.constantFrom(
          'lint' as const,
          'test' as const,
          'typecheck' as const,
          'build' as const,
          'format' as const,
          'custom' as const,
        ),
        // Scheduler contract: exitCode ∈ {-2, -1, 0..255}. Slightly
        // wider bounds cover forward-compat without costing shrink
        // time.
        exitCode: fc.integer({ min: -2, max: 255 }),
        durationMs: fc.nat({ max: 1_000_000 }),
        policy: fc.constantFrom('inform' as const, 'gate' as const),
        timedOut: fc.boolean(),
        // fast-check v4 removed the `hexaString` shorthand; build a
        // 64-char hex digest from a fixed alphabet so the arbitrary
        // stays deterministic across fast-check upgrades.
        stdoutDigest: fc
          .array(
            fc.constantFrom(...'0123456789abcdef'.split('')),
            { minLength: 64, maxLength: 64 },
          )
          .map((chars) => chars.join('')),
        stderrDigest: fc
          .array(
            fc.constantFrom(...'0123456789abcdef'.split('')),
            { minLength: 64, maxLength: 64 },
          )
          .map((chars) => chars.join('')),
        timestamp: fc
          .integer({
            min: Date.UTC(2020, 0, 1),
            max: Date.UTC(2030, 11, 31),
          })
          .map((ms) => new Date(ms).toISOString()),
      });

    fc.assert(
      fc.property(arbitraryVerificationResultData, (data) => {
        const json = JSON.stringify(data);
        const parsed = JSON.parse(json) as VerificationResultData;
        expect(parsed).toEqual(data);
      }),
      { numRuns: 100 },
    );
  });
});

describe('properties: scheduler SIGTERM invariant', () => {
  it(
    'timeoutMs x2 sleep yields timedOut=true within timeoutMs + 3000ms',
    async () => {
      // Spawns real `sleep` subprocesses — expensive. Keep `numRuns`
      // small; the scheduler test file already covers the ladder in
      // detail. The property here guards the CONTRACT (timeout
      // invariant) against any regression a bulk test refactor might
      // introduce.
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 50, max: 500 }),
          async (timeoutMs) => {
            const scheduler = new SyncScheduler();
            const task: VerificationTask = {
              subagentId: 'prop-sigterm',
              // Sleep accepts fractional seconds on GNU coreutils; the
              // test host runs Linux per `env` block in the briefing so
              // this is safe. 2x the timeout guarantees the scheduler
              // fires before the natural exit.
              command: `sleep ${(timeoutMs * 2) / 1000}`,
              commandKind: 'custom',
              cwd: process.cwd(),
              timeoutMs,
              policy: 'inform',
            };
            const controller = new AbortController();
            const start = Date.now();
            const outcome = await scheduler.run(task, controller.signal);
            const elapsed = Date.now() - start;
            expect(outcome.timedOut).toBe(true);
            // Upper bound covers SIGTERM delivery + 2s SIGKILL grace +
            // generous slack for kernel scheduling. Any regression that
            // widens the ladder beyond 3s over budget flags here.
            expect(elapsed).toBeLessThan(timeoutMs + 3000);
          },
        ),
        { numRuns: 3 },
      );
    },
    30_000,
  );
});
