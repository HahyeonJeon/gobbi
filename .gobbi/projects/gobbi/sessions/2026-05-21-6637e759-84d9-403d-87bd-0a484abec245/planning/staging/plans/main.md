---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
feature: repo-reset
task: Destructive single-PR repo reset before bottom-up rebuild
status: draft
supersedes: null
iter: 3
notes: iter3 surgical-fix REVISE — 4 textual edits on top of iter2 (tag-form lightweight + §5a worktree-remove precheck + main.md:87 timing wording + self-review grep). See planning/rawdata/draft-iter3.md for full rationale. iter2 preserve list (4 surgical fixes + 5 cleanups) intact.
---

# Repo Reset Plan — Destructive Single-PR Sweep (iter3, surgical-fix REVISE — tag-form + worktree-precheck)

## Idea anchor

Locked Ideation Idea at `sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/ideation/artifacts/idea.md` (iter4 PASS, 4-iter dual-system audit, 19 user-confirmed locks). Design direction at `ideation/artifacts/design-direction.md` (D1-D11).

Post-Wrap-up promotion target (per `wrap-up/SKILL.md` staging routing): would normally promote to `.gobbi/projects/gobbi/features/repo-reset/plans/2026-05-21-repo-reset-single-pr-sweep.md`, but the destination directory `features/` is in the placeholder set per Q-A and will hold only a stub README post-sweep. The Wrap-up handoff must reference this Plan via the preserved session dir path until the rebuild session re-establishes the project-level `features/` tree.

## iter2 + iter3 REVISE summary

iter1 verdict: REVISE (Claude) / FAIL Critical/90 (Codex) — convergent root cause: role-boundary leaks contradicting `git/SKILL.md` § Role Boundaries. iter2 applies 4 surgical fixes + 5 bundled cleanups under user authorization. All 19 Ideation locks + 5 D-PLAN locks (D-PLAN-01, -03, -04, -06, -07) are preserved.

| Fix | Source finding | What changed |
|---|---|---|
| Fix 1 | F-CL-P-01 + F-CX-PLAN-O-01 (Critical role-boundary) | Tag push moved Task 01 → Manager pre-Task-02 §1b. Stage F (worktree-remove + local-branch cleanup) moved Task 02 → Manager post-Task-02 §5a + §5b. |
| Fix 2 | F-CL-S-01 + F-CX-PLAN-O-02 (High commit-count ambiguity) | Stage D + Stage E.1 share a SINGLE commit (commit 3). Sweep branch has EXACTLY 3 commits. No `git commit --amend`. |
| Fix 3 | F-CL-C-03 (Medium M-2 supersession) | Implementation Checklist lines 104 + 114 (`(iter2 M-2)` `git branch -d <sweep-branch>`) flagged as LOGICALLY SUPERSEDED for this workflow in Decisions Log § D-PLAN-03. Ideation artifact not edited. |
| Fix 4 | F-CX-PLAN-O-03 (Medium self-review accuracy) | Spec-coverage matrix corrected: Stage A branch-open → Manager pre-Task-02 §2; Stage F → Manager post-Task-02 §5a+§5b; Stage 0 push → Manager pre-Task-02 §1b. |
| C-PF | F-CL-PF-01 (Low) | `gh pr checks --watch` timeout caveat documented in Manager-ops §8. |
| C-A | F-CL-A-01 (Low) | Task 02 `files:` cleaned of inline-comments; load-bearing context moved to File map prose + `traces-to:` + Mistake-load subsection. |
| C-C04 | F-CL-C-04 (Low) | Grep-pattern self-description rewritten — gate is empty-output assertion of unanchored `grep -nE`; `manager-mispec-grep-c-for-occurrence-count.md` does NOT apply (that mistake covers occurrence counts, not empty/non-empty assertions). See Verification strategy below. |
| C-R | F-CL-R-01 (Medium) | Rollback coverage explicit in § Not in scope item 15: pre-reset tag covers develop tip only; 4 deleted branch tips live in reflog ~30-90 days. |
| C-U02 | F-CL-U-02 (Medium) | Stage C `op: modify` split into uniform `delete-contents` + `create` pair across all 13 subdirs + root README. Op schema legend added in Self-review § 6. |

