---
name: hook-registry-both-surfaces-required
description: Registering a new hook requires co-changes to both .claude/settings.json (live) and plugin hooks.json (bundled) — not just one
type: checklists
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [hooks, docs-sync, registration, checklist]
---

# Hook registration: both registries required

## Scenario

Adding or modifying a hook event registration (e.g., adding SessionEnd/Stop for D5's manager rollup).

## Checklist

- [ ] `.claude/settings.json § hooks` — the LIVE registry Claude Code reads in the development workspace. Verify the event is registered here with the correct command path.
- [ ] `.gobbi/projects/gobbi/hooks/hooks.json` — the PLUGIN/bundled registry for installed gobbi instances. Verify the event is registered here with the correct command path.
- [ ] Confirm there is NO `.claude/hooks/hooks.json` file (it does not exist; `.claude/hooks/` contains only symlinked scripts, not a registration file).
- [ ] If a build step syncs the two registries: verify the build step runs and produces consistent output.
- [ ] After registering: manually verify the hook fires in the live workspace (run a test session and confirm the hook script executes).

## Why this matters

The two registries serve different consumers. `.claude/settings.json` is what Claude Code reads during development; the plugin `hooks.json` is what an installed gobbi instance reads. Updating only the plugin file leaves the live development workspace running without the hook — a silent failure that is exactly the class of bug this redesign exists to kill (the metadata recording convention that is silently skipped under load).

Discoverable during D5 evaluation: both Claude (F-S2) and Codex (USAGE-001) independently flagged D5's initial inventory for naming only `hooks/hooks.json`, missing `.claude/settings.json`.

## Related

- Design § D5, research insight I7
- `features/install-runtime/checklists/hook-latency-bounds.md`
