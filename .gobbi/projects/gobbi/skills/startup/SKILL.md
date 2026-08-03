---
name: startup
description: "Use when a caller needs one evidence-backed software-project design interview that produces four accepted phase documents and one confirmed `startup.md`."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, Agent, Task, TaskCreate, TaskGet, TaskUpdate, TaskList, WebSearch, WebFetch
skill-type: operation
---

# Startup

Startup turns project evidence and the user's decisions into five durable project-design documents. The caller
supplies an absolute project root, an absolute output directory, and its sole active native TODO lane. The
operating manager owns that route, delegation, the direct interview, result acceptance, verification, and
every user decision; specialists never update the TODO list or question the user.

The work moves through Problem Definition, Project Design, Project Specification, Lifecycle and Use-Case
Scenarios, then Finalization. Each normal iteration runs `Study -> Prepare Topics -> Interview ->
Documentation -> Review`. Startup produces design evidence, not an implementation plan, formal evaluation,
or memory update.

## Principles

### Let evidence and dependency order shape the design

Start from current project evidence, then resolve each phase before relying on it downstream. Treat the topic
banks as adaptable coverage, not a script.

### Keep one native route and separate its proof

The runtime TODO list selects the current action. `startup.tmp.md`, accepted assignments, and durable documents
prove advancement and reconstruct a lost route, but never become a second route.

### Separate structure from implementation choices

Model `Project -> Application/Deliverable -> Building Block` as the structural hierarchy. Record technologies
and languages in a separate typed many-to-many matrix.

### Make scenarios executable as guidance

Derive lifecycle and use-case scenarios from accepted design decisions. Give each scenario an observable
outcome and an evaluation oracle without prescribing code-level implementation.

## Rules

- **MUST use the native runtime TODO list as Startup's sole progression authority.** The caller supplies one
  uncontested lane, the manager keeps at most one item `in_progress`, and accepted evidence rather than TODO
  status proves advancement.
- **MUST delegate Study, Prepare Topics, Documentation, and Review in every phase and Finalization by required
  outcome.** The manager performs Interview alone and never substitutes for an unavailable delegation path.
- **MUST keep one ordered writer and allow parallel work only for independent read-only Study assignments.**
  Prefer the same writer within one phase iteration, but give every checkpoint a fresh assignment ID and
  re-anchored scope.
- **MUST ask one user-facing question at a time and obtain explicit user acceptance before advancing from a
  phase.** A correction reopens the earliest owning phase and marks every dependent artifact stale.
- **MUST review for missing topics, unspecific necessary answers, vocabulary needing agreement, consistency,
  traceability, and cold-reader quality.** Only owned nonblocking deferrals may remain; a load-bearing unknown
  starts another complete iteration.
- **NEVER overwrite an artifact whose Startup ownership and project/output identity cannot be proved.** Never
  record raw conversation, credentials, secrets, user-marked sensitive values, implementation tasks, formal
  evaluation, or memory destinations.

## Procedure

### Phase 1 — Open or Recover the Design Route

#### 1.1 Validate the lane, inputs, and existing artifacts

- Take the caller's sole active TODO lane, absolute project root, and absolute output directory. Apply the
  location contract in [`../record/SKILL.md`](../record/SKILL.md) Step 1.1: the output directory must exist,
  resolve inside the working tree, contain no symbolic link in its path, and contain no parent-traversal
  component.
- Inspect the native TODO list before writing. In Claude Code, use `TaskList` and `TaskGet` to inspect,
  `TaskCreate` to add an item, and `TaskUpdate` to retitle or change status. In native Codex, use `update_plan`
  to publish the complete ordered list and statuses. Stop when the caller cannot provide a lane with no
  competing `in_progress` item. While Startup runs, only its operating manager updates that lane; route
  authority returns to the caller after Finalization reaches verified `PASS`.
