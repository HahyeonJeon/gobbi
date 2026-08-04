---
name: phase-2
description: "MUST load when Workflow enters Phase 2. Turns the locked Ideation contract into an ordered plan, executes every task through one writer chain, and hands verified work to Wrap-up."
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, AskUserQuestion, TaskCreate, TaskGet, TaskUpdate, TaskList
skill-type: operation
user-invocable: false
---

# Workflow Phase 2

The manager loads this child only after the parent [Workflow](../SKILL.md) activates
`P2 · Planning · DISCUSSION · 1/2`, or when recovery selects an unfinished Phase 2 item. Entry requires the
verified Phase 1 Hand-off and locked Ideation contract. The parent remains loaded and owns all shared Workflow
contracts.

Phase 2 produces a dependency-valid plan, executes every task through one ordered writer chain, and proves the
complete result ready for Wrap-up.

## Principles

### Continue through routine in-contract decisions

Agents resolve ordinary Planning and Execution choices from evidence without routine user questions.

### Preserve one ordered writer chain

Only one authorized writer may mutate the worktree, evidence, TODOs, Git, or external systems at a time.

### Amend pending work without rewriting history

An in-contract plan defect changes pending work or adds a compensating task. It never erases a completed plan,
receipt, task, or commit.

## Rules

- **MUST enter through the parent route with the verified Phase 1 Hand-off and exactly one Phase 2 item
  active.** Return to recovery when TODO, plan, commits, branch, worktree, or evidence disagree.
- **MUST use each canonical `task-NN-slug` in TODO, delegation, package, receipt, and commit evidence.** A
  revision or recovery pass never creates a second identity.
- **MUST apply the parent's [shared productive-step cycle](../SKILL.md#14-apply-the-shared-productive-step-cycle),
  fast gate to Planning, and normal gate to Execution.** Apply Gobbi's finding gate through the parent; only
  PASS continues.
- **MUST continue after every verified nonterminal stage, task PASS, and checkpoint.** Waiting is valid only
  while an assigned agent, required system, or tool is running.
- **MUST preserve completed Planning and task history when Execution exposes an in-contract plan defect.**
  Amend only pending route or add a compensating task.
- **NEVER replay a possibly side-effecting operation until its prior effect is proved absent or safely
  reusable.** Preserve exact recovery evidence on ambiguity.

## Procedure

### Phase 1 — Plan the locked outcome

#### 1.1 Enter and freeze the Planning contract

- Confirm the parent and its owner-skill register, Phase 1 Hand-off, active Planning TODO, canonical Ideation
  output, settings, decisions, accepted findings, repository/worktree preimages, authority, skills, dependencies,
  writer boundary, and recovery evidence.
