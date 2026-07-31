---
name: cowork
description: "Cowork is a user-led orchestration mode for stepwise implementation in one isolated worktree, with optional Ideation and Planning and user-called evaluation."
allowed-tools: Read, Grep, Glob, Bash, Agent, Task, AskUserQuestion
skill-type: operation
---

# Cowork

Cowork is a user-led orchestration mode for fast implementation after it has already been selected. It
routes each topic through optional Ideation and Planning before verified Execution, then returns control to
the user.

The operating agent scales the selected stages to the topic, keeps their artifacts and execution units in one
isolated writer history, and performs independent evaluation or closure only when the user calls for it.

## Principles

### Keep the user in control at topic boundaries

The user supplies each topic and owns every material scope, design, risk, and external-action decision. The
agent keeps the topic concrete, returns its evidence, and waits for the user's next direction.

### Match shaping depth to the evidence and risk

Fast work still needs enough thought to be safe and correct. Use the smallest shaping depth that selects the
right combination of Ideation, Planning, and Execution for the topic's breadth, uncertainty, dependencies,
reversibility, and material choices.

### Keep one isolated local history

One linked worktree and one ordered writer chain make every incremental result inspectable and recoverable.
Each durable stage artifact set and executable unit ends in a focused verified commit before dependent work
begins.

### Separate self-verification from independent evaluation

Every selected stage must create and self-review or self-verify its result. Independent dual-system evaluation
is a separate user-called judgment and never substitutes for stage quality checks.

## Rules

- **MUST bind cowork to one verified isolated worktree before the first tracked edit.** Use its fully expanded
  absolute path for every write and preserve the main checkout.
- **MUST let the agent select and report Direct, Light, or Structured delivery while the user owns every
  material decision.** Load and apply the canonical Ideation and Planning skills whenever their optional stages
  are selected.
- **MUST keep one ordered writer and create a focused verified commit for each durable stage artifact set and
  execution unit.** Do not let a dependent stage use an uncommitted or unverified prerequisite.
- **MUST self-review or self-verify the exact result of every selected stage and run independent evaluation
  only after an explicit `evaluate` call.** One call authorizes one fresh dual-system review round.
- **NEVER create `session.json`, `state.json`, Workflow router or record state, typed staging, RECORD artifacts,
  or full Workflow Wrap-up output.** Contracted Ideation and Planning topic artifacts are allowed.
- **MUST close only after an explicit `wrap up` call and resolve stale or absent evaluation with the user.**
  Retain the branch and worktree unless a separate authorized Git operation proves publication, merge, or safe
  cleanup.

## Procedure

### Phase 1 — Establish the Isolated Session

#### 1.1 Bind the session to one worktree

After cowork is selected, use the [Git operation](../git/SKILL.md) to create or reuse one verified isolated
worktree before any tracked edit. Preserve the main checkout, use the fully expanded worktree path for every
write, and report the base, branch, worktree, head, and clean status. If the gate cannot be proved, retain all
existing work, report the exact recovery evidence, and stop at this step.

#### 1.2 Recover a retained cowork session

Resume only from an explicitly named retained branch or worktree. Use Git evidence to recover committed and
pending work, require one safe writer, and report the exact recovery point. When the conversation does not
prove a prior frozen evaluation subject and completed round, treat evaluation as absent; never infer full
Workflow state from the retained local history.

### Phase 2 — Run the Topic Loop

#### 2.1 Inspect, understand, and route the user topic

Inspect the user-supplied topic and relevant project evidence, then use
[Discussion](../discussion/SKILL.md) to make the outcome, boundaries, acceptance proof, and material choices
concrete. The agent selects and reports the smallest safe delivery depth and its path through optional
Ideation, optional Planning, and required Execution; the user supplies topics and owns material decisions.

| Depth | Evidence | Normal topic path |
| --- | --- | --- |
| **Direct** | The outcome, root cause when applicable, acceptance proof, and one execution unit are clear, local, reversible, and low-risk. | Skip Ideation and Planning; execute the locked topic contract. |
| **Light** | A bounded topic needs a design decision or modest decomposition. | Run whichever optional stage the evidence requires, then execute. |
| **Structured** | The topic is large, cross-cutting, architectural, high-risk, hard to reverse, or materially uncertain. | Normally run Ideation and Planning, then execute. |

Design work requires Ideation, multi-unit work requires Planning, and a concrete fix may skip Ideation. Lock
the chosen path and topic contract in the conversation, including exact fully expanded paths for selected
artifacts; reuse the project hierarchy or ask the user when none exists. If new input changes the active topic,
stop writes, preserve state, revise the contract, and report the new route.

