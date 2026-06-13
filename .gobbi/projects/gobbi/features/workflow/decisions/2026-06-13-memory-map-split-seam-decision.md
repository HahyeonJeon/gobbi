---
name: memory-map-split-seam-decision
description: memory-map.md spans both tiers; primary home is skills/memory/ with session-record rows cross-linked from skills/record/
type: decisions
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [skill-restructure, memory-map, docs-sync]
decision_status: accepted
supersedes: null
superseded_by: null
---

# memory-map.md primary home is skills/memory/ with session-record rows cross-linked from skills/record/

## Context
`skills/memorization/memory-map.md` documents BOTH storage tiers: session memory (volatile) and project memory (persistent). The 2-skill split (D10) must decide where this file lives — it cannot cleanly belong to just one skill without splitting or cross-linking.

## Decision
`memory-map.md` moves to `skills/memory/memory-map.md` as its primary home. The session-record half (volatile paths, per-loop working/staging/evaluation) is cross-linked from `skills/record/SKILL.md`. No physical split of the file — it remains one document. The discriminator for which rows belong to "record" vs "memory" is the session-memory vs project-memory column in the existing path table.

## Rationale
INT-4: `memory-map.md:1-5` — "Two tiers: Session memory (volatile) and Project memory (persistent)". Primary home in `skills/memory/` because the durable-memory tier is the promoted long-term artifact; the session-record tier is ephemeral and the `record/` skill already contains the procedure that writes it.

## Alternatives considered
- Split the file physically into session-record-map.md + memory-map.md (rejected: adds doc split overhead for one file; cross-reference is sufficient for Ideation phase).
- Primary home in `skills/record/` (rejected: the durable-memory tier is more stable and more widely referenced externally).

## Consequences
9 external refs to `memorization/memory-map.md` must be repointed. `wrap-up/SKILL.md` will cite `memory/memory-map.md`; `record/SKILL.md` will carry a "see memory/memory-map.md for the full path inventory" note.

## Related
- Design § D-b (mapping table row for memory-map.md)
- `evaluation/iter1/claude/structure.md` (struct-memory-map-row-split-undefined)