### iter3 layer (4 textual edits, no scope expansion)

iter2 verdict: REVISE (Claude aggregate, 2 of 7 perspectives) + REVISE (Codex F-CX-PLAN-O2-01 High/85) — convergent root cause: Fix-1 rewrite introduced a tag-form regression (`git tag -a` without `-m`), and a parallel finding flagged the §5a worktree-remove lacked the `git status` precheck `git/SKILL.md` Procedure P5 step 3 mandates. iter3 applies 4 narrow textual edits.

| Fix | Source finding | What changed |
|---|---|---|
| iter3 Fix 1 | F-CL2-P-01 (Medium/90) + F-CL2-A-02 + F-CL2-C-01 + F-CL2-R-03 (Claude convergent across 4 perspectives) + F-CX-PLAN-O2-01 (Codex High/85) | `draft-iter3.md` line 54 "annotated tag" → "lightweight tag"; line 448 `git tag -a` → `git tag` (drop `-a`, no `-m`, no `$EDITOR` prompt). Matches `git tag <name> <sha>` form already canonical at line 154 + Scope Contract Q-F. |
| iter3 Fix 2 | F-CL2-P-02 (Project Medium/80) + F-CL2-R-01 (Risk Medium/85) (Claude convergent across 2 perspectives) | Manager §5a worktree-remove gains a `cd <worktree-path> && git status --porcelain` precheck per `git/SKILL.md` Procedure P5 step 3. On non-empty output → NEEDS_CONTEXT to user. MUST NOT auto-`--force` (Forbidden Operation). |
| iter3 Fix 3 | F-CX-PLAN-O2-02 (Codex Low/60) | This `main.md` paragraph (§ "F-CX-PREP-O-01 → D-PLAN-01") rewritten to "Task 02 loads project mistakes once at task start, before Stage A and before Stage C wipes `.gobbi/projects/gobbi/mistakes/`." Removes the iter2 wording overstatement that "mistakes load before Stage 0 / Task 01 launches" (Task 02 starts AFTER Task 01 per dependency graph). |
| iter3 Fix 4 | self-review hardening | `draft-iter3.md` Self-review § 9 NEW grep `rg -n "annotated\|tag -a\|lightweight\|git tag pre-reset" planning/rawdata/draft-iter3.md planning/staging/plans/main.md` documents expected output (zero `annotated` + zero `tag -a` mentions in `draft-iter3.md`). |

## Scope Contract reference

`ideation/artifacts/scope-contract.md` (iter4 PASS).

- Feature: `repo-reset`
- 19 locked decisions; 14 success criteria; explicit Out-of-Scope and Deferred lists
- Binding Planning constraints from Preparation: F-CX-PREP-O-01 + F-CX-PREP-O-02
- Binding constraint deferred from Ideation: F-CX-O4-01
- **User-locked at Planning DISCUSSION**: D-PLAN-01, -03, -04, -06, -07, -08, -09, -10, -11, -12 (see Decisions Log in `draft-iter4.md`)

## Sub-tasks

