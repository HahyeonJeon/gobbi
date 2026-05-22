---
loop: preparation
iter: 2
artifact_type: handoff
created_at: 2026-05-21
status: final
supersedes: []
related:
  - preparation/artifacts/pre-routed-gaps.md
  - preparation/artifacts/readiness-summary.md
  - ideation/artifacts/handoff.md
  - ideation/artifacts/scope-contract.md
  - ideation/artifacts/implementation-checklist.md
---

# Preparation Handoff → Planning

## What Preparation verified

The Preparation Loop closes with zero blocking gaps. All four readiness surfaces pass: Ideation output sound and internally consistent, Ideation staging complete for Planning consumption, all 16 workspace skills present and mirrored, empirical preconditions confirmed (gh 2.45.0, develop tip `487fc35`, target branches/worktrees/placeholder-target-dirs all present, CLAUDE.md surgical edit target confirmed at lines 61-62).

## Locked Idea (from Ideation)

Destructive single-PR repo reset before bottom-up rebuild: wipe all placeholder-target subdirs + session dirs + branches + worktrees + manifests + CLAUDE.md 2-line surgical excision, committed via an atomic squash PR guarded by `--match-head-commit "$HEAD_SHA"`.

## 19 locks (from Ideation scope contract)

The 19 user-confirmed decisions across 6 AskUserQuestion rounds are binding on Planning and Execution. Full list at `ideation/artifacts/scope-contract.md` § Decisions Locked. Key locks for Planning:
- Single PR, atomic squash merge, `--match-head-commit "$HEAD_SHA"` guard, NEEDS_CONTEXT on non-zero merge
- Survivor set: `agents/`, `skills/`, `rules/`, `settings.json`, `worktrees/` — NOT deleted
- Stage B before Stage C ordering
- F-CX-O4-01 `--delete-branch` wording deferred to Planning (from Ideation handoff)

## 2 pre-routed Planning constraints (new in Preparation)

These are binding on Planning's decomposition. Full detail at `preparation/artifacts/pre-routed-gaps.md`.

**F-CX-PREP-O-01 — Mistake-memory continuity (High / 75)**
Planning MUST ensure all `mistake`-skill loads happen BEFORE Stage C executes. Two options: (a) single-executor sweep — recommended — entire Stages 0–G in one task, mistakes loaded once at task start; (b) multi-task with pre-Stage-C snapshot + post-Stage-C prompt override. Planning's Sub-step D AskUserQuestion picks the option. Note: option (a) implies one very large executor task (Stages 0–G end-to-end, ~672 lines); Planning should present this trade-off explicitly.

**F-CX-PREP-O-02 — project.json deletion drift (Medium / 75)**
Stage B inventory MUST enumerate both `.claude-plugin/marketplace.json` AND `.gobbi/projects/gobbi/project.json` as already-deleted-in-worktree. No new executor action needed — `git add -A` picks them both up automatically. Purely a doc-sync correction in Planning's task description.

## Recommended Planning approach

**Single-executor sweep** (option a for F-CX-PREP-O-01). Present the (a)/(b) trade-off to the user via AskUserQuestion at Planning's Sub-step D before finalizing the task decomposition. Whichever option is chosen, F-CX-PREP-O-02's two-file inventory correction applies in the Stage B task description.

## Key artifacts for Planning

| Artifact | Purpose |
|---|---|
| `ideation/artifacts/idea.md` | Locked Idea narrative |
| `ideation/artifacts/scope-contract.md` | 19 locks, In/Out-of-scope, success criteria |
| `ideation/artifacts/implementation-checklist.md` | Stages 0–G (~672 lines of concrete commands) |
| `ideation/artifacts/design-direction.md` | D1–D11 design decisions |
| `preparation/artifacts/pre-routed-gaps.md` | Primary briefing: 2 binding Planning constraints |
| `ideation/staging/decisions/` | 32 decision files for Wrap-up promotion |
| `ideation/staging/discussions/` | 8 discussion files for Wrap-up promotion |
