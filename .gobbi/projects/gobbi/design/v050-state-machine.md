# v0.5.0 State Machine

Workflow transition reference for v0.5.0. Read this when implementing or reasoning about step progression, evaluation gating, feedback loops, or guard conditions. Assumes familiarity with the event model in `v050-session.md`.

---

## Workflow Steps and Substates

The six steps map directly to the workflow defined in `v050-overview.md`. Two steps have internal substates that the CLI tracks separately from the top-level step.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Workflow State Machine                        │
└─────────────────────────────────────────────────────────────────────┘

         ┌──────────┐
         │   idle   │◀─────────────────── workflow.abort (from error)
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
               │  workflow.step.exit
               ▼
    ┌──────────────────────┐
    │       handoff        │
    └──────────┬───────────┘
               │  workflow.finish
         ┌─────▼────┐
         │   done   │
         └──────────┘

                              ┌──────────┐
          any ──────────────▶ │  error   │ ──── workflow.resume → prior step
          (timeout, cap,      └──────────┘      workflow.abort  → done
           invalid transition)
```

**Ideation** has two internal substates: `discussing` and `researching`. `discussing` is the orchestrator-user conversation where the approach is shaped. `researching` is where researcher agents investigate how to realize the approach. These loop — more discussion can follow research, and research can be re-run after discussion refines the question. The CLI tracks the active substate via `currentSubstate` in `state.json`. Ideation exits when the approach is concrete enough to plan against, which is a convergence signal the orchestrator emits as an artifact.

**Plan** has no substates. The orchestrator enters plan mode, produces task decomposition with delegation assignments and verification criteria, and exits. Plan is complete when a plan artifact exists in the `plan/` step directory.

**Execution** has no substates visible to the state machine. Internally, the orchestrator runs one task at a time and verifies before proceeding — but the state machine sees execution as a single active step until it exits. Task-level tracking lives in execution artifacts, not in state transitions.

**Evaluation** steps (`ideation_eval`, `plan_eval`, `execution_eval`) have no substates. They are separate workflow steps, not substeps of the preceding step, because the creating agent must not participate in evaluation. Evaluation enters, collects verdicts from independent evaluator agents, and exits with a `decision.eval.verdict` event.

**Memorization** has no substates. The orchestrator reads the conversation log, extracts decisions, open questions, and gotchas, and writes them to `.gobbi/projects/<name>/sessions/{session-id}/memorization/`.

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
| `execution_eval` | `error` | `decision.eval.verdict` (revise) | `feedbackRound >= maxFeedbackRounds` |
| `memorization` | `handoff` | `workflow.step.exit` | Memorization artifact written |
| `handoff` | `done` | `workflow.finish` | Handoff artifact written; emits terminal event |
| `any` | `error` | `workflow.step.timeout` | Step elapsed time exceeds configured timeout |
| `any` | `error` | (reducer) | Reducer rejects an invalid transition |
| `any` | `ideation` | `workflow.step.skip` | User explicitly skips forward |
| `error` | `done` | `workflow.abort` | User aborts the workflow |
| `error` | (prior step) | `workflow.resume` | User resumes from last valid state |

**Priority rule:** `any` → `error` has HIGHER priority than `any` → `ideation` (skip). Error takes precedence over skip.

**Terminal state rule:** `done` accepts no events. A `workflow.resume` from `done` is rejected by the reducer — the workflow must start a new session. This is enforced by the exhaustiveness check: the `done` case handles no event types.

The `loopTarget` field on the `decision.eval.verdict` event specifies which step to loop back to. The transition table uses this field to route revise verdicts from `execution_eval` to `ideation`, `plan`, or `execution`. The `feedbackRound` counter distinguishes first-time entries from loop-back entries.

> **Plan vs Planning naming:** the runtime state-machine literal is `plan` / `plan_eval` (as shipped in [`packages/cli/src/specs/index.json`](../../../../packages/cli/src/specs/index.json)). Design prose in [`v050-features/orchestration/README.md`](v050-features/orchestration/README.md) and the loop name in [`gobbi/SKILL.md`](../../skills/gobbi/SKILL.md) use "Planning Loop" / `planning`. The dual form is intentional pending a comprehensive rename Pass tracked in [issue #133](https://github.com/HahyeonJeon/gobbi/issues/133). When in doubt: code says `plan`; design prose says Planning.

### Skip Semantics

The `workflow.step.skip` transition allows the user to jump the workflow forward to Ideation from any step. Skip has specific behaviors for edge cases:

**In-flight subagents** — SubagentStop hooks continue firing for any active subagents. Their `delegation.complete` events are applied to state normally — artifacts are preserved. Skip does not cancel or discard subagent work.

**Artifact preservation** — Artifacts from the skipped step remain in the step directory. They are not deleted or overwritten. The new Ideation entry starts with a clean ideation directory but prior step directories retain their content.

**No loop context** — Skip transitions directly to ideation via the transition table. Skip is user-initiated navigation, not evaluation-triggered feedback. The CLI distinguishes skip entries from loop-back entries because skip transitions do not increment `feedbackRound`.

**Self-skip guard** — Skip from `ideation` to `ideation` is a no-op. The reducer rejects the transition because the target is the current step. Skip from `ideation_eval` or `plan_eval` to `ideation` is valid — it abandons the evaluation and restarts ideation.

---

## Typed Reducer

> **State is a pure function of events. The reducer is the canonical definition of what each event means.**

The reducer takes the current state and one event, and returns the next state. It is pure — no side effects, no external reads. Replaying all events in sequence order produces the same state as reading `state.json`. When `state.json` is absent or invalid, the CLI replays `gobbi.db` through the reducer to rebuild it.

The reducer is structured as a discriminated union switch: the `type` field of the event is the discriminant, and each case handles one event type. The switch has a default branch that assigns to a `never`-typed variable. This TypeScript exhaustiveness pattern means the compiler reports a type error if a new event type is added to the enum without a corresponding reducer case — no event type can be silently ignored. The `error` state is a variant in this discriminated union — its valid events and transitions are handled by the same exhaustiveness mechanism as all other states.

The reducer validates transitions as a side effect of processing events. For transition-triggering events (`workflow.step.exit`, `decision.eval.verdict`, `workflow.step.skip`), the reducer calls `findTransition()` to check that the target step is reachable from the current step given current state. If the transition is invalid, the reducer returns an error result rather than a new state. This means the reducer and transition table are the same system expressed in two forms — the table is documentation, the reducer is enforcement.

Key state fields the reducer maintains:

- `currentStep` — advanced by transition-triggering events (`workflow.step.exit`, `decision.eval.verdict`, `workflow.step.skip`)
- `currentSubstate` — set and cleared within Ideation only
- `completedSteps` — appended on each `workflow.step.exit`
- `evalConfig` — set once on `workflow.eval.decide`, never overwritten
- `feedbackRound` — incremented each time execution_eval loops back to a prior step
- `maxFeedbackRounds` — configurable cap (default 3), set at workflow start
- `activeSubagents` — added on `delegation.spawn`, removed on `delegation.complete` or `delegation.fail`
- `violations` — appended on each `guard.violation`

The reducer never mutates state in place. It produces a new state object on every invocation. This makes the state history reconstructable: each event maps to a state snapshot.

**Why not XState v5** — The typed reducer was chosen over XState v5 for one structural reason: the event-sourced model means `state.db` IS the state machine — the complete record of what happened and in what order. Introducing XState would create a second state system that must be kept synchronized with the event store. Two state representations means two places to update when a transition changes, and two sources of truth that can diverge. The reducer pattern keeps the state machine in one place: the reducer function, validated by a `deriveState()` equivalent. It is zero-dependency, pure TypeScript, and naturally aligned with event sourcing. XState's primary advantage — visual graph generation — can be replicated with a simple renderer over the transition table defined in this document.

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

When `execution_eval` produces a revise verdict, the evaluator specifies a loop target: `ideation`, `plan`, or `execution`. The `decision.eval.verdict` event carries a `loopTarget` field in its `data` payload identifying which step to return to. The transition table routes the verdict to the specified step. The `feedbackRound` counter increments on each loop-back from `execution_eval`, which is how the CLI distinguishes loop-back entries from first-time entries — a loop-back prompt includes the evaluation findings as context.

The `feedbackRound` counter in state tracks how many loop-backs have occurred in this session. It increments each time `execution_eval` routes to a prior step rather than `memorization`.

### Feedback Round Hard Cap

> **A configurable `maxFeedbackRounds` (default 3) acts as a circuit breaker against infinite evaluation loops.**

When `feedbackRound >= maxFeedbackRounds`, the next revise verdict from `execution_eval` transitions to `error` instead of looping back. The workflow does NOT proceed to `memorization` — work produced by a pathological loop may be broken, and saving it as completed output would be misleading. The `error` state gives the user explicit intervention options: `gobbi workflow resume --force-memorization` to save partial work despite the cap, or `gobbi workflow abort` to discard.

This is a circuit breaker pattern. Without it, an evaluation loop where evaluators consistently return revise verdicts would run indefinitely, consuming tokens and producing no convergent result.

**Pre-cap warning** — When `feedbackRound == maxFeedbackRounds - 1`, the CLI injects a synthesis of previous evaluation findings into the compiled prompt with an explicit directive: this is the last feedback round before the cap fires. The orchestrator sees the accumulated pattern of revise verdicts and can make a final focused attempt to resolve the issues. This is a prompt compilation concern — no new events or state fields, purely the CLI assembling context for the penultimate round.

Feedback loops from `ideation_eval` and `plan_eval` return only to their immediately preceding step (`ideation` and `plan` respectively). They do not carry a `loopFrom` field because the target is unambiguous. The `feedbackRound` counter does not increment for these loops — only loops that cross the execution boundary count as feedback rounds.

---

## Guard Specification with Predicate Registry

> **Guards are declarative JSON data. Conditions reference TypeScript predicate names, not inline expressions.**

Guards intercept tool calls via the PreToolUse hook. Each guard is a JSON object with five fields:

| Field | Purpose |
|-------|---------|
| `id` | Unique identifier for the guard — referenced in `guard.violation` events |
| `priority` | Integer — lower number means higher precedence when multiple guards match |
| `match` | Fast-path filter: `{ step, tool }` — guards only evaluate when the current step and tool call match |
| `condition` | Predicate name (string) — references a function in the CLI's predicate registry |
| `effect` | `deny`, `allow`, or `warn` |
| `reason` | Human-readable message explaining the guard's purpose |

The `match` field exists for performance. The `match` filter is a cheap structural check — if the current step is not in `match.step` and the tool is not in `match.tool`, the guard is skipped entirely. Only matching guards proceed to predicate evaluation.

### Predicate Registry

The CLI maintains a typed predicate registry mapping predicate names to TypeScript functions. Each predicate is a pure function that receives the current workflow state and the tool call arguments and returns a boolean. Predicates live in the CLI codebase, not in spec files — specs remain pure JSON data that reference predicates by name.

`gobbi workflow validate` checks that every predicate name referenced in any guard's `condition` field exists in the registry. This preserves static validation — a misspelled predicate name or a reference to a removed predicate is caught at validation time, not at runtime.

Checking whether a step completed, counting events, or inspecting tool call paths are all predicate functions with typed signatures and testable implementations. Adding a new condition means adding a function to the registry — no custom operator protocol, no expression parser.

### Task-Size Validation Predicate

A predicate that validates task delegation size during the Plan step. The predicate estimates the token budget of each task's delegation prompt and returns true when the task exceeds the context window budget. This predicate is used with `warn` effect — it flags oversized tasks without blocking, because the user may have good reason to accept the risk. The prompt-side implementation of this validation is defined in `v050-prompts.md`.

### Enforcement Levels

Two enforcement levels handle different violation severity:

**Soft nudge** (`warn` effect) — the tool call is allowed but the PreToolUse hook injects an `additionalContext` field into the hook response. This surfaces the warning to the orchestrator without blocking progress. Used for edge cases where the action is technically allowed but unusual — for example, writing to a step directory that is not the current active step, or delegating a task that exceeds the context window budget.

**Hard block** (`deny` effect) — the tool call is blocked. The hook returns a deny response. A `guard.violation` event is written to the event store. The orchestrator receives only the denial message and the `reason` from the guard. Used for structural violations — writing to `.claude/` during an active session, entering a step out of sequence, spawning evaluators from the creating agent.

### Conflict Resolution

When multiple guards match the same tool call, they are evaluated in ascending `priority` order. The first guard that produces a `deny` effect halts evaluation — no lower-priority guard is consulted. `warn` effects do not halt evaluation; all matching warn guards contribute their `additionalContext` to the response. A `deny` guard always takes precedence over `warn` guards regardless of priority ordering. When two deny guards share the same `priority` integer, evaluation order within that priority level is deterministic but unspecified — both would deny, so the first encountered writes the `guard.violation` event.

This priority scheme means the most critical structural guards (low priority number) are evaluated first and their decisions are final. Informational guards (high priority number) add context without interfering with the structural enforcement.

---

## Error State Integration

> **`error` is a first-class state variant, not a flag on an existing state.**

The error state is reachable from any active step when a structural failure occurs — step timeout, feedback round cap exceeded, or reducer rejecting an invalid transition. It is not a terminal state: the user can resume or abort.

### Typed Reducer Exhaustiveness

`error` is a variant in the discriminated union. The reducer's exhaustiveness check covers it like any other state. Valid events when in `error` state: `workflow.resume` (rebuilds from last valid state), `workflow.abort` (transitions to `done`), `delegation.complete` (applied normally — in-flight subagents may complete after the workflow enters error). All other events are rejected by the reducer.

### Feedback Round Counter

Transitions into `error` do NOT increment `feedbackRound`. The counter reflects deliberate evaluation loop-backs, not error conditions. A workflow that enters error at `feedbackRound == 3` stays at `feedbackRound == 3` — the cap triggered the error, but the counter does not advance past the cap.

### Active Subagents

SubagentStop hooks continue firing for in-flight subagents even when the workflow is in `error` state. `delegation.complete` events are applied to state normally — artifacts from completing subagents are preserved, not discarded. This prevents data loss when an error occurs while subagents are mid-execution.

### Transition Priority

`any` → `error` has higher priority than `any` → `ideation` (skip). If both an error condition and a skip request are pending, error takes precedence. This ensures structural failures are never masked by user navigation.

### Resume from Error

`gobbi workflow resume` from `error` state generates a pathway-specific briefing based on what caused the error:

- **Timeout** — briefing includes the step that timed out, elapsed time, and the step's artifacts at the time of timeout
- **Feedback cap** — briefing includes the feedback round history, each round's evaluation findings, and the pattern of revise verdicts
- **Invalid transition** — briefing includes the rejected event and the state at the time of rejection

The user is offered three options: retry from the errored step, force-advance to memorization (`gobbi workflow resume --force-memorization`), or abort (`gobbi workflow abort`).

---

## Step Timeouts

> **Each step has a configurable timeout. The Stop hook checks elapsed time each turn.**

A new event type `workflow.step.timeout` triggers transition to `error` state when a step exceeds its configured timeout. The Stop hook (which fires after each turn) checks elapsed time since the current step's entry. If elapsed time exceeds the step's timeout, the hook writes a `workflow.step.timeout` event.

Default timeouts are generous because human interaction is expected during most steps — the orchestrator frequently pauses for user input. Timeout configuration lives in the step spec `meta` section (cross-reference to `v050-prompts.md` for step spec structure). A step with no configured timeout uses the default.

Timeouts are a structural safety net, not a performance constraint. They catch abandoned or stuck workflows — for example, a session where the user walked away and the orchestrator is cycling without progress.

---

## Boundaries

This document covers step definitions, substates, the full transition table, the typed reducer pattern, the evaluation gate model, feedback loop mechanics with hard cap, the guard specification format with predicate registry, error state integration, and step timeouts.

For how hooks invoke guards and write events to the store, see `v050-hooks.md`. For how the CLI reads state and uses it to generate prompts (including step spec `meta` for timeout configuration and task-size validation), see `v050-prompts.md`. For the event store schema and state field definitions, see `v050-session.md`.
