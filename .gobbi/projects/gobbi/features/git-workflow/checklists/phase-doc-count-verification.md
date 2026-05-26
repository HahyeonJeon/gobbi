---
scenario: phase-doc-count-verification
scope: feature
feature: git-workflow
last_updated: 2026-05-24
finding-id: COD-OVERALL-PREP1-004
type: checklist_gap
domain: evaluation-frame
disposition: addressed
confidence: 100
severity: Medium
addressed-by: preparation/staging/design/workflow-phase-doc-set-for-per-iter-cadence.md
---

# Workflow phase doc set — 5-vs-7 verification checklist

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Enumerate workflow/ directory to confirm 7 total files | COD-OVERALL-PREP1-004 (iter1 Codex Overall) | implemented | `ls .claude/skills/orchestration/workflow/ \| wc -l` → 7 |
| 2 | Confirm 5 loop docs (ideation/preparation/planning/execution/wrap-up) are the T1-I-T1.f targets | D-4 design decision | implemented | Enumerated in `staging/design/workflow-phase-doc-set-for-per-iter-cadence.md` |
| 3 | Confirm evaluation.md + memorization.md are excluded from T1-I-T1.f targets with rationale | iter2 Fix 5 | implemented | "Excluded files + rationale" section in design staging file |
| 4 | Planning T1-I-T1.f brief includes dual grep verification gate (5 matches in loop docs, 0 in sub-phase docs) | iter2 Fix 5 | pending (Planning action) | Grep gate documented in design file; Planning must include it in the task brief |