- The durable v2 set is exactly `problem-definition.md`, `project-design.md`, `project-specification.md`,
  `lifecycle-and-use-cases.md`, and `startup.md`. `startup.tmp.md` is the schema-2 ownership and evidence
  record, not a route cursor. Classify the output directory before writing:

| State | Action |
|---|---|
| No Startup artifacts | Create `startup.tmp.md` from [`templates/startup.tmp.md`](templates/startup.tmp.md), record schema `2`, both absolute identities, status `in progress`, recovery mode `normal`, no current blocker, and every artifact as `absent`; then continue to Step 1.2. |
| Matching schema-2 `startup.tmp.md` | Validate its identities, evidence tables, and artifact register against disk, then reconstruct the first unproved native TODO through Step 1.2. |
| No `startup.tmp.md`, but a matching confirmed schema-2 `startup.md` and all four registered phase documents | Verify schema `2`, both identities in Confirmation, the four exact child links, each linked file's existence and recorded acceptance, and final confirmation. Create a new schema-2 evidence record with recovery mode `completed-v2 revalidation`, then continue to Step 1.2 for a fresh review-only revalidation of each phase and Finalization. |
| Matching schema-2 `startup.tmp.md` plus a confirmed v2 `startup.md` | Validate the complete set and reconstruct the earliest unproved normal or revalidation stage. Remove the temporary record and return only when it proves fresh review and user acceptance for all four phases, fresh Finalization review and confirmation, and verified Finalization `PASS`. |
| Confirmed legacy `startup.md` and no other Startup artifact | Return it unchanged as `legacy-confirmed`. Do not migrate or interview. |
| Legacy working state, mixed legacy/v2 state, or an unconfirmed legacy draft | Stop with no write and report the exact incompatible paths. |
| Any v2 phase file without a matching schema-2 evidence record or ownership proved by the verified final index | Stop with no write and report the unowned path. |
| Identity mismatch, unreadable state, or an artifact Startup cannot prove it owns | Stop with no write and report the failed field and path. |

- A legacy file is a pre-schema-2 Startup artifact. A v2 `startup.md` identifies schema `2`, the project root,
  the output directory, and final user confirmation in `Confirmation`; its artifact register contains exactly
  the four phase-document children and no row for `startup.md` itself.

#### 1.2 Reconstruct or initialize the native TODO

- Read `startup.tmp.md`, all owned phase documents, and accepted assignment, answer, review, and acceptance
  evidence. Validate each artifact state as `absent`, `draft`, `reviewed`, `stale`, or `confirmed`; downgrade a
  state that disk disproves and stop when ownership is ambiguous.
- Use exactly one mutable item for each phase iteration and this title grammar:

```text
Startup · <Problem Definition|Project Design|Project Specification|Lifecycle and Use-Case Scenarios|Finalization> · <STUDY|PREPARE TOPICS|INTERVIEW|DOCUMENTATION|REVIEW|CONTEXT|PASS> · <iteration>
```

- Create the item when an iteration begins, make it the only `in_progress` item, and retitle it as stages
  advance. An accepted Study assignment proves `STUDY`; an accepted prepared set proves `PREPARE TOPICS`;
  accepted answer checkpoints for every prepared question prove `INTERVIEW`; the verified phase artifact
  proves `DOCUMENTATION`; and an accepted audit proves `REVIEW`. User acceptance or confirmation plus the
  required document evidence proves `PASS`. TODO status alone proves none of them.
- On a missing, stale, or cosmetically advanced TODO after a context boundary, find the first stage not proved
  by those records and correct the native list. Never recreate Current phase, Loop step, Iteration, or Next
  question/assignment fields in `startup.tmp.md`.
- For recovery mode `completed-v2 revalidation`, create a review-only iteration for Problem Definition at
  `REVIEW`. Give each phase and Finalization one fresh delegated Review followed by explicit user
  re-acceptance or reconfirmation. A clean revalidation reaches `PASS` and advances to the next review-only
  iteration; any finding completes that item at `REVIEW` and creates a normal new iteration at `STUDY`.
