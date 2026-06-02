---
name: plugin-package-copies-violated-single-source
description: Converting plugin package components to materialized copies violated the requested single source of truth model.
type: decisions
scope: project
feature: install-runtime
status: active
created: 2026-06-02
session: codex-plugin-refactor
mistake-candidate: true
domain: plugin-packaging
tags: [codex-plugin, claude-plugin, symlinks, source-of-truth]
---

# Plugin package copies violated single source

## What went wrong

I refactored the Claude Code and Codex plugin package to use materialized copies of skills, agents, and hooks under `plugins/gobbi/`.

## Why

I treated a prior Codex symlink install failure as proof that copies were required. That skipped the user's intended design constraint: `plugins/gobbi/{skills,agents,hooks}` should be symlinked to Gobbi's canonical source tree.

## How to recognize it

If a plugin package points at Gobbi-owned skills, agents, or hooks, check whether the user wants install-cache behavior optimized or source-of-truth behavior optimized before replacing symlinks with copies.

## Corrected approach

Use repo-internal relative symlinks from the shared plugin package to the canonical Gobbi sources. Verify both Claude Code and Codex install behavior for that exact symlink topology before claiming it works.
