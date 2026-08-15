![Gobbi logo](assets/logo.png)

# Gobbi

Open-source orchestration for Claude Code, Codex, and Grok.

<p>
  <a href="./CHANGELOG.md"><img src="https://img.shields.io/badge/version-1.1.2-blue" alt="Version 1.1.2"></a>
  <img src="https://img.shields.io/badge/runtimes-Claude%20Code%20%7C%20Codex%20%7C%20Grok-black" alt="Runtimes: Claude Code, Codex, and Grok">
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

Enable Agent Teams and allow the five Gobbi roles in your project `.claude/settings.json`:

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
      "Agent(gobbi:leader)",
      "Agent(gobbi:executor)",
      "Agent(gobbi:evaluator)",
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

Then install Gobbi from the Marketplace tab. Do not use Claude `/plugin` as the Grok install path.

A repository checkout already exposes the package through `.grok/plugins/gobbi` → `../../plugins/gobbi`. Prove
that load with `grok inspect --json`: the `plugins` list contains `name` `gobbi`, `scope` `project`,
`enabled` true, and `path` ending in `.grok/plugins/gobbi`.

Grok participants are the project `.grok/agents` roles plus official Grok subagents. Agent Teams is Claude-only.

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
`claude-code`, `codex`, and `grok`.

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
DISCUSSION → WORK → EVALUATION → RECORD
```

Phase 1 studies the project and develops the design with the user, available subagents or teammates, and the
remaining Partner launch set. Its handoff closes the user-decision window; later phases proceed autonomously
within the accepted design or stop at a recoverable checkpoint instead of asking another Workflow question.
Recorded evidence can rebuild the active route after a context boundary, and each gate must accept the frozen
result before work advances. Workflow uses one isolated branch and linked worktree for the full session.

## Partner

Partner is an optional session-wide policy selected after the mode and applicable slug. The policy is
`disabled` or one or two of `{claude-code,codex,grok}`. Launch set is the selected names minus the active
runtime. An empty launch set after that skip is valid and is not rewritten to `disabled`.

With `disabled`, Gobbi makes no external runtime calls. With a named set, applicable steps attempt one
invocation per remaining runtime. A launchable runtime writes one result at the named path and returns a
compact Handoff. Grok 1.0.4 launches with `--sandbox workspace`. The session and project postimage may change
only the contracted writing path. Named residual writes under `~/.grok/sessions/` and
`~/.grok/sandbox-events.jsonl` are allowed. Any other extra-project write is Unavailable. `--always-approve`
is not the restricting flag. Unavailable evidence is not a Partner Handoff.

Every prompt names the exact session directory and one writing path inside it. The active runtime verifies the
write, assembles the round, decides what to accept, and remains the session authority.

## License

[MIT](./LICENSE)
