---
name: hook-plus-reconstructor-mechanism
description: User confirmed PostToolUse hook + shell-script reconstructor as the mechanism to populate session.json.agents[]; SDK and manager-manual approaches ruled out.
type: discussions
scope: feature
feature: install-runtime
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hooks, post-tool-use, agents, session-json]
discussion-id: CP-4-1-alpha
---

# PostToolUse hook + shell-script reconstructor selected for agents[] population

## Question asked

Which mechanism should the agents-population task use to populate `session.json.agents[]`? Options: (a) SDK-based SubagentStop callback, (b) manager-manual append, (c) PostToolUse hook + shell-script reconstructor.

## User answer

User confirmed **(c) both — PostToolUse hook + shell-script reconstructor** (Option Recommended).

## Impact on design

The agents-population task's entire design (hook authoring stack, reconstructor algorithm, dual-hook registration, hybrid metadata extraction, flock serialization, tool_use_id correlation) is built around the hook + reconstructor pattern. SDK approach and manager-manual approach are ruled out.

## Source

`rawdata/draft-iter3.md:457-458` (Sub-step A round 2, decision #7)
