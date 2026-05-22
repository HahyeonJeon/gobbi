# Codex Planning Evaluation iter2 — Structure Perspective

## Stage 0 Artifact Summary

Iter2 restructures the execution DAG to `Task 01 local tag -> Manager tag push/worktree create -> Task 02 Stages A-E.2 -> Manager Stage F/G`. The main structural correction is D-PLAN-06: Stage D and Stage E.1 are staged before one commit, producing exactly three sweep commits.

## Stage 1 Locked Frame

Structure perspective checks ordering, ownership boundaries, task graph consistency, and whether verification gates match the graph. Verdict rule: Critical >= 75 means FAIL; High >= 50 means REVISE; otherwise PASS.

## Stage 2 Findings

### F-CX-PLAN-S2-01

- **Title:** Task 01 has two incompatible tag-construction structures
- **Category:** structural_contradiction
- **Severity:** High / 80
- **Confidence:** High / 90
- **Evidence:** `draft-iter2.md:151-155` defines Task 01 as a lightweight tag created with `git tag pre-reset-2026-05-21 487fc35`. `draft-iter2.md:448` gives the executor a different terminal action: `git tag -a pre-reset-2026-05-21 487fc35`. `draft-iter2.md:54` also calls it annotated.
- **Impact:** The task has one verifier but two possible constructors. The annotated constructor is not equivalent to the lightweight constructor and can invalidate the verifier.
- **Recommendation:** Make the Task 01 File map, YAML, and Agent assignment use exactly one command: `git tag pre-reset-2026-05-21 487fc35`.
- **Verification:** `rg -n "annotated|tag -a|git tag pre-reset" planning/rawdata/draft-iter2.md`.

### F-CX-PLAN-S2-02

- **Title:** The staged plan still says Task 02 mistakes load before Stage 0 launches
- **Category:** documentation_drift
- **Severity:** Low / 60
- **Confidence:** High / 85
- **Evidence:** `main.md:87` says "Project mistakes load ONCE at task start, before Stage 0 (Task 01) launches." The iter2 graph has Task 01 before Task 02; the raw draft correctly says Task 02 loads mistakes at task start before Stage A (`draft-iter2.md:306-310`, `draft-iter2.md:607`).
- **Impact:** This does not break execution because the raw Task 02 discipline is correct, but the staged handoff preserves one of the iter1 self-review timing overstatements.
- **Recommendation:** Change `main.md:87` to "before Stage A begins / before Stage C wipes mistakes".
- **Verification:** `rg -n "before Stage 0|before Stage A|mistakes load" planning/staging/plans/main.md planning/rawdata/draft-iter2.md`.

## Stage 2 Step 3 — Iter1 Finding Disposition

| Finding | Disposition | Verification |
|---|---|---|
| F-CL-P-01 | addressed | Stage F is manager §5a/§5b; Task 02 forbids worktree-remove/branch-delete. |
| F-CL-P-02 | addressed | Task 02 `traces-to` now names F-CX-PREP-O-02 and Q-Gate-Redesign. |
| F-CL-S-01 | addressed | D-PLAN-06 locks D+E.1 to the same third commit; no amend. |
| F-CL-S-02 | addressed | Success #5 is manager post-merge; executor has only `#5-pre`. |
| F-CL-S-03 | deferred | E.2 trace still includes plan annotation; low-only wording issue. |
| F-CL-PF-01 | addressed | Manager §8 documents `gh pr checks --watch` timeout escalation. |
| F-CL-A-01 | addressed | Entry-level inline comments were removed; section comments remain. |
| F-CL-A-02 | superseded | `main.md` intentionally points to rawdata for full command schedule. |
| F-CL-U-01 | addressed | Task 02 inputs now include verify-by / manager-fill semantics. |
| F-CL-U-02 | addressed | Stage C uses `delete-contents` + `create` pairs. |
| F-CL-U-03 | addressed | Commit count is EXACTLY 3 with D+E.1 in same commit. |
| F-CL-C-01 | deferred | Same low E.2 trace annotation as F-CL-S-03. |
| F-CL-C-02 | addressed | Stage G is mapped to manager operations. |
| F-CL-C-03 | addressed | D-PLAN-03 explicitly supersedes checklist lines 104 and 114. |
| F-CL-C-04 | addressed | Grep rationale now describes empty-output assertion, not `grep -c`. |
| F-CL-R-01 | addressed | Rollback limit is documented. |
| F-CL-R-02 | deferred | No content-equivalence diff added before E.2 FS delete. |
| F-CL-R-03 | addressed | Empty-dir cleanup remains scoped. |
| F-CL-R-04 | addressed | Manager NEEDS_CONTEXT recovery is documented. |
| F-CX-PLAN-O-01 | addressed | Tag push and Stage F are manager-owned. |
| F-CX-PLAN-O-02 | addressed | Task 02 expects exactly 3 commits. |
| F-CX-PLAN-O-03 | addressed with residual drift | Stage A branch-open split fixed; `main.md:87` still needs wording cleanup. |

## Per-Perspective Verdict

**REVISE.** The Stage F and commit-count structures are fixed, but Task 01's tag command structure is internally contradictory.

## Must-Preserve List

- Preserve the sequential manager/executor dependency graph in `main.md`.
- Preserve the EXACTLY 3 commit invariant.
- Preserve Stage E.2 as terminal post-commit FS deletion, not a commit.
- Preserve manager-only Stage F and Stage G ownership.
