---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
scope: feature
feature: git-workflow
discussion-id: CP-NEW-beta
slug: promote-now-depends-on-worktree-first
phase: ideation
sub-step: A-round-1
loop-iter: 1
---

# NEW (promote-now commit-on-branch) dependency on T1 confirmed

## Question asked

CP-NEW-β: Is the NEW "Preparation promote-now commit-on-branch" item technically dependent on T1 (worktree-first), or can it ship independently?

## User answer

Confirmed Item NEW is **dependent on T1** (Option Recommended). NEW collapses to a 2-line `git add` + `git commit` addition to `preparation/SKILL.md`'s promote-now path once worktree-first is locked. If T1 does not ship first, there is no `$worktreePath` to commit to.

## Impact on design

NEW is absorbed into T1's Execution tasks. Checklist item T1-I-T1.d + T1-I-T1.j are the implementation items.

## Source

`rawdata/draft-iter3.md:451` (Sub-step A round 1, decision #3)
