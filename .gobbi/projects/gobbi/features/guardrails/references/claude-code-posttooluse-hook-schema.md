---
name: claude-code-posttooluse-hook-schema
description: PostToolUse and PostToolUseFailure hook official input schema; transcript_path is always provided and gives access to the full subagent toolUseResult payload.
type: references
scope: feature
feature: guardrails
status: active
created: 2026-05-23
session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hook, posttooluse, posttooluse-failure, agent-tool, schema, telemetry]
title: Claude Code PostToolUse + PostToolUseFailure hook — official input schema + empirical Task tool payload
source: https://code.claude.com/docs/en/hooks
accessed: 2026-06-01
ref_type: docs
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

## Related

- [`../../install-runtime/references/claude-code-transcript-tooluseresult-empirical.md`](../../install-runtime/references/claude-code-transcript-tooluseresult-empirical.md) (the empirical transcript-shape companion — the verbatim `toolUseResult` JSONL payload captured during the guardrails Ideation, which grounds the "verified empirically" claim in the Why-it-applies section)
- `claude-code-hooks-12-lifecycle-events.md` (the companion reference covering the broader hook lifecycle-event landscape)
- `../../../archive/checklists/2026-06-01-hook-event-count-31-vs-29-docs-sync.md` and `../../../archive/backlogs/2026-06-01-hook-event-count-31-vs-29-docs-sync.md` (the tracked docs-sync item — resolved 2026-06-01; count corrected to **30** via commit 84521bc + iter2 remediation; archived at Wrap-up)
- `../../../archive/backlogs/2026-06-01-posttooluse-failure-webfetch-verification-gap.md` (the deferred empirical re-verification of the verbatim quotes — resolved 2026-06-01; both quotes confirmed verbatim; archived at Wrap-up)

## PostToolUseFailure — verbatim verification

WebFetched `https://code.claude.com/docs/en/hooks` on 2026-05-23. The official docs page lists `PostToolUseFailure` as one of **30** documented hook events and includes it in two tables (re-verified 2026-06-01; both quotes below still match the live page verbatim):

**Lifecycle table (verbatim):**

> | Event                 | When it fires                                                                                                                                          |
> | :-------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
> | `PostToolUseFailure`  | After a tool call fails                                                                                                                                |

**Exit-code behavior table (verbatim):**

> | Hook event            | Can block? | What happens on exit 2                                                                                               |
> | :-------------------- | :--------- | :----------------------------------------------------------------------------------------------------------------------------------- |
> | `PostToolUseFailure`  | No         | Shows stderr to Claude (tool already failed)                                                                         |

Shell-command hook support is explicitly confirmed: PostToolUseFailure supports the same `type: "command"` registration shape as PostToolUse (alongside HTTP, MCP-tool, prompt, and agent hooks). It is non-blocking — exit code 2 does not prevent the underlying tool failure but does surface the hook's stderr to Claude.

All **30** documented hook events on this page (full enumeration, re-verified 2026-06-01):

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
12. `MessageDisplay`
13. `SubagentStart`
14. `SubagentStop`
15. `TaskCreated`
16. `TaskCompleted`
17. `Stop`
18. `StopFailure`
19. `TeammateIdle`
20. `InstructionsLoaded`
21. `ConfigChange`
22. `CwdChanged`
23. `FileChanged`
24. `WorktreeCreate`
25. `WorktreeRemove`
26. `PreCompact`
27. `PostCompact`
28. `Elicitation`
29. `ElicitationResult`
30. `SessionEnd`

(The live lifecycle table lists 30 events, re-verified 2026-06-01; the enumeration above is complete. The only net change since the 2026-05-23 capture is the addition of `MessageDisplay` at position 12.)

## Why it applies
The subagent-telemetry hook design explicitly required verifying the hook contract before committing to the mechanism. This insight is the verification answer:
- The hook fires after every Agent tool call (matcher `"Task"`).
- The hook receives `tool_name`, `tool_input` (subagent_type, prompt, model, description), `tool_result` (basic), and `transcript_path` (the route to the rich payload).
- If hook input alone is insufficient, the hook can `jq` the transcript file to extract the full `toolUseResult` block (verified empirically during the guardrails Ideation — the captured verbatim payload lives in [`../../install-runtime/references/claude-code-transcript-tooluseresult-empirical.md`](../../install-runtime/references/claude-code-transcript-tooluseresult-empirical.md): the transcript JSONL carries the rich subagent metadata enumerated in the Insight section above).
- **PostToolUseFailure** is officially supported for shell-command hooks (verbatim quote above), so the dual registration (PostToolUse + PostToolUseFailure) is grounded in the official documentation, not in community attestation.

This gives the design a clear path: even if `tool_result` in the hook payload is impoverished, the hook is rich enough because `transcript_path` is always provided. The design's mechanism — a hook for real-time append plus a shell-script reconstructor for repair — is fully supported, and the dual-event (success + failure) registration is officially documented.

## Source
- https://code.claude.com/docs/en/hooks — accessed 2026-05-23, re-verified 2026-06-01
- https://code.claude.com/docs/en/agent-sdk/hooks — accessed 2026-05-23

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
| 2026-05-23 | 1b26cf20-677b-498c-8c1b-7d7e971597ac | Closed the hook-contract verification gate for the PostToolUse-based subagent telemetry design |
| 2026-05-23 | 1b26cf20-677b-498c-8c1b-7d7e971597ac | Added the verbatim PostToolUseFailure quote to ground the dual-event hook registration in the official docs |
| 2026-06-01 | 34563fb4-361d-4348-aa75-8bc9f1fbff05 | Re-verified the hook contract: both PostToolUseFailure quotes still match verbatim; corrected the event count 31→30 and added MessageDisplay |
