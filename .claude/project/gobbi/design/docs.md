# Docs

Inventory of all `.claude/` documentation files in gobbi. Reflects the current state of the repository.

---

## Root

| Name | Path | Description |
|------|------|-------------|
| CLAUDE.md | `.claude/CLAUDE.md` | Session entry point. Core principles, workflow cycle, evaluation mandate, and skill reload trigger. |
| README.md | `.claude/README.md` | Gobbi identity doc. "Korean for reins" — users talk, gobbi handles the rest. |

## Rules

| Name | Path | Description |
|------|------|-------------|
| __gobbi_convention | `.claude/rules/__gobbi_convention.md` | Naming convention: underscore style with three visibility tiers (interface, hidden, internal). |

## Agents

### Hidden (single `_`)

| Name | Path | Description |
|------|------|-------------|
| _developer | `.claude/agents/_developer.md` | Code implementation, file creation/modification, TypeScript development, build system changes. |
| _pi | `.claude/agents/_pi.md` | Principal Investigator. Deep problem analysis, requirement refinement, technical investigation. |
| _planner | `.claude/agents/_planner.md` | Task decomposition via codebase exploration and dependency analysis. |

### Internal (double `__`)

| Name | Path | Description |
|------|------|-------------|
| __evaluator_aesthetics | `.claude/agents/__evaluator_aesthetics.md` | Evaluation perspective: naming clarity, readability, style consistency, craft quality. |
| __evaluator_architecture | `.claude/agents/__evaluator_architecture.md` | Evaluation perspective: structural soundness, abstraction, coupling, extensibility. |
| __evaluator_overall | `.claude/agents/__evaluator_overall.md` | Evaluation perspective: cross-cutting gaps, "must preserve" list generation. |
| __evaluator_performance | `.claude/agents/__evaluator_performance.md` | Evaluation perspective: efficiency, scalability, resource proportionality. |
| __evaluator_project | `.claude/agents/__evaluator_project.md` | Evaluation perspective: problem-solution fit, user intent, scope alignment. |
| __skills_analyzer | `.claude/agents/__skills_analyzer.md` | Synthesizes grading/comparison results into prioritized improvement recommendations. |
| __skills_comparator | `.claude/agents/__skills_comparator.md` | Blind comparison of two skill versions without knowing which is current vs candidate. |
| __skills_grader | `.claude/agents/__skills_grader.md` | Tests skill trigger accuracy and output quality on sample prompts. |

## Skills

### Interface (no prefix)

| Name | Path | Description |
|------|------|-------------|
| gobbi | `.claude/skills/gobbi/SKILL.md` | Entry point. Loads agent principles, skill map, and session setup questions. |

### Hidden (single `_`) — Core

| Name | Path | Description |
|------|------|-------------|
| _orchestration | `.claude/skills/_orchestration/SKILL.md` | Workflow coordinator. Task routing, phase transitions, step tracking. |
| _claude | `.claude/skills/_claude/SKILL.md` | Core `.claude/` writing standard. Principles, hierarchy, anti-patterns, review checklist. |
| _claude_skills | `.claude/skills/_claude_skills/SKILL.md` | Reference and guide for creating skill definitions. |
| _claude_agents | `.claude/skills/_claude_agents/SKILL.md` | Reference and guide for creating agent definitions. |
| _gotcha | `.claude/skills/_gotcha/SKILL.md` | Cross-project mistake recording. Check before acting, write after corrections. |
| _git | `.claude/skills/_git/SKILL.md` | Git/GitHub workflow. Worktree isolation, branch lifecycle, PR management. |

### Hidden (single `_`) — Workflow

| Name | Path | Description |
|------|------|-------------|
| _discuss | `.claude/skills/_discuss/SKILL.md` | Structured discussion via AskUserQuestion. Challenges vague thinking, surfaces problems. |
| _ideation | `.claude/skills/_ideation/SKILL.md` | Brainstorming and option exploration. Contribution points, trade-offs, risk analysis. |
| _plan | `.claude/skills/_plan/SKILL.md` | Task decomposition into narrow, specific, agent-assigned subtasks. |
| _delegation | `.claude/skills/_delegation/SKILL.md` | Subagent briefing with context layers and scope boundaries. |
| _execution | `.claude/skills/_execution/SKILL.md` | Single-task execution guide: study, plan, implement, verify. |
| _evaluation | `.claude/skills/_evaluation/SKILL.md` | Evaluation framework. 2-5 perspective evaluators, quality gates, learning loop. |
| _note | `.claude/skills/_note/SKILL.md` | Note writing at every workflow step. Decisions, outcomes, context. |
| _collection | `.claude/skills/_collection/SKILL.md` | Workflow trail persistence. Prompt, plan, task results, README. |

