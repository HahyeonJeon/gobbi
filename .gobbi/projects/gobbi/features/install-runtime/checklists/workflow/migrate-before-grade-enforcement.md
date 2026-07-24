---
name: migrate-before-grade-enforcement
description: T6/T7/T8's migrate-before-grade ordering was a commented-out (non-executable) gate at iter1; it is now an executable phase-A/phase-B boundary with snapshot+sha256 evidence
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, verification]
keywords: [cod-plan-struct-002, migrate-before-grade, phase-a-phase-b, executable-gate, commented-out-proof]
author: claude
scenario: plan-struct-executable-verification
item_status: implemented
anchor: novel
implemented_in: null
---

# Migrate-before-grade is now self-failingly enforced, not a commented-out proof

## What

T6's two-phase cardinality gate (assert 29 legacy families migrated, THEN assert 30 after PROJ-08 is added) must
be an executable, self-failing check — the adjudication that T6 stays whole (not re-sliced) rested on this proof
running.

## Why

At iter1, the phase-A/phase-B boundary gate was COMMENTED OUT, so the T6-keep-whole adjudication rested on a
proof that could not actually run (`COD-PLAN-STRUCT-002`, High/100).

## Verification

The gate is now an executable phase-A block with a file snapshot + sha256 boundary; T7 and T8 gained the
equivalent migrate-before-add boundary. Simulated on a scratch tree: phase A passes on 29-complete, fails on a
count-neutral ID substitution, fails on a re-run after close; phase B passes only after a good phase A and fails
on a tampered snapshot.

## Status notes

Resolved at iter2. Residual: the ORIGINAL once-only/first-row design of this same boundary made legitimate
corrections deadlock — closed separately as [[phase-boundary-supersede-contract-fix]].

## Related

- [[phase-boundary-supersede-contract-fix]] — the residual last-row-wins fix this finding's residual became
