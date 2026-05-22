# Codex Planning Evaluation iter3 — Consistency Perspective

## Stage 0 Artifact Summary

Artifact: iter3 rawdata draft plus staged plan. What: synchronized planning artifacts for Execution. Why: remove iter2 contradictions. How: text edits in rawdata and `main.md`, with decisions stamped as D-PLAN-08 through D-PLAN-11.

Memory reads: Scope Contract, Implementation Checklist, iter2 overall reports, draft iter2, draft iter3, staged main, git skill excerpts, evaluation/planning skill docs, and grep/diff/hash checks.

## Stage 1 Locked Frame

Scenario C1: Tag form is consistent across all current command sites.
- Check: command sites use `git tag pre-reset-2026-05-21 487fc35`.
- Check: `pre-reset-2026-05-21` and `487fc35` remain stable.
- Check: remaining `git tag -a` text is historical-only.

Scenario C2: Manager §5a is consistent between rawdata and staged plan.
- Check: both documents include both worktree prechecks.
- Check: both documents include NEEDS_CONTEXT and no `--force` semantics.

Scenario C3: Iteration pointers are current.
- Check: `main.md` points to `draft-iter3.md` as the full command/rawdata source.
- Check: iter3 D-PLAN-08/-09/-10/-11 are stamped.

Scenario C4 (adversarial): A stale cross-reference resurrects a resolved iter2 blocker.
- Check: no current staged plan instruction tells a reader to use `draft-iter2.md` for current command execution.

Coverage matrix: privacy/licensing not-applicable; docs-sync is primary.

## Stage 2 Findings

### F-CX-PLAN-O3-C-01

- **Title:** `main.md` is not synchronized with iter3 rawdata for manager §5a and rawdata pointers
- **Type:** `design_flaw`
- **Domain:** `docs-sync`
- **Disposition:** `open`
- **Confidence:** `100`
- **Severity:** `High`
- **Evidence:** `draft-iter3.md:347-358` contains the required two-worktree status precheck and removal sequence. `main.md:141` still lists direct `git worktree remove` commands with no precheck. `main.md:126` points the manager to `draft-iter2.md` for the "full command sequence"; `main.md:154` identifies `draft-iter2.md` as the rawdata draft. The current artifact is `draft-iter3.md`.
- **FP-check:** Not a harmless historical reference: `main.md:126` is in "Manager actions before/around/after Execution Loop entry" and instructs where to get the full command sequence. Not out-of-scope: `main.md` is a named target in the user brief.
- **Why it matters:** Iter3's rawdata fix and staged plan can lead to different manager behavior. The stale pointer can reintroduce iter2's known defects at execution time.
- **Suggested direction:** Update current-action references and §5a detail in `main.md` to match `draft-iter3.md`.

### Stage 2 Step 3 — Iter2 Finding Disposition

| Iter2 finding | Disposition | Evidence |
|---|---|---|
| F-CL2-P-01 / F-CL2-A-02 / F-CL2-C-01 / F-CL2-R-03 | addressed | Current command sites are lightweight; `git tag -a pre-reset...` only appears as historical defect prose. |
| F-CL2-P-02 / F-CL2-R-01 | open | Rawdata fixed, staged plan still stale; see F-CX-PLAN-O3-C-01. |
| F-CX-PLAN-O2-01 | addressed | `draft-iter3.md:462`; grep evidence. |
| F-CX-PLAN-O2-02 | addressed | `main.md:98`. |
| F-CL2-P-03 | deferred | `draft-iter3.md:825`. |
| F-CL2-R-02 | deferred | `draft-iter3.md:826`. |
| F-CL2-S-01 | deferred | `draft-iter3.md:827`. |
| F-CL2-S-02 | deferred | `draft-iter3.md:828`. |
| F-CL2-U-01 | deferred | `draft-iter3.md:829`. |
| F-CL2-U-02 | deferred | `draft-iter3.md:830`. |

## Per-Perspective Verdict

**REVISE.** F-CX-PLAN-O3-C-01 is High/100.

## Must-Preserve List

- Preserve D-PLAN-08 through D-PLAN-11 in `draft-iter3.md:713-740`.
- Preserve corrected tag command across current command sites.
- Preserve the `main.md:98` mistake-load correction.
