---
name: multi-agent-production-cost
description: Multi-agent production costs 4-220x input tokens with diminishing returns past a small team; 2 agents / single brief round is the practical default.
type: references
scope: feature
feature: workflow
status: active
created: 2026-06-25
session: 6cf13813-a002-4e55-96b9-a5d65f619ef8
tags: [design, process]
keywords: [multi-agent-cost, diminishing-returns, token-budget, single-round, propose-mode]
author: claude
title: Multi-agent LLM cost and diminishing returns
source: https://arxiv.org/html/2604.02460v1
accessed: 2026-06-25
ref_type: paper
---

# Multi-agent LLM cost and diminishing returns

## Insight
Multi-agent systems consume 4–220× more input tokens than single-agent counterparts (2–12× even with perfect context reuse); gains plateau past a small team, and a single agent with a skill library can match multi-agent quality at lower cost on many tasks. The practical default is two agents and a single brief round — additional rounds add redundancy and drift.

## Reason
Anchors D6 (configuration / cost control) for the `workflow` Codex-proposer design: exactly two producers (Claude + Codex), single round (no multi-round debate), per-step `propose.mode` toggle. The user chose default-ON for all five steps and owns the Execution per-task cost; this reference is the evidence basis for keeping the toggle, single-round, timeout, and degraded-mode bounds. Invoke when justifying cost-control choices or a future decision to toggle a low-yield step OFF.

## Source
- https://arxiv.org/html/2604.02460v1 — "Single-Agent LLMs Outperform Multi-Agent Systems on Multi-Hop Reasoning Under Equal Thinking Token Budgets"
- Supporting: https://arxiv.org/html/2505.18286v1 ; iMAD https://arxiv.org/pdf/2511.11306

## Excerpt
"Multi-agent systems consume 4–220× more input tokens than single-agent counterparts, and even with perfect context reuse still require 2–12× more tokens… two agents with two rounds (optionally three) as a practical default, scaling up only for difficult slices after cost-latency considerations."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-25 | 6cf13813-a002-4e55-96b9-a5d65f619ef8 | Ideation D6 — cost control, per-step propose.mode, single-round |

## Related

- [[selection-bottleneck-selector-quality]] — why the bounded two-system team is worth its cost under selection
