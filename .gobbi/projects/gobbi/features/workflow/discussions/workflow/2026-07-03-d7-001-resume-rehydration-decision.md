---
name: d7-001-resume-rehydration-decision
description: Split fresh Configuration initialization from resume rehydration, with validated persisted state.json continuation
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process]
keywords: [resume, fresh-init, state-json]
author: claude
outcome: Split fresh-init from resume + validated rehydration; fail-safe to a user decision on inconsistent state, never a silent Ideation reset
---

# GEN-D7-001 remediation

## Context

GEN-D7-001 found that resuming a session unconditionally re-stamps `workflow.ideation.state="Active"`
and re-enters Ideation (`gobbi/SKILL.md:102-104`, `orchestration/SKILL.md:107` row 4), clobbering a
persisted Planning/Execution active state — even though `state.json` is documented elsewhere as the
resume recovery source.

## Question

Should the Configuration flow only guard row 4 (the Ideation stamp), or should fresh initialization
be split from resume rehydration entirely, with `state.json` read and validated on resume?

## Options considered

- **"Guard row 4 only"** — rejected as insufficient; gobbi §6 still unconditionally forces Ideation
  entry even if row 4 is fixed.
- **Split fresh-initialization from resume-rehydration + validated rehydration (chosen)** — on
  resume, read + validate `state.json` (invariants: exactly one Active/Revising step; earlier steps
  Done/Skipped; later steps not Done unless after the active step; mode matches settings), continue
  the persisted step, fail-safe to a user decision (never a silent Ideation reset).

## User decision

Split fresh-init from resume + validated rehydration, with the 4 concrete resume-validation
invariants above (invariant 4, mode, later refined at iter2 to tolerate a legitimate user-driven
mode reconfigure at resume rather than always halting).

## Implication

`orchestration/SKILL.md` Step 1 splits into fresh rows vs. a resume-rehydration row;
`gobbi/SKILL.md` §6 gains a resume branch; `orchestration/auto-mode.md:64`'s hardcoded row
enumeration needs updating so it doesn't carry stale Configuration guidance after the split.

## Related

- [[d7-001-split-fresh-init-resume-rehydration]] — the design this decision shaped
- [[resume-mode-reconfigure-must-not-false-halt]] — the iter1 risk finding this decision's invariant-4 refinement resolved
