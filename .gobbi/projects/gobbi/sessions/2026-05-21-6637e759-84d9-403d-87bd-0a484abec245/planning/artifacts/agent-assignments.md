---
loop: planning
iter: 4
artifact_type: agent-assignments
created_at: 2026-05-21
status: final
supersedes: []
related:
  - planning/artifacts/task-list.md
  - planning/rawdata/draft-iter4.md
---

# Agent Assignments — Repo Reset (Planning iter4 PASS)

## Task 01 — `create-pre-reset-tag`

| Field | Value |
|---|---|
| Agent type | `executor` |
| Model | `sonnet` (default per delegation/SKILL.md § Model Selection) |
| Required skills | (1) `principles`; (2) `mistake`; (3) `.claude/skills/orchestration/workflow/execution.md`; (4) `.claude/skills/execution/SKILL.md`; (5) `.claude/skills/git/SKILL.md` (Role Boundaries — executor MUST NOT push the tag per Fix 1 iter2 / D-PLAN-04) |
| Required mistakes | `executor-rationalized-failing-verification-gate.md`, `executor-boundary-extension-without-asking.md`, `manager-mispec-grep-c-for-occurrence-count.md`, `session-dir-naming-convention-uses-date-prefix.md` (load full project mistakes set at task start; these 4 are the inline-cited ones) |
| Justification | Default executor; no override needed. The task is a small, contract-bounded local-ref-only operation. |
| Worktree | Operates against the **main tree** at `/playinganalytics/git/gobbi/` — Task 01 only touches a local ref; no worktree needed because no working-tree files change. |
| Special discipline | **NO PUSH** — `git push origin pre-reset-2026-05-21` is manager-scope per Fix 1 iter2 / `git/SKILL.md` § Role Boundaries "Push to remote = Manager / Subagent = Never". The executor stops at `git tag pre-reset-2026-05-21 487fc35` (lightweight tag — NO `-a`, NO `-m`, NO `$EDITOR` prompt; iter3 Fix 1 corrects the iter2 regression) and returns DONE with the local tag confirmed via `git rev-parse`. |

## Task 02 — `cleanup-sweep`

| Field | Value |
|---|---|
| Agent type | `executor` |
| Model | `sonnet` (default per delegation/SKILL.md § Model Selection) |
| Required skills | (1) `principles`; (2) `mistake`; (3) `.claude/skills/orchestration/workflow/execution.md`; (4) `.claude/skills/execution/SKILL.md`; (5) `.claude/skills/git/SKILL.md` (full § Role Boundaries — executor MUST respect manager-only operations: Push, PR, Merge, Cleanup, tag push); (6) `.claude/skills/git/conventions.md` (branch naming, commit grammar, AI-Provenance trailer) |
| Required mistakes | All 40+ project mistakes at `.gobbi/projects/gobbi/mistakes/` (loaded ONCE at task start per F-CX-PREP-O-01 / D-PLAN-01); inline-cited: `executor-rationalized-failing-verification-gate.md` (E.2 NEEDS_CONTEXT clause); `session-dir-naming-convention-uses-date-prefix.md` (Stage E.1 c676684d- explicit naming); `manager-mispec-grep-c-for-occurrence-count.md` (empty-output assertion for CLAUDE.md table-row grep); `executor-boundary-extension-without-asking.md` (no push, no PR, no merge, no worktree-remove, no branch-delete — all manager-scope) |
| Justification | Default executor; sonnet appropriate because the Plan provides a concrete contract (Stages A through E.2) with explicit verification gates. Complexity is in execution discipline, not design judgment. Stage F is now manager-scope, reducing executor cognitive load. |
| Worktree | The **manager** creates the worktree before delegation (per `git/SKILL.md` Procedure P2) at `.gobbi/projects/gobbi/worktrees/<sweep-branch>/`. The executor's first action is to `cd` to the worktree's absolute path. Branch name follows `git/conventions.md`. |
| Special discipline | (a) **Mistake-load is one-time at task start** (F-CX-PREP-O-01 / D-PLAN-01 option a) — before Stage A, before Stage C wipes `.gobbi/projects/gobbi/mistakes/`. Must NOT re-load mistakes after Stage C wipes the directory. (b) **No push, no PR-create, no merge, no worktree-remove, no local-branch delete, no `--force`** — all manager-only per Fix 1 iter2 / D-PLAN-04. (c) **No `--no-verify`, no `git stash`, no `git reset --hard`**; on any verification-gate divergence, return NEEDS_CONTEXT. (d) **No `git commit --amend`** — D+E.1 share a commit by staging D's edits and E.1's add before the single `git commit` (Fix 2 iter2). |
