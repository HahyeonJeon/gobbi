# Project Perspective — Cross-cutting Batch (iter3, claude)

## Stage 0 — Target Understanding

Same 7 cross-cutting skills + child docs. W/W/H clear. Phase tag `cross-cutting` accepted. iter3 applied 4 fixes targeting iter2 residuals: (1) evaluator.md lane-residual sweep, (2) research staging scope narrowing, (3) Scope Contract Schema + 5 cross-refs, (4) 3-tier Empty/Sparse/Mature bootstrap detection.

## Inheritance from iter2

| iter2 ID | Sev | Conf | iter3 disposition |
|---|---|---|---|
| F-P-01-iter2 (Interview discoverability) | — | 100 | **Carry — addressed** |
| F-P-02 (Scope Contract no canonical anchor) | High | 75 | **Addressed** — Fix 3 lands `evaluation/SKILL.md:172` § Scope Contract Schema (frontmatter + 5 required body sections in YAML). 5 consuming skills cross-reference: `research/SKILL.md:69`, `ideation/evaluation.md:7`, `orchestration/workflow/evaluation.md:25`, `planning/SKILL.md:63`, `planning/evaluation.md:5`. Verified by `grep -rn "Scope Contract schema canonical at"` → 5 hits exactly. The load-bearing input now has a canonical schema. |
| F-P-04 (`feature` stamping mechanism) | Medium | 50 | **Persisted** — no fix in iter3 scope. orchestration/SKILL.md:82 "leave `feature` as `null` … stamp later, typically during Ideation" unchanged. |
| F-P-NEW-1 (bootstrap detection binary) | Medium | 50 | **Addressed** — Fix 4 promotes the binary empty test to 3-tier Empty/Sparse/Mature at `orchestration/SKILL.md:89-91`. Sparse tier surfaces "Your project memory looks sparse. Run `/gobbi interview` to flesh out the basics, or continue to Ideation?" — exactly the sparse-but-not-empty case I flagged in iter2. `interview/SKILL.md:30-32` mirrors the same 3-tier table; `interview/SKILL.md:72` includes verbatim AskUserQuestion strings per tier. |

## Stage 1 — Locked Frame

Inherited from iter2 (S1-S5). New iter3 regression-check scenarios:

**S6. (iter3 adversarial) Fix 3 Scope Contract Schema is consumable by every loop that references it**
- [ ] Schema present at `evaluation/SKILL.md` § Scope Contract Schema with frontmatter + 5 body sections
- [ ] Each consuming skill cross-references the canonical location without redefining fields
- [ ] No skill outside `evaluation/SKILL.md` defines competing Scope Contract fields

**S7. (iter3 adversarial) Fix 4's 3-tier bootstrap detection is internally consistent**
- [ ] orchestration row 7 table and interview/SKILL.md table match field-for-field
- [ ] Sparse tier's "skip if declined" path is unambiguous
- [ ] No tier ambiguity (a project either qualifies for exactly one tier or the criteria need refinement)

## Stage 2 — Findings

### F-P-02-iter3 — RESOLVED — Scope Contract canonical schema landed

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed

**Evidence**: `evaluation/SKILL.md:172-206` defines the Scope Contract Schema: required frontmatter (`artifact_type: scope-contract`, `feature`, `goal`, `created-by`, `created-at`) + 5 required body sections (In-Scope / Out-of-Scope / Decisions Locked / Success Criteria / Deferred). The closing sentence "Consuming skills: research/SKILL.md, ideation/evaluation.md, orchestration/workflow/evaluation.md, planning/SKILL.md, planning/evaluation.md — each references this section as the canonical schema. Do not define Scope Contract fields elsewhere." establishes sole-source-of-truth. 5 cross-references verified by grep. iter1 + iter2's persistent High closes cleanly.

### F-P-NEW-1-iter3 — RESOLVED — 3-tier bootstrap detection lands

**Type**: `general` / **Domain**: `process` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed

**Evidence**: `orchestration/SKILL.md:89-91` Empty/Sparse/Mature table; `interview/SKILL.md:30-32` matching 3-tier shape with bootstrap-vs-mature mode mapping; `interview/SKILL.md:72` repeats the per-tier AskUserQuestion strings verbatim with explicit "Empty tier" / "Sparse tier" / "Mature tier" labels. Sparse-but-not-empty case (stub README + skeleton design + 0 features) now routes via the Sparse tier user question.

### F-P-04 (carry forward, persisted) — `feature` stamping mechanism still implicit

**Type**: `general` / **Domain**: `process` / **Confidence**: 50 / **Severity**: Medium / **Disposition**: open

**Evidence** (unchanged from iter1/iter2): `orchestration/SKILL.md:82` "leave `feature` as `null` … stamp later, typically during Ideation". `memorization/SKILL.md` gate-5 still requires `feature` set. No explicit step or AskUserQuestion shown in Step 1 or Step 2 procedure surfaces the stamp event. Not on iter3 fix list — calibrated as Medium deferral, not blocker.

## Stage 2 Verdict

**PASS** — F-P-02 (iter1+iter2's persistent High conf 75) cleanly resolved by Fix 3. F-P-NEW-1 (iter2's surfaced Medium) cleanly resolved by Fix 4. F-P-04 persists at Medium conf 50 — below REVISE threshold (High conf ≥ 50). No new Project-perspective findings surfaced from iter3 edits. Two iter2 Highs/Mediums closed; one Medium remains as documented deferral. Per threshold rules — PASS.

## Low-confidence appendix

- LC-P-1 (conf 25, Low): Same as iter1/iter2 LC-P-1 (discussion-into-orchestration merger). Defer.
- LC-P-2-iter3 (conf 25, Low): `evaluation/SKILL.md:206` says "Do not define Scope Contract fields elsewhere." — this is a contract phrased to authors but no mechanical lint. Risk that future redesigns reintroduce duplicate definitions. Polish-grade; depends on a linter to enforce mechanically.
