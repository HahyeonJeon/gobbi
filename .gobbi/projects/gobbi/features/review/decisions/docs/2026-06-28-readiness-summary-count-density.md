---
name: readiness-summary-count-density
description: Readiness summary count categories (2 obs + 4 constraints + 1 note) don't map 1:1 onto the 7 user-locked dispositions; reader must cross-walk three sections.
type: decisions
scope: feature
feature: review
status: accepted
created: 2026-06-28
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [process]
keywords: [readiness, summary, count-density, docs-sync, aesthetics, preparation]
author: claude
supersedes: null
---

# Readiness Summary Count Categories vs User-Locked Dispositions

## Context

The Preparation iter3 readiness summary (draft line 26) categorizes non-blocking items as "2 observations + 4 carry-into-Execution constraints + 1 executor-brief note." The Decisions log has 7 USER-LOCKED dispositions. These two counts come from different classification axes: the summary groups by type-of-action (observations, constraints, notes), while the dispositions group by gap addressed (FLAG-2, principle-trace, review-comm, out-of-scope, REVISE-threshold, rules-dir, prep-SKILL backlog). A reader who tries to reconcile "7 dispositions" against "2+4+1" must cross-walk three separate sections of the draft.

## Decision

Accept this as a Low clarity nit. The counts are individually correct; the categorization mismatch is an aesthetic issue, not a correctness defect.

## Rationale

No count is wrong; no disposition is missing. The 7 user-locked dispositions are enumerated in the Decisions log (lines 121-128 of draft-iter3.md). The summary counts (2 obs + 4 constraints + 1 note) represent a different grouping of the same items. The mismatch does not affect readiness or downstream planning. The classification is a design choice (group by action-type vs group by gap) that the author made; changing it would require re-categorizing the summary, which is below REVISE threshold.

## Alternatives considered

Align summary counts to match the 7 disposition items directly. This would require rewriting the summary block to say "7 user-locked dispositions: 2 skip + 4 defer + 1 backlog" instead of "2 obs + 4 constraints + 1 note." Not done in iter3; the 7-disposition framing lives in the Decisions log. Either framing is correct; the current one groups by what the executor must do (act type), while the alternative groups by resolution authority.

## Consequences

A reader counts "2+4+1 = 7" and matches the 7 dispositions — but only if they understand the two axes differ. Future readiness docs should align these two count dimensions or add a cross-walk note.
