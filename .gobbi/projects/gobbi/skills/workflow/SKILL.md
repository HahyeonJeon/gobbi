---
name: workflow
description: How a manager runs one durable Gobbi session through three checkpointed phases using native TODO routing, independent partner rounds, verified records, and a terminal hand-off.
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, AskUserQuestion, TaskCreate, TaskGet, TaskUpdate, TaskList
skill-type: operation
---

# Workflow

A Gobbi manager loads this skill to start, recover, route, and close one isolated session. The result is a
verified branch and worktree, a native runtime TODO route, evidence for every completed step, and a hand-off
that a cold manager can continue or close.

The workflow has three phases: Configuration → Ideation → Hand-off; Planning → Execution → Hand-off; and
Wrap-up → Hand-off. Every productive step runs DISCUSSION → WORK → EVALUATION → RECORD.

The manager owns user discussion, routing, assignments, acceptance, and authority checks. The user owns Phase 1
direction, changes outside its locked contract, new safety or external authority, destructive actions,
publication, and merge authority. Specialists own only their bounded work.

## Principles

### Route through one native TODO

The runtime TODO list is the sole progression authority. Artifacts, tests, commits, and reports prove whether
the manager may update it; they never become a concurrent route.

### Lock direction before autonomous delivery

Phase 1 locks the problem, purpose, scope, and approach with the user. Phase 2 and Phase 3 then resolve routine
in-contract choices through agent discussion and continue without routine user questions.

### Call the operation that owns the mechanism

Workflow gives each supporting operation its contract and frozen evidence, then places, verifies, and accepts
what that operation returns. Partner owns partner independence. Workflow owns specialist scheduling and uses
the Agent Teams manual only for Claude Code tool behavior.

### Make every phase boundary recoverable

Each nonterminal Hand-off names the completed evidence, Git location, and exact next TODO. Phase 1 and Phase 2
continue immediately unless the user interrupts; the Wrap-up-owned terminal Hand-off body and Git-owned
finalization receipt end Phase 3.

## Rules

- **MUST use the native runtime TODO list to select the current phase, productive step, stage, task, and
  iteration.** Use only `pending`, `in_progress`, and `completed`, with at most one item `in_progress`.

- **MUST run DISCUSSION → WORK → EVALUATION → RECORD for Ideation, Planning, every Execution task, and
  Wrap-up.** Reread and verify the required evidence before changing the active item to its next stage.

- **MUST obtain every independent draft, cross-review, and evaluation report from the
  [Partner](../gobbi/partner/SKILL.md) operation and accept only the complete round it returns.** A paused
  round stops the stage unless a valid waiver names that system, productive step, and iteration.

- **MUST keep worktree mutations in one ordered writer chain.** Parallel work is limited to independent
  read-only study, factual analysis, and critique.

- **MUST continue Phase 2 and Phase 3 after every verified nonterminal stage and Hand-off.** Ask the user only
  for missing safety or authority, a required-system failure without waiver authority, or an extremely
  material design or strategy change outside the Phase 1 contract.

- **NEVER accept a specialist report, idle signal, TODO status, or plausible summary as completion evidence
  by itself.** The manager must reread the promised artifact or commit and run its named verification.

## Procedure

### Phase 1 — Configure, ideate, and hand off

#### 1.1 Initialize or recover the native TODO

- Load [Delegation](../delegation/SKILL.md), [Discussion](../discussion/SKILL.md),
  [Git](../git/SKILL.md), [Record](../record/SKILL.md), and [Memory](../memory/SKILL.md), in that order, before
  the first Workflow action. A skill already loaded by Gobbi may satisfy its register entry; confirm all five
  before continuing.
- Inspect the current repository, branch, worktrees, native TODO surface, and unfinished work without
  mutation.
- Load the internal [`phase-1`](phase-1/SKILL.md) operation before acting on `P1 · Configuration`. A phase
  child is loaded by this exact path after the parent routes to it; it is never invoked independently by name.
