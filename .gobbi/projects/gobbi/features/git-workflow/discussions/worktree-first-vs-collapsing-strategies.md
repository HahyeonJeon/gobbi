---
name: worktree-first-vs-collapsing-strategies
description: User locked worktree-first over two-surface and symlink-into-worktree alternatives; alternatives deferred to backlog.
type: discussions
scope: feature
feature: git-workflow
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, worktree-first, architecture, collapsing-strategies]
---

# Worktree-first vs alternative collapsing strategies — worktree-first locked

## Question asked

Should the session architecture use worktree-first (recommended), two-surface (one main-tree session dir + one worktree for generated files), or symlink-into-worktree?

## User answer

User locked **worktree-first**. The two-surface and symlink-into-worktree alternatives were deferred to backlog items for future evaluation.

## Impact on design

Every subsequent design decision for the git-workflow feature assumes the session directory lives in the worktree tree. The two alternatives remain as backlog candidates if future evidence motivates revisiting.
