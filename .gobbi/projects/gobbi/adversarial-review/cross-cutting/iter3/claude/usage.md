# Usage Perspective — Cross-cutting Batch (iter3, claude)

## Stage 0 — Target Understanding

Consumers: (a) manager reading orchestration/SKILL.md, (b) leader/executor/evaluator/assistant subagents reading templates + phase docs, (c) future-self maintainer at 3am. W/W/H clear. iter3 fixes 1-4; Usage-relevant: Fix 1 (evaluator.md usability cleanup), Fix 4 (3-tier bootstrap detection — clearer manager action surface).

## Inheritance from iter2

| iter2 ID | Sev | Conf | iter3 disposition |
|---|---|---|---|
| F-U-01 (no entry-level SOP) | High | 75 | **Persisted** — out of iter3 scope. orchestration/SKILL.md still does not cite `/gobbi` entry point. |
| F-U-02 (NEEDS_CONTEXT schema) | — | 100 | **Carry — addressed iter2** |
| F-U-03 (`feature` stamping) | Medium | 50 | **Persisted** — out of scope. |
| F-U-04 (Re-Ideate iter counter) | Medium | 50 | **Persisted** — out of scope. |
| F-U-NEW-1 (evaluator.md self-contradiction) | High | 100 | **Addressed** — Fix 1. The fresh-evaluator usability hazard (top reads "your one perspective", wire reads "all 7") is closed. New top→middle→bottom voice is consistent. |
| F-U-NEW-2 (row 7 decline-path forward-pointer jarring) | Low | 50 | **Persisted** — text at orchestration/SKILL.md:89 still says "proceed to Step 2 directly" in the Empty-tier row (not "proceed to Ideation Loop (Step 2)"). Cosmetic; below REVISE threshold. |

## Stage 1 — Locked Frame

Inherited from iter2 (S1-S7). New iter3 regression-check scenarios:

**S8. (iter3 adversarial) Fix 1's evaluator template is unambiguously readable to a fresh subagent**
- [ ] Top-down reading produces "I run all 7 perspectives sequentially in one agent"
- [ ] No mental model conflict between body + wire format
- [ ] Each section reinforces the same contract

**S9. (iter3 adversarial) Fix 4's 3-tier table is decision-clear to a fresh manager**
- [ ] Manager can route to Empty / Sparse / Mature unambiguously
- [ ] User-question text per tier is specified
- [ ] No branch reads as "if user declines, do nothing"

## Stage 2 — Findings

### F-U-NEW-1-iter3 — RESOLVED — evaluator.md operating contract is now coherent

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed

**Evidence**: A fresh evaluator subagent reading `templates/evaluator.md` top-down now encounters:
- L13-17 (header): "You handle ALL 7 perspectives ... + Stage 3 Overall sequentially within this single agent."
- L35 (Do Not Trust the Report): "Blend perspectives within a single Stage 2 pass — walk them sequentially in the documented order; each perspective's output goes to its own file."
- L82-84 (Constraints / Scope): "System discipline: stay in your assigned system (claude or codex)."
- L88-89 (Your Job): "Walk through all 7 perspectives in fixed order ... per the 4-stage procedure in `evaluation/SKILL.md`. Produce one output file per perspective + `overall.md` for Stage 3."
- L122-140 (wire format): "DONE — all 7 perspectives + Overall complete."

The iter2 self-contradiction (4 sites saying singular-perspective + 1 site saying all-7) is fully closed. A fresh evaluator does not have to reconcile two incompatible mental models. Suggested-direction in iter2's F-U-NEW-1 ("Trust the OTHER SYSTEM's parallel evaluator (Claude ↔ Codex)") landed essentially verbatim at L82-84.

### F-U-09 — 3-tier manager-action clarity

**Type**: `general` / **Domain**: `process` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed (positive observation)

**Evidence**: `orchestration/SKILL.md:87-91` table makes manager action explicit for each tier:
- Empty: "Surface AskUserQuestion: 'Project memory is empty — run a project interview before starting work? Interview runs 5 waves to populate project context.' If accepted, load `interview/SKILL.md` and run to completion before Ideation. If declined, proceed to Step 2 directly."
- Sparse: "Surface AskUserQuestion: 'Your project memory looks sparse. Run `/gobbi interview` to flesh out the basics, or continue to Ideation?' User decides; skip Interview if declined."
- Mature: "Skip Interview auto-recommendation. Proceed to Step 2 directly. Interview is only invoked when the user explicitly requests it via `/gobbi interview`."

A fresh manager reading row 7 has unambiguous routing for each tier including verbatim user-question text. Not a finding — positive usability surfaced by Fix 4.

### F-U-01 (carry forward, persisted) — Manager entry-point SOP gap

Same as iter1/iter2 F-U-01. Persisted; out of iter3 scope. orchestration/SKILL.md still does not cite `/gobbi` as the entry point.

### F-U-NEW-2-iter3 — Forward-pointer "Step 2" wording carries forward

**Type**: `general` / **Domain**: `aesthetics` / **Confidence**: 50 / **Severity**: Low / **Disposition**: open

**Evidence**: `orchestration/SKILL.md:89` Empty-tier action still says "proceed to Step 2 directly" without inline disambiguator. iter2's LC-P-2 noted same. Polish; below REVISE.

## Stage 2 Verdict

**REVISE** — F-U-01 (iter1+iter2's persistent High conf 75) still unaddressed by intent. F-U-NEW-1 (iter2's High conf 100) cleanly resolved by Fix 1. Net iter3: 1 carry-forward persisted High (F-U-01); iter2 had 2 Highs (F-U-01 + F-U-NEW-1). Reduction from 2→1 is real improvement, but F-U-01 sustains REVISE per threshold rules (High conf ≥ 50 → REVISE).

Calibration note: F-U-01 is calibrated as deferred-by-intent across all 3 iterations; if the manager + user agree to formally defer (e.g., backlog item), Usage would move to PASS. Recording REVISE because the finding is unresolved at the artifact level, not because iter3 introduced regression.

## Low-confidence appendix

- LC-U-1-iter3 (conf 25, Low): Same as iter1/iter2 (Interview wave time estimates). Defer.
- LC-U-2-iter3 (conf 25, Low): F-U-NEW-2 polish (Step 2 forward-pointer). Defer.
