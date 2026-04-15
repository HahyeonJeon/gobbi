# v0.5.0 CLI — Integration Point

CLI architecture reference for v0.5.0. Read this when implementing or reasoning about command structure, runtime choices, distribution, or the relationship between the plugin and the CLI. This document treats the CLI as a container — how it binds the event store, state machine, prompt templates, and hook system into a single executable. For the internals of each subsystem, see the respective doc.

---

## The CLI's Role

The CLI is where all v0.5.0 subsystems converge. It is the only component that has read access to every part of the system simultaneously: workflow state from the event store, domain knowledge from `.claude/skills/`, guard specifications, prompt templates, and project configuration.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLI as Integration Hub                       │
└─────────────────────────────────────────────────────────────────────┘

   .claude/                      .gobbi/
   ────────────────              ─────────────────────────────────
   skills/          ──read──▶   sessions/{id}/gobbi.db
   rules/           ──read──▶   sessions/{id}/state.json
   CLAUDE.md        ──read──▶   sessions/{id}/{step}/
   agents/          ──read──▶   project/gotchas/
                                                  │
                                                  │
                    ┌─────────────────────────────┘
                    │
                    ▼
          ┌─────────────────────┐
          │        CLI          │
          │                     │
          │  Event store reads  │
          │  State derivation   │
          │  Guard evaluation   │
          │  Prompt compilation │
          │  Event writes       │
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │   Hook scripts      │──▶  Claude Code (hook delegation)
          └─────────────────────┘
                     │
          ┌──────────▼──────────┐
          │   Orchestrator      │──▶  receives bounded prompt
          └─────────────────────┘
