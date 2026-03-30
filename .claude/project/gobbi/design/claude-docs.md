# Docs

Inventory of all `.claude/` documentation files in gobbi. Reflects the current state of the repository.

---

## Category System

Skills are organized into four top-level categories: **Work** (workflow participants loaded during the ideate-plan-execute-collect cycle), **Docs** (skills about writing and maintaining `.claude/` docs), **Gobbi** (gobbi's own internal machinery), and **Tool** (utility and maintenance tools). Work skills can have child skill categories that describe more specific principles under the parent. The `gobbi` interface skill stands alone with no category.

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

#### Hidden (single `_`)

| Name | Path | Description |
|------|------|-------------|
| _developer | `.claude/agents/_developer.md` | Code implementation, file creation/modification, TypeScript development, build system changes. |
| _pi | `.claude/agents/_pi.md` | Principal Investigator. Deep problem analysis, requirement refinement, technical investigation. |
| _planner | `.claude/agents/_planner.md` | Task decomposition via codebase exploration and dependency analysis. |

#### Internal (double `__`)

| Name | Path | Description |
|------|------|-------------|
| __evaluator-aesthetics | `.claude/agents/__evaluator-aesthetics.md` | Evaluation perspective: naming clarity, readability, style consistency, craft quality. |
| __evaluator-architecture | `.claude/agents/__evaluator-architecture.md` | Evaluation perspective: structural soundness, abstraction, coupling, extensibility. |
| __evaluator-overall | `.claude/agents/__evaluator-overall.md` | Evaluation perspective: cross-cutting gaps, "must preserve" list generation. |
| __evaluator-performance | `.claude/agents/__evaluator-performance.md` | Evaluation perspective: efficiency, scalability, resource proportionality. |
| __evaluator-project | `.claude/agents/__evaluator-project.md` | Evaluation perspective: problem-solution fit, user intent, scope alignment. |
| __skills-analyzer | `.claude/agents/__skills-analyzer.md` | Synthesizes grading/comparison results into prioritized improvement recommendations. |
| __skills-comparator | `.claude/agents/__skills-comparator.md` | Blind comparison of two skill versions without knowing which is current vs candidate. |
| __skills-grader | `.claude/agents/__skills-grader.md` | Tests skill trigger accuracy and output quality on sample prompts. |

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
| _evaluation | `.claude/skills/_evaluation/SKILL.md` | Evaluation framework. 2-5 perspective evaluators, quality gates, learning loop. |
| _git | `.claude/skills/_git/SKILL.md` | Git/GitHub workflow. Worktree isolation, branch lifecycle, PR management. |
| _notification | `.claude/skills/_notification/SKILL.md` | Configure Claude Code notifications (Slack, Telegram, others). |
| _gotcha | `.claude/skills/_gotcha/SKILL.md` | Cross-project mistake recording. Check before acting, write after corrections. |

##### Evaluation child skills

**Stage-specific evaluation criteria** — one skill per workflow stage (hidden tier, not internal).

| Name | Path | Description |
|------|------|-------------|
| _ideation-evaluation | `.claude/skills/_ideation-evaluation/SKILL.md` | Stage criteria: are ideas concrete, well-researched, ready for planning? |
| _plan-evaluation | `.claude/skills/_plan-evaluation/SKILL.md` | Stage criteria: are tasks specific, correctly ordered, complete? |
| _execution-evaluation | `.claude/skills/_execution-evaluation/SKILL.md` | Stage criteria: is implementation correct, safe, scope-disciplined? |

##### Notification child skills

**Channel-specific notification setup** — one skill per notification channel.

| Name | Path | Description |
|------|------|-------------|
| _slack | `.claude/skills/_slack/SKILL.md` | Slack notification setup and integration. |
| _telegram | `.claude/skills/_telegram/SKILL.md` | Telegram notification setup and integration. |
| _discord | `.claude/skills/_discord/SKILL.md` | Discord notification setup and integration. |

##### Gotcha child skills

**Gotcha recording guidance** — skills describing how to record each type of gotcha.

| Name | Path | Description |
|------|------|-------------|
| _project-gotcha | `.claude/skills/_project-gotcha/SKILL.md` | How to record project-specific gotchas. |
| _skills-gotcha | `.claude/skills/_skills-gotcha/SKILL.md` | How to record skill-specific gotchas. |

#### Docs

**`.claude/` documentation authoring** — skills about writing and maintaining claude docs.

| Name | Path | Description |
|------|------|-------------|
| _claude | `.claude/skills/_claude/SKILL.md` | Core `.claude/` writing standard. Principles, hierarchy, anti-patterns, review checklist. |
| _claude-skills | `.claude/skills/_claude-skills/SKILL.md` | Reference and guide for creating skill definitions. |
| _claude-agents | `.claude/skills/_claude-agents/SKILL.md` | Reference and guide for creating agent definitions. |
| _claude-rules | `.claude/skills/_claude-rules/SKILL.md` | Guide for authoring rule files. |
| _claude-project | `.claude/skills/_claude-project/SKILL.md` | Guide for authoring project docs in `.claude/project/{project-name}/`. |

#### Gobbi

**Gobbi internal implementation** — internal skills that are part of gobbi's own machinery.

| Name | Path | Description |
|------|------|-------------|
| __evaluation-project | `.claude/skills/__evaluation-project/SKILL.md` | Perspective: scope alignment, requirements fit, user intent. Always included. |
| __evaluation-architecture | `.claude/skills/__evaluation-architecture/SKILL.md` | Perspective: structural coherence, coupling, design principles, extensibility. |
| __evaluation-performance | `.claude/skills/__evaluation-performance/SKILL.md` | Perspective: efficiency, scalability, resource usage, latency. |
| __evaluation-aesthetics | `.claude/skills/__evaluation-aesthetics/SKILL.md` | Perspective: naming clarity, readability, style consistency, craft. |
| __evaluation-overall | `.claude/skills/__evaluation-overall/SKILL.md` | Perspective: cross-cutting gaps, preservation list. Always included. |

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
| authoring.md | _claude-skills | `.claude/skills/_claude-skills/authoring.md` | How to write skill content: description and instruction writing. |
| verification.md | _claude-skills | `.claude/skills/_claude-skills/verification.md` | Skill quality verification: trigger accuracy, output evaluation. |
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
| scenario-02 | `.claude/skills/__benchmark/benchmarks/scenario-02-gobbi-claude-skills-skill-creation.md` | Tests _claude-skills handling of vague skill creation requests. |

### Project Docs

| Name | Path | Description |
|------|------|-------------|
| architecture.md | `.claude/project/gobbi/design/architecture.md` | Four pillars: workflow, workers, effectiveness, quality measurement. |
| structure.md | `.claude/project/gobbi/design/structure.md` | Directory structure: Claude docs, plugin distribution, CLI. |
| docs.md | `.claude/project/gobbi/design/docs.md` | This file. Inventory of all `.claude/` documentation. |
| README.md | `.claude/project/gobbi/README.md` | Gobbi project overview. Open-source ClaudeX tool for Claude Code. |
| note/README.md | `.claude/project/gobbi/note/README.md` | Index of workflow notes with dates, sessions, and task summaries. |

---

## Summary

| Category | Count |
|----------|-------|
| Root | 2 |
| Rules | 1 |
| Agents | 11 |
| Skills — Interface | 1 |
| Skills — Work | 12 |
| Skills — Work (child: Evaluation) | 3 |
| Skills — Work (child: Notification) | 3 |
| Skills — Work (child: Gotcha) | 2 |
| Skills — Docs | 5 |
| Skills — Gobbi | 5 |
| Skills — Tool | 3 |
| Skill child docs | 6 |
| Benchmark scenarios | 2 |
| Gotcha files | 14 |
| Project docs | 5 |
| **Total** | **75** |

---

## Design Decisions

### Naming Convention

Skill directory names and agent filenames use **hyphens as word separators** with three visibility tiers:

- No prefix — interface (user-invokable). Only `gobbi`.
- `_` prefix — hidden (system-loaded during workflow). Examples: `_plan`, `_claude-skills`.
- `__` prefix — internal (gobbi machinery). Examples: `__evaluation-project`, `__validate`.

Single-word names are unaffected by the hyphen rule. The tier prefix is part of the name — omitting it changes visibility. The rule file is `__gobbi-convention.md`.

### Gotcha System Redesign

Current model: all gotcha files centralized under `_gotcha/` (`_gotcha/_orchestration.md`, `_gotcha/_git.md`, etc.).

Future model: each skill has its own `gotchas.md` in its skill directory. Two child skills (`_project-gotcha`, `_skills-gotcha`) describe how to record each type.

### Pending Decisions

- Whether agents follow the same category system as skills
- Benchmark scenarios categorization
