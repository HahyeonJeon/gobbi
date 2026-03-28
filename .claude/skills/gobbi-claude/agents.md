# Writing Agent Definitions

Guide for authoring `.claude/agents/<name>.md` files. Agent definitions live in `.claude/agents/` — read the directory for the current roster. The system currently uses specialized agents for research/ideation, planning/decomposition, 3-stance evaluation (positive, moderate, critical), and code implementation.

---

## Core Principle

> **An agent definition describes who the agent is, not what it must do step by step.**

An agent is a specialized AI persona with a focused role, specific tools, and domain expertise. The orchestrator delegates tasks based on the `description` field.

> **"Before You Start" — load top-level indexes, not everything.**

Every agent definition includes a "Before You Start" section listing skills, project docs, rules, and memories to load. But agents should only read SKILL.md, README.md, and other top-level index files first — then navigate deeper on demand. Don't front-load all docs; let the hierarchy guide what's relevant.

> **Every agent follows: Study → Plan → Execute → Verify → Memorize.**

This is the universal agent lifecycle. **Study**: actively learn before acting — read project docs, explore the codebase, check memories for prior decisions and known errors, and research from web sources if needed. Load top-level indexes first, then navigate deeper into areas relevant to the task. **Plan**: design the approach. **Execute**: do the work (code, config, docs — including any code verification like tests/linting). **Verify**: check that `.claude/` docs, project docs, and memories are updated to reflect changes. **Memorize**: save anything learned that would prevent repeating mistakes or help future sessions.

---

## Writing Pattern

| Pattern | Principle |
|---------|-----------|
| **Description is critical** | Answers "when should the orchestrator send work here?" Be specific about domain and task types. If two agents' descriptions match the same task, boundaries need sharpening. |
| **Frontmatter complete** | Required: `name`, `description`, `tools` (scoped to what's needed). Include `model` to specify the model (all non-evaluator agents currently use `model: opus`). Evaluator agents omit `model` to use the default. |
| **Role over procedure** | Define expertise domain, boundaries (out of scope), context files to read, quality expectations. |
| **Front-load identity** | Agent should understand its role within the first 20 lines. |

---

## Anti-Pattern

### Must Avoid

| Anti-Pattern | Why It Fails |
|---|---|
| **Agent definition is a task script** | Agent follows the script instead of planning based on the actual task. Define role and expertise. |
| **Overlapping domains** | Orchestrator can't route tasks unambiguously. Add clear "out of scope" boundaries. |
| **No "Before You Start" section** | Agent misses project context, rules, and memories. Always list what to load. |
| **Skipping Verify or Memorize** | Docs and memories drift from reality. Code changes without doc updates create stale context for future agents. |

### Should Avoid

| Anti-Pattern | Why It Fails |
|---|---|
| **Too many tools granted** | "Just in case" thinking. Scope to tools the agent actually needs. |
| **Front-loading all docs** | Agent reads everything upfront, wastes context. Load top-level indexes, navigate deeper on demand. |
| **No "out of scope" boundaries** | Agent tries to handle tasks outside its domain instead of deferring to the right specialist. |

---

## Review Checklist

Before publishing an agent definition:

**Core Principle**
- [ ] Defines who the agent is, not step-by-step procedures
- [ ] Has "Before You Start" section listing skills, project docs, rules, memories to load
- [ ] Lifecycle is clear: Study → Plan → Execute → Verify → Memorize

**Writing Pattern**
- [ ] `description` answers "when should the orchestrator send work here?"
- [ ] All required frontmatter fields present (`name`, `description`, `tools`, `model` for non-evaluator agents)
- [ ] Role and identity clear within the first 20 lines
- [ ] "Out of scope" boundaries defined

**Anti-Pattern**
- [ ] Not a task script (must avoid)
- [ ] No domain overlap with other agents (must avoid)
- [ ] Tools scoped to what's actually needed (should avoid)
