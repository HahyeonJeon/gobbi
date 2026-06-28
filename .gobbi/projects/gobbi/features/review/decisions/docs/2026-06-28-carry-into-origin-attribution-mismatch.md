---
name: carry-into-origin-attribution-mismatch
description: Readiness draft prose ("first three from Codex / fourth from EVALUATION") contradicts the table row order; row 1 is the EVALUATION-origin constraint.
type: decisions
scope: feature
feature: review
status: accepted
created: 2026-06-28
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [process]
keywords: [readiness, carry-into-execution, origin-attribution, docs-sync, preparation]
author: claude
supersedes: null
---

# Carry-Into-Execution Constraint Origin Attribution Mismatch

## Context

The Preparation iter3 readiness draft (`2-preparation/working/draft-iter3.md`) contains a mismatch between prose description and the carry-into-Execution constraint table. Line 108 prose says "The first three were folded in from the frozen Codex production proposal; the fourth was added at iter2 from the dual-system EVALUATION." But the table immediately following places the EVALUATION-origin constraint (principle-trace namespace) at row 1, with the 3 Codex-origin constraints at rows 2–4. The same mismatch appears at line 28 ("the 4th constraint...principle-trace").

## Decision

Accept this finding as a carried-forward open Low observation. The readiness artifact is not regenerated; this is a docs-sync note for the Wrap-up note or the next session's editing pass.

## Rationale

The mismatch is below REVISE threshold (Low/100 inherited from iter2 but not fixed across iter2 → iter3). The constraint table itself is correct — row 1 is the all-points principle-trace constraint, which is the highest-priority carry-into. A reader cross-walking the "first three / the fourth" prose onto the visually-ordered rows mis-maps the origin of each constraint, but the row-1 cell text self-corrects. No correctness defect in the constraints themselves; only an origin-attribution prose inconsistency.

## Alternatives considered

Fix the prose at iter3: would have required regenerating the draft to swap the prose ordering (call the principle-trace "the fourth from EVALUATION" and the Codex constraints "the first three"). Not done because the iter3 fix was scoped to resolving the Codex High/100 authority finding only; fixing this Low prose nit was left for the next editing pass.

## Consequences

A reader of the readiness draft who cross-walks "first three / fourth" against the table will misattribute the origin of row 1. Self-correcting via row text. Fix in the next session editing the readiness doc or at Wrap-up notes capture.
