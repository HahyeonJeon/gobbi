---
name: prove-complete-merge-base-diff
description: "Verify the release candidate from the session base so earlier committed tasks remain observable."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [planning, git, verification]
keywords: [merge-base, nineteen-files, committed-tasks]
author: codex
---

# Prove the complete merge-base diff

## Context

The iter1 Task 03 gate used an unqualified worktree diff, which could not observe committed Tasks 01 and 02.

## Decision

Compare the complete branch/worktree to the session merge base and require the exact 19-path `M` set plus no nonignored untracked files.

## Rationale

The gate must cover committed earlier tasks and current Task 03 changes as one release candidate.

## Alternatives considered

A plain worktree diff and per-task-only counts were rejected because neither proves the final combined unit.

## Consequences

Task 03 owns the final full-range proof. Codex Structure, Risk, and Overall confirm this root is addressed.

## Related

- [[deterministic-codex-model-policy]] - the plan containing the exact gate.
