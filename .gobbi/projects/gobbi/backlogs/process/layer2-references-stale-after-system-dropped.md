---
name: layer2-references-stale-after-system-dropped
description: wrap-up/SKILL.md, CLAUDE.md, and mistake/SKILL.md still document Layer-2 promotion despite the Layer-2 system being dropped from gobbi.
type: backlogs
scope: project
feature: null
status: closed
created: 2026-06-28
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [process]
keywords: [layer2, wrap-up-skill, mistake-skill, CLAUDE-md, stale-docs, docs-sync]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Remove Stale Layer-2 References from wrap-up/SKILL.md, CLAUDE.md, and mistake/SKILL.md

## Resolution (2026-07-06)

**CLOSED — verified resolved 2026-07-06 (session 1faa4e51); the Layer-2 purge already landed.**
The recon for the 2026-07-01 doc-consistency sweep re-checked this: `grep -niE 'layer[- ]?2'`
over `skills/wrap-up/SKILL.md`, `skills/mistake/SKILL.md`, and `.claude/CLAUDE.md` returns **0
hits**. The Layer-2 promotion system was purged from all three named docs by the memory redesign
(PR#319), so the work this backlog describes is already done — it is moot, not open.

Left in place (not moved to `archive/`): three files reference this backlog by prose path — two
are append-only `reviews/adversarial-review/2026-06-29-*.md` witnesses that record its `open`
state at review time and must not be rewritten, and one is `backlogs/evaluation/fix-d7-d1-review-findings.md`.
Flipping `status` in place keeps those historical witnesses valid.

## Context

The Layer-2 promotion system (moving generalizable project mistakes to workspace-level skill storage) was dropped from gobbi. However, three docs still describe Layer-2 as if it is active:

- `skills/wrap-up/SKILL.md` — describes Layer-2 promotion as part of the Wrap-up pipeline
- `.claude/CLAUDE.md` (the main project CLAUDE.md) — references Layer-2 in the Gobbi-specific tooling block
- `skills/mistake/SKILL.md` — describes Layer-2 as the mechanism for generalizing project mistakes to workspace level

The user confirmed Layer-2 is dropped when asked during Wrap-up routing decisions for session d45128ad-6a6c-4bb7-9925-343cd3b826c8. The wrap-up assistant was told "Layer-2 system was DROPPED from gobbi."

## Why deferred

Editing these existing skill docs is out of scope for this session (Scope Contract: author `review.md`). Surfaced as a backlog per user decision 3.

## When to pick up

Any time. No prerequisites beyond confirming the final authoritative decision (user confirmed Layer-2 dropped). This is a doc purge — remove all Layer-2 references from the three named files.

## Suggested approach

1. Read `skills/wrap-up/SKILL.md` and identify every Layer-2 reference.
2. Read `.claude/CLAUDE.md` (CLAUDE.md) and identify Layer-2 mentions.
3. Read `skills/mistake/SKILL.md` and identify Layer-2 mentions.
4. For each reference: decide whether to (a) remove entirely, or (b) replace with a brief "Layer-2 was dropped — see backlog" note.
5. Mirror updates to `.codex/` and `plugins/gobbi/` as needed.
6. Run a repo-wide grep for "Layer-2" / "layer2" / "layer 2" to catch any other occurrences.

## Originating session

`sessions/2026-06-27-d45128ad-6a6c-4bb7-9925-343cd3b826c8/` — Wrap-up routing; user decision confirmed Layer-2 dropped.
