# v0.5.0 CLI — Integration Point

CLI architecture reference for v0.5.0. Read this when implementing or reasoning about command structure, runtime choices, distribution, or the relationship between the plugin and the CLI. This document treats the CLI as a container — how it binds the event store, state machine, step specs, predicate registry, and hook system into a single executable. For the internals of each subsystem, see the respective doc.

---

## The CLI's Role

The CLI is where all v0.5.0 subsystems converge. It is the only component that has read access to every part of the system simultaneously: workflow state from the event store, domain knowledge from `.claude/skills/`, step specs with their predicate references, and project configuration.

> **The CLI is the prompt factory, the guard enforcer, and the predicate registry owner. Hooks are thin wrappers that delegate to it.**

Hook scripts registered in `hooks/hooks.json` contain no logic. Each hook reads stdin and calls the appropriate `gobbi workflow *` command. Guard logic, predicate evaluation, event schemas, and capture behavior all live in the CLI — not in the hooks. Updating workflow behavior means updating the CLI package, not touching the hook scripts.

---

## Predicate Registry

> **All guard conditions and transition predicates resolve through a single typed registry owned by the CLI.**

At startup, the CLI loads all step specs from `packages/cli/src/specs/` and extracts every predicate name referenced in `transitions` and guard `condition` fields. Each predicate name maps to a TypeScript function in the registry — a pure function that receives the current workflow state and relevant arguments and returns a boolean.

The registry is the single mapping between spec-level names (strings in JSON data) and TypeScript implementations. Step specs remain pure JSON — they declare which predicate governs a transition or guard, but never contain inline logic. The CLI resolves names to functions at compilation time.

`gobbi workflow validate` checks that every predicate name referenced in any spec or guard has a registered implementation. A misspelled predicate name, a reference to a removed predicate, or an unimplemented predicate is caught at validation time — not at runtime when a guard fires or a transition attempts to evaluate.

Adding a new condition means adding a TypeScript function to the registry and referencing its name from the spec. No expression parser, no custom operator protocol. Cross-reference `v050-state-machine.md` for the predicate model definition, guard specification format, and the task-size validation predicate.

---

## Runtime: Bun + TypeScript

V0.5.0 migrates the CLI from Node.js to Bun. The current `package.json` declares `"engines": { "node": ">=18.0.0" }` and uses `tsc` for compilation. V0.5.0 replaces both.

> **Bun matches Claude Code's own runtime, eliminates the build step, and brings native SQLite — three wins with one dependency choice.**

**Native TypeScript execution** — Bun runs `.ts` files directly. No `tsc` build step during development. The build step for distribution still exists (`bun build`), but the development loop no longer requires it.

**`bun:sqlite`** — The event store in `v050-session.md` requires SQLite with WAL mode and atomic write semantics. `bun:sqlite` is native to the runtime — zero additional dependencies, no `better-sqlite3` binding to compile, and significantly faster than equivalent Node.js SQLite solutions. This is the primary technical reason for the Bun migration: the event store architecture depends on SQLite, and Bun makes SQLite a first-class runtime capability.

**`bun:test`** — Jest-compatible test runner built into the runtime. Zero configuration, built-in mocking, snapshot testing support. The testing strategy for step spec compilation relies on snapshots to catch unintended changes — `bun:test` supports this natively.

**File I/O** — `Bun.file()` and `Bun.write()` replace `node:fs/promises` for the common case. State file writes use the temp+rename pattern for atomic persistence.

**Startup time** — Hook scripts are invoked on every tool call. Guard evaluation must complete in single-digit milliseconds. Bun's startup time makes per-call invocation practical in a way that a Node.js + tsc compiled CLI struggles to match.

The `package.json` `name` (`@gobbitools/cli`) and `bin` configuration remain unchanged. The migration is internal — callers invoke `gobbi` the same way.

---

## Command Structure

The CLI expands from its current eight-command surface to add a `workflow` subcommand group. All new commands live under `gobbi workflow`. Existing commands are unchanged.

### New: `gobbi workflow` commands

**`gobbi workflow init`** — Creates the session directory under `.gobbi/projects/<name>/sessions/{session-id}/`, writes the post-PR-FIN-2a-ii `session.json` init stub (sessionId / projectId / createdAt / gobbiVersion / task), initializes the per-session `gobbi.db` with the events table schema, and appends the first `workflow.start` event. Called by the SessionStart hook. Idempotent — if the session directory already exists, it verifies structure and exits cleanly.