- In Claude Code, use `TaskList` and `TaskGet` to inspect tasks, `TaskCreate` to add items, and `TaskUpdate` to
  change a subject or status. In Codex, use `update_plan` to publish the complete ordered list and statuses.
- On a fresh session, create one item for Configuration, one mutable item for each productive-step iteration,
  and one item for each Hand-off before doing other progression work. Start with only `P1 · Configuration` in
  progress and keep later items pending.
- Use this exact title grammar:

```text
P1 · Configuration
P1 · Ideation · <DISCUSSION|WORK|EVALUATION|RECORD|PASS> · <iteration>/2
P1 · Hand-off
P2 · Planning · <DISCUSSION|WORK|EVALUATION|RECORD|PASS> · <iteration>/2
P2 · Execution · <unplanned|task-NN-slug> · <DISCUSSION|WORK|EVALUATION|RECORD|PASS> · <iteration>/<configured-max>
P2 · Hand-off
P3 · Wrap-up · <DISCUSSION|WORK|EVALUATION|RECORD|PASS> · <iteration>/2
P3 · Hand-off
```

- Retitle the active productive-step item as it enters each stage. `PASS` is the verified gate marker after
  RECORD, not a fifth stage.
- When an iteration needs revision, complete its item at RECORD, create the next iteration at DISCUSSION, and
  leave the prior item as evidence of the completed pass. Ideation, Planning, and Wrap-up never receive a
  third item.
- For recovery, apply the algorithm in [`agent-teams.md`](agent-teams.md): begin at the latest verified
  Hand-off, walk canonical records and task commits in workflow order, reconstruct the first unproved TODO,
  and continue only after the native list has been corrected. Load the internal phase operation that matches
  the reconstructed item before continuing.

#### 1.2 Configure the session and its evidence

- Resolve defaults or customization with the user, including the Execution `maxIterations` value, which
  defaults to three total passes per task, role selections, Git finalization, required-system availability,
  and any narrow waiver authority.
- Generate a Gobbi session UUID before deriving its branch or worktree. Workflow owns its Git session contract
  and states it as five properties for the [Git skill](../git/SKILL.md):

| Contract property | Where Workflow gets it |
|---|---|
| Proved identity | The session UUID generated in this step and recorded in `configuration.md`, checked against the branch name and every commit trailer. |
| Immutable base commit | The base revision resolved with the user in this step and recorded in `configuration.md`, which is the bootstrap commit when the preflight below creates one. It never moves afterward. |
| Isolated worktree outside the main checkout | For a fresh session, the intended path derived from the session branch, resolving outside the main checkout with nothing registered there or to that branch. For a recovered session, the path already registered to that exact branch. |
| Declared publication intent | The Git finalization resolved with the user in this step and recorded in `configuration.md`. Phase 3 performs only what it authorizes. |
| Required layout | The canonical `.gobbi/` paths, their tracked-or-ignored states, and the ignore-rule content that achieves them, defined by [Gobbi](../gobbi/SKILL.md) Step 1.1 and resolved for this repository's `<project>`. |

- Bootstrap the required layout before the base is captured. Resolve and validate `<project>` through the
  [Gobbi](../gobbi/SKILL.md) Step 1.1 resolver, require a clean current checkout, and let the Git operation
  verify the posture and stop on the conditions it names.
- When the posture is already correct, create nothing, commit nothing, and leave the main checkout unchanged.
  Otherwise create the required directories, write `.gobbi/.gitignore`, and obtain the user's explicit
  approval for exactly one bootstrap commit of those paths on the current branch. That commit's clean head is
  the immutable base commit; stop without that approval.
- The bootstrap is the only tracked write outside the session worktree. It covers only the required layout and
  its ignore file, happens at most once per repository, and never writes a repository's root `.gitignore`.
- Create and verify one isolated session branch and worktree from that contract. For a fresh session, the Git
  operation proves the intended path is free, creates it, and returns the registered worktree that completes
  the contract before any other write.
