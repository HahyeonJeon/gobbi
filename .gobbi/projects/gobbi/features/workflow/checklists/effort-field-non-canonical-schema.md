---
scenario: plan-task-schema-compliance
feature: workflow
last_updated: 2026-05-24
finding-id: effort-field-non-canonical
type: checklist_gap
domain: docs-sync
disposition: open
confidence: 100
severity: Low
surfaced-by: claude+codex (convergent)
loop: planning
---

# `effort:` field in task YAML is non-canonical per planning/SKILL.md

## Situation

All 10 tasks in the plan include an `effort:` field (values: Small, Medium, Large). The canonical task schema in `planning/SKILL.md` does not define an `effort:` field. The field is present uniformly across all tasks but lacks a schema authority.

## Checklist Items

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Either remove `effort:` from task YAML schema or add it to planning/SKILL.md as an official field | planning/SKILL.md task schema | pending | grep -c 'effort:' in next planning draft should be 0 (removed) OR planning/SKILL.md should include effort in the task schema |
| 2 | If `effort:` is retained, define allowed values (Small/Medium/Large/XL) and their calibration | novel | pending | Decision record in decisions/ |

## Notes

Low severity — executors do not act on `effort:` fields (they receive task briefs, not raw YAML). The field is useful for planning estimation. Decision to formalize or drop is the user's call.
