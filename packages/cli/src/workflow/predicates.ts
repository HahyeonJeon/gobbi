/**
 * Predicate registry — pure functions that evaluate workflow state conditions.
 *
 * Guards and transitions reference predicates by name (string). The registry
 * maps those names to typed functions. This keeps guard/transition specs as
 * pure data while conditions remain type-safe TypeScript.
 */

import type { WorkflowState } from './state.js';
import type { TransitionRule } from './transitions.js';

// ---------------------------------------------------------------------------
// Predicate types
// ---------------------------------------------------------------------------

/** A predicate is a pure function from workflow state to boolean. */
export type Predicate = (state: WorkflowState) => boolean;

/** Registry mapping predicate names to their implementations. */
export type PredicateRegistry = Readonly<Record<string, Predicate>>;

// ---------------------------------------------------------------------------
// Built-in predicates
// ---------------------------------------------------------------------------

export const defaultPredicates: PredicateRegistry = {
  /** Ideation evaluation is enabled in evalConfig. */
  evalIdeationEnabled: (s) => s.evalConfig?.ideation === true,

  /** Ideation evaluation is disabled or evalConfig not yet set. */
  evalIdeationDisabled: (s) => s.evalConfig?.ideation !== true,

  /** Plan evaluation is enabled in evalConfig. */
  evalPlanEnabled: (s) => s.evalConfig?.plan === true,

  /** Plan evaluation is disabled or evalConfig not yet set. */
  evalPlanDisabled: (s) => s.evalConfig?.plan !== true,

  /** Feedback round cap has been reached or exceeded. */
  feedbackCapExceeded: (s) => s.feedbackRound >= s.maxFeedbackRounds,

  // -------------------------------------------------------------------------
  // Ideation-step predicates
  //
  // Referenced by `packages/cli/src/specs/ideation/spec.json` in
  // `blocks.conditional[i].when`. Each predicate reads only
  // `WorkflowState` fields that the reducer already maintains — no ad-hoc
  // state extensions are needed.
  // -------------------------------------------------------------------------

  /**
   * A feedback round is currently active — i.e. a prior evaluation of this
   * step returned a revise verdict and the orchestrator must read the
   * evaluator findings before re-spawning the PI agents.
   *
   * Reads `WorkflowState.feedbackRound`, which the reducer increments when
   * an evaluation feeds back. A value of `0` means no feedback round has
   * been entered yet; any positive value means the loop is active.
   */
  feedbackRoundActive: (s) => s.feedbackRound > 0,

  /**
   * The orchestrator has produced `ideation.md` and is positioned to ask
   * the user about the optional evaluation gate.
   *
   * Reads `WorkflowState.artifacts` — the reducer records each written
   * artifact under its step's key (see `workflow/artifacts.ts` +
   * `artifact.write` event). The ideation step's canonical filename is
   * `ideation.md`; presence of that entry under the `ideation` step key
   * means synthesis has landed.
   */
  ideationSynthesized: (s) =>
    (s.artifacts['ideation'] ?? []).includes('ideation.md'),

  /**
   * PI agents are registered in the session's active-subagents list and
   * have not yet been dispatched — the orchestrator is about to spawn them.
   *
   * Reads `WorkflowState.activeSubagents`. The agent type `'__pi'` matches
   * the Ideation spec's `meta.allowedAgentTypes`. A conservative reading:
   * if any `__pi` entry is active, we treat the step as in the
   * spawn-readiness window. This is semantically accurate for the current
   * state shape; once PR C's command surface tracks a finer "planned vs
   * spawned" distinction, the predicate can tighten to
   * `activeSubagents.some(a => a.agentType === '__pi' && a.status === 'planned')`.
   */
  piAgentsToSpawn: (s) =>
    s.activeSubagents.some((a) => a.agentType === '__pi'),
};

// ---------------------------------------------------------------------------
// Static validation
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
