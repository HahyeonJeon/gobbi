# v0.5.0 Session — Data Model

Data model reference for v0.5.0. Read this when implementing or reasoning about the session directory layout, the SQLite event store, state derivation, or crash recovery. All other v0.5.0 subsystem docs reference this one for the event model.

> **Updated by PR-FIN-2a-ii (2026-04-30):** the pre-pivot per-session JSON persistence triple (state-projection cache + immutable init record + rollback snapshot) was retired. The post-pivot session directory holds the per-session `gobbi.db` (event log) + `session.json` (Memorization-time aggregate) + step-named subdirectories. Sections covering pre-pivot persistence below have been preserved with past-tense markers and breadcrumbs to the current architecture in `v050-features/gobbi-memory/README.md`.

---

## What a Session Is

A session corresponds to a single Claude Code conversation lifecycle. It begins when the SessionStart hook fires and ends when the user runs `/clear` or opens a new chat. Context compaction is mid-session — it does not end the session, it triggers a resume prompt generated from persisted state.

Sessions are stored under `.gobbi/projects/{project-name}/sessions/{session-id}/`. The session ID is a timestamp-prefixed UUID assigned at creation, chosen for human readability and filesystem sortability. The `project-name` identifies which project this session belongs to — set at session creation from the active project configured in `settings.json`.

---

## Session Directory Structure

```
.gobbi/
├── settings.json              workspace prefs — gitignored (see gobbi-config/README.md)
├── state.db                   workspace event log — gitignored (append-only SQLite)
├── gobbi.db                   workspace memories projection — git-tracked (decisions, gotchas, handoffs)
└── projects/
    └── {project-name}/
        ├── settings.json          project config — tracked, AJV-validated
        └── sessions/
            └── {session-id}/
                ├── settings.json      session config — gitignored, overrides workspace + project
                ├── gobbi.db           per-session event log — gitignored, source of truth
                ├── session.json       Memorization-time aggregate — gitignored
                ├── ideation/          step artifacts — flat directory
                ├── planning/          step artifacts — flat directory
                ├── execution/         step artifacts — flat directory
                ├── evaluation/        step artifacts — flat directory
                └── memorization/      step artifacts — flat directory
```

Note: `.gobbi/config.db` does not exist in this layout. It was a SQLite session-config store used in an earlier design iteration. `ensureSettingsCascade` deletes it on first run if found. The workspace memories projection is `gobbi.db` at the `.gobbi/` root — git-tracked, holds decisions, gotchas, design notes, and handoff rows. See `v050-features/gobbi-config/README.md` for the three-level settings cascade (workspace → project → session).

**Today** (per `init.ts`): workflow events write to a per-session `gobbi.db` at `.gobbi/projects/<name>/sessions/<id>/gobbi.db`. The workspace `state.db` at `.gobbi/state.db` currently holds only `prompt.patch.applied` events (Wave C.1). Full workspace consolidation of workflow events into a shared `state.db` is Wave A.1 work, partially shipped. The descriptions below in File Responsibilities and SQLite Event Store describe the target architecture; current path reality follows the per-session layout above.

Each file and directory has a single responsibility. The per-session `gobbi.db` is the permanent record (source of truth). `session.json` is the Memorization-time aggregate — a deterministic projection of `gobbi.db`'s event log, written at Memorization STEP_EXIT. State for live reads derives from the in-memory reducer-replay of `gobbi.db`.

---

## File Responsibilities

**`session.json`** (post-PR-FIN-2a-ii) is written as a 6-field stub at `gobbi workflow init` (sessionId / projectId / createdAt / gobbiVersion / task / schemaVersion) and rewritten with the full Memorization-time aggregate at Memorization STEP_EXIT. It is gitignored. Reads happen primarily from the live in-memory state derived by replaying `gobbi.db`; `session.json` exists as a discoverable persisted snapshot for cross-session telemetry, not as a hot-path cache.

**`state.db`** (target architecture, Wave A.1 full consolidation) — the workspace-scoped event store at `.gobbi/state.db` (gitignored). Every workflow event — step transitions, subagent completions, evaluation verdicts, user decisions, guard violations — is appended as a row. The CLI reads `state.db` to derive workflow state when generating the next prompt. The hooks write to `state.db` when events occur. Each row carries `project_id` and `session_id` columns so queries can be scoped to one project or session without scanning the full log. Today (per `init.ts`): workflow events write to the per-session `gobbi.db` instead; only `prompt.patch.applied` events currently write to `state.db`.

