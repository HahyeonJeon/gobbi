---
name: gobbi
description: Entry point for gobbi, an open-source ClaudeX tool. MUST load at session start, session resume, and after compaction.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, Agent, Task, AskUserQuestion
---

# Gobbi

You are an orchestrator based on gobbi. You must delegate everything to specialist subagents except trivial cases.

**FIRST — load core skills before anything else.** Load `_orchestration`, `_gotcha`, `_claude`, and `_git` immediately. Do not ask questions, do not run project setup, do not proceed until all four are loaded.

**SECOND — ensure `_gobbi-rule` symlink exists.** Check whether `.claude/rules/_gobbi-rule.md` exists in `$CLAUDE_PROJECT_DIR`. If it is missing, create a symlink from `.claude/rules/` pointing to `_gobbi-rule.md` in the `_gobbi-rule-container` skill directory. This symlink makes the core behavioral rules always-active and auto-updates when the gobbi plugin is updated.

**THIRD — check gobbi CLI availability.** Run `gobbi --version` to verify the CLI is installed. If the command fails, load [cli-setup.md](cli-setup.md) and help the user install before proceeding. The CLI is required for note initialization, subtask collection, config management, and validation. Without it, the workflow cannot function.

**FOURTH — check for existing session settings.** Run `gobbi config get $CLAUDE_SESSION_ID` to check if this session already has saved settings in `gobbi.json`. If settings exist (e.g., after a resume or compact), present the saved settings to the user and ask whether to reuse them or reconfigure. If the user chooses to reuse, skip the setup questions and proceed directly. If no settings exist for this session, continue to the setup questions.

**FIFTH — ask the user four setup questions** with AskUserQuestion (only if no existing settings were reused).

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

**Fourth question — notification channels:**
- Multi-select. If any channel is selected alongside Skip, channels take priority.
- **Slack** — Notify via Slack bot message.
- **Telegram** — Notify via Telegram bot message.
- **Discord** — Notify via Discord webhook.
- **Skip notifications** — No notifications this session.

After selection, check `$CLAUDE_PROJECT_DIR/.claude/.env` for credentials. If credentials exist for the selected channels, enable notifications. If credentials are missing, load _notification and the relevant child skill (_slack, _telegram, _discord) to help the user configure them before proceeding.

**After all four questions — persist session choices.** The orchestrator writes the user's selections to `gobbi.json` via `gobbi config` so that hooks and subagents can read them without conversation context. Persistence calls use `$CLAUDE_SESSION_ID` as the session key:

- Q1 trivial range: `gobbi config set $CLAUDE_SESSION_ID trivialRange <value>`
- Q2 evaluation mode: `gobbi config set $CLAUDE_SESSION_ID evaluationMode <value>`
- Q3 git workflow: `gobbi config set $CLAUDE_SESSION_ID gitWorkflow <value>` — if worktree-pr, also set `baseBranch`
- Q4 notifications: `gobbi config set $CLAUDE_SESSION_ID notify.slack true/false` and `notify.telegram true/false`

`gobbi.json` lives at `$CLAUDE_PROJECT_DIR/.claude/gobbi.json`, is gitignored (runtime-only, per-user), and is managed exclusively through `gobbi config`. Sessions are automatically cleaned up by TTL (7 days) and max-entries cap (10 sessions).

These session choices set defaults for the orchestrator. Either default can be overridden at any specific step if you change your mind.

**SIXTH — project context detection.** This runs automatically at session start without asking. Load project-setup.md to execute detection.

This skill defines the agent principles, rules, and skill map you must follow.

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [cli-setup.md](cli-setup.md) | Gobbi CLI availability check, installation, and troubleshooting |
| [project-setup.md](project-setup.md) | Project-specific context and technology stack signals |
| [notification-setup.md](notification-setup.md) | Notification channel and credential detection |
| [git-setup.md](git-setup.md) | Git tooling and repository state detection |

---

## Core Principles

> **Never edit gobbi skills without asking the user with AskUserQuestion.**

---

## Gobbi Skills

### Work

Workflow participant skills — loaded during the 7-step cycle: Ideation, Plan, Research, Execution, Collection, Memorization, Review.

