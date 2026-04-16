/**
 * Workflow state types and initial state factory.
 *
 * Defines the WorkflowState interface, step/substate types, evaluation
 * configuration, active subagent tracking, and guard violation records.
 * State is immutable — all fields use readonly modifiers.
 */

// ---------------------------------------------------------------------------
// Workflow step type — 10 discrete states
// ---------------------------------------------------------------------------

export type WorkflowStep =
  | 'idle'
  | 'ideation'
  | 'ideation_eval'
  | 'plan'
  | 'plan_eval'
  | 'execution'
  | 'execution_eval'
  | 'memorization'
  | 'done'
  | 'error';

/**
 * Steps that represent active workflow execution (not terminal or pre-start).
 * Used for timeout and skip applicability checks.
 */
export const ACTIVE_STEPS: ReadonlySet<WorkflowStep> = new Set<WorkflowStep>([
  'ideation',
  'ideation_eval',
  'plan',
  'plan_eval',
  'execution',
  'execution_eval',
  'memorization',
]);

/**
 * Terminal steps that accept no further events.
 */
export const TERMINAL_STEPS: ReadonlySet<WorkflowStep> = new Set<WorkflowStep>([
  'done',
]);

// ---------------------------------------------------------------------------
// Ideation substate — tracks discussion vs research within ideation step
// ---------------------------------------------------------------------------

export type IdeationSubstate = 'discussing' | 'researching' | null;

// ---------------------------------------------------------------------------
// Evaluation configuration — decided once at workflow start
// ---------------------------------------------------------------------------

export interface EvalConfig {
  readonly ideation: boolean;
  readonly plan: boolean;
}

// ---------------------------------------------------------------------------
// Active subagent tracking
// ---------------------------------------------------------------------------

export interface ActiveSubagent {
  readonly subagentId: string;
  readonly agentType: string;
  readonly step: string;
  readonly spawnedAt: string;
}

// ---------------------------------------------------------------------------
// Guard violation record — persisted in state for audit trail
// ---------------------------------------------------------------------------

export interface GuardViolationRecord {
  readonly guardId: string;
  readonly toolName: string;
  readonly reason: string;
  readonly step: string;
  readonly timestamp: string;
}

// ---------------------------------------------------------------------------
// Workflow state — the complete snapshot at any point in time
// ---------------------------------------------------------------------------

export interface WorkflowState {
  readonly schemaVersion: number;
  readonly sessionId: string;
  readonly currentStep: WorkflowStep;
  readonly currentSubstate: IdeationSubstate;
  readonly completedSteps: readonly string[];
  readonly evalConfig: EvalConfig | null;
  readonly activeSubagents: readonly ActiveSubagent[];
  readonly artifacts: Readonly<Record<string, readonly string[]>>;
  readonly violations: readonly GuardViolationRecord[];
  readonly feedbackRound: number;
  readonly maxFeedbackRounds: number;
}

// ---------------------------------------------------------------------------
// Initial state factory
// ---------------------------------------------------------------------------

/**
 * Create a fresh WorkflowState for a new session.
 *
 * Starts in the `idle` step with no substate, no eval config,
 * and a default feedback cap of 3 rounds.
 */
export function initialState(sessionId: string): WorkflowState {
  return {
    schemaVersion: 1,
    sessionId,
    currentStep: 'idle',
    currentSubstate: null,
    completedSteps: [],
    evalConfig: null,
    activeSubagents: [],
    artifacts: {},
    violations: [],
    feedbackRound: 0,
    maxFeedbackRounds: 3,
  };
}
