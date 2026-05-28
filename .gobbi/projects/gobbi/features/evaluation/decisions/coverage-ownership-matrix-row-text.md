---
name: coverage-ownership-matrix-row-text
description: Coverage Ownership Matrix new row exact cell text — user selected Draft A (full) during Planning to cover memorization staging shape and naming.
type: decisions
scope: feature
feature: evaluation
status: active
created: 2026-05-23
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [coverage-ownership-matrix, memorization, evaluation, staging]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Coverage Ownership Matrix exact cell text

## Context

The evaluation design adds one row to the Coverage Ownership Matrix in `evaluation/SKILL.md`, mapping the cross-cutting concern "Memorization staging shape + naming" to the Consistency + Aesthetics perspectives. The design deferred the exact wording of that row's "Owning perspective(s)" and "What's verified" cells to the Planning DISCUSSION, where the user would choose between a full and a tightened draft.

## Decision

Use the **full** wording (Draft A). The user selected it when re-entering the Planning loop for a second iteration after a REVISE verdict, and that verbatim text is what the skill-authoring brief carries into the matrix:

| Cross-cutting concern | Owning perspective(s) | What's verified |
|---|---|---|
| **Memorization staging shape + naming** | Consistency + Aesthetics | Per-finding `{slug}.md` filename convention (no bulk files); 5-Type vocabulary (`scenario_gap` / `checklist_gap` / `design_flaw` / `assumption_risk` / `general`) in frontmatter; Domain routing matches `evaluation/SKILL.md § Complete Domain → staging destination routing`; Slug+collision policy compliance per `evaluation/SKILL.md` § Slug + collision policy |

## Rationale

The full wording spells out each thing the Consistency + Aesthetics perspectives must verify — the per-finding filename convention, the 5-Type vocabulary, the domain-routing match, and the slug/collision policy — by name rather than by abbreviation. The cell is the evaluator's checklist at the EVALUATION gate, so being explicit there is worth the extra length; a reader does not have to chase the canonical section to know what to check.

## Alternatives considered

- **Draft B — tightened wording** (not selected): `{slug}.md` per-finding; 5-Type vocabulary; Domain routing matches `evaluation/SKILL.md`; collision policy. Rejected because the abbreviations push the evaluator back to the canonical section to learn what each item means, defeating the purpose of an at-a-glance checklist cell.

## Consequences

`evaluation/SKILL.md`'s Coverage Ownership Matrix carries the full Draft A row verbatim; the Consistency + Aesthetics perspectives gain an explicit staging-shape-and-naming check at every loop's EVALUATION gate.

## Related

- [`design/naming-convention-enforcement.md`](../design/naming-convention-enforcement.md) — the design that introduced this matrix row.
- Canonical sources consulted: the Coverage Ownership Matrix schema, the 5-Type vocabulary, and the Slug + collision policy — all in `evaluation/SKILL.md`; the defer-to-Planning instruction is in the session's Ideation idea spec.
