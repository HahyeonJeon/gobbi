# v0.5.0 Hooks

Enforcement and recording layer for v0.5.0. Read this when implementing or reasoning about PreToolUse guards, SubagentStop capture, PostToolUse signals, Stop hook behaviors, or the hook-to-CLI delegation pattern. Assumes familiarity with the event model in `v050-session.md`, guard conditions and predicate registry in `v050-state-machine.md`, and step spec structure in `v050-prompts.md`.

---

## Two Categories of Hooks

> **Guards enforce. Capture records. These are separate responsibilities and must not be conflated.**

V0.5.0 hooks divide cleanly into two functional categories based on when they fire and what they do.

**Guard hooks** (PreToolUse) intercept tool calls before execution. They read the current workflow state and evaluate whether the tool call is valid at this point in the workflow. When a call violates a guard, the hook blocks it — the tool never executes. Guard hooks are the enforcement layer. They cannot be bypassed by model reasoning because they operate at the tool layer, not the prompt layer.

**Capture hooks** (SubagentStop, PostToolUse, Stop) observe actions that have already completed. They do not block — they record. A SubagentStop hook reads the subagent's transcript and writes a delegation event to the event store. A PostToolUse hook on ExitPlanMode captures the plan content. A Stop hook writes heartbeat events and checks for step timeouts. Capture hooks are the recording layer.

---

## Guard Hook Mechanics (PreToolUse)

### Stdin Schema

Every PreToolUse hook invocation receives a JSON object on stdin. The fields relevant to guard evaluation are:

| Field | Type | Description |
|-------|------|-------------|
| `tool_name` | string | Name of the tool being called — e.g., `Write`, `Edit`, `Task` |
| `tool_input` | object | Full arguments to the tool call |
| `session_id` | string | Claude Code session identifier |
| `agent_id` | string, optional | Present when the caller is a subagent, absent for orchestrator |

The `agent_id` field is the critical discriminant. Guard hooks fire recursively — PreToolUse fires inside subagents as well as for the orchestrator. Structural guards should check whether `agent_id` is absent. If it is present, the call is from a subagent and most structural guards do not apply. The orchestrator-level guards enforce workflow step compliance; subagents operate within a narrower, already-validated scope.

### Denial Mechanism

> **Guards deny via `hookSpecificOutput.permissionDecision: "deny"`, not via exit code 2. Exit code 2 ignores JSON output entirely.**

The hook process must exit 0 and write a JSON response to stdout. The denial signal lives inside `hookSpecificOutput`, not at the top level of the response. The `permissionDecision` field accepts four values:

| Value | Meaning |
|-------|---------|
| `deny` | Block the tool call — the tool does not execute |
| `allow` | Explicitly permit — overrides lower-priority guards |
| `ask` | Surface to user for manual decision |
| `defer` | Pass to the next applicable hook in the chain |

When multiple hooks respond to the same tool call, precedence is: `deny` beats `defer` beats `ask` beats `allow`. A single deny anywhere in the chain blocks the call.

Every denial must include `permissionDecisionReason` — a human-readable string explaining why the call was blocked. This is what the orchestrator receives. It should be specific enough for the orchestrator to understand what step it is in and what it should do instead.

### Input Modification

PreToolUse can rewrite the tool's input before execution via the `updatedInput` field. The modified input is what the tool receives. This is used sparingly — primarily to normalize file paths or inject missing context. Guard hooks that deny should not also modify input; modification is meaningful only when the call is allowed.

### Specific Guard Behaviors

**Agent tool (spawning subagents)** — The guard reads `tool_input.subagent_type` and checks it against the current step's allowed agent types, derived from the per-session `gobbi.db` event log via reducer-replay. An orchestrator in the Execution step is allowed to spawn executor-type agents. It is not allowed to spawn evaluator-type agents — evaluation is a separate step and the creating agent must not trigger it. If `subagent_type` is not in the allowed set for the current step, the guard denies.

