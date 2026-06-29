---
name: claude-flow-swarm-memory
description: claude-flow uses queen/worker swarm orchestration with SQLite semantic cross-session memory and pattern learning
type: references
scope: feature
feature: review
status: active
created: 2026-06-29
session: 40b9a93e-5ec4-43d7-bd16-075b0c7fa303
tags: [process, memory]
keywords: [claude-flow, ruflo, swarm, orchestration, sqlite, memory, cross-session]
author: claude
title: Claude Flow / ruflo — multi-agent swarm orchestrator
source: https://github.com/ruvnet/ruflo
accessed: 2026-06-29
ref_type: code
---

# Claude Flow / ruflo — multi-agent swarm orchestrator

## Insight
Claude Flow runs a queen/worker (orchestrator/specialist) swarm with a persistent SQLite/AgentDB memory that gives cross-session state, fast semantic queries, and pattern learning across runs. It executes specialist agents in parallel or sequentially against shared memory.

## Reason
It is the orchestration-and-memory contrast case for the charter. Its queen/worker model parallels gobbi's manager+specialist roster (dimension-3), and its DB-backed semantic memory is the deliberate opposite of gobbi's plain-markdown, git-native memory — a sharp axis for evaluating gobbi's memory choice (queryability vs human-readability) and the staleness question (dimension-1 / D3).

## Source
- https://github.com/ruvnet/ruflo
- Agent System Overview wiki; Memory System wiki

## Excerpt
"A persistent memory solution using SQLite that enables sophisticated agent coordination, cross-session state management, and intelligent pattern learning ... AgentDB ... 150x faster semantic queries with 56% less memory usage, allowing agents to remember past work across sessions."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-29 | 40b9a93e-5ec4-43d7-bd16-075b0c7fa303 | Charter dimension-3 orchestration + memory contrast axis |

## Related

- [[claude-task-master-dependency-tasks]] — dependency-aware task selection baseline
