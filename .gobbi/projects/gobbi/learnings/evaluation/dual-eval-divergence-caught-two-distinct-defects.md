---
name: dual-eval-divergence-caught-two-distinct-defects
description: At Execution eval, Claude and Codex each caught a DIFFERENT real High/100 defect the other missed — cross-family divergence is the union of findings, the strongest anti-groupthink demonstration
type: learnings
scope: project
feature: null
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [evaluation, codex, verification]
keywords: [dual-eval, divergence, anti-groupthink, union-of-findings, C4, C6]
author: claude
related: []
---

# Dual-system evaluation divergence caught two distinct defects neither system found alone

## Insight

The anti-groupthink value of dual evaluation is clearest when the two systems DIVERGE: at this
session's Execution evaluation, the Claude evaluator and the Codex evaluator each surfaced a
different real High/100 defect that the other missed. The reconciled verdict is the UNION of the two
finding sets — not the intersection, and not either system alone.

## Context

Execution evaluation (session babc6f3b) ran dual-system over the C1–C6 change-set:

- The **Claude** evaluator caught the **C4 escaped-pipe false-fail**: the Integration-Log structural
  validator mis-parsed a table cell containing an escaped pipe, false-failing a legitimate log. The
  Codex evaluator's Preserve list had explicitly said C4 "works".
- The **Codex** evaluator caught the **C6 per-task schema drift**: the per-step value-telemetry
  schema as implemented diverged from the locked plan's per-task shape. The Claude evaluator missed
  it.

Each defect was a genuine High/100 finding. Neither evaluator found both; the two together found
both. Both were fixed in the Execution remediation commits (`7fea07ef`, `94bdef34`).

## Reason

If the project ran only one evaluation system, exactly one of these two defects would have shipped.
The divergence is not noise to reconcile away — it is the signal the dual system exists to produce.
A single family shares blind spots; a second family with different priors covers a different slice of
the defect space. Treating the verdict as the union (pessimistic merge) is what captures both slices.

## How

- After a dual evaluation, reconcile by UNION, not intersection: every High/Critical finding from
  EITHER system is a real candidate, even when the other system explicitly marked that area "works"
  or "preserve".
- A finding in one system's set that contradicts the other system's "preserve/works" claim is a
  HIGH-value divergence — investigate it first, do not discount it because the other system passed it.
- Read both systems' Preserve/works lists against each other: a defect one system found in an area
  the other blessed is the exact cross-family catch the dual system is for.

## Counter-cases

- **Severity ≤ Medium divergence** (style, wording, one calls it Medium the other Low): the manager
  reconciles and decides; not every divergence requires remediation.
- **Both systems agree PASS:** dual-PASS is the strong convergent signal; no union-merge needed.
- **A divergence that is a misread by one system:** when one system's "defect" is actually a correct
  behavior the other understood, the union still surfaces it for the manager to adjudicate — the
  point is surfacing, not auto-accepting.

## Related

- [[dual-eval-caught-managers-own-audit-gap]] — the Ideation-eval complement (both systems agreed on one defect)
- [[dual-production-codex-added-real-coverage]] — the production-side complement
