---
name: claude-task-master-dependency-tasks
description: claude-task-master turns a PRD into tasks.json with dependencies and complexity scores and serves the next dep-satisfied task
type: references
scope: feature
feature: review
status: active
created: 2026-06-29
session: 40b9a93e-5ec4-43d7-bd16-075b0c7fa303
tags: [process, design]
keywords: [task-master, spec-driven, prd, dependencies, complexity-score, next-task]
author: claude
title: Claude Task Master — spec-driven task middleware
source: https://github.com/eyaltoledano/claude-task-master
accessed: 2026-06-29
ref_type: code
---

# Claude Task Master — spec-driven task middleware

## Insight
Task Master parses a plain-language PRD into a `tasks.json` of tasks carrying explicit dependencies and complexity scores; the agent asks "what's the next task?" and gets the highest-priority task whose dependencies are all satisfied, with `expand_task` for subtask decomposition. The spec/PRD is treated as living documentation for cross-session continuity.

## Reason
It is the dependency-aware-planning baseline for the charter (dimension-3). gobbi's planning produces a dependency graph + lanes but no complexity score and no "next dep-satisfied task" selector; Task Master shows the concrete prior art for both. Its "spec as living doc across sessions" also informs the memory-staleness dimension.

## Source
- https://github.com/eyaltoledano/claude-task-master
- docs/tutorial.md

## Excerpt
"You simply ask 'What's the next task?' and the tool returns the highest-priority task whose dependencies are all satisfied. You implement, validate, and move on ... tasks.json containing all tasks with their dependencies and complexity scores."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-29 | 40b9a93e-5ec4-43d7-bd16-075b0c7fa303 | Charter dimension-3 dependency-aware planning baseline |

## Related

- [[claude-flow-swarm-memory]] — orchestration baseline
