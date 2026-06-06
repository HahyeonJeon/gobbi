---
name: claude-code-transcript-tooluseresult-empirical
description: Empirical extraction of toolUseResult payload shape from Claude Code transcript JSONL
type: references
scope: feature
feature: install-runtime
status: active
created: 2026-05-23
session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hook, transcript, telemetry, subagent, empirical]
related: [claude-code-posttooluse-hook-schema]
title: Claude Code transcript JSONL toolUseResult shape (empirical extraction)
source: ~/.claude/projects/-playinganalytics-git-gobbi/7ea62d36-e826-4ce6-9e90-9e948007b068.jsonl
accessed: 2026-05-23
ref_type: code
---

# Empirical toolUseResult payload — Claude Code transcript JSONL shape

## Insight
The Claude Code transcript JSONL contains a top-level `toolUseResult` field on every tool-result line corresponding to an Agent (Task) tool call. The shape — empirically verified from a real session transcript — is:

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
| `tokensUsed.input` (cumulative) | Σ `message.usage.input_tokens` over the agent's OWN transcript `${transcript%.jsonl}/subagents/agent-<agentId>.jsonl` (manager: main transcript, `isSidechain==false`) |
| `tokensUsed.output` (cumulative) | Σ `message.usage.output_tokens` over the same file |
| `tokensUsed.cacheRead` (cumulative) | Σ `message.usage.cache_read_input_tokens` over the same file |
| `tokensUsed.cacheCreation` (cumulative) | Σ `message.usage.cache_creation_input_tokens` over the same file |
| `tokensUsed.total` (cumulative) | `input + output + cacheRead + cacheCreation` |
| `startedAt` | timestamp of the preceding tool_use line (line 164) |
| `finishedAt` | timestamp of the tool_result line (line 165) |

The parent `toolUseResult` is used ONLY to enumerate spawns (`agentId` / `agentType` / `tool_use_id`); its `usage` is the FINAL turn only and its `totalTokens` is a different, smaller headline metric — neither is the cumulative figure. The cumulative `tokensUsed` is summed from each agent's OWN transcript. Earlier drafts mapped `tokensUsed ← toolUseResult.usage.*`, which captured only the last turn — corrected to the own-transcript sum above (session 06668274).

## Related

- [`../design/metadata-extraction-input-vs-result.md`](../design/metadata-extraction-input-vs-result.md) — design topic for which `agents[]` fields come from the prompt (input) side versus this transcript (result) side
- [`../design/reconstructor-verify-and-fix.md`](../design/reconstructor-verify-and-fix.md) — the reconstructor that reads this same `toolUseResult` payload at session-end to backfill missed `agents[]` entries
- [`../../guardrails/references/claude-code-posttooluse-hook-schema.md`](../../guardrails/references/claude-code-posttooluse-hook-schema.md) — the PostToolUse hook schema reference this payload shape complements (also named in frontmatter `related`)

## Why it applies
The PostToolUse hook and shell-script reconstructor both consume from the same authoritative source (transcript JSONL `toolUseResult`). The hook reads the transcript at fire time (using `$CLAUDE_TRANSCRIPT_PATH` from its stdin), the reconstructor reads at session-end time. The schema gaps surfaced above (`step`, `phase`, `iter`, `model`) inform the design of the delegation prompt structure (these fields must be parseable from the prompt body — e.g., the leader prompt's first three lines already include "Your phase: ideation", "Your iteration: 1", "Your sub-step: C"). This reference demonstrates empirically that per-spawn metadata IS observable from the transcript.

## Source
- File: `~/.claude/projects/-playinganalytics-git-gobbi/7ea62d36-e826-4ce6-9e90-9e948007b068.jsonl`
- Extracted via direct empirical inspection 2026-05-23

## Excerpt
> toolUseResult.usage block (representative values):
> `{"input_tokens": 1, "cache_creation_input_tokens": 593, "cache_read_input_tokens": 215214, "output_tokens": 2023, "server_tool_use": {...}, "service_tier": "standard", "cache_creation": {"ephemeral_1h_input_tokens": 0, "ephemeral_5m_input_tokens": 593}, "speed": "standard"}`
>
> toolUseResult.toolStats:
> `{"readCount": 24, "searchCount": 0, "bashCount": 39, "editFileCount": 1, "linesAdded": 456, "linesRemoved": 0, "otherToolCount": 0}`

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-23 | 1b26cf20-677b-498c-8c1b-7d7e971597ac | Empirical verification of the transcript's full payload — grounded hook and reconstructor design decisions |
