---
name: ddd-organize-by-area-not-by-type
description: DDD groups by feature/area with a shared bucket for cross-context records — area goes under the load-bearing type, with a _shared namespace.
type: references
scope: feature
feature: memory
status: active
created: 2026-06-21
session: c3ac1c53-6741-49cf-8856-cdb3fcd6bec0
tags: [memory, design]
keywords: [ddd, bounded-context, organize-by-feature, shared-bucket]
author: claude
title: DDD — organize by feature/bounded-context, not by technical type
source: https://dev.to/stevescruz/domain-driven-design-ddd-file-structure-4pja
accessed: 2026-06-21
ref_type: blog
---

# DDD — organize by feature/bounded-context, not by technical type

## Insight

The DDD community favors grouping files by feature/bounded-context over technical type, because "delivering a feature should not require touching twenty type-folders." DDD also keeps a `shared/` bucket outside the modules for cross-context logic. The grouping axis matches how work arrives (by feature), not how artifacts classify (by type).

## Reason

A caution against a naive "namespace everything by subsystem" answer. gobbi's TYPE is already the top directory and is load-bearing (the validator derives `type` and routing keys off it). So the area axis goes UNDER the type (`{type}/{area}/`), not as a replacement for it; and a `_shared/` namespace absorbs records that span areas (the DDD `shared/` analog). Invoke when defending area-under-type + the `_shared/` cross-cutting bucket (DP-2, DP-7).

## Source

- https://dev.to/stevescruz/domain-driven-design-ddd-file-structure-4pja
- https://martinfowler.com/bliki/BoundedContext.html

## Excerpt

"Splitting files per type makes little sense, as developers deliver functionality and working on a certain feature should not require adding or changing files in twenty folders."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-21 | c3ac1c53-6741-49cf-8856-cdb3fcd6bec0 | Anchored area-under-type (not replacing type) + the `_shared/` cross-cutting namespace |

## Related

- [[tags-vs-folders-one-axis-each]] — the single-folder-axis the area choice instantiates
