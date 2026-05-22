# Codex Planning Evaluation iter2 — Usage Perspective

## Stage 0 Artifact Summary

The executor-facing usage story is much better in iter2: Task 01 stops before push, Task 02 stops after E.2, and manager-only actions are explicit. The main usability defect is that Task 01 gives the executor two different tag commands.

## Stage 1 Locked Frame

Usage perspective checks whether a fresh executor or manager can follow the artifact without guessing or hitting avoidable NEEDS_CONTEXT. Verdict rule: Critical >= 75 means FAIL; High >= 50 means REVISE; otherwise PASS.

## Stage 2 Findings

### F-CX-PLAN-U2-01

- **Title:** Fresh Task 01 executor can choose the wrong tag command from the same artifact
- **Category:** executor_usability
- **Severity:** High / 85
- **Confidence:** High / 90
- **Evidence:** The checklist and Task 01 `traces-to` specify `git tag pre-reset-2026-05-21 487fc35` with no `-a` (`implementation-checklist.md:19`, `draft-iter2.md:154`). The Task 01 assignment row later says `git tag -a pre-reset-2026-05-21 487fc35` (`draft-iter2.md:448`).
- **Impact:** The executor has to infer which command wins. If it follows the more local "Special discipline" row, the command is interactive/incomplete and the verification target is wrong for an annotated tag.
- **Recommendation:** Remove the `-a` command and add a "no annotated tag" sentence to Task 01's Special discipline row.
- **Verification:** `rg -n "tag -a|no -a|git rev-parse pre-reset" planning/rawdata/draft-iter2.md`.

## Stage 2 Step 3 — Iter1 Finding Disposition

| Finding | Disposition | Verification |
|---|---|---|
| F-CL-P-01 | addressed | Executor is explicitly barred from Stage F. |
| F-CL-P-02 | addressed | Missing binding anchors are visible in Task 02. |
| F-CL-S-01 | addressed | D+E.1 command order is explicit. |
| F-CL-S-02 | addressed | `#5-pre` is distinguished from final Success #5. |
| F-CL-S-03 | deferred | Low trace wording remains. |
| F-CL-PF-01 | addressed | CI wait caveat added. |
| F-CL-A-01 | addressed | Files schema is easier to scan. |
| F-CL-A-02 | superseded | Main/raw split is an intentional handoff pattern. |
| F-CL-U-01 | addressed | Task 02 input carrier semantics are explicit. |
| F-CL-U-02 | addressed | Stage C op semantics are split. |
| F-CL-U-03 | addressed | Executor sees exactly 3 commits and no amend. |
| F-CL-C-01 | deferred | Low trace wording remains. |
| F-CL-C-02 | addressed | Stage G bullets have manager mapping. |
| F-CL-C-03 | addressed | Checklist drift is flagged in D-PLAN-03. |
| F-CL-C-04 | addressed | Grep explanation corrected. |
| F-CL-R-01 | addressed | Reflog-only rollback caveat added. |
| F-CL-R-02 | deferred | No diff check added; executor still has E.2 NEEDS_CONTEXT. |
| F-CL-R-03 | addressed | Empty cleanup remains fine. |
| F-CL-R-04 | addressed | Manager re-contracts on non-zero merge. |
| F-CX-PLAN-O-01 | addressed | Executor no longer pushes/cleans. |
| F-CX-PLAN-O-02 | addressed | Executor no longer chases a Stage F commit. |
| F-CX-PLAN-O-03 | addressed with residual drift | Stage A split fixed; staged mistake-load wording remains off. |

## Per-Perspective Verdict

**REVISE.** The plan is otherwise handoff-ready, but Task 01's conflicting tag command would make a fresh executor stop or ask.

## Must-Preserve List

- Preserve the explicit "NO PUSH" Task 01 boundary.
- Preserve Task 02's "NO push/PR/merge/worktree-remove/branch-delete" discipline.
- Preserve manager-fill semantics for `<sweep-branch>` and worktree path.
