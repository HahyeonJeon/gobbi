---
name: naming-convention-enforcement
description: Design for naming convention enforcement via a new Coverage Ownership Matrix row covering memorization staging shape and naming.
type: design
scope: feature
feature: evaluation
status: active
created: 2026-05-23
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [naming-convention, coverage-ownership-matrix, memorization, evaluation]
---

# Naming Convention Enforcement via Consistency-Perspective Evaluator Check

## Context

Memory-file naming and staging-shape violations (bulk files instead of per-finding `{slug}.md`, wrong finding-type vocabulary, mis-routed domains) were being caught only after the fact, by the Wrap-up detection pass. By then the violating files already exist and must be cleaned up. The design needs an earlier signal that catches staging-shape-and-naming problems at evaluation time, before promotion.

## Approach

Add one row to the Coverage Ownership Matrix in `evaluation/SKILL.md`, mapping the cross-cutting concern "Memorization staging shape + naming" to the Consistency + Aesthetics perspectives, and add a cross-link from `memorization/SKILL.md § Path Conventions` pointing at the new matrix row. The row content (the full wording the user selected at the Planning DISCUSSION) is:

| Cross-cutting concern | Owning perspective(s) | What's verified |
|---|---|---|
| **Memorization staging shape + naming** | Consistency + Aesthetics | Per-finding `{slug}.md` filename convention (no bulk files); 5-Type vocabulary (`scenario_gap` / `checklist_gap` / `design_flaw` / `assumption_risk` / `general`) in frontmatter; Domain routing matches `evaluation/SKILL.md § Complete Domain → staging destination routing`; Slug+collision policy compliance per `evaluation/SKILL.md` § Slug + collision policy |

## Rationale

The Wrap-up detection pass is a back-stop that fires after violations exist. The Coverage Ownership Matrix row moves the same check to every loop's EVALUATION gate, where the Consistency + Aesthetics perspectives already run — so the violation is caught before the file is promoted, at zero new infrastructure cost (no new gate, no new pass; just one more row the existing perspectives consult).

## Alternatives considered

- **A bash one-liner in `wrap-up/SKILL.md` Step 2.5 checking for missing `mistake-candidate:` frontmatter** — rejected: too narrow, it only catches one frontmatter key. The matrix-row approach generalizes to all staging types and all naming/shape rules.

## Consequences

`evaluation/SKILL.md` carries the new matrix row, and `memorization/SKILL.md § Path Conventions` cross-links to it. Verification: `grep -A1 "staging shape\|staging shape + naming" evaluation/SKILL.md` returns the new row, and `grep "Coverage Ownership Matrix" memorization/SKILL.md` returns at least one hit.

## Related

- [`decisions/coverage-ownership-matrix-row-text.md`](../decisions/coverage-ownership-matrix-row-text.md) — the decision fixing the exact cell text of this row.
