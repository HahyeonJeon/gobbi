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
| __gobbi-convention | `.claude/rules/__gobbi-convention.md` | Naming convention: underscore tiers with hyphen word separators (interface, hidden, internal). |

### Agents

#### Interface (no prefix)

| Name | Path | Description |
|------|------|-------------|
| gobbi-agent | `.claude/agents/gobbi-agent.md` | Onboarding and setup assistant. Project directory setup, notification configuration, workflow orientation. |

#### Hidden (single `_`)

| Name | Path | Description |
|------|------|-------------|
| _skills-evaluator | `.claude/agents/_skills-evaluator.md` | Runs evaluation of skill definitions across all perspectives. |
| _agent-evaluator | `.claude/agents/_agent-evaluator.md` | Runs evaluation of agent definitions across all perspectives. |
| _project-evaluator | `.claude/agents/_project-evaluator.md` | Runs evaluation of project work output across all perspectives. |

#### Internal (double `__`)

| Name | Path | Description |
|------|------|-------------|
| __executor | `.claude/agents/__executor.md` | Code implementation, file creation/modification, TypeScript development, build system changes. |
| __pi | `.claude/agents/__pi.md` | Principal Investigator. Deep problem analysis, requirement refinement, technical investigation, and task decomposition. |

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
| _orchestration | `.claude/skills/_orchestration/SKILL.md` | Workflow coordinator. Task routing, phase transitions, step tracking. |
| _discuss | `.claude/skills/_discuss/SKILL.md` | Structured discussion via AskUserQuestion. Challenges vague thinking, surfaces problems. |
| _ideation | `.claude/skills/_ideation/SKILL.md` | Brainstorming and option exploration. Contribution points, trade-offs, risk analysis. |
| _plan | `.claude/skills/_plan/SKILL.md` | Task decomposition into narrow, specific, agent-assigned subtasks. |
| _delegation | `.claude/skills/_delegation/SKILL.md` | Subagent briefing with context layers and scope boundaries. |
| _execution | `.claude/skills/_execution/SKILL.md` | Single-task execution guide: study, plan, implement, verify. |
| _collection | `.claude/skills/_collection/SKILL.md` | Workflow trail persistence. Prompt, plan, task results, README. |
| _note | `.claude/skills/_note/SKILL.md` | Note writing at every workflow step. Decisions, outcomes, context. |
| _evaluation | `.claude/skills/_evaluation/SKILL.md` | Evaluation orchestration. Selecting perspectives, spawning evaluators, synthesizing findings. |
| _git | `.claude/skills/_git/SKILL.md` | Git/GitHub workflow. Worktree isolation, branch lifecycle, PR management. |
| _notification | `.claude/skills/_notification/SKILL.md` | Configure Claude Code notifications (Slack, Telegram, others). |
| _gotcha | `.claude/skills/_gotcha/SKILL.md` | Cross-project mistake recording. Check before acting, write after corrections. |

##### Skills evaluation child skills

**Evaluation criteria for skill definitions** — one skill per evaluation perspective.

| Name | Path | Description |
|------|------|-------------|
| _skills-evaluation-project | `.claude/skills/_skills-evaluation-project/SKILL.md` | Perspective: scope alignment, requirements fit, user intent for skill quality. |
| _skills-evaluation-architecture | `.claude/skills/_skills-evaluation-architecture/SKILL.md` | Perspective: structural coherence, coupling, design principles for skill quality. |
| _skills-evaluation-performance | `.claude/skills/_skills-evaluation-performance/SKILL.md` | Perspective: efficiency, scalability, resource usage for skill quality. |
| _skills-evaluation-aesthetics | `.claude/skills/_skills-evaluation-aesthetics/SKILL.md` | Perspective: naming clarity, readability, style consistency for skill quality. |
| _skills-evaluation-overall | `.claude/skills/_skills-evaluation-overall/SKILL.md` | Perspective: cross-cutting gaps, preservation list for skill quality. |
| _skills-evaluation-user | `.claude/skills/_skills-evaluation-user/SKILL.md` | Perspective: usability, discoverability, and clarity for the agent consuming the skill. |

##### Agent evaluation child skills

**Evaluation criteria for agent definitions** — one skill per evaluation perspective.

