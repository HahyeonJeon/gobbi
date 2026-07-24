---
name: fix-backlog-anchor-refresh
description: Refresh the fix-d2/fix-d4 review-backlog line-anchors into planning/SKILL.md after the split
type: backlogs
scope: feature
feature: workflow
status: deferred
created: 2026-07-16
session: 2026-07-16-847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [process]
keywords: [backlog-anchors, fix-d2, fix-d4, line-refs, split-fallout]
author: claude
priority: low
project-scope: false
shipped_in: null
---

# Refresh the fix-d2 / fix-d4 backlog anchors after the planning split

## Context
`backlogs/evaluation/fix-d2-review-findings.md` (D2-001, D2-002) and `fix-d4-review-findings.md` (D4-033, D4-034, D4-003) cite `planning/SKILL.md` and `planning/mistakes.md` by line number for future fixes. The planning split relocates that content: the gobbi peer procedure folds into `orchestration/workflow/planning.md`, and the two `planning/mistakes.md` traps move to `orchestration/mistakes.md`. The line-anchors will drift or point at emptied files.

## Why deferred
These are open forward-work backlogs owned by the review-fix campaign, not this session's split. Editing them is anchor maintenance that follows the split, not part of it. Per the "removal must reclassify active design docs and open backlogs" discipline, they are surfaced here rather than silently invalidated.

## When to pick up
Immediately after the planning split merges — or folded into the next review-fix session that touches these backlogs. D4-003 (the `planning/mistakes.md:31` wrong script path) is fixed in transit by this session's mistakes move, so its backlog entry can be closed then.

## Suggested approach
Re-point each anchor to the content's new home (`orchestration/workflow/planning.md` for the peer-procedure findings; `orchestration/mistakes.md` for the trap). Close D4-003 as shipped-by-this-split.

## Originating session
`.gobbi/projects/gobbi/sessions/2026-07-16-847bafc9-9659-46b4-b23e-653e25f0e9f5/`

## Related
- [[split-remaining-loop-skills]] — the broader split campaign these anchors track
