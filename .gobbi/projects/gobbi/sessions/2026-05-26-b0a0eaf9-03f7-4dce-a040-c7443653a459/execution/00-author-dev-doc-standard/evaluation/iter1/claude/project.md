# Project perspective — T0 §4 dev-document quality standard (iter1, claude)

**Target:** commit be43c43 — append §4 to `.gobbi/projects/gobbi/skills/memorization/rules.md`.
**Lens:** Does the deliverable satisfy the contract (the locked design D1-D10 + FIX-1) and the brief?

## What I verified
- `git show --stat be43c43`: only `rules.md` changed, +106 lines, 0 deletions. Pure append (no `^-` content lines in diff). §1-3 untouched. Scope discipline = clean.
- D2 (home): §4 lives in canonical `.gobbi/.../memorization/rules.md`; `.claude/skills/memorization/rules.md` is a symlink to it (verified `ls -la` → `-> ../../../.gobbi/.../rules.md`). Authored on canonical path per symlink-canonical-path mistake. PASS.
- D3 (positive bar): §4.1 "What a good dev-doc looks like (the positive bar)" + real before/after table (3 rows from this tree, §4.1) present; not prohibition-only. PASS.
- D4 (per-type contracts): §4.2 table matches the actual staging templates (notes/learnings/decisions verified exact; mistakes semantically equivalent). PASS.
- D5 (self-contained prose): §4.3 rule + advisory grep present and runs. PASS.
- D6/FIX-1 (type-aware allowlist): §4.4 encodes set S in both spellings + conditional disposition + safety invariant; matches design-options FIX-1 verbatim. PASS.
- D9 (narrative): §4.3 "never delete narrative — reclassify to notes/" present, cites design-literal-retire mistake. PASS.
- D10 (archive exclusion): §4.6 present; every command carries `-not -path '*/archive/*'`. PASS.

## Findings
**PR-1 — `addressed-by` provenance key absent from set S (Type: assumption_risk; Domain: process; Disposition: open; Confidence: 75; Severity: Low)**
- Evidence: live-tree census shows `addressed-by:` on 4 files (e.g. `features/git-workflow/checklists/phase-doc-count-verification.md` line 11). It is a staging/provenance key conceptually identical to `surfaced-by`/`promoted-from` (both in S), and is NOT a §2.2 legitimate extension (`grep addressed` on rules.md → not mentioned). The §4.5 gate will NOT flag it, so a future conformance sweep leaves `addressed-by` leaks behind.
- Why it matters: §4 claims set S is the illegitimate-key-set; an un-enumerated provenance key undercuts the "100% conformance" goal of D6.
- Scope note: `addressed-by` is ALSO absent from the locked design-options S-set and FIX-1. The executor faithfully encoded what was locked (Iron Law 4). This is an upstream DESIGN gap surfaced at execution, not an implementation-vs-design mismatch. Suggested direction: manager decides whether to add `addressed-by`/`addressed_by` to S (a design amendment) or defer to the conformance-wave backlog.

## Verdict
PASS — deliverable faithfully encodes the locked contract; the one finding is a Low upstream-design gap, not an execution defect.
