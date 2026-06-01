---
name: docs-sync-count-fix-blast-radius-includes-colocated-dates-and-tracking-pointers
description: A docs-sync count/date correction's CRUD blast radius missed the body `## Source` access-date and the tracking-pointer docs (README open-items, backlog, checklist) — caught by dual-system eval as REVISE.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-01
session: 34563fb4-361d-4348-aa75-8bc9f1fbff05
domain: docs-sync
tags: [principle-13, blast-radius, crud-plan, docs-sync, provenance-date]
priority: medium
---

# Docs-sync blast radius includes co-located dates AND tracking-pointer docs

## What went wrong
The iter1 CRUD plan for a "correct the hook-event count 31→30 + refresh provenance" change updated the frontmatter `accessed:` date but **missed the body `## Source` line** ("Both accessed 2026-05-23"), leaving the same file internally contradictory. It also deferred — without recording a ratified deferral — the live `README.md` open-item pointer and the backlog/checklist that still asserted the stale "29" target. Dual-system evaluation returned REVISE on both (Codex caught the Source date; Claude caught the README/tracking blast radius).

## Why it went wrong
A count/date correction "feels" local to the one prose claim, so the CRUD plan stopped at the obvious spot (frontmatter + the enumeration). Principle 13's blast-radius step was applied too narrowly: provenance metadata is duplicated across a doc (frontmatter date AND a body Source/accessed section AND a usage-history row), and a tracked task's "claim" is mirrored in pointer docs (a feature README's open-items list, the backlog, the checklist).

## How to recognize it next time
- Editing any count/date/version claim that also appears in a doc's frontmatter, a `## Source`/`## Provenance` section, and/or a usage-history table — they must ALL move together.
- The change resolves a tracked backlog/checklist whose text or a README open-items bullet still states the old target.

## Corrected approach
For a docs-sync correction, the P13 blast-radius enumeration MUST include: (1) every co-located instance of the value in the same file (frontmatter + body Source/accessed + history rows); (2) every tracking-pointer doc (feature `README.md` open-items, the backlog, the checklist). Grep the value across the feature tree before editing. If any co-update is intentionally deferred to a later phase (e.g., archive move to Wrap-up), record that as a ratified deferral so it is not read as an open defect.
