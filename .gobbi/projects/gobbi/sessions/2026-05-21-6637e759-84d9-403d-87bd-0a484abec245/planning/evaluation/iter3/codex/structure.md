# Codex Planning Evaluation iter3 — Structure Perspective

## Stage 0 Artifact Summary

Artifact: `planning/rawdata/draft-iter3.md` and `planning/staging/plans/main.md`. What: final Planning decomposition for a destructive repo reset. Why: close iter2 REVISE findings while preserving the already-reviewed two-task structure. How: keep Task 01 as a local ref operation, Task 02 as one executor sweep through Stage E.2, and manager-direct operations for issue/tag push/worktrees/PR/merge/cleanup.

Memory reads: evaluation schema and planning child doc, project rule, project mistakes count, Scope Contract, Implementation Checklist, iter2 Claude/Codex overall reports, staged main, draft iter2, draft iter3, git skill snippets, and `gh pr merge --help`.

## Stage 1 Locked Frame

Scenario S1: Task decomposition remains executable.
- Check: Task 01 has no file overlap with Task 02.
- Check: Task 02 stops at Stage E.2 and preserves exactly 3 commits.
- Check: manager operations are not represented as executor tasks.

Scenario S2: Dependency order is explicit.
- Check: Task 01 precedes manager tag push.
- Check: manager tag push and worktree create precede Task 02.
- Check: Stage F/G manager operations occur after Task 02 DONE.

Scenario S3 (adversarial): The four textual fixes create a second command source that diverges from rawdata.
- Check: staged `main.md` detailed manager actions match the fixed rawdata sequence.
- Check: links to "full command sequence" point at iter3, not iter2.

Coverage matrix: supply-chain and observability not-applicable beyond preserving existing verification ordering; no new dependencies or runtime instrumentation are introduced.

## Stage 2 Findings

### F-CX-PLAN-O3-S-01

- **Title:** Staged plan's manager-action structure still omits the new §5a precheck
- **Type:** `design_flaw`
- **Domain:** `docs-sync`
- **Disposition:** `open`
- **Confidence:** `100`
- **Severity:** `Medium`
- **Evidence:** `draft-iter3.md:345-358` structurally splits §5a into precheck then removal. `main.md:141` compresses §5a directly to `git worktree remove ...` for both stale worktrees, with no `git status --porcelain` precheck.
- **FP-check:** Not out-of-scope: `main.md` is explicitly the iter3 staged plan. Not style: it changes the sequence visible in the concise plan.
- **Why it matters:** A manager using the staged plan as the operational outline sees the old step shape, even though the raw draft has the safer structure.
- **Suggested direction:** Mirror the rawdata §5a precheck/removal structure in `main.md` or make `main.md` point only to `draft-iter3.md` for the command sequence.

### Stage 2 Step 3 — Iter2 Finding Disposition

| Iter2 finding | Disposition | Evidence |
|---|---|---|
| F-CL2-P-01 / F-CL2-A-02 / F-CL2-C-01 / F-CL2-R-03 | addressed | Lightweight command at `draft-iter3.md:462`; no imperative `git tag -a` remains. |
| F-CL2-P-02 / F-CL2-R-01 | addressed in raw draft; residual staged-plan sync gap remains | Raw fix at `draft-iter3.md:347-358`; staged omission at `main.md:141`. |
| F-CX-PLAN-O2-01 | addressed | `draft-iter3.md:462`, grep evidence. |
| F-CX-PLAN-O2-02 | addressed | `main.md:98`. |
| F-CL2-P-03 | deferred | `draft-iter3.md:825`. |
| F-CL2-R-02 | deferred | `draft-iter3.md:826`. |
| F-CL2-S-01 | deferred | `draft-iter3.md:827`. |
| F-CL2-S-02 | deferred | `draft-iter3.md:828`. |
| F-CL2-U-01 | deferred | `draft-iter3.md:829`. |
| F-CL2-U-02 | deferred | `draft-iter3.md:830`. |

## Per-Perspective Verdict

**PASS.** The structural sync issue is real but Medium; no High/50 or Critical/75 Structure finding is present.

## Must-Preserve List

- Preserve one executor lane and the explicit manager interleaves.
- Preserve "exactly 3 commits" for Task 02.
- Preserve the Stage E.2 terminal post-commit gate.
