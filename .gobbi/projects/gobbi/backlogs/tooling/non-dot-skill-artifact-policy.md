---
name: non-dot-skill-artifact-policy
description: Decide how canonical skill mirrors should handle future non-dot generated or cache artifacts.
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-21
session: 37d3c8ef-57dd-477a-b10c-dcbbc1c2327d
tags: [process, verification]
keywords: [skill-mirror, generated-artifacts, dot-pruning, sync-plugin-package]
author: codex
priority: low
project-scope: true
shipped_in: null
---

# Decide the non-dot skill artifact policy

## Context

`scripts/sync-plugin-package.sh` derives each skill's agent-exposed files from the canonical tree. It prunes dot-prefixed metadata and mirrors every other regular file so Markdown, JSON, shell commands, templates, and workflow children remain available to runtime discovery surfaces.

This is correct for the current tree. It also means a future non-dot generated or cache artifact inside a canonical skill would be mirrored unless the source policy changes. This surviving question was G1 follow-up F1; F2 was addressed by automatic stale-entry reconciliation, and F3 was invalidated when Gobbi hooks and their validator were removed.

## Why deferred

No current canonical skill contains a known unwanted non-dot artifact, so there is no active failure to fix. Choosing an extension whitelist prematurely could exclude legitimate future data or executable support files. The current session is closing a stale mixed queue, not defining a new source-exposure policy without a concrete artifact class.

## When to pick up

Pick this up before adding build output, generated files, caches, or another non-source artifact beneath a canonical skill directory, or when a sync check demonstrates that such a file reached a runtime mirror.

## Suggested approach

Inventory the actual required skill file classes first. Compare three bounded options: keep the current all-non-dot rule and document it as intentional; add explicit generated-path exclusions; or add a narrowly tested source declaration. Preserve required Markdown, JSON, shell, template, and workflow children, and extend `scripts/test-sync-plugin-package.sh` with positive and negative fixtures for the chosen rule.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-20-37d3c8ef-57dd-477a-b10c-dcbbc1c2327d/`

## Related

- [[g1-eval-low-followups]] — archived mixed queue from which this live item was split
- [[reconcile-obsolete-backlogs]] — lifecycle decision authorizing the split