During initialization, `gobbi workflow init` asks the user four setup questions: the task description, whether to evaluate after Ideation, whether to evaluate after Plan, and any additional context. The evaluation answers are stored immediately as a `workflow.eval.decide` event in `gobbi.db`; the reducer surfaces them as `evalConfig` on subsequent state-derivation reads. The compiled prompt generated for the first step includes the eval decision in its session section.

**`gobbi workflow next`** — The core command. Replays the per-session `gobbi.db` event log through the reducer to derive state, determines the active step, selects the appropriate step spec, loads relevant skills and artifacts, evaluates token budget, and writes the compiled prompt to stdout. This is what the orchestrator receives at the start of each step.

When the session is in `error` state, `gobbi workflow next` generates a pathway-specific error prompt instead of the normal step prompt. The error prompt is selected based on which pathway caused the error entry. Four pathways produce distinct prompts:

- **Normal crash** — the workflow was active when the process terminated. The prompt includes the last active step, recent events leading up to the crash, and available artifacts in the step directory.
- **Timeout error** — a step exceeded its configured timeout. The prompt includes which step timed out, elapsed time at timeout, and what artifacts were in progress.
- **Feedback cap error** — `feedbackRound` exceeded `maxFeedbackRounds`. The prompt includes the evaluation history across rounds — each round's verdict and findings — and partial artifacts from the final round.
- **Invalid transition error** — the reducer rejected an event. The prompt includes the rejected event, the reducer error message, and the state at rejection time.

Each error prompt includes the available recovery options: retry from the errored step, force-advance to memorization (`--force-memorization`), or abort. The prompt also includes available artifacts so the orchestrator or user can assess what was produced before the error. Cross-reference `v050-session.md` for pathway definitions and `v050-prompts.md` for resume prompt compilation.

**`gobbi workflow transition <event>`** — Advances the state machine by appending a typed event to the per-session `gobbi.db` event log. Validates that the event produces a valid transition from the current step before writing. Returns the new state summary on stdout. Invalid transitions produce an error with the reason.

The orchestrator calls this command via Bash, instructed by the step spec. Each step's compiled prompt ends with an explicit instruction: when this step is complete, run `gobbi workflow transition COMPLETE`. The CLI validates the transition against the state machine and advances state. The Stop hook can also trigger implicit transitions when it detects a completion signal that the orchestrator did not explicitly transition.

**`gobbi workflow guard`** — Invoked by the PreToolUse hook. Reads the full hook stdin payload, loads the active state via `gobbi.db` reducer-replay, evaluates guard conditions by resolving predicate names through the registry, and writes the appropriate JSON response to stdout. If the call violates a guard, appends a `guard.violation` event and returns `permissionDecision: "deny"`. If the call is valid, returns `permissionDecision: "allow"` or defers. Guard evaluation is the hottest code path — it must complete in single-digit milliseconds.

**`gobbi workflow capture-subagent`** — Invoked by the SubagentStop hook. Reads the hook stdin payload, extracts the subagent's transcript from `agent_transcript_path`, writes an artifact to the current step directory, and appends a `delegation.complete` event linked to the originating `delegation.spawn` event via `parent_seq`. This replaces manual `gobbi note collect`.

**`gobbi workflow capture-planning`** — Invoked by the PostToolUse hook on ExitPlanMode. Reads the plan content from the hook stdin payload, writes a plan artifact to `.gobbi/projects/<name>/sessions/{id}/planning/`, and appends an `artifact.write` event. Capture is automatic — the orchestrator does not need to explicitly save the plan.

**`gobbi workflow stop`** — Invoked by the Stop hook. Handles three responsibilities: heartbeat writing, timeout detection, and state flush for pending changes. Respects `stop_hook_active` — exits immediately if true to prevent reentrance loops. Cross-reference `v050-hooks.md` for the full Stop hook behavior.

**`gobbi workflow resume`** — User-facing recovery command. Replays the per-session `gobbi.db` through the reducer, derives the current state, and outputs a resume prompt that re-orients the orchestrator to the current step. Used after crash recovery and after context compaction — both cases use the same rebuild path.

**`gobbi workflow status`** — Replays `gobbi.db` through the reducer and reads the workspace `state.db` for cross-session metadata; prints the current workflow step, completed steps, active subagent count, evaluation configuration, feedback round count, and cost summary. Human-readable output.

