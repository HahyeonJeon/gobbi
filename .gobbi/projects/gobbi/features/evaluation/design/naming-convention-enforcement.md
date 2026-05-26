---
date: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
feature: evaluation
loop: ideation
iter: 3
topic: naming-convention-enforcement
status: final
promoted-from: sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/staging/design/item-e-naming-convention-enforcement.md
promoted-at: 2026-05-23T14:00:00Z
---

# Design E — Naming Convention Enforcement via Consistency-Perspective Evaluator Check

**Chosen direction**: Add one row to `evaluation/SKILL.md § Coverage Ownership Matrix` mapping the new cross-cutting concern "Memorization staging shape + naming" to Consistency + Aesthetics perspectives. Add a cross-link from `memorization/SKILL.md § Path Conventions` pointing at the matrix row.

Row content (user-selected Draft A at Planning iter2 entry):

| Cross-cutting concern | Owning perspective(s) | What's verified |
|---|---|---|
| **Memorization staging shape + naming** | Consistency + Aesthetics | Per-finding `{slug}.md` filename convention (no bulk files); 5-Type vocabulary (`scenario_gap` / `checklist_gap` / `design_flaw` / `assumption_risk` / `general`) in frontmatter; Domain routing matches `evaluation/SKILL.md § Complete Domain → staging destination routing`; Slug+collision policy compliance per `evaluation/SKILL.md:385-393` |

**Rationale**: Item D (Step 2.5) is the detection pass — caught at Wrap-up. Item E is the evaluation-time signal — caught earlier at every loop's EVALUATION. The Consistency + Aesthetics perspectives already run at every loop's EVALUATION gate; adding a seed scenario for staging shape costs zero new infrastructure.

**Anchored insights**: I8, I11.

**Alternative rejected**: A bash one-liner in wrap-up/SKILL.md Step 2.5 checking for missing `mistake-candidate:` frontmatter. Rejected as too narrow; the matrix-row approach generalizes to all staging types.

**Validation**: `grep -A1 "staging shape\|staging shape + naming" evaluation/SKILL.md` returns the new row; `grep "Coverage Ownership Matrix" memorization/SKILL.md` returns ≥ 1 hit.

**Cross-links Bundle A creates (item E)**: memorization/SKILL.md § Path Conventions → evaluation/SKILL.md § Coverage Ownership Matrix § Memorization staging shape + naming.