- Create the workflow evidence root at
  `{worktree}/.gobbi/projects/{project}/sessions/{date}-{gobbi-session-id}/`. Write `configuration.md` there
  with the UUID, resolved settings, repository, base revision, branch, absolute worktree, runtime system, the
  validated `{gobbi-skills-root}` and `{gobbi-agents-root}` pair the [Gobbi](../gobbi/SKILL.md) Step 1.1 entry
  returned, and creation checks.
- Use these fixed evidence owners:

| Productive work | Evidence directory |
|---|---|
| Ideation | `1-ideation/` |
| Planning | `2-planning/` |
| Execution | `3-execution/task-NN-slug/` |
| Wrap-up | `4-wrap-up/` |

- Each owner uses `working/iteration-N/` for the partner-round package,
  `evaluation/iteration-N/{claude.md,codex.md,gate.md}` for independent reports and the workflow gate,
  `record/iteration-N.md` for the RECORD receipt, and `outputs/` for PASS-only canonical artifacts.
- Root the session locations at that same evidence root. `{evidence-root}/memory/` is the session memory tree
  whose shape the [Record skill](../record/SKILL.md) names; every step's durable records land there and
  Wrap-up memorizes that tree. `{evidence-root}/work/` is the session-only sibling beside it and receives
  plans, scenarios, checklists, and every other session-only kind no evidence owner above already holds.
  Never write a session-only kind inside `memory/`.
- A WORK package contains only `drafts/`, `cross-reviews/`, `research/`, `synthesis.md`, and
  `open-decisions.md`. The [Partner](../gobbi/partner/SKILL.md) operation returns labeled frozen content and
  writes no file, so the manager places each returned item at its path in that layout before acceptance.
- Manager acceptance is a written contract and no script enforces it. The manager reads the placed package
  directly, confirms both system-labeled drafts, both cross-reviews, the synthesis, and the open decisions
  against the labels the round returned, and refuses the stage when one is missing or unlabeled.
- Workflow owns this evaluation policy. Every productive step runs its EVALUATION stage as one partner
  evaluation round with two fresh isolated evaluators, one from the active runtime and one from the partner
  system, neither holding the other report. For Ideation, that stage independently evaluates the frozen,
  self-reviewed subject its operation returns. Evaluator verdicts are report evidence, and the `gate.md`
  decision alone advances the TODO.
- Each evaluation report is a complete human-readable Evaluation output. Every finding states an ID, severity,
  evidence, impact, cause, confidence, suggested direction, and `blocking: yes|no`.
- Each `gate.md` records mode, report paths and hashes, both declared verdicts, unresolved Critical finding
  IDs, actual blocking finding IDs, accepted nonblocking finding IDs, and the workflow decision. Each RECORD
  receipt records the exact TODO, input and output hashes, gate hash, checks, canonical output, and the
  durable records written into the session memory tree.
- Gates and receipts are recovery evidence. Only the native TODO selects the next action.
- Complete Configuration only after rereading `configuration.md`, verifying the evidence root, branch,
  worktree, settings, and TODO route, and then activate `P1 · Ideation · DISCUSSION · 1/2`.

#### 1.3 Build and accept specialist assignments

- Before writing or revising any specialist brief, keep the
  [Delegation](../delegation/SKILL.md) skill loaded and use its `Metadata`, `Task`, `Instructions`,
  `Resources`, and `Return` headings. The workflow adds the fields below; it does not replace that template.
- Load the [Partner](../gobbi/partner/SKILL.md) operation before dispatching a partner run, and use its
  preparation, launch, validation, and failure procedure for every draft, cross-review, and evaluation round.
- In `Metadata`, name the Gobbi session UUID, active runtime, absolute worktree, absolute evidence root,
  branch, phase, exact current TODO and status, productive step and stage, iteration and cap, stable task ID
  when applicable, assignment ID, prerequisite evidence, and why the assignment is ready.
