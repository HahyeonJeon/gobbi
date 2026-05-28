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

# DQ-anchor readability — design questions defined in rawdata, not in the canonical draft

## What

The design questions for the T1 and T3 task waves are defined in the Ideation sub-step-D rawdata file but only referenced by anchor name in the canonical draft. A reader of the canonical draft alone cannot resolve a design-question anchor back to its question text without opening the sub-step rawdata file. The checklist item for Planning: before decomposing the T1/T3 tasks, read the sub-step-D rawdata to resolve the anchor meanings rather than re-deriving the questions from anchor names; optionally, if Planning builds a DQ index (see the sibling `dq-anchor-traceability.md`), copy the question text from rawdata into that index for cross-session discoverability.

## Why

A Codex Aesthetics evaluation flagged that anchor-name-only references make the canonical draft unreadable in isolation — the reader has to chase the question text into a separate rawdata file. Resolving the anchors at Planning time prevents the decomposition from acting on misremembered question text.

## Verification

Planning has read the sub-step-D rawdata and decomposed the T1/T3 tasks against the resolved question text (not anchor names alone); if a DQ index was created, it carries the question text inline.

## Status notes

Adding the design-question text directly to the canonical draft was deferred because the authorized fix scope at the time was limited to a specific set of fixes; DQ readability improvements were out of that scope. Status: open — for Planning to act on at decomposition.

## Source

Ideation evaluation (Codex Aesthetics) and the design-question source of truth are preserved in the originating session: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/rawdata/sub-step-d-design-iter1.md`.
