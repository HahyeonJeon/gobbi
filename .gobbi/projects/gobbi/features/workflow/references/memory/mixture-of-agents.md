---
name: mixture-of-agents
description: Multiple LLM proposers + an aggregator beat single models, but the aggregation method (not diversity) decides whether it helps.
type: references
scope: feature
feature: workflow
status: active
created: 2026-06-25
session: 6cf13813-a002-4e55-96b9-a5d65f619ef8
tags: [design, process]
keywords: [mixture-of-agents, self-moa, ensemble, aggregator, dual-system-production]
author: claude
title: Mixture-of-Agents (MoA) and the Self-MoA caveat
source: https://arxiv.org/abs/2406.04692
accessed: 2026-06-25
ref_type: paper
---

# Mixture-of-Agents (MoA) and the Self-MoA caveat

## Insight
Querying multiple proposer LLMs and synthesizing them with an aggregator outperforms any single model on AlpacaEval/MT-Bench — BUT "Self-MoA" (one strong model sampled multiple times) often beats heterogeneous model-mixing under *synthesis* aggregation. The aggregation method, not the mere diversity of proposers, decides whether the ensemble helps.

## Reason
Anchors the Codex-proposer design (`workflow` feature): it validates running a second independent proposer at WORK, but warns that simply adding a Codex proposal is not enough — the integration step must be selective (SELECT, not naive-blend). Invoke when justifying why production integration must be principle-based selection rather than averaging.

## Source
- https://arxiv.org/abs/2406.04692 — "Mixture-of-Agents Enhances Large Language Model Capabilities"
- Companion caveat: https://arxiv.org/html/2502.00674v1 — "Rethinking Mixture-of-Agents: Is Mixing Different Large Language Models Beneficial?" (Self-MoA result)

## Excerpt
"MoA first queries multiple LLMs (proposers) to generate responses, then uses an LLM (aggregator) to synthesize them into a high-quality response… Self-MoA — aggregating outputs from only the single top-performing LLM — outperforms standard MoA that mixes different LLMs in a large number of scenarios."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-25 | 6cf13813-a002-4e55-96b9-a5d65f619ef8 | Ideation D2/D8 — justifying select-not-naive-blend integration |

## Related

- [[selection-bottleneck-selector-quality]] — the result that resolves the synthesis-vs-selection tension in favor of selection
