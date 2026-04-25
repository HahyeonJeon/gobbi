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
  /**
   * Claude Code harness version captured from `process.env.CLAUDE_CODE_VERSION`
   * at spawn time. Enables cross-version debugging — a given trace can be
   * attributed to the harness that produced it. Optional so v4 events that
   * never populated this field continue to round-trip cleanly; the field is
   * also additive, so no schema version bump is required (mirrors the
   * `DelegationCompleteData.sizeProxyBytes` pattern landed by PR E). Emitters
   * MUST omit the field entirely when the env var is unset or empty rather
   * than writing an empty string — keeps events clean. Added by v0.5.0
   * post-Phase-2 velocity issue #92.
   */
  readonly claudeCodeVersion?: string | undefined;
}

export interface DelegationCompleteData {
  readonly subagentId: string;
  readonly artifactPath?: string | undefined;
  readonly tokensUsed?: number | undefined;
  readonly cacheHitRatio?: number | undefined;
  /**
   * Size-proxy byte count for the subagent's final response, consumed as a
   * fallback cost-estimation input when `tokensUsed` is absent (older
   * transcripts, synthetic lines, or future shapes that omit the usage
   * block). Optional so v3 events that never populated this field continue
   * to round-trip through v4 cleanly. Added by v0.5.0 Phase 2 PR E (E.2).
   */
  readonly sizeProxyBytes?: number | undefined;
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
