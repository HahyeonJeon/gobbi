---
name: prompt-cache-ttl-regression
description: Prompt-cache TTL regressed 1h to 5m; multi-minute agent gaps miss the cache, so "continuation saves tokens" is conditional on turn cadence.
type: references
scope: feature
feature: agents
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [subagent, cost, prompt-cache, ttl, continuation]
title: Prompt-cache TTL regression makes continuation savings conditional
source: https://github.com/anthropics/claude-code/issues/46829
accessed: 2026-06-07
ref_type: code
---

# Prompt-cache TTL regression makes continuation savings conditional

## Insight
Prompt-cache reads cost ~10% of base input price, but the cache TTL silently regressed from 1h to 5m around 2026-03. Agent calls are spread across minutes or hours, so a multi-minute continuation gap misses the cache and pays a full re-prefill of the growing window. Net continuation savings come from avoided re-reads, not from cache hits.

## Related
- Design D4 (primary-where-safe — the savings claim is conditional, so continuation is preferred-where-safe, not always).
- Counterfactual / steel-man in the Framed Problem (continuation is not free).

## Why it applies
It tempers the token-savings argument for continuation: the real win is avoiding re-reads of the codebase and project memory, not the prompt cache. This keeps the design honest about where the benefit comes from and reinforces the saturation cap.

## Source
- https://github.com/anthropics/claude-code/issues/46829
- https://platform.claude.com/docs/en/build-with-claude/prompt-caching

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-07 | a4e3b54d-3182-4193-8a42-69fce489a098 | Design D4 + steel-man (savings are from avoided re-reads) |
