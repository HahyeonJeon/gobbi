<h1 align="center">gobbi</h1>
<p align="center">Open-source orchestration for Claude Code and Codex</p>
<p align="center"><sub>고삐 (gobbi) — Korean for reins</sub></p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/HahyeonJeon/gobbi" alt="License: MIT"></a>
  <a href="./CHANGELOG.md"><img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version 1.0.0"></a>
  <img src="https://img.shields.io/badge/runtimes-Claude%20Code%20%7C%20Codex-black" alt="Runtimes: Claude Code and Codex">
</p>

---

Gobbi lets you choose how much orchestration a task needs. It offers three modes at every entry: General for
ordinary assistance, Cowork for fast implementation one topic at a time, and Workflow for a durable, recorded,
dual-system lifecycle. You pick the mode; Gobbi never picks it for you.

Gobbi ships no binary and no framework. It is 28 top-level skills and 5 agent role prompts that Claude Code
and Codex already know how to load. With their children, those skills are 90 documents.

## Install

Both marketplace commands below resolve `HahyeonJeon/gobbi` to the repository's default branch. That branch
serves version 1.0.0 only once this release is merged into it. Until then an install delivers whatever version
the default branch currently holds.

### Claude Code

Type these in a Claude Code session:

```text
/plugin marketplace add HahyeonJeon/gobbi
/plugin install gobbi@gobbi
/reload-plugins
```

Gobbi uses Agent Teams. Set `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` before starting Claude Code, or add it
to the `env` block of your settings file.

### Codex

```bash
codex plugin marketplace add HahyeonJeon/gobbi
codex plugin add gobbi@gobbi-workspace
```

A Codex install currently receives both manifests and no skills. The Codex plugin installer copies a plugin
into its cache without following symlinks, and Gobbi's package symlinks to one canonical skill source. This is
an open Codex defect — [openai/codex#24770](https://github.com/openai/codex/issues/24770), "Plugin install:
support symlinks per the cross-agent marketplace contract". Gobbi keeps a single canonical source and will not
copy it into the package to work around an installer bug.

Codex skill discovery does follow symlinks, so until the defect is fixed, clone this repository and link its
skills into your own project:

```bash
mkdir -p .agents/skills
ln -s /path/to/gobbi/.gobbi/projects/gobbi/skills/* .agents/skills/
```

Link, do not copy. The skills reach outside their own directory — the entry skill loads
`../../agents/manager.md` — and only a link keeps those paths resolving. A `git pull` in the clone then
updates every linked skill. `ln -s` refuses any name that already exists and prints it, so nothing of yours is
replaced. Use `~/.agents/skills` instead to install Gobbi for every project in one shared namespace.

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
runs `DISCUSSION → WORK → EVALUATION → RECORD`. Each WORK stage uses Claude and Codex independently:

1. Both systems receive the same neutral contract and write separate drafts.
2. Both drafts freeze before either system sees the other.
3. Claude reviews the Codex draft, and Codex reviews the Claude draft.
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
