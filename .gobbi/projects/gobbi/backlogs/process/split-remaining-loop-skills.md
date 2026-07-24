---
name: split-remaining-loop-skills
description: Apply the generic-SOP / gobbi-workflow split to the four remaining loop skills
type: backlogs
scope: project
feature: null
status: deferred
created: 2026-07-16
session: 2026-07-16-847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [process]
keywords: [loop-skills, generic-split, ideation, preparation, execution, wrap-up]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Split the remaining four loop skills into generic + gobbi

## Context
This session splits only `planning` into a workflow-agnostic SOP plus gobbi content folded into the orchestration workflow doc — the same shape the delegation split (#347/#352) established. The other four loop skills (`ideation`, `preparation`, `execution`, `wrap-up`) remain monolithic gobbi loop skills that conflate universal craft with gobbi loop mechanics.

## Why deferred
Out of scope for one workflow — the user locked the scope to `planning` only. Each loop split is its own decomposition (each has a distinct craft to abstract, its own consumer sweep, and its own doc-kind reconciliation for the folded workflow doc).

## When to pick up
After the `planning` split ships and its pattern is validated. `planning` is the pilot; the four remaining splits should reuse its generic-skill shape, its fold approach, and whichever doc-kind reconciliation option (Design § D2) the user locks for `planning`.

## Suggested approach
One session per loop (or a batched campaign) mirroring the `planning` split: extract the generic craft into `{loop}/SKILL.md`, fold the gobbi mechanics into `orchestration/workflow/{loop}.md`, move the loop's `mistakes.md` to `orchestration/mistakes.md`, rewrite the evaluation bundle, sweep consumers. Resolve the eval-bundle re-home jointly with [[all-loops-eval-bundle-rehome]].

## Originating session
`.gobbi/projects/gobbi/sessions/2026-07-16-847bafc9-9659-46b4-b23e-653e25f0e9f5/`

## Related
- [[all-loops-eval-bundle-rehome]] — the paired all-loops bundle decision
