---
slug: concern-1-wrap-up-step-2-5-anchor
title: "Wrap-up Step 2.5 anchor placement — new H3 after ### WORK discipline"
domain: docs-sync
type: design_flaw
disposition: addressed
mistake-candidate: false
project: gobbi
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
loop: planning
created: 2026-05-23
status: active
supersedes: null
date: 2026-05-23
feature: gobbi-orchestration-workflow-improvements
superseded_by: null
promoted-from: sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/decisions/concern-1-wrap-up-step-2-5-anchor.md
promoted-at: 2026-05-23T14:00:00Z
---

# Wrap-up Step 2.5 anchor placement

## Question

Where exactly in `wrap-up/SKILL.md` does Step 2.5 land — inside the WORK Phase procedure table (current Steps are numbered table rows), or as a new H3 between the table and a subsequent subsection?

## Resolution

**Option (b) — new `### Step 2.5 — prior-loop MEMORIZATION compliance check` H3 inserted between `### WORK discipline` (ends at line ~184) and `## Staging → Project-memory routing` (line 185).** Additionally, the procedure table row 2 (Step 2 row at line 134) gets a one-line "see § Step 2.5 below" pointer.

Rationale:
1. Procedure tables in this skill tree summarize steps as terse table rows; inserting "Step 2.5" inline would force every adjacent row's step number to be re-anchored.
2. A self-contained H3 gives Step 2.5 the ~10-20 line surface it needs for inputs, scan procedure, gap table, classification, auto-backfill + collision policy, NEEDS_CONTEXT trigger, gap-report destination.
3. Placement after `### WORK discipline` keeps the discipline block adjacent to the procedure table.

## Evidence

- `wrap-up/SKILL.md:118` — `## WORK Phase (delegated to assistant)` H2 boundary.
- `wrap-up/SKILL.md:133-141` — procedure table (Steps 1-7 as rows).
- `wrap-up/SKILL.md:176` — `### WORK discipline` H3.
- `wrap-up/SKILL.md:185` — `## Staging → Project-memory routing` H2 (next H2 boundary).

## Action

Adopted in Planning draft-iter1.md Task 04. No User Challenge.
