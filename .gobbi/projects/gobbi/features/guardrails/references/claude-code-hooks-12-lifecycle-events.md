---
scope: feature
feature: guardrails
title: Claude Code 12+ hook lifecycle events including SubagentStop
source: https://claudefa.st/blog/tools/hooks/hooks-guide
type: blog
accessed: 2026-05-23
session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hook, lifecycle, subagent-stop, subagent-start]
related: [claude-code-posttooluse-hook-schema, claude-code-agent-sdk-task-output]
---

# Claude Code lifecycle events for hooks

## Insight
Claude Code now provides 12+ hook lifecycle events. The relevant ones for subagent telemetry are:

| Event | Triggers when | Available for shell command hooks (.claude/settings.json)? |
|---|---|---|
| `PreToolUse` | A tool call is about to fire | Yes |
| `PostToolUse` | A tool call succeeded | Yes |
| `PostToolUseFailure` | A tool call failed | Yes |
| `SubagentStart` | Subagent initialization | SDK only (Python + TypeScript) |
| `SubagentStop` | Subagent completion | SDK only — Stop hooks are automatically converted to SubagentStop when running inside a subagent |
| `SessionStart` | Session initialization | TypeScript SDK or `.claude/settings.json` shell command |
| `SessionEnd` | Session termination | TypeScript SDK or `.claude/settings.json` shell command (Python SDK lacks this) |

PostToolUse + the matcher pattern `"Task"` is the shell-command-hook-compatible path for "fire after every Agent spawn." `SubagentStop` is a richer event but is SDK-only, which means it requires running gobbi through the agent SDK rather than the standalone Claude Code CLI — a heavier integration than the current `.claude/settings.json` `hooks.*` configuration model.

A v2.1.119 addition: `PostToolUse` and `PostToolUseFailure` hook inputs now include `duration_ms` — tool execution time excluding permission prompts and PreToolUse hook execution.

## Why it applies
T3 picks PostToolUse + matcher `"Task"` as the mechanism. This reference establishes:
1. PostToolUse is the **shell-command-compatible** event for subagent completion telemetry — consistent with the existing `session-start.sh` shell-script precedent.
2. SubagentStop is a richer alternative but requires SDK integration that gobbi does not currently use — out of scope.
3. PostToolUse has matured (v2.1.119 added `duration_ms`) — the schema is in active evolution, so the hook script should be defensive about field availability.
4. `PostToolUseFailure` is the parallel event for failed tool calls — the hook design should consider whether failed subagent spawns also populate `agents[]` (probably yes, with a `status` field reflecting failure).

## Source
- https://claudefa.st/blog/tools/hooks/hooks-guide
- https://code.claude.com/docs/en/hooks (referenced)
- Both accessed 2026-05-23

## Excerpt
> "PostToolUse duration (v2.1.119): PostToolUse and PostToolUseFailure hook inputs now include duration_ms — tool execution time in milliseconds, excluding time spent in permission prompts and PreToolUse hook execution, available on both PostToolUse and PostToolUseFailure hooks."
> "For subagents, Stop hooks are automatically converted to SubagentStop since that is the event that fires when a subagent completes."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-23 | 1b26cf20-677b-498c-8c1b-7d7e971597ac | T3 external insight #4 — lifecycle landscape; rules out SubagentStop for shell-command path; flags PostToolUseFailure for failed-spawn coverage |
