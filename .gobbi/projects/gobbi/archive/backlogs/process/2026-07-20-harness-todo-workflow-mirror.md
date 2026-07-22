---
name: harness-todo-workflow-mirror
description: Harness todo list mirroring the 6 workflow steps — a read-only projection of state.json beside the Workflow Status Display.
type: backlogs
scope: feature
feature: workflow
status: closed
created: 2026-07-06
session: fe6cbcd3-5e63-46fb-a62e-93308b687d1f
tags: [process]
keywords: [harness-todo, todo-list, workflow-status-display, state-json, projection, planning]
author: claude
priority: medium
project-scope: false
shipped_in: null
archived_at: 2026-07-20
archive_reason: addressed
---

# Harness todo list mirroring the workflow steps

## Context
gobbi tracks workflow position two ways today: the authoritative `state.json` state
machine and the manager-rendered 6-row **Workflow Status Display** table
(`orchestration/SKILL.md` § Workflow Status Display). Neither is the harness-native,
always-visible todo widget (Claude Code `TaskCreate`/`TaskUpdate`; Codex plan updates).
During the 2026-07-06 3-fix session the user asked why no harness todo list was shown and
stated they want that lightweight always-on progress view **in addition to** — not
instead of — `state.json` + the Status Display. gobbi skills did not previously prescribe a
harness todo list mirroring the workflow; the "consider TaskCreate" prompts are
harness-injected, not gobbi guidance. This gap was already flagged as review D3-002
(2026-06-29) and backlogged in `backlogs/evaluation/fix-d3-d5-review-findings.md` and
`backlogs/process/fix-confirmed-seed-findings.md`; this item is the workflow-feature
home for the same remedy.

## Why deferred
The first cut of this guidance **shipped this session** — Unit A (commit 2e6e63fc) added
the manager-owned harness todo-list documentation to `orchestration/SKILL.md` and
`agents/manager.md`. This backlog stays **open** for the follow-on the doc did not fully
settle: the remaining design questions in "When to pick up" (granularity, authoritative
surface, Chat-mode collapse) and any mechanical enforcement. The separate mechanical
render-time gate for the native-Codex producer-label case is tracked apart in
`backlogs/codex/native-codex-proposer-symmetry.md` (Claude eval finding RI-1), not here.

## When to pick up
- No prerequisites — the follow-on guidance can be written any time.
- Depends on the user locking: (1) granularity (6-step spine vs +sub-phases vs +per-task
  Execution items); (2) which surface is authoritative and who updates the todo list when;
  (3) render-in-both-modes + coexistence with the Status Display table; (4) Chat-mode
  collapse of prior tasks; (5) this backlog's priority (medium matching D3-002 vs high).

## Suggested approach
Extend the "Harness todo list" subsection now in `orchestration/SKILL.md` next to the
Workflow Status Display: `state.json` is the single source of truth; the todo list is a
one-way read-only projection (never writes back; the manager writes `state.json` first and
projects the todo list second; rebuilt from `state.json` on resume), seeded at
Configuration, updated at each state transition, rendered in BOTH modes as the always-on
complement to the periodic Status Display table. Update `agents/manager.md` (the list is
manager-owned; subagents never manage it) and reconcile with the existing manager.md
task-tracker line so the workflow-step spine is the canonical structure of the harness
list, not a second parallel list. Edit the CANONICAL doc in the worktree once; the mirror
trees (`.claude`, `.agents/skills/delegation`, `plugins/gobbi/skills`) are symlinks to
canonical and inherit the edit — verify symlink-aware (`rg --follow` / `readlink -f`), do
not treat them as separate physical copies.

## Originating session
`.gobbi/projects/gobbi/sessions/2026-07-06-fe6cbcd3-5e63-46fb-a62e-93308b687d1f/`

## Related

- [[workflow-status-display]] — the existing read-only projection this complements
