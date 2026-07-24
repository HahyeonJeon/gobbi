---
name: semantic-union-relation-level-equivalence
description: The startup-bundle migration's semantic-union losslessness ledger preserves source primitive VALUES but not the logical RELATIONS among them.
type: decisions
scope: feature
feature: install-runtime
status: proposed
created: 2026-07-17
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [docs-sync, design]
keywords: [semantic-union, losslessness, relation-equivalence, migration-ledger, startup]
author: codex
supersedes: null
superseded_by: null
related: [gate-c-structural-mapping-is-not-semantic-union-preservation]
---

# COD-RISK-001-ITER3 — Semantic-union proof omits explicit relation-level equivalence

## Context
The whole-bundle SOP migration (D12, user-locked) requires the legacy startup grading bundle (29 scenario
families + 119 checklist checks) to migrate losslessly. AR-9 + MIG-1 + MIG-8 (`draft-iter3.md:140,205,212`)
define losslessness as a per-clause SEMANTIC-UNION proof: for every legacy Good/Bad/Adversarial clause and
every independently-falsifiable check clause, record the source's semantic PRIMITIVES (actor, precondition/
trigger, named discrimination, observable outcome/oracle, prohibited side effect, evidence obligation) and
confirm the destination union preserves every primitive without narrowing (`semantic_diff = none`).

## Decision
Recorded as an open `assumption_risk` finding for Planning to consume — not fixed in this Ideation loop
(Medium severity, does not meet the REVISE threshold: Confidence 75 < the 100 needed to force REVISE on a
Medium at this loop's threshold rule, and it is not a Critical/High). Planning MUST extend the MIG-1/MIG-8
semantic oracle to preserve and compare relation/logic semantics — not only primitive values — and require
the destination set to enforce those relations, before Execution authors the migration ledger.

## Rationale
The primitive-preservation proof enumerates WHAT survives (actor, precondition, outcome, etc.) but does not
require representation or comparison of the logical CONNECTORS, quantifiers, cardinality, temporal order, or
relations AMONG those primitives. A destination union can therefore contain primitive X and primitive Y
without preserving "if X, then Y" or "exactly one Y after X" — the ledger would read `semantic_diff = none`
even though a conjunction, ordering, or quantifier changed, which can alter acceptance semantics while every
primitive's raw VALUE remains present. `gate-c-structural-mapping-is-not-semantic-union-preservation`
already established that a structural (ID-to-ID) mapping is not evidence of semantic preservation; this
finding sharpens the same lesson one level down — a PRIMITIVE-VALUE union is not yet evidence of
RELATION-level preservation either.

## Alternatives considered
- **Treat primitive-preservation as sufficient (status quo)** — rejected: leaves open the risk that a
  destination clause silently drops or reorders a conditional/quantified relationship while every named
  primitive still appears, which the current oracle cannot detect.
- **Fix the oracle now in Ideation** — rejected: exact migrated prose and the ledger's column schema are
  Execution-mechanism decisions (Out-of-Scope: detailed implementation mechanism deferred); Medium/75 does
  not block Ideation PASS, and the fix is a bounded, well-scoped Planning-input extension to an already-locked
  mechanism (MIG-1/MIG-8), not a new design axis.

## Consequences
Planning MUST add relation/logic-semantics preservation (connectors, quantifiers, cardinality, temporal
order) to the MIG-1/MIG-8 semantic-oracle acceptance criteria, alongside the existing primitive-value
preservation, before Execution authors the migration ledger. The companion constructive frame gap
(`COD-RISK-FRAME-003-ITER3` — see `staging/checklists/cod-risk-frame-003-iter3-semantic-relation-check.md`)
records the specific Stage-1 checks that should anchor this extension.

## Related

- [[gate-c-structural-mapping-is-not-semantic-union-preservation]] — the sibling union-preservation gap this finding sharpens one level down (relation, not just primitive-value, preservation)
