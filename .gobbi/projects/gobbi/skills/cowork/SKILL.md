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

- Start after cowork has been selected and loaded. Treat the first user topic as the trigger to establish the
  session before any tracked file is edited.
- Inspect the repository root, current checkout, branch, head, status, registered worktrees, candidate base,
  ignore rule, and intended worktree root without mutation. Record the main checkout status so later checks can
  prove cowork did not change it.
- Reuse the current checkout only when direct Git evidence shows it is the intended isolated linked worktree
  and not the main checkout. Otherwise propose the current branch as the local base, resolve a dirty or
  ambiguous base with the user, generate one Gobbi session UUID, and create one branch and linked worktree
  through the [Git operation](../git/SKILL.md).
- Verify the new worktree is registered, clean, on the intended branch, rooted at the exact absolute path, and
  based on the agreed commit. Report the base, branch, worktree, head, and clean status in the conversation.
- Stop on a missing repository, unsafe or occupied target, mismatched root, unresolved base, or failed worktree
  creation. Keep existing work intact, show the exact evidence, and resume from this step after the cause is
  resolved.
- Never copy, move, stash, restore, or silently absorb uncommitted changes from another checkout. Use the
  verified absolute worktree path for every write and `git -C <absolute-worktree>` for every Git command.

#### 1.2 Recover a retained cowork session

- On resume, require an explicit retained branch or worktree identity. Inspect its registration, branch, head,
  commits, provenance trailers, status, and available verification evidence before continuing.
- Recover completed work from the local Git history and recover pending work only from the inspected worktree.
  Stop for a user decision when unique edits, unexpected commits, or conflicting writers make ownership
  unclear.
- Treat evaluation as absent when the current conversation does not reliably identify a prior frozen subject
  and completed round. Git history proves implementation, but it does not prove an independent review occurred.
- Do not create or infer `session.json`, `state.json`, workflow records, typed staging, or RECORD artifacts.
  Continue only after the retained local state has one safe writer and an exact recovery point.

### Phase 2 — Run the Topic Loop

#### 2.1 Inspect, understand, and route the user topic

- Read the user topic, current tree, closest project documents and patterns, relevant history, current behavior,
  applicable mistakes, and the reach of the proposed change before asking questions.
- Make the outcome, reason, actors, included and excluded work, unchanged behavior, success criteria, risks,
  and first action concrete. Resolve every material scope, design, destructive, compatibility, migration,
  security, or external-service decision with the user through [Discussion](../discussion/SKILL.md).
- Select and report the smallest safe delivery depth and the resulting path through optional Ideation,
  optional Planning, and required Execution. Do not ask the user to choose a depth label.

  | Depth | Evidence | Normal topic path |
  | --- | --- | --- |
  | **Direct** | The outcome, root cause when applicable, acceptance proof, and one execution unit are already clear, local, reversible, and low-risk. | Skip Ideation and Planning; execute the locked topic contract. |
  | **Light** | The topic is bounded but needs a design decision or modest decomposition. | Run whichever optional stage the evidence requires, then execute. |
  | **Structured** | The topic is large, cross-cutting, architectural, high-risk, hard to reverse, or materially uncertain. | Normally run Ideation and Planning, then execute. |

- Require Ideation for design work and Planning for multi-unit work. A fix may skip Ideation when its root
  cause, outcome, scope, and before-and-after acceptance proof are already concrete.
- Lock the chosen path and topic contract in the conversation. When an optional stage will write artifacts,
  record each fully expanded worktree path, reuse the project's document hierarchy convention, and ask the
  user before inventing a hierarchy when no convention exists.
- If new user input changes the active topic, stop further writes, preserve the current state, revise the
  contract, and report the new route before continuing.

#### 2.2 Run optional Ideation

- Skip this step when Step 2.1 did not select Ideation. Otherwise load and apply
  [Ideation](../ideation/SKILL.md) inside the locked topic boundary.
- Create its normal durable `requirements.md`, `topics.md`, and `ideation.md` artifacts at the exact worktree
  paths in the topic contract. Let Ideation manage its temporary working files, but do not create an
  unapproved hierarchy or write outside the worktree.
- Complete Ideation's evidence study, user decisions, artifact creation, and self-review. Cowork overrides
  only evaluator timing: do not dispatch an independent evaluator or claim an independent Ideation verdict;
  defer that review to an explicit Cowork `evaluate` call in Phase 3.
- Verify the three durable artifacts, their agreement, and their tracked paths. Commit them as one focused
  prerequisite before Planning or Execution reads them.
- Treat the committed Ideation artifacts as the authoritative design inputs. Stop with exact recovery evidence
  if they remain incomplete, unverified, uncommitted, or materially disputed.

#### 2.3 Run optional Planning

- Skip this step when Step 2.1 did not select Planning. Otherwise load and apply
  [Planning](../planning/SKILL.md), using committed Ideation artifacts when present or the locked topic contract
  when Ideation was skipped.
- Create its normal durable `tasks.md` and `plan.md` artifacts at the exact worktree paths in the topic
  contract. Let Planning manage its temporary working files and keep every task within the accepted scope.
- Complete Planning's decomposition, ordering, artifact creation, and self-review. Do not dispatch an
  independent evaluator from this stage; defer independent review to an explicit Cowork `evaluate` call in
  Phase 3.
- Verify both durable artifacts, their coverage, their dependency-valid order, and their tracked paths. Commit
  them as one focused prerequisite before Execution reads them.
- Treat the committed Planning artifacts as the execution authority. Stop with exact recovery evidence if
  they remain incomplete, unverified, uncommitted, cyclic, or inconsistent with their inputs.

#### 2.4 Execute, verify, and commit the next unit

