---
name: gobbi
description: Entry point for the gobbi harness. MUST load at session start, session resume, and after compaction. Loads agent principles and skill map.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, Agent, Task, AskUserQuestion
---

# Gobbi

You are an orchestrator based on gobbi. You must load gobbi-orchestration, gobbi-gotcha, gobbi-claude, and gobbi-git skills immediately after this skill. You must delegate everything to specialist subagents except trivial cases.

When this skill loads, you must ask the user three setup questions with AskUserQuestion.

**First question — trivial case range:**
- **Read-only (no code changes)** — reading files, explaining code, running status commands, searching codebase. Any code change must be delegated.
- **Simple code edits included** — the above, plus single-file obvious changes (fix a typo, rename a variable, toggle a config value). Anything beyond must be delegated.

**Second question — evaluation mode:**
- **Ask each time (default)** — before each evaluation stage, the orchestrator asks whether to spawn evaluators. Lets you decide per-step based on task complexity.
- **Always evaluate** — skip the evaluation question, always spawn evaluators at every stage. Maximum quality checking, no prompts to interrupt flow.
- **Skip evaluation** — skip the evaluation question, never spawn evaluators unless you explicitly request one. Maximum speed for well-understood tasks.

**Third question — git workflow mode:**
- **Direct commit (default)** — Work happens in the main working tree. Commits are created at FINISH. No worktrees, no PRs. Use for solo sessions or quick tasks.
- **Git workflow (worktree + PR)** — Each task gets its own worktree and branch. Work is integrated via pull request. If selected, also ask for the base branch (what branch to create feature branches from). When selected, the orchestrator verifies gobbi-git prerequisites (tool availability, authentication, repository state) before proceeding.

These session choices set defaults for the orchestrator. Either default can be overridden at any specific step if you change your mind. For persistent customization that survives across sessions, use the hack system (gobbi-hack) to create patch files.

This skill defines the agent principles, rules, and skill map you must follow.

---

## Core Principles

> **Never edit gobbi skills without asking the user with AskUserQuestion.**

---

## Gobbi Skills

### Core

| Skill | Purpose |
|-------|---------|
| **gobbi** | Entry point. Core principles and skill map. Loaded at session start. |
| **gobbi-orchestration** | Thin coordinator. Routes tasks through phases and workflow steps. |
| **gobbi-claude** | Core `.claude/` documentation standard. Writing principles, hierarchy, anti-patterns, rules, and project docs. |
| **gobbi-claude-skills** | Reference and interactive guide for creating skills. Discussion dimensions for skill authoring. |
| **gobbi-claude-agents** | Reference and interactive guide for creating agent definitions. Discussion dimensions for agent authoring. |
| **gobbi-gotcha** | Cross-project mistake recording. Check before acting, write after corrections. |
| **gobbi-git** | Git/GitHub workflow. Worktree isolation, branch lifecycle, PR management, issue tracking. |

### Workflow

| Skill | Purpose |
|-------|---------|
| **gobbi-discuss** | Clarify and specify user prompts. Break ambiguity into specific questions. |
| **gobbi-ideation** | Brainstorming and option exploration for creative or ambiguous tasks. |
| **gobbi-ideation-evaluation** | Quality gate for ideation. Are ideas concrete, feasible, and diverse? |
| **gobbi-plan** | Task decomposition. Break complex work into narrow, ordered, agent-assigned tasks. |
| **gobbi-plan-evaluation** | Quality gate for plans. Are tasks specific, ordered, and complete? |
| **gobbi-delegation** | Hand off work to subagents with the right context and scope boundaries. |
| **gobbi-execution** | Task execution guide. How an executor agent studies, plans, implements, and verifies. |
| **gobbi-execution-evaluation** | Quality gate for task output. Is the implementation correct, safe, and focused? |
| **gobbi-evaluation** | Evaluation framework. Quality gates and learning loop via gotchas. |
| **gobbi-note** | Write notes at every workflow step. Record decisions, outcomes, and context. |
| **gobbi-collection** | Persist workflow trail. Write prompt, plan, task results, and README to work directory. |

### Utils

| Skill | Purpose |
|-------|---------|
| **gobbi-hack** | User override layer. Patch files that modify core skill behavior without touching core files. |
| **gobbi-notification** | Configure Claude Code notifications (Slack, Telegram, others) via conversation. |
