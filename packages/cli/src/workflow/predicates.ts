/**
 * Predicate registry — pure functions that evaluate workflow state conditions.
 *
 * Guards and transitions reference predicates by name (string). The registry
 * maps those names to typed functions. This keeps guard/transition specs as
 * pure data while conditions remain type-safe TypeScript.
 *
 * ## Exhaustiveness via codegen
 *
 * `predicates.generated.ts` contributes the `PredicateName` string-literal
 * union — one name per predicate reference in any `spec.json`,
 * `index.json`, or `*.overlay.json` under `packages/cli/src/specs/`.
 * `defaultPredicates` is typed as `satisfies Record<PredicateName, Predicate>`,
 * which means:
 *
 *   - Adding a predicate reference in a spec/overlay/graph without
 *     registering its implementation here produces a typecheck error. This
 *     is the compile-time cross-check.
 *   - Introducing a new predicate here without a matching reference is
 *     allowed — extras are fine, only missing entries fail.
 *
 * The runtime validators in `specs/assembly.ts`
 * (`validateSpecPredicateReferences`, `validateGraphPredicateReferences`)
 * cover specs/graphs loaded dynamically from disk (e.g. during `gobbi
 * workflow validate`) where the TypeScript compile-time gate cannot reach.
 *
 * ## Predicate signature
 *
 * All predicates are `(state: WorkflowState) => boolean`. This is the
 * state-only contract shared by:
 *
 *   - Step-level conditional-block gating in `specs/assembly.ts`
 *     (`compile()`).
 *   - Graph-level transition annotations in `specs/index.json` (declarative
 *     — `TRANSITION_TABLE` in `transitions.ts` is the runtime authority).
 *
 * Event-data-driven predicates (verdict outcomes, loop targets, skip/abort
 * requests, timeouts, resume targets) interpret state conservatively: they
 * read the already-reduced state rather than an external event object. The
 * runtime transition routing in `workflow/transitions.ts::findTransition`
 * uses `rule.verdict` / `rule.loopTarget` matching against the incoming
 * event directly — not these predicates — so the conservative reading is
 * semantically safe. `gobbi workflow validate` (B.4) still flags missing
 * registrations through the runtime validator.
 */

import type { WorkflowState } from './state.js';
import type { TransitionRule } from './transitions.js';
import type { PredicateName } from './predicates.generated.js';

export { PREDICATE_NAMES, type PredicateName } from './predicates.generated.js';

// ---------------------------------------------------------------------------
// Predicate types
// ---------------------------------------------------------------------------

/** A predicate is a pure function from workflow state to boolean. */
export type Predicate = (state: WorkflowState) => boolean;

/** Registry mapping predicate names to their implementations. */
export type PredicateRegistry = Readonly<Record<string, Predicate>>;

// ---------------------------------------------------------------------------
// Built-in predicates
//
// The default registry covers every predicate name emitted into
// `predicates.generated.ts`. The `satisfies Record<PredicateName, Predicate>`
// clause below is the compile-time exhaustiveness gate.
//
// Predicates are grouped by concern so the file reads as a map, not a bag.
// ---------------------------------------------------------------------------

