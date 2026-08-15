---
name: workflow
description: "Workflow is a durable Gobbi work mode for one isolated, checkpointed session."
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, AskUserQuestion, TaskCreate, TaskGet, TaskUpdate, TaskList
skill-type: operation
---

# Workflow

Workflow runs one isolated session through Configuration and Ideation, Planning and Execution, then Wrap-up
and Note. Use it when work needs a user-approved design followed by autonomous delivery, durable phase
handoffs, and recovery in the same worktree and session directory.

## Principles

### Route through one native TODO

The native TODO list selects the current phase and stage. Session evidence identifies the active task and
iteration and proves transitions, but it never becomes another route.

### Design together before autonomous delivery

Phase 1 studies the project and develops the best design with the user, main agent, available subagents or
teammates, and enabled Partner. It locks the decisions, authority, and evidence that later phases need.

### Continue autonomously after Phase 1

After the Phase 1 handoff, the manager resolves in-contract choices with available subagents or teammates and
enabled Partner. The manager never asks the user another Workflow question; work either continues within the
locked contract or stops at an exact recovery point.

### Apply one frame in every phase

Every phase uses `DISCUSSION → WORK → EVALUATION → RECORD`. The frame keeps decisions, authorship, independent
judgment, acceptance, and recovery evidence separate.

### Make every phase handoff recoverable

Each phase ends with one verified `handoff.md` for either completion or a safe terminal stop. Recovery continues
only in the worktree and session root recorded by Configuration and the latest handoff.

## Rules

- **MUST use the native TODO list to select the current phase and stage.** Use only `pending`, `in_progress`, and
  `completed`, with at most one item `in_progress`; keep task, iteration, cap, and decision data in session evidence.
- **MUST complete every material user decision in Phase 1.** Study the project and actively use available
  subagents or teammates and enabled Partner before the manager recommends a design for the user's decision.
- **MUST run `DISCUSSION → WORK → EVALUATION → RECORD` in every phase.** Planning and each Execution task
  complete the frame before dependent work starts.
- **MUST apply the recorded participant policy through one ordered writer chain.** One active-runtime writer
  self-reviews; independent local and enabled Partner inputs stay separate until synthesis; EVALUATION uses a
  fresh active-runtime evaluator and, when enabled, one fresh Partner evaluator.
- **MUST write and verify `handoff.md` after every completed phase or safe terminal stop.** Continue or recover
  only in its recorded worktree and session root; never create a replacement for the same Workflow identity.
- **MUST apply Gobbi's [finding gate](../gobbi/SKILL.md#23-apply-the-session-wide-finding-gate).** Every
  correction receives fresh evaluation, and only verified PASS continues automatically.
- **NEVER ask the user a Workflow question after Phase 1 completes.** The manager decides from the accepted
  design, authority, evidence, and independent input; when no safe authorized decision exists, write a stopped
  handoff instead of asking or expanding scope.
- **NEVER accept a report, idle signal, TODO status, handoff, gate, receipt, or summary as completion evidence
  by itself.** Reread the promised result or commit and reproduce its verification.

## Workflow Frame

Each phase applies the same four stages. A phase with more than one productive unit, such as Planning followed
by Execution tasks, completes the frame for each unit before starting its dependent unit.

| Stage | Required action |
|---|---|
| `DISCUSSION` | Freeze the subject, accepted decisions, criteria, authority, cap, participants, absolute paths, and next action. Phase 1 includes the user; later phases use the manager, subagents or teammates, and enabled Partner without a user question. |
| `WORK` | Gather bounded independent input, then have one assigned writer create and self-review the authoritative result at its caller-supplied path. |
| `EVALUATION` | Freeze the actual result and send the same subject and caller criteria to one fresh active-runtime evaluator and, when enabled, one fresh Partner evaluator at exact report paths. |
| `RECORD` | Reread the result and reports, disposition findings, write and verify the gate and receipt, update Configuration progress, and route PASS, REVISE, or FAIL. |

Every Delegation brief names the absolute temporary and final paths, frozen subject, criteria, participant
policy, iteration cap, report paths, `gate.md` path, receipt path, checks, authority, and recovery boundary.
Drafts and independent inputs start at caller-named paths below `{session-root}/tmp/`. Every Partner prompt
also names `{session-root}` as the exact session directory and one exact absolute writing path below `tmp/`;
the manager validates that sole write and the final Handoff before synthesis.

The manager writes `gate.md` through Memory `Temporary Record` with the subject identity, iteration and cap,
criteria, reports, findings and dispositions, decision, and next action. PASS means the criteria are satisfied
with no correction pending; REVISE means an authorized correction remains and the cap permits another
iteration; FAIL means safe in-contract correction is unavailable or the cap is exhausted. One assistant then
writes the RECORD receipt through Memory `Temporary Record` with the unit, stage, iteration, writer, result
locator or commit, verification, reports, gate, decision, next action, and recovery state.

## Procedure

### Phase 1 — Configure and Ideate

