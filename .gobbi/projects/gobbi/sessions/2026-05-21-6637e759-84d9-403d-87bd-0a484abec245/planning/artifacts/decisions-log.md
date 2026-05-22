---
loop: planning
iter: 4
artifact_type: decisions-log
created_at: 2026-05-21
status: final
supersedes: []
related:
  - planning/rawdata/draft-iter4.md
  - ideation/artifacts/scope-contract.md
---

# Decisions Log — Repo Reset (Planning iter4 PASS)

All 12 D-PLAN decisions; all resolved. No outstanding AskUserQuestion for Execution Loop entry.

Lock summary: 19 Ideation locks + 12 D-PLAN decisions = **29 total locks** entering Execution.

---

## D-PLAN-01 — mistake-memory continuity (user-locked)

**Source**: F-CX-PREP-O-01 (Preparation iter1 Codex, High/75).
**Options**: (a) Single-executor sweep; (b) Multi-task with snapshot.
**User decision**: **(a) Single-executor sweep** — Stages A through E.2 run within ONE executor task (Task 02). Project mistakes loaded ONCE at task start before Stage C wipes `mistakes/`.

---

## D-PLAN-02 — project.json deletion drift (inline-resolved)

**Source**: F-CX-PREP-O-02 (Preparation iter1 Codex, Medium/75).
**Resolution**: Task 02's `files:` list explicitly enumerates BOTH `.claude-plugin/marketplace.json` AND `.gobbi/projects/gobbi/project.json` as `op: delete`. Task 02 `traces-to:` names F-CX-PREP-O-02 anchor.

---

## D-PLAN-03 — `gh --delete-branch` redundancy (user-locked)

**Source**: F-CX-O4-01 (Ideation iter4 Codex, Medium/75).
**Options**: (a) Drop redundant `git branch -d <sweep-branch>`; (b) Keep as defense-in-depth.
**User decision**: **(a) Drop the redundant step**. `gh pr merge --squash --delete-branch --match-head-commit "$HEAD_SHA"` already deletes the sweep branch locally + remotely.
**Supersession flag (iter2)**: Implementation Checklist lines 104+114 (`(iter2 M-2)` `git branch -d <sweep-branch>` clauses) are LOGICALLY SUPERSEDED for this workflow. Executor delegation prompt and manager §10 must omit those clauses.

---

## D-PLAN-04 — Honor `git/SKILL.md` Role Boundaries (user-locked + iter2 extension)

**Original lock (iter1 DISCUSSION)**: Subagents commit but never push, create PRs, or merge.
**iter2 extension (user-authorized)**: Extend to ALL six manager-owned categories per `git/SKILL.md` Role Boundaries table: Issue, Worktree, Branch (remote push), Push to remote, PR, Merge, Cleanup. Tag push moves out of Task 01; Stage F (worktree-remove + branch cleanup) moves out of Task 02 to Manager §5a + §5b.
**Stage E.2 carve-out**: Read-only git inspection (`git log`, `git ls-tree`) + FS deletion of a gitignored dir are NOT git mutation operations — they remain executor-scope.

---

## D-PLAN-05 — Issue creation timing (inline-resolved)

**Source**: `git/SKILL.md` Core Principles ("Every task starts from a GitHub issue").
**Resolution**: Manager creates GitHub issue as FIRST pre-Execution operation (§1) — before tag work, before worktree, before delegating any task. Issue number drives the sweep branch name.

---

## D-PLAN-06 — Stage D + Stage E.1 commit boundary (user-authorized at iter2 REVISE)

**Source**: F-CL-S-01 (Claude Structure, High/75) + F-CX-PLAN-O-02 (Codex Overall, High/80) — iter1 commit boundary ambiguous.
**iter2 resolution**: Stage D and Stage E.1 are staged together and land in a SINGLE commit (commit 3). Executor stages Stage D's gitignore edits, then stages Stage E.1's `git add` + runs 52-sibling-dir `rm -rf` AND THEN runs `git commit`. No `git commit --amend`. Total sweep-branch commit count: **EXACTLY 3**.

---

## D-PLAN-07 — Stage A branch-open ownership (user-authorized at iter2 REVISE)

