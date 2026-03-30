# Architecture

Gobbi is an orchestration harness for Claude Code. It transforms a single conversational entry point into a structured workflow of specialist agents, guided by skills and verified by independent evaluators. The user talks naturally; gobbi handles the complexity behind the conversation.

This document describes the four pillars of gobbi's architecture: how work flows through the system, who does the work, what makes them effective, and how quality is measured objectively.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                              User                                   │
│                   Natural language conversation                     │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Orchestrator                                │
│                                                                     │
│   Ideation ──▶ Planning ──▶ Execution ──▶ Collection ──▶ Memory    │
│       │            │            │                                    │
│       ▼            ▼            ▼                                    │
│   ┌────────────────────────────────┐                                │
│   │    Evaluation  (optional)      │                                │
│   └────────────────────────────────┘                                │
└──────┬─────────────────┬─────────────────┬──────────────────────────┘
       │                 │                 │
       ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│      PI      │  │   Executor   │  │  Evaluator   │
│              │  │              │  │              │
│  what to do  │  │ how to do it │  │ is it right  │
│              │  │              │  │              │
│  Ideation    │  │  Execution   │  │  Evaluation  │
│  Planning    │  │              │  │              │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                            Skills                                   │
│                                                                     │
│         Specialization  ·  Guidance  ·  Gotcha Prevention           │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                            Tools                                    │
│                                                                     │
│                  Objective measurement & evidence                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Orchestration

Every task follows a single workflow. The workflow is sequential — each step completes before the next begins — but adaptive in depth. Simple tasks move quickly through each step; complex tasks loop within steps until the output is solid.

**Ideation** — Explore the problem space. Understand what the user wants, challenge assumptions, generate alternatives, and converge on a concrete approach. The output is a refined idea specific enough to plan against.

**Planning** — Decompose the idea into narrow, ordered subtasks. Each subtask has clear scope, dependencies, and verification criteria. The plan is the contract between the orchestrator and the agents who will execute it.

**Execution** — Implement the plan one subtask at a time. Each subtask is delegated to a specialist agent, verified on completion, and integrated before the next begins.

**Collection** — Persist the workflow trail. Record the prompt, the plan, the subtask outcomes, and the decisions made along the way. This creates an auditable history of what was done and why.

**Memorization** — Capture what matters for the future. Extract learnings, record gotchas, and save context that allows the user or a future session to resume, reference, or build on this work. Without memorization, every session starts from zero.

```
┌─────────────────────────────────────────────────────────────┐
│                      Workflow Loop                          │
└─────────────────────────────────────────────────────────────┘

  ┌─────────────┐   eval?   ┌─────────────────────────────┐
  │  Ideation   │ ────────▶ │  Evaluators (3 stances)     │
  │             │ ◀──────── │  positive · moderate ·      │
  └──────┬──────┘  improve  │  critical                   │
         │                  └─────────────────────────────┘
         ▼
  ┌─────────────┐   eval?   ┌─────────────────────────────┐
  │  Planning   │ ────────▶ │  Evaluators (3 stances)     │
  │             │ ◀──────── │  positive · moderate ·      │
  └──────┬──────┘  improve  │  critical                   │
         │                  └─────────────────────────────┘
         ▼
  ┌─────────────┐ mandatory ┌─────────────────────────────┐
  │  Execution  │ ────────▶ │  Evaluators (3 stances)     │
  │             │ ◀──────── │  positive · moderate ·      │
  └──────┬──────┘   fix     │  critical                   │
         │                  └─────────────────────────────┘
         ▼
  ┌─────────────┐
  │ Collection  │
  └──────┬──────┘
         │
         ▼
  ┌──────────────────────────────────────────────────────┐
  │              Phase Transition                        │
  │                                                      │
  │  FEEDBACK ──▶ quick fixes ──────────────────────┐   │
  │     ▲                                            │   │
  │     └─────────────────────────────────────────── ┘   │
  │                                                      │
  │  REVIEW   ──▶ full workflow again (Step 1–4) ────┐   │
  │     ▲                                            │   │
  │     └─────────────────────────────────────────── ┘   │
  │                                                      │
  │  FINISH   ──▶ merge · commit · compact               │
  └──────────────────────────────────────────────────────┘
```

