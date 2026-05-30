---
name: worktree-faithful-install-path-default
description: Install/test scenario that proves the installed plugin cache loaded content from the current worktree, not the main checkout
type: scenarios
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, install, worktree, marketplace, test-path]
---

# Worktree-faithful install: prove the cache loaded from the worktree, not main checkout

**Category:** edge-case  
**Coverage:** uncovered

## Situation

This session runs from a git worktree (`chore/session-2026-05-30-0fd65721`). The Claude plugin documentation explicitly states: "a LOCAL relative marketplace source resolves against your repository's MAIN checkout … When you run Claude Code from a git worktree, the path still points at the main checkout."

A naive `/plugin marketplace add ./` from the worktree would install content from the main checkout, not the worktree branch being developed. This is the U1 risk: tests pass but validate the wrong codebase state.

DD-7 names three options for achieving a worktree-faithful install, but — unlike DD-8 (Option A recommended) and DD-9 (user decision labeled) — DD-7 provides no recommended default. Planning must select a test path and add a worktree-sentinel assertion that proves the cache came from the worktree.

## Inputs

- Current worktree branch: `chore/session-2026-05-30-0fd65721`
- Plugin package root: TBD (STRUCT-1; Planning must name it)
- Marketplace file: `.claude-plugin/marketplace.json` (Claude schema, relative `source`)
- Git state: branch ahead of `develop` with changes that exist in the worktree but not yet in `main`

## Expected behavior

After a worktree-faithful install:
1. The installed plugin cache (`~/.claude/plugins/cache/<id>/`) contains the worktree-branch version of skills/agents/hooks.
2. A worktree-sentinel file (a file that exists ONLY in the worktree branch, not in `main`) is present in the installed cache.
3. The package root is identical to what the worktree contains, not the main checkout state.

## Verification

Pick one of DD-7's three options:
- **(a) Commit/push the worktree branch + add the marketplace from that git ref:** Worktree content is the HEAD of the pushed branch; sentinel = a commit-unique file or a `version` field that matches the branch's commit SHA. This is the most worktree-faithful option and matches the project's branch-per-session model.
- **(b) Point `source` at an absolute worktree path / a fetch mode that captures the exact tree:** Requires the `source` to be an absolute path to the worktree directory. Viable for local testing; not reproducible for others.
- **(c) Merge to main then install:** Tests main, not the worktree. Not worktree-faithful; only acceptable for final validation post-merge.

**Recommended default (Planning should ratify):** Option (a) — commit/push the worktree branch, use a git-ref-based source in the marketplace (or a temporary absolute path during development). Assert a worktree-only sentinel file is present in the installed cache.

## Related

- DD-7 in `ideation/rawdata/draft-iter2.md` (lines 361-368)
- `ideation/staging/references/marketplace-relative-source-resolves-to-main-checkout-from-worktree.md`
- `ideation/evaluation/iter2/claude/usage.md` F-U1
