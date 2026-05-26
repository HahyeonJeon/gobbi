---
name: stub-redirect-dangling-claude-skill-ref
description: rules/stub-redirect-format.md references _claude/SKILL.md which does not exist; repoint once FLAG-2 (claude doc-standard skill) resolves.
type: backlogs
scope: project
feature: null
status: active
created: 2026-05-25
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [docs-authoring, stub-redirect, dangling-reference, claude-skill]
priority: medium
disposition: open
project-scope: true
---

# `rules/stub-redirect-format.md` references dangling `_claude/SKILL.md` (FLAG-3)

## Context

`rules/stub-redirect-format.md` § Related ends with:

> See `_claude/SKILL.md` for the broader docs writing standard.

No `_claude/SKILL.md` exists. The `.claude/skills/` tree holds no `_claude` or `claude` skill dir (verified: 18 canonical skill dirs, none named `_claude` or `claude` — FLAG-2 in the Ideation design doc §11). This is a dangling reference to the same missing `claude` doc-standard skill that FLAG-2 tracks.

## Dependency

This item depends on FLAG-2 (`backlogs/claude-doc-standard-skill-missing.md`): once the `claude` skill dir is created at `skills/claude/SKILL.md` and symlinked to `.claude/skills/claude/SKILL.md`, repoint this reference from `_claude/SKILL.md` to the new canonical path.

## Why deferred

No stub-redirect rule depends on the missing doc-standard skill to function correctly. The dangling reference is cosmetic until FLAG-2 resolves. Fixing it before FLAG-2 creates the skill would require inventing a path that does not yet exist.

## Suggested fix

After FLAG-2 ships:

1. Update the `## Related` section of `rules/stub-redirect-format.md` to reference `skills/claude/SKILL.md` (or the canonical path the new skill lands at).
2. Verify the link is no longer dangling with `ls .claude/skills/claude/SKILL.md`.

## Originating session

`sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/` — Ideation FLAG-3 / design doc §11.

---

AI-Provenance-Record: memory-redesign W5-T1, session 2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
