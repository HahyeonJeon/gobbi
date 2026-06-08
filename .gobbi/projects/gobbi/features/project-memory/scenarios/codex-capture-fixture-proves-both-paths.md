---
name: codex-capture-fixture-proves-both-paths
description: Scenario gap — task 03 verify must test both the codex exec stdout parsing path and the rollout fallback path, not just key presence
type: scenarios
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [codex, verification, hooks]
---

# Codex capture verify must prove both stdout and rollout-fallback paths

## Scenario

Task 03 adds codex token capture (parse `codex exec` stdout 'tokens used' line, fallback to rollout `token_count` event). The verify must prove both paths work — not just that the keys exist in the template. If only key presence is checked, `usage.codex.total` can be present but always zero or always wrong.

Codex USAGE-003 (Usage, checklist_gap, High, Confidence 100) flagged that task 03's iter1 verify had no fixture for stdout parsing or rollout fallback.

## Checklist

| # | Item | Status | Verification |
|---|---|---|---|
| 1 | Feeding a captured codex stdout 'tokens used\n24,009' line produces usage.codex.total == 24009 (comma-stripped, nonzero) | implemented | task 03 verify fixture asserts exact value |
| 2 | Rollout-fallback path on a fixture rollout jsonl yields nonzero usage.codex.total | implemented | task 03 verify includes rollout fixture assertion |
| 3 | usage.grandTotal == usage.sessionTotal + usage.codex.total arithmetic verified | implemented | task 03 verify asserts grandTotal arithmetic |

## Status notes

Addressed in iter2: task 03's verify was extended with fixtures for the stdout `tokens used` parse (exact value 24009) and the rollout fallback (nonzero), plus the grandTotal arithmetic.
