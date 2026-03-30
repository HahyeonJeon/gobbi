---
name: _delegation
description: Hand off work to subagents with the right context so they succeed on the first attempt. Use during the DELEGATE phase to spawn specialists with clear briefings, context layers, and scope boundaries.
allowed-tools: Agent, Read, Grep, Glob, Bash, Write
---

# Delegation Skill

Hand off work to subagents so they succeed on the first attempt. Load this skill when entering the DELEGATE phase of orchestration.

---

## Core Principle

> **Deliver a briefing, not a script.**

State what to achieve, what context to load, and what constraints apply. Leave implementation to the specialist.

> **Load `_claude`, the project skill, and domain skills before every task.**

Agents that read project context produce work that integrates cleanly. Agents that skip context produce work that needs rework.

> **Require an internal plan before coding.**

Tell subagents to study context, outline their approach, then execute. Agents that plan before coding produce better-structured, more focused work.

> **Require subtask docs written to the work directory.**

Subagent outputs exist only in conversation context. If the agent doesn't write its result to a subtask doc, the orchestrator must reconstruct it from memory. Tell subagents where to write and what to include.

---

## What Every Delegation Prompt Needs

### The task

What to build, fix, or change. Be specific about the deliverable, not the method. Include acceptance criteria when the task is ambiguous.

### The context to load

Every subagent needs three layers of context:

**Always load (non-negotiable):**
- `_claude` skill — docs structure, anti-patterns, navigation standard
- The project skill — project architecture, conventions, constraints
- Gotchas — MUST check `_gotcha` and the project skill's `gotchas/` before starting work

**Load per domain:**
- Domain skills relevant to the task — the plan specifies which skills each task needs
- Project rules relevant to the domain

**Load when available:**
- Project docs in the project skill directory — architecture, reference, review docs
- Existing code in the area they'll modify — the codebase is the source of truth for patterns

**Load when _git is active:**
- Current branch and worktree path — so the subagent knows where it's working and can verify branch state before committing
- Recent commit history relevant to the task area — files the task will modify, so the subagent understands what has already changed in this session
- Exploration findings from multi-perspective exploration — when exploration was performed before planning, include the synthesized findings for orientation

### The scope boundary

What the agent should NOT touch. Agents expand scope when they see adjacent improvements. Explicit boundaries prevent drift.

### The subtask doc

Tell the subagent where to write its result and what format to use. Provide:
- The file path: `{task-directory}/tasks/{NN}-{subtask-slug}.md`
- What to include: what was done, what changed, what was learned, any open items
- Self-contained requirement: a reader should understand the result without reading other files

When a subagent makes a non-obvious choice — where multiple valid approaches existed — the subtask doc should include a brief decision annotation: what was chosen, what was rejected, and why. This externalizes reasoning at decision time, when the context is fresh. Reconstructing rationale at collection time from conversation history is unreliable.

### Dependencies

If this agent's work depends on another agent's output, or if another agent will consume this output, state the interface expectation.

---

## The Agent Lifecycle in Delegation

Every agent follows: **Study → Plan → Execute → Verify**. Your delegation prompt sets each phase up for success.

**Study** — List what to read: `_claude` skill, project skill, domain skills, gotchas, relevant code. The more unfamiliar the area, the more explicit the reading list.

**Plan** — Tell the agent to outline their approach before implementing. Mandatory for non-trivial tasks.

**Execute** — The task itself. Be specific about the deliverable.

**Verify** — Remind agents to check their work didn't break other things and that any `.claude/` docs referencing changed code are updated.

---

## Model Selection

> **Use the cheapest model that can do the job.** Default to the agent's defined model; override when the task clearly maps to a different tier.

Three tiers of capability, from lightest to heaviest:

| Tier | Strength | Suited for |
|------|----------|------------|
| **Haiku** | Fast, cheap, reliable on narrow tasks | Eligibility checks, simple validation, gotcha lookups, confidence scoring, format verification |
| **Sonnet** | Balanced reasoning and cost | Routine development, code review, codebase exploration, standard evaluation, documentation writing |
| **Opus** | Deep reasoning, handles ambiguity and novelty | Complex ideation, architecture decisions, system design, nuanced evaluation, novel problem solving |

**When to override agent defaults:** Agent definitions declare a default model suited to their typical workload. Override when the specific task is clearly simpler or more complex than what the agent usually handles. A Sonnet-default agent doing a trivial validation can drop to Haiku. A Sonnet-default agent facing a novel architecture problem should escalate to Opus.

This is guidance for the orchestrator's judgment, not a rigid assignment table. The orchestrator considers the task's complexity, the cost, and the consequence of getting it wrong — then picks the tier that fits.

> **Model tiers and capabilities evolve — these are current guidelines, not permanent assignments.**

---

## Judgment Calls

**Specificity vs autonomy** — Over-specified prompts produce rigid work. Under-specified prompts miss requirements. Calibrate based on how well-defined the task is.

**When to include code references** — If the agent needs to follow an existing pattern, point to the reference files. The codebase is the source of truth.

**When to split vs combine** — If two subtasks need the same agent, same context, and same files, combine them.

**When to emphasize lifecycle phases** — Spell out Study for unfamiliar areas. Spell out Plan for non-trivial tasks. Spell out Verify for shared interfaces.

**When to include exploration context** — If the plan was preceded by multi-perspective exploration, include the synthesized findings in every delegation prompt. Exploration findings are context, not constraints — the subagent uses them to make better-informed decisions but is not bound by the explorers' conclusions. If no exploration was performed, the subagent discovers context during Study as usual.

**When to include pre-resolved decisions** — When contribution points were resolved during ideation (via _ideation's contribution-point mechanism), encode those resolutions as explicit constraints in the delegation prompt. This differs from scope boundaries: scope says what not to touch; pre-resolved decisions say which implementation choices the user has already made and the subagent must honor. A subagent that re-opens a settled decision wastes context and risks contradicting the user's intent.
