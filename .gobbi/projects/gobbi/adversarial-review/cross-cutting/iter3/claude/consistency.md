# Consistency Perspective — Cross-cutting Batch (iter3, claude)

## Stage 0 — Target Understanding

Lens unchanged: do all 7 skills + their child docs say the same things about shared contracts? Did everything that should sync, sync? W/W/H clear. iter3 fixes 1-4; Consistency-relevant: Fix 1 (evaluator.md within-file sync), Fix 2 (research staging cross-skill sync), Fix 3 (Scope Contract canonical anchor + 5-way cross-reference sync), Fix 4 (orchestration ↔ interview 3-tier table sync).

## Inheritance from iter2

| iter2 ID | Sev | Conf | iter3 disposition |
|---|---|---|---|
| F-C-01-iter2 (evaluator.md within-file contract divergence) | High | 100 | **Addressed** — Fix 1. evaluator.md L82-84 now reads "System discipline" not "Perspective discipline". L88-89 reads "Walk through all 7 perspectives in fixed order ... Produce one output file per perspective + `overall.md`." Body + wire format + opening header all agree. Within-file sync restored. |
| F-C-NEW-2 (same root, separate filing) | High | 100 | **Addressed** — same Fix 1. |
| F-C-02 (broken delegation.md links) | — | 100 | **Carry — addressed iter2** |
| F-C-03 (Interview access matrix mirror) | — | 100 | **Carry — addressed iter2** |
| F-C-04 (verdict aggregation hierarchy) | Medium | 50 | **Persisted** — out of iter3 scope. |
| F-C-05 (sub-doc asymmetry) | Medium | 75 | **Persisted** — out of iter3 scope. |
| F-C-06 (phase enums) | — | — | **Carry — clean iter2** |

## Stage 1 — Locked Frame

Inherited from iter2 (S1-S8). New iter3 regression-check scenarios:

**S9. (iter3 adversarial) Fix 1's sweep is complete — no residual singular-perspective imperatives anywhere in templates/evaluator.md**
- [ ] grep "assigned perspective\|your perspective\|the perspective's checklist\|trust parallel evaluators\|stay in your lane" → 0 hits
- [ ] § Constraints / Scope, § Your Job, § Do Not Trust the Report, § Inputs, § Report Format all consistent

**S10. (iter3 adversarial) Fix 2's research staging scope-limiting language is consistent with the loop skills**
- [ ] research/SKILL.md:31 references `staging/references/` (not bare `staging/`)
- [ ] research/SKILL.md:168 references `staging/references/`
- [ ] Cross-reference to loop skills' Memory Access Matrix sections is present

**S11. (iter3 adversarial) Fix 3's Scope Contract Schema cross-references form a complete sync**
- [ ] 5 consuming skills reference `evaluation/SKILL.md § Scope Contract Schema` exactly
- [ ] No skill redefines schema fields locally
- [ ] Field shape used by consumers is consistent with the canonical schema

**S12. (iter3 adversarial) Fix 4's 3-tier detection wording is identical between orchestration and interview**
- [ ] Empty / Sparse / Mature tier names + criteria match field-for-field
- [ ] AskUserQuestion strings between the two docs are at minimum compatible

## Stage 2 — Findings

### F-C-01-iter3 — RESOLVED — evaluator.md within-file sync restored

**Type**: `design_flaw` / **Domain**: `docs-sync` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed

**Evidence**: `grep "assigned perspective\|your perspective\|the perspective's checklist\|trust parallel evaluators\|stay in your lane" templates/evaluator.md` → 0 hits. `templates/evaluator.md` L13-17 (header), L35 (Do Not Trust), L82-84 (Constraints / Scope = system discipline), L88-89 (Your Job = walk all 7 in order), L122-140 (wire format = all 7 perspectives + Overall complete) all agree. Within-file contradiction closed.

### F-C-NEW-3 — Cross-doc sync expanded by Fix 3's Scope Contract Schema

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed (positive observation)

**Evidence**: 5 cross-references from `research/SKILL.md:69`, `ideation/evaluation.md:7`, `orchestration/workflow/evaluation.md:25`, `planning/SKILL.md:63`, `planning/evaluation.md:5` all cite `evaluation/SKILL.md § Scope Contract Schema` as canonical. iter1+iter2 flagged the missing anchor; iter3 closes it AND establishes the 5-way sync. Not a finding — positive cross-doc consistency improvement.

### F-C-NEW-4 — Orchestration ↔ interview 3-tier table sync

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed (positive observation)

**Evidence**: `orchestration/SKILL.md:87-91` and `interview/SKILL.md:30-32` use identical 3 tier names (Empty / Sparse / Mature) with field-aligned conditions ("No README.md, no design/, no features/ directory with content" / "Has README.md OR a skeleton design/, but no features/ directory with content" / "Has features/ directory with content"). `interview/SKILL.md:72` further mirrors the per-tier AskUserQuestion strings. Three-doc sync (orchestration row 7 → interview detection → interview rerun section) is intact. Not a finding — positive.

### F-C-02 / F-C-03 / F-C-04 / F-C-05 / F-C-06 (carry forward)

iter2 closures all stand. F-C-04 / F-C-05 persisted Mediums; not blockers.

## Stage 2 Verdict

**PASS** — F-C-01-iter2 + F-C-NEW-2 (both High conf 100 in iter2) cleanly resolved by Fix 1. Fix 2 / Fix 3 / Fix 4 all sweep cleanly and add positive cross-doc sync. No new Consistency findings from iter3 edits. F-C-04 / F-C-05 carry forward as accepted Mediums (below REVISE threshold). Two iter2 Highs closed; nothing new at High+. Per threshold rules — PASS.

This is the perspective that returned FAIL in iter2 with a calibration note ("alternative reading is REVISE"). Recording PASS in iter3 because (a) the root cause (evaluator.md body sync) is fully closed, and (b) the positive sync introductions by Fix 3 + Fix 4 add measurable consistency.

## Low-confidence appendix

- LC-C-1-iter3 (conf 25, Low): Same as iter1/iter2. No regression.
- LC-C-2-iter3 (conf 25, Low): `delegation/SKILL.md` general parallelism rule vs. evaluator-specific 2-in-parallel rule. Same observation as iter2; resolved verbally, polish would be inline cross-reference.
