---
name: install-runtime
description: One-command install and per-session runtime contract for the gobbi tool
type: features
scope: feature
feature: install-runtime
project: gobbi
status: active
created: 2026-05-26
last_updated: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [install, runtime, hooks, env-vars, session-config]
value_proposition: "One-command install (stable/dev channel) + project bootstrap interview + the per-session runtime contract (env-vars, hooks, session config)."
subsystems: [interview, gobbi-hook-authoring, channel-split-install, mirror-sync, session-runtime-contract]
---

# Feature: Install Runtime

One-command install (stable/dev channel) + project bootstrap interview + the per-session runtime contract (env-vars, hooks, session config). This is value-feature #7 of the 7 capability features (see memory-system redesign design doc, 7-feature table).

## Overview

`install-runtime` covers gobbi's two technical halves outside the work loops: getting gobbi onto a machine (channel-split install + `.claude/`↔project mirror-sync + project-bootstrap interview) and the per-session runtime contract (env-var persistence, SessionStart hook, `session.json` / `settings.json` lifecycle, subagent-metadata capture).

## Status

Active. The design work (decisions, scenarios, checklists, references) is captured under this feature dir; the per-session runtime contract (env-var persistence, SessionStart hook, `session.json` / `settings.json` lifecycle, subagent-metadata capture) and the channel-split install are documented and partly shipped. Seven items remain deferred under `backlogs/` (see Open items below) — hardening and schema refinements rather than blocking gaps.

## Subsystems

- `interview` (project-bootstrap discovery) — the only skill dir it owns
- `gobbi-hook-authoring` (authoring SessionStart/PostToolUse hooks; canonical-only, no `.claude/skills/` symlink)
- Non-skill subsystems documented in `gobbi/SKILL.md` + the install dir: channel-split install (stable/dev), `.claude/`↔project mirror-sync, and the session-runtime contract (env-var persistence, SessionStart hook, `session.json` / `settings.json` lifecycle, subagent-metadata capture)

## Subdirectories

- `decisions/` — install / runtime design decisions (6 files)
- `design/` — install-runtime-scope design topics (6 files)
- `discussions/` — substantive AskUserQuestion topics scoped to install-runtime (8 files)
- `references/` — external prior art touching install / runtime (3 files)
- `scenarios/` — situations the install/runtime contract must handle (2 files)
- `checklists/` — implementation checklists anchored to scenarios and references (7 files)
- `backlogs/` — deferred install / runtime tasks (7 files)
- `changelogs/` — what shipped per task (4 files)
- `archive/` — superseded install-runtime artifacts (move-on-terminal, 1 file)

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-05-26 | a10c82d6 | Feature dir created during memory-redesign W3-T0 |

## Open items

See the `backlogs/` subdirectory for the seven currently-deferred items (CI symlink pseudocode plumbing, mirror-canonical Consequences cleanup, `.gobbi/project.json` bootstrap, DRY jq helper, hook self-failure budget, `agents[]` status-field schema extension, sidecar lock refinement).

## Related

- [`design/memory-system-redesign.md`](../../design/memory-system-redesign.md) — the 7-feature table and the sprint → value-feature routing that created this feature dir
