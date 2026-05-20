# Usage Perspective — Cross-cutting Batch (iter4, claude)

## Stage 0 — Target Understanding

Consumers: (a) manager reading orchestration, (b) leader/executor/evaluator/assistant subagents reading templates + phase docs, (c) future-self maintainer at 3am. W/W/H clear. iter4 single-fix scope: ideation Sub-step B producer template rewritten.

## Inheritance from iter3

| iter3 finding | Disposition in iter4 |
|---|---|
| F-U-NEW-1 (evaluator usage cleanup) | **Persisted as resolved** — iter3 Fix 1 intact. |
| **F-U-01 (entry-point SOP gap — `/gobbi` session-start) — High conf 75** | **Filed as #259** per iter4 inheritance memo. Moves from "intentional defer" to "tracked backlog issue". |
| F-U-NEW-2 (decline-path forward-pointer) | **Persisted (Low)**. |
| F-U-03 / F-U-04 (`feature` mech, re-Ideate counter) | **Persisted (intentional defer)**. |

## Stage 1 — Locked Frame

Usability-for-the-reader lens. The Ideation Sub-step B leader needs to know what fields to fill. Pre-iter4, the bespoke template said `Project / Feature / Task / In scope / Out of scope` — slim, partial, locally complete. Post-iter4, the leader is told "fill the canonical schema; see definer; here's an example." The Sub-step B leader now produces an artifact that downstream skills (planning, execution, evaluation flow) will accept without translation.

## Stage 2 — Findings

### F-U-01-iter4 — Producer-site usage now matches consumer expectations

**Type**: `feedback` / **Domain**: `process` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed

**Evidence**: A leader following the pre-iter4 template would have produced an artifact with `Project / Feature / Task / In scope / Out of scope` — missing `goal`, `created-by`, `created-at`, `Decisions Locked`, `Success Criteria`, `Deferred`. Downstream consumers (planning, execution) that grep for those fields would have failed validation. Post-iter4, the leader is steered toward the full canonical schema. End-to-end usability restored.

### F-U-02-iter4 — F-U-01 (entry-point SOP) now formally tracked via #259

**Type**: `feedback` / **Domain**: `process` / **Confidence**: 80 / **Severity**: — / **Disposition**: deferred (filed)

**Evidence**: iter4 inheritance memo confirms #259 filed. Status moves from "deferred by intent" to "deferred with tracking". Per the iter3 Overall verdict's calibration note: "If the manager + user agree to file F-U-01 as a backlog issue (e.g., #259), Usage moves to PASS." That condition is met.

## Stage 2 Verdict

**PASS** — iter4 closes the Sub-step B producer-usability gap; F-U-01 is now backlog-tracked per #259, satisfying iter3's calibration condition for Usage to move to PASS. Per threshold rules — PASS.

(Previous iter1→iter2→iter3 verdicts: REVISE → REVISE → REVISE; iter4 PASS per filing condition.)

## Low-confidence appendix

- LC-U-1-iter4 (conf 30, Low): F-U-NEW-2 (orchestration:89 "proceed to Step 2 directly" without inline disambiguator) persists. Cosmetic; not actionable.
- LC-U-2-iter4 (conf 25, Low): post-iter4, a careless leader could still skip body sections (markdown lacks AJV-style enforcement). Mitigated by "Do not introduce local field names" callout at L201. Not actionable.
