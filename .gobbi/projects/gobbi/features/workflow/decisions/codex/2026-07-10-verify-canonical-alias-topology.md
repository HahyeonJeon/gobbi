---
name: verify-canonical-alias-topology
description: "Prove that canonical agent and skill edits propagate through every runtime alias."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [codex, verification]
keywords: [symlink, realpath, plugin-smoke]
author: codex
---

# Verify canonical alias topology

## Context
Editing only canonical sources is safe only when repo-local and plugin aliases still resolve to them.

## Decision
Treat `realpath`, dereferenced inode, tracked symlink mode, sync, and plugin smoke checks as Execution gates.

## Rationale
Observed directory presence alone does not prove propagation.

## Alternatives considered
Editing aliases separately was rejected because they are symlink-owned verification surfaces.

## Consequences
Any topology failure stops the release without materializing the source package.

## Related
- [[plugin-delivery-and-alias-topology]] — the packaging design.
