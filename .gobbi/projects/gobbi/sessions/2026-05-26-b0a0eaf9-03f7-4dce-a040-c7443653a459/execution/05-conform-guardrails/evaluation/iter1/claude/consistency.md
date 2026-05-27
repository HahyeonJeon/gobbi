# T5 Conformance — Consistency Perspective (Claude, iter1)

Scope: does T5 stay consistent with the §4 standard, the plan's wave boundaries, and sibling conformance tasks (T1-T4)?

## Verification

- **Wave-boundary consistency (the core probe):** the plan splits Wave 1 = "Conformance (mechanical)" (T1-T9) from Wave 2 = "Prose" (P1-P7), and assigns §4.2 per-type section-contract reshaping (D4) explicitly to the deferred **P4-prose-guardrails** task (task-list line 105: "Per-type prose rewrite … D1/D4/D5 … §4.2 section-contract checklist pass"). T5's own verification line (line 67) names only: leak gate=0, 9 base keys, disposition preserved, scope clean — no section-contract reshaping.
- **What the executor did:** reshaped 3 backlog bodies from ADR-shape (`## Decision/Rationale/Alternatives/Consequences`) to the backlogs-template shape (`## Context/Why deferred/When to pick up/Suggested approach/Originating session`). The backlogs template (`memorization/templates/backlogs.md`) confirms that section list is the correct §4.2 contract for `backlogs/`. So the reshape is genuine **D4/§4.2 conformance work** — and D4 is the deferred P4 wave's mandate, not T5's.
- **Content fidelity of the reshape:** I diffed all 3 backlogs line-by-line. Decision→Why deferred, Rationale→Why deferred(p2), Alternatives→Suggested approach, Consequences→Suggested approach(bullet) — every rationale/alternative/consequence proposition survives. **No content lost.**

## Findings

### F-CONS-1 — backlog body reshaping executes the deferred P4 prose wave inside the mechanical T5 task
- **Type:** scenario_gap | **Domain:** process | **Disposition:** open | **Confidence:** 100 | **Severity:** Medium
- **Evidence:** 3 backlogs reshaped ADR→backlogs-template (git show 8e6ae25); plan assigns §4.2/D4 to deferred P4-prose-guardrails (task-list:105), not T5 (task-list:67). The same over-reach appears in the discussion body (Options/Rationale rewrites) and checklist body edits.
- **Why it matters:** Iron Law 4 — scope is bounded by the contract. The mechanical wave was deliberately separated from the prose wave to bound context and keep diffs reviewable per-wave. Doing prose-wave reshaping inside T5 means: (a) the deferred P4 task is now partially pre-done in an unmarked way (a future P4 executor will find these 3 backlogs already reshaped and may double-work or be confused about what P4 still owes); (b) the T5 diff is larger and harder to review as "mechanical." The reshape was *faithful* (no content lost), so this is over-scope, not destruction.
- **Suggested direction:** manager decides — either (i) accept the reshape and explicitly mark P4-prose-guardrails' backlog portion as already-done, or (ii) note the boundary breach for the executor's future discipline. No content remediation needed.

**Verdict note:** F-CONS-1 is Medium (faithful over-scope, zero content loss) — per the brief's branch "faithful-but-over-scope = note" and the threshold rules (REVISE requires a High>=50 finding), this is a noted PASS, not a REVISE. The boundary breach is real and worth recording for executor discipline, but it caused no defect in the deliverable.

**Must-preserve:** the faithful content mapping (do not let any future P4 pass re-litigate and accidentally drop the preserved rationale/alternatives/consequences).

VERDICT: PASS
