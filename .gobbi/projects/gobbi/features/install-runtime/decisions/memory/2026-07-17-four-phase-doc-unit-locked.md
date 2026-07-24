---
name: four-phase-doc-unit-locked
description: The startup interview's confirmed-synthesis unit is the four topics.md interview phases (I-IV), each writing a record-level phase document at phase close.
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-17
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [design, process]
keywords: [phase-doc, doc-unit, doc-home, recap-fold, startup]
author: claude
supersedes: null
superseded_by: null
related: []
---

# Doc unit = the four `topics.md` interview phases; doc home = the session record; recap fold replaces the single pre-promotion pass

## Context
The startup interview currently confirms understanding at two granularities only: 11 fine-grained per-topic
Level-1 checkpoints, and one coarse, late pre-promotion synthesis-in-sections recap (`topics.md:538-541`, a
200-300-word heuristic run once at the very end). Neither catches cross-topic drift at a natural mid-interview
boundary. The user's own trigger explicitly asked for "the interview and discussion result ... written as
document after finishing each phase."

## Decision
The confirmed-synthesis unit is the four `topics.md` interview phases — Phase I (Problem space), Phase II
(Boundary), Phase III, Phase IV (Guardrails) — the phase boundaries already exist as `topics.md` headings
(`:94`/`:186`/`:232`/`:387`; no new grouping invented). Each phase closes with one written, user-confirmed
document. The document's home is the session record directory (`working/phase-results/{phase}.md`) —
record-level, gitignored, never a promotion source. The four phase documents REPLACE the single
pre-promotion synthesis-in-sections pass entirely (recap fold = YES); the synthesis step (`SKILL.md` P4)
consumes the four confirmed documents instead of re-deriving four phases from fine-grained events in one
late pass.

## Rationale
The four phases are the user's own custom answer (A1, verbatim: "Phase I — Problem space, Phase II —
Boundary .. Phase IV — Guardrails"), not a producer invention — using the existing heading structure keeps
the change minimal (Bottom-Up Construction: grow the existing recap into four smaller, earlier gates rather
than inventing a new grouping). Record-level placement (A2, user's custom answer: "session record
directory") keeps the promotion/memory boundary intact — no `record-map.md` change needed, since
`record-map.md:271-282` already hands the entire `startup/` interior to `recording.md §3`. The recap fold
was accepted (not merely proposed) because it relocates an EXISTING pass rather than adding a fifth
mechanism — "the number of recap MECHANISMS does not grow, though executed confirmation GATES do" (the
accepted cost of catching drift early).

## Alternatives considered
- **Per-topic phase docs (11 documents, one per Level-1 topic)** — rejected as too fine; the fine-grained
  checkpoints already exist and adding a document per topic would not add a new confirmation altitude.
- **Keep the single late recap, add nothing** — rejected; this is the status quo the user explicitly asked
  to change.
- **A durable/promotable phase-doc home** — rejected; would expand the memory/promotion boundary
  unnecessarily for a working synthesis artifact that the source register already resolves back to the
  ledger.

## Consequences
`recording.md §3`'s session-tree gains `working/phase-results/{phase}.md` (4 files); §1's four-layer capture
model is renamed five-layer. `SKILL.md` gains four phase-close gates (after Topic 3, after the Topic 4
premise gate, after Topic 8, after Topic 11) each blocking the next unit until confirmed, plus P4
must-not teeth (must not infer / strengthen / omit-contradiction / treat-prose-as-independent-evidence /
stage-or-promote / rerun a fifth recap). `topics.md:538-541`'s single pass is deleted, its unrelated
traversal + 11-checkpoint resume anchors (`recording.md §12`) preserved.

## Related

- [[ip1-phase-doc-supplement-gate]] — the confirmation-mechanism decision (IP-1-A) this doc-unit decision is paired with
