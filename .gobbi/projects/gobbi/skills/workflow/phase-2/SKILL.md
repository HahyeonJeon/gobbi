---
name: phase-2
description: "MUST load when Workflow enters Phase 2. Phase 2 is an operation skill for turning the locked Ideation contract into an ordered plan, executing every task in one writer chain, and handing verified work to Wrap-up."
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, AskUserQuestion, TaskCreate, TaskGet, TaskUpdate, TaskList
skill-type: operation
user-invocable: false
---

# Workflow Phase 2

The manager loads this child skill after the parent [Workflow](../SKILL.md) operation activates
`P2 · Planning · DISCUSSION · 1/2`, or when recovery selects an unfinished Phase 2 item. Entry requires a
verified Phase 1 Hand-off and the locked Ideation contract.

Phase 2 produces a dependency-valid plan and completes every planned task through one ordered writer chain.
It completes when Planning and every Execution task have verified PASS evidence and the Phase 3 Wrap-up TODO
is active.

This child owns Phase 2 actions, decisions, evidence, revisions, recovery, and completion checks. It applies
the parent's shared route, evidence, gate, and Hand-off contracts and never reopens Phase 1 or a completed
Planning item.

## Principles

### Continue through routine in-contract decisions

Agents resolve ordinary Planning and Execution choices from evidence and continue immediately without routine
user questions or deliberate idle.

### Preserve one ordered writer chain

Only one authorized writer mutates the worktree, workflow evidence, TODO route, Git state, or an external
system at a time.

### Amend pending work without rewriting history

An in-contract plan defect changes only pending work or adds a compensating task; it never erases a completed
plan, task, receipt, or commit.

## Rules

- **MUST enter through the parent Workflow route with a verified Phase 1 Hand-off and exactly one unfinished
  Phase 2 item in progress.** Return to recovery when the native TODO, plan evidence, commits, branch, or
  worktree disagree.

- **MUST use each canonical `task-NN-slug` in the TODO title, delegation, WORK package, validator command,
  RECORD receipt, and commit evidence.** Do not create an alternate task identity for a revision or recovery
  pass.

- **MUST apply the parent fast gate to Planning and the parent normal more-severe gate to every Execution
  task.** Preserve both evaluator verdicts and never convert a normal non-PASS decision to PASS because its
  correction is inconvenient or its cap is near.

- **MUST continue immediately after every verified nonterminal stage, task PASS, and Phase 2 Hand-off.** Waiting
  is valid only while an assigned agent, required system, or tool is actively running.

- **NEVER reopen Planning, consume another Planning iteration, or mutate the canonical plan artifact for an
  in-contract plan defect found during Execution.** Preserve completed commits and amend only the pending route
  or add a compensating pending task.

- **NEVER ask the user about a routine in-contract choice or nonblocking finding.** Escalate only through the
  parent critical-blocker boundary after safe agent-to-agent recovery is exhausted.

## Procedure

### Phase 1 — Plan the locked outcome

#### 1.1 Enter and operate continuously

- Confirm the parent [Workflow](../SKILL.md) operation is loaded, the Phase 1 Hand-off validates, and
  `P2 · Planning · DISCUSSION · 1/2` is the only active TODO on first entry.
- Read the canonical Ideation artifact, settings, accepted decisions and findings, repository and worktree
  preimages, authority, required skills, dependencies, writer boundary, and prior recovery evidence.
- Load the [Planning](../../planning/SKILL.md) skill before Planning DISCUSSION.
- After every returned artifact, verify it directly, retitle or complete the active item, activate the next
  item, and dispatch or perform the next bounded action immediately.
- Treat a progress message or Hand-off as evidence to inspect, never as a pause request. Stop only for missing
  safety or authority, an unavailable required system without waiver, or an extremely material change outside
  the locked Ideation contract.

#### 1.2 Lock the Planning discussion contract

- Give the leader the Ideation contract, Phase 1 evidence, settings, decisions, accepted findings, repository
  and worktree preimages, relevant memory, required skills, external-write authority, dependencies, and
  Planning iteration.
