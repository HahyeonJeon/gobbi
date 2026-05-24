---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
feature: session-foundations-bundle-b
discussion-id: CP-D-1
slug: cp-d-1-dual-hook-registration
phase: ideation
sub-step: D-round-2
loop-iter: 1
---

# T3 dual hook registration (PostToolUse + PostToolUseFailure) — confirmed; status field deferred

## Question asked

CP-D-1: Should T3 register both `PostToolUse` and `PostToolUseFailure` hooks this session, and should the `agents[].status` field template extension also ship this session?

## User answer

Confirmed Option Recommended:
- **Dual registration this session**: YES — both `PostToolUse` and `PostToolUseFailure` registered in `.claude/settings.json`
- **`agents[].status` field template extension**: deferred to backlog (`staging/backlogs/feature/schema-extension-agents-status-field.md`)

## Impact on design

D-3-3 locks dual registration. The `status` field is written as an extra-property on failed spawn entries (no template change). T3-I-T3.f checklist item acknowledges the template deferral.

## Source

`rawdata/draft-iter3.md:477-478` (Sub-step D round 2, decision #14)
