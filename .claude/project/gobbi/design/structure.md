# Structure

This document describes the directory structure of the gobbi repository. Gobbi is an open-source ClaudeX tool for Claude Code. The repo serves three distinct purposes — Claude docs that teach agents, a Claude Code plugin for distribution, and a CLI for installation and management — each with its own directory layout.

---

## Gobbi Claude Docs

The `.claude/` directory is where gobbi lives as a working system. Everything an agent needs — skills, agent definitions, hooks, settings, and project state — lives here.

### Entry Points

| File | Purpose |
|:-----|:--------|
| `CLAUDE.md` | Session entry point. Core principles and workflow definition. Loaded every session. |
| `README.md` | Gobbi identity and principles. Shared across installations via the plugin system. |
| `gobbi.json` | Gobbi configuration state. |

### Skills

All skills live in `.claude/skills/` under tier-prefixed directories (e.g. `_orchestration/`, `__evaluation-project/`), each with `SKILL.md` as the entry point. Skills decompose into child documents when a single file would exceed the line limit. Some skills include `scripts/` for shell-based automation.

Skills are organized into four categories:

| Category | Skills | Purpose |
|:---------|:-------|:--------|
| **Work** | gobbi, _orchestration, _discuss, _ideation, _plan, _delegation, _execution, _note, _collection, _evaluation, _git, _notification, _gotcha | Workflow participants. Skills loaded during the ideate-plan-execute-collect cycle and at session start. |
| **Docs** | _claude, _claude-skills, _claude-agents, _claude-rules, _claude-project | `.claude/` documentation authoring. Skills for writing and maintaining claude docs. |
| **Gobbi** | __evaluation-project, __evaluation-architecture, __evaluation-performance, __evaluation-aesthetics, __evaluation-overall | Internal implementation. Gobbi's own evaluation perspective machinery. |
| **Tool** | __validate, _audit, __benchmark | Utility and maintenance tools. Verification, drift detection, benchmarking. |

Some Work skills have child skill categories grouping related sub-skills:

- **Evaluation** (child of _evaluation): _ideation-evaluation, _plan-evaluation, _execution-evaluation — stage-specific criteria
- **Notification** (child of _notification): _slack, _telegram, _discord — channel-specific setup
- **Gotcha** (child of _gotcha): _project-gotcha, _skills-gotcha — how to record different types of gotchas

The `_gotcha/` skill is special — it contains per-skill gotcha files (`_orchestration.md`, `_git.md`, etc.) that record cross-project mistakes. Every agent checks the relevant gotcha file before starting work.

### Agents

Agent definitions live in `.claude/agents/`. Each file defines a specialist subagent with its model, tools, and instructions.

| Agent | Role |
|:------|:-----|
| _pi | Principal Investigator — ideation and planning through user discussion |
| _planner | Plan decomposition and task structuring |
| _developer | Code implementation and verification |
| __evaluator-project | Project-scope evaluator |
| __evaluator-architecture | Architecture-level evaluator |
| __evaluator-performance | Performance-level evaluator |
| __evaluator-aesthetics | Aesthetics-level evaluator |
| __evaluator-overall | Overall cross-dimension evaluator |
| __skills-grader | Skill trigger accuracy and output quality testing |
| __skills-comparator | Blind comparison of skill versions |
| __skills-analyzer | Synthesize grading and comparison into improvement recommendations |

### Hooks

Shell scripts in `.claude/hooks/` that execute in response to Claude Code events. Currently focused on notifications — session lifecycle, completion, errors, and attention-needed alerts.

### Settings

| File | Purpose |
|:-----|:--------|
| `settings.json` | Project-level Claude Code settings. Checked into git. |
| `settings.local.json` | Local overrides. Not checked into git. |
| `.env` | Environment variables for hooks. Not checked into git. |

### Project State

`.claude/project/gobbi/` holds project-specific state that persists across sessions.

| Directory | Purpose | Git-tracked |
|:----------|:--------|:------------|
| `design/` | Design documents — architecture, vision, workflow, evaluation model | Yes |
| `gotchas/` | Project-specific gotchas (distinct from cross-project gotchas in skills) | Yes |
| `rules/` | Project-specific rules and conventions | Yes |
| `reference/` | External references, API docs, research materials | Yes |
| `docs/` | Other project documents | Yes |
| `note/` | Workflow notes per task session — ephemeral, managed by _note | No |

### Worktrees

`.claude/worktrees/` is the directory where git worktrees are created for isolated task execution. Each worktree maps to one branch and one PR. Managed entirely by the orchestrator, cleaned up after merge. Gitignored.

---

## Claude Code Gobbi Plugin

The `plugins/gobbi/` directory packages gobbi as a Claude Code plugin for distribution and installation.

### Plugin Structure

The plugin uses symlinks to reference the canonical files in `.claude/`. This means the plugin always reflects the current state of the working system — no manual sync needed.

| Path | Type | Points to |
|:-----|:-----|:----------|
| `.claude-plugin/plugin.json` | File | Plugin manifest — name, version, description, skill path |
| `settings.json` | File | Plugin settings merged into the target project on install |
| `README.md` | Symlink | `../../.claude/README.md` |
| `skills/*/` | Symlinks | `../../../.claude/skills/*/` |
| `agents/*.md` | Symlinks | `../../../.claude/agents/*.md` |
| `hooks/*.sh` | Symlinks | `../../../.claude/hooks/*.sh` |

### Marketplace Registration

`.claude-plugin/marketplace.json` at the repo root registers gobbi in the Claude Code plugin marketplace. It points to `plugins/gobbi/` as the plugin source.

### Templates

`templates/` contains the source files that `gobbi install` copies into a target project's `.claude/` directory. The template structure mirrors the `.claude/` layout — skills, agents, hooks, settings, and README.md. Templates represent the installable snapshot; the working `.claude/` directory is the development copy.

---

## Gobbi CLI

> **Planned for v0.3.0.** The CLI will be restructured as a standalone package for managing gobbi installations — creating, installing, updating, and configuring gobbi in target projects.

The current CLI source lives in `src/` with commands in `src/commands/` and shared libraries in `src/lib/`. The `packages/market/` workspace provides the marketplace client. Both will be reorganized in v0.3.0.
