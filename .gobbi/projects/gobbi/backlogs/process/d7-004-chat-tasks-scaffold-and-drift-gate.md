---
name: d7-004-chat-tasks-scaffold-and-drift-gate
description: Extend scaffold-session-dir.sh and verify-record-map.sh to materialize and validate the chat/tasks per-slice RECORD tree
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process]
keywords: [GEN-D7-004, chat-mode, scaffold-session-dir, verify-record-map, drift-gate, record-map]
author: claude
priority: high
project-scope: true
shipped_in: null
---

# GEN-D7-004 — Chat/tasks scaffold + drift-gate extension

## Context

GEN-D1-003 (shipped this session) documents Chat-mode RECORD as writing real per-slice staging under
`chat/tasks/{NN}-{slug}/{N}-{loop}/staging/...`, with the manager responsible for materializing those
directories in the interim. The canonical materializer (`scaffold-session-dir.sh`) and drift-gate
(`verify-record-map.sh`) only recognize the fixed top-level loop set (`1-ideation` … `5-wrap-up`) plus
`4-execution/task-{NN}-{slug}` — neither creates nor validates the `chat/tasks/...` subtree. This gap
was independently surfaced three times across this feature's review history: Ideation iter1
(finding F-PROJ-1), Planning (finding G2), and Execution iter1 (Codex finding O2, High).

## Why deferred

Extending `scaffold-session-dir.sh` and `verify-record-map.sh` to cover the Chat per-slice tree (and
nested Chat execution-task staging) is a distinct tooling change from GEN-D1-003's documentation fix,
with its own path-validation and drift-check design. Bundling it into this session's 4-fix Execution
loop would have expanded scope beyond the four locked D-series fixes (D7-001, D1-001, D1-003,
D7-002). The interim state — manager-materialized directories, documented explicitly in
`chat-mode.md`, `record-map.md`, and `wrap-up/SKILL.md` — is safe (no data loss; Wrap-up still
inventories the Chat per-slice staging) but not drift-checked.

## When to pick up

No hard prerequisite — can run any time a Chat-mode session is in active development. Natural trigger:
the next session that runs an actual Chat-mode slice end-to-end and needs the scaffold/drift-gate
coverage to be real rather than manager-improvised.

## Suggested approach

Extend `scaffold-session-dir.sh`'s allowed `<step-dir>` set to accept
`chat/tasks/{NN}-{slug}/{N}-{loop}` (and nested `chat/tasks/{NN}-{slug}/4-execution/task-{MM}-{slug}`),
mirroring the existing `4-execution/task-{NN}-{slug}` validation pattern. Extend
`verify-record-map.sh` to diff the Chat slice subtree the same way it diffs the top-level loop
subtree today. Update `record-map.md` from a one-line parity cross-reference to a full spec section
once the tooling exists.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-03-bf4dc336-65bd-4a52-9055-d79fc82b7e2e/`

## Related

- [[chat-record-staging-is-entangled-with-d7-004-scaffold]] — the mistake-candidate documenting why
  this dependency kept resurfacing across three separate review passes
