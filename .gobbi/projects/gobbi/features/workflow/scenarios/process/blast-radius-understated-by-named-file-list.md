---
name: blast-radius-understated-by-named-file-list
description: A repoint/migration task's projected file set can silently understate blast radius by listing only named files, missing prose- and concept-name consumers of the moved content.
type: scenarios
scope: feature
feature: workflow
status: active
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [verification]
keywords: [scenario_gap, blast-radius, consumer-migration, semantic-equivalents, task-09]
author: claude
---

# A migration task's projected consumer set understates blast radius

**Category:** adversarial
**Coverage:** covered

## Situation

A plan or task projects "the consumer set is these N named files" for a content-repoint or migration.
An adversarial reviewer checks whether the projection is complete by re-deriving the consumer set
independently, rather than trusting the named list.

## Inputs

- A task whose scope is "repoint every consumer of moved/renamed content to its new home."
- A named file list the task's plan or executor claims is the complete consumer set.
- The actual consumer set may include: literal path references, prose attributions ("the X skill"),
  and bare concept-name references (a heading name, a section label) that a path-only grep misses.

## Expected behavior

The verification for a repoint/migration task must independently re-derive the consumer set across
multiple forms — literal path, prose attribution, and concept-name reference — not merely confirm the
plan's named files were each touched. A task that repoints exactly the named files but leaves an
un-named prose or concept-name consumer pointing at the old location has NOT closed the migration,
even though its own named-file checklist reads complete.

## Verification

Task 09 (`09-migrate-moved-content-consumers`, this session) is the concrete positive witness: the
evaluator built an independent multi-form sweep (literal path + prose + concept-name, across `skills/`,
`agents/`, `rules/`) and confirmed the executor's 9-file list was in fact complete — no 10th consumer
survived. This scenario should become a standing adversarial seed in `execution/scenario.md` § Project
so future repoint/migration tasks are evaluated against the same multi-form completeness check by
default, rather than each evaluator re-deriving the need for it independently.

## Related

- Cites `mistakes/refactor/cotouch-enumeration-must-cover-semantic-equivalents.md` — the general
  co-touch-enumeration trap this scenario operationalizes for repoint/migration tasks specifically.
- `4-execution/task-09-migrate-moved-content-consumers/evaluation/iter1/claude/project.md` — the
  evaluator's constructive finding (Type `scenario_gap`, Domain `process`, Confidence 50, Severity Low,
  Disposition `open`) this scenario file was staged from.
