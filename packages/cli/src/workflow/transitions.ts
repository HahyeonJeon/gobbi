/**
 * Transition table and validation — encodes every valid state transition
 * from v050-state-machine.md.
 *
 * The transition table is declarative data. findTransition() evaluates rules
 * against current state and incoming event to find the applicable transition.
 * Rules reference predicate names from the predicate registry, keeping this
 * module free of inline condition logic.
 *
 * ## Verdict predicates — runtime authority
 *
 * Verdict-triggered transitions (rows with `verdict: 'pass'` or
 * `verdict: 'revise'`) route via the `rule.verdict` field matched against
 * the `EvalVerdictData` payload of the incoming event. The predicate names
 * `verdictPass` / `verdictRevise` are NOT the enforcement path — they are
 * advisory for the validator, graph analyser, and state-only consumers
 * (status rendering, dead-code analysis).
 *
 * As of PR C (C.3 + C.8), those predicate bodies read
 * `WorkflowState.lastVerdictOutcome` which the reducer populates on each
 * `decision.eval.verdict` event and clears on the next productive
 * `workflow.step.exit`. They are advisory-correct for state-only consumers.
 * Do NOT introduce runtime routing that evaluates these predicates against
 * state — always match on the event payload via `rule.verdict`.
 *
 * The `TransitionRule.condition` field is narrowed to
 * `Exclude<PredicateName, VerdictPredicateName>` so authoring a rule with
 * `{ condition: 'verdictPass' }` or `{ condition: 'verdictRevise' }` fails
 * at `tsc`. This compile-time gate is the enforcement mechanism; a runtime
 * validator code is deferred (PR E).
 *
 * @see `workflow/predicates.ts::verdictPass` / `verdictRevise`
 * @see `workflow/predicates.ts::VerdictPredicateName`
 * @see `workflow/reducer.ts` — populates `lastVerdictOutcome` on
 *      `EVAL_VERDICT`.
 */

import type { Event } from './events/index.js';
import { WORKFLOW_EVENTS } from './events/workflow.js';
import { DECISION_EVENTS } from './events/decision.js';
import type { WorkflowState, WorkflowStep } from './state.js';
import { ACTIVE_STEPS, TERMINAL_STEPS, isActiveStep } from './state.js';
import type { PredicateRegistry, VerdictPredicateName } from './predicates.js';
import type { PredicateName } from './predicates.generated.js';

// ---------------------------------------------------------------------------
// Transition rule type
// ---------------------------------------------------------------------------

/**
 * Names usable as `TransitionRule.condition` — every registered predicate
 * EXCEPT the verdict-routing names. See the file docblock for rationale.
 */
export type ConditionPredicateName = Exclude<PredicateName, VerdictPredicateName>;

export interface TransitionRule {
  readonly from: WorkflowStep;
  readonly to: WorkflowStep;
  readonly trigger: string;
  /**
   * Predicate name from registry. When undefined, the rule is unconditional.
   *
   * Narrowed to {@link ConditionPredicateName} — `verdictPass` /
   * `verdictRevise` cannot appear here. Verdict routing uses `rule.verdict`
   * matched against the event payload in {@link findTransition}.
   */
  readonly condition?: ConditionPredicateName | undefined;
  /**
   * For verdict-triggered transitions, the expected verdict value.
   * When undefined, any verdict matches (subject to other fields).
   */
  readonly verdict?: 'pass' | 'revise' | undefined;
  /**
   * For verdict-triggered revise transitions from execution_eval,
   * the expected loopTarget value. When undefined, loopTarget is not checked.
   */
  readonly loopTarget?: string | undefined;
  /**
   * Priority — lower number means higher precedence.
   * Default transitions (timeout, skip) use higher numbers.
   * Error transitions get lower numbers than skip transitions.
   */
  readonly priority: number;
}

// ---------------------------------------------------------------------------
// Transition table — every valid transition from v050-state-machine.md
// ---------------------------------------------------------------------------

