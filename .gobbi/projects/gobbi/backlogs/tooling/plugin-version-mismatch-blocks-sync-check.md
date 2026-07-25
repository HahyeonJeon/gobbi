---
name: plugin-version-mismatch-blocks-sync-check
description: Pre-existing marketplace 0.5.4 vs plugin/codex-plugin 0.5.3 version mismatch makes sync-plugin-package.sh --check exit 1 on the version-equality line
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-25
session: 69314d61-5a03-4ad7-9672-64031832463a
tags: [process, validation]
keywords: [plugin-version, sync-plugin-package, marketplace, version-equality, source-topology]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Align the mismatched plugin versions

## Context

The three version-bearing files disagree:

- `.claude-plugin/marketplace.json` = `0.5.4`
- `plugins/gobbi/.claude-plugin/plugin.json` = `0.5.3`
- `plugins/gobbi/.codex-plugin/plugin.json` = `0.5.3`

`scripts/sync-plugin-package.sh --check` fails the source-topology version-equality check
("Codex manifest, Claude manifest, and Claude marketplace versions must be non-empty and equal /
1 source-topology check(s) failed") and exits 1. This is pre-existing and rename-independent — it
also fails identically on `origin/develop`.

## Why deferred

Aligning the versions is a separate change from the rename plus redesign. A version bump is out of
scope per the Git conventions release-metadata rule: a version changes only when a locked
implementation task explicitly includes that file and value. The rename session accepts the mismatch
as a documented sync baseline and proves mirror correctness directly via `find` and `readlink`
instead of relying on a clean `sync --check` exit code.

## When to pick up

Before the next Gobbi plugin release, or whenever a clean `sync-plugin-package.sh --check` exit is
required (for example a CI gate on that exit code). Coordinate the target version with the cadence
decision.

## Suggested approach

Decide the single target version with the user, then align all three version-bearing files in one
dedicated release/chore change and re-run `sync-plugin-package.sh --check` to confirm a clean exit.
Resolve the cadence question first (see the related cadence backlog) so the chosen version matches
the agreed release policy.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-24-69314d61-5a03-4ad7-9672-64031832463a/`

## Related

- [[plugin-version-cadence-policy]] — the open decision on when a meaningful package change requires a version bump
- [[sync-regenerate-blocked-by-topology-gate-and-agents-prune-gap]] — this version mismatch is what makes the topology gate abort a rename regenerate
