---
name: reharden-edit-blast-radius-miss
description: A set-membership edit updated count statements but missed downstream per-item consumer registers.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-14
session: 44971171-d5eb-4834-83fc-ff42e62460a7
tags: [docs-sync, process]
keywords: [blast-radius, consumer-sweep, count-vs-consumer, checklist-register, re-harden, dual-system-catch]
author: claude
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
related: [fork-decisions-locked, cited-process-mistake-not-applied-to-own-artifact, gate-c-structural-mapping-is-not-semantic-union-preservation]
---

# A set-membership edit needs a consumer sweep, not just a count sweep

## What happened

A user re-hardened 2 items in a locked hard-invariant set mid-artifact, growing the set from 16 to 18
members. The edit updated every COUNT reference to the new total — every section stating "the set has
N members" was corrected to 18 — but missed two CONSUMER locations that each needed a per-item entry
for the new members: a checklist seed register (which needs one check per invariant, and had none for
the 2 new members) and an execution-plan row that still cited the old range. Both gaps were caught only
by a dual-system evaluation — one evaluator caught the stale execution-row reference, the other caught
the missing checklist coverage.

## Why it happens

A set-membership change (grow a locked set from N to N+2) produces two structurally different kinds of
reference in the same document set: COUNT STATEMENTS ("the set has 18 members") and PER-ITEM CONSUMERS
(a register, coverage map, per-doc execution row, or validation gate that needs one entry per member).
Reconciling the count statements feels complete — every stale number gets replaced — but a count match
does not imply a per-item match: a register can correctly say "18 total" while still carrying only 16
individual rows. The mistaken assumption is that fixing the arithmetic fixes the enumeration.

## How to detect

Any time an edit adds or removes an item from a locked set mid-artifact, ask: which files are pure
COUNT statements (grep for the old number, replace with the new one — mechanical), and which are
PER-ITEM CONSUMERS (a register, coverage map, per-doc row, or gate that must carry one entry per set
member — enumerable, not just countable)? A "does the count match" grep passing is not evidence that a
"does every item have its consumer entry" check was ever run. Treat these as two separate sweeps with
two separate verification steps.

## Correct approach

After any set-membership change, run a CONSUMER SWEEP in addition to the count sweep: enumerate every
register, coverage map, per-doc execution row, and validation gate that is supposed to carry one entry
per set member, and check each one lists every current member — not just that its stated total
matches. Dual-system evaluation is what actually surfaces this class of gap in practice — treat "does
every set member have a consumer entry everywhere" as its own explicit review question in future
edits, rather than relying on catching it after the fact.

## Related

- [[fork-decisions-locked]] — the decision that grew the hard-invariant set and triggered this
  consumer-sweep gap
- [[cited-process-mistake-not-applied-to-own-artifact]] — the broader meta-pattern this instance is
  one example of: a discipline named in the artifact was not checked against the artifact's own
  construction
- [[gate-c-structural-mapping-is-not-semantic-union-preservation]] — the sibling union-preservation gap
  at the source-to-target-map level; this trap is the same "count vs. enumerate" gap at the
  set-membership level
