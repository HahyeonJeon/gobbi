# v0.5.0 Hooks

Enforcement and recording layer for v0.5.0. Read this when implementing or reasoning about PreToolUse guards, SubagentStop capture, PostToolUse signals, or the hook-to-CLI delegation pattern. Assumes familiarity with the event model in `v050-session.md` and guard conditions in `v050-state-machine.md`.

---

## Two Categories of Hooks

> **Guards enforce. Capture records. These are separate responsibilities and must not be conflated.**

V0.5.0 hooks divide cleanly into two functional categories based on when they fire and what they do.

**Guard hooks** (PreToolUse) intercept tool calls before execution. They read the current workflow state and evaluate whether the tool call is valid at this point in the workflow. When a call violates a guard, the hook blocks it — the tool never executes. Guard hooks are the enforcement layer. They cannot be bypassed by model reasoning because they operate at the tool layer, not the prompt layer.

**Capture hooks** (SubagentStop, PostToolUse, Stop) observe actions that have already completed. They do not block — they record. A SubagentStop hook reads the subagent's transcript and writes a `delegation.complete` event to the event store. A PostToolUse hook on ExitPlanMode captures the plan content. A Stop hook flushes pending state changes after each turn. Capture hooks are the recording layer.

```
  Orchestrator action
         │
         ▼
  ┌─────────────────────────────────────┐
  │          PreToolUse (Guard)         │
  │                                     │
  │  Read state.json                    │
  │  Evaluate guard conditions          │
  │         │                           │
  │    deny? ──── block ──▶ guard.violation event
  │         │                           │
  │    allow? ─────────────────────────┐│
  └─────────────────────────────────────┘
                                        │
                                        ▼
                               Tool executes
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
           SubagentStop          PostToolUse             Stop
           (Capture)             (Capture)            (Capture)
                    │                   │                   │
                    └───────────────────┴───────────────────┘
                                        │
                                        ▼
                             Event written to gobbi.db
                             state.json updated
```

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

**Agent tool (spawning subagents)** — The guard reads `tool_input.subagent_type` and checks it against the current step's allowed agent types from `state.json`. An orchestrator in the Execution step is allowed to spawn executor-type agents. It is not allowed to spawn evaluator-type agents — evaluation is a separate step and the creating agent must not trigger it. If `subagent_type` is not in the allowed set for the current step, the guard denies.

**Write and Edit tools (`.claude/` protection)** — The guard checks whether `tool_input.file_path` targets any path under `.claude/`. If the session is active (a `workflow.start` event exists and no `workflow.finish` event exists), the guard denies. This enforces the directory split from `v050-overview.md`: `.claude/` is read-only during an active workflow. Writes go to `.gobbi/`.

**Execution precondition guard** — Before an executor subagent is spawned, the guard verifies that a plan artifact exists in `plan/` for the current session. It uses the `event_exists("workflow.step.exit", "plan")` check. If the plan step has not completed, the guard denies. An executor without a plan has no bounded scope and will improvise — which is the failure mode v0.5.0 is designed to prevent.

---

## Capture Hook Mechanics

### SubagentStop

> **SubagentStop replaces manual `gobbi note collect` entirely. When a subagent stops, its output is automatically recorded.**

SubagentStop fires after every subagent completes, regardless of success or failure. The stdin payload fields are:

| Field | Type | Description |
|-------|------|-------------|
| `agent_id` | string | Identifier of the subagent that completed |
| `agent_type` | string | Role type — executor, evaluator, researcher, etc. |
| `agent_transcript_path` | string | Absolute path to the subagent's conversation transcript |
| `last_assistant_message` | string | Final message from the subagent before stopping |
| `stop_hook_active` | boolean | Whether a Stop hook is currently running |

The hook reads the transcript at `agent_transcript_path`, extracts the result, and writes an artifact file to the current step's directory under `.gobbi/sessions/{session-id}/{step}/`. It then appends a `delegation.complete` event to `gobbi.db` with the artifact path as data. The `parent_seq` field on the event references the `delegation.spawn` event that initiated this subagent, linking the two.

`stop_hook_active` must be checked first. If true, the hook exits immediately. SubagentStop can be called from within a Stop hook context — processing in that condition causes infinite loops.

Output length cap applies. Transcripts can be large. The hook writes results to the artifact file, not to stdout. The stdout response is kept minimal — only the event confirmation.

### PostToolUse (ExitPlanMode)

PostToolUse fires after a tool call completes. The hook is registered specifically for the `ExitPlanMode` tool. When ExitPlanMode completes, the plan is finalized. The hook:

