---
name: workflow
description: "Workflow is a durable Gobbi work mode for one isolated, checkpointed session."
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, AskUserQuestion, TaskCreate, TaskGet, TaskUpdate, TaskList
skill-type: operation
---

# Workflow

Workflow runs one isolated session through Configuration and Ideation, Planning and Execution, then Wrap-up
and Note. Use it when work needs a user-approved design, durable phase handoffs, User Review waits, and
recovery in the same worktree and session directory.

## Principles

### Route through one native TODO

The native TODO list selects the current phase and stage. Session evidence identifies the active task and
iteration and proves transitions, but it never becomes another route.

### Wait, design, then deliver inside later frames

After Configuration, idle-wait until the user delivers the work. Design with the user in Phase 1, wait at each
User Review TODO, and stay autonomous inside later frames.

### Apply one frame in every phase

Every phase uses `DISCUSSION → WORK → EVALUATION → RECORD`. The frame keeps decisions, authorship, independent
judgment, acceptance, and recovery evidence separate, and User Review is outside the frame.

### Make every phase handoff recoverable

Each phase ends with one verified `handoff.md` for either completion or a safe terminal stop. Recover only in
the worktree and session root recorded by Configuration and the latest handoff.

## Rules

- **MUST use the native TODO list to select the current phase and stage.** Use only `pending`, `in_progress`, and
  `completed`, with at most one item `in_progress`; keep task, iteration, cap, and decision data in session evidence.
- **MUST complete every material user decision in Phase 1, using available subagents or teammates and remaining
  Partner runtimes before recommending a design.** After completed `P1 · User Review`, never ask a design
  question; at User Review TODOs ask only Continue or Stop.
- **MUST run `DISCUSSION → WORK → EVALUATION → RECORD` in every phase.** Planning and each Execution task
  complete the frame before dependent work starts.
- **MUST apply the recorded participant policy through one ordered writer chain.** One active-runtime writer
  self-reviews; independent local and remaining Partner inputs stay separate until synthesis; EVALUATION uses
  a fresh active-runtime evaluator and one attempted invocation per remaining runtime.
- **MUST write and verify `handoff.md` after every completed phase or safe terminal stop.** Recover only in its
  recorded worktree and session root; never create a replacement for the same Workflow identity.
- **NEVER accept a report, idle signal, TODO status, handoff, gate, receipt, or summary as completion evidence
  by itself.** Reread the promised result or commit and reproduce its verification.

## Workflow Frame

Each phase applies the same four stages. A phase with more than one productive unit, such as Planning followed
by Execution tasks, completes the frame for each unit before starting its dependent unit, and User Review is
outside the frame.

| Stage | Required action |
|---|---|
| `DISCUSSION` | Freeze the subject, accepted decisions, criteria, authority, cap, participants, absolute paths, and next action. Phase 1 includes the user; later frames use the manager, subagents or teammates, and remaining Partner runtimes with no design question, and User Review is outside the frame. |
| `WORK` | Gather bounded independent input, then have one assigned writer create and self-review the authoritative result at its caller-supplied path. |
| `EVALUATION` | Freeze the actual result and send the same subject and caller criteria to one fresh active-runtime evaluator and one Partner wrapper subagent per remaining runtime at exact report paths. |
| `RECORD` | Reread the result and reports, disposition findings, write and verify the gate and receipt, update Configuration progress, and route PASS, REVISE, or FAIL. |

Every Delegation brief names the absolute temporary and final paths, frozen subject, criteria, participant
policy, iteration cap, report paths, `gate.md` path, receipt path, checks, authority, and recovery boundary.
Drafts and independent inputs start at caller-named paths below `{session-root}/tmp/`. The Partner launch set
is the recorded set minus the active runtime. If that set is empty, launch nothing and do not rewrite the
recorded policy to `disabled`. Each remaining runtime receives one Partner wrapper subagent through the
active runtime's subagent system, with its own `tmp/` path, Delegation prompt, and `expected-partner`.
Wrappers for different remaining runtimes may run in parallel. A launchable runtime produces an evaluator
report; an Unavailable attempt produces Unavailable evidence, not a Partner Handoff. The manager validates
each sole write and Handoff after the wrapper returns.

