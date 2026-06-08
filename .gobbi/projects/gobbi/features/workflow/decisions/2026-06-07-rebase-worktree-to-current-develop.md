---
name: 2026-06-07-rebase-worktree-to-current-develop
description: Manager rebased the session worktree onto current develop (c8a8654) between preparation iter1 and iter2 after the evaluator surfaced the worktree-behind finding.
type: decisions
scope: feature
feature: workflow
status: active
created: 2026-06-07
session: 422308da-f2c4-41a4-8ee3-adc89acde977
tags: [git, worktree, rebase, preparation]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Rebase Session Worktree to Current Develop Before Continuing

## Context

At Preparation iter1, the Claude evaluator found that the session worktree was 1 commit behind origin/develop (#295 c8a8654). The leader's readiness report had inverted the drift direction (claiming worktree clean / main-tree drifted), which the evaluator flagged as a High finding. The factual state was: worktree LACKED the continued-teammate parenthetical that #295 had added to develop.

## Decision

The manager rebased the session worktree onto c8a8654 (the current develop tip) between iter1 and iter2, before the iter2 readiness re-verification ran.

## Rationale

Running Preparation on a stale base risks anchor mismatch between the readiness report's line numbers and the actual files Planning will use. The rebase cost was low (one commit, confirmed non-conflicting with our three edit targets) and the benefit was a clean base for all downstream loops.

## Alternatives considered

Proceeding on the stale base and noting the gap for Wrap-up: rejected. Wrap-up cannot retroactively fix anchor mismatches that Planning/Execution depend on. The rebase was the correct point to synchronize.

## Consequences

- Post-rebase HEAD = c8a8654 = origin/develop (0 behind, 0 ahead at rebase time).
- All anchor re-verifications in iter2 run against c8a8654 files.
- #295's auto-mode.md (line 131, §2) and CLAUDE.md (line 31, principles-intro) changes confirmed non-conflicting with our edit targets.
- Wrap-up should re-confirm at PR time (rebase develop again if it has moved; re-check the line-27 blockquote and §7 append point).

## Related

- `evaluation/iter1/claude/overall.md` F-C1 — the finding that triggered the rebase decision.
- See also `mistakes/asserted-git-drift-direction-without-running-git.md` for the root mistake this corrected.
