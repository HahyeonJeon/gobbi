---
name: safety-gate-count-asymmetry
description: evaluation.md names six safety-gate sites but auto-mode §7.3/§7.4 enumerate only three headline gates — a §7-only reader could under-count without cross-referencing evaluation.md
type: backlogs
scope: feature
feature: workflow
status: active
created: 2026-06-08
session: 422308da-f2c4-41a4-8ee3-adc89acde977
tags: [docs-sync, prose-polish, auto-mode, evaluation]
priority: low
disposition: open
---

# Reconcile safety-gate count between evaluation.md and auto-mode §7

## What

`evaluation.md` (commit 5e8e39d) explicitly names six safety-gate sites. `auto-mode.md` §7.3 and §7.4 (commit 594b654) enumerate only three headline safety gates. A reader who reads only §7 without cross-referencing `evaluation.md` could under-count the safety gates (seeing 3 instead of 6).

The six sites in evaluation.md are: same-symptom-different-root-cause (line ~111), Major divergence note (after table ~line 123), any-FAIL note (after table ~line 141), degraded one-fails (line ~200), both-fail (line ~202), cost-budget (line ~203).

## Why deferred

Both evaluators deferred this at Execution iter1 (Claude Low/50, Codex implicit PASS). The asymmetry is intentional by design: §7 gives the Auto-mode reader the operative rule; `evaluation.md` is the authoritative full list. Non-gating.

## Suggested fix

Add a parenthetical to §7.3 or §7.4 such as "(six total — see evaluation.md § Cross-System Reconciliation for the complete list)" to help a §7-only reader not under-count.

## Verification

After fix: §7.3 or §7.4 in `auto-mode.md` should reference the six-gate count or link evaluation.md's full list. No behavior change.
