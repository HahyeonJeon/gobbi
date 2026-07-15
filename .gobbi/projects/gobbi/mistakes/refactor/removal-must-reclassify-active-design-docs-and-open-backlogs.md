---
name: removal-must-reclassify-active-design-docs-and-open-backlogs
description: A removal sweep must reclassify hits by doc lifecycle (active design / open backlog), not just by directory tier.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-13
session: 2026-07-13-0bbb7c63-919c-45c2-81ea-b86406c8b75b
tags: [refactor]
keywords: [removal-sweep, lifecycle-reclassification, fail-closed, stale-reference]
author: claude
priority: high
domain: refactor
supersedes: null
superseded_by: null
---

# A removal's fail-closed sweep must reclassify ACTIVE design docs + OPEN backlogs, not lump all memory hits as "historical-leave"

## What happened

When removing the `interview` skill, the fail-closed `\binterview\b` sweep classified all
~89 residual memory-tree hits as "historical-leave" grouped coarsely by directory
(backlogs/features/plans/reviews). The dual-system evaluation (Codex) then found two
classes that were NOT legitimately historical: (a) an ACTIVE design doc (`status: active`)
whose `## Open issues` note still asserted `interview/staging/` is a valid Wrap-up
promotion source — now false; (b) two OPEN backlogs whose findings pointed at the deleted
`interview/SKILL.md` — moot forward-work, not history. Both slipped past the executor's
PASS-leaning self-review and Claude's PASS evaluation.

## Why it happens

"It's under `features/` or `backlogs/`, so it's historical narrative → leave it" — dir tier
was used as a proxy for lifecycle. But `features/**/design/*.md status: active` is a LIVING
spec, and a `status: open` backlog is FORWARD work, not a dated record. A removed mechanism
referenced by a live spec or an open TODO is a stale/contradicting reference, not accurate
history.

## Correct approach

Classify each sweep hit by lifecycle, not dir: {live-repoint / annotate-superseded /
mark-resolved-by-removal / historical-leave}. For an ACTIVE design/discussion doc, append a
one-line `> **Superseded <date>:**` annotation (keep the original line — history stays
accurate). For an OPEN backlog finding pointing at the deleted artifact, mark it
resolved-by-removal in place. Only dated records + `archive/` are true historical-leave.

## How to detect

During a removal sweep, when you're about to classify a hit "historical-leave," check the
DOC'S LIFECYCLE, not its directory: read its frontmatter `status:` (active vs
superseded/archived) and doc `type:` (a `design`/`rules`/open-`backlog` is live; a dated
`discussion`/`review`/`plan`/`notes` record or anything under `archive/` is historical). An
`active` design doc or an `open` backlog that names the removed thing needs a fix
(repoint, annotate-superseded, or mark resolved-by-removal) — it is not permitted residue.

## Related

- [[atomic-flip-must-propagate-to-cotouch-prose-and-active-mistakes]]
- [[blast-radius-map-from-named-files-not-exhaustive-grep]]
