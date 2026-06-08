---
name: layer-2-promotion-destination-undefined
description: Layer-2 mistake promotion is documented (CLAUDE.md + mistake skill) but has no concretely-defined tracked destination; the natural workspace tier is gitignored. User APPROVED Layer-2 for the worktree-write trap — execute once the destination convention is decided.
type: backlogs
scope: project
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [layer-2, mistake-promotion, design-gap, guardrails]
priority: medium
disposition: open
---

# Layer-2 promotion has no concrete tracked destination

## Context

During the 2026-06-08 session-memory M+G session, the user APPROVED Layer-2 promotion (Always-Ask) of the recurring main-tree-vs-worktree write trap (`mistakes/executor-mirror-path-vs-worktree-physical-copy.md` — bit 4 executors this session; generalizable to any worktree workflow with a symlinked canonical mirror).

CLAUDE.md + `mistake/SKILL.md` describe Layer-2 as "moving generalizable project-mistakes to workspace-level skill storage so they persist across all projects," but **no concrete tracked destination exists**:

- `.gobbi/mistakes/` (the natural workspace tier, parallel to `.gobbi/projects/`) is **gitignored** by the `.gobbi/*` rule in root `.gitignore` (only `.gobbi/.gitignore`, `.gobbi/gobbi.db`, `.gobbi/projects/` are un-ignored) → a file there would not persist in the repo.
- The only tracked realization is **encoding the lesson into a skill** under `.claude/skills/` (e.g. the `git` skill Memory Access Matrix / write-path rules, or `delegation` write-surface discipline) — but that is a gobbi-skill edit (Always-Ask) and was out of scope for the M+G PR (#297) left open for review.

## What to do (decision needed first)

Pick the Layer-2 mechanism, then execute:
1. **Encode into a skill (recommended candidate):** add the worktree-physical-copy write-surface rule to `git/SKILL.md` (§ Memory Access Matrix / write-path) and/or `delegation/SKILL.md` (executor write-surface), so every session loads it. Needs the "never edit gobbi skills without AskUserQuestion" approval.
2. **Establish a tracked workspace-mistakes tier:** un-ignore a workspace-level mistakes path (e.g. add `!.gobbi/mistakes/` to root `.gitignore`) and define it as the Layer-2 home in `mistake/SKILL.md`. Needs a convention decision (Principle 6).

Until then the mistake is durably captured at project level (`mistakes/executor-mirror-path-vs-worktree-physical-copy.md`, Layer-2-flagged).

## Why surfaced, not silently done

Inventing a destination silently would either (a) write to a gitignored path (no persistence) or (b) edit a gobbi skill without the required AskUserQuestion. Both are violations; the honest path is to surface the gap (this design hole in the Layer-2 model is itself worth fixing).
