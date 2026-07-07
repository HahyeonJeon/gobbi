---
name: source-edits-before-preparation-planning
description: Editing source docs after Ideation PASS but before Preparation and Planning violates the Gobbi workflow contract.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-02
session: 019f1f53-6ae2-7853-953e-4ee246cbef0b
tags: [process, planning, execution, assumption]
keywords: [preparation, planning, workflow, source-edit, phase-order]
author: codex
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Source Edits Before Preparation Planning

## What happened

After Ideation reached `PASS`, the manager advanced `state.json` to Preparation but edited Gobbi skill documentation directly. The edits created `codex/delegation.md` and updated parent routing docs before the Preparation and Planning loops had run.

## User feedback

The user corrected the workflow drift with "Please follow the workflow" and later "Please do the works following the workflow."

## Why it happens

The mistaken assumption is that a locked Ideation design plus user approval of a scope option is enough authorization to implement. Gobbi requires Preparation to verify readiness and Planning to decompose the approved work before Execution changes source files.

## Correct approach

After Ideation `PASS`, freeze the design and run Preparation, then Planning, then Execution. If source edits already exist, treat them as WIP evidence, stop further editing, stage the process mistake immediately, and run the missing workflow gates before declaring the task done.

## How to detect

Check `state.json` before any source edit. If the active step is before Execution, but `git status --short` already shows tracked source changes under skills, runtime mirrors, plugin paths, or agents, the manager crossed the phase boundary too early.

## Related

- [[manager-skipped-user-driven-preparation-discussion]] — related assumption trap around missing required workflow discussion.
