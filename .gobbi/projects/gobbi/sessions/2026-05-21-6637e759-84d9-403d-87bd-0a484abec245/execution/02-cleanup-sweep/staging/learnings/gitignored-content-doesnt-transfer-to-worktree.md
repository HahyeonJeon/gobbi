---
title: Gitignored content does not transfer when creating a worktree
discovered: 2026-05-22
session: 6637e759-84d9-403d-87bd-0a484abec245
tags: [git, worktree, session-memory, process]
related: []
---

# Gitignored Content Does Not Transfer to a Worktree

## Insight

When creating a worktree via `git worktree add`, gitignored content from the main tree is not present in the new worktree. The manager must explicitly rsync or copy any gitignored session memory (or other gitignored working files) from the main tree to the worktree before delegating to an executor that needs that content.

## Context

During Task 02 (`02-cleanup-sweep`), the manager created a worktree on `chore/263-pre-rebuild-sweep` and delegated the sweep work to an executor agent. The executor's plan required reading the cleanup session's memory (stored under `.gobbi/projects/gobbi/sessions/2026-05-21-6637e759-.../`) to understand the Ideation decisions (Q-A survivor set, Q-B/C/D/E locked answers). This session memory was gitignored at the time (the `.gitignore` line for `sessions/` was removed only by the sweep itself in commit `a371203`). The manager had to rsync the session dir from the main tree into the worktree before the executor could operate.

## Why it matters

If the manager forgets the rsync step, the executor arrives in a worktree with no session memory, no plan artifacts, and no Ideation decisions — the delegation fails silently or the executor operates on incomplete context. This is a non-obvious hazard because the main tree appears to have the content; only the worktree does not.

## How to apply

Any time a worktree is created for a task that requires gitignored content (session memory, local secrets, generated build artifacts, etc.), the manager's pre-delegation checklist must include:

1. Identify which gitignored content the executor needs.
2. Run `rsync -a <source-in-main-tree>/ <destination-in-worktree>/` before spawning the executor.
3. Confirm the content is present in the worktree before delegating.

For session memory specifically: `rsync -a .gobbi/projects/gobbi/sessions/{session-dir}/ worktrees/{branch}/.gobbi/projects/gobbi/sessions/{session-dir}/`

## Counter-cases

This does NOT apply when:
- The executor only reads tracked files (no gitignored content needed).
- The gitignored content was created inside the worktree itself (the executor generates it, not reads it from the main tree).
- The worktree is on the same branch as the main tree (degenerate case — same checkout, no issue).

## Related

- Manager bookkeeping log: `artifacts/manager-bookkeeping-log.md` (§2 Worktree Create + Rsync)
- Commit `a371203` removed the sessions/ gitignore line — after this commit, future sessions tracked by git will be present in worktrees normally.
