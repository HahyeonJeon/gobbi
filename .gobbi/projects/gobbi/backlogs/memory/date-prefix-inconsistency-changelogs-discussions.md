---
name: date-prefix-inconsistency-changelogs-discussions
description: rules.md §1.2 lists changelogs/discussions as date-prefixed, but memory-map and templates use bare slugs — reconcile the date dimension.
type: backlogs
scope: project
feature: null
status: deferred
created: 2026-06-21
session: c3ac1c53-6741-49cf-8856-cdb3fcd6bec0
tags: [memory, schema, docs-sync]
keywords: [date-prefix, changelogs, discussions, temporal-split, reconcile]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Date-prefix inconsistency — changelogs / discussions disagree across docs

## Context

`skills/memory/rules.md` §1.2 (the temporal-split table) lists BOTH `changelogs` and `discussions` among the **date-prefixed** types — filename pattern `YYYY-MM-DD-{slug}.md`. But `skills/memory/memory-map.md` and the type templates show these two types with **bare-slug** filenames (`{slug}.md`) on their staging, feature, and routing rows:

- `memory-map.md:58` — `staging/discussions/{slug}.md` (bare)
- `memory-map.md:63` — `staging/changelogs/{slug}.md` (bare)
- `memory-map.md:121` — `features/{f}/discussions/{area}/{slug}.md` (bare)
- `memory-map.md:125` — `features/{f}/changelogs/{area}/{slug}.md` (bare)

So rules.md §1.2 (date-prefixed) contradicts memory-map + templates + the Wrap-up routing table (bare-slug) for `changelogs` and `discussions`. The same `decisions` inconsistency was RECONCILED this session (decisions are now consistently date-prefixed everywhere). `changelogs` and `discussions` remain inconsistent.

## Why deferred

Out of scope for the area-namespace redesign — this is a separate date-dimension reconcile, not an area-dimension change. It was surfaced while deriving the namespaced path rows but is orthogonal to the namespace schema.

## When to pick up

No hard prerequisites. Natural to fold into any temporal-split / filename-convention reconcile pass. Decide ONE direction per type (date-prefixed vs bare-slug), then make rules.md §1.2, memory-map.md, the two templates, and the Wrap-up routing table all agree.

## Suggested approach

1. Decide whether `changelogs` and `discussions` are intrinsically time-indexed (date-prefixed) or evergreen (bare-slug). A changelog entry is arguably time-indexed (what shipped when); a discussion is arguably evergreen (one topic).
2. Update §1.2's table, memory-map's path rows, both templates' `## Write it` filename rows, and the Wrap-up routing destination rows to match the chosen direction.
3. Re-grep both type names across all five surfaces to confirm zero residual disagreement.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-21-c3ac1c53-6741-49cf-8856-cdb3fcd6bec0/`

## Related

- [[slug-shape-mismatch-decisions-discussions-changelogs]] — the sibling slug-shape mismatch backlog from a prior session
- [[memory-namespace-migration]] — the namespace migration this could be folded into
