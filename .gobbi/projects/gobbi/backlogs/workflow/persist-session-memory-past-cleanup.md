---
name: persist-session-memory-past-cleanup
description: Retain session working memory after worktree cleanup for post-session debugging.
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-08
session: 1abeb43f-6389-4abf-b098-b2b3e68d79b2
tags: []
keywords: [session-memory, debuggability, workflow, lifecycle]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Persist session memory past worktree cleanup

## Context

The session-memory redesign (feature `workflow`, session `1abeb43f`) makes the per-session tree intuitive and debuggable while a session is LIVE. But the whole `sessions/` tree is gitignored (`.gitignore:21`), worktree-local, and removed when the worktree is cleaned up (`git/SKILL.md` worktree-cleanup P5; the `worktree.autoRemove` knob). Once the worktree is gone, all session working memory (drafts, transcripts, evaluation outputs, staging) is gone too — only Wrap-up-promoted content (copied into tracked `features/`, `mistakes/`, `decisions/`, etc.) survives. The user's debuggability goal is fully served DURING a session; retaining a session's memory AFTER cleanup, for post-hoc debugging of a finished session, is a separate capability.

## Why deferred

Out of scope for the session-memory redesign session. That session's locked scope was the directory STRUCTURE + the scaffold SCRIPT + the doc sweep + the lifecycle CORRECTION in the docs — not a new retention/archival mechanism. Adding cross-session retention would mean a new store outside the worktree (the transcripts hold unfiltered, highest-sensitivity turn content — `memorization/SKILL.md` — so a retention design must handle that), which is a distinct design problem with its own ideation.

## When to pick up

No hard prerequisite, but best after the structure redesign ships (so the retained shape is the new one). A live-debugging stopgap already exists: set `worktree.autoRemove=false` to keep a single finished session's worktree (and its `sessions/` tree) on disk for inspection — that covers the immediate "I want to look at the session I just ran" need without a new store.

## Suggested approach

Options to weigh in a future ideation: (1) an opt-in `sessions-archive/` outside the worktree that Wrap-up copies the curated (non-transcript) session tree into on close; (2) lean on `worktree.autoRemove=false` plus a documented "inspect a retained worktree" procedure; (3) a redaction pass that strips raw transcripts before any cross-session retention. Decide the sensitivity handling first — raw transcripts must not silently persist into a tracked or shared location.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-08-1abeb43f-6389-4abf-b098-b2b3e68d79b2/`
