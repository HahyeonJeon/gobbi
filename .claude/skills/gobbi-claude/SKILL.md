---
name: gobbi-claude
description: Understand and author .claude/ documentation (CLAUDE.md, skills, rules, agents, memories). Use when reading .claude/ files to understand their structure and definitions, or when creating and updating any file in the .claude/ directory. Enforces concise, principle-based writing that helps agents think rather than prescriptive instructions that agents blindly follow.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# Claude Skill

Understand the `.claude/` directory structure and definitions, and write effective documentation that helps agents **think**, not blindly follow orders. Load this skill both when reading `.claude/` files (to understand how they are organized) and when authoring them (to follow the documentation standard).

**Navigate deeper from here:**

| Writing... | Read | Covers |
|------------|------|--------|
| A skill | [skills.md](skills.md) | Frontmatter, descriptions for auto-invocation, skill vs rule, scoping |
| A rule | [rules.md](rules.md) | Verifiability, structure, when to create a rule |
| An agent definition | [agents.md](agents.md) | Frontmatter, scope boundaries, role vs procedure |
| Project documentation | [project.md](project.md) | Project docs live in `.claude/project/{project-name}/`, consistent directory structure |

---

## Core Principle

> **Claude docs are teaching materials, not command scripts.**

Every `.claude/` file should build the agent's **mental model** — how things work and why — so it makes good decisions in novel situations.

> **Write in hierarchy — decompose top-down, navigate on demand.**

Documents should decompose content like a chain of thought — each file covers one level of abstraction and lists its child documents under a **"Navigate deeper from here:"** heading with short descriptions. The parent gives the agent enough context to decide *which* child to read, so it only loads what's relevant. This keeps each file focused, prevents monolithic docs that agents skim, and lets context scale without bloating any single file. Apply recursively: if a child grows complex, it becomes a parent with its own children.

> **First line tells the agent what this doc is and when to read it.**

Every document opens with a clear statement of its purpose and scope. An agent scanning a file list should know from the first line whether this doc is relevant to its current task — without reading further.

---

## Writing Pattern

What effective `.claude/` documentation looks like:

| Pattern | Principle |
|---------|-----------|
| **Principles over procedures** | State what matters and why. "Each component decomposes into X, Y, Z — read existing code for the pattern." |
| **Constraints over templates** | Tell agents what NOT to do (clear boundary) rather than what TO do (rigid path). Constraints leave room for judgment. |
| **Codebase over examples** | Point agents to read existing implementations. The codebase is the single source of truth. |
| **Line limit** | **Must** stay under 500 lines per file. **Should** target under 200 lines. If a file exceeds this, decompose into hierarchy. |

**CLAUDE.md specifically**: Reference card, not tutorial. Don't duplicate content from skills or rules — link to them. Loaded every session, so make it scannable.

---

## Anti-Pattern

### Must Avoid

These directly cause the mimicry problem. Presence of any of these means the doc needs revision.

| Anti-Pattern | Why It Fails |
|---|---|
| **Code examples** | Agent copies verbatim without adapting to context. The codebase has real examples. |
| **BAD/GOOD comparison blocks** | Agent memorizes the GOOD block as a mandatory template. |
| **Step-by-step recipes** | Agent follows rigidly, skips steps that matter, adds steps that don't. |
| **Duplicating codebase patterns** | Creates a second source of truth that drifts from reality. |

### Should Avoid

These weaken doc quality and lead to subtle issues over time. Acceptable in small doses with good reason.

| Anti-Pattern | Why It Fails |
|---|---|
| **Interface definitions in docs** | Get stale, agent uses doc version instead of actual source. |
| **Long rationale paragraphs** | Agent skips them, reads only the nearby concrete content. |
| **Exact numeric values** | Agent uses the number without checking if it's still current. |
| **Bash verification commands** | Agent runs only listed commands, misses other issues. |
| **Detailed format templates** | Agent copies structure even when content doesn't fit. |

---

## Review Checklist

Before publishing any `.claude/` documentation:

**Core Principle**
- [ ] Teaches mental model, not step-by-step commands
- [ ] Hierarchical — has "Navigate deeper from here:" if children exist

**Writing Pattern**
- [ ] States principles and constraints, not procedures
- [ ] Points to codebase for implementation patterns ("read existing X")
- [ ] Under 500 lines (must), targeting under 200 (should)
- [ ] No duplication with other `.claude/` files

**Anti-Pattern**
- [ ] Zero code blocks, BAD/GOOD comparisons, or step-by-step recipes (must avoid)
- [ ] Minimal interface definitions, exact values, or bash commands in docs (should avoid)
