---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
feature: session-foundations-bundle-b
discussion-id: T1-session-memory-survival
slug: session-memory-survival
phase: ideation
sub-step: D-round-1
loop-iter: 1
---

# T1 session-memory survival option — option (c) locked

## Question asked

Sub-step D round 1: Where should the session directory live under T1 worktree-first? Options: (a) Wrap-up promotes session memory to main tree before worktree removal, (b) session dir in main tree (direct mode unchanged for session memory), (c) session dir lives in worktree; PR squash absorbs it on merge, (d) hybrid (session memory in main tree, generated files in worktree).

## User answer

User locked **(c) — session dir lives in worktree; PR squash absorbs it on merge**. Rejected (a), (b), (d).

## Impact on design

Every session memory write (staging files, session.json, rawdata, evaluation, artifacts) goes into the worktree's `.gobbi/projects/<name>/sessions/<date>-<ssid>/` tree. The PR squash commit carries the entire session directory. This directly anchors D-4 (per-iteration commit cadence) and the smoke tests in the Wrap-up gate.

## Source

`rawdata/draft-iter3.md:472` (Sub-step D round 1, decision #12)
