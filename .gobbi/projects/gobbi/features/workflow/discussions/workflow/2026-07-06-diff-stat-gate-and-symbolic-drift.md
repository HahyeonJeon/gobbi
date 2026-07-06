---
name: diff-stat-gate-and-symbolic-drift
description: User approved the pinned Task 01 diff-stat gate and later symbolic develop drift was preserved as evidence.
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-07-06
session: 019f283d-e961-7442-9c22-319f26798141
tags: [process, evaluation]
keywords: [execution, task-01, diff-stat, moving-base, pinned-base, develop]
author: codex
outcome: Use the pinned 6a0d747c..HEAD snapshot as the Task 01 gate and record later symbolic develop drift separately.
---

# Pinned diff-stat gate and symbolic develop drift

## Context

Execution Task 01 originally inherited a stale verification gate that expected `116 files changed` from `develop..HEAD`. The executor found authoritative current evidence from the previous worktree instead: `135 files changed, 2350 insertions(+), 4502 deletions(-)` for `6a0d747c514571c2e2c4f8ab91a0f5d90d330e21..HEAD`.

After that gate was approved, symbolic `develop` moved again. A live symbolic `develop..HEAD` check then reported `158 files changed, 2403 insertions(+), 5976 deletions(-)`.

## Question

How should Task 01 handle the stale literal diff-stat gate and the later symbolic `develop` drift while staying inside the audit-and-record scope?

## Options considered

- Keep the original `116 files changed` gate. This was rejected because it contradicted authoritative branch evidence.
- Replace the stale gate with the verified `135 files changed, 2350 insertions(+), 4502 deletions(-)` snapshot. This required user approval because it changed a task verification contract.
- Chase the later symbolic `develop` drift and replace the approved gate again with the `158 files changed` snapshot. This was rejected because it would turn the gate into a moving target.

## User decision

The user approved replacing the stale `116 files changed` gate with the pinned snapshot: `6a0d747c514571c2e2c4f8ab91a0f5d90d330e21..HEAD` -> `135 files changed, 2350 insertions(+), 4502 deletions(-)`.

The follow-on handling was to preserve that approved pinned snapshot as the Task 01 gate and record the later symbolic `develop..HEAD` result as process evidence, not as a new gate.

## Implication

Task 01 can pass under the approved pinned evidence snapshot. The later symbolic drift remains part of the audit record and supports the mistake about moving branch bases invalidating literal diff-stat gates.

## Related

- [[moving-base-invalidates-diff-stat-gate]] - mistake promoted from the same gate failure.