When the guard allows an Agent tool call, it appends a `delegation.spawn` event to the event store before returning the allow decision. This event records the subagent type, the current step, and the timestamp. The `parent_seq` on the subsequent `delegation.complete` or `delegation.fail` event (written by SubagentStop) references this spawn event, linking the full delegation lifecycle in the event log. All events include `idempotency_key` per the schema in `v050-session.md`.

**Write and Edit tools (`.claude/` protection)** — The guard checks whether `tool_input.file_path` targets any path under `.claude/`. If the session is active (a `workflow.start` event exists and no `workflow.finish` event exists), the guard denies. This enforces the directory split from `v050-overview.md`: `.claude/` is read-only during an active workflow. Writes go to `.gobbi/`.

**Execution precondition guard** — Before an executor subagent is spawned, the guard verifies that a plan artifact exists in `plan/` for the current session. It uses the predicate that checks for a completed plan step exit event. If the plan step has not completed, the guard denies. An executor without a plan has no bounded scope and will improvise — which is the failure mode v0.5.0 is designed to prevent.

### Secret Pattern Detection Guard

> **Prevent accidental secret leakage in tool outputs without blocking legitimate writes.**

A PreToolUse guard checks Write and Edit tool inputs for common secret patterns — API keys, tokens, credentials, and other sensitive material. The match filter fires only on `Write` and `Edit` tool calls. The guard's effect is `warn`, not `deny`, because false positives are possible and blocking would stall the workflow unnecessarily.

The match filter must exclude paths under `.gobbi/projects/<name>/sessions/**`. Gobbi's session artifact writes — subagent results, event data, state files — may contain strings that resemble secret patterns without being actual secrets. The exclusion is narrowed to `sessions/` specifically so that writes to `.gobbi/config.json` or other non-session files are still checked for secrets.

When the guard fires, it injects an `additionalContext` warning into the hook response and writes a `guard.warn` event to the event store with `idempotency_key`. The orchestrator receives the warning and can inspect the flagged content. The `guard.warn` event is distinct from `guard.violation` (which is written by deny guards) — both count toward escalation thresholds, but `guard.warn` does not block the tool call.

---

## Capture Hook Mechanics

### SubagentStop

> **SubagentStop replaces manual `gobbi note collect` entirely. When a subagent stops, its output is automatically recorded — success or failure.**

SubagentStop fires after every subagent completes, regardless of success or failure. The stdin payload fields are:

| Field | Type | Description |
|-------|------|-------------|
| `agent_id` | string | Identifier of the subagent that completed |
| `agent_type` | string | Role type — executor, evaluator, researcher, etc. |
| `agent_transcript_path` | string | Absolute path to the subagent's conversation transcript |
| `last_assistant_message` | string | Final message from the subagent before stopping |
| `stop_hook_active` | boolean | Whether a Stop hook is currently running |

`stop_hook_active` must be checked first. If true, the hook exits immediately. SubagentStop can be called from within a Stop hook context — processing in that condition causes infinite loops.

#### Three-Case Failure Handling

Every SubagentStop produces either a `delegation.complete` or `delegation.fail` event. No subagent completion is silently dropped. The capture hook handles three cases:

**Transcript present and parseable** — The hook reads the transcript at `agent_transcript_path`, extracts the result, and writes an artifact file to the current step's directory under `.gobbi/projects/<name>/sessions/{session-id}/{step}/`. It then appends a `delegation.complete` event to `state.db` with the artifact path as data. The `parent_seq` field references the `delegation.spawn` event that initiated this subagent.

**Transcript present but unparseable** — The transcript file exists but the hook cannot extract a structured result from it — malformed content, unexpected format, or extraction logic failure. The hook writes a `delegation.fail` event with the transcript path included as context in the event data, so the operator can inspect the raw transcript. A failure marker artifact (`delegation-fail-r{N}.md`) is written to the step directory.

**Transcript absent** — The transcript file at `agent_transcript_path` does not exist. The subagent may have crashed before producing output, or the path may be stale. The hook writes a `delegation.fail` event with reason "transcript not found" in the event data. A failure marker artifact is written to the step directory.

