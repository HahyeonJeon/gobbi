---
name: project-skill-template-realign
description: Realign interview/templates/project-skill.md's stamped section order to the 6-section standard.
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-08
session: 33de02b8-4dff-4768-bafa-c1f53ae81890
tags: []
keywords: [skill-standard, six-section, interview, project-skill-template]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Realign `interview/templates/project-skill.md` to the 6-section standard

## Context

This session redesigned the gobbi skill authoring standard to a new 6-section skeleton
(Frontmatter → Intro → Principles → Rules → Procedure → References). `interview/templates/project-skill.md`
is the template Interview stamps when it generates a NEW project-specific skill, and it still
stamps the OLD section order (When-to-load / Conventions / Examples / Anti-patterns /
Constraints). Until realigned, every newly interviewed project skill is born on the old shape,
widening the drift between hand-authored and interview-generated skills.

## Why deferred

Deferred from the 2026-07-08 session, which locked its scope to `skill-writing` (dogfood) +
`orchestration`. Realigning the Interview template is a separate, small edit that was not part of
this session's plan.

## When to pick up

No hard prerequisite — can run any time. Best picked up before the next Interview bootstrap run
that would generate a project skill, so the newly interviewed skill is born on the current shape.

## Suggested approach

Two options to weigh: (1) realign the template's stamped section order to the 6-section standard
used by `skill-writing/SKILL.md` and `orchestration/SKILL.md`; or (2) document
`interview/templates/project-skill.md` as a deliberately exempt, simplified project-skill shape
(narrower scope than a full authored skill) and record that exemption in the skill standard
itself. Decide which with the user before editing the template.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-08-33de02b8-4dff-4768-bafa-c1f53ae81890/`

## Related

- [[agent-writing-six-section-migration]] — sibling lazy-migration backlog from the same session
