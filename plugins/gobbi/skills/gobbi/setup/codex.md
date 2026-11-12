# Codex setup

Set up Gobbi in a Codex consumer project. Gobbi entry does not run setup. These files are guides, not a skill.

## Install the plugin

```bash
codex plugin marketplace add HahyeonJeon/gobbi
codex plugin add gobbi@gobbi-workspace
```

Codex needs no Claude Code permission list. This checkout loads Codex skills from `plugins/gobbi` through
`.agents/plugins/marketplace.json`. Role files stay in `.codex/agents`, because Codex does not load plugin
agents. The package declares no hooks in this release, so do not add `.codex/hooks.json`.

## Create the project layout and role files by hand

The setup scripts are removed and planned to return in a later release. The layout is in
[Claude Code setup](claude.md#project-layout); every runtime uses the same tree. Create it with the shell
block in [Create the project layout by hand](claude.md#create-the-project-layout-by-hand).

Then copy the seven Codex role files from the installed plugin. `<path-to-plugin>` is the plugin root that holds
`runtimes/codex/`; in a Gobbi checkout it is `plugins/gobbi`.

```bash
mkdir -p .codex/agents
for role in manager assistant leader developer designer author reviewer; do
  [ -e ".codex/agents/$role.toml" ] || cp "<path-to-plugin>/runtimes/codex/$role.toml" ".codex/agents/$role.toml"
done
```

Copy the files byte for byte and never edit them. Do not create `.codex/skills` or `.codex/config.toml`;
Codex reads `$CODEX_HOME/config.toml`. To pick up a plugin update, delete the old `.codex/agents/<role>.toml`
files and copy again; an upgrade from 1.3.3 replaces all seven, including `manager.toml` and
`assistant.toml`.

## After setup

- No hook exists to trust in this release. Codex loads `$CODEX_HOME/config.toml`, not a project
  `.codex/config.toml`.
- An installed marketplace under `$CODEX_HOME` is a snapshot. It does not follow this worktree.
  `codex plugin marketplace list` must show this repository before the checkout package is the one Codex runs.
- Role files you copied must stay byte-identical to `runtimes/codex/<role>.toml`. Check with
  `cmp <path-to-plugin>/runtimes/codex/<role>.toml .codex/agents/<role>.toml`.

## Setup scripts and settings check

The Codex setup script and the SessionStart settings check are not in this release. Both are planned to return
in a later release. Until then, the manual steps above replace the script.

Other runtimes: [Claude Code](claude.md), [Cursor](cursor.md), [Grok](grok.md).
