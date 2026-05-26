---
date: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
status: accepted
feature: git-workflow
loop: planning
finding-id: rollback-semantics-drift-from-ideation
type: design_flaw
domain: docs-sync
disposition: addressed
confidence: 98
severity: High
surfaced-by: codex
addressed-in: iter2 Fix 4
supersedes: null
---

# Task 03 rollback semantics drifted from Ideation:283 (addressed in iter2)

## Context

Planning iter1 Task 03 `what` field described the rollback sequence for a failed `git commit` post-copy as "restoration via git checkout, no auto-rm of skill body." This was wrong: the copied skill file did not pre-exist in the worktree, so `git checkout` has nothing to restore. The correct action is `git rm` to remove the copied file.

Ideation iter3 draft line 283 (T1-I-T1.j) and § Decision D-3 line 322 ("Partial-failure rollback") explicitly require: if `git commit` fails post-copy, the manager MUST `git -C "$worktreePath" rm <copied-paths>` to remove the copied skill body before AskUserQuestion surfaces the failure to the user.

## Decision

In iter2 Fix 4, Task 03 `what` was rewritten to cite Ideation:283 verbatim. The rollback sequence is now:
1. `git commit` fails post-copy
2. Manager runs `git -C "$worktreePath" rm <copied-paths>` — REMOVES the copied file (not `git checkout`)
3. AskUserQuestion surfaces the failure to the user
4. Re-attempt or abort per user response

## Rationale

The copied file did not pre-exist in the worktree before the promote-now operation. A `git checkout` would either fail (no prior version) or restore to HEAD (which also has no version of this file). The only correct recovery is removal.

## Consequences

Task 03 `verifies` block now includes grep gates for `git -C "$worktreePath" rm` and AskUserQuestion co-location. The executor brief MUST cite Ideation:283 verbatim.

## Related

- draft-iter2.md:173 (Task 03 what), :186-190 (verifies), :455 (agent table), :486 (decisions log row 14)
- Ideation iter3 draft line 283
