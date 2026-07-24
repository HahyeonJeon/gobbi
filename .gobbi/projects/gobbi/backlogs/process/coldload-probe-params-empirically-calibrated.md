---
name: coldload-probe-params-empirically-calibrated
description: The cold-load / P10 standalone-sufficiency probe pattern should set its budget + token ceilings from a measured task cost with headroom, and gate acceptance on the COLD_LOAD_PASS correctness signal, not on an arbitrary token count.
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-24
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [verification, process]
keywords: [cold-load, p10-probe, budget-ceiling, token-cap, empirical-calibration, correctness-vs-cost]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Empirically calibrate the cold-load / P10 probe's budget + token ceilings

## Context

Task 08's cold-load P10 probe encoded ceilings (`--max-budget-usd 0.10` + `≤ 1200 output tokens`) that
were structurally below what the probed task requires (sonnet-5 at xhigh drafting + self-reviewing a
9-point plan costs ~5291 tokens / ~$0.128). The probe killed the model mid-draft (budget_exhausted) and
false-FAILed a working SOP. A user-authorized budget-raised re-run then returned COLD_LOAD_PASS. The
lesson is captured as the mistake `cold-load-probe-budget-token-ceilings-unsatisfiable`; this backlog is
the durable FIX to the probe PATTERN wherever the cold-load / P10 standalone-sufficiency probe is
described or reused (e.g. the skill-writing P10 cold-load guidance).

## Why deferred

The in-session need was met by the budget-raised re-run (COLD_LOAD_PASS). Hardening the reusable probe
pattern (so the next session's cold-load probe is calibrated from the start) is a separate,
non-time-critical improvement, out of scope for the planning-skill-split close-out.

## When to pick up

Any session that next authors or reuses a cold-load / P10 standalone-sufficiency probe, or a
skill-writing / verification-tooling maintenance pass. No hard prerequisite.

## Suggested approach

Codify two rules in the probe pattern: (1) measure the real cost of the probed task at the target
model+effort FIRST, then set the ceiling with 2-4× headroom — never a guessed round number; (2) separate
the CORRECTNESS signal (did the model emit `COLD_LOAD_PASS`?) from the COST guardrail (a generous
kill-switch to bound a hang), and gate acceptance on the correctness signal, not on hitting an arbitrary
token count.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-16-847bafc9-9659-46b4-b23e-653e25f0e9f5/`

## Related

- [[cold-load-probe-budget-token-ceilings-unsatisfiable]] — the mistake this backlog's fix prevents
  recurring
