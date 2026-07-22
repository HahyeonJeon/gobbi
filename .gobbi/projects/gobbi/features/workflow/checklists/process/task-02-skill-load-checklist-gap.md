---
name: task-02-skill-load-checklist-gap
description: A specialist report must expose exact skill loads and the manager must complete the report, idle, and artifact handshake.
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
item_status: implemented
anchor: COD-CONS-02-001
implemented_in: subagents-skip-load-directives-no-enforcement
---

# Task 02 skill-load checklist gap

## What

A specialist report includes an exact `SKILLS LOADED:` list in assignment order. The manager compares it with the brief, confirms the structured status and stable assignment, verifies idle/addressability, and rereads the promised artifact or commit before accepting completion or sending a follow-up.

## Why

Gobbi has a known process failure mode where a specialist can skip required loads while still producing plausible work. A self-report alone is also insufficient: the manager must compare the exact path set and verify the handoff evidence.

## Verification

For each assignment, verify that the report contains `SKILLS LOADED:` with every required path in order; manager comparison finds no omission; the report names the stable assignment and status; idle/addressability is confirmed; and the manager rereads the exact promised artifact or commit. Load `.gobbi/projects/gobbi/skills/orchestration/delegation.md` before checking the contract. Runtime-private context is not an evidence fallback.

## Status notes

The original checklist gap is addressed by the shared delegation skeleton and manager acceptance handshake. The historical finding identity remains provenance only.

## Related

- `.gobbi/projects/gobbi/skills/orchestration/delegation.md`
- `skills/orchestration/mistakes.md#subagents-skip-load-directives-no-enforcement`
