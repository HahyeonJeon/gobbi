---
name: consolidating-per-perspective-verification-tables-narrows-the-union
description: Merging several per-perspective verification tables into one can silently drop distinct verification capabilities.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-14
session: 44971171-d5eb-4834-83fc-ff42e62460a7
tags: [docs-sync, verification]
keywords: [table-consolidation, verification-capability, union-preserve, pointing-frame, per-perspective]
author: claude
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
related: [gate-c-structural-mapping-is-not-semantic-union-preservation, merging-two-seed-bullets-narrows-broader-scope, softening-can-narrow-scope-like-a-merge]
---

# Consolidating per-perspective verification tables narrows the union

## What happened

Rewriting an evaluation doc to a pointing frame, several per-perspective "recommended verifications"
tables (roughly 28 rows spread across 7 perspectives) were consolidated into one shared table (9 rows)
plus a pointer to a generic verification procedure. The consolidation silently dropped four distinct
verification capabilities that no merged row or pointer carried: a first-caller simulation technique
(exercising a function from its signature and docstring alone), a suppression-marker audit (flagging an
unexplained skip, ignore, or xfail), a new-import-vs-manifest dependency audit, and a
wildcard-import/dense-comprehension grep. The source material's union-preserve requirement — do not
drop a verification — was violated by the merge, even though a recommended-verifications table still
existed afterward.

## Why it happens

Consolidating same-kind tables is easy to treat as a structural dedup (cover the same topics with
fewer rows) rather than a UNION-OF-DIMENSIONS preservation. Overlapping rows across the sources (a
shared floor check, a shared signature-inspection technique) mask the non-overlapping capabilities, so
the merged table reads complete while several distinct verification dimensions are gone. Pointing a
generic step at a shared procedure can be the right single-source-of-truth move, but the idiom-specific
capabilities the per-source tables uniquely carried are not automatically re-homed by that pointer.

## How to detect

Any rewrite that consolidates several same-kind tables or lists (verifications, checks, anti-patterns)
into fewer rows. The tell: the merged table has far fewer rows than the sum of its sources, and some
source row named a capability that no merged row or pointer carries. This is the same union-narrowing
family as [[merging-two-seed-bullets-narrows-broader-scope]], recurring at whole-table-consolidation
granularity instead of seed-bullet granularity.

## Correct approach

Before merging same-kind tables, enumerate every source row's capability, then confirm each one
survives in a merged row or is explicitly re-homed to a pointed-at owner — with the pointer naming it by
capability, not just by topic. A structural "fewer rows still cover the topics" check is insufficient;
run a per-capability union audit instead, the same discipline
[[gate-c-structural-mapping-is-not-semantic-union-preservation]] requires at the source-to-target-map
level.

## Related

- [[gate-c-structural-mapping-is-not-semantic-union-preservation]] — the same narrowing gap at
  source-to-target-map granularity
- [[merging-two-seed-bullets-narrows-broader-scope]] — the seed-bullet-level sibling of this
  whole-table-consolidation trap
- [[softening-can-narrow-scope-like-a-merge]] — the hard-to-soft-conversion sibling of the same
  union-narrowing family
