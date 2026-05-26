---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
feature: git-workflow
discussion-id: CP-1-3-gamma
slug: non-feature-session-scope
phase: ideation
sub-step: A-round-1
loop-iter: 1
---

# Non-feature session scope for T1 — worktree-first for every session (uniform)

## Question asked

CP-1.3-γ: Should T1 apply worktree-first only to feature sessions (those with a GitHub issue), or uniformly to every session including investigation / doc-only / mistake-promotion sessions?

## User answer

User chose **Option A — uniform**: worktree-first for every session. Direct mode preserved as opt-out per D-5.

## Impact on design

T1's scope is "every session boots on a worktree branch." The non-feature branch name `chore/session-{date}-{ssid-short}` (no issue prefix) handles this case. D-5 documents direct mode as escape hatch.

## Source

`rawdata/draft-iter3.md:450` (Sub-step A round 1, decision #2)
