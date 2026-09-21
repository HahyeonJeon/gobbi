# Grok setup

Set up Gobbi in a Grok consumer project. Gobbi entry does not run setup. These files are guides, not a skill.

## Install the plugin

Add this repository in `~/.grok/config.toml`:

```toml
[[marketplace.sources]]
name = "gobbi"
git = "https://github.com/HahyeonJeon/gobbi.git"
```

Then install with trust:

```text
grok plugin install gobbi --trust
```

Do not use Claude `/plugin`. An enabled, trusted install runs the reminder hook from the package:
`.grok-plugin/plugin.json` points Grok at `hooks/grok-hooks.json` (`Stop` → `hooks/remind.sh grok`).
Do not copy that hook into `~/.grok/hooks/`.

A repository checkout already exposes `.grok/plugins/gobbi` → `../../plugins/gobbi`. Prove load with
`grok inspect --json`: `plugins` contains `name` `gobbi`, `scope` `project`, `enabled` true.

## Create missing project layout

From the consumer worktree, run the checker, then the writer. Neither script writes under `.grok/`.

```bash
<path-to-plugin>/skills/gobbi/setup/scripts/grok.sh --check
<path-to-plugin>/skills/gobbi/setup/scripts/grok.sh
```

Pass `--project-key` when the derived key fails. Pass `--skills-root` and `--agents-root` together when
the script is not running from a packaged plugin. Check only with `--check`.

Setup creates missing `.gobbi/` layout, Memory directories, `.claude/` placeholders, and Codex role copies
when those paths are absent. It never creates `.grok/skills`, `.grok/agents`, or a Grok hook registration.

## After setup

- Start a new Grok session in the consumer project.
- Prove the hook with `grok inspect --json`: `source.type` is `plugin`, `source.plugin_name` is `gobbi`,
  and `target` ends in `hooks/grok-hooks.json`. Grok reports that entry's `event` as `(plugin)`.
- If `~/.grok/hooks/hooks.json` exists, it duplicates the plugin hook. Remove it:

  ```bash
  rm -f ~/.grok/hooks/hooks.json
  ```

- Grok participants are the plugin `.grok/agents` roles plus official Grok subagents.
- The `Stop` hook fires at turn end and costs one extra model round.

## Scripts

| Script | Path |
|---|---|
| Writer and checker | [grok.sh](scripts/grok.sh) |

Other runtimes: [Claude Code](claude.md), [Codex](codex.md), [Cursor](cursor.md).
