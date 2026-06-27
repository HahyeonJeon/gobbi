---
name: rolling-window-n-and-per-task-telemetry
description: C6 per-step value telemetry locks rolling-window N=3, an integration counts sub-object on session.json, a schemaVersion 2→3 bump, and per-task Execution counts
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [process, codex, evaluation]
keywords: [C6, value-telemetry, rolling-window, session-json, schema-version, per-task-execution]
author: claude
---

# C6 — rolling-window N, per-task Execution shape, and the schema bump

## Context

C6 adds per-step value telemetry so the `[Phase-B · C6]`-gated frame checks (D1.6, D4.1) become
runnable. The target exists: `session.json.workflow.{loop}` is `{startedAt, finishedAt, iter, verdict}`
(schemaVersion 2), template at `skills/orchestration/templates/session.template.json`. Three things
needed deciding before implementation: the rolling-window N, the field shape, and the schema bump; plus
the per-task Execution open sub-decision.

## Decision

1. **Rolling-window N = 3** — D4.1's "N consecutive sessions" and D1.6's "two consecutive no-value
   proposals" need a concrete N; 3 is a reasonable default, tunable later.
2. **Field shape:** add `workflow.{loop}.integration: {changing_rows, kept_own_rows}` where
   `changing_rows = count(took-codex) + count(merged-selective)` and `kept_own_rows = count(kept-own)`,
   written by RECORD parsing the Integration Log.
3. **schemaVersion 2 → 3** — adding the sub-object is a schema change; bump the version and update
   `session.template.json` + the `orchestration/SKILL.md` § Workflow Metadata reference together
   (Principle 9 co-touch).
4. **Per-task Execution:** the implemented C6 carries richer per-task integration counts (the Execution
   eval reconciled the per-task schema to the locked plan — see commit `7fea07ef`), not just an
   aggregate, so D4.1 keeps task granularity where it needs it.

## Rationale

D4.1 / D1.6 cannot be made runnable without a concrete N and a place to store the counts; storing the
counts in `session.json` (vs replaying every Integration Log) is what makes the rolling window cheap to
compute across sessions.

## Alternatives considered

- **Replay Integration Logs each time instead of storing counts** — rejected: O(sessions × logs) every
  check; precomputing is the whole point.
- **No N / unbounded history** — rejected: D4.1 needs a bounded window to be a clean pass/fail.
- **Aggregate-only Execution counts** — the first-cut proposal; superseded during Execution eval by the
  per-task reconcile (Codex caught the aggregate-vs-per-task drift from the locked plan).

## Consequences

Execution instrumented RECORD and bumped the template/schema doc together; schemaVersion is now 3.
Shipped as commits `5ee953f2` (C6) + `7fea07ef` (per-task schema reconcile). Until C6, D1.6 and D4.1
were `[Phase-B · C6]`-gated; they are now unblocked.

## Related

- [[dual-system-verification-frame]] — the frame whose D1.6/D4.1 gates this telemetry unblocks
- [[2026-06-26-verification-frame-phase-b-shipped]] — the changelog recording C6's ship
