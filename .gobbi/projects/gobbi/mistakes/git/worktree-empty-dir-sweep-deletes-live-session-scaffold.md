---
name: worktree-empty-dir-sweep-deletes-live-session-scaffold
description: find -type d -empty -delete over the whole worktrees/ dir deletes a live session's empty scaffold dirs
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-23
session: d0185dba-cd9b-45ad-93f6-7814c4f0ef4a
tags: [process]
keywords: [worktree, cleanup, find-empty-delete, scaffold]
author: claude
supersedes: null
superseded_by: null
priority: high
domain: git
---

# Empty-parent worktree cleanup must be scoped to the removed worktree, never the whole worktrees/ dir

## What went wrong
During P5 cleanup of a merged PR's worktree, I ran the documented empty-parent sweep
`find .gobbi/projects/<name>/worktrees/ -type d -empty -delete`. That command recurses the
ENTIRE `worktrees/` tree and deletes EVERY empty dir — including the freshly-scaffolded but
still-empty loop dirs (`1-ideation/working`, `staging/*`, `evaluation`, …) and `transcripts/`
of the CURRENT live session's own worktree, which had just been created by
`init-record-map.sh`. The live session's record skeleton was wiped.

## Why it went wrong
`find <dir> -type d -empty -delete` is not "remove the leftover parent of the worktree I just
removed" — it is "remove every empty directory anywhere under <dir>". A just-scaffolded session
tree is all-empty dirs, so it matches. The git skill's P5 step 3 and P8 stage 7 BOTH prescribe
this exact whole-`worktrees/` form for the nested-branch empty-parent case (`worktrees/feat/`),
so the footgun is in the documented procedure, not just ad-hoc use.

## How to recognize it before repeating
Any time a cleanup runs `find .../worktrees/ -type d -empty -delete` (or any recursive
empty-dir delete) while another worktree/session is live or just-scaffolded. Red flag: the
target path is the shared `worktrees/` parent rather than the single removed worktree's own
parent directory.

## Corrected approach
Scope the empty-parent cleanup to ONLY the removed worktree's parent chain. For a flat branch
name there is no leftover parent — skip the find entirely. For a nested branch name
(`feat/42-x` → leftover `worktrees/feat/`), `rmdir` just that specific parent, or run the find
rooted at that specific parent (`find worktrees/feat -type d -empty -delete`), never at the
shared `worktrees/` root. The git skill P5 step 3 / P8 stage 7 commands should be fixed to the
scoped form (out of scope this session — file as backlog against git-workflow).
