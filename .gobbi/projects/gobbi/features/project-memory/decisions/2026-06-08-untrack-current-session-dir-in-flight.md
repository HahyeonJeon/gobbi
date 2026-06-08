---
name: untrack-current-session-dir-in-flight
description: Assumption risk — task 09 git rm -r --cached untracks the live session's own dir mid-session; files stay on disk but downstream commits must not expect them tracked
type: decisions
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [git, assumption_risk]
decision_status: accepted
supersedes: null
superseded_by: null
---

# Note on task 09 untracking the current session's in-flight artifacts

## Context

Task 09 runs `git rm -r --cached .gobbi/projects/gobbi/sessions/` inside a worktree whose own planning/evaluation/staging artifacts live under `sessions/2026-06-08-…/`. Untracking is non-destructive (files stay on disk), and task 09's verify confirms files-on-disk. Claude RISK-3 (Risk, assumption_risk, Low, Confidence 50) noted this edge.

## Decision

Task 09's verify includes `ls .gobbi/projects/gobbi/sessions/` confirming directories remain on disk. A note is added to task 09: after this task, the current session's in-flight artifacts become untracked. Later commits in this Execution session must not expect them tracked — `git status` will no longer show session files, and `git add` on session paths will be a no-op unless the gitignore entry is explicitly bypassed (which is by design).

## Rationale

Low severity because files stay on disk. The note prevents an executor from being surprised mid-session. The D8 design intent is that sessions/ is always ephemeral and should never have been tracked.

## Consequences

Any session-file `git add` after task 09 is silently ignored. This is the correct behavior.
