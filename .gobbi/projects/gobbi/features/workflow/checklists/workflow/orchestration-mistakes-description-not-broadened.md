---
name: orchestration-mistakes-description-not-broadened
description: orchestration/mistakes.md's frontmatter description + H1 still frame it as "delegation dispatch" only, not broadened when the two planning verification-gate traps moved in (F-CONS-01, Low, deferred to backlog).
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-07-24
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [docs-sync]
keywords: [orchestration-mistakes, wrapper-description, delegation-dispatch, planning-traps, f-cons-01]
author: claude
scenario: move-planning-mistakes
item_status: deferred
anchor: novel
implemented_in: null
---

# Check that orchestration/mistakes.md's description + H1 cover the planning traps it now holds

## What

`.gobbi/projects/gobbi/skills/orchestration/mistakes.md:4` carries
`description: "Recorded traps for Gobbi delegation dispatch — load before manager dispatch work"` and
the H1 `# Orchestration Delegation — Mistakes`. After task 04's move, the file ALSO holds two PLANNING
verification-gate-authoring traps (`:106`, `:118`). The wrapper description + H1 no longer fully cover
the file's contents — a reader scanning the one-line description would not expect
planning-`verifies:`-gate traps under "delegation dispatch."

## Why

A mild Principle 6 / Principle 9 docs-currency gap: a doc-metadata line affected by a change was left
narrow. The placement of the traps is in-contract (the plan chose `orchestration/mistakes.md` as the
destination, and the traps relate to how the manager/leader dispatches and verifies planning tasks), so
the mismatch is soft, not a miscategorization.

**Manager disposition: ACCEPTED, deferred to a project backlog.** Task 04's scope was deliberately
narrow ("change ONLY the D4-003 path"), so broadening the description would be an out-of-scope content
edit. The fix is tracked at
[[orchestration-mistakes-description-generalize]] (project backlog): broaden the `description` + H1 to
name that the file also holds planning verification-gate traps, OR confirm "delegation dispatch" is the
intended umbrella framing.

## Verification

Not required for task 04 (Low severity, Conf 75, non-gating). When the backlog item is picked up, verify
the broadened description names all trap classes the file holds, and re-run `check-skill-mistakes.sh --all`
to confirm the skill-surface header stays conformant.

## Status notes

`item_status: deferred` = the manager reviewed and intentionally declined to remediate inside task 04,
with an explicit forward pointer to the backlog. Full finding text in
`evaluation/iter1/claude/consistency.md` (F-CONS-01).

## Related

- `evaluation/iter1/claude/consistency.md` — the evaluator's full F-CONS-01 finding
- [[orchestration-mistakes-description-generalize]] — the project backlog carrying the deferred fix
- [[task-04-single-system-evaluation-codex-waived]] — the evaluation-mode note for this iteration
