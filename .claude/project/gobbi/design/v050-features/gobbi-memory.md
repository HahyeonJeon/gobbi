# `.gobbi/` Long-Term Memory

Feature description for gobbi's cross-session persistence model. Read this to understand how sessions resume after crashes, why gotchas are the highest-value knowledge in the system, and how the two memory tiers relate.

---

> **A correction not recorded is a correction repeated. Every session that ends without memorization restarts from zero.**

Gobbi's long-term memory spans two tiers with complementary roles.

The **runtime tier** (`.gobbi/sessions/{id}/`) is where active workflow state lives. The SQLite event store (`gobbi.db`) records every step transition, subagent completion, evaluation verdict, and guard violation as it happens. `state.json` is a materialized view derived from the event log — fast to read, rebuildable from the store if lost. After a crash, context compaction, or mid-session interruption, `gobbi workflow resume` replays the event log through the reducer and generates a pathway-specific briefing that reorients the orchestrator to exactly where the session was interrupted. No workflow progress is lost; the event store survives anything that does not corrupt the SQLite file itself.

The **static-knowledge tier** (`.claude/skills/_gotcha/`) is where learned corrections become permanent. During an active session, gotchas are written to `.gobbi/project/gotchas/` — in the runtime layer, which does not trigger context reload. After the session ends, `gobbi gotcha promote` graduates those entries into `.claude/skills/_gotcha/`, making them available to every future session from the first prompt. Promotion happens outside active sessions so it does not stall the workflow.

**Why gotchas are the highest-leverage knowledge:** Gotchas are not documentation — they are corrections. Each entry exists because an agent made a specific mistake, a user identified it, and the right behavior was established. They short-circuit investigation: the next agent reads the gotcha and skips straight to the correct approach without needing to rediscover the failure. Per-project gotchas live in `.gobbi/project/gotchas/`; cross-project gotchas live in `_gotcha/`. The `_gotcha` skill teaches agents how to check before acting and how to record after being corrected.

The Memorization step at the end of every workflow cycle is the mechanism that makes this system work over time: read the conversation log, extract decisions, open questions, and gotchas, write them where the next session can find them.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `../v050-session.md` | SQLite event store, session directory, crash recovery, state derivation |
| `../../skills/_gotcha/SKILL.md` | Gotcha recording system, check-before-acting discipline, project vs skill gotchas |