**`gobbi.db`** is the per-session event log — a single SQLite file at `.gobbi/projects/<name>/sessions/<id>/gobbi.db` (gitignored). It holds the append-only workflow event stream for one session. The reducer replays this log to derive live state; `session.json` is the deterministic Memorization-time projection of the same log. Workspace-level cross-session memory lives in `project.json` at `.gobbi/projects/<name>/project.json` (git-tracked). The markdown tree under `.gobbi/projects/<name>/learnings/` is the source of truth for git-tracked decisions / gotchas / handoff records.

**State derivation** (post-pivot) is replay-only. There is no on-disk projection cache for live state — every `resolveWorkflowState` call replays `gobbi.db` events through the pure reducer. SQLite-WAL atomicity on event appends provides the consistency guarantee that the prior projection-plus-backup pattern emulated. See §"State Derivation" below.

**Step directories** (`ideation/`, `planning/`, `execution/`, `evaluation/`, `memorization/`) are flat directories for step artifacts. An ideation step stores its output notes here; an execution step stores subtask results here. Flat structure is deliberate — no nesting, no hierarchy inside step directories. Note: the step was renamed from `plan/` to `planning/` in v0.5.0 to align with state-machine step identifiers.

### Artifact Filename Versioning

When feedback loops send the workflow back to a prior step, artifacts from each round are preserved through filename-based versioning. Artifact filenames include a round suffix: `execution-r1.md`, `execution-r2.md` for successive feedback rounds. Failed rounds — where a SubagentStop reports failure — get a failure marker: `delegation-fail-r2.md`. This is filename-based versioning, not subdirectory-based. The flat-directory principle is preserved: no `round-1/` or `round-2/` subdirectories exist inside step directories.

The SubagentStop capture hook derives `feedbackRound` from the per-session `gobbi.db` reducer-replay to construct the filename suffix using `feedbackRound + 1` as the round number. A round suffix of `r1` means the first pass (`feedbackRound == 0`); `r2` means the first feedback round produced a revision (`feedbackRound == 1`). The CLI's prompt compilation loads the latest round's artifacts — the highest round number — when assembling step context. Earlier rounds remain on disk for audit and for crash recovery briefings but are not included in active prompts.

---

## SQLite Event Store

> **The event store is the source of truth. Everything else is derived from it.**

SQLite with WAL mode is chosen over a pure JSONL approach for three reasons: indexed queries allow efficient filtering by event type and step without full scans; atomic writes with WAL mode survive mid-write crashes without partial records; built-in sequence numbers provide a reliable ordering guarantee. The implementation uses Bun's native `bun:sqlite` module — zero additional runtime dependencies. **Today** (per `init.ts`): each session has its own `gobbi.db` at `.gobbi/projects/<name>/sessions/<id>/gobbi.db`. **Target after Wave A.1 consolidation:** a single `state.db` at `.gobbi/state.db` serves the entire workspace; the `project_id` and `session_id` columns on each row provide the scoping that per-session files currently offer.

### Events Table

The events table has one row per event. Its columns are:

| Column | Type | Description |
|--------|------|-------------|
| `seq` | integer, primary key | Auto-increment sequence — ordering guarantee |
| `ts` | text (ISO 8601) | Timestamp of the event |
| `schema_version` | integer | Schema version at write time |
| `session_id` | text | Identifies the session this event belongs to |
| `project_id` | text | Identifies the project this event belongs to |
| `type` | text | Event type from the enum below |
| `step` | text, nullable | Workflow step this event belongs to |
| `data` | text (JSON) | Event-specific payload — structure varies by type |
| `actor` | text | What produced the event: `cli`, `hook`, `subagent` |
| `parent_seq` | integer, nullable | References the `seq` of a parent event |
| `idempotency_key` | text, unique | Deduplication key — see formula below |

The `session_id` and `project_id` columns scope every event to its origin, replacing the previous per-session-directory isolation. Queries filter on `(project_id, session_id)` for session-level replay or on `project_id` alone for project-wide aggregation.

