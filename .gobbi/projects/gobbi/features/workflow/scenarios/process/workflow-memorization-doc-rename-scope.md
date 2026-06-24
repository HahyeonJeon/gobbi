---
name: workflow-memorization-doc-rename-scope
description: The doc-filename rename of workflow/memorization.md must be in scope, including its 15 live inbound path refs
type: scenarios
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [vocabulary-sweep]
keywords: [scenario, filename-rename]
author: claude
---

# Scenario: workflow/memorization.md doc-filename is in scope as a rename target

**Category:** edge-case
**Coverage:** covered

## Situation
A sweep of the vocabulary rename is running. The file `skills/orchestration/workflow/memorization.md` exists in the in-scope file set (it is inside B3 of the D-e manifest). Without explicit recognition that the FILENAME itself is renamed vocabulary, an executor may update the file's prose content but leave the filename and all inbound path references pointing at the old `workflow/memorization` path.

## Inputs
- `skills/orchestration/workflow/memorization.md` — present on disk, confirmed by `test -f`.
- 15 live inbound path refs: `grep -rlF "workflow/memorization" $ROOT | grep -v sessions | grep -v features/workflow | grep -v notes` → 15 files.
- `.claude/skills/orchestration/workflow/memorization.md` per-file symlink pointing at it.

## Expected behavior
The file is RENAMED (not just edited) to `skills/orchestration/workflow/record.md`. All 15 inbound path references are repointed. The `.claude/skills/orchestration/workflow/memorization.md` per-file symlink is deleted and a new `workflow/record.md` symlink is created. The `.agents/skills/orchestration` dir-level symlink auto-follows the rename.

## Verification
After rename: `test -f skills/orchestration/workflow/record.md` → exists; `test ! -f skills/orchestration/workflow/memorization.md` → absent; `grep -rl "workflow/memorization" $ROOT | grep -v sessions | grep -v features/workflow | grep -v notes` → 0 results; presence gate confirms `workflow/record.md` reachable via `.claude/skills/orchestration/`.

## Related
- Design § D-b (mapping table row 5)
- `features/workflow/decisions/2026-06-13-workflow-memorization-doc-filename-rename.md`
