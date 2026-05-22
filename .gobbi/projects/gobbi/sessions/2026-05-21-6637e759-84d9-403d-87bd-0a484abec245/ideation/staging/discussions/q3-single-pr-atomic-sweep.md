---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
feature: repo-reset
topic: single-pr-atomic-sweep
rounds: [1]
locks: [Q3]
---

# PR Strategy: Single Atomic Sweep vs. Per-Axis Decomposition

## Discussion Summary

**Q3 — PR strategy (Round 1)**

Manager offered two options: (A) single PR — one worktree, atomic sweep; (B) multiple PRs — one per axis (code/memory/git-refs/multi-system/gitignore). User chose: single PR, atomic sweep.

The evaluator (iter1 Overall F-OV-02) flagged the Karpathy "orthogonal edits" anti-pattern: the sweep bundles code wipe, project memory wipe, git-ref wipe, multi-system wipe, and gitignore policy in one diff. The finding was logged as `disputed` because Q3 is a user lock.

The user's reasoning: atomic reversibility. The entire reset is one squash commit on `develop`, reachable via `git revert` or `git reset --hard pre-reset-2026-05-21`. Decomposing into multiple PRs creates intermediate states where some axes are wiped but others are not, complicating rollback.

## Locked Decision

| Lock | Decision |
|------|----------|
| Q3 | Single PR atomic sweep; per-area commits inside the sweep branch for bisectability |

## Related

- `ideation/artifacts/scope-contract.md` § Decisions Locked (Q3)
- `ideation/staging/decisions/single-pr-orthogonal-edits.md` (F-OV-02, disputed)
- `ideation/rawdata/discussion-log.md` § Round 1
