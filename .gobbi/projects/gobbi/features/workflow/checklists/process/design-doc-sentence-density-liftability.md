---
name: design-doc-sentence-density-liftability
description: iter1 finding F-AES-1 — dense multi-clause sentences in the Design/Research sections reduce liftability for a Planner
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [docs-sync]
keywords: [aesthetics, sentence-density, liftability, p7]
author: claude
scenario: workflow-state-record-coherence-design-package
item_status: implemented
anchor: novel
implemented_in: null
---

# Dense multi-clause Design/Research sentences reduce liftability

## What

Several Design/Research sentences in the iter1 draft were dense, multi-clause constructions with
stacked parentheticals (e.g., the D7-002 Rationale chaining minimality, contract-correctness, the
`system` partition, and the alternative's trade-off in one sentence; the I-2 insight sentence spanning
candidate (a)+(b)+D7-004+lossiness in one sentence).

## Why

A Planner lifting these sentences directly into FIX tasks must re-parse the clause structure first,
raising misread risk — past the Principle 7 "one idea per sentence" bar, even though the content
itself is correct and load-bearing for a design doc.

## Verification

Manual read-through of the Design/Research sections in the design package, checking each
Rationale/Insight sentence carries one idea per sentence rather than several chained together.

## Status notes

**Addressed at iter2 (subjective/style)**: the iter2 evaluator noted no placeholder text remained and
sections were tightened; the underlying density observation is a style preference at Low severity,
not a blocking rewrite requirement — the heavy inline `file:line` citation density is load-bearing
for a FIX-design draft, not filler.

## Related

- [[d7-002-runtime-aware-transcript-audit-branch]] — one of the designs whose Rationale prose this finding flagged
