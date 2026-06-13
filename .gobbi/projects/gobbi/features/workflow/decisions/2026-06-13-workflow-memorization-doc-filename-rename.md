---
name: workflow-memorization-doc-filename-rename
description: skills/orchestration/workflow/memorization.md filename is itself renamed vocabulary and must become workflow/record.md
type: decisions
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [vocabulary-sweep, docs-sync, skill-restructure]
decision_status: accepted
supersedes: null
superseded_by: null
---

# Rename skills/orchestration/workflow/memorization.md to workflow/record.md

## Context
The file `skills/orchestration/workflow/memorization.md` is the manager's RECORD-orchestration doc. Its FILENAME contains the vocabulary being renamed under D5 (`MEMORIZATION` → `RECORD`). The iter1 draft had scoped this file for its prose content (it was inside B3, 35 other-live-skills) but never flagged its FILENAME as a rename target. This is the headline iter1 miss (INT-3).

## Decision
Rename `skills/orchestration/workflow/memorization.md` → `skills/orchestration/workflow/record.md`. Repoint all 15 live inbound `workflow/memorization` path references. (2 additional files are historical-exclude and must not be touched.)

## Rationale
INT-3: the file was verified EXISTS; 15 live inbound refs confirmed by `grep -rlF "workflow/memorization" $ROOT | grep -v sessions | grep -v features/workflow | grep -v notes`. The `.claude/skills/orchestration/workflow/memorization.md` per-file symlink also needs updating; `.agents/skills/orchestration` is dir-level so the filename rename auto-follows there.

## Alternatives considered
- Keep the filename, update only prose inside (rejected: the filename IS the vocabulary — any reader navigating by path still sees "memorization" for the RECORD-orchestration doc).

## Consequences
Adds an additional rename target to the sweep: 1 file rename + 15 ref repoints + 1 `.claude/skills` per-file symlink deletion + 1 new symlink creation. Documented in D-b mapping table row 5 and Implementation Checklist item 2.

## Related
- `features/workflow/decisions/2026-06-13-three-surface-loader-fixup.md`
- `evaluation/iter1/claude/structure.md` (struct-dbmapping-omits-workflow-memorization-doc)
