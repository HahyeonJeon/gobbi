---
name: git-skill-find-empty-delete-too-broad
description: The git skill's P5/P8 empty-parent sweep uses find -type d -empty -delete too broadly and can delete a live session's empty scaffold dirs; scope it to the removed worktree's parent only.
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-23
session: 2026-06-23-d0185dba
tags: [git, process]
keywords: [find-empty-delete, worktree-cleanup, scaffold-dirs, over-broad-sweep]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# git skill find -type d -empty -delete is too broad

## Context
The git skill's worktree-cleanup steps (P5 reorder / P8 retro-sweep) run a `find … -type d -empty -delete` to remove empty parent directories left after a worktree is removed. The sweep is not scoped tightly: an empty-directory delete that walks too high can remove a live session's freshly-bootstrapped but still-empty scaffold dirs (e.g. an Ideation session whose `staging/` subdirs are created empty before WORK fills them).

## Why deferred
Surfaced while framing the memory area-vocabulary session. It is unrelated to the memory feature in scope (`memory`); fixing it here would breach the locked scope contract (Principle 5). It is a real git-skill correctness bug, not part of the area-vocabulary or migration work.

## When to pick up
Any session touching the git skill's worktree-cleanup path. No hard prerequisite — can run any time. Prioritize before any campaign that runs concurrent sessions (where one session's empty scaffold could be swept by another's cleanup).

## Suggested approach
Scope the empty-dir sweep to the REMOVED worktree's own parent path only — never a repo-wide or `.gobbi/`-wide `find`. Anchor the `find` at the specific removed-worktree parent and bound its depth so it cannot ascend into other sessions' live trees. Add a guard that refuses to delete a dir that is (or is under) an active session dir referenced by a live `session.json`.

## Originating session
`.gobbi/projects/gobbi/sessions/2026-06-23-d0185dba-cd9b-45ad-93f6-7814c4f0ef4a/`

## Related

- (none yet)
