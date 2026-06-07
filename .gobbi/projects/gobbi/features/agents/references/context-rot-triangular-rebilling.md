---
name: context-rot-triangular-rebilling
description: Long sessions degrade reasoning (Context Rot) and re-bill prior turns (triangular series); the Ralph-Loop pattern restarts fresh and carries state via files.
type: references
scope: feature
feature: agents
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [subagent, context-rot, cost, ralph-loop, saturation]
title: Context Rot + triangular re-billing — the counter-force to continuation
source: https://www.augmentcode.com/guides/ai-agent-loop-token-cost-context-constraints
accessed: 2026-06-07
ref_type: blog
---

# Context Rot + triangular re-billing — the counter-force to continuation

## Insight
As a session accumulates tokens, reasoning quality declines ("Context Rot"), and each new turn re-bills (or re-caches) all prior turns — a triangular cost series. The Ralph-Loop / fresh-context pattern deliberately restarts in a clean window and carries state via files to avoid both.

## Related
- Counterfactual / steel-man in the Framed Problem (continuation is not free).
- Design D1 (saturation cap — bound chain length, prefer fresh past the threshold).

## Why it applies
This is the counter-force the design must answer, not ignore. It justifies the saturation cap on continuation chains and the executor default of fresh. gobbi already carries state via files (artifacts/staging), so the fresh fallback is cheap — the Ralph-Loop pattern is already half-implemented.

## Source
- https://www.augmentcode.com/guides/ai-agent-loop-token-cost-context-constraints

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-07 | a4e3b54d-3182-4193-8a42-69fce489a098 | Steel-man + Design D1 saturation cap |
