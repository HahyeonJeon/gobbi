---
loop: planning
iter: 4
artifact_type: spec-coverage
created_at: 2026-05-21
status: final
supersedes: []
related:
  - planning/rawdata/draft-iter4.md
  - ideation/artifacts/implementation-checklist.md
  - ideation/artifacts/scope-contract.md
---

# Spec Coverage Matrix — Repo Reset (Planning iter4 PASS)

Iter3+iter4 canonical coverage. Every Ideation checklist Stage maps to a Task or Manager pre/post-Task-02 operation.

## Checklist Stage → Owner mapping

| Checklist Stage | Owner | Status |
|---|---|---|
| Stage 0 — tag create (local) | Task 01 (executor) | ✓ |
| Stage 0 — tag push to origin | Manager pre-Task-02 §1b (Fix 1 iter2) | ✓ |
| Stage A — Discovery + pre-flight | Task 02 (executor) | ✓ |
| Stage A — branch-open (worktree create) | Manager pre-Task-02 §2 (Fix 4 iter2 — D-PLAN-07) | ✓ |
| Stage B — Code + plugin + root + CLAUDE.md surgical edit | Task 02 (executor) — commit 1 | ✓ |
| Stage C — Adversarial-review + placeholder reset | Task 02 (executor) — commit 2 | ✓ |
| Stage D — Gitignore transformations | Task 02 (executor) — combined into commit 3 (Fix 2 iter2 — D-PLAN-06) | ✓ |
| Stage E.1 — In-commit session sweep | Task 02 (executor) — combined into commit 3 (Fix 2 iter2 — D-PLAN-06) | ✓ |
| Stage E.2 — Terminal bare-UUID delete | Task 02 (executor; terminal FS step, NOT a commit) | ✓ |
| Stage F — Worktree-remove + local-branch cleanup | Manager post-Task-02 §5a + §5b (Fix 1 iter2 — D-PLAN-04) | ✓ |
| Stage G — Push + PR open + atomic-guard merge + post-merge cleanup | Manager post-Task-02 §6-13 | ✓ |
| Pre-Task-01: Issue create | Manager pre-Task-01 §1 (D-PLAN-05) | ✓ |

**All 19 Ideation locks mapped**: Q1/Q5/Q6/Q7/Q-D/Item 5/H-1/.claude-plugin → Stage B (Task 02); Q2/Q-A/Q-C/Item 3 → Stage C (Task 02); Q4/Q-E → Stage D (Task 02, combined with E.1); Q8/Q-B → Stage E.1/E.2 (Task 02); Q-G + Worktree → Stage F (Manager §5a+5b — moved); Q3/Q-iter4-Override + Q-Gate-Redesign → Stage E.2 (Task 02) + Stage G (Manager §9); Q-F → Stage 0 (Task 01 local + Manager push §1b); Q-Survivor → Stage B H-1 surgical edit (Task 02); Q-StageE → Stage E split (Task 02 E.1 in-commit + E.2 terminal post-commit FS).

## Success Criteria → Verifying owner

| # | Criterion | Verified by | Owner |
|---|---|---|---|
| 1 | `git status` post-sweep shows only intended changes | Task 02 verifies block C | Executor (pre-DONE) |
| 2 | `git log --oneline -2 develop` shows 1 new squash commit + `487fc35` | Manager post-merge §13 | Manager (post-merge) |
| 3 | `ls .gobbi/projects/gobbi/` matches survivors + placeholders | Task 02 verifies #3 | Executor (pre-DONE) |
| 4 | Exactly 1 session dir | Task 02 verifies #4 | Executor (pre-DONE) |
| 5 | `git branch` returns no rows post-merge (literal Scope Contract regex) | Manager post-merge §13 | Manager (post-merge) |
| 6 | `git worktree list | wc -l → 1` post-cleanup | Manager post-merge §13 | Manager (post-merge) |
| 7 | No broken symlinks under `.claude/{skills,agents}` | Task 02 verifies #7 | Executor (pre-DONE) |
| 8 | Root contents reduced to canonical set | Task 02 verifies #8 | Executor (pre-DONE) |
| 9 | Pre-reset tag exists locally + on origin at `487fc35` | Task 01 verifies local; Manager §1b verifies origin | Split |
| 10 | `.gobbi/.gitignore` cleaned | Task 02 verifies #10 | Executor (pre-DONE) |
| 11 | `git check-ignore` on tracked session.json returns exit 1 | Task 02 verifies #11 | Executor (pre-DONE) |
| 12 | CLAUDE.md table rows removed | Task 02 verifies #12 | Executor (pre-DONE) |
| 13 | E.2 gate pre-conditions both pass | Task 02 verifies A | Executor (pre-DONE) |
| 14 | `gh pr merge --match-head-commit` returned exit 0 | Manager post-merge §9 | Manager (post-merge) |

**Gap check**: Each checklist item has an owner; each task has a checklist anchor; each success criterion has a verifying owner. No anchor-less items, no unmatched checklist items, no orphan criteria.
