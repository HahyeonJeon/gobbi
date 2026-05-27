---
name: dual-hook-registration-confirm
description: User confirmed dual PostToolUse+PostToolUseFailure hook registration for the agents-population task; agents[].status template extension deferred.
type: discussions
scope: feature
feature: install-runtime
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hooks, agents, session-json]
discussion-id: CP-D-1
---

# Dual hook registration (PostToolUse + PostToolUseFailure) confirmed; agents status field deferred

## Context

The agents-population task was designing the PostToolUse hook. Two open questions needed a user decision before the design could lock: whether to register the failure event alongside the success event, and whether to extend the `agents[]` schema template with a `status` field this session or defer it.

## Question

Should the agents-population hook register both `PostToolUse` and `PostToolUseFailure`, and should the `agents[].status` field template extension also ship this session?

## Options considered

- Register both hook events this session vs. register only `PostToolUse` (losing the failed-spawn audit trail).
- Ship the `agents[].status` template extension now vs. defer the formal template bump and write `status` as an extra-property in the meantime.

## User decision

Confirmed the recommended option:
- **Dual registration this session**: YES — both `PostToolUse` and `PostToolUseFailure` registered in `.claude/settings.json`.
- **`agents[].status` field template extension**: deferred to the `schema-extension-agents-status-field` backlog item.

## Implication

The dual-hook-registration-resolver design locks dual registration. The `status` field is written as an extra-property on failed spawn entries (no template change). The hook implementation checklist acknowledges the template deferral.

## Related

- `design/dual-hook-registration-resolver.md` — the design this decision locks.
- Backlog `schema-extension-agents-status-field` — the deferred template bump.
