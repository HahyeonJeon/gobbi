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