**Source**: F-CX-PLAN-O-03 (Codex Overall, Medium/60) — Stage A marked Task 02 but branch-open is a manager pre-condition.
**iter2 resolution**: Stage A's discovery + pre-flight scans → Task 02 (executor). Stage A's branch-open (worktree create) → Manager pre-Task-02 §2.

---

## D-PLAN-08 — Tag form locked to lightweight (iter3 Fix 1)

**Source**: Convergent across both evaluator systems — Claude F-CL2-P-01 + F-CL2-A-02 + F-CL2-C-01 + F-CL2-R-03 (4 perspectives) + Codex F-CX-PLAN-O2-01 (High/85). iter2 Fix-1 rewrite introduced `git tag -a` (annotated form) in Task 01 Special-discipline cell — would hang headless sonnet executor on `$EDITOR` prompt.
**iter3 resolution**: Tag form locked to lightweight: `git tag pre-reset-2026-05-21 487fc35` (no `-a`, no `-m`). Matches line 154 imperative form + Scope Contract Q-F + all 5+ call sites.

---

## D-PLAN-09 — Manager §5a worktree-remove precheck (iter3 Fix 2)

**Source**: Claude F-CL2-P-02 (Project Medium/80) + F-CL2-R-01 (Risk Medium/85). Manager §5a removes two non-sweep worktrees without the `git status` precheck `git/SKILL.md` Procedure P5 step 3 mandates.
**iter3 resolution**: Manager §5a prepends `cd <worktree-path> && git status --porcelain` for each of the two non-sweep worktrees. On non-empty output: emit NEEDS_CONTEXT to user. Auto-`--force` is forbidden per `git/SKILL.md` Forbidden Operations.

---

## D-PLAN-10 — `staging/plans/main.md` mistake-load timing wording (iter3 Fix 3)

**Source**: Codex F-CX-PLAN-O2-02 (Overall Low/60, Confidence 85). `main.md` iter2 wording said "before Stage 0 (Task 01) launches" — but Task 02 starts after Task 01 + manager §1b.
**iter3 resolution**: `main.md` paragraph rewritten to "Task 02 loads project mistakes once at task start, before Stage A and before Stage C wipes `.gobbi/projects/gobbi/mistakes/`."

---

## D-PLAN-11 — Self-review grep hardening (iter3 Fix 4)

**Source**: Codex F-CX-PLAN-O2-01 verification recommendation.
**iter3 resolution**: Self-review § 9 documents the verification grep: `rg -n "annotated|tag -a|lightweight|git tag pre-reset" planning/rawdata/draft-iter3.md planning/staging/plans/main.md`. Expected output: only categories (i) canonical lightweight prose, (ii) canonical lightweight imperative, (iii) historical-context cell text inside fix-summary tables. Zero residuals confirmed at iter3 close.

---

## D-PLAN-12 — iter4 docs-sync surgical fix; maxIterations override 3→4 (user-authorized)

**Source**: Codex iter3 F-CX-PLAN-O3-O-01 (High/100) — residual docs-sync drift in `staging/plans/main.md`: (a) line 126 pointer `draft-iter2.md` → should be `draft-iter3.md`; (b) line 154 rawdata identifier `draft-iter2.md` → `draft-iter3.md`; (c) §5a summary at line 141 omits `git status --porcelain` precheck. Claude iter3 returned PASS but missed the drift.
**User authorization**: maxIterations override 3→4 granted for a TIGHTLY surgical 3-edit fix to `staging/plans/main.md` only. No scope expansion.
**iter4 resolution**:
- **Edit 1** (main.md ~line 126): pointer `draft-iter2.md` → `draft-iter3.md`
- **Edit 2** (main.md ~line 154): rawdata identifier `draft-iter2.md` → `draft-iter3.md`
- **Edit 3** (main.md ~line 141): §5a manager-action summary gains the `git status --porcelain` precheck + NEEDS_CONTEXT + no-`--force`
- **Manager Edits 4-6** (main.md lines 55/85/106): additional stale `draft-iter2.md` references surfaced by leader's DONE_WITH_CONCERNS, applied as trivial docs-sync bookkeeping. Carve-out: mechanical text substitution in a derived summary file, within manager's "trivial bookkeeping" allowance per `orchestration/SKILL.md`.
**Discipline note**: iter4 is the LAST iter under the user-authorized override. iter4 rawdata draft is byte-identical to iter3 except for this D-PLAN-12 entry.
