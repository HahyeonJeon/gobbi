---
name: claude-doc-authoring-standard
description: Author or repoint the missing skills/claude/SKILL.md documentation-authoring standard referenced by CLAUDE.md and gobbi/SKILL.md.
type: backlogs
scope: project
feature: null
status: closed
archived_at: 2026-07-21
archive_reason: addressed
created: 2026-06-24
session: 2026-06-24-bb4eb896-bed0-42d6-9a3c-f74547df2611
tags: [docs-sync]
keywords: [claude-skill, doc-authoring-standard, dangling-reference, skill-map]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Author or repoint the absent `claude` doc-authoring standard

## Context

`CLAUDE.md` (Navigate-deeper table) and `gobbi/SKILL.md:189` both link `skills/claude/SKILL.md`, which is described as a general `.claude/` documentation-authoring standard. The file does not exist — these are dangling references. Surfaced during the `skill-writing` / `agent-writing` Ideation session (2026-06-24).

## Why deferred

Out of scope for the skill-writing/agent-writing session (D2). The new `skill-writing` skill is self-contained and does not depend on this standard to function. Fixing the dangling references or authoring the standard is its own bounded task.

## When to pick up

No hard prerequisite. Can run any time as a standalone docs task. Pick up when the dangling references become a friction point for future skill authors or when a session's Planning readiness gate surfaces the missing doc as a gap.

## Suggested approach

Option A: Author `skills/claude/SKILL.md` as a general `.claude/` documentation-authoring standard — covering CLAUDE.md conventions, the Navigate-deeper table shape, the claude skill `allowed-tools` pattern, and cross-linking conventions. Use `skill-writing/SKILL.md` as a reference for the authoring-standard format.

Option B: Repoint or remove the two inbound links if the standard is better expressed inside an existing skill (e.g., fold into `gobbi/SKILL.md` or `skill-writing/SKILL.md`).

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-24-bb4eb896-bed0-42d6-9a3c-f74547df2611/`

## Related

- [[skill-loadability-and-map-placement]] — the session that surfaced this gap
