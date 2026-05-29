# Consistency — Planning iter2 (Claude)

**Verdict:** PASS

## Artifact Summary
Consistency lens: Plan locks vs Idea locks (unchanged); F1-F8 disposition claims vs actual section anchors; cross-references inside iter2.

## Memory reads
- evaluation/SKILL.md
- iter1 claude consistency.md (F-CONS-1, F-CONS-2)
- draft-iter1.md + draft-iter2.md

## Locked Frame (Stage 1)

**S-C1 (inherited)** Plan locks match Idea locks (no re-litigation).
**S-C2 (inherited)** T6 archive procedure matches archive.md template.
**S-C3 (inherited)** T3 anchors map to Idea §7.3 — including the F4 line-241 correction.
**S-C4 (inherited)** Internal cross-references resolve.
**S-C5 (adversarial, new)** F1-F8 dispositions claimed `addressed` in §6 actually land at the cited section anchors.

## Per-scenario Findings

- **S-C1 ✓** Locks table §2 unchanged from iter1; D-A, D-B, R1, R2/R3, R5 prose unchanged byte-for-byte.
- **S-C2 ✓** T6 archive procedure (lines 446-491) — frontmatter stamps + git mv + body preserved + rg -l inbound check — all 4 archive.md template steps still mapped.
- **S-C3 ✓** F4 line-241 correction landed at T3 lines 355 (pre-resolved-decisions), 367 (success-criteria says "line 241 (second sentence)"), 387 (risk-rationale subsection (d)), and §5 P-R1 (line 549). 8 anchors still mapped 1:1.
- **S-C4 ✓** Internal cross-refs intact: §6 F-references land at the prose anchors they cite (verified inline). §4 acceptance test items reference task-produced artifacts.
- **S-C5 ✓ (verification of each F-claim)**:
  - **F1 (claude skill removal)** → verified at lines 159-166 (T1), 219-225 (T2), 273-277 (T4), 322-326 (T5), 389-393 (T3). Skill removed; NOTE comment inserted; cross-references §6 line 603 updates path. ✓
  - **F2 (plugins/ stale instruction removal)** → verified at line 560 (§5 unknowns) — `plugins/` row replaced with one-liner "verified absent at HEAD". ✓
  - **F3 (binary assertions + capture mechanism)** → verified at line 96-106 (preamble), 261-269 (T4 verification), 308-318 (T5 verification). Mechanism present; placeholder path substitution NOT corrected (see Usage F-USAGE2-1 — but that's a Usage finding, not a Consistency mismatch between claim and anchor).
  - **F4 (line-241 wording)** → verified at lines 355, 367, 387 — every prose reference now says "line 241 (second sentence)" or "line 241". ✓
  - **F5 (symmetric session.template.json check)** → verified at line 318. ✓
  - **F6 (pre-flight symlink check)** → verified at lines 91-94 (preamble) and at T1 line 147, T2 line 208, T3 line 376 (each task's first verification line). ✓
  - **F7 (develop..HEAD diff base)** → verified at lines 500 (preamble) and 532, 535. ✓
  - **F8 (slug-rule inline quote)** → verified at lines 417-418 (pre-resolved-decisions), 427 (success-criteria), 436 (risk-rationale); cross-refs at line 410, 423, 431. ✓
- **F-CONS-1 from iter1** (line 241 off-by-one): inherited Disposition: **addressed** via F4.
- **F-CONS-2 from iter1** (archive date marker): inherited Disposition: **open** — not in F1-F8 surgical scope; informational; archive template still followed.

## New typed findings
- **F-CONS2-1 (Low · Confidence 50 · `docs-sync` · `assumption_risk`)** — §6 row F1 line 571 says "T1/T2/T3/T4/T5 `required-skills:` blocks" but T7 and T6 also have `required-skills:` (no `claude` was ever in T7 or T6, so the omission is correct — but the row enumerates only 5 of 7 tasks, which could mislead a reader counting). Informational.

## Verdict & Must-preserve

- **Verdict: PASS.** All 8 F-fix dispositions land at their claimed anchors with verifiable evidence. The F-CONS-1 line-241 fix is precisely the surgical anchor it should be. No re-litigation; no lock drift.
- **Must-preserve:** F4 line-241 wording; F1 NOTE shape (matches across 5 task blocks); §6 disposition table.

## Low-confidence appendix
- F-CONS-2 (iter1 carried) — date-marker shorthand `2026-MM-DD-{slug}.md` consistent with archive template substitution convention.
