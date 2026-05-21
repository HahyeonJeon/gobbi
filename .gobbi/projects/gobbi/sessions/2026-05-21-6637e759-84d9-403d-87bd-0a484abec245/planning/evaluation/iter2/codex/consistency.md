# Codex Planning Evaluation iter2 — Consistency Perspective

## Stage 0 Artifact Summary

Most iter2 naming and ownership is consistent: D-PLAN-06 and D-PLAN-07 are present in both rawdata and staged plan, `487fc35` is consistently the develop tip, and Stage F is consistently manager-owned. The main inconsistency is the tag type/command.

## Stage 1 Locked Frame

Consistency perspective checks whether names, paths, operation types, stage ownership, and cross-document locks agree. Verdict rule: Critical >= 75 means FAIL; High >= 50 means REVISE; otherwise PASS.

## Stage 2 Findings

### F-CX-PLAN-C2-01

- **Title:** `pre-reset-2026-05-21` is inconsistently typed as lightweight and annotated
- **Category:** type_name_drift
- **Severity:** High / 80
- **Confidence:** High / 90
- **Evidence:** Count check found 26 `pre-reset-2026-05-21` mentions and 15 `487fc35` mentions in `draft-iter2.md`. The `487fc35` target is consistent, but tag type is not: `draft-iter2.md:54` says annotated, `draft-iter2.md:151-155` says lightweight/no `-a`, and `draft-iter2.md:448` uses `git tag -a`.
- **Impact:** The self-review type/name table at `draft-iter2.md:523-524` misses a real type drift on the tag operation.
- **Recommendation:** Normalize all mentions to lightweight tag, no `-a`; then rerun the count and grep checks.
- **Verification:** `rg -n "pre-reset-2026-05-21|487fc35|annotated|tag -a" planning/rawdata/draft-iter2.md`.

### F-CX-PLAN-C2-02

- **Title:** `main.md` carries an impossible mistake-load timing sentence
- **Category:** cross_artifact_drift
- **Severity:** Low / 65
- **Confidence:** High / 85
- **Evidence:** `main.md:87` says Task 02 mistakes load before Stage 0/Task 01 launches; the dependency graph at `main.md:57-63` and raw draft at `draft-iter2.md:300-310` put Task 02 after Task 01 and manager tag push.
- **Impact:** Low operational risk, but it weakens iter2's self-review accuracy fix because the staged plan preserves a version of the iter1 timing overclaim.
- **Recommendation:** Reword to "before Task 02 Stage A begins and before Stage C wipes mistakes."
- **Verification:** `rg -n "before Stage 0|Stage A begins|mistakes load" planning/staging/plans/main.md planning/rawdata/draft-iter2.md`.

## Stage 2 Step 3 — Iter1 Finding Disposition

| Finding | Disposition | Verification |
|---|---|---|
| F-CL-P-01 | addressed | Role boundary now consistently manager-owned. |
| F-CL-P-02 | addressed | Added trace anchors. |
| F-CL-S-01 | addressed | D-PLAN-06 consistent across raw/main. |
| F-CL-S-02 | addressed | Success #5 ownership consistent. |
| F-CL-S-03 | deferred | E.2 trace annotation remains. |
| F-CL-PF-01 | addressed | CI caveat consistent in raw/main. |
| F-CL-A-01 | addressed | Entry schema now consistent enough. |
| F-CL-A-02 | superseded | main/raw role clarified by iter2 cross-references. |
| F-CL-U-01 | addressed | Inputs include carriers. |
| F-CL-U-02 | addressed | `delete-contents` + `create` pairs consistent. |
| F-CL-U-03 | addressed | Exact 3-commit invariant consistent. |
| F-CL-C-01 | deferred | Low trace wording remains. |
| F-CL-C-02 | addressed | Stage G manager mapping exists. |
| F-CL-C-03 | addressed | D-PLAN-03 supersession flag exists. |
| F-CL-C-04 | addressed | Grep self-description corrected. |
| F-CL-R-01 | addressed | Rollback caveat consistent. |
| F-CL-R-02 | deferred | E.2 diff not added. |
| F-CL-R-03 | addressed | Cleanup command unchanged and acceptable. |
| F-CL-R-04 | addressed | NEEDS_CONTEXT semantics consistent. |
| F-CX-PLAN-O-01 | addressed | Role-boundary leak fixed. |
| F-CX-PLAN-O-02 | addressed | Commit-count fixed. |
| F-CX-PLAN-O-03 | addressed with residual drift | Stage A matrix fixed; `main.md:87` is residual drift. |

## Per-Perspective Verdict

**REVISE.** The tag type/command drift is high-impact consistency drift.

## Must-Preserve List

- Preserve `pre-reset-2026-05-21` as the single tag name and `487fc35` as the target.
- Preserve D-PLAN-06 and D-PLAN-07 in Decisions Locked and Decisions Log.
- Preserve the Plan-level supersession notice instead of editing the final Ideation artifact.
