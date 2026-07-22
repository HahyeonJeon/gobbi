---
name: dual-system-value-is-divergence-not-agreement
description: Dual-system value comes from non-overlapping findings at production and evaluation, not from agreement between systems.
type: learnings
scope: project
feature: null
status: active
created: 2026-07-12
session: f87055a2-08b2-4605-b33b-c01c47416830
tags: [evaluation, codex, process]
keywords: [dual-system, divergence, anti-groupthink, python-skill, production, evaluation]
author: claude
related: [dual-eval-divergence-caught-two-distinct-defects, dual-system-work-added-real-coverage]
---

# Dual-system value is the divergence, not the agreement

## Insight

In authoring the `python` skill's `design.md` and `convention.md` child docs, the dual
system caught genuinely non-overlapping findings at BOTH creation and review — the
anti-groupthink premise this project runs the dual system for, demonstrated at both
ends of the loop in the same session.

## Context

The `python` skill was built through a full dual-system run: a Claude producer and a
Codex proposer each authored an independent draft at production, then a Claude
evaluator and a Codex evaluator each independently reviewed the merged result.

- **Production (proposer).** The independent Codex proposal fixed a latent
  import-time-registration anti-pattern present in the Claude producer's Pass-1 draft,
  delivered PEP 695 native generics that the Claude draft under-delivered, and filled a
  fluent-chain-break gap and a class-docstring gap the Claude draft had left open.
- **Evaluation.** The Claude evaluator's live-interpreter pass found a code-correctness
  bug — a frozen-dataclass hashability claim over-generalized in a code example, where
  `hash(Invoice(lines=[...]))` actually raises — that the Codex evaluator missed. The
  Codex evaluator, in turn, found a deepen-not-restate restatement of `coding` skill
  principles that the Claude evaluator had judged clean.

Neither system's High finding, at either stage, was caught by the other system at that
same stage.

## Reason

The payoff of running two independent systems is the divergence, not the agreement.
Two systems that always agree add cost without adding coverage; two systems that
sometimes diverge are each catching a different slice of the defect space, and running
only one of them would have shipped whichever defect it alone missed. This session
produced that evidence on BOTH sides of the loop — production and evaluation — in one
pass, not just one.

## How

- Run both systems independently at production AND at evaluation; do not treat one as a
  cross-check only at review time.
- Read a divergent finding as the anti-groupthink signal working as intended, not as
  noise to reconcile away — reconcile by union (every real finding from either system),
  never by intersection.
- When one system finds nothing distinctive across several runs, that is a low-yield
  signal for THAT step, not evidence the dual-system model itself has stopped paying off
  — check the per-run Integration Log / finding set before generalizing.

## Counter-cases

- **Both systems converge on the same findings:** convergence is still a useful
  confirmation signal, but it is not the source of dual-system value — a run with zero
  divergence tests confidence, not coverage.
- **A "divergent" finding that is actually a misread:** when one system's flagged
  defect turns out to be correct behavior the other system understood correctly, the
  divergence still surfaced it for the producer/manager to adjudicate — the point is
  surfacing every candidate, not auto-accepting every divergence as a real defect.

## Related

- [[dual-eval-divergence-caught-two-distinct-defects]] — the earlier Execution-eval
  instance of this same pattern (two evaluators, two distinct High defects)
- [[dual-system-work-added-real-coverage]] — the earlier production-side instance
  of this same pattern (a blind Codex proposal adding real, attributable coverage)
