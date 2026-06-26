---
name: codex-proposer-decisions
description: Substantive user decisions from Ideation for the Codex-proposer feature: scope, mode, feature slug, integration model, large-gap rubric, cost policy, and independence control.
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-06-26
session: 6cf13813-a002-4e55-96b9-a5d65f619ef8
tags: [ideation, design, codex]
keywords: [proposer, selective-integration, large-gap, propose-mode, independence-control]
author: claude
outcome: User confirmed all five productive steps, all-five-default-ON, producer-as-integrator, large-gap-to-manager, dual-EVALUATION-as-independence-control.
---

# Codex Proposer — Substantive User Decisions

## Context

Session 2026-06-25-6cf13813-a002-4e55-96b9-a5d65f619ef8 Ideation loop, 2 iterations (iter1 REVISE, iter2 PASS). The user directed a new feature: extend Codex from evaluation-only to an independent proposer across the gobbi workflow's productive steps. The following exchanges produced binding decisions that future sessions must not re-litigate.

## Question

Multiple design questions were settled across the DISCUSSION sub-phases and the iter2 REVISE resolution. Collected here by topic.

## Options considered

See the `ideation-codex-proposer.md` Scope Contract and Design (D1–D9) for the full options-and-evidence record. This file records only the user's choices and what alternatives they displaced.

## User decision

**1. Scope: which steps get a Codex proposer?**
All five productive steps (Ideation, Preparation, Planning, Execution, Wrap-up). The user explicitly included Preparation. One-phase-per-session cadence default was overridden by user (full design + implement in one PR); compressed-review risk compensated by mandatory dual-system EVALUATION.

**2. Feature slug: `workflow` (not `evaluation`)**
Confirmed. Dual-system/codex memory already lives in `features/workflow/`; no `features/evaluation/` directory exists; the proposer changes every loop's WORK. Feature slug = `workflow` is locked.

**3. Reconciliation model: producer-as-default-integrator (not manager-as-selector)**
Initial framing was "Claude subagents decide by merging the Codex co-worker results, like co-workers." The user challenged the manager-as-selector default when the leader proposed it. Final decision: the **Claude producer** (leader/executor/assistant) is the default integrator via **principle-based selective integration** — take principle-better elements, keep own where stronger, log took/rejected/why. The **manager** adjudicates ONLY large gaps and escalates to the user. This displaces manager-as-default-selector and naive-blend.

**4. Large-gap threshold**
A gap is LARGE (→ manager adjudicates → user escalation) when ANY of: (a) Always-Ask category (Design / Scope / Destructive); (b) proposals are mutually exclusive at the artifact's core (a fork); (c) principle-analysis cannot pick a winner (equipoise). Everything else is SMALL (producer integrates + logs). Maps 1:1 to the evaluation Minor/Major severity ladder.

**5. `propose.mode` default: all-five-ON (not high-value-on / Execution-opt-in)**
The leader recommended Execution-opt-in due to per-task cost multiplication. The user overrode: `propose.mode` default-ON for all 5 steps, per-step toggleable. The user owns the Execution per-task cost. Cost mechanisms (single round, ≥1200s timeout, foreground, structural validation, degraded-mode fallback) are retained.

**6. Finding B — independence control: dual EVALUATION, not origin-aware verdict weighting**
At iter1, D4 claimed "the manager weighs the Codex verdict with awareness of the proposer origin" as a mitigation for the self-preference residual. Both evaluators found this non-operational (it implies an out-of-scope evaluation-mechanism change; COD-OVERALL-2 confidence 100). The user confirmed the iter2 decision: **remove the mitigation claim**; the cross-family independence control for integrated content is the **independent dual EVALUATION itself** (two systems review every canonical artifact every loop before RECORD). Origin-aware verdict weighting is NOT added. The structural tier guard (`proposer-evaluator-model-tier-guard`) stays a staged feature backlog, pulled only if the residual is empirically observed.

## Implication

- Planning inherits these decisions as immutable constraints. None of D1–D9 is open for redesign in Planning.
- The two carry-forward items (Success Criteria #1 path wording, D7 record-map row) are doc-fix tasks within the locked design, not design changes — both resolved in-session.
- Any evaluator finding that questions the producer-as-integrator choice or the dual-EVALUATION-as-control choice is a user-decided boundary — record the disposition as disputed with the user decision cited; do not reopen.

## Related

- [[codex-proposer-model]] — the locked design this discussion produced
