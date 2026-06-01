---
name: install-runtime
description: One-command install and per-session runtime contract for the gobbi tool
type: features
scope: feature
feature: install-runtime
project: gobbi
status: active
created: 2026-05-26
last_updated: 2026-06-01
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

The gobbi plugin package lives at `.claude-plugin/gobbi/`. It ships exactly 19 skills, 5 agents, and 2 hook scripts plus `hooks.json`. The marketplace catalog at `.claude-plugin/marketplace.json` indexes the package at `"source": "./.claude-plugin/gobbi"`. A single top-level `.claude-plugin/` directory holds both the marketplace catalog and the package directory, keeping all plugin artifacts under one top-level dir.

**Symlink layout (no materialization).** The package uses within-marketplace symlinks instead of materialized real copies. `.claude-plugin/gobbi/skills/` and `.claude-plugin/gobbi/agents/` are symlinks to the canonical sources (`.gobbi/projects/gobbi/skills/` and `.gobbi/projects/gobbi/agents/`). The hook scripts (`session-start.sh`, `post-tool-use-agents.sh`) are symlinks to `.claude/hooks/`. `hooks/hooks.json` is a real file. For GitHub-hosted installs, the CLI treats the entire repo as the effective marketplace boundary — Claude Code dereferences all within-repo symlinks on install and copies the real content. The installed plugin receives the full 1.4 MB cache (19 skills, 5 agents, 3 hooks). Verified on CLI v2.1.159: GitHub-hosted install → Status: enabled, no session-memory leak.

**No sync script and no drift surface.** The former `scripts/sync-plugin-package.sh` materialization script has been removed. Symlinks always reflect the current canonical content; no resync step is required.

**DD-8 dev-vs-installed hook split (Option C).** The gobbi hooks have two separate registrations: `.claude/settings.json` (dev; fires from `.claude/hooks/*.sh`) and `.claude-plugin/gobbi/hooks/hooks.json` (installed; fires from `${CLAUDE_PLUGIN_ROOT}/hooks/*.sh`). On a machine that both develops in-repo AND has the plugin installed, hooks fire twice per event (double-fire caveat). This is accepted for solo development; it does not corrupt state.

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
| 2026-06-01 | chore/plugin-symlink-layout | Symlink layout migration: plugins/gobbi/skills + agents converted from materialized real copies to within-marketplace symlinks; sync-plugin-package.sh removed; manifest load-fix (#282) made plugin.json metadata-only |
| 2026-06-01 | chore/plugin-into-claude-plugin | Package moved from plugins/gobbi/ to .claude-plugin/gobbi/ (single top-level .claude-plugin/ dir holds marketplace.json + package); marketplace source updated to "./.claude-plugin/gobbi"; verified on CLI v2.1.159 (GitHub-hosted install: enabled, 19 skills / 5 agents / 3 hooks, 1.4 MB cache) |

## Open items

See the `backlogs/` subdirectory for the seven currently-deferred items (CI symlink pseudocode plumbing, mirror-canonical Consequences cleanup, `.gobbi/project.json` bootstrap, DRY jq helper, hook self-failure budget, `agents[]` status-field schema extension, sidecar lock refinement).

## Related

- [`design/memory-system-redesign.md`](../../design/memory-system-redesign.md) — the 7-feature table and the sprint → value-feature routing that created this feature dir
