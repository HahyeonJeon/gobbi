---
name: executor-main-tree-edit-near-miss
description: Executor edited the main-tree file instead of the worktree copy when constructing absolute paths without the worktree-root prefix.
type: mistakes
scope: project
feature: null
status: active
created: 2026-05-25
session: 45388fa9-74a5-42ff-acdf-1308ca35523f
tags: [process, worktree, execution]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Executor Edited Main-Tree File Instead of Worktree Copy (Near-Miss)

## Context

During T07 iter2, the executor needed to edit `.codex/AGENTS.md`. The worktree is at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9/`. The worktree copy of `.codex/AGENTS.md` lives at:

`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9/.codex/AGENTS.md`

The main-tree copy lives at:

`/playinganalytics/git/gobbi/.codex/AGENTS.md`

## What went wrong

The executor initially ran the Edit tool against the main-tree absolute path (`/playinganalytics/git/gobbi/.codex/AGENTS.md`) instead of the worktree-physical copy. The error was caught (the Edit succeeded against the main tree, which was the wrong target). The executor then restored the main-tree file to its prior state and re-applied the edit against the correct worktree path.

## Why it went wrong (mistaken assumption)

The executor resolved the path from the filename `.codex/AGENTS.md` without verifying that the path was under the worktree root. The cwd for Bash calls is the worktree root, but the Edit tool accepts absolute paths — so a relative conceptualization (`just .codex/AGENTS.md`) silently resolves to the main-tree absolute path rather than the worktree-physical path. The worktree-physical path requires the full prefix `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9/`.

## How to recognize

- You are working in a worktree session and need to edit a file that also exists in the main tree (e.g., `.codex/AGENTS.md`, `.claude/CLAUDE.md`, `.gobbi/projects/gobbi/skills/...`).
- You construct an absolute path that starts at the repo root (`/playinganalytics/git/gobbi/`) rather than the worktree root (`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9/`).
- The Edit tool succeeds — no error is thrown — but git diff in the worktree shows no changes, while `git diff` in the main tree shows the change. This is the hallmark of the wrong-target edit.

## Corrected approach

Before any Edit in a worktree session:
1. Confirm `pwd` = worktree root (or run `pwd` in Bash to verify).
2. For every file to be edited, verify the absolute path begins with the worktree root prefix, not the repo root.
3. When constructing the target path, always prepend `<worktree-root>/` explicitly — never infer from a short relative filename.
4. After the edit, run `git diff --name-only` IN THE WORKTREE to confirm the changed file is listed. If not, the edit landed in the wrong location.

## Relate to prior mistake

This is the same class as `executor-mirror-path-vs-worktree-physical-copy` (if promoted). Root cause: a file that exists in both the main tree and the worktree — when referenced without the explicit worktree-root prefix, the path resolves to the main tree.

## Related

- `.gobbi/projects/gobbi/mistakes/codex-wrapper-relative-path-wrong-session-write.md` — same class: path resolves to wrong location when worktree prefix is omitted
- T07 iter2 executor execution — the near-miss that produced this record