- In `Task`, name one role, one bounded outcome, why the current TODO needs it, the locked Phase 1 terms, and
  exact acceptance criteria.
- In `Instructions`, state the manager's retained user, scope, routing, acceptance, reassignment, destructive,
  and external-action authority. Give the exact scope, write root, allowed and protected paths, mutation and
  commit authority, external-effect authority, one-writer boundary, applicable independence rules, and stop
  conditions. Specialists never update the workflow TODO or ask the user directly. Every RECORD assignment
  names the Step 1.2 evidence layout and session locations as the paths it writes into.
- In `Resources`, name the `{gobbi-skills-root}` and `{gobbi-agents-root}` pair Step 1.2 recorded as absolute
  paths, then list every resource as an exact path resolved from them and never as a bare skill or role name.
  Use this read order: Principles; every project rule or `NO_PROJECT_RULES`; the canonical role prompt; this
  Workflow skill; the active phase operation; the productive-step and task-specific skills; then the primary
  artifacts. Fresh specialists inherit no loaded skill. A continued specialist receives a new assignment ID,
  current TODO, changed inputs, mandatory rereads, full current scope, and any changed independence rule.
- In `Return`, name the expected artifacts, paths, system labels, checks, evidence, and exact escape responses.
  Require this workflow prefix:

```text
STATUS: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED
VERDICT: PASS | REVISE | FAIL
ARTIFACT: <path or response-only>
SKILLS LOADED:
  - <exact path, in read order>
```

- `VERDICT` is evaluator-only and is omitted for other roles. `ARTIFACT` is omitted only when no artifact is
  required. After a report, the manager validates the assignment, role, prefix, loaded paths, promised
  artifact or commit, named checks, scope, and protected paths before updating the TODO.
- In Claude Code, load the [Agent Teams](../gobbi/agent-teams/SKILL.md) manual before using persistent
  specialists. The manual owns tool setup and use; Workflow owns assignment fields, role reuse boundaries,
  mutation surfaces, report acceptance, and the recovery evidence walk in [`agent-teams.md`](agent-teams.md).
- Reuse a leader only within one Ideation or Planning chain, an executor only across related ordered tasks in
  one plan subsystem, and an assistant only within one memorization chain.

#### 1.4 Run user-led Ideation

- Keep the internal [`phase-1`](phase-1/SKILL.md) operation loaded. That phase owner defines the Ideation,
  Evaluation, and Record load points for its stages; the Workflow parent only routes to them.
- In DISCUSSION, study the request and evidence with a leader, then resolve What, Why, How, scope, success,
  material assumptions, alternatives, authority, and deferrals with the user. Freeze the neutral contract
  only when the user has locked the direction and each material unknown has an owner or decision.
- In WORK, call the [Partner](../gobbi/partner/SKILL.md) operation for one leader draft round and its
  cross-review round over that same contract and frozen evidence. Place the returned labeled content in the
  Step 1.2 package layout, let the active runtime leader synthesize, resolve user-owned conflicts, and read
  the complete package against the Step 1.2 written contract before accepting it.
- In EVALUATION, call that operation for one evaluation round over the complete creation package. Both reports
  cover Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, and Overall; each finding
  states severity and whether it is an actual blocker.
- In RECORD, seal the creation package, both reports, decisions, findings, checks, and Configuration receipt.
  Write the canonical Ideation artifact only after PASS and verify it before updating the TODO.

#### 1.5 Apply the fast gate and hand off

- Ideation has two total iterations. Evaluator verdicts remain independent report evidence; the fast
  `gate.md`, not their more-severe aggregate, controls the TODO.
- Set the fast-gate decision to PASS when no unresolved Critical or actual blocking finding remains, even when
  a report declares REVISE for an accepted nonblocking finding. Set iteration 1 to REVISE when either class
  remains; set iteration 2 to FAIL and stop when either class remains.
- Record optional improvements and all other findings as accepted nonblocking findings without forcing
  revision.
