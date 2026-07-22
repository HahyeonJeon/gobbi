---
name: claude-skills-mirror-policy
description: Decide whether and how to keep .claude/skills/ in sync with the canonical skills tree; .claude/skills/ is currently real-dir only and unmanaged by any sync script.
type: backlogs
scope: project
feature: null
status: closed
archived_at: 2026-07-21
archive_reason: addressed
created: 2026-06-27
session: b5601d38-c988-4f53-b34b-9ace12a55c25
tags: [process]
keywords: [claude-skills, mirror, sync, tooling, policy, coding-skill]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Decide the `.claude/skills/` mirror policy (OPEN-4)

## Context

The gobbi project has three skill surfaces:

1. **Canonical** — `.gobbi/projects/gobbi/skills/` — 23 directories (as of 2026-06-27). The source of truth.
2. **`.agents/skills/`** — 22 symlinks, managed by `scripts/sync-plugin-package.sh`. The script's `ensure_link` + `check_link` loop keeps this in sync with the canonical tree; `--check` mode asserts one symlink per canonical skill.
3. **`.claude/skills/`** — 21 REAL directories (0 symlinks), separately maintained, NOT touched by `sync-plugin-package.sh`. Currently missing `coding` only (after R1 shipped in session b5601d38, the `gobbi-hook-authoring` gap is moot).

The `coding` skill was added 2026-06-24 with its `.agents` mirror gap fixed in session b5601d38 (R3). The `.claude/skills/coding` gap was explicitly scoped OUT of that session (OPEN-4) because the mechanism is a policy decision, not a one-liner.

## Why deferred

Out of scope for session b5601d38. R3 was authorized as the minimal one-symlink fix to unblock R1's `sync --check` gate. Expanding R3 to cover `.claude/skills/coding` would require deciding the mechanism (real-dir copy vs symlink vs a sync script), which is a non-trivial policy decision the user deferred.

## When to pick up

Prerequisites: R1 + R3 have shipped (session b5601d38, merged). After merge, `.claude/skills/` is missing `coding` and the gap is undocumented. Pick up any time after session b5601d38 merges; no other prerequisites.

## Suggested approach

Three options to evaluate with the user:

1. **Real-dir copy** (current pattern — `.claude/skills/` uses real dirs). A `cp -r` or manual copy of the canonical skill dir into `.claude/skills/`. Drawback: requires re-copying on every skill update; no automated sync.
2. **Symlink** (breaks the established real-dir pattern). Would make `.claude/skills/coding` a symlink like `.agents/skills/coding`. Advantage: follows updates automatically. Drawback: inconsistent with the other 21 real dirs in `.claude/skills/`.
3. **A dedicated sync mechanism** (extend or replace the current ad-hoc manual process). Extend `sync-plugin-package.sh` to also manage `.claude/skills/`, or write a separate script. This is the most principled approach and closes the broader "separately maintained" problem.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-27-b5601d38-c988-4f53-b34b-9ace12a55c25/`

## Related

- [[claude-skills-mirror-gap]] — the now-closed predecessor backlog tracking the original asymmetry
