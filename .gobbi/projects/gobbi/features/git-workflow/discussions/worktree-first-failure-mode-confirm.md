---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
scope: feature
feature: git-workflow
discussion-id: CP-1-3-alpha
slug: worktree-first-failure-mode-confirm
phase: ideation
sub-step: A-round-1
loop-iter: 1
---

# Failure-mode confirmation for Item 1-3 (T1) — leader framing confirmed

## Question asked

CP-1.3-α: Is the T1 failure mode correctly framed — "Preparation/Planning artifacts that should land in PR diff get written to main tree because `cwd` is main tree until Execution"?

## User answer

Confirmed leader's framing (Option Recommended). Witness: `1829fa3` commit body (symlink gap; executor self-caught misroute). The framing is accurate.

## Impact on design

T1's problem statement and root cause analysis in the canonical draft are locked. Anchors: T1-I-1, T1-I-2.

## Source

`rawdata/draft-iter3.md:449` (Sub-step A round 1, decision #1)
