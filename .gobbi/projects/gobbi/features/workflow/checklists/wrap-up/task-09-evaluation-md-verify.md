---
name: task-09-evaluation-md-verify
description: When a task's files list includes wrap-up/evaluation.md, the task's verifies must assert a token unique to the evaluation.md edit
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [planning, verification, docs-sync, wrap-up, evaluation]
keywords: []
author: claude
---

# Task-09: verify that wrap-up/evaluation.md was actually edited

**Category:** checklist-gap
**Coverage:** partial

## Situation

Task-09 (`09-wrapup-pipeline-and-handoff`) lists `$SK/wrap-up/evaluation.md` in its `files:` section (op: modify). The task description says to align `evaluation.md` with the restructured wrap-up pipeline (vocab + stage-3-as-EVALUATION). However, the task's `verifies` command (iter1 and iter2 both) only checks tokens in `wrap-up/SKILL.md` — it never verifies anything in `evaluation.md`.

An unverified edit in a `files:` entry can be silently skipped or left inconsistent with the restructured `SKILL.md`. The iter2 quick-patch added an `evaluation.md` content assertion to the verify command, closing this gap, but the checklist item is staged to track the pattern going forward.

## Inputs

A planning task with `files:` entry for file X and a `verifies:` command that does not check any token in file X.

## Expected behavior

Every file listed in a task's `files:` (op: modify) must have at least one corresponding assertion in the task's `verifies:` command that proves the modification landed.

## Verification

When reviewing planning artifacts: for each task, cross-check `files:` entries against the `verifies:` command. Any file listed as modified but not referenced in `verifies:` is a checklist gap.

## Related

- `3-planning/evaluation/iter1/claude/structure.md` § STRUCT-5
- `3-planning/evaluation/iter2/claude/structure.md` § STRUCT-3-iter2
- `3-planning/working/draft-iter2.md` § task-09 verifies (quick-patched to add evaluation.md check)
