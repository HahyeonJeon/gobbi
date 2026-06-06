---
name: subagent-write-cwd-defaults-to-main-tree-not-worktree
description: A spawned subagent's Bash/Write CWD defaults to the MAIN tree, not the session worktree — relative or main-tree-resolved paths land outside the worktree, and the agent may falsely report a worktree path it never wrote to.
type: mistakes
scope: project
status: active
created: 2026-06-06
session: ca2231b3-9567-4cf9-b0d6-f9bd3e2e78ee
tags: [worktree, delegation, verification, cwd, false-completion]
priority: high
domain: process
supersedes: null
superseded_by: null
---

**What went wrong.** A leader was asked to write its planning artifact to a worktree-nested
session path (`.../worktrees/docs/<branch>/.gobbi/.../sessions/.../planning/artifacts/plan.md`).
It reported `STATUS: DONE` with that path and a verification claim — but the file was NOT there.
The artifact had actually been written to the **main-tree** session path
(`/playinganalytics/git/gobbi/.gobbi/.../sessions/.../planning/artifacts/plan.md`), because the
subagent's Bash/Write CWD defaults to the main repo root, not the worktree. The DONE report
named one path while the write landed at another — a false completion claim (P-verify violation).

**Why.** A spawned subagent does not inherit the manager's CWD. Its Bash tool resets to the main
repo root (`/playinganalytics/git/gobbi`) on every call; the Write tool resolves relative paths
against that root. So a path constructed relative to "where I think I am" (the worktree) silently
resolves into the main tree. Reporting DONE without a `test -f` on the EXACT intended absolute
path lets the mismatch go unnoticed.

**How to recognize.** Any delegation that (a) runs in a worktree session and (b) has the
subagent Write/Edit files. Smell: the subagent reports an artifact path but a later Read/`find`
at that path turns up empty; or two copies of the artifact appear (one main-tree, one worktree).

**Corrected approach.**
1. In every delegation prompt for worktree work, state the rule explicitly: "Bash CWD resets to
   the MAIN tree each call; cd to the worktree first in EVERY Bash call, and use the full
   WORKTREE-ABSOLUTE path for every Write/Edit/Read." (See `git/SKILL.md` Memory Access Matrix
   write-path rule and the codex skill's CWD discipline.)
2. Require the subagent to VERIFY the write landed: `test -f <exact-absolute-path> && wc -l` before
   reporting DONE — files-as-truth, never trust the path in the report.
3. The manager independently confirms the artifact exists at the expected path before consuming it
   (this is how this instance was caught — the manager `find`/Read came up empty).

Related: [[executor-mirror-path-vs-worktree-physical-copy]], [[skills-mirror-symlinks-not-copies]].
