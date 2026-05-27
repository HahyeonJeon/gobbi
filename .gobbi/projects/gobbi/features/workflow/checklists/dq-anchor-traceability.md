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

# DQ-anchor traceability — no stand-alone DQ index, only local trace

## What

The design decisions in the canonical draft cite design-question anchors inline, but there is no stand-alone DQ index document cross-referencing each design question to its resolution. The checklist item for Planning: if a DQ index is needed for decomposition, add a cross-referencing index (design-question anchor → design-decision slug) — optional if Planning can navigate inline from the draft. Planning must NOT re-open any design question already answered in the draft's Decisions Log; the anchors are read-only from Planning onwards.

## Why

A Codex Overall + Consistency evaluation flagged that the inline-only references give sufficient local trace for Planning but leave a cross-session discoverability gap: a future reader cannot find a single map from question to resolution. A DQ index would close that gap if the decomposition needs it.

## Verification

Either Planning navigated the design questions inline from the draft (no index needed), or a DQ index exists cross-referencing each design-question anchor to its design-decision slug; no answered design question was re-opened.

## Status notes

A formal DQ traceability document was scoped out at the time (the authorized scope was a specific fix set only). Status: open — this item surfaces the gap for Planning to decide whether a DQ index is worth creating before decomposition.

## Source

The Codex Overall and Consistency findings and the draft's Decisions Log are preserved in the originating session: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/rawdata/draft-iter3.md`.
