---
name: phase-boundary-supersede-contract-fix
description: T6/T7/T8 phase-A/phase-B once-only guards made the note's own supersede contract inert; readers are now last-row-wins and the once-only guards are removed
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, verification]
keywords: [f3-risk-01, f2-risk-01, last-row-wins, migrate-before-add, phase-a-phase-b, exec-base-exception]
author: claude
supersedes: null
superseded_by: null
related: [t9-duplicate-item-gate-fix, six-file-lock-untracked-file-detection]
---

# Phase boundaries now honour their own append-only supersede contract

## Context

The evidence note's own contract promises a correction appends a SUPERSEDING row, never a rewrite. At iter2,
phase A refused to re-close (a once-only guard) and phase B read the FIRST row — so a correction discovered mid-
migration left three bad options: a blocked re-run, a hand-deleted row (breaking append-only), or stale phase
evidence being used downstream (`F2-RISK-01`, High/100).

## Decision

Removed the once-only guards; every phase/trial reader is now last-row-wins (the last recorded terminal per
name is authoritative). `EXEC_BASE` is the ONE stated exception — it is asserted exactly-once, because
superseding it would silently re-base the landing proof.

## Rationale

Migrate-before-add does NOT weaken: phase A's own PROJ-08-absent check independently fails a re-run attempted
AFTER the addition, so removing the once-only guard does not reopen the property it protected. Fixture-verified
both ways: a legitimate re-close after a correction now exits 0 (appending a superseding row); a re-close
attempted after PROJ-08 was written still exits 1.

## Alternatives considered

- **Keep the once-only guard and add a separate "unlock" mechanism for legitimate corrections** — rejected: adds
  a second state machine to reason about instead of relying on the append-only log's own last-row-wins
  semantics, which is simpler and already the note's stated contract.

## Consequences

Any future phase-boundary reader (T6, T7, T8, and any Execution-time repair) MUST read the LAST matching row,
never the first — `awk -F'\t' '$1=="TYPE"{v=$2} END{print v}'`, never a first-match short-circuit. `EXEC_BASE`
stays the sole singleton exception, asserted exactly-once by both T1 and T9.

## Related

- [[t9-duplicate-item-gate-fix]] — a sibling gate-soundness fix in the same finding family
- [[six-file-lock-untracked-file-detection]] — the sibling risk-perspective fix (untracked-file blindness)
