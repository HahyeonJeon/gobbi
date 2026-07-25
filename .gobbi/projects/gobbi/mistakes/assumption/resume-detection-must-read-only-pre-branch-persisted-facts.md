---
name: resume-detection-must-read-only-pre-branch-persisted-facts
description: A resume-detection predicate must never depend on a field the branch it gates stamps only after the branch runs
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process, assumption]
keywords: [resume-detection, previousSessionId, circular-predicate, state-clobber, GEN-D7-001]
author: claude
priority: critical
domain: process
---

# Resume detection must read only facts persisted before the branch it gates

## What happened

GEN-D7-001's fix split fresh-session initialization from resume-rehydration in
`workflow/SKILL.md`'s Configuration procedure (row 4 fresh / row 4R resume). The resume signal
this fix used required `session.json.previousSessionId` to be non-null. But `previousSessionId` is
stamped at row 5 — after the row 4 / row 4R branch has already been chosen — and the session
template seeds it as `null`. A session's FIRST resume (after startup / `/clear` / compaction) has
valid `settings.json`, valid `state.json`, and a healthy worktree, but still carries
`previousSessionId: null` from its original row-5 stamp. That resume was misclassified as fresh,
which reintroduced the exact row-4 Ideation re-stamp / state-clobber defect GEN-D7-001 was written
to fix. Both the Claude and Codex Execution-loop evaluators independently caught this at iter1
(Codex: findings O1/P1/R1/C1/U1, Critical, confidence 85) before any user or downstream session hit
it live.

## Why it happens

A detection predicate that depends on a field only written by the very branch it selects between is
circular: the field cannot yet hold the value needed to choose correctly on the case that matters
most (a session's first resume). This slipped through because `previousSessionId` reads as a
plausible resume signal in isolation ("if there's a prior session id, this must be a resume") without
tracing when in the row sequence that field actually becomes valid. The mistake is choosing a
POST-branch artifact as the PRE-branch classifier.

## Correct approach

A fresh-vs-resume (or any pre-branch) detection predicate must depend only on facts already
persisted BEFORE the branch it gates runs — never a field the branch itself later stamps. For
Configuration's row 4 / row 4R split, the corrected signal reads three pre-existing facts: (1)
`settings.json` exists, (2) `state.json` exists with a non-`configuration` step in `Active` or
`Revising` state, and (3) the row-1 worktree guard is not in the "orphaned" state. `previousSessionId`
is demoted to post-classification telemetry — stamped at row 5 as a record of what happened, never
read as an input to what should happen.

General rule: before wiring any classifier / detection predicate, list every field it reads and
confirm each one is durably set BEFORE the code path that consumes the predicate's answer. If a
field is written by the same procedure that branches on the predicate, it cannot be a safe input to
that predicate.

## How to detect

Any fresh-vs-resume (or similarly branching) classifier that cites a field also listed as "stamped
at row N" where row N is inside or after the very branch the classifier selects. Trigger phrase: "if
this field is set, treat it as X" where the same procedure's later steps are the only writer of that
field. Grep the classifying condition's referenced fields against the write-sequence table for the
same procedure; any field whose only writer appears at a row equal to or later than the branch row
is a circular predicate.

## Related

- [[documented-session-path-must-be-scaffolded-and-verified]] — the sibling design-flaw fix from the
  same Execution loop's iter1→iter2 correction cycle
- [[d7-001-split-fresh-init-resume-rehydration-shipped]] — the design this circular-predicate fix corrected
