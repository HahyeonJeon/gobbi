---
name: manager-rm-rf-without-investigating-tracked-files
description: "Manager ran `rm -rf` on a worktree .gobbi/ chain without verifying tracked files; deleted tracked files visible only via `git status`."
type: mistakes
scope: project
feature: null
status: active
created: 2026-05-22
session: bac669ad-4fec-40b5-8387-51ac57bc0d3d
tags: [process, worktree, git, iron-law-1]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Manager rm -rf'd worktree .gobbi/ chain without investigating tracked files

## What happened

During cleanup of the Codex session-write-path violation (see companion mistake `codex-eval-session-write-path-nested-in-worktree`), the manager ran `rm -rf` on the `.gobbi/` directory chain inside the Execution worktree (`.gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook/.gobbi/`) to remove the misplaced session files.

The `.gobbi/` chain at that location was not just a stale sandbox artifact — it also contained **tracked files** that belonged to the branch HEAD (the worktree was on `feat/env-var-audit-sessionstart-hook`, and some `.gobbi/` content was committed on that branch). The `rm -rf` silently deleted tracked files without a warning, because `rm -rf` does not consult git. The manager only discovered the deletion when the subsequent `git status` showed the tracked files as deleted.

Recovery was performed via `git restore .gobbi/` in the worktree, which re-checked-out the tracked files from HEAD. No permanent data loss occurred. The incident was recorded in the Preparation decisions log (finding γ adjunct note).

This is a direct violation of **Iron Law 1 (NO ACTION WITHOUT THINKING IT THROUGH FIRST)** — specifically, the manager did not verify what was in the directory before deleting it.

## Why it happens

The manager's mental model was: "this `.gobbi/` tree inside the worktree is an artifact of the Codex sandbox's incorrect write — it shouldn't be there, so I can safely remove it." The assumption missed that a git worktree shares the same `.git` tracking as the main tree. Files committed on the branch are present in the worktree by design — the worktree IS a checked-out branch. A `rm -rf` inside a worktree can delete tracked files just as easily as inside the main tree.

The missing step was a `git status` + `git ls-files` check before the deletion.

## How to detect

- You are about to run `rm -rf <path>` on any path inside a git worktree.
- The `<path>` includes directories that could plausibly hold git-tracked files (any directory tracked by the repo — e.g., `.gobbi/`, `.claude/`, `packages/`, `src/`).
- The motivation is "this is an artifact that shouldn't be here" — but you have not verified it via git.

## Correct approach

Before any `rm -rf` on a path inside a git repository (main tree or worktree):

1. **Run `git -C <worktree-root> status --short <path>`** — if the path shows any tracked files (no `??` prefix), those files are tracked and `rm -rf` will produce deleted entries in the index.
2. **Run `git -C <worktree-root> ls-files --error-unmatch <path>` (or `git ls-files <path>`)** to enumerate exactly which files inside the path are tracked.
3. **Only proceed with `rm -rf` if the path contains ZERO tracked files** (i.e., all entries are untracked `??` in `git status`).
4. If tracked files are present and the intent is to remove only untracked artifacts: use `git clean -fd <path>` to remove untracked files while leaving tracked files intact. Add `-n` (dry run) first to verify the set of files that would be removed.
5. If the intent is to remove tracked files as well, stage the deletion via `git rm -r <path>` rather than `rm -rf` — this produces a clean deletion record in the index.
