---
name: chore-label-line-citation-stale
description: Backlog item tracking a stale line-number citation for the chore label in git/conventions.md — the cited line 261 is off by 2 (actual line 263).
type: backlogs
scope: feature
feature: git-workflow
status: deferred
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [docs-sync, citation, chore-label, git-conventions]
priority: low
disposition: open
domain: docs-sync
---

# `chore` label line citation in `git/conventions.md` is off by 2 lines

## Context

The design drafts for the worktree-first session architecture cited "`chore | #e4e669` at line 261" in `git/conventions.md`. A Codex evaluator ran `grep -n` and found `fix` at line 261; `chore` is at line 263.

The branch name `chore/session-{date}-{ssid-short}` is correctly registry-compliant — the label exists at line 263 and the type regex at line 22 includes `chore`. This is a citation-accuracy issue only.

## Why deferred

A Low-priority docs-sync finding only — the off-by-2 citation affects no runtime behavior or design decision. The branch-convention compliance was verified independently (type regex at line 22 includes `chore`, slug length at line 64 passes, and the `chore` label is confirmed present at line 263), so the stale citation is purely a documentation-accuracy nit not worth blocking the current workflow step.

## When to pick up

Pick up during the next docs sweep that touches the worktree-first design drafts. No hard prerequisite — the correction can be made any time those drafts are edited.

## Suggested approach

Update any design-draft line citation for the `chore` label-color row to reference `git/conventions.md:263` instead of line 261. Verify afterward that no `conventions.md:261` citation remains (`grep -n "conventions.md:261" <draft>` returns 0 matches). Note: line numbers in `git/conventions.md` may drift over future edits — re-resolve the actual `chore` label line before citing it.

## Originating session

Surfaced by a consistency-evaluation finding during the worktree-first session-architecture work (session `1b26cf20`, 2026-05-23): the design drafts cited "`chore | #e4e669` at line 261", but a `grep -n` run found `fix` at line 261 and `chore` at line 263. Full session detail: `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`.
