---
name: native-codex-single-system-evaluation-debt
description: Restore true dual-system evaluation for native Codex Gobbi sessions without fabricating missing lanes
type: backlogs
scope: project
feature: null
status: deferred
created: 2026-07-06
session: 019f283d-e961-7442-9c22-319f26798141
tags: [evaluation, codex, process]
keywords: [native-codex, single-system-evaluation, dual-system, process-debt]
author: codex
priority: high
project-scope: true
shipped_in: null
---

# Native Codex Single-System Evaluation Debt

## Context

This native Codex session could not truthfully produce the normal Gobbi dual-system evidence set. Ideation and Preparation used disclosed Codex-only evaluation evidence, and Execution task reviews preserved the same limitation instead of creating fake Claude directories or synthetic dual-system claims.

The source staging records were:

- `1-ideation/staging/decisions/native-codex-single-system-evaluation-debt.md`
- `2-preparation/staging/decisions/native-codex-single-system-evaluation-debt.md`

## Why deferred

The active session was explicitly scoped to audit-and-record work for a previous Codex branch. Source-level workflow repair, runtime parity work, and new Claude+Codex orchestration were out of scope. The user-approved constraint was to preserve the degraded evidence honestly, not to fabricate a second system.

## When to pick up

Pick this up when Gobbi is ready to implement or revise native-Codex evaluation orchestration. The future session should define how native Codex obtains a genuinely independent second-system review, or how the workflow labels and gates Codex-only runs without pretending they are dual-system.

## Suggested approach

Start from the `codex` skill runtime matrix and the evaluation workflow contract. Decide whether native Codex can call an external Claude evaluator, whether the workflow should expose an explicit single-system degraded mode, or whether certain loops must block until a second system is available. Keep artifact labels and directory creation honest in every option.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-03-019f283d-e961-7442-9c22-319f26798141/`

## Related

- [[task-01-codex-evaluation-audit]] — feature review that preserved the same limitation.
- [[codex-subagents-runtime-boundary]] — reference explaining the native-Codex runtime boundary.
