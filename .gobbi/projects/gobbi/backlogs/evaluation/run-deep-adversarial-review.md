---
name: run-deep-adversarial-review
description: Execute the adversarial-review charter — the deep dual-system review of gobbi's full surface, deferred to a future session
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-29
session: 40b9a93e-5ec4-43d7-bd16-075b0c7fa303
tags: [process, evaluation]
keywords: [adversarial-review, charter-execution, dual-system, gobbi-surface]
author: claude
priority: high
project-scope: false
shipped_in: null
---

# Run the deep adversarial review

## Context
This session authors the charter (the executable review spec). Running the deep review itself — applying the charter's per-dimension checklists and the segment-partition methodology across ~214K words via dual-system passes — is a separate, larger unit of work.

## Why deferred
The locked scope for this session is review-only and charter-authoring-only (frame + grounding + design). The deep review + any fixes are explicitly out of scope and belong to a future session (likely several).

## When to pick up
After the charter is promoted to memory and the user approves the methodology + severity scheme. No code prerequisite.

## Suggested approach
Follow the charter's methodology section: per-segment dual-system passes (Claude + Codex independent) applying the full dimension checklist + seed-finding checks, then the dedicated whole-surface passes (E2E lifecycle, between-skill load, naming, dedup, plugin, harness-comparison). Stage findings as `reviews/` docs (`review_kind: adversarial-review`).

## Originating session
.gobbi/projects/gobbi/sessions/2026-06-29-40b9a93e-5ec4-43d7-bd16-075b0c7fa303/

## Related

- [[fix-confirmed-seed-findings]] — the fixes the review will produce
