# Codex setup

Set up Gobbi in a Codex consumer project. Gobbi entry does not run setup. These files are guides, not a skill.

## Install the plugin

```bash
codex plugin marketplace add HahyeonJeon/gobbi
codex plugin add gobbi@gobbi-workspace
```

Codex needs no Claude Code permission list. This checkout loads Codex skills and hooks from
`plugins/gobbi` through `.agents/plugins/marketplace.json`. Role files stay in `.codex/agents`, because Codex
does not load plugin agents. Do not add `.codex/hooks.json`. That file would register a second hook.

## Create missing project layout

The layout is in [Claude Code setup](claude.md#project-layout); every runtime uses the same tree.

From the consumer worktree:

```bash
<path-to-plugin>/skills/gobbi/setup/scripts/codex.sh --check
<path-to-plugin>/skills/gobbi/setup/scripts/codex.sh
```

Pass `--project-key` when the derived key fails. Pass `--skills-root` and `--agents-root` together when
the script is not running from a packaged plugin. Check only with `--check`.

Setup writes missing `.codex/`, `.codex/AGENTS.md`, `.codex/agents/`, and the five role files
`manager.toml`, `assistant.toml`, `leader.toml`, `executor.toml`, and `reviewer.toml` as byte copies of
`runtimes/codex/`.
It never generates those files. If the Codex source is unresolved, those rows
are `skipped source-missing`. It never writes `.codex/skills` or `.codex/config.toml`.
The checker does not require `.codex/config.toml`. Codex reads `$CODEX_HOME/config.toml`.

## After setup

- Review and trust the plugin hook in `/hooks`. Re-trust after any edit. Installed is not active.
- `hooks/codex-hooks.json`, declared by `.codex-plugin` `hooks`, runs `check-settings.sh codex` on
  `SessionStart` for matcher `startup|resume`, and runs `remind.sh` on `UserPromptSubmit`. That
  SessionStart call emits `hookSpecificOutput` with `hookEventName` `SessionStart`.
- Codex loads `$CODEX_HOME/config.toml`, not a project `.codex/config.toml`.
- An installed marketplace under `$CODEX_HOME` is a snapshot. It does not follow this worktree.
  `codex plugin marketplace list` must show this repository before the checkout package is the one Codex runs.
- Role contracts that setup wrote must stay byte-identical to `runtimes/codex/<role>.toml`.

## Scripts

| Script | Path |
|---|---|
| Writer and checker | `scripts/codex.sh` (being reimplemented; not in this release) |

Other runtimes: [Claude Code](claude.md), [Cursor](cursor.md), [Grok](grok.md).
