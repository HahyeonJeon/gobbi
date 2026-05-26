---
name: abort-mid-commit-partial-session
description: Backlog item tracking the undocumented recovery path when a per-iteration session-memory commit is interrupted mid-flight.
type: backlogs
scope: feature
feature: git-workflow
status: deferred
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [recovery, commit-cadence, per-iteration, worktree]
priority: medium
disposition: deferred
domain: process
---

# Abort during per-iteration session-memory commit — recovery path implicit, not documented

## Context

A per-iteration MEMORIZATION commit (the `git add` + `git commit` step that records session memory to the worktree branch) can be interrupted mid-flight by a network glitch, OOM event, or SIGKILL. The E-3 abort-before-merge scenario is documented, but abort specifically during the commit step is not. If interrupted, the worktree branch is in a partially-staged state with no documented recovery path in the current row 5.5 or MEMORIZATION phase docs.

## Decision

Deferred. The implicit recovery path is: `git status` inside the worktree on next session resume; the manager can then either re-run the commit (if only the commit was interrupted, files are staged) or re-run `git add` + `git commit` from scratch (if the add was interrupted). Git's commit operation is atomic at the filesystem level; partial-write commits do not exist in practice (the commit object is either written or not).

## Rationale

Git's internal commit operation is designed to be crash-safe: if `git commit` is interrupted before writing the commit object, the working tree and index remain intact and the user can re-run the commit. The only edge case is a partial index update if `git add` is interrupted, but that too is recoverable via `git status` + `git add --intent-to-add`.

## Consequences

Planning: add an explicit E-3.5 recovery scenario to the checklist: "Per-iteration commit interrupted mid-flight — recovery via `git status` inside worktree on next session resume + re-run `git add` + `git commit`."

Execution: ensure the per-iteration commit step in MEMORIZATION phase docs explicitly states the recovery path.

## Related

- Session evaluation risk finding that surfaced this gap: iter1 risk evaluation R4
- `rawdata/draft-iter3.md` E-3 scenario (abort before merge)
- `rawdata/draft-iter3.md` D-4 per-iteration commit cadence
