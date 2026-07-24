---
name: ip1-phase-doc-supplement-gate
description: IP-1 = Option IP-1-A "supplement + gate" — phase docs consume the phase's confirmed Level-1 checkpoints + ledger and add a REAL, separate user agree/disagree gate at phase close.
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-17
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [design, process]
keywords: [ip-1, supplement-and-gate, real-confirmation, confirmation-fatigue, startup]
author: claude
supersedes: null
superseded_by: null
related: [four-phase-doc-unit-locked]
---

# IP-1 = Option IP-1-A "supplement + gate": real, separate phase-close confirmation atop the retained Level-1 checkpoints

## Context
Three options were on the table for how a phase document relates to the existing 11 Level-1 checkpoints:
(A) supplement + gate — phase docs consume the checkpoints/ledger and add a new, separate confirmation gate;
(B) replace the checkpoints with phase-level-only confirmation; (C) some other relation. The design-gate
adjudication (D-1) selected (A) and rejected (B)/(C).

## Decision
IP-1 = Option IP-1-A. Each phase document is written from the phase's COMPLETE current ledger event set,
presented to the user, and closed with a SEPARATE agree/disagree response — never inferred from the
constituent Level-1 checkpoint confirmations, from silence, from the Phase II premise-gate result, or from
a later approval. Only on agreement does phase status become confirmed and the next topic/phase open. The
11 Level-1 checkpoints are RETAINED as the resume anchors (`recording.md §12`) — IP-1 supplements them with
a coarser, phase-level gate; it does not replace or weaken them.

## Rationale
The Level-1 checkpoints already do fine-grained, per-topic confirmation well; the gap the user's trigger
names is a MISSING mid-interview cross-topic synthesis gate, not a broken per-topic gate. Supplementing
(keep both altitudes) closes the gap without discarding working machinery — consistent with Principle 2
(bottom-up construction: grow the existing structure, don't replace it wholesale). A confirmation inferred
from anything other than a genuine separate response would be "confirmation theatre" (an agent could set
`confirmed` without showing the document) — the design's own steel-man argument against IP-1 names this
risk explicitly; the mitigation is a SEPARATE agree/disagree response evidenced by the raw
`discussion-log.md` plus a `confirmation_ref` marker, with an adversarial case (SA-1) that fails a
checkpoint-sourced `confirmation_ref`.

## Alternatives considered
- **Option IP-1-B (replace checkpoints with phase-level-only confirmation)** — rejected by the user at the
  design gate (D-1); would lose the fine-grained per-topic resume anchor the ledger already relies on.
- **Option IP-1-C** — rejected; not selected at the design gate (specific alternative not separately named
  in the locked record — D-1 is a two-way choice between A and "not A" as recorded).
- **No new gate at all (status quo)** — rejected; this is exactly the gap the user's trigger identifies.

## Consequences
`recording.md` gains the phase-doc contract (record-level lightweight frontmatter — phase identity + gate
state + `confirmation_ref`, NOT memory frontmatter — plus the disagreement loop: append correction events,
reopen the earliest owning branch, regenerate idempotently, invalidate downstream, re-ask). Confirmation
fatigue is an accepted, named cost (four real gates atop 11 checkpoints); the recap fold (see
`four-phase-doc-unit-locked`) keeps the MECHANISM count from also growing.

## Related

- [[four-phase-doc-unit-locked]] — the doc-unit decision this confirmation mechanism gates
