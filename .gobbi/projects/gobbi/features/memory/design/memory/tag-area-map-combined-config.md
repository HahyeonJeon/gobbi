---
name: tag-area-map-combined-config
description: Tag vocabulary, area vocabulary, and tag-to-area map all live in ONE combined project config.
type: design
scope: feature
feature: memory
status: active
created: 2026-06-23
session: d0185dba-cd9b-45ad-93f6-7814c4f0ef4a
tags: [memory, schema]
keywords: [tag-vocabulary, tag-area-map, combined-config, join, Q6]
author: claude
supersedes: null
superseded_by: null
related: [project-defined-vocab-config-as-data, universal-base-layer]
---

# Tag→area map combined config (Q6)

## Problem

The tag vocabulary (TAG_VOCAB) and area vocabulary (AREA_SPINE/AREA_MISTAKES) are the two endpoints of the tag→area priority map. The map IS the join between these two project-defined vocabularies. If the map stays in the harness while tags and areas move to project config, it straddles two sources — breaking coherence and requiring harness changes to add project-specific tag→area routing.

## Scope

In-scope: Q6 decision — tags + areas + tag→area map in ONE combined project config. Out-of-scope: filename/placement of the config (deferred to Execution).

## Approach

Single combined project config (Q6, engineering decision within the locked config-as-data frame):
- Areas declared (per-type: spine + mistakes).
- Tag vocabulary declared (closed + universal baseline inherited).
- Tag→area priority map declared (the JOIN: input tags, output areas, priority order).
- Feature-dir normalization declared (e.g., `git-workflow → git`).

Rationale for single config: (a) map straddles two vocabularies — ONE file prevents split-brain; (b) commitlint precedent (I-EXT-1: single config for scopes); (c) validator does one config read.

The tag→area map currently in `rules.md:122-138` (restated `wrap-up/SKILL.md:308-312`) MOVES into this config. The harness provides the selection-rule STRUCTURE (explicit `area:` > tag→area map > `_shared`); the PROJECT provides the vocabulary and map values.

## Scenarios

- A project declares tags [auth, payments] + areas [auth, payments, _shared] + map {auth: auth, payments: payments}: tag gate passes; area resolves to auth.
- gobbi's tag→area map round-trips: existing tag→area routing identical after config reads project values.

## Validation

Non-gobbi golden scenario end-to-end: project declaring tags [auth, payments] + areas + map passes tag gate AND area resolution. gobbi's current tag set round-trips with behavior preserved.

## Trade-offs

Gains: single source of truth for the vocabulary join; project edits taxonomy in one place. Costs: config file is denser (three sections). The combined design avoids the split-brain risk of a two-file approach.

## Open issues

- Exact universal tag baseline values deferred to Execution (WS-A A-8/A-9, COD2-OVERALL-2 accepted-deferred).
- Config filename/placement deferred to Planning/Execution.

## Related

- [[project-defined-vocab-config-as-data]] — the config mechanism this design fills
- [[universal-base-layer]] — the universal layer the project config extends
