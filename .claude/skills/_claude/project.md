# Writing Project Documentation

Guide for authoring project-specific documentation. Project docs live in `.claude/project/{project-name}/`, managed by gobbi.

---

## Core Principle

> **Project docs live in `.claude/project/{project-name}/`.**

Each project gets its own directory under `.claude/project/`. All project-specific documentation — design, architecture, rules, gotchas, notes, references — lives inside that directory. This keeps everything about a project co-located and navigable from a single entry point.

> **Project docs decay fast — currency matters more than completeness.**

Project docs describe a moving target. A stale doc is worse than no doc — it actively misleads agents into wrong assumptions. Scan for staleness whenever touching related code and docs.

> **Every directory has a README.md as entry point.**

The README summarizes what the directory is about and lists its contents. Agents read the README first to decide which docs to load.

---

## Project Directory Structure

All projects must follow this consistent structure:

```
.claude/project/{project-name}/
  README.md             — project overview and directory index
  design/               — project design and architecture
  rules/                — project-specific rules and conventions
  gotchas/              — project-specific gotchas (not cross-project)
  note/                 — workflow notes per task (managed by _note)
  reference/            — external references, API docs, research
  docs/                 — other project documents
```

Not every project needs every subdirectory. Create only the directories that have content.

### README.md

Project overview and index. Must list:
- Project name and purpose (one sentence)
- Links to each subdirectory with one-line descriptions
- Current status or active work (if any)

### design/

Project design decisions and architecture. How the system is designed, why decisions were made, and what trade-offs were accepted.

### rules/

Project-specific rules and conventions. Standards that apply only to this project — coding patterns, naming conventions, deployment rules. These are separate from gobbi's cross-project rules.

### gotchas/

Project-specific gotchas. Mistakes and corrections that apply only to this project. Categorized by domain (e.g., `auth.md`, `deployment.md`). Separate from cross-project gotchas in `_gotcha/`.

### note/

Workflow notes per task, managed by _note. Each task gets a directory named `{YYYYMMDD}-{HHMM}-{slug}-{session_id}` (e.g., `20260328-0951-installation-system-ed5b2db3-7d89-4208-a25b-8ad0889a0c80`). Inside each note directory:

- Per-step notes: ideation.md, plan.md, execution.md, feedback.md, review.md
- `subtasks/` — per-agent result files from delegated work (e.g., `01-developer-agent.md`)
- Optional `README.md` — task summary with YAML frontmatter metadata (session_id, datetime, git_branch, task name)

### reference/

External references — API docs, research findings, third-party documentation, links to external systems. Information that comes from outside the codebase.

### docs/

Other project documents that don't fit into the above categories.

---

## Writing Pattern

| Pattern | Principle |
|---------|-----------|
| **Self-contained** | Each doc makes sense on its own without reading others. First lines tell the agent what it covers and when to read it. |
| **Archive, don't hoard** | Delete superseded docs. Don't accumulate stale content. |
| **Focused scope** | Split by topic, not by length. If a doc covers multiple unrelated systems, split it. |

---

## Anti-Pattern

### Must Avoid

| Anti-Pattern | Why It Fails |
|---|---|
| **Stale docs left in place** | References deleted files, describes "planned" features already built. Agents make wrong assumptions. |
| **Inconsistent directory structure** | Missing README.md or standard subdirectories. Agents can't navigate reliably. |
| **Project gotchas in _gotcha** | Project-specific gotchas must go in `{project-name}/gotchas/`, not in the cross-project gotcha skill. |

### Should Avoid

| Anti-Pattern | Why It Fails |
|---|---|
| **Duplicate docs for same topic** | Created without checking existing. Search before creating. |
| **No cleanup strategy** | Everything accumulates. Delete what's no longer relevant. |

---

## Review Checklist

Before publishing a project doc:

**Core Principle**
- [ ] Lives inside `.claude/project/{project-name}/`
- [ ] Contains project-specific context, not general domain knowledge
- [ ] Content is current — no references to deleted files or outdated architecture
- [ ] Directory has README.md as entry point

**Writing Pattern**
- [ ] Self-contained — makes sense without reading other docs
- [ ] Organized by topic with clear first-line summary
- [ ] Focused on one coherent system or topic

**Anti-Pattern**
- [ ] No stale references to removed code or outdated architecture (must avoid)
- [ ] No duplicate covering same topic as existing doc (should avoid)
