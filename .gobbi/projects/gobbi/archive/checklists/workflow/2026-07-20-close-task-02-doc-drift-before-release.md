---
name: close-task-02-doc-drift-before-release
description: "Keep release blocked until Task 02 closes the known policy narration drift."
type: checklists
scope: feature
feature: workflow
status: retired
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [docs-sync, verification]
keywords: [task-02, task-03, release-gate]
author: codex
scenario: complete-policy-unit
item_status: deferred
anchor: novel
implemented_in: null
archived_at: 2026-07-20
archive_reason: addressed
---

# Close Task 02 doc drift before release

## What

Treat the Task 02 policy-alignment result as a required input to Task 03's release gate.

## Why

Claude Overall finding `OVR-1` restated the known interim drift as a manager tracking
item. The strict `01 -> 02 -> 03` chain already provides its owner and completion point.

## Verification

Task 03 must rerun the compatibility, pointer, scope, and release-readiness gates only
after Task 02 passes.

## Status notes

Deferred to Tasks 02 and 03. No release or backlog action belongs to Task 01.

## Related

- [[replace-old-mixed-effort-narration]] - the Task 02 implementation check.
