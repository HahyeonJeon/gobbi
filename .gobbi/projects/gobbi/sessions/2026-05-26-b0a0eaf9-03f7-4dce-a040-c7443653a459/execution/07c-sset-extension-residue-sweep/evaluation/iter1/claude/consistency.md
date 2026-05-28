# Consistency Perspective — T7c (commit 5630aa4)

**Evaluator:** Claude (adversarial).

## Standard-vs-data consistency
- §4.4 residue table claims task/loop/scenario/iter/slug are spelling-identical and finding-source has both spellings; §4.5 regex matches: `task|loop|scenario|iter|slug|finding[-_]source`. Table and regex agree. **PASS**
- §4.4 KEEP list (related/supersedes/superseded_by/source/design-id/domain/priority/ref_type) — none of these appear among the 39 deletions. Standard and sweep agree. **PASS**

## Findings

### F1 — Sibling session-routing keys left in S-set definition and in conformed docs
- **Type:** design_flaw
- **Domain:** docs-sync (consistency)
- **Disposition:** open
- **Severity:** Medium
- **Confidence:** 75
- **Evidence:** The 4 conformed features still carry, after this commit, 26 instances of the same *category* of key that were NOT added to S: `phase` (14), `loop-iter` (5), `sub-step` (4), `session-id` (3). Example `install-runtime/discussions/scope-contract-lock.md` frontmatter retains `phase: ideation`, `sub-step: A-round-2`, `loop-iter: 1`. The commit stripped `loop:` but left `loop-iter:` and `phase:`/`sub-step:`/`session-id:`, which are equally session-internal coordinates with no future-reader meaning (the §4.4 rationale for stripping `loop`/`iter`/`scenario` applies verbatim).
- **Why it matters:** A future reader/auditor sees an inconsistent residue policy: `loop` is illegitimate but `loop-iter`/`phase`/`sub-step` are tolerated, with no documented reason. Risks a future "complete the residue sweep" task and undermines the §4.4 claim that session-routing residue is now caught.
- **Note on disposition:** The brief enumerated S as *exactly* task/loop/scenario/iter/slug/finding_source, so leaving the siblings is technically within the contracted scope (P4). This is a forward-looking consistency gap, not a contract breach — user decides whether to extend S in a follow-up.

### F2 — Canonical §4.5 gate is non-green project-wide
- **Type:** assumption_risk
- **Domain:** docs-sync
- **Disposition:** open
- **Severity:** Low
- **Confidence:** 100
- **Evidence:** The amended §4.5 gate, run as written over the whole project (its literal `find .gobbi/projects/gobbi` root), returns 32 hits — residue in out-of-scope features `workflow` and `project-memory` (e.g. `iter: 3` ×7, `loop: planning` ×9, `task: memory-redesign W3-T2` ×2). Over the 4 conformed features it is correctly 0.
- **Why it matters:** The §4.5 gate is now a project-wide conformance tool that does not pass project-wide. Anyone running the documented gate gets a non-zero result and may misread it as a regression in the conformed features. The standard amendment outpaced the sweep coverage.
- **Note:** Pre-existing residue in workflow/project-memory was not introduced by this commit and those features were out of scope. User decides whether to file a follow-up sweep.

## Verdict reasoning
F1 = Medium / Confidence 75; F2 = Low / Confidence 100. No Critical and no High≥50, and both are forward-looking consistency observations that lie outside the contracted scope (S-set was explicitly enumerated; workflow/project-memory features were not in scope). Per the verdict thresholds this perspective is PASS — the contracted standard/data consistency holds. F1 and F2 are surfaced for the user to decide on a follow-up S-set extension + project-wide sweep.

## Must-preserve
- Table/regex/KEEP-list agreement in §4.4/§4.5.

VERDICT: PASS
