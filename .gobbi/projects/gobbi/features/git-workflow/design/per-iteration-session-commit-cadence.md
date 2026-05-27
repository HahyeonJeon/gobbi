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

## Trade-offs considered

- Commit-once-at-Wrap-up — rejected: session-memory data lost on mid-session abort before Wrap-up runs

## Validation

Multi-iteration loop: `git log --oneline` inside worktree shows subjects matching `^chore\(session\): record .* iter[0-9]+ memory$`.

## Implementation note

This decision applies to all 5 workflow loop docs (`ideation.md`, `preparation.md`, `planning.md`, `execution.md`, `wrap-up.md`). See `design/workflow-phase-doc-set-for-per-iter-cadence.md` for the explicit file enumeration.

## Source

Full session context at `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/`
