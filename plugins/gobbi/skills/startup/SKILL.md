---
name: startup
description: "Use when a caller needs one evidence-backed software-project design interview that produces four accepted phase documents and one confirmed `startup.md`."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, Agent, Task, WebSearch, WebFetch
skill-type: operation
---

# Startup

Startup turns project evidence and the user's decisions into five durable project-design documents. The caller
supplies an absolute project root and an absolute output directory. The operating manager owns delegation,
the direct interview, result acceptance, verification, and every user decision.

The work moves through Problem Definition, Project Design, Project Specification, Lifecycle and Use-Case
Scenarios, then Finalization. Each phase repeats `Study -> Prepare Topics -> Interview -> Documentation ->
Review` until its design is complete and the user accepts it. Startup produces design evidence, not an
implementation plan, formal evaluation, or memory update.

## Principles

### Let evidence and dependency order shape the design

Start from current project evidence, then resolve each phase before relying on it downstream. Treat the topic
banks as adaptable coverage, not a script.

### Separate structure from implementation choices

Model `Project -> Application/Deliverable -> Building Block` as the structural hierarchy. Record technologies
and languages in a separate typed many-to-many matrix.

### Make scenarios executable as guidance

Derive lifecycle and use-case scenarios from accepted design decisions. Give each scenario an observable
outcome and an evaluation oracle without prescribing code-level implementation.

### Keep every handoff recoverable

Checkpoint accepted evidence, questions, answers, assignments, artifacts, and reopen effects. Derive resume
from durable state rather than trusting a cached cursor.

## Rules

- **MUST delegate Study, Prepare Topics, Documentation, and Review in every phase and Finalization by required capability and outcome.** The operating manager performs Interview alone and never substitutes for an unavailable delegation path.
- **MUST keep one active ordered writer and allow parallel work only for independent read-only Study assignments.** A specialist never questions the user and returns one exact `NEEDS_CONTEXT` question to the manager when context is missing.
- **MUST ask one user-facing question at a time and obtain explicit user acceptance before advancing from a phase.** A correction reopens the earliest phase that owns the decision and marks every dependent artifact stale.
- **MUST review for missing topics, necessary but unspecific answers, vocabulary needing agreement, cross-document consistency, traceability, and cold-reader document quality.** Review is a gap audit, not a formal evaluation verdict or evaluation coverage.
- **MUST keep only nonblocking open items that record an owner, consequence, resolution method, and reopen condition.** A load-bearing unknown blocks phase acceptance and Finalization.
- **NEVER overwrite an artifact whose Startup ownership and project/output identity cannot be proved.** Never record raw conversation, credentials, secrets, user-marked sensitive values, implementation tasks, formal evaluation, or memory destinations.

## Procedure

### Phase 1 — Open or Recover the Design Set

#### 1.1 Validate inputs and classify existing artifacts

- Take the absolute project root and absolute output directory from the caller. Apply the location contract in
  [`../record/SKILL.md`](../record/SKILL.md) Step 1.1: the output directory must exist, resolve inside the
  working tree, contain no symbolic link in its path, and contain no parent-traversal component.
- The v2 durable set is exactly `problem-definition.md`, `project-design.md`, `project-specification.md`,
  `lifecycle-and-use-cases.md`, and `startup.md`. `startup.tmp.md` is the v2 ownership and resume record.
- Classify the directory before writing:

| State | Action |
|---|---|
| No Startup artifacts | Create `startup.tmp.md` from [`templates/startup.tmp.md`](templates/startup.tmp.md), set schema `2`, record both absolute identities, initialize every artifact as `absent`, and continue to Step 1.2. |
| Schema-2 `startup.tmp.md` with matching identities | Validate its artifact register against disk, repair only a stale cached cursor, and resume through Step 1.2. |
| Matching schema-2 record plus a confirmed v2 `startup.md` | Verify all five durable files are confirmed, remove only the matching temporary record if it remains, and return `startup.md`. |
| Confirmed legacy `startup.md` and no other Startup artifact | Return it unchanged as `legacy-confirmed`. Do not migrate or interview. |
| Legacy working state, mixed legacy/v2 state, or an unconfirmed legacy draft | Stop with no write and report the exact incompatible paths. |
| Any v2 phase file without the matching schema-2 ownership record | Stop with no write and report the unowned path. |
| Identity mismatch, unreadable state, or an artifact Startup cannot prove it owns | Stop with no write and report the failed field and path. |

