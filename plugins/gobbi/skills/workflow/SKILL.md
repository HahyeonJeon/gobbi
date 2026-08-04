---
name: workflow
description: How a manager runs one durable Gobbi session through three checkpointed phases using native TODO routing, policy-selected local and external participants, verified records, and a terminal hand-off.
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
what that operation returns. Partner owns one external invocation. Workflow owns local participants, round
assembly, specialist scheduling, and the Agent Teams manual only for Claude Code tool behavior.

### Make every phase boundary recoverable

Each nonterminal Hand-off names the completed evidence, Git location, and exact next TODO. Phase 1 and Phase 2
continue immediately unless the user interrupts; the Wrap-up-owned terminal Hand-off body and Git-owned
finalization receipt end Phase 3.

## Rules

- **MUST use the native runtime TODO list to select the current phase, productive step, stage, task, and
  iteration.** Use only `pending`, `in_progress`, and `completed`, with at most one item `in_progress`.

- **MUST run DISCUSSION → WORK → EVALUATION → RECORD for Ideation, Planning, every Execution task, and
  Wrap-up.** Reread and verify the required evidence before changing the active item to its next stage.

- **MUST apply the recorded session-wide partner policy to every productive step.** Disabled invokes no
  external runtime: WORK uses one assigned active-runtime self-reviewed draft and EVALUATION uses one fresh
  isolated active-runtime evaluator. Enabled adds each applicable external draft, cross-review, or evaluator
  through one [Partner](../gobbi/partner/SKILL.md) invocation while Workflow assembles the complete round.

- **MUST keep worktree mutations in one ordered writer chain.** Parallel work is limited to independent
  read-only study, factual analysis, and critique.

- **MUST continue only from a verified PASS after every correction receives fresh evaluation.** Automatically
  correct only a High, Medium, or Low, `blocking: no`, in-contract, reversible, authority-neutral,
  non-destructive, non-external finding. Send Critical, blocking, scope, design, authority, external, and
  destructive findings to the user. Ask also for missing safety or authority or an enabled required-system
  failure without waiver authority.

- **NEVER accept a specialist report, idle signal, TODO status, or plausible summary as completion evidence
  by itself.** The manager must reread the promised artifact or commit and run its named verification.

## Procedure

### Phase 1 — Configure, ideate, and hand off

#### 1.1 Initialize or recover the native TODO

- Load [Delegation](../delegation/SKILL.md), [Discussion](../discussion/SKILL.md),
  [Git](../git/SKILL.md), and [Memory](../memory/SKILL.md), in that order, before
  the first Workflow action. A skill already loaded by Gobbi may satisfy its register entry; confirm all four
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

- Enter Configuration with Gobbi's applicable normalized slug or legacy `slug: not-applicable` and the
  session-wide `partner: enabled|disabled` policy.
  Resolve other defaults or customization with the user, including the Execution `maxIterations` value,
  which defaults to three total passes per task, role selections, Git finalization, enabled-system
  availability, and any narrow waiver authority.
- For a fresh session, generate a full lowercase hyphenated Gobbi session UUID and capture the real UTC
  session-start date before deriving names. Retain that original date across context boundaries. Derive the
  branch and worktree leaf separately through [Git conventions](../git/conventions.md):
  `<runtime-prefix>-<YYYY-MM-DD>-<slug>-<full-uuid>` and
  `<YYYY-MM-DD>-<slug>-<full-uuid>`. Never derive the leaf from the branch. Workflow owns its Git session contract
  and states it as five properties for the [Git skill](../git/SKILL.md):

