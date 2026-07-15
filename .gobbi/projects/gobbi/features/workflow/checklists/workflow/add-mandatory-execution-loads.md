---
name: add-mandatory-execution-loads
description: "Load both Execution authorities in every executor task delegation."
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [planning, process, verification]
keywords: [load-directives, execution-skill, execution-workflow]
author: codex
scenario: enumerate-every-live-policy-site
item_status: pending
anchor: novel
implemented_in: null
---

# Add mandatory Execution loads

## What

Load `.gobbi/projects/gobbi/skills/execution/SKILL.md` and `.gobbi/projects/gobbi/skills/orchestration/workflow/execution.md` in Tasks 01, 02, and 03.

## Why

The iter1 assignment records omitted mandatory phase context from all six task representations.

## Verification

Both paths occur in every task assignment in the final task-list artifact.

## Status notes

This deduplicates Claude `F-STRUCT-1` and `F-OVR-1` with Codex `CDEX-PLAN-I1-STR-002`, `CDEX-PLAN-I1-USAGE-003`, `CDEX-PLAN-I1-CONS-002`, and `CDEX-PLAN-I1-OVERALL-002`. The root was addressed in iter2 and preserved in iter3.

## Related

- [[deterministic-codex-model-policy]] - the plan carrying all three load packages.
