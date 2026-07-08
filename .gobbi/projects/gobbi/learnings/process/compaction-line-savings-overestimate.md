---
name: compaction-line-savings-overestimate
description: A conservative line-savings estimate counting single-line trims overstates the physical wc -l reduction; budget new sections against physical multi-line removals only.
type: learnings
scope: project
feature: null
status: active
created: 2026-07-08
session: 14fbc122-d84c-4a16-af52-3a6dc3b1894b
tags: [process, docs-sync]
keywords: [line-count-estimate, skill-md-length, compaction-budget]
author: claude
supersedes: null
superseded_by: null
related: []
---

# A Conservative Line-Savings Estimate Can Still Overstate The Physical Reduction

## Insight

When estimating how many lines a doc edit will save, count only REMOVALS of whole multi-line blocks
as physical savings. Character-level trims to single-line entries (a shortened anti-pattern bullet, a
tightened one-line note) reduce prose density, not the `wc -l` line count — including them in a
"lines saved" estimate overstates the actual reduction the file will show.

## Context

This session's `skills/delegation/SKILL.md` compaction pass estimated a landing size of roughly 415-420
lines by counting both multi-line section removals AND character-level trims to single-line bullets as
savings. The file actually landed at 444 lines — a net change of -1 line versus the pre-compaction
baseline, once the required new sections (the Pre-Dispatch Fill Checklist and the fixed template gaps)
were added back in. The single-line trims shortened the prose but did not remove any line, so they never
contributed to the physical count the way the estimate assumed.

## Reason

A compaction or trim task is usually planned and reviewed against a target line count. An estimate that
silently mixes "characters removed" with "lines removed" produces a target the actual edit cannot hit,
which either surprises the reviewer at the end or causes the session to over-cut prose chasing a number
that was never achievable from the planned edits.

## How

When budgeting a doc-length target before editing: separately tally (a) whole-line / whole-block removals
(section deletions, dropped bullets, merged paragraphs that lose a line) as the ONLY physical `wc -l`
savings, and (b) same-line character trims as a SEPARATE "density" improvement that does not move the
line count. State the target as "N physical lines removed, plus M lines of required new content" rather
than a single blended savings number. Re-run `wc -l` after each major edit and compare against the
physical-only estimate, not the blended one.

## Counter-cases

When a single-line trim removes an ENTIRE bullet or row (not just shortens its wording), that IS a
physical line removal and correctly counts toward the line-savings estimate — the distinction is trim
(same line count, fewer characters) versus delete (one fewer line), not sentence length in general.

## Related

(none)
