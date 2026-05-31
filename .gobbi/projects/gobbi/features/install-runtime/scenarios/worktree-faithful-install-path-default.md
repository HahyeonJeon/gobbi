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
**Coverage:** operator-assisted (scripts/validate-plugin-hooks-fire-once.sh embeds the procedure)

## Situation

When Claude Code is run from a git worktree, the Claude Code plugin documentation explicitly states: "a LOCAL relative marketplace source resolves against your repository's MAIN checkout … When you run Claude Code from a git worktree, the path still points at the main checkout."

A naive positional-arg `claude plugin marketplace add ./` from the worktree would install content from the main checkout, not the worktree branch being developed. This is the U1 risk: tests pass but validate the wrong codebase state.

DD-7 names three options for achieving a worktree-faithful install (see `decisions/worktree-test-default-git-ref-source-with-sentinel.md`). **Option (a) is the ratified default:** use a positional-arg marketplace source pointing at the absolute worktree path + assert a worktree-only sentinel file in the installed cache.

## Inputs

- Current worktree branch: the session branch (e.g., `chore/session-2026-05-30-0fd65721`)
- Plugin package root: `plugins/gobbi/`
- Marketplace file: `.claude-plugin/marketplace.json` (Claude schema, relative `source`)
- Git state: branch ahead of `develop` with changes that exist in the worktree but not yet in `main`

## Expected behavior

After a worktree-faithful install:
1. The installed plugin cache (`~/.claude/plugins/cache/<id>/`) contains the worktree-branch version of skills/agents/hooks.
2. A worktree-sentinel file (a file that exists ONLY in the worktree branch, not in `main`) is present in the installed cache.
3. The package root is identical to what the worktree contains, not the main checkout state.

## Verification

**Ratified Option (a): positional-arg absolute worktree path + sentinel assertion**

1. Add the marketplace using the absolute worktree path as a positional argument:
   `claude plugin marketplace add <absolute-worktree-path>/.claude-plugin/marketplace.json`
2. Install the plugin: `claude plugin install gobbi`
3. Assert a worktree-only sentinel file is present in `~/.claude/plugins/cache/<id>/`.
4. Assert the installed cache top level equals the allow-set `{.claude-plugin, skills, agents, hooks}`.

The procedure is embedded in `scripts/validate-plugin-hooks-fire-once.sh` (the operator-run harness for T5).

## Related

- `decisions/worktree-test-default-git-ref-source-with-sentinel.md` — ratified decision (DD-7)
- `references/marketplace-relative-source-resolves-to-main-checkout-from-worktree.md` — doc evidence
