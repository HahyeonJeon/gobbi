---
name: subagent-relative-path-write-strays-to-main-tree
description: Subagents writing session files (rawdata/eval) via RELATIVE paths after cwd-reset land them in the MAIN tree, not the worktree. Bash cwd resets to main tree between calls; relative Write/output paths resolve there. Use ABSOLUTE worktree paths for ALL session writes.
type: mistakes
scope: project
feature: project-memory
status: active
created: 2026-05-27
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [process, worktree, cwd-reset, subagent, absolute-paths]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Subagent relative-path writes stray to main tree after cwd reset

## What went wrong

During this session, subagents delegated to write session files (rawdata/, evaluation/) used paths that were relative to their working directory. Between Bash tool calls, the shell cwd resets to the main tree root (not the worktree). Relative paths resolved against the main-tree cwd, so files intended for `<worktree>/.gobbi/projects/gobbi/sessions/<sid>/...` landed instead at `<main-tree>/.gobbi/projects/gobbi/sessions/<sid>/...`. The worktree session directory was missing the expected files; the main-tree session directory had them. The manager had to locate and consolidate the strays into the worktree.

## Why it went wrong

Subagents assume their write-path context persists from the delegation prompt's description of the worktree. It does not. Every Bash call starts at the session's default cwd (main tree root). A subagent that constructs session write paths without an explicit `cd <worktree>` or absolute path prefix will write to the main tree whenever the path is relative — even if the delegation prompt correctly described the worktree location.

## How to recognize this situation

- Session files appear under the main-tree `.gobbi/.../sessions/` tree rather than the worktree's equivalent path.
- The worktree session dir is missing expected rawdata or eval files after a subagent returns.
- `find <main-tree> -path "*/sessions/<sid>/*" -newer <timestamp>` turns up files that should be in the worktree.

## Corrected approach

Subagents use ABSOLUTE worktree paths for ALL session writes — no relative paths anywhere in session write operations:

1. Manager includes the literal absolute worktree path in the delegation prompt's write-surface section, e.g.: `WT="/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/<branch>"`.
2. Subagents expand `$WT` to the literal absolute path and prefix every Write/Edit/Bash output path with it.
3. If the subagent must run Bash, the FIRST action is `cd "$WT"` before any file operation — not a note, an action.
4. Manager runs post-WORK verification: `ls <worktree>/sessions/<sid>/<loop>/rawdata/` to confirm files landed in the right tree.

Recovery when strays occur: `mv` or `cp` stray files from main tree to worktree; do NOT commit them from the main tree. See also [[sendmessage-continued-cwd-resets-to-main-tree]] and [[executor-cwd-reset-commits-task-to-wrong-branch]] — the same cwd-reset root cause at different severity levels.

## Related

- [[sendmessage-continued-cwd-resets-to-main-tree]] — realized version of this mistake (commit landed on wrong branch).
- [[executor-cwd-reset-commits-task-to-wrong-branch]] — git commit variant; commit goes to develop instead of chore branch.
- [[codex-subprocess-writes-to-main-tree]] — same cwd-reset root cause via Codex subprocess.
