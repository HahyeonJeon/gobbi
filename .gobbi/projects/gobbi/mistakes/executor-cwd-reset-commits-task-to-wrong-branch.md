---
name: executor-cwd-reset-commits-task-to-wrong-branch
description: An executor's git add/commit (T9c) ran in the MAIN tree (cwd-reset) and committed the ENTIRE task to develop instead of the worktree chore branch. Caught by dual-eval (Claude wrong-branch FAIL) + manager git-verify; remediated by resetting develop and re-running in the worktree. Executors must run ALL git ops via `git -C <worktree-abs>` and verify branch before committing.
type: mistakes
scope: project
feature: project-memory
status: active
created: 2026-05-27
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [process, worktree, cwd-reset, git, executor, wrong-branch]
priority: critical
domain: process
supersedes: null
superseded_by: null
---

# Executor cwd-reset commits task to wrong branch (develop instead of chore)

## What happened

During T9c (conform project-tier remainder), an executor's `git add` and `git commit` ran in the MAIN tree because the shell cwd had reset between Bash calls. The entire task's changes were committed onto the main tree's `develop` branch instead of the worktree's `chore/session-2026-05-25-a10c82d6` branch. The worktree branch was missing T9c's changes; `develop` was unexpectedly one commit ahead of `origin/develop`.

Detection: the Claude evaluator flagged "commit not in the expected branch lineage" (FAIL finding). The Codex evaluator independently confirmed wrong-branch commit. Manager git-verified: `git -C <worktree> log` showed T9c commit absent; `git -C <main-tree> log develop` showed it present. Remediation: `git -C <main-tree> reset --hard origin/develop` (safe — not yet pushed) + re-ran T9c entirely in the worktree via `git -C <worktree>`.

## Why it happens

The executor's Bash invocations for `git add` and `git commit` did not use `git -C <worktree-absolute-path>`. After a cwd reset between calls, the `git` commands ran against whatever the shell's cwd resolved to — the main tree. The executor's prior edit operations may have landed in the worktree (via absolute Write paths), but the git ops targeted the main tree, creating a split: edits in worktree, commit on develop.

## How to detect

- The worktree branch is missing the task's expected changes after the executor reports success.
- The main-tree `develop` is unexpectedly ahead of `origin/develop` by one or more commits.
- An evaluator flags "commit not an ancestor of HEAD / wrong lineage" or "branch at unexpected sha."
- `git -C <worktree> log --oneline -3` does not include the task's commit message; `git -C <main-tree> log develop --oneline -3` does.

## Correct approach

Executors run ALL git operations via `git -C <worktree-abs-path>` — never bare `git`:

1. Every `git add`, `git commit`, `git status`, `git log` call in an executor's Bash uses `git -C <literal-absolute-worktree-path>`.
2. Before any `git commit`, the executor MUST verify the branch: `git -C <worktree> rev-parse --abbrev-ref HEAD` and confirm it equals the chore branch name. Abort if it says `develop` or anything unexpected.
3. Manager delegates with the worktree path as a literal string (never a macro) and mandates the `git -C $WT` pattern explicitly in the delegation prompt.
4. Post-task, manager independently verifies: `git -C <worktree> log --oneline -3` must include the task's commit; `git -C <main-tree> log develop --oneline -1` must NOT include it.

Recovery: if the commit lands on develop and has NOT been pushed, `git -C <main-tree> reset --hard origin/develop` removes it safely; then re-run the task in the worktree. If already pushed: do NOT revert on develop; cherry-pick to the worktree branch and coordinate with the user before touching develop history.

## Related

- [[subagent-relative-path-write-strays-to-main-tree]] — the session-file-write variant of the same cwd-reset root cause (less severe: files misplaced, not a wrong-branch commit).
- [[sendmessage-continued-cwd-resets-to-main-tree]] — SendMessage continuation variant; commit goes to develop on a continued turn.
- [[codex-subprocess-writes-to-main-tree]] — Codex subprocess variant of the same root cause.
