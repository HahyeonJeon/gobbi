/**
 * Delegation event category — 3 event types tracking subagent lifecycle.
 *
 * Events: spawn, complete, fail
 */

// ---------------------------------------------------------------------------
// 1. Const object — single source of truth for event type strings
// ---------------------------------------------------------------------------

export const DELEGATION_EVENTS = {
  SPAWN: 'delegation.spawn',
  COMPLETE: 'delegation.complete',
  FAIL: 'delegation.fail',
} as const;

// ---------------------------------------------------------------------------
// 2. Set for type guard — values, NOT keys
// ---------------------------------------------------------------------------

const DELEGATION_EVENT_TYPES = new Set<string>(Object.values(DELEGATION_EVENTS));

// ---------------------------------------------------------------------------
// 3. Category union type — derived from the const object
// ---------------------------------------------------------------------------

export type DelegationEventType = typeof DELEGATION_EVENTS[keyof typeof DELEGATION_EVENTS];

// ---------------------------------------------------------------------------
// 4. Per-event data interfaces
// ---------------------------------------------------------------------------

export interface DelegationSpawnData {
  readonly agentType: string;
  readonly step: string;
  readonly subagentId: string;
  readonly timestamp: string;
}

export interface DelegationCompleteData {
  readonly subagentId: string;
  readonly artifactPath?: string | undefined;
  readonly tokensUsed?: number | undefined;
  readonly cacheHitRatio?: number | undefined;
}

export interface DelegationFailData {
  readonly subagentId: string;
  readonly reason: string;
  readonly transcriptPath?: string | undefined;
}

// ---------------------------------------------------------------------------
// 5. Discriminated union for category events
// ---------------------------------------------------------------------------

export type DelegationEvent =
  | { readonly type: typeof DELEGATION_EVENTS.SPAWN; readonly data: DelegationSpawnData }
  | { readonly type: typeof DELEGATION_EVENTS.COMPLETE; readonly data: DelegationCompleteData }
  | { readonly type: typeof DELEGATION_EVENTS.FAIL; readonly data: DelegationFailData };

// ---------------------------------------------------------------------------
// 6. Type guard — Set.has() on values, NEVER `in` operator on keys
// ---------------------------------------------------------------------------

export function isDelegationEvent(event: { type: string }): event is DelegationEvent {
  return DELEGATION_EVENT_TYPES.has(event.type);
}

// ---------------------------------------------------------------------------
// 7. Factory functions
// ---------------------------------------------------------------------------

export function createDelegationSpawn(data: DelegationSpawnData): DelegationEvent {
  return { type: DELEGATION_EVENTS.SPAWN, data };
}

export function createDelegationComplete(data: DelegationCompleteData): DelegationEvent {
  return { type: DELEGATION_EVENTS.COMPLETE, data };
}

export function createDelegationFail(data: DelegationFailData): DelegationEvent {
  return { type: DELEGATION_EVENTS.FAIL, data };
}
