---
name: verify-session-write-root
description: Verify the complete canonical session path before writing workflow artifacts.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-27
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [process, verification]
keywords: [session-path, worktree, verification]
author: codex
priority: high
domain: verification
supersedes: null
superseded_by: null
related: [gobbi-worktree-git-pathspec-omits-memory-tree-prefix]
---

# Verify the canonical session root before writing workflow artifacts

## What happened

The manager wrote Task 12 iteration 4's `open-decisions.md` below a root-level
`3-execution/` path instead of below the Gobbi session root.

## User feedback

No direct user wording. The misplaced path was detected during session-record
verification.

## Why it happens

The long absolute target was manually repeated and the middle
`.gobbi/projects/gobbi/sessions/{session}` segment was omitted.

## Correct approach

Resolve and compare the exact intended session root and proposed target before
writing. After correction, prove the wrong path absent, the canonical path
present, untracked-aware Git status clean, and the full session-record verifier
passing before resuming the writer.

## How to detect

`git status --untracked-files=all` shows a root-level `3-execution/` path while
the promised file is absent from the current task's canonical session
iteration.

## Related

- [[gobbi-worktree-git-pathspec-omits-memory-tree-prefix]] — another path-boundary failure caused by verifying an incomplete worktree-relative location.
