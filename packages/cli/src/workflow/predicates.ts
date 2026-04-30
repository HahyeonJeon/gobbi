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

import type { WorkflowState } from './state-derivation.js';
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

const corePredicates = {
  // ------------------------------------------------------------------- Eval
  //
  // Gate ideation/planning evaluation on `evalConfig`. Missing config defaults
  // to "evaluation disabled" — the reducer only populates `evalConfig` once
  // `workflow.eval.decide` has fired.
  // -------------------------------------------------------------------------

  /** Ideation evaluation is enabled in evalConfig. */
  evalIdeationEnabled: (s) => s.evalConfig?.ideation === true,

  /** Ideation evaluation is disabled or evalConfig not yet set. */
  evalIdeationDisabled: (s) => s.evalConfig?.ideation !== true,

  /** Planning evaluation is enabled in evalConfig. */
  evalPlanningEnabled: (s) => s.evalConfig?.planning === true,

  /** Planning evaluation is disabled or evalConfig not yet set. */
  evalPlanningDisabled: (s) => s.evalConfig?.planning !== true,

  /**
   * Memorization evaluation is enabled in evalConfig (PR-FIN-2a-i T-2a.7).
   * Gates the `memorization → memorization_eval` graph transition.
   */
  evalMemorizationEnabled: (s) => s.evalConfig?.memorization === true,

  /**
   * Memorization evaluation is disabled or the slot has not been set
   * (PR-FIN-2a-i T-2a.7). Drives the `memorization → handoff` direct
   * transition when no eval is requested.
   */
  evalMemorizationDisabled: (s) => s.evalConfig?.memorization !== true,

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
  // matches on `rule.verdict` against the `EvalVerdictData` payload of the
  // incoming event. These predicate bodies read
  // `WorkflowState.lastVerdictOutcome` — the bare `'pass' | 'revise' | null`
  // enum that the reducer populates on each `EVAL_VERDICT` event and clears
  // on the next productive `workflow.step.exit`. The predicates are used by
  // the validator, the static graph analyzer, and state-only consumers
  // (status rendering, dead-code analysis). They are NOT the enforcement
  // path for transition routing — see the file-level docblock in
  // `transitions.ts` and the `VerdictPredicateName` type below.
  //
  // `lastVerdictOutcome` is the schema-v2 field added by C.8; it carries no
  // `loopTarget` discriminator, so the `loopTarget*` predicates below still
  // read their existing state fields (they would gain no precision from the
  // bare outcome enum).
  // -------------------------------------------------------------------------

  /**
   * True when the most recent `decision.eval.verdict` event carried
   * `verdict: 'pass'`. Reads `WorkflowState.lastVerdictOutcome`.
   */
  verdictPass: (s) => s.lastVerdictOutcome === 'pass',

  /**
   * True when the most recent `decision.eval.verdict` event carried
   * `verdict: 'revise'`. Reads `WorkflowState.lastVerdictOutcome`.
   */
  verdictRevise: (s) => s.lastVerdictOutcome === 'revise',

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

  /** Revise verdict targeted `planning` — the workflow is back at planning mid-feedback. */
  loopTargetPlanning: (s) => s.currentStep === 'planning' && s.feedbackRound > 0,

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

  /** Resume target is `planning`. */
  resumeTargetPlanning: (s) => s.currentStep === 'planning',

  /** Resume target is `execution`. */
  resumeTargetExecution: (s) => s.currentStep === 'execution',

  /** Resume target is `memorization` (the force-memorization recovery pathway). */
  resumeTargetMemorization: (s) => s.currentStep === 'memorization',
} as const satisfies Record<PredicateName, Predicate>;

// ---------------------------------------------------------------------------
// Non-spec predicates — Wave C.2
//
// Predicates that are NOT referenced in any spec / overlay / graph and
// therefore do NOT appear in the codegen-derived `PredicateName` union.
// They live outside the `satisfies Record<PredicateName, Predicate>` gate
// so the codegen gate still fails when a spec references an unregistered
// name, while these additional registrations remain available to
// state-only consumers (settings translation, status rendering, future
// `execution_eval` gating).
//
// Today `evalExecutionEnabled` / `evalExecutionDisabled` are registered
// for observational parity with the ideation/plan variants — the
// `execution_eval` step is unconditionally reached via the graph until a
// follow-up Pass wires the gate. See ideation §6.5 for the translation
// layer and the Wave C.2 briefing for the scope boundary.
// ---------------------------------------------------------------------------

const additionalPredicates = {
  /** Execution evaluation is enabled in evalConfig. */
  evalExecutionEnabled: (s) => s.evalConfig?.execution === true,

  /** Execution evaluation is disabled or the slot has not been set. */
  evalExecutionDisabled: (s) => s.evalConfig?.execution !== true,
} as const satisfies Record<string, Predicate>;

/**
 * The exposed predicate registry — `corePredicates` plus any non-spec
 * `additionalPredicates` registered for state-only consumers. The core
 * registry retains the `satisfies Record<PredicateName, Predicate>`
 * compile-time gate; extras are merged here so they remain accessible
 * without relaxing that gate.
 */
