---
name: features-index
description: Index for the gobbi project features directory. Populated post-reset by the gobbi bottom-up rebuild. See git tag pre-reset-2026-05-21 for pre-reset state.
type: notes
scope: project
feature: null
status: active
created: 2026-05-21
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [features, index]
---

Placeholder — populated post-reset by the gobbi bottom-up rebuild. Reset at git tag pre-reset-2026-05-21.

## Subdirectories

The 7 capability value-features ratified by the memory-system redesign (see `design/memory-system-redesign.md` §1.2):

- `agents/` — the multi-agent roster (PI, planner, executors, evaluators, scribe) + delegation contract
- `evaluation/` — dual-system (Claude + Codex) 7-perspective review subsystem
- `git-workflow/` — worktree-isolated sessions + branch/PR/issue lifecycle
- `guardrails/` — the 13 Iron Laws + mistake-capture-and-learn loop
- `install-runtime/` — one-command install (stable/dev channels) + per-session runtime contract
- `project-memory/` — typed, named, frontmattered cross-session memory tree
- `workflow/` — the Ideation → Planning → Execution → Memorization → Handoff state machine
