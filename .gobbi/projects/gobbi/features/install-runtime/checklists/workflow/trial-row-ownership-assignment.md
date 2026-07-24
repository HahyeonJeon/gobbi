---
name: trial-row-ownership-assignment
description: All 14 VA-07/VA-09 behavioural trial rows now have exactly one named owning producer task, closing a gap where 7 of 14 collapsed into an undifferentiated T9 re-run
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, verification, process]
keywords: [f3-usage-02, va07-trial, va09-trial, anchor-trial-ownership, cod-plan-proj-002]
author: claude
scenario: plan-usage-declared-writes
item_status: implemented
anchor: novel
implemented_in: null
---

# Every VA-07/VA-09 behavioural trial has one named owning producer task

## What

The 14 behavioural trials that make up the restored VA-07/VA-09 anchor properties (`COD-PLAN-PROJ-002`) must
each be exercised by ONE named task, recorded as a `VA07_TRIAL`/`VA09_TRIAL` row, and only AUDITED (not
re-exercised) by T9.

## Why

At iter2, only 7 of the 14 trial rows had an explicit owning task (`MC-T2` recorded 2, `MC-T4` recorded 5); the
remaining 7 collapsed into an undifferentiated T9 blanket re-run — the exact outcome `reconciliation-iter2.md`
row 3 claimed the design avoided (`F2-CONS-02`/`COD-PLAN-PROJ-002` residual, Medium/100).

## Verification

Added § Anchor-trial ownership: all 14 rows now have one named owning task (T2: 3, T4: 5, T6: 3, T7: 2, T8: 1),
each with the specific `MC-Tn` step that exercises it. T9's `MC-T9` step 8 now AUDITS the rows against the owning
task's recorded evidence rather than re-running six other tasks' flows. `reconciliation-iter1.md` row 3 was
corrected to describe the placement actually implemented.

## Status notes

Resolved. Verified all 14 trial names appear in exactly one ownership-table row and in T9's checking loop; both
sets confirmed equal at 14.

## Related

- [[evidence-note-write-declaration]] — the sibling declaration-completeness fix (evidence-note writes, not trial rows)
