---
name: plugins-snapshot-resync-after-principles-changes
description: The plugins/gobbi/ snapshot has drifted from canonical skills and needs a full re-sync.
type: backlogs
scope: project
feature: install-runtime
status: active
created: 2026-06-01
session: a30b7a6e-164f-49ac-a857-ee225e831a7c
disposition: open
tags: [plugins, drift, principles, sync]
---

# Re-sync the `plugins/gobbi/` snapshot after the principles changes

## Problem

`plugins/gobbi/skills/` holds **real-file copies** (not symlinks) of the canonical
skills, materialized once for the #274 plugin bundle. These copies have since drifted
from the canonical `.gobbi/projects/gobbi/skills/` tree and no longer reflect recent
principles work:

- `plugins/gobbi/skills/principles/SKILL.md` still carries the **old 13-principle**
  state — it predates Principle 14, the P6/P10/P11 plain-language rewrites, the
  name+Iron-Law title merge, and the new three-MUST `description` (PR for which this
  backlog was filed). `diff` against canonical confirms the two files differ.
- Other skills under `plugins/gobbi/skills/` are likely similarly stale (the #274
  snapshot was a point-in-time materialization).

Because the copies are physical files, canonical edits do **not** propagate to them.

## Why deferred

Patching only the `description` (or any single field) in the plugins copy would produce
a **partial, misleading sync** — the file would still be wrong in every other respect
(principle count, titles, body). The correct fix is a full re-materialization of the
plugins snapshot from canonical, which is a separate concern from any one principles edit.

## Proposed fix

Re-run the plugin package materialization (see `claude-plugin` skill +
`sync-plugin-package.sh`) so `plugins/gobbi/skills/` is regenerated from the current
canonical skill tree, then verify `diff -r` between canonical and the snapshot is empty
for every mirrored skill. Confirm `.codex-plugin/plugin.json` and
`plugins/gobbi/.claude-plugin/plugin.json` still validate.

## Acceptance

- `diff .gobbi/projects/gobbi/skills/principles/SKILL.md plugins/gobbi/skills/principles/SKILL.md` is empty.
- A spot check of 2-3 other mirrored skills shows no canonical↔snapshot drift.
- Both plugin manifests validate.
