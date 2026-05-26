---
scope: feature
feature: guardrails
project: gobbi
status: active
value_proposition: "The 13 Iron Laws plus the mistake-capture-and-learn loop that keep agents in scope, verifying claims, and not repeating known traps."
created: 2026-05-26
last_updated: 2026-05-26
---

# Feature: Guardrails

The 13 Iron Laws plus the mistake-capture-and-learn loop that keep agents in scope, verifying claims, and not repeating known traps. This is value-feature #5 of the 7 capability features (design §1.2, RATIFY-1 / L1). Principle #13 lands here.

## Overview

`guardrails` unites gobbi's behavioral floor (the Iron Laws) with its learning loop (mistake capture and two-layer promotion): together they keep agents inside scope, verifying before claiming done, and not repeating known traps across sessions.

## Subsystems

- `principles` (the 13 Iron Laws, incl. new #13)
- `mistake` (moment-of-capture, two-layer promotion, required-mistakes wiring) + the `mistakes/` tier as consumer

## Subdirectories

- `decisions/` — guardrails design decisions
- `design/` — guardrails-scope design topics
- `discussions/` — substantive AskUserQuestion topics scoped to guardrails
- `references/` — external prior art touching principles / mistakes
- `plans/` — plan artifacts produced by the Planning loop
- `changelogs/` — what shipped per task
- `archive/` — superseded guardrails artifacts (move-on-terminal)

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-05-26 | a10c82d6 | Feature dir created during memory-redesign W3-T0 |

## Related

- Memory-system redesign design doc §1.2 (7-feature table), §1.3 (sprint → value-feature routing)
