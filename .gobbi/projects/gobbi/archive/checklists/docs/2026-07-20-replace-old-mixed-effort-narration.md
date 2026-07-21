---
name: replace-old-mixed-effort-narration
description: "Replace old mixed-effort policy narration with the uniform xhigh policy."
type: checklists
scope: feature
feature: workflow
status: retired
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [docs-sync, verification]
keywords: [task-02, effort-policy, xhigh]
author: codex
scenario: complete-policy-unit
item_status: deferred
anchor: novel
implemented_in: null
archived_at: 2026-07-20
archive_reason: addressed
---

# Replace old mixed-effort policy narration

## What

Update Task-02-owned policy documents that still describe manager, executor, evaluator,
or assistant effort as `high`.

## Why

Claude Consistency finding `F-CONS-1` confirmed real interim doc-to-config drift. The
locked dependency chain assigns those files and the full narration sweep to Task 02.

## Verification

Run Task 02's form-covering policy inventory and compatibility validator, then require
Task 03's complete integration gate before release.

## Status notes

Deferred to planned Task 02. This is an existing dependency, not a new backlog and not a
Task 01 defect.

## Related

- [[native-defaults-and-settings-shipped]] - the native values this narration must match.
