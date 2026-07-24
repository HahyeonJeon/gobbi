---
name: unattributed-moved-primitive-sites
description: A reference to a moved primitive that names neither a path nor "the planning skill" must still be classified, not left implicit.
type: scenarios
scope: feature
feature: workflow
status: active
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [verification]
keywords: [consumer-inventory, unattributed-reference, prose-attribution, classification-gap]
author: claude
---

# An unattributed moved-primitive reference must be explicitly classified, not left implicit

**Category:** edge-case
**Coverage:** partial

## Situation

A consumer-migration inventory (built during a workflow-doc split) classifies every reference to
moved content into two buckets: an "expects-moved" consumer (repoint it) and a "non-consumer"
(leave it, with a stated reason). Some references to a moved primitive carry neither a literal path
to the source document nor a prose attribution phrase ("the planning skill", "per the X skill") — they
simply mention the primitive's NAME (e.g. "Sub-step E self-review", a task-spec field list). The
iter-6 Claude evaluator found two such sites in the Planning split: `agents/leader.md:100` ("Sub-step
E self-review clean") and `execution/SKILL.md:89` (the task-spec field list plus "Sub-step D"). Both
name primitives in the plan's own moved-content set, but neither appeared in the 9-row moved-content
inventory NOR in the "Compatibility owner and non-consumer surfaces" table — they were simply
unclassified, distinguishable from a genuinely missed consumer only by close reading.

## Inputs

- A completed consumer-migration inventory built from literal-path and prose-attribution search forms.
- A moved-primitive NAME list (the set of terms whose presence a downstream document mechanically
  depends on, independent of path or attribution wording).
- The set of documents outside the primary literal-path / prose-attribution search scope (here:
  `agents/leader.md`, `execution/SKILL.md`).

## Expected behavior

Every hit for a moved-primitive NAME — not just every hit for a literal path or a prose attribution
phrase — must receive an explicit classification: either added to the expects-moved inventory (with a
repoint plan), or added to the non-consumer table with a stated reason it needs no edit. An
unclassified hit that "happens to still be true" after the migration (because a downstream mechanism
independently guarantees the primitive's continued presence) is not equivalent to a classified
non-consumer — the next reader cannot tell "verified safe" from "simply missed."

## Verification

`mistakes/refactor/enumerate-all-restatements-and-classify-deferral-before-claiming-map-complete.md`
requires every hit surfaced by a broad sweep to carry an explicit classification before a completeness
claim is made. Concretely for this instance: run the 5-form search (literal path, prose attribution,
directory form, bare backticked token, moved-primitive NAME list) across the full document scope
(`skills/`, `agents/`, `rules/`, `scripts/`, root docs), and confirm every hit from the NAME-list form
specifically has a row in either the expects-moved inventory or the non-consumer table — not merely
that the underlying fact happens to stay true. In this instance, both sites remain resolvable because
task 03's acceptance loop mechanically requires `Sub-step A`..`Sub-step E` and all eight task-schema
field names to be present in the folded workflow document — a genuine safety net, but one that was
itself unverified against these two specific sites until the iter-6 evaluator checked it directly.

## Related

- [[proj-6-001-union-diff-obligation-not-gate]] — a sibling finding from the same evaluator pass,
  about a different named-primitive coverage gap in the same plan
- `mistakes/refactor/enumerate-all-restatements-and-classify-deferral-before-claiming-map-complete.md`
  — the recorded trap this scenario generalizes