- After a blocking first pass, complete RECORD, obtain any required Phase 1 user decision, create iteration
  2/2 at DISCUSSION, and repeat the complete cycle. After a blocking second pass, keep the current route
  recoverable and present the exact choices; never create iteration 3.
- On PASS, retitle the item to `PASS`, complete it, and activate `P1 · Hand-off`.
- Render the Phase 1 checkpoint receipt defined by the internal
  [`phase-1`](phase-1/SKILL.md) operation. Set its next route to
  `P2 · Planning · DISCUSSION · 1/2` with automatic continuation unless the user interrupts for clear or
  compact.
- Complete the Hand-off, activate its `Next TODO`, display the checkpoint, and continue into Phase 2 in the
  same turn.

### Phase 2 — Plan, execute, and hand off

#### 2.1 Plan continuously from the locked contract

- Load the internal [`phase-2`](phase-2/SKILL.md) operation. That phase owner defines the Planning,
  Evaluation, Record, and task Execution load points; the Workflow parent only routes to them.
- Use the canonical Ideation artifact, accepted decisions and findings, repository evidence, authority,
  required skills, dependencies, and writer boundary as Planning inputs.
- In DISCUSSION, the manager and agents resolve task hierarchy, stable `task-NN-slug` IDs, dependencies,
  assignment, read-only lanes, one-writer order, acceptance, and verification without routine user questions.
- Run WORK with the same partner draft and cross-review rounds, placement into the Step 1.2 package layout,
  active-runtime synthesis, and direct manager reading used in Ideation.
- Run EVALUATION with two fresh independent evaluators and the fast two-iteration gate. Run RECORD after every
  verdict; on PASS, verify that the canonical plan covers every Ideation obligation in dependency-valid order.
- Resolve routine, contract-preserving gaps agent-to-agent. Stop only at the critical-blocker boundary stated
  in the Rules.

#### 2.2 Expand and execute the task route

- Replace the pending `unplanned` placeholder with the first canonical plan task and add the remaining
  `task-NN-slug` items in plan order. Each task starts at
  `P2 · Execution · <task-NN-slug> · DISCUSSION · 1/<configured-max>`.
- Follow the loaded Phase 2 owner's task-specific Execution, Evaluation, and Record load points as each task
  advances.
- For each task, let agents turn the plan entry, current preimage, exact path scope, dependencies, skills,
  authority, acceptance, and checks into an executable DISCUSSION contract.
- In WORK, call the [Partner](../gobbi/partner/SKILL.md) operation for a draft and cross-review round over the
  same contract and frozen preimage, place the returned content, and let the active runtime executor
  synthesize and implement as the sole writer. Run the required checks and create one focused local task
  commit.
- In EVALUATION, give two fresh independent evaluators the task contract, complete creation package, diff,
  tests, commit, and repository evidence. For normal mode, record both report verdicts in `gate.md` and use
  the more severe verdict as the workflow decision: FAIL outranks REVISE, which outranks PASS.
- In RECORD, seal the verdict, findings, dispositions, verification, and artifact pointers. PASS only after
  the manager rereads the committed diff, verifies allowed paths, and reruns or directly checks the named
  evidence.

#### 2.3 Route revisions and continue

- On REVISE below the configured cap, complete RECORD, create the next iteration at DISCUSSION, and continue
  immediately. Resolve noncritical finding dispositions agent-to-agent within the locked contract.
- On PASS, retitle and complete the task item, then activate the next task immediately.
- A FAIL or exhausted cap is an actual blocker after every safe in-contract recovery is exhausted. Preserve
  the current item, exact evidence, branch, worktree, and recovery choices rather than adding an unauthorized
  pass or accepting failed work.
- For an unavailable or invalid system response, retry only the failed bounded operation when safe. Continue
  with one system only when the existing waiver authority names the missing system, productive step, and
  iteration.
