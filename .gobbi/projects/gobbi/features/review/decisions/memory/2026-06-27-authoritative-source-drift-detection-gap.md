---
name: authoritative-source-drift-detection-gap
description: Accept CONSIST-2 — authoritative-source rule exists but has no automated drift-detection mechanism between review.md and evaluation.md
type: decisions
scope: feature
feature: review
status: accepted
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [docs-sync, design]
keywords: [drift-detection, authoritative-source, CONSIST-2, review-md, evaluation-md, overlap-residual]
author: claude
supersedes: null
---

# Decision: accept the drift-detection gap as a residual of the user-approved comprehensive overlap (CONSIST-2)

## Context

iter2 Claude finding `CONSIST-2` (assumption_risk/docs-sync, Low/50, open): the authoritative-source rule names the authority on divergence (the `coding/SKILL.md` principle) but adds no drift-detection mechanism. If one doc (`review.md` or `evaluation.md`) is updated without the other, nothing automatically flags the miss. A human or agent must notice the divergence and invoke the authoritative-source rule — but there is no trigger that fires when either doc is edited.

This is distinct from `C-2` / `STRUCT-1` / `R-2` (iter1 findings, addressed in iter2): those found that no authoritative-source rule existed at all. CONSIST-2 is the residual: the rule now exists, but has no drift-detection mechanism behind it.

## Decision

**Accept CONSIST-2 as an overlap residual.** No drift-detection mechanism is added in this session.

Rationale:
- The finding is Low/50 — below any REVISE threshold.
- Drift detection would require either: (a) a CI check that compares principle-trace annotations across both docs, or (b) a governance rule that any edit to one doc triggers a review of the other. Both are feasible but not in scope for this Ideation.
- The user explicitly approved the comprehensive overlap. Accepting the overlap's cost (a manual sync discipline rather than an automated gate) is consistent with that decision.

**Accepted residual cost**: the authoritative-source rule must be applied manually. When either `review.md` or `evaluation.md` is updated, the editor is responsible for checking the other doc's coverage of the same principle and reconciling any divergence against `coding/SKILL.md`.

**User awareness**: surface at Wrap-up for user acknowledgment. The user may choose to address this by:
- Having `review.md` taxonomy points reference `evaluation.md` checks by anchor rather than restating them (tighter coupling, less drift risk, but reduces `review.md`'s standalone readability).
- Adding a governance note in `review.md` § Gobbi Integration that explicitly names the manual sync discipline.
- Accepting the residual as-is (the lowest-effort option, consistent with Low/50 severity).

## Rationale

CONSIST-2 is not a blocker, not a REVISE-level finding, and not a contradiction — it is the stated cost of the user-approved design choice. Recording it ensures it is not forgotten and is surfaced at Wrap-up when the user reviews the full finding set.

## Alternatives considered

- **Add a CI drift-detection check**: Out of scope for Ideation. Requires schema for principle-trace annotations and a comparison script — infrastructure work, not a doc design decision.
- **Mandate anchor-linking instead of restating**: Could reduce drift but would tightly couple `review.md` readability to `evaluation.md`'s structure. Deferred to user decision.

## Consequences

- CONSIST-2 is explicitly acknowledged and accepted as a low-priority residual.
- The design constraint "authoritative-source rule names the authority, but no automated drift-detection exists" is recorded.
- Surface at Wrap-up; user decides whether to address in a future session.