- Load [Planning](../../planning/SKILL.md). Build the leader brief through
  [Delegation](../../delegation/SKILL.md) and
  [parent Step 1.3](../SKILL.md#13-build-and-accept-specialist-assignments).
- Give Planning the complete Ideation contract and require: a fine-grained hierarchy with exact leaf coverage;
  context-coherent groups with stable `task-NN-slug` IDs; each leaf's path, title, work, boundary, and output;
  combination reason and outcome; accepted design and repository context; dependencies, roles, skills, inputs,
  constraints, writer boundaries, handoffs, verification, and coverage of every Ideation obligation.
- Workflow retains TODO expansion, evaluation, RECORD, scheduling, and commit provenance. Freeze the Planning
  contract only after hierarchy, dependencies, scope, acceptance, and authority are explicit.

#### 1.2 Run the Planning cycle and expand the route

- Invoke [parent Step 1.4](../SKILL.md#14-apply-the-shared-productive-step-cycle) with local role `leader`; the locked Ideation contract and project preimage as subject;
  `2-planning/outputs/{tasks.md,plan.md}` as outputs; fast gate; cap `2`; and Planning's six closure invariants as
  unique checks.
- Require the local leader to synthesize complete independently readable candidates. Before EVALUATION, verify
  every Ideation obligation appears in the hierarchy, every leaf maps to exactly one nonempty task group, IDs
  are stable, dependencies are acyclic, roles and contexts are complete, and write-capable groups do not overlap.
- Run every RECORD pass. On first-pass REVISE, return to DISCUSSION. On second-pass FAIL, preserve recovery state
  and stop at the parent critical-blocker boundary. Never create iteration 3.
- On PASS, freeze both ignored outputs without a second contract layer and prove the tracked tree unchanged.
  Replace the pending `unplanned` placeholder with the first task and add the rest in plan order as:

```text
P2 · Execution · task-NN-slug · DISCUSSION · 1/<configured-max>
```

- Complete Planning at PASS and activate only the first task.

### Phase 2 — Execute the ordered task route

#### 2.1 Freeze one dependency-ready task

- Select the first unproved task in plan order and require verified PASS for every prerequisite. Keep later
  tasks pending and one writer authorized.
- Load [Execution](../../execution/SKILL.md). Give the executor the stable task entry, absolute worktree,
  current preimage, allowed/protected paths, upstream artifacts, skills, acceptance, checks, commit authority,
  and accepted findings through a
  [parent Step 1.3](../SKILL.md#13-build-and-accept-specialist-assignments) brief.
- Resolve routine implementation detail without changing scope or user authority. Freeze exact paths,
  prerequisites, outputs, verification, side-effect boundary, and focused commit contract before WORK.

#### 2.2 Amend an in-contract plan defect

- If the plan is correct, continue to Step 2.3. Otherwise stay in the current task's DISCUSSION and write a
  numbered amendment with defect, cause, affected pending tasks, revised order/contracts, and verification.
- Preserve completed Planning, canonical plan, receipts, tasks, and commits. Retitle or reorder only pending
  items. Add a compensating pending task when a completed result needs an in-contract change.
- Stop at the parent critical-blocker boundary when compensation is unsafe or the change exceeds the locked
  Ideation contract. Otherwise verify the amended route and refreeze the current task; an amendment consumes no
  Planning iteration.

#### 2.3 Produce, implement, verify, and commit

- Invoke the parent WORK stage with local role `executor`, the frozen task contract and worktree preimage, the
  planned tracked outputs, and task verification. The assigned executor synthesizes and implements as sole
  writer; all helpers remain read-only.
- Run required checks, inspect the complete diff against allowed/protected paths, and create one focused local
  task commit through [Git](../../git/SKILL.md). Reread commit, diff, checks, and creation package before
  EVALUATION.

#### 2.4 Evaluate, record, and route the task

- Complete parent EVALUATION and RECORD with the normal gate and configured cap. The frozen subject includes
  task/scope contract, creation package, decisions, diff, tests, focused commit, repository state, and current
  findings. Enabled routes the external evaluator through
  [Partner](../../gobbi/partner/SKILL.md); disabled invokes no external runtime.
- Verify only authorized paths changed, the focused commit exists in the exact worktree, and checks describe
  the committed tree. Seal package, reports, gate, findings, dispositions, commit, verification, output pointers,
  and provenances in the parent receipt schema.
- On PASS, complete the task and activate the next. On REVISE below cap, create the next iteration at
  DISCUSSION. On FAIL or cap exhaustion, try every safe in-contract recovery, then preserve route, evidence,
  branch, worktree, and choices at the critical-blocker boundary.
- Apply parent Step 1.5 to a failed partner run or specialist. Before any side-effecting retry, prove whether the
  prior effect occurred; reuse proved effects idempotently or stop.

### Phase 3 — Hand off to Wrap-up

#### 3.1 Verify Phase 2 completion

- Verify canonical plan, every task ID, PASS gate and receipt, focused commit, check, amendment, accepted
  finding, branch, worktree, and active `P2 · Hand-off`. Require no pending obligation, no duplicate task-pass
  commit, and no unsupported completion claim. Return to the earliest responsible Planning or Execution step
  without reopening completed Planning.

#### 3.2 Render and continue

- Apply parent Step 1.6 with Phase `Phase 2`; completed Planning and stable task IDs; plan, commits, tests, and
  evaluations; autonomous in-contract decisions and material authorities; and
  `Next TODO: P3 · Wrap-up · DISCUSSION · 1/2`.
- Reread every field, complete `P2 · Hand-off`, activate the next TODO, display the checkpoint, and continue in
  the same turn unless the user interrupts for clear or compact.

## References

- [Parent Workflow](../SKILL.md) owns shared Workflow contracts and transitions.
- [Planning](../../planning/SKILL.md) owns hierarchy and execution-plan construction.
- [Execution](../../execution/SKILL.md) and [Git](../../git/SKILL.md) own implementation and focused commits.
