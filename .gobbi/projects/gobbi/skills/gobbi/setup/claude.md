# Claude Code setup

Set up Gobbi in a Claude Code consumer project. Gobbi entry does not run setup. These files are guides, not a
skill.

## Install the plugin

In a Claude Code session:

```text
/plugin marketplace add HahyeonJeon/gobbi
/plugin install gobbi@gobbi
/reload-plugins
```

Allow the five Gobbi roles in project `.claude/settings.json`.
The roles are manager, assistant, leader, executor, and reviewer.
Manager owns the user, the mode, and acceptance. Assistant owns lookup and named Memory work.
Leader, executor, and reviewer are phase roles, and the named role must match the assignment phase.
Leader owns Ideation and Planning, executor owns Execution, and reviewer owns Review.

```json
{
  "permissions": {
    "allow": [
      "Skill(gobbi:gobbi)",
      "Skill(gobbi:principles)",
      "Skill(gobbi:discussion)",
      "Skill(gobbi:delegation)",
      "Agent(gobbi:manager)",
      "Agent(gobbi:assistant)",
      "Agent(gobbi:leader)",
      "Agent(gobbi:executor)",
      "Agent(gobbi:reviewer)"
    ]
  }
}
```

Gobbi reports any additional skill permissions needed by the selected mode. Approve those loads when prompted,
or add their exact `Skill(gobbi:...)` entries to the same allow list. Do not add a setup skill permission.
Setup is not a skill.

## Create missing project layout

From the consumer worktree:

```bash
<path-to-plugin>/skills/gobbi/setup/scripts/claude.sh --check
<path-to-plugin>/skills/gobbi/setup/scripts/claude.sh
```

Pass `--project-key` when the derived key fails. Pass `--skills-root` and `--agents-root` together when
the script is not running from a packaged plugin. Check only with `--check`.

When `.claude/settings.json` is absent, setup writes the minimum namespaced allow list above. It never
overwrites an existing settings file, `CLAUDE.md`, or role contract. It never creates `.claude/skills` or
`.claude/agents`; the plugin supplies those.

## After setup

- This checkout enables `gobbi@gobbi` and does not keep a settings `hooks` object, `.claude/agents`, or
  `.claude/skills`. Claude loads agents, skills, and hooks from `plugins/gobbi`.
- `hooks/hooks.json`, found by default discovery, runs `check-settings.sh claude` on `SessionStart` and
  `remind.sh` on `UserPromptSubmit`. SessionStart emits `hookSpecificOutput` with `hookEventName`
  `SessionStart`. Do not add a `hooks` key to `.claude-plugin/plugin.json`.
- Role contracts come from the plugin's flat `agents/`.
- If the existing `.claude/settings.json` is missing a permission, add the exact `Agent(gobbi:...)` or
  `Skill(gobbi:...)` entry. Setup does not edit a present settings file.

## Scripts

| Script | Path |
|---|---|
| Writer and checker | [claude.sh](scripts/claude.sh) |

Other runtimes: [Codex](codex.md), [Cursor](cursor.md), [Grok](grok.md).
