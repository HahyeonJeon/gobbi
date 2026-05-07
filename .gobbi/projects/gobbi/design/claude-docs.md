# Docs

Inventory of all `.claude/` documentation files in gobbi. Reflects the current state of the repository.

---

## Category System

Skills are organized into three top-level categories: **Work** (workflow participants loaded during the ideate-plan-execute-collect cycle), **Docs** (skills about writing and maintaining `.claude/` docs), and **Tool** (utility and maintenance tools). Work skills can have child skill categories that describe more specific principles under the parent. The `gobbi` interface skill stands alone with no category.

---

## Inventory

### Root

| Name | Path | Description |
|------|------|-------------|
| CLAUDE.md | `.claude/CLAUDE.md` | Session entry point. Core principles, workflow cycle, evaluation mandate, and skill reload trigger. |
| README.md | `.claude/README.md` | Gobbi identity doc. "Korean for reins" — users talk, gobbi handles the rest. |

### Rules

| Name | Path | Description |
|------|------|-------------|
| gobbi-rule | `.claude/rules/gobbi-rule.md` | Core behavioral rules always-active safety net. |

### Agents

| Name | Path | Description |
|------|------|-------------|
| gobbi-agent | `.claude/agents/gobbi-agent.md` | Onboarding and setup assistant. Project directory setup, notification configuration, workflow orientation. |
| skills-evaluator | `.claude/agents/skills-evaluator.md` | Runs evaluation of skill definitions across all perspectives. |
| agent-evaluator | `.claude/agents/agent-evaluator.md` | Runs evaluation of agent definitions across all perspectives. |
| project-evaluator | `.claude/agents/project-evaluator.md` | Runs evaluation of project work output across all perspectives. |
| executor | `.claude/agents/executor.md` | Code implementation, file creation/modification, TypeScript development, build system changes. |
| pi | `.claude/agents/pi.md` | Principal Investigator. Deep problem analysis, requirement refinement, technical investigation, and task decomposition. |
| researcher | `.claude/agents/researcher.md` | Investigation and research. Explores problem spaces, gathers evidence, and produces research artifacts for downstream steps. |

### Skills

#### gobbi

Standalone interface entry point — no category.

| Name | Path | Description |
|------|------|-------------|
| gobbi | `.claude/skills/gobbi/SKILL.md` | Entry point. Loads agent principles, skill map, and session setup questions. |

#### Work

**Workflow participants** — skills loaded during the ideate-plan-execute-collect cycle.

| Name | Path | Description |
|------|------|-------------|
| orchestration | `.claude/skills/orchestration/SKILL.md` | Workflow coordinator. Task routing, phase transitions, step tracking. |
| discuss | `.claude/skills/discuss/SKILL.md` | Structured discussion via AskUserQuestion. Challenges vague thinking, surfaces problems. |
| ideation | `.claude/skills/ideation/SKILL.md` | Brainstorming and option exploration. Contribution points, trade-offs, risk analysis. |
| plan | `.claude/skills/plan/SKILL.md` | Task decomposition into narrow, specific, agent-assigned subtasks. |
| delegation | `.claude/skills/delegation/SKILL.md` | Subagent briefing with context layers and scope boundaries. |
| execution | `.claude/skills/execution/SKILL.md` | Single-task execution guide: study, plan, implement, verify. |
| collection | `.claude/skills/collection/SKILL.md` | Workflow trail persistence. Prompt, plan, task results, README. |
| note | `.claude/skills/note/SKILL.md` | Note writing at every workflow step. Decisions, outcomes, context. |
| evaluation | `.claude/skills/evaluation/SKILL.md` | Evaluation orchestration. Selecting perspectives, spawning evaluators, synthesizing findings. |
| git | `.claude/skills/git/SKILL.md` | Git/GitHub workflow. Worktree isolation, branch lifecycle, PR management. |
| notification | `.claude/skills/notification/SKILL.md` | Configure Claude Code notifications (Slack, Telegram, others). |
| gotcha | `.claude/skills/gotcha/SKILL.md` | Cross-project mistake recording. Check before acting, write after corrections. |

##### Notification child skills

**Channel-specific notification setup** — one skill per notification channel.

| Name | Path | Description |
|------|------|-------------|
| slack.md | `.claude/skills/notification/slack.md` | Slack notification setup — child doc of notification. |
| telegram.md | `.claude/skills/notification/telegram.md` | Telegram notification setup — child doc of notification. |
| discord.md | `.claude/skills/notification/discord.md` | Discord notification setup — child doc of notification. |

#### Docs

**`.claude/` documentation authoring** — skills about writing and maintaining claude docs.

