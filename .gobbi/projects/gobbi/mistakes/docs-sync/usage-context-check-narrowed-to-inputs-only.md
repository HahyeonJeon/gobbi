---
name: usage-context-check-narrowed-to-inputs-only
description: A merged fresh-Executor check narrowed the seed's three context dimensions (inputs/outputs/verifies) to inputs only, dropping outputs and verifies
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-09
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [docs-sync]
keywords: [seed-faithfulness, consolidation, scope-narrowing, union-audit]
author: claude
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
related: [merging-two-seed-bullets-narrows-broader-scope]
---

# A merged fresh-Executor check narrowed the seed's three context dimensions to one

## What happened

Re-framing the planning evaluation seed, the "a fresh Executor given task N alone can read its **inputs / outputs / verifies** and begin work" scenario (three named context dimensions) was turned into `PLAN-USAGE-SCENARIO-01-CHECK-01` phrased as "full context = its `inputs:` field" — narrowing the context to `inputs:` alone and dropping `outputs:` and `verifies:`. A plan whose task named its inputs but omitted its outputs / verifies fields would pass the narrowed check while failing the seed's real condition. The dual-system evaluation (Codex, High/100) caught it.

## Why it happens

When a seed bullet enumerates several co-equal dimensions ("inputs / outputs / verifies"), the writer collapses them into a single salient one (here `inputs:`, the "full context" the fresh subagent is spawned with) and treats the rest as implied. The narrowing reads natural because `inputs:` IS the primary context field — but the seed deliberately required all three so the check proves the task is self-contained (what it consumes, produces, and self-checks).

## Correct approach

When a seed bullet enumerates multiple dimensions, the merged check MUST name every one of them (or split into one check per dimension). Here: "the task-alone context is its `inputs:`, `outputs:`, and `verifies:` fields". Run a per-seed-sub-bullet union audit that checks the SET of named dimensions, not just that the general subject is present — bundling is safe only when all named dimensions survive in the check text.

## How to detect

A seed bullet lists several named fields / dimensions joined by "/" or "and"; the merged check names only one (or a subset) of them. Tell: diff the merged check's named fields against the seed bullet's named fields and confirm the SET matches. This is the same consolidation-loss family as narrowing "each gap" to "each missing skill" — a merged check must carry the UNION of the seed's dimensions.

## Related

- [[merging-two-seed-bullets-narrows-broader-scope]] — same consolidation-narrowing family (task-07 witness: "each gap" narrowed to "each missing skill"); this is the task-08 witness (three context dimensions narrowed to one)
