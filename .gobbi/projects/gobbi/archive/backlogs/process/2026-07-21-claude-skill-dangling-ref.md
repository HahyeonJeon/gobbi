---
name: claude-skill-dangling-ref
description: .claude/CLAUDE.md:61 links skills/claude/SKILL.md ("Documentation standard for .claude/ authoring") which does not exist.
type: backlogs
scope: project
feature: null
status: closed
archived_at: 2026-07-21
archive_reason: addressed
created: 2026-06-28
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [process]
keywords: [claude-skill, dangling-reference, docs-sync, CLAUDE-md, flag-2]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Fix or Create `skills/claude/SKILL.md` (Dangling `.claude/CLAUDE.md:61` Reference)

> **v0.5.3 lifecycle note:** the Preparation wording below identifies the historical session where
> this backlog was raised. The current workflow would surface the same gap through Planning readiness.

## Context

`.claude/CLAUDE.md:61` navigation table lists `skills/claude/SKILL.md` with description "Documentation standard for `.claude/` authoring." This file does NOT exist — verified at `skills/claude/SKILL.md`, `.agents/skills/claude/`, and `.claude/skills/claude/`. Both the Claude and Codex evaluators independently confirmed the absence.

This is the same class of docs-sync defect as `mistakes/docs-sync/delegation-briefs-reference-nonexistent-rules-dir.md` — a reference in a navigation document pointing to a non-existent skill file. The dangling link creates confusion for agents loading skills from the navigation table in `CLAUDE.md`.

For this session's task (`skills/coding/review.md`), FLAG-2 is NON-BLOCKING because `review.md` is a `coding`-child doc, not a `.claude/`-runtime doc. The `.claude/` authoring standard is not in this task's authoring path; `coding/SKILL.md` + `coding/evaluation.md` serve as the de-facto format template. USER-LOCKED SKIP for this task on 2026-06-28.

## Why deferred

Fixing or creating `skills/claude/SKILL.md` is out of scope for this session (Scope Contract: author `review.md`; no existing skill edits). USER-LOCKED 2026-06-28 as BACKLOG.

## When to pick up

Any time. No prerequisites. Two options: (a) CREATE `skills/claude/SKILL.md` with the `.claude/` authoring standard (what the link promises), or (b) REMOVE the dangling navigation row from `.claude/CLAUDE.md:61` if the standard was never intended.

## Suggested approach

Option A (preferred): Author `skills/claude/SKILL.md` as a new skill documenting the `.claude/` documentation standard — the conventions for writing CLAUDE.md, skills under `.claude/skills/`, and any `.claude/` docs. Load `skill-writing/SKILL.md` for the authoring template. Mirror to `.agents/skills/claude/SKILL.md` and `plugins/gobbi/` per the runtime-mirror convention.

Option B: Remove the navigation row from `.claude/CLAUDE.md:61` if the standard has been decided to live elsewhere (e.g., inline in `CLAUDE.md` itself). Requires a CRUD pass: check callers that reference `skills/claude/SKILL.md` in any Load Directives or briefs.

## Originating session

`sessions/2026-06-27-d45128ad-6a6c-4bb7-9925-343cd3b826c8/` — the Preparation loop where FLAG-2 was discovered and assessed non-blocking for this task; user-locked SKIP + BACKLOG on 2026-06-28.

## Related

- [[manager-dispositioned-material-readiness-gap-without-user]] — the same session's process mistake
