---
name: hook-contract-verification-gate
description: User authorized empirical verification of PostToolUse hook payload before finalizing T3 design; verification confirmed both tool_input and tool_result available.
type: discussions
scope: feature
feature: install-runtime
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hooks, post-tool-use, verification]
discussion-id: CP-4-1-beta
slug: hook-contract-verification-gate
phase: ideation
sub-step: A-round-2
loop-iter: 1
---

# Hook contract verification gate — empirical verification authorized before design

## Question asked

Before finalizing the PostToolUse hook design, should empirical verification of the hook payload (confirming both `tool_input` AND `tool_result` are available; `transcript_path` in stdin) be performed?

## User answer

User authorized Sub-step C to verify the PostToolUse hook payload empirically (Option Recommended). Verification closed in Sub-step C: empirical inspection of the prior session's transcript (line 165 of `~/.claude/projects/-playinganalytics-git-gobbi/7ea62d36-...jsonl`) confirmed both hook stdin fields and `toolUseResult` richness.

## Impact on design

The PostToolUse hook + shell-script reconstructor mechanism is fully supported. The hybrid metadata extraction design (input side vs result side) and the `tool_use_id` transcript correlation key design are both grounded in the empirical evidence confirming both stdin payload and transcript richness.

## Source

`rawdata/draft-iter3.md:458-459` (Sub-step A round 2, decision #8)
