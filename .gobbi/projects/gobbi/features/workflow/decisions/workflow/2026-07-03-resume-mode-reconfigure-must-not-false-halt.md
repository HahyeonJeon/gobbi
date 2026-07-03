---
name: resume-mode-reconfigure-must-not-false-halt
description: iter1 finding F-RISK-1 — D7-001's mode-matches-settings resume invariant must tolerate a legitimate user-driven mode reconfigure
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process]
keywords: [f-risk-1, resume, mode-reconfigure, needs-context]
author: claude
related: [d7-001-split-fresh-init-resume-rehydration-shipped]
---

# D7-001 resume-validation invariant #4 must tolerate a legitimate mode reconfigure

## Context

The iter1 draft's D7-001 resume-validation invariant #4 ("`mode` matches settings") halted to
NEEDS_CONTEXT on any mismatch between persisted `state.json.mode` and the resolved
`settings.json.mode`. The Claude Risk evaluator (finding F-RISK-1, Medium/50) noted `gobbi/SKILL.md:78`
explicitly permits a user to "reuse or reconfigure" settings on an existing-settings resume — a
reconfigure can legitimately change `mode`, which the invariant as originally stated would treat as an
inconsistency and halt on, even though the change is user-intended and safe.

## Decision

Invariant #4 is refined: validate `state.json.mode` against the CURRENT (possibly reconfigured)
`settings.json`. A user-intended mode change is legitimate — re-stamp `state.json.mode` to match and
keep the active step; do NOT halt. Halt to NEEDS_CONTEXT only when the broader invariants (exactly one
Active/Revising step; earlier steps Done/Skipped; later steps not Done unless after the active step)
are genuinely violated.

## Rationale

`gobbi/SKILL.md` §3 already documents the reconfigure path as a supported operation; an invariant that
halts on it would make a routine, sanctioned action produce a false NEEDS_CONTEXT interruption on
every resume where the user changes mode. The fix keeps the invariant's purpose (catch a genuinely
inconsistent `state.json`) while removing its false-positive trigger.

## Alternatives considered

- **Leave the invariant as originally stated** — rejected; it would annoyingly-but-safely halt on a
  legitimate operation, and the draft never reconciled the two paths, leaving the interaction
  undocumented and untested.
- **Forbid mode reconfigure at resume entirely** — not considered viable; `gobbi/SKILL.md` already
  documents reconfigure as supported, so removing it would be an unrelated behavior change outside
  this loop's scope.

## Consequences

The iter2 evaluator verified `gobbi/SKILL.md` §3 permits the reconfigure path this refinement
accounts for, and the design's dry-run scenarios now explicitly cover both the reconfigure-succeeds
and the genuinely-inconsistent-halts cases.

## Related

- [[d7-001-split-fresh-init-resume-rehydration]] — the design this decision refines
