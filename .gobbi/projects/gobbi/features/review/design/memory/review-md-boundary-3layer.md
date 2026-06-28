---
name: review-md-boundary-3layer
description: The 3-layer boundary model for review.md — coding/SKILL.md (write-side) → review.md (review-side) → evaluation.md (evaluator frame)
type: design
scope: feature
feature: review
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [design, docs-sync]
keywords: [boundary, 3-layer, framing-distinction, one-way-citation, deferred-wiring, non-redundancy]
author: claude
supersedes: null
---

# Design: `review.md` ↔ coding docs 3-layer boundary model

## Problem

`review.md` overlaps in coverage with `coding/evaluation.md` (user-accepted comprehensive breadth). Without a clear boundary model, a reader cannot tell which doc to open for a given use case, and two docs with overlapping checks risk diverging over time with no clear resolution rule.

## Scope

- Defines the 3-layer relationship between `coding/SKILL.md`, `review.md` (new), and `coding/evaluation.md`.
- Covers the framing/organization distinction, the one-way citation direction, and the authoritative-source rule.
- Does NOT cover the `/code-review` built-in or `evaluation/SKILL.md` (the gobbi evaluation machinery) in depth — those appear only as contextual references.

## Approach

### The 3-layer model

| Layer | Doc | Framing | Reader / agent | Organization |
|---|---|---|---|---|
| 1 | `coding/SKILL.md` | Write-side principles — what good code IS | The author, while writing | 16 principles: Why / Practice / Anti-pattern |
| 2 | `coding/review.md` (NEW) | Review-side playbook — what a reviewer CHECKS + how a review is CONDUCTED | Any reviewer (human or agent), standalone or as the substance for `/code-review` | 13 taxonomy points by review theme + Phase 0–5 procedure |
| 3 | `coding/evaluation.md` | Evaluator's executable frame — the per-perspective scenarios + checklists for grading a change-set against the 16 principles | The gobbi evaluator agent, at Stage 0–3 | 7 perspectives × seed scenarios + checklists, keyed to `(P1)…(P16)` |

### Boundary distinction: FRAMING/ORGANIZATION, not wiring-status

The distinction between `review.md` and `evaluation.md` is NOT wired-vs-not. Both docs' runtime wiring into the formal gobbi EVALUATION sub-phase is deferred:
- `evaluation.md` runtime load-both wiring: deferred (`coding/evaluation.md:3`).
- `review.md` automatic in-EVALUATION use: deferred (see `wire-review-doc-into-workflow` backlog).

The distinction is:
- **`review.md`**: organized by review theme (the 13 taxonomy points) + a conduct-a-review procedure. Reader: any reviewer, usable anywhere.
- **`evaluation.md`**: organized by the 7 evaluation perspectives + Stage 0–3 grading frame. Reader: the gobbi evaluator agent, used to grade a change-set in formal EVALUATION.

A reader who is unsure which doc to open resolves it in one read of the relationship section: use `review.md` to learn what to check and how to conduct a review; use `evaluation.md` if you are the formal gobbi evaluator running Stage 0–3.

### Citation direction

- `review.md` CITES `coding/SKILL.md` and `coding/evaluation.md` ONE-WAY (in scope, normal doc authoring).
- The REVERSE back-links (editing `coding/evaluation.md` and `coding/SKILL.md` to cite `review.md`) are DEFERRED WIRING, tracked in the `wire-review-doc-into-workflow` backlog.
- The acceptance gate for this session does NOT require editing the existing docs.

### Non-redundancy guard

To verify `review.md` does not collapse into a second seven-perspective frame:
- [ ] The taxonomy headings are NOT the 7 evaluation perspectives (Project/Structure/Performance/Aesthetics/Usage/Consistency/Risk).
- [ ] The procedure is NOT a Stage 0–3 grading procedure.
- [ ] The relationship section explicitly names the framing/organization distinction.

### Wiring-claim prohibition

Neither the design doc nor `review.md` may claim:
- That `evaluation.md` (or `review.md`) is "already wired" or "already running" in the gobbi evaluation phase.
- That `/code-review` already invokes `review.md` automatically.

All such claims must be phrased as future intent (e.g., "will serve as the substance for `/code-review` once wired").

## Scenarios

- **B3 — Boundary disambiguation**: a reader unsure whether to open `review.md` or `evaluation.md` reads the relationship section and resolves in one read. The framing/organization distinction is the resolution.
- **B4 — Redundancy collapse** (failure mode): a reader treats `review.md` as a second seven-perspective frame. Guarded by the non-redundancy check (headings are not the 7 perspectives).

## Validation

- [ ] `review.md` relationship section names all four: `coding/SKILL.md`, `review.md`, `coding/evaluation.md`, `evaluation/SKILL.md`.
- [ ] The framing/organization distinction is stated explicitly (not just "they are different docs").
- [ ] The authoritative-source rule is present (see `design/memory/review-md-authoritative-source-rule.md`).
- [ ] Non-redundancy check: taxonomy headings are NOT the 7 evaluation perspectives.
- [ ] One-way citation only: no instruction to edit `coding/evaluation.md` or `coding/SKILL.md` in this session.
- [ ] No present-tense wiring claims about `evaluation.md` or `review.md`.

## Trade-offs

- **Coverage overlap is accepted**: user chose comprehensive breadth. The overlap is not redundancy because the two docs are organized differently for different readers.
- **Deferred reverse links create a temporary navigation gap**: a reader of `coding/evaluation.md` cannot discover `review.md` from it until wiring ships. Accepted as the cost of the deferred-wiring scope.

## Open issues

- CONSIST-2 (Low/50): the authoritative-source rule names the authority but no drift-detection mechanism exists. Accepted residual. See `decisions/memory/2026-06-27-authoritative-source-drift-detection-gap.md`.
