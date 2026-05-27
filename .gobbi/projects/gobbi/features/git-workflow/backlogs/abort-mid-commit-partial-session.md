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

A per-iteration MEMORIZATION commit (the `git add` + `git commit` step that records session memory to the worktree branch) can be interrupted mid-flight by a network glitch, OOM event, or SIGKILL. The abort-before-merge scenario is documented, but abort specifically during the commit step is not. If interrupted, the worktree branch is left in a partially-staged state with no documented recovery path in either the worktree-creation procedure or the MEMORIZATION-phase docs.

## Why deferred

The implicit recovery path is already crash-safe and low-risk, so documenting it was not blocking. Git's commit operation is atomic at the filesystem level: if `git commit` is interrupted before writing the commit object, the working tree and index remain intact and the commit can simply be re-run. The only edge case is a partial index update if `git add` is interrupted, which is recoverable via `git status` + `git add --intent-to-add`. Because the recovery is mechanically safe and the abort-before-merge case is already documented, writing an explicit recovery scenario for the commit step itself was deferred rather than blocking the worktree-first work.

## When to pick up

Pick up when the per-iteration session-memory commit cadence is next revised, or when a real abort-during-commit incident is witnessed. No hard prerequisite — the recovery path can be documented at any time.

## Suggested approach

1. Add an explicit recovery scenario to the per-iteration commit cadence checklist: "Per-iteration commit interrupted mid-flight — recover via `git status` inside the worktree on next session resume, then re-run `git add` + `git commit`."
2. State the recovery path directly in the MEMORIZATION-phase per-iteration-commit step so a future manager finds it where the commit is performed.

## Originating session

Surfaced by a risk-evaluation finding during the worktree-first session-architecture work (session `1b26cf20`, 2026-05-23): the abort-before-merge scenario was documented but abort specifically during the session-memory commit step was not. Full session detail: `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`.
