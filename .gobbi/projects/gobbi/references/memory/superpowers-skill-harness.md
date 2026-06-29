---
name: superpowers-skill-harness
description: superpowers builds live todo lists from skill checklists and auto-triggers skills via a bootstrap dispatcher
type: references
scope: project
feature: null
status: active
created: 2026-06-29
session: 40b9a93e-5ec4-43d7-bd16-075b0c7fa303
tags: [process, design]
keywords: [superpowers, skills, todo-list, progress-visibility, multi-host, harness]
author: claude
title: Superpowers — Claude Code skills framework
source: https://github.com/obra/superpowers
accessed: 2026-06-29
ref_type: code
---

# Superpowers — Claude Code skills framework

## Insight
Superpowers runs a skill-search script on every user message and a "getting-started" bootstrap dispatcher that enforces skill use, and it **builds live todo lists from skill checklists** so progress is visible to the user. Its workflow is the skills in order: brainstorm → plan → git worktree → subagent implementation with TDD → fresh-agent code review → finish/PR.

## Reason
Two of gobbi's review dimensions map directly onto superpowers: (1) the live-todo-list seed finding has concrete prior art here — superpowers surfaces todo lists from checklists, which gobbi never does; (2) its brainstorm→plan→implement→review→finish flow is the closest peer to gobbi's 6-step machine, so it is the primary baseline for dimension-3 (missing features vs harnesses) and dimension-2 (between-skill workflow coverage).

## Source
- https://github.com/obra/superpowers
- https://blog.fsck.com/2025/10/09/superpowers/ (author Jesse Vincent, 2025-10-09)

## Excerpt
"The bootstrap ... runs skill checks on literally every user message, creates todo lists from skill checklists, and establishes clear priority rules when multiple skills apply." Memory: a "remembering-conversations" skill indexes transcripts in SQLite with vector embeddings — but the author notes the pieces "just haven't had time to wire them together."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-29 | 40b9a93e-5ec4-43d7-bd16-075b0c7fa303 | Charter dimension-3 baseline + Seed-A (live todo) prior art |

## Related

- [[agent-os-layered-standards]] — the other spec-driven harness baseline
