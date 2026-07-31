---
name: cowork
description: "Use for user-led, stepwise implementation in one isolated worktree, with scaled inline shaping and user-called evaluation."
allowed-tools: Read, Grep, Glob, Bash, Agent, Task, AskUserQuestion
skill-type: operation
---

# Cowork

Cowork is an operation for fast, user-led implementation after cowork mode has already been selected. It
turns each user topic into a verified sequence of focused local commits and then returns control to the user.

The operating agent scales inline shaping to the topic, keeps one isolated worktree and ordered writer chain,
and performs independent evaluation or closure only when the user calls for it.

## Principles

### Keep the user in control at topic boundaries

The user supplies each topic and owns every material scope, design, risk, and external-action decision. The
agent keeps the topic concrete, returns its evidence, and waits for the user's next direction.

### Match shaping depth to the evidence and risk

Fast work still needs enough thought to be safe and correct. Use the smallest shaping depth that resolves the
topic's breadth, uncertainty, reversibility, dependencies, and material choices.

### Keep one isolated local history

One linked worktree and one ordered writer chain make every incremental result inspectable and recoverable.
Each executable unit ends in a focused verified commit before dependent work begins.

### Separate self-verification from independent evaluation

Every implementation unit must prove its own result. Independent dual-system evaluation is a separate
user-called judgment and never substitutes for implementation verification.

## Rules

- **MUST bind cowork to one verified isolated worktree before the first tracked edit.** Use its fully expanded
  absolute path for every write and preserve the main checkout.
- **MUST let the agent select and report Direct, Light, or Structured shaping while the user owns every material
  decision.** Every depth remains cowork and uses inline conversation rather than standalone Ideation or
  Planning artifacts.
- **MUST keep one ordered writer and create a focused local commit for each executable unit.** Do not start a
  dependent unit while its prerequisite is uncommitted or unverified.
- **MUST self-verify the exact final tree for every unit and run independent evaluation only after an explicit
  `evaluate` call.** One call authorizes one fresh dual-system review round.
- **NEVER create Workflow manifests, router state, workflow records, typed staging, RECORD artifacts, or full
  Workflow Wrap-up output.** Git history and the retained worktree are cowork's only durable session state.
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

### Phase 2 — Shape One User Topic

#### 2.1 Understand the topic from evidence

- Read the user topic, current tree, closest project documents and patterns, relevant history, current behavior,
  applicable mistakes, and the reach of the proposed change before asking questions.
- Make the intended outcome, reason, affected actors, included and excluded work, unchanged behavior, success
  criteria, risks, and first action concrete. Ask only about material information that inspection cannot
  settle.
- Preserve accepted scope and direction. Use [Discussion](../discussion/SKILL.md) for every material scope,
  design, destructive, compatibility, migration, security, or external-service decision.

#### 2.2 Select and report the shaping depth

- Select the smallest depth that safely resolves the inspected topic. State the selected depth and the evidence
  that justifies it; do not ask the user to choose a depth label.

  | Depth | Select when | Required shaping |
  | --- | --- | --- |
  | **Direct** | The outcome is clear, local, reversible, low-risk, and has no unresolved material choice. | Clarify only missing What, Why, and success criteria. Record one concise inline contract and let the executor decompose the bounded unit internally. |
  | **Light** | The topic is bounded but spans several surfaces, contains a meaningful choice, or needs several ordered units. | Inspect relevant project patterns, resolve the material choice with the user, and state a short inline sequence with success criteria. |
  | **Structured** | The topic is large, cross-cutting, architectural, high-risk, hard to reverse, or has an uncertain cause. | Discuss the problem, scope, prior art, options, recovery, dependencies, and verification, then state an explicit ordered implementation plan in the conversation. |

- For a fix, reproduce or otherwise prove the failure, trace the root cause, and define the before-and-after
  check before editing.
- For design work, inspect current behavior and relevant prior art, present two or three meaningful options, and
  obtain the user's direction before implementation. Design work uses at least Light depth.
- For creation or change work, inspect the closest project patterns and scale depth by breadth, dependencies,
  risk, reversibility, and unresolved choices.
- Use Structured depth for security-sensitive, destructive, externally visible, migration, and compatibility
  work. Keep every normal user authority gate.

#### 2.3 Lock the next executable units

- Record the topic contract and its success checks in the conversation. For Light and Structured topics, split
  work only at real dependency, ownership, verification, or review boundaries and order the units from
  foundation to integration.
- Resolve every material open decision with the user before its affected unit starts. If new user input changes
  an active contract, stop further writes, preserve the current state, and revise the contract before
  continuing.
- Stay in cowork at every depth. Do not invoke the standalone Ideation or Planning operations, create their
  artifacts, or switch to the full Workflow because a topic became Structured.

### Phase 3 — Implement and Close the Topic

#### 3.1 Assign one ordered execution unit

- Assign the next dependency-ready unit to one accountable executor. Direct topics normally have one unit;
  larger topics may have several sequential units and focused commits.
- Write the assignment through the [Delegation contract](../delegation/SKILL.md). Include the complete topic
  context, exact in-scope and out-of-scope boundaries, required skills and mistake companions, acceptance
  checks, one commit boundary, and the required return evidence.
