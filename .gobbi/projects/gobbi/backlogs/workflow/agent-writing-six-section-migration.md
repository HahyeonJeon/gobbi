---
name: agent-writing-six-section-migration
description: Migrate agent-writing/SKILL.md to the new 6-section skill standard (lazy follow-up).
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-08
session: 33de02b8-4dff-4768-bafa-c1f53ae81890
tags: []
keywords: [skill-standard, six-section, agent-writing, lazy-migration]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Migrate `agent-writing/SKILL.md` to the 6-section skill standard

## Context

This session redesigned the gobbi skill authoring standard to a new 6-section skeleton
(Frontmatter → Intro → Principles → Rules → Procedure → References) with a source-free body
and per-doc-local References. `skill-writing/SKILL.md` (dogfooded) and `orchestration/SKILL.md`
were migrated to the new shape. `agent-writing/SKILL.md` is the sibling authoring standard for
agent-role docs (not skills), and it still uses the old skeleton.

## Why deferred

Out of scope for the 2026-07-08 session, which locked its scope to `skill-writing` (dogfood) +
`orchestration` (including the 4-child-doc split). The standard's own going-forward wording is
lazy migration — a skill migrates to the new shape when it is next substantially edited, not on
a scheduled sweep.

## When to pick up

No hard prerequisite. Pick this up the next time `agent-writing/SKILL.md` needs a substantial
edit, or as a dedicated lazy-migration pass alongside other still-unmigrated skills.

## Suggested approach

Apply the same 6-section skeleton used for `skill-writing/SKILL.md` and `orchestration/SKILL.md`
this session: hoist any source-bound prose out of the body, split heavy sections into child docs
only if `agent-writing/SKILL.md` is large enough to warrant it (it is smaller than
`orchestration/SKILL.md` was), and repoint any inbound anchors that reference its old section
headings.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-08-33de02b8-4dff-4768-bafa-c1f53ae81890/`

## Related

- [[project-skill-template-realign]] — sibling lazy-migration backlog from the same session
