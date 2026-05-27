---
name: dq-anchor-readability
description: DQ-n anchors are defined in sub-step rawdata, not in canonical draft — checklist for Planning to resolve anchors before decomposing tasks.
type: checklists
scope: feature
feature: workflow
status: open
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [dq-anchors, planning, checklist, readability]
domain: process
---

# DQ-anchor readability — DQ-n anchors defined in sub-step rawdata, not in canonical draft

## Context

Codex Aesthetics finding: the design questions (T1-DQ-1, T1-DQ-2, T1-DQ-3, T3-DQ-1 through T3-DQ-4) are defined in `rawdata/sub-step-d-design-iter1.md` but only referenced by anchor name in the canonical draft. A reader of `draft-iter3.md` alone cannot resolve the DQ anchor back to the question text without consulting the sub-step rawdata file.

## Checklist item for Planning

- [ ] Planning: before decomposing T1/T3 tasks, read `rawdata/sub-step-d-design-iter1.md` to resolve DQ anchor meanings — do NOT attempt to re-derive the DQ questions from the anchor names alone.
- [ ] Optional: if Planning creates a DQ index (`dq-anchor-traceability.md` from sibling checklist), copy the question text from sub-step rawdata into that index for cross-session discoverability.

## Deferred

Adding DQ question text directly to the canonical draft was deferred from iter2 and iter3 (the authorized iter3 scope was Fix A/B/C only; DQ readability improvements were out of scope).

## Related

- `evaluation/iter2/codex/aesthetics.md` COD-AESTH-002
- `evaluation/iter3/codex/aesthetics.md` COD-AESTH-002
- `rawdata/sub-step-d-design-iter1.md` (DQ source of truth)
- `rawdata/draft-iter3.md` (anchor-name references only)
