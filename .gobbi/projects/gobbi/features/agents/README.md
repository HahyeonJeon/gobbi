---
name: agents
description: Multi-agent roster — PI, planner, executors, evaluators, scribe — with role-scoped delegation, clean handoffs, and per-role model selection.
type: features
scope: feature
feature: agents
status: active
created: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [agents, delegation, roster]
value_proposition: "The multi-agent roster — PI, planner, executors, evaluators, scribe — with role-scoped delegation, clean handoffs, and per-role model selection."
subsystems: [delegation, delegation/templates]
project: gobbi
last_updated: 2026-05-26
---

# Feature: Agents

The multi-agent roster — PI, planner, executors, evaluators, scribe — with role-scoped delegation, clean handoffs, and per-role model selection. This is value-feature #3 of the 7 capability features (design §1.2, RATIFY-1 / L1).

## Overview

`agents` is gobbi's delegation system and agent roster: the per-role templates, Load Directives, status contract, model selection, and spawn topology that let a manager dispatch scoped work to fresh single-purpose subagents.

## Status

Active. The 5-role agent roster (`agents/*.md`) and the `delegation` skill (per-role templates, Load Directives, status contract, model selection, spawn topology) are live. Durable agents-scope artifacts re-homed into this feature dir during the memory-system redesign.

## Subsystems

- `delegation` (per-role templates, Load Directives, status contract, model selection, spawn topology) + `delegation/templates/*`
- The 5-role agent roster (`agents/*.md`)

## Subdirectories

- `backlogs/` — deferred agents/delegation tasks
- `changelogs/` — what shipped per task
- `checklists/` — implementation checklists anchored to scenarios and references
- `decisions/` — locked agents/delegation design decisions
- `design/` — agents-scope design topics
- `discussions/` — substantive AskUserQuestion topics scoped to agents
- `references/` — external prior art touching delegation
- `scenarios/` — situations the agents/delegation contract must handle

## Open items

- `backlogs/step1-row4-stale-hook-auto-append-claim.md` — Step 1 row 4 still claims the PostToolUse hook auto-appends specialist entries; reword to match always-worktree + reconcile-script reality.
- `backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md` — hook path-resolution bug blocking auto-population of session.json agents[].

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-06-06 | 06668274 | 2 decisions promoted (session metadata recording + scripts packaging); 1 backlog promoted (step1-row4 stale claim) |
| 2026-05-26 | a10c82d6 | Feature dir created during memory-redesign W3-T0 |

## Related

- Memory-system redesign design doc §1.2 (7-feature table), §1.3 (sprint → value-feature routing)
