---
name: define-mid-plan-recovery
description: "Stop safely between tasks, preserve diagnostics, and separate resume from authorized rollback."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [planning, execution, git]
keywords: [interruption, resume, rollback, publication]
author: codex
---

# Define mid-plan recovery

## Context

The iter1 plan distinguished pre- and post-publication repair but did not define recovery when Task 02 fails after Task 01 commits.

## Decision

Stop publication, preserve diagnostics and worktree state, and resume the same task from the last verified task commit by default. Reverting completed session commits is separately authorized and runs newest-first.

## Rationale

A paused non-releasable state is safe when it is not published and the next action is explicit.

## Alternatives considered

Automatic destructive rollback was rejected because it discards useful failure state and crosses the user's authority boundary.

## Consequences

Every task boundary has a coherent recovery path. No interim policy state is published.

## Related

- [[rollback-and-risk-boundaries]] - the Ideation rollback design.
- [[deterministic-codex-model-policy]] - the plan that applies it.
