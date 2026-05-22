# Codex Planning Evaluation iter3 — Risk Perspective

## Stage 0 Artifact Summary

Artifact: `draft-iter3.md` and `main.md`. What: risk-sensitive destructive repo reset plan. Why: final Planning iter must be safe enough for Execution. How: manager owns all dangerous git operations; executor scope is bounded to local tag and cleanup sweep through E.2.

Memory reads: git skill Forbidden Operations and Procedure P5, Scope Contract, Implementation Checklist, iter2 evaluator findings, raw/staged plans, and `gh pr merge --help`.

## Stage 1 Locked Frame

Scenario R1: No headless `$EDITOR` tag hang remains.
- Check: executable tag command is lightweight.
- Check: `git tag -a` appears only in historical prose.

Scenario R2: Worktree removal is guarded.
- Check: both stale worktrees get status prechecks.
- Check: non-empty output escalates to NEEDS_CONTEXT.
- Check: no automatic `--force`.

Scenario R3: Atomic merge guard remains supported.
- Check: `gh pr merge --help` includes `--match-head-commit`.

Scenario R4 (adversarial): A stale summary causes destructive cleanup to run without the new guard.
- Check: staged plan cannot be followed in a way that skips the rawdata precheck.

Coverage matrix: privacy and supply-chain not-applicable; rollback and destructive-operation risk are primary.

## Stage 2 Findings

### F-CX-PLAN-O3-R-01

- **Title:** Staged manager actions still expose unguarded worktree removal
- **Type:** `assumption_risk`
- **Domain:** `process`
- **Disposition:** `open`
- **Confidence:** `100`
- **Severity:** `High`
- **Evidence:** `draft-iter3.md:347-358` adds the required `git status --porcelain` prechecks and says no auto-`--force`. `main.md:141` still lists immediate `git worktree remove ...` for the two stale worktrees; `main.md:126` sends the reader to `draft-iter2.md` for the full manager command sequence. Git skill confirms `git worktree remove --force` is forbidden and requires status inspection first (`.claude/skills/git/SKILL.md:121`, `:198`, `:236`).
- **FP-check:** Not speculative: exact current staged text omits the guard. Not a duplicate-only issue: Risk weighs the consequence of following the stale staged plan.
- **Why it matters:** The planned operation removes worktrees that may contain uncommitted work. The rawdata guard is correct, but the staged operational summary still allows the pre-iter3 unsafe path.
- **Suggested direction:** Make `main.md` carry or unambiguously link to the iter3 §5a guard before Execution.

### Stage 2 Step 3 — Iter2 Finding Disposition

| Iter2 finding | Disposition | Evidence |
|---|---|---|
| F-CL2-P-01 / F-CL2-A-02 / F-CL2-C-01 / F-CL2-R-03 | addressed | No current imperative annotated tag command remains; only historical `draft-iter3.md:719`. |
| F-CL2-P-02 / F-CL2-R-01 | open | Rawdata guard exists, but staged operational path remains unsafe; see F-CX-PLAN-O3-R-01. |
| F-CX-PLAN-O2-01 | addressed | Lightweight Task 01 command at `draft-iter3.md:462`. |
| F-CX-PLAN-O2-02 | addressed | `main.md:98`. |
| F-CL2-P-03 | deferred | Low/60; `draft-iter3.md:825`. |
| F-CL2-R-02 | deferred | Medium/70; `draft-iter3.md:826`. |
| F-CL2-S-01 | deferred | Low/65; `draft-iter3.md:827`. |
| F-CL2-S-02 | deferred | Low/70; `draft-iter3.md:828`. |
| F-CL2-U-01 | deferred | Low/60; `draft-iter3.md:829`. |
| F-CL2-U-02 | deferred | Low/50; `draft-iter3.md:830`. |

## Per-Perspective Verdict

**REVISE.** F-CX-PLAN-O3-R-01 is High/100.

## Must-Preserve List

- Preserve no `--force` on worktree removal.
- Preserve Q-G-authorized `git branch -D` distinction for branches only.
- Preserve `--match-head-commit` atomic merge guard; `gh pr merge --help` confirms support.