The manager writes `gate.md` through Memory `Temporary Record` with the subject identity, iteration and cap,
criteria, reports, findings and dispositions, decision, and next action. PASS means the criteria are satisfied
with no correction pending; REVISE means an authorized correction remains and the cap permits another
iteration; FAIL means safe in-contract correction is unavailable or the cap is exhausted. One assistant then
writes the RECORD receipt through Memory `Temporary Record` with the unit, stage, iteration, writer, result
locator or commit, verification, reports, gate, decision, next action, and recovery state.

## Procedure

### Phase 1 — Configure and Ideate

Phase 1 uses `DISCUSSION → WORK → EVALUATION → RECORD` to study the project with the user and participants,
produce and assess Ideation, and lock the contract. It idle-waits after Configuration until delivered work
exists, then waits at `P1 · User Review` after a Complete `handoff.md`.

#### 1.1 Initialize or recover the route

- Enter from Gobbi with `mode: Workflow`, the normalized slug, partner policy, runtime, and validated Gobbi root
  pair. Load [Discussion](../discussion/SKILL.md), [Delegation](../delegation/SKILL.md), [Git](../git/SKILL.md),
  and [Memory](../memory/SKILL.md), then inspect the repository, worktrees, TODO, configuration, handoffs, and
  unfinished evidence before mutation.
- Publish this complete fixed TODO on fresh entry. Start only Configuration and keep dynamic identifiers in
  session evidence:

```text
P1 · Configuration
P1 · Ideation
P1 · User Review
P2 · Planning
P2 · Execution
P2 · User Review
P3 · Wrap-up
P3 · User Review
P3 · Note
```

- On recovery, require the recorded identity, branch, registered worktree, absolute worktree, session root,
  configuration, latest handoff, and later valid records to agree, and stop instead of creating or selecting a
  replacement worktree or session directory. Reconstruct the idle wait when Configuration is complete and
  delivered work is absent; otherwise reconstruct the first unproved TODO, keep a Complete `handoff.md` at its
  User Review until Continue, and resume a Stopped `handoff.md` at the first unproved productive TODO.

#### 1.2 Create the worktree and configuration

- On the start checkout Gobbi started in, run `git branch --show-current` before creating the worktree, and
  record that name as `Base branch` and that checkout as `Base checkout`. If the name is empty, or the
  checkout is dirty or unusable, stop; do not ask which branch is the base, and never use the worktree
  branch as the base.
- Resolve the Execution cap, participants, systems and waivers, immutable base, publication intent, merge and
  cleanup authority, protected work, and exact current-project Memory root; the Execution cap defaults to three
  total passes per task. For a fresh session, capture the original UTC start date, generate one lowercase
  hyphenated UUID, apply Git preferences from the recorded `Base branch` without asking which branch is the
  base, give the worktree and session leaves the byte-equal name `<YYYY-MM-DD>-<slug>-<full-uuid>`, set the
  session root to `{worktree}/.gobbi/projects/{project}/sessions/<session-leaf>/`, and render the
  [configuration template](templates/configuration.md) directly below it through Memory `Temporary Record`.
- Verify identity, settings, roots, observed `Base branch`, registration, containment, ignored state, tracked
  tree, base checkout, and the rendered configuration. Do not activate `P1 · Ideation`.

#### 1.3 Establish phase and session locations

| Productive work | Record directory |
|---|---|
| Ideation | `1-ideation/` |
| Planning | `2-planning/` |
| Execution | `3-execution/task-NN-slug/` |
| Wrap-up | `wrap-up/` |
| Temporary work | `tmp/` |

