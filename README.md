![Gobbi logo](assets/logo.png)

# Gobbi

Open-source orchestration for Claude Code, Codex, Cursor, and Grok.

<p>
  <a href="./CHANGELOG.md"><img src="https://img.shields.io/badge/version-1.3.3-blue" alt="Version 1.3.3"></a>
  <img src="https://img.shields.io/badge/runtimes-Claude%20Code%20%7C%20Codex%20%7C%20Cursor%20%7C%20Grok-black" alt="Runtimes: Claude Code, Codex, Cursor, and Grok">
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/HahyeonJeon/gobbi" alt="License: MIT"></a>
</p>

Gobbi is an orchestration system that brings structured planning, implementation, review, and durable
handoffs to the AI coding tools you already use. You choose Cowork for topic-by-topic work or Workflow for a
fully recorded lifecycle. Gobbi never preselects the mode for you.

The name comes from 고삐 (*gobbi*), Korean for "reins."

## Install

### Claude Code

Run these commands in a Claude Code session:

```text
/plugin marketplace add HahyeonJeon/gobbi
/plugin install gobbi@gobbi
/reload-plugins
```

This checkout enables `gobbi@gobbi` in `.claude/settings.json`. It does not keep `.claude/agents`,
`.claude/skills`, or a settings `hooks` object. Claude loads agents, skills, and `hooks/hooks.json` from
`plugins/gobbi`.

