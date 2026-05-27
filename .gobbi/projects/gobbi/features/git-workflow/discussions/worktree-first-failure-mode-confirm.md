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

## Question asked

Is the worktree-first failure mode correctly framed as: "Preparation/Planning artifacts that should land in PR diff get written to main tree because `cwd` is main tree until Execution"?

## User answer

Confirmed. The framing is accurate. The witness is a real misroute (executor wrote session artifacts to main tree while intending them for the worktree), caught during executor self-review.

## Impact on design

T1's problem statement and root cause analysis are locked on this framing: the failure mode is a `cwd` issue, not a symlink or path-resolution issue. Worktree-first resolves it by ensuring session writes use `$worktreePath` as the absolute root from session start.
