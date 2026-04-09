/**
 * Prompt transition graph — complete routing map for all 14 phases.
 *
 * Each node declares its completion outcomes and ASL Choice-style transitions.
 * The graph is a static data structure; `getNextPhase()` resolves transitions
 * by evaluating conditions against the provided outcome.
 */

import type { PromptPhase, PromptSchema, Completion, Transitions } from './types.js';
import { PROMPT_PHASE_TO_SCHEMA, isPromptPhase } from './types.js';

// ---------------------------------------------------------------------------
// Graph Node
// ---------------------------------------------------------------------------

/** A single node in the transition graph. */
export interface TransitionGraphNode {
  phase: PromptPhase;
  schema: PromptSchema;
  description: string;
  completion: Completion;
  transitions: Transitions;
}

// ---------------------------------------------------------------------------
// Transition Graph
// ---------------------------------------------------------------------------

/**
 * Complete routing map for all 14 prompt phases.
 *
 * Terminal states use `default: '__terminal__'` to indicate no next phase.
 * Return-to-parent states use `default: '__parent__'` to indicate the
 * orchestrator should resume the calling context.
 */
export const TRANSITION_GRAPH: Readonly<Record<PromptPhase, TransitionGraphNode>> = {
  'session-start': {
    phase: 'session-start',
    schema: PROMPT_PHASE_TO_SCHEMA['session-start'],
    description: 'Initialize session — gather user preferences and environment',
    completion: {
      type: 'select-outcome',
      outcomes: [
        { id: 'configured', description: 'Session configured successfully' },
      ],
    },
    transitions: {
      type: 'choice',
      choices: [
        { condition: { variable: 'outcome', equals: 'configured' }, next: 'workflow-start' },
      ],
      default: 'workflow-start',
    },
  },

  'project-setup': {
    phase: 'project-setup',
    schema: PROMPT_PHASE_TO_SCHEMA['project-setup'],
    description: 'Configure project context — name, directories, base branch',
    completion: {
      type: 'select-outcome',
      outcomes: [
        { id: 'configured', description: 'Project configured successfully' },
      ],
    },
    transitions: {
      type: 'choice',
      choices: [
        { condition: { variable: 'outcome', equals: 'configured' }, next: 'workflow-start' },
      ],
      default: 'workflow-start',
    },
  },

  'workflow-start': {
    phase: 'workflow-start',
    schema: PROMPT_PHASE_TO_SCHEMA['workflow-start'],
    description: 'Classify task tier and route to appropriate workflow',
    completion: {
      type: 'select-outcome',
      outcomes: [
        { id: 'trivial', description: 'Trivial task — execute directly, no workflow' },
        { id: 'structured-routine', description: 'Structured routine — skip ideation, go to execution' },
        { id: 'non-trivial', description: 'Non-trivial — full workflow starting with ideation' },
      ],
    },
    transitions: {
      type: 'choice',
      choices: [
        { condition: { variable: 'outcome', equals: 'trivial' }, next: '__terminal__' },
        { condition: { variable: 'outcome', equals: 'structured-routine' }, next: 'workflow-execution' },
        { condition: { variable: 'outcome', equals: 'non-trivial' }, next: 'workflow-ideation' },
      ],
      default: 'workflow-ideation',
    },
  },

  'workflow-ideation': {
    phase: 'workflow-ideation',
    schema: PROMPT_PHASE_TO_SCHEMA['workflow-ideation'],
    description: 'PI agents explore what to do — innovative and best-practice stances',
    completion: {
      type: 'select-outcome',
      outcomes: [
        { id: 'ideas-ready', description: 'Ideation complete, proceed to planning' },
      ],
    },
    transitions: {
      type: 'choice',
      choices: [
        { condition: { variable: 'outcome', equals: 'ideas-ready' }, next: 'workflow-plan' },
      ],
      default: 'workflow-plan',
    },
  },

  'workflow-plan': {
    phase: 'workflow-plan',
    schema: PROMPT_PHASE_TO_SCHEMA['workflow-plan'],
    description: 'Decompose chosen idea into narrow, ordered tasks',
    completion: {
      type: 'select-outcome',
      outcomes: [
        { id: 'plan-approved', description: 'Plan approved, proceed to research' },
      ],
    },
    transitions: {
      type: 'choice',
      choices: [
        { condition: { variable: 'outcome', equals: 'plan-approved' }, next: 'workflow-research' },
      ],
      default: 'workflow-research',
    },
  },

  'workflow-research': {
    phase: 'workflow-research',
    schema: PROMPT_PHASE_TO_SCHEMA['workflow-research'],
    description: 'Research agents investigate how to implement the plan',
    completion: {
      type: 'select-outcome',
      outcomes: [
        { id: 'research-complete', description: 'Research complete, proceed to execution' },
      ],
    },
    transitions: {
      type: 'choice',
      choices: [
        { condition: { variable: 'outcome', equals: 'research-complete' }, next: 'workflow-execution' },
      ],
      default: 'workflow-execution',
    },
  },

  'workflow-execution': {
    phase: 'workflow-execution',
    schema: PROMPT_PHASE_TO_SCHEMA['workflow-execution'],
    description: 'Execute tasks one at a time — implement, verify, proceed',
    completion: {
      type: 'select-outcome',
      outcomes: [
        { id: 'execution-complete', description: 'All tasks executed, proceed to collection' },
      ],
    },
    transitions: {
      type: 'choice',
      choices: [
        { condition: { variable: 'outcome', equals: 'execution-complete' }, next: 'workflow-collection' },
      ],
      default: 'workflow-collection',
    },
  },

  'workflow-collection': {
    phase: 'workflow-collection',
    schema: PROMPT_PHASE_TO_SCHEMA['workflow-collection'],
    description: 'Verify notes, write README, record gotchas',
    completion: {
      type: 'select-outcome',
      outcomes: [
        { id: 'collected', description: 'Collection complete, proceed to memorization' },
      ],
    },
    transitions: {
      type: 'choice',
      choices: [
        { condition: { variable: 'outcome', equals: 'collected' }, next: 'workflow-memorization' },
      ],
      default: 'workflow-memorization',
    },
  },

  'workflow-memorization': {
    phase: 'workflow-memorization',
    schema: PROMPT_PHASE_TO_SCHEMA['workflow-memorization'],
    description: 'Save context for session continuity — decisions, state, open questions',
    completion: {
      type: 'select-outcome',
      outcomes: [
        { id: 'memorized', description: 'Context saved, proceed to review' },
      ],
    },
    transitions: {
      type: 'choice',
      choices: [
        { condition: { variable: 'outcome', equals: 'memorized' }, next: 'workflow-review' },
      ],
      default: 'workflow-review',
    },
  },

  'workflow-review': {
    phase: 'workflow-review',
    schema: PROMPT_PHASE_TO_SCHEMA['workflow-review'],
    description: 'PI agents assess the work — verdict and documentation',
    completion: {
      type: 'select-outcome',
      outcomes: [
        { id: 'pass', description: 'Review passed, finish workflow' },
        { id: 'needs-work', description: 'Needs improvements, enter feedback loop' },
        { id: 'fail', description: 'Significant issues, enter feedback loop' },
      ],
    },
    transitions: {
      type: 'choice',
      choices: [
        { condition: { variable: 'outcome', equals: 'pass' }, next: 'workflow-finish' },
        { condition: { variable: 'outcome', equals: 'needs-work' }, next: 'workflow-feedback' },
        { condition: { variable: 'outcome', equals: 'fail' }, next: 'workflow-feedback' },
      ],
      default: 'workflow-feedback',
    },
  },

  'workflow-feedback': {
    phase: 'workflow-feedback',
    schema: PROMPT_PHASE_TO_SCHEMA['workflow-feedback'],
    description: 'Address review findings — user decides what to fix, defer, or disagree with',
    completion: {
      type: 'select-outcome',
      outcomes: [
        { id: 'feedback-applied', description: 'Feedback addressed, return to review' },
      ],
    },
    transitions: {
      type: 'choice',
      choices: [
        { condition: { variable: 'outcome', equals: 'feedback-applied' }, next: 'workflow-review' },
      ],
      default: 'workflow-review',
    },
  },

  'workflow-finish': {
    phase: 'workflow-finish',
    schema: PROMPT_PHASE_TO_SCHEMA['workflow-finish'],
    description: 'Workflow complete — final summary and cleanup',
    completion: {
      type: 'select-outcome',
      outcomes: [
        { id: 'finished', description: 'Workflow finished' },
      ],
    },
    transitions: {
      type: 'choice',
      choices: [],
      default: '__terminal__',
    },
  },

  'evaluation-ask': {
    phase: 'evaluation-ask',
    schema: PROMPT_PHASE_TO_SCHEMA['evaluation-ask'],
    description: 'Ask user whether to run evaluation at this point',
    completion: {
      type: 'select-outcome',
      outcomes: [
        { id: 'evaluate', description: 'User wants evaluation — spawn evaluators' },
        { id: 'skip', description: 'User skips evaluation — return to parent phase' },
      ],
    },
    transitions: {
      type: 'choice',
      choices: [
        { condition: { variable: 'outcome', equals: 'evaluate' }, next: 'evaluation-spawn' },
        { condition: { variable: 'outcome', equals: 'skip' }, next: '__parent__' },
      ],
      default: '__parent__',
    },
  },

  'evaluation-spawn': {
    phase: 'evaluation-spawn',
    schema: PROMPT_PHASE_TO_SCHEMA['evaluation-spawn'],
    description: 'Spawn evaluator agents and collect findings',
    completion: {
      type: 'select-outcome',
      outcomes: [
        { id: 'evaluated', description: 'Evaluation complete — return to parent phase' },
      ],
    },
    transitions: {
      type: 'choice',
      choices: [
        { condition: { variable: 'outcome', equals: 'evaluated' }, next: '__parent__' },
      ],
      default: '__parent__',
    },
  },
};

