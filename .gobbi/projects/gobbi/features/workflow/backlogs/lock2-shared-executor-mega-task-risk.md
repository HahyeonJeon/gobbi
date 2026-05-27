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

The risk is pre-existing — it was not introduced by the planning fix pass — and remains a probable-but-unverified concern rather than an observed failure.

## When to pick up

Revisit if the Execution executor reports context saturation or produces an incomplete Task 08 during the shared delegation. There are no hard prerequisites; this is a watch item that triggers on observed degradation during the LOCK #2 delegation.

## Suggested approach

If the shared delegation degrades:
1. Accept the Task 07 output as-is.
2. Re-delegate Task 08 with an explicit shared-context briefing: include the jq snippets from the Task 07 output as literal context in the new brief.
3. Record whether the split was needed as a data point for future LOCK #2 decisions.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`