The cost section displays: cumulative billed tokens (cache-adjusted) across all delegations, per-step token breakdown, and cache hit ratio. Cost data is derived from `delegation.complete` events in the event store (see `v050-session.md` for cost field definitions). When token data was unavailable for some delegations and the CLI fell back to file-size proxy, the output annotates which entries are estimates versus actual measurements. Cost surfaces ONLY in `gobbi workflow status` — it must NOT appear in compiled prompts or guard conditions.

**`gobbi workflow validate`** — Performs static analysis of the spec library and predicate registry. Checks that every predicate name referenced in specs and guards has a registered TypeScript implementation. Also checks the workflow graph for dead steps, cycles, and broken references. This is a build-time check — it catches structural errors before they reach runtime.

**`gobbi workflow run --task "<text>"`** — (NEW in Wave E.2 — does not exist today.) Outer-mode driver: reads `state.db`, compiles the step prompt, spawns `claude -p '<prompt>'` as a child process, observes the child exit, re-resolves state, and loops until `currentStep ∈ {'done','error'}`. On footer-miss (child exits without calling `gobbi workflow transition`), re-spawns with a reminder block. Enables headless/CI execution of the full workflow without interactive Claude Code. See `orchestration/README.md` § 7 for the design contract.

### New: `gobbi session` commands

**`gobbi session events`** — Formats the event log from `state.db` for human consumption. Provides a readable audit trail without requiring a SQLite client.

### New: `gobbi gotcha` commands

**`gobbi gotcha promote`** — Moves gotchas from `.gobbi/projects/<name>/learnings/gotchas/` to the permanent store in `.claude/skills/_gotcha/`. Runs outside active sessions only — checks that no session is active before proceeding. The promotion turns mid-session learnings into permanent `.claude/` knowledge without causing context reload during the session.

### New: installation and project management commands

**`gobbi install`** — Installs or upgrades the gobbi skill/agent/rules bundle into the active project's `.gobbi/projects/<name>/` directory. On first install, seeds the three-tier content directories; with `--upgrade`, performs a three-way merge against the previous installed version. The active project resolves from `basename(repoRoot)` plus the `--project` flag (the legacy `gobbi project switch` command was removed in v0.5.0 PR-FIN-2).

**`gobbi project list`** — Lists all projects registered under `.gobbi/projects/`.

**`gobbi project create <name>`** — Creates a new project directory under `.gobbi/projects/<name>/` and seeds it from the gobbi templates.

**`gobbi project switch <name>`** — *Removed in v0.5.0 PR-FIN-2.* Project resolution is now `basename(repoRoot)` plus the `--project` flag on each `gobbi workflow` / `gobbi config` invocation. There is no persistent "active project" state to switch between.

### New: `gobbi maintenance` commands

**`gobbi maintenance migrate-state-db`** — Ships in PR #147 (Wave A.1). Reverses Wave A.1's DB rename: moves the per-session `gobbi.db` file to the workspace-scoped `state.db` path at `.gobbi/state.db`. Run this after upgrading to v0.5.0 to migrate existing sessions. The companion `gobbi maintenance restore-state-db` reverts in one commit for reversibility.

