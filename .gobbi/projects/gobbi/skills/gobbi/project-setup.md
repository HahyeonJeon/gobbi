# Project Setup

> Status: v0.5.0 stable — updated 2026-04-19

Check for project directories at session start. Two layers exist in v0.5.0: the static-knowledge layer at `$CLAUDE_PROJECT_DIR/.claude/project/{name}/` and the runtime layer at `$CLAUDE_PROJECT_DIR/.gobbi/sessions/{session-id}/`. This doc covers detection and setup of both.

---

## Core Principle

> **Every project needs a `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/` directory.**

Notes, gotchas, and project documentation accumulate here across sessions. Without it, workflow output has nowhere to persist in the permanent record.

> **Read only `README.md`, `design/`, and `gotchas/` at setup.**

Other directories like `note/` may contain many files and are not needed for session context. Keep setup lightweight.

---

## Directory Model in v0.5.0

V0.5.0 splits runtime and static-knowledge into separate root directories:

`.claude/` is the static-knowledge layer. Skills, rules, agents, and project docs live here. This directory is not written to during an active session — it is read-only during workflow.

`.gobbi/` is the runtime layer. Per-session directories (`sessions/{session-id}/`) hold the per-session event store (`gobbi.db`) plus `session.json` (per-session telemetry, written once at memorization-step entry). Notes recorded during an active session write to `.gobbi/sessions/{id}/` via `gobbi workflow capture-subagent`. This directory is gitignored and does not persist across repository clones.

When `gobbi workflow init` runs, it creates `.gobbi/sessions/{session-id}/` automatically. Detection below determines whether the static-knowledge layer is also ready.

---

## Setup Sequence

Runs automatically at every session start, after the setup questions and before the first task.

### 1. Scan the Project's `.claude/` Directory

Check what the project already has in `$CLAUDE_PROJECT_DIR/.claude/`:

- **CLAUDE.md** — read it for project-level instructions and context
- **`rules/`** — list existing rule files and read them for project conventions
- **`skills/`** — list existing project-specific skills (not gobbi skills). These are the user's domain skills. Read their SKILL.md descriptions to understand what the project has.
- **`agents/`** — list existing project-specific agents. Read their descriptions to understand available specialists.

This gives the orchestrator context about what the project already provides — avoiding duplicate creation and enabling informed delegation.

### 2. Check for Existing Project Directory

Look for `$CLAUDE_PROJECT_DIR/.claude/project/` and identify any `{project-name}/` subdirectories. If one exists, read only these for context:

- `README.md` — project overview and conventions
- `design/` — architecture and design decisions
- `gotchas/` — project-specific mistakes to avoid

Do not read other directories (e.g., `note/`) at setup — they may contain many files and are not needed for session context.

### 3. Check for Active Session Runtime Directory

Look for `$CLAUDE_PROJECT_DIR/.gobbi/sessions/` to understand the runtime state. This directory is created by `gobbi workflow init` on the first run. If it does not exist, no sessions have been initialized yet — this is normal for new projects.

Notes written during an active session go to `.gobbi/sessions/{session-id}/` (ephemeral, gitignored). After a session completes, retrospective archive notes land in `.claude/project/{name}/note/` (also gitignored, main-tree only). Do not confuse the two locations — the runtime path is transient; the archive path is persistent.

### 4. New Projects

When `$CLAUDE_PROJECT_DIR/.claude/project/` is absent or has no project subdirectory, ask the user for a project name via AskUserQuestion, then create the full standard structure:

- `$CLAUDE_PROJECT_DIR/.claude/project/{name}/README.md` — project overview and directory index
- `$CLAUDE_PROJECT_DIR/.claude/project/{name}/design/` — architecture and design decisions
- `$CLAUDE_PROJECT_DIR/.claude/project/{name}/rules/` — project-specific rules and conventions
- `$CLAUDE_PROJECT_DIR/.claude/project/{name}/gotchas/` — project-specific gotchas
- `$CLAUDE_PROJECT_DIR/.claude/project/{name}/note/` — workflow notes per task (managed by `_note`)
- `$CLAUDE_PROJECT_DIR/.claude/project/{name}/reference/` — external references, API docs, research
- `$CLAUDE_PROJECT_DIR/.claude/project/{name}/docs/` — other project documents

Create all directories upfront. The README.md must list each directory with a one-line description. Load `_project` for detailed authoring guidelines if the user wants to populate design docs or rules immediately.

### 5. Help Set Up Claude Docs

After project directory setup, check what the project is missing in `$CLAUDE_PROJECT_DIR/.claude/` and offer to help create them via AskUserQuestion. This is the onboarding moment — guide the user toward a well-structured project.

**CLAUDE.md** — If absent, offer to create one. It should contain project-level instructions, tech stack, and key conventions. This is the first thing Claude reads every session.

**Rules** — If `$CLAUDE_PROJECT_DIR/.claude/rules/` is empty, ask the user about project conventions that should be enforced — code style, testing requirements, commit conventions, naming patterns. Load `_rules` to help author them. Gobbi already provides its own convention rules — project rules should cover project-specific standards only.

**Skills** — If the project has no project-specific skills, suggest creating domain-specific ones. These should be tailored to the project's tech stack — a Python/Django project benefits from skills that know Django ORM patterns, a TypeScript/React project benefits from skills that know component conventions. Load `_skills` to help author them. Gobbi already provides workflow and docs skills — project skills should cover project-specific domain knowledge.

**Agents** — If the project has no project-specific agents, suggest creating specialists for the project's common tasks — a security reviewer that knows the auth stack, a test writer that knows the testing framework, a migration specialist that knows the ORM. Load `_agents` to help author them. Gobbi already provides orchestration and evaluation agents.

Do not create all of these at once — ask the user which they want to set up now and which to defer. The goal is awareness that these exist and can be created, not a mandatory setup gate.

---

## Constraints

- Setup must be lightweight — check a few paths, read existing docs if present
- Never generate a user-facing report or summary document. Output is internal orchestrator context only.
- Skip setup for gobbi's own repository — `$CLAUDE_PROJECT_DIR/.claude/project/` is already structured
- When `$CLAUDE_PROJECT_DIR/.claude/project/` docs exist, trust them over filesystem inference
- Never create `.gobbi/` directories manually — `gobbi workflow init` creates the runtime directory; detection here is read-only
