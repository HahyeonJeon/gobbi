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

Every productive unit uses `DISCUSSION → WORK → RECORD`. Execution tasks and Wrap-up insert `REVIEW`
between WORK and RECORD so independent judgment stays separate; Ideation and Planning skip it, and User
Review stays outside the frame.

### Make every phase handoff recoverable

Each phase ends with one verified `handoff.md` for either completion or a safe terminal stop. Recover only in
the worktree and session root recorded by Configuration and the latest handoff.

## Rules

- **MUST use the native TODO list to select the current phase and stage.** Use only `pending`, `in_progress`, and
  `completed`, with at most one item `in_progress`; keep task, iteration, and decision data in session evidence.
- **MUST apply [Discussion](../discussion/SKILL.md) through the recorded participant policy before presenting
  project/work options or asking for a required Phase 1 user decision.** The manager selects available subagents
  or teammates and each launchable remaining Partner, routes any needed focused follow-up to an addressable
  subagent or teammate, and after completed `P1 · User Review` asks only Continue or Stop.
- **MUST run `DISCUSSION → WORK → RECORD` for every productive unit, and insert `REVIEW` between WORK and
  RECORD only for Execution tasks and Wrap-up.** Planning and each Execution task complete that unit before
  dependent work starts.
- **MUST apply the recorded participant policy through one ordered writer chain.** One active-runtime writer
  self-reviews; independent local and remaining Partner inputs stay separate until synthesis; REVIEW, when
  the unit includes it, uses a fresh matching-specialist agent and one attempted invocation per remaining runtime.
- **MUST write and verify `handoff.md` after every completed phase or safe terminal stop.** Recover only in its
  recorded worktree and session root; never create a replacement for the same Workflow identity.
- **NEVER accept a report, idle signal, TODO status, handoff, gate, receipt, or summary as completion evidence
  by itself.** Reread the promised result or commit and reproduce its verification.

## Procedure

### Phase 1 — Configure and Ideate

Phase 1 uses `DISCUSSION → WORK → RECORD` to study the project with the user and participants, produce
Ideation, and lock the contract. It idle-waits after Configuration until delivered work exists, then waits at
`P1 · User Review` after a Complete `handoff.md`.

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
- Resolve the participants, systems and waivers, immutable base, publication intent, merge and cleanup
  authority, protected work, and exact current-project Memory root. For a fresh session, capture the original
  UTC start date, generate one lowercase hyphenated UUID, apply Git preferences from the recorded
  `Base branch` without asking which branch is the base, give the worktree and session leaves the byte-equal
  name `<YYYY-MM-DD>-<slug>-<full-uuid>`, set the session root to
  `{worktree}/.gobbi/projects/{project}/sessions/<session-leaf>/`, and render the
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

```text
<record-directory>/review/iteration-N/
  gate.md
  <runtime>/
    report.md
    checklist.md
```

- Use that review layout only for Execution tasks and Wrap-up, with runtime tokens `claude-code`,
  `codex`, `cursor`, and `grok`, and place the receipt at `<record-directory>/record/iteration-N.md` for every
  productive unit, including Ideation and Planning. Do not use `claude` or alias historical names such as
  `codex.md`; accepted results remain at their owner-defined paths, and later directories are created only
  when their first result needs them.
- Use these fixed phase handoffs: Phase 1 at `1-ideation/handoff.md`, Phase 2 at
  `3-execution/handoff.md`, and Phase 3 at `wrap-up/handoff.md`, and apply Memory `Temporary Record` to each
  exact ignored output path. Do not update `configuration.md` after the Configuration write except when
  writing a phase `handoff.md`, and then set only `Latest handoff` to that path.
- Complete `P1 · Configuration` as an idle wait after those location rules are recorded. Leave every later
  item `pending` with no item `in_progress`, and do not run 1.4 or activate `P1 · Ideation`.

#### 1.4 Discuss and lock project/work design

- Enter only when Configuration is complete and delivered work exists: a user statement of the outcome, topic,
  or request, not mode, slug, partner policy, "continue", "ok", "looks good", or repository state. Use a concrete
  outcome already in the session after Configuration; otherwise idle-wait with no item `in_progress` and allow
  only a request for the user to state the work.
- Activate `P1 · Ideation` and define project/work design and decisions as choices whose viable answers can
  change the project/work goal, requirements, scope or boundary, observable behavior, policy, strategy,
  algorithm, pattern or design direction, safety or privacy risk, authority, cost, dependency or reversibility,
  or acceptance.
