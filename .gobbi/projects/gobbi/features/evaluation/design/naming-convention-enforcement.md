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

# Design E — Naming Convention Enforcement via Consistency-Perspective Evaluator Check

**Chosen direction**: Add one row to `evaluation/SKILL.md § Coverage Ownership Matrix` mapping the new cross-cutting concern "Memorization staging shape + naming" to Consistency + Aesthetics perspectives. Add a cross-link from `memorization/SKILL.md § Path Conventions` pointing at the matrix row.

Row content (user-selected in Planning DISCUSSION):

| Cross-cutting concern | Owning perspective(s) | What's verified |
|---|---|---|
| **Memorization staging shape + naming** | Consistency + Aesthetics | Per-finding `{slug}.md` filename convention (no bulk files); 5-Type vocabulary (`scenario_gap` / `checklist_gap` / `design_flaw` / `assumption_risk` / `general`) in frontmatter; Domain routing matches `evaluation/SKILL.md § Complete Domain → staging destination routing`; Slug+collision policy compliance per `evaluation/SKILL.md:385-393` |

**Rationale**: The Step 2.5 Wrap-up detection pass catches naming violations after the fact. The Coverage Ownership Matrix row is the evaluation-time signal — caught earlier at every loop's EVALUATION. The Consistency + Aesthetics perspectives already run at every loop's EVALUATION gate; adding a seed scenario for staging shape costs zero new infrastructure.

**Alternative rejected**: A bash one-liner in wrap-up/SKILL.md Step 2.5 checking for missing `mistake-candidate:` frontmatter. Rejected as too narrow; the matrix-row approach generalizes to all staging types.

**Validation**: `grep -A1 "staging shape\|staging shape + naming" evaluation/SKILL.md` returns the new row; `grep "Coverage Ownership Matrix" memorization/SKILL.md` returns ≥ 1 hit.

**Cross-links Bundle A creates (item E)**: memorization/SKILL.md § Path Conventions → evaluation/SKILL.md § Coverage Ownership Matrix § Memorization staging shape + naming.
