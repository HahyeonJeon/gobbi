---
slug: plan-diff-scope-gate-semantics-under-bundled-pr
title: "Plan's diff-scope verify gates use branch-vs-develop semantics; bundled PR requires commit-scope semantics"
domain: process
type: design_flaw
disposition: addressed
mistake-candidate: false
project: gobbi
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
loop: execution
task: 02-memorization-moment-of-capture
created: 2026-05-23
status: active
supersedes: null
superseded_by: null
date: 2026-05-23
feature: git-workflow
promoted-from: sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/execution/T2/staging/decisions/plan-diff-scope-gate-semantics-under-bundled-pr.md
promoted-at: 2026-05-23T14:00:00Z
---

# Plan diff-scope gate semantics override (bundled PR)

## Witness

Codex T02 iter1 flagged F-PROJ-01 (High/100): `git diff --name-only develop...HEAD` returns 3 files (T01's `gobbi/SKILL.md` + T02's `memorization/SKILL.md` + `mistake/SKILL.md`). Plan Task 02 verify spec expected exactly 2 files. Codex elevated to High → REVISE verdict.

## Root cause

Plan was authored when per-task PR was the working assumption. User switched to bundled PR at Execution entry. Plan's `verifies:` for each task uses `git diff --name-only develop...HEAD` which cumulates ALL commits on the branch since develop diverged.

Under bundled PR, the correct gate semantics:
- **Branch-vs-develop diff (`develop...HEAD`)** — check at PR-creation time, not per-task.
- **Commit-scope diff (`HEAD~1..HEAD` or `<sha>^..<sha>`)** — exactly the current task's changes; correct for per-task scope check.

T02's commit `536d22f` shows exactly the 2 expected files when checked at commit scope.

## Decision

Manager **overrides** Codex REVISE for T02 iter1: T02's commit scope is correct (2 files: memorization + mistake); Plan's `verifies:` was written for per-task topology that no longer applies.

T02 treated as effective PASS (Claude PASS + Codex REVISE-on-plan-misspec → manager-override PASS).

## Forward-applicable rule for T03-T07

All remaining task evaluations:
- **Diff-scope gate uses commit-scope** — `git diff --name-only HEAD~1..HEAD` (or `<commit-sha>^..<commit-sha>`) — NOT `git diff --name-only develop...HEAD`.
- Branch-cumulative diff is checked once at PR creation (Wrap-up) to confirm full bundle = all 7 tasks' files in union.

## Iron Law 11 check

This is NOT gaming the tool. The gate's underlying property — "this task touched only its declared files" — is correctly verified via commit-scope. The Plan's gate text used the wrong git command for the bundled-PR topology.
