# Risk Perspective — Cross-cutting Batch (iter4, claude)

## Stage 0 — Target Understanding

Lens unchanged: blast radius, reversibility, security surface, rollback, irreversible operations. For doc artifacts: silent contract drift, data corruption (wrong-actor project-memory writes), cost runaway, rollback difficulty. W/W/H clear. iter4 single-fix scope: ideation producer template rewritten.

## Inheritance from iter3

| iter3 finding | Disposition in iter4 |
|---|---|
| F-R-01-iter2 + F-R-NEW-1 (Karpathy-coverage degradation) | **Persisted as resolved**. |
| F-R-NEW-2 (sparse-bootstrap silent-skip) | **Persisted as resolved**. |
| F-R-03 (concurrent sessions) | **Persisted (parking-lot)**. |
| **Producer-site bespoke template (iter3 Codex Medium)** | **Addressed by iter4 Fix 1**. |

## Stage 1 — Locked Frame

Silent-contract-drift lens. Pre-iter4 risk: a leader following the bespoke template would emit a Scope Contract missing `Decisions Locked` / `Success Criteria` / `Deferred` fields. Downstream consumers expecting those fields (per evaluation/SKILL.md § Scope Contract Schema) would silently degrade — accept the partial artifact, lose the constraints, allow scope creep into Execution. iter4 closes this drift edge.

## Stage 2 — Findings

### F-R-01-iter4 — Silent partial-artifact risk closed at producer

**Type**: `feedback` / **Domain**: `process` / **Confidence**: 90 / **Severity**: — / **Disposition**: addressed

**Evidence**: Pre-iter4, the bespoke template at `ideation/SKILL.md:198-213` (per iter3 text) listed only `Project / Feature / Task / In scope / Out of scope` — 5 of the 9 canonical fields. A leader filling that template produces a Scope Contract that downstream consumers will accept silently (markdown has no schema validator). The blast radius: lost Decisions Locked → scope creep at Execution → re-Ideate cost. iter4 sets explicit guidance ("Do not introduce local field names") + canonical citation, raising the friction for partial-artifact emission.

### F-R-02-iter4 — Reversibility: Fix 1 is text-only, fully reversible

**Type**: `feedback` / **Domain**: `process` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed

**Evidence**: Single file touched (`ideation/SKILL.md`); git revert restores prior state. No state/db/schema impact. Risk surface = pure docs.

### F-R-03-iter4 — No new partial-sweep risk introduced

**Type**: `feedback` / **Domain**: `process` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed

**Evidence**: Verification grep `^\*\*Project\*\*\|^\*\*Feature\*\*\|^\*\*Task\*\*` returns 0 hits in ideation/SKILL.md. The sweep-completeness protocol iter3 prescribed is honored. The cautionary tale (iter2 Fix 1 leak at evaluator.md:82-88) did not repeat.

## Stage 2 Verdict

**PASS** — Silent partial-artifact drift edge closed at producer. No new risk surface introduced. Per threshold rules — PASS.

## Low-confidence appendix

- LC-R-1-iter4 (conf 30, Low): markdown lacks AJV-style enforcement at the producer site. A determined adversary (or careless leader) could still emit a non-canonical artifact. Mitigated by the L201 callout but not eliminated. Potential follow-up: a schema-check assistant agent at Sub-step B WORK output. Not actionable in iter4 scope.
- LC-R-2-iter4 (conf 25, Low): F-R-03 (concurrent sessions) still persists as parking-lot. Unchanged risk profile.