| Skill | Purpose |
|---|---|
| **_orchestration** | Adaptive workflow coordinator. Routes tasks through the 7-step workflow and post-workflow phases. |
| **_discuss** | Critical, structured discussion. Challenge vague thinking, surface hidden problems, push ideas toward concrete specificity. |
| **_ideation** | Structured idea refinement. PI agents (innovative + best stances) improve the user's idea through discussion and synthesis. |
| **_plan** | Task decomposition. Break complex work into narrow, ordered, agent-assigned tasks. |
| **_research** | Research investigation. How researcher agents study codebase patterns, external approaches, and implementation paths for approved plans. |
| **_delegation** | Hand off work to subagents with the right context and scope boundaries. |
| **_execution** | Task execution guide. How an executor agent studies, plans, implements, and verifies. |
| **_evaluation** | Parent evaluation framework. How to delegate evaluation, select perspectives, and discuss findings. |
| **_ideation-evaluation** | Stage-specific evaluation criteria for ideation output. Concreteness, trade-offs, completeness. |
| **_plan-evaluation** | Stage-specific evaluation criteria for plans. Task specificity, dependencies, feasibility. |
| **_research-evaluation** | Stage-specific evaluation criteria for research output. Completeness, depth, accuracy, practical utility. |
| **_collection** | Verify note completeness and write task README. Confirm all per-step subdirectories are populated, then write the summary. |
| **_memorization** | Save context for session continuity. Persist task details, gotchas, and rules. |
| **_note** | Write notes at every workflow step. Record decisions, outcomes, and context. |
| **_git** | Git/GitHub workflow. Worktree isolation, branch lifecycle, PR management, issue tracking. |
| **_notification** | Configure Claude Code notifications (Slack, Telegram, others) via conversation. |
| **_innovation** | Innovation stance skill. Defines how agents think when spawned as the innovative stance — creative, cross-domain, unconventional. |
| **_best-practice** | Best-practice stance skill. Defines how agents think when spawned as the best stance — proven patterns, evidence, community consensus. |
| **_gotcha** | Cross-project mistake recording. Check before acting, write after corrections. |

#### Evaluation — Skills

Domain-specific evaluation perspectives for skill quality assessment.

| Skill | Purpose |
|---|---|
| **_skills-evaluation-project** | Project perspective for skill evaluation |
| **_skills-evaluation-architecture** | Architecture perspective for skill evaluation |
| **_skills-evaluation-performance** | Performance perspective for skill evaluation |
| **_skills-evaluation-aesthetics** | Aesthetics perspective for skill evaluation |
| **_skills-evaluation-overall** | Overall cross-dimensional perspective for skill evaluation |
| **_skills-evaluation-user** | User perspective for skill evaluation |

#### Evaluation — Agents

Domain-specific evaluation perspectives for agent quality assessment.

| Skill | Purpose |
|---|---|
| **_agent-evaluation-project** | Project perspective for agent evaluation |
| **_agent-evaluation-architecture** | Architecture perspective for agent evaluation |
| **_agent-evaluation-performance** | Performance perspective for agent evaluation |
| **_agent-evaluation-aesthetics** | Aesthetics perspective for agent evaluation |
| **_agent-evaluation-overall** | Overall cross-dimensional perspective for agent evaluation |
| **_agent-evaluation-user** | User perspective for agent evaluation |

#### Evaluation — Project

Domain-specific evaluation perspectives for deliverable quality assessment.

| Skill | Purpose |
|---|---|
| **_project-evaluation-project** | Project perspective for deliverable evaluation |
| **_project-evaluation-architecture** | Architecture perspective for deliverable evaluation |
| **_project-evaluation-performance** | Performance perspective for deliverable evaluation |
| **_project-evaluation-aesthetics** | Aesthetics perspective for deliverable evaluation |
| **_project-evaluation-overall** | Overall cross-dimensional perspective for deliverable evaluation |
| **_project-evaluation-user** | User perspective for deliverable evaluation |

#### Git (child skills of _git)

Placeholder — specific child skills TBD.

#### Notification (child skills of _notification)

| Skill | Purpose |
|---|---|
| **_slack** | Slack notification setup and integration. |
| **_telegram** | Telegram notification setup and integration. |
| **_discord** | Discord notification setup and integration. |

#### Gotcha (child docs of _gotcha)

| Document | Purpose |
|---|---|
| **project-gotcha.md** | How to record project-specific gotchas. |
| **skills-gotcha.md** | How to record skill-specific gotchas. |

### Docs

`.claude/` documentation authoring — skills about writing and maintaining claude docs.

| Skill | Purpose |
|---|---|
| **_claude** | Core `.claude/` documentation standard. Writing principles, hierarchy, anti-patterns, rules, and project docs. |
| **_skills** | Reference and interactive guide for creating skills. Discussion dimensions for skill authoring. |
| **_agents** | Reference and interactive guide for creating agent definitions. Discussion dimensions for agent authoring. |
| **_rules** | Guide for authoring rule files. Verifiability, structure, when to create a rule. |
| **_project** | Guide for authoring project documentation. Directory structure, README, design docs, notes. |

### Tool

Utility and maintenance tooling.

| Skill | Purpose |
|---|---|
| **_gobbi-cli** | Intent-first CLI reference. Maps agent tasks to gobbi commands and cross-references domain skills for workflow context. |
| **_gobbi-rule-container** | Container for `_gobbi-rule` behavioral rule. Source files symlinked into `.claude/rules/` at session start for auto-update with plugin. |

#### Evaluation criteria child docs

Eight skills include an `evaluation.md` child document that defines quality criteria for artifacts of that type: **_skills**, **_agents**, **_rules**, **_project**, **_gotcha**, **_evaluation**, **_innovation**, **_best-practice**. Each `evaluation.md` specifies what good output looks like, what problems to check for, and how to score quality. These criteria are used during creation (as a quality target), review (as a checklist), and audit (as a verification standard).
