---
name: orchestration-mistakes-description-generalize
description: Broaden orchestration/mistakes.md's frontmatter description + H1 so they cover the planning verification-gate traps the file now holds, not only "delegation dispatch".
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-24
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [docs-sync, process]
keywords: [orchestration-mistakes, wrapper-description, delegation-dispatch, planning-traps, f-cons-01]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Generalize orchestration/mistakes.md description + H1 beyond delegation-dispatch

## Context

Task 04 (`04-move-planning-mistakes`, commit `c06332eb`) moved two planning verification-gate-authoring
traps into `skills/orchestration/mistakes.md`. That file's frontmatter
`description: "Recorded traps for Gobbi delegation dispatch — load before manager dispatch work"` and its
H1 `# Orchestration Delegation — Mistakes` were left unchanged, so they no longer fully cover the file's
contents (surfaced as task-04 finding F-CONS-01, Low/docs-sync).

## Why deferred

Task 04's contract was deliberately narrow — "change ONLY the D4-003 path" inside the moved traps.
Broadening the wrapper description + H1 is a separate content edit outside that scope. The mismatch is
soft (the traps do relate to how the manager/leader dispatches and verifies work), so it did not gate
the PASS.

## When to pick up

Any session that next edits `skills/orchestration/mistakes.md`, or a docs-currency sweep. No hard
prerequisite.

## Suggested approach

Either (a) broaden the `description` + H1 to name that the file holds both delegation-dispatch traps AND
planning verification-gate-authoring traps; or (b) confirm "delegation dispatch" is the intended umbrella
framing for all orchestration-owned traps and leave it, recording that decision. Re-run
`check-skill-mistakes.sh --all` after any edit to confirm the skill-surface header stays conformant.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-16-847bafc9-9659-46b4-b23e-653e25f0e9f5/`

## Related

- [[orchestration-mistakes-description-not-broadened]] — the task-04 checklist finding this deferred fix
  closes
