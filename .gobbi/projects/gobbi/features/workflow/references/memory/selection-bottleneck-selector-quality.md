---
name: selection-bottleneck-selector-quality
description: Under selection-based aggregation a diverse two-system team wins big; synthesis loses to a single model. Selector quality dominates generator diversity.
type: references
scope: feature
feature: workflow
status: active
created: 2026-06-25
session: 6cf13813-a002-4e55-96b9-a5d65f619ef8
tags: [design, process]
keywords: [selection-bottleneck, selector-quality, dual-system-production, reconciliation, anti-groupthink]
author: claude
title: The Selection Bottleneck in Multi-Agent LLM Pipelines
source: https://arxiv.org/abs/2603.20324
accessed: 2026-06-25
ref_type: paper
---

# The Selection Bottleneck in Multi-Agent LLM Pipelines

## Insight
There is a crossover threshold in aggregation quality that decides whether team diversity helps or hurts. A diverse team with judge-based **selection** achieves a 0.810 win rate against a single-model baseline; a homogeneous team scores 0.512 (near chance); **synthesis**-based aggregation loses to the single-model baseline >80% of the time. Selector (integrator) quality is a more impactful design lever than generator diversity.

## Reason
THE central anchor for the Codex-proposer design (`workflow` feature). It is why gobbi's production integration must be SELECTION (fold in the principle-better element), not synthesis/blend, and why the quality of the selective-integration step — located in the Claude producer per the confirmed co-worker model, with the manager as large-gap adjudicator — is the dominant lever. Invoke when justifying the producer-as-default-integrator + never-naive-blend decision.

## Source
- https://arxiv.org/abs/2603.20324 — "When Agents Disagree: The Selection Bottleneck in Multi-Agent LLM Pipelines" (2026-03-20)

## Excerpt
"A diverse team with judge-based selection achieves a win rate of 0.810 against a single-model baseline, while a homogeneous team scores 0.512 — near chance… selector quality may be a more impactful design lever than generator diversity in single-round generate-then-select pipelines."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-25 | 6cf13813-a002-4e55-96b9-a5d65f619ef8 | Ideation D2/D8 — producer-default selective integration, select-not-synthesize |

## Related

- [[mixture-of-agents]] — the synthesis-vs-selection tension this result resolves
- [[multi-agent-production-cost]] — the cost ceiling that bounds how many proposers run
