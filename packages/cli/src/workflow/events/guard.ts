/**
 * Guard event category — 2 event types recording enforcement actions.
 *
 * Events: violation, override
 */

// ---------------------------------------------------------------------------
// 1. Const object — single source of truth for event type strings
// ---------------------------------------------------------------------------

export const GUARD_EVENTS = {
  VIOLATION: 'guard.violation',
  OVERRIDE: 'guard.override',
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
}

export interface GuardOverrideData {
  readonly guardId: string;
  readonly toolName: string;
  readonly reason: string;
}

// ---------------------------------------------------------------------------
// 5. Discriminated union for category events
// ---------------------------------------------------------------------------

export type GuardEvent =
  | { readonly type: typeof GUARD_EVENTS.VIOLATION; readonly data: GuardViolationData }
  | { readonly type: typeof GUARD_EVENTS.OVERRIDE; readonly data: GuardOverrideData };

// ---------------------------------------------------------------------------
// 6. Type guard — Set.has() on values, NEVER `in` operator on keys
// ---------------------------------------------------------------------------

export function isGuardEvent(event: { type: string }): event is GuardEvent {
  return GUARD_EVENT_TYPES.has(event.type);
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
