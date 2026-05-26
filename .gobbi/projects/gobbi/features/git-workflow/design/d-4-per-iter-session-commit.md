---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
scope: feature
feature: git-workflow
design-id: D-4
slug: d-4-per-iter-session-commit
status: locked
iter: 2
---

# D-4 — Per-iteration session-memory commit cadence

## Decision

Each loop's MEMORIZATION step ends with a worktree-branch commit:

```
git -C "$worktreePath" add <session-memory-deltas>
git -C "$worktreePath" commit -m "chore(session): record <loop> iter{n} memory"
```

Subject format: `chore(session): record <loop> iter{n} memory` (e.g., `chore(session): record ideation iter3 memory`).

**Cadence**: per-iteration (matches existing MEMORIZATION runs — at most `maxIterations` commits per loop × 5 loops = 15 commits per session).

## Rationale

Worktree removal at Wrap-up (P5) discards uncommitted state. T1-E-2 rule 3 (community-validated): committed = survives worktree removal. Per-iteration cadence (rather than once-at-Wrap-up) ensures session memory survives mid-session abort.

## Anchored insights

T1-E-2, T1-I-5, F-3 mitigation, E-3 abort-recovery scenario.

## Trade-offs considered

- Commit-once-at-Wrap-up — rejected: session-memory data lost on mid-session abort before Wrap-up runs

## Validation

Multi-iteration loop: `git log --oneline` inside worktree shows subjects matching `^chore\(session\): record .* iter[0-9]+ memory$`. Evaluator Risk perspective on E-3 (abort-mid-session) coverage.

## Implementation checklist anchor

T1-I-T1.f (5 loop workflow files)

## Source

`rawdata/draft-iter3.md:329-334` (D-4 narrative)
