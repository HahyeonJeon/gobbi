---
name: d7-002-gate-2-citation-must-point-to-gobbi-skill
description: iter1 finding F-CONS-2 — the D7-002 "Claude Code gate 2" citation must point to gobbi/SKILL.md:67, not orchestration/SKILL.md:67
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [docs-sync]
keywords: [d7-002, gate-2, citation, mis-cite]
author: claude
scenario: d7-002-transcript-audit-branch
item_status: implemented
anchor: novel
implemented_in: null
---

# D7-002 "gate 2" citation must point to `gobbi/SKILL.md:67`

## What

The iter1 draft's D7-002 rationale cited "Claude Code gate 2" (the check that requires
`$CLAUDE_TRANSCRIPT_PATH` non-empty and the file to exist) at `orchestration/SKILL.md:67`. Tool
verification showed `orchestration/SKILL.md:67` is actually "The manager runs every session in one of
two modes ..." — an unrelated mode-description line. The real gate 2 lives at `gobbi/SKILL.md:67`.
The neighboring citation (`orchestration/SKILL.md:108`, the row-5 `transcriptPath` stamp) is correct.

## Why

The gate-2 contrast is the rationale for keeping Claude-null transcripts Critical. A wrong file
pointer in a design doc that Planning decomposes sends the FIX reader to the mode-description line
instead of the actual gate — a small but real accuracy defect in the evidence base, even though the
underlying claim (gate 2 blocks) is true.

## Verification

`git grep -n 'gobbi/SKILL.md:67\|orchestration/SKILL.md:67'` in the design package confirms the
citation now resolves to the file that actually contains gate 2.

## Status notes

**Addressed at iter2**: the citation was repointed to `gobbi/SKILL.md:67`; the iter2 evaluator
verified `gobbi/SKILL.md:67` is gate 2 and `orchestration/SKILL.md:67` is the unrelated
"## Orchestration Mode" heading.

## Related

- [[d7-002-runtime-aware-transcript-audit-branch]] — the design this finding shaped