/**
 * Complete transition table encoding all rows from the design spec.
 *
 * Priority scheme:
 *   0-9:   Specific step-to-step transitions (highest precedence)
 *   10-19: Error/timeout transitions (any -> error)
 *   20-29: Skip transitions (any -> ideation)
 *   30-39: Recovery transitions (error -> done/prior)
 */
export const TRANSITION_TABLE: readonly TransitionRule[] = [
  // -------------------------------------------------------------------------
  // Normal workflow progression (priority 0)
  // -------------------------------------------------------------------------

  // idle -> ideation via workflow.start
  {
    from: 'idle',
    to: 'ideation',
    trigger: WORKFLOW_EVENTS.START,
    priority: 0,
  },

  // ideation -> ideation_eval (eval enabled) or planning (eval disabled)
  {
    from: 'ideation',
    to: 'ideation_eval',
    trigger: WORKFLOW_EVENTS.STEP_EXIT,
    condition: 'evalIdeationEnabled',
    priority: 0,
  },
  {
    from: 'ideation',
    to: 'planning',
    trigger: WORKFLOW_EVENTS.STEP_EXIT,
    condition: 'evalIdeationDisabled',
    priority: 0,
  },

  // ideation_eval -> ideation (revise) or planning (pass)
  {
    from: 'ideation_eval',
    to: 'ideation',
    trigger: DECISION_EVENTS.EVAL_VERDICT,
    verdict: 'revise',
    priority: 0,
  },
  {
    from: 'ideation_eval',
    to: 'planning',
    trigger: DECISION_EVENTS.EVAL_VERDICT,
    verdict: 'pass',
    priority: 0,
  },

  // planning -> planning_eval (eval enabled) or execution (eval disabled)
  {
    from: 'planning',
    to: 'planning_eval',
    trigger: WORKFLOW_EVENTS.STEP_EXIT,
    condition: 'evalPlanningEnabled',
    priority: 0,
  },
  {
    from: 'planning',
    to: 'execution',
    trigger: WORKFLOW_EVENTS.STEP_EXIT,
    condition: 'evalPlanningDisabled',
    priority: 0,
  },

  // planning_eval -> planning (revise) or execution (pass)
  {
    from: 'planning_eval',
    to: 'planning',
    trigger: DECISION_EVENTS.EVAL_VERDICT,
    verdict: 'revise',
    priority: 0,
  },
  {
    from: 'planning_eval',
    to: 'execution',
    trigger: DECISION_EVENTS.EVAL_VERDICT,
    verdict: 'pass',
    priority: 0,
  },

  // execution -> execution_eval (always, no condition)
  {
    from: 'execution',
    to: 'execution_eval',
    trigger: WORKFLOW_EVENTS.STEP_EXIT,
    priority: 0,
  },

  // execution_eval -> memorization (pass)
  {
    from: 'execution_eval',
    to: 'memorization',
    trigger: DECISION_EVENTS.EVAL_VERDICT,
    verdict: 'pass',
    priority: 0,
  },

  // execution_eval -> error (revise but feedback cap exceeded)
  // Priority 1 — must be checked BEFORE the loopTarget rules below
  {
    from: 'execution_eval',
    to: 'error',
    trigger: DECISION_EVENTS.EVAL_VERDICT,
    verdict: 'revise',
    condition: 'feedbackCapExceeded',
    priority: 1,
  },

  // execution_eval -> ideation/planning/execution (revise with loopTarget)
  {
    from: 'execution_eval',
    to: 'ideation',
    trigger: DECISION_EVENTS.EVAL_VERDICT,
    verdict: 'revise',
    loopTarget: 'ideation',
    priority: 2,
  },
  {
    from: 'execution_eval',
    to: 'planning',
    trigger: DECISION_EVENTS.EVAL_VERDICT,
    verdict: 'revise',
    loopTarget: 'planning',
    priority: 2,
  },
  {
    from: 'execution_eval',
    to: 'execution',
    trigger: DECISION_EVENTS.EVAL_VERDICT,
    verdict: 'revise',
    loopTarget: 'execution',
    priority: 2,
  },

  // memorization -> handoff (productive exit; see specs/index.json::transitions)
  // Wave A.1.5 promoted handoff to a true state-machine step so the cover-sheet
  // artifact never collapses into the wide memorization sweep. The runtime
  // routing is workflow.step.exit (memorization) → handoff, matching the
  // declarative graph in `specs/index.json`.
  {
    from: 'memorization',
    to: 'handoff',
    trigger: WORKFLOW_EVENTS.STEP_EXIT,
    priority: 0,
  },

  // handoff -> done via workflow.finish
  {
    from: 'handoff',
    to: 'done',
    trigger: WORKFLOW_EVENTS.FINISH,
    priority: 0,
  },

  // -------------------------------------------------------------------------
  // Error transitions — any active step -> error (priority 10)
  // Higher priority than skip (20) per design spec
  // -------------------------------------------------------------------------
  {
    from: 'ideation',
    to: 'error',
    trigger: WORKFLOW_EVENTS.STEP_TIMEOUT,
    priority: 10,
  },
  {
    from: 'ideation_eval',
    to: 'error',
    trigger: WORKFLOW_EVENTS.STEP_TIMEOUT,
    priority: 10,
  },
  {
    from: 'planning',
    to: 'error',
    trigger: WORKFLOW_EVENTS.STEP_TIMEOUT,
    priority: 10,
  },
  {
    from: 'planning_eval',
    to: 'error',
    trigger: WORKFLOW_EVENTS.STEP_TIMEOUT,
    priority: 10,
  },
  {
    from: 'execution',
    to: 'error',
    trigger: WORKFLOW_EVENTS.STEP_TIMEOUT,
    priority: 10,
  },
  {
    from: 'execution_eval',
    to: 'error',
    trigger: WORKFLOW_EVENTS.STEP_TIMEOUT,
    priority: 10,
  },
  {
    from: 'memorization',
    to: 'error',
    trigger: WORKFLOW_EVENTS.STEP_TIMEOUT,
    priority: 10,
  },
  {
    from: 'handoff',
    to: 'error',
    trigger: WORKFLOW_EVENTS.STEP_TIMEOUT,
    priority: 10,
  },

  // -------------------------------------------------------------------------
  // Skip transitions — any -> ideation (priority 20, lower than error)
  // -------------------------------------------------------------------------
  // Note: self-skip from ideation is a no-op (rejected by findTransition)
  {
    from: 'ideation_eval',
    to: 'ideation',
    trigger: WORKFLOW_EVENTS.STEP_SKIP,
    priority: 20,
  },
  {
    from: 'planning',
    to: 'ideation',
    trigger: WORKFLOW_EVENTS.STEP_SKIP,
    priority: 20,
  },
  {
    from: 'planning_eval',
    to: 'ideation',
    trigger: WORKFLOW_EVENTS.STEP_SKIP,
    priority: 20,
  },
  {
    from: 'execution',
    to: 'ideation',
    trigger: WORKFLOW_EVENTS.STEP_SKIP,
    priority: 20,
  },
  {
    from: 'execution_eval',
    to: 'ideation',
    trigger: WORKFLOW_EVENTS.STEP_SKIP,
    priority: 20,
  },
  {
    from: 'memorization',
    to: 'ideation',
    trigger: WORKFLOW_EVENTS.STEP_SKIP,
    priority: 20,
  },
  {
    from: 'handoff',
    to: 'ideation',
    trigger: WORKFLOW_EVENTS.STEP_SKIP,
    priority: 20,
  },

  // -------------------------------------------------------------------------
  // Error recovery transitions (priority 30)
  // -------------------------------------------------------------------------

  // error -> done (abort)
  {
    from: 'error',
    to: 'done',
    trigger: WORKFLOW_EVENTS.ABORT,
    priority: 30,
  },

  // error -> (prior step) via resume — the target is dynamic, specified in
  // event data. We use a sentinel 'to' value that findTransition resolves
  // at evaluation time using the event's targetStep field.
];

