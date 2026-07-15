---
name: model-and-effort-defaults
description: "The user selected gpt-5.6-sol and xhigh for every Codex role."
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [ideation, codex]
keywords: [gpt-5.6-sol, xhigh, deterministic-default]
author: codex
outcome: "Use gpt-5.6-sol and xhigh across every live Codex role."
---

# Model and effort defaults

## Context
GPT-5.6 was published while Gobbi's Codex defaults remained inherited or mixed.

## Question
Which explicit model and reasoning effort should govern every Codex role?

## Options considered
Continue inheritance and mixed effort, or pin one explicit model and effort everywhere.

## User decision
Set the default model to `gpt-5.6-sol` and Codex effort to `xhigh` for all roles.

## Implication
The user accepts higher latency, token use, and reduced machine-level control for deterministic quality.

## Related
- [[deterministic-codex-policy-authorities]] — the resulting design.