| Contract property | Where Workflow gets it |
|---|---|
| Proved identity | The runtime, original UTC date, normalized slug, generated full UUID, and partner policy recorded in `configuration.md`, checked against separately derived new names and every commit trailer. A recovered legacy identity records `slug: not-applicable`. |
| Immutable base commit | The base revision resolved with the user in this step and recorded in `configuration.md`, which is the bootstrap commit when the preflight below creates one. It never moves afterward. |
| Isolated worktree outside the main checkout | For a fresh session, the intended path uses the separately derived new leaf and resolves outside the main checkout, with nothing registered there or to the separate branch. Recovery accepts one exact registered new pair or permanent legacy pair. |
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
- On recovery, parse the branch, worktree leaf, and session leaf with Git and Memory's separate new and
  permanent legacy validators. Require a byte-reproducible matching shape and tuple. Record `identity-shape:
  new|legacy`; never infer a legacy slug or rename, migrate, or rewrite a live legacy or active object. Stop on
  a mixed shape, competing tuple, collision, or unproved path.
- Create and verify one isolated session branch and worktree from that contract. For a fresh session, the Git
  operation proves the intended path is free, creates it, and returns the registered worktree that completes
  the contract before any other write.
- Create a new workflow evidence root at
  `{worktree}/.gobbi/projects/{project}/sessions/<YYYY-MM-DD>-<slug>-<full-uuid>/`; its leaf is byte-identical
  to the new worktree leaf, not the branch. Keep a recovered legacy root at its permanent
  `<YYYY-MM-DD>-<full-uuid>` leaf. Write `configuration.md` there with mode, identity shape, original UTC date,
  slug or `not-applicable`, UUID, partner policy, resolved settings, repository, base revision, branch,
  worktree leaf, session leaf, absolute worktree, runtime system, the
  validated `{gobbi-skills-root}` and `{gobbi-agents-root}` pair the [Gobbi](../gobbi/SKILL.md) Step 1.1 entry
  returned, and creation checks.
- Use these fixed evidence owners:

| Productive work | Evidence directory |
|---|---|
| Ideation | `1-ideation/` |
| Planning | `2-planning/` |
| Execution | `3-execution/task-NN-slug/` |
| Wrap-up | `4-wrap-up/` |

- Each owner uses `working/iteration-N/` for the WORK package and `record/iteration-N.md` for the RECORD
  receipt. Its `evaluation/iteration-N/` holds `gate.md` plus only the policy-required runtime reports:
  `claude.md` for a Claude evaluator and `codex.md` for a Codex evaluator. On PASS, Ideation writes
  `1-ideation/outputs/ideation.md`
  and Planning writes `2-planning/outputs/{tasks.md,plan.md}`. Execution implementation outputs remain at
  their planned tracked paths. `{evidence-root}/work/` receives other session-only work.
- Every path below the evidence root is ignored temporary session evidence. Apply
  [Memory](../memory/SKILL.md) `Temporary Record` to `configuration.md`, each package artifact, gate, output,
  and receipt named by Workflow. Never stage or commit these paths. On Wrap-up, apply `Memorize` to the full
  evidence root; readable legacy `{evidence-root}/memory/` content remains temporary input.
- A WORK package contains only `drafts/`, `cross-reviews/`, `research/`, `synthesis.md`, and
  `open-decisions.md`. Local specialists write their caller-named local artifacts. The
  [Partner](../gobbi/partner/SKILL.md) operation returns one labeled frozen external response and writes no
  durable file, so the manager places each enabled external response at its path before acceptance.
- Manager acceptance is a written contract and no script enforces it. The manager reads the placed package
  directly and confirms the required local draft, its self-review, synthesis, and open decisions. With partner
  enabled, it also confirms each applicable system-labeled external draft or cross-review against the label
  Partner returned. It refuses any missing, unexpected, or unlabeled participant artifact.
- Workflow owns this evaluation policy. Every productive step runs EVALUATION with one fresh isolated
  active-runtime evaluator. With partner enabled, Partner adds one fresh isolated external evaluator over the
  same frozen subject; neither receives the other report. Disabled invokes no external runtime. Evaluator
  verdicts are report evidence, and a validated `gate.md` PASS alone advances the TODO.
