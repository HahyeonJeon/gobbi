---
name: d-lock-traces-to-task-mapping
description: All 16 D1-D16 design locks now appear in the implementing task's own traces-to field, not only a summary table, so a fresh single-task executor still receives its design locks
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, docs-sync]
keywords: [cod-plan-proj-001, d-lock-mapping, traces-to, d11-cross-phase-predicate]
author: claude
scenario: plan-proj-lock-coverage
item_status: implemented
anchor: novel
implemented_in: null
---

# Every D1-D16 design lock traces into its implementing task's own field, not only a summary table

## What

Every locked Idea design decision (D1 through D16) must be reachable from the specific task that implements it,
not only from a Planning-level summary table a fresh single-task executor never sees.

## Why

At iter1, the two-way lock→destination table existed but individual tasks did not carry the D-lock references
in their own `traces-to` fields (`COD-PLAN-PROJ-001`, High/100) — a fresh executor dispatched with one task
brief would not receive its design locks.

## Verification

All 16 D-locks now appear in the owning task's own `traces-to` (D1/D2/D3/D4/D11→T4; D4/D5→T5; D6→T6/T7/T8;
D7→T2/T6/T8/T9; D8/D9/D10→T3; D12→T1/T6/T7/T8/T9; D13/D14→T6; D15→T7; D16→T8). D11 additionally carries a
literal task-local predicate in T4 (compare / reopen earliest owner / invalidate downstream / regenerate /
re-confirm) plus an `MC-T4` contradiction trial.

## Status notes

Resolved at iter2, reconfirmed unchanged at iter3. Residual: the entries were initially authored paraphrases,
not quotations — tracked and closed separately as [[traces-to-quotation-contract]].

## Related

- [[traces-to-quotation-contract]] — the residual quotation-vs-paraphrase fix this finding's residual became
