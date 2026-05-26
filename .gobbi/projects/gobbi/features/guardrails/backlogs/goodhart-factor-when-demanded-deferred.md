---
name: goodhart-factor-when-demanded-deferred
description: Deferred risk — agents[] population metric may become a gaming target if demanded as a KPI; quality gates are a future extension.
type: backlogs
scope: feature
feature: guardrails
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [agents-array, goodhart-law, quality-gate, deferred]
priority: low
disposition: deferred
project-scope: false
shipped_in: null
---

# Goodhart risk: agents[] population metric becomes target when demanded

## Context

Risk identified during guardrails Ideation: if the project starts treating `agents[]` population rate as a metric, teams may game it by providing trivial or near-empty entries. The design does not add any gate that enforces quality of the populated fields — it only enforces presence.

## Why deferred

Deferred from the hook + reconstructor Ideation scope. The hook + reconstructor satisfy the literal ask (populate `agents[]`). Field-quality gates are a future extension.

The hook + reconstructor session's success criterion was "≥ 90% population (12 fields × N entries)" — this is a presence threshold, not a quality threshold. Quality gates (e.g., non-null `step/phase/iter`) are downstream of field presence; they require a schema validator which was itself deferred as a separate work item.

## When to pick up

When the project decides to enforce `agents[]` field quality rather than mere presence — for example, when a schema validator for session.json is added.

## Suggested approach

- Add a schema validator gate that checks non-null values on critical `agents[]` fields (`step`, `phase`, `iter`).
- Accept the risk for now: the presence gate is already useful and the Goodhart failure mode requires deliberate gaming.
- A future session adding `agents[]` quality validation should reference this item as the motivating concern.

## Originating session

`.gobbi/projects/gobbi/sessions/` — originated in session 1b26cf20 guardrails Ideation.

## Related

- Guardrails Ideation evaluation risk finding (iter1 Claude Risk R3 — evaluator finding provenance)
- Skill-loading discipline backlog (the schema validator work that was itself deferred)
