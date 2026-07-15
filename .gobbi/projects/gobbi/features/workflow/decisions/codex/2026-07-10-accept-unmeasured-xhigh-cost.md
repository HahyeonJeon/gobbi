---
name: accept-unmeasured-xhigh-cost
description: "Accept higher token use and latency without adding benchmarking to this task."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [codex, design]
keywords: [xhigh, cost, latency]
author: codex
---

# Accept unmeasured xhigh cost

## Context
Forcing `xhigh` on every Codex role increases tokens and response time, but the repository has no task-bounded benchmark.

## Decision
Accept the qualitative cost for deterministic quality. Keep performance benchmarking out of scope.

## Rationale
The user explicitly chose consistent `xhigh` despite the trade-off.

## Alternatives considered
Role-specific effort and a separate benchmark phase were rejected or deferred.

## Consequences
The open cost note remains visible. Future measurement may revisit the policy without blocking this release.

## Related
- [[model-and-effort-defaults]] — the user decision accepting this trade-off.
