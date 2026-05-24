---
loop: preparation
iter: 3
artifact_type: resolution-log
created-by: 1b26cf20-677b-498c-8c1b-7d7e971597ac
created-at: 2026-05-24
status: final
---

# Preparation MEMORIZATION — Resolution Log (all findings, iters 1–3)

Cumulative audit of every evaluator finding across iters 1..3 with final disposition.

## Iter1 Codex findings

| Finding ID | Type | Domain | Iter1 Disp | Final Disp | Resolved by |
|---|---|---|---|---|---|
| COD-AESTH-PREP1-001 | general | docs-polish | open | deferred (non-blocking) | Row-13 wording; not in iter scope |
| COD-AESTH-PREP1-002 | general | evidence-wording | open | addressed (iter2) | Fix 1 corrected false mirror evidence |
| COD-AESTH-PREP1-003 | checklist_gap | docs-polish | open | deferred (non-blocking) | Low polish; not in scope |
| COD-CONS-PREP1-001 | design_flaw | mirror-policy | open | addressed (iter2) | Fix 1+2 corrected mirror-canonical lock |
| COD-CONS-PREP1-002 | general | empirical-evidence | open | addressed (iter2) | 53-symlink empirical evidence added |
| COD-CONS-PREP1-003 | checklist_gap | consistency | open | addressed (iter2) | Empirical verification checklist in draft |
| COD-CONS-PREP1-004 | general | docs-sync | open | deferred (non-blocking) | Row-13 wording; Codex iter3 deferred |
| COD-OVERALL-PREP1-001 | design_flaw | mirror-policy | open | addressed (iter2) | Fix 1+2 corrected lock |
| COD-OVERALL-PREP1-002 | assumption_risk | task-briefing | open | superseded | Superseded by COD-OVERALL-PREP2-001 |
| COD-OVERALL-PREP1-003 | general | empirical-evidence | open | addressed (iter2) | Fix 1+2 — 53-symlink evidence anchors the new lock |
| COD-OVERALL-PREP1-004 | checklist_gap | evaluation-frame | open | addressed (iter2) | Fix 5 — D-4 "Excluded files + rationale" section |
| COD-PERF-PREP1-001 | assumption_risk | downstream-cost | open | addressed (iter2) | False edit model removed; downstream cost risk eliminated |
| COD-PERF-PREP1-002 | checklist_gap | downstream-cost | open | addressed (iter2) | No downstream-cost verification needed (symlink resolves natively) |
| COD-PERF-PREP1-003 | general | readiness | open | addressed (iter2) | Readiness re-verified with corrected lock |
| COD-PROJ-PREP1-001 | design_flaw | mirror-policy | open | addressed (iter2) | Fix 2 — new decision file with corrected lock |
| COD-PROJ-PREP1-002 | scenario_gap | mirror-policy | open | addressed (iter2) | Scenario staged + decision file with corrected lock |
| COD-PROJ-PREP1-003 | general | docs-sync | open | addressed (iter2) | Draft V-1 evidence wording corrected |
| COD-RISK-PREP1-001 | assumption_risk | write-safety | open | superseded → addressed (iter3) | Superseded by COD-RISK-PREP2-001; addressed via iter3 edit contract |
| COD-RISK-PREP1-002 | design_flaw | mirror-policy | open | addressed (iter2) | Fix 1+2 corrected mirror-canonical lock |
| COD-RISK-PREP1-003 | checklist_gap | risk | open | addressed (iter2) | Write-safety risk addressed by corrected lock |
| COD-RISK-PREP1-004 | general | re-ideate | open | addressed (iter2) | No re-ideate needed; scope contract remains workable |
| COD-STRUCT-PREP1-001 | design_flaw | structure | open | superseded → addressed (iter3) | Superseded by COD-STRUCT-PREP2-001; addressed via iter3 edit contract |
| COD-STRUCT-PREP1-002 | checklist_gap | structure | open | addressed (iter2) | Fix 1+2 corrected structural claim |
| COD-STRUCT-PREP1-003 | general | docs-sync | open | deferred (non-blocking) | Row-13 wording; Codex iter3 deferred |
| COD-USAGE-PREP1-001 | assumption_risk | consumer-mental-model | open | addressed (iter2) | Fix 1+2+5 corrected consumer-facing model |
| COD-USAGE-PREP1-002 | design_flaw | task-briefing | open | superseded → addressed (iter3) | Superseded by COD-USAGE-PREP2-001; addressed via iter3 edit contract |
| COD-USAGE-PREP1-003 | scenario_gap | consumer-mental-model | open | addressed (iter2) | Scenario staged; decision file addresses mental model |

## Iter2 Codex findings (new — caused REVISE)

| Finding ID | Type | Domain | Iter2 Disp | Final Disp | Resolved by |
|---|---|---|---|---|---|
| COD-STRUCT-PREP2-001 | design_flaw | edit-surface | open | addressed (iter3) | iter3 Fix 1 — new H2 "## Symlink-preservation edit contract" |
| COD-USAGE-PREP2-001 | assumption_risk | task-briefing | open | addressed (iter3) | iter3 Fix 1 — edit contract discipline list (prefer Edit tool, canonical path for bulk) |
| COD-CONS-PREP2-001 | design_flaw | empirical-evidence | open | addressed (iter3) | iter3 Fix 1 — new H2 qualifies the broad claim; safety table makes asymmetry explicit |
| COD-RISK-PREP2-001 | assumption_risk | write-safety | open | addressed (iter3) | iter3 Fix 1 — 3-level defense: discipline + `test -L` gate + deferred CI hook |
| COD-OVERALL-PREP2-001 | assumption_risk | task-briefing | open | addressed (iter3) | iter3 Fix 1 — all 4 discipline points + coverage map |
| COD-PERF-PREP2-001 | assumption_risk | downstream-cost | open | addressed (iter3) | Runtime `test -L` gate costs negligible; CI hook deferred |

## Iter3 Claude findings (new — all PASS, non-blocking)

| Finding ID | Type | Domain | Iter3 Disp | Final Disp | Notes |
|---|---|---|---|---|---|
| CL-CONS-PREP3-001 | design_flaw | docs-sync | open | open (non-blocking) | Consequences section still has unqualified claim; Low/C75 |
| CL-STRUCT-PREP3-001 | design_flaw | docs-sync | open | open (non-blocking) | Same as above from Structure lens; Low/C50 |
| CL-PROJ-PREP3-001 | assumption_risk | docs-sync | open | open (non-blocking) | Same as above from Project lens; Low/C50 |
| CL-RISK-PREP3-001 | assumption_risk | process | open | open (non-blocking) | Deferred CI backlog pseudocode plumbing; Low/C25 |
| CL-AESTH-PREP3-001 | general | docs-sync | open | open (non-blocking) | Dense row 20 in decisions log; Low/C25; low-conf appendix |

## Summary

- **Total iter1 findings**: 27 (Codex only; Claude iter1 had no typed findings per file content)
- **Total iter2 new findings**: 6 (all Codex; Claude iter2 was PASS across all 8 perspectives)
- **Total iter3 new findings**: 5 (all Claude; all PASS non-blocking)
- **Addressed**: 30 findings across iters 1-3
- **Superseded**: 3 iter1 findings superseded by narrower iter2 findings (then addressed in iter3)
- **Deferred (non-blocking)**: 3 iter1 findings + all 5 iter3 open findings (Low severity)
- **Open at loop close**: 5 iter3 Claude findings (all Low, non-blocking; Preparation loop PASS)
