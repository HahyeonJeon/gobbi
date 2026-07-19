---
name: task-02-skill-load-checklist-gap
description: Task 02 executor report should include the exact SKILLS LOADED checklist for load-directive auditability.
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-07-06
session: 019f283d-e961-7442-9c22-319f26798141
tags: [verification]
keywords: [execution, load-directives, skills-loaded, task-02]
author: codex
scenario: workflow-artifact-fidelity-audit
item_status: pending
anchor: COD-CONS-02-001
implemented_in: null
---

# Task 02 skill-load checklist gap

> **v0.5.3 lifecycle note:** the `4-execution/` links below identify the originating historical
> session. Current Execution evidence uses `3-execution/`; the generic load-audit requirement remains.

## What

Task 02's executor report should include the exact `SKILLS LOADED` checklist when the work draft asserts that mandatory load-directive files were read. The checklist should list every loaded path in order, matching the delegation contract.

## Why

Gobbi has a known process failure mode where a subagent can skip required load directives while still producing plausible work. The exact `SKILLS LOADED` checklist is the self-report half of that audit gate. Without it, the Task 02 work draft states load compliance but does not make the loaded path set reviewable from the WORK artifact.

## Verification

For future records with this claim, verify that the report contains a `SKILLS LOADED:` section and that the section enumerates each required Load-Directives path in order. Load the current Gobbi owner `.gobbi/projects/gobbi/skills/orchestration/delegation.md` before checking the wire contract. If the intended proof surface is transcript verification instead, cite the transcript-verification artifact directly.

## Status notes

`COD-CONS-02-001` remains open and pending. It does not revise Task 02. RECORD staged it as a checklist gap for Wrap-up promotion while preserving the Codex PASS verdict.

## Related

- `4-execution/task-02-workflow-artifact-fidelity-audit/working/draft-iter1.md`
- `4-execution/task-02-workflow-artifact-fidelity-audit/evaluation/iter1/codex/consistency.md`
- `4-execution/task-02-workflow-artifact-fidelity-audit/evaluation/iter1/codex/overall.md`
- `.gobbi/projects/gobbi/skills/orchestration/delegation.md`
