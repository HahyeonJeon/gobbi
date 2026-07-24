---
name: htn-recurse-to-primitive
description: HTN planning recurses abstract tasks into methods until only directly-executable primitives remain
type: references
scope: feature
feature: workflow
status: active
created: 2026-07-16
session: 2026-07-16-847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [memory, design]
keywords: [planning, htn, decomposition, primitive-task]
author: claude
title: Hierarchical Task Network planning — recurse to primitive
source: https://en.wikipedia.org/wiki/Hierarchical_task_network
accessed: 2026-07-16
ref_type: other
---

# Hierarchical Task Network planning — recurse to primitive

## Insight
HTN planning repeatedly decomposes abstract (non-primitive) tasks via methods until only primitive tasks — directly executable actions — remain; a plan is complete only when every leaf is a primitive an agent can execute.

## Reason
The theoretical backbone of the generic skill's Procedure P3 stop rule: keep decomposing until each leaf task is directly executable. Pairs with the work-package bar to give the stop rule two faces (executable + estimable/assignable).

## Source
- https://en.wikipedia.org/wiki/Hierarchical_task_network
- https://www.geeksforgeeks.org/artificial-intelligence/hierarchical-task-network-htn-planning-in-ai/

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-07-16 | 2026-07-16-847bafc9-9659-46b4-b23e-653e25f0e9f5 | generic planning Procedure P3 stop rule |

## Related
- [[work-package-decomposition-bar]] — the estimable/assignable face of the same stop rule