- Each evaluation report is a complete human-readable Evaluation output. Every finding states an ID, severity,
  evidence, impact, cause, confidence, suggested direction, and `blocking: yes|no`.
- Each `gate.md` records mode, partner policy, required participant set, report paths and hashes, every
  declared verdict, unresolved Critical finding IDs, actual blocking finding IDs, automatically correctable
  finding IDs, user-owned finding dispositions, pending reevaluation IDs, and the workflow decision. Each RECORD
  receipt records only the exact TODO and decision, source artifact, report, gate, or commit identifiers and
  hashes, verification result, accepted finding dispositions, and next or recovery state.
- Gates and receipts are recovery evidence. Only the native TODO selects the next action.
- Complete Configuration only after rereading `configuration.md`, verifying the evidence root, branch,
  worktree, settings, and TODO route, and then activate `P1 · Ideation · DISCUSSION · 1/2`.

#### 1.3 Build and accept specialist assignments

- Before writing or revising any specialist brief, keep the
  [Delegation](../delegation/SKILL.md) skill loaded and use its `Metadata`, `Task`, `Instructions`,
  `Resources`, and `Return` headings. The workflow adds the fields below; it does not replace that template.
- Load the [Partner](../gobbi/partner/SKILL.md) operation only before an enabled external invocation. Use its
  preparation, launch, validation, and failure procedure once for each external draft, cross-review, or
  evaluation report. Workflow remains the owner of local assignments and complete-round assembly.
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
  Evaluation, and Memory `Temporary Record` load points for its stages; the Workflow parent only routes to them.
- In DISCUSSION, study the request and evidence with a leader, then resolve What, Why, How, scope, success,
  material assumptions, alternatives, authority, and deferrals with the user. Freeze the neutral contract
  only when the user has locked the direction and each material unknown has an owner or decision.
- In WORK, assign one active-runtime leader to produce and self-review a local draft over the frozen contract.
  When partner is enabled, call [Partner](../gobbi/partner/SKILL.md) for each applicable independent external
  draft and external cross-review, place the returned labeled content in the Step 1.2 package, then let the
  same assigned local leader synthesize. Resolve user-owned conflicts and read the complete policy-selected
  package before accepting it.
- In EVALUATION, dispatch one fresh isolated active-runtime evaluator and, when partner is enabled, call
  Partner for one fresh isolated external evaluator over the same complete creation package. The reports
  cover Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, and Overall; each finding
  states severity and whether it is an actual blocker.
- In RECORD, seal the creation package, every policy-required report, decisions, findings, checks, and
  Configuration receipt.
  Write `1-ideation/outputs/ideation.md` only after PASS, verify it, and keep the tracked tree unchanged before
  updating the TODO.

#### 1.5 Apply the fast gate and hand off

- Ideation has two total iterations. Evaluator verdicts remain independent report evidence; the fast
  `gate.md`, not their more-severe aggregate, controls the TODO.
- Classify every finding through the Rules predicate. Route automatically correctable findings back to WORK,
  then require a fresh EVALUATION before routing again. Route Critical, blocking, scope, design, authority,
  external, or destructive findings to the user for disposition. A rejected or deferred user-owned finding
  remains literal gate evidence and cannot be silently corrected.
- Set the fast-gate decision to PASS only when no unresolved Critical or actual blocking finding remains, all
  user-owned findings have dispositions, no correction awaits fresh evaluation, and the current evaluated
  subject otherwise satisfies the contract. Set iteration 1 to REVISE when repair is authorized and possible;
  set iteration 2 to FAIL and stop when a non-PASS result remains. Only PASS continues automatically.
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
  Evaluation, Memory `Temporary Record`, and task Execution load points; the Workflow parent only routes to them.
- Use the canonical Ideation artifact, accepted decisions and findings, repository evidence, authority,
  required skills, dependencies, and writer boundary as Planning inputs.
