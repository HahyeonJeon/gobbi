---
name: dq-anchor-traceability
description: No DQ index exists; F1/Fix-decision sections provide local trace only — checklist for Planning to decide if a DQ index is worth creating.
type: checklists
scope: feature
feature: workflow
status: open
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [dq-anchors, planning, checklist, traceability]
domain: process
---

# DQ-anchor traceability — no DQ index; F1/Fix-decision sections provide local trace only

## Context

Codex Overall + Consistency finding: the design decisions in `draft-iter3.md` cite T-DQ-N anchors inline but there is no stand-alone DQ index document cross-referencing each design question to its resolution. For Planning, the F1/Fix-decision section provides sufficient local trace; the gap is in cross-session discoverability.

## Checklist item for Planning

- [ ] Planning: if a DQ index is needed for Planning decomposition, add a `staging/design/dq-index.md` file cross-referencing DQ-n anchors → design decision slugs. This is optional if Planning can navigate inline from the draft.
- [ ] Planning should NOT re-open any DQ that is already answered (per draft-iter3.md Decisions Log); the DQ-anchors are read-only from Planning onwards.

## Deferred

A formal DQ traceability document was scoped out of iter3 (authorized scope: Fix A/B/C only). This checklist item surfaces the gap for Planning to decide if a DQ index is worth creating before decomposition.

## Related

- `evaluation/iter2/codex/overall.md` COD-OVERALL-004
- `evaluation/iter3/codex/overall.md` COD-OVERALL-004
- `evaluation/iter3/codex/consistency.md` COD-CONS-002
- `rawdata/draft-iter3.md` Decisions Log (Sub-step A through D)
