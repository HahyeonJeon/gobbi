# Project Evaluation - Planning iter2

## Artifact Summary + Memory Reads

Evaluated `draft-iter2.md`, a surgical Planning iter2 draft for session `2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac`. What: a 10-task execution plan for the locked T1 + T3 scope. Why: resolve the iter1 REVISE findings without re-opening the scope contract. How: update Task 03 rollback semantics, Tasks 07/08 shell verification, Task 07/10 graph edges, Task 09 mistake guidance, and the `.claude/skills` symlink restore recipe.

Memory reads: `draft-iter2.md`; baseline `draft-iter1.md`; Ideation `draft-iter3.md:275-295`; iter1 Codex `project.md`; iter1 Claude `project.md` and `overall.md`; rule `stub-redirect-format.md`; mistakes `codex-eval-session-write-path-nested-in-worktree.md`, `codex-rescue-agent-fire-and-forget-without-result-capture.md`, `evaluator-returned-verdict-inline-no-per-perspective-files.md`; planning evaluation skill.

## Locked Frame (Stage 1)

Scenario P1: The iter2 plan still implements the locked Ideation scope, not a reframed scope.
- Check: `draft-iter2.md` keeps the T1 + T3 scope reference and out-of-scope list.
- Check: no new task appears outside the existing 10-task table.

Scenario P2: The Task 03 rollback fix restores the upstream Ideation contract.
- Check: Task 03 names `git -C "$worktreePath" rm <copied-paths>`.
- Check: Task 03 keeps rollback in `preparation/SKILL.md`, per LOCK #4.
- Check: AskUserQuestion remains co-located with the rollback paragraph.

Scenario P3 (adversarial): A surgical fix could satisfy grep while changing the wrong user-facing behavior.
- Check: the plan removes copied files, not "git checkout" restore.
- Check: the plan does not auto-retry or auto-revert without user input.

## Per-scenario Per-check Results

P1: yes. `draft-iter2.md:9` states all non-fix sections are copied from iter1, and `draft-iter2.md:636-651` preserves the out-of-scope list.

P2: yes. `draft-iter2.md:173` specifies `git -C "$worktreePath" rm <copied-paths>` before AskUserQuestion; `draft-iter2.md:179` keeps the target file as `preparation/SKILL.md`; `draft-iter2.md:190` requires the AskUserQuestion grep gate.

P3: yes. `draft-iter2.md:173` explicitly says the rollback removes the copied file and rejects git-checkout restore / auto-revert. Ideation `draft-iter3.md:283` requires the same copied-file removal.

## Typed Findings

### rollback-semantics-drift-from-ideation

- finding-id: rollback-semantics-drift-from-ideation
- type: design_flaw
- domain: docs-sync
- disposition: addressed
- confidence: 98
- severity: High
- evidence: `draft-iter2.md:173` now requires `git -C "$worktreePath" rm <copied-paths>` before AskUserQuestion, matching Ideation `draft-iter3.md:283`; grep for `git -C.*rm` returned `draft-iter2.md:173`, `:176`, `:186`, and `:189`.
- surfaced-by: codex
- inherited-from: iter1/project-rollback-semantics-drift-from-ideation

## Low-confidence Appendix

No low-confidence project-scope blockers found. The remaining open Codex finding is a Consistency low, not a Project blocker.

VERDICT: PASS
