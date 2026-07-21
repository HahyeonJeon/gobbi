---
name: d1-003-chat-staging-wrapup-inventory-extension-shipped
description: Chat-mode runs unmodified base RECORD per slice; Wrap-up's promotion inventory is extended to glob the Chat staging subtree, as shipped
type: design
scope: feature
feature: workflow
status: retired
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [design, docs-sync]
keywords: [GEN-D1-003, chat-mode, base-record, wrap-up-inventory, GEN-D7-004, manager-materialization]
author: claude
supersedes: d1-003-chat-staging-wrapup-inventory-extension
superseded_by: null
related: [chat-record-staging-is-entangled-with-d7-004-scaffold]
archived_at: 2026-07-20
archive_reason: retired
---

# Chat per-slice RECORD staging + Wrap-up inventory extension (as shipped)

## Problem

Chat mode's §4 skipped RECORD Steps 6-7 (typed-finding staging) and instead promised Wrap-up would
reconstruct findings by mining transcripts / task-records — a promise Wrap-up's own rules forbid
(transcripts and task-records are never a promotion source). Even if a slice ran full base RECORD,
its findings would land under `chat/tasks/{NN}-{slug}/{N}-{loop}/staging/...`, a subtree Wrap-up's
promotion inventory never enumerated — so Chat-mode evaluation knowledge was unpromotable either way.

## Scope

In scope: `orchestration/chat-mode.md` §4 (remove the RECORD skip + the mining promise),
`wrap-up/SKILL.md` (extend the promotion-inventory enumeration + the Memory Access Matrix + the F-P2
do-not-over-narrow clause + the Constraints "account for every staging file" bullet + the Inputs
staging bullet + the Procedure Step-2 source enumeration), `record/record-map.md` (a parity
cross-reference for the Chat per-slice tree). Out of scope: `scaffold-session-dir.sh` /
`verify-record-map.sh` extensions to materialize/validate the Chat subtree — that is GEN-D7-004,
deferred.

## Approach

Chat slices run the **unmodified base RECORD procedure per slice** — no skip, no mining. A Chat
slice's RECORD writes typed findings to real staging under
`chat/tasks/{NN}-{slug}/{N}-{loop}/staging/{type}/{slug}.md`, using the FULL base staging vocabulary
(not a narrowed inline subset — the shipped fix replaced an incomplete inline list with a reference
to the base vocabulary in `record-map.md`). Wrap-up's promotion inventory is extended to glob
`chat/tasks/*/{N}-{loop}/staging/` (plus nested `chat/tasks/*/3-execution/task-*/staging/`) alongside
the existing top-level and execution-sub-task staging sources.

**As-shipped interim materialization (post-iter1 correction).** Execution iter1 evaluation (Codex
finding O2, High, confidence 85, echoed across Project/Structure/Risk/Consistency/Usage perspectives)
found the documented Chat staging path was not actually creatable: `scaffold-session-dir.sh` and
`verify-record-map.sh` only recognize the fixed top-level loop set plus `3-execution/task-{NN}-{slug}`
and reject the `chat/tasks/...` subtree outright — a probe scaffold call exited 2. The shipped fix
does not silently leave this uncreatable: `chat-mode.md`, `record-map.md`, and `wrap-up/SKILL.md` now
explicitly document that the Chat per-slice tree is **manager-materialized** in the interim (the
manager creates the directories directly, the same create-if-absent discipline RECORD already uses
elsewhere), with the scaffold/drift-gate extension explicitly deferred to GEN-D7-004
(`d7-004-chat-tasks-scaffold-and-drift-gate` backlog item). The drift-gate's non-coverage of
`chat/tasks/` is stated as INTENTIONAL pending that follow-up, not a silent gap.

## Scenarios

- **Golden.** A Chat slice's EVALUATION reaches PASS; the slice's RECORD runs full base Steps 6-7,
  staging typed findings to `chat/tasks/{NN}-{slug}/{N}-{loop}/staging/`; Wrap-up's extended
  inventory globs that subtree (plus nested execution-task staging) and promotes. No transcript or
  task-record mining anywhere in the path.
- **Interim materialization.** The manager creates the Chat slice's loop-interior directories
  directly (mirroring `scaffold-session-dir.sh`'s per-loop 4-slot shape) before RECORD writes to
  them, since the canonical scaffold script does not yet accept the Chat path.
- **Non-blocking residual.** `record/SKILL.md`'s Step 6 path (`sessions/.../{N}-{loop}/staging/`) is
  written as a literal, un-parameterized root; Chat's "unmodified/verbatim base RECORD" claim is
  aspirational for a strictly-literal reader until GEN-D7-004 parameterizes the slice-local root.
  Tracked under the same `d7-004-chat-tasks-scaffold-and-drift-gate` deferral, not a separate item.

## Validation

A targeted scaffold probe for the Chat path (documented as expected-to-fail pending GEN-D7-004); a
grep confirming `chat-mode.md` §4 no longer contains a RECORD Steps 6-7 skip or a mining promise; a
grep confirming the Chat staging vocabulary list defers to the base vocabulary rather than repeating
an incomplete inline subset; both Claude and Codex Execution-loop iter2 evaluations independently
confirmed the corrected staging path, the base-vocabulary deferral, and the manager-materialization
documentation, returning PASS.

## Trade-offs

Optimizes for: closing the "findings are unpromotable" defect immediately, without requiring the full
scaffold/drift-gate tooling extension in the same session. Accepts: the Chat per-slice tree is
manager-materialized rather than scaffold-verified until GEN-D7-004 ships, and the drift-gate does
not yet cover Chat's subtree (explicitly documented as intentional, not silent).

## Open issues

- `d7-004-chat-tasks-scaffold-and-drift-gate` (High, deferred) — extend `scaffold-session-dir.sh` and
  `verify-record-map.sh` to materialize and validate the Chat per-slice tree, closing the interim
  manager-materialization gap.

## Related

- [[chat-record-staging-is-entangled-with-d7-004-scaffold]] — the mistake-candidate documenting why
  this dependency resurfaced three times before being explicitly cross-referenced
