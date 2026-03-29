---
name: gobbi-execution
description: Guide for executing a single well-scoped task with quality. Use when an agent receives a task briefing and needs to study, plan, implement, and verify its work.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# Task Execution Skill

Guide for how an executor agent approaches a single task. Load this skill when you receive a task briefing from the orchestrator.

---

## Core Principle

> **Study before acting. The codebase is the source of truth, not the briefing.**

Read the relevant code, understand existing patterns, and check gotchas before writing a single line. The briefing tells you *what* to do — the codebase tells you *how* it should be done.

> **Plan before coding. Outline the approach, then execute.**

For non-trivial tasks, form an internal plan: what files to change, what patterns to follow, what the expected result looks like. A few minutes of planning prevents an hour of rework.

> **One task, one focus. Stay within scope.**

You handle one task. Do it well. Don't fix adjacent issues, refactor surrounding code, or add improvements outside your scope boundary. If you notice something worth doing, note it in your subtask doc — don't do it.

> **Verify against criteria, not assumptions.**

Check your work against the task's acceptance criteria and any relevant gotchas. Run tests if applicable. The task is done when the criteria are met, not when the code looks right to you.

---

## The Lifecycle

### Study

Build understanding before acting by loading the context layers specified in your briefing. Each layer adds depth — start with standards, then narrow toward the code you'll change:

- **Documentation standard** (`/claude`) — how `.claude/` files work and how to write them
- **Project skill** — architecture, conventions, and constraints for the project you're working in
- **Gotchas** — check `/gotcha` and project-specific gotchas. Every gotcha exists because a past agent made that exact mistake
- **Domain skills** — any additional skills specified in the briefing that cover the problem domain
- **Relevant code** — read existing implementations in the area you'll modify. The codebase is the source of truth for patterns and style

### Plan

Outline your approach before implementing:
- Which files will you modify or create?
- What existing patterns should you follow?
- What are the gotchas that apply to this domain?
- What does the deliverable look like when done?

### Execute

Implement the task according to your plan:
- Follow existing code patterns — the codebase is the style guide
- Keep changes minimal and focused on the task
- Don't introduce new patterns when existing ones work
- Don't add error handling, abstractions, or features beyond what's specified

### Verify

Check your work before reporting back:
- Does the implementation meet the acceptance criteria from the briefing?
- Do existing tests still pass?
- Are the gotchas for this domain respected?
- Is the change minimal — no scope creep, no bonus refactoring?
- If you modified anything in `.claude/`, are related docs still accurate?

### Commit (when gobbi-git is active)

This phase applies only when the delegation briefing specifies a worktree workflow (gobbi-git is active). Commit only after verification passes — never commit unverified work. Each subtask should produce one focused commit. Follow Conventional Commits format: the commit type and scope should match what the delegation briefing specifies for the task's domain. See `gobbi-git/conventions.md` for format details. The orchestrator owns pushing and PR creation — subagents commit but never push.

---

## Writing Your Subtask Doc

After completing the task, write your result to the subtask doc path specified in the briefing. Include:
- What was done — the deliverable, concisely described
- What changed — which files and why (the code is in the repo, not duplicated here)
- What was learned — any non-obvious constraints or patterns discovered
- Open items — anything out of scope that should be addressed later

The doc must be self-contained — a reader should understand your result without reading other subtask docs.

---

## Constraints

- Never skip context loading — agents without project context produce work that needs rework
- Never expand scope beyond the briefing's boundary
- Never modify files outside your task's scope without explicit instruction
- Never skip verification — check criteria and run tests before reporting done
