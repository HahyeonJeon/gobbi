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

## Context

The session set out to fix the artifact-misroute failure mode (session writes landing in the main tree instead of the worktree). Three architectural strategies could collapse the two surfaces (main tree + worktree) into a coherent session layout, and the session had to choose one before any downstream design decision could be made.

## Question

Should the session architecture use worktree-first, two-surface, or symlink-into-worktree?

## Options considered

1. **Worktree-first** (recommended) — the session directory lives in the worktree tree from session start; all writes root at `worktreePath`.
2. **Two-surface** — one main-tree session dir plus one worktree for generated files; the two surfaces are kept separate.
3. **Symlink-into-worktree** — the session dir stays in the main tree and is symlinked into the worktree.

## User decision

User locked **worktree-first**. The two-surface and symlink-into-worktree alternatives were deferred to backlog items for future evaluation rather than rejected outright.

## Implication

Every subsequent design decision for the git-workflow feature assumes the session directory lives in the worktree tree. The two alternatives remain as backlog candidates if future evidence motivates revisiting.

## Related

- `design/worktree-create-before-session-stamp.md` — the worktree-creation step (D-1) that implements the chosen worktree-first strategy.
- `discussions/session-memory-survival.md` — the follow-on discussion on how worktree-resident session memory survives.