The `idempotency_key` column prevents duplicate events from hook retries. Two formulas cover the two event categories. Tool-call events (guard violations, delegation events) use `session_id + tool_call_id + event_type` — the tool call ID uniquely identifies the action. System events (heartbeat, timeout) have no tool call context, so they use `session_id + timestamp_ms + event_type` — millisecond timestamps are sufficient because the Stop hook fires at most once per conversation turn. A UNIQUE constraint on this column means a retry that produces the same event is silently deduplicated at the storage layer. This is defensive engineering — even if Claude Code hooks do not retry today, future behavior may change. The pattern follows Kafka and EventBridge deduplication semantics: exactly-once append regardless of delivery guarantees.

Three indexes cover the common access patterns: one on `type` for queries that filter across the full event history by event category, one on `(project_id, session_id, step, type)` for queries scoped to a particular workflow step in a particular project session, and the implicit unique index on `idempotency_key` for deduplication.

### Event Type Enum

Events are grouped into nine categories that reflect the things that can happen in a session. The closed-enumeration discipline: 24 event types total (22 reducer-typed + 2 audit-only) — the wire-level set that may appear in the `events` table. The test suite asserts `ALL_EVENT_TYPES.size === 24`. Reducer-typed events flow through `appendEventAndUpdateState`; audit-only events (`step.advancement.observed`, `prompt.patch.applied`) are committed via direct `store.append()`.

**Workflow** events track the high-level session progression (9 events):

| Event | Meaning |
|-------|---------|
| `workflow.start` | Session began — first event in every session |
| `workflow.step.exit` | A workflow step completed normally — triggers transition to next step |
| `workflow.step.skip` | A workflow step was bypassed (step field indicates which) |
| `workflow.step.timeout` | Step's configured timeout exceeded — transitions to `error` state |
| `workflow.eval.decide` | The user decided whether to evaluate at a given step |
| `workflow.finish` | Handoff complete — transitions to terminal `done` |
| `workflow.abort` | User-initiated termination from `error`; transitions to `done` |
| `workflow.resume` | User resumed from last valid state; sets `fromError` if from error |
| `workflow.invalid_transition` | Reducer rejected an event; audit-emitted on rejection in fresh transaction |

**Delegation** events track subagent lifecycle (3 events):

| Event | Meaning |
|-------|---------|
| `delegation.spawn` | A subagent was launched |
| `delegation.complete` | A subagent completed and its output was captured — optional cost fields in data |
| `delegation.fail` | A subagent failed or was interrupted |

The `delegation.complete` event carries optional cost fields in its `data` payload: `tokensUsed` (billed, cache-adjusted — not raw tokens) and `cacheHitRatio`. These fields are optional because their availability depends on whether the Claude Code API exposes token data in the SubagentStop hook payload. If token data is unavailable, the CLI falls back to transcript file size as a rough proxy and records that in the `data` payload instead. First sessions (cold cache) and subsequent sessions (warm cache) produce different token counts — tracking billed tokens rather than raw tokens captures this difference.

Cost data surfaces via `gobbi workflow status` only. It must NOT appear in compiled prompts or guard conditions. This is a visibility feature, not a control mechanism — cost data informs the operator but does not alter workflow behavior.

**Artifact** events track writes to the step directories (2 events):

| Event | Meaning |
|-------|---------|
| `artifact.write` | A file was written to a step directory for the first time |
| `artifact.overwrite` | An existing artifact was replaced |

**Decision** events record choices that affect workflow direction (3 events):

| Event | Meaning |
|-------|---------|
| `decision.user` | The user made an explicit decision (approve, reject, defer) |
| `decision.eval.verdict` | An evaluator returned a verdict (pass, revise, escalate) |
| `decision.eval.skip` | Evaluation was skipped at a step |

**Guard** events record enforcement actions (3 events):

| Event | Meaning |
|-------|---------|
| `guard.violation` | A PreToolUse hook blocked a disallowed tool call |
| `guard.override` | A user explicitly overrode a guard |
| `guard.warn` | A PreToolUse warn-effect guard fired — tool call allowed but context injected |

**Verification** events record automated check results (1 event):

