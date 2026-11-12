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

Do not use Claude `/plugin`. The package declares no hooks in this release, so there is no hook to trust or
inspect.

A repository checkout already exposes `.grok/plugins/gobbi` → `../../plugins/gobbi`. Prove load with
`grok inspect --json`: `plugins` contains `name` `gobbi`, `scope` `project`, `enabled` true.
This checkout invokes Gobbi as `/gobbi:gobbi`. It does not keep `.grok/agents`, `.grok/skills`, or
`.grok/hooks`.

## Create the project layout by hand

The setup scripts are removed and planned to return in a later release. The layout is in
[Claude Code setup](claude.md#project-layout); every runtime uses the same tree. From the consumer worktree,
create it with the shell block in [Create the project layout by hand](claude.md#create-the-project-layout-by-hand).

Do not create `.grok/skills`, `.grok/agents`, or a Grok hook registration by hand.

## After setup

- Start a new Grok session in the consumer project.
- If you installed an earlier Gobbi version that registered a Grok hook, check that `~/.grok/hooks/hooks.json`
  is Gobbi's and not another tool's hook, then remove it so it does not run:

  ```bash
  rm -f ~/.grok/hooks/hooks.json
  ```
- Grok participants come from the plugin `runtimes/grok` roles plus official Grok subagents.
  The checkout entry is `/gobbi:gobbi`.

## Setup scripts and settings check

The Grok setup script and the SessionStart settings check are not in this release. Both are planned to return
in a later release. Until then, the manual steps above replace the script.

Other runtimes: [Claude Code](claude.md), [Codex](codex.md), [Cursor](cursor.md).
