---
name: chore-label-line-citation-stale
description: Checklist for correcting the stale line-number citation for the chore label in git/conventions.md (cited line 261, actual line 263).
type: checklists
scope: feature
feature: git-workflow
status: open
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [docs-sync, citation, chore-label, git-conventions]
domain: docs-sync
---

# Correct the stale `chore` label line citation in `git/conventions.md`

## What

Update the worktree-first design drafts that cite "`chore | #e4e669` at line 261" in `git/conventions.md` — the `chore` label is actually at line 263 (line 261 holds `fix`). Change every such citation from `git/conventions.md:261` to `git/conventions.md:263`.

## Why

The branch name `chore/session-{date}-{ssid-short}` is registry-compliant: the `chore` label exists at line 263 and the type regex at line 22 includes `chore`. The off-by-2 citation is a documentation-accuracy issue only — it affects no runtime behavior. Left uncorrected, the stale citation points a future reader at the wrong line. (Line numbers in `git/conventions.md` can drift over future edits — re-resolve the actual `chore` label line before re-citing it.)

## Verification

After the update, `grep -n "conventions.md:261" <draft>` returns 0 matches, and the `chore` row is confirmed at the cited line (`grep -n 'chore' git/conventions.md`).

## Status notes

Pending — a Low-priority docs-sweep item; pick up during the next docs sweep that touches the worktree-first design drafts. See the sibling backlog `../backlogs/chore-label-line-citation-stale.md` for the deferred-decision context. Surfaced by a consistency-evaluation finding during the worktree-first session-architecture work (session `1b26cf20`, 2026-05-23).
