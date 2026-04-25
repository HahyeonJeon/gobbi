---
name: _claude
description: Writing standard for .claude/ documentation. MUST load when authoring or modifying any .claude/ file.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# Claude Skill

Writing standard for `.claude/` documentation. MUST load when authoring or modifying any `.claude/` file. Load optionally when reading `.claude/` docs for structural context.

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [_rules](../../_rules) | Authoring rule files in `.claude/rules/` |
| [_project](../../_project) | Authoring project docs in `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/` |
| [_skills](../../_skills) | Creating and modifying skill definitions in `.claude/skills/` |
| [_agents](../../_agents) | Creating and modifying agent definitions in `.claude/agents/` |
| [transcripts.md](transcripts.md) | Subagent transcript recovery — location, JSONL schema, extraction paths, plan data |
| [gotchas.md](gotchas.md) | Known mistakes and corrections for _claude |

---

## Core Principle

> **Chain-of-Docs — think deeply first, then decompose into short docs.**

Agents default to writing short, shallow docs. Chain-of-Docs demands the opposite order: think deeply about the full problem space first — structure, relationships, edge cases, abstraction levels — then decompose that deep understanding into a chain of focused documents. Each file covers one level of abstraction and links to its children via a **"Navigate deeper from here:"** table. The depth of thought produces the quality; the decomposition produces the navigability.

> **Procedures get detailed steps. Non-procedures get principles, not steps.**

When a doc describes a procedure — a sequence where order matters and deviation causes failure — write specific steps with full detail. When a doc describes non-procedural guidance — design principles, conventions, quality standards — write principles and constraints instead. Step-by-step instructions for non-procedures lock agents into rigid paths and suppress their judgment in situations the doc author didn't anticipate.

> **First line tells the agent what this doc is and when to read it.**

Every document opens with a clear statement of its purpose and scope. An agent scanning a file list should know from the first line whether this doc is relevant to its current task — without reading further.

---

## Writing Pattern

What effective `.claude/` documentation looks like:

| Pattern | Principle |
|---|---|
| **Principles over procedures** | State what matters and why. "Each component decomposes into X, Y, Z — read existing code for the pattern." |
| **Constraints over templates** | Tell agents what NOT to do (clear boundary) rather than what TO do (rigid path). Constraints leave room for judgment. |
| **Codebase over examples** | Point agents to read existing implementations. The codebase is the single source of truth. |
| **Line limit** | **Must** stay under 500 lines per file. **Should** target under 400 lines. If a file exceeds this, decompose into hierarchy. |

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
| **Step-by-step recipes** | In teaching docs (skills, rules, project docs) where agents should reason from principles. Agent follows rigidly, skips steps that matter, adds steps that don't. | In procedures — sequences where order matters and skipping or reordering steps causes failure. Orchestration workflows, setup sequences, git lifecycles, deployment pipelines. The test: if the agent reorders or omits a step, does something break? If yes, write detailed steps. |

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

- [ ] Chain-of-Docs — deep thinking decomposed into focused docs with "Navigate deeper from here:" links
- [ ] Procedures have detailed steps; non-procedures use principles and constraints, not steps
- [ ] First line declares what the doc is and when to read it

**Writing Pattern**

- [ ] Points to codebase for implementation patterns ("read existing X")
- [ ] Under 500 lines (must), targeting under 400 (should)
- [ ] No duplication with other `.claude/` files

**Anti-Pattern**

- [ ] Zero code blocks or BAD/GOOD comparisons (must avoid)
- [ ] Step-by-step recipes only in procedures where reordering or omitting steps causes failure (context-dependent)
- [ ] Minimal interface definitions, exact values, or bash commands in docs (should avoid)
