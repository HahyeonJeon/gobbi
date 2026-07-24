---
name: d2-validation-vs-guard-tooth-b-wording-reconciled
description: The D2 design's validation (b) said "copies a peer mechanism" while the shipped guard's tooth (b) tests "copies a generic-SOP heading"; the wording gap is reconciled by the gate-decision refinement and verified empirically — both arms stay covered.
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [docs-sync, verification]
keywords: [d2-validation, guard-tooth-b, peer-mechanism, generic-sop-heading, wording-reconciliation]
author: claude
scenario: d2-validation-vs-guard-tooth-b-wording
item_status: implemented
anchor: novel
implemented_in: null
---

# D2 validation (b) wording vs. guard tooth (b) wording — reconciled, both arms covered

## What

Record that `1-ideation/outputs/design-options.md:38`'s validation (b) ("a planning doc that copies a
peer mechanism -> FAIL") and the shipped guard's tooth (b) (tests "copies a generic-SOP heading") use
different wording for what looks like the same invariant. This is not a defect — it is resolved by
`3-planning/working/gate-decisions-iter1.md:12`, which refines validation (b) for the new check `#8`
specifically to "forbidden-content signature for planning = the generic SOP's own section headings."

## Why

The Consistency evaluator (`4-execution/task-02-authorize-narrow-fold/evaluation/iter1/claude/consistency.md`)
flagged the wording gap between the design doc and the shipped guard, then verified the *peer-mechanism*
arm of the original (b) is still enforced by the PRE-EXISTING broad checks: planting a dual-system
heading (`#5`) or a `chore(session): record` phrase (`#4`) into the authorized `planning.md` still exits
1. So the union `{#3, #4, #5, #8}` covers both the original peer-mechanism arm and the new
generic-SOP-heading arm — faithful to the locked contract, Confidence 100, Severity Low, disposition
`addressed` (not `open`) because the empirical check already closed it in this same iteration.

## Verification

Empirical, already run by the evaluator: planted a dual-system heading and a `chore(session): record`
phrase into `planning.md` (the authorized doc) and confirmed both `#5` and `#4` still fire (exit 1) —
commit `57f4b5d2`.

## Status notes

Resolved within this iteration; no further action needed. Staged here per the cumulative-staging rule
(`addressed` findings are still staged on `PASS`, not silently dropped).

## Related

None.
