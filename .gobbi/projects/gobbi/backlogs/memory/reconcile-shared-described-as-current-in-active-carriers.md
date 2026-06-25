---
name: reconcile-shared-described-as-current-in-active-carriers
description: 2 active Family-B allowlist carriers describe _shared as the current model, contradicting the merged config that dropped it.
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-24
session: 1cd48095-d745-4868-a5ac-f48326eb447f
tags: [memory, docs-sync]
keywords: [shared-layer, active-docs-drift, memory-vocab, universal-base-layer, memory-namespace-schema]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Reconcile _shared described as current in two active design docs

## Context

The per-type areas+tags vocabulary redesign (#310/#312, `ef54f990`) dropped `_shared` as a concept — the new model uses per-type area namespaces with no cross-type shared layer. During the memory-migration-curation-campaign Ideation (session `1cd48095-d745-4868-a5ac-f48326eb447f`), the Family-B legitimate-carrier derivation enumerated 19 memory-tree files that reference `_shared`/`.effective`/`.tagAreaMap.*` as legitimate carriers. 2 of those 19 files carry `status: active` and describe `_shared` as a CURRENT concept rather than a retired / historical one:

- `features/memory/design/memory/memory-namespace-schema.md` (status: active)
- `features/memory/design/memory/universal-base-layer.md` (status: active)

Both files were allowlisted correctly (they are the design record of the model being retired and their content is load-bearing historical documentation). But their framing describes `_shared` as-if-current, contradicting the merged config.

This was surfaced as a Low `CONS-OBS-iter4` finding in the Claude iter4 evaluator (`overall.md`): "the draft's blanket 'documents the prior model' framing is imprecise for them."

## Why deferred

This is out of scope for the migration campaign. The migration campaign's job is to normalize the memory tree's area+tag schema (validator → 0, both guard families → 0). Reconciling prose framing in two active design docs is a docs-sync task that belongs to the memory-features docs authoring context, not to the migration scripts. The campaign's allowlisting of these files is correct; their content drift is a separate maintenance concern.

The finding was explicitly classified as Low and the evaluator confirmed it does not reopen the iter4 PASS: "Allowlisting is still correct; content-reconciliation of stale active docs is out of campaign scope."

## When to pick up

After the migration campaign PR is merged and validator + both guard families reach zero. At that point the two files' `status: active` is correct but their `_shared`-as-current prose is a docs-sync gap. A focused docs-sync pass (read the merged config, update the two files' framing to "the prior model was…") closes this. No blocking dependency — can run in any session after the migration campaign PR lands.

## Suggested approach

1. Open `features/memory/design/memory/memory-namespace-schema.md` and `features/memory/design/memory/universal-base-layer.md`.
2. Find sections that describe `_shared` as the current resolution model.
3. Reframe to past tense: "The prior model used `_shared`…"; add a pointer to the per-type vocab config that replaced it.
4. Run the validator + both guard families to confirm 0 (the files are in the Family-B allowlist; content-only edits do not add new retired-form occurrences if done carefully — but verify).

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-24-1cd48095-d745-4868-a5ac-f48326eb447f/`

## Related

- [[memory-migration-curation-campaign]] — the campaign that surfaced this follow-up
