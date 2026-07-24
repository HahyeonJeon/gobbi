---
name: artifact-is-the-program-slogan-heading-dropped
description: planning/SKILL.md's "The artifact is the program" slogan blockquote has no counterpart heading in the folded workflow/planning.md; its operational directive was consolidated into "Anchor every task" instead.
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [docs-sync, verification]
keywords: [artifact-is-the-program, principle-consolidation, slogan-heading, task-03-fold]
author: claude
scenario: fold-operational-planning
item_status: deferred
anchor: novel
implemented_in: null
---

# Check that a future re-read of the folded doc still carries the "artifact is the program" operational directive, even without its slogan heading

## What

`planning/SKILL.md:53`'s blockquote — "**The artifact is the program.**" plus one motivational
sentence — has no counterpart heading in `orchestration/workflow/planning.md` (the task-03 fold
target). The task-03 evaluator (single-system Claude; Codex user-waived) confirmed the underlying
operational directive was merged verbatim into the folded doc's "Anchor every task" principle
(`planning.md:56-58`); only the slogan-heading and its one motivational sentence were dropped, not the
directive itself.

## Why

Consolidating a source doc's principle-heading count (7 in `planning/SKILL.md`) into a smaller set (6
in the folded `planning.md`) during a fold is a legitimate compaction move when the operational content
survives — but a reader diffing heading-for-heading against the source would flag it as a loss. The
task-03 evaluator (`4-execution/task-03-fold-operational-planning/evaluation/iter1/claude/overall.md`)
recorded this as a real, if cosmetic, finding rather than silently passing over it.

**Manager disposition: ACCEPTED as a deliberate consolidation.** The distinct operational directive
survives at full count inside "Anchor every task"; no consumer anchors to the dropped slogan heading
itself; the source text remains readable at `ideation/SKILL.md:50` and the unstripped
`planning/SKILL.md:53` for any reader who wants the original phrasing. Re-folding solely to restore a
6-vs-7 heading-count match is not warranted — the folded doc's principle set is the gobbi-operational
one, not the locked generic-5 (task 01's separate concern).

## Verification

None required going forward — this is a closed, accepted finding, not an open remediation item. If a
future fold or SOP-split touches `orchestration/workflow/planning.md`'s principle set again, confirm
the "Anchor every task" directive (or whatever it is renamed to) still carries the operational meaning
of "the artifact is the program" — not the slogan-heading itself.

## Status notes

`item_status: deferred` here means "the manager reviewed and intentionally declined to remediate,"
not "scheduled for a later pass" — there is no backlog entry because none is warranted; the rationale
is recorded above and in `evaluation/iter1/claude/overall.md` (§ Findings, F-CONS-01) and
`evaluation/iter1/claude/checklist.md` (line 8, `FAIL:F-CONS-01 (non-gating, manager-accepted)`).
Low severity, confidence 100 — did not affect the PASS verdict on any perspective.

## Related

- `evaluation/iter1/claude/overall.md` — the evaluator's full finding text and the manager's disposition note
- [[task-03-single-system-evaluation-codex-waived]] — staged discussion, the evaluation-mode caveat this finding was surfaced under
