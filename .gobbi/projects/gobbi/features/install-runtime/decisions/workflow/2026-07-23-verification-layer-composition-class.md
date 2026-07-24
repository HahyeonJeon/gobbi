---
name: verification-layer-composition-class
description: The Codex overall.md iter1 finding named a whole CLASS of defect (blocks verified in isolation do not compose correctly at task boundaries) that recurred through iter2 in new instances before being closed at iter3
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, verification]
keywords: [cod-plan-overall-001, composition-at-task-boundaries, cross-task-predicate-class, class-level-finding]
author: claude
supersedes: null
superseded_by: null
related: [t1-ledger-gate-cross-task-predicate-fix, check-id-boundary-sibling-shape-fix, t9-duplicate-item-gate-fix]
---

# The "composition at task boundaries" defect class is closed, not just its named instances

## Context

At iter1, the Codex `overall.md` named a CLASS-level finding, not a single instance: a verification block
correct in isolation does not necessarily compose correctly at the boundary between the task that wrote it and
the task whose output it depends on (`COD-PLAN-OVERALL-001`, High/100). The four iter1 instances (T2 cross-task
term, T6 commented gate, wrong guard target, polarity regex) were all fixed at iter2 — but the SAME class
produced three NEW instances at iter2 (`F2-STRUCT-01` T1 cross-task ledger predicate, `F2-STRUCT-02` check_ids
aliasing, `F2-CONS-01` vacuous duplicate gate), confirming the class itself was not yet closed, only its named
symptoms.

## Decision

Treat the class as closed only when an evaluator actively HUNTS for a new instance and finds none — not when
every previously-named instance is fixed. At iter3, the evaluator explicitly ran this hunt (re-checking every
task-boundary composition point for a residual cross-task predicate, false-pass, or vacuous gate) and found
zero new instances.

## Rationale

A defect class that keeps producing new instances after each round of point-fixes is a signal the underlying
FAILURE MODE (not just its symptoms) needs active adversarial hunting, not passive confirmation that prior
findings are fixed — this is the same discipline as `step-back-after-repeated-fixes-on-one-axis`.

## Alternatives considered

- **Declare the class closed once all NAMED iter1 instances are fixed** — rejected: this is exactly what iter2's
  evaluation proved insufficient (the class produced 3 new instances despite all 4 named ones being fixed).

## Consequences

Any future revision to this plan's verification-command layer should re-run the same active hunt (not just
confirm named findings are fixed) before treating the layer as execution-ready.

## Related

- [[t1-ledger-gate-cross-task-predicate-fix]] — one of the three new iter2 instances of this class
- [[check-id-boundary-sibling-shape-fix]] — a second new iter2 instance of this class
- [[t9-duplicate-item-gate-fix]] — a third new iter2 instance of this class
