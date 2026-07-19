---
name: preparation-skill-automode-carve-out
description: Add explicit cite of discuss.mode=user to preparation/SKILL.md so user-driven gap-resolution is legible from the skill alone.
type: backlogs
scope: project
feature: null
status: closed
created: 2026-06-28
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [process]
keywords: [preparation-skill, auto-mode, discuss-mode, user-driven, doc-gap]
author: claude
priority: low
project-scope: true
shipped_in: CHANGELOG.md
archived_at: 2026-07-19
archive_reason: closed
---

# Add Auto-Mode Carve-Out Citation to `preparation/SKILL.md`

## Context

`preparation/SKILL.md` requires "every identified gap has a user-locked resolution" (line 115) and states "MUST never close a gap without explicit user approval" (Constraints). These requirements are correct, but the skill carries NO explicit cite of `orchestration/auto-mode.md:86,96,213` — the lines that establish Preparation DISCUSSION as user-driven (`discuss.mode = "user"`) even in Auto mode.

As a result, a reader of `preparation/SKILL.md` alone cannot tell that Preparation gap-resolution is user-driven in Auto mode. The skill looks like a blanket rule without mode qualification, when in fact the key qualification ("this applies even in Auto mode because Preparation discuss.mode = user") lives only in `auto-mode.md`. This created the iter1-iter2 mistake: the manager read the Auto-mode general auto-decide authority as overriding the preparation skill's user-lock requirement, when `auto-mode.md` explicitly preserves that requirement for Preparation.

## Why deferred

Editing `preparation/SKILL.md` is out of scope for this session (Scope Contract: author `review.md`; no existing skill edits). USER-LOCKED 2026-06-28 as a BACKLOG.

## When to pick up

Any time. No prerequisites. This is a documentation clarity fix — a two-sentence addition to `preparation/SKILL.md` Sub-step D (Exit checklist) and the Constraints section, citing `auto-mode.md:86,96,213` and stating: "In Auto mode, Preparation DISCUSSION is user-driven (`discuss.mode = user`); the user-lock requirement applies regardless of Auto mode."

## Suggested approach

1. Read `orchestration/auto-mode.md:86,96,213` to get the exact wording.
2. Add a sentence to `preparation/SKILL.md` Constraints section: "This user-lock requirement is NOT overridden by Auto mode. `orchestration/auto-mode.md` keeps `workflow.preparation.discuss.mode = "user"` — Preparation DISCUSSION is user-driven in all modes."
3. Add a cross-reference line at Sub-step D (Exit checklist) near the "every gap has user-locked resolution" check, citing `auto-mode.md`.
4. Verify both `.claude/` and `.codex/` mirrors (and `plugins/gobbi/` if applicable) are updated.

## Originating session

`sessions/2026-06-27-d45128ad-6a6c-4bb7-9925-343cd3b826c8/` — the Preparation loop where this gap was discovered via dual-system evaluation (Codex held High/100 across iter1-iter2 that auto-disposition was wrong; root cause traced to missing `discuss.mode` citation in the skill).

## Related

- [[manager-skipped-user-driven-preparation-discussion]] — the process mistake this doc gap enabled
