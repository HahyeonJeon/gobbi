---
name: project-defined-vocab-config-as-data
description: Make memory area+tag vocabulary project-defined via config-as-data; validator reads it instead of hardcoded constants.
type: design
scope: feature
feature: memory
status: active
created: 2026-06-23
session: d0185dba-cd9b-45ad-93f6-7814c4f0ef4a
tags: [memory, schema]
keywords: [config-as-data, area-vocabulary, tag-vocabulary, harness-generality]
author: claude
supersedes: null
superseded_by: null
related: [universal-base-layer, mistakes-trap-class-axis, tag-area-map-combined-config]
---

# Project-defined vocabulary config-as-data

## Problem

The memory area mechanism (`{type}/{area}/{slug}.md`) is generic, but two vocabularies it depends on are hardcoded into the harness: the area allowlist (`rules.md:101,107`; `validate-frontmatter.sh:211-212`) and the closed tag vocabulary (`rules.md:292-300`; `validate-frontmatter.sh:106`). Both are gobbi-specific. The tag gate is upstream of area-routing, so both must be de-hardcoded together.

## Scope

In-scope: de-hardcoding BOTH area and tag vocabularies into a project-owned config-as-data file the bash validator reads. Re-parameterize the full write-set: validator constants, `rules.md §1.5` area lists, `rules.md §2.5` tag list, tag→area priority map, `wrap-up/SKILL.md` restatement, and the 4th literal-vocab site (`features/memory/design/memory/memory-namespace-schema.md:38,42`).
Out-of-scope: the config filename/placement (deferred to Execution); the locked mechanism (`{type}/{area}/{slug}.md`).

## Approach

Config-as-data (Q1): a project declares its area vocabulary + tag vocabulary + tag→area map in a single project-owned file. `rules.md` stays the human spec and points at the config for values.

Validator read-path (I-INT-3): replace `AREA_SPINE`/`AREA_MISTAKES` (`:211-212`) and `TAG_VOCAB` (`:106`) with config reads; keep `area_allowlist_for()` dispatch + `is_by_area()` + area-from-PATH structure unchanged. Two dispatch points.

Write-set (6 sites total):
- AREA: `validate-frontmatter.sh:211-212`, `rules.md:101,107`, `wrap-up/SKILL.md:314`, `features/memory/design/memory/memory-namespace-schema.md:38,42` (4 sites)
- TAG: `validate-frontmatter.sh:106`, `rules.md:292-300` (2 sites)

Verification (A-10, corrected F3): grep ALL forms (`·`-list, space-separated bash string, prose) across ALL scopes (`skills/` AND `features/` AND anywhere except `sessions/`). Run non-gobbi golden scenario end-to-end.

## Scenarios

- Non-gobbi project declares tags [auth, payments] + areas [auth, payments, _shared]: both tag gate and area gate pass.
- gobbi round-trips: existing behavior preserved with ratified universal additions.
- Config absent/minimal: harness falls back to universal base only; no crash.

## Validation

Correct iff: (a) validator reads config with no new runtime dependency; (b) a fresh non-gobbi project sets its areas in ONE place; (c) gobbi's areas round-trip. Test: point validator at throwaway config; a non-spine area passes.

## Trade-offs

Gains: harness generality (any project can declare its own vocabulary). Costs: one additional config file per project. The join (tag→area map) is in the same file for cohesion.

## Open issues

- Config filename/placement deferred to Planning/Execution.
- Universal tag baseline exact values deferred to WS-A A-8/A-9 (Execution acceptance criterion, COD2-OVERALL-2).

## Related

- [[universal-base-layer]] — the two-tier universal base that the config extends
- [[mistakes-trap-class-axis]] — the orthogonal dispatch for the mistakes type
- [[tag-area-map-combined-config]] — decision to put tag→area map in the same combined config
