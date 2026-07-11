---
name: codex-subagent-model-effort
description: "Codex custom-agent files can set model and reasoning effort directly."
type: references
scope: feature
feature: workflow
status: active
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [memory, design]
keywords: [codex-subagents, agent-toml, model-reasoning-effort]
author: codex
title: "Codex subagent model and effort fields"
source: "https://developers.openai.com/codex/subagents"
accessed: 2026-07-10
ref_type: docs
---

# Codex subagent model and effort fields

## Insight

Custom Codex agent files may set `model` and `model_reasoning_effort` directly. Higher effort can improve complex-work quality while increasing response time and token use.

## Reason

Gobbi's five role TOMLs are valid effective policy authorities, and the cost trade-off must stay explicit.

## Source

- https://developers.openai.com/codex/subagents
- OpenAI Codex documentation, accessed 2026-07-10

## Excerpt

Paraphrase: pin model and effort in an agent file for finer control, with higher effort costing more time and tokens.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-07-10 | 019f4a1e-8898-7e51-845b-ec289f1400c7 | Five-wrapper design and accepted cost risk. |

## Related

None.
