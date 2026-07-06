---
name: single-source-of-truth-ui
description: Redux/React — durable state lives in one canonical store; views are derived. Avoid duplicated derivable state that drifts.
type: references
scope: project
feature: null
status: active
created: 2026-07-06
session: fe6cbcd3-5e63-46fb-a62e-93308b687d1f
tags: [design]
keywords: [redux, react, single-source-of-truth, derived-state, projection, ui-state]
author: claude
title: Single source of truth — avoid duplicated derivable state (UI)
source: https://redux.js.org/understanding/thinking-in-redux/three-principles
accessed: 2026-07-06
ref_type: docs
---

# Single source of truth — avoid duplicated derivable state (UI)

## Insight
Redux's first principle is a single source of truth: durable state lives in one canonical
store and views are derived from it. React's state-structure guidance says to avoid
redundant / duplicated state when it can be calculated from existing state — because
duplicated state drifts.

## Reason
For Unit A, `state.json` is the canonical store; the Workflow Status Display and the
harness todo list are derived UI projections. Neither should hold state that duplicates
`state.json` — that is exactly the "second drifting source of truth" the user flagged.
This is the UI-facing corroboration of the CQRS read-model rule staged separately at
`read-model-projection`. Invoke it when structuring any UI that mirrors `state.json`.

## Source
- https://redux.js.org/understanding/thinking-in-redux/three-principles
- Corroborating: React, "Choosing the State Structure" — https://react.dev/learn/choosing-the-state-structure
- Surfaced by the Codex proposal; folded in as corroboration for the CQRS read-model insight.

## Excerpt
Choose state that avoids redundancy: if a value can be calculated from existing state
during rendering, do not put that value into state — duplicated state can fall out of sync.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-07-06 | fe6cbcd3-5e63-46fb-a62e-93308b687d1f | Unit A ideation — corroborating the state.json-authoritative projection design |

## Related

- [[read-model-projection]] — the CQRS read-model rule this UI guidance corroborates
- [[harness-todo-workflow-mirror]] — the workflow-feature backlog this insight informed
