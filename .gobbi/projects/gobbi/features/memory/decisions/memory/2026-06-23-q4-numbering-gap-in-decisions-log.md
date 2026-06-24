---
name: q4-numbering-gap-in-decisions-log
description: Q4 is absent from the Decisions Log (Q1/Q2/Q3/Q5/Q6) with no explanation; deferred as low-priority aesthetic gap.
type: decisions
scope: feature
feature: memory
status: accepted
created: 2026-06-23
session: d0185dba-cd9b-45ad-93f6-7814c4f0ef4a
tags: [memory, ideation]
keywords: [numbering-gap, decisions-log, Q4, aesthetics]
author: claude
supersedes: null
superseded_by: null
---

# Q4 numbering gap in Decisions Log (F-A1)

## Context

The Decisions Log in draft-iter2.md lists Q1, Q2, Q3, Q5, Q6 — but never Q4. iter2 introduced Q6, widening the gap. A Planner reading the log cannot tell if Q4 was merged into another decision, dropped, or simply omitted.

## Decision

Accept as low-priority aesthetic gap. No redesign at Ideation. Planner/Executor should add a one-line note in the design doc acknowledging the Q4 gap ("Q4 was folded into Q2/Q3 during DISCUSSION" or similar), or renumber if convenient during Execution.

## Rationale

Low severity (Aesthetics/Low per evaluation). Does not affect any design decision correctness. The Planner can resolve it without reopening Ideation.

## Alternatives considered

- Fix now in iter2: minimal value; no Ideation decision is lost.
- Renumber Q5→Q4 and Q6→Q5: risks confusion in references that already use Q5/Q6.

## Consequences

Planner/Executor owns resolving the gap. If left unaddressed, a future reader may question whether a decision was lost.

## Related

- [[ideation-area-tag-vocabulary]] — the artifact this finding refers to
