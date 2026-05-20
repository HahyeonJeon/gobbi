# Audit-event projection inserts must share the EventStore's transaction

When adding a new audit-only event with a SQLite projection table (e.g., `prompt_patches` for `prompt.patch.applied`, `tool_calls` for `step.advancement.observed`), the projection insert MUST share the EventStore's `db.transaction(...).immediate()` envelope. NEVER open a second `Database` handle for the projection write.

---

priority: high
tech-stack: bun-sqlite, gobbi-cli
enforcement: advisory
---

**Priority:** High

**What happened:** Wave C.1's first executor pass (commit `af48e54`, session `320426b9-2fa2-46c1-8f0b-c83fdef97795`, 2026-04-26) implemented `commands/prompt/patch.ts` with the events row appended via `EventStore.append()` (which uses `bun:sqlite`'s transaction primitive internally), then opened a SECOND `Database` handle for `INSERT INTO prompt_patches` in a separate transaction. The in-code comment at `patch.ts:660-675` of that pass explicitly admitted the gap: "two separate transactions; SIGKILL between them yields events row + missing projection row." Wave evaluation flagged this as the #1 finding across 4 of 5 perspectives (Architecture F-1 conf 90, Overall F-1, Innovative-PI F-12 conf 80, Best-PI F-9). Fixed in REVISE round 1 (commit `d588349`) by adding `EventStore.appendWithProjection(input, projection)` that wraps both writes in one `db.transaction(...).immediate()` envelope. The projection callback receives the same `Database` handle so it cannot accidentally open a second connection.

**Why it happens:** The `EventStore` API is event-shaped — `append(input)` is the natural call site. The projection table is a separate concern that lives in the same DB. Without an explicit "atomic event + projection" primitive, the natural code shape opens a separate handle "just for the INSERT." The trade-off is documented in code comments and the executor felt comfortable shipping it; the wave evaluators caught it.

**User feedback:** Self-caught during 5-perspective wave evaluation. Architecture + Overall + Innovative-PI + Best-PI all flagged the same atomicity gap. The user chose "REVISE round 1: atomicity + vacuous-test (Recommended)" via AskUserQuestion. Fix shipped as `EventStore.appendWithProjection`.

**Correct approach:**

1. **Whenever a new audit-only event has a corresponding projection table** (e.g., `tool_calls`, `prompt_patches`, future audit-event-with-projection patterns), use the EventStore's `appendWithProjection(input, projection)` primitive. The projection callback runs INSIDE the event-append transaction; both writes commit or roll back atomically.

2. **NEVER open a second `bun:sqlite` `Database` handle** for the projection write. The handle parameter passed to the projection callback is the canonical writer; using a different handle escapes the transaction.

3. **If the projection write needs different ergonomics** (e.g., a prepared statement reused across many calls), prepare the statement on the same `Database` handle inside the callback — don't reach for a second handle.

4. **Architectural signal**: if you're tempted to write `new Database(<path>)` from a code path that already has access to an EventStore, stop. The EventStore is the single writer for that DB partition.

**Reference implementation:** `packages/cli/src/workflow/store.ts::appendWithProjection` — the projection callback receives `(db: Database, eventSeq: number)` and runs inside the same transaction. Used at `commands/prompt/patch.ts` for both genesis-bootstrap and operator-patch paths.

**Refs:** Wave C.1 wave-eval architecture.md F-1; PR #161 R1 fix `d588349`; precedent for the pattern at `commands/workflow/capture-planning.ts` (which uses `store.append()` directly for the audit-only `step.advancement.observed` event — that case has no projection table, hence the simpler shape).