```

> **The CLI is the prompt factory and the guard enforcer. Hooks are thin wrappers that delegate to it.**

Hook scripts registered in `hooks/hooks.json` contain no logic. Each hook reads stdin and calls the appropriate `gobbi workflow *` command. Guard logic, event schemas, and capture behavior all live in the CLI — not in the hooks. This means updating workflow behavior means updating the CLI package, not touching the hook scripts.

---

## Runtime: Bun + TypeScript

V0.5.0 migrates the CLI from Node.js to Bun. The current `package.json` declares `"engines": { "node": ">=18.0.0" }` and uses `tsc` for compilation. V0.5.0 replaces both.

> **Bun matches Claude Code's own runtime, eliminates the build step, and brings native SQLite — three wins with one dependency choice.**

**Native TypeScript execution** — Bun runs `.ts` files directly. No `tsc` build step during development. `bun run src/cli.ts` executes immediately. The build step for distribution still exists (`bun build`), but the development loop no longer requires it.

**`bun:sqlite`** — The event store in `v050-session.md` requires SQLite with WAL mode and atomic write semantics. `bun:sqlite` is native to the runtime — zero additional dependencies, no `better-sqlite3` binding to compile, and 3–6x faster than equivalent Node.js SQLite solutions. This is the primary technical reason for the Bun migration: the event store architecture depends on SQLite, and Bun makes SQLite a first-class runtime capability.

**`bun:test`** — Jest-compatible test runner built into the runtime. Zero configuration, built-in mocking, snapshot testing support. The testing strategy for prompt templates relies on snapshots to catch unintended changes — `bun:test` supports this natively without additional tooling.

**File I/O** — `Bun.file()` and `Bun.write()` replace `node:fs/promises` for the common case. State file writes use the temp+rename pattern: the CLI writes to a `.tmp` file, then renames it atomically over the target. This prevents a partial write from corrupting `state.json` — the rename is atomic at the OS level.

**Startup time** — Hook scripts are invoked on every tool call. A PreToolUse guard fires before every `Write`, `Edit`, or `Task` tool call during a workflow session. Guard evaluation must be fast — slow hooks stall the session. Bun's startup time (sub-10ms for a simple script) makes per-call invocation practical in a way that a Node.js + tsc compiled CLI struggles to match.

The `package.json` `name` (`@gobbitools/cli`) and `bin` configuration remain unchanged. The migration is internal — callers invoke `gobbi` the same way.

---

## Command Structure

The CLI expands from its current eight-command surface to add a `workflow` subcommand group. All new commands live under `gobbi workflow`. Existing commands are unchanged.

### New: `gobbi workflow` commands

**`gobbi workflow init`** — Creates the session directory under `.gobbi/sessions/{session-id}/`, writes `metadata.json`, initializes `gobbi.db` with the events table schema, and appends the first `workflow.start` event. Called by the SessionStart hook. Idempotent — if the session directory already exists, it verifies structure and exits cleanly.

During initialization, `gobbi workflow init` asks the user four setup questions: the task description, whether to evaluate after Ideation, whether to evaluate after Plan, and any additional context. The evaluation answers (Ideation and Plan eval on/off) are stored immediately as a `workflow.eval.decide` event in `gobbi.db`, populating `evalConfig` in `state.json`. The prompt template generated for the first step (Ideation) includes the eval decision in its session section so the orchestrator knows the evaluation configuration from the start without needing to ask mid-workflow.

**`gobbi workflow next`** — The core command. Reads `state.json` (or replays `gobbi.db` if absent), determines the active step, selects the appropriate prompt template, loads relevant skills and artifacts, evaluates token budget, and writes the compiled prompt to stdout. This is what the orchestrator receives at the start of each step. Every other `workflow` command supports this one.

**`gobbi workflow transition <event>`** — Advances the state machine by appending a typed event to `gobbi.db` and updating `state.json`. Validates that the event produces a valid transition from the current step before writing. Returns the new state summary on stdout. Invalid transitions produce an error with the reason — useful for diagnosing stalls.

The orchestrator calls this command via Bash, instructed by the prompt template. Each step's generated prompt ends with an explicit instruction: when this step is complete, run `gobbi workflow transition COMPLETE`. The CLI validates the transition against the state machine and advances state — the orchestrator does not decide when to transition, the prompt template instructs it.

The Stop hook can also trigger implicit transitions: after each turn, the Stop hook analyzes the conversation to detect whether the orchestrator's response completed a step. If the response contains a recognized completion signal and no explicit transition was already written, the Stop hook writes the transition event. This handles cases where the orchestrator completed the step work but did not execute the transition command.

**`gobbi workflow guard`** — Invoked by the PreToolUse hook. Reads the full hook stdin payload, loads `state.json`, evaluates guard conditions using the JsonLogic engine, and writes the appropriate JSON response to stdout. If the call violates a guard, appends a `guard.violation` event and returns `permissionDecision: "deny"`. If the call is valid, returns `permissionDecision: "allow"` or defers to the next hook. Guard evaluation is the hottest code path in the CLI — it must complete in single-digit milliseconds.

**`gobbi workflow capture-subagent`** — Invoked by the SubagentStop hook. Reads the hook stdin payload, extracts the subagent's transcript from `agent_transcript_path`, writes an artifact to the current step directory, and appends a `delegation.complete` event linked to the originating `delegation.spawn` event via `parent_seq`. This replaces manual `gobbi note collect`.

**`gobbi workflow capture-plan`** — Invoked by the PostToolUse hook on ExitPlanMode. Reads the plan content from the hook stdin payload, writes a plan artifact to `.gobbi/sessions/{id}/plan/`, and appends an `artifact.write` event. The orchestrator does not need to explicitly save the plan — this capture is automatic.

**`gobbi workflow flush-state`** — Invoked by the Stop hook. Checks for pending state changes that were not flushed during the turn and applies them. Respects `stop_hook_active` — exits immediately if true to prevent reentrance loops. This is a safety net, not the primary persistence path.

**`gobbi workflow resume`** — User-facing recovery command. Replays `gobbi.db` through the reducer, writes a fresh `state.json`, and outputs a resume prompt that re-orients the orchestrator to the current step. Used after crash recovery and after context compaction — both cases use the same rebuild path.

**`gobbi workflow status`** — Reads `state.json` and prints the current workflow step, completed steps, active subagent count, evaluation configuration, and feedback round count. Human-readable output. Useful for diagnosing where a session is in the workflow without reading raw JSON.

### New: `gobbi session` commands

**`gobbi session events`** — Formats the `events.jsonl` log for human consumption. New in v0.5.0. Provides a readable audit trail of every event in a session without requiring a SQLite client.

### New: `gobbi gotcha` commands

**`gobbi gotcha promote`** — Moves gotchas from `.gobbi/project/gotchas/` to the permanent store in `.claude/skills/_gotcha/`. This command runs outside active sessions only — it checks that no session is active (no `workflow.start` event without a corresponding `workflow.finish` in any session directory) before proceeding. Gotchas recorded during a session live in `.gobbi/project/gotchas/` until this promotion step runs. The promotion is the mechanism that turns mid-session learnings into permanent `.claude/` knowledge without causing context reload during the session itself.

### Existing commands (unchanged)

**`gobbi session list`** — Lists sessions with their IDs, creation timestamps, and current steps. Unchanged in v0.5.0 except the session source moves from the v0.4.x session files to `.gobbi/sessions/`.

**`gobbi config`** — Session configuration management. Unchanged.

**`gobbi notify`** — Notification commands (Slack, Telegram, Desktop). Unchanged.

**`gobbi image`, `gobbi video`, `gobbi web`** — Media analysis commands. Unchanged.

**`gobbi validate`**, **`gobbi note`** — Unchanged in function; `note collect` behavior is superseded by automatic SubagentStop capture in v0.5.0, but the command remains for manual use.

---

## Argument Parsing

The current CLI uses `node:util` `parseArgs` with manual command routing — the `switch` on `command` in `cli.ts`. This pattern is kept for v0.5.0. It has a manageable cost at the current command count and adding a `workflow` subcommand group is straightforward.

> **The parsing layer is isolated. Migration to a typed routing library is a contained refactor, not an architectural change.**

The `gobbi workflow <subcommand>` routing follows the same pattern as the existing top-level commands: `process.argv[2]` routes to `workflow`, and `process.argv[3]` routes to the subcommand. The workflow subcommand handler lives in `src/commands/workflow.ts`.

When the command count grows significantly — particularly when workflow subcommands multiply for domain-specific variants — the CLI can migrate the parsing layer to a typed subcommand router without touching the handler implementations. The handlers are isolated from the parsing surface.

---

## Plugin-CLI Relationship

> **The plugin distributes. The CLI runs. These are separate responsibilities with a clean boundary.**

The gobbi plugin is the Claude Code integration artifact — it is what users install, what registers hooks with Claude Code, and what declares the rules that load into every session. The CLI is the runtime engine that the plugin delegates to.

```
  Plugin (distribution layer)          CLI (runtime layer)
  ──────────────────────────           ─────────────────────────────
  hooks/hooks.json         ──calls──▶  gobbi workflow guard
  hooks/hooks.json         ──calls──▶  gobbi workflow capture-subagent
  hooks/hooks.json         ──calls──▶  gobbi workflow capture-plan
  hooks/hooks.json         ──calls──▶  gobbi workflow flush-state
  rules/                   ──reads──▶  (loaded by Claude Code directly)
  agents/                  ──reads──▶  (loaded by Claude Code directly)
  skills/ (domain only)    ──reads──▶  CLI inlines into generated prompts
  settings.json            ──declares──▶  hook registration, permissions
