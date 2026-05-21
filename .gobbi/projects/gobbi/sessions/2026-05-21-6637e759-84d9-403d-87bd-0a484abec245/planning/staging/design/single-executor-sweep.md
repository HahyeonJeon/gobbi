---
title: Single-Executor Sweep for Repo Reset
status: accepted
feature: repo-reset
related:
  - planning/artifacts/decisions-log.md
  - planning/staging/plans/main.md
---

# Single-Executor Sweep for Repo Reset

## Problem

The repo reset plan requires running multiple destructive stages (A through E.2) in sequence. Stage C wipes `.gobbi/projects/gobbi/mistakes/` mid-execution. If mistakes are loaded per-task (not per-spawn), later executor tasks would lose access to the project mistakes already deleted by Stage C.

## Scope

In-scope: single-executor task spanning Stages A-E.2 with mistakes loaded once at task start.
Out-of-scope: multi-task decomposition with snapshot machinery; post-Stage-C re-loads.

## Approach

Task 02 (`cleanup-sweep`) runs all of Stages A-E.2 within a single executor invocation. The executor's Load Directives block loads ALL 40+ project mistakes at task start (before Stage A). When Stage C wipes `mistakes/`, the lessons are already in the executor's session context — no re-load is needed because no further executor spawn occurs within this task.

The 3 mistake lessons explicitly encoded inline in the Implementation Checklist are baked into the Stage E.2 NEEDS_CONTEXT clause, the explicit `c676684d-` naming, and the empty-output grep gate respectively.

## Trade-offs

Optimizes for: zero mistake-memory continuity machinery; explicit upfront load.
Sacrifices: per-stage bisect safety (a failure in Stage D requires re-running from A). Accepted because the task has explicit verification gates at each stage that catch failures before the next stage begins.

## Open issues

None blocking Execution.
