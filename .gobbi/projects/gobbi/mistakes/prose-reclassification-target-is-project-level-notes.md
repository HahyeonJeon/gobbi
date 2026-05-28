---
name: prose-reclassification-target-is-project-level-notes
description: The §4.3 "reclassify narrative to notes/" rule must target PROJECT-level notes/ — the notes type is project-only (no features/{f}/notes/ tier). A prose-wave brief that says "reclassify to features/{f}/notes/{slug}.md" produces a misplaced doc that fails type-placement.
type: decisions
scope: project
feature: project-memory
status: active
created: 2026-05-27
session: 5786090e-f65a-4493-94cc-e610ce337813
tags: [process, prose-wave, notes, type-placement, reclassification, delegation]
domain: process
supersedes: null
superseded_by: null
---

# Prose-wave reclassification target is project-level notes/, never feature-level

## What went wrong

The P3a prose brief instructed the executor to reclassify a session-journal narrative (§4.3:
"never delete narrative — reclassify to notes/") into `features/git-workflow/notes/{slug}.md`. The
executor followed the brief (Iron Law 4) and correctly flagged the tension. But `notes/` is a
**project-only** type: `memory-map.md` lists `notes` → `notes/` → "Project-only", and
`templates/notes.md` states "there is no `features/{feature-name}/notes/` tier." So the brief
created the only feature-level `notes/` directory in the entire tree — a type-placement violation
the eval would have flagged.

## Why it happens

§4.3 says "reclassify to notes/ (its correct type)" without restating WHERE notes live. A brief
author pattern-matches "this narrative belongs to feature X" → "put it in feature X's notes/",
forgetting that `notes/` is the one journal type that is project-scoped only (unlike decisions /
design / mistakes / backlogs / references, which DO have feature-level tiers). The four
feature-subdir-only types are changelogs / discussions / scenarios / checklists; notes is the
inverse — project-only.

## How to recognize this situation

- A prose/memorization brief names a reclassification target like `features/{f}/notes/{slug}.md`.
- `find .gobbi/projects/gobbi/features -type d -name notes` returns any hit (there should be ZERO —
  notes live only at `.gobbi/projects/gobbi/notes/`).
- A reclassified note carries `scope: feature` / `feature: {name}` instead of `scope: project` /
  `feature: null` + `features_touched: [{name}]`.

## Correct approach

Every prose-wave / memorization brief that may reclassify narrative MUST target **project-level**
`.gobbi/projects/gobbi/notes/{slug}.md` with `scope: project`, `feature: null`, and
`features_touched: [{originating-feature}]` (the notes-type extension that records the feature link).
Cross-link the originating feature doc (`## Related` → `../../../notes/{slug}.md`) and the note back
to the feature doc (`features/{f}/.../{doc}.md`). This applies to P6 and P7 (which also reclassify).
Manager verifies post-hoc with `find features -type d -name notes` (must be empty).
