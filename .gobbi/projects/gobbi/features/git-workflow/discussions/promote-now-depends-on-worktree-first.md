---
name: promote-now-depends-on-worktree-first
description: User confirmed that the Preparation promote-now commit-on-branch feature depends on worktree-first (T1) and is absorbed into T1's implementation tasks.
type: discussions
scope: feature
feature: git-workflow
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, promote-now, worktree-first, dependency]
---

# Promote-now commit-on-branch dependency on worktree-first confirmed

## Question asked

Is the "Preparation promote-now commit-on-branch" item technically dependent on worktree-first, or can it ship independently?

## User answer

Confirmed dependent on worktree-first. The promote-now path collapses to a 2-line `git add` + `git commit` addition to `preparation/SKILL.md` once worktree-first is locked. Without worktree-first, there is no `$worktreePath` to commit to.

## Impact on design

The promote-now commit-on-branch feature is absorbed into T1's Execution tasks rather than standing as its own task. It ships as part of T1 (worktree-first session architecture). See `design/promote-now-commit-on-branch.md` for the locked design.
