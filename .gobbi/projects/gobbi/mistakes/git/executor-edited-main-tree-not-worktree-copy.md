---
name: executor-edited-main-tree-not-worktree-copy
description: In a gobbi self-edit, the executor edited the main-tree skill copies instead of the worktree copies because the absolute path omitted the worktrees/{branch}/ segment; the worktree gate then read stale baseline values
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [git, process, verification]
keywords: [worktree, write-path, main-tree, gobbi-self-edit, nested-duplicate-subtree]
author: claude
priority: high
domain: process
---

# Executor edited the main-tree skill copies, not the worktree copies

## What happened

The brief defined `PM = $WT/.gobbi/projects/gobbi` (the per-session worktree). The executor read and
Edited `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/...` — the MAIN tree — dropping the
`worktrees/{branch}/` path segment. Because gobbi edits its OWN skill tree, the same tracked path
`.gobbi/projects/gobbi/skills/...` exists in BOTH the main checkout (branch `develop`) and the
worktree checkout (the session branch) as separate inodes. All 6 edits landed in the main tree; the
worktree copies stayed untouched. The verification gate (which read `$PM` = worktree) reported the OLD
values (`schemaVersion 2`, `integration: null`), surfacing the error.

## Why it happens

Self-referential repo trap: when the project being edited is gobbi itself, the worktree contains a
nested `.gobbi/projects/gobbi/skills/` that mirrors the main tree's path exactly. An absolute path that
omits the `worktrees/{branch}/` prefix silently resolves to the main tree — it is NOT a relative-path
slip (the documented continuation trap), so re-`cd` and `git -C` discipline do not catch it. The Edit
tool reported success because the main-tree file IS a valid writable file; nothing flagged the wrong
tree.

## Correct approach

Resolve every in-scope path against the absolute worktree root from the brief
(`$WT` / `session.json.git.worktreePath`) and verify each path literally contains the
`worktrees/{branch}/` segment before the first write. When the gate disagrees with the edits,
immediately diff main-tree vs worktree inodes (`ls -i`) rather than re-editing. Recovery: per-file
`git restore --source=HEAD -- <paths>` on the main tree (safe, single-file), then re-apply against the
worktree — never `cp` main→worktree when the worktree branch carries prior commits that diverge from
the main baseline.

## How to detect

- The task edits files under `.gobbi/projects/{name}/skills/...` AND the project name equals the
  repo's own gobbi project (self-edit) — the worktree then contains a nested duplicate of that subtree.
- Before the FIRST Read/Edit, confirm the path begins with the worktree root
  (`.../worktrees/{branch}/...`). A skill-file path WITHOUT `worktrees/` points at the main tree.
- A gate that reads `$PM`/worktree returns BASELINE values after edits "succeeded" → the edits hit a
  different tree.

## Related

- [[executor-wrote-to-main-tree-not-worktree]] — the recorded mistake this is the self-edit variant of
- [[recorded-mistakes-recurred-recording-is-not-enforcement]] — this recurred despite being recorded
