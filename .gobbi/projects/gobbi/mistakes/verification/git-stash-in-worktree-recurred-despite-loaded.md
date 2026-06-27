---
name: git-stash-in-worktree-recurred-despite-loaded
description: A recorded git-stash-in-worktree mistake re-triggered while AUTHORING a verify gate despite being loadable, because the recording cues command-running not command-construction
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [verification, git, process]
keywords: [git-stash, worktree, verify-gate, recurrence, loaded-not-enforced]
author: claude
priority: high
domain: verification
---

# Recorded git-stash-in-worktree mistake recurred during verify-gate construction

## What happened

The already-recorded mistake `executor-git-stash-in-worktree-during-verify` re-triggered this session
during Execution task 06. The recurrence happened while CONSTRUCTING a verification gate: the command
being written used `git stash` to compare a working file against a baseline inside the worktree. The
mistake file was loadable (it sits in `mistakes/verification/`), yet it did not prevent the slip,
because it was being re-introduced as a NEW verify-gate command — a context the recording does not cue.

## Why it happens

The recorded mistake describes the trap as "an executor runs `git stash` during Verify", cueing the
recognizer to watch for `git stash` in command HISTORY. But this recurrence was in command-AUTHORING —
writing a verify gate that embeds `git stash`. A loaded mistake is a passive reference, not an active
gate: nothing intercepts the moment an agent types `git stash` into a new command. Loading raises
awareness of the trap-as-described, not the trap-as-re-encountered on a different surface (gate
construction vs ad-hoc verification).

## Correct approach

Never put `git stash` (or `git stash pop`) in ANY worktree command — interactive OR authored into a
gate / checklist / script. To compare against a baseline, use `git show HEAD:<path>` (read the
committed blob) or `git diff` / `git diff HEAD -- <path>` (show the delta) — both are non-mutating and
safe in a worktree that carries prior commits. Treat the recorded mistake as covering
command-construction, not just live command runs.

## How to detect

- Any time you AUTHOR a verify command (a `verifies:` gate, a checklist assertion, a guard script)
  inside a worktree session, scan the command you just wrote for the literal token `git stash` before
  committing it — not only your interactive shell history.
- The trigger is "I need to compare a working file to its committed baseline" — exactly where
  `git stash` gets reached for, and exactly where it is wrong in a worktree.

## Related

- [[executor-git-stash-in-worktree-during-verify]] — the recorded mistake that recurred
- [[recorded-mistakes-recurred-recording-is-not-enforcement]] — the meta-lesson this instance feeds
