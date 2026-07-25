---
name: file-map-op-vocabulary-mismatch
description: A plan's summary File map CRUD column and its per-task `op:` field must use the same vocabulary, or the two sections read as contradicting each other.
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [planning, docs-sync]
keywords: [file-map, crud-column, op-field, task-schema, identity-preserving-move]
author: claude
scenario: task-record-crud-vocabulary-gap
item_status: pending
anchor: novel
implemented_in: null
---

# Check that a plan's File map CRUD wording matches its task-record `op:` vocabulary

## What

Add a per-plan check: for every path a plan's summary "File map" section describes with a CRUD verb
(Create / Modify / Delete / Move), confirm that the OWNING task's `files:` record for that same path
uses a compatible `op:` value from the canonical task schema. If the summary text and the task record
disagree (e.g. the summary says "Delete" while the task record says `op: modify`), either extend the
task schema's `op:` vocabulary to cover the real operation, or annotate the task record so the two
sections stop contradicting each other.

## Why

In the Planning iter-6 draft, § File map's CRUD column reads "Delete by identity-preserving namespace
move" for `.gobbi/projects/gobbi/skills/planning/mistakes.md` and "Delete through
`scripts/sync-plugin-package.sh`" for `.claude/skills/planning/mistakes.md`. Both paths appear in task
04's `files:` as `op: modify` (every op across all 23 entries in the plan is `modify` —
programmatically confirmed). The canonical task schema in `planning/SKILL.md:188` offers only
`Create / Modify`, so there is no vocabulary slot for an identity-preserving move-as-delete-and-recreate
operation. A reader comparing the two sections sees an apparent contradiction on an
irreversible-sounding operation ("Delete"), even though the intent is unambiguous elsewhere in the
plan and mechanically enforced: task 04 asserts `[ -e ] || [ -L ]` is false for all four `mistakes.md`
paths post-move, and the iter-6 evaluator confirmed all four paths exist at HEAD so each assertion
genuinely fails before the move runs.

**Novel — no pre-existing companion scenario file in this feature's scenario staging.** This item is
staged standalone (`anchor: novel`); a future session promoting or triaging this item may fold it into
a broader "task-record schema completeness" scenario if one already exists in `features/workflow/`, or
leave it as its own narrow scenario — that is a Wrap-up-time judgment call, not one this RECORD run can
make from inside a single Planning loop.

## Verification

Grep every plan's `## File map` (or equivalent CRUD-summary section) for a CRUD verb per path, extract
the corresponding task's `files:` entry `op:` value for that same path, and confirm the two agree —
either both say "modify"-compatible, or the schema has an explicit vocabulary entry (e.g. a sanctioned
"move" op) matching the summary's stronger wording. Fails when a summary section describes an
operation stronger than what the task schema's `op:` enum can express and the plan does not annotate
the gap.

## Status notes

Out of scope for THIS plan to fix — extending the task `op:` vocabulary (`Create / Modify` -> `+Move`
or similar) is a schema change to `planning/SKILL.md`'s task record contract, which is itself one of
this Planning loop's own deliverables (task 01 rewrites `planning/SKILL.md`). Whether to extend the
vocabulary as part of task 01, or leave `Modify` as the sole non-Create op and rely on prose narrative
for identity-preserving moves, is a decision the Execution loop's task-01 executor (or a future
Ideation cycle for the `planning` skill itself) should make explicitly, not one this RECORD stages a
plan-blocking requirement for.

## Related

- [[proj-6-001-union-diff-obligation-not-gate]] — a sibling finding from the same iter-6 evaluation,
  also about a plan-internal documentation/vocabulary gap rather than a mechanism defect
