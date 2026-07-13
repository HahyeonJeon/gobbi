---
name: reuse-target-must-be-invocable-at-needed-granularity
description: Verify a "reuse X's machinery" design target exposes a callable primitive at the needed granularity before designing against it.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-13
session: 2026-07-13-0bbb7c63-919c-45c2-81ea-b86406c8b75b
tags: [assumption]
keywords: [reuse, invocable-primitive, design-review, callable-boundary]
author: claude
priority: high
domain: assumption
supersedes: null
superseded_by: null
---

# Verify a "reuse" target is invocable at the needed granularity before designing against it

## What happened

The iter1 locked design's load-bearing decision was "atomic startup-close promotion **by
reusing Wrap-up's promotion machinery**." Both dual-system evaluators independently found
this infeasible: Wrap-up promotion is **stage 2 of a non-callable 5-stage phase** (a
sequential per-file write loop with `git mv` + status-flips and no rollback), not a
standalone invocable primitive. The design treated a whole-phase procedure as if it were a
callable unit.

## Why it happens

"Reuse X" was read as "X exposes a callable/invocable unit at the granularity I need." In
gobbi, skill procedures describe RULES + a phase sequence owned by a specific agent at a
specific step — they are not functions. Naming a mechanism is not the same as its being
invocable standalone.

## Correct approach

Distinguish **reusing owner-defined RULES by reference** (routing/templates/validation
logic — fine to follow) from **invoking an existing MECHANISM** (requires a real callable
boundary). If the needed granularity isn't exposed, either (a) define your OWN
self-contained procedure that FOLLOWS the shared rules by reference, or (b) explicitly
extend the owner to expose the primitive (a scope decision). The fix that resolved this
session chose (a): `startup` owns its own promotion that follows the memory rules by
reference rather than invoking Wrap-up's phase.

## How to detect

When a design says "reuse / invoke / call X's machinery," ask: is X a **callable unit at
the granularity I need**, or a whole phase/procedure coupled to inventory, ordering, gates,
and an owner? Read X's actual spec and check what it exposes as a boundary. A multi-stage
phase, a loop body, or an agent-owned procedure is almost never invocable as a sub-step from
elsewhere. Verify the affordance on disk before locking a design against it.
