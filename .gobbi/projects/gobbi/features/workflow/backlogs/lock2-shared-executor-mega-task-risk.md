---
name: lock2-shared-executor-mega-task-risk
description: Tasks 07+08 shared-executor context-budget risk — deferred assumption
type: backlogs
scope: feature
feature: workflow
status: deferred
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [execution, shared-executor, context-budget, lock2]
priority: medium
domain: process
disposition: open
supersedes: null
---

# Shared-executor context-budget risk (LOCK #2)

## Context

LOCK #2 binds Tasks 07 (hook script) and Task 08 (reconstructor) into a single executor delegation back-to-back. The combined brief covers: bash strict-mode, flock -x, jq two-tier extraction, PostToolUse/PostToolUseFailure stdin contract, structured-header regex parsing, session.json upsert, D-3-3-resolver step (ii), PLUS the full reconstructor (idempotency, orphan-report, transcript-replay). Both are Large effort tasks.

Risk: combined effort may exceed a single executor's context coherence budget, producing a partial implementation or quality regression on the second task (reconstructor).

## Why deferred

LOCK #2 was user-confirmed. The rationale is valid: Tasks 07 and 08 share jq snippets and the hook stdin contract; splitting them into separate delegations would require the second executor to re-derive or re-fetch that context. The user weighed the tradeoff and accepted the shared-executor pattern.

The risk is pre-existing (not introduced by iter2). It remains Medium confidence 50 — "probable but unverified."

## Trigger condition for revisiting

If the Execution executor reports context saturation or produces incomplete Task 08 during the shared delegation, the manager should:
1. Accept Task 07 output as-is
2. Re-delegate Task 08 with explicit shared-context briefing: include the jq snippets from Task 07 output as literal context in the new brief
3. Record whether the split was needed as a data point for future LOCK #2 decisions

## Related

- draft-iter2.md:459 (agent assignment table Tasks 07+08 row)
- iter1 F-STRUCT-3 (Claude)
- iter2 F2-STRUCT-1 (Claude — same finding, carried)
