---
name: session-json-schema-usage-field-guard
description: Assumption risk — session.json schema change (usage.codex/grandTotal) not checked against any AJV validator; deferred as low-priority since no validator gates usage shape
type: decisions
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [schema, assumption_risk]
decision_status: accepted
supersedes: null
superseded_by: null
---

# Check session.json usage-field schema change against any AJV validator

## Context

Task 03 adds `usage.codex` and `usage.grandTotal` to `session.template.json`. Claude RISK-2 (Risk, assumption_risk, Medium, Confidence 50) flagged that the plan does not verify whether any AJV schema / drift-detector / schemaVersion bump gates session.json's `usage` shape.

The project historically uses AJV + schemaVersion for session.json. If a validator exists and is not co-changed, reconcile or session-init could reject the new shape.

## Decision

Task 03's verify includes `jq -e '.usage|has("codex") and has("grandTotal")' .gobbi/projects/gobbi/skills/orchestration/templates/session.template.json`. The executor is responsible for checking whether any AJV schema gates the `usage` object shape and, if so, co-bumping the schemaVersion. This check is stated in the task's `what`.

Confidence 50 means this risk is probable but unconfirmed — no AJV file for session.json usage was located at planning time. If a validator is found during Execution, the executor co-changes it.

## Rationale

An un-bumped schema is a latent runtime reject. The fix is a one-line schemaVersion bump if a validator is found; the cost of checking is low and the cost of missing it is a runtime failure.

## Consequences

Task 03 executor checks for AJV validation of session.json `usage` shape and co-bumps if found.
