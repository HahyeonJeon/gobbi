/**
 * Decision event category — 3 event types recording choices that affect workflow direction.
 *
 * Events: user, eval.verdict, eval.skip
 */

import type { ErrorPathway } from '../../specs/errors.js';

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

/**
 * Snapshot of the error pathway that an `eval.skip` event is stepping over.
 *
 * CP11 reversibility — when the orchestrator uses
 * `gobbi workflow resume --force-memorization` to step out of an `error`
 * state into `memorization`, the skip event carries a full snapshot of the
 * detected pathway so the skip is auditable and reversible. Downstream
 * tooling can parse `data.priorError.pathway` and reconstruct the
 * `ErrorPathway` that was in effect at skip time.
 *
 * Every field is `readonly`. Every field is a JSON-safe primitive (or
 * array of primitives / nested `ErrorPathway` which is itself JSON-safe),
 * so the whole payload round-trips through the event store's
 * `JSON.stringify` / `JSON.parse` boundary without loss.
 *
 * - `pathway` — the full `ErrorPathway` variant at skip time. Primitives
 *   only per `specs/errors.ts` discipline.
 * - `capturedAt` — ISO 8601 timestamp the snapshot was taken. Stamped by
 *   the caller (the `resume --force-memorization` path), not by
 *   `detectPathway` itself.
 * - `stepAtError` — the step the state machine was in when the error
 *   was observed (typically `'error'`).
 * - `witnessEventSeqs` — the event seqs that constitute the detector's
 *   evidence (timeout seq, invalid-transition seq, verdict seqs, etc.).
 *   Operators can cite these in an audit trail.
 */
export interface PriorErrorSnapshot {
  readonly pathway: ErrorPathway;
  readonly capturedAt: string;
  readonly stepAtError: string;
  readonly witnessEventSeqs: readonly number[];
}

/**
 * `decision.eval.skip` event data.
 *
 * - `step` — the step being skipped (v2 shape).
 * - `priorError` — optional CP11 reversibility snapshot (v3+ shape). Absent
 *   on every pre-PR-D event; present on `resume --force-memorization`
 *   force-skips. The field is optional so v2-schema events continue to
 *   round-trip identically through the schema v2 -> v3 identity migration.
 */
export interface EvalSkipData {
  readonly step: string;
  readonly priorError?: PriorErrorSnapshot;
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
