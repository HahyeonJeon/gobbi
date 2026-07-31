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

#### 1.1 Establish or recover the isolated session

- Before the first tracked edit, use the [Git operation](../git/SKILL.md) to create or reuse one verified
  isolated worktree. Preserve the main checkout, use the fully expanded worktree path for every write, and
  report the base, branch, worktree, head, and clean status.
- Resume only from an explicitly named retained branch or worktree. Use Git evidence to recover committed and
  pending work, require one safe writer, and report the exact recovery point. Treat evaluation as absent unless
  the conversation proves a frozen subject and completed round.
- Stop with exact recovery evidence when isolation or recovery cannot be proved. Retain existing work and do
  not create or infer full Workflow state.

### Phase 2 — Run the Topic Loop

#### 2.1 Route and deliver each user topic

- Inspect the user-supplied topic and relevant project evidence, then use
  [Discussion](../discussion/SKILL.md) to lock the outcome, boundaries, acceptance proof, material decisions,
  selected artifact paths, and first action. The user supplies topics and owns material choices; the agent
  selects and reports the smallest safe Direct, Light, or Structured path.

| Depth | Evidence | Normal topic path |
| --- | --- | --- |
| **Direct** | The outcome, root cause when applicable, acceptance proof, and one execution unit are clear, local, reversible, and low-risk. | Skip Ideation and Planning; execute the locked topic contract. |
| **Light** | A bounded topic needs a design decision or modest decomposition. | Run whichever optional stage the evidence requires, then execute. |
| **Structured** | The topic is large, cross-cutting, architectural, high-risk, hard to reverse, or materially uncertain. | Normally run Ideation and Planning, then execute. |

- Design work requires Ideation, multi-unit work requires Planning, and a concrete fix may skip Ideation.
  Record exact fully expanded worktree paths for every selected artifact, using the project hierarchy or a
  user-approved hierarchy when none exists.
- When Ideation is selected, load and apply [Ideation](../ideation/SKILL.md). Create and self-review
  `requirements.md`, `topics.md`, and `ideation.md` at their exact contracted paths, then verify and commit
  them as one focused prerequisite and design authority. Defer independent review to an explicit `evaluate`.
- When Planning is selected, load and apply [Planning](../planning/SKILL.md) to committed Ideation artifacts
  or the locked contract. Create and self-review `tasks.md` and `plan.md` at their exact contracted paths, then
  verify and commit them as one focused prerequisite and execution authority. Defer independent review to an
  explicit `evaluate`.
- Execute the next dependency-ready `plan.md` unit, or the locked single unit, through the
  [Delegation contract](../delegation/SKILL.md) and [Execution operation](../execution/SKILL.md). Keep one
  ordered writer, accept one verified focused commit, and make dependent work wait. Repair invalid execution
  through the same writer and repeat this execution action.
- Keep routing mechanical. Changed stage selection, new material evidence, or a material user decision restarts
  topic routing; invalid design reruns Ideation and then Planning when applicable; invalid decomposition
  reruns Planning; another dependency-ready unit repeats Execution. Verify and commit every revised
  prerequisite before dependent work.
- Complete the topic only when every selected stage and unit has a verified focused commit and the worktree
  passes its checks. Report the outcome, scope, artifacts, commits, verification, concerns, exclusions, and
  evaluation freshness, then wait for the next topic, explicit `evaluate`, or explicit `wrap up`.

### Phase 3 — Evaluate on User Call

#### 3.1 Evaluate one user-called subject

- Enter only for an explicit `evaluate`. Freeze the named subject or the default unevaluated session commits,
  including the exact head, diff, contracts, artifacts, requirements, verification, and status. Mark excluded
  commits unevaluated; a changed tree or head makes the round stale and requires a new explicit call.
- One call authorizes one fresh independent Claude-and-Codex round over the same neutral subject through the
  [Evaluation operation](../evaluation/SKILL.md). Keep the reports separate until valid, and pause on an
  unavailable or invalid system unless the user waives that named system for that round.
- Aggregate the reports using the more severe verdict, preserve every material finding, and obtain the user's
  accept, reject, or defer disposition before changing work. Record the subject, verdict, and decisions in the
  conversation only. Accepted corrections return to Phase 2 and require a new explicit evaluation call.

### Phase 4 — Close on User Call

#### 4.1 Close the retained result

- Enter only for an explicit `wrap up`. If evaluation is absent or stale, use
  [Discussion](../discussion/SKILL.md) to ask whether to evaluate or close with self-verification, naming the
  unevaluated commits. An evaluation choice runs Phase 3 and then repeats this freshness check; a decline
  records that no independent verdict covers the head.
- Require current Execution and Git evidence for a clean worktree, focused verified commits, and an unchanged
  main checkout; repair through Phase 2 when needed. Provide a conversation-only handoff with the outcome,
  scope, artifacts, commits, verification, evaluation and dispositions, risks, branch, worktree, head, status,
  and first recovery command.
- Retain the branch and worktree. Do not produce full Workflow state, RECORD, memory promotion, or Wrap-up
  output. Publication, merge, cleanup, branch deletion, and worktree removal require a separate explicit Git
  operation.

## References
