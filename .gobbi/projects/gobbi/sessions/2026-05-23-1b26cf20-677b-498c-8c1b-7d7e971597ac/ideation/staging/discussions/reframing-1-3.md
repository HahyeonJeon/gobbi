---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
feature: session-foundations-bundle-b
discussion-id: CP-1-3-beta
slug: reframing-1-3
phase: ideation
sub-step: A-round-2
loop-iter: 1
---

# T1 worktree-first vs alternative collapsing strategies — worktree-first locked

## Question asked

CP-1.3-β: Should T1 use worktree-first (recommended), two-surface (one main-tree session dir + one worktree for generated files), or symlink-into-worktree?

## User answer

User locked **worktree-first** (Option Recommended). Two-surface and symlink-into-worktree alternatives deferred to backlog items:
- `staging/backlogs/project/item-1-3-two-surface-collapsing-strategy.md`
- `staging/backlogs/project/item-1-3-symlink-into-worktree-alternative.md`

## Impact on design

T1's architecture is uniformly worktree-first. Every subsequent design decision assumes session dir lives in worktree tree.

## Source

`rawdata/draft-iter3.md:455-456` (Sub-step A round 2, decision #5)
