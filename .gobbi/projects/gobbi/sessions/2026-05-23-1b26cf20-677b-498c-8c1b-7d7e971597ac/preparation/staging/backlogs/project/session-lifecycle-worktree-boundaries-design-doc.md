---
title: Aggregated "session lifecycle / worktree boundaries" project-level design doc
status: deferred
project: gobbi
feature: null
task: null
anchor_session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
created: 2026-05-23
---

# Session lifecycle / worktree boundaries — aggregated design doc

## Context

Bundle B's T1 lands worktree-first session architecture as a **distributed** set of edits across `.claude/skills/`:

- `orchestration/SKILL.md` row 5.5 (Configuration-time worktree creation)
- `git/SKILL.md:33` (qualified rule: use `session.json.git.worktreePath` when set)
- `git/SKILL.md` P2 note (invocation point from row 5.5)
- `preparation/SKILL.md` (narrow-exception extension — `git -C "$worktreePath"` commit on the worktree branch for promote-now skills)
- `gobbi/SKILL.md` (Session Bootstrap Order cross-reference)
- 5 workflow phase docs under `orchestration/workflow/` (per-iter commit cadence per D-4)
- `delegation/SKILL.md` (main-tree boilerplate audit + correction)
- `session.template.json` (`git.worktreePath` + `git.branch` fields)
- Rollback semantics doc patch (T1-I-T1.j)

A future reader trying to understand "what is the canonical session lifecycle?" or "where exactly do session writes go relative to the worktree boundary?" would have to grep across all of those surfaces and assemble the picture themselves. A single aggregated design doc at `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` would be a useful long-term reference — but it's not needed in-session for Planning / Execution of T1 itself (the design staging files in `ideation/staging/design/` already carry the decisions Planning consumes).

## Why deferred

Two reasons:

1. **Not needed in-session.** Planning + Execution of T1 work directly off the Ideation `staging/design/` files + the Implementation Checklist. An aggregated project-design doc adds reader convenience but adds zero capability to T1 itself.

2. **Better authored after N=2 sessions exercise the pattern.** Writing the aggregation now risks documenting the design as conceived rather than as it actually behaves under real use. After T1 ships and at least one subsequent session has run through the worktree-first bootstrap end-to-end (Configuration → all 5 productive steps → Wrap-up squash-merge), the design doc can record what actually held up vs what needed revision — which is the durable artifact a future reader needs.

The Sub-step B gap scan (`rawdata/sub-steps-a-d-iter1.md` § B-G3, Low severity) noted this as "speculative recording; not blocking."

## When to pick up

- **After T1 ships AND N=2 sessions have exercised the worktree-first pattern end-to-end** (T1's own ship-session counts as N=1; the next feature session counts as N=2).
- OR earlier if a new contributor / external reader explicitly asks for a single-doc explanation of session lifecycle (i.e., a real motivator beyond completeness-for-its-own-sake).

## Suggested approach

When picked up, ship as a single project-level design doc:

- **Location**: `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md`
- **Template**: `.claude/skills/memorization/templates/design.md` (project-level)
- **Structure**: 
  - Problem: original framed problem (T1 root cause — main-tree drift, symlinks missing PR diff)
  - Approach: worktree-first canonical pattern with the 5-loop session-memory commit cadence
  - Surfaces: enumerate the 9 edited surfaces from T1 with one-line each
  - Validation: smoke tests + which scenarios are covered
  - Lessons-learned-after-N=2: anything that needed revision after first re-use

Effort: **medium** (post-T1 ship; estimated 1 focused session). Should be a clear single-author task — no decomposition needed.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`

Pointer: Preparation iter1 Sub-step D, gap D-6, AskUserQuestion Card 5. User chose "Recommended: Defer to backlog."
