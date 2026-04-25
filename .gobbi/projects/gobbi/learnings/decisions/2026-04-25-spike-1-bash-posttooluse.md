# Spike 1: Does Bash PostToolUse fire for `gobbi workflow transition`?

**Date**: 2026-04-25
**Wave**: A.1.1
**Status**: PASS
**Depends on**: orchestration/README.md §3.5, §12

## Question

Does Claude Code's PostToolUse hook fire after Bash tool calls? Does the matcher support filtering by tool name (`Bash`)? Can the hook script inspect the command text, or does it rely on hook payload introspection?

## Method

1. **Documentation read** — Claude Code hooks documentation (https://code.claude.com/docs/en/hooks.md).
2. **Codebase inspection** — gobbi's existing PostToolUse hook wiring in `.claude/settings.json`, `plugins/gobbi/hooks/hooks.json`, and `packages/cli/src/commands/workflow/capture-planning.ts`.
3. **Configuration review** — matcher shape and filter semantics in existing hook registrations.

## Findings

**PostToolUse fires for Bash: YES**

From https://code.claude.com/docs/en/hooks.md:

> "**Yes**, `PostToolUse` fires for **all** tools including Bash. It runs immediately after a tool completes **successfully**."

The documentation provides an example payload showing `tool_name: "Bash"` with `tool_input.command`.

**Matcher support for tool name: YES**

The hooks documentation states:

> "For tool events (`PreToolUse`, `PostToolUse`, etc.), matchers filter by **tool name**"

And confirms the matcher format:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [...]
      }
    ]
  }
}
```

**Hook script can inspect command text: YES (via hook payload)**

The hook payload includes `tool_input` as a JSON object containing the command. The hook script receives the full PostToolUse payload on stdin (per `capture-planning.ts:1-22`). The hook script can read `$CLAUDE_HOOK_PAYLOAD` or stdin and extract `tool_input.command` to decide whether it matches `gobbi workflow transition`.

**Gobbi's existing proof:**

- `.claude/settings.json:62-72` registers PostToolUse with `matcher: "ExitPlanMode"` (a tool-name or custom-trigger matcher)
- `packages/cli/src/commands/workflow/capture-planning.ts:50-58` defines `PostToolUsePayload` with `tool_input` access
- The hook is triggered by Claude Code's `ExitPlanMode` tool, demonstrating that tool-name matchers work

## Verdict

PASS — The design assumption holds completely. PostToolUse fires for Bash, matchers support tool-name filtering, and the hook script receives the full command text in the payload. The `step.advancement.observed` synthetic event can be reliably sourced from a PostToolUse hook matching `Bash` calls where `tool_input.command` starts with `gobbi workflow transition`.

## Design implication

No design branching required. Proceed with the PostToolUse hook as specified in §3.5 of the orchestration design. The hook:
1. Receives `tool_name: "Bash"` + `tool_input.command` via PostToolUse payload
2. Matches command text against the `gobbi workflow transition` prefix
3. Calls `store.append()` directly with `step.advancement.observed` event
4. Uses `tool_call_id` as idempotency key to deduplicate across hook retries

The direct `store.append()` pattern (bypassing the reducer) is sound — documented at orchestration/README.md:144.

## References

- https://code.claude.com/docs/en/hooks.md — PostToolUse fire + matcher syntax
- `/playinganalytics/git/gobbi/.claude/settings.json:62-72` — existing PostToolUse hook config
- `/playinganalytics/git/gobbi/packages/cli/src/commands/workflow/capture-planning.ts:50-78` — hook payload parsing
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/design/v050-features/orchestration/README.md:140-150` — spike context
