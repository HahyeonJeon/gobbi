---
date: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
loop: planning
iter: 1
finding-id: DOC-USAGE-2-RISK-1
type: assumption_risk
domain: docs-sync
severity: Medium
confidence: 100
disposition: addressed
addressed-in-iter: 2
addressed-how: "T10 `files:` now lists ONLY `.codex/AGENTS.md` (not `AGENTS.md`). T10 `verifies` confirms `readlink AGENTS.md` = `.codex/AGENTS.md`, asserts '13 principles' in `.codex/AGENTS.md` AND via the symlink, '12 principles'=0, and git diff lists ONLY `.codex/AGENTS.md`. The WORKTREE-edit guard (vs main-tree copy) is preserved."
status: accepted
feature: project-memory
supersedes: null
superseded_by: null
---

# T10 treated `AGENTS.md` as a second real file; it is a symlink

## Context

The iter1 T10 task described editing both `AGENTS.md` and `.codex/AGENTS.md` as if they were two independent files. In reality, `AGENTS.md` (repo root) is a symlink → `.codex/AGENTS.md`. Editing the symlink path directly fails per the `edit-tool-refuses-symlink-paths` mistake. The plan listed `AGENTS.md` in T10's `files:` — an incorrect instruction that would have caused the executor to attempt an edit-tool operation on a symlink path.

## Decision

Confirmed as an assumption risk. T10 must edit ONLY the real file `.codex/AGENTS.md`. The symlink `AGENTS.md` auto-reflects because it points to the real file.

## Rationale

`readlink AGENTS.md` = `.codex/AGENTS.md` (verified during iter2). The `edit-tool-refuses-symlink-paths` mistake documents this failure mode. The WORKTREE-edit guard (`.codex/AGENTS.md` exists in BOTH the main tree and the worktree; edit the WORKTREE copy only) was already correct in iter1 and is preserved.

## Alternatives considered

Add an explicit `readlink` check to T10's `verifies` only, without fixing `files:` — rejected: the executor would still attempt to use the symlink path in `files:`, causing the edit to fail before `verifies` ran.

## Consequences

T10 `files:` now lists `.codex/AGENTS.md` only. `verifies` confirms the symlink relationship and that both paths reflect the updated count (via the symlink auto-reflection). The `executor-main-tree-edit` and `sendmessage-continued-cwd-resets-to-main-tree` mistakes are still required for T10.

## Related

- `planning/evaluation/iter1/claude/usage.md` (DOC-USAGE-2)
- `planning/evaluation/iter1/claude/risk.md` (DOC-RISK-1)
- `planning/rawdata/draft-iter2.md` §DL-K
- Project mistake: `edit-tool-refuses-symlink-paths`
- Project mistake: `executor-main-tree-edit`
