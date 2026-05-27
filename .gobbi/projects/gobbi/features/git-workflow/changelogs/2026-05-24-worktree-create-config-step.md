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

# Worktree creation shipped into Configuration Step 1

**Task:** Insert the worktree-creation step into the `orchestration/SKILL.md` Configuration Step 1 procedure table (session-foundations-bundle-b plan, task 01).

## Summary

Shipped a worktree-creation step into the `orchestration/SKILL.md` Configuration Step 1 procedure table (inserted as row 5.5, between the existing row 5 and row 6). This step prescribes creating the session worktree before the following row stamps `session.json` git fields, closing the root cause of the commit-`1829fa3` witness where Preparation generate-now symlinks landed in the main tree instead of the PR diff. After a remediation pass, the step expresses a complete 3-state idempotency machine covering fresh sessions, healthy resume, and stale recorded-path recovery.

## What changed

- `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` (and its `.claude/skills/orchestration/SKILL.md` symlink):
  - The worktree-creation row was inserted between rows 5 and 6 of the Step 1 procedure table.
  - It prescribes: read `git.workflow.mode`; if `direct`, skip; if `worktree-pr`, invoke the `git`-skill worktree-create procedure with branch `chore/session-{date}-{ssid-short}`; the idempotency guard is a 3-state machine (`null` / `set+exists` / `set+missing`).
  - Row 6 was updated to "stamp `git.branch` and `git.worktreePath` from the worktree just created" (replacing the stale "leave null until git creates the worktree").
  - The remediation pass added, for the stale-path state, an AskUserQuestion escalation plus a citation to the `git`-skill orphaned-worktree recovery procedure, and replaced a vague "see footnote below" with an explicit forward reference to the direct-mode opt-out footnote.

## Verification

- Plan verify gates (3/3 pass): branch-pattern grep match, symlink intact, row order 5 → 5.5 → 6 confirmed.
- `git diff-tree --no-commit-id --name-only -r 14da700` → 1 file (scope clean).
- `git diff-tree --no-commit-id --name-only -r 05e446b` → 1 file (scope clean).
- Symlink `.claude/skills/orchestration/SKILL.md` intact throughout both the initial ship and the remediation pass.
- Remediation pass: `grep -nE "3-state|orphaned|path missing"` matched the new prose; `grep -n "footnote below"` → 0 hits; the explicit footnote forward reference confirmed present.
- Both evaluator systems returned PASS after the remediation pass.

## Deferred

- `$CLAUDE_CODE_SESSION_ID`-absent fallback was not added to the worktree-creation row — deferred to the direct-mode opt-out footnote bundle (see scenario `scenarios/ssid-env-var-absent-fallback.md`).
- Branch-name collision case — deferred to verification of the `git`-skill worktree-create procedure's collision handling (see scenario `scenarios/branch-name-collision-recovery.md`).
- The 4-hyphen anchor slug on the worktree-create / orphaned-worktree procedure links — deferred to a project-wide anchor sweep (see backlog `backlogs/anchor-slug-4-hyphen-vs-2-hyphen.md`).
- `feat` vs `docs` commit type for SKILL.md edits — deferred to user ratification (see checklist `checklists/skill-md-commit-type-feat-vs-docs.md`).

## Related

- Witness: commit `1829fa3` body (PR #267 symlink gap).
- Plan: `features/git-workflow/plans/2026-05-24-session-foundations-bundle-b.md` (task 01).
- Mistake: `../../../mistakes/edit-tool-refuses-symlink-paths.md` (the Edit tool rejecting symlink paths — empirical correction to the Preparation edit contract).