- Build every specialist assignment with a fresh ID, current TODO, phase and iteration, input evidence,
  accepted predecessor documents, absolute worktree and output paths, allowed and protected files, expected
  result, verification, read-only or writer authority, and stop conditions. Require
  `NEEDS_CONTEXT: {one exact question}` instead of direct user contact. If no required delegation mechanism or
  addressable specialist exists, record the blocker, leave the route recoverable, and stop without manager
  substitution.

### Phase 2 — Complete the Four Topic Phases

#### 2.1 Run delegated Study

- Enter only with the current iteration at `STUDY`. Delegate a read-only study of project memory,
  documentation, source, configuration, tests, history, conventions, accepted predecessor documents, and the
  current evidence record. Use external authoritative evidence only when internal evidence cannot settle a
  material design question.
- Return verified facts, supported claims, contradictions, missing evidence, vocabulary, sources, and
  material questions. Evidence accepted in an earlier iteration may be reused only after this fresh Study
  verifies that it remains current.
- The manager verifies the result, then delegates its checkpoint into `startup.tmp.md`. If either assignment
  returns `NEEDS_CONTEXT`, go to Step 2.6. Otherwise accept the evidence, retitle the item to `PREPARE TOPICS`,
  and continue to Step 2.2.

#### 2.2 Run delegated Prepare Topics

- Assign the ordered writer to read the current phase bank: [`topics/problem-definition.md`](topics/problem-definition.md),
  [`topics/project-design.md`](topics/project-design.md),
  [`topics/project-specification.md`](topics/project-specification.md), or
  [`topics/lifecycle-and-use-cases.md`](topics/lifecycle-and-use-cases.md).
- Adapt each applicable baseline question to the project's people, applications, building blocks, data, and
  vocabulary. Drop an inapplicable question with its reason, add context-derived questions, record each
  origin, and order the set by dependency, uncertainty, and consequence. In Project Specification,
  instantiate the five feature-contract questions once for every named feature and keep each subject distinct.
- For Lifecycle and Use-Case Scenarios, first generate scenario candidates from every accepted earlier phase.
  Checkpoint their identity and class, purpose, linked accepted decisions and artifacts, concrete-scenario
  blocker, oracle blocker, and status in the dedicated evidence table. Prepare questions only for blockers;
  never begin with a generic interview list.
- The manager verifies coverage and accepts the prepared set. If the assignment returns `NEEDS_CONTEXT`, go
  to Step 2.6. Otherwise retitle the item to `INTERVIEW` and continue to Step 2.3.

#### 2.3 Conduct Interview and checkpoint each answer

- The manager asks exactly one prepared question about one subject. Present verified facts for confirmation or
  correction; otherwise seek a concrete event, constraint, observable behavior, tradeoff, authority, or
  evidence threshold before accepting a preference or forecast.
- Compare the answer with current decisions. When claims conflict, show both, their evidence, and their
  dependents; ask the user which is current or when each applies. The user owns the resolution.
- After each answer, give the ordered writer a fresh bounded checkpoint assignment. Preserve the answer's
  meaning; record its question, subject, kind, evidence, and strength; update vocabulary and corrections;
  calculate reopen effects; and derive the next unanswered question from evidence. Never merge answers with
  the same question alias but different feature subjects.
- If a checkpoint returns `NEEDS_CONTEXT`, go to Step 2.6. A correction completes the current partial
  iteration, reopens the earliest owning phase, marks dependent artifacts stale, and creates its next normal
  iteration at `STUDY`. When every prepared question has an accepted checkpoint, retitle the item to
  `DOCUMENTATION` and continue to Step 2.4.

#### 2.4 Run delegated Documentation