export const defaultPredicates = {
  // ------------------------------------------------------------------- Eval
  //
  // Gate ideation/plan evaluation on `evalConfig`. Missing config defaults
  // to "evaluation disabled" — the reducer only populates `evalConfig` once
  // `workflow.eval.decide` has fired.
  // -------------------------------------------------------------------------

  /** Ideation evaluation is enabled in evalConfig. */
  evalIdeationEnabled: (s) => s.evalConfig?.ideation === true,

  /** Ideation evaluation is disabled or evalConfig not yet set. */
  evalIdeationDisabled: (s) => s.evalConfig?.ideation !== true,

  /** Plan evaluation is enabled in evalConfig. */
  evalPlanEnabled: (s) => s.evalConfig?.plan === true,

  /** Plan evaluation is disabled or evalConfig not yet set. */
  evalPlanDisabled: (s) => s.evalConfig?.plan !== true,

  // --------------------------------------------------------------- Feedback
  //
  // Drive the evaluation-loop-back mechanics described in
  // `v050-state-machine.md` §Feedback Loops.
  // -------------------------------------------------------------------------

  /** Feedback round cap has been reached or exceeded. */
  feedbackCapExceeded: (s) => s.feedbackRound >= s.maxFeedbackRounds,

  /**
   * A feedback round is currently active — a prior evaluation fed back and
   * the orchestrator must consult the evaluator findings before re-work.
   *
   * Reads `WorkflowState.feedbackRound`. `0` means no feedback round has
   * been entered yet; any positive value means a loop is in progress.
   */
  feedbackRoundActive: (s) => s.feedbackRound > 0,

  // ---------------------------------------------------------- Ideation step
  //
  // Conditional blocks inside `ideation/spec.json` — see
  // `blocks.conditional[].when`.
  // -------------------------------------------------------------------------

  /**
   * The orchestrator has produced `ideation.md` and is positioned to ask
   * the user about the optional evaluation gate.
   */
  ideationSynthesized: (s) =>
    (s.artifacts['ideation'] ?? []).includes('ideation.md'),

  /**
   * At least one `__pi` agent is registered in the session's active-subagents
   * list and the orchestrator is about to dispatch them.
   */
  piAgentsToSpawn: (s) =>
    s.activeSubagents.some((a) => a.agentType === '__pi'),

  // ------------------------------------------------------------ Always-true
  //
  // The `always` predicate is the declarative escape hatch for
  // unconditional transitions (`execution → execution_eval`, `memorization
  // → done`, …). It is not meant to gate a conditional block — block-level
  // "always include" is just omitting the `when`.
  // -------------------------------------------------------------------------

  /** Constant true — used by unconditional graph-level transitions. */
  always: (_s) => true,

  // ------------------------------------------------------------- Verdicts
  //
  // Graph-level verdict labels. The authoritative runtime dispatch for
  // verdict events is in `workflow/transitions.ts::findTransition`, which
  // matches on `rule.verdict` against the event payload. These predicates
  // interpret state conservatively — `verdictPass` answers "is the current
  // step positioned past a pass-verdict exit?" by checking whether the
  // preceding eval step completed cleanly. The result is advisory (used by
  // the validator, the static graph analyzer, and any future state-only
  // consumer); it is NOT the enforcement path.
  //
  // Conservative reading rationale: predicates run against `WorkflowState`,
  // not against events. An event-less `WorkflowState` cannot observe the
  // just-fired verdict. Returning `false` by default when the state does
  // not visibly record a verdict outcome keeps the predicate pure and keeps
  // the runtime enforcement in the transition table (where it belongs).
  // -------------------------------------------------------------------------

  /**
   * True when the current step shows the shape of a completed
   * eval step that produced a pass verdict — specifically, the state has
   * left the eval step (`currentStep` is not an `*_eval` name) AND the
   * corresponding productive step appears in `completedSteps`.
   *
   * Conservative: returns `false` while the workflow is still inside an
   * eval step or the completed-steps trail has not advanced past it.
   *
   * Known limitation (PR C): verdictPass and verdictRevise use
   * conservative state-only heuristics. A proper fix requires
   * `lastVerdictOutcome` on WorkflowState + reducer extension to
   * record the most recent verdict event's outcome. See PR B
   * evaluation finding #3 (deferred).
   */
  verdictPass: (s) => {
    const step = s.currentStep;
    // Inside an eval step, the verdict has not been recorded yet.
    if (step === 'ideation_eval' || step === 'plan_eval' || step === 'execution_eval') {
      return false;
    }
    // Post-eval, the corresponding productive step must be in the
    // completed-steps trail for a pass to have fired.
    // Short of event-data inspection this is the best state-only signal.
    return s.completedSteps.length > 0;
  },

  /**
   * True when the workflow has looped back via a revise verdict —
   * `feedbackRound > 0` is the canonical state-level signal for a revise
   * loop. Distinct from `feedbackRoundActive` only by intent: this name
   * appears on graph-level transition edges (not on spec conditional
   * blocks) and aligns with the design-doc naming.
   */
  verdictRevise: (s) => s.feedbackRound > 0,

  // ------------------------------------------------------- Loop targets
  //
  // Graph edges labelled `loopTarget{Ideation,Plan,Execution}`. The runtime
  // authority is `TransitionRule.loopTarget` in `transitions.ts`. These
  // predicates read state conservatively — they return `true` only when the
  // most recent feedback-loop target can be inferred from `currentStep`
  // after the reducer has already routed the revise event.
  //
  // The typical graph-validator usage does not evaluate these against live
  // state; it merely asserts the name is registered. The conservative
  // bodies make the fallback dispatch safe.
  // -------------------------------------------------------------------------

  /** Revise verdict targeted `ideation` — the workflow is back at ideation mid-feedback. */
  loopTargetIdeation: (s) => s.currentStep === 'ideation' && s.feedbackRound > 0,

  /** Revise verdict targeted `plan` — the workflow is back at plan mid-feedback. */
  loopTargetPlan: (s) => s.currentStep === 'plan' && s.feedbackRound > 0,

  /** Revise verdict targeted `execution` — the workflow is back at execution mid-feedback. */
  loopTargetExecution: (s) =>
    s.currentStep === 'execution' && s.feedbackRound > 0,

  // ---------------------------------------------------------- Step timeout
  //
  // `stepTimeoutFired` — set by the Stop-hook CLI path when the elapsed
  // step time exceeds `meta.timeoutMs`. State-only inference: when the
  // current step is `error`, the most plausible (and most common) cause is
  // a step-timeout escalation. A richer state field (e.g. `errorCause`)
  // would disambiguate; today this is a conservative read.
  // -------------------------------------------------------------------------

  /** The current step is `error` — consistent with a fired step timeout. */
  stepTimeoutFired: (s) => s.currentStep === 'error',

  // --------------------------------------------------- User navigation
  //
  // `skipRequested` / `abortRequested` are declarative labels for
  // user-initiated navigation edges in the graph. State-only inference:
  // abort implies `done`, skip is typically transient (state has already
  // advanced to the target step) and cannot be observed purely from state
  // without an explicit flag. Both return a conservative heuristic; the
  // runtime authority remains the transition table.
  // -------------------------------------------------------------------------

  /** User has explicitly requested a skip — conservatively false under state-only inspection. */
  skipRequested: (_s) => false,

  /** User has explicitly aborted from error — `currentStep === 'done'` is the canonical tell. */
  abortRequested: (s) => s.currentStep === 'done',

  // -------------------------------------------------------- Resume targets
  //
  // Graph edges labelled `resumeTarget{Ideation,Plan,Execution,Memorization}`.
  // Resume is `error → prior-step`; state-only inference returns `true`
  // when the current step matches the target AND the previous step was
  // `error`. Without an explicit `resumeFrom` field on state, the
  // conservative read is "current step matches the target". The validator
  // only needs the names to be registered.
  // -------------------------------------------------------------------------

  /** Resume target is `ideation`. */
  resumeTargetIdeation: (s) => s.currentStep === 'ideation',

  /** Resume target is `plan`. */
  resumeTargetPlan: (s) => s.currentStep === 'plan',

  /** Resume target is `execution`. */
  resumeTargetExecution: (s) => s.currentStep === 'execution',

  /** Resume target is `memorization` (the force-memorization recovery pathway). */
  resumeTargetMemorization: (s) => s.currentStep === 'memorization',
} as const satisfies Record<PredicateName, Predicate>;

// `defaultPredicates` is typed as a concrete record above. The exported
// surface keeps the broader `PredicateRegistry` shape so callers assembling
// custom registries remain compatible.
export const DEFAULT_PREDICATES: PredicateRegistry = defaultPredicates;

// ---------------------------------------------------------------------------
// Static validation — transitions table
// ---------------------------------------------------------------------------

/**
 * Check that every predicate name referenced in transition rules exists in
 * the registry. Returns an array of error messages — empty means valid.
 *
 * Run this at startup or in tests to catch misspelled predicate references
 * before they cause runtime failures.
 */
export function validatePredicateReferences(
  transitions: readonly TransitionRule[],
  registry: PredicateRegistry,
): string[] {
  const errors: string[] = [];
  for (const rule of transitions) {
    if (rule.condition !== undefined && !(rule.condition in registry)) {
      errors.push(
        `Transition ${rule.from} -> ${rule.to} references unknown predicate "${rule.condition}"`,
      );
    }
  }
  return errors;
}
