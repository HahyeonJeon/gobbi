<h1 align="center">gobbi</h1>
<p align="center">Open-source orchestration for Claude Code and Codex</p>
<p align="center"><sub>고삐 (gobbi) — Korean for reins</sub></p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/HahyeonJeon/gobbi" alt="License: MIT"></a>
  <a href="./CHANGELOG.md"><img src="https://img.shields.io/badge/version-1.0.1-blue" alt="Version 1.0.1"></a>
  <img src="https://img.shields.io/badge/runtimes-Claude%20Code%20%7C%20Codex-black" alt="Runtimes: Claude Code and Codex">
</p>

---

Gobbi lets you choose how much orchestration a task needs. It offers three modes at every entry: General for
ordinary assistance, Cowork for fast implementation one topic at a time, and Workflow for a durable, recorded
lifecycle that an independent partner system reviews at every step. You pick the mode; Gobbi never picks it
for you.

Gobbi ships no binary and no framework. It is 28 top-level skills and 5 agent role prompts that Claude Code
and Codex already know how to load. With their children, those skills are 92 documents.

## Install

Both marketplace commands below resolve `HahyeonJeon/gobbi` to the repository's default branch. That branch
serves version 1.0.1 only once this release is merged into it. Until then an install delivers whatever version
the default branch currently holds.

### Claude Code

Type these in a Claude Code session:

```text
/plugin marketplace add HahyeonJeon/gobbi
/plugin install gobbi@gobbi
/reload-plugins
```

A plugin distributes skills and agents. It contributes no `env` block and no `permissions` block, so the
settings Gobbi needs are yours to add. Put these in your project's `.claude/settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  },
  "permissions": {
    "allow": [
      "Skill(gobbi:gobbi)",
      "Skill(gobbi:principles)",
      "Skill(gobbi:ideation)",
      "Skill(gobbi:planning)",
      "Skill(gobbi:wrap-up)",
      "Skill(gobbi:delegation)",
      "Skill(gobbi:discussion)",
      "Skill(gobbi:record)",
      "Skill(gobbi:memory)",
      "Skill(gobbi:git)",
      "Skill(gobbi:cowork)",
      "Skill(gobbi:workflow)",
      "Agent(gobbi:manager)",
      "Agent(gobbi:leader)",
      "Agent(gobbi:executor)",
      "Agent(gobbi:evaluator)",
      "Agent(gobbi:assistant)"
    ]
  }
}
```

- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` enables Agent Teams. Without it no team is set up and no teammate is
  spawned. Claude Code reads the variable when it starts, so set it before the session rather than during one.
- Each `Skill(...)` entry allows one skill to be loaded without a prompt. The twelve listed are the entry
  skill, the nine it loads before a mode is chosen, and the two mode owners. Every other Gobbi skill loads
  from its own trigger and asks the first time; add it here when you want that prompt gone.
- Each `Agent(...)` entry allows one role to be spawned. A role without its entry cannot be spawned at all.
- Nothing outside the named component is granted, so this list widens your permissions by exactly the skills
  and roles it names.

Gobbi's entry reads these at the start of a session and names any that are missing, so a wrong or partial
settings file reports itself rather than failing silently.

The names are namespaced because the plugin namespaces every component it contributes. In a project whose only
source of Gobbi is the plugin, `Skill(gobbi:principles)` and `Agent(gobbi:leader)` are what Claude Code
offers, and the bare `Skill(principles)` and `Agent(leader)` are not offered at all. This repository's own
[.claude/settings.json](.claude/settings.json) uses the bare form for the same components, because it resolves
its skills from its own `.claude/skills` directory rather than from the plugin. The two forms are not a
disagreement: each one names where the skill comes from, so use the namespaced form when Gobbi arrives as a
plugin and the bare form when it is already in your own tree.

### Codex

```bash
codex plugin marketplace add HahyeonJeon/gobbi
codex plugin add gobbi@gobbi-workspace
```

A Codex install receives both manifests and the whole skill tree, nested children included — an installed
cache holds `skills/workflow/phase-1/SKILL.md` and `skills/memory/design/SKILL.md` as individual files, not
only the top-level skills. Native Codex has neither the Agent Teams variable nor the permission gates, so the
Claude Code settings above have no Codex equivalent to add.