| Name | Path | Description |
|------|------|-------------|
| _agent-evaluation-project | `.claude/skills/_agent-evaluation-project/SKILL.md` | Perspective: scope alignment, requirements fit, user intent for agent quality. |
| _agent-evaluation-architecture | `.claude/skills/_agent-evaluation-architecture/SKILL.md` | Perspective: structural coherence, coupling, design principles for agent quality. |
| _agent-evaluation-performance | `.claude/skills/_agent-evaluation-performance/SKILL.md` | Perspective: efficiency, scalability, resource usage for agent quality. |
| _agent-evaluation-aesthetics | `.claude/skills/_agent-evaluation-aesthetics/SKILL.md` | Perspective: naming clarity, readability, style consistency for agent quality. |
| _agent-evaluation-overall | `.claude/skills/_agent-evaluation-overall/SKILL.md` | Perspective: cross-cutting gaps, preservation list for agent quality. |
| _agent-evaluation-user | `.claude/skills/_agent-evaluation-user/SKILL.md` | Perspective: usability, discoverability, and clarity for the agent being evaluated. |

##### Project evaluation child skills

**Evaluation criteria for project work output** — one skill per evaluation perspective.

| Name | Path | Description |
|------|------|-------------|
| _project-evaluation-project | `.claude/skills/_project-evaluation-project/SKILL.md` | Perspective: scope alignment, requirements fit, user intent for project output. |
| _project-evaluation-architecture | `.claude/skills/_project-evaluation-architecture/SKILL.md` | Perspective: structural coherence, coupling, design principles for project output. |
| _project-evaluation-performance | `.claude/skills/_project-evaluation-performance/SKILL.md` | Perspective: efficiency, scalability, resource usage for project output. |
| _project-evaluation-aesthetics | `.claude/skills/_project-evaluation-aesthetics/SKILL.md` | Perspective: naming clarity, readability, style consistency for project output. |
| _project-evaluation-overall | `.claude/skills/_project-evaluation-overall/SKILL.md` | Perspective: cross-cutting gaps, preservation list for project output. |
| _project-evaluation-user | `.claude/skills/_project-evaluation-user/SKILL.md` | Perspective: usability, discoverability, and clarity for the end user of the project output. |

##### Notification child skills

**Channel-specific notification setup** — one skill per notification channel.

| Name | Path | Description |
|------|------|-------------|
| _slack | `.claude/skills/_slack/SKILL.md` | Slack notification setup and integration. |
| _telegram | `.claude/skills/_telegram/SKILL.md` | Telegram notification setup and integration. |
| _discord | `.claude/skills/_discord/SKILL.md` | Discord notification setup and integration. |

#### Docs

**`.claude/` documentation authoring** — skills about writing and maintaining claude docs.

| Name | Path | Description |
|------|------|-------------|
| _claude | `.claude/skills/_claude/SKILL.md` | Core `.claude/` writing standard. Principles, hierarchy, anti-patterns, review checklist. |
| _skills | `.claude/skills/_skills/SKILL.md` | Reference and guide for creating skill definitions. |
| _agents | `.claude/skills/_agents/SKILL.md` | Reference and guide for creating agent definitions. |
| _rules | `.claude/skills/_rules/SKILL.md` | Guide for authoring rule files. |
| _project | `.claude/skills/_project/SKILL.md` | Guide for authoring project docs in `.claude/project/{project-name}/`. |

#### Tool

**Utility and maintenance tools** — verification, drift detection, benchmarking.

| Name | Path | Description |
|------|------|-------------|
| __validate | `.claude/skills/__validate/SKILL.md` | Structural validation of agent definitions, skill files, and gotcha entries. |
| _audit | `.claude/skills/_audit/SKILL.md` | Documentation drift detection. Verify `.claude/` docs match codebase reality. |
| __benchmark | `.claude/skills/__benchmark/SKILL.md` | Skill benchmarking methodology. Eval scenarios and scoring. |

### Skill Child Docs

