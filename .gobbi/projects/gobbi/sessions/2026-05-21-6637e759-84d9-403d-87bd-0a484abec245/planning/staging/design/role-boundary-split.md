---
title: Role-Boundary Split Between Executor and Manager for Repo Reset
status: accepted
feature: repo-reset
related:
  - planning/artifacts/decisions-log.md
  - planning/staging/decisions/role-boundary-executor-scope-leak.md
---

# Role-Boundary Split Between Executor and Manager for Repo Reset

## Problem

The `git/SKILL.md` Role Boundaries table assigns six operation categories to the Manager ("Subagent: Never"): Issue, Worktree, Branch (remote push), Push to remote, PR, Merge, Cleanup. iter1 Plan had executor tasks performing two of these — tag push (in Task 01) and worktree-remove + local-branch cleanup (Stage F in Task 02) — justified by an unwritten "local-ref mutation carve-out".

## Scope

In-scope: define the precise boundary between executor work (Stages A-E.2) and manager work (pre-Task-01, pre-Task-02, post-Task-02).
Out-of-scope: re-architecting the 2-task structure; changing the Stage E.2 gate (read-only git inspection + FS delete of gitignored dir — stays executor-scope).

## Approach

Per D-PLAN-04 (user-locked, extended at iter2): executor tasks commit and run FS operations; manager runs all six Role Boundaries categories. The split is:

- **Task 01 scope**: `git tag <name> <sha>` (local ref create) + `git rev-parse` verification. STOPS here.
- **Task 02 scope**: Stages A-E.2. Two read-only git invocations (gate) + FS delete of a gitignored dir (Stage E.2) are NOT git mutations — they remain executor scope.
- **Manager pre-Task-01**: `gh issue create`.
- **Manager pre-Task-02**: `git push origin <tag>` (tag push) + `git worktree add` (worktree create) + delegation.
- **Manager post-Task-02**: `git worktree remove` × 2 (precheck required each time) + `git branch -d/-D` × 4 + `git push` + `gh pr create` + `gh pr checks` + `gh pr merge` + `git pull` + `git worktree remove` (sweep) + `gh issue close` + post-merge criteria verification.

## Trade-offs

Optimizes for: literal compliance with `git/SKILL.md` Role Boundaries; no scope-extension without user authorization.
Sacrifices: conciseness of Task 01 (now a tiny 1-command task). Accepted — the split is explicit and the manager's bookkeeping is documented in `planning/artifacts/manager-ops.md`.

## Open issues

None blocking Execution.
