---
name: review-md-authoritative-source-rule
description: Design document for the authoritative-source rule governing review.md / evaluation.md coverage overlap
type: design
scope: feature
feature: review
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [design, docs-sync]
keywords: [authoritative-source, overlap, coding-SKILL, principle-trace, non-redundancy]
author: claude
supersedes: null
---

# Design: authoritative-source rule for `review.md` / `evaluation.md` coverage overlap

## Problem

`review.md` and `coding/evaluation.md` have acknowledged coverage overlap — both address correctness, API, naming, tests, and other review dimensions. When two docs share overlapping checks, the question is: what happens on divergence? If one is updated to reflect a changed `coding/SKILL.md` principle but the other is not, which doc is correct?

Without a named authority, divergence creates confusion: practitioners reading one doc get different guidance than those reading the other, with no resolution rule.

## Scope

- The rule applies to all overlapping checks between `review.md` and `coding/evaluation.md`.
- The rule does NOT require carving up coverage (splitting which checks belong to which doc).
- The rule relies on the existing structure: both docs trace to `coding/SKILL.md` principle numbers.

## Approach

### The authoritative-source rule

> Both `review.md` and `evaluation.md` derive the underlying rules from `coding/SKILL.md`'s numbered principles — the single source of truth. Neither doc restates the other: `review.md` traces each taxonomy point to a principle number and teaches the review activity; `evaluation.md` keys each per-perspective scenario to the same numbers and grades against them. If the two ever diverge on a shared check, **the principle in `coding/SKILL.md` is authoritative** and both docs are reconciled to it. The principle set owns the rule — not either doc — so there is no orphaned sync owner.

### How it works in practice

1. Both `review.md` taxonomy points and `evaluation.md` scenarios explicitly cite `coding/SKILL.md` principle numbers (e.g., `(P5)`, `(P15)`).
2. An editor updating a check in `review.md` looks up the cited principle number in `coding/SKILL.md`.
3. If `coding/SKILL.md` changed (principle updated), BOTH `review.md` AND `evaluation.md` are reconciled to match it.
4. If only `review.md`'s phrasing changed (editorial), no reconciliation needed — the principle is still the same.
5. If the two docs give different guidance on the SAME shared check: open `coding/SKILL.md` at the cited principle, determine the correct behavior from the principle body, and update the divergent doc.

### Non-redundancy by organization

The overlap is NOT redundancy because:
- `review.md` is organized by review theme (taxonomy point) and teaches the ACTIVITY of reviewing.
- `evaluation.md` is organized by the 7 evaluation perspectives (Stage 0–3) and provides SCENARIOS + CHECKLISTS for the evaluator to grade.
- Neither doc restates the other's body — they each add frame, context, and organization specific to their reader.
- The principle number is the shared key; the docs add different views on it.

## Scenarios

- **Divergence scenario**: `review.md` point #2 (API) says "prefer consistent parameter order with ecosystem conventions"; `evaluation.md` usage perspective says "check parameter count is minimal." Both are valid for different framing purposes; no reconciliation needed. The principle (`coding/SKILL.md:P2 — Bottom-Up Construction`) anchors both without contradiction.
- **True contradiction**: `review.md` says "always validate external input at the trust boundary" (correct per P10); `evaluation.md` risk perspective says "skip validation if the caller is trusted" (a wording error introduced in an edit). Resolution: check P10 in `coding/SKILL.md` — validation at trust boundaries is mandatory — and fix `evaluation.md`.

## Validation

- [ ] `review.md`'s relationship section includes the authoritative-source rule verbatim (or substantively equivalent).
- [ ] Every `review.md` taxonomy point carries a principle-number trace back to `coding/SKILL.md` (or `principles/SKILL.md` with source named).
- [ ] `evaluation.md` already keys its scenarios to `(P1)…(P16)` — this rule is consistent with that.
- [ ] No "orphaned sync owner" situation: the rule names `coding/SKILL.md` as the authority, not either derivative doc.

## Trade-offs

- **Manual sync discipline**: the rule requires the editor to check the other doc when updating one. No automated drift detection exists (CONSIST-2, Low/50, accepted residual).
- **Principle-number traces required**: every taxonomy point must carry a trace. This is an Execution authoring constraint, not a design flaw.
- **Coverage overlap accepted**: splitting coverage to avoid overlap was rejected (would shrink `review.md` below comprehensive breadth). The authoritative-source rule is the mitigating design choice.

## Open issues

- CONSIST-2 (Low/50): drift-detection gap. The rule is named but no mechanism automatically detects when one doc diverges from the other. Accepted residual. See `decisions/memory/2026-06-27-authoritative-source-drift-detection-gap.md`.
