---
name: schema-extension-agents-status-field
description: session.template.json agents[] status field — deferred formal schema extension
type: backlogs
scope: feature
feature: install-runtime
project: gobbi
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [schema, session-template, agents, status-field, deferred]
disposition: open
---

# `session.template.json` agents[] status field — formal schema extension deferred

## Context

The PostToolUse hook is registered for both `PostToolUse` and `PostToolUseFailure` events. Failed Task spawns produce an `agents[]` entry with `status: "failed"` and a synthetic `id` (= `tool_use_id`). However, the current `session.template.json.agents[]` element schema does NOT formally include a `status` field — the template implies happy-path entries only.

The hook implementation writes the `status` field as an extra-property (the runtime JSON merging is permissive) without bumping the template schema. The formal template extension to officially accept `status: "failed"` (and a complementary `status: "success"` for symmetry) is deferred to keep the originating session's PR scope at docs + hook + script level.

## Why deferred

User-confirmed deferral at design-decision lock time. Reasons:

- Template bump would require a schema version increment and migration of any in-flight `session.json` files.
- Scope discipline — the originating session's PR is already touching ~10 doc files + 2 new shell scripts + 1 `settings.json` edit. Adding template + migration would balloon scope.
- The "extra-property" approach is forward-compatible: future template versions can add `status` formally without breaking existing entries.

## When to pick up

- At any future session that revisits the `session.template.json` schema.
- When the next feature requires bumping `session.template.json` schema for any other reason (bundle the changes).
- If an evaluator perspective flags the "extra-property" as a contract-violation concern.

## Suggested approach

Small in effort — a single template edit plus a version bump plus a couple of small doc updates:

1. Bump `session.template.json` schemaVersion.
2. Add `status: <string, enum [success, failed]>` to the `agents[]` element schema.
3. Update the hook + reconstructor scripts to write `status` formally (no logic change — they already write the field).
4. Migration: existing sessions without the field are accepted as legacy; new sessions stamp `status: "success"` by default.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`

## Source

Surfaced from the dual-event hook scope design decision (the hook is registered for both `PostToolUse` and `PostToolUseFailure`, so failed spawns produce a `status: "failed"` audit-trail entry). The formal schema extension was a user-confirmed deferral at design-decision lock time.