export const defaultPredicates = {
  ...corePredicates,
  ...additionalPredicates,
} satisfies Record<string, Predicate>;

// `defaultPredicates` is typed as a concrete record above. The exported
// surface keeps the broader `PredicateRegistry` shape so callers assembling
// custom registries remain compatible.
export const DEFAULT_PREDICATES: PredicateRegistry = defaultPredicates;

// ---------------------------------------------------------------------------
// Advisory predicate exclusion — opt-out list for the E009 dead-predicate
// detector (`gobbi workflow validate`, PR E E.9).
//
// A predicate is "advisory" when it is intentionally registered for use by
// `guard.warn` slots or overlay-only advisory paths and is not expected to
// appear in any spec / overlay / graph `transitions[].condition` or
// `blocks.conditional[].when`. E009 excludes these from the
// unreferenced-in-any-spec diagnostic so a deliberately reserved predicate
// is not flagged as dead.
//
// Design notes (PR E L15, refined post-research):
//
//   - Sibling `ReadonlySet<PredicateName>` constant — not a flag on the
//     `Predicate` function type. Zero ripple through existing
//     `satisfies Record<PredicateName, Predicate>` call sites.
//   - Typed as `ReadonlySet<PredicateName>` so `.has(name)` is
//     type-narrowed and a rename/removal in `PredicateName` surfaces as
//     a typecheck error.
//   - Empty by default; add a predicate name only when it is genuinely
//     registered for non-graph, non-spec consumption.
// ---------------------------------------------------------------------------

/**
 * Predicates intentionally excluded from E009_DEAD_PREDICATE detection.
 * Advisory predicates are registered for use by `guard.warn` slots or
 * overlay-only advisory paths; they do not need to appear in transitions.
 *
 * Empty on first landing — future advisory predicates are added here
 * explicitly. The `satisfies ReadonlySet<PredicateName>` clause keeps the
 * set from drifting out of sync with the generated `PredicateName` union.
 */
export const ADVISORY_PREDICATE_NAMES: ReadonlySet<PredicateName> = new Set<PredicateName>([
  // Add any genuinely-advisory predicate names here. Start empty.
]) satisfies ReadonlySet<PredicateName>;

// ---------------------------------------------------------------------------
// Non-spec predicate exclusion — Wave C.2
//
// Predicates registered in `defaultPredicates` that are deliberately NOT
// referenced by any spec / overlay / graph edge, so they cannot appear in
// the codegen-derived `PredicateName` union. E009 (`gobbi workflow
// validate`) would otherwise flag them as dead. This set is the opt-out
// list for that class of registrations — parallel in purpose to
// `ADVISORY_PREDICATE_NAMES` but scoped to names outside `PredicateName`.
//
// Today the only inhabitants are the two execution-eval parity predicates
// (`evalExecutionEnabled`, `evalExecutionDisabled`) added by Wave C.2 for
// observational state-only consumers — the `execution_eval` step is still
// reached unconditionally via the graph. A follow-up Pass that wires a
// conditional `execution_eval` entry will cause the codegen to pull the
// names into `PredicateName`, at which point these entries should migrate
// to `ADVISORY_PREDICATE_NAMES` (or be removed entirely).
// ---------------------------------------------------------------------------

/**
 * Non-spec predicate names registered in `defaultPredicates` but absent
 * from the codegen `PredicateName` union. E009 excludes these from the
 * dead-predicate diagnostic alongside `ADVISORY_PREDICATE_NAMES`.
 *
 * Strings are intentionally unbranded — members are not in `PredicateName`.
 */
export const NON_SPEC_PREDICATE_NAMES: ReadonlySet<string> = new Set<string>([
  'evalExecutionEnabled',
  'evalExecutionDisabled',
]);

// ---------------------------------------------------------------------------
// Verdict predicate exclusion — compile-time gate for `TransitionRule.condition`
//
// Transition routing for verdict events routes on `rule.verdict` matched
// against the `EvalVerdictData` payload, not by evaluating a predicate
// against state. The two verdict-labelled predicate bodies above read
// `WorkflowState.lastVerdictOutcome` for state-only consumers — authoring
// a transition rule with `condition: 'verdictPass'` or `condition:
// 'verdictRevise'` would bypass the authoritative routing path and produce
// subtle ordering bugs (the predicate runs against post-reduce state, not
// the firing event).
//
// `transitions.ts` narrows `TransitionRule.condition` to
// `Exclude<PredicateName, VerdictPredicateName>` so those names fail at
// `tsc` when used as a rule condition. Keeping the list colocated with the
// predicate bodies means a maintainer editing this file sees the exclusion
// set immediately.
// ---------------------------------------------------------------------------

/**
 * Predicate names reserved for verdict-routing authority. Never usable as
 * `TransitionRule.condition` — use `rule.verdict` instead.
 */
export type VerdictPredicateName = 'verdictPass' | 'verdictRevise';

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
