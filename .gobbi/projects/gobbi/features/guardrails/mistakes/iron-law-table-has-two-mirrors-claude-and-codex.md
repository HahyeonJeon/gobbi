---
name: iron-law-table-has-two-mirrors-claude-and-codex
description: The Iron Law summary table is mirrored in BOTH .claude/CLAUDE.md and .codex/AGENTS.md — a change to a principle's title/tagline must co-update both, not just the Claude side.
type: mistakes
scope: feature
feature: guardrails
status: active
created: 2026-06-05
session: 9fe7bd7c-1507-4ef2-88ed-e6111e7e6d10
tags: [docs-sync, dual-system, iron-law, blast-radius]
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
---

# The Iron Law table is mirrored in .claude/CLAUDE.md AND .codex/AGENTS.md

## What happened

When redesigning Principle 1's title, the manager's blast-radius (P13 CRUD) plan named `.claude/CLAUDE.md`'s Iron Law table as the only co-update. gobbi is dual-system (Claude + Codex), and the Codex-side instruction file `.codex/AGENTS.md` carries a parallel copy of the same Iron Law summary table (same `| N | <title>: <TAGLINE>. |` row format). Updating only the Claude side left `.codex/AGENTS.md` stale and the two tables inconsistent. The executor's repo-wide grep caught it; the plan should have.

## Why it happens

"Co-update the Iron Law table" was reasoned about as a single artifact (CLAUDE.md) because that is the file the principles skill and CLAUDE.md cross-reference most visibly. The dual-system mirror (`.codex/AGENTS.md`) is less salient and was not in the manager's working model of "where the Iron Law table lives."

## Correct approach

When the blast-radius plan touches the Iron Law table (or any shared instruction content), grep BOTH `.claude/**` and `.codex/**` for the affected text before finalizing the CRUD plan. Treat `.claude/CLAUDE.md` and `.codex/AGENTS.md` as a co-update pair for Iron Law / principle-identity changes. Generalize: for dual-system gobbi, a "co-update file" is rarely just the Claude copy — check the Codex mirror too.

## How to detect

Any edit to a principle's identity (title, tagline, number, or the Iron Law list itself) — or to any content that is duplicated across the Claude and Codex instruction surfaces. The Iron Law table specifically lives in at least two places: `.claude/CLAUDE.md` and `.codex/AGENTS.md`.
