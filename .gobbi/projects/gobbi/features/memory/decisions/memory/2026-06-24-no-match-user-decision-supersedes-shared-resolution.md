---
name: no-match-user-decision-supersedes-shared-resolution
description: Area no-match now surfaces a user-decision (NEEDS_CONTEXT), not a `_shared` landing; `_shared` is dropped from every type's area list. Supersedes the manifest's `_shared`-resolution expectation.
type: decisions
scope: feature
feature: memory
status: accepted
created: 2026-06-24
session: 84e9570c-bf2b-42b0-af5c-1c181d182e1b
tags: [memory, design]
keywords: [_shared-removed, no-match-user-decision, L13, L14, always-ask-area-add]
author: claude
supersedes: shared-resolution-expected-in-manifest
superseded_by: null
---

# Area no-match → user-decision (not `_shared`); `_shared` dropped from every type area list

## Context

The per-type memory-vocabulary redesign (`1-ideation/outputs/per-type-vocab-design.md`, L1–L18)
removed the `_shared` catch-all area. The prior decision
[[shared-resolution-expected-in-manifest]] (2026-06-23) accepted that one process-only mistake would
deterministically resolve to `_shared`, and instructed the executor to annotate the migration
manifest's `_shared` rows as expected, not as a gap. The redesign's L13/L14 remove the premise that
decision rests on: there is no `_shared` area anymore, so a `_shared` resolution can no longer occur.

## Decision

Two locked redesign decisions supersede the `_shared`-resolution expectation:

- **L13 — `_shared` REMOVED.** `_shared` is dropped from every type's area list. No catch-all area
  exists anywhere in `memory-vocabulary.json`.
- **L14 — no-match → user-decision.** Area resolution no longer defaults to `_shared` on no-match.
  When a record's tags route to no area, the write-time agent emits `NEEDS_CONTEXT`; the manager asks
  the user to pick an existing area OR create a new one; a created area is appended to
  `memory-vocabulary.json` as an Always-Ask edit; the record then routes to that area.

This decision SUPERSEDES the [[shared-resolution-expected-in-manifest]] expectation that records (the
one process-only mistake, and the 17 formerly-`_shared` records in the migration manifest) resolve to
`_shared`. They do not — they either re-route via L12 generic-tag routing to a real area, or they hit
the L14 no-match user-decision (flagged-for-user-decision in the re-derived manifest). `_shared` is no
longer a valid resolution outcome.

## Rationale

`_shared` accreted 15% of records (17 of 114) as a silent dumping ground. Replacing the silent
catch-all with an explicit user-decision forces every record into a real, intentional area and grows
the controlled vocabulary deliberately (the `rules.md` §1.5 "extend deliberately" discipline, now
enforced at write time instead of bypassed by `_shared`). The mechanism (#309 jq / fail-closed /
priority first-match) is otherwise unchanged; L14 is the sole mechanism-touching change — it swaps the
no-match terminal from `_shared` (silent) to a user-decision (explicit). The fail-closed property is
preserved: since `_shared` is no longer a listed area, a `_shared/` directory now FAILS the validator.

## Alternatives considered

- **Keep `_shared` as the no-match catch-all** (the prior decision's premise): rejected by L13. It
  let records accrete in a dumping ground instead of being homed to a real, intentional area.
- **Auto-invent an area on no-match:** rejected. Adding an area is an Always-Ask edit (manager-
  surfaced), never auto-applied — area creation must be a deliberate, user-ratified vocabulary change.

## Consequences

- The migration manifest's resolution model is re-derived against the per-type vocab: ZERO `_shared`
  landings; the 17 formerly-`_shared` records re-resolve (11 route to a real area via L12; 6 become
  flagged-for-user-decision). See the re-derived manifest (Task 08).
- The contradicting decision [[shared-resolution-expected-in-manifest]] must be flipped to
  `status: superseded` and archived. See the Wrap-up supersession instruction staged alongside this
  file (`WRAP-UP-SUPERSEDE-INSTRUCTION.md`).
- Write-time agents and Wrap-up promotion must emit `NEEDS_CONTEXT` on area no-match, not stamp
  `area: _shared`.

## Related

- [[shared-resolution-expected-in-manifest]] — the prior decision this supersedes (its `_shared`
  expectation is removed by L13/L14)
- [[area-tag-migration-manifest]] — the manifest re-derived to ZERO `_shared` landings (Task 08)
- [[memory-namespace-schema]] — the #307 area-namespace schema the redesign refines
