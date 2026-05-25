---
name: claude-doc-standard-skill-missing
description: CLAUDE.md links skills/claude/SKILL.md but no claude or _claude skill dir exists; doc-authoring standard is reference-but-absent, relevant to Principle 13 and project-memory feature
type: backlogs
scope: project
feature: null
status: active
disposition: deferred
created: 2026-05-25
session: 2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [doc-standard, principle-13, project-memory, dangling-reference]
---

# `claude` doc-standard skill is missing (FLAG-2)

## Context

CLAUDE.md includes a navigation table row pointing to `skills/claude/SKILL.md` as the "Documentation standard for `.claude/` authoring". No such directory exists under `.claude/skills/` or the canonical `.gobbi/projects/gobbi/skills/` tree (confirmed: 18 canonical dirs, none named `claude` or `_claude`). The reference is a dangling link.

This gap surfaced during Ideation iter2 (HIGH-1 correction, MED-8 remediation). Principle #13 (L7) was authored to cite the doc standard generically rather than naming the missing skill, so the absence does not block the current session's execution.

## Why deferred

Out of scope for session 2026-05-25-a10c82d6 per FLAG-2 classification (see design doc §11). The current session's scope is the memory-system redesign: 13 per-type specs, naming standard, frontmatter standard, migration, Principle #13, and propagation. Authoring a new `claude` skill from scratch is a separate, bounded piece of work that warrants its own Ideation loop to define what the doc standard should cover (`.claude/` authoring conventions, skill-dir layout, stub-redirect format, etc.).

## When to pick up

Prerequisites:
- Session 2026-05-25-a10c82d6 closes (memory-system redesign shipped) — the `memorization/rules.md` standard and Principle #13 will be in place, giving a solid foundation for the doc-authoring standard to reference.
- No other prerequisites — can run any time after this session completes.

## Suggested approach

Create `.gobbi/projects/gobbi/skills/claude/SKILL.md` (canonical; symlinked into `.claude/skills/claude/SKILL.md`) covering: `.claude/` directory layout, skill-dir authoring conventions (SKILL.md structure, allowed-tools frontmatter, etc.), stub-redirect format for non-skill pointer files. Also fix the CLAUDE.md navigation row (currently a dangling reference) to point to the real canonical path once created. Consider whether `rules/stub-redirect-format.md` should be superseded or cross-referenced by the new skill (FLAG-3 from the design doc).

## Originating session

`sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/` — Ideation FLAG-2 + Preparation Readiness (this session).