// ---------------------------------------------------------------------------
// Sorted copy for evaluation — rules are evaluated in priority order
// ---------------------------------------------------------------------------

const SORTED_RULES: readonly TransitionRule[] = [...TRANSITION_TABLE].sort(
  (a, b) => a.priority - b.priority,
);

// ---------------------------------------------------------------------------
// Event data extraction helpers — use discriminated union narrowing (no casts)
// ---------------------------------------------------------------------------

/**
 * Extract the verdict field from a decision.eval.verdict event.
 * Returns undefined if the event is not a verdict event.
 *
 * After the type check, TypeScript narrows Event to the EvalVerdictData
 * variant — verdict and loopTarget are accessed type-safely.
 */
function extractVerdict(event: Event): 'pass' | 'revise' | 'escalate' | undefined {
  if (event.type !== DECISION_EVENTS.EVAL_VERDICT) return undefined;
  return event.data.verdict;
}

/**
 * Extract the loopTarget field from a decision.eval.verdict event.
 * Returns undefined if absent or if the event is not a verdict event.
 */
function extractLoopTarget(event: Event): string | undefined {
  if (event.type !== DECISION_EVENTS.EVAL_VERDICT) return undefined;
  return event.data.loopTarget;
}

/**
 * Extract the targetStep field from a workflow.resume event.
 * Returns undefined if the event is not a resume event.
 */