- For each productive unit, place caller-named reports and `gate.md` below
  `<record-directory>/evaluation/iteration-N/`, and place its receipt at
  `<record-directory>/record/iteration-N.md`. Accepted results remain at their owner-defined paths; create
  later directories only when their first result needs them.
- Use these fixed phase handoffs: Phase 1 at `1-ideation/handoff.md`, Phase 2 at
  `3-execution/handoff.md`, and Phase 3 at `wrap-up/handoff.md`. Apply Memory `Temporary Record` to each
  exact ignored output path, and refresh `configuration.md` Progress evidence and Latest handoff only after
  rereading the named result and reproducing its checks.
- Complete `P1 · Configuration` as an idle wait after those location rules are recorded. Leave every later
  item `pending` with no item `in_progress`, and do not run 1.4 or activate `P1 · Ideation`.

#### 1.4 Run the Ideation frame and lock direction

- Enter only when Configuration is complete and delivered work exists: a user statement of the outcome, topic,
  or request, not mode, slug, partner policy, "continue", "ok", "looks good", or repository state. If delivered
  work is absent, idle-wait with no item `in_progress`; asking the user to state the work is allowed, studying
  is not, and a concrete outcome statement already in the session may be used after Configuration.
- **DISCUSSION:** Activate `P1 · Ideation`, then study the request, users, project vision, roadmap, design,
  architecture, current behavior, prior decisions, evidence, constraints, and alternatives. Use available
  subagents or teammates and remaining Partner runtimes for independent research and design suggestions, then
  recommend the best-supported options and obtain every material user decision about What, Why, How, scope,
  success, risk, authority, and deferrals.
- **WORK → EVALUATION → RECORD:** Apply [Ideation](../ideation/SKILL.md) through Delegation with the absolute
  output root `{session-root}/1-ideation/outputs/ideation/` and exact locator
  `{session-root}/1-ideation/outputs/ideation/ideation-index.md`; one leader synthesizes and self-reviews the
  indexed result, and every material unresolved question returns to this DISCUSSION before the phase closes.
  Freeze the index and every listed member, apply the Workflow Frame with a maximum of two iterations, and
  verify membership, order, paths, hashes, tracked-tree state, reports, gate, receipt, and finding
  dispositions; REVISE returns to Phase 1 DISCUSSION, and FAIL records the exact stopped state.

#### 1.5 Write the Phase 1 handoff and wait at User Review

- Render the [handoff template](templates/handoff.md) at `1-ideation/handoff.md` for Complete or Stopped. Record
  the exact identity, worktree, session root, branch, result and hashes, checks, decisions, authority, findings,
  first unproved action, and recovery command.
- For Complete, record `Next TODO: P1 · User Review`, update Configuration's Latest handoff and Progress
  evidence, activate `P1 · User Review`, display the file, and use [Discussion](../discussion/SKILL.md) with
  the runtime ask tool for Continue or Stop only, not a design-question card. For Stopped, keep the current
  first unproved productive TODO and do not activate User Review as a next-phase gate.
- Do not activate Planning from the file, from silence, or from the absence of an interrupt. Continue
  completes `P1 · User Review` and then activates `P2 · Planning`; Stop leaves User Review `in_progress` or
  records a stop and does not activate Planning or rewrite the Complete file into a failed phase.

### Phase 2 — Plan and Execute

Phase 2 applies `DISCUSSION → WORK → EVALUATION → RECORD` first to Planning and then to every Execution task.
Enter only from completed `P1 · User Review`; the manager, subagents or teammates, and remaining Partner
runtimes make later in-frame decisions from the locked Phase 1 design, then wait at `P2 · User Review`.
Prefer re-delegating coherent follow-up to a context-ready teammate after revalidating its role, evidence,
addressability, and write boundary and issuing a complete new Delegation brief.

#### 2.1 Run the Planning frame

