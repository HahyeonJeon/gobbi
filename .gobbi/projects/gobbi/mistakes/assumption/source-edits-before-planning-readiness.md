---
name: source-edits-before-planning-readiness
description: Editing source after Ideation PASS but before Planning locks readiness and ordered tasks violates the workflow contract.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-02
session: 019f1f53-6ae2-7853-953e-4ee246cbef0b
tags: [process, planning, execution, assumption]
keywords: [planning-readiness, workflow, source-edit, step-order, execution]
author: codex
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Source edits before Planning readiness completes

## What happened

After Ideation reached PASS, the manager edited Gobbi source documentation before Planning completed its readiness gate and ordered task decomposition.

## User feedback

The user corrected the workflow drift with "Please follow the workflow" and later "Please do the works following the workflow."

## Why it happens

The mistaken assumption is that locked Ideation plus an approved scope direction authorizes implementation. Planning must first confirm readiness and lock ordered tasks before Execution changes source files.

## Correct approach

After Ideation PASS, freeze the design and run Planning DISCUSSION, dual-system WORK, EVALUATION, and RECORD through an accepted plan before Execution. If source edits already exist, stop further mutation, preserve them as work-in-progress evidence, and complete the missing Planning contract before resuming implementation.

## How to detect

Check `state.json` before any source edit. If `current.step` is not `execution` but tracked source changes already exist under skills, runtime surfaces, plugin paths, or other implementation roots, the workflow boundary was crossed too early.

## Related

- [[manager-dispositioned-material-readiness-gap-without-user]] — related material-decision trap in Planning readiness.
