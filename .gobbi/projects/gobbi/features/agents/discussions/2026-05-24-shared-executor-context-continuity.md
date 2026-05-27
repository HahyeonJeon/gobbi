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

# Hook-script and reconstructor share one executor

## Context

The hook-script task and the reconstructor task share the same `jq` snippets and the same hook-stdin contract. The leader proposed bundling them into a single executor delegation so the shared context (the `jq` snippets, the stdin shape) does not have to be re-derived between two separate executors.

## Question

Should the hook-script task and the reconstructor task be delegated to a single executor (back-to-back, one context window) or to two separate executors?

## Options considered

1. **Single delegation** — one executor handles the hook script first, then the reconstructor, within the same context window. Pros: `jq` snippet continuity; no re-derivation of the stdin contract. Cons: the combined effort (two large tasks) may stress the executor's context-coherence budget.
2. **Separate delegations** — the reconstructor executor re-derives the snippets or receives an explicit `jq`-snippet handoff in its brief. Pros: bounded scope per delegation. Cons: risk that the reconstructor diverges from the hook script's established patterns if the handoff is imperfect.

## User decision

The user confirmed the **single-executor delegation**: both tasks go to one executor, back-to-back within one context window.

## Implication

The manager issues ONE delegation prompt covering both tasks. The executor completes the hook script first (producing the hook-script artifact, the shared `jq` snippets, and the hook-stdin contract), then the reconstructor (consuming those outputs).

If context saturation occurs partway through the reconstructor, the manager can re-delegate the reconstructor as a fresh executor with the `jq` snippets from the hook-script output pasted in as literal brief context.

## Source

Session 1b26cf20 planning — agent-assignment decision bundling the hook-script and reconstructor tasks under one executor.

## Related

- Companion decision (planned, not yet promoted): a `features/agents/design/lock2-shared-executor-mega-task-risk.md` doc capturing LOCK #2's mega-task context-coherence risk. As of this writing that design doc has not been promoted, so this is a forward pointer to where the companion analysis belongs rather than an existing file.
