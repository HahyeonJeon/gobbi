# v0.5.0 Overview

Foundation document for the v0.5.0 architecture. Read this first before any other v0.5.0 spec doc. All other docs in this series describe one subsystem — this one explains why the system exists, what it changes, and how the pieces fit together.

---

## The Problem with Guidance-Based Orchestration

In v0.4.x, the orchestrator is a general-purpose agent that reads skills and follows their guidance. Ideation, planning, execution, collection, and memorization are documented as workflow steps — but the orchestrator decides when to do them, whether to skip them, and in what order. The skills are advice, not enforcement.

This produces predictable failures. The orchestrator skips collection because the task felt done. It forgets memorization because the conversation was long. It edits `.claude/` mid-workflow to update skill docs, which causes Claude Code to reload context and stall the session. It asks users clarifying questions mid-execution when all the information was already present. These are not bugs that can be fixed with better instructions — they are the structural consequence of "guidance" as the control mechanism.

> **Instructions-as-guidance cannot be made reliable. Runtime enforcement can.**

The orchestrator reads guidance and approximates the workflow. Approximation means drift. The longer the session, the more the workflow drifts from what was intended. A fundamentally different control model is needed.

---

## The Philosophy

V0.5.0 replaces guidance-based orchestration with state-driven orchestration. The orchestrator no longer reads skills to understand what to do next. Instead, the CLI generates prompts from workflow state — the orchestrator receives specific, bounded instructions for the current step and nothing else.

Three principles drive the redesign:

> **The orchestrator should receive instructions, not decide them.**

The CLI knows what step is active, what has been completed, and what comes next. It encodes that knowledge into the prompt. The orchestrator executes that prompt. Workflow logic belongs to the CLI, not the LLM.

> **Constraints enforced at the tool layer cannot be bypassed by the model.**

Hooks intercept tool calls before they execute. A PreToolUse hook that blocks writes to `.claude/` during an execution step cannot be overridden by the orchestrator's reasoning about whether the edit seems fine. Enforcement at the tool layer is structurally reliable in a way that prompt-level guidance is not.

> **Skills provide domain knowledge, not workflow control.**

In v0.5.0, skills still teach agents how to think about specific domains — git conventions, evaluation perspectives, documentation standards. But skills no longer drive orchestration flow. The CLI incorporates relevant skill content as materials in the generated prompt, not as instructions the orchestrator must discover and follow.

---

## The Workflow

V0.5.0 collapses the v0.4.x seven-step cycle into five steps. Research is absorbed into Ideation as an internal loop. Collection and Memorization merge into a single Memorization step.

```
┌──────────────────────────────────────────────────────────────────┐
│                         v0.5.0 Workflow                          │
└──────────────────────────────────────────────────────────────────┘

  ┌────────────────────────────────────┐
  │            Ideation                │
  │                                    │
  │  ┌──────────────────────────────┐  │
  │  │  Discuss ◀──────▶ Research  │  │
  │  │  (internal loop)             │  │
  │  └──────────────────────────────┘  │
  │                                    │
  │  Output: concrete approach         │
  └──────────────────┬─────────────────┘
                     │
                     ▼
  ┌──────────────────────────────────┐
  │              Plan                │
  │                                  │
  │  Task decomposition              │
  │  Delegation assignments          │
  │  Verification criteria           │
  └────────────────┬─────────────────┘
                   │
                   ▼
  ┌──────────────────────────────────┐
  │           Execution              │
  │                                  │
  │  One task at a time              │
  │  Verify before next              │
  └────────────────┬─────────────────┘
                   │
                   ▼
  ┌──────────────────────────────────┐       ┌───────────────────────┐
  │          Evaluation              │──────▶│  Loop back to any     │
  │                                  │◀──────│  prior step           │
  │  Mandatory after Execution       │       └───────────────────────┘
  │  Optional at other steps         │
  └────────────────┬─────────────────┘
                   │
                   ▼
  ┌──────────────────────────────────┐
  │         Memorization             │
  │                                  │
  │  Read conversation log           │
  │  Extract crucial information     │
  │  Persist decisions and state     │
  └──────────────────────────────────┘
```

Each step has a single defined responsibility:

**Ideation** answers "what to do." Discussion with the user and research into the problem space are internal loops within Ideation — they do not surface as separate workflow steps. Ideation completes when the approach is concrete enough to plan against.

**Plan** answers "how to orchestrate." Task decomposition, agent delegation assignments, and verification criteria. The plan is the contract — Execution runs against it.

**Execution** answers "do it." One task at a time, verified before the next begins. Scope is bounded by the plan; no improvisation.

**Evaluation** answers "is it right." Mandatory after Execution. At Ideation and Plan, the decision to evaluate is made once at workflow start, not redecided at each step. Evaluation can loop back to any prior step — not just the immediately preceding one. The creating agent never evaluates its own output.

**Memorization** answers "what should persist." Read the conversation log, extract decisions, state, open questions, and gotchas. Write them where the next session can find them. Without Memorization, every session restarts from zero.

---

## The Directory Split

