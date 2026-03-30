---
name: _gotcha
description: Record and check cross-project agent gotchas, organized by gobbi skill. Check before acting, write after corrections.
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Gotcha

Record cross-project agent mistakes so they never happen twice. Each gotcha file matches a gobbi skill. Project-specific gotchas go to `.claude/project/gotchas/`.

**Cross-project gotchas by skill:**

| Gotcha File | For Skill | Covers |
|-------------|-----------|--------|
| [_orchestration.md](_orchestration.md) | _orchestration | Coordination, routing, phase transitions |
| [_discuss.md](_discuss.md) | _discuss | Prompt clarification, question quality |
| [_plan.md](_plan.md) | _plan | Task decomposition, dependency ordering |
| [_delegation.md](_delegation.md) | _delegation | Subagent briefings, context loading, scope boundaries |
| [_execution.md](_execution.md) | _execution | Implementation, verification |
| [_collection.md](_collection.md) | _collection | Work trail persistence, README indexing |
| [_evaluation.md](_evaluation.md) | _evaluation | Quality gates, evaluation criteria |
| [_ideation.md](_ideation.md) | _ideation | Brainstorming, option generation |
| [_claude.md](_claude.md) | _claude | `.claude/` documentation, skill/agent authoring |
| [_hack.md](_hack.md) | _hack | Patch generation, override layer |
| [_note.md](_note.md) | _note | Note writing, directory structure, timing |
| [_notification.md](_notification.md) | _notification | Hook setup, credentials, script issues |
| [__system.md](__system.md) | (none) | Environment, processes, hooks, infrastructure |

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

**Cross-project** (applies to any project) → `_gotcha/{skill}.md`

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