| Name | Path | Description |
|------|------|-------------|
| claude | `.claude/skills/claude/SKILL.md` | Core `.claude/` writing standard. Principles, hierarchy, anti-patterns, review checklist. |
| skills-doc | `.claude/skills/skills-doc/SKILL.md` | Reference and guide for creating skill definitions. |
| agents-doc | `.claude/skills/agents-doc/SKILL.md` | Reference and guide for creating agent definitions. |
| rules-doc | `.claude/skills/rules-doc/SKILL.md` | Guide for authoring rule files. |
| project-doc | `.claude/skills/project-doc/SKILL.md` | Guide for authoring project docs in `.claude/project/{project-name}/`. |

#### Tool

**Utility and maintenance tools** — verification, drift detection, benchmarking.

| Name | Path | Description |
|------|------|-------------|
| gobbi-cli | `.claude/skills/gobbi-cli/SKILL.md` | Intent-first CLI reference. Maps user intentions to gobbi CLI commands. |

### Skill Child Docs

| Name | Parent Skill | Path | Description |
|------|-------------|------|-------------|
| project-context.md | gobbi | `.claude/skills/gobbi/project-context.md` | Session-start project detection. Recommend skills based on technology stack. |
| authoring.md | skills-doc | `.claude/skills/skills-doc/authoring.md` | How to write skill content: description and instruction writing. |
| verification.md | skills-doc | `.claude/skills/skills-doc/verification.md` | Skill quality verification: trigger accuracy, output evaluation. |
| conventions.md | git | `.claude/skills/git/conventions.md` | Branch naming, commit messages, PR template, issue format, sub-issues. |
| feedback.md | orchestration | `.claude/skills/orchestration/feedback.md` | FEEDBACK phase: iteration tracking, stagnation detection, round cap. |
| finish.md | orchestration | `.claude/skills/orchestration/finish.md` | FINISH phase: merge/commit/compact decision tree, pre-action verification. |

### Gotcha Files

| Name | Path | Description |
|------|------|-------------|
| security | `.claude/skills/gotcha/security.md` | Security vulnerability signals for evaluators. |
| system | `.claude/skills/gotcha/system.md` | Environment, processes, hooks, infrastructure. |

### Project Docs

| Name | Path | Description |
|------|------|-------------|
| architecture.md | `.claude/project/gobbi/design/architecture.md` | Four pillars: workflow, workers, effectiveness, quality measurement. |
| structure.md | `.claude/project/gobbi/design/structure.md` | Directory structure: Claude docs, plugin distribution, CLI. |
| claude-docs.md | `.claude/project/gobbi/design/claude-docs.md` | This file. Inventory of all `.claude/` documentation. |
| README.md | `.claude/project/gobbi/README.md` | Gobbi project overview. Open-source ClaudeX tool for Claude Code. |
| note/README.md | `.claude/project/gobbi/note/README.md` | Index of workflow notes with dates, sessions, and task summaries. |

---

## Summary

| Category | Count |
|----------|-------|
| Root | 2 |
| Rules | 1 |
| Agents — Interface | 1 |
| Agents — Evaluators | 3 |
| Agents — Implementation | 3 |
| Skills — Interface | 1 |
| Skills — Work | 12 |
| Skills — Work (child: Notification) | 3 |
| Skills — Docs | 5 |
| Skills — Tool | 1 |
| Skill child docs | 6 |
| Evaluation perspective docs | 18 (6 per target: skills-doc, agents-doc, project-doc) |
| Gotcha files | 2 |
| Project docs | 5 |
| **Total** | **56** skills + 18 evaluation child docs |

---

## Design Decisions

### Naming Convention

Skill directory names and agent filenames use **hyphens as word separators** with no underscores. `gobbi` is the single interface entry point (no prefix, no hyphen). All other names are plain hyphen-separated words. The exception is `gobbi-agent` and similar plugin-distributed agents that use `gobbi-` for external identity.

### Gotcha System

Cross-cutting gotcha files live in `gotcha/` (`gotcha/system.md`, `gotcha/security.md`). Skill-specific gotchas colocate with their skill at `{skill-name}/gotchas.md`. Guidance on how to record each type of gotcha lives as child docs inside `gotcha/`.

### Plugin Registration

`executor`, `pi`, and `researcher` are orchestrator-internal agents — they are spawned by the orchestrator as delegation targets, not invoked directly by users. They are intentionally not registered in `plugins/gobbi/.claude-plugin/plugin.json`. Only user-invokable agents (`gobbi-agent`, `agent-evaluator`, `project-evaluator`, `skills-evaluator`) appear in the plugin manifest.

### Pending Decisions

- Whether agents follow the same category system as skills
- Benchmark scenarios categorization
