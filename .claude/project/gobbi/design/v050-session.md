# v0.5.0 Session — Data Model

Data model reference for v0.5.0. Read this when implementing or reasoning about the session directory layout, the SQLite event store, state derivation, or crash recovery. All other v0.5.0 subsystem docs reference this one for the event model.

---

## What a Session Is

A session corresponds to a single Claude Code conversation lifecycle. It begins when the SessionStart hook fires and ends when the user runs `/clear` or opens a new chat. Context compaction is mid-session — it does not end the session, it triggers a resume prompt generated from persisted state.

Sessions are stored under `.gobbi/sessions/{session-id}/`. The session ID is a timestamp-prefixed UUID assigned at creation, chosen for human readability and filesystem sortability.

---

## Session Directory Structure

```
.gobbi/
└── sessions/
    └── {session-id}/
        ├── metadata.json          immutable — written once at session creation
        ├── state.json             canonical workflow state — materialized view
        ├── state.json.backup      previous state before last transition
        ├── events.jsonl           human-readable event log — mirrors gobbi.db
        ├── gobbi.db               SQLite event store — source of truth
        ├── ideation/              step artifacts — flat directory
        ├── plan/                  step artifacts — flat directory
        ├── execution/             step artifacts — flat directory
        ├── evaluation/            step artifacts — flat directory
        └── memorization/          step artifacts — flat directory
```

Each file and directory has a single responsibility. `metadata.json` and `gobbi.db` are the permanent record. `state.json` and `events.jsonl` are derived views — they can be rebuilt from `gobbi.db` at any time.

---

## File Responsibilities

**`metadata.json`** is written once when the session is created and never modified. It records the session ID, creation timestamp, the project root path, and the user configuration snapshot that was active at session start. Because it is immutable, it remains valid even if the rest of the session directory is corrupted.

**`gobbi.db`** is the authoritative event store. Every workflow event — step transitions, subagent completions, evaluation verdicts, user decisions, guard violations — is appended as a row. The CLI reads `gobbi.db` to derive workflow state when generating the next prompt. The hooks write to `gobbi.db` when events occur.

**`state.json`** is a materialized view of current workflow state, derived by reducing all events in `gobbi.db`. It is written after every event append. Reading `state.json` is faster than replaying all events on each CLI invocation, but it is a cache, not a source. If `state.json` is absent or corrupted, it is rebuilt from `gobbi.db`.

**`state.json.backup`** holds the state as it was before the most recent transition — the Terraform apply pattern. Before writing a new `state.json`, the CLI copies the current `state.json` to `state.json.backup`. If a transition corrupts `state.json`, the backup provides a known-good rollback point without requiring full event replay.

**`events.jsonl`** mirrors every event written to `gobbi.db` as a newline-delimited JSON record. It exists for human readability only — operators can `grep` or `cat` it without a SQLite client. It is not authoritative; `gobbi.db` is.

**Step directories** (`ideation/`, `plan/`, `execution/`, `evaluation/`, `memorization/`) are flat directories for step artifacts. An ideation step stores its output notes here; an execution step stores subtask results here. Flat structure is deliberate — no nesting, no hierarchy inside step directories.

---

## SQLite Event Store

> **The event store is the source of truth. Everything else is derived from it.**

SQLite with WAL mode is chosen over a pure JSONL approach for three reasons: indexed queries allow efficient filtering by event type and step without full scans; atomic writes with WAL mode survive mid-write crashes without partial records; built-in sequence numbers provide a reliable ordering guarantee. The implementation uses Bun's native `bun:sqlite` module — zero additional runtime dependencies.

### Events Table

The events table has one row per event. Its columns are:

| Column | Type | Description |
|--------|------|-------------|
| `seq` | integer, primary key | Auto-increment sequence — ordering guarantee |
| `ts` | text (ISO 8601) | Timestamp of the event |
| `schema_version` | integer | Schema version at write time |
| `type` | text | Event type from the enum below |
| `step` | text, nullable | Workflow step this event belongs to |
| `data` | text (JSON) | Event-specific payload — structure varies by type |
| `actor` | text | What produced the event: `cli`, `hook`, `subagent` |
| `parent_seq` | integer, nullable | References the `seq` of a parent event |

Two indexes cover the common access patterns: one on `type` for queries that filter across the full event history by event category, and one on `(step, type)` for queries scoped to a particular workflow step.

### Event Type Enum

Events are grouped into five categories that reflect the five things that can happen in a session.

**Workflow** events track the high-level session progression:

| Event | Meaning |
|-------|---------|
| `workflow.start` | Session began — first event in every session |
| `workflow.step.enter` | A workflow step became active |
| `workflow.step.exit` | A workflow step completed normally |
| `workflow.step.skip` | A workflow step was bypassed (step field indicates which) |
| `workflow.eval.decide` | The user decided whether to evaluate at a given step |
| `workflow.finish` | Workflow reached terminal state |

**Delegation** events track subagent lifecycle:

| Event | Meaning |
|-------|---------|
| `delegation.spawn` | A subagent was launched |
| `delegation.complete` | A subagent completed and its output was captured |
| `delegation.fail` | A subagent failed or was interrupted |

