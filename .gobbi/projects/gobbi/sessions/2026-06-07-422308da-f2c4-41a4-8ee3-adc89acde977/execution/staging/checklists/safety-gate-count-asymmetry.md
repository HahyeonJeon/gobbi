---
name: safety-gate-count-asymmetry
description: evaluation.md names "six safety-gate sites" but auto-mode §7.3/§7.4 enumerate only three headline gates — a §7-only reader could under-count without cross-referencing evaluation.md
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-06-08
session: 422308da-f2c4-41a4-8ee3-adc89acde977
tags: [docs-sync, prose-polish, auto-mode, evaluation]
scenario: auto-mode-evaluation-discipline
item_status: pending
anchor: novel
implemented_in: null
---

# Reconcile safety-gate count between evaluation.md and auto-mode §7

## What

`evaluation.md` (commit 5e8e39d) explicitly names six safety-gate sites. `auto-mode.md` §7.3 and §7.4 (commit 594b654) enumerate only three headline safety gates. A reader who reads only §7 without cross-referencing `evaluation.md` could under-count the safety gates (seeing 3 instead of 6).

The six sites in evaluation.md are: same-symptom-different-root-cause (line 111), Major divergence note (after table ~line 123), any-FAIL note (after table ~line 141), degraded one-fails (line 200), both-fail (line 202), cost-budget (line 203).

## Why

Claude evaluator (iter1 overall.md): flagged as Low/50 docs-sync finding. "count asymmetry — evaluation.md says 'six safety-gate sites'; auto-mode §7.3/§7.4 enumerate three headline gates (a §7-only reader could under-count)." Non-gating. Both evaluators' reconciled verdict was PASS; deferred to prose polish.

The asymmetry is intentional by design: §7 gives the Auto-mode reader the operative rule (the carve-out exists, obey it); `evaluation.md` is the authoritative list of all six sites. However, a future prose-polish could add a parenthetical "(six total — see evaluation.md § Cross-System Reconciliation for the complete list)" to §7.3 or §7.4.

## Verification

After fix: §7.3 or §7.4 in `auto-mode.md` should contain a reference to the full six-gate enumeration in `evaluation.md` (either by count mention or by link). The text "six" (or equivalent) should be locatable in the §7 context. No behavior change; this is a cross-reference addition only.

## Status notes

Deferred by both evaluators at iter1 (Claude Low/50, confidence 50). Address in a future prose-polish session for `auto-mode.md`. Do not block the current session's PR on this.
