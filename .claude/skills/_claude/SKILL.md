---
name: gobbi-claude
description: Core writing standard for .claude/ documentation — writing principles, hierarchy, anti-patterns, and review checklist. Use when reading .claude/ files to understand their structure, or when authoring rules and project docs. For creating skills, load gobbi-claude-skills. For creating agent definitions, load gobbi-claude-agents.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# Claude Skill

Core documentation standard for `.claude/` files — writing principles, hierarchy, anti-patterns, and review checklist. Load this skill when reading `.claude/` files to understand their structure, or when authoring rules and project docs. Specialized creation guides exist as separate skills: gobbi-claude-skills for skills, gobbi-claude-agents for agent definitions.

**Navigate deeper from here:**

| Writing... | Read | Covers |
|------------|------|--------|
| A rule | [rules.md](rules.md) | Verifiability, structure, when to create a rule |
| Project documentation | [project.md](project.md) | Project docs live in `.claude/project/{project-name}/`, consistent directory structure |

**Related skills:**

| Skill | When to load |
|-------|-------------|
| gobbi-claude-skills | Creating, reviewing, or modifying skill definitions in `.claude/skills/` |
| gobbi-claude-agents | Creating, reviewing, or modifying agent definitions in `.claude/agents/` |

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
| **Duplicating codebase patterns** | Creates a second source of truth that drifts from reality. |

### Context-Dependent

Not universally forbidden. The test: "Would deviating from this sequence cause failure?" If yes, the pattern is appropriate.

| Anti-Pattern | When Forbidden | When Allowed |
|---|---|---|
| **Step-by-step recipes** | In teaching docs (skills, rules, project docs) where agents should reason from principles. Agent follows rigidly, skips steps that matter, adds steps that don't. | In orchestration flows and agent definitions where a specific sequence must be followed exactly and deviation causes failure. |

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
- [ ] Zero code blocks or BAD/GOOD comparisons (must avoid)
- [ ] Step-by-step recipes only in orchestration/agent definitions, never in teaching docs (context-dependent)
- [ ] Minimal interface definitions, exact values, or bash commands in docs (should avoid)
