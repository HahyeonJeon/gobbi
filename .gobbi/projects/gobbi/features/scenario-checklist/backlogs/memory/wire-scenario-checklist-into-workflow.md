---
name: wire-scenario-checklist-into-workflow
description: Per-phase pointer wiring + a conformance sweep of the 6 bundles / 12 scenario+checklist docs, deferred out of this Ideation's Scope Contract.
type: backlogs
scope: feature
feature: scenario-checklist
status: deferred
created: 2026-07-16
session: 59694f66-422a-4fd5-b93b-625c2f354fc3
tags: [design, process]
keywords: [pointer-wiring, conformance-sweep, scenario, checklist, runtime-ownership]
author: claude
priority: medium
project-scope: false
shipped_in: null
---

# Wire the `scenario`/`checklist` SOP skills into the workflow

## Context

The locked Ideation design (`outputs/design.md`) authors two new standalone SOP skills —
`scenario/SKILL.md` and `checklist/SKILL.md` — but the Scope Contract (§1, Option A relationship,
`four-ideation-forks`) explicitly excludes wiring them into the live workflow: this session, the two
skills are a discoverable **authoring reference** only. No phase reader loads them, and the 6 existing
phase bundles (5 loops' `scenario.md`/`checklist.md` + the non-loop Startup) remain the SOLE runtime
source until this deferred work is picked up (design draft §7 "Interim ownership", §8 "Deferred
follow-ups").

## Why deferred

Bundling the wiring into this Ideation would have expanded the Scope Contract into a cross-cutting edit
of 6 existing phase bundles plus `evaluation.md`, which the Out-of-Scope section explicitly forbids
("zero semantic change to the eval bundle"). The user chose Option A (additive now, wiring deferred)
over Option B (immediate wiring) specifically to keep this session's no-touch gate meaningful — see
`four-ideation-forks`.

## When to pick up

No hard prerequisite — the two skills already exist and are complete once Execution ships them
(`scenario/SKILL.md` first, then `checklist/SKILL.md`, per the locked authoring order). Pick this up any
time after Execution ships both skills; there is no dependency on other in-flight work.

## Suggested approach

Two components, from the design draft's own §8:

1. **Per-phase pointer wiring** — add a one-line "authored per the `scenario`/`checklist` SOP" pointer
   to each of the 6 `scenario.md` + 6 `checklist.md` docs across the 6 bundles (5 loops: execution,
   ideation, planning, preparation, wrap-up; plus the non-loop Startup; note `coding`/`python` carry only
   `evaluation.md`, no scenario/checklist pair), plus caller load/reference actions at the points that
   actually consume them (Ideation, Planning, Evaluation Stage 1, Startup). This does NOT change the
   nine-output contract or P6.5 — it only adds pointers.
2. **Conformance sweep** — migrate/verify the 6 bundles against the new SOP's model under a
   no-narrowing union check (the existing bundles must not lose any coverage the new SOP formalizes).

A bounded contingency noted alongside these two (not itself deferred work, but flagged for the picking-up
session to weigh): if a `SKILL.md` exceeds the length norm once the inline catalogs are in place, an
optional `templates/` child doc or the P3(b) lookup child may be needed — this touches the locked
"no child docs" scope from this Ideation, so surface it to the user before adding either child.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-16-59694f66-422a-4fd5-b93b-625c2f354fc3/`

## Related

- [[four-ideation-forks]] — the Option A decision that deferred this wiring
