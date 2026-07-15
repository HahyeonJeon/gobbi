---
name: gate-c-structural-mapping-is-not-semantic-union-preservation
description: A source-to-target coverage map proves structural completeness, not that each destination preserves the source's conditions.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-14
session: 44971171-d5eb-4834-83fc-ff42e62460a7
tags: [docs-sync, verification]
keywords: [gate-c, union-preservation, structural-vs-semantic, consolidation, coverage-map]
author: claude
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
related: [merging-two-seed-bullets-narrows-broader-scope, softening-can-narrow-scope-like-a-merge, consolidating-per-perspective-verification-tables-narrows-the-union]
---

# A source-to-target coverage map is a structural check, not a semantic one

## What happened

A consolidation check verified that every source condition had a destination row (a complete
source-to-target map, zero unmapped) and reported union scope preserved. But several destinations kept
only the broad topic and dropped the source's named special cases — for example, specific performance
idioms (set/dict membership, streaming vs materialization), a composition-over-inheritance rule, an
equality/hash-consistency rule, and a cross-surface synchronization rule. Two independent evaluators
(one at FAIL/Critical, one at REVISE/High) caught the drop by direct source-to-target close-reading;
the map itself did not.

## Why it happens

The check was implemented as a STRUCTURAL check (does a mapping row exist for every source?) rather
than a SEMANTIC check (does the destination enumerate every condition the source named?). A row that
says "covers style" satisfies the structural map even when the destination drops a named special case
(for example a pathlib- or membership-specific condition) the source bullet listed.

## How to detect

Any consolidation or merge that uses a source-to-target map. If the map only records source-id to
target-id (a topic mapping) and the "union preserved" claim rests on the map being complete, the
semantic check was skipped. A merged or consolidated destination that reads shorter than the sum of its
sources is a red flag.

## Correct approach

Make the coverage check SEMANTIC: for each destination, list the source conditions it absorbs and
confirm the destination text enumerates each one — the general subject plus every named special case —
not just that a mapping row exists. Add a "restored/preserved conditions" table that maps each source
CONDITION (not just each source id) to the destination clause that carries it. This is the
[[merging-two-seed-bullets-narrows-broader-scope]] trap recurring at the map level; it reinforces
running both evaluator systems on any compaction, since a structural check alone has repeatedly missed
this class of drop.

## Related

- [[merging-two-seed-bullets-narrows-broader-scope]] — the seed-bullet-level sibling of this map-level
  trap
- [[softening-can-narrow-scope-like-a-merge]] — the same union-narrowing failure on hard-to-soft rule
  conversions
- [[consolidating-per-perspective-verification-tables-narrows-the-union]] — the same failure at
  whole-table-consolidation granularity
