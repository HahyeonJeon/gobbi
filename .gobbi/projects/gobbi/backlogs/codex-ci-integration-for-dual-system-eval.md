---
name: codex-ci-integration-for-dual-system-eval
description: Automate Codex evaluation runs at PR and iteration boundaries via CI; deferred as too large to bundle with session-foundations-bundle-b.
type: backlogs
scope: project
feature: null
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [evaluation, codex, ci, dual-system, deferred]
title: "Codex CI integration for dual-system evaluation"
project: gobbi
anchor_session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
disposition: open
---

# Codex CI integration for dual-system evaluation

## Context

The dual-system evaluation pattern (Claude Code + Codex) is the canonical evaluator topology in `orchestration/workflow/evaluation.md`. Today Codex is invoked manually by the user via the `/codex:adversarial-review` slash command (the model-uninvocable variant per the Phase-10 entry in user memory). A CI integration would automate Codex evaluation runs at PR boundaries and at iteration boundaries inside any workflow loop, freeing the user from manually orchestrating the dual-system comparison.

## Why deferred

Listed as priority #1 in the original prior-session deferred list. Substantial standalone item — comparable in scope to a full feature (multiple PRs across CI config, hook design, Codex invocation contracts, divergence-reconciliation tooling). Bundling it into this session's `session-foundations-bundle-b` was rejected during Sub-step A bundle-scope deliberation as "too large; would dilute the other two items."

## When to pick up

- After T1 + T3 from this session ship — T3's `agents[]` telemetry could inform CI design (token budgeting, per-perspective spawn cost projection).
- Recommend pairing with the Item 1-2 (skill-loading-discipline) matrix work — both touch the delegation / evaluation infrastructure.
- No hard blocking dependency; can run any time after this session's PR merges.

## Suggested approach

1. Survey existing Codex CLI invocation paths in the project (any prior scripts referenced from `agents/codex-rescue.md` or similar).
2. Decide on CI venue: GitHub Actions, a `gobbi codex-eval` shell command, or a hook-based runner.
3. Specify the divergence-reconciliation output contract (what the manager reads to decide PASS / REVISE / FAIL).
4. Run an Ideation Loop with PI agents to frame the integration as a feature.

## Effort estimate

Large — likely a multi-session campaign. May decompose into sub-features: (a) Codex CLI invocation harness, (b) CI workflow plumbing, (c) divergence-reconciliation, (d) telemetry integration.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`

## Anchor

- Sub-step A bundle-scope deliberation (user excluded from this session's bundle)
- Prior-session 7ea62d36 deferred list (priority #1)
