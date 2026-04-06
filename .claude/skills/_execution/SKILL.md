---
name: _execution
description: Guide for executing a single well-scoped task with quality. Use when an agent receives a task briefing and needs to study, plan, implement, and verify its work.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# Task Execution Skill

Guide for how an executor agent approaches a single task. Load this skill when you receive a task briefing from the orchestrator.

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [gotchas.md](gotchas.md) | Known mistakes and corrections for _execution |

---

## Core Principle

> **Study before acting. The codebase is the source of truth, not the briefing.**

Read the relevant code, understand existing patterns, and check gotchas before writing a single line. The briefing tells you *what* to do — the codebase tells you *how* it should be done.

> **Research provides direction and references — you own the implementation quality.**

Research tells you which approach to take and points you to the best references. You figure out the best way to implement it. Consider clean code principles, established patterns, maintainability, and engineering judgment. Do not follow research mechanically — research is strategic guidance, not a step-by-step recipe. If the codebase has evolved since research was conducted, follow the codebase.

> **Think about best practice. Engineering judgment is your responsibility.**

You are not a transcription agent converting research notes into code. You are an engineer making implementation decisions. Consider: Is there a cleaner way to structure this? Does this pattern scale? Will a maintainer understand this in six months? Are there edge cases the research did not cover? When the research direction is clear but the implementation path has multiple valid options, choose the one that best serves readability, correctness, and maintainability.

> **Plan before coding. Outline the approach, then execute.**

For non-trivial tasks, form an internal plan: what files to change, what patterns to follow, what the expected result looks like. A few minutes of planning prevents an hour of rework.

> **One task, one focus. Stay within scope.**

You handle one task. Do it well. Don't fix adjacent issues, refactor surrounding code, or add improvements outside your scope boundary. If you notice something worth doing, note it in your final response — don't do it.

> **Verify against criteria, not assumptions.**

Check your work against the task's acceptance criteria and any relevant gotchas. Run tests if applicable. The task is done when the criteria are met, not when the code looks right to you.

---

## The Lifecycle

> **This sequence reflects the principle that understanding precedes action and verification precedes delivery. Adapt the depth of each phase to the task's complexity.**

### Study

Build understanding before acting by loading the context layers specified in your briefing. Each layer adds depth — start with standards, then narrow toward the code you'll change. When reading any documentation directory, read its README first — it provides the overview and index that orients you before diving into details.

- **Research materials** — read research notes from the task's `research/` directory. Start with `research.md` (synthesis), then check `results/` for detailed files relevant to your subtask
- **Documentation standard** (`_claude`) — how `.claude/` files work and how to write them
- **Project skill** — architecture, conventions, and constraints for the project you're working in
- **Gotchas** — check `_gotcha` and project-specific gotchas. Every gotcha exists because a past agent made that exact mistake
- **Domain skills** — any additional skills specified in the briefing that cover the problem domain
- **Relevant code** — read existing implementations in the area you'll modify. The codebase is the source of truth for patterns and style

### Plan

Outline your approach before implementing:

- Which files will you modify or create?
- What existing patterns should you follow?
- What are the gotchas that apply to this domain?
- What does the deliverable look like when done?

### Execute

Implement the task according to your plan, applying engineering judgment:

- Follow existing code patterns — the codebase is the style guide
- Apply best-practice thinking — consider readability, correctness, maintainability, and edge cases
- Use research direction as a guide, not a script — research tells you which approach to take, you determine the cleanest implementation
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

> **Before committing, re-verify the precondition: correct branch is checked out and no unexpected state changes occurred since verification.**

This extends _git's re-verification principle to the subagent level. A subagent that verifies its work but commits to the wrong branch has produced correct work in the wrong place.

### Final Response

The subagent's final response is automatically captured as the subtask record via `gobbi note collect`. Include in your final response: what was done, what changed, what was learned, and any open items. This is the permanent record of your work — make it self-contained.

### Commit (when _git is active)

This phase applies only when the delegation briefing specifies a worktree workflow (_git is active). Commit only after verification passes — never commit unverified work. Each subtask should produce one focused commit. Follow Conventional Commits format: the commit type and scope should match what the delegation briefing specifies for the task's domain. See `_git/conventions.md` for format details. The orchestrator owns pushing and PR creation — subagents commit but never push.

---

## Constraints

- Never skip context loading — agents without project context produce work that needs rework
- Never expand scope beyond the briefing's boundary
- Never modify files outside your task's scope without explicit instruction
- Never skip verification — check criteria and run tests before reporting done
