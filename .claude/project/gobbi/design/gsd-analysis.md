# GSD Analysis

Detailed analysis of GSD's architecture — what gobbi adopts, adapts, and rejects.

## GSD Overview

[GSD (get-shit-done)](https://github.com/gsd-build/get-shit-done) v1.30.0 by TACHES. The most comprehensive Claude Code harness available.

**Scale:** 57 commands, 56 workflows, 18 agents, 5 hooks, 30+ templates, 15 reference docs, TypeScript SDK, multi-runtime support, internationalized docs (JP/KR/PT/ZH).

## What Gobbi Adopts from GSD

### 1. Context Rot Prevention (Core Insight)

GSD's most important insight: AI agent quality degrades as context fills up. GSD solves this with fresh context per agent — every spawned agent gets a clean context window with precisely the information it needs.

**Gobbi adopts this fully.** Each executor agent gets a fresh context window. The orchestrator stays thin (coordinate, don't implement). This is non-negotiable.

### 2. Thin Orchestrator Pattern

GSD's orchestrators never do heavy work. They load context, spawn agents, collect results, and route to the next step. Orchestrator context stays at 10-15%.

**Gobbi adopts this.** The orchestrator analyzes, discusses, and delegates. It never implements.

### 3. File-Based State

GSD stores all state as human-readable Markdown and JSON. Survives context resets, is version-controllable, inspectable by humans.

**Gobbi adopts this** but with a much smaller footprint (`.claude/project/` vs GSD's `.planning/` tree).

### 4. Gotcha/Learning System

GSD doesn't have gotchas explicitly, but it has verification loops, plan checking (max 3 revision cycles), and node repair strategies. The concept of recording mistakes and learning is present.

**Gobbi adopts and strengthens this.** Gotchas are first-class citizens in gobbi — the highest-value knowledge in the system, checked before every action.

### 5. Atomic Execution

GSD executes one task per agent with per-task git commits. This enables bisect, independent reversion, and clear history.

**Gobbi adopts this.** One task, one executor, one commit.

### 6. Goal-Backward Verification

GSD's verifier checks whether phase goals were achieved, not just whether tasks were completed. "Existence does not equal implementation."

**Gobbi adopts this concept** in its evaluation system. Evaluators check outcomes against goals, not tasks against checklists.

## What Gobbi Adapts from GSD

### 1. Phase Model → Adaptive Flow

**GSD:** Rigid pipeline: discuss → research → plan → execute → verify. Each phase is explicit, user-invoked, and has its own command.

**Gobbi:** Adaptive flow. No fixed phases. Gobbi decides what the task needs and routes accordingly. Trivial tasks skip planning. Complex tasks get ideation before planning. The user never invokes phases.

### 2. 57 Commands → Single Entry Point

**GSD:** Users must learn commands: `/gsd:new-project`, `/gsd:plan-phase`, `/gsd:execute-phase`, `/gsd:quick`, `/gsd:fast`, `/gsd:debug`, `/gsd:verify-work`, etc.

**Gobbi:** One entry point. Users just talk. Gobbi routes internally.

### 3. 18 Specialized Agents → 4 Core Roles + Growth

**GSD:** 18 agents across 11 categories (researchers, analyzers, synthesizer, planner, roadmapper, executor, checkers, verifier, auditors, mapper, debugger).

**Gobbi:** 4 core roles (Orchestrator, Planner, Executor, Evaluator). Domain agents added on demand. Simpler roster, same quality through better prompts.

### 4. config.json Toggles → Patch-Based Hacks

**GSD:** Customization via config.json with toggles (mode, granularity, workflow flags, gates, git branching, model profiles).

**Gobbi:** Customization via patch files in `gobbi-hack/`. More expressive than toggles — patches can change any behavior, not just toggle predefined options. Generated from conversation, not hand-edited JSON.

### 5. .planning/ Directory → .claude/project/

**GSD:** Heavy `.planning/` tree with PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md, config.json, research/, phases/, codebase/, quick/, todos/, threads/, seeds/.

**Gobbi:** Lightweight `.claude/project/` with context, gotchas, and work trail. No config files. No research artifacts. No separate roadmap. Much smaller footprint.

### 6. Multi-Runtime → Claude Code Only

**GSD:** Supports Claude Code, OpenCode, Gemini CLI, Codex, Copilot, Cursor, Windsurf, Antigravity. Runtime detection and adaptation layer.

**Gobbi:** Claude Code only. Exploits native features deeply (Agent tool, TaskCreate, memory, hooks, worktrees) without abstraction overhead.

## What Gobbi Rejects from GSD

### 1. Learning Curve

GSD requires users to learn its vocabulary, command set, and workflow model. The README, user guide, and 57 commands are a significant onboarding investment.

**Gobbi rejects this entirely.** Users don't study gobbi. Period.

### 2. Research Phase as Separate Stage

GSD has dedicated research agents that run web searches, ecosystem analysis, and produce RESEARCH.md files.

**Gobbi rejects a separate research stage.** Research happens within discussion and planning as needed, not as a standalone phase.

### 3. TypeScript SDK

GSD includes a TypeScript SDK with prompt builders, plan parsers, phase runners, context engines. This is for programmatic integration.

**Gobbi rejects this complexity.** Gobbi is pure `.claude/` configuration — skills, agents, and CLAUDE.md. No build tools, no compiled code, no SDK.

### 4. Wave Execution Model

GSD groups tasks into dependency waves (parallel within waves, sequential across). This requires explicit dependency graph management.

**Gobbi rejects explicit wave management.** The planner orders tasks by dependency. The orchestrator executes them sequentially or in parallel as appropriate. No wave abstraction layer.

### 5. Seeds, Threads, Todos as Separate Systems

GSD has separate persistence for todos (captured ideas), threads (persistent context), and seeds (forward-looking ideas with trigger conditions).

**Gobbi rejects these.** Gotchas handle learned knowledge. Work trail handles history. Context handles current state. Three things, not six.

### 6. Hooks for Safety

GSD uses JavaScript hooks for context monitoring, workflow guarding, prompt injection detection, statusline, and update checking.

**Gobbi doesn't require hooks initially.** Gobbi's safety comes from its discussion-first approach, evaluation gates, and gotcha system. Hooks may be added later as hacks if specific projects need them.

## Key Takeaway

GSD is a maximalist system — comprehensive, powerful, but complex. Gobbi is a minimalist system that preserves GSD's core insights (context rot prevention, thin orchestration, atomic execution, verification) while eliminating the learning curve, reducing state complexity, and adding a safe customization layer.

The bet: systematic harness engineering with adaptive flow and gotcha-driven learning can match GSD's output quality with a fraction of the surface area.