// ---------------------------------------------------------------------------
// Lookup Functions
// ---------------------------------------------------------------------------

/**
 * Get the transition graph node for a phase.
 * Returns undefined if the phase is not in the graph.
 */
export function getTransitionNode(phase: PromptPhase): TransitionGraphNode | undefined {
  return TRANSITION_GRAPH[phase];
}

/**
 * Resolve the next phase given a current phase and a context of variable values.
 *
 * Evaluates each transition choice in order (ASL Choice pattern): for each
 * choice, checks whether `context[condition.variable] === condition.equals`.
 * First match wins. Falls back to the node's default transition when no
 * choice matches.
 *
 * The `outcome` value should be passed as `context.outcome`.
 *
 * Returns null for terminal states (`__terminal__`) and parent returns
 * (`__parent__`). Returns null if the phase is not in the graph.
 */
export function getNextPhase(
  phase: PromptPhase,
  context: Record<string, string>,
): string | null {
  const node = TRANSITION_GRAPH[phase];
  if (!node) return null;

  const { transitions } = node;

  for (const choice of transitions.choices) {
    const contextValue = context[choice.condition.variable];
    if (contextValue !== undefined && contextValue === choice.condition.equals) {
      const next = choice.next;
      if (next === '__terminal__' || next === '__parent__') return null;
      return isPromptPhase(next) ? next : null;
    }
  }

  // Fall back to default
  const defaultNext = transitions.default;
  if (defaultNext === '__terminal__' || defaultNext === '__parent__') return null;
  return isPromptPhase(defaultNext) ? defaultNext : null;
}
