---
name: d1-001-drop-re-ideate-verdict-shipped
description: RE-IDEATE is a Planning readiness result and user routing decision, never an evaluator verdict
type: design
scope: feature
feature: workflow
status: retired
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [design, process]
keywords: [GEN-D1-001, RE-IDEATE, verdict-aggregation, discussion-model, planning-readiness]
author: claude
supersedes: d1-001-drop-re-ideate-verdict
superseded_by: null
related: []
archived_at: 2026-07-20
archive_reason: retired
---

# Drop the non-representable RE-IDEATE verdict (as shipped)

> **v0.5.3 current-contract note:** `RE-IDEATE` is now a result of Planning's readiness entry gate inside DISCUSSION. It offers only re-enter Ideation or abort, never enters evaluator verdict aggregation, preserves readiness evidence, and does not increment the Planning iteration. Preparation-specific paths below describe the pre-v0.5.3 implementation that established the no-fourth-verdict rule.

## Problem

Three sites (`preparation.md:117`, `auto-mode.md:92`, `auto-mode.md:100`) framed `RE-IDEATE` as a
post-RECORD / row-5 evaluator verdict, but the evaluator aggregation only ever emits
PASS/REVISE/FAIL and `state.json` templates seed `verdict: null` — there was no schema slot for a
fourth verdict value. Everywhere else in the docs, re-Ideate was already treated as a per-gap
Preparation DISCUSSION resolution (a user decision), not a verdict — the three sites contradicted
the dominant model.

## Scope

In scope: `preparation.md`, `auto-mode.md`, `preparation/SKILL.md`, `preparation/evaluation.md` —
every site that framed or referenced `RE-IDEATE`/`re-ideate` as a verdict or an ITER/EXIT table row.
Out of scope: `state.json` / evaluator schema (no change needed — the fix removes the
non-representable framing rather than adding a slot for it).

## Approach

Collapse `re-ideate` entirely to the dominant DISCUSSION model: a user decision made during
Preparation's gap-resolution DISCUSSION, never an evaluator verdict and never a row-5 outcome.
Concretely: (1) reword `preparation.md`'s "not a REVISE / not a verdict" statement to state the
decision never reaches EVALUATION verdict aggregation and only ever produces PASS/REVISE/FAIL
downstream; (2) delete the "RE-IDEATE | Special verdict" row from the Preparation ITER/EXIT table,
with a clarifier paragraph explaining where the real routing lives; (3) reword `auto-mode.md:92` and
remove the row-5 "`RE-IDEATE` → re-enter Step 2" route, replacing it with an inline note that
re-ideate is handled in row-1 DISCUSSION, not row 5; (4) normalize the casing of `RE-IDEATE` /
`re-Ideate` / `re-ideate` across `preparation/SKILL.md` and `preparation/evaluation.md` so no site
still reads as verdict-shaped uppercase.

## Scenarios

- **Golden.** A Preparation gap is judged unworkable; the user picks `re-ideate` during DISCUSSION;
  Preparation halts and re-enters Ideation with the iter counter unchanged. No evaluator verdict is
  ever `RE-IDEATE`; the loop's actual verdict machinery is untouched.
- **Regression check.** A tree-wide grep for uppercase `RE-IDEATE` as a verdict spelling returns zero
  matches after the fix; lowercase/mixed-case `re-ideate` discussion language remains (that is
  correct — it is prose describing a user decision, not a verdict).

## Validation

Case-insensitive, root-relative grep for `RE-IDEATE` confirming no verdict-shaped uppercase spelling
remains anywhere in `.gobbi/projects/gobbi/skills`; both Claude and Codex Execution-loop evaluations
(iter1 and iter2) confirmed the removal with zero matches and no regression.

## Trade-offs

Optimizes for: one consistent model (DISCUSSION-resolution, never verdict) for `re-ideate` across
every site that mentions it. Accepts: this is a documentation-only normalization — no behavior change
for sessions that already treated re-ideate as a DISCUSSION decision, only for the 3 sites that
contradicted that model.

## Open issues

None outstanding for this fix — evaluators confirmed the removal is complete with no regression.

## Related

(none — this fix is self-contained; no cross-reference to another staged concept from this loop)