V0.4.x stores everything under `.claude/`. This creates a conflict: the orchestrator is both reading from `.claude/` (skills, rules, CLAUDE.md) and sometimes writing to it (updating skill docs, recording gotchas mid-session). Writing to `.claude/` during a session causes Claude Code to reload context, which stalls the session. This is the idle problem.

V0.5.0 resolves it with a hard directory split:

```
┌─────────────────────────────────────────────────────────────────┐
│                       Directory Split                           │
└─────────────────────────────────────────────────────────────────┘

  .claude/                          .gobbi/
  ─────────────────────────         ─────────────────────────────
  Read-only during workflow         Runtime state — write freely

  CLAUDE.md                         sessions/
  rules/                            worktrees/
  skills/                           project/
  agents/                             notes/
  settings.json                       gotchas/
  hooks/                              context/
```

`.claude/` is the static knowledge layer. During a workflow session, no agent writes to it. The hooks enforce this at the tool layer — a PreToolUse hook blocks any write to `.claude/` while a session is active.

`.gobbi/` is the runtime layer. Session state, worktree management, notes, gotchas recorded mid-session, and context files all live here. Writing to `.gobbi/` does not trigger context reload. Agents write freely.

The implication: gotchas recorded during a session live in `.gobbi/project/gotchas/` until a designated promotion step moves them into `.claude/skills/_gotcha/`. This promotion happens outside an active session. It does not cause idle.

---

## System Architecture

The five components of v0.5.0 form a closed feedback loop:

```
┌─────────────────────────────────────────────────────────────────┐
│                    v0.5.0 System Architecture                   │
└─────────────────────────────────────────────────────────────────┘

              ┌─────────────────────────────┐
              │         SQLite              │
              │      Event Store            │
              │  (source of truth)          │
              └──────┬──────────────────────┘
                     │ reads state
                     ▼
  ┌──────────────────────────────────┐
  │             CLI                  │
  │                                  │
  │  Reads state from event store    │
  │  Loads skill materials           │
  │  Generates bounded prompt        │
  └──────────────────┬───────────────┘
                     │ delivers prompt
                     ▼
  ┌──────────────────────────────────┐
  │          Orchestrator            │
  │                                  │
  │  Executes current step only      │
  │  Spawns subagents per plan       │
  │  Writes results to .gobbi/       │
  └──────────────┬───────────────────┘
                 │ tool calls
                 ▼
  ┌──────────────────────────────────┐
  │             Hooks                │
  │                                  │
  │  PreToolUse — block invalid      │
  │  PostToolUse — capture signals   │
  │  SubagentStop — auto-collect     │
  └──────────────────┬───────────────┘
                     │ writes events
                     ▼
              ┌─────────────────────────────┐
              │         SQLite              │
              │      Event Store            │
              └─────────────────────────────┘
```

**CLI** is the prompt factory. It reads workflow state from the event store, determines which step is active and what has completed, incorporates relevant skill content as materials, and generates a specific prompt. The orchestrator cannot see outside that prompt — it cannot decide to jump steps or deviate from scope.

**Hooks** are the constraint layer. PreToolUse hooks enforce guards — blocking writes to `.claude/` during sessions, preventing scope violations, enforcing step preconditions. PostToolUse and SubagentStop hooks capture events — when a subagent finishes, its output is automatically recorded in the event store without the orchestrator needing to remember to collect it.

**SQLite event store** is the source of truth. Every step completion, every subagent result, every evaluation verdict, every state transition is an event. The CLI reads events to determine what to generate next. The hooks write events. The event store is the shared memory of the system.

**Skills** still exist and still matter. They provide domain knowledge that the CLI incorporates into generated prompts as materials — git conventions, evaluation perspectives, documentation standards. Skills no longer drive orchestration; they inform it.

---

## Positioning

Gobbi does not replace Claude Code's native orchestration. It enhances it through hooks and CLI tooling — the same mechanisms Claude Code exposes to every project. V0.5.0 deliberately stays within those mechanisms rather than bypassing them.

This positioning matters for longevity. Claude Code will improve. Its native orchestration, context management, and subagent coordination will get better. A gobbi that wraps and enhances Claude Code improves automatically as Claude Code improves. A gobbi that replaces Claude Code becomes a maintenance liability when Claude Code changes.

GSD-2 demonstrated the value of the patterns v0.5.0 adopts: disk-driven state that survives context resets, fresh context per task to prevent contamination, cache-aware prompt ordering to reduce cost. These patterns are proven. V0.5.0 implements them inside Claude Code's native architecture rather than alongside it.

---

## What This Document Covers

This document covers architecture, philosophy, and positioning. It does not cover implementation details of any subsystem. For those, see:

| Document | Covers |
|----------|--------|
| `v050-session.md` | Session directory, SQLite event store, state derivation, crash recovery |
| `v050-state-machine.md` | Workflow transitions, typed reducer, guards, predicate registry |
| `v050-prompts.md` | Prompt compilation, cache ordering, skills boundary, step specs |
| `v050-hooks.md` | PreToolUse guards, SubagentStop capture, hook schemas, enforcement |
| `v050-cli.md` | Bun CLI rewrite, commands, distribution, plugin relationship |
