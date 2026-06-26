---
name: llm-self-preference-bias
description: An LLM over-rates its own generations as a judge; using different model families for generation vs evaluation reduces the bias.
type: references
scope: feature
feature: workflow
status: active
created: 2026-06-25
session: 6cf13813-a002-4e55-96b9-a5d65f619ef8
tags: [design, process]
keywords: [self-preference-bias, llm-as-judge, producer-evaluator-independence, perplexity, anti-groupthink]
author: claude
title: Self-Preference Bias in LLM-as-a-Judge
source: https://arxiv.org/abs/2410.21819
accessed: 2026-06-25
ref_type: paper
---

# Self-Preference Bias in LLM-as-a-Judge

## Insight
LLM evaluators recognize and favor their own generations (a measured linear correlation between self-recognition and self-preference), assigning disproportionately high scores to lower-perplexity own-family outputs regardless of actual quality. Using different model families for generation vs evaluation mitigates the bias.

## Reason
Anchors D4 (proposer↔evaluator independence) for the `workflow` Codex-proposer design. The Codex proposer must never later judge its own proposal: the canonical artifact under review must be Claude-authored (re-expressed, higher perplexity to Codex), and the Codex proposal transcript must never enter the Codex evaluator prompt. Invoke when justifying the independence guards and the residual-self-preference mitigation (integration log records Codex-origin deltas).

## Source
- https://arxiv.org/abs/2410.21819 — "Self-Preference Bias in LLM-as-a-Judge"

## Excerpt
"LLMs assign significantly higher evaluations to outputs with lower perplexity than human evaluators, regardless of whether the outputs were self-generated… using different model families for generation and evaluation can help reduce this bias."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-25 | 6cf13813-a002-4e55-96b9-a5d65f619ef8 | Ideation D4 — proposer↔evaluator independence design |

## Related

- [[selection-bottleneck-selector-quality]] — the selection model whose evaluator must stay independent of the proposer