```

**Plugin responsibilities:**
- Hook registration via `hooks/hooks.json`
- Always-active behavioral rules in `rules/`
- Agent definitions for the workflow agents
- Domain knowledge skills (`_gotcha`, `_claude`, `_git`, and others that survive as materials per `v050-prompts.md`)
- `settings.json` declaring permissions and hook timeouts

**CLI responsibilities:**
- Workflow engine: event store, state machine, reducer
- Prompt templates for all five workflow steps plus their variants
- Guard specification and JsonLogic evaluation
- Prompt compilation: selecting artifacts, loading skill materials, applying cache ordering, enforcing token budget
- Session lifecycle management

The plugin does not contain orchestration logic. It contains wiring. When guard behavior changes, the CLI package is updated. The hook scripts in `hooks/hooks.json` remain stable across releases because they contain no logic to change — they only invoke `gobbi workflow *` commands.

**Installation path** — The plugin declares `@gobbitools/cli` as a dependency in its `package.json`. When the plugin is installed, the CLI installs with it. The `gobbi` binary is available as a project-local command, invokable from hook scripts via the standard node_modules path or a resolved absolute path stored in plugin configuration.

---

## Distribution Strategy

> **npm is primary. Single-binary is secondary for environments where npm is unavailable.**

**Primary: npm package** — `@gobbitools/cli` published to the npm registry. This is the current distribution mechanism and it remains correct for v0.5.0. Plugin installation pulls the CLI as a dependency. Users with a standard Node.js or Bun environment install once and update via `npm update` or `bun update`.

**Secondary: `bun --compile` binary** — Bun can compile a TypeScript project into a self-contained binary with no runtime dependency. This is the distribution path for users in environments where npm is unavailable — CI systems, restricted corporate environments, or setups where installing a package manager is impractical. The compiled binary includes the Bun runtime and all CLI code. It is larger than the npm package but requires no external tooling to run.

The binary build is an additional CI step, not a replacement for the npm build. Both artifacts are produced from the same source. The choice between them is made by the installer, not by the gobbi release process.

---

## Testing Strategy

`bun:test` is the test runner for all CLI tests. No additional test framework is required.

> **Test the boundaries, not the internals. The event store, state machine, and prompt templates are the interfaces other subsystems depend on.**

**State machine tests** — The reducer is a pure function and tests cheaply. Each test supplies an initial state and an event and asserts the returned state. Exhaustiveness is validated at compile time via the TypeScript `never` pattern — a new event type without a reducer case is a type error. Transition table compliance is tested by exercising every row in the table and confirming the reducer accepts valid transitions and rejects invalid ones.

**Guard evaluation tests** — Each guard specification is a JSON object. Tests supply a mock state and a mock tool call input and assert the output: `deny`, `allow`, or `warn` with the expected reason. The custom JsonLogic operators (`event_exists`, `event_count`) are unit-tested independently with synthetic event logs.

**Prompt template tests** — Snapshot testing via `bun:test`'s built-in snapshot support. Each template is rendered with a representative set of state inputs and the output is committed as a snapshot. CI fails when a template render changes unexpectedly. This catches unintended prompt changes — the most consequential class of regression in a system where prompt content drives behavior.

**Hook handler tests** — Hook handlers (`gobbi workflow guard`, `gobbi workflow capture-subagent`, etc.) are tested by supplying mock stdin payloads and asserting stdout output and event store writes. File I/O is mocked via Bun's test mocking support. The event store is tested against a real SQLite in-memory database — this is practical because `bun:sqlite` with an in-memory database has no I/O cost.

**Integration tests** — A full workflow cycle test initializes a session, transitions through all five steps, and verifies that the final state matches the expected terminal state. Hook delegation is tested end-to-end with mock stdin and a real CLI subprocess. These are slower than unit tests and run in a separate test suite from the fast unit tests.

---

## Boundaries

This document covers the CLI's role as integration hub, the Bun runtime migration and its rationale, the full command structure for both new `workflow` commands and existing commands, the argument parsing approach, the plugin-CLI boundary, distribution strategy, and testing approach.

For the event store schema and state fields that `gobbi workflow` commands read and write, see `v050-session.md`. For the state machine transitions that `gobbi workflow transition` validates, see `v050-state-machine.md`. For the prompt compilation logic that `gobbi workflow next` executes, see `v050-prompts.md`. For the hook stdin schemas and output format that `gobbi workflow guard` and capture commands handle, see `v050-hooks.md`.
