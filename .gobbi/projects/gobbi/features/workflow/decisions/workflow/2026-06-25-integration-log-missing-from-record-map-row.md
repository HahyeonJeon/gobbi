---
name: integration-log-missing-from-record-map-row
description: The Integration Log file working/reconciliation-iter{n}.md defined in D2 is not reflected in the D7 record-map CRUD row — add it in Planning.
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-06-26
session: 6cf13813-a002-4e55-96b9-a5d65f619ef8
tags: [docs-sync, codex, design]
keywords: [record-map, integration-log, reconciliation-file, d7-crud]
author: claude
supersedes: null
superseded_by: null
related: []
---

# Add Integration Log to D7 Record-Map CRUD Row

## Context

D2 (Integration Log contract) defines that the producer writes the Integration Log to `{N}-{loop}/working/reconciliation-iter{n}.md` (Execution: `task-{NN}-{slug}/working/reconciliation-iter{n}.md`) during WORK. The Integration Log is then staged to `staging/decisions/{slug}.md` for Wrap-up promotion.

D7 includes a CRUD row for `orchestration/scripts/scaffold-session-dir.sh` + `record/record-map.md` — the drift-gated pair that defines the loop interior. As proposed during Ideation, this row enumerated only the `working/proposals/codex/` slot. The `working/reconciliation-iter{n}.md` path introduced by D2 was not listed in that row's descriptive text.

The Claude Ideation evaluator flagged this as a Low-confidence checklist gap. It is not a hard drift-gate failure (the `verify-record-map.sh --check` gate reconciles scaffolded directories, not runtime-written files; the reconciliation log is also staged to the already-present `staging/decisions/` slot). But the D7 record-map row's descriptive enumeration was incomplete — a reader of that row would not know the loop interior also produces `working/reconciliation-iter{n}.md`.

## Decision

When Planning finalizes the task that updates `record/record-map.md`, add `working/reconciliation-iter{n}.md` to the D7 record-map descriptive row alongside `working/proposals/codex/`. The Planning executor handles this during the record-map update task, not as a separate task.

## Rationale

The record-map is the single source of truth for the loop interior shape. A file written during WORK but absent from the record-map creates a doc-drift gap that future agents reading the record-map would miss. The fix is low-effort (one-line addition to a CRUD row description), fits inside the existing record-map update task, and prevents the runtime-written Integration Log from becoming an undocumented artifact.

## Alternatives considered

- Treat the gap as negligible because `verify-record-map.sh --check` does not gate on it (rejected — the gate's scope not covering it is why the gap is Low severity, but it does not mean the doc should be wrong).
- Create a separate Planning task for this fix (rejected — the fix is a one-line addition inside the existing record-map task; a separate task is disproportionate).

## Consequences

Planning annotated the record-map CRUD task to include adding `working/reconciliation-iter{n}.md` to the D7 row description. After the fix, the D7 row for `scaffold-session-dir.sh` + `record-map.md` enumerates both `working/proposals/codex/` AND `working/reconciliation-iter{n}.md` as the new loop interior additions.

## Resolution

RESOLVED in-session (Execution task 03). `record/record-map.md` now enumerates `reconciliation-iter{n}.md` as the dual-system Integration Log (Claude producer; WRITTEN, not scaffolded) at the loop-interior tree, the `working/` row, and the surrounding prose. The decision was accepted and acted upon the same session; nothing carries forward.
