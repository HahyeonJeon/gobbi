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

Worktree-isolated sessions and a branch/PR/issue lifecycle that keep the main tree clean. This is the 6th of gobbi's 7 capability value-features (memory-system redesign design §1.2).

## Overview

`git-workflow` is gobbi's source-control discipline: worktree-first session isolation plus a branch/PR/issue lifecycle and per-iteration commit cadence, so every session's changes stay branch-isolated and the main tree stays clean. The feature owns the `git` skill — the worktree-first architecture, the branch/PR/issue lifecycle, the Memory Access Matrix git rules, and the per-iteration commit cadence.

## Status

Active and live. The worktree-first Configuration step, branch-naming convention, and per-iteration session-memory commit cadence are shipped. The feature directory was created during the memory-system redesign by re-homing the durable git-workflow artifacts from the `gobbi-orchestration-workflow-improvements` (Bundle A) and `session-foundations-bundle-b` sprints into this capability feature. Several edge-case and recovery scenarios remain uncovered (see Open items).

## Subdirectories

- `decisions/` — git/worktree design decisions
- `design/` — git-workflow-scope design topics
- `discussions/` — substantive AskUserQuestion topics scoped to git-workflow
- `references/` — external prior art touching git workflow
- `plans/` — plan artifacts produced by the Planning loop
- `scenarios/` — situations the feature must handle (golden paths, edge cases, failure modes)
- `checklists/` — implementation checklists anchored to scenarios and references
- `backlogs/` — deferred git-workflow tasks
- `changelogs/` — what shipped per task

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-06-05 | 06668274 | Always-worktree model decision promoted; direct mode removed; new session-branch naming convention (claude/codex-YYYY-MM-DD-UUID) |
| 2026-05-26 | a10c82d6 | Feature dir created during the memory-system redesign; Bundle A + Bundle B git-workflow artifacts re-homed in |

## Open items

- Branch-name collision recovery when `chore/session-{date}-{ssid-short}` already exists — see `scenarios/branch-name-collision-recovery.md`.
- `$CLAUDE_CODE_SESSION_ID`-absent branch-name fallback — see `scenarios/ssid-env-var-absent-fallback.md` and `backlogs/abort-mid-commit-partial-session.md`.
- Em-dash anchor-slug format audit (4-hyphen vs 2-hyphen) — see `backlogs/anchor-slug-4-hyphen-vs-2-hyphen.md`.
- `chore` label line-citation correction in `git/conventions.md` — see `backlogs/chore-label-line-citation-stale.md`.

## Related

- Memory-system redesign design doc §1.2 (7-feature table), §1.3 (sprint → value-feature routing).
