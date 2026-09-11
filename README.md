![Gobbi logo](assets/logo.png)

# Gobbi

Open-source orchestration for Claude Code, Codex, Cursor, and Grok.

<p>
  <a href="./CHANGELOG.md"><img src="https://img.shields.io/badge/version-1.2.4-blue" alt="Version 1.2.4"></a>
  <img src="https://img.shields.io/badge/runtimes-Claude%20Code%20%7C%20Codex%20%7C%20Cursor%20%7C%20Grok-black" alt="Runtimes: Claude Code, Codex, Cursor, and Grok">
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/HahyeonJeon/gobbi" alt="License: MIT"></a>
</p>

Gobbi is an orchestration system that brings structured planning, implementation, evaluation, and durable
handoffs to the AI coding tools you already use. You choose the operating depth for each session, from
ordinary assistance to fast topic-by-topic work or a fully recorded lifecycle. Gobbi never preselects the
mode for you.

The name comes from 고삐 (*gobbi*), Korean for "reins."

## Install

### Claude Code

Run these commands in a Claude Code session:

```text
/plugin marketplace add HahyeonJeon/gobbi
/plugin install gobbi@gobbi
/reload-plugins
```

Enable Agent Teams and allow the five Gobbi roles in your project `.claude/settings.json`.
Manager owns the user, the mode, and acceptance. Assistant owns lookup and named Memory work.
Developer, designer, and author are specialists. Pipeline work is a briefed phase, not a role.

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  },
  "teammateMode": "in-process",
  "permissions": {
    "allow": [
      "Skill(gobbi:gobbi)",
      "Skill(gobbi:principles)",
      "Agent(gobbi:manager)",
      "Agent(gobbi:developer)",
      "Agent(gobbi:designer)",
      "Agent(gobbi:author)",
      "Agent(gobbi:assistant)"
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

Codex needs no Claude Code Agent Teams or permission configuration. A repository checkout also includes local
entrypoints, so contributors working in the clone do not need to install the plugin.

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

Grok participants are the project `.grok/agents` roles plus official Grok subagents. Agent Teams is Claude-only.

### Cursor

A repository checkout already exposes Cursor participants through `.cursor/agents` and `.cursor/skills`. Start
the parent session as `grok-4.6[effort=xhigh]`, then load Gobbi from `.cursor/skills`. The required binary is
`cursor-agent`, never bare `agent`. Official help uses `agent`; that name is not Gobbi Partner.

Gobbi does not ship a Cursor marketplace plugin. Cursor participants are the project `.cursor/agents` roles
plus official Cursor subagents. Agent Teams is Claude-only.

After install, the standalone `gobbi-setup` skill creates only missing Gobbi layout, instruction placeholders,
Claude Code settings, and Codex role contracts. It reports the rest. Gobbi entry does not run setup.

## Start your first session

Give Gobbi a concrete objective:

```text
Claude Code: /gobbi prepare the next release
Codex:       $gobbi prepare the next release
Grok:        /local:gobbi prepare the next release
             After a marketplace or `.grok/plugins` install, use /gobbi:gobbi
```

After `.grok/skills/gobbi` exists, checkout-local Grok invokes Gobbi as `/local:gobbi`. A marketplace or
project-plugin load invokes it as `/gobbi:gobbi`. The two forms differ; do not invent a `$gobbi` alias for
Grok.

Gobbi presents all three modes and waits for your selection. For Cowork or Workflow, it next asks for a
privacy-safe session slug. It then asks for the session-wide Partner policy: `disabled`, or one or two of
`claude-code`, `codex`, `cursor`, and `grok`.

## Cowork

Cowork is the fast path for implementation work that you direct one topic at a time. Fast delivery skips
Ideation and Planning; Light delivery runs a bounded version of both before verified Execution.

Independent evaluation and closure run only when you explicitly request them. One isolated branch and linked
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

Execution tasks and Wrap-up also run `EVALUATION` between WORK and RECORD. Ideation and Planning skip it.

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
