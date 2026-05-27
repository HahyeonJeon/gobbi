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

## What

When a project skill teaches hook registration (e.g. `gobbi-hook-authoring`), every `settings.json` command-object example must include all required fields from the real settings. Specifically: `"type": "command"` is required (skills must not omit it), and commands must be bare paths with no `bash ` prefix (the real convention).

## Why

`gobbi-hook-authoring/SKILL.md` originally used `"command": "bash .claude/hooks/..."` without `"type": "command"`. The real `.claude/settings.json` hook objects use `{ "type": "command", "command": ".claude/hooks/..." }`. A registration example that drops a required field or adds a spurious `bash ` prefix teaches a shape Claude Code will not accept, so the example must mirror the real settings object exactly rather than approximate it.

## Verification

For any skill that teaches hook registration, ask before shipping: "does the registration JSON block include every field from the real `settings.json` hook objects, with no extra prefix?" After the fix here, the regression grep confirms the bad prefix is gone: `grep '"command": "bash '` → NONE.

## Status notes

Addressed — commit `5d2a7c6` aligned all examples with the real command-object shape and added the SessionStart registration block that had been omitted. The regression grep returns no matches.