This defensive approach follows ETL pipeline patterns: every input produces an output record, even if that record is a failure. Silent drops in pipelines cause state inconsistencies that are difficult to diagnose.

#### Artifact Filename Construction

The capture hook derives `feedbackRound` from the per-session `gobbi.db` reducer-replay to construct artifact filenames with a round suffix. First-pass artifacts use `r1` (e.g., `execution-r1.md`). After a feedback loop, the next round uses `r2` (e.g., `execution-r2.md`). Failed rounds get a failure marker: `delegation-fail-r2.md`. Cross-reference `v050-session.md` for the full naming scheme and how the CLI's prompt compilation selects the latest round.

#### Cost and Token Capture

When extracting from the transcript, the capture hook captures token usage data if present in the hook payload or transcript — billed tokens (cache-adjusted, not raw), and cache hit ratio. These are included as optional fields on the `delegation.complete` event's data payload. If token data is not available, the hook falls back to transcript file size as a rough proxy and records that instead.

Cost data surfaces via `gobbi workflow status` only — it must NOT appear in compiled prompts or guard conditions. This is a visibility feature for the operator, not a control mechanism. Data availability depends on the Claude Code API — this is a precondition to verify during implementation before designing the full schema. Cross-reference `v050-session.md` for the `delegation.complete` event's cost field definitions.

#### Idempotency

All events written by the SubagentStop hook — `delegation.complete` and `delegation.fail` — include the `idempotency_key` field per the schema in `v050-session.md`. This prevents duplicate events if Claude Code retries the hook.

Output length cap applies. Transcripts can be large. The hook writes results to the artifact file, not to stdout. The stdout response is kept minimal — only the event confirmation.

### PostToolUse (ExitPlanMode)

PostToolUse fires after a tool call completes. The hook is registered specifically for the `ExitPlanMode` tool. When ExitPlanMode completes, the plan is finalized. The hook:

1. Reads `tool_input` from the stdin payload to extract the plan content
2. Writes the plan as an artifact to `.gobbi/projects/<name>/sessions/{session-id}/planning/`
3. Appends an `artifact.write` event to `state.db` with `idempotency_key`

This removes the requirement for the orchestrator to explicitly save the plan. The capture is automatic — the orchestrator uses ExitPlanMode as normal and the hook handles persistence.

PostToolUse does not use `permissionDecision` — it cannot block. If the hook fails, the failure is logged but the tool call result is not affected.

### PostToolUse (Bash — `gobbi workflow transition`)

A second PostToolUse registration fires when a `Bash` tool call's command starts with `gobbi workflow transition`. This is the `step.advancement.observed` signal — an audit-only synthetic event that primes the Stop-hook safety net (see § Missed-Advancement Safety Net below).

The hook calls `store.append()` directly, bypassing the reducer. This is intentional: the reducer's `assertNever` branch throws a plain `Error` (not `ReducerRejectionError`), so a reducer-routed audit event would be silently swallowed. Direct `store.append()` is the only path that persists the event reliably. The reducer remains pure — it never sees this event.

Idempotency key: `tool-call` keyed on the PostToolUse payload's `tool_call_id`. Deduplicates across hook retries without merging distinct Bash invocations.

Cite: `orchestration/README.md` § 6 (Inner mode hooks).

### Stop Hook

> **The Stop hook is the continuous observer — heartbeat, timeout detection, and state flush on every turn.**

The Stop hook fires after each turn of the conversation ends. It has three responsibilities in v0.5.0:

**Heartbeat writing** — On each firing, the Stop hook writes a `session.heartbeat` event with the current timestamp to `state.db`. This event includes `idempotency_key`. The heartbeat enables abandoned session detection: sessions without a heartbeat for 60 minutes are treated as abandoned, which releases the `.claude/` write guard. Cross-reference `v050-session.md` for the heartbeat event type and the abandoned session threshold.

