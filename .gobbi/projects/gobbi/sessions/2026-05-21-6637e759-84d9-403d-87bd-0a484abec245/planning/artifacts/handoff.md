---
loop: planning
iter: 4
artifact_type: handoff
created_at: 2026-05-21
status: final
supersedes: []
related:
  - planning/artifacts/task-list.md
  - planning/artifacts/manager-ops.md
  - planning/artifacts/decisions-log.md
  - planning/staging/plans/main.md
---

# Handoff — Planning Loop to Execution Loop

## What was produced

A 2-task sequential plan for the destructive repo reset (feature: `repo-reset`). The plan went through 4 evaluation iterations: iter1 FAIL (Critical role-boundary leak), iter2 REVISE (convergent tag-form drift), iter3 REVISE (Codex caught main.md docs-sync drift that Claude missed), iter4 PASS (both systems). The plan is held in `planning/staging/plans/main.md` (derived summary) with full detail in `planning/rawdata/draft-iter4.md`.

## What to do, in what order

**The Execution Loop manager starts here**:

1. **Read**: `planning/artifacts/manager-ops.md` — primary briefing source for all 13 manager pre/post-Execution operations.
2. **Read**: `planning/staging/plans/main.md` — canonical derived summary with full task specs and manager command sequences.
3. **Read**: `planning/rawdata/draft-iter4.md` — authoritative detail (draft-iter3.md is the rawdata canonical; iter4 adds only D-PLAN-12).
4. **Execute** the manager pre-Execution sequence: §1 (issue create) → delegate Task 01 → §1b (tag push) → §2-4 (worktree create + delegate Task 02) → §5a-13 (Stage F + Stage G).

## The 29 locks (must not be overridden without user authorization)

**19 Ideation locks** (from `ideation/artifacts/scope-contract.md`): Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q-A, Q-B, Q-C, Q-D, Q-E, Q-F, Q-G, Q-Survivor, Q-StageE, Q-Gate-Redesign, Q-iter4-Override.

**Pre-routed Preparation constraints**:
- F-CX-PREP-O-01: single-executor sweep (D-PLAN-01)
- F-CX-PREP-O-02: both already-deleted files in Task 02 `files:` list (D-PLAN-02)

**10 D-PLAN locks** (D-PLAN-01 through D-PLAN-10, D-PLAN-12 as manager-bookkeeping):
- D-PLAN-01: single-executor sweep (user-locked)
- D-PLAN-03: no redundant `git branch -d <sweep-branch>`; iter4 checklist lines 104+114 logically superseded (user-locked)
- D-PLAN-04: honor `git/SKILL.md` Role Boundaries for ALL six manager-owned categories (user-locked + iter2 extended)
- D-PLAN-06: Stage D + Stage E.1 share commit 3; EXACTLY 3 sweep commits (user-authorized)
- D-PLAN-07: Stage A branch-open is Manager pre-Task-02 §2 (user-authorized)
- D-PLAN-08: tag form is lightweight — `git tag pre-reset-2026-05-21 487fc35`, NO `-a`, NO `-m` (manager-authorized iter3)
- D-PLAN-09: Manager §5a gains `git status --porcelain` precheck for both stale worktrees; non-empty → NEEDS_CONTEXT; never auto-`--force` (manager-authorized iter3)
- D-PLAN-10: Task 02 loads project mistakes once at task start, before Stage A and before Stage C wipes `mistakes/` (manager-authorized iter3)
- D-PLAN-11: self-review grep in `rg -n "annotated|tag -a|lightweight|git tag pre-reset"` (manager-authorized iter3)
- D-PLAN-12: iter4 docs-sync surgical fix; manager-bookkeeping carve-out (user-authorized maxIterations override)

## Deferred items (F-CX-O4-01 and others)

Items deferred from Planning evaluation (all Low/Medium severity; none blocking Execution):

- F-CX-PLAN-O3-O-02: audit wording suggestion for self-review grep — deferred to future revision
- F-IT4-CL-O-01 (and cluster S-01, U-01, C-01, C-02): cosmetic metadata staleness in main.md frontmatter (`iter:`, title bracket, Cross-references pointer) — deferred; acceptable consequence of LIGHT iter4 discipline
- F-CL2-P-03: `gh auth status` re-verify before tag push — deferred (Low/60)
- F-CL2-R-02: §5a/§5b ordering conditional failure cascade — deferred (Medium/70)
- F-CL2-S-01 + F-CL2-S-02: declarative "no amend" placement + traces-to Stage A row split — deferred (Low)
- F-CL2-U-01 + F-CL2-U-02: `what:` "no amend" and `-D` Q-G citation specificity — deferred (Low)

**Manager-bookkeeping carve-out rationale** (D-PLAN-12 addendum): the 3 additional stale `draft-iter2.md` pointer substitutions at main.md lines 55/85/106 were applied by the manager as trivial docs-sync bookkeeping (mechanical find-and-replace, no design judgment). This is within the manager's "trivial bookkeeping" allowance per `orchestration/SKILL.md`. Zero `draft-iter2.md` operational references remain in main.md.

## Key path pointers

| Artifact | Path |
|---|---|
| Canonical derived plan | `planning/staging/plans/main.md` |
| Authoritative rawdata | `planning/rawdata/draft-iter4.md` (= iter3 + D-PLAN-12) |
| Manager operations brief | `planning/artifacts/manager-ops.md` |
| Task list | `planning/artifacts/task-list.md` |
| All D-PLAN decisions | `planning/artifacts/decisions-log.md` |
| Scope coverage matrix | `planning/artifacts/scope-coverage.md` |
| Full finding resolution | `planning/artifacts/resolution-log.md` |
| Cross-system divergence | `planning/artifacts/cross-system-divergence.md` |
| Ideation scope contract | `ideation/artifacts/scope-contract.md` |
| Implementation checklist | `ideation/artifacts/implementation-checklist.md` |
