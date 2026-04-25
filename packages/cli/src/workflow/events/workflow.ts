/**
 * Workflow event category — 9 event types tracking session lifecycle.
 *
 * Core events: start, step.exit, step.skip, eval.decide, finish
 * Error/recovery events: step.timeout, abort, resume, invalid_transition
 *
 * `workflow.invalid_transition` is the audit-emit-on-rejection record
 * introduced in PR D.1. When `appendEventAndUpdateState`'s reducer rejects
 * an event, the engine rolls back the outer transaction, then opens a
 * fresh transaction and appends one `workflow.invalid_transition` with the
 * rejection context. This turns previously-silent reducer errors into an
 * observable, CP11-reversible audit trail. See `workflow/engine.ts` for
 * the refactor details and `specs/errors.pathway-detect.ts` for the
 * detector branch that reads these events.
 */

// ---------------------------------------------------------------------------
// 1. Const object — single source of truth for event type strings
// ---------------------------------------------------------------------------

export const WORKFLOW_EVENTS = {
  START: 'workflow.start',
  STEP_EXIT: 'workflow.step.exit',
  STEP_SKIP: 'workflow.step.skip',
  STEP_TIMEOUT: 'workflow.step.timeout',
  EVAL_DECIDE: 'workflow.eval.decide',
  FINISH: 'workflow.finish',
  ABORT: 'workflow.abort',
  RESUME: 'workflow.resume',
  INVALID_TRANSITION: 'workflow.invalid_transition',
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
  /**
   * Planning-evaluation gate.
   *
   * Event payloads are immutable wire-format history; the field name
   * remains `plan` (matching the pre-Wave-4 state-machine literal) even
   * though the state-level field was renamed to `EvalConfig.planning` in
   * W4. The two sides meet in `reducer.ts:184`, which maps
   * `planning: event.data.plan` — the CQRS asymmetry. See the file-level
   * JSDoc block in `reducer.ts` for the rationale and the plan-remediation
   * doc (v050-features/gobbi-memory) for the migration history.
   *
   * Do NOT rename this field — doing so would require an event schema
   * migration (events on disk under the old name) and break the
   * payload-stability invariant. The state field `EvalConfig.planning`
   * is the post-rename canonical read site.
   */
  readonly plan: boolean;
  /**
   * Execution-eval gate (Wave C.2). Optional for backward-compat — legacy
   * emitters and the ~22 existing reducer/state tests carry only
   * `{ideation, plan}`. When the orchestrator resolves
   * `workflow.execution.evaluate.mode` via the settings translation layer
   * (ideation §6.5), the resulting boolean is attached to the EVAL_DECIDE
   * event and the reducer merges it into `state.evalConfig.execution`.
   */
  readonly execution?: boolean;
}

export type FinishData = Record<string, never>;

export interface AbortData {
  readonly reason?: string | undefined;
}

export interface ResumeData {
  readonly targetStep: string;
  readonly fromError: boolean;
}

/**
 * Audit record for a reducer rejection. Emitted by
 * `engine.ts::appendEventAndUpdateState` when `reduce()` returns
 * `{ok: false}`. Five fields:
 *
 * - `rejectedEventType` — the type string of the event that was rejected.
 * - `rejectedEventSeq` — always `null` for PR D.1. The rejected event was
 *   inside a rolled-back SQLite transaction and therefore never persisted,
 *   so no seq exists for it. The audit event itself has a seq (the row seq
 *   assigned by `store.append`); downstream tooling can cite that.
 * - `stepAtRejection` — the current step at the time of rejection.
 * - `reducerMessage` — human-readable error message from the reducer's
 *   `{ok: false, error}` return.
 * - `timestamp` — ISO 8601 timestamp of the audit-emit (same wall-clock
 *   reading used for the rejected event's idempotency key, so the two
 *   events share the same millisecond).
 */
export interface InvalidTransitionData {
  readonly rejectedEventType: string;
  readonly rejectedEventSeq: number | null;
  readonly stepAtRejection: string;
  readonly reducerMessage: string;
  readonly timestamp: string;
}

// ---------------------------------------------------------------------------
// 5. Discriminated union for category events
// ---------------------------------------------------------------------------

export type WorkflowEvent =
  | { readonly type: typeof WORKFLOW_EVENTS.START; readonly data: WorkflowStartData }
  | { readonly type: typeof WORKFLOW_EVENTS.STEP_EXIT; readonly data: StepExitData }
  | { readonly type: typeof WORKFLOW_EVENTS.STEP_SKIP; readonly data: StepSkipData }
  | { readonly type: typeof WORKFLOW_EVENTS.STEP_TIMEOUT; readonly data: StepTimeoutData }
  | { readonly type: typeof WORKFLOW_EVENTS.EVAL_DECIDE; readonly data: EvalDecideData }
  | { readonly type: typeof WORKFLOW_EVENTS.FINISH; readonly data: FinishData }
  | { readonly type: typeof WORKFLOW_EVENTS.ABORT; readonly data: AbortData }
  | { readonly type: typeof WORKFLOW_EVENTS.RESUME; readonly data: ResumeData }
  | { readonly type: typeof WORKFLOW_EVENTS.INVALID_TRANSITION; readonly data: InvalidTransitionData };

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

export function createWorkflowInvalidTransition(
  data: InvalidTransitionData,
): WorkflowEvent {
  return { type: WORKFLOW_EVENTS.INVALID_TRANSITION, data };
}