- **DISCUSSION:** Enter only from completed `P1 · User Review`. The manager uses independent local and remaining
  Partner input to decide the planning approach, criteria, paths, and task boundaries within the accepted
  design; an unresolvable authority or contract conflict stops without a design question.
- **WORK:** Apply [Planning](../planning/SKILL.md) through Delegation with absolute output root
  `{session-root}/2-planning/outputs/planning/` and exact locator
  `{session-root}/2-planning/outputs/planning/plan-index.md`. One leader writes and self-reviews the indexed plan
  while preserving Ideation members and locked decisions.
- **EVALUATION → RECORD:** Freeze the complete plan, run fresh evaluation, and record its gate and receipt with a
  maximum of two iterations. Verify obligation coverage, stable task IDs, dependencies, contexts, writer
  boundaries, indexed membership and hashes, and unchanged tracked state before activating Execution.

#### 2.2 Run each Execution task frame

- **DISCUSSION:** Select the first unproved dependency-ready `task-NN-slug` in plan order. The manager consults
  available subagents or teammates and remaining Partner runtimes to settle the in-contract approach, then
  gives one executor exact inputs, paths, authority, criteria, checks, and protected work.
- **WORK:** Apply [Execution](../execution/SKILL.md) through Delegation with one active writer and read-only
  helpers. Require self-review, fresh verification, and one focused local commit for the accepted task.
- **EVALUATION → RECORD:** Freeze the commit and result, run fresh evaluation, and record the gate and receipt
  under the configured Execution cap. Reread the commit, diff, checks, reports, findings, and dispositions before
  the next task; amend only pending plan work when an in-contract plan defect appears.

#### 2.3 Write the Phase 2 handoff and wait at User Review

- After every planned task earns PASS, render the handoff template at `3-execution/handoff.md` with the plan,
  task commits, checks, evaluations, decisions, dispositions, exact worktree and session root, and
  `Next TODO: P2 · User Review`.
- On a safe terminal stop, render the same path with `Status: Stopped`, the current first unproved Planning or
  Execution action, retained evidence, and no User Review activation as a next-phase gate. For Complete, update
  Configuration, verify the handoff against all named evidence, activate `P2 · User Review`, display the file,
  and use Discussion with the runtime ask tool for Continue or Stop only, not a design-question card.
- Do not activate Wrap-up from the file, from silence, or from the absence of an interrupt. Continue completes
  `P2 · User Review` and then activates `P3 · Wrap-up`; Stop leaves User Review `in_progress` or records a stop
  and does not activate Wrap-up; recovery returns to the first unproved action without replacing accepted
  history or asking a design question.

### Phase 3 — Wrap Up and Report

Phase 3 applies `DISCUSSION → WORK → EVALUATION → RECORD` to the actual closure. It then integrates only the
evaluated tree, writes the terminal `handoff.md`, waits at `P3 · User Review`, and returns the Note after
Continue.

#### 3.1 Run closure DISCUSSION

- Enter only from completed `P2 · User Review` in the configured worktree and session root. Load
  [Wrap-up](../wrap-up/SKILL.md) and inventory accepted results, commits, checks, findings, decisions, exclusions,
  risks, Memory, Git state, authority, and open items.
- Use available subagents or teammates and remaining Partner runtimes to review the closure route, merge plan,
  risks, and recovery choices. The manager resolves every in-contract choice from the accepted design and
  stops without a design question when authority, safety, or the locked contract cannot support one route.
- Freeze the closure subject, criteria, participant assignments, exact Memory and session roots, temporary and
  final paths, report paths, gate and receipt paths, cap, checks, merge authority, and protected state.

#### 3.2 Run closure WORK

- Give one assistant the complete session root, exact current-project Memory root, accepted evidence, allowed
  and protected paths, and checks through Delegation. Apply Wrap-up and [Memory](../memory/SKILL.md), then
  self-review the Memory CRUD, retained paths, indexes, links, and complete worktree diff.
