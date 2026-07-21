---
name: d3-002-chat-mode-preparation-row-does-not-exist
description: Historical check closed because the chat-mode Preparation step and row were retired in v0.5.3
type: checklists
scope: feature
feature: workflow
status: retired
created: 2026-07-05
session: 1fecddb4-255e-4829-9912-42deb9c36fc8
tags: [docs-sync, verification]
keywords: [f-struct-02, chat-mode, preparation, option-s, skipped-table]
author: claude
scenario: d3-002-manager-refs-specialist-phase-loads-column-split
item_status: implemented
anchor: novel
implemented_in: null
archived_at: 2026-07-20
archive_reason: addressed
---

# `chat-mode.md` has no Preparation specialist WORK row to split (F-STRUCT-02)

> **v0.5.3 resolution:** the entire Preparation step was removed. The historical row-shape finding
> below is retained as evidence; no current chat-mode table may recreate that step or specialist row.

## What

The design draft's Option S row-semantics enumerate "Preparation WORK → `workflow/preparation.md` +
`../preparation/SKILL.md`" as one of the per-phase split rows. In `chat-mode.md` §3, Step 3 (Slice
Preparation) is `Skipped at loop entry` and carries NO WORK row referencing `workflow/preparation.md` — a
grep for a `preparation.md` link into `workflow/` in `chat-mode.md` returns zero hits (only `auto-mode.md:97` has one).
Execution must not manufacture a Preparation specialist row in `chat-mode.md`'s Skipped table when applying
the two-column split table-by-table.

## Why

The enumerated per-phase mapping list in the design applies to auto-mode only for this one row; chat-mode's
Preparation table has no specialist row at all. An executor mechanically applying "split every enumerated
row" without checking each table's actual row set could add a row that does not belong.

## Verification

Before/after the split, confirm `chat-mode.md` §3's Preparation table still has no `Agent: leader` /
`Refs: workflow/preparation.md` row — the split applies only to rows that already pair a `workflow/*.md` doc
with a specialist `Agent`, never manufacturing a new one.

## Status notes

Open, not iter2-blocking. The design direction is self-correcting (split where a row already exists), but the
Implementation Checklist as enumerated overstates chat-mode's row set for this one phase — Execution should
note "split applies per EXISTING specialist WORK/EVALUATION/RECORD row; chat-mode's Skipped Preparation has
none" before starting the table-by-table split.

## Related

- [[d3-002-manager-refs-specialist-phase-loads-column-split]] — the design this item verifies