PR-CFM-B (#190) adds a downgrade preflight to this command. Before any schema writes the migration queries `MAX(schema_version) FROM events` and refuses with exit 1 + `code: 'DOWNGRADE_BLOCKED'` when the live row max exceeds the requested target. Two new flags govern target selection and override:

- `--target-version <n>` — pin the schema target. Defaults to the current workspace schema version. Must be a positive integer. Forward migrations and re-runs against an already-current DB are no-ops by design.
- `--force` — bypass the command-level preflight only. The per-row safety net at `migrations.ts::migrateEvent` still throws when a vN reader visits a v(N+1) row at runtime, so `--force` does not actually downgrade row data — it merely opens the gate. Stderr emits a warning when the bypass fires. Operators who genuinely need to roll back should use `gobbi maintenance restore-state-db --backup <path>` instead, which reverts the entire `.db` file from a pre-existing backup.

The error envelope under `--json` for `DOWNGRADE_BLOCKED` carries `liveMaxVersion` and `targetVersion` so operators can grep the threshold. The 4-member error union is `'DB_MISSING' | 'PARSE_ARGS' | 'DOWNGRADE_BLOCKED' | 'MIGRATE_FAILED'`.

**`gobbi maintenance restore-state-db`** — PR-CFM-B (#169 narrow). Reverts a `state.db` file from an operator-created backup. The command is a pure file-level rename — it does NOT data-level downgrade individual rows, and its companion `migrate-state-db` does NOT auto-create the `.bak` file. Operators take backups manually with `cp` (the `--help` output shows the exact incantation). The default target is `<repoRoot>/.gobbi/state.db`; `--db <path>` overrides.

When the target file already exists the restore refuses by default. Re-run with `--force` to rename the existing target to `<target>.pre-restore.<unix-ts>` before swapping in the backup — the pre-restore sibling is renamed, never deleted, following the Postgres data-file precedent. The atomic same-filesystem path uses `rename`; cross-filesystem moves (EXDEV) fall back to `copyFile` + `fsync` + `unlink` so the backup is consumed by the restore in both paths. Operators who want to keep the backup beyond the restore should `cp` it before invoking the command.

The 4-member error union is `'BACKUP_MISSING' | 'TARGET_EXISTS' | 'RESTORE_FAILED' | 'PARSE_ARGS'`. The command does NOT detect open `EventStore` handles via `PRAGMA database_list`; operators must stop active gobbi sessions before invoking restore so a concurrent SQLite handle does not silently follow the renamed-aside file. The orchestration design contract `SC-ORCH-21` is partially fulfilled by this command — see `design/v050-features/gobbi-memory/scenarios.md` for the deviation note covering the `.bak`-on-migrate gap that PR-CFM-B does not close.

**`gobbi maintenance wipe-legacy-sessions`** — Removes stale session directories under the pre-multi-project `.gobbi/sessions/` layout (the literal directory name predates multi-project support — this is the command's actual target, not a drift residue). Safe to run after migration; sessions under `.gobbi/projects/<name>/sessions/` are never touched.

### New: `gobbi memory` commands

PR-CFM-B (#236) adds an operator-facing namespace for per-session memory inspection and crash recovery. The dispatcher mirrors `gobbi maintenance`'s shape — each subcommand is registered in a `MEMORY_COMMANDS` array and routed via dynamic import. The two subcommands form the per-session counterpart to PR-CFM-C's workspace-wide `gobbi maintenance verify-state-projections` sweep.

**`gobbi memory check <session-id>`** — Inspect one session for divergence between the workspace `state.db` event store and the per-session projection in `project.json`. The mechanism is `memoryProjectionDiff()` from `lib/memory-projection-diff.ts`: it walks every event row, replays state through the production reducer per session, and compares the derived state against `project.json.sessions[sessionId]` across five divergence kinds — `row-missing` (project entry absent), `finishedAt` (terminal-time mismatch), `task` (task description drift), `events.replay_threw` (reducer rejected an event during replay), and `events.empty` (no events present for a session that nonetheless has a project entry). The CLI calls the library over the full store (preserves the orphan-recovery path inside `groupRowsBySession`) and post-filters `divergences[]` to the supplied session id.

This is SEMANTIC divergence detection — not AJV schema-shape validation. Operators expecting AJV-style "your `session.json` failed schema validation" errors will not find them here; the command surfaces only the five divergence kinds above. The `--help` output reflects this distinction explicitly so reviewers and operators do not reach for the wrong mental model.

`SESSION_NOT_FOUND` detection runs as an explicit secondary check after the diff call: when no divergences match the session id AND the store has zero rows for it AND `project.json.sessions[]` has no entry, the command refuses with exit 1 instead of the false-green-light "no divergences found." Operators running `gobbi memory check <typo-id>` see refusal, not silence.

Flags: `--db <path>` (state.db override; default `<repoRoot>/.gobbi/state.db`), `--project <path>` (project.json override; default derived from project name), `--project-name <name>` (project name override; default `basename(repoRoot)`), `--json` (structured envelope on stdout for success and on stderr for errors), `--help`/`-h`. Exit codes: `0` (no divergence), `1` (any divergence OR `DB_MISSING` OR `PROJECT_MISSING` OR `SESSION_NOT_FOUND`), `2` (`PARSE_ARGS`). The 4-member error union is `'DB_MISSING' | 'PROJECT_MISSING' | 'SESSION_NOT_FOUND' | 'PARSE_ARGS'`.

**`gobbi memory backfill <session-id>`** — Crash-recovery: materialise a fully-populated `session.json` from `state.db` events when a session crashed mid-Memorization, leaving only the 6-field init-time stub on disk. The command reuses `writeSessionJsonAtMemorizationExit` from `workflow/session-json-writer.ts` AS-IS — no parallel writer path — so the on-disk shape after backfill is byte-identical to a normal Memorization `STEP_EXIT`. Bug fixes to the aggregator therefore benefit both the engine post-commit path and operator backfill.

Three pre-flights guard the writer call. `BACKFILL_NO_STUB` refuses when the session has no init-time stub on disk (operators in this state should consult `gobbi maintenance wipe-legacy-sessions` for pre-pivot legacy sessions instead). `BACKFILL_ALREADY_POPULATED` refuses when the stub already has populated `steps[]` — `--force` bypasses this and overwrites. `BACKFILL_NO_EVENTS` refuses when the per-session `gobbi.db` has zero rows for the session id, since the aggregator has nothing to read. The aggregator-or-writer-threw arm reports `BACKFILL_FAILED` with the underlying message preserved on the envelope.

Flags: `--project-name <name>` (default `basename(repoRoot)`), `--finished-at <ISO>` (override the aggregator's `finishedAt` inference; default lets the aggregator stamp from the `workflow.finish` or `workflow.abort` event timestamp in the per-session `gobbi.db`), `--force` (bypass `BACKFILL_ALREADY_POPULATED`), `--json` (structured envelope as above), `--help`/`-h`. Exit codes: `0` on success, `1` on any pre-flight refusal or aggregator throw, `2` on `PARSE_ARGS`. The 5-member error union is `'BACKFILL_NO_STUB' | 'BACKFILL_ALREADY_POPULATED' | 'BACKFILL_NO_EVENTS' | 'BACKFILL_FAILED' | 'PARSE_ARGS'`.

The command opens a per-session `EventStore` against `<sessionDir>/gobbi.db` rather than the workspace `WorkspaceReadStore`. The per-session DB path lets the constructor derive `(sessionId, projectId)` directly from the on-disk layout, and avoids widening the read surface to the entire workspace (which would risk cross-session bleed in helpers such as `aggregateDelegationCosts()`). Re-running backfill on the same session is idempotent — the aggregator is deterministic on its inputs and a second invocation produces a byte-identical `session.json`.

### Existing commands (unchanged)

**`gobbi session list`** — Lists sessions with their IDs, creation timestamps, and current steps. Sessions are stored under `.gobbi/projects/<name>/sessions/` in the multi-project layout.

**`gobbi config`** — Settings cascade management. Two verbs: `get <key> [--level ...] [--session-id ...]` reads from cascade or a specific level; `set <key> <value> [--level ...] [--session-id ...]` writes to a target level. All three levels use a unified `settings.json` schema — see `gobbi-config/README.md`.

**`gobbi notify`** — Notification commands (Slack, Telegram, Desktop). Unchanged.

**`gobbi image`, `gobbi video`, `gobbi web`** — Media analysis commands. Unchanged.

**`gobbi validate`**, **`gobbi note`** — Unchanged in function; `note collect` behavior is superseded by automatic SubagentStop capture in v0.5.0, but the command remains for manual use.

---

## Verification

> **Executor subagents self-verify. The CLI records the verification block for prompt compilation.**

Pass-3 finalization removed the configurable `verification.*` section from the settings schema and decommissioned `verification-runner.ts`. Executor subagents are responsible for their own verify phase per `_delegation`'s Study→Plan→Execute→Verify lifecycle — the post-subagent-stop runner was duplicative.

The `verification-block.ts` prompt compiler remains: it renders `verification.result` events already present in `state.verificationResults` into a compiled prompt block. The events are written by any code path that calls `appendEventAndUpdateState` with a `verification.result` event (currently the specs-layer tests and future wiring). The compiler is not spec-driven and is not called by `next.ts` unless verification result events are present.

Cross-reference `v050-prompts.md` for how verification blocks appear in step specs.

---

## Argument Parsing

The current CLI uses `node:util` `parseArgs` with manual command routing — the `switch` on `command` in `cli.ts`. This pattern is kept for v0.5.0.

> **The parsing layer is isolated. Migration to a typed routing library is a contained refactor, not an architectural change.**

The `gobbi workflow <subcommand>` routing follows the same pattern as existing top-level commands: `process.argv[2]` routes to `workflow`, and `process.argv[3]` routes to the subcommand. The workflow subcommand handler lives in `src/commands/workflow.ts`. When the command count grows significantly, the CLI can migrate the parsing layer to a typed subcommand router without touching the handler implementations.

---

## Plugin-CLI Relationship

> **The plugin distributes. The CLI runs. These are separate responsibilities with a clean boundary.**

The gobbi plugin is the Claude Code integration artifact — it is what users install, what registers hooks with Claude Code, and what declares the rules that load into every session. The CLI is the runtime engine that the plugin delegates to.

**Plugin responsibilities:**
- Hook registration via `hooks/hooks.json`
- Always-active behavioral rules in `rules/`
- Agent definitions for the workflow agents
- Domain knowledge skills that survive as materials per `v050-prompts.md`
- `settings.json` declaring permissions and hook timeouts

**CLI responsibilities:**
- Workflow engine: event store, state machine, reducer
- Predicate registry: loading, validation, runtime resolution
- Step specs for all workflow steps plus their variants
- Guard specification and predicate evaluation
- Prompt compilation: selecting artifacts, loading skill materials, applying cache ordering, enforcing token budget
- Verification command execution after subtask completion
- Session lifecycle management and cost tracking

The plugin does not contain orchestration logic. It contains wiring. When guard behavior changes, the CLI package is updated. The hook scripts remain stable across releases because they contain no logic — they only invoke `gobbi workflow *` commands.

**Installation path** — The plugin declares `@gobbitools/cli` as a dependency in its `package.json`. When the plugin is installed, the CLI installs with it. The `gobbi` binary is available as a project-local command.

---

## Distribution Strategy

> **npm is primary. Single-binary is secondary for environments where npm is unavailable.**

**Primary: npm package** — `@gobbitools/cli` published to the npm registry. Plugin installation pulls the CLI as a dependency. Users with a standard Node.js or Bun environment install once and update via `npm update` or `bun update`.

**Secondary: `bun --compile` binary** — Bun can compile a TypeScript project into a self-contained binary with no runtime dependency. This is the distribution path for environments where npm is unavailable — CI systems, restricted corporate environments. The compiled binary includes the Bun runtime and all CLI code.

Both artifacts are produced from the same source. The choice between them is made by the installer, not by the gobbi release process.

---

## Testing Strategy

`bun:test` is the test runner for all CLI tests. No additional test framework is required.

> **Test the boundaries, not the internals. The event store, state machine, predicate registry, and step specs are the interfaces other subsystems depend on.**

**State machine tests** — The reducer is a pure function and tests cheaply. Each test supplies an initial state and an event and asserts the returned state. Exhaustiveness is validated at compile time via the TypeScript `never` pattern. Transition table compliance is tested by exercising every row in the table.

**Predicate registry tests** — Each predicate is a pure function with a typed signature. Tests supply mock state and arguments and assert the boolean return. `gobbi workflow validate` is itself tested by constructing spec sets with missing or misspelled predicate names and asserting that validation fails with descriptive errors.

**Guard evaluation tests** — Each guard specification is a JSON object. Tests supply a mock state and a mock tool call input and assert the output: `deny`, `allow`, or `warn` with the expected reason. Predicates referenced by guards are unit-tested independently.

**Prompt compilation tests** — Snapshot testing via `bun:test`. Each step spec is compiled with a representative set of state inputs and the output is committed as a snapshot. CI fails when a compiled prompt changes unexpectedly. Error-state prompts are snapshot-tested for each of the four pathways.

**Hook handler tests** — Hook handlers are tested by supplying mock stdin payloads and asserting stdout output and event store writes. The event store is tested against a real SQLite in-memory database — `bun:sqlite` with an in-memory database has no I/O cost.

**Verification tests** — Verification command execution is tested with mock commands that simulate pass, fail, and timeout conditions. Event recording for each verification outcome is asserted.

**Integration tests** — A full workflow cycle test initializes a session, transitions through all steps, and verifies the final state. Hook delegation is tested end-to-end with mock stdin and a real CLI subprocess.

---

## Boundaries

This document covers the CLI's role as integration hub, the predicate registry, the Bun runtime migration and its rationale, the full command structure including error-state prompt generation and cost tracking in status output, verification command support, the argument parsing approach, the plugin-CLI boundary, distribution strategy, and testing approach.

For the event store schema and state fields that `gobbi workflow` commands read and write, see `v050-session.md`. For the state machine transitions and the predicate model that guards and transitions reference, see `v050-state-machine.md`. For the prompt compilation logic including resume prompts and verification blocks in step specs, see `v050-prompts.md`. For the hook stdin schemas and output format that `gobbi workflow guard` and capture commands handle, see `v050-hooks.md`.
