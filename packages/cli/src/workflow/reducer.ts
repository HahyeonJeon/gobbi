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
import type { VerificationEvent } from './events/verification.js';
import { VERIFICATION_EVENTS, isVerificationEvent } from './events/verification.js';
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
  ts: string | undefined,
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
      // Exiting a productive step closes the verdict window — the next
      // verdict must fire within the new step to count. Clearing avoids
      // stale outcomes leaking across step boundaries.
      //
      // E.10 ZONE: stepStartedAt timestamp for next step (per L13)
      //
      // E.11 — meta.timeoutMs detection lives entirely in
      // `commands/workflow/stop.ts`, NOT in the reducer. The reducer is a
      // pure synchronous function of `(state, event, predicates, ts)` and
      // has no path to load the step spec from disk; introducing an async
      // spec-load here would break the purity invariant that lets the
      // engine replay event streams without I/O. `stop.ts` reads
      // `state.stepStartedAt` (set below), loads the graph + current-step
      // spec via the same loader pattern as `next.ts`, and emits
      // `workflow.step.timeout` when `now - stepStartedAt > spec.meta.timeoutMs`.
      // The reducer's job on STEP_TIMEOUT is already covered above —
      // active step → `error` — and needs no per-step metadata to do it.
      //
      // stepStartedAt: when the engine supplies `ts`, stamp the next step's
      // entry with it so E.11's timeout detector can compute
      // `elapsedMs = now - stepStartedAt`. `ts` is absent only in legacy
      // direct `reduce(state, event)` call sites that predate the L13
      // wire-up (most unit tests); in that case we preserve the prior
      // value so the field remains a monotonic witness.
      return ok({
        ...state,
        currentStep: nextStep,
        currentSubstate: nextStep === 'ideation' ? 'discussing' : null,
        completedSteps: [...state.completedSteps, event.data.step],
        lastVerdictOutcome: null,
        stepStartedAt: ts ?? state.stepStartedAt,
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
      // E.10 ZONE: stepStartedAt timestamp on resume target (per L13)
      //
      // Mirrors the STEP_EXIT treatment — when the engine supplies `ts`,
      // the target step's entry is stamped so the timeout budget restarts
      // from the resume point. Direct test callers that omit `ts` keep the
      // prior value rather than silently clearing it.
      return ok({
        ...state,
        currentStep: targetStep,
        currentSubstate: targetStep === 'ideation' ? 'discussing' : null,
        stepStartedAt: ts ?? state.stepStartedAt,
      });
    }

    case WORKFLOW_EVENTS.INVALID_TRANSITION: {
      // Observational no-op on state. The `workflow.invalid_transition`
      // event is an AUDIT record of a reducer rejection that ALREADY
      // happened (the engine's try-catch refactor in PR D.1 emitted this
      // event OUTSIDE the rolled-back outer transaction). The rejection
      // itself did not change state — the original reducer error was
      // re-thrown to the caller, and the outer transaction rolled back
      // any partial writes. The audit is witness on the event trail; the
      // state is already correct.
      //
      // Replaying a stream containing an `invalid_transition` event must
      // therefore leave the derived state untouched.
      return ok(state);
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
          lastVerdictOutcome: 'pass',
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
            lastVerdictOutcome: 'revise',
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
          lastVerdictOutcome: 'revise',
        });
      }

      // escalate — informational, leaves lastVerdictOutcome unchanged so the
      // prior outcome (if any) stays visible to predicates.
      return ok(state);
    }

    case DECISION_EVENTS.EVAL_SKIP: {
      // Informational — no state change. The optional `priorError`
      // payload extension (schema v3, CP11 reversibility) carries a full
      // `ErrorPathway` snapshot so the skip is auditable and reversible,
      // but it is NOT reduced into state — it is witness metadata on the
      // event itself. The caller (typically
      // `gobbi workflow resume --force-memorization`) emits a
      // `workflow.resume` alongside this event in the same store
      // transaction; the `RESUME` case applies the actual step transition.
      //
      // Keeping this a no-op preserves the Greg Young discipline: v3 event
      // payloads may carry additive fields, but the reducer contract for
      // EVAL_SKIP is unchanged across the schema bump. See v050-design-review.md
      // and ideation §2.5.2 for the CP11 rationale.
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
            severity: 'error',
          },
        ],
      });
    }

    case GUARD_EVENTS.OVERRIDE: {
      // Informational — no state change
      return ok(state);
    }

    case GUARD_EVENTS.WARN: {
      // Non-gating advisory — records into violations[] with warning
      // severity so `status` / audit can surface guard activity without
      // conflating with deny-effect violations.
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
            severity: 'warning',
          },
        ],
      });
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
// Sub-reducer: Verification events
//
// Records post-subagent verification outcomes into
// `state.verificationResults`, keyed by the composite `${subagentId}:${commandKind}`
// formula locked in L3/L4. The keying mirrors the idempotency formula in
// `appendEventAndUpdateState`, so a replayed stream rebuilds the same map
// the runtime constructed.
//
// Rejection contract: the runner only emits events for subagents that are
// still present in `state.activeSubagents` at dispatch time. A
// `verification.result` event whose `subagentId` does not appear in the
// active set is a replay-time inconsistency (or a hand-crafted event) and
// is rejected via `ReducerRejectionError` — surfaced to the engine's outer
// try-catch, which emits the `workflow.invalid_transition` audit and
// re-throws.
//
// Key-format invariant (L3): the composite key is
// `${subagentId}:${commandKind}`, and downstream compilers (e.g.
// `specs/verification-block.ts`) iterate the map with
// `key.startsWith(`${subagentId}:`)` to collect a subagent's entries. A
// subagentId containing `':'` would let one subagent's prefix silently match
// another subagent's keys — a latent correctness bug. The reducer rejects
// such events at the write site so the invariant is enforced at the single
// mutation point, not at every reader. `commandKind` is drawn from a
// controlled enum today but is guarded symmetrically as defence-in-depth
// against future enum extensions that embed a separator.
//
// Gating discipline: the reducer does NOT branch on `policy` or `exitCode`.
// Per the ideation lock "Gating is an orchestrator concern, not
// state-machine", the event is recorded verbatim and downstream consumers
// (E.8 verification-block, `status`) decide what to do with a gate failure.
// ---------------------------------------------------------------------------

