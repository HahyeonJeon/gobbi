# Performance Perspective — Cross-cutting Batch (iter3, claude)

## Stage 0 — Target Understanding

Lens unchanged: token / context cost, spawn-cost, repeated-read cost. W/W/H clear. iter3 fixes 1-4; Performance-relevant: Fix 1 (evaluator.md lane residual sweep — direct response to iter2 F-Pe-NEW-1).

## Inheritance from iter2

| iter2 ID | Sev | Conf | iter3 disposition |
|---|---|---|---|
| F-Pe-01-iter2 (spawn contract aligned in 3 of 4 docs) | Medium | 75 | **Addressed** — Fix 1 closes the residual gap. `templates/evaluator.md:82-84` body now reads "**System discipline:** stay in your assigned system (claude or codex). Trust the parallel system's evaluator agent to cover the same 7 perspectives independently — divergence between systems is the anti-groupthink signal." All singular-perspective imperatives removed; the body is now consistent with L13-17's "ALL 7 perspectives + Stage 3 Overall sequentially". Spawn contract is now uniform across 4 of 4 docs. |
| F-Pe-NEW-1 (Fix 1 partial sweep — evaluator.md body retains 1-perspective imperatives) | High | 100 | **Addressed** — same evidence. Verified by `grep "assigned perspective\|your perspective\|the perspective's checklist\|trust parallel evaluators\|stay in your lane" templates/evaluator.md` → 0 hits. |
| F-Pe-02 (memorization re-reads bounded) | Low | 50 | **Persisted** — minor optimization opportunity. |
| F-Pe-03 (no perspective pruning) | Medium | 50 | **Persisted** — intentional discipline. |
| F-Pe-NEW-2 (wire-format header overhead ~150 tokens / session) | Low | 50 | **Persisted** — accepted cost for determinism payoff. |

## Stage 1 — Locked Frame

Inherited from iter2 (S1-S5). New iter3 regression-check scenarios:

**S6. (iter3 adversarial) Fix 1's sweep reaches every singular-perspective imperative**
- [ ] Body L82-84 says "system discipline" not "perspective discipline"
- [ ] `evaluator.md` § Your Job reads "Walk through all 7 perspectives" not "the perspective's checklist"
- [ ] Wire-format header (L122-128) still ends with "all 7 perspectives + Overall complete"
- [ ] No regression in `delegation/SKILL.md` callouts or anti-pattern wording

## Stage 2 — Findings

### F-Pe-NEW-1-iter3 — RESOLVED — evaluator.md spawn-cost contract uniform

**Type**: `design_flaw` / **Domain**: `cost` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed

**Evidence**: `templates/evaluator.md:82-84` § Constraints / Scope now reads "**System discipline:** stay in your assigned system (claude or codex). Trust the parallel system's evaluator agent to cover the same 7 perspectives independently — divergence between systems is the anti-groupthink signal." § Your Job L88-89 reads "Walk through all 7 perspectives in fixed order (Project → Structure → Performance → Aesthetics → Usage → Consistency → Risk) per the 4-stage procedure in `evaluation/SKILL.md`. Produce one output file per perspective + `overall.md` for Stage 3." § Do Not Trust the Report L35 also strengthens: "Blend perspectives within a single Stage 2 pass — walk them sequentially in the documented order; each perspective's output goes to its own file." All "system-as-lane" not "perspective-as-lane". `evaluator.md:13-17` (Your system / Your phase header) reads "You handle ALL 7 perspectives (Project → Structure → Performance → Aesthetics → Usage → Consistency → Risk) + Stage 3 Overall sequentially within this single agent." Cost-runaway scenario fully closed.

### F-Pe-NEW-2 (carry forward, persisted) — Wire-format overhead

Same as iter2. ~150 tokens / session for 3-line header is an acceptable tax for determinism.

### F-Pe-NEW-3 — Scope Contract Schema adds ~30 tokens / evaluator load

**Type**: `general` / **Domain**: `cost` / **Confidence**: 50 / **Severity**: Low / **Disposition**: open

**Evidence**: Fix 3's `evaluation/SKILL.md` § Scope Contract Schema adds ~35 lines / ~250 tokens to the skill body. Every evaluator that loads `evaluation/SKILL.md` (which is mandatory per the evaluator template) pays this cost. With ~30-50 evaluator spawns / session, ~7-12k token-load delta. Trivial vs. the canonical-anchor payoff (F-P-02 closed). Recording because Performance must price every doc-growth event.

## Stage 2 Verdict

**PASS** — F-Pe-NEW-1 (iter2's High conf 100) cleanly resolved by Fix 1. iter1's F-Pe-01 also fully closed. F-Pe-02 / F-Pe-03 / F-Pe-NEW-2 carry as persisted Lows/Mediums. F-Pe-NEW-3 (Low conf 50) is a minor cost from Fix 3 but the schema-canonical-anchor benefit dominates. Per threshold rules — PASS.

## Low-confidence appendix

- LC-Pe-1-iter3 (conf 25, Low): Same as iter1/iter2 LC-Pe-1 (evaluation/SKILL.md size). Slightly larger after Fix 3. Acceptable.
- LC-Pe-2-iter3 (conf 25, Low): The combined load of evaluator.md + evaluation/SKILL.md is now ~700 lines for a single evaluator spawn. If future redesigns add more invariant docs, a split-load strategy may be needed. Polish.
