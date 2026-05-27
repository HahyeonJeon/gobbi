---
name: project-memory
description: "Cross-session durable store: decisions, designs, plans, and references survive in a typed, searchable memory tree."
type: features
scope: feature
feature: project-memory
status: active
created: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [memory, cross-session, persistence]
value_proposition: "Cross-session durable store: decisions, designs, plans, and references survive in a typed, searchable memory tree."
subsystems: [memorization, wrap-up, memory-map]
---

# Feature: Project Memory

Cross-session durable store: decisions, designs, plans, and references survive in a typed, searchable memory tree. This is value-feature #2 of the 7 capability features (design §1.2, RATIFY-1 / L1). The memory-system redesign lands here.

## Overview

`project-memory` is gobbi's durable cross-session knowledge tree. It captures what survives a session — decisions, designs, plans, references, mistakes — in a typed, named, frontmattered store that the next session can find without restarting from zero.

## Subsystems

- `memorization` (synthesis + staging) + `memory-map.md`
- `wrap-up`'s promotion half
- The 13 project-memory types + naming standard + frontmatter standard
- The archive move-on-terminal model (`design/archive-move-on-terminal-model.md`)

## Subdirectories

- `decisions/` — memory-system design decisions
- `design/` — memory-system design topics
- `discussions/` — substantive AskUserQuestion topics scoped to project-memory
- `references/` — external prior art touching the memory system
- `plans/` — plan artifacts produced by the Planning loop
- `changelogs/` — what shipped per task
- `archive/` — superseded project-memory artifacts (move-on-terminal)

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-05-26 | a10c82d6 | Feature dir created during memory-redesign W3-T0 |

## Related

- Memory-system redesign design doc §1.2 (7-feature table), §1.3 (sprint → value-feature routing)
