---
name: t10-symlink-mismodel
description: "Assumption risk: T10 incorrectly listed AGENTS.md as a real file; it is a symlink to .codex/AGENTS.md and must be edited via the real file only."
tags: [symlink, agents-md, t10, assumption]
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
type: decisions
domain: docs-sync
status: accepted
scope: feature
feature: project-memory
supersedes: null
superseded_by: null
---

# T10 treated `AGENTS.md` as a second real file; it is a symlink

## Context

An early version of the entrypoint-reconciliation task described editing both `AGENTS.md` and `.codex/AGENTS.md` as if they were two independent files. In reality, `AGENTS.md` (repo root) is a symlink to `.codex/AGENTS.md`. Editing the symlink path directly fails per the `edit-tool-refuses-symlink-paths` mistake. The plan listed `AGENTS.md` in the task's `files:` — an incorrect instruction that would have caused the executor to attempt an edit-tool operation on a symlink path.

## Decision

Confirmed as an assumption risk. T10 must edit ONLY the real file `.codex/AGENTS.md`. The symlink `AGENTS.md` auto-reflects because it points to the real file.

## Rationale

`readlink AGENTS.md` resolves to `.codex/AGENTS.md`. The `edit-tool-refuses-symlink-paths` mistake documents this failure mode. The WORKTREE-edit guard (`.codex/AGENTS.md` exists in BOTH the main tree and the worktree; edit the WORKTREE copy only) was already correct and is preserved.

## Alternatives considered

Add an explicit `readlink` check to T10's `verifies` only, without fixing `files:` — rejected: the executor would still attempt to use the symlink path in `files:`, causing the edit to fail before `verifies` ran.

## Consequences

T10 `files:` now lists `.codex/AGENTS.md` only. `verifies` confirms the symlink relationship and that both paths reflect the updated count (via the symlink auto-reflection). The `executor-main-tree-edit-near-miss` and `sendmessage-continued-cwd-resets-to-main-tree` mistakes are still required for T10.

## Related

- [`edit-tool-refuses-symlink-paths`](../../../mistakes/edit-tool-refuses-symlink-paths.md) — the failure mode that editing the symlink path directly would trigger
- [`executor-main-tree-edit-near-miss`](../../../mistakes/executor-main-tree-edit-near-miss.md) — the WORKTREE-vs-main-tree edit guard this task preserves

## Source

Originating session `b0a0eaf9-03f7-4dce-a040-c7443653a459` (see the `session` frontmatter field) — Planning review, Usage / Risk perspectives.