| # | Sub-task | Depends on | Verification | Owner type |
|---|---|---|---|---|
| 1 | `01-create-pre-reset-tag` — Create lightweight tag `pre-reset-2026-05-21` LOCALLY at `487fc35` (develop tip). **STOPS at "tag created locally" — push is MANAGER scope per Fix 1 iter2 / `git/SKILL.md` § Role Boundaries.** | — | `git rev-parse pre-reset-2026-05-21` == `487fc35` (local). `git ls-remote --tags origin | grep pre-reset-2026-05-21` is verified by manager pre-Task-02 §1b. | executor |
| 2 | `02-cleanup-sweep` — Run Stages A through E.2 in the worktree to ready EXACTLY 3 commits for the manager to push. Pre-flight (A), deletions + CLAUDE.md surgical edit (B → commit 1), adversarial-review + 13-subdir + root README placeholder reset (C → commit 2), gitignore transformations COMBINED with in-commit session sweep (D + E.1 → commit 3 per Fix 2), terminal bare-UUID FS delete after read-only gate (E.2 — executor's last act, NOT a commit). Executor returns DONE with EXACTLY 3 sweep commits present + bare-UUID dir gone. **Stage F (worktree-remove + local-branch cleanup) and Stage G (push + PR + atomic-guard merge + post-merge cleanup) are MANAGER scope per Fix 1 iter2 + D-PLAN-04 — not in Task 02.** | #1 + manager-§1b-tag-push + manager-§2-worktree-create | Executor's pre-DONE verification: (A) Stage E.2 gate passes (read-only `git log` + `git ls-tree`); (B) bare-UUID dir gone; (C) `git status` clean + EXACTLY 3 sweep commits on `<sweep-branch>`; (D) Success Criteria executor-verifiable subset (#1, #3, #4, #7, #8, #10, #11, #12, #13). Manager post-merge verifies #2, #5, #6, #9-origin, #14. | executor |

## Dependency graph

```
Manager-§1 (issue create)
  → Task 01 (local tag)
    → Manager-§1b (tag push)
      → Manager-§2-4 (worktree create + delegate)
        → Task 02 (Stages A-E.2; 3 commits)
          → Manager-§5a (worktree-remove ×2 + prune)
            → Manager-§5b (branch -d ×2, branch -D ×2 [Q-G])
              → Manager-§6-9 (push, PR, CI, atomic-guard merge)
                → Manager-§10-13 (develop sync, sweep worktree remove, issue close, post-merge verify)
```

Single executor lane (L1), sequential. File-overlap check: Task 01 touches only `refs/tags/pre-reset-2026-05-21` (local-only); Task 02 touches the broad workspace (no refs). No overlap.

## Verification strategy summary

The Plan is verified by the 14 Success Criteria + 20 D2 verification commands in `design-direction.md` § D2. **Verification ownership splits across executor (pre-DONE) and manager (post-Task-02) per Fix 1 iter2**:

- **Executor verifies pre-DONE (Task 02)**: criteria #1, #3, #4, #7, #8, #10, #11, #12, #13 (plus the executor's local pre-cursor #5-pre and #6-pre — labeled distinctly from the manager's authoritative post-merge checks).
- **Manager verifies post-Task-02** (per § Manager pre/post-Execution operations in `draft-iter3.md`): criteria #2, #5 (literal Scope Contract regex post-merge), #6 (post-cleanup wc -l = 1), #9-origin (after §1b push), #14 (exit 0 of atomic-guard merge).
- **Task 01 verifies**: criterion #9-local (tag at `487fc35` locally only; origin half by manager §1b).

The contract's terminal gate is **Success #14**: `gh pr merge <pr-num> --squash --delete-branch --match-head-commit "$HEAD_SHA"` returns exit code 0. Server-side atomic head-match enforcement (gh 2.45.0+, verified by Preparation) makes the merge fail-closed on PR-head drift.

The E.2 gate (Success #13) is the only pre-merge gate that can return NEEDS_CONTEXT from the executor: BOTH `git log --format=%H -1 <sweep-branch>` returns non-empty SHA AND `git ls-tree <sweep-branch> .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-.../ | grep -q .` exit 0 → proceed; either fails → NEEDS_CONTEXT.

**CLAUDE.md table-row excision audit (Success #12) — corrected per F-CL-C-04 cleanup iter2**: the gate asserts **empty output** of an unanchored `grep -nE '\[`v050-(overview|cli)\.md`\]' .claude/CLAUDE.md`. The `manager-mispec-grep-c-for-occurrence-count.md` mistake teaches that `grep -c` counts lines (not occurrences) — that mistake does **NOT apply here** because this gate is an empty-vs-nonempty assertion, not an occurrence-count assertion. The gate is functionally correct against the current `.claude/CLAUDE.md` content (lines 61-62 are the only matches).

## Pre-routed Planning constraints — resolutions

### F-CX-PREP-O-01 (mistake-memory continuity, High/75) → **D-PLAN-01 (a) Single-executor sweep — USER-LOCKED**

Task 02 wraps Stages A through E.2 in a single executor spawn. Task 02 loads project mistakes once at task start, before Stage A and before Stage C wipes `.gobbi/projects/gobbi/mistakes/`. (iter3 Fix 3 — timing wording corrected per Codex F-CX-PLAN-O2-02: Task 02 runs AFTER Task 01 + manager §1b tag-push per the dependency graph, so the iter2 wording "before Stage 0 (Task 01) launches" overstated the load timing. The Decisions Log § D-PLAN-01 + § Mistake-load timing in `draft-iter3.md` remain the canonical longer description.) The executor's session context already holds the lessons when Stage C runs.

### F-CX-PREP-O-02 (`project.json` deletion drift, Medium/75) → Inline doc correction

Task 02's Stage B `files:` list explicitly enumerates BOTH `.claude-plugin/marketplace.json` AND `.gobbi/projects/gobbi/project.json` as `op: delete`. Task 02 `traces-to:` also names the F-CX-PREP-O-02 anchor for executor visibility (iter2 addition).

### F-CX-O4-01 (`--delete-branch` redundancy, Medium/75) → **D-PLAN-03 (a) Drop redundant `git branch -d <sweep-branch>` — USER-LOCKED**

Manager post-merge cleanup ends with `git checkout develop && git pull --ff-only` only — the iter2 M-2 step `git branch -d <sweep-branch>` is dropped. **iter2 supersession flag (Fix 3)**: Implementation Checklist lines 104 + 114 are LOGICALLY SUPERSEDED for this workflow (see Decisions Log § D-PLAN-03 in `draft-iter3.md`).

### D-PLAN-04 — Honor git-skill role boundaries (USER-LOCKED at iter1; EXTENDED at iter2 per Fix 1)

Subagents commit but never push/PR/merge. **Fix 1 iter2 extension**: all six manager-owned categories in `git/SKILL.md` § Role Boundaries (Issue, Worktree, Branch [remote], Push to remote, PR, Merge, Cleanup) are MANAGER scope. Task 02's scope STOPS at Stage E.2's bare-UUID FS delete (terminal step). The MANAGER handles tag push (§1b), worktree create (§2-4), Stage F worktree-remove + branch-delete (§5a + §5b), Stage G push + PR + CI + merge + post-merge cleanup (§6-13).

### D-PLAN-06 (NEW iter2) — Stage D + Stage E.1 commit boundary (Fix 2)

Stage D and Stage E.1 land in the SAME commit (commit 3 of EXACTLY 3 sweep commits). No `git commit --amend` is used. The executor stages D's gitignore edits, then stages E.1's `git add` of the now-trackable session dir AND runs the 52-sibling-dir `rm -rf`, AND only THEN runs `git commit` for commit 3.

### D-PLAN-07 (NEW iter2) — Stage A branch-open ownership (Fix 4)

Stage A's branch-open (worktree create) is Manager pre-Task-02 §2; Stage A's discovery + pre-flight scans are Task 02. Spec-coverage matrix updated accordingly.

## Open issues

None at iter2. All 5 D-PLAN AskUserQuestions resolved (D-PLAN-01/-03/-04 at Planning iter1 DISCUSSION; D-PLAN-06/-07 at iter2 REVISE under user authorization). Self-review (Sub-step E) reported zero placeholders, zero type/name drift, full spec coverage across all 19 Ideation locks and 14 Success Criteria (with corrected ownership matrix per Fix 1 + Fix 4).

## Manager actions before/around/after Execution Loop entry

Per D-PLAN-04 + Fix 1 iter2 (extended role boundaries), the manager performs the following operations directly. See `draft-iter3.md` § "Manager pre/post-Execution operations" for the full command sequence.

### Pre-Task-01 (manager-direct)

1. **Create the GitHub issue** for the sweep per `git/SKILL.md` Procedure P1. Issue body cites the 19 locks + the pre-reset tag + this Plan's path + iter2 REVISE rationale.

### Pre-Task-02 (manager-direct, after Task 01 returns DONE)

1b. **Push the pre-reset tag to origin** (NEW iter2): `git push origin pre-reset-2026-05-21`. Verify: `git ls-remote --tags origin | grep pre-reset-2026-05-21` matches. Completes Success #9's origin half.
2. **Create the worktree**: `git worktree add -b <sweep-branch> .gobbi/projects/gobbi/worktrees/<sweep-branch>/ develop`.
3. **Install deps if any** (no-op — no `package.json` post-Workstream-B).
4. **Delegate Task 02** with absolute worktree path + `<sweep-branch>` name + issue number + Fix 1 + Fix 2 scope boundary explicit in delegation prompt ("executor stops after Stage E.2; do NOT push, do NOT create PR, do NOT merge, do NOT remove worktrees, do NOT delete branches; D+E.1 share commit 3, NO `git commit --amend`").

### Post-Task-02 (manager-direct, after Task 02 returns DONE)

5a. **Stage F.1 — Worktree removal** (NEW iter2 — Cleanup row; iter3 Fix 2 — `git status` precheck per `git/SKILL.md` Procedure P5 step 3): **precheck each worktree before removal** — `cd .gobbi/projects/gobbi/worktrees/redesign-v050-ideation && git status --porcelain` and `cd .gobbi/projects/gobbi/worktrees/refactor/257-skills-agents-rules && git status --porcelain`; on non-empty output → manager emits NEEDS_CONTEXT to the user (MUST NOT auto-`--force` — Forbidden Operation per `git/SKILL.md`); only after BOTH prechecks return empty (or the user has explicitly authorized acceptance via a NEEDS_CONTEXT round-trip) does the manager run `git worktree remove .gobbi/projects/gobbi/worktrees/redesign-v050-ideation` (NO `--force`); same for `refactor/257-skills-agents-rules`; then `git worktree prune`; then `find .gobbi/projects/gobbi/worktrees/ -mindepth 1 -type d -empty -delete`. Canonical detail at `draft-iter3.md:344-358`.
5b. **Stage F.2 — Local branch deletion** (NEW iter2): `git branch -d fix/257-complete-mirror-sync`; `git branch -d refactor/257-skills-agents-rules`; `git branch -D pr-fin-2-decisions-hold` (Q-G); `git branch -D redesign/v050-ideation` (Q-G).
6. `cd <worktree-absolute-path> && git push -u origin <sweep-branch>`
7. `gh pr create --base develop --head <sweep-branch> --title "..." --body "..."` (body cites 19 locks + 3 pre-routed resolutions + 5 D-PLAN locks + pre-reset tag + iter2 REVISE)
8. `gh pr checks <pr-num> --watch` — **timeout caveat (F-CL-PF-01 cleanup iter2)**: if CI runs longer than the manager's session-level patience window, manager emits NEEDS_CONTEXT ("CI still running after <duration>; investigate or wait?"). No silent retry.
9. `HEAD_SHA=$(gh pr view <pr-num> --json headRefOid -q .headRefOid)` → `gh pr merge <pr-num> --squash --delete-branch --match-head-commit "$HEAD_SHA"`. Non-zero exit → NEEDS_CONTEXT (no retry, no rationalization).
10. `cd <main-tree> && git checkout develop && git pull --ff-only`
11. `git worktree remove .gobbi/projects/gobbi/worktrees/<sweep-branch>` (NO `--force`) → `git worktree prune` → `find .gobbi/projects/gobbi/worktrees/ -mindepth 1 -type d -empty -delete`
12. `gh issue close <issue-num> -c "Closed by PR #<pr-num>"` (manual close — `develop` is non-default)
13. **Post-merge Success Criteria verification**: confirm #2 (`git log --oneline -2 develop` shape), #5 (literal Scope Contract regex post-merge), #6 (`git worktree list | wc -l` → 1), #9-origin (already verified at §1b), #14 (§9 exit 0). Re-run #1, #3, #4, #7, #8, #10-13 from main tree post-checkout.

## Cross-references

- Rawdata draft with full task YAML + self-review report + Decisions Log: `sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/planning/rawdata/draft-iter3.md`
- iter1 restore point (pre-REVISE snapshot, audit trail): `sessions/.../planning/rawdata/restore/iter1-pre-revise.md`
- iter1 evaluator findings: `sessions/.../planning/evaluation/iter1/{claude,codex}/*.md`
- Implementation Checklist (Stages 0-G): `sessions/.../ideation/artifacts/implementation-checklist.md` (lines 104 + 114 logically superseded per D-PLAN-03 / Fix 3)
- Pre-routed Planning gaps: `sessions/.../preparation/artifacts/pre-routed-gaps.md`
- Preparation handoff: `sessions/.../preparation/artifacts/handoff.md`
- F-CX-O4-01 deferred decision: `sessions/.../ideation/staging/decisions/gh-delete-branch-local-cleanup-wording.md`
