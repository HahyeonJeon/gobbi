---
name: persistent-vs-ephemeral-subagents
description: Persistent sub-agent sessions accumulate knowledge; ephemeral ones guarantee no state leakage — an explicit named tradeoff.
type: references
scope: feature
feature: agents
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [subagent, context, persistent, ephemeral, tradeoff]
title: Persistent vs ephemeral sub-agent sessions tradeoff
source: https://www.vectara.com/blog/introducing-sub-agents
accessed: 2026-06-07
ref_type: blog
---

# Persistent vs ephemeral sub-agent sessions tradeoff

## Insight
Persistent vs ephemeral sub-agent sessions is an explicit, named tradeoff: a persistent agent accumulates knowledge across turns; an ephemeral (fresh) agent guarantees no state leakage. Neither dominates — the choice depends on the role.

## Related
- Design D1 (continue-vs-fresh rule) — the leader/executor chains want persistent; the evaluator wants ephemeral.
- Internal insight I5 (evaluator independence is the ephemeral case).

## Why it applies
gobbi wants persistent for the leader/executor chains (carry problem understanding) and ephemeral for evaluators (no verdict leakage across iterations, no cross-system contamination). This redesign's role-keyed split is exactly that tradeoff applied per role.

## Source
- https://www.vectara.com/blog/introducing-sub-agents

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-07 | a4e3b54d-3182-4193-8a42-69fce489a098 | Design D1 (role-keyed continue-vs-fresh split) |
