# v0.5.0 State Machine

Workflow transition reference for v0.5.0. Read this when implementing or reasoning about step progression, evaluation gating, feedback loops, or guard conditions. Assumes familiarity with the event model in `v050-session.md`.

---

## Workflow Steps and Substates

The five steps map directly to the workflow defined in `v050-overview.md`. Two steps have internal substates that the CLI tracks separately from the top-level step.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Workflow State Machine                        │
└─────────────────────────────────────────────────────────────────────┘

         ┌──────────┐
         │   idle   │
         └────┬─────┘
              │  workflow.start
              ▼
    ┌──────────────────────┐
    │       ideation       │
    │  ┌────────────────┐  │
    │  │   discussing   │◀─┼──── orchestrator ↔ user
    │  └───────┬────────┘  │
    │          │ research  │
    │  ┌───────▼────────┐  │
    │  │  researching   │  │──── researcher agents
    │  └───────┬────────┘  │
    │          │ converged │
    └──────────┼───────────┘
               │
      ┌────────▼────────┐
      │  ideation_eval  │  (optional — decided at workflow start)
      └────────┬────────┘
               │
    ┌──────────▼──────────┐
    │         plan        │──── decompose, assign, set criteria
    └──────────┬──────────┘
               │
      ┌────────▼────────┐
      │    plan_eval    │  (optional — decided at workflow start)
      └────────┬────────┘
               │
    ┌──────────▼──────────┐
    │      execution      │──── one task at a time, verify before next
    └──────────┬──────────┘
               │
    ┌──────────▼──────────┐
    │   execution_eval    │  (always mandatory)
    └──────────┬──────────┘
               │  pass            ┌─────────────────────────────┐
               │◀─────────────────│  revise: loop to any prior  │
               ▼                  └─────────────────────────────┘
    ┌──────────────────────┐
    │    memorization      │
    └──────────┬───────────┘
               │
         ┌─────▼────┐
         │   done   │
         └──────────┘
