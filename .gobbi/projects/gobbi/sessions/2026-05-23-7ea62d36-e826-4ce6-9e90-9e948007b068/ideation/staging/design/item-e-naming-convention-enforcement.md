---
date: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
feature: gobbi-orchestration-workflow-improvements
loop: ideation
iter: 3
topic: item-e-naming-convention-enforcement
status: final
---

# Design E — Naming Convention Enforcement via Consistency-Perspective Evaluator Check

**Chosen direction**: Add one row to `evaluation/SKILL.md § Coverage Ownership Matrix` mapping the new cross-cutting concern "Memorization staging shape + naming" to Consistency + Aesthetics perspectives. Add a cross-link from `memorization/SKILL.md § Path Conventions` (lines 223-231) pointing at the matrix row.

Row content (proposed — Planning to confirm exact text with user per open concern 3): "Per-finding `{slug}.md` files exist for every evaluation finding; filenames are kebab-case derived from the finding's primary symptom; templates stamped correctly (frontmatter schema per `memorization/SKILL.md § Templates`). Aesthetics checks naming-convention; Consistency checks that every finding has a corresponding staging file."

**Rationale**: Item D (Step 2.5) is the detection pass — caught at Wrap-up. Item E is the evaluation-time signal — caught earlier at every loop's EVALUATION. The Consistency + Aesthetics perspectives already run at every loop's EVALUATION gate; adding a seed scenario for staging shape costs zero new infrastructure. CLI lint is infeasible (`packages/cli/src/` does not exist in the current repo — verified via `ls /playinganalytics/git/gobbi/packages/cli/src/`).

**Anchored insights**: I8, I11.

**Alternative rejected**: A bash one-liner in wrap-up/SKILL.md Step 2.5 checking for missing `mistake-candidate:` frontmatter. Rejected as too narrow; the matrix-row approach generalizes to all staging types.

**Validation**: `grep -A1 "staging shape\|staging shape + naming" evaluation/SKILL.md` returns the new row; `grep "Coverage Ownership Matrix" memorization/SKILL.md` returns ≥ 1 hit.

**Cross-links Bundle A creates (item E)**: memorization/SKILL.md § Path Conventions → evaluation/SKILL.md § Coverage Ownership Matrix § Memorization staging shape + naming.
