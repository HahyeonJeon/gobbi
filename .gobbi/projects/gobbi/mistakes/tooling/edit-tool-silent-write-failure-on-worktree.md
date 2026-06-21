---
name: edit-tool-silent-write-failure-on-worktree
description: The Edit tool reported success but its writes evaporated on a git worktree — verify on disk, then switch to perl/python in-place edits.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-21
session: c3ac1c53-6741-49cf-8856-cdb3fcd6bec0
tags: [process, verification]
keywords: [edit-tool, write-safety, worktree, silent-failure, perl-in-place, disk-verify]
author: claude
priority: high
domain: tooling
supersedes: null
superseded_by: null
related: [edit-write-tool-success-without-disk-persistence, absolute-path-typo-on-write-evades-cwd-guard]
---

# Edit tool silently failed to persist writes on a git worktree

## What happened

While working inside a git worktree this session, the `Edit` tool reported "success" on edit after edit, but the changes never reached disk. A prior executor confirmed the failure: after roughly 13 consecutive "successful" `Edit` calls, `git status` showed NO changes and `git diff` was empty — every reported write had evaporated. The executor only caught it because they checked `git status` instead of trusting the tool's success messages. Switching to `perl -i` / `python3` in-place edits via Bash recovered cleanly, and those writes were verifiable on disk.

## Why it happens

A tool-result "success" acknowledgement is the tool's intent-to-apply, not a verified post-condition on disk. On a git worktree in this environment the `Edit` tool's write path can no-op while still returning success — the success message and the disk state diverge. Trusting the message instead of the disk is the trap.

## Correct approach

- After ANY `Edit` in a worktree, VERIFY the change landed on disk via Bash — `git diff` / `git status` / `cat` the file — BEFORE treating it as done and BEFORE committing.
- If the writes do not persist, STOP using `Edit`/`Write` for in-place changes and switch to `perl -i` / `python3` in-place edits via Bash, then re-verify on disk.
- Prefer `Write` for whole new files (it errors loudly if it fails) over `Edit` for partial changes when the persistence is in doubt.

## How to detect

- You are editing files inside a git worktree (not the main checkout).
- `Edit` reports "success" but a follow-up `git status` / `git diff` / `cat` shows no change.
- A multi-edit task where several edits "succeeded" yet the working tree is still clean.

## Related

- [[edit-write-tool-success-without-disk-persistence]] — the sibling trap under API-overload (529); same root (success ≠ disk persistence), different trigger
- [[absolute-path-typo-on-write-evades-cwd-guard]] — the paired write-safety lesson: verify the post-condition on disk, do not trust the tool's self-report
