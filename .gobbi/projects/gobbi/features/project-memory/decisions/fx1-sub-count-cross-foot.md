---
name: fx1-sub-count-cross-foot
description: "Deferred cosmetic: FIX-1 sub-count cross-foot discrepancy (28 vs 27 backlog-disposition files); Execution normalizes to 27 as the canonical strict-filter figure."
tags: [fix1, sub-count, cross-foot, deferred]
date: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
status: deferred
scope: feature
feature: project-memory
supersedes: null
superseded_by: null
type: general
domain: docs-sync
finding_ids: [F3]
---

# FIX-1 Sub-count Cross-foot 28-vs-27 — Execution-Deferred Cosmetic (F3, CN-1)

## Context

The Preparation draft (line 63) uses "28 backlog disposition files legitimate (preserved)"; lines 72 and 115 reference 27 (strict P_live filter) and label the discrepancy CN-1. The RE-RUN by the Claude Consistency evaluator confirmed the strict figure is 27.

Both numbers appear in the same readiness artifact without reconciliation, creating a self-inconsistent reference that carries forward into Planning.

## Decision

Deferred to Execution per the existing CN-1 lock. Execution's standard-authoring wave normalizes the canonical figure to 27 (strict P_live) and footnotes or removes the loose-filter 28. Planning uses 27 as the canonical backlog-disposition sub-count.

## Rationale

This is a documented cosmetic (CN-1) from the Ideation lock. The strict-filter figure (27) is reproducible; the loose-filter figure (28) was already flagged for normalization. No readiness or baseline impact.

## Related

- `preparation/evaluation/iter1/claude/consistency.md` — F3 finding
- `ideation/artifacts/` — CN-1 cosmetic documented in Ideation lock
