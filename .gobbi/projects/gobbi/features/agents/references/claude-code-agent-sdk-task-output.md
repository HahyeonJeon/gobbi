---
title: Claude Agent SDK TaskOutput interface — documented Task-tool result shape
source: https://code.claude.com/docs/en/agent-sdk/hooks
type: docs
accessed: 2026-05-23
session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hook, task-tool, sdk, schema]
related: [claude-code-posttooluse-hook-schema, claude-code-transcript-tooluseresult-empirical]
---

# Claude Agent SDK TaskOutput interface

## Insight
The Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`) defines a TypeScript-typed `TaskOutput` interface for what the Task tool returns. Per secondary documentation references summarizing the type definitions:

```typescript
interface TaskOutput {
  result: string;              // Final text response from subagent
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
  total_cost_usd?: number;
  duration_ms?: number;
}
```

This is the **public-API documented** shape — narrower than the empirically-observed `toolUseResult` payload in the transcript (which adds `agentId`, `agentType`, `cache_read_input_tokens`, `cache_creation_input_tokens`, `toolStats`, etc.). The implication: the runtime captures more telemetry than the public API formally exposes. The transcript is the source of truth for total observability; the public API is the source of truth for forward compatibility.

Subagent-context fields `agent_id` and `agent_type` are also in the hook input — populated when the hook fires inside a subagent. In TypeScript, on the base hook input. In Python, only on PreToolUse / PostToolUse / PostToolUseFailure inputs.

There is also a `SubagentStop` hook event (separate from `PostToolUse` on the Task tool) which fires when a subagent completes — input includes `agent_id` + `agent_transcript_path` + `stop_hook_active`. This is a parallel mechanism the T3 design could consider, though it requires SDK-level configuration (not shell-command hooks via `.claude/settings.json` `hooks.*`).

## Why it applies
T3's design needs to choose between:
- (a) reading `tool_result` directly from the hook stdin (TaskOutput shape — narrow but stable),
- (b) reading the rich `toolUseResult` from the transcript file (rich but version-dependent), or
- (c) using `SubagentStop` instead of `PostToolUse` (different lifecycle event, different schema).

This reference establishes (a) as the public-stable surface and (b) as the empirical-rich surface. The recommended pattern is: use (b) for richness, write the hook to be resilient to schema drift (read defensively with `jq`'s `// "fallback"` defaults), and treat (a) as the contract baseline for forward compat.

## Source
- https://code.claude.com/docs/en/agent-sdk/hooks
- https://gist.github.com/johnlindquist/d22c70fd70660b4f6fb4d0b05d0792d2
- Both accessed 2026-05-23

## Excerpt
> "interface TaskOutput { result: string; usage?: { input_tokens: number; output_tokens: number; }; total_cost_usd?: number; duration_ms?: number; }"
> "`agent_id` and `agent_type` are populated when the hook fires inside a subagent. In TypeScript, these are on the base hook input and available to all hook types."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-23 | 1b26cf20-677b-498c-8c1b-7d7e971597ac | T3 external insight #3 — public-API documented Task tool output shape; informs forward-compat for the hook |
