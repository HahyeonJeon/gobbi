---
name: cowork
description: "Cowork is a user-led Gobbi orchestration mode for fast stepwise implementation in one isolated worktree, with optional Ideation and Planning and user-called evaluation."
allowed-tools: Read, Grep, Glob, Bash, Agent, Task, AskUserQuestion
skill-type: operation
---

# Cowork

Cowork is a user-led Gobbi orchestration mode for fast implementation after the user selects it at Gobbi
entry. It takes one topic at a time through the smallest safe combination of optional Ideation, optional
Planning, and verified Execution, then returns control to the user.

Cowork may create the canonical artifacts owned by Ideation and Planning. It keeps those artifacts and
implementation units in one isolated local history, evaluates only when the user calls `evaluate`, and closes
only when the user calls `wrap up`.

## Principles

### Keep the user in control at topic boundaries

The user supplies each topic and owns every material scope, design, risk, destructive-action, and external
service decision. The manager makes the topic concrete, returns accepted evidence, and waits for direction.

### Match shaping depth to the topic

Fast work still needs enough thought to be correct and recoverable. Select the smallest delivery depth that
fits the topic's uncertainty, dependencies, breadth, risk, and reversibility.

### Keep one inspectable local history

One linked worktree and one ordered writer chain keep every result attributable and recoverable. Each selected
shaping artifact set and implementation unit becomes a focused verified commit before dependent work starts.

### Separate stage quality from independent evaluation

Every selected stage self-reviews or self-verifies before acceptance. Independent dual-system evaluation is a
separate user-called judgment, never a substitute for stage quality.

## Rules

- **MUST establish one verified isolated Cowork worktree before the first tracked edit.** Use the fully
  expanded worktree path for every write and preserve the main checkout.
- **MUST let the manager select and report Direct, Light, or Structured delivery while the user owns every
  material decision.** Changed evidence or a material user decision reruns topic routing.
- **MUST apply the canonical Ideation and Planning skills whenever their optional stages are selected.** Their
  canonical artifact sets are allowed Cowork outputs at exact user-approved project paths.
- **MUST keep one ordered writer chain with role-bound focused commits and manager acceptance.** Leaders own
  selected Ideation and Planning artifacts; executors own implementation units.
- **MUST run independent evaluation only after an explicit `evaluate` call.** One call authorizes one fresh
  Claude-and-Codex round, and a bare call uses the whole clean Cowork branch through its current head.
- **MUST close only after an explicit `wrap up` call and remain manifest-free.** Never create Workflow
  `session.json`, `state.json`, RECORD, typed staging, memory promotion, or full Workflow Wrap-up output, and
  retain the branch and worktree unless a separate Git operation is authorized.

## Procedure

### Phase 1 — Establish the Isolated Cowork Session

#### 1.1 Create or recover the worktree

- Enter only after Gobbi records the user's Cowork selection. Use the [Git operation](../git/SKILL.md) to lock
  the manifest-free Cowork contract and create one isolated branch and worktree before any tracked edit, or
  recover only the branch/worktree the user explicitly names.
- Verify and report the UUID, repository, base branch and commit, session branch, absolute worktree, head,
  clean status, unchanged main checkout, and recovery point. Stop with exact evidence when identity,
  isolation, provenance, base, writer ownership, or recovery cannot be proved.

### Phase 2 — Run the User-Topic Loop

#### 2.1 Route and deliver one topic

- Inspect the user topic and relevant project evidence. Use [Discussion](../discussion/SKILL.md) to lock the
  outcome, purpose, scope, acceptance proof, material decisions, selected artifact paths, first action, and
  exclusions before dispatch.

| Depth | Evidence | Topic path |
|---|---|---|
| **Direct** | Outcome, root cause when applicable, acceptance proof, and one low-risk reversible unit are clear. | Execute the locked topic without Ideation or Planning. |
| **Light** | One bounded design choice or modest decomposition remains. | Run only the optional shaping stage the evidence requires, then execute. |
| **Structured** | Work is broad, cross-cutting, architectural, high-risk, hard to reverse, or materially uncertain. | Normally run Ideation, Planning, then ordered Execution. |

- Require Ideation for material design work and Planning for multiple dependent implementation units. Report
  the selected depth and reason; return to this decision when new evidence, changed stage selection, or a
  material user decision changes the contract.
- Build each specialist assignment through [Delegation](../delegation/SKILL.md) and the
  [shared assignment contract](../workflow/delegation.md). Include the Cowork UUID, topic, depth, selected
  stage, stable assignment, absolute worktree, branch, prerequisite commits, allowed and protected paths,
  expected artifact or implementation, verification, commit authority, and escape paths.
- For selected Ideation, assign a leader to apply [Ideation](../ideation/SKILL.md) with
  `caller-owned-independent-evaluation`, self-review its canonical artifact set, and create one focused
  shaping commit. For selected Planning, assign a leader to apply [Planning](../planning/SKILL.md) to the
  accepted design or locked topic contract, self-review its canonical artifact set, and create one focused
  planning commit.
- Assign each dependency-ready unit to an executor through [Execution](../execution/SKILL.md). Keep writers
  sequential; after every report, reread the promised artifact or implementation and commit, reproduce the
  relevant verification, and accept, repair, or redispatch it before dependent work begins.
- On missing artifacts, malformed output, failed checks, unavailable capability, wrong-tree evidence,
  conflicting user work, unsafe recovery, or scope drift, stop with the exact failure and return to the
  earliest responsible stage. Complete the topic only when every selected result is accepted in a focused
  verified commit and the worktree is clean; report outcome, scope, artifacts, commits, verification,
  exclusions, concerns, and current evaluation coverage before waiting for the next topic or user call.

### Phase 3 — Evaluate on User Call

#### 3.1 Evaluate one frozen subject

- Enter only for an explicit `evaluate`. A bare call requires a clean worktree and freezes the whole Cowork
  subject from the locked base commit through the current head, including all commits, tree changes, topic
  contracts, accepted artifacts, user decisions, verification, status, and exclusions. A user-named narrower
  subject is allowed but is not whole-branch coverage.
- Run one fresh independent Claude report and one fresh independent Codex report over the same neutral subject
  through [Evaluation](../evaluation/SKILL.md). Keep reports separate until valid; pause on an unavailable or
  invalid system unless the user waives that named system for this round.
- Aggregate with the more severe verdict and present every material finding for user disposition before
  changing work. Accepted corrections return to the owning leader or executor in Phase 2, create new focused
  commits, make prior whole-branch coverage stale, and require another explicit `evaluate` call.

### Phase 4 — Close on User Call

#### 4.1 Return the retained result

- Enter only for an explicit `wrap up`. When no independent verdict covers the current whole-branch head, use
  [Discussion](../discussion/SKILL.md) to ask whether to evaluate or close with self-verification only; name
  the uncovered commit range and record a decline literally.
- Require current Execution and Git evidence for accepted focused commits, a clean Cowork worktree, and an
  unchanged main checkout. Return a conversation-only handoff with outcome, scope, topics, artifacts, commits,
  verification, evaluation coverage and dispositions, exclusions, risks, UUID, base, branch, worktree, head,
  status, and first recovery command; retain local objects and route any later publication, merge, or cleanup
  through a separate explicit Git operation.

## References
