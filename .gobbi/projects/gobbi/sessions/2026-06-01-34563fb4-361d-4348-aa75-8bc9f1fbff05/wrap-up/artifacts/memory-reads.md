---
loop: wrap-up
iter: 1
artifact_type: memory-reads
created_at: 2026-06-01
status: final
---

# Memory reads — inputs consumed by Wrap-up's promotion-routing pass

## Session staging consumed (promoted)
- `execution/task-01/staging/decisions/codex-webfetch-undercounts-recently-added-table-row.md` → `mistakes/`
- `execution/task-01/staging/decisions/docs-sync-count-fix-blast-radius-includes-colocated-dates-and-tracking-pointers.md` → `mistakes/`

## Prior-loop artifacts / evaluation read (for handoff + closure audit)
- `ideation/rawdata/hooks-docs-webfetch-verification.md` (research + cross-system adjudication → count 30)
- `execution/task-01/evaluation/iter1/claude/{project,consistency,overall}.md`
- `execution/task-01/evaluation/iter1/codex/overall.md`
- `execution/task-01/artifacts/task-record.md`
- `execution/task-01/rawdata/{draft-iter1,draft-iter2}.md`

## Project memory read (collision / supersession detection)
- `.gobbi/projects/gobbi/mistakes/` (no slug collisions for the 2 new mistakes)
- `.gobbi/projects/gobbi/archive/{backlogs,checklists}/` (no 2026-06-01 collisions)
- `.gobbi/projects/gobbi/features/guardrails/{backlogs,checklists,references,README.md}`

## Wrap-up own eval read
- `wrap-up/evaluation/iter1/claude/{project,consistency,risk,overall}.md` (PASS)
- `wrap-up/evaluation/iter1/codex/overall.md` (REVISE → remediated → PASS)
