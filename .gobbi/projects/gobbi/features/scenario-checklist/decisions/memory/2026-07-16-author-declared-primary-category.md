---
name: author-declared-primary-category
description: A scenario family's primary coverage category is an author-declared, justified choice, not a mechanically derived one; completeness comes from disposition-all-10 + coverage-role minimums.
type: decisions
scope: feature
feature: scenario-checklist
status: accepted
created: 2026-07-16
session: 59694f66-422a-4fd5-b93b-625c2f354fc3
tags: [ideation, design]
keywords: [primary-category, author-declared, coverage-role, taxonomy]
author: claude
related: [four-ideation-forks, mechanical-single-primary-from-overlapping-set-impossible]
---

# A family's primary category is author-declared, not mechanically derived

## Context

`scenario/SKILL.md`'s taxonomy needs each family to carry ONE primary coverage category for stable IDs,
grouping, and primary-perspective routing (`outputs/design.md` §4.2). Four Ideation iterations (iter2
through iter4) tried to derive that single primary mechanically from the family's matched-category set
— first via named rules, then a catalog backstop, then a global semantic order. Each attempt was
deterministic but produced a semantically wrong answer for at least one valid family: the
batch-capacity family (matched set `{3 Behavior, 4 Interfaces, 5 Quality}`) is defined by its
latency/capacity/memory budget (category 5, Performance), but every mechanical rule tried picked
category 3 or 4 instead, because the rule looked at set membership, not at what the family is
fundamentally about.

## Decision

The primary category is a **declared + justified choice by the author**, not a fact derived from set
membership. The match predicates (`outputs/design.md` §4.2) and the fixed global order
(`7 > 6 > 9 > 3 > 4 > 5 > 8 > 2 > 1 > 10`) become **default guidance and a consistency check** — they
bound which categories are LEGAL to declare (only a category in the family's matched set) and supply a
DEFAULT when the author has no reason to differ — but they are never a mechanical rule that assigns the
primary on their own. Coverage completeness is carried independently by two other mechanisms, never by
the primary label: SR-1 (the coverage register dispositions all 10 categories for every family) and the
coverage-role minimums (§4.3, every triggered risk minimum discharged by a case whose coverage-role set
includes it).

## Rationale

- Four consecutive mechanical-rule rounds each fell to a fresh counterexample (design draft §0
  Research→Decision ledger row: "the 4 failed mechanical-rule rounds"). A fifth mechanical patch would
  likely fall to a sixth counterexample — the pattern indicates no set→single-primary function is
  semantically correct for every valid family, not that the current rule attempt was merely buggy.
- When categories legitimately overlap (a family genuinely touches Behavior, Interfaces, AND
  Performance), only the author knows which one is the family's DEFINING discrimination — the thing the
  family is fundamentally testing. Two families can share the exact same matched set and be about
  different things; no rule reading only the set can distinguish them.
- Decoupling completeness from the primary label removes the pressure that was driving each failed rule
  attempt: once SR-1 + the coverage-role minimums independently guarantee nothing is silently dropped,
  the primary label is free to be a stable-ID and grouping convenience rather than a correctness-bearing
  classification.

## Alternatives considered

- **A 5th mechanical rule refinement** (e.g., a domain-specific override table) — rejected: the same
  counterexample-generation pattern that broke rounds 1–4 would likely break a 5th; there is no evidence
  the search space of "clever mechanical rules" is exhausted, but four straight failures on the same
  axis is the Principle-8 signal to stop patching and re-examine the goal (see the paired mistake,
  `mechanical-single-primary-from-overlapping-set-impossible`).
- **Multiple primaries per family** (drop the single-primary requirement) — rejected: breaks stable IDs
  and the primary-perspective routing map (`outputs/design.md` §4.2), which needs exactly one row per
  family.
- **Force disjoint categories** (redesign the 10 categories so families never legitimately match more
  than one) — rejected: the 10 categories are drawn from real, overlapping evaluation concerns (the 7
  perspectives + the 9-row Coverage Ownership Matrix); forcing disjointness would misrepresent families
  that are genuinely multi-faceted.

## Consequences

- `scenario/SKILL.md` SR-4 states: every family declares ONE primary category (a legal member of its
  matched set) plus a one-line justification; the §4.2 order is the default, not a rule.
- Every family in the walk-through table (`outputs/design.md` §4.2 "Walk" table) carries an explicit
  justification, not just an order-derived pick.
- Primary-perspective routing (§4.2's 10→7 map) now routes off the DECLARED primary, so a future skill
  reader must read the justification, not just the matched set, to understand why a family routes where
  it does.
- Coverage-audit tooling (any future checker of "did this scenario set cover everything") must check
  SR-1 + the coverage-role minimums directly — checking only "does every category have a primary-owning
  family" would be checking the wrong invariant.

## Related

- [[mechanical-single-primary-from-overlapping-set-impossible]] — the mistake this decision resolves:
  four failed attempts at deriving the primary mechanically
- [[four-ideation-forks]] — the full-expanded taxonomy fork this decision operates inside