### Evaluation Within the Workflow

Ideation, Planning, and Execution each include an optional evaluation gate. The user decides whether to evaluate at each step — evaluation adds rigor but costs time, so it should be proportional to the task's complexity and risk.

When evaluation runs, it is performed by at least two independent evaluator agents. Each evaluator examines the output through a different perspective — not the same lens applied twice, but genuinely distinct viewpoints that together cover the dimensions that matter. A single perspective catches the problems it is trained to see; multiple perspectives catch the problems that fall between any single viewpoint.

The evaluation perspectives span the dimensions of quality that a task can be measured against: project-level concerns like scope and requirements fit, architecture and design coherence, performance and efficiency, aesthetic and craft quality, and overall integration. Not every evaluation needs every perspective — the orchestrator selects the perspectives that match the task's nature and risk profile.

```
┌─────────────────────────────────────────────────────────────┐
│                    Evaluation Triad                         │
└─────────────────────────────────────────────────────────────┘

          ┌────────────────────────────────────┐
          │         Output to evaluate         │
          └────────┬──────────┬───────┬────────┘
                   │          │       │
          ┌────────▼──┐  ┌────▼───┐  ┌▼───────────┐
          │ Positive  │  │Moderate│  │  Critical  │
          │           │  │        │  │            │
          │ strengths │  │ comp-  │  │ stress-    │
          │ to        │  │ lete-  │  │ tests      │
          │ preserve  │  │ ness & │  │ assump-    │
          │           │  │balance │  │ tions      │
          └────────┬──┘  └────┬───┘  └┬───────────┘
                   │          │        │
                   └────┬─────┘        │
                        │   ◀──────────┘
                        ▼
          ┌─────────────────────────────────────┐
          │     Orchestrator synthesizes        │
          │     PASS · REVISE · ESCALATE        │
          └─────────────────┬───────────────────┘
                            │
                            ▼
          ┌─────────────────────────────────────┐
          │       Discuss with user             │
          │  user decides: address · defer ·    │
          │  disagree                           │
          └─────────────────────────────────────┘
```

---

## Agents

The orchestrator is the session's main agent. It owns the workflow — routing tasks through steps, managing transitions, and coordinating subagents. The orchestrator never does domain work itself. Its job is to ensure the right specialist handles each piece of work with the right context.

Three categories of subagents do the actual work.

```
┌─────────────────────────────────────────────────────────────┐
│                   Agent Delegation                          │
└─────────────────────────────────────────────────────────────┘

               ┌──────────────────────┐
               │     Orchestrator     │
               │  workflow · routing  │
               │  transitions · coord │
               └──────┬───────┬───────┘
          ┌───────────┘       └───────────┐
          ▼                               ▼
  ┌───────────────┐             ┌─────────────────┐
  │      PI       │             │    Executor     │
  │               │             │                 │
  │ ideation &    │             │ Study           │
  │ planning      │             │   ▼             │
  │               │             │ Plan            │
  │ what to do    │             │   ▼             │
  └───────────────┘             │ Execute         │
                                │   ▼             │
          ┌─────────────────▶   │ Verify          │
          │                     │   ▼             │
  ┌───────────────┐             │ Commit          │
  │   Evaluator   │             │                 │
  │               │             │ how to do it    │
  │ positive      │             └─────────────────┘
  │ moderate      │
  │ critical      │
  │               │
  │ is it right   │
  └───────────────┘

          ┌─────────────────────────────────────┐
          │               Skills                │
          │  specialization · guidance ·        │
          │  gotcha prevention                  │
          └─────────────────────────────────────┘
               feeds into all agents above
```

### Principal Investigator

PI agents handle ideation and planning. Their responsibility is deciding *what to do* — exploring the problem, discussing with the user, weighing alternatives, and producing a concrete specification or plan.

PIs engage in structured discussion with the user. They ask critical questions, challenge vague requirements, and push toward specificity. The output of a PI's work is a decision — an idea refined enough to plan, or a plan specific enough to execute.

PIs do not design detailed logic or write code. They operate at the level of intent, scope, and approach. The boundary is deliberate: separating the "what" from the "how" prevents premature commitment to implementation details before the problem is fully understood.

