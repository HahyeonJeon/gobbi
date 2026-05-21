---
date: 2026-05-21
session: 6637e759-84d9-403d-87bd-0a484abec245
loop: planning
feature: repo-reset
topic: Planning iter2 REVISE — 4 fixes + D-PLAN-06 + D-PLAN-07 user authorizations
outcome: iter2 REVISE entry with 4 user-authorized fixes + 5 bundled cleanups; D-PLAN-06 + D-PLAN-07 locked
---

# Planning iter2 REVISE — Role-Boundary Remediation and Commit-Boundary Fix

## Context

iter1 FAIL (Codex Critical/90) + REVISE (Claude, 2 High/75 findings) converged on the role-boundary leak and commit-count ambiguity. Manager authorized 4 fixes + 5 bundled cleanups at REVISE entry after presenting findings to the user.

## Question / Options / User Decisions

**Fix 1 — Role-boundary remediation (D-PLAN-04 extension)**:
- Extend D-PLAN-04 to ALL manager-owned categories in the `git/SKILL.md` Role Boundaries table.
- Move tag push out of Task 01 to Manager pre-Task-02 §1b.
- Move Stage F (worktree-remove + branch cleanup) out of Task 02 to Manager post-Task-02 §5a + §5b.
- **User authorization granted**.

**Fix 2 — Stage D + Stage E.1 commit boundary (D-PLAN-06)**:
- Stage D's gitignore edits staged → Stage E.1's `git add` → single `git commit` (no `git commit --amend`).
- Total sweep-branch commit count: EXACTLY 3.
- **User authorization granted**.

**Fix 3 — mistake-load wording in main.md** (later corrected further in iter3 Fix 3).

**Fix 4 — Stage A branch-open ownership (D-PLAN-07)**:
- Stage A's branch-open (worktree create) assigned to Manager pre-Task-02 §2, not Task 02.
- **User authorization granted**.

**5 bundled cleanups**: F-CL-PF-01 timeout caveat; F-CL-A-01 YAML schema; F-CL-C-04 grep-pattern correction; F-CL-R-01 rollback coverage; F-CL-U-02 Stage C op overload split.

## Implication

iter2 REVISE produced a fundamentally restructured plan with all role-boundary violations removed. The evaluation that followed surfaced a new regression (tag-form drift from Fix-1 rewrite) that required iter3.

## Related

- `planning/artifacts/decisions-log.md` § D-PLAN-04, D-PLAN-06, D-PLAN-07
- `planning/evaluation/iter2/claude/overall.md`
- `planning/evaluation/iter2/codex/overall.md`
