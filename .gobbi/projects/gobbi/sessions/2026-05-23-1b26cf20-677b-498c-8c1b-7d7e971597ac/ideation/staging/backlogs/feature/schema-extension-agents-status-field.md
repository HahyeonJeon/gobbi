---
title: "session.template.json.agents[] status field schema extension"
status: deferred
project: gobbi
feature: session-foundations-bundle-b
task: null
anchor_session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
created: 2026-05-23
tags: [schema, session-template, agents, status-field, deferred]
disposition: open
---

# session.template.json.agents[] status field schema extension

## Context

Under T3's design Decision D-3-3 (Sub-step D), the PostToolUse hook is registered for BOTH `PostToolUse` and `PostToolUseFailure` events. Failed Task spawns produce an `agents[]` entry with `status: "failed"` and a synthetic `id` (= `tool_use_id`). However, the current `session.template.json.agents[]` element schema (`orchestration/templates/session.template.json:28-48`) does NOT formally include a `status` field — the template implies happy-path entries only.

This session's T3 implementation writes the `status` field as an extra-property (the runtime JSON merging is permissive) without bumping the template schema. The formal template extension to officially accept `status: "failed"` (and a complementary `status: "success"` for symmetry) is deferred to a future feature-internal task to keep this session's PR scope at docs + hook + script level.

## Why deferred

CP-D-1 Option Recommended (user-confirmed in Sub-step D round 2): "Dual registration this session; template extension deferred to backlog." Reasons:

- Template bump would require a schema version increment (e.g., `schemaVersion 1 → 2`) and migration of any in-flight `session.json` files.
- Scope discipline — this session's PR is already touching ~10 doc files + 2 new shell scripts + 1 `settings.json` edit. Adding template + migration would balloon scope.
- The "extra-property" approach is forward-compatible: future template versions can add `status` formally without breaking existing entries.

## When to pick up

- Within this feature (`session-foundations-bundle-b`) at any future session that revisits the template.
- When the next feature requires bumping `session.template.json` schema for any other reason (bundle the changes).
- If an evaluator perspective flags the "extra-property" as a contract-violation concern in T3's Execution-time evaluation.

## Suggested approach

1. Bump `session.template.json` schemaVersion.
2. Add `status: <string, enum [success, failed]>` to the `agents[]` element schema.
3. Update T3's hook + reconstructor scripts to write `status` formally (no logic change — they already write the field).
4. Migration: existing sessions without the field are accepted as legacy; new sessions stamp `status: "success"` by default.

## Effort estimate

Small — a single template edit + version bump + 2 small doc updates. ~1 hour of focused work.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`

## Anchor

- T3 Design Decision D-3-3 (dual-event hook scope)
- T3 Implementation checklist item 7 (this backlog entry is the literal output of that checklist row)
- T3-DQ-3 (failure-handling design question)
- E-1 edge case (failed-spawn audit trail)
- CP-D-1 Option Recommended (user-confirmed deferral)
