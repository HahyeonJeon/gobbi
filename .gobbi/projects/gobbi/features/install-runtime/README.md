---
name: install-runtime
description: One-command install and per-session runtime contract for the gobbi tool
type: features
scope: feature
feature: install-runtime
status: active
created: 2026-05-26
session: a10c82d6-03f7-4dce-a040-c7443653a459
tags: [install, runtime, hooks, env-vars, session-config]
value_proposition: "One-command install (stable/dev channel) + project bootstrap interview + the per-session runtime contract (env-vars, hooks, session config)."
subsystems: [interview, gobbi-hook-authoring, channel-split-install, mirror-sync, session-runtime-contract]
---

# Feature: Install Runtime

One-command install (stable/dev channel) + project bootstrap interview + the per-session runtime contract (env-vars, hooks, session config). This is value-feature #7 of the 7 capability features (see memory-system redesign design doc, 7-feature table).

## Overview

`install-runtime` covers gobbi's two technical halves outside the work loops: getting gobbi onto a machine (channel-split install + `.claude/`↔project mirror-sync + project-bootstrap interview) and the per-session runtime contract (env-var persistence, SessionStart hook, `session.json` / `settings.json` lifecycle, subagent-metadata capture).

## Subsystems

- `interview` (project-bootstrap discovery) — the only skill dir it owns
- `gobbi-hook-authoring` (authoring SessionStart/PostToolUse hooks; canonical-only, no `.claude/skills/` symlink)
- Non-skill subsystems documented in `gobbi/SKILL.md` + the install dir: channel-split install (stable/dev), `.claude/`↔project mirror-sync, and the session-runtime contract (env-var persistence, SessionStart hook, `session.json` / `settings.json` lifecycle, subagent-metadata capture)

## Subdirectories

- `decisions/` — install / runtime design decisions
- `design/` — install-runtime-scope design topics
- `discussions/` — substantive AskUserQuestion topics scoped to install-runtime
- `references/` — external prior art touching install / runtime
- `plans/` — plan artifacts produced by the Planning loop
- `changelogs/` — what shipped per task
- `archive/` — superseded install-runtime artifacts (move-on-terminal)

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-05-26 | a10c82d6 | Feature dir created during memory-redesign W3-T0 |

## Related

- Memory-system redesign design doc (7-feature table; sprint → value-feature routing)
