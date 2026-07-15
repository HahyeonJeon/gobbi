---
name: reconfirm-preparation-readiness-from-live-state
description: "Keep Preparation's live target and write-surface recheck visible in Planning."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [process, verification]
keywords: [readiness, tracked-targets, worktree, external-write]
author: codex
---

# Reconfirm Preparation readiness from live state

## Context

Claude's Project, Aesthetics, Risk, and Overall reviews found one shared Medium issue: the zero-gap
draft relied on live facts without stating Preparation's own recheck. Both systems confirmed the
facts are sound.

## Decision

Planning carries an explicit readiness premise: all 19 targets are present, tracked, and inside the
worktree; there is no external write surface. Execution refreshes this premise before editing.

## Rationale

A zero-gap readiness claim must show the write-surface boundary it checked. This prevents a future
consumer from treating an inherited Ideation observation as current evidence.

## Alternatives considered

Leaving the recheck implicit was rejected because the Preparation out-of-worktree trap requires the
scope of a zero-gap claim to be visible. Treating the finding as a blocker was rejected because both
evaluators verified that the trap does not fire for this task.

## Consequences

Planning must preserve the 19-file modify-only boundary. Execution must stop if any target becomes
missing, untracked, or outside the worktree before its edit begins.

## Related

- [[refresh-volatile-execution-premises]] — the existing Execution refresh decision.
- [[live-surface-scope]] — the locked modification boundary.
