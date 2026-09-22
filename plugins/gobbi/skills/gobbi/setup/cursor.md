# Cursor setup

Set up Gobbi in a Cursor consumer project. Gobbi entry does not run setup. These files are guides, not a
skill.

## Install

Gobbi does not ship a Cursor marketplace plugin. A repository checkout already exposes Cursor participants
through `.cursor/agents` and `.cursor/skills`.

Start the parent session as `grok-4.7[effort=xhigh]`, then load Gobbi from `.cursor/skills`. The required
binary is `cursor-agent`, never bare `agent`. Official help uses `agent`; that name is not Gobbi Partner.

## Create missing project layout

From the consumer worktree:

```bash
<path-to-plugin>/skills/gobbi/setup/scripts/cursor.sh --check
<path-to-plugin>/skills/gobbi/setup/scripts/cursor.sh
```

Pass `--project-key` when the derived key fails. Pass `--skills-root` and `--agents-root` together when
the script is not running from a packaged plugin. Check only with `--check`.

Setup never writes under `.cursor/`. Role contracts come from the plugin's declared `runtimes/cursor`.
It never creates `.cursor/skills` or `.cursor/agents`.

## After setup

- The Cursor hook is `hooks/cursor-hooks.json` on `sessionStart`, declared by `.cursor-plugin` `hooks`.
  It fires once per conversation, not once per turn.
- Cursor participants are the project `.cursor/agents` roles plus official Cursor subagents.

## Scripts

| Script | Path |
|---|---|
| Writer and checker | [cursor.sh](scripts/cursor.sh) |

Other runtimes: [Claude Code](claude.md), [Codex](codex.md), [Grok](grok.md).
