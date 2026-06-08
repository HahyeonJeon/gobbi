---
name: hook-registry-verify-proves-command-shape
description: Checklist gap — hook registration verify must assert the command path and shape, not just the key's existence in the registry
type: checklists
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [hooks, verification, registration]
scenario: hook-registration-correctness
item_status: implemented
anchor: novel
implemented_in: sessions/2026-06-08-c7673705-2d69-4be8-9bd4-436c3eb91be2/planning/rawdata/draft-iter1.md
---

# Hook registration verify checklist — command shape assertion

## What

When a task registers a hook event in a registry (`.claude/settings.json` or `hooks.json`), the verify must assert the actual command path and entry shape — not merely that the event key exists in the JSON.

## Why

Registries use nested arrays with `hooks[].command` fields (verified in `.claude/settings.json:35-60` and `.gobbi/projects/gobbi/hooks/hooks.json:1-27`). An empty or malformed SessionEnd entry can pass a `jq -e '.hooks.SessionEnd'` check while never invoking the intended script.

Two evaluator systems identified this gap:
- Claude CONS-2 / STR-2: task 02 postcondition (no toolu_ ids) is only guaranteed by downstream 03/04; task 01 verify references wrong downstream task.
- Codex USAGE-004 (Usage, checklist_gap, High, Confidence 75): task 05 proves key existence, not hook registration.

## Verification

For any task that registers a hook in a registry, the verify must include:
```bash
jq -r '.hooks.SessionEnd[].hooks[].command' .claude/settings.json | grep -q session-end.sh
jq -r '.hooks.SessionEnd[].hooks[].command' .gobbi/projects/gobbi/hooks/hooks.json | grep -q session-end.sh
```
Also assert the entry shape matches the pattern of existing hooks (bare `.claude/hooks/...` path for settings.json; `bash "${CLAUDE_PLUGIN_ROOT}/hooks/..."` for hooks.json).

## Status notes

Addressed in iter2: task 05's verify was strengthened with command-path assertions in both registries plus entry-shape matching. The checklist item is `implemented` for this session's plan.
