---
name: anchor-slug-4-hyphen-vs-2-hyphen
description: Deferred risk tracking whether em-dash headings produce 4-hyphen or 2-hyphen anchor slugs in GitHub-rendered markdown, affecting P2/P6 links in orchestration/SKILL.md.
type: backlogs
scope: feature
feature: git-workflow
status: deferred
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [anchor, slug, em-dash, markdown, github, docs-sync]
priority: medium
disposition: open
domain: docs-sync
---

# Anchor slug format — 4-hyphen vs 2-hyphen for em-dash headings

## Context

The worktree-creation row in `orchestration/SKILL.md` links to `git/SKILL.md` via anchors `#p2----create-worktree` and `#p6----recover-orphaned-worktree`. The source headings are `### P2 — Create worktree` and `### P6 — Recover orphaned worktree`.

The project's stub-redirect-format rule (`rules/stub-redirect-format.md`) says em/en dashes are **dropped** for anchor verification — by that rule the expected slugs would be `p2--create-worktree` and `p6--recover-orphaned-worktree` (2 hyphens). The existing links use 4 hyphens, and the anchor format has not been empirically tested by rendering the markdown in GitHub.

## Why deferred

Low priority and out of the originating task's contracted scope (which was the stale-path recovery and footnote-reference fixes only). Link navigation is cosmetic: the procedure text reads clearly whether or not the anchor resolves in a rendered context, and the 4-hyphen form already appears across the project. A correct fix requires a project-wide anchor sweep of all em-dash headings, which is not scoped to a single task.

## When to pick up

Pick up when a dedicated docs-sweep task audits em-dash anchor slugs project-wide, or sooner if link resolution is confirmed broken by rendering the markdown in GitHub. No hard prerequisite.

## Suggested approach

1. Render `orchestration/SKILL.md` in GitHub and confirm whether `#p2----create-worktree` / `#p6----recover-orphaned-worktree` resolve, or whether the 2-hyphen form is required.
2. If the 2-hyphen form is correct, run a project-wide sweep of all em-dash-heading anchors and normalize them, updating both the stub-redirect-format rule's example and any links that depend on the resolved form.

## Originating session

Surfaced by structural evaluation findings during the worktree-first session-architecture work (session `1b26cf20`, 2026-05-24). Full session detail: `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`.
