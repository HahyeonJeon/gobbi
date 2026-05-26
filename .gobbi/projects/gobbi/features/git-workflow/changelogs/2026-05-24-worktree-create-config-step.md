---
name: worktree-create-config-step
description: Changelog for shipping row 5.5 (worktree creation) into orchestration/SKILL.md Configuration Step 1 procedure table.
type: changelogs
scope: feature
feature: git-workflow
status: shipped
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [worktree, orchestration, config-step, row-5-5, idempotency]
---

# Worktree Creation — Configuration Step 1 Row 5.5 Shipped

## Summary

Shipped row 5.5 into `orchestration/SKILL.md` Configuration Step 1 procedure table. This row prescribes creating the session worktree before row 6 stamps session.json git fields, closing the root cause of the `1829fa3` witness where Preparation generate-now symlinks landed in the main tree instead of the PR diff. After iter2 remediation, the row expresses a complete 3-state idempotency machine covering fresh sessions, healthy resume, and stale recorded-path recovery.

## What changed

- `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` (and its `.claude/skills/orchestration/SKILL.md` symlink):
  - Row 5.5 inserted between rows 5 and 6 of the Step 1 procedure table
  - Row 5.5 prescribes: read `git.workflow.mode`; if `direct` skip; if `worktree-pr` invoke P2 with branch `chore/session-{date}-{ssid-short}`; idempotency guard is a 3-state machine (`null` / `set+exists` / `set+missing`)
  - Row 6 updated: "stamp `git.branch` and `git.worktreePath` from the worktree just created in row 5.5" (replaced stale "leave null until git creates the worktree")
  - iter2: stale-path state (3) adds AskUserQuestion escalation + P6 recovery citation; "see footnote below" replaced with explicit "Task 06 / LOCK #5 footnote" forward reference

## Verification

- Plan verify gates (3/3 pass): branch-pattern grep match, symlink intact, row order 5→5.5→6 confirmed
- `git diff-tree --no-commit-id --name-only -r 14da700` → 1 file (scope clean)
- `git diff-tree --no-commit-id --name-only -r 05e446b` → 1 file (scope clean)
- Symlink `.claude/skills/orchestration/SKILL.md` intact throughout (both iters)
- iter2: `grep -nE "3-state|orphaned|path missing"` → line 103 matches; `grep -n "footnote below"` → 0 hits; `grep -n "Task 06"` → line 103 positive
- Both systems PASS at iter2

## Deferred

- `$CLAUDE_CODE_SESSION_ID` absent fallback not in row 5.5 — deferred to Task 06 footnote bundle (see backlog `ssid-env-var-absent-fallback`)
- Branch-name collision case — deferred to P2 coverage verification (see backlog `branch-name-collision-recovery`)
- P2/P6 anchor 4-hyphen slug — deferred to project-wide anchor sweep (see backlog `anchor-slug-4-hyphen-vs-2-hyphen`)
- `feat` vs `docs` commit type for SKILL.md edits — deferred to user ratification (see checklist `skill-md-commit-type-feat-vs-docs`)

## Related

- Witness: commit `1829fa3` body (PR #267 symlink gap)
- Plan: `features/git-workflow/plans/2026-05-24-session-foundations-bundle-b.md` task 01
- Mistake candidate: `edit-tool-refuses-symlink-paths.md` (symlink path rejection — empirical correction to Prep edit contract)
