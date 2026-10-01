# Cursor setup

Set up Gobbi in a Cursor consumer project. Gobbi entry does not run setup. These files are guides, not a
skill.

## Install

This checkout keeps `.cursor/agents` because a Cursor plugin load is not proven. Those files are symlinks
to the canonical Cursor contracts. It does not keep `.cursor/skills`. Grok scans that directory, so Gobbi
skill links there register `local:gobbi` beside the plugin's `gobbi:gobbi`.

The package still has `.cursor-plugin/plugin.json`, `runtimes/cursor`, and `hooks/cursor-hooks.json` for an
installed plugin. This checkout does not load that plugin. There is no repo-root
`.cursor-plugin/marketplace.json`.

Start the parent session as `grok-4.7[effort=high]`. The required binary is `cursor-agent`, never bare
`agent`. Official help uses `agent`; that name is not Gobbi Partner.

## Create missing project layout

From the consumer worktree:

```bash
<path-to-plugin>/skills/gobbi/setup/scripts/cursor.sh --check
<path-to-plugin>/skills/gobbi/setup/scripts/cursor.sh
```

Pass `--project-key` when the derived key fails. Pass `--skills-root` and `--agents-root` together when
the script is not running from a packaged plugin. Check only with `--check`.

Setup never writes under `.cursor/`, and it never creates `.cursor/agents` or `.cursor/skills`. This
checkout's Cursor agents are the local adapter. Cursor plugin load is not the checkout path.

## After setup

- For an installed Cursor plugin, `hooks/cursor-hooks.json` runs `check-settings.sh cursor` on
  `sessionStart` before `remind.sh`, and the check prints JSON `additional_context`. This checkout does
  not load that plugin, and there is no `.cursor/hooks.json`, so that hook does not run here.
- Cursor participants in this checkout are the `.cursor/agents` roles plus official Cursor subagents.

## Scripts

| Script | Path |
|---|---|
| Writer and checker | [cursor.sh](scripts/cursor.sh) |

Other runtimes: [Claude Code](claude.md), [Codex](codex.md), [Grok](grok.md).