1. Reads `tool_input` from the stdin payload to extract the plan content
2. Writes the plan as an artifact to `.gobbi/sessions/{session-id}/plan/`
3. Appends an `artifact.write` event to `gobbi.db`

This removes the requirement for the orchestrator to explicitly save the plan. The capture is automatic — the orchestrator uses ExitPlanMode as normal and the hook handles persistence.

PostToolUse does not use `permissionDecision` — it cannot block. If the hook fails, the failure is logged but the tool call result is not affected.

### Stop Hook

The Stop hook fires after each turn of the conversation ends. Its primary responsibility in v0.5.0 is flushing any pending state changes that have not yet been persisted — for example, if a state update was computed but not written due to a mid-turn crash, the Stop hook ensures it is applied.

`stop_hook_active` in the stdin payload must be checked at the start of every Stop hook. If true, the hook exits immediately with a zero exit code and empty output. Claude Code sets `stop_hook_active` when a Stop hook triggers another Stop hook — the reentrance guard prevents cascading. Omitting this check causes infinite loops that stall the session.

The Stop hook is a safety net, not the primary persistence mechanism. Events are written to `gobbi.db` during the turn as they occur. The Stop hook only handles the case where a turn ended with pending state that was not flushed inline.

---

## Hook-to-CLI Delegation

> **Hooks are thin wrappers. All logic lives in the CLI.**

Each hook is a minimal shell script or binary that reads stdin and delegates to a `gobbi` CLI command. The hook itself contains no guard logic, no state evaluation, and no event writing. This separation ensures that guard conditions and event schemas can be updated by updating the CLI package, without touching the hook scripts that live in `.claude/hooks/`.

The delegation pattern for each hook type:

| Hook event | CLI command |
|------------|-------------|
| PreToolUse | `gobbi workflow guard` |
| SubagentStop | `gobbi workflow capture-subagent` |
| PostToolUse (ExitPlanMode) | `gobbi workflow capture-plan` |
| Stop | `gobbi workflow flush-state` |

Each CLI command reads the full stdin payload, evaluates against the current session state, writes any necessary events, and returns the appropriate JSON response that the hook forwards to stdout. The hook process exits 0 in all cases except unrecoverable startup failures.

This means the hooks registered in `hooks/hooks.json` are stable across releases. The CLI evolves; the hook wiring does not.

---

## Escalating Enforcement

V0.5.0 implements two enforcement levels that reflect different violation severities.

**Soft nudge** — For edge cases that are unusual but not structurally invalid, the PreToolUse hook returns a response that includes `additionalContext` rather than a denial. The tool call proceeds. The orchestrator receives the additional context and can adjust its behavior. This is appropriate when the action is technically within scope but warrants attention — for example, writing to a step directory that does not match the currently active step.

**Hard block** — For structural violations, the hook returns `permissionDecision: "deny"`. The tool does not execute. A `guard.violation` event is written to `gobbi.db`. The `violations` array in `state.json` is updated. The orchestrator receives the denial and the reason.

**Escalation on repeat violations** — The `violations` array in `state.json` tracks every `guard.violation` event. The CLI reads the violation count for a specific guard when generating the next prompt. If the same guard has fired more than a configurable threshold (default 3 times), the CLI escalates — it surfaces a warning to the user via the generated prompt, noting that the orchestrator is repeatedly attempting a blocked action. This is a stagnation signal: the orchestrator is stuck, and human intervention may be needed to resolve the underlying confusion.

---

## Plugin Hook Registration

> **Plugin hooks register via `hooks/hooks.json` only. Do not also declare them in `plugin.json`.**

Claude Code v2.1 and later auto-load `hooks/hooks.json` from the plugin directory. Declaring the same hooks in `plugin.json` causes duplicate detection errors at plugin load time. The hook manifest lives in one place — `hooks/hooks.json`. The `plugin.json` manifest does not contain a `hooks` key.

The timeout for command hooks is 600 seconds by default. Guard checks complete in milliseconds — they read `state.json` and evaluate JsonLogic conditions. Capture hooks may take longer if they process large transcripts, but should complete well within the timeout. A hook that approaches the timeout indicates a design problem — the heavy work should be offloaded to an async queue rather than blocking the hook execution path.

---

## Boundaries

This document covers the two hook categories and their responsibilities, guard hook mechanics (stdin schema, denial mechanism, input modification, specific guard behaviors), capture hook mechanics (SubagentStop, PostToolUse, Stop), hook-to-CLI delegation, escalating enforcement levels, and plugin hook registration.

For the JsonLogic condition language and guard specification format, see `v050-state-machine.md`. For the event types that hooks write and the `state.json` fields they update, see `v050-session.md`. For the CLI commands that hooks delegate to, see `v050-cli.md`.
