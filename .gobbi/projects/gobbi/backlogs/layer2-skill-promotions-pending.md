---
name: layer2-skill-promotions-pending
description: Two generalizable mistakes from session 8129f657 that should be folded into gobbi skill prose (Layer-2). Deferred because editing skill prose is Always-Ask and out of this session's scope.
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-18
session: 8129f657-4591-48b3-b83c-3aa9bc759ca6
tags: [process, codex, evaluation]
keywords: [layer-2, skill-promotion, dual-system, worktree-path, delegation, always-ask]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Layer-2 skill promotions pending

## Context

Session 8129f657 promoted two project-level mistakes that are generalizable enough to
belong in workspace-level skill prose (Layer-2 promotion). Layer-2 promotion edits
gobbi skill files, which is an Always-Ask action and was out of this Wrap-up's scope.
The user approved noting them as a tracked follow-up rather than editing skill prose
this session. This backlog is the tracking record so the promotion is not lost.

The two candidates:

1. **codex-timeout ⇒ BLOCKED, never self-authored substitute.** From
   `mistakes/codex-side-assistant-faked-eval-on-codex-timeout.md`. The one-line rule —
   "if `codex exec` produces NO output, the wrapper reports BLOCKED and never authors
   the evaluation itself; the manager-proxy write fallback applies ONLY when codex
   produced stdout it could not write" — belongs in `codex/SKILL.md § Dual-System
   Evaluation` (and the assistant-wrapper sketch).

2. **Absolute-worktree-path-in-briefs discipline.** From
   `mistakes/executor-wrote-to-main-tree-not-worktree.md`. The discipline — every
   `Write` / `Edit` path is built from the session worktree absolute root and must
   contain `/worktrees/<branch>/`; never rely on a prior `cd`; use `git -C <worktree>`
   for git ops; verify the write landed after the first edit — belongs in `delegation`
   (brief construction) and `execution` (executor write discipline). This is the same
   trap family as the prior `sendmessage-cwd-reset` / wrong-branch-write mistakes, so
   the promotion should reconcile with those rather than add a divergent rule.

## Why deferred

Editing gobbi skill prose is an Always-Ask action. This Wrap-up's scope was promotion
of session staging to memory (mistakes, backlogs, journal) plus the handoff — not
skill-prose edits. The user confirmed Layer-2 promotion should be a separate,
user-approved follow-up.

## When to pick up

Any maintenance session that touches `codex/SKILL.md` or `delegation` / `execution`
skill prose, or a dedicated Layer-2 promotion pass. Read the two source mistakes
first; reconcile the worktree-path rule with the existing `sendmessage-cwd-reset`
family rather than duplicating it.

## Suggested approach

1. Read both source mistakes in `mistakes/`.
2. For (1): add a one-line BLOCKED-on-empty-output rule to `codex/SKILL.md`'s
   dual-system / wrapper section; keep the manager-proxy fallback scoped to
   "codex produced stdout but could not write it".
3. For (2): fold the absolute-worktree-path discipline into the `delegation` brief
   template and the `execution` write-discipline section, reconciling with the
   existing cwd-reset / wrong-branch mistakes.
4. Confirm each edit with the user (Always-Ask).

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-14-8129f657-4591-48b3-b83c-3aa9bc759ca6/`