```

**Ideation** has two internal substates: `discussing` and `researching`. `discussing` is the orchestrator-user conversation where the approach is shaped. `researching` is where researcher agents investigate how to realize the approach. These loop — more discussion can follow research, and research can be re-run after discussion refines the question. The CLI tracks the active substate via `currentSubstate` in `state.json`. Ideation exits when the approach is concrete enough to plan against, which is a convergence signal the orchestrator emits as an artifact.

**Plan** has no substates. The orchestrator enters plan mode, produces task decomposition with delegation assignments and verification criteria, and exits. Plan is complete when a plan artifact exists in the `plan/` step directory.

**Execution** has no substates visible to the state machine. Internally, the orchestrator runs one task at a time and verifies before proceeding — but the state machine sees execution as a single active step until it exits. Task-level tracking lives in execution artifacts, not in state transitions.

**Evaluation** steps (`ideation_eval`, `plan_eval`, `execution_eval`) have no substates. They are separate workflow steps, not substeps of the preceding step, because the creating agent must not participate in evaluation. Evaluation enters, collects verdicts from independent evaluator agents, and exits with a `decision.eval.verdict` event.

**Memorization** has no substates. The orchestrator reads the conversation log, extracts decisions, open questions, and gotchas, and writes them to `.gobbi/sessions/{session-id}/memorization/`.

---

## Transition Table

Every valid transition in the state machine. Transitions not in this table are invalid — the guard layer blocks them.

| From | To | Trigger | Condition |
|------|----|---------|-----------|
| `idle` | `ideation` | `workflow.start` | Session created |
| `ideation` | `ideation_eval` | `workflow.step.exit` (ideation) | `evalConfig.ideation == true` |
| `ideation` | `plan` | `workflow.step.exit` (ideation) | `evalConfig.ideation == false` |
| `ideation_eval` | `ideation` | `decision.eval.verdict` (revise) | Evaluators returned revise verdict |
| `ideation_eval` | `plan` | `decision.eval.verdict` (pass) | Evaluators returned pass verdict |
| `plan` | `plan_eval` | `workflow.step.exit` (plan) | `evalConfig.plan == true` |
| `plan` | `execution` | `workflow.step.exit` (plan) | `evalConfig.plan == false` |
| `plan_eval` | `plan` | `decision.eval.verdict` (revise) | Evaluators returned revise verdict |
| `plan_eval` | `execution` | `decision.eval.verdict` (pass) | Evaluators returned pass verdict |
| `execution` | `execution_eval` | `workflow.step.exit` (execution) | Always — no condition |
| `execution_eval` | `memorization` | `decision.eval.verdict` (pass) | Evaluators returned pass verdict |
| `execution_eval` | `ideation` | `decision.eval.verdict` (revise) | Loop target is ideation |
| `execution_eval` | `plan` | `decision.eval.verdict` (revise) | Loop target is plan |
| `execution_eval` | `execution` | `decision.eval.verdict` (revise) | Loop target is execution |
| `memorization` | `done` | `workflow.finish` | Memorization artifact written |
| any | `ideation` | `workflow.step.skip` | User explicitly skips forward |

The `loopFrom` field on the `workflow.step.enter` event records which evaluation step triggered the loop. This is what distinguishes a fresh Ideation entry (first time) from a loop-back Ideation entry (triggered by `execution_eval`).

---

## Typed Reducer

> **State is a pure function of events. The reducer is the canonical definition of what each event means.**

The reducer takes the current state and one event, and returns the next state. It is pure — no side effects, no external reads. Replaying all events in sequence order produces the same state as reading `state.json`. When `state.json` is absent or invalid, the CLI replays `gobbi.db` through the reducer to rebuild it.

The reducer is structured as a discriminated union switch: the `type` field of the event is the discriminant, and each case handles one event type. The switch has a default branch that assigns to a `never`-typed variable. This TypeScript exhaustiveness pattern means the compiler reports a type error if a new event type is added to the enum without a corresponding reducer case — no event type can be silently ignored.

The reducer validates transitions as a side effect of processing events. Before applying a `workflow.step.enter` event, the reducer checks that the target step is reachable from the current step given current state. If the transition is invalid, the reducer returns an error result rather than a new state. This means the reducer and transition table are the same system expressed in two forms — the table is documentation, the reducer is enforcement.

Key state fields the reducer maintains:

- `currentStep` — set on `workflow.step.enter`, cleared on `workflow.step.exit`
- `currentSubstate` — set and cleared within Ideation only
- `completedSteps` — appended on each `workflow.step.exit`
- `evalConfig` — set once on `workflow.eval.decide`, never overwritten
- `feedbackRound` — incremented each time execution_eval loops back to a prior step
- `activeSubagents` — added on `delegation.spawn`, removed on `delegation.complete` or `delegation.fail`
- `violations` — appended on each `guard.violation`

The reducer never mutates state in place. It produces a new state object on every invocation. This makes the state history reconstructable: each event maps to a state snapshot.

**Why not XState v5** — The typed reducer was chosen over XState v5 for one structural reason: the event-sourced model means `events.jsonl` (and `gobbi.db`) IS the state machine — the complete record of what happened and in what order. Introducing XState would create a second state system that must be kept synchronized with the event store. Two state representations means two places to update when a transition changes, and two sources of truth that can diverge. The reducer pattern keeps the state machine in one place: the reducer function, validated by a `deriveState()` equivalent. It is zero-dependency, pure TypeScript, and naturally aligned with event sourcing. XState's primary advantage — visual graph generation — can be replicated with a simple renderer over the transition table defined in this document.

---

## Evaluation Gate Model

> **The evaluation decision is made once, upfront. No mid-workflow prompts for steps the user already decided.**

Evaluation is mandatory after Execution. It is optional at Ideation and Plan. The decision about whether to run optional evaluation steps is made once — at workflow start — and stored in `evalConfig` within `state.json`.

The `workflow.eval.decide` event captures this decision. It is written during the session initialization flow by `gobbi workflow init`, before Ideation begins. `gobbi workflow init` asks the user four setup questions including whether to evaluate after Ideation and whether to evaluate after Plan. The answers are stored as a `workflow.eval.decide` event immediately, populating `evalConfig` in `state.json`. The first step's generated prompt includes `evalConfig` in its session section. Its `data` payload records `{ ideation: boolean, plan: boolean }`. Once written, the reducer treats `evalConfig` as immutable — no subsequent event overwrites it.

Why this matters: if evaluation were decided per-step, the orchestrator would ask the user at the Ideation exit and again at the Plan exit. These interruptions mid-workflow are exactly the kind of idle-inducing questions v0.5.0 eliminates. Deciding once, storing the result, and reading it at transition time removes two decision points from the active workflow path.

The `execution_eval` step has no guard condition — it is always entered after Execution exits. This is not configurable. Execution without evaluation is not a valid workflow completion.

---

## Feedback Loops

> **Evaluation can send the workflow back to any prior step, not just the immediately preceding one.**

When `execution_eval` produces a revise verdict, the evaluator specifies a loop target: `ideation`, `plan`, or `execution`. The `workflow.step.enter` event that initiates the loop carries a `loopFrom` field in its `data` payload identifying which evaluation step triggered it. This field is how the CLI distinguishes a loop-back step entry from a first-time entry, which affects the prompt it generates — a loop-back prompt includes the evaluation findings as context.

The `feedbackRound` counter in state tracks how many loop-backs have occurred in this session. It increments each time `execution_eval` routes to a prior step rather than `memorization`. A high `feedbackRound` value is a stagnation signal — the CLI can surface it as a warning and suggest the user consider accepting partial results or restructuring the task.

Feedback loops from `ideation_eval` and `plan_eval` return only to their immediately preceding step (`ideation` and `plan` respectively). They do not carry a `loopFrom` field because the target is unambiguous. The `feedbackRound` counter does not increment for these loops — only loops that cross the execution boundary count as feedback rounds.

---

## Guard Specification with JsonLogic

> **Guards are declarative JSON. The condition language is JsonLogic — the same engine used for prompt template conditionals.**

Guards intercept tool calls via the PreToolUse hook. Each guard is a JSON object with five fields:

| Field | Purpose |
|-------|---------|
| `id` | Unique identifier for the guard — referenced in `guard.violation` events |
| `priority` | Integer — lower number means higher precedence when multiple guards match |
| `match` | Fast-path filter: `{ step, tool }` — guards only evaluate when the current step and tool call match |
| `condition` | JsonLogic expression evaluated against current state and the tool call arguments |
| `effect` | `deny`, `allow`, or `warn` |
| `reason` | Human-readable message with Mustache variable interpolation for context |

The `match` field exists for performance. Evaluating JsonLogic expressions against every tool call for every guard would be slow. The `match` filter is a cheap structural check — if the current step is not in `match.step` and the tool is not in `match.tool`, the guard is skipped entirely. Only matching guards proceed to JsonLogic evaluation.

### JsonLogic Operators

Standard JsonLogic operators available in conditions: `var`, `==`, `!=`, `in`, `and`, `or`, `!`, `!!`. These cover the common patterns: checking the current step, checking whether a prior step completed, checking the tool call's target path.

Gobbi extends JsonLogic with two custom operators:

**`event_exists(type, step)`** — returns true if at least one event of the given type exists for the given step. Used to check whether a step has been entered or completed. Example: a guard that blocks execution if no plan artifact exists uses `event_exists("workflow.step.exit", "plan")` to verify the plan step completed.

**`event_count(type)`** — returns the number of events of the given type across the full session. Used to detect repeated violations or measure loop depth. Example: a stagnation warning guard uses `event_count("guard.violation")` to detect escalating enforcement.

### Enforcement Levels

Two enforcement levels handle different violation severity:

**Soft nudge** (`warn` effect) — the tool call is allowed but the PreToolUse hook injects an `additionalContext` field into the hook response. This surfaces the warning to the orchestrator without blocking progress. Used for edge cases where the action is technically allowed but unusual — for example, writing to a step directory that is not the current active step.

**Hard block** (`deny` effect) — the tool call is blocked. The hook returns a deny response. A `guard.violation` event is written to the event store. The orchestrator receives only the denial message and the `reason` from the guard. Used for structural violations — writing to `.claude/` during an active session, entering a step out of sequence, spawning evaluators from the creating agent.

### Conflict Resolution

When multiple guards match the same tool call, they are evaluated in ascending `priority` order. The first guard that produces a `deny` effect halts evaluation — no lower-priority guard is consulted. `warn` effects do not halt evaluation; all matching warn guards contribute their `additionalContext` to the response. A `deny` guard always takes precedence over `warn` guards regardless of priority ordering.

This priority scheme means the most critical structural guards (low priority number) are evaluated first and their decisions are final. Informational guards (high priority number) add context without interfering with the structural enforcement.

---

## Boundaries

This document covers step definitions, substates, the full transition table, the typed reducer pattern, the evaluation gate model, feedback loop mechanics, and the guard specification format with JsonLogic.

For how hooks invoke guards and write events to the store, see `v050-hooks.md`. For how the CLI reads state and uses it to generate prompts, see `v050-prompts.md`. For the event store schema and state field definitions, see `v050-session.md`.
