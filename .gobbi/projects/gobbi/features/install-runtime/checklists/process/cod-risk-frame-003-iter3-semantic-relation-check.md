---
name: cod-risk-frame-003-iter3-semantic-relation-check
description: Constructive frame gap — the migration-losslessness evaluation frame needs a forward relation-equivalence check and a reverse unexplained-addition check, not only primitive-union coverage.
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-07-17
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [verification, docs-sync]
keywords: [semantic-relation, checklist-gap, migration-ledger, startup, evaluation-frame]
author: codex
scenario: idea-risk-scenario-07-semantic-union-losslessness
---

# Frame needed a semantic-relation check (constructive)

## What
The Risk perspective's Stage 1 frame for iter2's added scenario `IDEA-RISK-SCENARIO-07` (semantic-union
losslessness) tested complete source-primitive union coverage and SOP-field compatibility, but did not test
whether the RELATIONS among source primitives (conditionals, quantifiers, cardinality, temporal order)
survive the migration. iter3 Stage 1 added two new checks under that scenario:
`IDEA-RISK-SCENARIO-07-CHECK-01` (forward: does the destination union preserve the source's logical relation,
not only its primitive values?) and `-CHECK-02` (reverse: does every new destination semantic unit map to a
user lock, a retained source clause, or a named new obligation — no unexplained addition?).

## Why
A structurally complete primitive ledger (every actor/precondition/outcome/effect/evidence value present in
the destination) can still narrow behavior if a conditional, ordering, or quantifier relating those
primitives is dropped or altered — exactly the gap `COD-RISK-001-ITER3` (see
`staging/decisions/semantic-union-relation-level-equivalence.md`) surfaces as a target finding. The frame
needs to test for this class explicitly; without it, a future evaluation round could pass a destination
union that changed acceptance semantics while every primitive value stayed textually present.

## Verification
Both checks are attached to `IDEA-RISK-SCENARIO-07` in `evaluation/iter3/codex/risk.md` § Locked Frame
(Stage 1) and were exercised at Stage 2 against the current `draft-iter3.md` MIG-1/MIG-8 ledger design
(the checks pass at the DESIGN level — the ledger's stated columns do not yet include a relation field,
which is exactly what the paired target finding recommends Planning close).

## Status notes
Constructive, PASS-only frame addition — not itself a target defect. Carried forward so Planning's plan for
the MIG-1/MIG-8 acceptance criteria has an explicit two-part check to satisfy: forward relation-equivalence
+ reverse unexplained-addition. Preserve both checks in any future re-evaluation of the startup migration
ledger design.

## Related

- [[semantic-union-relation-level-equivalence]] — the paired target finding (COD-RISK-001-ITER3) this frame addition anchors
