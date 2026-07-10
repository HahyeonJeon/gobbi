---
name: dual-system-eval-caught-real-defects-every-gate
description: Dual-system evaluation caught a distinct real defect at every gate of this session, not just some of them.
type: learnings
scope: project
feature: null
status: active
created: 2026-07-08
session: 33de02b8-4dff-4768-bafa-c1f53ae81890
tags: [evaluation, process]
keywords: [dual-system, anti-groupthink, ideation, execution, skill-standard]
author: claude
supersedes: null
superseded_by: null
related: []
---

# Dual-system evaluation caught a real defect at every gate, not just some

## Insight

Running the Claude + Codex evaluator pair at every gate of a session — not only at Execution —
surfaces a distinct, load-bearing defect each time, even across gates with very different content
(a design artifact, a rewritten skill file, a final-verification pass). Treat "the evaluators
found nothing new this round" as a signal worth double-checking, not the expected steady state.

## Context

This session ran the skill-standard redesign (new 6-section skeleton, `skill-writing` +
`orchestration` migration, orchestration's 4-child-doc split) through Ideation (3 iterations) and
Execution (5 tasks). Dual-system evaluation caught a different real defect at every gate:

1. **Ideation iter1** — an incomplete artifact (the design draft did not cover all the sections
   the standard itself required).
2. **Ideation iter2** — missed child-doc anchors AND an anchor-blind guard (the verification plan's
   own link guard would not have caught a broken child-doc anchor).
3. **Execution task 01** — an allowlist mismatch and a non-source-free Rules section (the
   migrated `skill-writing/SKILL.md` itself briefly violated its own new standard).
4. **Execution task 05** — an evaluator flagging a user-approved content removal as a normative
   loss (a false positive, but one worth catching and dispositioning explicitly rather than
   silently accepting or silently reverting).

## Reason

If this pattern were lost, a future session might assume dual-system evaluation "pays off mostly
at Execution" and skip or lighten it at Ideation. This session shows the opposite: a design-stage
gap (an incomplete artifact) and a structural-verification gap (an anchor-blind guard) are just as
real and just as costly to ship silently as an Execution-stage code defect. Each defect class was
invisible to the producer that wrote it and would likely have been invisible to a same-system
reviewer too (a shared blind spot) — the value is in the cross-system disagreement, not in running
twice for redundancy.

## How

Keep dual-system evaluation on at every gate the loop schedule already calls for (Ideation,
Planning, Execution), even when a loop's content looks "just a design doc" or "just a rewrite of
an existing file". Read every finding from both systems before deciding PASS/REVISE; do not
assume a same-system-only pass would have caught what the other system's perspective caught.

## Counter-cases

A trivial, mechanical change (a one-line typo fix, a config flip with no design surface) is where
the two systems converge and a second evaluation pass adds latency without new signal — this
learning is about design-bearing and structural work (new skeletons, cross-doc splits, anchor
repoints), not every possible edit.
