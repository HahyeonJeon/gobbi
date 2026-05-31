---
name: fresh-gobbi-plugin-not-resurrection
description: User decided to build a perfectly fresh v0.5.0 plugin named gobbi, mining prior history for lessons only
type: discussions
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, plugin-package, prior-art, approach]
outcome: Build fresh plugin named gobbi on v0.5 structure; mine wiped gobbi-core history for proven solutions only
---

# Fresh gobbi Plugin — Not a Resurrection of gobbi-core

## Context

The iter-1 evaluation (Codex P1, High/100) revealed that a full Claude Code plugin + marketplace (`plugins/gobbi-core`, commit 62b95a0, PR #6) existed through v0.4.5 and was deliberately wiped in the v0.5 reset (`e083fad`, PR #264). The iter-1 draft had incorrectly claimed "no prior attempt on record."

After the manager verified P1 against git history (62b95a0 confirmed), the user needed to decide: (a) revive/adapt the prior `gobbi-core` package, or (b) build fresh on the current v0.5 structure.

## Question

Should we revive the wiped `gobbi-core` package (borrowing its files and adapting them to v0.5), or build a perfectly fresh plugin using the prior package only as a reference for proven solutions?

## Options considered

- **Revive gobbi-core:** Lower effort; files exist in git history; known to work (with the #251 and #256 fixes applied). Risk: the v0.4.x structure may not match the current v0.5 canonical tree layout; could import stale patterns.
- **Build fresh:** Higher effort; no risk of importing stale v0.4.x patterns; plugin is correctly shaped for the current v0.5 structure from the start. Use the wiped history only as a reference for proven solutions (bounded subtree, materialize real files, 5-md-array agents, hooks.json file, matcher-not-too-narrow).

## User decision

Build a **perfectly fresh v0.5.0 plugin named `gobbi`** — not a resurrection of `gobbi-core`. Mine the wiped `gobbi-core` history for proven solutions (the 5 lessons: bounded subtree, real-file materialization, agents as file-path array, hooks.json file not dir, matcher breadth), but build fresh on the current v0.5 structure. Plugin name = `gobbi` (not `gobbi-core`).

## Implication

The prior `plugins/gobbi-core` package is reference material only. The new package is built fresh: every file written from scratch using the current canonical `.gobbi/projects/gobbi/skills/`, `.gobbi/projects/gobbi/agents/`, and `.claude/hooks/` sources. The wiped history provides the proven shape; the current canonical tree provides the content.

This also means "it already exists" is false — a genuine fresh build is needed. The steel-man argument (do-nothing / mirror is fine) is further weakened.
