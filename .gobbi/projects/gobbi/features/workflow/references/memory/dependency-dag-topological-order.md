---
name: dependency-dag-topological-order
description: Task dependencies form a DAG; a valid execution order is a topological sort; cycles are rejected
type: references
scope: feature
feature: workflow
status: active
created: 2026-07-16
session: 2026-07-16-847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [memory, design]
keywords: [planning, dependencies, dag, topological-sort]
author: claude
title: Dependency DAG and topological ordering
source: https://en.wikipedia.org/wiki/Topological_sorting
accessed: 2026-07-16
ref_type: other
---

# Dependency DAG and topological ordering

## Insight
Tasks are nodes and "must-precede" is a directed edge; a valid execution order is any topological sort of the graph, which must be acyclic, and in-degree-zero tasks are the ones ready to start.

## Reason
Formalizes the generic skill's Principle 4 ("dependencies determine order") and Procedure P5 — the ordering is derived from the dependency graph, not asserted by hand.

## Source
- https://en.wikipedia.org/wiki/Topological_sorting
- https://networkx.org/nx-guides/content/algorithms/dag/index.html

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-07-16 | 2026-07-16-847bafc9-9659-46b4-b23e-653e25f0e9f5 | generic planning Principle 4 + Procedure P5 |

## Related
- [[critical-path-parallelism]] — the longest-path companion for schedule + safe parallelism
