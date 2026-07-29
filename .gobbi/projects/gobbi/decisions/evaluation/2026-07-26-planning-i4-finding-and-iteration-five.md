---
name: planning-i4-finding-and-iteration-five
description: Record the approved Planning iteration 4 finding disposition, cap extension, and iteration 5 waiver.
type: decisions
scope: project
feature: null
status: accepted
created: 2026-07-26
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [planning, evaluation, process]
keywords: [react-pr-369, planning-iteration-4, planning-iteration-5, claude-absence]
author: user
supersedes: null
superseded_by: null
---

# Repair the inherited cold-use probe chain in Planning iteration 5

## Context

Planning iteration 4 closed `CODEX-USAGE-001` and `CODEX-CONSISTENCY-001`. Its fresh Codex evaluation returned `REVISE` with one finding, `CODEX-CONSISTENCY-002`: the plan prohibited runtime cold-use testing while still inheriting six normal-entry P7 runtime-probe producers and Task 07 dependencies.

The manager presented one exact approval batch:

> Approve CODEX-CONSISTENCY-002 as open; extend Planning maxIterations to 5; Claude absent Planning iteration 5.

The user replied:

> Okay. Approve.

## Decision

- Keep `CODEX-CONSISTENCY-002` open for repair.
- Extend `settings.workflow.planning.maxIterations` from 4 to 5.
- Apply the exact waiver `Claude absent Planning iteration 5.`
- In Planning iteration 5, remove the six inherited per-task runtime P7 probe producers, inputs, dependencies, and `accepted-final-source-codex-proof` handoffs.
- Replace them with ordinary final-tree static verification and explicit `omitted_by_user` evidence while preserving focused commits, non-runtime checks, and Task 07's static route.

## Rationale

This is the smallest change that makes the plan executable and honors the user's cold-use omission without falsely claiming runtime proof.

## Alternatives considered

Keeping the inherited probe chain was rejected because it contradicted the user's omission. Ending at iteration 4 was rejected because the corrected plan still required a complete evaluation.

## Consequences

Planning iteration 5 is a bounded Codex-only correction. It creates no Claude artifact, runtime cold-use result, cross-system agreement, publication, merge, branch deletion, or worktree cleanup authority.
