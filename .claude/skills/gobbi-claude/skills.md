# Writing Skills

Guide for authoring `.claude/skills/<name>/SKILL.md` files. There are two categories: **skills** (general-purpose domain knowledge) and **project-skills** (project-specific implementation guides with docs, logs, and memory).

---

## Core Principle

> **Two categories: skills teach domains, project-skills own projects.**

A **skill** teaches general domain knowledge reusable across any project — Python best practices, React patterns, Remotion conventions. A **project-skill** owns a specific project — its implementation philosophy, architecture docs, workflow logs, and memory. Both use the same SKILL.md format but serve different purposes and follow different structural rules.

> **Skills decompose into hierarchy like everything else.**

A broad domain skill can have child docs for focused subtasks. The parent teaches the mental model; children specialize. This prevents monolithic skills.

---

## Skills (General-Purpose)

Skills like `python`, `react`, `typescript`, `visx`, `remotion`, `motion`, `elt`, `lakehouse`, `spark`, `iceberg`, `airflow`, `youtube`, `claude`, `orchestrate`, `eye`, `git`, `gotcha`.

| Pattern | Principle |
|---------|-----------|
| **Portable** | Content applies to any project using the domain. No project-specific code, paths, or conventions. |
| **SKILL.md + child docs** | SKILL.md is the entry point with "Navigate deeper from here:" table. Child `.md` files cover subtopics. |
| **No project artifacts** | No log/, memory/, architecture/, or other project directories. Skills are pure knowledge. |

---

## Project-Skills (Project-Specific)

Project-skills like `playviz`, `playinganalytics`. Each project-skill owns one project's entire context.

| Pattern | Principle |
|---------|-----------|
| **Project-specific** | Contains the project's implementation philosophy, architectural decisions, and conventions that don't apply elsewhere. |
| **SKILL.md + child docs + project directories** | SKILL.md is the entry point. Child docs cover implementation domains (chart.md, graphics.md). Directories hold project artifacts. |
| **Standard directories** | Project-skills follow a consistent directory structure: |

| Directory | Purpose |
|---|---|
| `SKILL.md` | Entry point — project philosophy, implementation guide |
| Child `.md` files | Domain implementation guides |
| `architecture/` | Design docs — philosophy, rules, structure |
| `reference/` | Research findings, external API docs, examination results |
| `review/` | Code review reports, architecture audits |
| `validation/` | Checklists and scenarios for verifying updates |
| `work/` | Workflow records — session directories with prompts, plans, results |
| `memory/` | Persistent cross-session knowledge, including `gotchas/` |
| `legacy/` | Archived superseded docs |

---

## Writing Pattern (Both Categories)

| Pattern | Principle |
|---------|-----------|
| **Description is critical** | Claude uses it for auto-invocation matching. Write in command tone: "Use when writing or reviewing X" — not "This skill provides X". |
| **Frontmatter complete** | Required: `name` (matches directory), `description` (single line, specific), `allowed-tools` (scoped). |
| **Hierarchy for broad domains** | Parent covers the mental model. Children specialize. |
| **Front-load the mental model** | Core principles in the first ~50 lines. |
| **Short, descriptive naming** | Directory name = skill name = invocation command. |

---

## Anti-Pattern

### Must Avoid

| Anti-Pattern | Why It Fails |
|---|---|
| **Description too vague** | Auto-invocation misfires. Describe trigger scenarios specifically. |
| **Project-specific content in a skill** | Skills are portable. Project context belongs in a project-skill. |
| **Project artifacts in a skill** | log/, memory/, architecture/ directories belong only in project-skills. |

### Should Avoid

| Anti-Pattern | Why It Fails |
|---|---|
| **Over-splitting related topics** | Agent can't build a coherent mental model. One skill per domain. |
| **Flat skill covering too many workflows** | Agent skims. Decompose into children. |

---

## Review Checklist

**For skills (general-purpose):**
- [ ] Content is portable — no project-specific patterns
- [ ] No project directories (log/, memory/, architecture/)
- [ ] `description` specific enough for accurate auto-invocation
- [ ] Core principles in first ~50 lines

**For project-skills:**
- [ ] Contains project-specific context, not general domain knowledge
- [ ] Standard directories present (architecture/, log/, memory/)
- [ ] Each directory has README.md as entry point
- [ ] `description` identifies the project and when to use it
