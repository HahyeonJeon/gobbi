---
name: shared-executor-context-continuity
description: User decision to delegate Tasks 07 and 08 (hook script + reconstructor) to a single executor within one context window, preserving jq snippet continuity.
type: discussions
scope: feature
feature: agents
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [delegation, executor, task-bundling, jq, hook]
outcome: Single executor delegation confirmed; back-to-back within one context window
---

# Tasks 07+08 shared executor decision (LOCK #2)

## Context

Task 07 (hook script) and Task 08 (reconstructor) share jq snippets and the hook stdin contract. The leader proposed bundling them into one executor delegation to preserve this context.

## Question

Should Tasks 07 and 08 be delegated to a single executor (back-to-back) or separately?

## Options considered

1. **Single delegation (LOCK #2)** — executor handles Task 07 then Task 08 within the same context window. Pros: jq snippet continuity; no re-derivation of stdin contract. Cons: combined effort (two Large tasks) may stress context coherence budget.
2. **Separate delegations** — Task 08 re-derives or receives an explicit jq snippet handoff in its brief. Pros: bounded scope per delegation. Cons: risk of Task 08 diverging from Task 07's established patterns if handoff is imperfect.

## User decision

Single executor delegation confirmed (LOCK #2).

## Implication

Manager issues ONE delegation prompt covering both Tasks 07 and 08. Executor completes Task 07 first (producing `hook-script-artifact`, `shared-jq-snippets`, `hook-stdin-contract` outputs), then Task 08 (consuming those outputs).

If context saturation occurs mid-Task-08, the manager can re-delegate Task 08 with explicit jq snippets extracted from Task 07's output as literal brief context.

## Source

Session 1b26cf20 planning iteration 2 — agent assignment table (Tasks 07+08 row). Companion decision: `features/agents/design/lock2-shared-executor-mega-task-risk.md` when promoted.
