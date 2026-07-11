---
name: include-live-git-wrapper-statement
description: "Include the live wrapper-description co-touch when wrappers begin carrying models."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [docs-sync, codex]
keywords: [git-conventions, wrapper-model]
author: codex
---

# Include the live git-wrapper statement

## Context
`git/conventions.md` says wrappers do not copy the model, which becomes false when every wrapper is pinned.

## Decision
Include that wording-only co-touch as file 15 of the locked 19-file unit.

## Rationale
Current policy must remain true without changing git behavior.

## Alternatives considered
Leaving it unchanged would create a live contradiction; changing git posture would exceed scope.

## Consequences
Residual checks cover semantic equivalents of the old statement.

## Related
- [[live-surface-scope]] — the scope boundary.