- Assign the ordered writer to produce or revise the current phase document from its matching template:
  [`templates/problem-definition.md`](templates/problem-definition.md),
  [`templates/project-design.md`](templates/project-design.md),
  [`templates/project-specification.md`](templates/project-specification.md), or
  [`templates/lifecycle-and-use-cases.md`](templates/lifecycle-and-use-cases.md).
- Organize by design subject, not interview order. Include accepted decisions and evidence, coverage,
  vocabulary, risks and owned deferrals, corrections, review dispositions, and acceptance state. Keep every
  required heading and state `none found` where appropriate.
- Keep Project Specification at design-contract level. Exclude code-level API signatures, exhaustive schemas,
  algorithms, repository layout, and implementation tasks. Keep lifecycle guidance implementation-neutral.
- The manager verifies the document against accepted answers and its template. If the assignment returns
  `NEEDS_CONTEXT`, go to Step 2.6. Otherwise checkpoint it as `draft`, retitle the item to `REVIEW`, and
  continue to Step 2.5.

#### 2.5 Run delegated Review and close or repeat the phase

- Assign a fresh read-only specialist that did not author the current document when another addressable
  specialist is available. Supply the phase bank, Study evidence, evidence record, current document, and
  every accepted predecessor document.
- Require findings with evidence, consequence, and exact follow-up question under these lenses: missing
  applicable topics; necessary answers too vague for later work; undefined, overloaded, or conflicting
  vocabulary; contradictions and broken traceability; unsupported directions; unresolved load-bearing
  decisions; and cold-reader structure, clarity, completeness, and quality. Return no formal verdict or
  evaluation coverage.
- The manager verifies the audit, then delegates its checkpoint. If either assignment returns `NEEDS_CONTEXT`,
  go to Step 2.6. When Review produces any finding, complete the iteration at `REVIEW`, create the next
  iteration at `STUDY`, and repeat the entire five-step loop. Do not route a finding directly to Interview,
  Prepare Topics, or Documentation.
- When no load-bearing finding remains, checkpoint the artifact as `reviewed` and ask the user for explicit
  acceptance. Delegate the acceptance checkpoint and go to Step 2.6 if it returns `NEEDS_CONTEXT`. A
  correction or refusal completes the iteration and starts the next normal iteration at `STUDY`. Acceptance
  marks the artifact `confirmed`, retitles the current item to `PASS`, and completes it.
- Advance by creating Problem Definition, Project Design, Project Specification, and Lifecycle and Use-Case
  Scenarios iterations in that order. A normal next phase begins at `STUDY`; a completed-v2 revalidation next
  phase begins at `REVIEW` until a finding switches that phase to the normal loop.

#### 2.6 Resolve delegated missing context

- When any delegated assignment returns `NEEDS_CONTEXT`, have the ordered writer checkpoint the blocked
  assignment and its one exact question, set Current blocker, and retitle the current item to `CONTEXT`.
  Specialists remain unable to question the user or update the TODO.
- Let only the manager ask that exact question. Delegate a fresh bounded checkpoint of the answer, clear the
  blocker after verification, complete the partial iteration at `CONTEXT`, and create the next iteration at
  `STUDY`. If that checkpoint also returns `NEEDS_CONTEXT`, replace the checkpoint with its exact question and
  repeat this step. Never resume the interrupted step directly.
- If the user or a writer is unavailable, keep status `paused`, the blocker, the blocked assignment, the exact
  question, and the first recovery action in `startup.tmp.md`. On recovery, reconstruct `CONTEXT` from that
  evidence and continue this step.

#### 2.7 Enforce each phase's design boundary

- Problem Definition owns current reality, problem and causes, affected people and tasks, alternatives and
  adoption, desired outcomes and success evidence, assumptions, constraints, risks, and non-goals.
- Project Design owns scope and context; `Project -> Application/Deliverable -> Building Block`; the typed
  technology/language matrix; architecture, runtime, deployment, quality priorities, build/buy/adopt strategy,
  differentiation, tradeoffs, evidence-to-change, and the outcome-horizon roadmap.
