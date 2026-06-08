---
name: hook-task-verify-proves-computation-source
description: Checklist gap — hook task verifies must prove the computation source changed, not just that a field is nonzero
type: checklists
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [hooks, test, verification]
scenario: hook-token-computation-correctness
item_status: implemented
anchor: novel
implemented_in: sessions/2026-06-08-c7673705-2d69-4be8-9bd4-436c3eb91be2/planning/rawdata/draft-iter1.md
---

# Hook task verify checklist — computation source correctness

## What

When a hook task changes WHERE a value is computed (not merely WHETHER it is present), the verify gate must prove the new computation path by asserting equality against an independently-computed reference, not by checking that the value is nonzero.

## Why

The headline defect (`session 422308da` shipped wrong totals that were nonzero but computed from the wrong source) is exactly the class a `> 0` gate lets through. The fix's correctness is only provable by showing the computed value equals the independently-summed reference.

Two evaluator systems independently identified this gap (Claude STR-1, Confidence 75, Medium; Codex USAGE-002, Confidence 100, High) when reviewing task 02's verify.

## Verification

For any task that changes a token-counting source in a hook or script, the verify must include:
```bash
[ "$(jq -r '.agents[N].tokensUsed.total' fixture.json)" = \
  "$(agent-token-usage.sh <own-transcript>.jsonl | jq -r .total)" ]
```
This proves cumulative own-transcript summing, not a final-turn or fabricated read.

## Status notes

Addressed in iter2: task 02's verify was strengthened with the equality assertion against `agent-token-usage.sh` output. The checklist item is `implemented` for this session's plan.
