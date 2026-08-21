# Critique-first two-file Evaluation and Checklist coverage completed

**Completed at:** 2026-08-20T08:37:00Z

## Changes

- Replaced checklist-first Evaluation with a four-phase critique-first SOP, two freeze points, dual
  record, and per-runtime `report.md` plus working `checklist.md`. Current intent:
  [Evaluation](../design/process/evaluation.md).
- Gave Checklist a `supported` definition and coverage accounts that can finish with Covered, Not
  applicable, or Evidence gap and no invented sign. Named Evaluation baselines were not given
  accounts. Deferred remainder: [Evaluation backlog](../backlogs/evaluation.md).
- Added Partner write set `runtime-directory` so remaining-runtime evaluators can write sibling
  `checklist.md` without broadening `writing-path-only`. Current contract:
  [Partner](../design/feature/partner.md).
- Bound Workflow and Cowork to the two-file layout, contract-gate consumption, and incomplete-pair
  rule. Cowork uses one `tmp/` parent and no `gate.md`.
- Updated evaluator roles and Delegation so each launched runtime writes both files, loads both
  templates, and does not write `gate.md`. Removed Cursor evaluator `readonly: true`. Cursor
  Partner stays Unavailable.
- Regenerated plugin projections from canonical sources. Development account:
  [Evaluation and Checklist improvement](../reports/note/2026-08-20-evaluation-and-checklist.md).
