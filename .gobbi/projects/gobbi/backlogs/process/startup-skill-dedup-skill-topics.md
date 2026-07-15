---
name: startup-skill-dedup-skill-topics
description: The anti-sycophancy contract, premise gate, and riskiest-first override are restated verbatim in both startup/SKILL.md and startup/topics.md; consider a point-don't-restate pass.
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-14
session: 97d3ef5a-1b8a-4dab-b884-9f686e185b22
tags: [process, docs-sync]
keywords: [restatement, dry, maintainability, point-dont-restate, startup-skill]
author: claude
priority: low
project-scope: true
shipped_in: null
related: []
---

# Deduplicate the verbatim restatement across `startup/SKILL.md` and `startup/topics.md`

## Context

The `startup` skill's Execution rewrite (this session) shipped the anti-sycophancy contract, the
problem-before-solution premise gate, and the riskiest-assumption-first depth override in BOTH
`skills/startup/SKILL.md` (Procedure) and `skills/startup/topics.md` (traversal rules) — verbatim, in
full, per the locked Ideation design's own CRUD map, which explicitly directed these three blocks
into both files. `topics.md` adds an owner pointer ("SKILL.md § … owns the rule") but still restates
the complete content rather than pointing only. The Claude Execution evaluator flagged this
(`FIND-DUP`, Low/75 confidence) as a live maintainability risk: if either copy is edited later without
the other, the two will drift and no guard currently catches it.

## Why deferred

Two facts kept this out of the Execution loop's own fix scope: (1) the duplication is
design-mandated, not an Execution improvisation — fixing it would mean re-designing the locked
`ideation-design.md` §6 CRUD map, out of Execution's scope; (2) the standing
`point-dont-restate-workflow-docs` project rule does not govern this surface — its own "When NOT to
apply" section scopes it to `orchestration/workflow/*.md` only, and `skills/startup/` has no
equivalent rule in force. There was no existing rule this duplication violated, so it is a deliberate
scope-preserving deferral, not a defect the session left unfixed.

## When to pick up

No hard prerequisite. Pick this up whenever a future session is touching `skills/startup/SKILL.md` or
`skills/startup/topics.md` for an unrelated reason (natural co-touch point), or as a standalone
point-don't-restate pass if `skills/startup/` ever gets its own restatement-discipline rule (parallel
to `point-dont-restate-workflow-docs`).

## Suggested approach

Two live options, both requiring a design decision (not a mechanical fix): (a) convert
`topics.md`'s restatement into a bare pointer to `SKILL.md`'s canonical block — trades away
`topics.md`'s in-line traversal usability (a reader walking topics.md loses the inline text and must
jump files mid-traversal); (b) extend `point-dont-restate-workflow-docs`'s scope to cover
`skills/startup/` (or author a parallel rule for skill-authoring surfaces generally) — a rule-scope
change requiring its own user decision, not a side effect of this fix. Either option is a genuine
usability trade the design author (not an execution pass) should decide.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-14-97d3ef5a-1b8a-4dab-b884-9f686e185b22/`

## Related

(none — recorded standalone as the deferred-risk record for the Execution loop's `FIND-DUP` finding)
