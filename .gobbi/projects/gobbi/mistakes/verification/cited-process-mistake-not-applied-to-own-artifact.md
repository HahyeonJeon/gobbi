---
name: cited-process-mistake-not-applied-to-own-artifact
description: When a design cites a process-mistake as mitigation, apply that mistake's checklist to the design's OWN artifact, not only to the future work it plans.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-21
session: c3ac1c53-6741-49cf-8856-cdb3fcd6bec0
tags: [process, verification, docs-sync]
keywords: [mistake-discipline, self-application, checklist-gap, artifact-correction]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Apply a cited process-mistake's checklist to the design's OWN artifact

## What happened

In the memory-namespace-schema ideation:

- **iter1:** the draft cited `file-move-needs-link-resolution-check` as mitigation for the refactor procedure, correctly noting that FUTURE work must enumerate all reference classes. But the draft's OWN artifact omitted the read-glob class entirely — `mistakes/*.md` (single-level glob) was a live consumer of the very type being nested, yet the draft's scope contract did not name it. The evaluators caught it.
- **iter2:** the draft cited `plan-rename-must-enumerate-all-ref-classes` and `file-move-needs-link-resolution-check` again as mitigation for FUTURE reference repointing. But the draft mis-asserted that `required-mistakes:` references were "plain slugs, rename-robust" — exactly the fact those mistakes' checklists would have corrected if applied to the current artifact. The evaluators caught it as ROOT 2 in the iter2 REVISE verdict.

## Recurrence witness (2026-07-14)

A separate ideation session's first-draft plan cited three recorded process-mistakes as its own
guards — the same class as `execution-bundle-source-before-trim`, `merging-two-seed-bullets-narrows-broader-scope`,
and a self-failing-verification-gate mistake. The plan nonetheless committed instances of exactly
those traps in its OWN construction: its own checklist seed dropped coverage for items the first two
cited mistakes warn against, and its own validation gate was not self-failing (the trap the third
cited mistake warns against). Both instances were caught only by that session's dual-system evaluation
on the SECOND draft iteration, not by the first draft's citation of the guards it was supposedly
already following. This is the same failure this mistake already names — citing a mistake in an
artifact's prose is not the same as applying that mistake's checklist to the artifact's own
construction — recurring in a different artifact, roughly three weeks after this mistake was first
recorded. See [[reharden-edit-blast-radius-miss]] for a concrete sibling instance from the same
session: the consumer-sweep discipline was in the artifact's own mistakes register but was not applied
to the artifact's own re-hardening edit.

## Why it happens

Citing a process-mistake as a planned mitigation FEELS like applying it. The lesson gets attached to the deferred work ("we will use this mistake's checklist when we do the migration"), not to the current artifact's own affected surfaces. The two are distinct: the cited mistake's checklist has an immediate application scope (the draft's current claims and omissions) AND a future application scope (the planned work). The immediate scope is what the agent skips.

## How to detect

Trigger: a design document cites one or more `mistakes/` entries as mitigation for future or deferred work, while that same document makes load-bearing claims about the surfaces those mistakes govern.

Check before marking the design complete:
1. For each cited process-mistake, read its `## Correct approach` / `## How to detect` section.
2. Apply the checklist to the CURRENT design document's own affected-surface list and load-bearing factual claims — not only to the planned future work.
3. If the checklist reveals a gap or a factual error in the current document, fix it before declaring PASS.

Concrete signals to grep for in designs:
- "will use the refactor procedure" / "future migration" — then check if the current doc's read-paths and fact-claims were verified against those cited mistakes.
- A `## Related` section with `[[file-move-needs-link-resolution-check]]` — then verify the doc's own reference-class enumeration is complete.

## Correct approach

When a design cites a process-mistake:
1. Apply that mistake's checklist to the design's OWN artifact immediately — every reference class, every load-bearing fact-claim, every read-path the design touches.
2. Fix any gap found before the design is marked complete.
3. THEN apply it again to the planned future work as the original mitigation intent specified.

The two-pass discipline: (a) self-application now, (b) future-work application later. Step (a) is never a no-op when the cited mistake governs the current document's own surfaces.

## Related

- [[file-move-needs-link-resolution-check]] — the move/repoint hazard; witnessed: iter1 omitted the read-glob class from its own scope surface
- [[plan-rename-must-enumerate-all-ref-classes]] — the six reference classes; witnessed: iter2 mis-asserted `required-mistakes:` as plain-slug (rename-robust) in the current artifact
- [[reharden-edit-blast-radius-miss]] — the 2026-07-14 recurrence witness's sibling instance: a different self-application gap (a consumer-sweep discipline named in an artifact's own construction but not applied to it)