- Apply [Discussion](../discussion/SKILL.md) under the Phase 1 collaboration Rule and recorded participant policy,
  and record any unavailable required participant. Present its final synthesized project/work options and
  recommendation, then record every required user decision.

#### 1.5 Produce and record Ideation

- **WORK:** Select [Coding Ideation](../coding/coding-ideation/SKILL.md) when the productive design subject has an
  unresolved material code-design choice, [Authoring Ideation](../authoring/authoring-ideation/SKILL.md) when it
  has an unresolved material writing-design choice, or [Design Ideation](../design/design-ideation/SKILL.md)
  when it has an unresolved material visual-design choice. Apply the selected operation
  through Delegation with that skill's complete caller contract plus Workflow's project/work scope,
  recorded participant discussion records,
  fixed output root `{session-root}/1-ideation/outputs/ideation/`, exact locator
  `{session-root}/1-ideation/outputs/ideation/ideation-index.md`, and recovery boundary. Route a returned
  decision package to Step 1.4, then resume the matching specialist only from the recorded answer.
- **RECORD:** Reread the indexed result, reproduce membership, order, path, hash, and tracked-tree checks, and
  write the receipt without reports, checklists, or `gate.md`. Return to Step 1.4 only for missing or
  contradictory project/work design, required participant discussion, or a required user decision, and return
  to WORK when the indexed result is incomplete.

#### 1.6 Write the Phase 1 handoff and wait at User Review

- Render the [handoff template](templates/handoff.md) at `1-ideation/handoff.md` for Complete or Stopped. Record
  the exact identity, worktree, session root, branch, result and hashes, checks, decisions, authority, findings,
  first unproved action, and recovery command.
- For Complete, record `Next TODO: P1 · User Review`, set `configuration.md` `Latest handoff` to
  `1-ideation/handoff.md`, activate `P1 · User Review`, display the file, and use [Discussion](../discussion/SKILL.md) with
  the runtime ask tool for Continue or Stop only, not a design-question card. For Stopped, keep the current
  first unproved productive TODO and do not activate User Review as a next-phase gate.
- Do not activate Planning from the file, from silence, or from the absence of an interrupt. Continue
  completes `P1 · User Review` and then activates `P2 · Planning`; Stop leaves User Review `in_progress` or
  records a stop and does not activate Planning or rewrite the Complete file into a failed phase.

### Phase 2 — Plan and Execute

Phase 2 applies `DISCUSSION → WORK → RECORD` to Planning, then `DISCUSSION → WORK → REVIEW → RECORD` to
every Execution task. Enter only from completed `P1 · User Review`; the manager, subagents or teammates, and
remaining Partner runtimes make later in-frame decisions from the locked Phase 1 design, then wait at
`P2 · User Review`. Prefer re-delegating coherent follow-up to a context-ready teammate after revalidating its
role, evidence, addressability, and write boundary and issuing a complete new Delegation brief.

#### 2.1 Run the Planning DISCUSSION and WORK

- **DISCUSSION:** Enter only from completed `P1 · User Review`. The manager uses independent local and remaining
  Partner input to decide the planning approach, criteria, paths, and task boundaries within the accepted
  design; an unresolvable authority or contract conflict stops without a design question.
- **WORK:** Select [Coding Planning](../coding/coding-planning/SKILL.md) when the productive work is code
  work, [Authoring Planning](../authoring/authoring-planning/SKILL.md) when it is writing work, or
  [Design Planning](../design/design-planning/SKILL.md) when it is visual work. Apply the selected
  operation through Delegation with absolute output root
  `{session-root}/2-planning/outputs/planning/` and exact locator
  `{session-root}/2-planning/outputs/planning/plan-index.md`. One matching-specialist agent writes and self-reviews the indexed plan
  while preserving Ideation members and locked decisions.

#### 2.2 Record Planning

- **RECORD:** Reread the indexed plan, reproduce membership, order, path, hash, and tracked-tree checks, and
  write the receipt without reports, checklists, or `gate.md`. Return to Step 2.1 only for missing or
  contradictory decomposition, grouping, order, assignment-contract field, authority, or indexed integrity,
  then verify obligation coverage, stable task IDs, dependencies, writer frontier, indexed membership and
  hashes, and unchanged tracked state before activating Execution.

#### 2.3 Run each Execution task

- **DISCUSSION:** Select the first unproved dependency-ready `task-NN-slug` in plan order. The manager consults
  available subagents or teammates and remaining Partner runtimes to settle the in-contract approach, then
  gives one matching-specialist agent exact inputs, paths, authority, criteria, checks, and protected work.