- Select the next dependency-ready unit from committed `plan.md`, or use the locked single-unit topic contract
  when Planning was skipped.
- Assign the unit to one accountable executor through the [Delegation contract](../delegation/SKILL.md).
  Include the complete input artifacts, exact scope, fully expanded worktree and write paths, required skills
  and mistake companions, acceptance checks, one commit boundary, and required return evidence.
- Keep one ordered writer chain. Require the executor to verify its root before editing, use
  `git -C <absolute-worktree>`, stage only owned paths, never use `git stash`, and run the complete
  [Execution operation](../execution/SKILL.md) through final-tree verification and one focused local commit.
- After the executor reports, reread the promised artifacts and commit, confirm the executor is finished and
  addressable, rerun the required checks, inspect the changed paths, and compare the main checkout with its
  recorded pre-session status.
- Reject a unit that is uncommitted, unverified, outside scope, on the wrong branch, inconsistent with its
  authoritative inputs, or not isolated from the main checkout. Diagnose and repair the cause through the same
  writer chain, then repeat this step.
- Never push, merge, publish, remove the worktree, delete a branch, or rewrite history from this step.

#### 2.5 Route the next loop action

- When another planned unit is dependency-ready, return to Step 2.4.
- When execution invalidates the design contract, return to Step 2.2, then rerun Step 2.3 when Planning applies
  before resuming Execution. When only the task decomposition or order is invalidated, return to Step 2.3.
- When evidence changes the selected stages or exposes a material user decision, return to Step 2.1 and report
  the revised path before another write.
- Complete the topic only after every selected stage and in-scope unit has verified focused commits, the exact
  final tree passes its checks, the worktree is clean, and no unauthorized change remains.
- Report the outcome, scope, durable artifact paths, commit hashes, verification commands and results,
  concerns, and user-kept exclusions. Mark commits after the last evaluated head as unevaluated.
- Wait for the next user topic, explicit `evaluate` call, or explicit `wrap up` call. A new topic returns to
  Step 2.1; do not start evaluation or closure automatically.

### Phase 3 — Evaluate on User Call

#### 3.1 Freeze one user-called review subject

- Enter this phase only when the user explicitly calls `evaluate`. Accept an optional named topic, commit, or
  commit range; otherwise include every session commit after the last completed evaluation subject, or every
  session commit after the base when no prior round is reliably known.
- Freeze the exact head, included commits and diff, topic contracts, selected stage artifacts, requirements,
  verification evidence, and worktree status before dispatch. Disclose any session commit outside a
  user-narrowed subject as unevaluated.
- Keep the frozen subject unchanged while evaluators work. If the tree or head changes, discard the round as
  stale and ask for a new explicit evaluation call.

#### 3.2 Run one independent dual-system round

- Give the same neutral frozen-subject contract to one fresh Claude evaluator and one fresh Codex evaluator.
  Each evaluator must be independent of the work and must not see the other report.
- Require both evaluators to apply the complete [Evaluation operation](../evaluation/SKILL.md). Each report
  must cover Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, and Overall, with the full
  finding ledger, checklist, evidence, and a `PASS`, `REVISE`, or `FAIL` verdict.
- Validate both reports before comparing them. If either system is unavailable or returns invalid output,
  pause and show the exact failure; continue without that named system only after the user explicitly waives
  it for this evaluation round.

#### 3.3 Aggregate and disposition the findings

- Reconcile the two valid reports without changing the frozen work. Use the more severe verdict in the order
  `FAIL` over `REVISE` over `PASS`, preserve every material finding, and explain any conflict.
- Present one decision-ready finding batch with recommended accept, reject, or defer dispositions. Never apply
  a finding until the user approves its disposition.
- Record the completed round, subject, aggregate verdict, and dispositions in the conversation only. Approved
  immediate corrections become new normal cowork topics and return to Phase 2.
- Do not evaluate a correction automatically. Any commit after the frozen head is unevaluated until another
  explicit `evaluate` call authorizes one new round.

### Phase 4 — Close on User Call

#### 4.1 Decide evaluation freshness

- Enter this phase only when the user explicitly calls `wrap up`. Compare the current head with the last
  completed evaluation subject.
- When no completed evaluation exists or later commits made it stale, use [Discussion](../discussion/SKILL.md)
  to ask whether to run one evaluation round or close with self-verification only. State the exact unevaluated
  commits and recommend evaluation when their risk or breadth justifies it.
- If the user chooses evaluation, treat that choice as one `evaluate` call, complete Phase 3, then repeat this
  freshness step. If approved corrections change the head, every additional round requires another user
  choice.
- If the user chooses self-verification only, record that evaluation was declined for the named head. Do not
  imply an independent verdict.

#### 4.2 Verify and hand off the retained local result

- Require a clean worktree, focused local commits for all in-scope work, current self-verification, and an
  unchanged main checkout relative to the recorded pre-session status. Return to the owning Phase 2 step,
  including Step 2.2 or 2.3 for a stage artifact and Step 2.4 for an execution unit, or stop with exact recovery
  evidence when a condition cannot be repaired safely.
- Provide a conversation-only handoff containing the outcome and scope, durable artifact paths, commits,
  verification, evaluation coverage and verdict, approved, rejected, and deferred findings, unresolved work,
  risks, base, branch, worktree, head, status, and the first recovery command.
- Retain the branch and worktree by default. Do not run full Workflow Wrap-up, RECORD, memory promotion,
  publication, merge, cleanup, branch deletion, or worktree removal.
- Treat a separate user request for publication, merge, or cleanup as a new Git operation with its own current
  evidence and authority gates. Cowork is complete when the verified local history and its retained recovery
  path are reproducible.

## References
