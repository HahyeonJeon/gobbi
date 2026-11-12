# Cursor setup

Set up Gobbi in a Cursor consumer project. Gobbi entry does not run setup. These files are guides, not a
skill.

## Install

This checkout keeps `.cursor/agents` because a Cursor plugin load is not proven. Those files are symlinks
to the canonical Cursor contracts. It does not keep `.cursor/skills`. Grok scans that directory, so Gobbi
skill links there register `local:gobbi` beside the plugin's `gobbi:gobbi`.

The package still has `.cursor-plugin/plugin.json` and `runtimes/cursor` for an installed plugin. This checkout
does not load that plugin. There is no repo-root `.cursor-plugin/marketplace.json`, and the package declares no
hooks in this release.

Start the parent session as `grok-4.7[effort=high]`. The required binary is `cursor-agent`, never bare
`agent`. Official help names it `agent`.

## Create the project layout by hand

The setup scripts are removed and planned to return in a later release. The layout is in
[Claude Code setup](claude.md#project-layout); every runtime uses the same tree. From the consumer worktree,
create it with the shell block in [Create the project layout by hand](claude.md#create-the-project-layout-by-hand).

Do not create `.cursor/agents` or `.cursor/skills` by hand. This checkout's Cursor agents are the local
adapter, symlinks to the canonical Cursor contracts, and Cursor plugin load is not the checkout path.

## After setup

- There is no `.cursor/hooks.json` and no hook to run in this release.
- Cursor participants in this checkout are the `.cursor/agents` roles plus official Cursor subagents.

## Setup scripts and settings check

The Cursor setup script and the SessionStart settings check are not in this release. Both are planned to return
in a later release. Until then, the manual steps above replace the script.

Other runtimes: [Claude Code](claude.md), [Codex](codex.md), [Grok](grok.md).