- Give the executor the fully expanded absolute worktree and write paths. Require it to verify the root before
  editing, use `git -C <absolute-worktree>`, stage only owned paths, and never use `git stash` or write outside
  the worktree.
- Keep one ordered writer chain. Permit concurrent agents only for independent read-only study that cannot
  change scope, state, user decisions, or execution order.

#### 3.2 Execute, verify, and accept the unit

- Have the executor run the complete [Execution operation](../execution/SKILL.md): study the task, establish
  the skeleton or foundation, implement bottom-up, clean the result, verify the final tree, repair root causes,
  inspect the staged diff, and create one focused local commit with provenance.
- If implementation exposes a material user decision, unsafe state, scope conflict, or required path outside
  the contract, stop the unit and return to Phase 2. Preserve the worktree and show the exact blocker rather
  than guessing or widening scope.
- After the executor reports, reread the promised artifacts and commit, confirm the executor is finished and
  addressable, rerun the required verification, inspect the changed paths, and compare the main checkout with
  its recorded pre-session status.
- Reject a unit that is uncommitted, unverified, outside scope, on the wrong branch, or not isolated from the
  main checkout. Diagnose the cause, repair it through the same ordered writer chain, and repeat this step.
- When the unit passes, continue with the next dependency-ready unit. Never push, merge, publish, remove the
  worktree, delete a branch, or rewrite history from this phase.

#### 3.3 Return the completed topic

- Close the topic only when every in-scope unit is committed, the exact final tree passes its checks, the
  worktree is clean, and no unauthorized change remains.
- Report the outcome, scope, commit hashes, verification commands and results, concerns, and any work the user
  kept outside the topic. Mark commits after the last evaluated head as unevaluated.
- Wait for the user's next topic, explicit `evaluate` call, or explicit `wrap up` call. Do not start evaluation
  or cowork closure automatically.

### Phase 4 — Evaluate on User Call

#### 4.1 Freeze one user-called review subject

- Enter this phase only when the user explicitly calls `evaluate`. Accept an optional named topic, commit, or
  commit range; otherwise include every session commit after the last completed evaluation subject, or every
  session commit after the base when no prior round is reliably known.
- Freeze the exact head, included commits and diff, topic contracts, requirements, verification evidence, and
  worktree status before dispatch. Disclose any session commit outside a user-narrowed subject as unevaluated.
- Keep the frozen subject unchanged while evaluators work. If the tree or head changes, discard the round as
  stale and ask for a new explicit evaluation call.

#### 4.2 Run one independent dual-system round

- Give the same neutral frozen-subject contract to one fresh Claude evaluator and one fresh Codex evaluator.
  Each evaluator must be independent of the work and must not see the other report.
- Require both evaluators to apply the complete [Evaluation operation](../evaluation/SKILL.md). Each report
  must cover Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, and Overall, with the full
  finding ledger, checklist, evidence, and a `PASS`, `REVISE`, or `FAIL` verdict.
- Validate both reports before comparing them. If either system is unavailable or returns invalid output,
  pause and show the exact failure; continue without that named system only after the user explicitly waives
  it for this evaluation round.

#### 4.3 Aggregate and disposition the findings

- Reconcile the two valid reports without changing the frozen work. Use the more severe verdict in the order
  `FAIL` over `REVISE` over `PASS`, preserve every material finding, and explain any conflict.
- Present one decision-ready finding batch with recommended accept, reject, or defer dispositions. Never apply
  a finding until the user approves its disposition.
- Record the completed round, subject, aggregate verdict, and dispositions in the conversation only. Approved
  immediate corrections become new normal cowork topics and return to Phase 2.
- Do not evaluate a correction automatically. Any commit after the frozen head is unevaluated until another
  explicit `evaluate` call authorizes one new round.

### Phase 5 — Close on User Call

#### 5.1 Decide evaluation freshness

- Enter this phase only when the user explicitly calls `wrap up`. Compare the current head with the last
  completed evaluation subject.
- When no completed evaluation exists or later commits made it stale, use [Discussion](../discussion/SKILL.md)
  to ask whether to run one evaluation round or close with self-verification only. State the exact unevaluated
  commits and recommend evaluation when their risk or breadth justifies it.
- If the user chooses evaluation, treat that choice as one `evaluate` call, complete Phase 4, then repeat this
  freshness step. If approved corrections change the head, every additional round requires another user
  choice.
- If the user chooses self-verification only, record that evaluation was declined for the named head. Do not
  imply an independent verdict.

#### 5.2 Verify and hand off the retained local result

- Require a clean worktree, focused local commits for all in-scope work, current self-verification, and an
  unchanged main checkout relative to the recorded pre-session status. Return to Phase 3 or stop with exact
  recovery evidence when any condition is not met.
- Provide a conversation-only handoff containing the outcome and scope, commits, verification, evaluation
  coverage and verdict, approved, rejected, and deferred findings, unresolved work, risks, base, branch,
  worktree, head, status, and the first recovery command.
- Retain the branch and worktree by default. Do not run full Workflow Wrap-up, RECORD, memory promotion,
  publication, merge, cleanup, branch deletion, or worktree removal.
- Treat a separate user request for publication, merge, or cleanup as a new Git operation with its own current
  evidence and authority gates. Cowork is complete when the verified local history and its retained recovery
  path are reproducible.

## References
