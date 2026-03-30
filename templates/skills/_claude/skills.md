# Writing Skills

Guide for authoring `.claude/skills/<name>/SKILL.md` files. All skills in this system use underscore-prefixed naming and follow a flat structure.

---

## Core Principle

> **Skills teach domains. Each skill owns one area of knowledge.**

A skill teaches domain knowledge reusable across any project — orchestration principles, evaluation criteria, documentation standards, execution discipline. Skills are portable. Project-specific context belongs in `.claude/project/{project-name}/`, not in a skill.

> **Skills decompose into hierarchy like everything else.**

A broad domain skill can have child docs for focused subtasks. The parent teaches the mental model; children specialize. This prevents monolithic skills. Child docs live in the same directory as SKILL.md — no nested subdirectories within a skill directory.

> **All skills use underscore-prefixed naming.**

Skills use Python-style underscore prefixes: hidden skills start with `_` (e.g. `_orchestration`, `_plan`), internal skills start with `__` (e.g. `__evaluation-project`, `__plan-evaluation`), and the entry point is named `gobbi` (no prefix). Each skill directory contains a SKILL.md entry point and optional child `.md` files in the same directory. Read `.claude/skills/` for the current roster.

---

## Skill Structure

Every skill is flat: a directory containing SKILL.md and optional sibling `.md` files. No nested subdirectories within a skill directory.

| Component | Purpose |
|-----------|---------|
| `SKILL.md` | Entry point with frontmatter. Lists child docs under "Navigate deeper from here:" if children exist. |
| Child `.md` files | Subtopic docs in the same directory. Referenced from the parent's navigation table. |

Two skills have notable structural variations:

- **_gotcha** — SKILL.md plus per-skill `.md` gotcha files (e.g., `_execution.md`, `_claude.md`). Each gotcha file collects mistakes for one skill domain.
- **_note** — SKILL.md plus a `scripts/` subdirectory containing shell scripts for note metadata generation. This is the one exception to the no-subdirectories guideline.

---

## Writing Pattern

| Pattern | Principle |
|---------|-----------|
| **Description is critical** | Claude uses it for auto-invocation matching. Write in command tone: "Use when writing or reviewing X" — not "This skill provides X". |
| **Frontmatter complete** | Required: `name` (matches directory), `description` (single line, specific), `allowed-tools` (scoped). |
| **Hierarchy for broad domains** | Parent covers the mental model. Children specialize. "Navigate deeper from here:" table links to children. |
| **Front-load the mental model** | Core principles in the first ~50 lines. |
| **Short, descriptive naming** | Directory name = skill name = invocation command. |

---

## Anti-Pattern

### Must Avoid

| Anti-Pattern | Why It Fails |
|---|---|
| **Description too vague** | Auto-invocation misfires. Describe trigger scenarios specifically. |
| **Project-specific content in a skill** | Skills are portable. Project context belongs in `.claude/project/{project-name}/`. |
| **Nested subdirectories in skill dirs** | Skills are flat. Child docs are sibling `.md` files, not subdirectories. |

### Should Avoid

| Anti-Pattern | Why It Fails |
|---|---|
| **Over-splitting related topics** | Agent can't build a coherent mental model. One skill per domain. |
| **Flat skill covering too many workflows** | Agent skims. Decompose into children. |

---

## Review Checklist

- [ ] Content is portable — no project-specific patterns
- [ ] Structure is flat — SKILL.md + sibling `.md` files, no nested subdirectories
- [ ] `description` specific enough for accurate auto-invocation
- [ ] Core principles in first ~50 lines
- [ ] Under 500 lines (must), targeting under 200 (should)
