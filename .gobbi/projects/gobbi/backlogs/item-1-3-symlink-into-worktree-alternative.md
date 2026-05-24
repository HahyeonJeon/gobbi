---
title: "Item 1-3 alternative — symlink-into-worktree model"
status: deferred
project: gobbi
feature: null
task: null
anchor_session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
created: 2026-05-23
tags: [worktree, session-architecture, alternative, symlink, deferred]
disposition: open
---

# Item 1-3 alternative — symlink-into-worktree model

## Context

During Sub-step A forcing-question 6 (re-framing check) for Item 1-3, the leader surfaced a second alternative collapsing strategy: a **symlink-into-worktree model**. In this design, `cwd` stays in the main tree; the worktree's `.gobbi/projects/{name}/sessions/` is symlinked back into the main tree so the durable session memory IS the worktree's session dir. The worktree is garbage-collected at session end except for the staged-then-promoted artifacts.

This preserves the existing main-tree-default `cwd` semantics (no orchestration table changes) but uses symlinks to make the worktree's session-dir reachable from main-tree path constructions.

## Why deferred

User locked worktree-first uniform in CP-1.3-β Option Recommended; alternatives explicitly deferred. The leader's recommendation skew was already toward worktree-first (smaller change to existing rules, simpler `cwd` story).

## When to pick up

- If worktree-first uniform exposes friction around `cwd` semantics that symlinks would have avoided.
- If the user prefers a more conservative migration path (keep main-tree as the canonical home, layer worktree-isolation on top via symlinks).
- As a comparison study against worktree-first post-merge.

## Suggested approach

1. Specify the symlink shape: which directories under `.gobbi/projects/{name}/` are symlinked from main-tree to the worktree, and which stay distinct.
2. Design the cleanup: worktree-removal must un-link before tree deletion.
3. Address the inverse-failure risk: an evaluator following symlinks could land writes in unexpected places (cf. the inverse mistake `codex-eval-session-write-path-nested-in-worktree`).
4. Compare with worktree-first on the F-1 / F-2 failure modes from this session's Sub-step D.

## Effort estimate

Medium — likely simpler than two-surface but trickier-to-debug due to symlink-following behavior of tools.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`

## Anchor

- Sub-step A forcing-question 6 (re-framing check)
- Sub-step A CP-1.3-β (user locked worktree-first; alternatives deferred)
