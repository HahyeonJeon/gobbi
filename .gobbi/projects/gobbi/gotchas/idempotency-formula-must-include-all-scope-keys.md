# Audit-event idempotency formulas must include every scope key whose collision is a bug

When defining an idempotency formula for an audit-only event (any new `IdempotencyKind` variant or reuse of an existing kind), include every scope key whose collision would silently merge distinct events. For content-addressed events, that means `${type}:${scope1}:${scope2}:...:${contentId}` — not just `${type}:${contentId}`.

---

priority: high
tech-stack: bun-sqlite, gobbi-cli
enforcement: advisory
---

**Priority:** High

**What happened:** Wave C.1's first executor pass (commit `1153282`, session `320426b9-2fa2-46c1-8f0b-c83fdef97795`, 2026-04-26) added a new `'content'` `IdempotencyKind` variant to `store.ts:50-94` with formula `${type}:${contentId}` where `contentId = patchId` (the sha256 of the canonicalized RFC 6902 patch JSON). This dedupes the same patch across sessions correctly. But it ALSO dedupes byte-identical RFC 6902 op arrays applied to two DIFFERENT prompts — e.g., the same `[{op:'replace',path:'/version',value:1}]` patch applied to `ideation.spec.json` and `planning.spec.json` collapses to one event row. Architecture wave-eval F-4 (conf 65) flagged this. Fixed in R1 (commit `1220df3`) by setting `contentId = ${promptId}:${patchId}` so the prompt-id is part of the dedup key.

**Why it happens:** Content-addressed identifiers feel like complete identity — "this patch is THIS patch, regardless of where it's applied." But for events, identity is the (event-type, scope, content) tuple, not just content. Skipping scope keys that "feel obvious" silently merges distinct events.

**User feedback:** Self-caught during 5-perspective wave evaluation. Architecture-perspective evaluator built a counter-example: same op array on two different prompts, expected two events, actual one. Fix landed in R1.

**Correct approach:**

1. **List every scope key the event has**: session id, project id, prompt id, step id, etc. — anything that distinguishes "two different things happened" from "the same thing happened twice."

2. **Decide which keys are part of identity vs which are decoration**: e.g., for `prompt.patch.applied`, `(promptId, patchId)` is identity (cross-session dedup is intentional); `sessionId` is decoration (don't include — same patch from two sessions should dedupe). For `tool.call.observed`, `(sessionId, toolCallId)` is identity (per-session per-tool-call); cross-session dedup is wrong (different sessions can legitimately call the same tool).

3. **Encode the identity tuple in the idempotency formula**, not just the obvious content hash. The formula's job is to make `(formula(event_a) === formula(event_b)) ⟺ (event_a and event_b are the same event)`.

4. **Test with a counter-example**: write a test that emits two events with byte-identical contentId but different scope-key values. Assert TWO event rows. If the test passes with ONE row, the formula is missing a key.

**Reference implementation:** `commands/prompt/patch.ts` — `eventContentId = ${promptId}:${patchId}`. Test at `workflow/__tests__/store.test.ts` `content idempotency key` describe block (cross-prompt distinctness + cross-session same-prompt dedup).

**Refs:** Wave C.1 wave-eval architecture.md F-4; PR #161 R1 fix `1220df3`; `IdempotencyKind` discriminated union at `store.ts:50-94` (the canonical reference for adding new kinds).
