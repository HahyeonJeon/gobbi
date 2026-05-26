---
name: git-workflow
description: Worktree-isolated sessions and a branch/PR/issue lifecycle that keep the main tree clean.
type: features
scope: feature
feature: git-workflow
status: active
created: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [worktree, branch-lifecycle, pr-lifecycle, session-isolation]
value_proposition: "Worktree-isolated sessions and a branch/PR/issue lifecycle that keep the main tree clean."
---

# Feature: Git Workflow

Worktree-isolated sessions and a branch/PR/issue lifecycle that keep the main tree clean. This is value-feature #6 of the 7 capability features (design §1.2, RATIFY-1 / L1).

## Overview

`git-workflow` is gobbi's source-control discipline: worktree-first session isolation plus a branch/PR/issue lifecycle and per-iter commit cadence, so every session's changes stay branch-isolated and the main tree stays clean.

## Subsystems

- `git` (worktree-first architecture, branch/PR/issue lifecycle, the Memory Access Matrix git rules, per-iter commit cadence)

## Subdirectories

- `decisions/` — git/worktree design decisions
- `design/` — git-workflow-scope design topics
- `discussions/` — substantive AskUserQuestion topics scoped to git-workflow
- `references/` — external prior art touching git workflow
- `plans/` — plan artifacts produced by the Planning loop
- `changelogs/` — what shipped per task
- `archive/` — superseded git-workflow artifacts (move-on-terminal)

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-05-26 | a10c82d6 | Feature dir created during memory-redesign W3-T0 |

## Related

- Memory-system redesign design doc §1.2 (7-feature table), §1.3 (sprint → value-feature routing)