**Artifact** events track writes to the step directories:

| Event | Meaning |
|-------|---------|
| `artifact.write` | A file was written to a step directory for the first time |
| `artifact.overwrite` | An existing artifact was replaced |

**Decision** events record choices that affect workflow direction:

| Event | Meaning |
|-------|---------|
| `decision.user` | The user made an explicit decision (approve, reject, defer) |
| `decision.eval.verdict` | An evaluator returned a verdict (pass, revise, escalate) |
| `decision.eval.skip` | Evaluation was skipped at a step |

**Guard** events record enforcement actions:

| Event | Meaning |
|-------|---------|
| `guard.violation` | A PreToolUse hook blocked a disallowed tool call |
| `guard.override` | A user explicitly overrode a guard |

---

## State Derivation

> **State is a pure function of events. Given the same event log, the same state is always produced.**

`state.json` holds the materialized workflow state. Its fields are:

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

State is produced by a typed reducer: a pure function that takes the current state and one event, and returns the next state. Replaying all events from sequence 1 through the latest produces the identical state as reading `state.json`. The reducer is the canonical definition of what each event means — if the two ever disagree, the reducer wins.

The CLI writes `state.json` after each event append. On startup it reads `state.json` if present; if absent or structurally invalid, it reads `gobbi.db`, replays events through the reducer, and writes a fresh `state.json`.

---

## Crash Recovery

> **No workflow event is lost. Crash recovery is a property of the storage layer, not a special case.**

SQLite with WAL mode provides atomic write semantics: a write either completes fully or does not appear. A process crash during an event append leaves `gobbi.db` in its pre-crash state. The event that was being written is absent — which is correct, because the action it described did not complete.

`state.json.backup` handles state-file corruption without full replay. Before each state transition, the current `state.json` is copied to `state.json.backup`. If `state.json` is found to be invalid on startup, the CLI falls back to `state.json.backup`. If both are invalid, the CLI replays `gobbi.db`.

`gobbi workflow resume` is the user-facing recovery command. It reads `gobbi.db`, derives current state via the reducer, and asks the CLI to generate a resume prompt that re-orients the orchestrator to the current step and what has been completed. This is the same mechanism used after context compaction — compact is not crash recovery, but it uses the same rebuild path.

---

## Schema Versioning

Every persisted JSON file includes a `schemaVersion` integer field at the top level. The events table includes a `schema_version` column on each row.

The CLI reads `schemaVersion` when loading any JSON file. If the version is older than the current schema, a migration function is applied before the data is used. This pattern is already established in the codebase in `config.ts`'s `migrateIfNeeded` function — v0.5.0 extends it to session files.

Migration functions are pure transformations: given a versioned JSON object, return the current-schema equivalent. They are keyed by version number and composed in sequence for multi-version upgrades. A session created at schema version 1 upgraded to a codebase at schema version 3 applies migrations 1→2 and 2→3 in order.

The schema version is incremented whenever a breaking change is made to the event table schema, the `state.json` shape, or the `metadata.json` shape. Additive changes that preserve backward compatibility do not require a version increment.

---

## Session Lifecycle

**Creation** — The SessionStart hook fires when Claude Code opens a new conversation. The hook creates the session directory, writes `metadata.json` with a new session ID, and appends a `workflow.start` event to `gobbi.db`. The session is active from this point.

**Active session** — Hooks append events as the workflow proceeds. The CLI reads the event store to generate each step's prompt. Subagents write artifacts to step directories. `state.json` is updated after each event.

**Context compaction** — When Claude Code compacts the conversation, it is a mid-session event, not a session boundary. The CLI detects the post-compact state, reads persisted state, and generates a resume prompt that re-orients the orchestrator. No new session is created; the existing session ID persists.

**Session end** — The session ends when the user runs `/clear` or opens a new conversation. There is no explicit cleanup event — the session directory remains on disk until the TTL cleanup runs.

**Abandoned session detection** — When `gobbi workflow init` runs, it checks all existing session directories for sessions without a `workflow.finish` event. If a session has been inactive for more than 24 hours — meaning no events have been appended in the last 24 hours — it is marked as abandoned. The `.claude/` write guard checks session freshness before blocking writes: if the session's last event is older than 24 hours and no `workflow.finish` event exists, the guard treats the session as expired and allows `.claude/` writes to proceed. This prevents abandoned sessions from permanently blocking the `.claude/` write protection. A session that was interrupted by a crash or a user closing their terminal without clearing will not hold the write guard indefinitely.

**Cleanup** — A background cleanup process removes sessions older than 7 days and enforces a maximum entry cap (default 50 sessions). Cleanup targets the oldest sessions first when the cap is exceeded. The cleanup configuration is stored in the user's gobbi config and can be adjusted.

---

## Boundaries

This document covers the session directory structure, the SQLite event store schema, state derivation via the reducer pattern, crash recovery, schema versioning, and the session lifecycle.

For how state transitions are guarded and what conditions govern step progression, see `v050-state-machine.md`. For how hooks write events to the store, see `v050-hooks.md`. For how the CLI reads state and generates prompts, see `v050-prompts.md` and `v050-cli.md`.