Allow the fourteen Gobbi roles in your project `.claude/settings.json`.
The roles are manager, assistant, coding-leader, coding-planner, coding-executor, coding-reviewer,
authoring-leader, authoring-planner, authoring-executor, authoring-reviewer, design-leader,
design-planner, design-executor, and design-reviewer.
Manager owns the user, the mode, and acceptance. Assistant owns lookup and named Memory work.
The twelve names after assistant are phase roles. The named role must match the assignment phase.

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
      "Agent(gobbi:coding-leader)",
      "Agent(gobbi:coding-planner)",
      "Agent(gobbi:coding-executor)",
      "Agent(gobbi:coding-reviewer)",
      "Agent(gobbi:authoring-leader)",
      "Agent(gobbi:authoring-planner)",
      "Agent(gobbi:authoring-executor)",
      "Agent(gobbi:authoring-reviewer)",
      "Agent(gobbi:design-leader)",
      "Agent(gobbi:design-planner)",
      "Agent(gobbi:design-executor)",
      "Agent(gobbi:design-reviewer)"
    ]
  }
}
```

Gobbi reports any additional skill permissions needed by the selected mode. Approve those loads when prompted,
or add their exact `Skill(gobbi:...)` entries to the same allow list.

### Codex

```bash
codex plugin marketplace add HahyeonJeon/gobbi
codex plugin add gobbi@gobbi-workspace
```

Codex needs no Claude Code permission configuration. This checkout loads Codex skills and the reminder
hook from `plugins/gobbi` through `.agents/plugins/marketplace.json`. Role files stay in `.codex/agents`,
because Codex does not load plugin agents. Do not add `.codex/hooks.json`. That file would register a second hook.

### Grok

Use Grok's Marketplace tab to browse and install Gobbi from a configured source. Add this repository in
`~/.grok/config.toml`:

```toml
[[marketplace.sources]]
name = "gobbi"
git = "https://github.com/HahyeonJeon/gobbi.git"
```

Installed Grok 1.0.4 also accepts the same source as GitHub shorthand:

```text
grok plugin marketplace add HahyeonJeon/gobbi
```

Then install Gobbi from the Marketplace tab with trust, or from the command line:

```text
grok plugin install gobbi --trust
```

Do not use Claude `/plugin` as the Grok install path. An enabled, trusted Grok install runs the reminder hook
from the package itself: `.grok-plugin/plugin.json` points Grok at `hooks/grok-hooks.json`, which registers a
`Stop` handler running `hooks/remind.sh` with `grok` as its argument. No copy into `~/.grok/hooks/` is needed.

Prove the hook with `grok inspect --json`: an entry whose `source.type` is `plugin`, whose `source.plugin_name`
is `gobbi`, and whose `target` ends in `hooks/grok-hooks.json`. Grok reports that entry's `event` as
`(plugin)` and does not resolve the inner `Stop` there. Start a new Grok session in the consumer project.

A repository checkout already exposes the package through `.grok/plugins/gobbi` → `../../plugins/gobbi`. Prove
that load with `grok inspect --json`: the `plugins` list contains `name` `gobbi`, `scope` `project`,
`enabled` true, and `path` ending in `.grok/plugins/gobbi`.

Grok participants come from the plugin `runtimes/grok` roles plus official Grok subagents. This checkout
does not keep `.grok/agents`, `.grok/skills`, or `.grok/hooks`.

### Cursor

This checkout keeps `.cursor/agents` because a Cursor plugin load is not proven. Those files are symlinks
to the canonical Cursor contracts. It does not keep `.cursor/skills`, because Grok scans that directory and
would load the same skills beside `plugins/gobbi`. The package contains a Cursor manifest and
`hooks/cursor-hooks.json` for an installed plugin. This checkout does not load that plugin. Start the parent
session as `grok-4.7[effort=high]`. The required binary is `cursor-agent`, never bare `agent`. Official help
uses `agent`; that name is not Gobbi Partner.

Cursor participants in this checkout are the `.cursor/agents` roles plus official Cursor subagents.

After install, create missing layout with the matching runtime guide and script under `skills/gobbi/setup/`:
[claude.md](.gobbi/projects/gobbi/skills/gobbi/setup/claude.md),
[codex.md](.gobbi/projects/gobbi/skills/gobbi/setup/codex.md),
[cursor.md](.gobbi/projects/gobbi/skills/gobbi/setup/cursor.md), or
[grok.md](.gobbi/projects/gobbi/skills/gobbi/setup/grok.md). Setup is not a skill. Gobbi entry does not run it.

## Upgrade to 1.3.3

Version 1.3.3 includes new features and removes the old specialist role names. The patch version is a
project decision and an exception to Semantic Versioning. Update existing role calls and Claude `Agent(...)`
permissions using the domain and phase:

| Old role | New role family |
|---|---|
| `developer` | `coding-*` |
| `author` | `authoring-*` |
| `designer` | `design-*` |

Choose `leader` for ideation, `planner` for planning, `executor` for execution, and `reviewer` for review.
For example, implementation formerly assigned to `developer` now uses `coding-executor`.

Rerun the matching runtime setup script linked above to add `memory/ontology/`. Codex setup also adds the new
`.codex/agents` role files. Claude Code and Grok load roles from the updated plugin. Cursor projects using
`.cursor/agents` must update those files from the [Cursor role contracts](plugins/gobbi/runtimes/cursor/).
Setup leaves existing `.claude/settings.json` and old project role files untouched. Update those permissions
and remove obsolete role files after migrating their callers.

## Start your first session

Give Gobbi a concrete objective:

```text
Claude Code: /gobbi prepare the next release
Codex:       $gobbi prepare the next release
Grok:        /gobbi:gobbi prepare the next release
```

This checkout's Grok load is `.grok/plugins/gobbi`, so the entry is `/gobbi:gobbi`. Do not use `/local:gobbi`.
That name belonged to `.grok/skills/gobbi`, which this checkout does not register. Do not invent a `$gobbi`
alias for Grok.

Gobbi presents Cowork and Workflow and waits for your selection. It next asks for a privacy-safe session
slug. It then asks for the session-wide Partner policy: `disabled`, or one or two of `claude-code`, `codex`,
`cursor`, and `grok`.

## Cowork

Cowork is the fast path for implementation work that you direct one topic at a time. Fast delivery skips
Ideation and Planning; Light delivery runs a bounded version of both before verified Execution.

Independent review and closure run only when you explicitly request them. One isolated branch and linked
worktree hold the session, keeping your main checkout separate from the ordered local commits.

## Workflow

Workflow is the durable path for work that needs recorded decisions and quality gates. It follows:

```text
Configuration → Ideation → Planning → Execution → Wrap-up
```

Every productive step uses:

```text
DISCUSSION → WORK → RECORD
```

Execution tasks and Wrap-up also run `REVIEW` between WORK and RECORD. Ideation and Planning skip it.

After Configuration, Workflow waits until the user delivers the work. Phase 1 studies the project and
develops the design with the user, available subagents or teammates, and the remaining Partner launch set.
After each Complete phase handoff, Workflow waits at that phase's User Review for Continue or Stop.
Continue is not a new design question. Inside later phases, work stays autonomous until the next User Review.
Recorded evidence can rebuild the active route after a context boundary. Execution and Wrap-up gates must
accept the frozen result before those units advance. Workflow uses one isolated branch and linked worktree
for the full session.

## Partner

Partner is an optional session-wide policy selected after the mode and applicable slug. The policy is
`disabled` or one or two of `{claude-code,codex,cursor,grok}`. Launch set is the selected names minus the active
runtime. An empty launch set after that skip is valid and is not rewritten to `disabled`.

With `disabled`, Gobbi makes no external runtime calls. With a named set, applicable steps attempt one
invocation per remaining runtime. A launchable runtime writes the authorized worktree set and returns a
compact Handoff. Grok 1.0.5 launches with `--sandbox workspace` and worktree cwd. Cursor is a named partner
and Unavailable; do not invoke `agent` as Gobbi Partner. The worktree is the write root. A session result
path may still exist. `--always-approve` is not the restricting flag. Unavailable evidence is not a Partner
Handoff.

Every prompt names the exact worktree, the session directory inside it, and one writing path under the
worktree. The caller starts each launch through one local wrapper subagent. Wrappers for different remaining
runtimes may run in parallel. The active runtime verifies the write after the wrapper returns, assembles
the round, decides what to accept, and remains the session authority.

## License

[MIT](./LICENSE)
