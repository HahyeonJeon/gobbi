---
name: per-iteration-session-commit-cadence
description: Each loop's MEMORIZATION step ends with a worktree-branch commit using chore(session) subject format, once per iteration.
type: design
scope: feature
feature: git-workflow
status: locked
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, session-commits, memorization, cadence]
design-id: D-4
---

# Per-iteration session-memory commit cadence (D-4)

## Context

Under worktree-first, the entire session directory lives in the worktree, and the worktree is removed at Wrap-up. Removal discards any uncommitted state, so session memory written during the session is lost on a mid-session abort unless it has been committed first. The open question was *when* to commit session memory to the worktree branch: once at Wrap-up, or at every iteration.

## Decision

Each loop's MEMORIZATION step ends with a worktree-branch commit:

```
git -C "$worktreePath" add <session-memory-deltas>
git -C "$worktreePath" commit -m "chore(session): record <loop> iter{n} memory"
```

Subject format: `chore(session): record <loop> iter{n} memory` (e.g., `chore(session): record ideation iter3 memory`).

**Cadence**: per-iteration (matches existing MEMORIZATION runs — at most `maxIterations` commits per loop × 5 loops = 15 commits per session).

## Rationale

Worktree removal at Wrap-up discards uncommitted state; committed changes survive worktree removal. Per-iteration cadence (rather than once-at-Wrap-up) ensures session memory survives mid-session abort — all data up to the last completed iteration is durable.

## Alternatives considered

- **Commit once at Wrap-up** — rejected: session-memory data is lost on a mid-session abort that happens before Wrap-up runs. Per-iteration cadence makes every completed iteration's data durable as it lands.

## Consequences

This cadence applies to all 5 workflow loop docs (`ideation.md`, `preparation.md`, `planning.md`, `execution.md`, `wrap-up.md`); see `design/workflow-phase-doc-set-for-per-iter-cadence.md` for the explicit file enumeration. Verification: in a multi-iteration loop, `git log --oneline` inside the worktree shows subjects matching `^chore\(session\): record .* iter[0-9]+ memory$`. The accumulated commits add a bounded storage cost to develop's history (see `decisions/2026-05-24-session-commit-storage-bounds.md`).

## Related

- `design/workflow-phase-doc-set-for-per-iter-cadence.md` — the 5-file enumeration this cadence applies to.
- `discussions/per-iter-commit-subject-scope.md` — the discussion that locked the `chore(session)` commit subject.
- `discussions/session-memory-survival.md` — the discussion that anchored durability to per-iteration commits.
- `decisions/2026-05-24-session-commit-storage-bounds.md` — the storage-cost decision for these commits.

## Source

Full session context at `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/`
