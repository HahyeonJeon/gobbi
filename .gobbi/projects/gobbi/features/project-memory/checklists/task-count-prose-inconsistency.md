---
date: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
type: checklist_gap
domain: docs-sync
addressed-in-iter: 2
addressed-how: "All count prose normalized to 25 executable records (after prose splits 22→25). Staged plan `main.md` `task_count: 25` and 25-row table synced. T11 dependency explained as '10 direct edges covering all 11 conformance records by transitive closure via T3→T4 and T6→T7'. Residual '22' tokens are historical '22→25' references, not active counts."
status: accepted
scope: feature
feature: project-memory
supersedes: null
superseded_by: null
---

# Task-count prose in the draft contradicts the actual enumerated task list

## Scenario

Plan drafts that enumerate task IDs must have internally consistent count prose. Any disconnect between narrative count claims ("18 tasks", "20 records") and the actual enumerated ID list (22 or 25 IDs) indicates either stale prose or missing records.

## Missing check

The iter1 draft said "18 in-session tasks" and "20 records" while enumerating 22 task IDs. The staged `main.md` had `task_count: 22` but the draft body and staged summary were inconsistent. Additionally, the T11 dependency was described as requiring "all 10 Wave-1 conformance tasks" while the conformance record count was 11 (after T9's 3-way split) — the explanation for why T11 has 10 direct edges but covers 11 records by transitive closure was missing.

## How to verify (corrected)

Before finalizing a plan, run a mechanical count of heading-level task IDs in the draft:
```
rg '^### (T[0-9]|P[0-9]|N[0-9])' draft-iter{n}.md | wc -l
```
This count must match every prose claim of task totals and the `task_count:` frontmatter field in the staged plan. Any reference to a T11-style transitive-closure dependency must include an explicit note explaining which direct edges cover which records by transitive closure.

## Related

- `planning/evaluation/iter1/codex/overall.md` (F3)
- `planning/evaluation/iter1/claude/aesthetics.md` (DOC-AESTH-1)
- `planning/rawdata/draft-iter2.md` §DL-L
