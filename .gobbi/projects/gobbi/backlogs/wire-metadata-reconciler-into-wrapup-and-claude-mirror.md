---
name: wire-metadata-reconciler-into-wrapup-and-claude-mirror
description: Three deferred follow-ups from task 07 — wire the reconciler into Wrap-up, decide on .claude mirror for scripts/, and harden manager-by-type matching.
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-06
session: 06668274-cee3-4bc0-9125-91a327467cd2
tags: [orchestration, session-metadata, shell-scripts, wrap-up, telemetry]
priority: medium
shipped_in: null
---

# Wire metadata reconciler into Wrap-up and resolve .claude mirror gap

## Context

Task 07 shipped `skills/orchestration/scripts/reconcile-session-metadata.sh` and documented it in `orchestration/SKILL.md § Recording workflow metadata`. The capability now exists to populate per-agent token telemetry in `session.json`, but three wiring gaps remain before the workflow uses it end-to-end.

## Why deferred

All three items are non-blocking for the current task slice. The reconciler works today and the manager can call it manually. The follow-ups improve discoverability, automation, and correctness — they are polish, not correctness fixes.

## When to pick up

No hard prerequisites. The `.claude` mirror decision can be taken any time. The Wrap-up wiring should be taken before the hook bug (`post-tool-use-hook-cannot-resolve-worktree-session-json.md`) is fixed, because the manual reconciler call is the interim path. The type-match hardening is low-urgency and can be batched with any future orchestration pass.

## Suggested approach

**Item 1 — `.claude` mirror for `scripts/`.** `skills/orchestration/scripts/` is canonical only. The `.claude/skills/orchestration/` symlink is a file-level symlink that does NOT auto-follow new subdirectories. Two options: (a) accept the canonical-path invocation (the manager already uses the canonical path in the skill doc, so this works today); (b) add a per-file or directory symlink at `.claude/skills/orchestration/scripts/` for discoverability and consistency with the mirroring pattern. Evaluate whether the manager can reliably resolve canonical paths from a worktree context before choosing.

**Item 2 — Wrap-up procedure wiring.** The `wrap-up/SKILL.md` procedure should include a step that calls `reconcile-session-metadata.sh <session.json> <main-transcript>` before the handoff artifact is written. This ensures per-agent telemetry is populated for the session. Connect this item to `post-tool-use-hook-cannot-resolve-worktree-session-json.md` (the hook that would auto-record at tool-use time is blocked by a path-resolution bug; the manual reconciler call at Wrap-up is the documented interim path). Without this wiring, `session.json` `agents[]` will hold only the lone manager seed for every session, defeating the recording capability.

**Item 3 — Manager-by-type hardening in the reconciler.** `reconcile-session-metadata.sh` currently refreshes `agents[0]` as the manager (index assumption). If the `agents[]` array grows non-manager entries before the reconciler runs, the index assumption breaks. Fix: match by `type=="manager"` using `jq '.agents[] | select(.type=="manager")'` instead of `.agents[0]`. Low urgency since the seed entry is always index 0 today, but the fix is a one-line jq change.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-05-06668274-cee3-4bc0-9125-91a327467cd2/`
