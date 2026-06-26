---
name: proposer-evaluator-model-tier-guard
description: Add a different model/effort tier between the Codex proposer and the Codex evaluator to harden against residual self-preference when proposer content is integrated.
type: backlogs
scope: feature
feature: workflow
status: deferred
created: 2026-06-25
session: 6cf13813-a002-4e55-96b9-a5d65f619ef8
tags: [process, codex]
keywords: [self-preference, proposer-evaluator-independence, model-tier, dual-system-production, hardening]
author: claude
priority: low
project-scope: false
shipped_in: null
---

# Proposer / evaluator model-tier guard

## Context
D4 of the Codex-proposer design preserves proposer↔evaluator independence by three structural facts: stateless `codex exec` runs, a Claude-authored canonical artifact under review, and forbidding the proposal transcript from entering the evaluator prompt. A **residual** self-preference risk remains: where the producer integrates Codex-origin content, the Codex evaluator partially reviews Codex ideas and may over-rate those sections. The current mitigation is the Integration Log (records Codex-origin deltas so the manager weighs the Codex verdict with awareness) — but it does not eliminate the bias.

## Why deferred
The structural guards + the Integration-Log mitigation are judged sufficient for the initial rollout; adding a configurable different-model/effort tier for the Codex proposer vs the Codex evaluator adds config + cost surface without evidence yet that the residual bias materializes. Pull it in only if observed.

## When to pick up
- When telemetry / observed behavior shows a Codex evaluator over-rating Claude artifacts that absorbed Codex proposals (the residual-self-preference symptom).
- Requires a settings shape decision: how to express distinct `model`/`effort` for the proposer vs evaluator without violating "do not hard-code model/effort unless the user asks."

## Suggested approach
Add an optional per-step proposer model/effort override (distinct from the evaluator's), defaulting to inherit (unset). Document it as the option (b) hardening named in Ideation D4. Validate by checking the proposer and evaluator `codex exec` invocations resolve to different tiers when the guard is enabled.

## Originating session
`.gobbi/projects/gobbi/sessions/2026-06-25-6cf13813-a002-4e55-96b9-a5d65f619ef8/`

## Related

- [[llm-self-preference-bias]] — the bias this guard hardens against