function reduceVerification(
  state: WorkflowState,
  event: VerificationEvent,
): ReducerResult {
  // VerificationEvent currently has a single variant; the isVerificationEvent
  // category guard at the dispatch level guarantees event.type ===
  // VERIFICATION_EVENTS.RESULT. Keeping the explicit check-and-branch here
  // documents the intent and makes adding a second variant a one-line edit.
  if (event.type === VERIFICATION_EVENTS.RESULT) {
    const { subagentId, commandKind } = event.data;
    // Key-format guard: subagentId and commandKind must not contain ':' —
    // the composite key `${subagentId}:${commandKind}` depends on colon as
    // its sole separator, and downstream consumers split/prefix-match on it.
    // See the block comment above for the full invariant rationale.
    if (subagentId.includes(':')) {
      return err(
        `verification.result: subagentId must not contain ':' — the composite key ${subagentId}:${commandKind} depends on colon as separator`,
      );
    }
    if (commandKind.includes(':')) {
      return err(
        `verification.result: commandKind must not contain ':' — the composite key ${subagentId}:${commandKind} depends on colon as separator`,
      );
    }
    const isActive = state.activeSubagents.some(
      (a) => a.subagentId === subagentId,
    );
    if (!isActive) {
      return err(
        `verification.result subagentId "${subagentId}" is not an active subagent`,
      );
    }
    const key = `${subagentId}:${commandKind}`;
    return ok({
      ...state,
      verificationResults: {
        ...state.verificationResults,
        [key]: event.data,
      },
    });
  }
  return assertNever(event.type);
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
 *
 * `ts` is the event's wall-clock timestamp (ISO-8601 string) supplied
 * by the engine / replayer. It is optional because many test call sites
 * predate the L13 wire-up; production call sites (engine.ts,
 * deriveState) always pass it so `stepStartedAt` is timestamped
 * correctly on every STEP_EXIT / RESUME. The reducer itself is still
 * pure — given the same `(state, event, ts, predicates)` it returns
 * the same result.
 *
 * `predicates` retains its default for backward-compatible call sites.
 * When both optionals are omitted, the reducer falls back to
 * `defaultPredicates` and preserves `state.stepStartedAt` so legacy
 * tests continue to pass without modification.
 */
export function reduce(
  state: WorkflowState,
  event: Event,
  ts?: string,
  predicates: PredicateRegistry = defaultPredicates,
): ReducerResult {
  // Pre-check: terminal state rejection
  if (TERMINAL_STEPS.has(state.currentStep)) {
    return err(
      `Cannot process ${event.type} — workflow is in terminal state "${state.currentStep}"`,
    );
  }

  // Category dispatch with exhaustiveness at both levels
  if (isWorkflowEvent(event)) return reduceWorkflow(state, event, predicates, ts);
  if (isDelegationEvent(event)) return reduceDelegation(state, event);
  if (isArtifactEvent(event)) return reduceArtifact(state, event);
  if (isDecisionEvent(event)) return reduceDecision(state, event, predicates);
  if (isGuardEvent(event)) return reduceGuard(state, event);
  if (isSessionEvent(event)) return reduceSession(state, event);
  if (isVerificationEvent(event)) return reduceVerification(state, event);

  return assertNever(event);
}
