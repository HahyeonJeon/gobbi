---
name: read-model-projection
description: CQRS read models are one-way projections of an authoritative write model — never write back, and rebuild from source.
type: references
scope: project
feature: null
status: active
created: 2026-07-06
session: fe6cbcd3-5e63-46fb-a62e-93308b687d1f
tags: [design]
keywords: [cqrs, event-sourcing, projection, read-model, state-json, single-source-of-truth]
author: claude
title: Read-model projection (never write back)
source: https://event-driven.io/en/projections_and_read_models_in_event_driven_architecture/
accessed: 2026-07-06
ref_type: blog
---

# Read-model projection (never write back)

## Insight
In CQRS / event-sourcing, one authoritative write model is the single source of truth;
every read model is a *derived projection* that MUST NOT write back — otherwise you get
multiple sources of truth. Because the source is authoritative, any projection can be
safely **rebuilt** from it at any time.

## Reason
The harness todo list (Unit A) adds a second user-facing view beside the existing Workflow
Status Display. The read-model rule sets the mechanism that keeps them from becoming a
second drifting source of truth: keep `state.json` the single source of truth, make the
todo list a one-way projection that never writes back, and rebuild it from `state.json` on
resume. Invoke this insight whenever a new user-facing view is derived from `state.json`.

## Source
- https://event-driven.io/en/projections_and_read_models_in_event_driven_architecture/
- Corroborating: CQRS.com, "Projections" — https://www.cqrs.com/event-driven-architecture/projections/

## Excerpt
A read model is a projection built from the event stream; it is disposable and can be
rebuilt at any time from the authoritative source, so it never becomes a second source of
truth.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-07-06 | fe6cbcd3-5e63-46fb-a62e-93308b687d1f | Unit A ideation — the harness todo list as a read-only projection of state.json |

## Related

- [[single-source-of-truth-ui]] — the UI-facing corroboration of this read-model rule
- [[harness-todo-workflow-mirror]] — the workflow-feature backlog this insight informed
