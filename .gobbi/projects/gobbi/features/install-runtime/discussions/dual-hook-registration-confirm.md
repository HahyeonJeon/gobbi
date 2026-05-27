---
name: dual-hook-registration-confirm
description: User confirmed dual PostToolUse+PostToolUseFailure hook registration for T3; agents[].status template extension deferred.
type: discussions
scope: feature
feature: install-runtime
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hooks, agents, session-json]
discussion-id: CP-D-1
slug: dual-hook-registration-confirm
phase: ideation
sub-step: D-round-2
loop-iter: 1
---

# Dual hook registration (PostToolUse + PostToolUseFailure) confirmed; agents status field deferred

## Question asked

Should T3 register both `PostToolUse` and `PostToolUseFailure` hooks, and should the `agents[].status` field template extension also ship this session?

## User answer

Confirmed Option Recommended:
- **Dual registration this session**: YES — both `PostToolUse` and `PostToolUseFailure` registered in `.claude/settings.json`
- **`agents[].status` field template extension**: deferred to backlog (`staging/backlogs/feature/schema-extension-agents-status-field.md`)

## Impact on design

The dual-hook-registration-resolver design locks dual registration. The `status` field is written as an extra-property on failed spawn entries (no template change). The hook implementation checklist acknowledges the template deferral.

## Source

`rawdata/draft-iter3.md:477-478` (Sub-step D round 2, decision #14)
