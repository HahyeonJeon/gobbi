---
name: scope-lock-d12-workflow-feature
description: User locked the scope contract with feature=workflow and the full in-scope/out-of-scope boundary
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [design]
keywords: [scope, locked]
author: claude
outcome: D12 Scope Contract locked; feature = workflow; 71-file sweep + 2-skill restructure + 5-stage pipeline + handoff + enum updates + CLAUDE.md in scope
---

# Scope lock: D12 — feature = workflow, 71-file sweep + 2-skill + pipeline

## Context
The leader presented a Scope Contract draft covering the full vocabulary + skill-restructure + wrap-up pipeline work. The user locked it with feature = `workflow`.

## Question
Is the Scope Contract boundary correct? What is in scope and what is out?

## Options considered
- Broader scope: include task-record template fix (rejected → backlogged).
- Narrower scope: defer the CLAUDE.md/AGENTS.md reconcile (rejected → included as D-f).

## User decision
D12: **Scope Contract locked**. Feature = `workflow`. In: 71-file vocabulary sweep (command-derived manifest), 2-skill restructure (`skills/memory/` + `skills/record/`), 5-stage wrap-up pipeline spec, handoff artifact spec, phase-enum prose updates, CLAUDE.md + AGENTS.md reconcile, mirror fixups (symlinks + permissions). Out: re-opening D4–D14, #299 session-tree shape, 21 historical docs, `task-record` template fix (backlogged).

## Implication
The scope is fixed. Any in-session discovery that touches an out-of-scope item goes to backlog, not to scope. The `task-record` template + dangling-ref fix is staged as a feature-scope backlog.

## Related
- Discussion log D12 (2026-06-13 post-leader-findings round)
- `archive/backlogs/process/2026-07-20-task-record-template-and-dangling-ref.md`
