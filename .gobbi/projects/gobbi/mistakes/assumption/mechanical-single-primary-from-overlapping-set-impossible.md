---
name: mechanical-single-primary-from-overlapping-set-impossible
description: No mechanical rule can derive one correct "primary category" from a family's overlapping matched-category set — the right answer depends on author intent, not set membership.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-16
session: 59694f66-422a-4fd5-b93b-625c2f354fc3
tags: [assumption, process]
keywords: [primary-category, classification, overlapping-categories, author-declared, design-taxonomy]
author: claude
priority: high
domain: process
related: [step-back-after-repeated-fixes-on-one-axis]
---

# No set→single-primary rule is semantically correct for every overlapping family

## What happened

While designing the `scenario` SOP's category taxonomy, 4 Ideation iterations (iter2 through iter4)
tried to derive ONE "primary category" mechanically from a family's matched-category SET. Each attempt
was a different mechanism — first named per-category rules, then a catalog backstop, then a global
semantic order (`7 > 6 > 9 > 3 > 4 > 5 > 8 > 2 > 1 > 10`) — and each was fully deterministic, yet each
was semantically WRONG on at least one real family. The clearest counterexample: a batch-capacity
family ("at 10k complete within the 200 ms/memory budget; at 10 001 refuse before allocating") matches
categories `{3 Behavior/state, 4 Interfaces, 5 Quality/Performance}`. Every mechanical rule tried picked
category 3 or 4 (the input-class or the API contract), but the family is actually DEFINED by its
latency/capacity/memory budget — category 5, Performance. Input-class and API contract are the vehicle
carrying the concern, not the concern itself.

## Why it happens

When categories legitimately overlap — a family genuinely touches more than one coverage concern — the
"primary" that matters is the family's DEFINING discrimination: what the family is fundamentally
testing. That is a fact about the author's intent, not about which categories the family's description
happens to match. Two families can share the exact same matched set and be about completely different
things (e.g., two families both matching `{Behavior, Interfaces}` — one about a data-shape contract, one
about an ordering guarantee) — a rule that only reads set membership has no way to tell them apart. Any
mechanical rule (order, table, weighting) is therefore, unrecoverably, an approximation that will be
wrong on some valid input; it is not merely under-tuned.

## Correct approach

When a design needs a single normative classification for an item that legitimately matches multiple
categories, do not try to DERIVE that classification mechanically from the matched set. Instead:

1. Make the classification an **author-declared, justified choice** — the author states the item's
   defining discrimination and a one-line reason.
2. Use the mechanical rule (predicates, order, table) only as a **consistency check** (bounds the LEGAL
   choices to the matched set) and a **default** (what to pick absent a reason to differ) — never as the
   sole source of truth.
3. Carry completeness (the property the mechanical rule was originally trying to protect) through an
   INDEPENDENT mechanism that does not depend on the primary label — e.g., a coverage register that
   dispositions every category regardless of which one is "primary," plus per-type minimum-coverage
   rules.

See `author-declared-primary-category` for the concrete decision this trap resolved.

## How to detect

Any design that tries to DERIVE a single "primary" / "canonical" / "owning" classification from which of
several overlapping buckets an item matches, where the right bucket depends on what the item is
fundamentally about (not just which buckets it touches). The early-warning signal: a classification rule
that gets "fixed" more than once, each time by a different mechanism (a new rule, then a table, then an
ordering), and each fix is immediately defeated by a fresh counterexample rather than converging.

## Related

- [[author-declared-primary-category]] — the decision this trap resolved: primary is declared +
  justified, not derived; completeness is carried by disposition-all + coverage-role minimums
- [[step-back-after-repeated-fixes-on-one-axis]] — the companion process trap: recognizing when repeated
  fixes on one axis mean the goal is wrong, not the patch
