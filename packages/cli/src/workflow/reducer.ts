/**
 * Typed reducer — pure synchronous function that computes the next
 * WorkflowState from the current state and an incoming Event.
 *
 * Two-level category dispatch: top-level if-chain dispatches to per-category
 * sub-reducers, each with an exhaustive switch on event.type. Both levels
 * use assertNever for compile-time exhaustiveness checking.
 *
 * Returns a Result type — never throws for invalid transitions.
 */

import type { Event } from './events/index.js';
import type { WorkflowEvent } from './events/workflow.js';
import { WORKFLOW_EVENTS, isWorkflowEvent } from './events/workflow.js';
import type { DelegationEvent } from './events/delegation.js';
import { DELEGATION_EVENTS, isDelegationEvent } from './events/delegation.js';
import type { ArtifactEvent } from './events/artifact.js';
import { ARTIFACT_EVENTS, isArtifactEvent } from './events/artifact.js';
import type { DecisionEvent } from './events/decision.js';
import { DECISION_EVENTS, isDecisionEvent } from './events/decision.js';
import type { GuardEvent } from './events/guard.js';
import { GUARD_EVENTS, isGuardEvent } from './events/guard.js';
import type { SessionEvent } from './events/session.js';
import { SESSION_EVENTS, isSessionEvent } from './events/session.js';
import type { WorkflowState, WorkflowStep } from './state.js';
import { TERMINAL_STEPS, ACTIVE_STEPS } from './state.js';
import { findTransition } from './transitions.js';
import type { PredicateRegistry } from './predicates.js';
import { defaultPredicates } from './predicates.js';
import type { ReducerResult } from './types.js';

export type { ReducerResult } from './types.js';

// ---------------------------------------------------------------------------
// assertNever — compile-time exhaustiveness guard
// ---------------------------------------------------------------------------

function assertNever(value: never): never {
  throw new Error(`Unhandled event: ${JSON.stringify(value)}`);
}

// ---------------------------------------------------------------------------
// Result helpers
// ---------------------------------------------------------------------------

function ok(state: WorkflowState): ReducerResult {
  return { ok: true, state };
}

function err(error: string): ReducerResult {
  return { ok: false, error };
}

// ---------------------------------------------------------------------------
// Sub-reducer: Workflow events
// ---------------------------------------------------------------------------

function reduceWorkflow(
  state: WorkflowState,
  event: WorkflowEvent,
  predicates: PredicateRegistry,
): ReducerResult {
  switch (event.type) {
    case WORKFLOW_EVENTS.START: {
      if (state.currentStep !== 'idle') {
        return err(`workflow.start requires idle state, got ${state.currentStep}`);
      }
      return ok({
        ...state,
        currentStep: 'ideation',
        currentSubstate: 'discussing',
      });
    }

    case WORKFLOW_EVENTS.STEP_EXIT: {
      if (event.data.step !== state.currentStep) {
        return err(
          `step.exit step "${event.data.step}" does not match currentStep "${state.currentStep}"`,
        );
      }
      const rule = findTransition(
        state.currentStep,
        event,
        state,
        predicates,
      );
      if (rule === null) {
        return err(
          `No valid transition from ${state.currentStep} via ${event.type}`,
        );
      }
      const nextStep = rule.to;
      return ok({
        ...state,
        currentStep: nextStep,
        currentSubstate: nextStep === 'ideation' ? 'discussing' : null,
        completedSteps: [...state.completedSteps, event.data.step],
      });
    }

    case WORKFLOW_EVENTS.STEP_SKIP: {
      const rule = findTransition(
        state.currentStep,
        event,
        state,
        predicates,
      );
      if (rule === null) {
        return err(
          `No valid transition from ${state.currentStep} via ${event.type}`,
        );
      }
      return ok({
        ...state,
        currentStep: rule.to,
        currentSubstate: rule.to === 'ideation' ? 'discussing' : null,
      });
    }

    case WORKFLOW_EVENTS.STEP_TIMEOUT: {
      if (!ACTIVE_STEPS.has(state.currentStep)) {
        return err(
          `step.timeout requires an active step, got ${state.currentStep}`,
        );
      }
      return ok({
        ...state,
        currentStep: 'error',
        currentSubstate: null,
      });
    }

    case WORKFLOW_EVENTS.EVAL_DECIDE: {
      // Immutable once set — second call is a no-op
      if (state.evalConfig !== null) {
        return ok(state);
      }
      return ok({
        ...state,
        evalConfig: {
          ideation: event.data.ideation,
          plan: event.data.plan,
        },
      });
    }

    case WORKFLOW_EVENTS.FINISH: {
      if (state.currentStep !== 'memorization') {
        return err(
          `workflow.finish requires memorization state, got ${state.currentStep}`,
        );
      }
      return ok({
        ...state,
        currentStep: 'done',
        currentSubstate: null,
      });
    }

    case WORKFLOW_EVENTS.ABORT: {
      if (state.currentStep !== 'error') {
        return err(
          `workflow.abort requires error state, got ${state.currentStep}`,
        );
      }
      return ok({
        ...state,
        currentStep: 'done',
        currentSubstate: null,
      });
    }

    case WORKFLOW_EVENTS.RESUME: {
      if (state.currentStep !== 'error') {
        return err(
          `workflow.resume requires error state, got ${state.currentStep}`,
        );
      }
      const targetStep = event.data.targetStep as WorkflowStep;
      if (!ACTIVE_STEPS.has(targetStep)) {
        return err(
          `workflow.resume targetStep "${event.data.targetStep}" is not a valid active step`,
        );
      }
      return ok({
        ...state,
        currentStep: targetStep,
        currentSubstate: targetStep === 'ideation' ? 'discussing' : null,
      });
    }

    default:
      return assertNever(event);
  }
}

