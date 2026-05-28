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
project: gobbi
last_updated: 2026-05-27
---

# Feature: Project Memory

Cross-session durable store: decisions, designs, plans, and references survive in a typed, searchable memory tree. This is value-feature #2 of the 7 capability features (design §1.2, RATIFY-1 / L1). The memory-system redesign lands here.

## Overview

`project-memory` is gobbi's durable cross-session knowledge tree. It captures what survives a session — decisions, designs, plans, references, mistakes — in a typed, named, frontmattered store that the next session can find without restarting from zero.

## Status

Active. The memory-system redesign shipped the typed directory structure and naming standard (PR #272), and the dev-doc quality standard (§4 of `memorization/rules.md`) plus a conformance wave shipped on top of it. The prose-quality wave that brings each doc into full §4 conformance is in progress. The subsystems this feature owns — `memorization` (synthesis + staging), `wrap-up`'s promotion half, the project-memory types + naming + frontmatter standards, and the archive move-on-terminal model — are all live.

## Subdirectories

- `backlogs/` — deferred project-memory tasks (subdirectory exists; currently holds no feature-scoped entries)
- `changelogs/` — what shipped per task
- `checklists/` — checklist findings from evaluation
- `decisions/` — memory-system design decisions
- `design/` — memory-system design topics
- `discussions/` — substantive AskUserQuestion topics scoped to project-memory
- `mistakes/` — feature-scoped mistakes (subdirectory exists; currently holds no feature-scoped entries — project-scope mistakes live under the project-tier `mistakes/` dir)
- `plans/` — plan artifacts produced by the Planning loop
- `references/` — external prior art touching the memory system
- `scenarios/` — scenario findings from evaluation

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-05-26 | a10c82d6 | Feature dir created during memory-redesign W3-T0 |
| 2026-05-27 | b0a0eaf9 | Dev-doc standard (§4 rules.md) authored + conformance wave (T0–T11) shipped; 7 new subdirs bootstrapped; 17 ideation + 5 prep + 9 planning staging files promoted |

## Open items

- The prose-quality wave (§4 conformance) is mid-flight across the project-memory tree.
- The `backlogs/` and `mistakes/` subdirectories exist but currently hold no feature-scoped entries.

## Related

- [`design/dev-doc-memory-standard`](design/dev-doc-memory-standard.md) — the design for the dev-doc quality standard this feature governs
- [`skills/memorization/rules.md`](../../skills/memorization/rules.md) — the memory standard (naming, frontmatter, §4 dev-doc quality) this feature owns
- [`skills/memorization/memory-map.md`](../../skills/memorization/memory-map.md) — the path-and-type semantics for the memory tree
