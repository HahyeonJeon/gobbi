# Codex setup

Set up Gobbi in a Codex consumer project. Gobbi entry does not run setup. These files are guides, not a skill.

## Install the plugin

```bash
codex plugin marketplace add HahyeonJeon/gobbi
codex plugin add gobbi@gobbi-workspace
```

Codex needs no Claude Code permission list. This checkout loads Codex skills and the reminder hook from
`plugins/gobbi` through `.agents/plugins/marketplace.json`. Role files stay in `.codex/agents`, because Codex
does not load plugin agents. Do not add `.codex/hooks.json`. That file would register a second hook.

## Create missing project layout

From the consumer worktree:

```bash
<path-to-plugin>/skills/gobbi/setup/scripts/codex.sh --check
<path-to-plugin>/skills/gobbi/setup/scripts/codex.sh
```

Pass `--project-key` when the derived key fails. Pass `--skills-root` and `--agents-root` together when
the script is not running from a packaged plugin. Check only with `--check`.

Setup writes missing `.codex/`, `.codex/AGENTS.md`, `.codex/agents/`, and the fourteen role files
`manager.toml`, `assistant.toml`, `coding-leader.toml`, `coding-planner.toml`, `coding-executor.toml`,
`coding-reviewer.toml`, `authoring-leader.toml`, `authoring-planner.toml`, `authoring-executor.toml`,
`authoring-reviewer.toml`, `design-leader.toml`, `design-planner.toml`, `design-executor.toml`, and
`design-reviewer.toml` as byte copies of `runtimes/codex/`.
It never generates those files. If the Codex source is unresolved, those rows
are `skipped source-missing`. It never writes `.codex/skills` or `.codex/config.toml`.
The checker does not require `.codex/config.toml`. Codex reads `$CODEX_HOME/config.toml`.

## After setup

- Review and trust the plugin hook in `/hooks`. Re-trust after any edit. Installed is not active.
- The hook file is `hooks/codex-hooks.json` on `UserPromptSubmit`, declared by `.codex-plugin` `hooks`.
- Codex loads `$CODEX_HOME/config.toml`, not a project `.codex/config.toml`.
- An installed marketplace under `$CODEX_HOME` is a snapshot. It does not follow this worktree.
  `codex plugin marketplace list` must show this repository before the checkout package is the one Codex runs.
- Role contracts that setup wrote must stay byte-identical to `runtimes/codex/<role>.toml`.

## Scripts

| Script | Path |
|---|---|
| Writer and checker | [codex.sh](scripts/codex.sh) |

Other runtimes: [Claude Code](claude.md), [Cursor](cursor.md), [Grok](grok.md).
