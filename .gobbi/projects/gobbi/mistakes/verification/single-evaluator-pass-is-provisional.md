---
name: single-evaluator-pass-is-provisional
description: A PASS from only one evaluation system (the other absent for that round) is provisional, not final — a subsequent run of the missing system found a real defect the sole evaluator missed.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-16
session: 59694f66-422a-4fd5-b93b-625c2f354fc3
tags: [evaluation, process]
keywords: [sole-evaluator, cross-system-divergence, anti-groupthink, dual-system]
author: claude
priority: high
domain: process
related: [no-touch-git-gate-has-many-fail-open-modes]
---

# A single-evaluator PASS is provisional, not a final verdict

## What happened

During Ideation iter4, Claude ran as the sole evaluator for that round and returned PASS with only 2
Medium findings (`working/consolidated-findings-iter4.md`: "Claude PASS (sole-evaluator, 2 Mediums)").
Codex was retried on the same draft and returned REVISE with 3 new Highs the sole Claude pass had
missed — including, across the following iteration, the symlink-traversal gap in the no-touch gate
(`COD5-RISK-001`, see `no-touch-git-gate-has-many-fail-open-modes`). Had the loop accepted the
Claude-only PASS as final and moved on, the design would have locked with a fail-open verification gate
and an unresolved classification-determinism defect.

## Why it happens

The dual-system model's whole value is the anti-groupthink signal: Claude and Codex are independent
generators/evaluators that do not see each other's work, so a defect one system's structural checks pass
can still be caught by the other's different vantage point. A single-evaluator round removes exactly
that signal for the round it covers — a PASS from one system says only "this one system's checks did not
find a problem," not "no problem exists." Treating it as equivalent to a normal dual-system PASS silently
discards the cross-system divergence check the workflow is built around.

## Correct approach

Treat any eval round where only one system produced a verdict as PROVISIONAL. Before locking a
foundation artifact (a design spec, a scope contract, anything downstream work will depend on), re-run
the missing system on the same draft and reconcile both verdicts — do not proceed to the next loop or
lock status on a sole-evaluator PASS. A missing evaluator in a `propose.mode: dual` loop is itself a
safety-relevant condition, not a routine scheduling gap: the same discipline the design guide already
applies to a missing Codex PRODUCER (degraded-mode labeling, no silent fallback) applies to a missing
Codex EVALUATOR.

## How to detect

Any evaluation round's consolidated findings or reconciliation log stating or implying "sole-evaluator"
or listing a verdict from only one of {claude, codex} for that iteration. The signal to watch for: a
PASS reached with one system's coverage, immediately followed (same or next iteration) by the other
system finding a new High/Critical on the identical draft — this is the concrete pattern that already
happened once in this session and is the early-warning shape to recognize before it recurs.

## Related

- [[no-touch-git-gate-has-many-fail-open-modes]] — the concrete defect this trap fired on: the
  symlink-traversal gap that a sole-evaluator round missed and a subsequent Codex run caught
