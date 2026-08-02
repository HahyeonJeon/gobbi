---
name: phase-1
description: "MUST load when Workflow enters Phase 1. Phase 1 is an operation skill for configuring or recovering one isolated session, locking the user's intent through Ideation, and handing a verified contract to Planning."
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, AskUserQuestion, TaskCreate, TaskGet, TaskUpdate, TaskList
skill-type: operation
user-invocable: false
---

# Workflow Phase 1

The manager loads this child skill after the parent [Workflow](../SKILL.md) operation activates
`P1 · Configuration`, or when recovery selects an unfinished Phase 1 item. The parent must already be loaded;
it owns the native TODO grammar, shared evidence contract, gate definitions, and transition authority.

Phase 1 creates or recovers one isolated session, resolves settings, and locks What, Why, How, scope, success,
and authority with the user. It completes when verified Ideation evidence supports the Phase 1 Hand-off and
the Phase 2 Planning TODO is active.

This child owns Phase 1 actions, decisions, evidence, failure recovery, and completion checks. It does not own
another phase, alter the parent route contract, or let a receipt replace the native TODO as progression
authority.

## Principles

### Establish durable identity before dependent work

Create and verify the session identity, branch, worktree, settings, and evidence root before Ideation produces
durable work.

### Lock direction with the user

Phase 1 resolves material direction with the user so Phase 2 and Phase 3 can make routine in-contract decisions
without asking again.

### Recover from the earliest unproved item

When runtime state and durable evidence disagree, preserve verified work and resume from the earliest safe item
whose completion cannot be proved.

## Rules

- **MUST enter through the parent Workflow route with `P1 · Configuration` or one unfinished Phase 1 item in
  progress.** Stop when the native TODO, prior Hand-off, branch, worktree, or evidence root cannot be reconciled
  safely.

- **MUST load the Git skill before creating or verifying the session branch and worktree.** Generate the Gobbi
  session UUID before deriving either Git identity.

- **MUST resolve every material Ideation unknown with the user or assign it an explicit owner before freezing
  the neutral contract.** Phase 1 cannot pass on an inferred material scope, authority, or success condition.

- **MUST apply the parent fast gate and its two-iteration cap to Ideation.** Preserve evaluator verdicts as
  evidence and let only the workflow gate decide the TODO transition.

- **NEVER expose either independent draft before the manager verifies that both draft round trips have
  frozen.** Reciprocal review begins only in later, separate operations.

- **NEVER let a Configuration receipt, runtime identity, specialist report, or plausible summary become a
  second progression authority.** The native TODO remains the only live route.

## Procedure

### Phase 1 — Establish the session

#### 1.1 Enter Workflow Phase 1

- Confirm the parent [Workflow](../SKILL.md) operation is loaded and its `P1 · Configuration` item is the only
  active TODO for a fresh session.
- Read the repository, branch, registered worktrees, current runtime TODO list, existing workflow evidence,
  and any explicit recovery identity without mutation.
- Load the [Git](../../git/SKILL.md) skill before any branch or worktree action.
- Treat the user's locked Configuration choices and protected user work as trusted boundaries. Stop before
  mutation when either cannot be preserved.
- Classify the session as fresh only when no verified session identity exists. Otherwise continue to Step 1.3
  and recover the existing session.

#### 1.2 Configure a fresh session

- Resolve settings with the user, including the Execution iteration cap, role selections, required-system
  availability, narrow waiver authority, and configured Git finalization. Reuse parent defaults where the user
  accepts them.
- Run the parent Workflow Step 1.2 bootstrap preflight before the base is captured. When the posture requires
  it, the one user-approved bootstrap commit is the verified base; when it does not, the base is the current
  clean head.
- Generate the Gobbi session UUID before deriving the branch or worktree. Create exactly one isolated branch
  and worktree from that verified base through the Git skill.
