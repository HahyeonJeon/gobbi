---
name: session-memory-survival
description: User locked session dir in the worktree; PR squash absorbs it on merge. Session memory survives via per-iteration commits, not Wrap-up promotion.
type: discussions
scope: feature
feature: git-workflow
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, session-dir, worktree-first, session-memory]
---

# Session-memory survival — session dir lives in worktree, absorbed by PR squash

## Context

Under worktree-first the worktree is removed at Wrap-up, which raises the question of where the session directory lives and how its contents survive removal. Several placements were possible, each with different durability and merge behavior.

## Question

Where should the session directory live under worktree-first, so its memory survives worktree removal?

## Options considered

1. **Wrap-up promotes session memory to the main tree before worktree removal** — survival via an explicit promotion step.
2. **Session dir in the main tree (direct mode unchanged)** — the session dir never enters the worktree.
3. **Session dir lives in the worktree; the PR squash absorbs it on merge** — the worktree carries the whole session dir, and merging the PR brings it into history.
4. **Hybrid — session memory in the main tree, generated files in the worktree** — split across two trees.

## User decision

User locked option 3 — the session dir lives in the worktree, and the PR squash absorbs it on merge. Options 1, 2, and 4 were rejected.

## Implication

Every session-memory write (staging files, session.json, rawdata, evaluation, artifacts) goes into the worktree's `.gobbi/projects/<name>/sessions/<date>-<ssid>/` tree. The PR squash commit carries the entire session directory. This anchors Design Decision D-4: the per-iteration commit cadence ensures durability *before* the PR is created, so a mid-session abort does not lose memory even though the dir lives only in the worktree.

## Related

- `design/per-iteration-session-commit-cadence.md` — Design Decision D-4, the per-iteration cadence that makes worktree-resident session memory durable.
- `design/qualified-git-write-path-rule.md` — the write-path rule (D-2) that roots session writes at `worktreePath`.
