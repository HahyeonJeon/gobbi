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
| `gobbi.json` | Legacy gobbi configuration state — superseded by the three-level `settings.json` cascade in v0.5.0. Deleted by `ensureSettingsCascade` on first run; see `v050-features/gobbi-config/README.md` for the full cascade model. |

### Skills

All skills live in `.claude/skills/` under tier-prefixed directories (e.g. `_orchestration/`, `_skills/`), each with `SKILL.md` as the entry point. Skills decompose into child documents when a single file would exceed the line limit. Some skills include `scripts/` for shell-based automation.

Skills are organized into four categories:

| Category | Skills | Purpose |
|:---------|:-------|:--------|
| **Work** | gobbi, _orchestration, _discuss, _ideation, _plan, _delegation, _execution, _note, _collection, _evaluation, _git, _notification, _gotcha | Workflow participants. Skills loaded during the ideate-plan-execute-collect cycle and at session start. |
| **Docs** | _claude, _skills, _agents, _rules, _project | `.claude/` documentation authoring. Skills for writing and maintaining claude docs. |
| **Tool** | _gobbi-cli | Utility and maintenance tools. Intent-first CLI reference. |

Some skills have child directories grouping related sub-docs:

- **Evaluation perspectives** — each Docs skill that supports evaluation has an `evaluation/` subdirectory with 6 perspective docs (project, architecture, performance, aesthetics, overall, user): `_skills/evaluation/`, `_agents/evaluation/`, `_project/evaluation/`
- **Notification** (child of _notification): `slack.md`, `telegram.md`, `discord.md` — channel-specific setup docs
- **Gotcha** (child of _gotcha): child docs (not skills) describing how to record each type of gotcha

The `_gotcha/` skill is special — it contains per-skill gotcha files (`_orchestration.md`, `_git.md`, etc.) that record cross-project mistakes. Every agent checks the relevant gotcha file before starting work.

### Agents

Agent definitions live in `.claude/agents/`. Each file defines a specialist subagent with its model, tools, and instructions.

| Agent | Role |
|:------|:-----|
| gobbi-agent | Onboarding and setup assistant — helps users configure their Claude Code environment |
| __pi | Principal Investigator — ideation, planning, and task decomposition through user discussion |
| __executor | Code implementation and verification |
| _skills-evaluator | Runs evaluation of skill definitions across all perspectives |
| _agent-evaluator | Runs evaluation of agent definitions across all perspectives |
| _project-evaluator | Runs evaluation of project work output across all perspectives |

### Hooks

Shell scripts in `.claude/hooks/` that execute in response to Claude Code events. Currently focused on notifications — session lifecycle, completion, errors, and attention-needed alerts.

### Settings

| File | Purpose |
|:-----|:--------|
| `settings.json` | Claude Code project settings (not gobbi config). Checked into git. |
| `settings.local.json` | Claude Code local overrides. Not checked into git. |
| `.env` | Environment variables for hooks. Not checked into git. |

Note: `.gobbi/settings.json` is the gobbi workspace-level preference file — separate from `.claude/settings.json` above. The three-level gobbi cascade is: workspace `.gobbi/settings.json` → project `.gobbi/project/settings.json` → session `.gobbi/sessions/{id}/settings.json`. See `v050-features/gobbi-config/README.md` for the full cascade model. Note: `.gobbi/config.db` no longer exists — it was the SQLite session store used in an earlier design and is deleted by `ensureSettingsCascade` on first run of v0.5.0.

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

## v0.5.0 Directory Split

> **`.claude/` is read-only during workflow. `.gobbi/` is written freely during workflow.**

v0.5.0 introduces a hard boundary between Claude Code's native directory and gobbi's runtime state. Writing to `.claude/` mid-workflow triggers the Claude Code idle detection heuristic — the model interprets its own file edits as meaningful changes and stalls. The split eliminates this by keeping all workflow writes out of `.claude/`.

### `.gobbi/` Directory

Gobbi's runtime state directory, separate from `.claude/`. Created at the project root alongside `.claude/`.

| Directory | Purpose |
|:----------|:--------|
| `sessions/` | Workflow session data — `state.json`, `state.json.backup`, `gobbi.db` (SQLite event store), `metadata.json`, `events.jsonl` (human-readable event log), and one subdirectory per step containing notes, research, and execution output |
| `worktrees/` | Git worktree isolation — moved from `.claude/worktrees/` to prevent idle false-positives during branch operations |
| `project/` | Project notes, gotchas, and context — moved from `.claude/project/` so workflow writes do not touch `.claude/` |

`.claude/` retains only static content: skills, agent definitions, hooks, settings, and `CLAUDE.md`. Nothing written during a workflow session goes into `.claude/`.

### Step Spec Files

`packages/cli/src/specs/` contains the step specification files that define the v0.5.0 workflow graph.

| Path | Purpose |
|:-----|:--------|
| `index.json` | Workflow graph — step ordering, transition guards, entry points |
| `{step}/spec.json` | Per-step definition — content blocks, meta, transitions, delegation assignments, preconditions |
| `_shared/` | Reusable prompt blocks shared across step specs |

The CLI reads these specs at runtime to compile prompts and enforce transitions. Specs are the source of truth for what each workflow step does and what must be true before it can run.

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

> **Planned for v0.3.0.**

The CLI will be restructured as a standalone package for managing gobbi installations — creating, installing, updating, and configuring gobbi in target projects.

The current CLI source lives in `src/` with commands in `src/commands/` and shared libraries in `src/lib/`. The `packages/market/` workspace provides the marketplace client. Both will be reorganized in v0.3.0.