- Verify the absolute worktree, branch, base revision, clean initial state, registration, and the ignore
  posture [Git](../../git/SKILL.md) Step 2.1 defines, before writing workflow evidence.
- Create the parent-owned evidence root and write `configuration.md` with the UUID, resolved settings,
  repository, base revision, branch, absolute worktree, runtime system, and creation checks.
- Verify the initial TODO route, evidence directories, and Configuration receipt against the parent Workflow
  Step 1.2 contract.
- Treat the receipt as lifecycle evidence only. No runtime identity may replace the Gobbi session UUID, and no
  receipt may select the next action.
- Reread `configuration.md`, verify every recorded value directly, complete `P1 · Configuration`, and activate
  `P1 · Ideation · DISCUSSION · 1/2`.

#### 1.3 Recover an existing session

- Verify the exact session UUID, repository, branch, worktree registration, absolute worktree, resolved
  settings, `configuration.md`, and latest verified Hand-off before changing a TODO.
- Reuse the resolved settings unless the user explicitly changes them during Phase 1. Never create a second
  branch, worktree, or evidence root for the same session identity.
- Walk Configuration, Ideation WORK packages, evaluation gates, RECORD receipts, and the Phase 1 Hand-off in
  workflow order.
- Recreate completed TODO items only from the strongest verified evidence. Keep later work pending and
  activate the first item whose completion is not proved.
- When evidence conflicts, choose the earlier safe item and re-verify it. Stop for the user only when safe
  recovery would change the session contract, require missing authority, or risk protected work.
- Continue at the active Phase 1 stage after the native TODO, durable evidence, branch, and worktree agree.

### Phase 2 — Run Ideation

#### 2.1 Lock the Ideation discussion contract

- Load the [Ideation](../../ideation/SKILL.md) skill and give the leader the user's request, prior decisions,
  applicable project rules, durable memory, repository evidence, prior art, constraints, risks, and recovery
  needs.
- Build the brief through the [Delegation](../../delegation/SKILL.md) skill and add the parent Workflow Step
  1.3 fields. Include the phase, TODO, stage, iteration, scope, expected artifact, authority, and accepted
  findings.
- Resolve with the user:
  - the root problem and affected people;
  - What will change and what will not;
  - Why the outcome matters;
  - How the approach works;
  - success and failure conditions;
  - material assumptions and alternatives;
  - safety, external, publication, merge, and destructive-action authority; and
  - explicit deferrals.
- Freeze one neutral contract only after every material unknown has a decision or named owner. Retitle the
  active TODO to WORK only after rereading that contract.

#### 2.2 Produce and validate independent work

- Give each run of the leader draft round the same neutral contract, immutable inputs, exact paths,
  assignment identity, and verification criteria.
- Keep the two authors isolated. Freeze and verify both system-labeled drafts before either author or reviewer
  receives the other draft.
- Dispatch each reciprocal cross-review as a later, separate operation. Freeze and verify both reviews.
- Give the active runtime leader the contract, both drafts, and both cross-reviews. Require a canonical
  synthesis and a complete material-decision ledger.
- Resolve every remaining user-owned conflict with the user before EVALUATION. Agents may resolve only
  evidence-backed implementation detail already inside the locked contract.
- Render the complete WORK package at the parent-owned path through the manager-side writer, then read it
  directly against the parent Workflow Step 1.2 written contract: both system-labeled drafts, both
  cross-reviews, the synthesis, and the open decisions. No script enforces this; refuse the stage when one is
  missing or unlabeled.
- Reread the package and decisions. Retitle the active TODO to EVALUATION only after that reading passes.

#### 2.3 Evaluate and apply the fast gate

- Load the [Evaluation](../../evaluation/SKILL.md) skill and dispatch two fresh evaluators, one from the active
  runtime and one from the partner system. Neither may be a creator, persistent teammate, or recipient of the
  other report.
