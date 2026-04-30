---
name: gobbi
description: Entry point for gobbi, an open-source ClaudeX tool. MUST load at session start, session resume, after /clear, and after compaction.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, Agent, Task, AskUserQuestion
---

# Gobbi

You are an orchestrator based on gobbi. You must delegate everything to specialist subagents except trivial cases.

In v0.5.0, `/gobbi` is the session-bootstrap front door. It completes the setup questions below, then drives `gobbi workflow init` to create the session's runtime directory under `.gobbi/projects/<name>/sessions/{session-id}/` and record the first `workflow.start` event. The 6-step state machine — Configuration (CLI init phase), Ideation, Planning, Execution, Memorization, Handoff (with Evaluation as a sub-phase) — is governed by the CLI's step specs at `packages/cli/src/specs/`. Once setup is complete, hand off to `gobbi workflow init`.

**FIRST — load core skills before anything else.** Load `_gotcha`, `_claude`, and `_git` immediately. Do not ask questions, do not run project setup, do not proceed until skills are loaded. (`_orchestration` is deprecated in v0.5.0 and no longer loads — see `_orchestration/ARCHIVED.md` only if you need historical reference for v0.4.x terminology.)

**SECOND — ensure `_gobbi-rule` symlink exists.** Check whether `.claude/rules/_gobbi-rule.md` exists in `$CLAUDE_PROJECT_DIR`. If it is missing, create a symlink from `.claude/rules/` pointing to `_gobbi-rule.md` in the `_gobbi-rule-container` skill directory. This symlink makes the core behavioral rules always-active and auto-updates when the gobbi plugin is updated.

**Session env vars arrive automatically.** The `gobbi hook session-start` SessionStart hook (registered in `plugins/gobbi/hooks/hooks.json`) fires at session start, reads the hook's stdin JSON payload, and persists the following env vars to `$CLAUDE_ENV_FILE`. Claude Code then sources that file, making the vars available to every subsequent command in the session:

| Env var | Source |
|---|---|
| `CLAUDE_SESSION_ID` | stdin JSON `session_id` |
| `CLAUDE_TRANSCRIPT_PATH` | stdin JSON `transcript_path` |
| `CLAUDE_CWD` | stdin JSON `cwd` |
| `CLAUDE_HOOK_EVENT_NAME` | stdin JSON `hook_event_name` |
| `CLAUDE_AGENT_ID` | stdin JSON `agent_id` (when present) |
| `CLAUDE_AGENT_TYPE` | stdin JSON `agent_type` (when present) |
| `CLAUDE_PERMISSION_MODE` | stdin JSON `permission_mode` (when present) |
| `CLAUDE_PROJECT_DIR` | natively-provided env (passthrough) |
| `CLAUDE_PLUGIN_ROOT` | natively-provided env (passthrough) |
| `CLAUDE_PLUGIN_DATA` | natively-provided env (passthrough) |

No discovery dance. Call `gobbi config get …` or `gobbi workflow init` directly — `$CLAUDE_SESSION_ID` is already in the process env. If `$CLAUDE_SESSION_ID` is absent (hook not registered or custom Claude Code config), `gobbi workflow init` exits 2 with a remediation hint pointing to the SessionStart hook registration.

**THIRD — check gobbi CLI availability and version.** Run `gobbi --version` to verify the CLI is installed. If the command fails, load [cli-setup.md](cli-setup.md) and help the user install before proceeding. The CLI is required for workflow initialization, session management, config management, and validation. Without it, the workflow cannot function.

After confirming the CLI is present, run `gobbi --is-latest` to check whether the installed version matches the latest published release on npm. Exit-code semantics:

- **Exit 0** — installed version is current. Proceed without comment.
- **Exit 1** — installed version is stale. Surface the version delta to the user and offer to run the install command from [cli-setup.md](cli-setup.md) to update. Do not block session start — the user may choose to defer.
- **Exit 2** — indeterminate (network unavailable, registry error). Surface the diagnostic to the user but do not block. Proceed with the installed version.

**FOURTH — check for existing session settings.** Run:

```
gobbi config get workflow --level session
```

This reads `.gobbi/projects/<name>/sessions/{id}/settings.json` at the session level without cascade fallthrough. `$CLAUDE_SESSION_ID` is already in the process env from the SessionStart hook.

