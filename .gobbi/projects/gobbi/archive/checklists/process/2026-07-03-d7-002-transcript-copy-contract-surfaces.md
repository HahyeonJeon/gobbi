---
name: d7-002-transcript-copy-contract-surfaces
description: iter1 Codex finding STRUCT-D7-002-TRANSCRIPT-SURFACES — the D7-002 map must include every unconditional transcript-copy contract surface, not only record/SKILL.md:191
type: checklists
scope: feature
feature: workflow
status: superseded
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [docs-sync, verification]
keywords: [transcript-copy, d7-002, affected-file-map]
author: codex
scenario: d7-002-transcript-audit-branch
item_status: implemented
anchor: novel
implemented_in: null
superseded_by: d7-002-per-loop-exit-checklist-transcript-gates
archived_at: 2026-07-03
archive_reason: superseded
---

# D7-002 map must include every unconditional transcript-copy contract surface

## What

The iter1 draft's D7-002 recommended edit list named only `record/SKILL.md:191` as the primary edit
(plus optional cross-links to `codex/SKILL.md:59` / `gobbi/SKILL.md:62`). But the "transcript copied"
contract is declared unconditionally at multiple additional structural sources:
`orchestration/SKILL.md:177` (RECORD row), `record/SKILL.md:198` (Step 9 VERIFY), `record/SKILL.md:253`
(base exit checklist), and `record/record-map.md:160` (transcript rules) — all asserting the copy as a
required step regardless of runtime.

## Why

If only `record/SKILL.md:191` changes, later managers and RECORD assistants still see unconditional
transcript-copy obligations in the lifecycle table, checklist, output-paths section, and record-map
spec — recreating the same false-Critical / false-failed-record behavior for a Codex-null audit path,
just through a different documented gate.

## Verification

`git grep -ni 'codex' -- .gobbi/projects/gobbi/skills/record/SKILL.md .gobbi/projects/gobbi/skills/record/record-map.md` confirms each of the 4 named surfaces acknowledges the Codex-null degraded case after the fix.

## Status notes

**iter1 → iter2**: iter2's draft added exactly these 4 named surfaces to the D7-002 map, and the iter2
Claude evaluator tool-verified all 4 are real and in-map — this original finding's literal scope is
addressed.

**iter2 → iter3 (superseded)**: the SAME underlying contract was found restated at a further set of
sites the map still didn't cover — the per-loop RECORD exit-checklist gates in `ideation/SKILL.md`,
`planning/SKILL.md`, `preparation/SKILL.md`, `execution/SKILL.md`, plus descriptive lines in
`orchestration/workflow/record.md`. That recurrence is tracked as its own finding,
`d7-002-per-loop-exit-checklist-transcript-gates`, which supersedes this one and was resolved at
iter3 via a per-location DEFER determination + one clarifier line.

## Related

- [[d7-002-runtime-aware-transcript-audit-branch]] — the design this finding shaped
- [[d7-002-per-loop-exit-checklist-transcript-gates]] — the finding that supersedes this one
