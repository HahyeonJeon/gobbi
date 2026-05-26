---
scope: feature
feature: install-runtime
title: Claude Code transcript JSONL toolUseResult shape (empirical extraction)
source: ~/.claude/projects/-playinganalytics-git-gobbi/7ea62d36-e826-4ce6-9e90-9e948007b068.jsonl
type: code
accessed: 2026-05-23
session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hook, transcript, telemetry, subagent, empirical]
related: [claude-code-posttooluse-hook-schema]
---

# Empirical toolUseResult payload from the prior session's transcript

## Insight
The Claude Code transcript JSONL contains a top-level `toolUseResult` field on every tool-result line corresponding to an Agent (Task) tool call. The shape — empirically verified from the prior session's transcript at line 165 — is:

```json
{
  "status": "completed",
  "prompt": "<full delegation prompt text passed to the subagent>",
  "agentId": "<subagent session id>",
  "agentType": "leader" | "executor" | "evaluator" | "assistant",
  "content": [{"type": "text", "text": "<subagent's final response>"}],
  "totalDurationMs": <number>,
  "totalTokens": <number>,
  "totalToolUseCount": <number>,
  "usage": {
    "input_tokens": <number>,
    "cache_creation_input_tokens": <number>,
    "cache_read_input_tokens": <number>,
    "output_tokens": <number>,
    "server_tool_use": {...},
    "service_tier": "standard",
    "cache_creation": {"ephemeral_1h_input_tokens": <number>, "ephemeral_5m_input_tokens": <number>},
    "inference_geo": "",
    "iterations": [...],
    "speed": "standard"
  },
  "toolStats": {
    "readCount": <number>,
    "searchCount": <number>,
    "bashCount": <number>,
    "editFileCount": <number>,
    "linesAdded": <number>,
    "linesRemoved": <number>,
    "otherToolCount": <number>
  }
}
```

Method: read `$CLAUDE_TRANSCRIPT_PATH` JSONL, find the line where `toolUseResult.agentId == <subagent-id>` (or correlate by `tool_use_id` against the preceding tool_use line), extract every field above. Every field in `session.template.json.agents[]` is satisfiable from this single payload:

| session.template.json field | toolUseResult source |
|---|---|
| `id` | `agentId` |
| `name` | derive from `agentType` + spawn description (in tool_input.description) |
| `type` | `agentType` |
| `step` / `phase` / `iter` | NOT in toolUseResult — must be supplied by the manager via the delegation prompt's metadata OR reconstructed by parsing the prompt body |
| `model` | NOT in toolUseResult — must be supplied from the `tool_use.input.model` field (line 164 in the transcript) |
| `system` | always `claude-code` for native Agent calls; `codex` for codex tool calls |
| `transcriptPath` | the parent session's transcriptPath (subagent transcripts live as sidechain entries in the same JSONL — flagged via `isSidechain: true`) |
| `tokensUsed.input` | `usage.input_tokens` |
| `tokensUsed.output` | `usage.output_tokens` |
| `tokensUsed.cacheRead` | `usage.cache_read_input_tokens` |
| `tokensUsed.cacheCreation` | `usage.cache_creation_input_tokens` |
| `startedAt` | timestamp of the preceding tool_use line (line 164) |
| `finishedAt` | timestamp of the tool_result line (line 165) |

## Why it applies
T3 mechanism (c) = PostToolUse hook + shell-script reconstructor. Both consume from the same authoritative source (transcript JSONL `toolUseResult`). The hook reads the transcript at fire time (using `$CLAUDE_TRANSCRIPT_PATH` from its stdin), the reconstructor reads at session-end time. The schema gaps surfaced above (`step`, `phase`, `iter`, `model`) inform the design of the delegation prompt structure (these fields must be parseable from the prompt body — e.g., the leader prompt's first three lines already include "Your phase: ideation", "Your iteration: 1", "Your sub-step: C").

## Source
- File: `~/.claude/projects/-playinganalytics-git-gobbi/7ea62d36-e826-4ce6-9e90-9e948007b068.jsonl`
- Lines: 164 (tool_use), 165 (tool_result with toolUseResult), 166-167 (post-tool turns)
- Extracted via direct empirical inspection 2026-05-23

## Excerpt
> Line 165 toolUseResult.usage block:
> `{"input_tokens": 1, "cache_creation_input_tokens": 593, "cache_read_input_tokens": 215214, "output_tokens": 2023, "server_tool_use": {...}, "service_tier": "standard", "cache_creation": {"ephemeral_1h_input_tokens": 0, "ephemeral_5m_input_tokens": 593}, "speed": "standard"}`
>
> Line 165 toolUseResult.toolStats:
> `{"readCount": 24, "searchCount": 0, "bashCount": 39, "editFileCount": 1, "linesAdded": 456, "linesRemoved": 0, "otherToolCount": 0}`

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-23 | 1b26cf20-677b-498c-8c1b-7d7e971597ac | T3 external insight #2 — empirical verification of the transcript's full payload; closes CP-4.1-β by demonstrating per-spawn metadata IS observable |
