---
name: cold-load-probe-budget-token-ceilings-unsatisfiable
description: A verification probe's budget/token ceilings were set below what the model needs to complete the probed task, making the probe structurally impossible to pass — a false FAIL of a working artifact.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-24
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [verification, process]
keywords: [cold-load-probe, budget-ceiling, token-cap, unsatisfiable-gate, correctness-vs-cost, budget-exhausted]
author: claude
priority: medium
domain: verification
supersedes: null
superseded_by: null
---

# Cold-load probe budget/token ceilings are unsatisfiable for the model at xhigh

## What happened

Task 08's cold-load proof (skill-writing P10 — does the new SOP work standalone for a fresh agent?)
invoked a `claude` probe with `--max-budget-usd 0.10` AND a prompt capping output at `≤ 1200 output
tokens`, while asking the model to DRAFT + SELF-REVIEW a full 9-point plan from the SOP. sonnet-5 at
`--effort xhigh` produces ~5291 output tokens / ~$0.128 for a single substantive reasoning pass — so
BOTH ceilings are below the floor the probed task requires. The probe killed the model mid-draft
(budget_exhausted) before it could emit the terminal `COLD_LOAD_PASS` line. No faithful run of the probe
as-specified could ever reach PASS in this environment — the gate is structurally impossible, not merely
tight.

## Why it happens

The probe params were authored during Planning as plausible-looking guardrails without empirically
measuring what one xhigh reasoning pass over the SOP actually costs. This is the same class of defect
that dominated the Planning phase (self-verification machinery calibrated against an imagined cost, not a
measured one) — and, like the others, it was invisible until the probe was ACTUALLY RUN. It also inverts
the intent: the ceilings were meant to bound a runaway probe, but they instead guaranteed a false FAIL of
a working SOP.

## Correct approach

Measure the real cost of the probed task at the target model+effort FIRST, then set the ceiling with
headroom (e.g. 2-4×) — never guess a round number. Better: separate the CORRECTNESS signal (did the
model emit `COLD_LOAD_PASS`, i.e. was the SOP sufficient?) from the COST guardrail (a generous
kill-switch to bound a hang) — gate acceptance on the correctness signal, not on hitting an arbitrary
token count. Here the fix was to raise both ceilings and read the `COLD_LOAD_PASS` verdict directly.

## How to detect

Any verification probe that (a) asks a model to produce a substantive artifact (a plan, a review, a
draft) AND (b) caps output tokens or spend at a value not empirically measured against that model+effort
doing that task. A `budget_exhausted` / `max-budget` terminal reason mid-artifact is the tell.

## Related

- [[guard-must-not-forbid-the-state-it-requires]] — a sibling "self-verification machinery miscalibrated
  against reality, caught only by running it" trap
- [[repeated-revise-on-one-axis-means-wrong-scope-model]] — the same self-verification-miscalibration family
- [[coldload-probe-params-empirically-calibrated]] — the backlog carrying the durable fix to the probe pattern
