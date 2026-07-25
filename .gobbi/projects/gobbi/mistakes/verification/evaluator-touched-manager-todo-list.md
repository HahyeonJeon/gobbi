---
name: evaluator-touched-manager-todo-list
description: An evaluator subagent created its own stage tasks in the manager-owned harness todo list; evaluator briefs need an explicit no-todo instruction.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-16
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [process, evaluation]
keywords: [evaluator, harness-todo-list, manager-owned, task-boundary, ownership-violation]
author: claude
priority: medium
domain: process
---

# Evaluator briefs must explicitly forbid writing to the manager's harness todo list

## What happened

During iter-2 evaluation, the Claude evaluator subagent created its own stage tasks (Stage 0 / Stage 1 / Stage 2 / Stage 3 progress items) directly in the manager-owned harness todo list — the same shared task-tracking surface the manager uses to track workflow-loop progress (Configuration / Ideation / Preparation / … per this session's own task list). This was not requested and mixed the evaluator's internal stage-tracking with the manager's loop-level progress tracking in one list.

## Why it happens

The harness todo-list tool (`TaskCreate`/`TaskUpdate`/`TaskList`) is available to every agent, not scoped per-role. An evaluator subagent following general good-practice instincts ("use the todo list to track my own multi-stage work") has no structural signal that this specific list is manager-owned for this session, because the tool itself does not distinguish "my own private todo tracking" from "the shared session todo list" — both are the same call surface.

## Correct approach

Every evaluator delegation brief (and, by the same reasoning, any other subagent brief where a shared todo list exists) must carry an explicit instruction: do not create, update, or otherwise touch the harness todo list — that surface is manager-owned for loop-level progress tracking only. If a subagent wants to track its own multi-stage internal progress, it should do so in its own working notes or simply proceed stage-by-stage without an external task list. This session's iter-2 and iter-3 evaluator briefs, once given this instruction, did not touch the manager's todo list.

## How to detect

Any `TaskList` call whose output shows tasks that were not created by the manager (e.g., stage-numbered items matching an evaluator's internal procedure — "Stage 0", "Stage 1 Frame Build") appearing interleaved with the manager's own loop-tracking tasks. A subagent-authored task in the shared list is the tell, regardless of whether its content is otherwise reasonable.

## Related

This is a delegation-brief completeness gap, not a memory-tier or write-boundary violation — the fix is a brief-template addition (an explicit no-todo-list instruction for every subagent brief that shares the harness with the manager), tracked separately as a template-level backlog item since editing delegation templates is out of scope for the current session.