- **WORK:** Apply the matching domain execution skill:
  [Coding Execution](../coding/coding-execution/SKILL.md) when the writer frontier includes code,
  [Authoring Execution](../authoring/authoring-execution/SKILL.md) when it includes durable prose, or
  [Design Execution](../design/design-execution/SKILL.md) when it includes visual work.
  Keep one active writer, read-only helpers, self-review, fresh verification, and one
  focused local commit. An in-stage review cannot replace mandatory user-called or stage review.
- **REVIEW:** Freeze the commit and result, name `review-depth` `execution-implementation`,
  apply the matching domain review skill, and launch remaining runtimes from the recorded set minus the active
  runtime with write set `runtime-directory`; if that set is empty, launch nothing, and a missing write set is
  `writing-path-only` and cannot complete REVIEW. A runtime directory that holds only one of `report.md` and
  `checklist.md` is incomplete and never PASS input.
- **RECORD:** Write `gate.md` from contract-gate verdicts only. PASS means criteria are met with no correction
  pending. REVISE means an authorized correction remains; return to this task's WORK with a new `iteration-N`.
  FAIL means a safe correction is unavailable; stop and do not start the next task. Write and verify the
  receipt at `<record-directory>/record/iteration-N.md`. Quality `does-not-meet` with contract-gate PASS is
  not REVISE, and after completed `P1 · User Review` out-of-contract opinions do not reopen design. Any
  tracked correction makes prior coverage stale and repeats WORK and REVIEW. After PASS, reread the commit,
  diff, checks, reports, findings, and dispositions before the next task and amend only pending plan work
  when an in-contract plan defect appears.

#### 2.4 Write the Phase 2 handoff and wait at User Review

- After every planned task earns PASS, render the handoff template at `3-execution/handoff.md` with the plan,
  task commits, checks, reviews, decisions, dispositions, exact worktree and session root, and
  `Next TODO: P2 · User Review`.
- On a safe terminal stop, render the same path with `Status: Stopped`, the current first unproved Planning or
  Execution action, retained evidence, and no User Review activation as a next-phase gate. For Complete, set
  `configuration.md` `Latest handoff` to `3-execution/handoff.md`, verify the handoff against all named evidence,
  activate `P2 · User Review`, display the file, and use Discussion with the runtime ask tool for Continue or
  Stop only, not a design-question card.
- Do not activate Wrap-up from the file, from silence, or from the absence of an interrupt. Continue completes
  `P2 · User Review` and then activates `P3 · Wrap-up`; Stop leaves User Review `in_progress` or records a stop
  and does not activate Wrap-up; recovery returns to the first unproved action without replacing accepted
  history or asking a design question.

### Phase 3 — Wrap Up and Report

Phase 3 applies `DISCUSSION → WORK → REVIEW → RECORD` to the actual closure. It then integrates only the
reviewed tree, writes the terminal `handoff.md`, waits at `P3 · User Review`, and returns the Note after
Continue.

#### 3.1 Run closure DISCUSSION

- Enter only from completed `P2 · User Review` in the configured worktree and session root. Load
  [Wrap-up](../wrap-up/SKILL.md) and inventory accepted results, commits, checks, findings, decisions, exclusions,
  risks, Memory, Git state, authority, and open items.
- Use available subagents or teammates and remaining Partner runtimes to review the closure route, merge plan,
  risks, and recovery choices. The manager resolves every in-contract choice from the accepted design and
  stops without a design question when authority, safety, or the locked contract cannot support one route.
- Freeze the closure subject, criteria, participant assignments, exact Memory and session roots, temporary and
  final paths, per-runtime `report.md` and working `checklist.md` paths, `gate.md` and receipt paths,
  checks, merge authority, and protected state.

#### 3.2 Run closure WORK

- Give one assistant the complete session root, exact current-project Memory root, accepted evidence, allowed
  and protected paths, and checks through Delegation. Apply Wrap-up and [Memory](../memory/SKILL.md), then
  self-review the Memory CRUD, retained paths, indexes, links, and complete worktree diff.
- Verify the actual pre-Git tree, task commits, checks, heads, merge plan, authority, risks, and recovery state.
  Keep the response-only Note outside the review subject.
- Stop at the exact recoverable state when any promised closure result, containment check, authority, or
  verification is missing; do not ask a design question or invent a replacement route.

#### 3.3 Run closure REVIEW