Phase 1 uses `DISCUSSION → WORK → EVALUATION → RECORD` to study the project with the user and participants,
produce and assess Ideation, and lock the contract for autonomous continuation.

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
P1 · Handoff
P2 · Planning
P2 · Execution
P2 · Handoff
P3 · Wrap-up
P3 · Handoff
P3 · Note
```

- On recovery, require the recorded identity, branch, registered worktree, absolute worktree, session root,
  configuration, latest handoff, and later valid records to agree. Reconstruct the first unproved TODO and stop
  instead of creating or selecting a replacement worktree or session directory.

#### 1.2 Create the worktree and configuration

- Resolve the Execution cap, participants, systems and waivers, immutable base, publication intent, merge and
  cleanup authority, protected work, and exact current-project Memory root; the Execution cap defaults to three
  total passes per task.
- For a fresh session, capture the original UTC start date, generate one lowercase hyphenated UUID, apply Git
  preferences, and give the worktree and session leaves the byte-equal name
  `<YYYY-MM-DD>-<slug>-<full-uuid>`. Set the session root to
  `{worktree}/.gobbi/projects/{project}/sessions/<session-leaf>/` and render the
  [configuration template](templates/configuration.md) directly below it through Memory `Temporary Record`.
- Verify identity, settings, roots, base, branch, registration, containment, ignored state, tracked tree, base
  checkout, and initial TODO before completing Configuration. Create later directories only when their first
  result needs them.

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
  `<record-directory>/record/iteration-N.md`. Accepted results remain at their owner-defined paths.
- Use these fixed phase handoffs: Phase 1 at `1-ideation/handoff.md`, Phase 2 at
  `3-execution/handoff.md`, and Phase 3 at `wrap-up/handoff.md`.
- Apply Memory `Temporary Record` to each exact ignored output path. Refresh `configuration.md` Progress
  evidence and Latest handoff only after rereading the named result and reproducing its checks.

#### 1.4 Run the Ideation frame and lock direction

- **DISCUSSION:** Study the request, users, project vision, roadmap, design, architecture, current behavior,
  prior decisions, evidence, constraints, and alternatives. Use available subagents or teammates and enabled
  Partner for independent research and design suggestions, then recommend the best-supported options and obtain
  every material user decision about What, Why, How, scope, success, risk, authority, and deferrals.
- **WORK:** Apply [Ideation](../ideation/SKILL.md) through Delegation with the absolute output root
  `{session-root}/1-ideation/outputs/ideation/` and exact locator
  `{session-root}/1-ideation/outputs/ideation/ideation-index.md`. One leader synthesizes and self-reviews the
  indexed result; every material unresolved question returns to this DISCUSSION before the phase closes.
- **EVALUATION → RECORD:** Freeze the index and every listed member, apply the Workflow Frame with a maximum of
  two iterations, and verify membership, order, paths, hashes, tracked-tree state, reports, gate, receipt, and
  finding dispositions. REVISE returns to Phase 1 DISCUSSION; FAIL records the exact stopped state.

#### 1.5 Write the Phase 1 handoff

- Render the [handoff template](templates/handoff.md) at `1-ideation/handoff.md` for Complete or Stopped. Record
  the exact identity, worktree, session root, branch, result and hashes, checks, decisions, authority, findings,
  first unproved action, and recovery command.
- For Complete, record `Next TODO: P2 · Planning`, update Configuration's Latest handoff and Progress evidence,
  complete `P1 · Handoff`, and activate Planning only after every claim agrees. For Stopped, keep the current
  first unproved TODO and never activate Phase 2.
- Display the phase handoff and continue in the same worktree unless the user interrupts. A Complete Phase 1
  handoff closes the user-decision window; all later Workflow routing is autonomous.

### Phase 2 — Plan and Execute

Phase 2 applies `DISCUSSION → WORK → EVALUATION → RECORD` first to Planning and then to every Execution task.
The manager, subagents or teammates, and enabled Partner make later decisions from the locked Phase 1 design.
Prefer re-delegating coherent follow-up to a context-ready teammate after revalidating its role, evidence,
addressability, and write boundary and issuing a complete new Delegation brief.

#### 2.1 Run the Planning frame

- **DISCUSSION:** Enter only from a Complete Phase 1 handoff. The manager uses independent local and enabled
  Partner input to decide the planning approach, criteria, paths, and task boundaries within the accepted design;
  an unresolvable authority or contract conflict stops without a user question.
- **WORK:** Apply [Planning](../planning/SKILL.md) through Delegation with absolute output root
  `{session-root}/2-planning/outputs/planning/` and exact locator
  `{session-root}/2-planning/outputs/planning/plan-index.md`. One leader writes and self-reviews the indexed plan
  while preserving Ideation members and locked decisions.
- **EVALUATION → RECORD:** Freeze the complete plan, run fresh evaluation, and record its gate and receipt with a
  maximum of two iterations. Verify obligation coverage, stable task IDs, dependencies, contexts, writer
  boundaries, indexed membership and hashes, and unchanged tracked state before activating Execution.

#### 2.2 Run each Execution task frame

- **DISCUSSION:** Select the first unproved dependency-ready `task-NN-slug` in plan order. The manager consults
  available subagents or teammates and enabled Partner to settle the in-contract approach, then gives one
  executor exact inputs, paths, authority, criteria, checks, and protected work.
- **WORK:** Apply [Execution](../execution/SKILL.md) through Delegation with one active writer and read-only
  helpers. Require self-review, fresh verification, and one focused local commit for the accepted task.
- **EVALUATION → RECORD:** Freeze the commit and result, run fresh evaluation, and record the gate and receipt
  under the configured Execution cap. Reread the commit, diff, checks, reports, findings, and dispositions before
  the next task; amend only pending plan work when an in-contract plan defect appears.

#### 2.3 Write the Phase 2 handoff

- After every planned task earns PASS, render the handoff template at `3-execution/handoff.md` with the plan,
  task commits, checks, evaluations, decisions, dispositions, exact worktree and session root, and
  `Next TODO: P3 · Wrap-up`.
- On a safe terminal stop, render the same path with `Status: Stopped`, the current first unproved Planning or
  Execution action, retained evidence, and no later TODO activation. For Complete, update Configuration, verify
  the handoff against all named evidence, complete `P2 · Handoff`, and activate Wrap-up.
- Display the phase handoff and continue in the same worktree unless interrupted. Recovery returns to the first
  unproved action without replacing accepted history or asking the user.

### Phase 3 — Wrap Up and Report

Phase 3 applies `DISCUSSION → WORK → EVALUATION → RECORD` to the actual closure. It then integrates only the
evaluated tree and records the terminal handoff and Note.

#### 3.1 Run closure DISCUSSION

- Enter only from a Complete Phase 2 handoff in the configured worktree and session root. Load
  [Wrap-up](../wrap-up/SKILL.md) and inventory accepted results, commits, checks, findings, decisions, exclusions,
  risks, Memory, Git state, authority, and open items.
- Use available subagents or teammates and enabled Partner to review the closure route, merge plan, risks, and
  recovery choices. The manager resolves every in-contract choice from the accepted design and stops without a
  user question when authority, safety, or the locked contract cannot support one route.
- Freeze the closure subject, criteria, participant assignments, exact Memory and session roots, temporary and
  final paths, report paths, gate and receipt paths, cap, checks, merge authority, and protected state.

#### 3.2 Run closure WORK

- Give one assistant the complete session root, exact current-project Memory root, accepted evidence, allowed
  and protected paths, and checks through Delegation. Apply Wrap-up and [Memory](../memory/SKILL.md), then
  self-review the Memory CRUD, retained paths, indexes, links, and complete worktree diff.
- Verify the actual pre-Git tree, task commits, checks, heads, merge plan, authority, risks, and recovery state.
  Keep the response-only Note outside the evaluation subject.
- Stop at the exact recoverable state when any promised closure result, containment check, authority, or
  verification is missing; do not ask the user or invent a replacement route.

#### 3.3 Run closure EVALUATION

- Freeze the actual closure tree and evaluate it with the Memory diff, accepted commits, checks, merge plan,
  authority, exclusions, risks, and recovery paths. Use one fresh active-runtime evaluator and, when enabled,
  one fresh Partner evaluator over the same subject and criteria.
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
  action, and recovery command; a stopped handoff never claims Phase 3 completion.
- Complete `P3 · Handoff` only for accepted closure, then render Wrap-up's
  [Note template](../wrap-up/templates/note.md) from the verified terminal state. Complete `P3 · Note` only when
  it agrees with the handoff and result; publication and cleanup remain separate authorized actions.

## References

| Name | Description |
|---|---|
| [Configuration template](templates/configuration.md) | Defines the ignored Workflow configuration and its fixed worktree and session identity. |
| [Handoff template](templates/handoff.md) | Defines each ignored phase-completion and recovery checkpoint. |
| [Gobbi](../gobbi/SKILL.md#23-apply-the-session-wide-finding-gate) | Owns entry, the Phase 1 user boundary, and the session-wide finding gate. |
| [Delegation](../delegation/SKILL.md) | Owns the base specialist brief and final assignment handoff. |
| [Discussion](../discussion/SKILL.md) | Owns context understanding, evidence-backed options, recommendations, and Phase 1 user decisions. |
| [Ideation](../ideation/SKILL.md) | Owns design work and its indexed result. |
| [Planning](../planning/SKILL.md) | Owns task hierarchy and its indexed result. |
| [Execution](../execution/SKILL.md) | Owns task implementation, verification, and focused commits. |
| [Evaluation](../evaluation/SKILL.md) | Owns independent assessment and each complete report. |
| [Wrap-up](../wrap-up/SKILL.md) | Owns Memory closure, commit, merge, Note delivery, and recovery. |
| [Memory](../memory/SKILL.md) | Owns Temporary Record, durable Memory reconciliation, and session validation. |
| [Git](../git/SKILL.md) | Supplies branch, worktree, commit, integration, and recovery preferences. |
| [Partner](../gobbi/partner/SKILL.md) | Defines each enabled external invocation, exact session write, and final Handoff. |
