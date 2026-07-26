---
name: measure-react-skill-deterministic-load-cost
description: The react skill ships fourteen files with no load-cost evidence, and no child owns measuring React performance.
type: backlogs
scope: project
feature: null
status: deferred
created: 2026-07-25
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [evaluation, process]
keywords: [load-cost, deterministic-load, react-performance, skill-design]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Measure the react skill's deterministic load cost

## Context

An Ideation iteration-1 evaluation finding (RB-08) observed that the `react` skill's design loads
files deterministically with no evidence of the resulting token or latency load cost, and that no
child document owns measuring React runtime performance itself. At the evaluation-disposition gate,
the user accepted the finding as real but the measurement could not be produced within this session.

The skill shipped at **fourteen** files, not the fifteen the design assumed: `rules.md` was dropped
at T19 after failing the `skill-writing` P4 altitude test. The load-cost question is unchanged in
kind by that, only in size.

## Why deferred

Producing a real load-cost measurement requires either a token-count harness over the actual
shipped file set or a live-loading experiment, neither of which this session's scope or time budget
covers. The limitation is stated in `SKILL.md` — the Execution iteration-1 evaluation (RX-06) found
that it was not, and it was added during the fix pass; this backlog entry is the durable pointer to
the follow-up measurement work.

## When to pick up

The next session that revises the `react` skill's content children, or a dedicated skill-load-cost
audit session covering multiple skills. No other prerequisite.

## Suggested approach

Measure the deterministic load cost the same way an equivalent audit would for any skill: count
tokens across the deterministically-loaded set (`SKILL.md` plus whatever the P2 router pulls), compare
against comparable sibling skills (`python`, `typescript`), and decide whether any child should move
from deterministic to lookup-mode loading. Separately, decide which child (if any) should own React
runtime performance measurement techniques (profiler use, render-count budgets, bundle-size checks)
and add that content in a future iteration.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-25-bae334bf-c3df-4155-bbd0-92d5a36f3feb/`
