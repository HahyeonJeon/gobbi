# Codex Planning Evaluation iter2 — Project Perspective

## Stage 0 Artifact Summary

Reviewed `planning/rawdata/draft-iter2.md`, `planning/staging/plans/main.md`, iter1 Codex/Claude evaluations, and `ideation/artifacts/implementation-checklist.md`. The four surgical fixes are mostly present: tag push is manager-owned, Stage F moved to manager post-Task-02, D+E.1 are locked to one commit, and D-PLAN-03 flags the M-2 checklist supersession without editing Ideation.

## Stage 1 Locked Frame

Project perspective checks whether the plan preserves the user-locked repo-reset contract, the git-skill role boundary, and the Q-F tag invariant. Verdict rule: Critical >= 75 means FAIL; High >= 50 means REVISE; otherwise PASS.

## Stage 2 Findings

### F-CX-PLAN-P2-01

- **Title:** Task 01 reintroduces an annotated-tag instruction that violates the locked lightweight-tag contract
- **Category:** contract_drift
- **Severity:** High / 85
- **Confidence:** High / 90
- **Evidence:** The Implementation Checklist requires `git tag pre-reset-2026-05-21 487fc35` as a lightweight tag with "no -a flag" (`implementation-checklist.md:19`). Iter2's Task 01 YAML repeats that at `draft-iter2.md:151-155`, but the File map says "create local annotated tag" at `draft-iter2.md:54`, and the Task 01 agent assignment tells the executor to stop at `git tag -a pre-reset-2026-05-21 487fc35` at `draft-iter2.md:448`.
- **Impact:** A fresh executor can follow the later "Special discipline" row and create an annotated tag, which either opens an editor due missing `-m` or makes `git rev-parse pre-reset-2026-05-21 == 487fc35` fail because annotated tags resolve to the tag object unless peeled. This blocks Task 01 before any destructive sweep, but it means iter2 is not executable as written.
- **Recommendation:** Replace `annotated tag` with `lightweight tag` and replace `git tag -a pre-reset-2026-05-21 487fc35` with `git tag pre-reset-2026-05-21 487fc35`. Add a grep gate for `tag -a pre-reset-2026-05-21|annotated tag`.
- **Verification:** `rg -n "annotated|tag -a|lightweight|git tag pre-reset" draft-iter2.md main.md implementation-checklist.md`.

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
| F-CL-R-01 | addressed | Rollback limit is documented: tag covers develop tip only; branch tips via reflog. |
| F-CL-R-02 | deferred | No content-equivalence diff added before E.2 FS delete; accepted as non-blocking. |
| F-CL-R-03 | addressed | Empty-dir cleanup remains scoped to post-worktree-removal. |
| F-CL-R-04 | addressed | Manager NEEDS_CONTEXT/no-rationalization recovery is documented. |
| F-CX-PLAN-O-01 | addressed | Tag push and Stage F are manager-owned. |
| F-CX-PLAN-O-02 | addressed | Stage F no longer contributes to commit count; Task 02 expects exactly 3 commits. |
| F-CX-PLAN-O-03 | addressed with residual drift | Stage A branch-open split is fixed in draft; `main.md:87` still misstates mistake-load timing. |

## Per-Perspective Verdict

**REVISE.** The role-boundary fix holds, but the raw draft now contradicts the lightweight tag lock in executor-facing instructions.

## Must-Preserve List

- Preserve Manager ownership for tag push, worktree removal, branch cleanup, push, PR, merge, and post-merge cleanup.
- Preserve D-PLAN-06: D+E.1 in the same third commit, EXACTLY 3 sweep commits.
- Preserve D-PLAN-03's Plan-level supersession of checklist lines 104 and 114.
- Preserve the E.2 gate using `git log` + `git ls-tree`, not session.json SHA checks.
