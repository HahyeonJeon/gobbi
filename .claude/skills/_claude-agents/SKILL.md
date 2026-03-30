---
name: _claude_agents
description: Reference and interactive guide for creating Claude Code agent definitions. MUST load when creating, reviewing, or modifying .claude/agents/ files. Must load _claude and _discuss before using this skill.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion
---

# Agent Definitions

Reference for understanding agent definition structure and interactive guide for creating new agents through discussion. Load this skill when creating, reviewing, or modifying `.claude/agents/` files. Read existing agent definitions in `.claude/agents/` for real patterns — they are the source of truth.

---

## Core Principles

> **An agent definition describes who the agent is, not what it must do step by step.**

An agent is a specialized AI persona with a focused role, specific tools, and domain expertise. The definition establishes identity, boundaries, and context — not a task script. If the definition reads like a procedure, the agent will follow it rigidly instead of planning based on the actual task.

> **"Before You Start" loads top-level indexes, not everything.**

Every agent definition includes a "Before You Start" section listing skills, project docs, rules, and memories to load. Agents should only read SKILL.md, README.md, and other top-level index files first — then navigate deeper on demand. Front-loading all docs wastes context on content that may not be relevant.

> **Every agent follows: Study, Plan, Execute, Verify, Memorize.**

This is the universal agent lifecycle. Study actively before acting — read project docs, explore the codebase, check gotchas. Plan the approach before starting. Execute with focused, minimal changes. Verify that docs and memories reflect the changes. Memorize anything learned that prevents repeating mistakes.

> **Discuss before writing — understand the role before defining it.**

Use AskUserQuestion to understand what the agent should be, what it should not do, and where its boundaries lie relative to existing agents. A definition written without discussion produces an agent with vague boundaries that overlaps with others.

---

## Agent Definition Structure

The structure of an agent definition establishes identity, context, and quality expectations — in that order.

**Frontmatter** — Required fields: `name`, `description`, `tools` (scoped to what the agent actually needs). Model assignments are defined in each agent's YAML frontmatter — refer to the actual agent files in `.claude/agents/` for current assignments rather than maintaining a separate list here. The orchestrator can override via the Agent tool's model parameter when a specific task warrants a different tier — see _delegation's model selection guidance. The `description` field is critical — it answers "when should the orchestrator send work here?" If two agents' descriptions match the same task, boundaries need sharpening.

**Identity within 20 lines** — The opening paragraph establishes who the agent is ("You are a..."), what it thinks like, and when it receives work. Follow immediately with "Out of scope" — what the agent should NOT do and should defer to other agents.

**Before You Start** — List skills as always-load vs load-when-relevant. Include project docs, rules, and memories the agent needs. Keep this section a navigation index, not a reading list.

**Lifecycle** — Adapt Study, Plan, Execute, Verify, Memorize to the domain. Each phase gets domain-specific guidance — what to study, what to verify, what to memorize. Not every domain needs the same depth in every phase.

**Quality Expectations** — What good output looks like for this agent. Concrete criteria a reviewer could check.

Read existing agent definitions in `.claude/agents/` for the real patterns — they demonstrate how these elements compose in practice.

---

## Discussion Dimensions

When creating a new agent, use AskUserQuestion to explore these dimensions. Not every agent needs every question — pick the ones that address what is vague or missing for this specific role.

### Understanding the Role

- **Expertise domain** — What specialized knowledge does this agent have? What types of tasks should the orchestrator route here? What is the agent's "think like a..." identity?
- **Routing clarity** — Can the orchestrator unambiguously decide to send a task here vs. to another agent? If two agents' descriptions could match the same task, which one should get it and why?

### Defining Boundaries

- **Out of scope** — What should this agent explicitly NOT do? What adjacent work should it defer to other agents?
- **Domain borders** — Which existing agents' domains border this one? Are the boundaries sharp enough that the orchestrator never hesitates between them?
- **Scope discipline** — When the agent encounters work outside its scope during execution, what should it do? Report back, note it, or defer?

### Designing the Context

- **Skills to load** — Which skills should "Before You Start" list? Which are always-load vs load-when-relevant? Is the list minimal — no "just in case" entries?
- **Project context** — What project docs, rules, and memories does this agent need? Which are always relevant and which are situational?
- **Model selection** — What model should this agent use? Check current assignments in the agent files in `.claude/agents/`. The orchestrator can override per task — see _delegation's model selection guidance.

### Lifecycle Emphasis

- **Study depth** — How much codebase exploration does this domain need before planning? Does the Study phase need an explicit reading list?
- **Verification criteria** — What domain-specific checks should the Verify phase include? What would a reviewer look for beyond "does it work?"
- **Memorize scope** — What gotcha domains are relevant? What patterns should this agent record when it learns from mistakes?

### Quality Expectations

- **Good output** — What does good output look like for this agent? What are the concrete, checkable quality criteria?
- **Common mistakes** — What mistakes are common in this domain? What should the agent actively watch for?

---

## Expected Output

The interactive creation process produces a single `.md` file in `.claude/agents/` with:

- Valid frontmatter (`name`, `description`, `tools`, and `model` where appropriate)
- Clear identity and "think like a..." framing within the first 20 lines
- "Out of scope" boundaries stated early
- "Before You Start" section listing context to load
- Lifecycle guidance adapted to the domain
- Quality expectations with concrete criteria

---

## Constraints

- Must follow _claude writing principles — principles over procedures, constraints over templates, codebase over examples
- Agent definitions describe roles, not task scripts — if it reads like a procedure, revise it
- Tools scoped to what the agent actually needs — no "just in case" grants
- Clear domain boundaries — no overlap with existing agents in `.claude/agents/`
- Under 500 lines per file (must), targeting under 200 (should)
- Always discuss via AskUserQuestion before writing a new agent definition
