---
name: plan-diff-scope-gate-semantics-under-bundled-pr
description: Plan's verify gates used branch-vs-develop diff semantics; correct semantics under bundled PR is commit-scope diff.
type: decisions
scope: feature
feature: git-workflow
status: active
created: 2026-05-23
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [git-workflow, diff-scope, bundled-pr, verification]
domain: process
loop: execution
supersedes: null
superseded_by: null
---

# Plan diff-scope gate semantics override (bundled PR)

## Witness

During Execution of Task 02 (memorization moment-of-capture), the Codex evaluator raised a High-severity finding: `git diff --name-only develop...HEAD` returned 3 files (Task 01's `gobbi/SKILL.md` plus Task 02's `memorization/SKILL.md` and `mistake/SKILL.md`). The Plan's verify spec for Task 02 expected exactly 2 files. Codex elevated to High severity and issued a REVISE verdict.

## Root cause

Plan was authored when per-task PR was the working assumption. User switched to bundled PR at Execution entry. Plan's `verifies:` for each task uses `git diff --name-only develop...HEAD` which cumulates ALL commits on the branch since develop diverged.

Under bundled PR, the correct gate semantics:
- **Branch-vs-develop diff (`develop...HEAD`)** — check at PR-creation time, not per-task.
- **Commit-scope diff (`HEAD~1..HEAD` or `<sha>^..<sha>`)** — exactly the current task's changes; correct for per-task scope check.

The Task 02 commit itself showed exactly the 2 expected files when checked at commit scope (rather than the cumulative branch diff).

## Decision

The manager overrode the REVISE verdict for Task 02: Task 02's commit scope was correct (2 files: memorization + mistake); the Plan's `verifies:` was written for per-task PR topology that no longer applied after the user switched to bundled PR at Execution entry.

Task 02 was treated as an effective PASS (Claude PASS + Codex REVISE-on-plan-misspec → manager-override PASS).

## Forward-applicable rule for T03-T07

All remaining task evaluations:
- **Diff-scope gate uses commit-scope** — `git diff --name-only HEAD~1..HEAD` (or `<commit-sha>^..<commit-sha>`) — NOT `git diff --name-only develop...HEAD`.
- Branch-cumulative diff is checked once at PR creation (Wrap-up) to confirm full bundle = all 7 tasks' files in union.

## Iron Law 11 check

This is NOT gaming the tool. The gate's underlying property — "this task touched only its declared files" — is correctly verified via commit-scope. The Plan's gate text used the wrong git command for the bundled-PR topology.
