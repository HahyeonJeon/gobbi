---
name: execution-bundle-source-before-trim
description: A plan that splits a source file into derived files AND trims the source must author every derived file from the seeds BEFORE the trim runs, or the trim destroys the derived tasks' source
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-08
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [process, verification]
keywords: [source-before-delete, data-dependency, task-ordering, planning, STRUCT-01]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
related: [verifies-must-be-self-failing, dual-system-plan-integration]
---

# Author every derived file from the source before trimming the source

## What happened

Planning iter1's canonical plan (`draft-iter1.md`) split `execution/evaluation.md` into three files by ordering the tasks as: (02) trim `evaluation.md` down to procedure-only, then (03) create `scenario.md`, then (04) create `checklist.md`. Task 02's trim deleted the "Seed scenarios with attached checklists" sections — but tasks 03 and 04 needed to READ exactly that content as their authoring source. By the time 03/04 ran, their source was gone. Codex's independent Planning evaluation caught this as a High-severity, BLOCKING finding (`COD-PLAN-STRUCT-01`) before any executor touched the plan.

## Why it happens

Decomposing "split X into A, B, C" naturally tempts a task order that follows the target files' own logical order (trim the original first, since it's "file 1" of the bundle) rather than the DATA dependency order (every task that reads content from X must run before the task that deletes that content from X). The plan looked complete — three tasks, one file each, clean file-ownership boundaries — but file-ownership cleanliness and data-dependency ordering are two different properties, and only the second one prevents this defect.

## Correct approach

Reorder so every task that reads content from a source being trimmed runs BEFORE the trim task, and encode this as an explicit dependency (`requires:`) — not just task numbering. State the invariant by name in the plan (e.g., "source-before-delete") so future bundles built from the same pattern (this plan has 4 more, tasks 06-09) restate the same internal order deliberately rather than by accident. Prefer reordering over freezing a baseline copy of the source — reordering needs no extra artifact to create, track, or clean up, and it makes the dependency visible in the task graph itself.

## How to detect

Any plan where one task both (a) trims or deletes content from a source file, and (b) another task's `inputs:` cites content from that same source file, is at risk. Check explicitly: does the trimming task's position in the dependency graph come BEFORE every task whose `inputs:` names that source file? If the trim task has no `requires:` on the authoring tasks (or the authoring tasks have no `requires:` forcing them before the trim), the ordering is unverified. The genuine fix leaves a trace: each consumer task's `inputs:` names the source file as "the CURRENT un-trimmed" version, and the trim task's `requires:` lists every consumer task by id.

## Related

- [[verifies-must-be-self-failing]] — the sibling defect from the same Planning iter1 evaluation round
- [[dual-system-plan-integration]] — the integration log this defect was caught against
