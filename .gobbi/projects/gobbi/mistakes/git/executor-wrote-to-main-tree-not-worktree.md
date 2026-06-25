---
name: executor-wrote-to-main-tree-not-worktree
description: Executor edited in-scope files with an absolute path missing the /worktrees/<branch>/ segment, so edits landed on the live main tree instead of the session worktree.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-18
session: 8129f657-4591-48b3-b83c-3aa9bc759ca6
tags: [process, execution, git]
keywords: [worktree, write-path, cwd-reset, absolute-path, session-isolation]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
related: [codex-wrapper-file-persistence-failure]
---

# Executor wrote to the main tree, not the session worktree

## What happened

During Task 01 (the `feature-readme` → `feature.md` rename), the executor edited
the C2–C6 reference files (`memory-map.md`, `interview/SKILL.md`, `record/SKILL.md`,
`wrap-up/SKILL.md`) using an absolute path rooted at the MAIN repo tree
(`/playinganalytics/git/gobbi/.gobbi/...`) instead of the per-session worktree
(`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/<branch>/.gobbi/...`).
The edits landed on the live working tree, not the isolated worktree branch. The
executor caught it at its first verification gate and `git restore`'d the stray
files; the manager independently confirmed the main tree was clean afterward (only
the pre-existing `.codex/config.toml` remained).

## User feedback

The user did not surface this directly; the executor caught the wrong-tree write at
its own first verification gate. The discipline below is the corrected approach the
session adopted thereafter, and the reason every brief in this session pins absolute
worktree paths on every write surface.

## Why it happens

The delegation listed in-scope files as worktree-relative paths (e.g.
`skills/memory/memory-map.md`). The executor resolved them against a repo-root
absolute prefix rather than the session worktree path. A `cd` into the worktree
does NOT persist across tool-call boundaries, and an absolute path that omits the
`/worktrees/<branch>/` segment silently targets the main tree — the file exists
there too, so there is no error to flag the mistake.

## Correct approach

Construct EVERY `Write` / `Edit` path from the session worktree path as the
absolute root — the full path must contain `/worktrees/<branch>/`. Never rely on a
prior `cd` (it resets across tool boundaries). Use `git -C <worktree>` for all git
operations. Verify immediately after the FIRST edit with a worktree-scoped
`git grep` or `git -C <worktree> status`; if the worktree shows no change, you wrote
elsewhere — stop and fix before continuing.

## How to detect

Any time you edit a file that exists in BOTH the main tree and a worktree, and your
write path does not contain `/worktrees/<branch>/`, you are writing to the wrong
tree. The tell after the fact: a worktree-scoped content check still shows OLD
content (your edits "didn't take"), while `git -C <main-tree> status` shows
unexpected modified files.

## Related

This is the same trap family as the prior `sendmessage-cwd-reset` / wrong-branch-write
mistakes — a Layer-2 generalization candidate (the absolute-worktree-path-in-briefs
discipline belongs in `delegation` / `execution` skill prose). See the
`layer2-skill-promotions-pending` backlog for the tracked follow-up. Distinct from
`codex-wrapper-file-persistence-failure` (which is about codex-exec backgrounding),
cross-linked only for the shared "verify the write landed where you meant" lesson.