### Hidden (single `_`) — Utils

| Name | Path | Description |
|------|------|-------------|
| _notification | `.claude/skills/_notification/SKILL.md` | Configure Claude Code notifications (Slack, Telegram, others). |
| _audit | `.claude/skills/_audit/SKILL.md` | Documentation drift detection. Verify `.claude/` docs match codebase reality. |
| _project_context | `.claude/skills/_project_context/SKILL.md` | Session-start project detection. Recommend skills based on technology stack. |

### Internal (double `__`) — Stage Evaluation Criteria

| Name | Path | Description |
|------|------|-------------|
| __ideation_evaluation | `.claude/skills/__ideation_evaluation/SKILL.md` | Stage criteria: are ideas concrete, well-researched, ready for planning? |
| __plan_evaluation | `.claude/skills/__plan_evaluation/SKILL.md` | Stage criteria: are tasks specific, correctly ordered, complete? |
| __execution_evaluation | `.claude/skills/__execution_evaluation/SKILL.md` | Stage criteria: is implementation correct, safe, scope-disciplined? |

### Internal (double `__`) — Perspective Evaluation

| Name | Path | Description |
|------|------|-------------|
| __evaluation_project | `.claude/skills/__evaluation_project/SKILL.md` | Perspective: scope alignment, requirements fit, user intent. Always included. |
| __evaluation_architecture | `.claude/skills/__evaluation_architecture/SKILL.md` | Perspective: structural coherence, coupling, design principles, extensibility. |
| __evaluation_performance | `.claude/skills/__evaluation_performance/SKILL.md` | Perspective: efficiency, scalability, resource usage, latency. |
| __evaluation_aesthetics | `.claude/skills/__evaluation_aesthetics/SKILL.md` | Perspective: naming clarity, readability, style consistency, craft. |
| __evaluation_overall | `.claude/skills/__evaluation_overall/SKILL.md` | Perspective: cross-cutting gaps, preservation list. Always included. |

### Internal (double `__`) — Development Tooling

| Name | Path | Description |
|------|------|-------------|
| __validate | `.claude/skills/__validate/SKILL.md` | Structural validation of agent definitions, skill files, and gotcha entries. |
| __benchmark | `.claude/skills/__benchmark/SKILL.md` | Skill benchmarking methodology. Eval scenarios and scoring. |

## Skill Child Docs

| Name | Parent Skill | Path | Description |
|------|-------------|------|-------------|
| project.md | _claude | `.claude/skills/_claude/project.md` | Guide for authoring project docs in `.claude/project/{project-name}/`. |
| rules.md | _claude | `.claude/skills/_claude/rules.md` | Guide for authoring rule files. |
| authoring.md | _claude_skills | `.claude/skills/_claude_skills/authoring.md` | How to write skill content: description and instruction writing. |
| verification.md | _claude_skills | `.claude/skills/_claude_skills/verification.md` | Skill quality verification: trigger accuracy, output evaluation. |
| conventions.md | _git | `.claude/skills/_git/conventions.md` | Branch naming, commit messages, PR template, issue format, sub-issues. |
| feedback.md | _orchestration | `.claude/skills/_orchestration/feedback.md` | FEEDBACK phase: iteration tracking, stagnation detection, round cap. |
| finish.md | _orchestration | `.claude/skills/_orchestration/finish.md` | FINISH phase: merge/commit/compact decision tree, pre-action verification. |

## Benchmark Scenarios

| Name | Path | Description |
|------|------|-------------|
| scenario-01 | `.claude/skills/__benchmark/benchmarks/scenario-01-gobbi-discuss-vague-prompt.md` | Tests _discuss handling of vague requests. |
| scenario-02 | `.claude/skills/__benchmark/benchmarks/scenario-02-gobbi-claude-skills-skill-creation.md` | Tests _claude_skills handling of vague skill creation requests. |

## Gotcha Files

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

## Project Docs

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
| Skills (SKILL.md) | 28 |
| Skill child docs | 7 |
| Benchmark scenarios | 2 |
| Gotcha files | 14 |
| Project docs | 5 |
| **Total** | **70** |
