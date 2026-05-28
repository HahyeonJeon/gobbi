---
name: fx1-sub-count-cross-foot
description: "Deferred cosmetic: FIX-1 sub-count cross-foot discrepancy (28 vs 27 backlog-disposition files); Execution normalizes to 27 as the canonical strict-filter figure."
tags: [fix1, sub-count, cross-foot, deferred]
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
status: deferred
scope: feature
feature: project-memory
supersedes: null
superseded_by: null
type: decisions
domain: docs-sync
---

# FIX-1 backlog-disposition sub-count cross-foot (28 vs 27) — normalize to the strict figure

## Context

The Preparation readiness work used "28 backlog disposition files legitimate (preserved)" in one place and "27" (strict P_live filter) in two others, labelling the discrepancy a cosmetic note. A Consistency-perspective re-run confirmed the strict figure is 27.

Both numbers appeared in the same readiness artifact without reconciliation, creating a self-inconsistent reference that would carry forward into Planning.

## Decision

Deferred to Execution: the standard-authoring wave normalizes the canonical figure to 27 (strict P_live filter) and footnotes or removes the loose-filter 28. Planning uses 27 as the canonical backlog-disposition sub-count.

## Rationale

This is a documented cosmetic discrepancy, not a baseline error. The strict-filter figure (27) is reproducible; the loose-filter figure (28) was already flagged for normalization. Neither readiness nor the leak baseline depends on which figure is cited.

## Alternatives considered

Reconcile the two figures inline in the originating readiness draft — rejected: that draft is read-only audit rawdata; the canonical figure is fixed downstream at Execution instead.

## Consequences

Execution states the backlog-disposition count once, using the strict P_live filter (27), and does not mix filters in a single count narrative. The discrepancy does not affect the FIX-1 predicate or the leak-file set.

## Related

- [fix1-subcounts-cross-foot-cosmetic](fix1-subcounts-cross-foot-cosmetic.md) — the companion decision recording the same cross-foot from the Ideation side

## Source

Originating session `b0a0eaf9-03f7-4dce-a040-c7443653a459` (see the `session` frontmatter field) — Preparation readiness review, Consistency-perspective finding F3 (cosmetic CN-1).
