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
supersedes: null
superseded_by: null
---

# Plan diff-scope gate semantics override (bundled PR)

## Context

The Plan's per-task verify gates were authored when each task was expected to ship as its own PR, so each task's `verifies:` spec used `git diff --name-only develop...HEAD` to confirm the task touched only its declared files. The user then switched to a single bundled PR (all tasks on one worktree branch) at Execution entry. Under a bundled PR, `develop...HEAD` cumulates ALL commits on the branch since develop diverged — so when a later task's commit was checked, the diff returned every prior task's files too, not just the current task's.

This surfaced concretely on the memorization moment-of-capture task: its verify spec expected exactly 2 files (`memorization/SKILL.md` + `mistake/SKILL.md`), but `develop...HEAD` returned 3 — the 2 expected files plus the preceding task's `gobbi/SKILL.md`. An evaluator raised this as a High-severity REVISE. Checked at commit scope (`HEAD~1..HEAD`), that task's commit showed exactly the 2 expected files; the extra file was purely an artifact of the cumulative branch-diff semantics.

## Decision

Under a bundled PR, per-task scope gates use **commit-scope diff** (`git diff --name-only HEAD~1..HEAD`, or `<commit-sha>^..<commit-sha>`), NOT branch-vs-develop diff (`develop...HEAD`). The branch-cumulative diff is checked once at PR-creation time (Wrap-up) to confirm the full bundle equals the union of all tasks' files. The REVISE on the memorization task was overridden to an effective PASS: its commit scope was correct; only the Plan's gate command was written for the no-longer-applicable per-task-PR topology.

## Rationale

The gate's underlying property — "this task touched only its declared files" — is correctly verified by commit-scope diff under a bundled PR. The branch-vs-develop command did not measure that property under bundled topology; it measured "every file changed on the branch so far," which is a different (and for per-task scope, wrong) quantity. Switching to commit-scope is not gaming the gate (Iron Law 11): it fixes the gate command to measure the property it was always meant to measure, rather than relaxing the property to make a failing number pass.

## Alternatives considered

- **Keep `develop...HEAD` and widen each task's expected-file count to include prior tasks' files** — rejected: this games the gate. It would relax the per-task scope property ("touched only its declared files") just to make the cumulative count match, defeating the gate's purpose.
- **Re-split into per-task PRs to restore the original gate semantics** — rejected: the user chose bundled PR; reverting the PR topology to fit a verification command is backwards. The command adapts to the topology, not the reverse.

## Consequences

All remaining task evaluations in the bundle use commit-scope diff (`git diff --name-only HEAD~1..HEAD` or `<commit-sha>^..<commit-sha>`) for the per-task scope gate. The branch-cumulative diff (`develop...HEAD`) is reserved for the single PR-creation check at Wrap-up, where it confirms the full bundle equals the union of all the bundle's tasks' files.

## Related

- `design/per-iteration-session-commit-cadence.md` — the per-iteration commit cadence (D-4) that produces the per-task commits this gate checks.
