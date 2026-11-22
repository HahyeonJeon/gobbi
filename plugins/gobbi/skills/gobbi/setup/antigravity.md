# Antigravity setup

Set up Gobbi in an Antigravity consumer project. Gobbi entry does not run setup. These files are guides, not a
skill.

## Install the plugin

Antigravity ships as its own synced package at `plugins/antigravity/gobbi`, because Antigravity always loads
`<plugin>/agents/*.md` with its own frontmatter schema and rejects Claude Code's `plugins/gobbi/agents/`.

From a local clone of Gobbi, validate and install the Antigravity package:

```bash
agy plugin validate --strict ./plugins/antigravity/gobbi
agy plugin install ./plugins/antigravity/gobbi
agy plugin list --json
```

`agy plugin install` stages the plugin under `~/.gemini/config/plugins/gobbi/` so it is available in Antigravity
CLI, Antigravity App, and Antigravity editors. For a single project only, copy `plugins/antigravity/gobbi` into
`.agents/plugins/gobbi` at the project root, or point `.agents/plugins.json` at its parent folder.

Start the parent session on `gemini-4-neon-high` (or select `Gemini 4 Neon (High)` in `/model`):

```bash
agy --model gemini-4-neon-high
```

All six Antigravity specialist contracts set `model: inherit` so they follow the parent session's model, because
Antigravity custom subagent frontmatter accepts only the four model tiers (`inherit`, `flash_lite`, `flash`, `pro`)
and rejects concrete model slugs.

A Gobbi repository checkout already exposes the package through `.agents/plugins.json` pointing to
`plugins/antigravity`. It does not keep `.agents/agents` or `.agents/skills` links.

## Create the project layout by hand

The setup scripts are removed and planned to return in a later release. The layout is in
[Claude Code setup](claude.md#project-layout); every runtime uses the same tree. From the consumer worktree,
create it with the shell block in [Create the project layout by hand](claude.md#create-the-project-layout-by-hand).

Do not copy Gobbi agents into `.agents/agents` or skills into `.agents/skills`; the plugin supplies both.

## After setup

- Start a new Antigravity session in the consumer project and invoke `/gobbi` (or `/gobbi:gobbi`).
- Antigravity participants come from the plugin's `agents/` directory plus Antigravity built-in subagents
  (`research`, `browser`, `self`).
- The package declares no hooks in this release, so there is no `hooks.json` to trust or inspect.

## Setup scripts and settings check

The Antigravity setup script and the SessionStart settings check are not in this release. Both are planned to
return in a later release. Until then, the manual steps above replace the script.

Other runtimes: [Claude Code](claude.md), [Codex](codex.md), [Cursor](cursor.md), [Grok](grok.md).
