---
name: fix-stale-nine-output-claim-in-sibling-skills
description: python/evaluation.md, typescript/evaluation.md, web/evaluation.md, and startup/evaluation.md still assert the retired nine-output evaluator model; only the react skill's copy was fixed this session.
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-25
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [docs-sync, evaluation]
keywords: [nine-output-evaluator, evaluation-md, stale-claim, sibling-skills]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Fix the stale nine-output-evaluator claim in four sibling skills

## Context

An Ideation iteration-1 evaluation finding (F1/RB-07) caught the `react` skill's `evaluation.md`
hard-wiring the retired nine-output evaluator model — contradicted by the live record-map, the
current workflow evaluation step, and the working validator. The same stale claim also lives in
three other places:

- `python/evaluation.md:16`
- `typescript/evaluation.md:16`
- `web/evaluation.md:5` — this one also misattributes the claim to the generic `evaluation` skill,
  whose own text defines no output shape
- `startup/evaluation.md:129` — a reference to the same stale claim

At this session's evaluation-disposition gate, the user decided to fix only the `react` skill's own
copy in iteration 2, and to backlog the other four sites rather than opportunistically fix them
inside a session scoped to the `react` skill.

## Why deferred

The fix belongs to each of those four skills, not to the session that produced the `react` skill.
Fixing them here would exceed this session's agreed scope (only the `react` skill's own artifact).

## When to pick up

Any future session that touches `python/evaluation.md`, `typescript/evaluation.md`,
`web/evaluation.md`, or `startup/evaluation.md` — or a dedicated cross-skill documentation-sync
session — should correct the nine-output claim at each cited line to match the current evaluator
model (the record-map's `evaluation/iteration-{n}/claude.md` + `codex.md` two-slot shape), and fix
the `web/evaluation.md` misattribution to the generic `evaluation` skill in the same pass.

## Suggested approach

Grep each cited file for the nine-output phrasing, replace it with a pointer to the record-map's
authoritative evaluator output shape (the way the corrected `react/evaluation.md` now does it), and
verify with the project's Markdown-link and residual-vocabulary guards afterward.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-25-bae334bf-c3df-4155-bbd0-92d5a36f3feb/`
