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
keywords: [plugin, symlink, version, 0.5.2]
author: codex
related: [deterministic-codex-policy-authorities]
---

# Plugin delivery and alias topology

## Problem
Gobbi exposes canonical skills and agents through several symlinked runtime and plugin paths, while three release fields must stay synchronized.

## Scope
Edit canonical sources and three version fields only. Do not materialize plugin component directories.

## Approach
Let aliases propagate canonical edits. Bump both plugin manifests and the Claude marketplace from `0.5.1` to `0.5.2`.

## Scenarios
Native alias resolution, installed plugin smoke, expected cache omissions for symlinked components, and version mismatch.

## Validation
Use `realpath`, dereferenced inode, tracked mode, package sync, plugin smoke, strict Claude validation, and publish readiness.

## Trade-offs
Installed-cache omissions remain a platform limitation and are not worked around in source.

## Open issues
None at Ideation; Execution must supply fresh topology evidence.

## Related
- [[live-surface-scope]] — the explicit skill, agent, and plugin scope.
