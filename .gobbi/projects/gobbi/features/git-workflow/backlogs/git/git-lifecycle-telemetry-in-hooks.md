---
name: git-lifecycle-telemetry-in-hooks
description: Evaluate adding git-lifecycle telemetry (branch/PR/merge events) to session-end/post-tool-use hooks; deferred at Planning per user decision
type: backlogs
scope: feature
feature: git-workflow
status: deferred
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [git, hooks]
keywords: [telemetry, deferred, dd-6]
author: claude
priority: low
project-scope: false
shipped_in: null
---

# Evaluate git-lifecycle telemetry in session-end/post-tool-use hooks

## Context
DD-6 kept the two hooks (`hooks/session-end.sh`, `hooks/post-tool-use-agents.sh`) in scope as an
additive git-lifecycle-telemetry opportunity. At Planning, the concrete shape was evaluated and DEFERRED
by user decision (2026-06-14).

## Why deferred
- The hooks are TODAY pure token reconcilers (INT-4); `session-end.sh:49-51` deliberately bails on native Codex.
- Git-lifecycle metadata (`git.branch`/`worktreePath`/`pr`/`issue`) is already manager-written into `session.json`.
- A hook edit would duplicate that metadata on a Codex-blind surface and need its own dual-system eval — scope past this session's verifiable success criteria for no functional gain.

## If picked up later
- Least-bad option: add a minimal git-lifecycle event to `session-end.sh` (final branch/PR/merged), accepting the native-Codex blind spot, OR design a runtime-neutral capture path.
- Must come with a field-list spec + its own verification + a new checklist item, under user confirmation.