// ---------------------------------------------------------------------------
// Sub-reducer: Delegation events
// ---------------------------------------------------------------------------

function reduceDelegation(
  state: WorkflowState,
  event: DelegationEvent,
): ReducerResult {
  switch (event.type) {
    case DELEGATION_EVENTS.SPAWN: {
      return ok({
        ...state,
        activeSubagents: [
          ...state.activeSubagents,
          {
            subagentId: event.data.subagentId,
            agentType: event.data.agentType,
            step: event.data.step,
            spawnedAt: event.data.timestamp,
          },
        ],
      });
    }

    case DELEGATION_EVENTS.COMPLETE: {
      return ok({
        ...state,
        activeSubagents: state.activeSubagents.filter(
          (a) => a.subagentId !== event.data.subagentId,
        ),
      });
    }

    case DELEGATION_EVENTS.FAIL: {
      return ok({
        ...state,
        activeSubagents: state.activeSubagents.filter(
          (a) => a.subagentId !== event.data.subagentId,
        ),
      });
    }

    default:
      return assertNever(event);
  }
}

// ---------------------------------------------------------------------------
// Sub-reducer: Artifact events
// ---------------------------------------------------------------------------

function reduceArtifact(
  state: WorkflowState,
  event: ArtifactEvent,
): ReducerResult {
  switch (event.type) {
    case ARTIFACT_EVENTS.WRITE: {
      const { step, filename } = event.data;
      const existing = state.artifacts[step] ?? [];
      return ok({
        ...state,
        artifacts: {
          ...state.artifacts,
          [step]: [...existing, filename],
        },
      });
    }

    case ARTIFACT_EVENTS.OVERWRITE: {
      const { step, filename, previousFilename } = event.data;
      const existing = state.artifacts[step] ?? [];
      let updated: readonly string[];
      if (previousFilename !== undefined) {
        // Replace the previous filename with the new one
        updated = existing.map((f) =>
          f === previousFilename ? filename : f,
        );
      } else {
        // No previous — just append
        updated = [...existing, filename];
      }
      return ok({
        ...state,
        artifacts: {
          ...state.artifacts,
          [step]: updated,
        },
      });
    }

    default:
      return assertNever(event);
  }
}

// ---------------------------------------------------------------------------
// Sub-reducer: Decision events
// ---------------------------------------------------------------------------

