# Consistency Perspective — Cross-cutting Batch (iter1, claude)

## Stage 0 — Target Understanding

Lens: do all 7 skills + their child docs say the same things about shared contracts? Did everything that should sync, sync? W/W/H clear.

## Stage 1 — Locked Frame

**S1. Evaluator spawn topology is one contract, stated identically everywhere**
- [ ] orchestration/workflow/evaluation.md
- [ ] delegation/SKILL.md
- [ ] delegation/templates/evaluator.md
- [ ] evaluation/SKILL.md
- [ ] each loop's workflow/{loop}.md

**S2. Verdict aggregation rule is one contract**
- [ ] Per-perspective thresholds match across orchestration/SKILL.md + evaluation/SKILL.md + workflow/evaluation.md
- [ ] Loop-level aggregation matches across orchestration/SKILL.md + workflow/evaluation.md

**S3. Sole-writer-to-project-memory contract is consistent**
- [ ] Memorization access matrix matches preparation narrow exception matches interview bootstrap exception matches wrap-up authority

**S4. Phase enums are unified — 5 productive steps everywhere**
- [ ] orchestration/SKILL.md, delegation/SKILL.md, evaluation/SKILL.md, memorization/SKILL.md, research/SKILL.md all use {ideation, preparation, planning, execution, wrap-up}
- [ ] Configuration is the framing step

**S5. (adversarial) Cross-doc link targets resolve**
- [ ] Internal anchors match actual H2/H3 headers
- [ ] Relative paths from each skill resolve to real files

**S6. Workflow per-loop docs agree with parent loop SKILL.md** (cross-references the 5 loop skills batch carryover)
- [ ] orchestration/workflow/ideation.md ↔ ideation/SKILL.md
- [ ] orchestration/workflow/preparation.md ↔ preparation/SKILL.md
- [ ] orchestration/workflow/planning.md ↔ planning/SKILL.md
- [ ] orchestration/workflow/execution.md ↔ execution/SKILL.md
- [ ] orchestration/workflow/wrap-up.md ↔ wrap-up/SKILL.md

## Stage 2 — Findings

### F-C-01 — Evaluator spawn contract has THREE inconsistent statements (inherited from F-S-02 root)

**Type**: `design_flaw` / **Domain**: `process` / **Confidence**: 100 / **Severity**: Critical / **Disposition**: open

**Evidence**: Cross-doc divergence on the same load-bearing contract:
- `delegation/SKILL.md:47`: "Spawn ≥2 perspectives in parallel"
- `delegation/SKILL.md:225` (Agent Roster): "Spawned ≥2 in parallel with distinct perspectives"
- `delegation/templates/evaluator.md:8`: single-perspective slot
- `orchestration/workflow/evaluation.md:42-49`: "exactly two evaluator agents in parallel — one per system. Each evaluator is one agent that handles all four stages ... Perspectives iterate inside the agent"
- `evaluation/SKILL.md:9,234`: "Per-Perspective Sequential Evaluation, perspectives in fixed order"

Three statements; two narratives. Manager and evaluator subagents will read different docs and arrive at different spawn topologies. This perspective owns the symptom; F-S-02 owns the root cause.

### F-C-02 — Broken cross-doc links (inherited from F-S-01)

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 100 / **Severity**: High / **Disposition**: open

**Evidence**: 2 broken links cited in F-S-01 (wrap-up.md:17, execution.md:17 → `delegation.md#what-every-delegation-prompt-needs`). Anchor `#what-every-delegation-prompt-needs` does not exist in any in-scope file; actual anchor is `#what-every-delegation-prompt-contains`.

### F-C-03 — Interview's project-memory write authority is not mirrored in memorization's access matrix

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 100 / **Severity**: High / **Disposition**: open

**Evidence**:
- `interview/SKILL.md:22-34`: declares "**WRITE** — interview writes directly to project memory because it is a bootstrap pass"
- `memorization/SKILL.md:43-44`: declares feature/project memory **FORBIDDEN** for loops `{preparation, ideation, planning, execution}` and **PERMITTED** for Wrap-up only.
- `memorization/SKILL.md:295-296`: MUST NEVER write to project memory when `loop ∈ {preparation, ideation, planning, execution}` — interview not mentioned

The memorization access matrix is the canonical sole-writer contract. Interview's bootstrap exception is not reflected. The manager's validation gate 5 in `workflow/memorization.md:188-198` ("Project-memory untouched") would FAIL-CLOSED on an Interview session if applied — but interview isn't a loop in the matrix, so the gate may never apply. Both outcomes are bad: silent bypass of the validation, or false-positive halt on a valid Interview run.

### F-C-04 — Verdict aggregation rule has subtle divergence between orchestration/SKILL.md and workflow/evaluation.md

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 50 / **Severity**: Medium / **Disposition**: open

**Evidence**:
- `orchestration/SKILL.md:267-272` (state machine § Verdict aggregation): Per-evaluator → loop aggregation: "All PASS" / "Any REVISE, no FAIL" / "Any FAIL"
- `workflow/evaluation.md:131-138`: Per-perspective + Overall (8 verdicts) → loop. Slightly different framing.
- `evaluation/SKILL.md:242,279`: Per-perspective and Overall thresholds: "any `Critical` finding with confidence ≥ 75 → `FAIL`; any `High` finding with confidence ≥ 50 → `REVISE`"

The 3-way is reconcilable but not identical. orchestration's table works at the evaluator-agent level; workflow/evaluation works at the perspective level; evaluation works at the finding level. They form a hierarchy — but no doc states the hierarchy explicitly.

### F-C-05 — `discussion/SKILL.md` describes itself as "Sub-document of orchestration" but orchestration/SKILL.md never mentions discussion as a sub-doc

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 75 / **Severity**: Medium / **Disposition**: open

**Evidence**: `discussion/SKILL.md:9`: "Sub-document of the `orchestration` skill." Same for `delegation/SKILL.md:11`. But `orchestration/SKILL.md` doesn't enumerate its sub-documents anywhere. The cross-link is asymmetric — discussion knows it's a sub-doc, orchestration doesn't know it has sub-docs.

### F-C-06 — Workflow phase enums in `evaluation/SKILL.md` are consistent across mentions

Verified: `evaluation/SKILL.md:135` lists `ideation / preparation / planning / execution / wrap-up`; line 526 path conventions list same set. Memorization SKILL.md:14 lists same. Research SKILL.md:141 lists 3 calling loops (`ideation / preparation / planning`). Cross-checked: F-S-04 batch-1 sweep already cleared this — no regression.

## Stage 2 Verdict

**FAIL** — F-C-01 (Critical conf 100), F-C-02 (High conf 100), F-C-03 (High conf 100). Three High+ findings, one Critical. Consistency is the perspective that owns "everything that should sync, sync" — and this batch surfaces 3 hard-divergence cases at the contract level.

## Low-confidence appendix

- LC-C-1 (conf 25, Low): `memorization/templates/` index in memory-map.md lines 122-141 and `memorization/SKILL.md` § Templates lines 258-273 list templates in different orders. Both are alphabetical-ish but not strictly. Polish.