- Use the exact assignment shape in [delegation.md](../delegation.md).
- Resolve agent-to-agent:
  - the complete task hierarchy;
  - stable `task-NN-slug` identities;
  - foundation-before-dependent order;
  - one accountable role and output for every task;
  - required skill loads;
  - read-only parallel lanes and the one-writer order;
  - verification and focused-commit requirements; and
  - coverage of every Ideation obligation.
- Use bounded study for unknown facts. Never invent new scope or turn a routine implementation choice into a
  user question.
- Freeze the neutral Planning contract and retitle the active TODO to WORK only after the hierarchy,
  dependencies, scope, acceptance, and authority are explicit.

#### 1.3 Produce and validate the plan

- Give independent Claude and Codex leaders the same frozen Planning contract and immutable evidence.
- Freeze and verify both system-labeled proposals before reciprocal review. Dispatch each cross-review as a
  later, separate operation and freeze both reviews.
- Let the active runtime leader synthesize the canonical candidate with:
  - a complete hierarchy and dependency-valid order;
  - stable task IDs;
  - exact write and read-only lanes;
  - required skills and roles;
  - scope boundaries; and
  - acceptance and verification for every task.
- Render the complete WORK package at the parent-owned Planning path and run the exact parent Workflow Step
  1.2 validator command for `--step planning`.
- Reread the canonical candidate and verify every Ideation obligation appears exactly once before activating
  EVALUATION.

#### 1.4 Evaluate, record, and expand the task route

- Load the [Evaluation](../../evaluation/SKILL.md) skill and dispatch one fresh Claude evaluator and one fresh
  Codex evaluator. Neither sees the other report.
- Preserve both declared verdicts and apply the parent Planning fast gate and two-iteration cap.
- Load the [Record](../../record/SKILL.md) skill under the parent Workflow Step 1.2 evidence-only override.
- Seal the creation package, reports, `gate.md`, checks, canonical output, findings, and staging in
  `record/iteration-N.md`.
- On iteration-1 REVISE, create Planning iteration 2 at DISCUSSION and continue immediately. On iteration-2
  FAIL, preserve the recoverable state and stop at the critical-blocker boundary without creating iteration 3.
- On PASS, verify stable IDs, dependency order, scope coverage, and the absence of overlapping write-capable
  tasks. Freeze the canonical plan.
- Replace the pending `unplanned` placeholder with the first plan task and add the remaining task items in plan
  order. Start each item as:

```text
P2 · Execution · task-NN-slug · DISCUSSION · 1/<configured-max>
```

- Complete Planning at PASS and activate only the first Execution task.

### Phase 2 — Execute the ordered task route

#### 2.1 Start one task iteration

- Select the first unproved task in plan order and confirm all of its prerequisites have verified PASS
  evidence.
- Load the [Execution](../../execution/SKILL.md) skill before task DISCUSSION and WORK.
- Give the executor the stable task ID, canonical plan entry, absolute worktree, current preimage, allowed and
  protected paths, upstream artifacts, required skills, acceptance, checks, commit authority, and accepted
  findings.
- Keep later tasks pending. Only one task iteration may be active, and only one writer may hold mutation
  authority.

#### 2.2 Lock the task discussion contract

- Let agents resolve ordinary implementation detail through evidence and peer discussion without changing the
  locked scope or user authority.
- Freeze the exact task contract, path boundary, prerequisites, expected artifacts, verification, and focused
  commit before WORK.
- When the plan is correct, retitle the task item to WORK and continue to Step 2.4.
- When Execution exposes an in-contract plan defect, stay in the current task's DISCUSSION and continue to
  Step 2.3.

#### 2.3 Amend an in-contract plan defect

- Write a numbered plan amendment that records the defect, cause, affected pending tasks, revised order or
  contracts, and verification.
- Preserve the completed Planning item, canonical plan artifact, completed task receipts, and completed task
  commits.
- Retitle or reorder only pending Execution items. Add a compensating pending task when an in-contract change
  must alter a completed result.
- Stop at the parent critical-blocker boundary when safe compensation is impossible or the required change
  exceeds the locked Ideation contract.
- Verify the amended pending route, return to Step 2.2, and freeze the current task contract. The amendment
  never consumes another Planning iteration.

