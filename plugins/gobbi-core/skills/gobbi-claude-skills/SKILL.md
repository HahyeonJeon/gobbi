---
name: gobbi-claude-skills
description: Reference and interactive guide for creating Claude Code skills. MUST load when creating, reviewing, or modifying .claude/skills/ definitions. Must load gobbi-claude and gobbi-discuss before using this skill.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion
---

# Claude Skills

Reference for understanding skill structure and interactive guide for creating new skills through discussion. Load this when creating, reviewing, or modifying any `.claude/skills/` definition. Load gobbi-claude for writing principles and gobbi-discuss for discussion mechanics before using this skill.

---

## Core Principles

> **Skills teach domains. Each skill owns one area of knowledge.**

A skill teaches domain knowledge reusable across any project — orchestration, evaluation, documentation standards, execution discipline. Skills are portable. Project-specific context belongs in `.claude/project/{project-name}/`, not in a skill.

> **Skills decompose into hierarchy like everything else.**

A broad domain skill has a parent SKILL.md that teaches the mental model and child `.md` files that specialize. The parent gives the agent enough context to decide which child to read. This prevents monolithic skills that agents skim.

> **Discuss before writing. Use AskUserQuestion to understand what the user needs.**

Never create a skill from a vague description. Discuss the domain, trigger scenarios, overlap with existing skills, and structural needs before writing anything. The Discussion Dimensions below guide what to ask about.

> **Explore existing skills before creating new ones.**

Read `.claude/skills/` to understand the current roster. Over-splitting weakens the agent's mental model — one skill per domain. If an existing skill already covers the knowledge area, extend it rather than creating a new one.

---

## Skill Structure

Every skill is flat: a directory containing SKILL.md and optional sibling `.md` files. No nested subdirectories within a skill directory.

**SKILL.md** is the entry point with YAML frontmatter. If child docs exist, SKILL.md lists them under a "Navigate deeper from here:" heading with short descriptions.

**Child `.md` files** are subtopic docs in the same directory, referenced from the parent's navigation table. Use children when the domain is broad enough that a single file would exceed the line budget or force agents to read content irrelevant to their task.

**Frontmatter** requires three fields: `name` (matches directory name), `description` (single line, specific trigger scenarios), `allowed-tools` (scoped to what the skill actually needs).

**Description** drives auto-invocation. Write in command tone: "Use when writing or reviewing X" — not "This skill provides X." Be specific enough to avoid misfiring on unrelated tasks.

**Naming** follows the `gobbi-*` prefix for gobbi skills. Directory name equals skill name equals invocation command.

Read existing skills in `.claude/skills/` for structural patterns — the codebase is the authoritative reference.

---

## Discussion Dimensions

When creating a new skill, use AskUserQuestion to explore these dimensions. Not every skill needs every question — pick the ones that address what is vague or missing.

### Understanding the Domain

- **Domain ownership** — What knowledge domain does this skill own? Is it distinct from existing skills, or does it overlap? If it overlaps, should the existing skill be extended instead?
- **Portability** — Is this knowledge reusable across projects, or specific to one project? Project-specific content belongs in `.claude/project/`, not a skill.
- **Existing coverage** — Does an existing skill already cover this domain? Read `.claude/skills/` before creating. Over-splitting weakens the agent's mental model.

### Defining the Trigger

- **Auto-invocation scenarios** — When should this skill auto-invoke? What specific user actions, file patterns, or task types trigger it? Vague triggers cause misfires.
- **Description specificity** — Is the description specific enough to avoid misfiring on unrelated tasks? Could it be confused with another skill's trigger? Test by asking: would this description match tasks that should NOT load this skill?
- **Tool scope** — Which tools does this skill actually need? Scope tightly — "just in case" tools dilute focus and widen the agent's action space unnecessarily.

### Designing the Structure

- **Hierarchy need** — Is SKILL.md sufficient, or does the domain need child docs? What are the natural subtopics? A single file works for focused domains; children work for broad ones.
- **Content boundaries** — What belongs in this skill vs. in project docs, rules, or agent definitions? Skills teach portable domain knowledge. Project constraints, agent role definitions, and session rules live elsewhere.
- **Line budget** — Can the core content fit under 200 lines? If not, which subtopics become children?

### Gotcha Awareness

- **Non-obvious pitfalls** — What mistakes are agents likely to make in this domain? What behavior seems correct but produces wrong results? These are candidates for gotcha entries.
- **Gotcha file need** — Should a gotcha file be created alongside the skill? Warranted when the domain has known pitfalls that are not obvious from reading the skill itself.

---

## Gotcha Writing Guidance

Gotcha files record mistakes that agents are likely to repeat because the correct behavior is non-obvious. They exist to short-circuit investigation — the next agent skips straight to the right approach.

**When a gotcha is warranted:**
- User corrects a non-obvious approach
- An error took significant debugging to resolve
- The same mistake has been made more than once
- A platform quirk caused unexpected behavior

**When to skip:**
- Simple typos or obvious mistakes
- Behavior already documented in the skill or a rule
- One-off issues unlikely to recur

**Where gotchas live:** Cross-project gotchas are organized by skill in `gobbi-gotcha/{skill-name}.md`. Project-specific gotchas go to `.claude/project/gotchas/`. Read existing gotcha files for the entry format — each entry has a title, priority, what happened, user feedback, and correct approach.

**Priority levels:** Critical (breaks environment), High (wrong output looks correct), Medium (rework needed), Low (minor inconvenience).

Read `gobbi-gotcha/SKILL.md` for the full gotcha framework. Read existing gotcha files like `gobbi-gotcha/gobbi-claude.md` for concrete examples of well-structured entries.

---

## Expected Output

The interactive creation process produces:

- A SKILL.md file with valid frontmatter in `.claude/skills/{skill-name}/`
- Optional child `.md` files for broad domains that exceed the line budget
- Optional gotcha file if the domain has known non-obvious pitfalls
- All output reviewed against gobbi-claude's review checklist before publishing

---

## Constraints

- Must follow gobbi-claude writing principles — principles over procedures, constraints over templates, codebase over examples
- No code examples, no BAD/GOOD comparison blocks, no step-by-step recipes
- Under 500 lines per file (must), targeting under 200 (should)
- Flat directory structure — SKILL.md plus sibling `.md` files, no nested subdirectories
- Content must be portable — no project-specific patterns in skills
- Always discuss with the user before creating — never generate a skill from a vague one-line description
- Core principles in the first ~50 lines of any skill