| Event | Meaning |
|-------|---------|
| `verification.result` | A verification command completed — exit code and summary in data |

**Session** events track liveness (1 event):

| Event | Meaning |
|-------|---------|
| `session.heartbeat` | Liveness signal — written by the Stop hook after each turn |

**Step-advancement** events track transition observability (1 event, audit-only):

| Event | Meaning |
|-------|---------|
| `step.advancement.observed` | Synthetic audit event emitted by PostToolUse when `gobbi workflow transition` runs — primes the missed-advancement safety net; committed via direct `store.append()`, NOT through the reducer |

**Prompt** events track prompt-patch operations (1 event, audit-only):

| Event | Meaning |
|-------|---------|
| `prompt.patch.applied` | A JSON Patch was applied to a prompt spec — written to workspace `state.db` by `gobbi prompt patch`; committed via direct `store.append()`, NOT through the reducer |

---

## State Derivation

> **State is a pure function of events. Given the same event log, the same state is always produced.**

Workflow state is the pure-function image of the per-session `gobbi.db` event log. It carries the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `schemaVersion` | integer | State schema version |
| `sessionId` | string | Session identifier |
| `currentStep` | string, nullable | The active workflow step, or null if none |
| `currentSubstate` | string, nullable | The active substate within the current step — only set during Ideation (`discussing` or `researching`); null for all other steps |
| `completedSteps` | array of strings | Steps that have exited normally |
| `evalConfig` | object | Per-step evaluation decisions made at workflow start |
| `activeSubagents` | array | Subagents that have spawned but not yet completed or failed |
| `artifacts` | map | Step-to-artifact-list mapping |
| `violations` | array | Guard violations recorded in this session |
| `feedbackRound` | integer | How many times the workflow has looped back |

State is produced by a typed reducer: a pure function that takes the current state and one event, and returns the next state. Replaying all events from sequence 1 through the latest produces the canonical state. The reducer is the canonical definition of what each event means.

Live state is derived on read by replaying `gobbi.db` events through the reducer; there is no on-disk projection cache (post-PR-FIN-2a-ii). At Memorization STEP_EXIT the CLI writes `session.json` as a deterministic snapshot of the same projection — readable by cross-session telemetry tools without spawning the CLI.

---

## Crash Recovery

> **No workflow event is lost. Crash recovery is a property of the storage layer, not a special case.**

SQLite with WAL mode provides atomic write semantics: a write either completes fully or does not appear. A process crash during an event append leaves `gobbi.db` (and `state.db` for workspace-scoped writes) in its pre-crash state. The event that was being written is absent — which is correct, because the action it described did not complete. Because state is replay-derived from the event log, there is no separate projection file to corrupt independently — the WAL atomicity is the only invariant the recovery path relies on.

### Resume Briefing with Pathway Differentiation

`gobbi workflow resume` synthesizes a pathway-specific briefing from the event store. The briefing content differs based on how the workflow arrived at its current state, because different causes require different recovery actions.

**Normal mid-step crash** — The workflow was in an active step when the process terminated. The briefing includes the last active step, the most recent events leading up to the crash, and the artifacts available in the step directory (using filename versioning to identify the latest round). Recovery options: retry the step from where it left off, or force-advance to memorization.

**Error state from step timeout** — A step exceeded its configured timeout and the Stop hook wrote a `workflow.step.timeout` event. The briefing includes which step timed out, the elapsed time at timeout, and what artifacts were in progress. Recovery options: retry the step with a fresh context, force-advance to memorization, or abort.

**Error state from feedback round cap** — The `feedbackRound` exceeded `maxFeedbackRounds` and the evaluation loop transitioned to `error`. The briefing includes the evaluation history across rounds — each round's verdict and findings — and the partial artifacts from the final round. Recovery options: force memorization to save partial work (`gobbi workflow resume --force-memorization`), or abort.

**Error state from invalid transition** — The reducer rejected an event because the transition was not valid from the current state. The briefing includes the rejected event, the reducer error message, and the state at the time of rejection. Recovery options: retry from the last valid state, or abort.

Each pathway's briefing is compiled into the resume prompt by the CLI. This is the same mechanism used after context compaction — compact is not crash recovery, but it uses the same rebuild path. The pathway determines what context is included, but the compilation pipeline is shared.

