---
name: _gotcha
description: Record and check cross-project agent gotchas. Check before acting, write after corrections.
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Gotcha

Record cross-project agent mistakes so they never happen twice. Each gotcha file covers a domain area. Project-specific gotchas go to `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/gotchas/`.

**Skill-specific gotchas** live in each skill's directory as `gotchas.md`. Agents loading a skill automatically see its gotchas without loading `_gotcha`:

| Skill | Gotcha file |
|-------|-------------|
| _orchestration | `_orchestration/gotchas.md` |
| _git | `_git/gotchas.md` |
| _notification | `_notification/gotchas.md` |
| _claude | `_claude/gotchas.md` |
| _execution | `_execution/gotchas.md` |
| _collection | `_collection/gotchas.md` |
| _delegation | `_delegation/gotchas.md` |
| _note | `_note/gotchas.md` |
| _plan | `_plan/gotchas.md` |

**Cross-cutting gotchas** stay in `_gotcha/` for concerns that span multiple skills:

| Gotcha File | Covers |
|-------------|--------|
| [__system.md](__system.md) | Environment, processes, hooks, infrastructure |
| [__security.md](__security.md) | Security vulnerability signals for evaluators |

---

## Core Principle

> **If it happened once, record it. If it happened twice, it's a gotcha.**

Gotchas are mistakes that agents are likely to repeat because the correct behavior is non-obvious. They short-circuit the investigation — so the next agent skips straight to the right approach.

> **Check gotchas before acting, not after failing.**

Before starting a task, scan the relevant gotcha file for that workflow step. A 30-second read prevents a 30-minute debugging session.

> **Every gotcha has a user behind it.**

Each entry exists because a user experienced a problem. The user's feedback is the most important part.

---

## Where to Save

> **Default: colocate with the skill.**

Most gotchas belong to a specific skill. Write them to `{skill-name}/gotchas.md` so agents loading the skill see them automatically.

**Skill-specific** (default) → `.claude/skills/{skill-name}/gotchas.md` — colocated with the skill it corrects. An agent loading the skill reads its own gotchas without loading `_gotcha`.

**Cross-cutting** (rare) → `_gotcha/{topic}.md` — only for concerns that span multiple skills or belong to no single skill (environment, security, infrastructure).

**Project-specific** (applies to one project) → `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/gotchas/{category}.md`

---

## When to Write

**Write when:** user corrects a non-obvious approach, error took significant debugging, same mistake repeated, platform quirk caused unexpected behavior.

**Skip when:** simple typo, obvious from reading the codebase, already in a rule or skill.

---

## How to Write

Each `{skill}.md` file contains multiple gotcha entries. Each entry has:

**Title** — Short, descriptive name

**Priority** — Critical (breaks environment), High (wrong output looks correct), Medium (rework needed), Low (minor)

**What happened** — What the agent did wrong and the result.

**User feedback** — What the user said.

**Correct approach** — What to do instead.

---

## Machine-Readable Metadata

Gotcha entries may include optional YAML frontmatter for tooling. The frontmatter goes between `---` markers immediately after the `###` heading line, before the prose body. Entries without frontmatter continue to work — the prose body (what happened, user feedback, correct approach) remains the primary content.

**Fields:**

| Field | Values | Required | Purpose |
|-------|--------|----------|---------|
| `priority` | critical, high, medium, low | Optional | Overrides the prose Priority line for machine readers |
| `tech-stack` | comma-separated lowercase identifiers (e.g., node, python, docker, typescript) | Optional | Tags the entry with technology context — agents working in a specific tech context can filter gotchas by this field |
| `enforcement` | hook, advisory | Optional (default: advisory) | Whether tooling can enforce this automatically |
| `pattern` | regex string | Only when enforcement: hook | Regex to match against (bash commands, file paths, etc.) |
| `event` | bash, file, stop | Only when enforcement: hook | Which hook event triggers the check |

When `enforcement` is `advisory` (or omitted), the entry is informational — agents check it manually. When `enforcement` is `hook`, the `pattern` and `event` fields tell tooling what to intercept and when. See representative examples in _system.md.

---

## Child Documents

| Document | Covers |
|----------|--------|
| `project-gotcha.md` | Recording project-specific gotchas in `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/gotchas/` |
| `skills-gotcha.md` | Recording skill-specific gotchas tied to individual skills |