### Executor

Executor agents handle implementation. Their responsibility is designing *how to do it* — translating a plan's subtask into concrete changes, then implementing and verifying those changes.

Before writing any code, an executor studies the relevant codebase, designs its approach at the implementation level, and only then executes. This study-design-implement-verify sequence prevents the common failure mode of diving into code before understanding the context.

Executors must use specialist skills. Skills provide the domain knowledge, conventions, and guardrails that turn a general-purpose agent into one that produces work consistent with the project's standards. An executor without skills is an executor that guesses.

### Evaluator

Evaluator agents assess the output of other agents. Their sole responsibility is finding problems — gaps, risks, inconsistencies, and quality issues that the creating agent cannot see in its own work.

Evaluators must be critical. An evaluator that confirms success without genuine scrutiny provides false confidence. The value of evaluation comes from its adversarial nature: each evaluator actively looks for what is wrong, missing, or fragile.

Each evaluator operates from a distinct perspective. This is not a difference in severity or temperament — it is a difference in what the evaluator examines. A project-level evaluator checks whether the work meets the stated requirements and fits the project's goals. An architecture-level evaluator checks structural coherence, coupling, and design principles. A performance-level evaluator checks efficiency, scalability, and resource usage. An aesthetics-level evaluator checks craft quality — naming, readability, consistency, and polish. An overall-level evaluator synthesizes across dimensions, catching issues that live in the gaps between specialized perspectives.

The creating agent must never evaluate its own output. Self-evaluation is structurally biased — the creator's mental model of the work prevents them from seeing the same work as a reader encountering it fresh.

---

## Skills

Skills are the most important element in gobbi's architecture. They are what transform a general-purpose agent into a specialist.

A skill is a structured document that teaches an agent how to think about a specific domain — not step-by-step commands, but principles, constraints, and mental models that guide judgment in novel situations. An agent loaded with the right skills makes good decisions even when the exact situation has not been seen before.

Skills serve three functions.

**Specialization** — Skills give agents domain expertise. An executor loaded with a git workflow skill understands worktree isolation, branch naming conventions, and PR lifecycle management. An evaluator loaded with an execution evaluation skill knows what to look for in implementation output. Without skills, every agent starts from generic knowledge and reinvents conventions that already exist.

**Guidance** — Skills encode the project's standards and expectations. They define what good work looks like in this specific context — not universally, but here, for this project, with these constraints. Skills prevent agents from producing technically correct work that violates the project's principles.

**Gotcha Prevention** — Skills carry recorded mistakes. When an agent or user encounters a non-obvious failure, the correction is recorded as a gotcha — a specific entry describing what went wrong, why, and what to do instead. Every agent checks the relevant gotchas before starting work. A mistake recorded once is a mistake that never repeats. Gotchas are the highest-value knowledge in the system because they encode hard-won lessons that cannot be derived from reading the codebase alone.

---

## Tools

LLM-based agents have fundamental sensory limits. They can reason about code, catch logical inconsistencies, and assess design coherence — but they cannot watch a video, see a rendered page, observe runtime behavior, or measure actual performance. These are not weaknesses that better prompting can overcome. They are architectural constraints of the medium.

Tools extend agent capabilities beyond these limits. They give agents senses they do not natively have — the ability to see what a browser renders, to measure how long an operation takes, to verify what an API actually returns. Without tools, evaluation of anything beyond static code analysis is guesswork.

The principle is straightforward: when a quality dimension exists that an LLM cannot directly perceive, provide a tool that can. Front-end changes need browser automation because agents cannot see pixels. Performance claims need profiling because agents cannot feel latency. Video content needs frame extraction because agents cannot watch playback. API contracts need live testing because agents cannot send requests and observe responses.

Tools transform the evaluator's role. Instead of reasoning abstractly about whether something probably works, the evaluator interprets concrete evidence — test results, screenshots, benchmark numbers, accessibility audit reports. The judgment is still the agent's, but the facts are objective.

The tool ecosystem grows with the project's needs. As new quality dimensions become important — accessibility, security, internationalization — the corresponding measurement tools are added. Each tool closes a specific perceptual gap, making evaluation more accurate, more consistent, and more grounded in reality.
