/**
 * Workflow event category — 9 event types tracking session lifecycle.
 *
 * Core events: start, step.enter, step.exit, step.skip, eval.decide, finish
 * Error/recovery events: step.timeout, abort, resume
 */

// ---------------------------------------------------------------------------
// 1. Const object — single source of truth for event type strings
// ---------------------------------------------------------------------------

export const WORKFLOW_EVENTS = {
  START: 'workflow.start',
  STEP_ENTER: 'workflow.step.enter',
  STEP_EXIT: 'workflow.step.exit',
  STEP_SKIP: 'workflow.step.skip',
  STEP_TIMEOUT: 'workflow.step.timeout',
  EVAL_DECIDE: 'workflow.eval.decide',
  FINISH: 'workflow.finish',
  ABORT: 'workflow.abort',
  RESUME: 'workflow.resume',
} as const;

// ---------------------------------------------------------------------------
// 2. Set for type guard — values, NOT keys
// ---------------------------------------------------------------------------

const WORKFLOW_EVENT_TYPES = new Set<string>(Object.values(WORKFLOW_EVENTS));

// ---------------------------------------------------------------------------
// 3. Category union type — derived from the const object
// ---------------------------------------------------------------------------

export type WorkflowEventType = typeof WORKFLOW_EVENTS[keyof typeof WORKFLOW_EVENTS];

// ---------------------------------------------------------------------------
// 4. Per-event data interfaces
// ---------------------------------------------------------------------------

export interface WorkflowStartData {
  readonly sessionId: string;
  readonly timestamp: string;
}

export interface StepEnterData {
  readonly step: string;
  readonly loopFrom?: string | undefined;
}

export interface StepExitData {
  readonly step: string;
}

export interface StepSkipData {
  readonly step: string;
}

export interface StepTimeoutData {
  readonly step: string;
  readonly elapsedMs: number;
  readonly configuredTimeoutMs: number;
}

export interface EvalDecideData {
  readonly ideation: boolean;
  readonly plan: boolean;
}

export type FinishData = Record<string, never>;

export interface AbortData {
  readonly reason?: string | undefined;
}

export interface ResumeData {
  readonly targetStep: string;
  readonly fromError: boolean;
}

// ---------------------------------------------------------------------------
// 5. Discriminated union for category events
// ---------------------------------------------------------------------------

export type WorkflowEvent =
  | { readonly type: typeof WORKFLOW_EVENTS.START; readonly data: WorkflowStartData }
  | { readonly type: typeof WORKFLOW_EVENTS.STEP_ENTER; readonly data: StepEnterData }
  | { readonly type: typeof WORKFLOW_EVENTS.STEP_EXIT; readonly data: StepExitData }
  | { readonly type: typeof WORKFLOW_EVENTS.STEP_SKIP; readonly data: StepSkipData }
  | { readonly type: typeof WORKFLOW_EVENTS.STEP_TIMEOUT; readonly data: StepTimeoutData }
  | { readonly type: typeof WORKFLOW_EVENTS.EVAL_DECIDE; readonly data: EvalDecideData }
  | { readonly type: typeof WORKFLOW_EVENTS.FINISH; readonly data: FinishData }
  | { readonly type: typeof WORKFLOW_EVENTS.ABORT; readonly data: AbortData }
  | { readonly type: typeof WORKFLOW_EVENTS.RESUME; readonly data: ResumeData };

// ---------------------------------------------------------------------------
// 6. Type guard — Set.has() on values, NEVER `in` operator on keys
// ---------------------------------------------------------------------------

export function isWorkflowEvent(event: { type: string }): event is WorkflowEvent {
  return WORKFLOW_EVENT_TYPES.has(event.type);
}

// ---------------------------------------------------------------------------
// 7. Factory functions
// ---------------------------------------------------------------------------

export function createWorkflowStart(data: WorkflowStartData): WorkflowEvent {
  return { type: WORKFLOW_EVENTS.START, data };
}

export function createStepEnter(data: StepEnterData): WorkflowEvent {
  return { type: WORKFLOW_EVENTS.STEP_ENTER, data };
}

export function createStepExit(data: StepExitData): WorkflowEvent {
  return { type: WORKFLOW_EVENTS.STEP_EXIT, data };
}

export function createStepSkip(data: StepSkipData): WorkflowEvent {
  return { type: WORKFLOW_EVENTS.STEP_SKIP, data };
}

export function createStepTimeout(data: StepTimeoutData): WorkflowEvent {
  return { type: WORKFLOW_EVENTS.STEP_TIMEOUT, data };
}

export function createEvalDecide(data: EvalDecideData): WorkflowEvent {
  return { type: WORKFLOW_EVENTS.EVAL_DECIDE, data };
}

export function createFinish(data: FinishData): WorkflowEvent {
  return { type: WORKFLOW_EVENTS.FINISH, data };
}

export function createAbort(data: AbortData): WorkflowEvent {
  return { type: WORKFLOW_EVENTS.ABORT, data };
}

export function createResume(data: ResumeData): WorkflowEvent {
  return { type: WORKFLOW_EVENTS.RESUME, data };
}
