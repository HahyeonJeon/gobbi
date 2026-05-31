---
name: install-runtime
description: One-command install and per-session runtime contract for the gobbi tool
type: features
scope: feature
feature: install-runtime
project: gobbi
status: active
created: 2026-05-26
last_updated: 2026-05-31
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
- `claude-plugin` (plugin authoring, manifest schema, hooks.json, marketplace.json, materialization, install/update CLI) — skill 19; canonical at `.gobbi/projects/gobbi/skills/claude-plugin/SKILL.md`; mirrored at `.claude/skills/claude-plugin/SKILL.md`
- Non-skill subsystems documented in `gobbi/SKILL.md` + the install dir: channel-split install (stable/dev), `.claude/`↔project mirror-sync, and the session-runtime contract (env-var persistence, SessionStart hook, `session.json` / `settings.json` lifecycle, subagent-metadata capture)

## Plugin package

The gobbi plugin package lives at `plugins/gobbi/`. It ships exactly 19 skills, 5 agents, and 2 hooks scripts plus `hooks.json`. The repo-root `.claude-plugin/marketplace.json` indexes the package at `"source": "./plugins/gobbi"`.

**Materialization.** The package is a bounded materialized copy — real files only, no symlinks escaping the plugin root (a Claude Code install-time security constraint). The canonical sources are `.gobbi/projects/gobbi/skills/`, `.gobbi/projects/gobbi/agents/*.md`, and `.claude/hooks/*.sh`. Run `bash scripts/sync-plugin-package.sh` to materialize or resync the package.

**Re-sync trigger.** Any commit touching canonical `skills/`, `agents/*.md`, or `.claude/hooks/*.sh` must re-run `bash scripts/sync-plugin-package.sh` and stage the updated `plugins/gobbi/` contents in the same commit.

**Allow-set gate.** After every resync, run `bash scripts/sync-plugin-package.sh --check` (must exit 0) to verify: the package top level contains only the four allowed entries (`.claude-plugin`, `skills`, `agents`, `hooks`); all canonical sources match the package byte-for-byte; and the package has zero symlinks. The T7 resync (shipping the `claude-plugin` skill as skill 19) was verified with exit=0.

**DD-8 dev-vs-installed hook split (Option C).** The gobbi hooks have two separate registrations: `.claude/settings.json` (dev; fires from `.claude/hooks/*.sh`) and `plugins/gobbi/hooks/hooks.json` (installed; fires from `${CLAUDE_PLUGIN_ROOT}/hooks/*.sh`). On a machine that both develops in-repo AND has the plugin installed, hooks fire twice per event (double-fire caveat). This is accepted for solo development; it does not corrupt state.

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
| 2026-05-31 | 0fd65721 | Plugin package build: plugins/gobbi/ + .claude-plugin/marketplace.json, 19 packaged skills, DD-8 dev-vs-installed hook split, claude-plugin skill (skill 19) |

## Open items

See the `backlogs/` subdirectory for the seven currently-deferred items (CI symlink pseudocode plumbing, mirror-canonical Consequences cleanup, `.gobbi/project.json` bootstrap, DRY jq helper, hook self-failure budget, `agents[]` status-field schema extension, sidecar lock refinement).

## Related

- [`design/memory-system-redesign.md`](../../design/memory-system-redesign.md) — the 7-feature table and the sprint → value-feature routing that created this feature dir
