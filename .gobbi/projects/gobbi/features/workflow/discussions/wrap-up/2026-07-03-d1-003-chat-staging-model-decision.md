---
name: d1-003-chat-staging-model-decision
description: Run unmodified base RECORD per Chat slice rather than a Chat-specific Wrap-up reconstruction sub-step
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process, wrap-up]
keywords: [chat-mode, narrowed-pass-path, staging]
author: claude
outcome: Model (b) locked pre-loop — base RECORD per slice; the decisive "no GEN-D7-004 dependency / wrap-up unchanged" rationale was later found false and corrected at iter2 without reopening this choice (see the companion re-decision discussion)
---

# GEN-D1-003 remediation model

## Context

GEN-D1-003 found that Chat's narrowed RECORD path defers typed-finding staging, and — even if run
per slice — the resulting `chat/tasks/` staging subtree is never inventoried by Wrap-up's promotion
step, so Chat-mode evaluation findings never reach durable memory.

## Question

Should Chat gain a dedicated Wrap-up reconstruction sub-step that mines transcripts/task-records
(model a), or should Chat's narrowed-RECORD deferral be removed so it runs the same base RECORD every
other loop runs, staging into `{N}-{loop}/staging/` (model b)?

## Options considered

- **(a)** Add a Chat-specific Wrap-up reconstruction sub-step that mines transcript + task-records.
- **(b)** Remove Chat's deferred-staging model; run unmodified base RECORD per slice into
  `{N}-{loop}/staging/`.

## User decision

Model (b). Preserves the "staging is the only promotion source" invariant. Alternative (a) —
Wrap-up reconstruction — was rejected as breaking that invariant AND depending on the out-of-scope
`GEN-D7-004` (the undocumented `chat/tasks/` record-map/scaffold subtree). The user accepted the
trade-off that this loses Chat's lighter per-slice RECORD path.

## Implication

At the time of this decision, the manager's rejection rationale for (a) — "(b) has no GEN-D7-004
dependency" — was taken at face value. The iter1 Ideation-loop evaluation later proved this decisive
claim false for (b) too (Chat's actual staging subtree is `chat/tasks/{NN}-{slug}/...`, unreachable by
Wrap-up's inventory as originally scoped). The user's choice of (b) itself was preserved; the design
under it was corrected (Wrap-up's inventory extended) rather than reopening this discussion. See the
companion discussion `2026-07-03-d1-003-false-premise-correction.md` for that correction.

## Related

- [[d1-003-chat-staging-wrapup-inventory-extension]] — the corrected design this decision anchors
- [[2026-07-03-d1-003-false-premise-correction]] — the iter1→iter2 correction of this decision's rationale
