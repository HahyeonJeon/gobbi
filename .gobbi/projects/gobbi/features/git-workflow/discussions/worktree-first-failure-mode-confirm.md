---
name: worktree-first-failure-mode-confirm
description: User confirmed the worktree-first failure mode framing — artifacts written to main tree because cwd defaults to main tree until Execution.
type: discussions
scope: feature
feature: git-workflow
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, worktree-first, failure-mode, cwd]
---

# Worktree-first failure-mode framing confirmed

## Context

Worktree-first was proposed as the fix for a recurring misroute where session artifacts that should land in the PR diff instead get written to the main tree. Before locking the design, the session needed to confirm the *root cause* framing, because the fix differs depending on whether the cause is a working-directory issue or a symlink / path-resolution issue.

## Question

Is the worktree-first failure mode correctly framed as: "Preparation/Planning artifacts that should land in the PR diff get written to the main tree because `cwd` is the main tree until Execution"?

## Options considered

1. **A `cwd` issue** — artifacts misroute because the working directory defaults to the main tree until Execution, so relative writes land in the main tree. Fix: root session writes at `$worktreePath` from session start.
2. **A symlink / path-resolution issue** — artifacts misroute because of how paths resolve through symlinks, which would call for a different fix.

## User decision

Confirmed option 1: the framing is accurate — it is a `cwd` issue, not a symlink or path-resolution issue. The witness is a real misroute (an executor wrote session artifacts to the main tree while intending them for the worktree), caught during executor self-review.

## Implication

The worktree-first problem statement and root-cause analysis are locked on this framing. Worktree-first resolves it by ensuring session writes use `$worktreePath` as the absolute root from session start.

## Related

- `design/qualified-git-write-path-rule.md` — Design Decision D-2, which roots session writes at `worktreePath` to fix this `cwd` failure mode.
