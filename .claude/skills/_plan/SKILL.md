---
name: _plan
description: Task decomposition into narrow, ordered subtasks. MUST load at the Planning step.
allowed-tools: Read, Grep, Glob, Bash
---

# Planning Skill

Decompose complex tasks into small, specific, agent-assigned subtasks. Use during Step 2 (Planning) to explore the codebase, build a systematic plan, and get user approval before delegation. MUST load at the planning step.

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [evaluation.md](evaluation.md) | Stage-specific evaluation criteria for plans |
| [gotchas.md](gotchas.md) | Known mistakes and corrections for _plan |

---

## Core Principle

> **Enter plan mode. Use EnterPlanMode to explore, decompose, and write the plan. Use ExitPlanMode to present it for approval.**

Plan mode lets you explore the codebase with read-only tools, design the approach, and write the plan — all before any implementation begins. ExitPlanMode presents the plan to the user for approval. No delegation happens without user sign-off.

> **Decompose into small, specific tasks. Each task has one agent, one deliverable, one clear scope.**

Vague tasks produce vague results. Break work down until each task is small enough that a single agent can complete it without losing focus. Name the agent, list the skills to load, and define the expected deliverable.

> **Every task specifies its subagent and skills.**

A task without a named subagent gets routed to the wrong specialist. A task without listed skills gets executed without the knowledge the agent needs. The plan must name which agent from `.claude/agents/` handles each task and which skills from `.claude/skills/` it loads — this is what makes delegation precise instead of hopeful.

> **Research before planning when knowledge is insufficient.**

When a task requires domain expertise, external context, or codebase understanding that the orchestrator lacks, spawn research agents to investigate before decomposing. A plan built on incomplete knowledge produces tasks with wrong assumptions. The research cost is small compared to the rework cost of a misinformed plan.

---

## How to Plan

> **Always start in plan mode.**

Planning outside of EnterPlanMode means planning without codebase exploration — and plans built on assumptions fail on contact with reality.

> **Explore before decomposing.**

Understanding the existing codebase, patterns, and architecture is a prerequisite to meaningful task breakdown. A plan that doesn't reflect the codebase will produce work that doesn't fit the codebase.

> **Spawn PI-level agents when needed.**

If the task crosses unfamiliar territory — new APIs, unfamiliar subsystems, external dependencies — spawn PI-level agents to investigate before writing the plan. They return findings; the orchestrator synthesizes them into planning context. Do not guess what you can investigate.

> **Decomposition is the core act of planning.**

The plan's quality is determined by how well tasks are broken down — see "How to Decompose" below. Everything else (goal statement, execution order, collection plan) supports the task list.

> **Exit plan mode to present, not to finish.**

ExitPlanMode surfaces the plan for user approval. No delegation happens until the user signs off. If the plan needs revision after feedback, re-enter plan mode — revisions deserve the same structured exploration as the original.

---

## What a Good Plan Contains

**Goal** — One sentence restating what the user wants, from Ideation (Step 1).

**Tasks** — A numbered list of small, specific tasks. Each task specifies:

- What to do (specific deliverable, not vague direction)
- Which agent handles it
- Which skills to load
- Dependencies on other tasks, if any
- Scope boundary — what this task should NOT touch
- Files modified — which files this task will create or modify. Making file targets explicit enables overlap detection between parallel tasks, scope verification by evaluators, and post-wave consistency checks. Not every task has meaningful file targets (research, design discussion) — but when files are known, name them.
- Verification approach — how to confirm the task's output is correct. What should an evaluator check? What conditions prove success? This gives evaluators concrete criteria instead of only reasoning about the output. Pure exploration tasks may not have verifiable outputs — that's fine. The principle is explicitness, not rigidity.

**Execution order** — Which tasks run in parallel (independent) and which run sequentially (dependent). Maximize parallelism — independent tasks launch simultaneously.

**Expected outcome** — What the user will have when all tasks complete.

**Collection plan** — Where work docs will be written after delegation completes. Specify the task directory path and list which subtask `.json` files will be created. This ensures Collection (Step 5) has a clear target.

---

## How to Decompose

**Start from the deliverable, work backward.** What does the user need? What pieces make up that deliverable? Each piece is a candidate task.

**Split by domain, not by file.** Assign tasks by specialist expertise, not by which files they touch. Domain expertise matters more than file boundaries.

**Make tasks self-contained.** Each task should make sense on its own without reading the other tasks. The agent receiving it should understand the full scope from the task description alone.

**Keep tasks small.** If a task description uses "and" to join two unrelated concerns, split it. If an agent would need to context-switch between different subsystems, split it.

**Name the agent and skills explicitly.** For each task, state the agent type (from `.claude/agents/`), the skills to load, and any project docs to read.

---

## Signs of a Bad Plan

- A task says "improve X" or "work on Y" without specifying the deliverable
- A task has no agent assigned
- Two tasks modify the same files (merge conflict risk)
- A task is so large the agent will lose focus
- A task is so small it's not worth the delegation overhead
- Dependencies between tasks aren't stated — agents will block each other
- More than 8 parallel tasks in one wave (coordination overhead exceeds parallelism benefit)

---

## Constraints

- Always use EnterPlanMode for non-trivial tasks — planning in your head produces worse plans than exploring the codebase first
- Always re-enter EnterPlanMode when revising a plan after evaluation — revisions need the same structured exploration as the original plan
- Always assign an agent and skills to each task — implicit selection leads to wrong agents
- Never delegate before ExitPlanMode approval — the user must sign off on the plan
- Never decompose into more than 8 parallel tasks per wave — batch larger plans into sequential waves
- Never plan tasks that overlap on the same files — combine them or sequence them
