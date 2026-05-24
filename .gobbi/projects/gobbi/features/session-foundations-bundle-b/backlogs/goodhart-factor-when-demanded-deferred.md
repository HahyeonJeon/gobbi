---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
status: deferred
feature: session-foundations-bundle-b
finding-id: iter1-R3
type: assumption_risk
domain: process
disposition: deferred
confidence: 50
severity: Medium
supersedes: null
superseded_by: null
---

# Goodhart risk: agents[] population metric becomes target when demanded

## Context

iter1 Claude Risk finding R3: if the project starts treating `agents[]` population rate as a metric, teams may game it by providing trivial or near-empty entries. The design does not add any gate that enforces quality of the populated fields — it only enforces presence.

## Decision

Deferred from T3 Ideation scope. The hook + reconstructor satisfy the literal ask (populate `agents[]`). Field-quality gates are a future extension.

## Rationale

T3's success criterion is "≥ 90% population (12 fields × N entries)" — this is a presence threshold, not a quality threshold. Quality gates (e.g., non-null `step/phase/iter`) are downstream of field presence; they require a schema validator which is closer to T2's territory (deferred entirely).

## Alternatives considered

- Add a schema validator now: out of T3 scope.
- Accept the risk: chosen. The presence gate is already useful and the Goodhart failure mode requires deliberate gaming.

## Consequences

A future session adding `agents[]` quality validation should reference this finding as the motivating concern.

## Related

- `evaluation/iter1/claude/risk.md` R3
- T2 deferred: `staging/backlogs/project/item-1-2-skill-loading-discipline.md`
