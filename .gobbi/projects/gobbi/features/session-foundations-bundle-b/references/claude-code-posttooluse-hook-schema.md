---
title: Claude Code PostToolUse + PostToolUseFailure hook — official input schema + empirical Task tool payload
source: https://code.claude.com/docs/en/hooks
type: docs
accessed: 2026-05-23
session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hook, posttooluse, posttooluse-failure, agent-tool, schema, telemetry]
related: [claude-code-agent-sdk-task-output]
---

# Claude Code PostToolUse + PostToolUseFailure hooks — official schema

## Insight
PostToolUse fires **after a tool call succeeds**; PostToolUseFailure fires **after a tool call fails**. Both pipe a JSON payload to stdin with these fields:
- **Common:** `session_id`, `transcript_path`, `cwd`, `permission_mode`, `effort`, `hook_event_name` (= `"PostToolUse"` or `"PostToolUseFailure"`), optional `agent_id` + `agent_type` (populated when the hook fires inside a subagent).
- **Tool-specific:** `tool_name`, `tool_input` (the input parameters sent to the tool), `tool_use_id` (unique id correlating PreToolUse/PostToolUse pairs), `tool_result` (the result/output; for PostToolUseFailure this carries the failure payload).
- **Recent additions (v2.1.119+):** `duration_ms` — tool execution time excluding permission prompts / PreToolUse hook execution.

Matcher patterns support exact string ("Bash"), pipe-separated alternation ("Edit|Write"), regex ("^Notebook"), and MCP-tool patterns ("mcp__memory__.*"). The matcher pattern `"Task"` is the canonical target for hooks that want to fire after subagent spawns.

The hook's `tool_result` payload schema for Task/Agent calls is documented less rigorously than the common fields. The official `tool_result` example in the docs is a simple `{"type": "text", "text": "..."}`. However, the agent-SDK doc (a sibling doc) describes the **TaskOutput** interface as `{result: string, usage?: {input_tokens, output_tokens}, total_cost_usd?, duration_ms?}` for the Task tool. Multiple secondary sources state empirically that "PostToolUse `tool_response` for a completed Agent call carries the subagent's final text along with usage telemetry." Token usage is at least partially observable; the exact shape depends on Claude Code version.

The hook **also receives `transcript_path`** in every fire — meaning a hook can read the transcript JSONL itself and extract the rich `toolUseResult` payload that Claude Code writes (which contains the full subagent metadata: agentId, agentType, totalDurationMs, totalTokens, totalToolUseCount, usage{input_tokens, cache_creation_input_tokens, cache_read_input_tokens, output_tokens}, toolStats{readCount, searchCount, bashCount, editFileCount, linesAdded, linesRemoved}).

## PostToolUseFailure — verbatim verification (iter2 / iter3)

WebFetched `https://code.claude.com/docs/en/hooks` on 2026-05-23. The official docs page lists `PostToolUseFailure` as one of 31 documented hook events and includes it in two tables:

**Lifecycle table (verbatim):**

> | Event                 | When it fires                                                                                                                                          |
> | :-------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
> | `PostToolUseFailure`  | After a tool call fails                                                                                                                                |

**Exit-code behavior table (verbatim):**

> | Hook event            | Can block? | What happens on exit 2                                                                                               |
> | :-------------------- | :--------- | :----------------------------------------------------------------------------------------------------------------------------------- |
> | `PostToolUseFailure`  | No         | Shows stderr to Claude (tool already failed)                                                                         |

Shell-command hook support is explicitly confirmed: PostToolUseFailure supports the same `type: "command"` registration shape as PostToolUse (alongside HTTP, MCP-tool, prompt, and agent hooks). It is non-blocking — exit code 2 does not prevent the underlying tool failure but does surface the hook's stderr to Claude.

All 31 documented hook events on this page (full enumeration for context):

1. `SessionStart`
2. `Setup`
3. `UserPromptSubmit`
4. `UserPromptExpansion`
5. `PreToolUse`
6. `PermissionRequest`
7. `PermissionDenied`
8. `PostToolUse`
9. `PostToolUseFailure`
10. `PostToolBatch`
11. `Notification`
12. `SubagentStart`
13. `SubagentStop`
14. `TaskCreated`
15. `TaskCompleted`
16. `Stop`
17. `StopFailure`
18. `TeammateIdle`
19. `InstructionsLoaded`
20. `ConfigChange`
21. `CwdChanged`
22. `FileChanged`
23. `WorktreeCreate`
24. `WorktreeRemove`
25. `PreCompact`
26. `PostCompact`
27. `Elicitation`
28. `ElicitationResult`
29. `SessionEnd`

(The page's table lists 31; the enumerated names above cover the explicitly captured events from the same WebFetch.)

## Why it applies
T3 explicitly locked "Sub-step C must verify the hook contract before Sub-step D." This insight is the verification answer:
- The hook fires after every Agent tool call (matcher `"Task"`).
- The hook receives `tool_name`, `tool_input` (subagent_type, prompt, model, description), `tool_result` (basic), and `transcript_path` (the route to the rich payload).
- If hook input alone is insufficient, the hook can `jq` the transcript file to extract the full `toolUseResult` block (proven empirically — see companion reference `claude-code-transcript-tooluseresult-empirical.md`).
- **PostToolUseFailure** is officially supported for shell-command hooks (verbatim quote above), so T3 D-3-3 dual registration (PostToolUse + PostToolUseFailure) is grounded in the official documentation, not in community attestation.

This gives the design a clear path: even if `tool_result` in the hook payload is impoverished, the hook is rich enough because `transcript_path` is always provided. T3's mechanism (c) — hook for real-time append + shell-script reconstructor for repair — is fully supported, and the dual-event (success + failure) registration is officially documented.

## Source
- https://code.claude.com/docs/en/hooks
- https://code.claude.com/docs/en/agent-sdk/hooks
- Both accessed 2026-05-23

## Excerpt
> "PostToolUse | After a tool call succeeds"
> "PostToolUseFailure | After a tool call fails"
> "Common Fields (all hooks): `session_id`, `transcript_path`, `cwd`, `permission_mode`, `effort`, `hook_event_name`. Optional: `agent_id` and `agent_type` (when running in a subagent)."
> "Tool-Specific Fields: `tool_name`, `tool_input`, `tool_use_id`, `tool_result`."
> "**Yes, matchers work for PostToolUse.** You can filter by tool name using patterns… Pipe-separated list `\"Edit|Write\"` | Either tool exactly"
> "PostToolUseFailure | No | Shows stderr to Claude (tool already failed)"

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-23 | 1b26cf20-677b-498c-8c1b-7d7e971597ac | T3 external insight #1 — CP-4.1-β hook contract verification gate CLOSED |
| 2026-05-23 | 1b26cf20-677b-498c-8c1b-7d7e971597ac | iter3 Fix B — verbatim PostToolUseFailure quote added (T3-E-5 grounding) |
