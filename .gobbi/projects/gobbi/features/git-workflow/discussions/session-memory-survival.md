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

## Question asked

Where should the session directory live under worktree-first? Options: (a) Wrap-up promotes session memory to main tree before worktree removal, (b) session dir in main tree (direct mode unchanged), (c) session dir lives in worktree; PR squash absorbs it on merge, (d) hybrid (session memory in main tree, generated files in worktree).

## User answer

User locked **(c) — session dir lives in worktree; PR squash absorbs it on merge**. Rejected (a), (b), (d).

## Impact on design

Every session memory write (staging files, session.json, rawdata, evaluation, artifacts) goes into the worktree's `.gobbi/projects/<name>/sessions/<date>-<ssid>/` tree. The PR squash commit carries the entire session directory. This anchors Design Decision D-4 (per-iteration commit cadence ensures durability before the PR is created).
