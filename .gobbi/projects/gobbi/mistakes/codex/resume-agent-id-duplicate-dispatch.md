---
name: resume-agent-id-duplicate-dispatch
description: Resume without reconciling state.activeDispatches caused a duplicate executor assignment and writer risk.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-06
session: 019f283d-e961-7442-9c22-319f26798141
tags: [process, verification, codex]
keywords: [context-boundary, resume, active-dispatches, duplicate-assignment, runtime-id]
author: codex
priority: high
domain: codex
supersedes: null
superseded_by: null
related: [manager-locked-decision-without-audit-trail-sync]
---

# Reconcile active dispatches before replacement or redispatch

## What happened

During a historical Execution task, the manager resumed without a reliable record of the already assigned executor. Sparse task artifacts were mistaken for absence, so a second executor received the same task. The first executor later reported, creating a duplicate-writer risk.

## Why it happens

A context boundary can end or detach runtime-native agents while durable workflow state remains. Missing output, an idle notice, or a lagging native task list does not establish whether the recorded assignment survived or was lost.

## Correct approach

At a context boundary, append the newly observed runtime ID to `session.json.runtime.ids` through an atomic checkpoint without changing the Gobbi session ID. Then read `state.json`, especially `current` and `activeDispatches`, and inspect the runtime task list as a projection.

Continue only when the same runtime identity, stable assignment, and idle/addressable state are confirmed. Otherwise replace the specialist and fully reprime it from durable session artifacts. Update `activeDispatches` atomically before visible reassignment. Never create a second assignment merely because an output file is absent, and never use a global active-session pointer or automatic all-worktree scan.

## How to detect

The session resumes with an `activeDispatches` row whose identity or status has not been reconciled, yet the manager is about to assign the same stable task ID again. Another signal is a runtime task-list status being used to override verified state and artifacts.

## Related

- [[manager-locked-decision-without-audit-trail-sync]] — durable creation evidence must stay consistent with manager-visible decisions.
