---
name: task-08-single-system-evaluation-codex-waived
description: Task 08's close-out verification ran single-system (Codex waived) — the cold-load P10 proof is the claude arm only, and task 08 carries no per-perspective adversarial evaluation by design.
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-07-24
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [process]
keywords: [codex-waiver, single-system-evaluation, cold-load, p10, empirical-proof, close-out]
author: claude
outcome: Task 08's acceptance is the empirical cold-load P10 proof + deterministic gates, not a
  7-perspective adversarial evaluation. The cold-load re-run ran the claude arm only under the
  session-wide Codex waiver; the budget-raised re-run was user-authorized.
---

# Task 08 close-out ran single-system — Codex waived; cold-load is the claude arm only

## Context

Task `08-close-planning-split` is the terminal close-out task. Its acceptance is (a) the deterministic
close-out gates and (b) the empirical cold-load P10 proof — the property no deterministic gate can test.
It carries no `evaluation/iter1/` per-perspective directory by design; it was not routed to a
7-perspective adversarial evaluator.

## Two decisions this task

1. **The session-wide Codex waiver** (Planning iter 4 onward) governs — the cold-load probe is the
   claude arm only; the Codex arm is waived.
2. **The budget-raised cold-load re-run** — the plan's original probe ceilings were structurally
   unsatisfiable (see the staged mistake-candidate
   `cold-load-probe-budget-token-ceilings-unsatisfiable`), so the probe false-FAILed a working SOP. The
   user authorized a budget-raised re-run (AskUserQuestion 2026-07-24, "Re-run cold-load, fixed budget"),
   which returned COLD_LOAD_PASS.

## Implication

Per `mistakes/verification/single-evaluator-pass-is-provisional.md`, this PASS is provisional. But the
COLD_LOAD_PASS verdict is a direct empirical signal — a fresh agent's own successful plan draft from the
SOP alone — not a proxy. If the generic SOP's standalone-sufficiency is later doubted, re-running the
cold-load probe (or a Codex arm of it) with calibrated ceilings is the recommended first step.

## Related

- `mistakes/verification/single-evaluator-pass-is-provisional.md` — the trap this waiver triggers
- [[cold-load-probe-budget-token-ceilings-unsatisfiable]] — the probe-ceiling trap this task surfaced
- [[coldload-probe-params-empirically-calibrated]] — the follow-up backlog for the probe pattern
- [[task-06-single-system-evaluation-codex-waived]] — the prior task's waiver, same session
