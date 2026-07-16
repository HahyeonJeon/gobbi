---
name: watcher-fires-before-executor-done-and-slow-executor-race
description: A file-size/commit-appears watcher can fire before an executor is DONE (it may still amend or be slow to write) — treating that snapshot as "done" and acting/re-dispatching risks a concurrent-writer race on the shared worktree
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-16
session: c8fe196d-c20d-451d-ac9c-2b366c49aa95
tags: [process, orchestration, git, concurrency, agent-teams]
keywords: [watcher, executor-done, commit-amend, slow-executor, concurrent-writer, no-commit-pattern, duplicate-dispatch]
author: claude
related: []
---

## What happened
Two variants of the same misread hit this session's Execution.
(1) A watcher keyed on "the commit subject appeared in `git log`" fired for T3 (SKILL.md), the manager treated T3 as done and immediately made its OWN harness edits + commit — but the T3 executor was still finalizing (`git commit --amend`), so the two git operations interleaved (resolved cleanly only by luck).
(2) A watcher timed out with `testing.md` still a 29-line stub, so the manager judged the T12 executor "stalled", shut it down, and re-dispatched T12b — but T12 was merely SLOW (still reading/planning before writing the body in one burst). Both executors then targeted the same file; T12b correctly refused to overwrite T12's work, but this was a duplicate-dispatch / concurrent-writer race.

## Why it happens
A background watcher that keys on a file-size threshold or a commit's appearance fires at the FIRST signal, but an executor may still amend, re-verify, or write its whole body later — the executor's `STATUS: DONE` report is the real completion signal, not the file/commit snapshot. Agent-Teams executors share ONE worktree, so any manager write or re-dispatch during an executor's finalization races it.

## How to recognize
You set a watcher on file size / `git log` and then act on the worktree (edit, commit, re-dispatch) BEFORE the executor emitted `STATUS: DONE`. Symptoms: an unexpected amended commit hash, a "concurrent uncommitted edits" flag from an executor, a hash you recorded that no longer matches HEAD, or two executors on the same file.

## Correct approach
Treat the executor's actual `STATUS: DONE` report — not a file/commit watcher — as the completion signal before any concurrent manager write or re-dispatch. A slow executor with no output for a while is not necessarily stalled: confirm liveness (or wait for DONE) before re-dispatching onto the same file. And prefer the **no-commit executor pattern for parallel/overlapping work**: executors WRITE + self-verify their own disjoint file but do NO git ops; the manager commits sequentially. That removes the executor-git-op-vs-manager-write race entirely.
