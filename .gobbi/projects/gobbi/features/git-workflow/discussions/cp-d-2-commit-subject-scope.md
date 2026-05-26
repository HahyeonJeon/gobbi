---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
feature: git-workflow
discussion-id: CP-D-2
slug: cp-d-2-commit-subject-scope
phase: ideation
sub-step: D-round-2
loop-iter: 1
---

# Per-iteration session-memory commit subject — chore(session): confirmed

## Question asked

CP-D-2: What should be the per-iteration session-memory commit subject? Options: (a) `chore(session): record <loop> iter{n} memory` using the `sessions/` scope, (b) `chore(<loop>): record iter{n} memory` using the loop name as scope.

## User answer

Confirmed **Option Recommended**: `chore(session): record <loop> iter{n} memory` — the `sessions/` scope matches the directory being committed; the loop name goes in the subject body.

## Impact on design

D-4 commit subject pattern is locked: `chore(session): record <loop> iter{n} memory` (e.g., `chore(session): record ideation iter3 memory`). T1-I-T1.f (5 loop workflow files) uses this pattern.

## Source

`rawdata/draft-iter3.md:478` (Sub-step D round 2, decision #15)