- Verify the actual pre-Git tree, task commits, checks, heads, merge plan, authority, risks, and recovery state.
  Keep the response-only Note outside the evaluation subject.
- Stop at the exact recoverable state when any promised closure result, containment check, authority, or
  verification is missing; do not ask a design question or invent a replacement route.

#### 3.3 Run closure EVALUATION

- Freeze the actual closure tree and evaluate it with the Memory diff, accepted commits, checks, merge plan,
  authority, exclusions, risks, and recovery paths. Use one fresh active-runtime evaluator and one Partner
  wrapper subagent per remaining runtime over the same subject and criteria; a launchable runtime produces an
  evaluator report, and an Unavailable attempt produces Unavailable evidence, not a Partner Handoff.
- Apply the Workflow gate with a maximum of two iterations. REVISE returns to Phase 3 DISCUSSION and repeats the
  changed WORK; FAIL preserves the branch, worktree, session root, reports, and exact stopped state.
- Any tracked correction makes prior coverage stale and repeats WORK and EVALUATION. Retry a bounded agent or
  Partner operation only when its prior effect is absent or safely reusable.

#### 3.4 Run closure RECORD and return the Note

- For PASS, write and verify the closure gate and receipt, then reread the evaluated tree, branches, checks,
  authority, and active Wrap-up TODO. Apply Wrap-up's Git procedure and [Git](../git/SKILL.md) preferences to
  commit remaining closure changes and merge the exact accepted work head into the configured base branch.
- Prove the resulting base tree equals the evaluated tree. Render `wrap-up/handoff.md` for accepted integration
  or any safe terminal stop, update Configuration, and record exact Git states, retained objects, first unproved
  action, and recovery command; for Complete record `Next TODO: P3 · User Review`, and a Stopped handoff never
  claims Phase 3 completion or opens User Review as a next-phase gate.
- For Complete, activate `P3 · User Review`, display the file, and use Discussion with the runtime ask tool for
  Continue or Stop only, not a design-question card; do not start `P3 · Note` from the file or from the absence
  of an interrupt. Continue completes `P3 · User Review`, then render Wrap-up's
  [Note template](../wrap-up/templates/note.md) from the verified terminal state and complete `P3 · Note` only
  when it agrees with the handoff and result; publication and cleanup remain separate authorized actions.

## References

| Name | Description |
|---|---|
| [Configuration template](templates/configuration.md) | Defines the ignored Workflow configuration and its fixed worktree and session identity. |
| [Handoff template](templates/handoff.md) | Defines each ignored phase-completion and recovery checkpoint. |
| [Gobbi](../gobbi/SKILL.md#23-apply-the-session-wide-finding-gate) | Owns entry, the finding-gate switch after completed `P1 · User Review`, and the session-wide finding gate. |
| [Delegation](../delegation/SKILL.md) | Owns the base specialist brief and final assignment handoff. |
| [Discussion](../discussion/SKILL.md) | Owns context understanding, evidence-backed options, recommendations, Phase 1 user decisions, and User Review Continue / Stop asks. |
| [Ideation](../ideation/SKILL.md) | Owns design work and its indexed result. |
| [Planning](../planning/SKILL.md) | Owns task hierarchy and its indexed result. |
| [Execution](../execution/SKILL.md) | Owns task implementation, verification, and focused commits. |
| [Evaluation](../evaluation/SKILL.md) | Owns independent assessment and each complete report. |
| [Wrap-up](../wrap-up/SKILL.md) | Owns Memory closure, commit, merge, Note delivery, and recovery. |
| [Memory](../memory/SKILL.md) | Owns Temporary Record, durable Memory reconciliation, and session validation. |
| [Git](../git/SKILL.md) | Supplies branch, worktree, commit, integration, and recovery preferences. |
| [Partner](../gobbi/partner/SKILL.md) | Defines each named-runtime invocation, exact session write, and final Handoff. |
