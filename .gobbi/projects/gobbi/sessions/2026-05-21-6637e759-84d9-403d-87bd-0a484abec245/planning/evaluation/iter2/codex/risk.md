# Codex Planning Evaluation iter2 — Risk Perspective

## Stage 0 Artifact Summary

Iter2 reduces the major role-boundary risk by moving cleanup and remote operations to the manager. The plan also explicitly documents that rollback coverage is tag + reflog only. No `git worktree remove --force` appears in Stage F or post-merge cleanup.

## Stage 1 Locked Frame

Risk perspective checks destructive operations, irreversible state loss, credential-sensitive steps, and whether gates fail closed. Verdict rule: Critical >= 75 means FAIL; High >= 50 means REVISE; otherwise PASS.

## Stage 2 Findings

### F-CX-PLAN-R2-01

- **Title:** Annotated-tag contradiction can push the wrong rollback ref if verification is bypassed
- **Category:** rollback_anchor_risk
- **Severity:** Medium / 65
- **Confidence:** High / 85
- **Evidence:** `draft-iter2.md:448` says `git tag -a pre-reset-2026-05-21 487fc35`, while the verifier expects `git rev-parse pre-reset-2026-05-21 == 487fc35` at `draft-iter2.md:163`. Manager §1b then pushes `pre-reset-2026-05-21` to origin (`draft-iter2.md:324-328`).
- **Impact:** The verifier should catch this, so it is not FAIL-grade. But the rollback anchor is the safety net for the destructive sweep; conflicting construction instructions are unacceptable in the rollback path.
- **Recommendation:** Normalize to lightweight tag and require Task 01 to report the exact `git rev-parse` output before manager §1b.
- **Verification:** `rg -n "tag -a|git rev-parse pre-reset|git push origin pre-reset" planning/rawdata/draft-iter2.md`.

### F-CX-PLAN-R2-02

- **Title:** Manager worktree removal is no-force but lacks point-of-removal status checks for stale worktrees
- **Category:** cleanup_safety
- **Severity:** Low / 55
- **Confidence:** Medium / 70
- **Evidence:** Stage F manager §5a uses plain `git worktree remove` with `# NO --force` (`draft-iter2.md:341-347`), satisfying the forbidden-operation concern. `git/SKILL.md` P5 also says to run `git status` inside a worktree before removal; the plan relies on earlier Stage A pre-flight rather than repeating this immediately before §5a.
- **Impact:** Plain `git worktree remove` fails if unclean, so the practical risk is low. A point-of-use status check would make the cleanup gate match the skill exactly.
- **Recommendation:** Add `git -C <stale-worktree> status --short` empty checks immediately before the two §5a removes.
- **Verification:** `rg -n "git -C .*status|worktree remove|NO --force" planning/rawdata/draft-iter2.md`.

## Stage 2 Step 3 — Iter1 Finding Disposition

| Finding | Disposition | Verification |
|---|---|---|
| F-CL-P-01 | addressed | Cleanup manager-owned. |
| F-CL-P-02 | addressed | Required traces added. |
| F-CL-S-01 | addressed | Commit boundary fixed. |
| F-CL-S-02 | addressed | Success #5 owner fixed. |
| F-CL-S-03 | deferred | Low wording. |
| F-CL-PF-01 | addressed | Watch timeout caveat added. |
| F-CL-A-01 | addressed | Files schema cleaner. |
| F-CL-A-02 | superseded | main/raw split intentional. |
| F-CL-U-01 | addressed | Input semantics added. |
| F-CL-U-02 | addressed | Stage C op split. |
| F-CL-U-03 | addressed | Exact 3 commits. |
| F-CL-C-01 | deferred | Low wording. |
| F-CL-C-02 | addressed | Stage G manager mapping. |
| F-CL-C-03 | addressed | Supersession logged. |
| F-CL-C-04 | addressed | Grep rationale corrected. |
| F-CL-R-01 | addressed | Rollback coverage explicitly tag + reflog only. |
| F-CL-R-02 | deferred | E.2 content-equivalence diff still absent. |
| F-CL-R-03 | addressed | Empty-dir delete remains constrained. |
| F-CL-R-04 | addressed | Recovery via NEEDS_CONTEXT/re-contract documented. |
| F-CX-PLAN-O-01 | addressed | Manager owns push/cleanup. |
| F-CX-PLAN-O-02 | addressed | False Stage F commit risk removed. |
| F-CX-PLAN-O-03 | addressed with residual drift | Matrix fixed; staged mistake-load sentence remains. |

## Per-Perspective Verdict

**PASS.** Risk posture is acceptable after the role-boundary fix; the tag contradiction is serious but guarded by Task 01 verification and is carried as a revise-level issue in Project/Structure/Usage/Consistency.

## Must-Preserve List

- Preserve no `git worktree remove --force`.
- Preserve rollback caveat: pre-reset tag covers develop tip only; deleted branch tips depend on reflog.
- Preserve atomic merge with `--match-head-commit "$HEAD_SHA"`.
- Preserve manager NEEDS_CONTEXT on merge/CI divergence.
