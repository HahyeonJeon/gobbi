---
name: d7-002-per-loop-exit-checklist-transcript-gates
description: iter2 finding F-STRUCT-D7-002-MAP-INCOMPLETE-2 — the D7-002 map must also cover the per-loop RECORD exit-checklist restatements of the transcript-copy contract
type: checklists
scope: feature
feature: workflow
status: retired
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [docs-sync, verification]
keywords: [transcript-copy, d7-002, exit-checklist, per-loop]
author: claude
scenario: d7-002-transcript-audit-branch
item_status: implemented
anchor: novel
implemented_in: null
supersedes: d7-002-transcript-copy-contract-surfaces
archived_at: 2026-07-20
archive_reason: addressed
---

# D7-002 map must cover the per-loop RECORD exit-checklist restatements too

## What

iter2 added the 4 surfaces named by `d7-002-transcript-copy-contract-surfaces` to the D7-002 map, but
a tree-wide grep for `Each agent transcript copied` showed the SAME contract restated as a per-loop
RECORD exit-checklist gate. The current sites are the four loop skills (`ideation`, `planning`,
`execution`, and `wrap-up`) plus descriptive restatements in
`orchestration/workflow/record.md`. None of these were in the original D7-002 affected-file map,
and the D7-002 validation grep (scoped only to `record/SKILL.md` + `record/record-map.md`) could not
have caught them.

## Why

On a Codex-null session, each loop's exit-checklist "transcript copied" gate is unsatisfiable and
false-fails — including `execution/SKILL.md:241` (Execution has mandatory evaluation and runs every
code-touching session). The D7-002 fix's stated goal ("Codex-null does not false-fail its own
transcript-copy contract") was therefore NOT achieved for those 4 loops as originally mapped. This is
the iter1 High finding (`d7-002-transcript-copy-contract-surfaces`) recurring at the per-loop
restatement level, and a fresh instance of the exact `cited-process-mistake-not-applied-to-own-artifact`
pattern — the draft's own I-5 insight ("enumerate co-touch by concept across every phrasing") was not
applied to its own D7-002 map.

## Verification

`git grep -niE 'each agent transcript copied|transcript copied' -- .gobbi/projects/gobbi/skills/ideation/SKILL.md .gobbi/projects/gobbi/skills/planning/SKILL.md .gobbi/projects/gobbi/skills/execution/SKILL.md .gobbi/projects/gobbi/skills/wrap-up/SKILL.md .gobbi/projects/gobbi/skills/orchestration/workflow/record.md`
— for each hit, confirm its RECORD section carries the "Canonical procedure: `record/SKILL.md` ... do
not re-derive" deferral note OR is a descriptive (non-gate) line; none may be an independent
"FAIL if absent" assertion. Complement:
`git grep -n 'Canonical procedure' -- .gobbi/projects/gobbi/skills/ideation/SKILL.md .gobbi/projects/gobbi/skills/planning/SKILL.md .gobbi/projects/gobbi/skills/execution/SKILL.md .gobbi/projects/gobbi/skills/wrap-up/SKILL.md`
confirms the deferral note is present in all four loop RECORD sections.

## Status notes

**Resolved at iter3** (manager-verified against the live tree, no fresh dual-system round): each of
the six restatement sites was individually opened and classified — all six DEFER to `record/SKILL.md`'s
canonical procedure (each loop's RECORD section carries the explicit "Canonical procedure ... do not
re-derive" note; the 2 `record.md` lines are descriptive, not gates). Resolution: no per-loop-doc
edit; one runtime-aware clarifier line added to `record/SKILL.md`'s VERIFY/exit-checklist section
that per-loop restatements inherit; the validation grep above was widened to span every classified
location so a survivor is mechanically detectable.

## Related

- [[d7-002-runtime-aware-transcript-audit-branch]] — the design this finding is resolved inside
- [[d7-002-transcript-copy-contract-surfaces]] — the finding this one supersedes
- [[enumerate-all-restatements-and-classify-deferral-before-claiming-map-complete]] — the mistake-candidate this recurrence produced
