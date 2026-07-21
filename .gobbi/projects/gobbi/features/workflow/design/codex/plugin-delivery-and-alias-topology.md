---
name: plugin-delivery-and-alias-topology
description: "Keeps canonical Gobbi sources, runtime aliases, plugin symlinks, and release versions synchronized."
type: design
scope: feature
feature: workflow
status: active
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [codex, verification]
keywords: [plugin, symlink, version, 0.5.3]
author: codex
related: [deterministic-codex-policy-authorities]
---
# Plugin delivery and alias topology

## Problem

Gobbi needs one canonical skill source while Claude Code and Codex discover the package through different manifests and repo-local entry points.

## Scope

The shared plugin distributes skills only. Native custom-agent wrappers remain repo-local. Gobbi has no plugin or development hooks, and the protected role documents are not rewritten by this lifecycle change.

## Approach

Keep canonical skills under `.gobbi/projects/gobbi/skills/` and expose them through the repository discovery and plugin skill symlinks. Keep Codex role wrappers under `.codex/agents/`, pointing to canonical role definitions in the repository rather than installing agents as plugin components.

Both plugin manifests declare the supported skills component and no hooks component. Marketplace entries point to the same bounded package. The plugin version remains unchanged for this redesign.

## Validation

`scripts/sync-plugin-package.sh --check` verifies canonical source topology, both manifests, both marketplaces, skill entry points, symlinks, and repo-local agent-wrapper presence. The isolated Codex smoke check verifies installed-cache behavior without hooks.

## Trade-offs

One skills-only package keeps delivery explicit and avoids runtime-specific hook behavior. Native agent wrappers remain a repository capability rather than a portable plugin component.

## Open issues

Installed-cache handling of symlinked component directories remains runtime-owned and is reported by smoke evidence.