**Timeout detection** — On each firing, the Stop hook checks elapsed time since the current step began (using the most recent transition event that set `currentStep`). If elapsed time exceeds the step's configured timeout (from the step spec `meta` section), the hook writes a `workflow.step.timeout` event with `idempotency_key`. This event triggers transition to `error` state per the transition table in `v050-state-machine.md`. Default timeouts are generous — 30 minutes for execution steps, 15 minutes for evaluation steps — because human interaction is expected during most steps. Timeout configuration lives in step spec `meta`; cross-reference `v050-prompts.md` for step spec structure.

**State flush** — If any state changes computed during the turn were not yet persisted, the Stop hook ensures they are applied. This is a safety net — events are written to `state.db` during the turn as they occur, and the Stop hook only handles the case where a turn ended with pending state that was not flushed inline.

**Missed-advancement safety net** — On each firing, the Stop hook queries `state.db` for the most recent `step.advancement.observed` event since the last `workflow.step.exit`, `workflow.start`, or `workflow.resume`. If no such event exists and `turns_since_step_start >= 2`, the hook injects an `additionalContext` reminder that the orchestrator must call `gobbi workflow transition` when the step's work is complete. If `turns_since_step_start >= 5`, the hook additionally marks the situation in `state_snapshots` so `gobbi workflow status` can surface it to the operator. Thresholds: 2-turn reminder, 5-turn escalation — matching Temporal's heartbeat-budget conventions. See `orchestration/README.md` § 6 for the full design.

`stop_hook_active` in the stdin payload must be checked at the start of every Stop hook invocation. If true, the hook exits immediately with a zero exit code and empty output. Claude Code sets `stop_hook_active` when a Stop hook triggers another Stop hook — the reentrance guard prevents cascading. Omitting this check causes infinite loops that stall the session.

---

## Verification Command Integration

> **Mechanical verification after each subtask completion catches regressions before they compound.**

After each subtask completes and the SubagentStop hook captures the result, verification commands can run against the codebase. Verification commands are project-configurable — lint, test, typecheck, or any command the project defines in `.gobbi/` project config.

Verification results are recorded as events in the event store with `idempotency_key`. A passing verification is informational. A failing verification records the failure context — which command failed, the output — so the CLI can include it in the next compiled prompt. This gives the orchestrator or the next subagent concrete error context rather than requiring re-discovery.

Verification commands are not guards — they do not block the SubagentStop capture. The capture always completes first (writing the `delegation.complete` or `delegation.fail` event), and verification runs afterward. This ordering ensures the subagent's output is never lost even if verification itself fails or times out.

Cross-reference `v050-prompts.md` for how verification result blocks appear in step specs and how the CLI includes failure context in the next delegation prompt.

---

## Hook-to-CLI Delegation

> **Hooks are thin wrappers. All logic lives in the CLI.**

Each hook is a minimal shell script or binary that reads stdin and delegates to a `gobbi` CLI command. The hook itself contains no guard logic, no state evaluation, and no event writing. This separation ensures that guard conditions and event schemas can be updated by updating the CLI package, without touching the hook scripts that live in `.claude/hooks/`.

The delegation pattern for each hook type:

| Hook event | CLI command |
|------------|-------------|
| SessionStart | `gobbi workflow init` |
| PreToolUse | `gobbi workflow guard` |
| SubagentStop | `gobbi workflow capture-subagent` |
| PostToolUse (ExitPlanMode) | `gobbi workflow capture-plan` |
| Stop | `gobbi workflow stop` |

Each CLI command reads the full stdin payload, evaluates against the current session state, writes any necessary events, and returns the appropriate JSON response that the hook forwards to stdout. The hook process exits 0 in all cases except unrecoverable startup failures.

The Stop hook now delegates to `gobbi workflow stop` (renamed from `flush-state`) because its responsibilities expanded beyond state flushing to include heartbeat writing and timeout detection.

The SessionStart hook receives a fixed stdin schema:

| Field | Type | Description |
|-------|------|-------------|
| `session_id` | string | Claude Code session identifier — becomes the session directory name |
| `transcript_path` | string | Absolute path to the session transcript file |
| `cwd` | string | Working directory at session open time — recorded in `session.json` |
| `source` | string | What triggered the session: `user`, `project`, or `api` |

