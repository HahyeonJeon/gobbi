---
name: wrap-up-step-2-5-anchor-placement
description: Wrap-up Step 2.5 lands as a new H3 after the WORK discipline block, not as an inline table row — anchor placement decision.
type: decisions
scope: feature
feature: workflow
status: active
created: 2026-05-23
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [wrap-up, step-2-5, anchor-placement, orchestration]
domain: docs-sync
title: "Wrap-up Step 2.5 anchor placement — new H3 after ### WORK discipline"
project: gobbi
supersedes: null
superseded_by: null
decision_status: accepted
---

# Wrap-up Step 2.5 anchor placement

## Context

The new Step 2.5 (prior-loop MEMORIZATION compliance check) needed a home in `wrap-up/SKILL.md`. The two candidate placements were: inside the WORK Phase procedure table (where the existing Steps are numbered table rows), or as a new H3 between that table and a later subsection. The procedure table summarizes each step as a terse row, so an inline "Step 2.5" would not have room for the step's full specification.

## Decision

Land Step 2.5 as a new `### Step 2.5 — prior-loop MEMORIZATION compliance check` H3 inserted between the `### WORK discipline` H3 and the `## Staging → Project-memory routing` H2. The procedure-table Step 2 row gets a one-line "see § Step 2.5 below" pointer.

## Rationale

1. The procedure tables in this skill tree summarize steps as terse rows; inserting "Step 2.5" inline would force every adjacent row's step number to be re-anchored.
2. A self-contained H3 gives Step 2.5 the ~10-20 line surface it needs for inputs, scan procedure, gap table, classification, auto-backfill + collision policy, NEEDS_CONTEXT trigger, and gap-report destination.
3. Placement after `### WORK discipline` keeps the discipline block adjacent to the procedure table.

## Alternatives considered

- **Inline Step 2.5 as a procedure-table row.** Rejected: a table row cannot hold the step's full specification, and inserting a "2.5" row forces re-anchoring of every adjacent step number.

## Consequences

`wrap-up/SKILL.md` carries Step 2.5 as a self-contained H3 between the WORK discipline block and the Staging → Project-memory routing section, with a pointer from the Step 2 procedure-table row. The decision was adopted in the Planning draft with no user challenge.

## Related

- `design/wrap-up-step-2-5-compliance-check.md` — the Step 2.5 specification this placement hosts.
