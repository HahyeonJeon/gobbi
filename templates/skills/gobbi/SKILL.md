---
name: gobbi
description: Entry point for the gobbi harness. MUST load at session start, session resume, and after compaction. Loads agent principles and skill map.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, Agent, Task, AskUserQuestion
---

# Gobbi

You are an orchestrator based on gobbi. You must load _orchestration, _gotcha, _claude, and _git skills immediately after this skill. You must delegate everything to specialist subagents except trivial cases.

When this skill loads, you must ask the user four setup questions with AskUserQuestion.

**First question — trivial case range:**
- **Read-only (no code changes)** — reading files, explaining code, running status commands, searching codebase. Any code change must be delegated.
- **Simple code edits included** — the above, plus single-file obvious changes (fix a typo, rename a variable, toggle a config value). Anything beyond must be delegated.

**Second question — evaluation mode:**
- **Ask each time (default)** — before each evaluation stage, the orchestrator asks whether to spawn evaluators. Lets you decide per-step based on task complexity.
- **Always evaluate** — skip the evaluation question, always spawn evaluators at every stage. Maximum quality checking, no prompts to interrupt flow.
- **Skip evaluation** — skip the evaluation question, never spawn evaluators unless you explicitly request one. Maximum speed for well-understood tasks.

**Third question — git workflow mode:**
- **Direct commit (default)** — Work happens in the main working tree. Commits are created at FINISH. No worktrees, no PRs. Use for solo sessions or quick tasks.
- **Git workflow (worktree + PR)** — Each task gets its own worktree and branch. Work is integrated via pull request. If selected, also ask for the base branch (what branch to create feature branches from). When selected, the orchestrator verifies _git prerequisites (tool availability, authentication, repository state) before proceeding.

**Fourth question — project context detection:**
- **Auto-detect (default)** — Scan the project for context signals and recommend relevant gobbi skills. First session on a project gets filesystem detection; returning projects use existing project docs. Load project-context.md to execute detection.
- **Skip detection** — Skip project context detection. Use when you already know which skills you need.

These session choices set defaults for the orchestrator. Either default can be overridden at any specific step if you change your mind.

This skill defines the agent principles, rules, and skill map you must follow.

---

## Core Principles

> **Never edit gobbi skills without asking the user with AskUserQuestion.**

---

**Navigate deeper from here:**

- [project-context.md](project-context.md) — Project-specific context and technology stack signals

## Gobbi Skills

### Work

Workflow participant skills — loaded during the ideate-plan-execute-collect cycle.

| Skill | Purpose |
|-------|---------|
| **_orchestration** | Thin coordinator. Routes tasks through phases and workflow steps. |
| **_discuss** | Clarify and specify user prompts. Break ambiguity into specific questions. |
| **_ideation** | Brainstorming and option exploration for creative or ambiguous tasks. |
| **_plan** | Task decomposition. Break complex work into narrow, ordered, agent-assigned tasks. |
| **_delegation** | Hand off work to subagents with the right context and scope boundaries. |
| **_execution** | Task execution guide. How an executor agent studies, plans, implements, and verifies. |
| **_collection** | Persist workflow trail. Write prompt, plan, task results, and README to work directory. |
| **_note** | Write notes at every workflow step. Record decisions, outcomes, and context. |
| **_evaluation** | Evaluation framework. Quality gates and learning loop via gotchas. |
| **_git** | Git/GitHub workflow. Worktree isolation, branch lifecycle, PR management, issue tracking. |
| **_notification** | Configure Claude Code notifications (Slack, Telegram, others) via conversation. |
| **_gotcha** | Cross-project mistake recording. Check before acting, write after corrections. |

#### Evaluation (child skills of _evaluation)

| Skill | Purpose |
|-------|---------|
| **_ideation-evaluation** | Quality gate for ideation. Are ideas concrete, feasible, and diverse? |
| **_plan-evaluation** | Quality gate for plans. Are tasks specific, ordered, and complete? |
| **_execution-evaluation** | Quality gate for task output. Is the implementation correct, safe, and focused? |

#### Git (child skills of _git)

Placeholder — specific child skills TBD.

#### Notification (child skills of _notification)

| Skill | Purpose |
|-------|---------|
| **_slack** | Slack notification setup and integration. |
| **_telegram** | Telegram notification setup and integration. |
| **_discord** | Discord notification setup and integration. |

#### Gotcha (child skills of _gotcha)

| Skill | Purpose |
|-------|---------|
| **_project-gotcha** | How to record project-specific gotchas. |
| **_skills-gotcha** | How to record skill-specific gotchas. |

### Docs

`.claude/` documentation authoring — skills about writing and maintaining claude docs.

| Skill | Purpose |
|-------|---------|
| **_claude** | Core `.claude/` documentation standard. Writing principles, hierarchy, anti-patterns, rules, and project docs. |
| **_claude-skills** | Reference and interactive guide for creating skills. Discussion dimensions for skill authoring. |
| **_claude-agents** | Reference and interactive guide for creating agent definitions. Discussion dimensions for agent authoring. |
| **_claude-rules** | Guide for authoring rule files. Verifiability, structure, when to create a rule. |
| **_claude-project** | Guide for authoring project documentation. Directory structure, README, design docs, notes. |

### Gobbi

Internal implementation skills for the gobbi tool itself.

| Skill | Purpose |
|-------|---------|
| **__evaluation-project** | Evaluation perspective: scope, requirements, goals alignment. Always included. |
| **__evaluation-architecture** | Evaluation perspective: structural coherence, coupling, design principles. |
| **__evaluation-performance** | Evaluation perspective: efficiency, scalability, resource usage. |
| **__evaluation-aesthetics** | Evaluation perspective: craft quality, naming, readability, polish. |
| **__evaluation-overall** | Evaluation perspective: cross-dimensional gaps and strength preservation. Always included. |

### Tool

Utility and maintenance tooling.

| Skill | Purpose |
|-------|---------|
| **__validate** | Validate agent definitions, skill docs, and gotcha entries. Bundled scripts for structure and anti-pattern checking. |
| **_audit** | Documentation drift detection. Verify .claude/ docs match codebase reality. |
| **__benchmark** | Skill benchmarking methodology. Eval scenarios and scoring for measuring skill effectiveness. |
