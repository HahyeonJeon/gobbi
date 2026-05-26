---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
scope: feature
feature: install-runtime
discussion-id: CP-4-1-alpha
slug: mechanism-4-1-option-c
phase: ideation
sub-step: A-round-2
loop-iter: 1
---

# T3 mechanism — option (c): PostToolUse hook + shell-script reconstructor

## Question asked

CP-4.1-α: Which mechanism should T3 use to populate `session.json.agents[]`? Options: (a) SDK-based SubagentStop callback, (b) manager-manual append, (c) PostToolUse hook + shell-script reconstructor.

## User answer

User confirmed **(c) both — PostToolUse hook + shell-script reconstructor** (Option Recommended).

## Impact on design

T3's entire design (D-3-1 through D-3-6) is built around the hook + reconstructor pattern. SDK approach and manager-manual approach are ruled out.

## Source

`rawdata/draft-iter3.md:457-458` (Sub-step A round 2, decision #7)
