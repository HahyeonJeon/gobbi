# Project Setup

Check for `$CLAUDE_PROJECT_DIR/.claude/project/` at session start. If project documentation exists, read it for context. If not, create the project directory using the _project skill.

---

## Core Principle

> **Every project needs a `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/` directory.**

Notes, gotchas, and project documentation accumulate here across sessions. Without it, workflow output has nowhere to persist.

> **Read only `README.md`, `design/`, and `gotchas/` at setup.**

Other directories like `note/` may contain many files and are not needed for session context. Keep setup lightweight.

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

### 3. New Projects

When `$CLAUDE_PROJECT_DIR/.claude/project/` is absent or has no project subdirectory, ask the user for a project name via AskUserQuestion, then create the full standard structure:

- `$CLAUDE_PROJECT_DIR/.claude/project/{name}/README.md` — project overview and directory index
- `$CLAUDE_PROJECT_DIR/.claude/project/{name}/design/` — architecture and design decisions
- `$CLAUDE_PROJECT_DIR/.claude/project/{name}/rules/` — project-specific rules and conventions
- `$CLAUDE_PROJECT_DIR/.claude/project/{name}/gotchas/` — project-specific gotchas
- `$CLAUDE_PROJECT_DIR/.claude/project/{name}/note/` — workflow notes per task (managed by _note)
- `$CLAUDE_PROJECT_DIR/.claude/project/{name}/reference/` — external references, API docs, research
- `$CLAUDE_PROJECT_DIR/.claude/project/{name}/docs/` — other project documents

Create all directories upfront. The README.md must list each directory with a one-line description. Load `_project` for detailed authoring guidelines if the user wants to populate design docs or rules immediately.

---

## Constraints

- Setup must be lightweight — check a few paths, read existing docs if present
- Never generate a user-facing report or summary document. Output is internal orchestrator context only.
- Skip setup for gobbi's own repository — `$CLAUDE_PROJECT_DIR/.claude/project/` is already structured
- When `$CLAUDE_PROJECT_DIR/.claude/project/` docs exist, trust them over filesystem inference
