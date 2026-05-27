---
name: two-surface-collapsing-strategy
description: Alternative session-architecture — worktree as per-session staging, main tree as durable cross-session surface; deferred in favor of worktree-first uniform (CP-1.3-β).
type: backlogs
scope: project
feature: null
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [worktree, session-architecture, alternative, deferred]
title: "Item 1-3 alternative — two-surface collapsing strategy"
project: gobbi
anchor_session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
disposition: open
---

# Item 1-3 alternative — two-surface collapsing strategy

## Context

During Sub-step A forcing-question 6 (re-framing check) for Item 1-3 (worktree-first), the leader surfaced an alternative collapsing strategy: a **two-surface model** — worktree for everything-on-branch (code + skills + agents + symlinks), main tree for everything-cross-session (project memory, mistake history). Session memory lives inside the worktree; the assistant's Wrap-up promotes it to the main tree before worktree removal.

This is a deliberately different architectural shape from worktree-first uniform. It preserves the main-tree as the durable cross-session surface and uses the worktree purely as a per-session staging space.

## Why deferred

User locked worktree-first uniform in CP-1.3-β Option Recommended; alternatives explicitly deferred to backlog. The leader recommended surfacing alternatives in Sub-step A before locking the framing; user chose to lock worktree-first directly without exploring alternatives in depth.

## When to pick up

- If worktree-first uniform (this session's T1) ships and exposes a previously-unknown failure mode that two-surface would have avoided (witness signal).
- If the user wants to explore the design space more broadly before committing to a long-term architecture.
- If `bun install` (or any per-session dependency-install cost) becomes non-trivial in this repo — two-surface could opt-out worktree creation for read-only operations.

## Suggested approach

1. Frame as a comparison feature against the worktree-first implementation post-merge.
2. Inventory which writes belong to "on-branch" vs "cross-session" categories.
3. Specify the Wrap-up session-memory promotion step (the current T1 design absorbs session memory into the PR squash instead).
4. Compare survival semantics: worktree-first survives via squash absorption; two-surface survives via explicit promotion-on-Wrap-up.

## Effort estimate

Medium-large — a full re-architecture if picked up. Would supersede T1 from this session.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`

## Anchor

- Sub-step A forcing-question 6 (re-framing check)
- Sub-step A CP-1.3-β (user locked worktree-first; alternatives deferred)
