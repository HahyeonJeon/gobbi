---
name: reconcile-null-key-strip-reshapes-schema
description: reconcile `with_entries(select(.value != null))` strips explicit-null keys from every agents[] entry, reshaping the on-disk schema vs the template (idempotent, but key-lossy)
type: backlogs
scope: project
feature: null
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [hooks, metadata, schema, reconcile, follow-up]
priority: medium
disposition: open
project-scope: true
shipped_in: null
---

# Reconcile strips explicit-null keys, reshaping agents[] vs the template

## Context

Execution EVALUATION finding F-STR-2 (Claude Structure, design_flaw, Medium/95).
`reconcile-session-metadata.sh:206-212` runs `reduce ... with_entries(select(.value != null))`
over ALL agents on EVERY reconcile (not only re-keyed ones). A pre-existing entry such as
`{id, name:null, type, phase:null, step:null, startedAt:null, finishedAt:null, ...}` becomes
`{id, tokensUsed, transcriptPath, type}` after one reconcile — `name`/`phase`/`step`/`startedAt`/
`finishedAt` dropped. The template (`session.template.json`) ships ~19 keys, ~12 of them null.
The reconciler also CREATES entries with a narrower field set than the template (no
`kind`/`teammateName`/`continuationOf`/`turns`). So SessionEnd silently reshapes agents[] away
from the template shape.

## Why deferred

The authoritative writer dropping template-established keys is a code↔template↔doc shape
inconsistency, but `orchestration/SKILL.md:334` documents a back-compat clause ("readers treat
absent keys as defaults"), which pre-absolves the reshape — so the eval rated it Medium, not
High, and it does NOT gate REVISE. It is idempotent (run2 == run1), so not a loop bug.

## When to pick up

When the agents[] consumer surface grows to depend on a key the reconciler currently strips, or
during a schema-conformance sweep.

## Suggested approach

Either (a) preserve explicit-null keys through reconcile (drop the blanket null-strip, or strip
only keys the reconciler itself introduced), or (b) make the template + doc authoritative that
the post-reconcile shape is the canonical minimal shape and update consumers accordingly.
Decide which shape is canonical, then make writer + template + doc agree.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-08-c7673705-2d69-4be8-9bd4-436c3eb91be2/` — Execution eval iter1 (Claude Structure).
