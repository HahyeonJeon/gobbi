/**
 * Decision event category — 3 event types recording choices that affect workflow direction.
 *
 * Events: user, eval.verdict, eval.skip
 */

// ---------------------------------------------------------------------------
// 1. Const object — single source of truth for event type strings
// ---------------------------------------------------------------------------

export const DECISION_EVENTS = {
  USER: 'decision.user',
  EVAL_VERDICT: 'decision.eval.verdict',
  EVAL_SKIP: 'decision.eval.skip',
} as const;

// ---------------------------------------------------------------------------
// 2. Set for type guard — values, NOT keys
// ---------------------------------------------------------------------------

const DECISION_EVENT_TYPES = new Set<string>(Object.values(DECISION_EVENTS));

// ---------------------------------------------------------------------------
// 3. Category union type — derived from the const object
// ---------------------------------------------------------------------------

export type DecisionEventType = typeof DECISION_EVENTS[keyof typeof DECISION_EVENTS];

// ---------------------------------------------------------------------------
// 4. Per-event data interfaces
// ---------------------------------------------------------------------------

export interface DecisionUserData {
  readonly decision: 'approve' | 'reject' | 'defer';
  readonly context?: string | undefined;
}

export interface EvalVerdictData {
  readonly verdict: 'pass' | 'revise' | 'escalate';
  readonly loopTarget?: string | undefined;
  readonly evaluatorId?: string | undefined;
}

export interface EvalSkipData {
  readonly step: string;
}

// ---------------------------------------------------------------------------
// 5. Discriminated union for category events
// ---------------------------------------------------------------------------

export type DecisionEvent =
  | { readonly type: typeof DECISION_EVENTS.USER; readonly data: DecisionUserData }
  | { readonly type: typeof DECISION_EVENTS.EVAL_VERDICT; readonly data: EvalVerdictData }
  | { readonly type: typeof DECISION_EVENTS.EVAL_SKIP; readonly data: EvalSkipData };

// ---------------------------------------------------------------------------
// 6. Type guard — Set.has() on values, NEVER `in` operator on keys
// ---------------------------------------------------------------------------

export function isDecisionEvent(event: { type: string }): event is DecisionEvent {
  return DECISION_EVENT_TYPES.has(event.type);
}

// ---------------------------------------------------------------------------
// 7. Factory functions
// ---------------------------------------------------------------------------

export function createDecisionUser(data: DecisionUserData): DecisionEvent {
  return { type: DECISION_EVENTS.USER, data };
}

export function createEvalVerdict(data: EvalVerdictData): DecisionEvent {
  return { type: DECISION_EVENTS.EVAL_VERDICT, data };
}

export function createEvalSkip(data: EvalSkipData): DecisionEvent {
  return { type: DECISION_EVENTS.EVAL_SKIP, data };
}
