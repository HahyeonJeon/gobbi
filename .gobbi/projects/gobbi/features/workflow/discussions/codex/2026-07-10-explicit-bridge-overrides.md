---
name: explicit-bridge-overrides
description: "Every Claude-hosted Codex proposer and evaluator run must override model and effort explicitly."
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [ideation, codex]
keywords: [codex-exec, bridge, host-inheritance]
author: codex
outcome: "Use -m and -c overrides on every current proposer and evaluator invocation."
---

# Explicit bridge overrides

## Context
Claude-hosted Codex runs currently inherit host configuration.

## Question
Should bridge runs retain host inheritance or enforce the same defaults per invocation?

## Options considered
Host inheritance, a standalone effort flag, or supported `-m` plus `-c` overrides.

## User decision
Apply `-m gpt-5.6-sol -c 'model_reasoning_effort="xhigh"'` to every current proposer and evaluator run.

## Implication
Bridge behavior is deterministic and follows the installed CLI's supported surface.

## Related
- [[claude-to-codex-bridge-contract]] — the exact interface.