- Give both evaluators the neutral contract, both drafts, both reciprocal reviews, synthesis, decisions,
  settings, authority, project evidence, and named check results.
- Require complete but concise coverage of Project, Structure, Performance, Aesthetics, Usage, Consistency,
  Risk, and Overall. Each finding uses the parent-owned finding fields and states `blocking: yes|no`.
- Preserve both declared evaluator verdicts without rewriting them. Apply the parent fast-gate definition and
  two-iteration cap to derive the separate workflow decision.
- Retitle the active TODO to RECORD after both independent reports and the workflow decision validate.

#### 2.4 Record and route the result

- Load the [Record](../../record/SKILL.md) skill rooted at the parent Workflow Step 1.2 session memory tree.
- Seal the current creation package, evaluator reports, Configuration receipt, decisions, findings, checks,
  and system provenances.
- Write `gate.md` with report paths and hashes, declared verdicts, unresolved Critical IDs, actual blocking
  IDs, accepted nonblocking IDs, and the workflow decision.
- Write a canonical Ideation artifact only after fast-gate PASS. Write into the session memory tree only
  durable records supported by evidence; an empty result is valid.
- Write `record/iteration-N.md` with the exact TODO, input and output hashes, gate hash, checks, canonical
  output, and the durable records written into the session memory tree. Reread the receipt and every promised
  artifact before updating the TODO.
- On iteration-1 REVISE, complete the recorded item, create iteration 2 at DISCUSSION, and repeat the complete
  cycle. Resolve any new user-owned Phase 1 decision before the revised contract freezes.
- On iteration-2 FAIL, preserve the recoverable route, exact evidence, branch, and worktree and present the
  critical choices. Never create iteration 3.
- On PASS, retitle the active item to PASS, complete it, and activate `P1 · Hand-off`.

#### 2.5 Recover a failed partner run or specialist

- Preserve the last valid evidence and identify the exact failed system, assignment, operation, and check. The
  [Partner](../../gobbi/partner/SKILL.md) operation classifies a failed run and surfaces its evidence; this
  step decides what the workflow does with the paused round.
- Retry only the failed bounded operation when safe. Replace a stale or unaddressable specialist through the
  [Agent Teams](../../gobbi/agent-teams/SKILL.md) operation, which owns continuation, replacement, and
  context-boundary recovery.
- Continue only after the missing output validates. Use a single-system waiver only when existing authority
  names the system, productive step, and iteration.
- Treat an unavailable required system without that waiver as a critical blocker. Never infer a frozen draft,
  review, synthesis, or evaluator report from an idle signal or partial response.

### Phase 3 — Hand off to Planning

#### 3.1 Verify Workflow Phase 1 completion

- Verify Configuration, the canonical Ideation artifact, both evaluator reports, `gate.md`, the RECORD receipt,
  accepted findings, branch, worktree, and the active `P1 · Hand-off` item.
- Confirm the locked contract is concrete enough for Planning without an inferred material decision.
- Confirm no later TODO is active and no unverified artifact is presented as completed evidence.
- Return to the earliest responsible Phase 1 step when any check fails.

#### 3.2 Render the checkpoint and continue

- Render this Phase 1 checkpoint receipt:

```text
Phase: Phase 1
Outcome: <locked Ideation outcome>
Completed: <Configuration and Ideation completion>
Evidence: <Configuration receipt, canonical artifact, and verification>
Decisions: <resolved settings and material user decisions>
Accepted nonblocking findings: <findings or none>
Branch: <exact branch>
Worktree: <absolute worktree>
Next TODO: P2 · Planning · DISCUSSION · 1/2
Continuation: automatic unless the user interrupts for clear or compact
```

- Reread the rendered Hand-off and verify every factual field against direct evidence.
- Complete `P1 · Hand-off`, activate `P2 · Planning · DISCUSSION · 1/2`, display the checkpoint, and continue
  into Phase 2 in the same turn without asking whether to proceed.

## References