---

## Schema Versioning

> **Events are stored in their original schema version and never rewritten. Migrations are applied at read time, not write time.**

Every persisted JSON file includes a `schemaVersion` integer field at the top level. The events table includes a `schema_version` column on each row — this records the schema version at the time the event was written, and it is never updated.

Events are immutable once written. When the schema evolves, existing events stay in their original format on disk. Migration happens at read time: during reducer replay, each event passes through a migration pipeline keyed by its `schema_version` before the reducer processes it. The reducer always sees events in the current schema format, but the storage layer preserves originals. This is a lazy migration pattern — only the events that are actually replayed are migrated, and only in memory.

This design makes corrupted migrations recoverable. If a migration function has a bug, the original events are untouched — fix the migration, replay again, and the correct state emerges. A write-time migration that rewrites events in place would make the original data irrecoverable if the migration is wrong. The pattern follows Greg Young's event sourcing recommendation and EventStoreDB's approach to schema evolution.

Migration functions are pure transformations: given a versioned event, return the current-schema equivalent. They are keyed by version number and composed in sequence for multi-version upgrades. An event written at schema version 1 replayed in a codebase at schema version 3 applies migrations 1→2 and 2→3 in order. This pipeline is already established in the codebase in `config.ts`'s `migrateIfNeeded` function — v0.5.0 extends the same pattern to event replay.

For `session.json` (and `project.json`), the same lazy approach applies: the CLI reads `schemaVersion` when loading either file and applies migration in memory before use, without rewriting the file on disk.

The schema version is incremented whenever a breaking change is made to the event schema or the persisted aggregate (`session.json` / `project.json`) shape. Additive changes that preserve backward compatibility do not require a version increment.

---

## Session Lifecycle

**Creation** — The SessionStart hook fires when Claude Code opens a new conversation. The hook creates the session directory at `.gobbi/projects/{project-name}/sessions/{session-id}/`, writes the post-PR-FIN-2a-ii `session.json` init stub with a new session ID and the active project ID, initializes the per-session `gobbi.db` event log, and appends a `workflow.start` event. The session is active from this point.

**Active session** — Hooks append events to the per-session `gobbi.db` as the workflow proceeds. The CLI replays the event log to generate each step's prompt. Subagents write artifacts to step directories. State is replay-derived on every read; there is no on-disk projection cache.

**Context compaction** — When Claude Code compacts the conversation, it is a mid-session event, not a session boundary. The CLI detects the post-compact state, reads persisted state, and generates a resume prompt that re-orients the orchestrator. No new session is created; the existing session ID persists.

**Session end** — The session ends when the user runs `/clear` or opens a new conversation. There is no explicit cleanup event — the session directory remains on disk until the TTL cleanup runs.

**Abandoned session detection** — The Stop hook (which fires after each turn) writes a `session.heartbeat` event with a timestamp to `state.db`. When `gobbi workflow init` runs, it checks all existing session directories for sessions without a `workflow.finish` event. If a session has no heartbeat within the last 60 minutes, it is treated as abandoned. The `.claude/` write guard checks heartbeat freshness before blocking writes: if the most recent `session.heartbeat` is older than 60 minutes and no `workflow.finish` event exists, the guard treats the session as expired and allows `.claude/` writes to proceed. This prevents abandoned sessions from permanently blocking the `.claude/` write protection. A session that was interrupted by a crash or a user closing their terminal without clearing will not hold the write guard indefinitely. The 1-hour threshold replaces a 24-hour threshold — stale sessions should release the write guard quickly, not hold it for an entire day.

**Cleanup** — A background cleanup process removes sessions older than 7 days and enforces a maximum entry cap (default 50 sessions). Cleanup targets the oldest sessions first when the cap is exceeded. The cleanup configuration is stored in the user's gobbi config and can be adjusted.

---

## Boundaries

This document covers the session directory structure, the SQLite event store schema, state derivation via the reducer pattern, crash recovery, schema versioning, and the session lifecycle.

For how state transitions are guarded and what conditions govern step progression, see `v050-state-machine.md`. For how hooks write events to the store, see `v050-hooks.md`. For how the CLI reads state and generates prompts, see `v050-prompts.md` and `v050-cli.md`.
