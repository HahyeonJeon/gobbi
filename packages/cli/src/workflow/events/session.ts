/**
 * Session event category — 1 event type tracking liveness.
 *
 * Events: heartbeat
 */

// ---------------------------------------------------------------------------
// 1. Const object — single source of truth for event type strings
// ---------------------------------------------------------------------------

export const SESSION_EVENTS = {
  HEARTBEAT: 'session.heartbeat',
} as const;

// ---------------------------------------------------------------------------
// 2. Set for type guard — values, NOT keys
// ---------------------------------------------------------------------------

const SESSION_EVENT_TYPES = new Set<string>(Object.values(SESSION_EVENTS));

// ---------------------------------------------------------------------------
// 3. Category union type — derived from the const object
// ---------------------------------------------------------------------------

export type SessionEventType = typeof SESSION_EVENTS[keyof typeof SESSION_EVENTS];

// ---------------------------------------------------------------------------
// 4. Per-event data interfaces
// ---------------------------------------------------------------------------

export interface SessionHeartbeatData {
  readonly timestamp: string;
}

// ---------------------------------------------------------------------------
// 5. Discriminated union for category events
// ---------------------------------------------------------------------------

export type SessionEvent =
  | { readonly type: typeof SESSION_EVENTS.HEARTBEAT; readonly data: SessionHeartbeatData };

// ---------------------------------------------------------------------------
// 6. Type guard — Set.has() on values, NEVER `in` operator on keys
// ---------------------------------------------------------------------------

export function isSessionEvent(event: { type: string }): event is SessionEvent {
  return SESSION_EVENT_TYPES.has(event.type);
}

// ---------------------------------------------------------------------------
// 7. Factory functions
// ---------------------------------------------------------------------------

export function createSessionHeartbeat(data: SessionHeartbeatData): SessionEvent {
  return { type: SESSION_EVENTS.HEARTBEAT, data };
}
