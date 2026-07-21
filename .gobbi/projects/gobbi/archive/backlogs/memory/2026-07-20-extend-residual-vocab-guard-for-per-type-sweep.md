---
name: extend-residual-vocab-guard-for-per-type-sweep
description: check-residual-vocab.sh false-PASSes on this redesign's retired forms (_shared, .effective.*, .tagAreaMap.spine|mistakes); extend its pattern before the deferred 114-file migration relies on it.
type: backlogs
scope: project
feature: null
status: closed
created: 2026-06-24
session: 84e9570c-bf2b-42b0-af5c-1c181d182e1b
tags: [memory, verification]
keywords: [check-residual-vocab, guard-pattern, false-pass, run-to-zero, per-type-sweep]
author: claude
priority: high
project-scope: true
shipped_in: null
archived_at: 2026-07-20
archive_reason: dropped
---

# Extend `check-residual-vocab.sh` to cover the per-type-vocab redesign's retired forms

## Context

The per-type-vocab redesign (session `84e9570c`) retired three vocabulary forms: the `_shared`
catch-all area, the layered `.effective.*` config keys, and the 2-table `.tagAreaMap.spine` /
`.tagAreaMap.mistakes` shape. The guard `skills/orchestration/scripts/check-residual-vocab.sh` is the
named "run-to-zero" anchor for the deferred 114-file migration's sweep verification — but its `VOCAB`
pattern only matches a PRIOR campaign's rename vocabulary (`memorization|session[- ]memory|...`). It
does NOT match this redesign's retired forms, so it returns "NO RESIDUAL VOCAB / exit 0" while
`_shared` and `.effective` occurrences still exist on disk. The Planning evaluator ran the guard and
reproduced this false-PASS independently (see [[guard-cited-as-runtozero-without-matching-vocab]]).

The redesign shipped under merge-ordering A: the 114-file migration is deferred to a future session,
and that migration's sweep verification is supposed to lean on this guard. If the guard is not
extended first, the migration could false-PASS while still carrying retired forms.

## Why deferred

The redesign session (`84e9570c`) ships the per-type vocabulary schema only; the 114-file migration is
deferred per merge-ordering A. Extending the guard is sweep-verification tooling for that deferred
migration, not for the schema ship — so it travels with the migration prerequisites, not with this
session's scope. The Planning sweep this session used explicit per-form `grep -c <retired-form> == 0`
instead of the guard, so the redesign itself did not need the guard extended.

## When to pick up

Before the deferred 114-file area-tag migration (`[[memory-namespace-migration]]` /
`[[area-tag-migration-manifest]]`) relies on `check-residual-vocab.sh` as its run-to-zero proof.
Prerequisite: none — this can be done any time, and SHOULD be done as the migration session's first
step (or in a small prep PR) so the migration's guard run is trustworthy.

## Suggested approach

Extend the guard's `VOCAB` pattern (in `skills/orchestration/scripts/check-residual-vocab.sh`) to also
match this redesign's retired forms: `_shared`, `.effective.` (and the layered `.effective.*` key
shapes), and the 2-table `.tagAreaMap.spine` / `.tagAreaMap.mistakes`. Allowlist legitimate historical
carriers (e.g. archived files, this manifest's preserved historical narrative, the decisions that
record the `_shared` history as past context). After extending, confirm the guard now returns non-zero
on a synthetic file carrying a retired form, and zero on the clean tree — i.e. verify the guard's
pattern actually detects what it claims, rather than trusting its name. Pair the guard with explicit
per-form `grep -c` during the migration sweep until the extension is proven.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-24-84e9570c-bf2b-42b0-af5c-1c181d182e1b/`

## Related

- [[guard-cited-as-runtozero-without-matching-vocab]] — the mistake this backlog remediates (the guard false-PASSed because its pattern matched only a prior rename's vocabulary)
- [[area-tag-migration-manifest]] — the deferred 114-file migration spec whose sweep verification relies on this guard
- [[memory-namespace-migration]] — the parent deferred migration backlog
