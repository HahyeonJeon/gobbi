---
name: per-task-commits-vs-landing-unit
description: Per-task commits at iter1 did not preserve idea.md's locked synchronized landing/rollback property; the plan now defines the branch/PR as the atomic landing unit with a pinned EXEC_BASE and named rollback boundary
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, process]
keywords: [cod-plan-risk-001, landing-unit, synchronized-landing, exec-base, not-landable, rollback-boundary]
author: claude
supersedes: null
superseded_by: null
related: [six-file-lock-untracked-file-detection]
---

# The branch/PR, not the nine task commits, is the atomic landing unit

## Context

`idea.md:74` locks the six-file edit to land and revert as ONE synchronized unit. At iter1, the plan promised
"one meaningful commit each" with no landing, pause, or rollback contract — nine separate task commits do not,
by themselves, preserve a synchronized-landing property (`COD-PLAN-RISK-001`, High/100).

## Decision

Added § Landing, pause, and rollback contract: the branch + PR are the landing unit; task commits are
branch-internal checkpoints, never independently landable or revertible after a downstream commit exists; every
pause is `NOT_LANDABLE` with a named resume point; the rollback boundary is explicit (current unconsumed task →
restore that task; a later task has consumed it → abandon the whole branch to a pinned `EXEC_BASE`); an
executable landing proof confirms the branch diff from `EXEC_BASE` touches exactly the six canonical files.

## Rationale

A commit-per-task cadence is an audit/review convenience, not a landing granularity; conflating the two would
let a partial branch state look "committed" without being landable. Pinning `EXEC_BASE` (rather than a moving
branch name) avoids `moving-base-invalidates-diff-stat-gate`.

## Alternatives considered

- **`rev-list --count -eq 9`** (Codex's original landing proof) — declined at iter2: a fixed commit count is
  brittle against any amend or fixup and does not test the property that matters (file-set identity of the
  landing diff).

## Consequences

Execution MUST NOT treat any individual task commit as mergeable or revertible on its own; only the whole-branch
PR, gated by T9 passing plus the dual-system Execution EVALUATION, is landable.

## Related

- [[six-file-lock-untracked-file-detection]] — the landing-proof completeness fix (untracked-file blindness) built on this contract
