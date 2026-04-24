---
name: _gotcha
description: Gotcha recording and checking system. Load when writing gotchas after corrections or checking gotchas before acting.
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Gotcha

Guide for the gotcha system — recording mistakes so agents never repeat them, and checking mistakes before acting so agents avoid them.

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [__security.md](__security.md) | Security vulnerability signals for evaluators |
| [__system.md](__system.md) | Environment, processes, hooks, infrastructure |
| [evaluation.md](evaluation.md) | Quality criteria for evaluating gotcha entries |
| [project-gotcha.md](project-gotcha.md) | How to record project-specific gotchas |
| [skills-gotcha.md](skills-gotcha.md) | How to record skill-specific gotchas |

---

## Core Principle

> **Check gotchas before acting, not after failing.**

Every agent MUST read `gotchas.md` when loading a skill. A 30-second read prevents a 30-minute debugging session. This is not optional — gotchas are the highest-value knowledge in the system.

> **If it happened once, record it. If it happened twice, it's a gotcha.**

Gotchas are mistakes that agents repeat because the correct behavior is non-obvious. They short-circuit investigation — the next agent skips straight to the right approach.

> **Every gotcha has a user behind it.**

Each entry exists because a user experienced a problem. The user's feedback is the most important part.

---

## When to Read

**MUST read `gotchas.md` when loading any skill that has one.** This is a rule, not a suggestion. When an agent loads `_git`, it reads `_git/gotchas.md`. When an agent loads `_orchestration`, it reads `_orchestration/gotchas.md`. No exceptions.

**MUST read project-specific gotchas** at `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/gotchas/` when starting work on a project.

**MUST read cross-cutting gotchas** (`_gotcha/__system.md`, `_gotcha/__security.md`) when the task involves environment setup, hooks, or security-sensitive work.

---

## Where Gotchas Live

> **Default: colocate with the skill.**

Most gotchas belong to a specific skill. Write them to `{skill-name}/gotchas.md` so agents loading the skill read them automatically.

**Skill-specific** (default) → `.claude/skills/{skill-name}/gotchas.md` — colocated with the skill it corrects.

**Cross-cutting** (rare) → `_gotcha/{topic}.md` — only for concerns that span multiple skills or belong to no single skill (environment, security, infrastructure).

| Gotcha File | Covers |
|---|---|
| [__system.md](__system.md) | Environment, processes, hooks, infrastructure |
| [__security.md](__security.md) | Security vulnerability signals for evaluators |

**Project-specific** → `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/gotchas/{category}.md`

---

## When to Write

**Write when:** user corrects a non-obvious approach, error took significant debugging, same mistake repeated, platform quirk caused unexpected behavior.

**Skip when:** simple typo, obvious from reading the codebase, already in a rule or skill.

**Write immediately** — a correction not recorded is a correction repeated. Do not defer gotcha writing to the end of the session.

---

## How to Write

Each `gotchas.md` file contains multiple entries. Each entry has:

**Title** — Short, descriptive name

**Priority** — Critical (breaks environment), High (wrong output looks correct), Medium (rework needed), Low (minor)

**What happened** — What the agent did wrong and the result.

**User feedback** — What the user said.

**Correct approach** — What to do instead.

---

## Machine-Readable Metadata

Gotcha entries may include optional YAML frontmatter for tooling. The frontmatter goes between `---` markers immediately after the `###` heading line, before the prose body. Entries without frontmatter continue to work — the prose body remains the primary content.

**Fields:**

| Field | Values | Required | Purpose |
|---|---|---|---|
| `priority` | critical, high, medium, low | Optional | Overrides the prose Priority line for machine readers |
| `tech-stack` | comma-separated lowercase identifiers (e.g., node, python, docker, typescript) | Optional | Tags the entry with technology context |
| `enforcement` | hook, advisory | Optional (default: advisory) | Whether tooling can enforce this automatically |
| `pattern` | regex string | Only when enforcement: hook | Regex to match against |
| `event` | bash, file, stop | Only when enforcement: hook | Which hook event triggers the check |

---

## Child Documents

| Document | Covers |
|---|---|
| `project-gotcha.md` | Recording project-specific gotchas in `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/gotchas/` |
| `skills-gotcha.md` | Recording skill-specific gotchas tied to individual skills |
| `evaluation.md` | Quality criteria for evaluating user-created gotcha entries |
