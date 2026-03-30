---
name: gobbi-gotcha
description: Record and check cross-project agent gotchas, organized by gobbi skill. Check before acting, write after corrections.
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Gotcha

Record cross-project agent mistakes so they never happen twice. Each gotcha file matches a gobbi skill. Project-specific gotchas go to `.claude/project/gotchas/`.

**Cross-project gotchas by skill:**

| Gotcha File | For Skill | Covers |
|-------------|-----------|--------|
| [gobbi-orchestration.md](gobbi-orchestration.md) | gobbi-orchestration | Coordination, routing, phase transitions |
| [gobbi-discuss.md](gobbi-discuss.md) | gobbi-discuss | Prompt clarification, question quality |
| [gobbi-plan.md](gobbi-plan.md) | gobbi-plan | Task decomposition, dependency ordering |
| [gobbi-delegation.md](gobbi-delegation.md) | gobbi-delegation | Subagent briefings, context loading, scope boundaries |
| [gobbi-execution.md](gobbi-execution.md) | gobbi-execution | Implementation, verification |
| [gobbi-git.md](gobbi-git.md) | gobbi-git | Git/GitHub workflow, worktree management, branch handling |
| [gobbi-collection.md](gobbi-collection.md) | gobbi-collection | Work trail persistence, README indexing |
| [gobbi-evaluation.md](gobbi-evaluation.md) | gobbi-evaluation | Quality gates, evaluation criteria |
| [gobbi-ideation.md](gobbi-ideation.md) | gobbi-ideation | Brainstorming, option generation |
| [gobbi-claude.md](gobbi-claude.md) | gobbi-claude, gobbi-claude-skills, gobbi-claude-agents | `.claude/` documentation standard, skill and agent authoring |
| [gobbi-note.md](gobbi-note.md) | gobbi-note | Note writing, directory structure, timing |
| [gobbi-notification.md](gobbi-notification.md) | gobbi-notification | Hook setup, credentials, script issues |
| [gobbi-system.md](gobbi-system.md) | (none) | Environment, processes, hooks, infrastructure |
| [gobbi-security.md](gobbi-security.md) | (none) | Security vulnerability signals for evaluators |

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

**Cross-project** (applies to any project) → `gobbi-gotcha/{skill}.md`

**Project-specific** (applies to one project) → `.claude/project/gotchas/{category}.md`

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
| `enforcement` | hook, advisory | Optional (default: advisory) | Whether tooling can enforce this automatically |
| `pattern` | regex string | Only when enforcement: hook | Regex to match against (bash commands, file paths, etc.) |
| `event` | bash, file, stop | Only when enforcement: hook | Which hook event triggers the check |

When `enforcement` is `advisory` (or omitted), the entry is informational — agents check it manually. When `enforcement` is `hook`, the `pattern` and `event` fields tell tooling what to intercept and when. See representative examples in gobbi-system.md.