- A legacy file is a pre-schema-2 Startup artifact. A v2 `startup.md` identifies schema `2`, the project root,
  the output directory, all four phase documents, and final user confirmation.

#### 1.2 Derive the resume point and prepare assignments

- Read the working record and disk. Validate each recorded artifact state as `absent`, `draft`, `reviewed`,
  `stale`, or `confirmed`; downgrade a cached state that disk disproves and stop if ownership is ambiguous.
- Find the earliest phase whose artifact is absent, draft, reviewed without acceptance, or stale. Within that
  phase, derive the earliest incomplete loop step from accepted assignment results, question state, document
  state, and review findings. Use the cached phase, step, iteration, and next question only when they match the
  derivation; otherwise have the ordered writer repair them and record why.
- Build every assignment with the phase, loop iteration, input evidence, accepted predecessor documents,
  absolute worktree and output paths, allowed and protected files, expected result, verification, write or
  read-only authority, and stop conditions. Require the specialist to return `NEEDS_CONTEXT: {one exact
  question}` rather than contacting the user.
- Continue at the derived loop step. If no required delegation mechanism or addressable specialist is
  available, set the working state to `paused`, record the blocked step and recovery action, and stop. The
  manager does not perform that step as fallback.

### Phase 2 — Complete the Four Topic Phases

#### 2.1 Run delegated Study

- Run this step for the current phase through a read-only assignment. Independent evidence questions may be
  studied in parallel; every assignment must remain read-only.
- Study the project memory, documentation, source, configuration, tests, history, conventions, accepted prior
  phase documents, and current working record. Use external authoritative evidence only when internal evidence
  cannot settle a material design question.
- Return verified facts, supported claims, contradictions, missing evidence, vocabulary, sources, and material
  questions. The manager verifies the result, then the ordered writer records the accepted evidence and
  assignment result in `startup.tmp.md`.

#### 2.2 Run delegated Prepare Topics

- Assign the ordered writer to read the current phase bank: [`topics/problem-definition.md`](topics/problem-definition.md),
  [`topics/project-design.md`](topics/project-design.md),
  [`topics/project-specification.md`](topics/project-specification.md), or
  [`topics/lifecycle-and-use-cases.md`](topics/lifecycle-and-use-cases.md).
- Adapt each applicable baseline question to the project's own people, applications, building blocks, data,
  and vocabulary. Drop an inapplicable question with its reason, add context-derived questions, record each
  question's origin, and order questions by dependency, uncertainty, and consequence.
- For Lifecycle and Use-Case Scenarios, first generate scenario candidates from every accepted earlier phase,
  map them to their decisions and artifacts, and identify what prevents a concrete scenario or oracle. Prepare
  interview questions only for those blocking decisions and gaps; never begin from a generic question list.
- The manager verifies coverage and accepts the prepared set. The writer checkpoints topics, questions,
  origins, statuses, scenario candidates when applicable, the next question, and the completed assignment.

#### 2.3 Conduct Interview and checkpoint each answer

- The operating manager asks exactly one prepared question about one subject. Present verified project facts
  for confirmation or correction; otherwise seek a concrete event, constraint, observable behavior, tradeoff,
  authority, or evidence threshold before accepting a preference or forecast.
- Compare the answer with current decisions. When answers conflict, show both claims, their evidence, and their
  dependents; ask the user which is current or when each applies. The user owns the resolution.
