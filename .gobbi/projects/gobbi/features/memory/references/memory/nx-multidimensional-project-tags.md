---
name: nx-multidimensional-project-tags
description: Nx projects carry tags across distinct dimensions governed by different rules — prior art for keeping mistakes' trap-class axis separate from the subsystem axis.
type: references
scope: feature
feature: memory
status: active
created: 2026-06-23
session: 2026-06-23-d0185dba
tags: [memory, design]
keywords: [nx, multidimensional-tags, scope-dimension, type-dimension, axis-separation]
author: claude
title: Nx multi-dimensional project tags — axes governed by different rules
source: https://nx.dev/docs/guides/enforce-module-boundaries/tag-multiple-dimensions
accessed: 2026-06-23
ref_type: docs
---

# Nx multi-dimensional project tags — axes governed by different rules

## Insight
Nx projects carry tags across distinct dimensions on one entity — `scope:client`/`scope:admin` AND `type:app`/`type:feature` — and constraints are defined per-dimension. Multi-dimensional tagging governed by different rules is an established, not exotic, design.

## Reason
Invoke when justifying Q3: mistakes carry an axis (trap-class = HOW it fails) governed by DIFFERENT rules than the subsystem axis (WHERE) other types use. Nx validates that one model can host two axes with separate governance — so keeping mistakes' universal trap-class axis alongside project-subsystem areas is sound, not a special-case hack.

## Source
- https://nx.dev/docs/guides/enforce-module-boundaries/tag-multiple-dimensions
- https://nx.dev/docs/features/enforce-module-boundaries

## Excerpt
Projects can have multiple tags across different dimensions, such as scope tags (scope:client) and type tags (type:app); constraints are applied per the matching tags.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-23 | 2026-06-23-d0185dba | Q3 mistakes trap-class axis decision |

## Related

- [[controlled-vocabulary-hybrid]] — the controlled-vocabulary theory behind both axes
