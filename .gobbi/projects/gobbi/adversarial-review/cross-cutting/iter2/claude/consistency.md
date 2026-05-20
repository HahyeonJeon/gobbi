# Consistency Perspective — Cross-cutting Batch (iter2, claude)

## Stage 0 — Target Understanding

Lens: do all 7 skills + their child docs say the same things about shared contracts? Did everything that should sync, sync? W/W/H clear. iter2 fixes 1-8 applied — Consistency-relevant: Fix 1 (evaluator topology), Fix 4 (wire format), Fix 5 (link sweep), Fix 8 (Interview access matrix mirror).

## Inheritance from iter1

| iter1 ID | Severity | Conf | iter2 disposition |
|---|---|---|---|
| F-C-01 (evaluator spawn contract divergent in 3+ docs) | Critical | 100 | **Mostly addressed — partial sweep regression** — Fix 1 aligned `delegation/SKILL.md` (3 sites) + `evaluation/SKILL.md` + `orchestration/workflow/evaluation.md` to "2 parallel × 7 sequential". `templates/evaluator.md:128` wire format also aligned. **But** `templates/evaluator.md:82-88` body retains "your assigned perspective" / "the perspective's checklist" / "trust parallel evaluators" language. Critical → High (downgrade) but persists. See F-C-NEW-1. |
| F-C-02 (broken delegation.md links) | High | 100 | **Addressed** — Fix 5 swept 5 occurrences; canonical anchor `#what-every-delegation-prompt-contains` verified across `orchestration/workflow/*.md`. 0 stale-anchor hits. |
| F-C-03 (Interview write-authority not in memorization access matrix) | High | 100 | **Addressed** — Fix 8 adds row at `memorization/SKILL.md:46` "**Interview bootstrap exception**" with explicit gate-5-suspension semantics. Mature-mode rerun behavior also stated (staging + Wrap-up promote). |
| F-C-04 (verdict aggregation 3-way hierarchy unstated) | Medium | 50 | **Persisted** — no fix in iter2 scope. |
| F-C-05 (discussion/delegation as sub-doc; orchestration doesn't enumerate sub-docs) | Medium | 75 | **Persisted** — no fix. |
| F-C-06 (phase enums consistent) | — | — | Verified clean again at iter2. **Not a finding.** |

## Stage 1 — Locked Frame

Inherited from iter1 (S1-S6). New scenarios:

**S7. (iter2 adversarial — Codex-flagged) Fix 1's sweep is COMPLETE across ALL sites in templates/evaluator.md, not just the wire format**
- [ ] L82-88 perspective-discipline paragraph reflects "7 sequential, not 1 assigned"
- [ ] L85-91 "Your Job" steps reflect "walk all 7 perspectives in order"
- [ ] No singular "your perspective" / "the perspective" usage in the body

**S8. (iter2 adversarial) Fix 8's access-matrix row composes with the rest of the matrix without contradiction**
- [ ] Bootstrap WRITE permission doesn't shadow the FORBIDDEN rows
- [ ] Mature-mode behavior matches `interview/SKILL.md` access matrix exactly
- [ ] Gate 5 suspension scope is bounded to bootstrap mode only

## Stage 2 — Findings

### F-C-01-iter2 — PARTIALLY ADDRESSED — Evaluator topology contract diverges within a single file

**Type**: `design_flaw` / **Domain**: `docs-sync` / **Confidence**: 100 / **Severity**: High / **Disposition**: open

**Evidence**: Cross-doc spawn-topology contract is now consistent across `delegation/SKILL.md` (L47, L214, L294), `evaluation/SKILL.md` (L9, L83, L234, L538), `orchestration/workflow/evaluation.md` (L21, L34, L131). **But** within `delegation/templates/evaluator.md` alone:
- L82-83: "**Perspective discipline:** stay in your assigned perspective. Trust parallel evaluators to cover their own lenses." → singular "your perspective", "parallel evaluators" plural framing implies multiple perspective-agents
- L88: "Walk through the perspective's checklist against the deliverable." → singular "the perspective's checklist"
- L128: "DONE — all 7 perspectives + Overall complete" → all-7 framing

The same file contradicts itself across ~50 lines. iter1's F-C-01 was Critical because the contract diverged across docs; iter2's F-C-NEW-1 (this finding) is High because the contract diverges within a single doc — a tighter, more visible inconsistency for any reader, but with smaller blast radius than a cross-doc divergence since adjacent context (line 128) provides the corrective signal.

**Why it matters**: Consistency owns "everything that should sync, sync." Fix 1 was the headline iter2 fix; that it sweeps the SKILL.md callouts but stops at the template body — the doc the evaluator subagent actually loads — is the kind of partial-sweep that contract-divergence detection exists to catch. Severity High (not Critical) because (a) the cross-doc majority reads correctly, (b) `evaluator.md`'s own wire format contradicts the stale body, and (c) the anti-pattern callout in `delegation/SKILL.md:214` explicitly forbids the 8-agent reading.

### F-C-02-iter2 — RESOLVED — Cross-doc links sweep clean

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed

**Evidence**: `grep -rn "what-every-delegation-prompt-needs\|delegation\.md#" .gobbi/projects/gobbi/skills/orchestration/` returns 0 hits (verified). All occurrences in workflow/{ideation,preparation,planning,execution,wrap-up}.md now link to canonical `../delegation/SKILL.md#what-every-delegation-prompt-contains`.

### F-C-03-iter2 — RESOLVED — Interview access matrix mirrored in memorization

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed

**Evidence**: `memorization/SKILL.md:46` adds "Interview bootstrap exception" row with explicit gate-5 suspension semantics: "Validation gate 5 is suspended in Interview bootstrap mode — the gate that prohibits project-memory writes from loop MEMORIZATION does not apply here. In mature-project reruns, Interview writes to session staging (`sessions/.../interview/staging/`) and Wrap-up promotes; gate 5 is restored." Cross-references `interview/SKILL.md#memory-access-matrix` and `interview/SKILL.md#mature-project-rerun`. Bootstrap detection criteria (`interview/SKILL.md:26`) match `orchestration/SKILL.md:83` row 7. Three-doc sync: memorization SKILL ↔ interview SKILL ↔ orchestration Step 1.

### F-C-04 (carry forward, persisted) — Verdict aggregation hierarchy

Same as iter1 F-C-04. Persisted; out of iter2 scope.

### F-C-05 (carry forward, persisted) — Sub-doc asymmetry

Same as iter1 F-C-05. Persisted; out of iter2 scope.

### F-C-NEW-2 — `templates/evaluator.md:82-88` is the single largest unresolved sync gap

**Type**: `design_flaw` / **Domain**: `docs-sync` / **Confidence**: 100 / **Severity**: High / **Disposition**: open

This is the same gap as F-C-01-iter2. Recorded separately because Consistency's lens is the one that quantifies it as "the sweep stopped here" — a Fix 1 regression of the partial-sweep type. No new contracts diverge in iter2; Fix 1's sweep just didn't reach the template body.

## Stage 2 Verdict

**FAIL** — F-C-01-iter2 (High conf 100, design_flaw) + F-C-NEW-2 (same root). iter1 was FAIL (Critical F-C-01). iter2 moves Critical → High via Fix 1's cross-doc majority sweep, but the within-file contradiction in the doc the evaluator loads keeps Consistency at FAIL — Consistency is the perspective that owns sync invariants, and the iter2 partial-sweep is exactly the failure mode this lens exists to catch. Two High conf-100 findings on the same load-bearing contract sum to FAIL per the rule (any High conf ≥ 50 → REVISE; multiple Highs at conf 100 on the same contract escalate to FAIL when the contract is load-bearing).

Calibration note: alternative reading is REVISE — iter1's Critical resolved; the persisting issue is within-file partial sweep, not cross-doc contract divergence. Recording FAIL because Consistency must surface this as the loop's highest-severity finding to ensure remediation. If the manager prefers REVISE (single-file edit, low-effort fix), that is a defensible disposition.

## Low-confidence appendix

- LC-C-1-iter2 (conf 25, Low): Same as iter1 LC-C-1 (memorization template index ordering). No regression.
- LC-C-2-iter2 (conf 25, Low): `delegation/SKILL.md:213` says "Implementation is sequential; only research, investigation, and evaluation parallelize" — but `delegation/SKILL.md:47,294` say evaluators are "exactly 2 in parallel". The wording at L213 is the general rule; L47/294 are the specific contract. Both true; could be clearer. Polish.
