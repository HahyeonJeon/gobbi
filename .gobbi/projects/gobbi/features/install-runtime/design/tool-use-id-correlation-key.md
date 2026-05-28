---
name: tool-use-id-correlation-key
description: tool_use_id is the correlation key for matching hook stdin to transcript toolUseResult lines; always available in hook stdin and consistent for reconstructor walk.
type: design
scope: feature
feature: install-runtime
status: locked
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hooks, transcript, correlation, tool-use-id]
design-id: D-3-6
---

# Transcript correlation key: tool_use_id

## Context

Both the hook and the reconstructor must match a Task spawn (its input-side `tool_use` line) to the subagent's result (its `toolUseResult` line) in the transcript JSONL. An early evaluation finding flagged that the design said "read the transcript line by `tool_use_id`" without specifying the exact jq path. A single, always-available correlation key was needed.

## Decision

The hook uses `tool_use_id` from its stdin to locate the matching transcript lines. Two jq lookup paths:

1. **Locate the tool_use line** (input side):
   ```
   jq -r '.message.content[]? | select(.type == "tool_use" and .id == $tool_use_id)'
   ```

2. **Locate the toolUseResult line** (result side):
   ```
   jq -r '. | select(.toolUseResult != null) | select(.message.content[]?.tool_use_id == $tool_use_id)'
   ```

**Reconstructor** walks the JSONL in order; for each `tool_use` line where `tool_input.subagent_type` is non-null (Task spawn), finds the corresponding `toolUseResult` line later in the file by `tool_use_id` match.

## Rationale

A first-iteration Codex finding flagged that the design said "read transcript line by `tool_use_id`" without the exact jq path. The hook always has `tool_use_id` in its stdin; the reconstructor has both keys (`tool_use_id` and `toolUseResult.agentId`) available from the transcript. Using `tool_use_id` is the always-available, hook-consistent key.

Supporting evidence anchored at decision time: the first-iteration Codex finding (the missing exact jq path); the transcript `toolUseResult` empirical reference under `references/`; and empirical stdin and transcript inspection confirming `tool_use_id` availability.

## Alternatives considered

- Correlate by `toolUseResult.agentId` only — rejected: hook stdin does not contain `agentId` directly; `tool_use_id` is always available.
- Time-based correlation (newest line) — rejected: race-prone if transcript flush lags.

## Consequences

- Both the hook (stdin correlation) and the reconstructor (transcript walk) use `tool_use_id` as the join key, with the two jq lookup paths above.
- Validation obligation: a single-script verifier on a fixture transcript asserting the jq path returns exactly one line for a known `tool_use_id` and zero lines for an unknown id.

## Related

- `metadata-extraction-input-vs-result.md` — the input-vs-result split this key joins together.
- `reconstructor-verify-and-fix.md` — the reconstructor whose transcript walk uses this key.
- `references/claude-code-transcript-tooluseresult-empirical.md` — the empirical transcript reference.

## Source

The full design narrative is preserved in the project session journal `notes/2026-05-24-session-foundations-bundle-b.md` (the session that designed and shipped the PostToolUse hook architecture).
