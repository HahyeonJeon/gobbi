---
name: evaluation-md-role-axis-framing
description: Describe evaluation.md on the role/organization axis, not the wiring-status axis — prevents present-tense wiring-claim leak
type: decisions
scope: feature
feature: coding
status: accepted
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [docs-sync, design]
keywords: [evaluation-md, role-axis, wiring-status, framing-distinction, present-tense-claim]
author: claude
supersedes: null
---

# Decision: describe `evaluation.md` on the role/organization axis, not the wiring-status axis

## Context

iter1 Claude findings `C-1` (design_flaw/docs-sync, Med/75) and `USG-1` (design_flaw/docs-sync, Med/75) found that the draft described `coding/evaluation.md` as already "plugged into the pipeline" or as the formal evaluation gate that an agent uses when evaluation runs. This was a wiring-claim leak: `evaluation.md`'s own runtime wiring is itself deferred (`coding/evaluation.md:3`). The description also failed to distinguish `evaluation.md` (evaluator's executable frame, used by the gobbi evaluator) from `review.md` (reader-facing playbook, usable by any reviewer anywhere).

## Decision

Describe `coding/evaluation.md` on the **role/organization axis**, not the wiring-status axis:

| Field | Value |
|---|---|
| Framing | Evaluator's executable frame |
| Reader/agent | The gobbi evaluator agent, at Stage 0–3 |
| Organization | 7 perspectives × seed scenarios + attached checklists, keyed to `(P1)…(P16)` |
| Wiring note | `evaluation.md`'s own runtime wiring is deferred (`coding/evaluation.md:3`) |

The **boundary between `review.md` and `evaluation.md`** is a **framing/organization distinction**:
- `review.md`: organized by review theme (13 taxonomy points) + a conduct-a-review procedure. Reader: any reviewer, anywhere.
- `evaluation.md`: organized by the 7 evaluation perspectives + Stage 0–3 grading frame. Reader: the gobbi evaluator, during formal EVALUATION.

Neither doc's wiring is described as already active.

## Rationale

Present-tense wiring claims are a known mistake in this project (see `mistakes/docs-sync/scrub-stack-idioms-when-adapting-to-general-doc.md`). Describing `evaluation.md` as wired-in overstates the current state and would contradict `coding/evaluation.md:3`. The role/organization axis is true regardless of wiring status and correctly distinguishes the two docs.

## Alternatives considered

- **Describe the boundary as wired vs. not-wired**: Rejected. Both docs' wiring is deferred. The distinction that matters is framing/organization and reader, not wiring state.
- **Say `evaluation.md` is the automated runtime evaluator**: Rejected. This is a wiring claim; `coding/evaluation.md:3` explicitly defers it.

## Consequences

- The relationship section in `review.md` must describe `evaluation.md` by role/organization, not by wiring status.
- Neither `review.md`'s boundary section nor the design doc may say `evaluation.md` is "already running" or "already plugged in."
- The distinction is captured in the 3-layer boundary table (see `features/coding/design/memory/review-md-boundary-3layer.md`).