- **Exit 0** — session settings exist (this is a resume, post-`/clear`, or compact). Print the existing settings to the user and ask via AskUserQuestion whether to reuse them or reconfigure. If the user chooses to reuse, skip the setup questions and proceed directly to `gobbi workflow init`.
- **Exit 1** — no prior session settings. Proceed to the setup questions in FIFTH.
- **Exit 2** — a parse or I/O error occurred. Surface the stderr diagnostic to the user before proceeding.

**FIFTH — ask the user three setup questions** with AskUserQuestion (only if no existing settings were reused).

**First question — evaluation mode:**

How should gobbi handle evaluation stages by default this session? (A single answer applies to all three workflow steps — ideation, plan, execution.)

- **Ask each time (default, Recommended)** — before each evaluation stage, the orchestrator asks whether to spawn evaluators. Lets you decide per-step based on task complexity.
- **Always evaluate** — skip the evaluation question, always spawn evaluators at every stage. Maximum quality checking, no prompts to interrupt flow.
- **Skip evaluation** — skip the evaluation question, never spawn evaluators unless you explicitly request one. Maximum speed for well-understood tasks.
- **Let orchestrator decide** — the orchestrator decides per step based on context, without prompting. Corresponds to `'auto'` in config.

**Second question — git workflow mode:**

- **Direct commit (default)** — Work happens in the main working tree. Commits are created at FINISH. No worktrees, no PRs. Use for solo sessions or quick tasks.
- **Git workflow (worktree + PR)** — Each task gets its own worktree and branch. Work is integrated via pull request. If selected, also ask for the base branch (what branch to create feature branches from). When selected, the orchestrator verifies `_git` prerequisites (tool availability, authentication, repository state) before proceeding.

**Third question — notification channels:**

Multi-select. If any channel is selected alongside Skip, channels take priority.

- **Slack** — Notify via Slack bot message.
- **Telegram** — Notify via Telegram bot message.
- **Discord** — Notify via Discord webhook.
- **Desktop** — Notify via OS desktop notifications.
- **Skip notifications** — No notifications this session.

After selection, check `$CLAUDE_PROJECT_DIR/.claude/.env` for credentials. If credentials exist for the selected channels, enable notifications. If credentials are missing, load `_notification` and read the relevant channel doc (`slack.md`, `telegram.md`, `discord.md`) to help the user configure them before proceeding.

**After all three questions — persist session choices.** Write the user's selections to `.gobbi/projects/<name>/sessions/{id}/settings.json` via `gobbi config set`. All writes target `--level session` (the default). `$CLAUDE_SESSION_ID` is already in the process env from the SessionStart hook. Session settings set defaults for this session only; either can be overridden at any specific step.

Evaluation mode mapping — the same answer applies to all three steps:

- "Ask each time" writes `ask` for each step
- "Always evaluate" writes `always` for each step
- "Skip evaluation" writes `skip` for each step
- "Let orchestrator decide" writes `auto` for each step

```
gobbi config set workflow.ideation.evaluate.mode ask
gobbi config set workflow.planning.evaluate.mode ask
gobbi config set workflow.execution.evaluate.mode ask
```

Git settings (PR-FIN-1c shape — no `mode` field; worktrees always created):

```
gobbi config set git.pr.open true
gobbi config set git.baseBranch develop
```

Notifications — for each selected channel, set `enabled true`. Do NOT touch `events` or `triggers` (those are advanced config users edit manually):

```
gobbi config set notify.slack.enabled true
```

Discussion modes are NOT asked. Defaults apply: `workflow.ideation.discuss.mode` = `user`, `workflow.planning.discuss.mode` = `user`, `workflow.execution.discuss.mode` = `agent`. Users override these manually via `gobbi config set` if they want different behavior.

For explicit one-time scaffolding (e.g., first setup in a fresh repo before running `gobbi workflow init`), `gobbi config init` is also available:

```
gobbi config init                            # workspace seed — .gobbi/settings.json
gobbi config init --level project            # project seed — .gobbi/projects/<basename>/settings.json
gobbi config init --level project --project foo   # project seed for a non-basename project name
gobbi config init --level session            # session seed (CLAUDE_SESSION_ID from env)
gobbi config init --level workspace --force  # force re-seed if file already exists
```

Refuses without `--force` if the file already exists. Seed is `{schemaVersion: 1}` only.

**SIXTH — project context detection.** This runs automatically at session start without asking. Load [project-setup.md](project-setup.md) to execute detection.

