---
name: phase-doc-count-verification
description: Verification checklist for confirming that the orchestration workflow/ directory holds exactly 7 files and identifying which 5 are the per-iter commit cadence targets.
type: checklists
scope: feature
feature: git-workflow
status: open
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [workflow-phase, per-iter-commit, orchestration, doc-count]
domain: evaluation-frame
---

# Workflow phase doc set — 5-vs-7 verification checklist

| # | Item | Status | Verification |
|---|---|---|---|
| 1 | Enumerate workflow/ directory to confirm 7 total files | implemented | `ls .claude/skills/orchestration/workflow/ \| wc -l` → 7 |
| 2 | Confirm 5 loop docs (ideation/preparation/planning/execution/wrap-up) are the per-iter commit cadence targets | implemented | Enumerated in `features/git-workflow/design/workflow-phase-doc-set-for-per-iter-cadence.md` |
| 3 | Confirm evaluation.md + memorization.md are excluded from per-iter commit cadence targets with rationale | implemented | "Excluded files + rationale" section in design doc |
| 4 | Planning brief for the per-iter commit cadence task includes dual grep verification gate (5 matches in loop docs, 0 in sub-phase docs) | pending (Planning action) | Grep gate documented in design file; Planning must include it in the task brief |

## Item details

The orchestration `workflow/` directory holds 7 files: 5 loop-phase docs (ideation, preparation, planning, execution, wrap-up) plus 2 sub-phase docs (evaluation, memorization). The per-iteration commit-cadence change must be applied to the 5 loop-phase docs only — not to `evaluation.md` or `memorization.md`. This checklist exists because the 5-vs-7 distinction was surfaced as a verification gap: an executor could miscount and either skip a loop doc or wrongly edit a sub-phase doc. Items 1-3 confirm the count and the target set; item 4 ensures the Planning brief carries a dual grep gate (5 matches in loop docs, 0 in sub-phase docs).

## Related

- Design: `../design/workflow-phase-doc-set-for-per-iter-cadence.md` (documents the 5 target files and the exclusion rationale).
- Surfaced by a Codex Overall-perspective evaluation finding during the worktree-first preparation work (session `1b26cf20`).
