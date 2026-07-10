---
name: load-directive-path-must-exist-in-worktree-base
description: A delegation/codex Load-Directive path must exist in the WORKTREE base, not just develop — a worktree behind develop lacks newer files
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-08
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [verification]
keywords: [load-directive, worktree-base, develop-drift, missing-load-directive, codex-dispatch]
author: claude
priority: medium
domain: process
supersedes: null
superseded_by: null
related: [executor-edited-main-tree-not-worktree-copy]
---

# A Load-Directive path must be verified to exist in the WORKTREE base, not the main tree

## What happened

The task-01 Codex proposer prompt listed `skills/codex/delegation.md` as a mandatory Load Directive. Codex reported `STATUS: BLOCKED / failure_kind: missing_load_directive` — that file does not exist in the session worktree. The worktree is based at `13f088e6`; `codex/delegation.md` was added to `develop` LATER by `f5f315cb "docs: add codex bridge prompt contract"`. The manager had read the file from the MAIN tree (develop) and assumed the same path resolved in the worktree.

## Why it happens

The manager treated "the file exists on develop / in the main tree" as "the file exists in the worktree." A session worktree is branched from an OLDER `develop` snapshot; any file added to `develop` after the worktree's base commit is ABSENT from the worktree. Load-Directive paths are resolved in the worktree (that is where the subagent/codex runs), so a main-tree-only path fails-closed.

## Correct approach

Before dispatching ANY subagent or codex run, verify every Load-Directive path EXISTS in the WORKTREE (`test -f <WT>/…`), not only in the main tree. Companion files that may legitimately be absent (`skills/{x}/mistakes.md` when no mistakes recorded yet) are load-when-exists; drop or mark them optional rather than making them mandatory. When the worktree is behind develop, the whole brief's path set must be validated against the worktree snapshot.

## How to detect

The worktree base commit is behind `develop` (check `git -C <WT> rev-parse HEAD` vs develop). A brief cites a skill/doc file that was recently added on develop. A spawned subagent or codex run reports `missing_load_directive` / file-not-found on a path the manager confirmed only from the main tree.

## Related

- [[executor-edited-main-tree-not-worktree-copy]] — the sibling worktree-vs-main-tree confusion, write-side
</content>
