![Gobbi logo](assets/logo.png)

# Gobbi

Open-source orchestration for Claude Code and Codex.

<p>
  <a href="./CHANGELOG.md"><img src="https://img.shields.io/badge/version-1.1.2-blue" alt="Version 1.1.2"></a>
  <img src="https://img.shields.io/badge/runtimes-Claude%20Code%20%7C%20Codex-black" alt="Runtimes: Claude Code and Codex">
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

## Start your first session

Give Gobbi a concrete objective:

```text
Claude Code: /gobbi prepare the next release
Codex:       $gobbi prepare the next release

General   Ordinary assistance without Gobbi session state.
Cowork    User-led, topic-by-topic implementation.
Workflow  Durable checkpointed orchestration with recorded evidence.
```

Gobbi presents all three modes and waits for your selection. For Cowork or Workflow, it next asks for a
privacy-safe session slug. It then asks whether the session-wide Partner policy is `enabled` or `disabled`.

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

Phase 1 studies the project and develops the design with the user, available subagents or teammates, and enabled
Partner. Its handoff closes the user-decision window; later phases proceed autonomously within the accepted
design or stop at a recoverable checkpoint instead of asking another Workflow question. Recorded evidence can
rebuild the active route after a context boundary, and each gate must accept the frozen result before work
advances. Workflow uses one isolated branch and linked worktree for the full session.

## Partner

Partner is an optional session-wide policy selected after the mode and applicable slug. The active runtime
fixes the direction: Claude Code uses Codex as its partner, while Codex uses Claude Code.

With `partner: disabled`, Gobbi makes no external runtime calls. With `partner: enabled`, applicable steps add
external drafts, reviews, or evaluators. The active runtime still assembles the complete round, decides what
to accept, and remains the session authority.

## License

[MIT](./LICENSE)
