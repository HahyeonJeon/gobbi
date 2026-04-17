/**
 * Guard event category — 3 event types recording enforcement actions.
 *
 * Events: violation, override, warn
 */

import type { DiagnosticCode } from '../diagnostics.js';

// ---------------------------------------------------------------------------
// 1. Const object — single source of truth for event type strings
// ---------------------------------------------------------------------------

export const GUARD_EVENTS = {
  VIOLATION: 'guard.violation',
  OVERRIDE: 'guard.override',
  WARN: 'guard.warn',
} as const;

// ---------------------------------------------------------------------------
// 2. Set for type guard — values, NOT keys
// ---------------------------------------------------------------------------

const GUARD_EVENT_TYPES = new Set<string>(Object.values(GUARD_EVENTS));

// ---------------------------------------------------------------------------
// 3. Category union type — derived from the const object
// ---------------------------------------------------------------------------

export type GuardEventType = typeof GUARD_EVENTS[keyof typeof GUARD_EVENTS];

// ---------------------------------------------------------------------------
// 4. Per-event data interfaces
// ---------------------------------------------------------------------------

export interface GuardViolationData {
  readonly guardId: string;
  readonly toolName: string;
  readonly reason: string;
  readonly step: string;
  readonly timestamp: string;
}

export interface GuardOverrideData {
  readonly guardId: string;
  readonly toolName: string;
  readonly reason: string;
}

/**
 * Payload for `guard.warn` — a non-gating advisory recorded when a guard
 * chooses to inform rather than deny. Shape mirrors `GuardViolationData`
 * with two additions:
 *
 *   - `severity: 'warning'` — self-describing literal so replay tooling
 *     doesn't have to infer severity from the event type.
 *   - `code: DiagnosticCode` — typed link into the shared diagnostic
 *     registry (`workflow/diagnostics.ts`). W### codes are the expected
 *     family; the type admits the wider union so future guards can surface
 *     richer diagnostics without widening the event shape.
 */
export interface GuardWarnData {
  readonly guardId: string;
  readonly toolName: string;
  readonly reason: string;
  readonly step: string;
  readonly timestamp: string;
  readonly severity: 'warning';
  readonly code: DiagnosticCode;
}

// ---------------------------------------------------------------------------
// 5. Discriminated union for category events
// ---------------------------------------------------------------------------

export type GuardEvent =
  | { readonly type: typeof GUARD_EVENTS.VIOLATION; readonly data: GuardViolationData }
  | { readonly type: typeof GUARD_EVENTS.OVERRIDE; readonly data: GuardOverrideData }
  | { readonly type: typeof GUARD_EVENTS.WARN; readonly data: GuardWarnData };

// ---------------------------------------------------------------------------
// 6. Type guards — Set.has() on values, NEVER `in` operator on keys
// ---------------------------------------------------------------------------

export function isGuardEvent(event: { type: string }): event is GuardEvent {
  return GUARD_EVENT_TYPES.has(event.type);
}

/** Narrows a `GuardEvent` to the `guard.warn` variant. */
export function isGuardWarn(
  event: GuardEvent,
): event is { readonly type: typeof GUARD_EVENTS.WARN; readonly data: GuardWarnData } {
  return event.type === GUARD_EVENTS.WARN;
}

// ---------------------------------------------------------------------------
// 7. Factory functions
// ---------------------------------------------------------------------------

export function createGuardViolation(data: GuardViolationData): GuardEvent {
  return { type: GUARD_EVENTS.VIOLATION, data };
}

export function createGuardOverride(data: GuardOverrideData): GuardEvent {
  return { type: GUARD_EVENTS.OVERRIDE, data };
}

export function createGuardWarn(data: GuardWarnData): GuardEvent {
  return { type: GUARD_EVENTS.WARN, data };
}
