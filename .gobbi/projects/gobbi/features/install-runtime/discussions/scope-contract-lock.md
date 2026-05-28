---
name: scope-contract-lock
description: User confirmed existing session.template.json agents[] schema is sufficient; no template bump needed this session, status field deferred to backlog.
type: discussions
scope: feature
feature: install-runtime
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [agents, session-template, schema]
discussion-id: CP-4-1-gamma
---

# Session template agents[] schema sufficient; no template bump needed

## Context

Before the PostToolUse hook task could be planned, it had to be settled whether the existing `session.template.json.agents[]` schema needed changes — a template bump would have added a schema-edit task to Planning and Execution.

## Question

Does the existing `session.template.json.agents[]` schema have gaps that need to be filled before the PostToolUse hook task ships?

## Options considered

- Treat the existing template schema as sufficient and write the new `status` field as an extra-property, deferring a formal template bump (the recommended option).
- Bump the template schema this session to add the `status` field formally, adding a schema-edit task to Planning/Execution.

## User decision

Confirmed the recommended option: the template schema is sufficient; no template change this session. The `status` field is an extra-property write (not in the template); a formal template bump is deferred to the `schema-extension-agents-status-field` backlog item.

## Implication

The PostToolUse hook task ships without modifying `session.template.json`. The hook writes `status` as an extra-property on failed spawn entries; Planning and Execution do not need to include a template-edit task.

## Related

- Backlog [`../backlogs/schema-extension-agents-status-field.md`](../backlogs/schema-extension-agents-status-field.md) — the deferred formal template bump.
- `discussions/dual-hook-registration-confirm.md` — the companion decision that also deferred the `status` field template extension.
