---
name: manager-locked-decision-without-audit-trail-sync
description: The manager folded a user decision into the deliverable artifact but did not sync the discussion-log and the Integration-Log disposition — two session artifacts then contradict on the load-bearing fact
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [verification, process, evaluation]
keywords: [discussion-log, audit-trail, locked-decision, integration-log, CONSIST-1, principle-9]
author: claude
priority: critical
domain: process
---

# Manager locked a user decision into an artifact without syncing the audit trail

## What happened

The manager asked the user the D1 topology decision via the user-decision primitive, got the answer
(keep Option A; defer consult), and had the producer fold "DECIDED by the user / LOCKED" into the
canonical draft — but did NOT (a) write the canonical `working/discussion-log.md` entry recording the
decision, and (b) update the contemporaneous Integration Log row #13 whose disposition still read
`escalated` ("neither system decides"). The dual-system evaluation (Claude CONSIST-1 Critical/100 and
Codex COD-CONS-1) caught the resulting contradiction: two session artifacts disagree on the single
most load-bearing fact, and the user-decision audit artifact is absent. The loop verdict was FAIL.

## Why it happens

The manager assumed that recording a decision in the deliverable artifact is sufficient, and that the
discussion-log / Integration-Log disposition are bookkeeping that can lag. In gobbi the
`discussion-log.md` IS the canonical user-decision audit trail (`record-map.md`); an artifact claim
of "user decided" is unevaluable — and a Consistency defect — unless the contemporaneous record
evidences it. This is Principle 9 (everything that must change together must change together) applied
to a decision: draft + discussion-log + Integration-Log disposition are one change set.

## Correct approach

Maintain `working/discussion-log.md` INCREMENTALLY — write the entry at the moment of each
user-decision call (class + question + answer), not retroactively. When folding a resolved escalation
into an artifact, update the same change set atomically: (1) the artifact's decision state, (2) the
discussion-log entry, (3) the disposition of the record that surfaced the gap (Integration Log row /
eval finding). Treat the three as one Principle-9 co-edit.

## How to detect

Any time the manager resolves an Always-Ask escalation (Design / Scope / Destructive) and folds the
answer into an artifact: if there is no `working/discussion-log.md` entry for that user-decision call
AND the upstream record that surfaced the gap (the Integration Log row, the eval finding disposition)
still says "open / escalated", the audit trail is out of sync — that is the trap firing.

## Related

- [[freeze-producer-artifact-before-evaluating]] — sibling verification-discipline trap
- [[dual-eval-caught-managers-own-audit-gap]] — the learning this mistake demonstrates