The package holds real files rather than links. The Codex plugin installer copies a plugin into its cache
without following symlinks, so the earlier symlinked package arrived as two manifests and nothing else; that
is an open Codex defect, [openai/codex#24770](https://github.com/openai/codex/issues/24770), "Plugin install:
support symlinks per the cross-agent marketplace contract". Every skill and agent still has exactly one
canonical owner in `.gobbi/projects/gobbi/`. The package copy is generated from that owner and a guard proves
it byte-equal before release, so the copy is never edited by hand and the two cannot drift apart.

Working inside the clone itself needs no install at all. This repository carries its own entry contracts at
[.claude/CLAUDE.md](.claude/CLAUDE.md) and [AGENTS.md](AGENTS.md).

## Start a session

Name a concrete objective. Gobbi asks which mode to use and waits for your answer:

```text
> /gobbi review the auth module and fix what is broken

  General   Ordinary assistance. No session state.
  Cowork    Fast topic-by-topic implementation.
  Workflow  Durable five-step orchestration with recorded evidence.
```

Gobbi may recommend a mode, but nothing is preselected. Cowork and Workflow create an isolated branch and
worktree before the first edit, so your main checkout stays untouched. A resume keeps the mode already
established; only missing or conflicting evidence reopens the question.

## Three modes

| Mode | Best for | Operating model |
|---|---|---|
| **General** | Questions and bounded tasks that need no orchestration. | The Gobbi behavioral floor plus task skills. No session state. |
| **Cowork** | Fast implementation where you supply topics step by step. | Per topic: optional Ideation, optional Planning, verified Execution. Evaluation and Wrap-up run on your call. |
| **Workflow** | Large work that needs recorded evidence and independent quality gates. | `Configuration → Ideation → Planning → Execution → Wrap-up`, each productive step `DISCUSSION → WORK → EVALUATION → RECORD`. |

## The Workflow loop

Workflow runs `Configuration → Ideation → Planning → Execution → Wrap-up`. Every productive step inside it
runs `DISCUSSION → WORK → EVALUATION → RECORD`. Each WORK stage runs one partner round. The partner is the
system your runtime is not: in Claude Code the partner is Codex, and in Codex the partner is Claude Code.

1. Both systems receive the same neutral contract and write separate drafts.
2. Both drafts freeze before either system sees the other.
3. Each draft is then reviewed by the system that did not write it.
4. The active runtime synthesizes the canonical candidate.
5. You resolve every material open decision before evaluation.

Every EVALUATION then uses two fresh independent evaluators covering Project, Structure, Performance,
Aesthetics, Usage, Consistency, Risk, and Overall. No finding is applied before you approve its disposition.

Cowork and Workflow each keep one isolated branch, one linked worktree, and focused verified local commits.
Push, pull request, merge, and cleanup are separate actions you authorize.

## What's inside

| Group | Skills |
|---|---|
| Session | `gobbi` `cowork` `workflow` |
| Method | `ideation` `planning` `execution` `evaluation` `discussion` `delegation` `study` `startup` |
| Record | `memory` `record` `wrap-up` `git` |
| Craft | `typescript` `go` `react` `css` `html` `web` `desktop` `electron` |
| Authoring | `skill-writing` `agent-writing` `claude-plugin` `codex` |
| Floor | `principles` |

Five agent roles — manager, leader, executor, evaluator, and assistant — ship as canonical Markdown with
native Codex wrappers.

## Documentation

| To learn | Read |
|---|---|
| How Gobbi starts and how modes are selected | [`gobbi`](.gobbi/projects/gobbi/skills/gobbi/SKILL.md) |
| How topic-by-topic Cowork runs | [`cowork`](.gobbi/projects/gobbi/skills/cowork/SKILL.md) |
| How the five-step Workflow runs | [`workflow`](.gobbi/projects/gobbi/skills/workflow/SKILL.md) |
| How work is reviewed and given a verdict | [`evaluation`](.gobbi/projects/gobbi/skills/evaluation/SKILL.md) |
| How branches, worktrees, and commits are handled | [`git`](.gobbi/projects/gobbi/skills/git/SKILL.md) |

## License

[MIT](./LICENSE)
