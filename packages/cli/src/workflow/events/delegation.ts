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
  /**
   * The Claude Code PreToolUse `tool_use_id` (a.k.a. `tool_call_id`) of the
   * Agent tool call that initiated this subagent. Captured at spawn time by
   * the PreToolUse guard (see `commands/workflow/guard.ts`) so that the
   * subsequent `delegation.complete` / `delegation.fail` events landed by
   * `commands/workflow/capture-subagent.ts` can be linked back to their
   * originating spawn precisely — even when multiple subagents are spawned in
   * parallel from a single orchestrator turn. Without this field, parent-seq
   * lookup must fall back to the `last('delegation.spawn')` heuristic, which
   * misattributes parallel-subagent linkage. Optional so older events that
   * predate the spawn-emitter (PR-FIN-2a-ii T-2a.8.0) continue to round-trip
   * cleanly. Additive — mirrors `claudeCodeVersion` precedent.
   */
  readonly tool_call_id?: string | undefined;
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
  /**
   * SHA-256 hex digest of the subagent's transcript file at capture time.
   * Lets downstream consumers (memory aggregation, audit replay) detect
   * whether the file on disk has been mutated or rewritten since the
   * SubagentStop hook fired — the digest is recorded once at capture and
   * never updated. Computed via `node:crypto.createHash('sha256')` over the
   * full file bytes when `agent_transcript_path` is set and readable; the
   * field is omitted when the transcript is absent or unreadable. Optional
   * so events written before this field landed continue to round-trip
   * cleanly. Additive — mirrors `sizeProxyBytes` precedent. Added by
   * PR-FIN-2a-ii T-2a.8.0.
   */
  readonly transcriptSha256?: string | undefined;
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