- In DISCUSSION, the manager and agents resolve task hierarchy, stable `task-NN-slug` IDs, dependencies,
  assignment, read-only lanes, one-writer order, acceptance, and verification without routine user questions.
- Run WORK with the same policy-selected local draft, self-review, enabled external invocations, placement,
  active-runtime synthesis, and direct manager reading used in Ideation.
- Run EVALUATION with the same policy-selected fresh evaluator set and the fast two-iteration gate. Run RECORD after every
  verdict; on PASS, verify that `2-planning/outputs/{tasks.md,plan.md}` covers every Ideation obligation in
  dependency-valid order and that no shaping artifact was committed.
- Resolve routine, contract-preserving gaps agent-to-agent. Stop only at the critical-blocker boundary stated
  in the Rules.

#### 2.2 Expand and execute the task route

- Replace the pending `unplanned` placeholder with the first canonical plan task and add the remaining
  `task-NN-slug` items in plan order. Each task starts at
  `P2 · Execution · <task-NN-slug> · DISCUSSION · 1/<configured-max>`.
- Follow the loaded Phase 2 owner's task-specific Execution, Evaluation, and Memory `Temporary Record` load points as each task
  advances.
- For each task, let agents turn the plan entry, current preimage, exact path scope, dependencies, skills,
  authority, acceptance, and checks into an executable DISCUSSION contract.
- In WORK, assign one active-runtime executor to produce and self-review the local draft over the frozen
  contract and preimage. When partner is enabled, call Partner for each applicable external draft or
  cross-review, place the returned content, and let the assigned executor synthesize and implement as the sole
  writer. Run the required checks and create one focused local task commit.
- In EVALUATION, give one fresh isolated active-runtime evaluator the task contract, complete creation package,
  diff, tests, commit, and repository evidence. When partner is enabled, call Partner for one external
  evaluator over the same frozen subject. Record all available verdicts in `gate.md` and use the more severe
  verdict as the workflow decision: FAIL outranks REVISE, which outranks PASS.
- In RECORD, seal the verdict, findings, dispositions, verification, and artifact pointers through Memory
  `Temporary Record`. PASS only after
  the manager rereads the committed diff, verifies allowed paths, and reruns or directly checks the named
  evidence.

#### 2.3 Route revisions and continue

- On REVISE below the configured cap, complete RECORD, create the next iteration at DISCUSSION, and continue
  immediately. Apply the Rules finding predicate; every correction receives fresh evaluation and every
  finding outside it receives user disposition.
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
  Wrap-up, Evaluation, and Memory `Temporary Record` load points and applies the owner-loaded Memory and Git skills.
- Use canonical step artifacts, decisions, findings, waivers, task commits, verification, current Memory,
  the Wrap-up handoff template, and configured Git authority.
- In DISCUSSION, apply Wrap-up Phase 1 to freeze the closure inventory without routine user questions, and
  supply its four properties from this workflow: the full Step 1.2 evidence root as the memorization source,
  the current project's memory root as the bounded destination, a tracked report path under
  `.gobbi/projects/{project}/memory/reports/note/YYYY-MM-DD-{descriptive-title}.md`, and the Step 1.2 declared
  publication intent as the authorized finalization sequence.
- In WORK, assign one active-runtime assistant to produce and self-review a Memory-and-handoff draft. When
  partner is enabled, call Partner for each applicable external draft or cross-review, place the returned
  content, synthesize, and let that authorized writer apply Wrap-up Phase 2 inside the isolated worktree.
  Freeze the actual pre-Git tree and tracked handoff bytes.
- In EVALUATION, give one fresh isolated active-runtime evaluator the actual pre-Git tree, Memory changes,
  handoff, checks, and finalization plan. When partner is enabled, call Partner for one external evaluator over
  the same frozen subject. In RECORD, seal every verdict, finding, closure artifact, handoff digest, and
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