- Project Specification owns capabilities, experience, accessibility, interfaces, behavior, state and data
  contracts, integrations, compatibility, failure and recovery, security, privacy, safety, delivery,
  operations, quality, verification, binding policies, governance, conventions, and ownership.
- Lifecycle and Use-Case Scenarios owns normal, alternate, invalid, failure and recovery, abuse, migration,
  upgrade, rollback, maintenance, deprecation, and end-of-life paths. Each scenario records identity, class,
  purpose, linked decisions, source, preconditions, trigger, affected artifacts, flows, state and data changes,
  handoffs, observable outcome, invariants, development guidance, evaluation method, oracle, evidence, and
  deferral or reopen conditions.

### Phase 3 — Finalize and Hand Off

#### 3.1 Run Finalization through the same route

- After all four phase artifacts are confirmed, create a Finalization iteration at `STUDY`. Apply the Study,
  Prepare Topics, Interview, Documentation, Review-finding, and missing-context mechanics in Steps 2.1 through
  2.6 to the complete phase set, but replace topic-phase acceptance with final confirmation below. Delegate
  cross-phase Study and topic preparation, let only the manager interview, delegate Documentation of
  `startup.md`, and delegate a fresh read-only Review.
- Limit Finalization topics to contradictions, missing cross-phase decisions, stale links, inconsistent
  vocabulary, unowned deferrals, traceability breaks, and synthesis choices. Every Review finding completes
  its iteration at `REVIEW`; the next iteration starts at `STUDY`.
- Write `startup.md` from [`templates/startup.md`](templates/startup.md). It must be independently readable and
  contain a four-child phase-document artifact register, integrated project model, key decisions,
  consolidated vocabulary and risks, and final review dispositions. Keep schema, project root, output
  directory, final confirmation, and its timestamp in `Confirmation`; do not add a self row to the register.
- Present the five-file set for final confirmation and delegate its checkpoint. Go to Step 2.6 if it returns
  `NEEDS_CONTEXT`. A correction reopens the earliest owner and starts a normal iteration there at `STUDY`.
  Confirmation retitles Finalization to `PASS` and continues to Step 3.2. During completed-v2 revalidation,
  run this step as a review-only Finalization iteration; any finding starts a normal Finalization iteration at
  `STUDY`.

#### 3.2 Complete, pause, or stop

- On verified Finalization `PASS`, confirm all four phase files record current acceptance, `startup.md`
  records the four child links and current confirmation with both identities, all five durable files exist,
  and no other durable Startup output was created. Complete the TODO item, remove `startup.tmp.md`, reread the
  output directory, return all five absolute paths, and return the native TODO lane to the caller.
- On pause, keep `startup.tmp.md`, set status `paused`, and record the current blocker, blocked evidence, and
  first recovery action. Do not add a Markdown phase, step, iteration, or next-question cursor. Resume through
  Step 1.1 and reconstruct the native route from evidence.
- On unsafe state, write nothing further and return the exact blocker and refused path. The caller may record
  confirmed documents as session evidence through [`../record/SKILL.md`](../record/SKILL.md); Startup does
  not evaluate, plan implementation, update memory, publish, or choose a memory destination.

## References

- [`topics/problem-definition.md`](topics/problem-definition.md)
- [`topics/project-design.md`](topics/project-design.md)
- [`topics/project-specification.md`](topics/project-specification.md)
- [`topics/lifecycle-and-use-cases.md`](topics/lifecycle-and-use-cases.md)
- [`templates/problem-definition.md`](templates/problem-definition.md)
- [`templates/project-design.md`](templates/project-design.md)
- [`templates/project-specification.md`](templates/project-specification.md)
- [`templates/lifecycle-and-use-cases.md`](templates/lifecycle-and-use-cases.md)
- [`templates/startup.tmp.md`](templates/startup.tmp.md)
- [`templates/startup.md`](templates/startup.md)