function reduceDecision(
  state: WorkflowState,
  event: DecisionEvent,
  predicates: PredicateRegistry,
): ReducerResult {
  switch (event.type) {
    case DECISION_EVENTS.USER: {
      // Informational — no state change
      return ok(state);
    }

    case DECISION_EVENTS.EVAL_VERDICT: {
      const { verdict } = event.data;

      if (verdict === 'pass') {
        const rule = findTransition(
          state.currentStep,
          event,
          state,
          predicates,
        );
        if (rule === null) {
          return err(
            `No valid transition from ${state.currentStep} for pass verdict`,
          );
        }
        return ok({
          ...state,
          currentStep: rule.to,
          currentSubstate: rule.to === 'ideation' ? 'discussing' : null,
        });
      }

      if (verdict === 'revise') {
        // Check feedback cap first
        const feedbackCapPredicate = predicates['feedbackCapExceeded'];
        if (
          state.currentStep === 'execution_eval' &&
          feedbackCapPredicate !== undefined &&
          feedbackCapPredicate(state)
        ) {
          return ok({
            ...state,
            currentStep: 'error',
            currentSubstate: null,
          });
        }

        const rule = findTransition(
          state.currentStep,
          event,
          state,
          predicates,
        );
        if (rule === null) {
          return err(
            `No valid transition from ${state.currentStep} for revise verdict`,
          );
        }

        // feedbackRound increments only on execution_eval revise loops
        const nextFeedbackRound =
          state.currentStep === 'execution_eval'
            ? state.feedbackRound + 1
            : state.feedbackRound;

        return ok({
          ...state,
          currentStep: rule.to,
          currentSubstate: rule.to === 'ideation' ? 'discussing' : null,
          feedbackRound: nextFeedbackRound,
        });
      }

      // escalate — informational, no state change
      return ok(state);
    }

    case DECISION_EVENTS.EVAL_SKIP: {
      // Informational — no state change
      return ok(state);
    }

    default:
      return assertNever(event);
  }
}

// ---------------------------------------------------------------------------
// Sub-reducer: Guard events
// ---------------------------------------------------------------------------

function reduceGuard(
  state: WorkflowState,
  event: GuardEvent,
): ReducerResult {
  switch (event.type) {
    case GUARD_EVENTS.VIOLATION: {
      return ok({
        ...state,
        violations: [
          ...state.violations,
          {
            guardId: event.data.guardId,
            toolName: event.data.toolName,
            reason: event.data.reason,
            step: event.data.step,
            timestamp: event.data.timestamp,
          },
        ],
      });
    }

    case GUARD_EVENTS.OVERRIDE: {
      // Informational — no state change
      return ok(state);
    }

    default:
      return assertNever(event);
  }
}

// ---------------------------------------------------------------------------
// Sub-reducer: Session events
// ---------------------------------------------------------------------------

function reduceSession(
  state: WorkflowState,
  event: SessionEvent,
): ReducerResult {
  // SessionEvent has a single variant — TypeScript cannot narrow non-union
  // types to never in switch defaults. When SessionEvent gains variants,
  // it becomes a discriminated union and assertNever will work in a switch.
  // Until then, the type guard at the category dispatch level guarantees
  // event.type === 'session.heartbeat'.
  void event.type;
  return ok(state);
}

// ---------------------------------------------------------------------------
// Top-level reducer
// ---------------------------------------------------------------------------

/**
 * Pure synchronous reducer. Computes the next WorkflowState from the
 * current state and an incoming Event.
 *
 * Returns a Result type — `{ ok: true, state }` on success,
 * `{ ok: false, error }` on invalid transitions. Never throws.
 */
export function reduce(
  state: WorkflowState,
  event: Event,
  predicates: PredicateRegistry = defaultPredicates,
): ReducerResult {
  // Pre-check: terminal state rejection
  if (TERMINAL_STEPS.has(state.currentStep)) {
    return err(
      `Cannot process ${event.type} — workflow is in terminal state "${state.currentStep}"`,
    );
  }

  // Category dispatch with exhaustiveness at both levels
  if (isWorkflowEvent(event)) return reduceWorkflow(state, event, predicates);
  if (isDelegationEvent(event)) return reduceDelegation(state, event);
  if (isArtifactEvent(event)) return reduceArtifact(state, event);
  if (isDecisionEvent(event)) return reduceDecision(state, event, predicates);
  if (isGuardEvent(event)) return reduceGuard(state, event);
  if (isSessionEvent(event)) return reduceSession(state, event);

  return assertNever(event);
}