- After each answer, assign the ordered writer a bounded checkpoint: normalize the answer without changing its
  meaning, record its question, subject, kind, evidence, and strength, update vocabulary and corrections,
  calculate reopen effects, and derive the next question. The manager rereads and verifies the checkpoint
  before asking another question.
- A correction reopens the earliest owning phase, changes its artifact to `draft` or `stale`, and marks every
  later dependent artifact `stale`. Resume from that phase's Study step. Otherwise repeat this step until no
  prepared question remains, then continue to Step 2.4.

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
  algorithms, repository layout, and implementation tasks. Keep lifecycle development guidance
  implementation-neutral.
- The manager verifies the document against the accepted answers and template, then the writer records the
  artifact as `draft`, the assignment result, and the next step.

#### 2.5 Run delegated Review and close or repeat the phase

- Assign a fresh read-only specialist that did not author the current document when another addressable
  specialist is available. Supply the phase bank, study evidence, working record, current document, and every
  accepted predecessor document.
- Require a gap inventory under these lenses: missing applicable topics; answers that are necessary but not
  specific enough to guide later work; undefined, overloaded, or conflicting vocabulary; contradictions and
  broken traceability; unsupported directions; unresolved load-bearing decisions; and cold-reader structure,
  clarity, completeness, and document quality.
- Review returns findings, evidence, consequence, and exact recommended follow-up questions. It returns no
  `PASS`, `REVISE`, or `FAIL` verdict and creates no formal evaluation coverage. The manager verifies the
  audit; the ordered writer checkpoints its findings and dispositions.
- When a finding needs user input, increment the iteration, add or revise the prepared question, and return to
  Step 2.3. When it needs more evidence or reshaping, increment the iteration and return to Step 2.1 or 2.2.
  A permitted deferral must meet Rule 5; otherwise it remains open.
- When no load-bearing finding remains, mark the artifact `reviewed`, present it to the user, and ask for
  explicit acceptance. A correction returns to the earliest affected step. Acceptance makes the artifact
  `confirmed` and advances in order: Problem Definition, Project Design, Project Specification, then Lifecycle
  and Use-Case Scenarios. Start each next phase at Step 2.1.

#### 2.6 Enforce each phase's design boundary

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
  purpose, linked decisions, actors or source, preconditions, trigger, affected artifacts, flows, state and
  data changes, handoffs, observable outcome, invariants, development guidance, evaluation method, oracle,
  evidence, and deferral or reopen conditions.

### Phase 3 — Finalize and Hand Off

#### 3.1 Run the Finalization loop

- After all four phase artifacts are confirmed, repeat the same five steps for Finalization. Delegate Study
  across the complete phase set; delegate cross-phase topic preparation; let only the manager conduct the
  one-question interview; delegate Documentation of `startup.md`; and delegate a fresh read-only Review.
- Finalization topics are only integration concerns: contradictions, missing cross-phase decisions, stale
  links, inconsistent vocabulary, unowned deferrals, traceability breaks, and synthesis choices. Repeat until
  no load-bearing final finding remains.
- Write `startup.md` from [`templates/startup.md`](templates/startup.md). It must be independently readable,
  link to all four phase documents, summarize the integrated project model and key decisions without copying
  their detail, consolidate vocabulary and risks, and record final review dispositions.
- Present the complete five-file set to the user for final confirmation. A correction reopens its earliest
  owning phase and stales dependent documents; otherwise record confirmation and continue to Step 3.2.

#### 3.2 Complete, pause, or stop

- On final confirmation, have the ordered writer record schema `2`, both absolute identities, the five-file
  artifact register, the user's confirmation, and the timestamp in `startup.md`. Verify all four phase files
  record acceptance, all five durable files exist, and no other durable Startup output was created.
- Remove `startup.tmp.md` only after those checks pass. Reread the output directory and return the absolute
  `startup.md` path plus the four phase-document paths.
- On pause, keep `startup.tmp.md`, set status `paused`, record the derived phase, step, iteration, next question
  or assignment, blocker, and first recovery action, then return its path. Resume through Step 1.1.
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
