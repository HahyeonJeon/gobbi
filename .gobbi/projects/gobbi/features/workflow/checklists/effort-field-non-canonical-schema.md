---
name: effort-field-non-canonical-schema
description: The effort field in task YAML is not defined in planning/SKILL.md — checklist item to formalize or remove it.
type: checklists
scope: feature
feature: workflow
status: open
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [planning, task-schema, effort-field, checklist]
domain: docs-sync
last_updated: 2026-05-24
---

# `effort:` field in task YAML is non-canonical — implementation checklist

All 10 tasks in the plan include an `effort:` field (values: Small, Medium, Large), but the canonical task schema in `planning/SKILL.md` does not define an `effort:` field. The field is present uniformly across all tasks yet lacks a schema authority, so Planning must decide whether to formalize or drop it.

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Either remove `effort:` from the task YAML schema or add it to `planning/SKILL.md` as an official field | `planning/SKILL.md` task schema | pending | `grep -c 'effort:'` in the next planning draft is 0 (removed), OR `planning/SKILL.md` includes `effort` in the task schema |
| 2 | If `effort:` is retained, define the allowed values (Small/Medium/Large/XL) and their calibration | novel | pending | Decision record in `decisions/` |

## Item details

### 1. Resolve the schema authority for `effort:`

**Anchor reasoning**: the canonical task schema in `planning/SKILL.md` is the authority for task-YAML fields; an undefined field either belongs in that schema or should not appear.

### 2. Calibrate the values if retained

**Anchor reasoning**: novel — no reference governs effort calibration; if the field is kept, its value set and calibration need a decision record.

Low severity — executors do not act on `effort:` fields (they receive task briefs, not raw YAML). The field is useful for planning estimation; whether to formalize or drop it is the user's call.
