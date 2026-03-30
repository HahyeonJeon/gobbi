# Structure

This document describes the directory structure of the gobbi repository. The repo serves three distinct purposes — Claude docs that teach agents, a Claude Code plugin for distribution, and a CLI for installation and management — each with its own directory layout.

---

## Gobbi Claude Docs

The `.claude/` directory is where gobbi lives as a working system. Everything an agent needs — skills, agent definitions, hooks, settings, and project state — lives here.

### Entry Points

| File | Purpose |
|:-----|:--------|
| `CLAUDE.md` | Session entry point. Core principles and workflow definition. Loaded every session. |
| `GOBBI.md` | Gobbi identity and principles. Shared across installations via the plugin system. |
| `gobbi.json` | Gobbi configuration state. |

### Skills

All skills live in `.claude/skills/gobbi-*/`, each in its own flat directory with `SKILL.md` as the entry point. Skills decompose into child documents when a single file would exceed the line limit. Some skills include `scripts/` for shell-based automation.

Skills are organized by function:

| Category | Skills | Purpose |
|:---------|:-------|:--------|
| **Core** | gobbi, gobbi-orchestration, gobbi-claude, gobbi-gotcha, gobbi-git | Always loaded. Entry point, workflow coordination, doc standard, mistake recording, git lifecycle. |
| **Workflow** | gobbi-discuss, gobbi-ideation, gobbi-plan, gobbi-delegation, gobbi-execution, gobbi-note, gobbi-collection | Loaded per step. Discussion, idea refinement, task decomposition, agent briefing, implementation, note writing, trail persistence. |
| **Evaluation** | gobbi-evaluation, gobbi-ideation-evaluation, gobbi-plan-evaluation, gobbi-execution-evaluation | Loaded during evaluation. Framework and stage-specific criteria. |
| **Authoring** | gobbi-claude-skills, gobbi-claude-agents | Loaded when creating or modifying skill and agent definitions. |
| **Utilities** | gobbi-notification, gobbi-validate, gobbi-audit, gobbi-benchmark, gobbi-project-context | On-demand. Notifications, structural validation, drift detection, skill benchmarking, project detection. |

The `gobbi-gotcha/` skill is special — it contains per-skill gotcha files (`gobbi-orchestration.md`, `gobbi-git.md`, etc.) that record cross-project mistakes. Every agent checks the relevant gotcha file before starting work.

### Agents

Agent definitions live in `.claude/agents/`. Each file defines a specialist subagent with its model, tools, and instructions.

| Agent | Role |
|:------|:-----|
| gobbi-pi | Principal Investigator — ideation and planning through user discussion |
| gobbi-planner | Plan decomposition and task structuring |
| gobbi-developer | Code implementation and verification |
| gobbi-evaluator-positive | Positive-stance evaluator |
| gobbi-evaluator-moderate | Moderate-stance evaluator |
| gobbi-evaluator-critical | Critical-stance evaluator |
| gobbi-skills-grader | Skill trigger accuracy and output quality testing |
| gobbi-skills-comparator | Blind comparison of skill versions |
| gobbi-skills-analyzer | Synthesize grading and comparison into improvement recommendations |

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
| `note/` | Workflow notes per task session — ephemeral, managed by gobbi-note | No |

### Worktrees

`.claude/worktrees/` is the directory where git worktrees are created for isolated task execution. Each worktree maps to one branch and one PR. Managed entirely by the orchestrator, cleaned up after merge. Gitignored.

---

## Claude Code Gobbi Plugin

The `plugins/gobbi-core/` directory packages gobbi as a Claude Code plugin for distribution and installation.

### Plugin Structure

The plugin uses symlinks to reference the canonical files in `.claude/`. This means the plugin always reflects the current state of the working system — no manual sync needed.

| Path | Type | Points to |
|:-----|:-----|:----------|
| `.claude-plugin/plugin.json` | File | Plugin manifest — name, version, description, skill path |
| `settings.json` | File | Plugin settings merged into the target project on install |
| `GOBBI.md` | Symlink | `../../.claude/GOBBI.md` |
| `skills/gobbi-*` | Symlinks | `../../../.claude/skills/gobbi-*` |
| `agents/gobbi-*.md` | Symlinks | `../../../.claude/agents/gobbi-*.md` |
| `hooks/*.sh` | Symlinks | `../../../.claude/hooks/*.sh` |

### Marketplace Registration

`.claude-plugin/marketplace.json` at the repo root registers gobbi in the Claude Code plugin marketplace. It points to `plugins/gobbi-core/` as the plugin source.

### Templates

`templates/` contains the source files that `gobbi install` copies into a target project's `.claude/` directory. The template structure mirrors the `.claude/` layout — skills, agents, hooks, settings, and GOBBI.md. Templates represent the installable snapshot; the working `.claude/` directory is the development copy.

---

## Gobbi CLI

> **Planned for v0.3.0.** The CLI will be restructured as a standalone package for managing gobbi installations — creating, installing, updating, and configuring gobbi in target projects.

The current CLI source lives in `src/` with commands in `src/commands/` and shared libraries in `src/lib/`. The `packages/market/` workspace provides the marketplace client. Both will be reorganized in v0.3.0.
