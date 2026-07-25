---
name: plan-execute-replan-triggers
description: Plan-and-execute is brittle without explicit re-plan triggers; upfront vs interleaved decomposition
type: references
scope: feature
feature: workflow
status: active
created: 2026-07-16
session: 2026-07-16-847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [memory, design]
keywords: [planning, agents, replanning, plan-and-execute]
author: claude
title: Plan-and-execute agents and re-planning
source: https://www.langchain.com/blog/planning-agents
accessed: 2026-07-16
ref_type: blog
---

# Plan-and-execute agents and re-planning

## Insight
LLM plan-and-execute splits a goal into an ordered subtask list executed one-by-one, but a static one-shot plan is inherently brittle; robust designs define WHEN to re-plan (an intermediate result invalidates the approach), and upfront vs interleaved decomposition is the same fix-vs-defer axis as rolling-wave.

## Reason
Generalizes gobbi's REVISE loop into a planning property: the generic skill's Principle 5 requires explicit re-plan triggers, and Procedure P7 states the conditions that send the plan back for revision.

## Source
- https://www.langchain.com/blog/planning-agents
- https://www.genaipatterns.dev/patterns/agents/plan-and-execute

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-07-16 | 2026-07-16-847bafc9-9659-46b4-b23e-653e25f0e9f5 | generic planning Principle 5 + Procedure P7 |

## Related
- [[rolling-wave-progressive-elaboration]] — the fix-vs-defer axis
- [[assumption-based-planning-signposts]] — a re-plan trigger is a named assumption + its signpost
