---
name: codex-exec-cd-worktree-worked
description: codex exec --cd <worktree> ran cleanly from inside a nested worktree; only friction was a cosmetic stdin-notice line
type: learnings
scope: project
feature: null
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [codex, process, verification]
keywords: [codex-exec, cd-worktree, nested-worktree, stdin-notice, absolute-path]
author: claude
related: []
---

# codex exec --cd <worktree> ran cleanly for dual-system production

## Insight

Running `codex exec --cd <worktree-abs>` from inside a nested worktree (a worktree nested under the main tree) works correctly. The only friction is a cosmetic `Reading additional input from stdin` line that appears when stdin is a TTY, which does not affect the exec or its output.

## Context

This session ran dual-system production with the Codex proposer via `codex exec --cd <worktree>`. The worktree path (`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-26-.../`) is nested under the main tree (`/playinganalytics/git/gobbi/`). The codex skill's `SKILL.md` carried a main-tree assumption (the `--cd <main-tree>` pattern). The nested worktree works because `--cd` sets the working directory for the exec, and the absolute path is resolved correctly regardless of nesting depth. The `Reading additional input from stdin` line is printed when stdin is a terminal but `--input /dev/null` is not set; it goes away with `codex exec --cd <worktree> < /dev/null`.

## Reason

The codex skill's main-tree assumption (`--cd <main-tree>`) was written before worktree-based sessions existed. Knowing that `--cd <worktree>` works cleanly partially relaxes that assumption for worktree-based dual-system runs, without requiring special main-tree routing for the proposer.

## How

Use `codex exec --cd <worktree-abs> --add-dir <worktree-abs> < /dev/null` for the proposer inside a worktree session. The `< /dev/null` suppresses the stdin notice. The absolute worktree path must be the same path as the worktree root (not a relative path, not the main tree — per the codex skill's absolute-path mandate). The proposer's write target for the proposal file must also be absolute.

## Counter-cases

- **The `--add-dir` must point to writable directories:** the proposer needs write access to its output path. A `--sandbox workspace-write` (not `read-only`) flag is required for the proposer (D5.8 in the verification frame).
- **The main-tree `--cd` pattern still applies to evaluation:** the codex evaluator's `--cd` target should be the main tree if the evaluated artifact is committed there; the worktree pattern applies specifically to the proposer writing a proposal file into the session's working directory.

## Related

- [[dual-system-work-added-real-coverage]] — this learning enabled the dual production run that added real coverage