- Freeze the actual closure tree, name `review-depth` `by-owning-stage`, and review it with the Memory
  diff, accepted commits, checks, merge plan, authority, exclusions, risks, and recovery paths. Use one fresh
  matching-specialist agent and one Partner wrapper per remaining runtime at
  `wrap-up/review/iteration-N/<runtime>/{report.md,checklist.md}` with write set `runtime-directory`; if
  that set is empty, launch nothing, a missing write set is `writing-path-only` and cannot complete REVIEW,
  and an Unavailable attempt produces Unavailable evidence, not a Partner Handoff.
- Apply the Workflow gate from contract-gate verdicts only: PASS when criteria are met with no correction
  pending, REVISE when an authorized correction remains and then return to Phase 3 DISCUSSION and repeat the
  changed WORK, and FAIL when a safe correction is unavailable. A runtime directory that holds only one of
  `report.md` and `checklist.md` is incomplete and never PASS input; quality `does-not-meet` with contract-gate
  PASS is not REVISE, and after completed `P1 · User Review` out-of-contract opinions do not reopen design.
- Any tracked correction makes prior coverage stale and repeats WORK and REVIEW. Retry a bounded agent or
  Partner operation only when its prior effect is absent or safely reusable.

#### 3.4 Run closure RECORD and return the Note

- For PASS, write and verify the closure gate and receipt, then reread the reviewed tree, branches, checks,
  authority, and active Wrap-up TODO. Apply Wrap-up's Git procedure and [Git](../git/SKILL.md) preferences to
  commit remaining closure changes and merge the exact accepted work head into the configured base branch.
- Prove the resulting base tree equals the reviewed tree. Render `wrap-up/handoff.md` for accepted integration
  or any safe terminal stop, set `configuration.md` `Latest handoff` to that path, and record exact Git states,
  retained objects, first unproved action, and recovery command in the handoff; for Complete record
  `Next TODO: P3 · User Review`, and a Stopped handoff never claims Phase 3 completion or opens User Review as a
  next-phase gate.
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
| [Delegation](../delegation/SKILL.md) | Owns the base specialist brief, skills and docs indexes, and final assignment handoff. |
| [Discussion](../discussion/SKILL.md) | Owns context understanding, evidence-backed options, recommendations, Phase 1 user decisions, and User Review Continue / Stop asks. |
| [Coding Planning](../coding/coding-planning/SKILL.md) | Owns Phase 2 code-work decomposition and its indexed result. |
| [Authoring Planning](../authoring/authoring-planning/SKILL.md) | Owns Phase 2 writing-work decomposition and its indexed result. |
| [Design Planning](../design/design-planning/SKILL.md) | Owns Phase 2 visual-work decomposition and its indexed result. |
| [Coding Ideation](../coding/coding-ideation/SKILL.md) | Owns Phase 1 code design and its indexed result. |
| [Authoring Ideation](../authoring/authoring-ideation/SKILL.md) | Owns Phase 1 writing design and its indexed result. |
| [Design Ideation](../design/design-ideation/SKILL.md) | Owns Phase 1 visual design and its indexed result. |
| [Coding Execution](../coding/coding-execution/SKILL.md) | Owns code-task implementation, verification, and the commit-or-retain handoff inside a matching Execution WORK stage. |
| [Authoring Execution](../authoring/authoring-execution/SKILL.md) | Owns writing-task implementation, verification, and the commit-or-retain handoff inside a matching Execution WORK stage. |
| [Design Execution](../design/design-execution/SKILL.md) | Owns visual-task implementation, verification, and the commit-or-retain handoff inside a matching Execution WORK stage. |
| [Coding Review](../coding/coding-review/SKILL.md) | Owns independent code assessment and each complete `report.md` plus working `checklist.md`. |
| [Authoring Review](../authoring/authoring-review/SKILL.md) | Owns independent writing assessment and each complete `report.md` plus working `checklist.md`. |
| [Design Review](../design/design-review/SKILL.md) | Owns independent visual assessment and each complete `report.md` plus working `checklist.md`. |
| [Wrap-up](../wrap-up/SKILL.md) | Owns Memory closure, commit, merge, Note delivery, and recovery. |
| [Memory](../memory/SKILL.md) | Owns Temporary Record, durable Memory reconciliation, and session validation. |
| [Git](../git/SKILL.md) | Supplies branch, worktree, commit, integration, and recovery preferences. |
| [Partner](../gobbi/partner/SKILL.md) | Defines each named-runtime invocation, worktree write root, and final Handoff. |
