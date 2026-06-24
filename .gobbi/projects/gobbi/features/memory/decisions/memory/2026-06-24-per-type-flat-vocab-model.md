---
name: per-type-flat-vocab-model
description: Memory vocabulary uses a flat per-type model — one independent area list and one independent tag pool per by-area type.
type: decisions
scope: feature
feature: memory
status: accepted
created: 2026-06-24
session: 84e9570c-bf2b-42b0-af5c-1c181d182e1b
tags: [memory, schema]
keywords: [vocabulary, per-type, flat-model, tag-pool, area-axis]
author: claude
supersedes: null
superseded_by: null
related: []
---

# Use a flat per-type model for the memory vocabulary (one area list + one tag pool per type)

## Context

The memory vocabulary config (`memory-vocabulary.json`) previously used a layered model with a universal base, a project overlay, and an `effective` computed layer. Two area axes (`spine` + `mistakes`) were shared by all types; one global effective tag pool applied to all types. The result was that types with different routing needs shared the same area list, and the 17/114 `_shared` records showed that the catch-all was absorbing genuine classification pressure.

The redesign goal: generalize the mistakes trap-class axis to ALL by-area types, and the single global tag pool to per-type pools.

## Decision

The memory vocabulary schema is FLAT: `types.{type}.{areas, tags}` at the top level. There are 15 active `types` keys (the 16 by-area types minus `archive`, which has no config key and mirrors its source type's area). Each active type key carries its own independent `areas` list and its own independent `tags` pool. There are no `universal`, `project`, or `effective` composition layers.

## Rationale

The flat model is simpler than the layered shape it replaces. The layered model's complexity was never motivated by an actual per-type need: all types shared the same two axes, so the generality was theoretical. The per-type flat model makes the per-type configuration explicit and auditable per type, removes the composition machinery (no jq `.universal[] + .project[]` merges), and aligns with the already-shipped mistakes trap-class axis which proved per-type axes work in practice. The user weighed harness-generality and chose flat per-type simplicity over the layered alternative.

## Alternatives considered

1. **Keep layering with per-type overrides** — rejected. The composition machinery adds cognitive overhead; overrides against a universal base still require knowing what the base says; the "project" override slot is unused and theoretical.
2. **Shared pool with per-type subsets** — rejected. Subsets would still require a shared vocabulary definition, adding indirection without reducing the area-assignment work. Independent pools are more auditable.

## Consequences

- `memory-vocabulary.json` schema changes to the flat shape (§8 of the design).
- `validate-frontmatter.sh` reads `.types.{type}.areas` and `.types.{type}.tags` per-type via jq (not `effective.*` globals).
- `wrap-up/SKILL.md` and `rules.md §1.5/§2.5` reference per-type keys in place of the global spine/effective terminology.
- `memory-vocabulary.json` grows to 15 type-key entries (was 2 axis entries + 1 global tag pool).
- Adding a controlled tag or area to one type does not affect other types.
- Planning must perform the exhaustive grep-verified sweep of all `effective.*` / `tagAreaMap.spine|mistakes` consumer sites before declaring the rewrite complete.