#### 2.2 Run optional Ideation

When selected, load and apply [Ideation](../ideation/SKILL.md) within the locked topic. Write
`requirements.md`, `topics.md`, and `ideation.md` at their exact contracted worktree paths, complete the
operation's creation and self-review, and defer independent review to an explicit Phase 3 `evaluate` call.

Verify and commit the three artifacts as one focused prerequisite before dependent work. Their committed
content is the design authority; stop at this step when it is incomplete, unverified, uncommitted, or
materially disputed. When Ideation was not selected, continue to the selected next step.

#### 2.3 Run optional Planning

When selected, load and apply [Planning](../planning/SKILL.md) to the committed Ideation artifacts or, when
Ideation was skipped, the locked topic contract. Write `tasks.md` and `plan.md` at their exact contracted
worktree paths, complete the operation's creation and self-review, and defer independent review to an explicit
Phase 3 `evaluate` call.

Verify and commit both artifacts as one focused prerequisite before Execution. Their committed content is the
execution authority; stop at this step when it is incomplete, unverified, uncommitted, dependency-invalid, or
inconsistent with its inputs. When Planning was not selected, continue with the single-unit topic contract.

#### 2.4 Execute, verify, and commit the next unit

Select the next dependency-ready unit from committed `plan.md`, or use the locked single-unit contract when
Planning was skipped. Keep one ordered writer and apply the
[Delegation contract](../delegation/SKILL.md) with the [Execution operation](../execution/SKILL.md) to produce,
verify, and accept one focused local commit.

Do not start dependent work before acceptance. Repair an invalid unit or commit through the same ordered
writer and repeat this step. If its evidence instead materially changes the contract, preserve state and route
through Step 2.5.

#### 2.5 Route the next loop action

Route another dependency-ready unit to Step 2.4. Route an invalid design to Step 2.2 and then Step 2.3 when
Planning applies; route invalid decomposition to Step 2.3; route a changed stage selection or material
decision to Step 2.1. Verify and commit every revised durable prerequisite before dependent work resumes.

Complete a topic only when all selected stages and units have verified focused commits and the worktree passes
its checks. Report the outcome, scope, artifacts, commits, verification, concerns, exclusions, and any commits
after the last evaluated head. Then wait for the user's next topic, explicit `evaluate`, or explicit `wrap up`.

### Phase 3 — Evaluate on User Call

#### 3.1 Freeze one user-called review subject

Enter this phase only for an explicit `evaluate` call. Freeze the named subject or, by default, the session
commits after the last completed evaluation subject (after the base when none is reliably known), including
the exact head, diff, contracts, stage artifacts, requirements, verification, and status. Disclose excluded
commits as unevaluated. If the tree or head changes during review, discard the stale round and require a new
explicit call.

#### 3.2 Run one independent dual-system round

One call authorizes one fresh, independent Claude-and-Codex round over the same neutral frozen subject through
the [Evaluation operation](../evaluation/SKILL.md). Keep the reports separate until both are valid. If either
system is unavailable or invalid, pause with the exact failure; a single-system continuation requires the
user's explicit waiver for that named round.

#### 3.3 Aggregate and disposition the findings

Aggregate valid reports using the more severe `FAIL`, `REVISE`, or `PASS` verdict and present every material
finding for the user's accept, reject, or defer disposition. Do not change the work before that disposition.
Record the subject, verdict, and decisions in the conversation only. Accepted corrections return to Phase 2;
their changed head remains unevaluated until another explicit `evaluate` call.

### Phase 4 — Close on User Call

#### 4.1 Decide evaluation freshness

Enter this phase only for an explicit `wrap up` call. Compare the head with the last completed evaluation
subject. When evaluation is absent or stale, use [Discussion](../discussion/SKILL.md) to ask whether to run one
round or close with self-verification only, naming the unevaluated commits.

If the user chooses evaluation, complete Phase 3 and repeat this freshness decision; every later round remains
a user choice. If the user declines, record that no independent verdict covers the named head.

#### 4.2 Verify and hand off the retained local result

Use current Execution and Git evidence to require a clean worktree, focused verified commits, and an unchanged
main checkout; return a defect to its owning Phase 2 step. Provide a conversation-only handoff with the
outcome, scope, artifacts, commits, verification, evaluation coverage and dispositions, unresolved risks,
base, branch, worktree, head, status, and first recovery command.

Retain the branch and worktree, and do not produce full Workflow state, RECORD, memory promotion, or Wrap-up
output. Publication, merge, cleanup, branch deletion, and worktree removal require a separate explicit Git
operation.

## References
