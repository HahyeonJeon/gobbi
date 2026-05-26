---
name: rollback-semantics-drift-from-ideation
description: Planning Task 03 incorrectly described the git checkout rollback path; corrected to git rm per the Ideation rollback contract.
type: decisions
scope: feature
feature: git-workflow
status: accepted
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, rollback, planning-correction]
loop: planning
domain: docs-sync
supersedes: null
---

# Rollback semantics correction: git rm (not git checkout) after failed promote-now commit

## Context

The Planning brief for Task 03 (Preparation promote-now commit-on-branch) initially described the rollback sequence for a failed `git commit` post-copy as "restoration via git checkout, no auto-rm of skill body." This was wrong: the copied skill file did not pre-exist in the worktree, so `git checkout` has nothing to restore. The correct action is `git rm` to remove the copied file.

The Ideation rollback contract (T1-I-T1.j and Design Decision D-3, "Partial-failure rollback") explicitly requires: if `git commit` fails post-copy, the manager MUST `git -C "$worktreePath" rm <copied-paths>` to remove the copied skill body before surfacing the failure to the user via AskUserQuestion.

## Decision

The Planning brief was corrected during Planning review to align with the Ideation rollback contract. The rollback sequence is now:
1. `git commit` fails post-copy
2. Manager runs `git -C "$worktreePath" rm <copied-paths>` — REMOVES the copied file (not `git checkout`)
3. AskUserQuestion surfaces the failure to the user
4. Re-attempt or abort per user response

## Rationale

The copied file did not pre-exist in the worktree before the promote-now operation. A `git checkout` would either fail (no prior version) or restore to HEAD (which also has no version of this file). The only correct recovery is removal.

## Consequences

The Task 03 verification spec now includes grep gates confirming `git -C "$worktreePath" rm` and AskUserQuestion co-location in the shipped Preparation promote-now text. Any executor implementing the promote-now rollback path must use `git rm` to remove the copied file, not `git checkout`.

## Source

Full session context at `.gobbi/projects/gobbi/sessions/2026-05-24-1b26cf20-677b-498c-8c1b-7d7e971597ac/planning/`
