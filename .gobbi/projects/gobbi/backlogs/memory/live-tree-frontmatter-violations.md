---
name: live-tree-frontmatter-violations
description: validate-frontmatter.sh reports 33 violations across live memory files (backlogs/features/mistakes/notes) — pre-existing, outside any sweep's diff.
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-06
session: 1faa4e51-9395-4d58-87b8-e7f47f59f81b
tags: [memory, frontmatter, validation]
keywords: [validate-frontmatter, stray-keys, legacy-data, full-tree-guard]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Clean up 33 pre-existing frontmatter violations in the live memory tree

## Context

Running `skills/memory/scripts/validate-frontmatter.sh` over the whole live tree reports **33
violations** spread across live memory files in `backlogs/`, `features/`, `mistakes/`, and
`notes/`. These are pre-existing — they sit OUTSIDE the diff of the 2026-07-01 doc-consistency
sweep (session 1faa4e51). They were found incidentally: the Task-08 executor and both Execution
evaluators ran the validator and observed the whole-tree count. The Codex Execution evaluator
recorded it explicitly: "`validate-frontmatter.sh`: fails with 33 violations in unchanged live
memory files; not counted as a new sweep regression."

None of the 33 is a review-corpus finding (neither the 2026-07-01 nor the 2026-06-29 corpus
files it). They are legacy-data drift — stray staging-routing keys, removed fields
(`decision_status` / `disposition`), or off-standard values that predate the current frontmatter
standard (`memory/rules.md § 2` + § 4.4).

## Why deferred

Out of scope for the doc-consistency sweep, whose Scope Contract was the review doc rows, not a
memory-tree frontmatter normalization. Normalizing 33 files is its own change with its own diff
and its own review — it does not belong bundled into the sweep.

## When to pick up

Any time — no prerequisites. Because the violations are on the FULL live tree, the frontmatter
validator fails on a whole-tree run today, so any future work that gates on a green whole-tree
`validate-frontmatter.sh` is blocked until this is cleared. Pick it up before wiring the
validator into a whole-tree CI gate.

Overlaps with the existing legacy-frontmatter cleanup backlogs — check for consolidation:
`backlogs/memory/legacy-frontmatter-migration.md` and
`backlogs/memory/legacy-frontmatter-migration-mistakes-domain.md`.

## Suggested approach

1. Run `skills/memory/scripts/validate-frontmatter.sh` (no args) to get the current 33-file list.
2. Group by violation class (stray key, removed field, off-standard enum value, `name` != stem).
3. Normalize each file to base (§2.1) + its type's extensions (§2.2) only; strip stray keys.
4. Re-run the validator to zero on the whole tree.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-06-1faa4e51-9395-4d58-87b8-e7f47f59f81b/` — observed
incidentally during the 2026-07-01 doc-consistency sweep (Task-08 + Execution evaluation).

## Related

- [[remaining-review-fixes-reconciliation]] — the sweep during which this was observed
