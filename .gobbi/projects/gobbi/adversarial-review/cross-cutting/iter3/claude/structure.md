# Structure Perspective — Cross-cutting Batch (iter3, claude)

## Stage 0 — Target Understanding

W/W/H clear. Lens unchanged: organization, decomposition, dependencies, testability, maintainability across 7 cross-cutting skills + their child docs. iter3 applied 4 fixes; Structure-relevant: Fix 2 (research staging scope narrowing — direct response to iter2 F-S-NEW-1) and Fix 3 (Scope Contract Schema cross-references — improves dependency graph clarity).

## Inheritance from iter2

| iter2 ID | Sev | Conf | iter3 disposition |
|---|---|---|---|
| F-S-01 (broken delegation.md links) | — | 100 | **Carry — addressed iter2** |
| F-S-02 (evaluator spawn topology contradiction) | — | 100 | **Carry — addressed iter2** |
| F-S-03 (`mistake` skill out of batch) | Low | 50 | **Persisted** — informational; not on iter3 fix list. |
| F-S-04 (evaluation/SKILL.md bloat) | Low | — | Disputed per #258; deferred. |
| F-S-NEW-1 (Fix 3 staging-universalization cross-skill leak) | High | 75 | **Addressed** — Fix 2 rewrites research/SKILL.md:31 + L168 to explicitly scope the constraint to `staging/references/`. The new text adds: "Other staging surfaces (decisions, scenarios, design, etc.) remain leader-writable during WORK per the calling loop's skill — see `ideation/SKILL.md`, `preparation/SKILL.md`, `planning/SKILL.md`, `execution/SKILL.md` Memory Access Matrix sections." L168 carries the same scope-limiter. The cross-skill contradiction with the 4 loop skills' leader-WRITE-during-WORK contracts is closed. |

## Stage 1 — Locked Frame

Inherited from iter2 (S1-S7). New iter3 regression-check scenarios:

**S8. (iter3 adversarial) Fix 2's research staging scope-limiting language matches the loop skills' Memory Access Matrix wording**
- [ ] research/SKILL.md:31 and :168 both reference `staging/references/` specifically (not bare `staging/`)
- [ ] research/SKILL.md cross-references the 4 loop skills' Memory Access Matrix sections
- [ ] No loop skill is contradicted by the research scope assertion

**S9. (iter3 adversarial) Fix 3's Scope Contract cross-references form a clean dependency graph**
- [ ] 5 consuming skills cite the canonical location
- [ ] No skill defines competing fields locally
- [ ] No circular reference (evaluation/SKILL.md depending on consuming skills)

## Stage 2 — Findings

### F-S-NEW-1-iter3 — RESOLVED — Research staging scope correctly bounded

**Type**: `design_flaw` / **Domain**: `docs-sync` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed

**Evidence**: `research/SKILL.md:31` now reads "This keeps **research's external-reference staging** (`staging/references/`) as an assistant-owned, PASS-only surface. Other staging surfaces (decisions, scenarios, design, etc.) remain leader-writable during WORK per the calling loop's skill — see `ideation/SKILL.md`, `preparation/SKILL.md`, `planning/SKILL.md`, `execution/SKILL.md` Memory Access Matrix sections." `research/SKILL.md:168`: "MUST never write to `staging/references/` during WORK — research's external-reference staging is an assistant-owned, PASS-only surface … this constraint applies only to research's reference surface, not to staging at large." The universal-claim drift Structure flagged in iter2 is closed: the constraint is now narrowed to research's reference surface with explicit pointers to the loop skills for other staging surfaces.

### F-S-09 — Scope Contract dependency graph clean

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed (positive observation)

**Evidence**: 5 consuming skills cite `evaluation/SKILL.md § Scope Contract Schema` without redefining fields. The dependency graph (evaluation/SKILL.md as definer → 5 consumers via citation) is acyclic. Schema is at L172-206 in a single place. **Not a finding** — recording as positive structural improvement; iter3 reduces redundancy and removes a latent F-P-02-style anchor gap.

### F-S-03 (carry forward, persisted) — `mistake` skill still out of batch

Same as iter1/iter2. Informational; not a Stage 2 finding in iter3.

## Stage 2 Verdict

**PASS** — F-S-NEW-1 (iter2's High conf 75) cleanly resolved by Fix 2. iter1 + iter2 carry-forwards all closed or accepted. No new Structure findings from iter3 edits. F-S-NEW-1's resolution was the precise target — scope-limiting language with explicit cross-references to the loop skills' Memory Access Matrix sections — Structure's iter2 prescription was honored. Per threshold rules — PASS.

## Low-confidence appendix

- LC-S-1 (conf 25, Low): `evaluation/SKILL.md` size unchanged (and is now larger by the new Scope Contract Schema section). Token cost slightly higher but acceptable; the schema deserves a load-bearing slot. Defer.
- LC-S-2-iter3 (conf 25, Low): Could add a Memory Access Matrix to research/SKILL.md mirroring the loop skills' shape for full doc-symmetry. Polish; the cross-references suffice as the contract.
