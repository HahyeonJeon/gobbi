/**
 * Prompt (audit-only) event category — 1 event type.
 *
 * Events: `prompt.patch.applied`
 *
 * Introduced by Wave C.1.3 (issue #156) to back the prompts-as-data
 * feature described in `.gobbi/projects/gobbi/design/v050-features/prompts-as-data.md`
 * and the synthesis at `sessions/<sid>/ideation/ideation.md` §6. The
 * `gobbi prompt patch` operator command (Wave C.1.6) commits one of
 * these events per applied RFC 6902 patch on a per-step `spec.json`.
 *
 * The full RFC 6902 ops array is NOT in the event payload — it lives in
 * the JSONL evolution log line (`prompt-evolution/<prompt-id>.jsonl`)
 * and the `prompt_patches.patch_json` column. The event records the
 * *fact* (one patch was applied, with these audit hints); the projection
 * holds the *content*. Synthesis §6 calls this out explicitly: keeping
 * the ops out of the events table preserves a small `data` column for
 * the audit log while leaving the queryable projection unbounded.
 *
 * ---
 *
 * # Architecture invariant — bypass the reducer
 *
 * `prompt.patch.applied` is intentionally **not** a member of the
 * reducer-typed `Event` union. It is an audit-only / observability-only
 * event: state derives nothing from it (the reducer state has no
 * spec-content fields), no transition fires from it, and the reducer
 * must never see it. Per the same fence applied to
 * `step.advancement.observed` (see `events/step-advancement.ts:14-41`)
 * and the gotcha at `state-db-redesign.md` §1, routing this event
 * through `appendEventAndUpdateState` would silently fail end-to-end:
 *
 *   1. `reducer.ts` uses `assertNever` to enforce exhaustiveness over
 *      the seven reducer-typed categories. An unknown event reaches the
 *      `assertNever` branch and throws a plain `Error`.
 *   2. `engine.ts:~232`'s audit-on-rejection branch only fires when the
 *      thrown value is a `ReducerRejectionError` — a plain `Error` is
 *      treated as a filesystem-style failure and is NOT audited.
 *   3. The PostToolUse capture path wraps the engine call in a
 *      best-effort try/catch that swallows the throw, so the event
 *      quietly disappears.
 *
 * The fix locked at design time: **commit via `store.append()` directly,
 * outside any `appendEventAndUpdateState` call**. The reducer stays
 * pure; this event never enters its switch. The `gobbi prompt patch`
 * command implementer MUST call `store.append()` directly. The type
 * system enforces the bypass by giving `PromptEvent` a separate,
 * non-`Event`-assignable type.
 *
 * The runtime fence at `reducer.ts:691` extends to cover this category
 * with a `isPromptPatchAppliedEvent` check: a serialise/deserialise
 * roundtrip (e.g. event replay from the wire) erases the type-level
 * discriminator and could otherwise drive an audit event into
 * `assertNever`'s plain-`Error` throw.
 *
 * ---
 *
 * # Idempotency formula — `'content'` kind
 *
 * Wave C.1.3 introduces a new `IdempotencyKind` variant `'content'`
 * (extends the discriminated union at `store.ts:50-94`) with the formula
 * `${type}:${contentId}`. The `contentId` is the `patchId` (sha256 of
 * canonicalized `patch_json`). No `sessionId` participates in the
 * formula — same patch content across two sessions dedupes at the
 * events table via the existing `ON CONFLICT(idempotency_key) DO
 * NOTHING` gate (`store.ts:148-152`). Synthesis lock 8.
 */

// ---------------------------------------------------------------------------
// 1. Const object — single source of truth for event type strings
// ---------------------------------------------------------------------------

export const PROMPT_EVENTS = {
  PATCH_APPLIED: 'prompt.patch.applied',
} as const;

// ---------------------------------------------------------------------------
// 2. Set for type guard — values, NOT keys
// ---------------------------------------------------------------------------

const PROMPT_EVENT_TYPES = new Set<string>(Object.values(PROMPT_EVENTS));

// ---------------------------------------------------------------------------
// 3. Category union type — derived from the const object
// ---------------------------------------------------------------------------

