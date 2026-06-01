---
name: guardrails
description: The 13 Iron Laws plus the mistake-capture-and-learn loop that keep agents in scope, verifying claims, and not repeating known traps.
type: features
scope: feature
feature: guardrails
status: active
created: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [iron-laws, mistake-capture, behavioral-floor]
value_proposition: "The 13 Iron Laws plus the mistake-capture-and-learn loop that keep agents in scope, verifying claims, and not repeating known traps."
subsystems: [principles, mistake]
---

# Feature: Guardrails

The 13 Iron Laws plus the mistake-capture-and-learn loop that keep agents in scope, verifying claims, and not repeating known traps. This is one of the 7 capability value-features the memory-system redesign ratified (memory-system-redesign design doc §1.2). Iron Law #13 (no document work without a spec and a CRUD plan) is the principle this feature most recently added.

## Overview

`guardrails` unites gobbi's behavioral floor (the Iron Laws) with its learning loop (mistake capture and two-layer promotion): together they keep agents inside scope, verifying before claiming done, and not repeating known traps across sessions.

## Status

Active. The behavioral floor (13 Iron Laws in the `principles` skill) and the mistake-capture loop (the `mistake` skill plus the `mistakes/` tier) are both live. The feature directory itself was created during the memory-system redesign when work-sprint artifacts were re-homed into the 7 capability value-features; durable guardrails artifacts (cross-layer drift gating and hook-event documentation references) now live under this directory's subdirectories.

## Subsystems

- `principles` (the 13 Iron Laws, incl. new #13)
- `mistake` (moment-of-capture, two-layer promotion, required-mistakes wiring) + the `mistakes/` tier as consumer

## Subdirectories

- `backlogs/` — deferred guardrails tasks awaiting a future session to pick them up
- `changelogs/` — what shipped per task
- `checklists/` — implementation checklists the design must address per scenario
- `decisions/` — ADR-style records of accepted design decisions for the guardrails feature
- `discussions/` — substantive AskUserQuestion topics scoped to guardrails
- `references/` — external prior art touching principles / mistakes

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-05-26 | a10c82d6 | Feature directory created during the memory-system redesign and seeded with re-homed work-sprint artifacts |
| 2026-05-30 | a30b7a6e | Principles clarity pass: removed Iron Law Index, literal rewrite of P6/P10/P11, added Principle 14 (plain literal language, all agent-authored text); decisions/ subdir created |
| 2026-06-01 | 34563fb4 | Re-verified the hooks contract (both PostToolUseFailure quotes verbatim); corrected the event count 31→30 (+MessageDisplay); resolved the hook-event-count and WebFetch-verification-gap backlogs |

## Open items

- Add a quality gate on `agents[]` field population if presence is ever treated as a metric — see `backlogs/goodhart-factor-when-demanded-deferred.md`.

## Related

- Memory-system redesign design doc §1.2 (the table of the 7 capability value-features), §1.3 (how work-sprint artifacts route into value-features)
