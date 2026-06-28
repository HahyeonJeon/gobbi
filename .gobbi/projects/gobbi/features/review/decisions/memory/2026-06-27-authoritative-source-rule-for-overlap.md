---
name: authoritative-source-rule-for-overlap
description: Authoritative-source rule — coding/SKILL.md owns divergence resolution between review.md and evaluation.md; non-redundancy by organization
type: decisions
scope: feature
feature: review
status: accepted
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [docs-sync, design]
keywords: [authoritative-source, overlap, sync-ownership, coding-SKILL, review-md, evaluation-md]
author: claude
supersedes: null
---

# Decision: authoritative-source rule for `review.md` / `evaluation.md` coverage overlap

## Context

The user chose COMPREHENSIVE breadth for `review.md`: all review dimensions as first-class deep points. This creates acknowledged coverage overlap with `coding/evaluation.md` — both docs address correctness, API, naming, tests, and other review dimensions. Without a sync-ownership rule, two docs with overlapping checks would drift on divergence: one updated, the other left stale, with no clear rule for which is correct.

iter1 Claude findings `C-2` (assumption_risk/docs-sync, Med/50), `STRUCT-1` (assumption_risk/docs-sync, Med/50), and `R-2` (assumption_risk/docs-sync, Med/50) all found the same root: the design did not name a sync-ownership owner for the accepted overlap.

## Decision

**Authoritative-source rule (stated in `review.md`'s relationship section):**

> Both `review.md` and `evaluation.md` derive the underlying rules from `coding/SKILL.md`'s numbered principles — the single source of truth. Neither doc restates the other: `review.md` traces each taxonomy point to a principle number and teaches the review activity; `evaluation.md` keys each per-perspective scenario to the same numbers and grades against them. If the two ever diverge on a shared check, **the principle in `coding/SKILL.md` is authoritative** and both docs are reconciled to it. The principle set owns the rule — not either doc — so there is no orphaned sync owner.

Non-redundancy is **by organization**, not by carving up coverage: `review.md` and `evaluation.md` cover overlapping ground but are organized differently for different readers. The overlap is user-accepted; the risk of drift is mitigated by having both docs trace to the same principle numbers.

## Rationale

The root fix for the three iter1 findings is naming the authoritative source: `coding/SKILL.md` numbered principles. Both docs trace to them. On divergence, fix both docs to match the principle — no ambiguity about which doc wins. This avoids needing to split coverage (which would shrink the user-chosen comprehensive breadth) while still providing a deterministic resolution rule.

## Alternatives considered

- **Carve coverage strictly between the two docs**: Rejected. Splitting coverage would reduce `review.md`'s breadth below the user's comprehensive decision, and enforcing the boundary across future edits is harder than maintaining a shared root.
- **Name `evaluation.md` as authoritative for overlap**: Rejected. `evaluation.md` and `review.md` are siblings, both derivatives of `SKILL.md`. Naming one sibling authoritative over the other would require updating that relationship each time either evolves.
- **Accept drift without a rule**: Rejected. This is exactly the gap the three iter1 findings flagged.

## Consequences

- `review.md`'s boundary/relationship section MUST include the authoritative-source rule, naming `coding/SKILL.md` as the root.
- Each taxonomy point in `review.md` MUST trace to the `coding/SKILL.md` principle number(s) it checks.
- `coding/evaluation.md` scenarios already key to `(P1)…(P16)` — this decision maintains that consistency.
- **Open residual (CONSIST-2):** the rule names the authority but does not provide a drift-detection mechanism. See `decisions/memory/2026-06-27-authoritative-source-drift-detection-gap.md`.
