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
last_updated: 2026-06-08
---

# Feature: Project Memory

Cross-session durable store: decisions, designs, plans, and references survive in a typed, searchable memory tree. This is value-feature #2 of the 7 capability features (design §1.2, RATIFY-1 / L1). The memory-system redesign lands here.

## Overview

`project-memory` is gobbi's durable cross-session knowledge tree. It captures what survives a session — decisions, designs, plans, references, mistakes — in a typed, named, frontmattered store that the next session can find without restarting from zero.

## Status

Active. The memory-system redesign shipped the typed directory structure and naming standard (PR #272), and the dev-doc quality standard (§4 of `memorization/rules.md`) plus a conformance wave shipped on top of it. On 2026-06-08 (session c7673705) the **session-memory lifecycle redesign** landed Clusters M (deterministic hook-driven token telemetry) + G (`sessions/` gitignored + a finalized per-session notes record), shipping the hook pair (`post-tool-use-agents.sh` + `session-end.sh`) + the reconciler + the orchestration Authority rule. Clusters S (staging flatten), R (notes record + generator), and the remaining D1 git-workflow cluster are deferred. The prose-quality wave (§4 conformance) is also still in progress. The subsystems this feature owns — `memorization` (synthesis + staging), `wrap-up`'s promotion half, the project-memory types + naming + frontmatter standards, the archive move-on-terminal model, and now the session-memory lifecycle (ephemeral `sessions/` + deterministic telemetry) — are all live.

## Subdirectories

- `backlogs/` — deferred feature tasks (2 entries: `backfill-historical-session-records`, `implement-session-memory-clusters-s-r-d1`)
- `changelogs/` — what shipped per task (1 entry)
- `checklists/` — checklist findings from evaluation (9 entries)
- `decisions/` — memory-system design decisions (21 entries; +7 this session for the session-memory lifecycle D-decisions)
- `design/` — memory-system design topics (3 entries; +`session-memory-lifecycle`)
- `discussions/` — substantive AskUserQuestion topics scoped to project-memory (6 entries)
- `mistakes/` — feature-scoped mistakes (no feature-scoped entries yet — this session's process mistakes are project-scope, under the project-tier `mistakes/` dir)
- `plans/` — plan artifacts produced by the Planning loop (2 entries)
- `references/` — external prior art + empirical findings touching the memory system (8 entries; +`sessionend-payload-reason-field`)
- `scenarios/` — scenario findings from evaluation (3 entries)

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-05-26 | a10c82d6 | Feature dir created during memory-redesign W3-T0 |
| 2026-05-27 | b0a0eaf9 | Dev-doc standard (§4 rules.md) authored + conformance wave (T0–T11) shipped; 7 new subdirs bootstrapped; 17 ideation + 5 prep + 9 planning staging files promoted |
| 2026-06-08 | c7673705 | Session-memory lifecycle redesign — Clusters M+G shipped (11 commits); 24 feature-scoped staging files promoted; `session-memory-lifecycle` design + 17-task plan landed; S/R/D1 deferred |

## Open items

- The prose-quality wave (§4 conformance) is mid-flight across the project-memory tree.
- Deferred Clusters S/R/D1 — see `backlogs/implement-session-memory-clusters-s-r-d1.md`.
- Optional historical-record backfill — see `backlogs/backfill-historical-session-records.md`.
- The `mistakes/` subdirectory exists but holds no feature-scoped entries (this session's process mistakes are project-scope).

## Related

- [`design/dev-doc-memory-standard`](design/dev-doc-memory-standard.md) — the design for the dev-doc quality standard this feature governs
- [`skills/memorization/rules.md`](../../skills/memorization/rules.md) — the memory standard (naming, frontmatter, §4 dev-doc quality) this feature owns
- [`skills/memorization/memory-map.md`](../../skills/memorization/memory-map.md) — the path-and-type semantics for the memory tree
