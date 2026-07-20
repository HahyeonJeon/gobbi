---
name: single-evaluator-pass-is-provisional
description: One evaluator PASS cannot close a step unless the user approved the exact missing-system waiver for that iteration.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-16
session: 59694f66-422a-4fd5-b93b-625c2f354fc3
tags: [evaluation, process]
keywords: [single-evaluator, cross-system-divergence, named-waiver, dual-system-evaluation]
author: claude
priority: high
domain: process
related: [no-touch-git-gate-has-many-fail-open-modes]
---

# One evaluator PASS is insufficient without an exact user-approved waiver

## What happened

During a historical Ideation iteration, Claude was the only evaluator and returned PASS. A later Codex evaluation of the same subject returned REVISE with new High findings, including a fail-open symlink case. Accepting the first result would have locked an unsafe design.

## Why it happens

Fresh independent systems find different defects. One PASS proves only that one complete report found no blocking issue. It does not provide the required cross-system divergence check and cannot be silently upgraded into a pair result.

## Correct approach

Dispatch one fresh Claude evaluator and one fresh Codex evaluator with the same complete evidence bundle. Validate both reports independently, then aggregate with `FAIL > REVISE > PASS`. Normal PASS requires PASS/PASS.

If an evaluator is unavailable or invalid, pause and show the exact failure. The only single-report closure path is an explicit user waiver naming the missing system, step, and iteration. Store that decision as a material artifact and link it from the final outcome. Do not reuse a waiver across another iteration or infer one from urgency or token cost.

## How to detect

Only one system-labeled report exists under `evaluation/iteration-{n}/`, yet state is about to record PASS and advance. If no exact waiver artifact exists for that missing system, step, and iteration, the transition is invalid.

## Related

- [[no-touch-git-gate-has-many-fail-open-modes]] — the concrete defect this trap fired on: the
  symlink-traversal gap that a sole-evaluator round missed and a subsequent Codex run caught
