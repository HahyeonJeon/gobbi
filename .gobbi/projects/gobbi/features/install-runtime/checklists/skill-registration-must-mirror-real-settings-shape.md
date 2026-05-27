---
name: skill-registration-must-mirror-real-settings-shape
description: Hook registration examples in skills must match the real settings.json command object shape
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-05-25
session: 45388fa9-74a5-42ff-acdf-1308ca35523f
tags: [hook, settings-json, registration, checklist, docs-sync, usage]
---

# Skill registration examples must mirror real settings.json command object shape

## Check

When a project skill teaches hook registration (e.g., `gobbi-hook-authoring`), every settings.json command object example MUST include all required fields from the real settings. As of this session:
- `"type": "command"` is required — skills must not omit it
- Commands must be bare paths (no `bash ` prefix) — skills must reflect the real convention

## Evidence

`gobbi-hook-authoring/SKILL.md` originally used `"command": "bash .claude/hooks/..."` without `"type": "command"`. The real `.claude/settings.json:35-36`, `:43-44`, `:51-52` use `{ "type": "command", "command": ".claude/hooks/..." }`. Corrected by aligning the examples and adding the SessionStart block that was omitted.

## Scenario gap

For any future skill that teaches hook registration: include a verification check — "does the registration JSON block include every field from the real settings.json hook objects?" — before shipping.

## Addressed

Commit `5d2a7c6` corrected all examples. Regression grep: `grep '"command": "bash '` → NONE.
