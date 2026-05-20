# Structure Perspective — Cross-cutting Batch (iter4, claude)

## Stage 0 — Target Understanding

W/W/H clear. Lens unchanged: organization, decomposition, dependencies, testability, maintainability. iter4 single-fix scope: producer-site template at `ideation/SKILL.md:198-213` rewritten to cite canonical schema rather than redefine a slimmer local template.

## Inheritance from iter3

| iter3 finding | Disposition in iter4 |
|---|---|
| F-S-NEW-1 (research staging universalization) | **Persisted as resolved** — Fix 2 from iter3 intact; not touched by iter4. |
| F-S-03 / F-U-05 (mistake skill out-of-scope) | **Persisted (deferred)** — out-of-scope. |
| All other iter1/iter2 Structure findings | **Persisted as closed or accepted carry-forward**. |

## Stage 1 — Locked Frame

Dependency-graph lens. The Scope Contract is a **load-bearing edge** in the redesign graph: definer at `evaluation/SKILL.md § Scope Contract Schema`, consumers at 5 sites (planning, execution, evaluation flow, evaluator wire), **producer** at `ideation/SKILL.md` Sub-step B. iter3 connected definer↔consumers; iter4 connects definer↔producer. The graph is now fully resolved with no orphan template definitions.

## Stage 2 — Findings

### F-S-01-iter4 — Producer↔definer dependency edge resolved

**Type**: `feedback` / **Domain**: `process` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed

**Evidence**: Pre-iter4, the producer (`ideation/SKILL.md:198-213` per iter3 text) emitted a bespoke 4-field template; the definer (`evaluation/SKILL.md`) specified 5-field frontmatter + 5-section body. Two competing definitions at the producer and definer for the same artifact — a classic structural smell. iter4 collapses producer to a citation + canonical example, restoring a single source of truth. The dependency graph reads cleanly: `evaluation/SKILL.md § Scope Contract Schema` ← (cited by) ← `ideation/SKILL.md:201` + 5 consumer skills.

### F-S-02-iter4 — Example-shape preserved as illustration, not redefinition

**Type**: `feedback` / **Domain**: `process` / **Confidence**: 80 / **Severity**: — / **Disposition**: addressed

**Evidence**: L205-228 example is wrapped under "Example shape:" framing, immediately after L201's "Emit the canonical Scope Contract schema verbatim per `evaluation/SKILL.md § Scope Contract Schema`". This is **illustrative**, not normative — the normative source remains the definer. Structurally clean: examples that follow a "see X for the canonical definition" pointer are not redefinitions.

## Stage 2 Verdict

**PASS** — Producer↔definer edge resolved; no new structural drift. The "definer + N-way citation" pattern that iter3 introduced is now exhaustive (producer included). Per threshold rules — PASS.

## Low-confidence appendix

- LC-S-1-iter4 (conf 30, Low): the example at L205-228 duplicates ~20 lines of content already present in the definer. Theoretically extractable; pragmatically, an inline example at the producer site is more readable than forcing the producer-side reader to jump to evaluation/SKILL.md. Trade-off accepted; not a finding.
