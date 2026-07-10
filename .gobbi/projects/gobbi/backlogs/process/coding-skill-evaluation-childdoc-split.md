---
name: coding-skill-evaluation-childdoc-split
description: Apply the workflow-loop evaluation.md 3-file split (evaluation.md + scenario.md + checklist.md) to the coding skill, which still uses the pre-split monolithic shape
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-10
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [process]
keywords: [coding-skill, evaluation-childdoc-split, monolithic-evaluation, consistency]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Apply the evaluation child-doc split to the `coding` skill

## Context

This session's `evaluation-childdoc-split` feature split each of the 5 workflow-loop skills' `evaluation.md` into `evaluation.md` (procedure) + `scenario.md` (Good/Bad/Adversarial framing) + `checklist.md` (`- [ ]` checks), certified complete by a build-time class-predicate gate (`check-eval-childdocs.sh`). That feature's own Scope Contract explicitly excluded `coding/evaluation.md` and `coding/review.md` (OQ-6, a follow-up). The `coding` skill (a separate, earlier-session skill — see project notes on its creation) still carries a single monolithic `evaluation.md` (367 lines), with no `scenario.md` or `checklist.md` sibling — confirmed by direct read of `skills/coding/` at this session's Wrap-up.

## Why deferred

Out of scope for the `evaluation-childdoc-split` feature, which was scoped to the 5 workflow-loop skills only (a locked Scope Contract decision, not an oversight). Migrating `coding` is a separate, smaller unit of work with its own scope contract, not a natural extension of this feature's own task list.

## When to pick up

No hard prerequisite — the `coding` skill's monolithic `evaluation.md` still functions correctly as-is; this is a consistency/pattern-completeness item, not a defect. Pick up whenever a session is scoped around `coding`-skill maintenance, or when a second skill is found in the same pre-split shape (making the inconsistency more visible).

## Suggested approach

Reuse the `evaluation-childdoc-split` design directly: extract `coding/evaluation.md`'s existing scenario prose into `coding/scenario.md`, extract its bullet checks into `coding/checklist.md`, author the missing Good/Bad/Adversarial framing per the same per-step (though `coding` has no workflow-loop "step" — the Good/Bad/Adversarial table would need a `coding`-specific framing, likely per-language or per-review-dimension rather than per-workflow-step), and extend `check-eval-childdocs.sh`'s sweep scope to cover `coding/` if the same class-predicate gate should certify it too (or scope a `coding`-specific gate if the co-touch shape differs).

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-07-39f3dfb0-49df-44d4-a6bd-d2e4743b36e3/`

## Related

- [[evaluation-childdoc-split]] (design) — the design and gate this migration would reuse
</content>
