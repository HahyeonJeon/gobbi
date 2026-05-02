---
priority: medium
tech-stack: bun, sqlite, typescript
enforcement: advisory
---

### Per-session EventStore tests must seed rows with `project_id = NULL`

**Priority:** Medium

**What happened:** When constructing `EventStore` against a per-session DB path (`<sessionDir>/gobbi.db`), the constructor at `packages/cli/src/workflow/store.ts:369-370` derives `(sessionId, projectId)` from the path. The path-derived `projectId` is `NULL` (not the project name). Test fixtures that seed events with `project_id = 'gobbi'` (or any non-null string) silently fail every read because the partition WHERE clause is `session_id IS $session_id AND project_id IS $project_id`. `eventCount()` returns 0; `replayAll()` returns []; backfill pre-flight C trips on what looks like a populated DB.

**User feedback:** Discovered during T5 of PR-CFM-B execution while wiring `gobbi memory backfill` test fixtures. The `BACKFILL_NO_EVENTS` pre-flight kept firing against a fixture that demonstrably had inserted rows.

**Correct approach:** When seeding per-session-DB test fixtures, set `project_id = NULL` explicitly (not `'gobbi'`, not the project basename). The workspace `state.db` is a different shape — it carries explicit non-null `project_id`. Per-session and workspace seeds are NOT interchangeable.

**Why:** The path-derivation fallback at `store.ts:369-370` is documented in gotcha `state-db-redesign.md` §2 — it works only for per-session DBs. Workspace mode requires explicit constructor params. Tests that mix the two seed shapes produce `eventCount() === 0` despite the DB containing rows.
