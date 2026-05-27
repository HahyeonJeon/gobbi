# Risk perspective — T6 conform install-runtime

Lens: what could this change break? Iron Law exposure (P4 scope, P8 docs-sync, P11 no-gaming). Mistake recurrence.

## Checks
- **P4 scope (no scope creep)** — PASS, and notably well-disciplined. KEY PROBE confirmed: body section headings were NOT re-ordered/renamed to the §4.2 ADR contract. The decisions/design docs KEEP their own existing section shapes (`## Decision Table`, `## Decision / ## Official documentation / ## Rationale / ## Anchored insights / ## Trade-offs / ## Validation`). T6 did exactly the contracted ops (frontmatter + inline de-crypt) and did NOT trigger a prose-wave reshape. This is the T5-learning applied correctly — no Iron-Law-4 violation.
- **No content loss (design-literal-retire mistake)** — PASS. Every body reduction is a coordinate-substitution; verified no narrative paragraph was deleted-without-replacement. The `design-literal-retire-instruction-without-replacement` mistake pattern is NOT recurred.
- **executor-main-tree-edit mistake** — PASS / correct. The 24 memory files live under main-tree `.gobbi/projects/gobbi/features/...` — the correct memory-write location per the Memory Access Matrix (memory writes go to main tree, NOT the worktree). This is the sanctioned path, not the near-miss.
- **P8 docs-sync** — N/A for impl-doc sync; these ARE the docs. But see F-RISK-1 for the standard-vs-artifact gap.

## Finding

### F-RISK-1 — partial de-crypt leaves a §4.3-leak surface that a future drift gate will re-flag
- **Type:** assumption_risk · **Domain:** docs-sync · **Disposition:** open · **Confidence:** 80 · **Severity:** Medium
- **Evidence:** The §4.3 advisory grep (`T[0-9]+-|iter[0-9]|COD-[0-9]|row-[0-9]`) still hits 6 titles + 2 headings + 2 body finding-IDs (`F-OVERALL-01`, `F-CONS-04`) across the T6 docs. §4.3 is advisory-not-hard-gate, AND `## Source` footers (10 of them) are legitimately excluded — but the title/heading hits are real residue. If issue #258's drift detector ever lifts the §4.3 advisory check to a gate (a plausible campaign trajectory), these install-runtime docs fail while the T5 guardrails docs pass.
- **Why it matters:** the work leaves a known, greppable residue that a future tightening will surface — re-work deferred, not eliminated. Medium: not breaking today, but a predictable future re-flag.
- **Suggested direction:** close the title/heading residue now (cheap, same pass) rather than defer it to a future gate-tightening that re-opens the file set.

## Risk summary
No destructive risk, no scope creep, no mistake recurrence, no main-tree-edit violation. The one risk is deferred re-work from the partial de-crypt.

VERDICT: REVISE
