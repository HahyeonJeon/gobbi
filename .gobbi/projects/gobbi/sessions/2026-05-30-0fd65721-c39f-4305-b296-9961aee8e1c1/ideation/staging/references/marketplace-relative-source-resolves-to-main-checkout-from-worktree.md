---
title: "Marketplace relative local source resolves against the MAIN checkout, not the worktree"
source: "https://code.claude.com/docs/en/plugin-marketplaces"
type: reference
accessed: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, marketplace, worktree, local-source, install-test, U1]
---

# Marketplace local relative source + git worktree resolution

## Insight
A `marketplace.json` plugin entry with a relative local `source` (e.g. `"./gobbi"` or `"./plugins/gobbi"`)
resolves the path relative to the **marketplace root** (the directory containing `.claude-plugin/`). For a
**local `directory`/`file` marketplace source** added with a relative path, the path "resolves against your
repository's **main checkout**. When you run Claude Code from a git worktree, the path still points at the
main checkout, so all worktrees share the same marketplace location." Marketplace state is stored once per
user in `~/.claude/plugins/known_marketplaces.json`, not per project.

Consequences for testing the plugin built in THIS worktree:
- If Execution runs `/plugin marketplace add ./` from the session worktree and installs, Claude may fetch
  the plugin content from the MAIN checkout, NOT the uncommitted worktree changes — a false-positive install.
- Reliable worktree-faithful test paths: (a) commit/push the worktree branch and add the marketplace from a
  git ref pointing at that branch; or (b) point the marketplace `source` at an absolute worktree path / use
  a source type that fetches the exact tree under test; or (c) merge to main first, then install. The chosen
  path must be PROVEN to have loaded worktree content (e.g. assert a worktree-only sentinel file is present
  in the installed cache).
- Relative paths "only work when users add your marketplace via Git … not … a direct URL to the
  marketplace.json file."

## Why it applies
Resolves U1 (worktree-local install can test the wrong checkout). The install/validation scenario must prove
the installed cache came from the current worktree's content, not the main checkout.

## Source
https://code.claude.com/docs/en/plugin-marketplaces — "Relative paths" (resolves to marketplace root) and
the local-directory/worktree Note ("resolves against your repository's main checkout … still points at the
main checkout").

## Excerpt
"Paths resolve relative to the marketplace root, which is the directory containing `.claude-plugin/`."
"If you use a local `directory` or `file` source with a relative path, the path resolves against your
repository's main checkout. When you run Claude Code from a git worktree, the path still points at the main
checkout, so all worktrees share the same marketplace location."
