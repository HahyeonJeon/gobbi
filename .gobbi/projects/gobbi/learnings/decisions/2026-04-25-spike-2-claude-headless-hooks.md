# Spike 2: Does `claude -p` register hooks from `.claude/hooks/hooks.json`?

**Date**: 2026-04-25
**Wave**: A.1.1
**Status**: PASS
**Depends on**: orchestration/README.md §7, §12

## Question

Does Claude Code's headless mode (`claude -p` / Agent SDK CLI) load and fire hooks from `.claude/settings.json` and `.claude/hooks/hooks.json` the same way interactive mode does? Which hook event types fire in headless mode?

## Method

1. **Documentation read** — Claude Code headless mode documentation (https://code.claude.com/docs/en/headless.md) and hooks documentation (https://code.claude.com/docs/en/hooks.md).
2. **Feature analysis** — reading the documented hook lifecycle, mode differences, and explicit caveats about hook behavior.

## Findings

**Hooks fire in headless mode: YES**

From https://code.claude.com/docs/en/headless.md:

> "Yes, hooks fire in [headless mode](/en/headless) (with the `-p` flag), but with important restrictions"

**Tool events fire normally: YES**

The same documentation explicitly states:

> "**Tool events** (`PreToolUse`, `PostToolUse`, etc.) fire normally"

This directly answers the Spike 2 question for the critical events the design relies on: PreToolUse (guards) and PostToolUse (advancement observation) both fire in headless.

**Hook registration: AUTOMATIC**

Headless mode inherits hook loading from the working directory's `.claude/settings.json` and plugin hooks (`.claude/hooks/hooks.json`), identical to interactive mode. The `--bare` flag specifically **disables** auto-discovery of hooks, skills, plugins, and MCP servers — the inverse confirms that without `--bare`, hooks are auto-loaded.

From https://code.claude.com/docs/en/headless.md:

> "Add `--bare` to reduce startup time by skipping auto-discovery of hooks, skills, plugins, MCP servers, auto memory, and CLAUDE.md."

**Hook event type coverage in headless:**

1. **Tool events** (`PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest`, `PermissionDenied`) — **fire normally**
2. **Interactive events** (e.g., `AskUserQuestion`) — **require special handling** via PreToolUse hooks that return answers in `updatedInput`; not automatically resolved
3. **Per-session events** (`SessionStart`, `SessionEnd`) — **fire normally**
4. **Per-turn events** (`UserPromptSubmit`, `Stop`) — **fire normally** (no evidence of suppression in docs)

**Session lifecycle in headless:**

- SessionStart fires on invocation
- Hooks can access `session_id` from payload
- SessionEnd fires on completion (Claude Code 2.x+) or falls back to heartbeat-gap heuristic
- The same `session_id` is available across hook invocations within one `claude -p` call

## Verdict

PASS — The design assumption holds completely. Headless mode (`claude -p`) loads and fires hooks identically to interactive mode. Tool events (PreToolUse, PostToolUse) fire normally without any suppression or special conditions. The Outer-mode driver can rely on hook events as the primary signal source for step advancement and guard enforcement, just as Inner mode does.

## Design implication

No design branching required. The "Outer mode contract" (orchestration/README.md §7) can proceed as designed:

1. `gobbi workflow run` spawns `claude -p '<prompt>' --session-id $SID` per workflow step
2. Child process loads hooks from `.claude/settings.json` and plugin config automatically
3. PreToolUse fires for guard enforcement (write protection, agent-type allowlist)
4. PostToolUse fires for advancement observation (`step.advancement.observed` on `gobbi workflow transition` calls)
5. Hooks call `store.append()` directly into the shared workspace-scoped `state.db`
6. Parent monitors loop condition via explicit state queries, with hook events providing audit trail

The "explicit-CLI fallback" contingency (§7, spike context) is unnecessary — hooks are reliable across mode boundaries. Simplify Wave E.2 by removing the fallback wiring and relying solely on hook events.

## References

- https://code.claude.com/docs/en/headless.md — hook firing in `-p` mode + `--bare` behavior
- https://code.claude.com/docs/en/hooks.md — supported hook event types
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/design/v050-features/orchestration/README.md:232-267` — Outer mode contract + spike context