function extractResumeTarget(event: Event): string | undefined {
  if (event.type !== WORKFLOW_EVENTS.RESUME) return undefined;
  return event.data.targetStep;
}

// ---------------------------------------------------------------------------
// Transition lookup
// ---------------------------------------------------------------------------

/**
 * Find the applicable transition rule for the given state and event.
 *
 * Returns the matching TransitionRule, or null if no valid transition exists.
 * Rules are evaluated in ascending priority order (lower number = higher
 * precedence). The first matching rule wins.
 *
 * Special handling:
 * - Terminal states (done) reject all events
 * - Verdict events match on verdict value and loopTarget
 * - Resume from error uses the event's targetStep as the destination
 * - Self-skip (ideation -> ideation) is rejected
 */
export function findTransition(
  from: WorkflowStep,
  event: Event,
  state: WorkflowState,
  predicates: PredicateRegistry,
): TransitionRule | null {
  // Terminal state — accepts nothing
  if (TERMINAL_STEPS.has(from)) {
    return null;
  }

  // Special case: workflow.resume from error — dynamic target
  if (from === 'error' && event.type === WORKFLOW_EVENTS.RESUME) {
    const targetStep = extractResumeTarget(event);
    if (targetStep === undefined) return null;
    // Validate the target is a known active step (narrows string to WorkflowStep)
    if (!isActiveStep(targetStep)) return null;
    // Return a synthetic rule for the dynamic transition
    return {
      from: 'error',
      to: targetStep,
      trigger: WORKFLOW_EVENTS.RESUME,
      priority: 30,
    };
  }

  const verdict = extractVerdict(event);
  const loopTarget = extractLoopTarget(event);

  for (const rule of SORTED_RULES) {
    // Must match source step
    if (rule.from !== from) continue;

    // Must match trigger event type
    if (rule.trigger !== event.type) continue;

    // Verdict matching — if the rule specifies a verdict, the event must match
    if (rule.verdict !== undefined) {
      if (verdict !== rule.verdict) continue;
    }

    // LoopTarget matching — if the rule specifies a loopTarget, the event must match
    if (rule.loopTarget !== undefined) {
      if (loopTarget !== rule.loopTarget) continue;
    }

    // Condition predicate — if specified, must evaluate to true
    if (rule.condition !== undefined) {
      const predicate = predicates[rule.condition];
      if (predicate === undefined) {
        // Missing predicate — treat as non-matching (fail closed)
        continue;
      }
      if (!predicate(state)) continue;
    }

    return rule;
  }

  return null;
}
