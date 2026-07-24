---
name: evaluator-spawned-with-team-addressable-name
description: The manager spawned a Claude evaluator with a team-addressable name parameter, registering it in the session roster and making it reachable via SendMessage — evaluators must be spawned unnamed.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-17
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [verification]
keywords: [evaluator, agent-teams, team-addressable, spawn-discipline, delegation]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
related: []
---

# Evaluator spawned with a team-addressable name

## What happened

The manager spawned the Claude evaluator (Ideation iter1) via the Agent tool WITH a `name` parameter
(`ideation-eval-claude`). Passing a `name` registers the agent in the session's Agent-Teams roster and
makes it reachable via SendMessage by any other teammate for the rest of the session — a persistence and
addressability property the evaluator role must never carry.

## Why it happens

The `name` parameter is habit carried over from producer/leader spawns, where continuation across turns
is sanctioned and often desirable. The evaluator rule ("NEVER place the evaluator in an Agent Team") was
mapped only to the narrower behavior "don't continue it" — not to the broader "don't make it addressable
at all." Naming the agent is the exact mechanism that creates addressability, independent of whether the
manager intends to continue it.

## Correct approach

Spawn every evaluator UNNAMED (no `name:` parameter) so it is a plain report-back subagent with no roster
presence and no SendMessage reachability. If a named evaluator spawn already happened: send it no further
messages, never continue it, and explicitly note the exposure in the session record.

## How to detect

Any evaluator Agent-tool call carrying a `name:` parameter is the signal — the parameter's mere presence
is the defect, regardless of whether continuation was intended. Check every evaluator-spawn call site for
an absent `name:` field before dispatch.

## Related

- [[post-freeze-mutation-of-frozen-evaluation-input]] — a sibling evaluator-isolation trap from the same
  session
