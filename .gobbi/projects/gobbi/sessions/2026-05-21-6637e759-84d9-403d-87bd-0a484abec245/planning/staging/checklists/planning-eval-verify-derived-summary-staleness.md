---
date: 2026-05-21
session: 6637e759-84d9-403d-87bd-0a484abec245
loop: planning
finding-id: F-CX-PLAN-O3-O-01-checklist
finding-type: checklist_gap
domain: docs-sync
severity: High
confidence: 100
disposition: addressed
scenario: Planning evaluator must grep derived summary for stale rawdata pointers
---

# Checklist Gap: Planning Evaluator Must Verify Derived Summary Against Rawdata Changes

## Scenario

When a Planning iteration modifies the rawdata draft, the derived summary (`staging/plans/main.md`) may retain stale pointers to prior-iter rawdata files. The evaluator must explicitly verify the summary, not just the rawdata.

## Checklist items

- [ ] After each rawdata iteration, run: `grep -nE "draft-iter[0-9]+\.md" staging/plans/main.md` and verify all operational pointers point to the current iter's rawdata (not a prior iter's).
- [ ] For LIGHT iter passes (main.md-only fix), additionally run: `grep -nE "<prior-iter-rawdata-filename>" staging/plans/main.md` to confirm zero residuals in operational sections.
- [ ] Verify that any newly added manager operations (e.g., precheck steps from REVISE fixes) are reflected in the derived summary's corresponding manager-ops sections.
- [ ] If a rawdata change adds or modifies a Decisions Log entry (D-PLAN-N), verify that the derived summary's D-PLAN lock enumeration (e.g., line 55) includes the new entry.

## Why this gap matters

Claude iter3 evaluation correctly verified the rawdata but missed that the derived summary retained stale `draft-iter2.md` pointers. Codex surfaced this with a mechanical grep. The gap is in the evaluation procedure, not the artifact.

## Promotion target

`features/repo-reset/checklists/` or `features/gobbi-workflow/checklists/` (planning evaluator discipline)