- When Execution exposes an in-contract plan defect, preserve the completed Planning item and write a
  numbered plan amendment during the current task's DISCUSSION. The amendment records the cause, affected
  pending tasks, revised order or contracts, and verification; retitle or reorder only pending Execution
  items and never consume another Planning iteration.
- Preserve completed task commits. Add a compensating pending task when an in-contract amendment must alter a
  completed result; stop at the critical-blocker boundary when safe compensation is impossible or the change
  exceeds the locked contract.

#### 2.4 Hand off and continue

- After every planned task has verified PASS evidence and a focused commit, activate `P2 · Hand-off` and
  render the Phase 2 checkpoint receipt defined by the internal [`phase-2`](phase-2/SKILL.md) operation.
- Set its next route to `P3 · Wrap-up · DISCUSSION · 1/2` with automatic continuation unless the user
  interrupts for clear or compact.
- Complete the Hand-off, activate its `Next TODO`, display the checkpoint, and continue into Phase 3 in the
  same turn.

### Phase 3 — Wrap up and finish

#### 3.1 Run Wrap-up continuously

- Load the internal [`phase-3`](phase-3/SKILL.md) operation before DISCUSSION. That phase owner defines the
  Wrap-up, Evaluation, and Record load points and applies the owner-loaded Memory and Git skills.
- Use canonical step artifacts, decisions, findings, waivers, task commits, verification, current Memory,
  the Wrap-up handoff template, and configured Git authority.
- In DISCUSSION, apply Wrap-up Phase 1 to freeze the closure inventory without routine user questions, and
  supply its four properties from this workflow: the Step 1.2 session memory tree as the memorization source,
  the current project's memory root as the bounded destination, the tracked handoff path under `4-wrap-up/`,
  and the Step 1.2 declared publication intent as the authorized finalization sequence.
- In WORK, call the [Partner](../gobbi/partner/SKILL.md) operation for a Memory-and-handoff draft and
  cross-review round, place the returned content, synthesize, and let one authorized writer apply Wrap-up
  Phase 2 inside the isolated worktree. Freeze the actual pre-Git tree and tracked handoff bytes.
- In EVALUATION, give two fresh independent evaluators the actual pre-Git tree, Memory changes, handoff,
  checks, and finalization plan. In RECORD, seal the verdict, findings, closure evidence, handoff digest, and
  authorized Git intent.
- Wrap-up has two total iterations and uses the fast `gate.md` decision from Step 1.5. A blocking first pass
  receives one complete revision; a blocking second pass stops with exact evidence and no third iteration.

#### 3.2 Finalize authorized work

- After PASS, verify the canonical closure evidence, every local commit, the tracked handoff digest, and the
  worktree state.
- Resume Wrap-up Phase 3 and perform only Git actions already configured and authorized. If publication,
  merge, or cleanup is not authorized or does not complete, retain the branch and worktree and record the
  exact recovery action rather than asking a routine question or claiming success.
- Retitle and complete the Wrap-up item, then activate `P3 · Hand-off`.

#### 3.3 Render the terminal Hand-off

- Resume Wrap-up Phase 4 and display the verified tracked Hand-off byte-for-byte.
- Append the display-only factual Git receipt defined by
  [`wrap-up/handoff.md`](../wrap-up/handoff.md). Report only actions that occurred.
- Leave no next TODO after `P3 · Hand-off`; this is the terminal workflow checkpoint.
- Complete `P3 · Hand-off` only after the handoff, TODO route, local evidence, and retained recovery state
  agree. Display the terminal checkpoint and end the workflow.

## References

- [`phase-1/SKILL.md`](phase-1/SKILL.md) owns the complete Phase 1 operation.
- [`phase-2/SKILL.md`](phase-2/SKILL.md) owns the complete Phase 2 operation.
- [`phase-3/SKILL.md`](phase-3/SKILL.md) owns the complete Phase 3 operation.
- [`agent-teams.md`](agent-teams.md) owns TODO-based assignment, the context-boundary evidence walk, and
  Phase 2 and Phase 3 continuity.
