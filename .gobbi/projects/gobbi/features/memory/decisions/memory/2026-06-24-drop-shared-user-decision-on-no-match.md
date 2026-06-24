---
name: drop-shared-user-decision-on-no-match
description: Drop _shared from all type area lists; on area no-match surface a user-decision instead of defaulting to a catch-all.
type: decisions
scope: feature
feature: memory
status: accepted
created: 2026-06-24
session: 84e9570c-bf2b-42b0-af5c-1c181d182e1b
tags: [memory, schema, vocabulary-sweep]
keywords: [_shared, no-match, user-decision, NEEDS_CONTEXT, area-selection]
author: claude
supersedes: null
superseded_by: null
related: []
---

# Drop `_shared` from all type area lists; surface a user-decision on area no-match

## Context

The prior memory area-selection rule's no-match terminal was `_shared/` — any record whose tags did not route to a named area was silently placed in `_shared/`. This accreted 17/114 records (15%) as a dumping ground, defeating the purpose of the controlled area vocabulary. `_shared` appeared in every type's area list, including the mistakes trap-class list, making it a de facto opt-out from the classification discipline.

## Decision

`_shared` is REMOVED from every type's area list. There is no catch-all area. On area no-match (no tag routes to a named area and no explicit `area:` override is present in frontmatter), the write-time agent emits `NEEDS_CONTEXT`. The manager asks the user to either pick an existing area or create a new one. If the user creates a new area, it is added to `types.{type}.areas` in `memory-vocabulary.json` as an Always-Ask edit (never auto-applied). The record then routes to the user-chosen area.

This is the ONE mechanism-touching change in the vocabulary redesign (L13 + L14). All other changes are pure vocabulary-layer (schema keying, granularity, layer-drop).

## Rationale

`_shared` accreted because no-match was silent — agents had an easy exit that bypassed classification. Replacing the silent catch-all with a user-decision forces every record into a real, intentional area and grows the controlled vocabulary deliberately (the §1.5 "extend deliberately" discipline). The `_shared` removal also makes the fail-closed validator stricter: a record stamped `area: _shared` now FAILS the off-allowlist area check, because `_shared` is not in any type's `areas` list. The existing wrap-up NEEDS_CONTEXT / unroutable-file escalation pattern is already present; this decision reuses it for the no-match case.

## Alternatives considered

1. **Keep `_shared` as a real area (not a catch-all, but intentional cross-cutting records only)** — rejected. In practice `_shared` was never used intentionally; it was always a no-match landing. A category the validator cannot distinguish from "I didn't try" has no value.
2. **Auto-assign to the closest area by keyword heuristic** — rejected. Heuristic silently misclassifies; user-decision keeps classification explicit and auditable.

## Consequences

- Every type's `areas` list has no `_shared` entry.
- The `rules.md §1.5` selection rule terminal (step 3) is rewritten from "`_shared/` ONLY when NO area matched" to user-decision.
- `wrap-up/SKILL.md` line 312 (`_shared/` no-match terminal) is rewritten to return `NEEDS_CONTEXT`.
- Write-time agents must emit `NEEDS_CONTEXT` rather than stamping `area: _shared` on no-match.
- On-demand area creation is an Always-Ask edit (manager surfaces to user; never auto-applied).
- The 17 formerly-`_shared` records must be reclassified: most route to a real area via L12 generic-tag routing; the remainder are flagged for per-file user area-decision in the deferred 114-file migration.
- The contradicting decision `2026-06-23-shared-resolution-expected-in-manifest.md` is superseded during Execution (L18).