export type PromptEventType =
  typeof PROMPT_EVENTS[keyof typeof PROMPT_EVENTS];

// ---------------------------------------------------------------------------
// 4. Per-event data interfaces
// ---------------------------------------------------------------------------

/**
 * Closed prompt-id set — matches the user-locked enumeration in
 * `prompts-as-data.md` user lock 2 and the SQLite CHECK constraint on
 * `prompt_patches.prompt_id` (`migrations.ts:SQL_CREATE_PROMPT_PATCHES`).
 * Re-exported here so callers (CLI commands, tests) narrow against a
 * single source of truth rather than restating the literal union.
 */
export type PromptId =
  | 'ideation'
  | 'planning'
  | 'execution'
  | 'evaluation'
  | 'memorization'
  | 'handoff';

/**
 * Payload for `prompt.patch.applied`.
 *
 * - `promptId` — closed prompt-id set member (see {@link PromptId}).
 * - `patchId` — sha256 of canonicalized `patch_json`. Reused as the
 *   `contentId` in the `'content'` IdempotencyKind formula at
 *   `store.ts:50-94`. Doubles as the cross-session dedup key on the
 *   `prompt_patches.UNIQUE(prompt_id, patch_id)` index.
 * - `parentPatchId` — prior patch's `patchId` in the chain, or `null`
 *   for the genesis row. The JSONL line at
 *   `prompt-evolution/<prompt-id>.jsonl` carries the same field; the
 *   SQLite row's `parent_seq` is canonical (Architecture F-12 fix per
 *   ideation §4).
 * - `preHash` — sha256 of canonicalized `spec.json` BEFORE this patch
 *   applied. Operators reading the audit trail can verify content
 *   addressing end-to-end.
 * - `postHash` — sha256 of canonicalized `spec.json` AFTER this patch
 *   applied. The replay-equivalence CI test at C.1.6 folds the JSONL
 *   chain and compares its final post-hash to `sha256(canonicalize(<on-disk
 *   spec.json>))`.
 * - `opCount` — RFC 6902 ops count after the C.1.6 test-op merge step.
 *   Audit hint only — full ops live in the JSONL line and
 *   `patch_json` column.
 * - `schemaId` — `STEP_SPEC_SCHEMA_ID` at apply time. Non-empty
 *   string. Pinning the schema id in every audit row makes a future
 *   v2 schema migration auditable: every patch row before the cutover
 *   advertises v1.
 * - `appliedBy` — locked to `'operator'` per user lock 3. Future
 *   widening (agent-proposed patches) requires a new variant + a v8
 *   schema migration.
 */
export interface PromptPatchAppliedData {
  readonly promptId: PromptId;
  readonly patchId: string;
  readonly parentPatchId: string | null;
  readonly preHash: string;
  readonly postHash: string;
  readonly opCount: number;
  readonly schemaId: string;
  readonly appliedBy: 'operator';
}

// ---------------------------------------------------------------------------
// 5. Discriminated union for category events
// ---------------------------------------------------------------------------

/**
 * Audit-only event variant. Deliberately NOT a member of the top-level
 * `Event` union exported from `events/index.ts` — the reducer's
 * exhaustive switch must never see this type.
 *
 * Hook implementers narrow with {@link isPromptPatchAppliedEvent} when
 * they need to type-guard a generic `{ type: string }` shape, then call
 * `store.append()` directly. There is no reducer branch and no engine
 * helper; that asymmetry is the architectural fence.
 */
export type PromptEvent = {
  readonly type: typeof PROMPT_EVENTS.PATCH_APPLIED;
  readonly data: PromptPatchAppliedData;
};

// ---------------------------------------------------------------------------
// 6. Type guards — Set.has() on values, NEVER `in` operator on keys
// ---------------------------------------------------------------------------

export function isPromptPatchAppliedEvent(
  event: { type: string },
): event is PromptEvent {
  return PROMPT_EVENT_TYPES.has(event.type);
}

// ---------------------------------------------------------------------------
// 7. Factory functions
// ---------------------------------------------------------------------------

export function createPromptPatchApplied(
  data: PromptPatchAppliedData,
): PromptEvent {
  return { type: PROMPT_EVENTS.PATCH_APPLIED, data };
}
