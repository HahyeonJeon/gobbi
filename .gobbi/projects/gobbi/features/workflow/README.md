---
scope: feature
feature: workflow
project: gobbi
status: active
value_proposition: "The Ideation → Planning → Execution → Memorization → Handoff pipeline: a gated 6-step state machine that drives every unit of work."
created: 2026-05-26
last_updated: 2026-05-26
---

# Feature: Workflow

The Ideation → Planning → Execution → Memorization → Handoff pipeline: a gated 6-step state machine that drives every unit of work. This is value-feature #1 of the 7 capability features (design §1.2, RATIFY-1 / L1).

## Overview

`workflow` is gobbi's core engine: the 6-step state machine (Configuration plus the five productive steps) that drives every non-trivial task from idea to handoff, with a human-in-the-loop gate at each transition.

## Subsystems

- `orchestration` (+ `workflow/*.md`, the 6-step state machine / reducer / event store)
- The five loop bodies: `ideation` / `preparation` / `planning` / `execution` / `wrap-up`
- `research` — Ideation's investigation engine
- `discussion` — the AskUserQuestion human-in-the-loop gate at each step

## Subdirectories

- `decisions/` — locked workflow design decisions
- `design/` — workflow-scope design topics
- `discussions/` — substantive AskUserQuestion topics scoped to workflow
- `references/` — external prior art touching workflow
- `plans/` — plan artifacts produced by the Planning loop
- `changelogs/` — what shipped per task
- `archive/` — superseded workflow artifacts (move-on-terminal)

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-05-26 | a10c82d6 | Feature dir created during memory-redesign W3-T0 |

## Related

- Memory-system redesign design doc §1.2 (7-feature table), §1.3 (sprint → value-feature routing)