This skill defines the agent principles, rules, and skill map you must follow.

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [cli-setup.md](cli-setup.md) | Gobbi CLI availability check, installation, and troubleshooting |
| [project-setup.md](project-setup.md) | Project-specific context and technology stack signals |
| [notification-setup.md](notification-setup.md) | Notification channel and credential detection |
| [git-setup.md](git-setup.md) | Git tooling and repository state detection |
| [design/v050-overview.md](../../design/v050-overview.md) | v0.5.0 state machine, 6-step state machine, workspace `state.db` + per-session `gobbi.db` + JSON memory (`session.json` + `project.json`) — authoritative architecture doc |

---

## Core Principles

> **Never edit gobbi skills without asking the user with AskUserQuestion.**

---

## Gobbi Skills

### Work

Workflow participant skills — loaded during the 6-step state machine: Configuration (CLI init phase), Ideation, Planning, Execution, Memorization, Handoff (Evaluation as sub-phase).

| Skill | Purpose |
|---|---|
| **_orchestration** | Adaptive workflow coordinator for v0.4.x skill-based orchestration — deprecated in v0.5.0. See `_orchestration/ARCHIVED.md` for historical reference and the v0.4.x-to-v0.5.0 step mapping. |
| **_discuss** | Critical, structured discussion. Challenge vague thinking, surface hidden problems, push ideas toward concrete specificity. |
| **_ideation** | Structured idea refinement. PI agents (innovative + best stances) improve the user's idea through discussion and synthesis. |
| **_plan** | Task decomposition. Break complex work into narrow, ordered, agent-assigned tasks. |
| **_research** | Research investigation. How researcher agents study codebase patterns, external approaches, and implementation paths for approved plans. |
| **_delegation** | Hand off work to subagents with the right context and scope boundaries. |
| **_execution** | Task execution guide. How an executor agent studies, plans, implements, and verifies. |
| **_evaluation** | Parent evaluation framework. How to delegate evaluation, select perspectives, and discuss findings. |
| **_collection** | Verify note completeness and write task README. Confirm all per-step subdirectories are populated, then write the summary. |
| **_memorization** | Save context for session continuity. Persist task details, gotchas, and rules. |
| **_note** | Write notes at every workflow step. Record decisions, outcomes, and context. |
| **_git** | Git/GitHub workflow. Worktree isolation, branch lifecycle, PR management, issue tracking. |
| **_notification** | Configure Claude Code notifications (Slack, Telegram, others) via conversation. |
| **_innovation** | Innovation stance skill. Defines how agents think when spawned as the innovative stance — creative, cross-domain, unconventional. |
| **_best-practice** | Best-practice stance skill. Defines how agents think when spawned as the best stance — proven patterns, evidence, community consensus. |
| **_gotcha** | Cross-project mistake recording. Check before acting, write after corrections. |

#### Evaluation Perspectives

Each Docs skill that supports evaluation has an `evaluation/` subdirectory containing perspective docs (project, architecture, performance, aesthetics, overall, user). Evaluator agents read the appropriate perspective doc from the target skill's `evaluation/` directory.

| Parent Skill | Evaluation Directory | Evaluates |
|---|---|---|
| **_skills** | `_skills/evaluation/` | Skill definitions |
| **_agents** | `_agents/evaluation/` | Agent definitions |
| **_project** | `_project/evaluation/` | Project documentation |

#### Git (child skills of _git)

Placeholder — specific child skills TBD.

#### Notification (child docs of _notification)

| Document | Purpose |
|---|---|
| **slack.md** | Slack notification setup and integration. |
| **telegram.md** | Telegram notification setup and integration. |
| **discord.md** | Discord notification setup and integration. |

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
| **_bun** | Bun runtime patterns for `packages/cli/` — subprocess spawning, SQLite access, bun:test runner, module-relative paths, and build/run script surface. Load when writing or reviewing Bun runtime code. |
| **_typescript** | TypeScript strict-mode discipline for `packages/cli/src/` — discriminated unions, `satisfies`/`assertNever` exhaustiveness gates, AJV boundary parsing, readonly conventions, and codegen-branded types. Load when authoring, reviewing, or debugging any `.ts` file. |

#### Evaluation criteria child docs

Eight skills include an `evaluation.md` child document that defines quality criteria for artifacts of that type: **_skills**, **_agents**, **_rules**, **_project**, **_gotcha**, **_evaluation**, **_innovation**, **_best-practice**. Each `evaluation.md` specifies what good output looks like, what problems to check for, and how to score quality. These criteria are used during creation (as a quality target), review (as a checklist), and audit (as a verification standard).
