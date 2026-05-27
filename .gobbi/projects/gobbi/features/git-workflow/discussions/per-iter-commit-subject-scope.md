---
name: per-iter-commit-subject-scope
description: User confirmed chore(session) as the scope token for per-iteration session-memory commits, with loop name in the subject body.
type: discussions
scope: feature
feature: git-workflow
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, commit-subject, session-commits, d4]
---

# Per-iteration session-memory commit subject — chore(session) confirmed

## Question asked

What should be the per-iteration session-memory commit subject? Options: (a) `chore(session): record <loop> iter{n} memory` using `session` as the scope (matching the `sessions/` directory), (b) `chore(<loop>): record iter{n} memory` using the loop name as scope.

## User answer

Confirmed option (a): `chore(session): record <loop> iter{n} memory` — the `session` scope matches the directory being committed; the loop name goes in the subject body.

## Impact on design

Design Decision D-4 commit subject pattern is locked: `chore(session): record <loop> iter{n} memory` (e.g., `chore(session): record ideation iter3 memory`). All 5 workflow loop docs carry this pattern.
