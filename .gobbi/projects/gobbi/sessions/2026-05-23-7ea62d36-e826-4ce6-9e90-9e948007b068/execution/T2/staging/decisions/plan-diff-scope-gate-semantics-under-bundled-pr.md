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
feature: gobbi-orchestration-workflow-improvements
---

# Plan diff-scope gate semantics override (bundled PR)

## Witness

Codex T02 iter1 flagged F-PROJ-01 (High/100): `git diff --name-only develop...HEAD` returns 3 files (T01's `gobbi/SKILL.md` + T02's `memorization/SKILL.md` + `mistake/SKILL.md`). Plan Task 02 verify spec expected exactly 2 files. Codex elevated to High → REVISE verdict.

Claude T02 iter1 caught the same issue at Low ("F-PROJ-01: plan-side verify mis-spec") and correctly identified the root cause.

## Root cause

Plan was authored when per-task PR was the working assumption. User switched to bundled PR at Execution entry (single AskUserQuestion at Execution Loop entry). Plan's `verifies:` for each task uses `git diff --name-only develop...HEAD` which cumulates ALL commits on the branch since develop diverged — NOT just the current task's commit.

Under bundled PR, the correct gate semantics:
- **Branch-vs-develop diff (`develop...HEAD`)** — accumulates across all tasks; check this at PR-creation time, not per-task.
- **Commit-scope diff (`HEAD~1..HEAD` or `<sha>^..<sha>`)** — exactly the current task's changes; THIS is the correct per-task scope check.

T02's commit `536d22f` shows exactly the 2 expected files when checked at commit scope.

## Decision

Manager **overrides** the Codex REVISE for T02 iter1 on the basis that:

1. T02's commit scope is correct (2 files: memorization + mistake).
2. The branch-vs-develop diff includes T01's prior commit, which is correct accumulation under bundled PR.
3. The Plan's `verifies:` was written for a per-task topology that no longer applies.

T02 is treated as effective **PASS** (Claude PASS + Codex REVISE-on-plan-misspec → manager-override PASS).

## Forward-applicable change for T03-T07

All remaining task evaluations (T03 / T04 / T05 / T06 / T07):

- **Diff-scope gate uses commit-scope** — `git diff --name-only HEAD~1..HEAD` (or `<commit-sha>^..<commit-sha>`) — NOT `git diff --name-only develop...HEAD`.
- The branch-cumulative diff is checked once at PR creation (Wrap-up phase) to confirm the full bundle = all 7 tasks' files in union.

Executor briefs for T03-T07 will inline this gate semantics directly so executors compute the correct gate.

Evaluator briefs for T03-T07 will inline the same so evaluators verify against commit-scope.

## Iron Law 11 check

This is NOT gaming the tool. The gate's underlying property — "this task touched only its declared files" — is correctly verified via commit-scope. The Plan's gate text used the wrong git command for the bundled-PR topology; we're fixing the gate semantics to match reality, not silencing the gate.

## Reference

- T02 iter1 Codex eval: `sessions/.../execution/T2/evaluation/iter1/codex/{project,overall}.md`
- T02 iter1 Claude eval F-PROJ-01: `sessions/.../execution/T2/evaluation/iter1/claude/project.md`
- Plan Task 02-07 `verifies:` blocks at `sessions/.../planning/artifacts/plan.md`
- User decision at Execution Loop entry (bundled PR) — see earlier AskUserQuestion in this session's transcript
