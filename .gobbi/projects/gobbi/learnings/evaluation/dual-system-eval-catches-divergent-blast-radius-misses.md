---
name: dual-system-eval-catches-divergent-blast-radius-misses
description: At Execution eval the two evaluators EACH caught a different sibling-file blast-radius miss the other missed; a 3rd twin surfaced only from a tree-wide grep.
type: learnings
scope: project
feature: null
status: active
created: 2026-07-06
session: 1faa4e51-9395-4d58-87b8-e7f47f59f81b
tags: [evaluation, verification, docs-sync]
keywords: [dual-eval, blast-radius, sibling-file, tree-grep, anti-groupthink, R8, R13]
author: claude
related: [dual-eval-divergence-caught-two-distinct-defects, finding-location-understates-blast-radius]
---

# Dual-system eval catches divergent blast-radius misses that single review does not

## Insight

When a fix corrects a defect at its cited file but leaves the same defect live in a sibling
file, cross-family dual evaluation catches those sibling misses — and it catches DIFFERENT ones
per system. At this session's Execution evaluation the Claude evaluator and the Codex evaluator
each surfaced a distinct blast-radius twin the other missed. A THIRD twin of the same defect
surfaced only from an executor's tree-wide grep during remediation. Cross-family dual-eval PLUS
a literal tree-wide grep of the defect string find sibling-file misses that single-system review
and per-file verification structurally do not.

## Context

The session shipped the "2026-07-01 review doc-consistency sweep" (Option A) — 20 doc rows.
Two of those rows were string/pattern fixes whose blast radius exceeded the cited file:

- **Codex caught R8's twin.** The R8 fix changed the producer/proposer wording ("two producers"
  → "two generators") in `orchestration/workflow/production.md`, the finding's cited file. The
  Codex evaluator found `skills/delegation/SKILL.md` — the prompt-shape owner — still said the
  manager "spawns two producers in parallel-independent generation" (High/100, `design_flaw`,
  `docs-sync`). The Claude evaluator missed it.
- **Claude caught R13's twin.** The R13 fix named the exact phase-child `evaluation.md` per
  EVALUATION row in `auto-mode.md` (5 rows). The Claude evaluator found `chat-mode.md` carried
  4 identical EVALUATION rows still left unfixed — a new auto-mode↔chat-mode divergence that left
  a Chat-mode manager exposed to the original R13 defect (High/100 consistency + usage). The
  Codex evaluator missed it.
- **The 3rd twin came from a grep, not either evaluator.** During iter2 remediation, an
  executor's tree-wide grep of the R8 defect string surfaced a THIRD occurrence (a cost
  reference), which was then fixed. Neither evaluator had flagged it.

Each evaluator's miss was the OTHER's catch; the reconciled REVISE verdict was the union. iter2
fixed both twins (plus a Medium and Lows) and PASSed.

## Reason

If the project ran one evaluation system, exactly one of the two blast-radius twins would have
shipped mislabeled. The divergence is not noise — it is the anti-groupthink signal the dual
system exists to produce, and here it operated specifically on BLAST RADIUS: a shared defect
wording spread across sibling docs that each family scanned incompletely. The grep-found third
twin shows even two evaluators do not guarantee complete sibling coverage — a mechanical
tree-wide grep of the exact defect string is the complementary net that neither reviewer's
sampling replaces.

## How

- After a dual evaluation, reconcile blast-radius findings by UNION: a sibling-file twin either
  system reports is real even when the other system's Preserve/works list blessed that area.
- For any fix that is a string / pattern replacement (not a one-off logic bug), run a tree-wide
  grep of the EXACT defect string as a mechanical net alongside the two evaluators — it catches
  the twin no reviewer sampled. This is the eval-time complement to doing the same grep at
  Planning (see the planning-skill trap in `skills/planning/mistakes.md`).
- Read the two systems' Preserve lists against each other: a defect one system found in an area
  the other blessed is the exact cross-family catch to investigate first.

## Counter-cases

- **A one-off logic defect with no repeated wording** has no sibling twins to grep for — the
  tree-wide-grep net adds nothing there; it is specific to repeated-string / mirror defects.
- **Both systems agree PASS** is the strong convergent signal; no union-merge needed.
- **Severity ≤ Medium divergence** (wording, one calls it Med the other Low): the manager
  reconciles and decides; not every divergence requires remediation.

## Related

- [[dual-eval-divergence-caught-two-distinct-defects]] — the prior witness of the same union-of-findings pattern (C4/C6 defects)
- [[finding-location-understates-blast-radius]] — the mistake this learning is the dual-eval-side application of