#### 2.4 Produce, implement, verify, and commit

- Give one Claude contributor and one Codex contributor the same task contract and frozen worktree preimage.
- Freeze and verify both independent proposals. Run reciprocal cross-review only after both proposals freeze,
  then freeze both reviews.
- Give the active runtime executor all four frozen inputs. Let that executor synthesize and implement as the
  sole worktree writer.
- Keep peer processes and read-only helpers from mutating the worktree, TODO route, external systems, scope, or
  user decisions.
- Run the task's required verification and review the complete diff against allowed and protected paths.
- Create one focused local task commit. Reread the commit, diff, checks, and complete creation package before
  activating EVALUATION.

#### 2.5 Evaluate the task with the normal gate

- Load the [Evaluation](../../evaluation/SKILL.md) skill and dispatch two fresh independent evaluators.
- Give both evaluators the task and scope contract, frozen drafts and cross-reviews, resolved decisions,
  implementation diff, tests, focused commit, repository state, and findings relevant to the current pass.
- Require complete Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, and Overall coverage
  and the parent-owned finding fields.
- Preserve both declared verdicts and write normal-mode `gate.md`. Derive the workflow decision by severity:
  FAIL outranks REVISE, which outranks PASS.
- Retitle the task item to RECORD only after both reports and the normal gate validate.

#### 2.6 Record and route the task result

- Load the [Record](../../record/SKILL.md) skill under the parent Workflow Step 1.2 evidence-only override.
- Seal both evaluation reports, `gate.md`, findings, dispositions, committed diff, verification, artifact
  pointers, and system provenances.
- Verify only authorized paths changed, the focused commit exists in the exact worktree, and the required
  checks describe the committed tree.
- Write `record/iteration-N.md` with the exact TODO, package and report hashes, gate hash, checks, commit,
  output, and staging. Reread the receipt before changing the TODO.
- On PASS, retitle and complete the task item and activate the next planned task immediately.
- On REVISE below the configured cap, complete the recorded pass, create the next iteration at DISCUSSION, and
  continue immediately.
- On FAIL or an exhausted cap, preserve the route, evidence, branch, worktree, and recovery choices. Try every
  safe in-contract recovery before stopping at the critical-blocker boundary.

#### 2.7 Recover a failed system or specialist

- Preserve the last valid evidence and identify the exact failed system, assignment, operation, and check.
- Retry only the failed bounded operation when safe. Replace a stale or unaddressable specialist with a fully
  primed fresh specialist.
- Continue only after the missing output validates. Use a single-system waiver only when existing authority
  names the system, productive step, and iteration.
- Treat an unavailable required system without that waiver as a critical blocker. Never replay a possibly
  side-effecting operation without first proving whether its effect occurred.

### Phase 3 — Hand off to Wrap-up

#### 3.1 Verify Workflow Phase 2 completion

- Verify the canonical plan, every planned task ID, every task PASS gate and RECORD receipt, focused commits,
  required checks, plan amendments, accepted findings, branch, worktree, and the active `P2 · Hand-off` item.
- Confirm no planned obligation remains pending, no two commits claim the same task pass, and no unverified
  result is reported as complete.
- Return to the earliest responsible Planning or Execution step when any check fails, without reopening a
  completed Planning item.

#### 3.2 Render the checkpoint and continue

- Fill the parent-owned Hand-off template exactly:

```text
Phase: Phase 2
Outcome: <planned and executed outcome>
Completed: <Planning and stable task IDs>
Evidence: <plan, task commits, tests, and evaluations>
Decisions: <autonomous in-contract decisions and material authorities>
Accepted nonblocking findings: <findings or none>
Branch: <exact branch>
Worktree: <absolute worktree>
Next TODO: P3 · Wrap-up · DISCUSSION · 1/2
Continuation: automatic unless the user interrupts for clear or compact
```

- Reread the Hand-off and verify each field against direct evidence.
- Complete `P2 · Hand-off`, activate `P3 · Wrap-up · DISCUSSION · 1/2`, display the checkpoint, and continue
  into Phase 3 in the same turn without asking whether to proceed.

## References