`gobbi workflow init` uses these fields to create the session directory under `.gobbi/projects/<name>/sessions/{session-id}/`, write the post-PR-FIN-2a-ii `session.json` init stub, initialize the per-session `gobbi.db` event log, and append the first `workflow.start` event. The command is idempotent — if the session directory already exists, it verifies structure and exits cleanly.

This means the hooks registered in `hooks/hooks.json` are stable across releases. The CLI evolves; the hook wiring does not.

---

## Escalating Enforcement

V0.5.0 implements two enforcement levels that reflect different violation severities.

**Soft nudge** — For edge cases that are unusual but not structurally invalid, the PreToolUse hook returns a response that includes `additionalContext` rather than a denial. The tool call proceeds. The orchestrator receives the additional context and can adjust its behavior. This is appropriate when the action is technically within scope but warrants attention — for example, writing to a step directory that does not match the currently active step, or when the secret pattern guard detects a potential credential in a Write call.

**Hard block** — For structural violations, the hook returns `permissionDecision: "deny"`. The tool does not execute. A `guard.violation` event is written to the per-session `gobbi.db` with `idempotency_key`. The reducer surfaces it on subsequent state-derivation reads as part of the `violations` projection. The orchestrator receives the denial and the reason.

**Escalation on repeat triggers** — The `violations` projection (derived from `gobbi.db` reducer-replay) tracks both `guard.violation` events (from deny guards) and `guard.warn` events (from warn guards). The CLI reads the trigger count for a specific guard when generating the next prompt. If the same guard has fired more than a configurable threshold (default 3 times), the CLI escalates — it surfaces a warning to the user via the generated prompt. For deny guards, this means the orchestrator is repeatedly attempting a blocked action. For warn guards like the secret pattern detector, this means the orchestrator is repeatedly writing content that triggers the warning. Both are stagnation signals that may require human intervention.

---

## Hook Profiles

V0.5.0 ships with a single enforcement profile. All guards operate at the levels described in the Escalating Enforcement section above — hard blocks for structural violations, soft nudges for edge cases.

Research into the v0.5.0 enforcement model identified a hook profiles concept: configurable enforcement strictness levels (standard, minimal, strict) that would let users tune how aggressively guards block versus warn. This is a meaningful capability — teams with higher trust in their orchestrator or projects with tighter timelines may want a minimal profile that nudges instead of blocks.

Profile support is planned for v0.5.1 and later. V0.5.0 does not implement enforcement profiles. All hooks behave at the standard enforcement level. This is noted explicitly so that contributors do not implement ad-hoc per-guard softening to work around the missing profiles feature — the right place for that flexibility is the profile system, not guard-by-guard overrides.

---

## Plugin Hook Registration

> **Plugin hooks register via `hooks/hooks.json` only. Do not also declare them in `plugin.json`.**

Claude Code v2.1 and later auto-load `hooks/hooks.json` from the plugin directory. Declaring the same hooks in `plugin.json` causes duplicate detection errors at plugin load time. The hook manifest lives in one place — `hooks/hooks.json`. The `plugin.json` manifest does not contain a `hooks` key.

The timeout for command hooks is 600 seconds by default. Guard checks complete in milliseconds — they replay the per-session `gobbi.db` event log and evaluate predicate conditions. Capture hooks may take longer if they process large transcripts, but should complete well within the timeout. A hook that approaches the timeout indicates a design problem — the heavy work should be offloaded to an async queue rather than blocking the hook execution path.

---

## Boundaries

This document covers the two hook categories and their responsibilities, guard hook mechanics (stdin schema, denial mechanism, input modification, specific guard behaviors, secret pattern detection), capture hook mechanics (SubagentStop with three-case failure handling and cost capture, PostToolUse, Stop with heartbeat and timeout detection), verification command integration, hook-to-CLI delegation, escalating enforcement levels, and plugin hook registration.

For the predicate registry and guard specification format, see `v050-state-machine.md`. For the event types that hooks write and the reducer projections they update, see `v050-session.md`. For the CLI commands that hooks delegate to and step spec structure, see `v050-cli.md` and `v050-prompts.md`.