| Name | Parent Skill | Path | Description |
|------|-------------|------|-------------|
| project-context.md | gobbi | `.claude/skills/gobbi/project-context.md` | Session-start project detection. Recommend skills based on technology stack. |
| authoring.md | _skills | `.claude/skills/_skills/authoring.md` | How to write skill content: description and instruction writing. |
| verification.md | _skills | `.claude/skills/_skills/verification.md` | Skill quality verification: trigger accuracy, output evaluation. |
| conventions.md | _git | `.claude/skills/_git/conventions.md` | Branch naming, commit messages, PR template, issue format, sub-issues. |
| feedback.md | _orchestration | `.claude/skills/_orchestration/feedback.md` | FEEDBACK phase: iteration tracking, stagnation detection, round cap. |
| finish.md | _orchestration | `.claude/skills/_orchestration/finish.md` | FINISH phase: merge/commit/compact decision tree, pre-action verification. |

### Gotcha Files

| Name | Path | Description |
|------|------|-------------|
| _orchestration | `.claude/skills/_gotcha/_orchestration.md` | Coordination, routing, phase transitions. |
| _git | `.claude/skills/_gotcha/_git.md` | Worktree management, branch handling, PR lifecycle. |
| _claude | `.claude/skills/_gotcha/_claude.md` | Writing `.claude/` docs, templated output. |
| _collection | `.claude/skills/_gotcha/_collection.md` | Work trail persistence, README indexing. |
| _delegation | `.claude/skills/_gotcha/_delegation.md` | Subagent briefings, context loading, scope. |
| _execution | `.claude/skills/_gotcha/_execution.md` | Implementation, verification. |
| _note | `.claude/skills/_gotcha/_note.md` | Note writing, directory structure, timing. |
| _plan | `.claude/skills/_gotcha/_plan.md` | Task decomposition, dependency ordering. |
| _discuss | `.claude/skills/_gotcha/_discuss.md` | Prompt clarification. (Empty) |
| _evaluation | `.claude/skills/_gotcha/_evaluation.md` | Quality gates. (Empty) |
| _ideation | `.claude/skills/_gotcha/_ideation.md` | Brainstorming. (Empty) |
| _notification | `.claude/skills/_gotcha/_notification.md` | Hook setup, credentials. (Empty) |
| __security | `.claude/skills/_gotcha/__security.md` | Security vulnerability signals for evaluators. |
| __system | `.claude/skills/_gotcha/__system.md` | Environment, processes, hooks, infrastructure. |

### Benchmark Scenarios

| Name | Path | Description |
|------|------|-------------|
| scenario-01 | `.claude/skills/__benchmark/benchmarks/scenario-01-gobbi-discuss-vague-prompt.md` | Tests _discuss handling of vague requests. |
| scenario-02 | `.claude/skills/__benchmark/benchmarks/scenario-02-gobbi-claude-skills-skill-creation.md` | Tests _skills handling of vague skill creation requests. |

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
| Agents — Hidden | 3 |
| Agents — Internal | 2 |
| Skills — Interface | 1 |
| Skills — Work | 12 |
| Skills — Work (child: Skills Evaluation) | 6 |
| Skills — Work (child: Agent Evaluation) | 6 |
| Skills — Work (child: Project Evaluation) | 6 |
| Skills — Work (child: Notification) | 3 |
| Skills — Docs | 5 |
| Skills — Tool | 3 |
| Skill child docs | 6 |
| Benchmark scenarios | 2 |
| Gotcha files | 14 |
| Project docs | 5 |
| **Total** | **78** |

---

## Design Decisions

### Naming Convention

Skill directory names and agent filenames use **hyphens as word separators** with three visibility tiers:

- No prefix — interface (user-invokable). Only `gobbi`.
- `_` prefix — hidden (system-loaded during workflow). Examples: `_plan`, `_skills`.
- `__` prefix — internal (gobbi machinery). Examples: `__validate`, `__benchmark`.

Single-word names are unaffected by the hyphen rule. The tier prefix is part of the name — omitting it changes visibility. The rule file is `__gobbi-convention.md`.

### Gotcha System

All gotcha files are centralized under `_gotcha/` (`_gotcha/_orchestration.md`, `_gotcha/_git.md`, etc.). Guidance on how to record each type of gotcha lives as child docs inside `_gotcha/` rather than as separate child skills.

### Pending Decisions

- Whether agents follow the same category system as skills
- Benchmark scenarios categorization
