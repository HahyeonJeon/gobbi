# Project Setup

Check for `.claude/project/` at session start. If project documentation exists, read it for context. If not, create the project directory using the _claude-project skill.

---

## Core Principle

> **Every project needs a `.claude/project/{project-name}/` directory.** 

Notes, gotchas, and project documentation accumulate here across sessions. Without it, workflow output has nowhere to persist.

> **Read only `README.md`, `design/`, and `gotchas/` at setup.**

Other directories like `note/` may contain many files and are not needed for session context. Keep setup lightweight.

---

## Setup Sequence

Runs automatically at every session start, after the setup questions and before the first task.

### 1. Check for Existing Project Directory

Look for `.claude/project/` and identify any `{project-name}/` subdirectories. If one exists, read only these for context:

- `README.md` — project overview and conventions
- `design/` — architecture and design decisions
- `gotchas/` — project-specific mistakes to avoid

Do not read other directories (e.g., `note/`) at setup — they may contain many files and are not needed for session context.

### 2. New Projects

When `.claude/project/` is absent or has no project subdirectory, load the _claude-project skill to create the directory structure.

---

## Constraints

- Setup must be lightweight — check a few paths, read existing docs if present
- Never generate a user-facing report or summary document. Output is internal orchestrator context only.
- Skip setup for gobbi's own repository — `.claude/project/` is already structured
- When `.claude/project/` docs exist, trust them over filesystem inference
