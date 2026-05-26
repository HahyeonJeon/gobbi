---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
scope: feature
feature: install-runtime
design-id: D-3-6
slug: d-3-6-correlation-key
status: locked
iter: 2
---

# D-3-6 — Transcript correlation key: tool_use_id

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

iter1 COD-STRUCT-003 flagged that iter1 design said "read transcript line by `tool_use_id`" without the exact jq path. The hook always has `tool_use_id` in its stdin; the reconstructor has both keys (`tool_use_id` and `toolUseResult.agentId`) available from the transcript. Using `tool_use_id` is the always-available, hook-consistent key.

## Anchored insights

iter1 COD-STRUCT-003, `staging/references/claude-code-transcript-tooluseresult-empirical.md:50`, T3-E-1, T3-E-2.

## Trade-offs considered

- Correlate by `toolUseResult.agentId` only — rejected: hook stdin does not contain `agentId` directly; `tool_use_id` is always available
- Time-based correlation (newest line) — rejected: race-prone if transcript flush lags

## Validation

Single-script verifier with fixture transcript: assert jq path returns exactly one line for a known `tool_use_id`; assert returns zero lines for an unknown id.

## Implementation checklist anchor

T3-I-T3.a (hook), T3-I-T3.b (reconstructor)

## Source

`rawdata/draft-iter3.md:408-418` (D-3-6 narrative)
