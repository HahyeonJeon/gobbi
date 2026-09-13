# Codex setup

Set up Gobbi in a Codex consumer project. Gobbi entry does not run setup. These files are guides, not a skill.

## Install the plugin

```bash
codex plugin marketplace add HahyeonJeon/gobbi
codex plugin add gobbi@gobbi-workspace
```

Codex needs no Claude Code permission list. A repository checkout already includes local entrypoints, so
contributors working in the clone do not need to install the plugin.

## Create missing project layout

From the consumer worktree:

```bash
<path-to-plugin>/skills/gobbi/setup/scripts/codex.sh --check
<path-to-plugin>/skills/gobbi/setup/scripts/codex.sh
```

Pass `--project-key` when the derived key fails. Pass `--skills-root` and `--agents-root` together when
the script is not running from a packaged plugin. Check only with `--check`.

Setup writes missing `.codex/`, `.codex/AGENTS.md`, `.codex/agents/`, and five `<role>.toml` files as byte
copies of `runtimes/codex/`. It never generates those files. If the Codex source is unresolved, those rows
are `skipped source-missing`. It never writes `.codex/skills` or `.codex/config.toml`.

## After setup

- Review and trust the plugin hook in `/hooks`. Re-trust after any edit. Installed is not active.
- The hook file is `hooks/codex-hooks.json` on `UserPromptSubmit`, declared by `.codex-plugin` `hooks`.
- Codex loads `$CODEX_HOME/config.toml`, not a project `.codex/config.toml`.
- Role contracts that setup wrote must stay byte-identical to `runtimes/codex/<role>.toml`.

## Scripts

| Script | Path |
|---|---|
| Writer and checker | [codex.sh](scripts/codex.sh) |

Other runtimes: [Claude Code](claude.md), [Cursor](cursor.md), [Grok](grok.md).
