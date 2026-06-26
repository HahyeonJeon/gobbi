---
name: compaction-cap-tuning
description: Tune the per-type compaction softCap/hardCap after the mechanism's first real runs, using observed area sizes.
type: backlogs
scope: project
feature: null
status: deferred
created: 2026-06-25
session: 463a1c96-f75c-4a14-80b4-f4d6815679cd
tags: [memory]
keywords: [compaction, cap, threshold, tuning]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Tune per-type compaction caps after first runs

## Context
The compaction mechanism ships with conservative seed thresholds: softCap 12 / hardCap 15 per `{type}/{area}/`, set from today's hot-spot counts (`mistakes/verification`=14, `backlogs/memory`=13). These are first-guess values, not measured optima.

## Why deferred
Real thresholds can only be judged after the mechanism runs across several sessions and we see which areas trip the cap, how often merges fire, and whether any type is over- or under-merged. Tuning before any real run would be guessing twice.

## When to pick up
After the compaction mechanism has shipped and run at Wrap-up across ~5+ sessions, so there is observed data on per-area growth and merge frequency.

## Suggested approach
Read the compaction summaries recorded in handoffs/journals over several sessions; per type, set softCap near the steady-state healthy size and hardCap where a merge is genuinely warranted. Update `types.{type}.compaction` in `memory-vocabulary.json`.

## Originating session
`.gobbi/projects/gobbi/sessions/2026-06-25-463a1c96-f75c-4a14-80b4-f4d6815679cd/`

## Related

- [[lsm-compaction-threshold-merge-similar]] — threshold-T tuning analog from storage compaction
