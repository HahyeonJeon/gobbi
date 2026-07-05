---
name: enumerate-all-restatements-and-classify-deferral-before-claiming-map-complete
description: Before claiming an affected-file map complete, enumerate every semantic restatement of the contract and classify each as deferral vs. independent
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [refactor, docs-sync]
keywords: [affected-file-map, co-touch-enumeration, deferral, exit-checklist]
author: claude
priority: high
domain: docs-sync
---

# Enumerate every semantic restatement and classify deferral-vs-independent before claiming an affected-file map complete

## What happened

The GEN-D7-002 affected-file map was declared "complete" twice, and both times it was missing
sites: iter1 named only `record/SKILL.md:191` (Codex's Structure evaluator caught the miss — 4
unconditional transcript-copy contract surfaces at `orchestration/SKILL.md:177`,
`record/SKILL.md:198`/`:253`, `record/record-map.md:158-162`). iter2's map added those 4 surfaces and
the finding-application log again claimed "D7-002 map completeness" — but a tree-wide grep found the
SAME contract restated as per-loop RECORD exit-checklist gates in 4 separate skill docs
(`ideation/SKILL.md:457`, `planning/SKILL.md:453`, `preparation/SKILL.md:386`,
`execution/SKILL.md:241`) plus 2 descriptive lines in `orchestration/workflow/record.md` — none in
the map (finding F-STRUCT-D7-002-MAP-INCOMPLETE-2, High/50).

## Why it happens

A "complete" affected-file map is validated against the specific sites the LAST review round
mentioned, not against every place the target contract phrase could plausibly recur. Each round's
grep was scoped to the sites already known to be wrong, so it correctly confirmed those were fixed —
but a scoped grep cannot discover a NEW restatement class (per-loop exit checklists) that the review
round hadn't yet named. Declaring the map "complete" after satisfying the known list, without a
broader enumeration pass, repeats the exact gap the map is supposed to close.

## Correct approach

Before claiming an affected-file map complete for any cross-cutting contract, enumerate every
semantic restatement of the contract by concept — grep case-insensitively for the contract's
characteristic phrasing across the WHOLE tree, not just the sites a prior review round named — and
classify each hit as either (a) an independent site needing its own edit, or (b) a site that DEFERS to
the primary edit (e.g., because its containing section explicitly names the primary doc as the
canonical procedure it does not re-derive). Only declare the map complete once every hit has an
explicit classification, and widen the validation grep to span every classified location so a
survivor is mechanically detectable, not just asserted absent.

## How to detect

Any time an affected-file map or a "this contract is now consistent everywhere" claim is validated
only against the specific line numbers a prior finding named, rather than against every occurrence of
the underlying CONCEPT (found via a broad, case-insensitive grep for the contract's characteristic
phrasing across the whole tree). A second round of the SAME "map completeness" claim recurring for
the SAME finding is itself a signal that the enumeration method, not just the map's content, needs to
change.

## Related

- [[d7-002-runtime-aware-transcript-audit-branch-shipped]] — the design this mistake's recurrence was found in and resolved for
- [[d7-002-per-loop-exit-checklist-transcript-gates]] — the checklist_gap finding this recurrence produced
- [[cotouch-enumeration-must-cover-semantic-equivalents]] — the sibling trap in this same area
