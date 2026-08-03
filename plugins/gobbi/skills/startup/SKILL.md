---
name: startup
description: "Use when a caller needs one evidence-backed software-project design interview that produces four accepted phase documents and one confirmed `startup.md`."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, Agent, Task, TaskCreate, TaskGet, TaskUpdate, TaskList, WebSearch, WebFetch
skill-type: operation
---

# Startup

Startup turns project evidence and user decisions into five durable design documents. The caller supplies an
absolute project root, an absolute output directory, and its sole active native TODO lane. The operating
manager owns the route, delegation, direct interview, acceptance, verification, and every user decision.

Schema 3 uses `Project -> Product -> Implementation`. A Project owns one or more independently useful
Products, and every Product owns exactly one Implementation for its complete stack. Categorized tools,
frameworks, runtimes, engines, formats, and languages are entries inside that Implementation, not subjects.

The route completes the Project, every Product, and one Implementation per Product before Finalization. Every
subject runs Problem Definition, Design, Specification, and Lifecycle and Use Cases. Each normal iteration
runs delegated Study, delegated Prepare Topics, manager Interview, delegated Documentation, and delegated
Review until the user accepts the result. Startup produces design evidence, not an implementation plan,
formal evaluation, memory update, publication, or memory-destination decision.

## Principles

### Let evidence and dependency order shape the design

Start from current evidence, then resolve ancestors and earlier phases before relying on them downstream.
Treat each level bank as adaptable coverage, not a script.

### Keep one native route and separate its proof

The runtime TODO selects the current action. `startup.tmp.md`, accepted assignments, and durable sections
prove advancement and reconstruct a lost route without becoming a second route.

### Keep subject identity separate from stack entries

Model one Project, its Products, and exactly one complete Implementation per Product. Record technologies as
categorized entries inside that Implementation and never create interview routes for them.

### Make lifecycle guidance observable at its owning level

Derive scenarios from accepted decisions and give each an observable oracle. Keep Project service use,
Product operation and use, and Implementation development and evolution distinct.

## Rules

- **MUST use the native runtime TODO as Startup's sole progression authority.** The caller supplies one
  uncontested lane, the manager keeps at most one item `in_progress`, and evidence rather than TODO text
  proves advancement.
- **MUST delegate Study, Prepare Topics, Documentation, and Review in every subject phase and Finalization.**
  The manager alone interviews, questions the user, updates the lane, accepts specialist results, and never
  substitutes for an unavailable delegation path.
- **MUST keep one ordered writer and allow parallel work only for independent read-only Study assignments.**
  Give every assignment and checkpoint a fresh identity, current evidence, exact authority, and re-anchored
  scope.
- **MUST ask one user-facing question at a time and obtain explicit acceptance for every subject phase.** A
  correction reopens the earliest owning level, subject, and phase and stales only reachable dependents.
- **MUST review coverage, specificity, vocabulary, consistency, traceability, and cold-reader quality.** Only
  owned nonblocking deferrals may remain; a load-bearing unknown starts a fresh normal iteration.
- **NEVER write when Startup ownership, project/output identity, schema, or safe section ownership is
  unproved.** Never record raw conversation, credentials, secrets, user-marked sensitive values,
  implementation tasks, formal evaluation, or memory destinations.

## Procedure

### Phase 1 — Classify, Open, or Recover the Design Route

#### 1.1 Validate inputs and classify disk before the lane

- Take the absolute project root and absolute output directory. Apply the location contract in
  [`../record/SKILL.md`](../record/SKILL.md) Step 1.1: the output directory must exist, resolve inside the
  working tree, contain no symbolic link in its path, and contain no parent-traversal part.
- The schema-3 durable set is exactly `problem-definition.md`, `design.md`, `specification.md`,
  `lifecycle-and-use-cases.md`, and `startup.md`. `startup.tmp.md` is schema-3 identity and proof, not a
  route cursor.
- The schema-2 durable set is exactly `problem-definition.md`, `project-design.md`,
  `project-specification.md`, `lifecycle-and-use-cases.md`, and `startup.md`. Classify the output directory
  read-only through this table before inspecting, accepting, or changing the caller's lane:

| Disk state | Required action |
|---|---|
| No Startup artifact | Select new schema-3 creation. Validate the lane before creating `startup.tmp.md`. |
| Matching schema-3 `startup.tmp.md` | Validate schema, both identities, Subject Register, Phase Section Register, evidence tables, artifact states, and disk. Validate the lane, then reconstruct the earliest unproved tuple. |
| Complete confirmed schema 3 without `startup.tmp.md` | Verify schema `3`, both Confirmation identities, the four exact child links, every required section's acceptance, and final confirmation. Validate the lane, create evidence with recovery mode `completed-v3 revalidation`, and freshly revalidate in route order. |
| Matching schema-3 `startup.tmp.md` plus complete confirmed schema 3 | Validate the complete set and resume the earliest unproved normal or revalidation tuple. Remove temporary state only after fresh Finalization `PASS`. |
| Complete confirmed schema 2 without temporary state | Verify schema `2`, both Confirmation identities, the four exact schema-2 child links, recorded phase acceptance, and final confirmation. Return its `startup.md` unchanged as `legacy-confirmed` before lane inspection; write, migrate, clean up, and create no TODO. |
| Confirmed pre-schema-2 `startup.md` alone | Return it unchanged as `legacy-confirmed` before lane inspection; do not migrate or interview. |
| Partial, working, or unconfirmed schema 2; mixed schema-2/schema-3 paths; or any partial schema without matching ownership evidence | Stop before lane inspection with no write, migration, or cleanup and report every incompatible path. |
| Unowned Startup path, identity mismatch, unreadable schema, inconsistent register, or ambiguous ownership | Stop before lane inspection with no write and report the exact path and failed field. |

- A schema-3 `startup.md` identifies schema `3`, both absolute identities, and final confirmation in
  `Confirmation`. Its artifact register contains exactly the four aggregate phase children and no self row.
  Each aggregate child begins with a Section Register and the exact `Project`, `Products`, and
  `Implementations` sections.
- Only after classification selects a nonterminal schema-3 action, inspect the proposed sole active TODO
  lane. In Claude Code, use `TaskList` and `TaskGet` to inspect, `TaskCreate` to add an item, and `TaskUpdate`
  to retitle or change status. In native Codex, use `update_plan` to publish the complete ordered list and
  statuses. Stop unless the caller provides a lane with no competing `in_progress` item.
- After accepting lane authority, execute the selected action. For new work, create `startup.tmp.md` from
  [`templates/startup.tmp.md`](templates/startup.tmp.md), record schema `3`, both identities, status
  `in progress`, recovery mode `normal`, no blocker, the Project subject, all phase sections as `absent`, and
  no future-action cursor.

#### 1.2 Validate registers and derive aggregate state

- Read `startup.tmp.md`, every owned aggregate file, `startup.md` when present, and accepted assignment,
  answer, scenario, review, correction, and acceptance evidence. Stop when an identity, stable key, parent,
  section, dependency, or evidence record disagrees with disk and Startup cannot prove the owner.
- The Subject Register contains one Project, Products in accepted stable order, and exactly one stable
  Implementation identity per Product in that same order. Register an Implementation as soon as its Product
  is accepted even when every categorized stack entry is unknown; never register a technology as a subject.
- The Phase Section Register contains four required rows for the Project, four for each Product, and four for
  each Implementation. Each row state is `absent`, `draft`, `reviewed`, `stale`, or `confirmed` and carries
  the level, stable subject key, phase, dependencies, disk evidence, Review evidence, and user acceptance.
- Derive an aggregate file as `confirmed` only when every required current section is confirmed. Any stale
  required section makes it `stale`; otherwise use the earliest incomplete required section's state. Presence
  or whole-file wording never overrides section evidence.

#### 1.3 Reconstruct or initialize the native TODO

- Use one mutable item for each normal subject-phase iteration and this exact title grammar:

```text
Startup · <Project|Product|Implementation> · <stable-subject-key> · <Problem Definition|Design|Specification|Lifecycle and Use Cases> · <STUDY|PREPARE TOPICS|INTERVIEW|DOCUMENTATION|REVIEW|CONTEXT|PASS> · <iteration>
```

- Use `Startup · Finalization · <stage> · <iteration>` for Finalization. Keep at most one item
  `in_progress`; complete the current item before creating any successor.
- Prove `STUDY` with an accepted Study checkpoint, `PREPARE TOPICS` with an accepted prepared set,
  `INTERVIEW` with accepted checkpoints for every prepared answer, `DOCUMENTATION` with the verified exact
  aggregate section, and `REVIEW` with an accepted audit and dispositions. Explicit user acceptance plus
  required section evidence proves subject-phase `PASS`; final confirmation plus verified durable evidence
  proves Finalization `PASS`.
- On a missing, stale, or cosmetically advanced TODO, validate disk and evidence, derive the earliest unproved
  tuple and stage, and repair the native lane. TODO text proves no stage. `startup.tmp.md` holds identity and
  evidence only and must state no future action or route position.
- For `completed-v3 revalidation`, start each current Project, Product, and Implementation phase at `REVIEW`
  in normal route order, followed by fresh explicit user re-acceptance. A clean section reaches `PASS`; a
  finding completes the review-only item at `REVIEW` and starts a normal iteration for that same tuple at
  `STUDY`. Revalidate Finalization after all sections pass.
- Build every specialist assignment with a fresh ID, current TODO tuple and iteration, input evidence,
  accepted dependencies, absolute worktree and output paths, allowed and protected files, expected result,
  verification, authority, and stop conditions. Require `NEEDS_CONTEXT: {one exact question}` instead of
  direct user contact. If no required delegation mechanism or addressable specialist exists, checkpoint the
  blocker and stop recoverably without manager substitution.

### Phase 2 — Complete Every Subject Cycle

#### 2.1 Select the earliest subject and phase

- Use breadth-first level order: complete the singular Project cycle; complete every Product cycle in Subject
  Register order; complete one Implementation cycle per Product in that same Product order; then enter
  Finalization. A cycle completes Problem Definition, Design, Specification, then Lifecycle and Use Cases.
- One Product still requires one Product cycle and one Implementation cycle. Do not start any Product before
  all Project phases pass, any Implementation before all Product cycles pass, or Finalization before every
  required section passes.
- The Project's Design phase cannot pass with zero Products. Checkpoint `CONTEXT`, keep the active item recoverable, and
  let only the manager ask: `Which independently useful Product must this Project own first?` Register the
  accepted Product and its single Implementation; invent no placeholder.
- Create the selected tuple's normal iteration at `STUDY`. Use the same five-stage iteration for every level
  and phase; do not skip a stage because evidence looks complete.

#### 2.2 Run delegated Study

- Enter only at `STUDY`. Delegate a read-only study of project memory, documents, source, configuration,
  tests, history, conventions, accepted ancestor and predecessor sections, and the current evidence record.
  Use authoritative external evidence only when internal sources cannot settle a material design question.
- Independent read-only Study assignments may run in parallel. Every writer assignment remains in the single
  ordered chain.
- Require verified facts, supported claims, contradictions, missing evidence, vocabulary, sources, and
  material questions for the exact level, subject, and phase. Earlier evidence may be reused only after fresh
  Study confirms it remains current.
- The manager verifies the result, then gives the ordered writer a fresh bounded checkpoint into
  `startup.tmp.md`. On `NEEDS_CONTEXT`, go to Step 2.7. Otherwise accept the checkpoint, retitle the item to
  `PREPARE TOPICS`, and continue.

#### 2.3 Run delegated Prepare Topics

- Assign the ordered writer to read the exact phase section in the level bank:
  [`topics/project.md`](topics/project.md), [`topics/product.md`](topics/product.md), or
  [`topics/implementation.md`](topics/implementation.md). Preserve every applicable alias, adapt visible
  wording to the stable subject, record exclusions with reasons, add evidence-derived questions, and order by
  dependency, uncertainty, and consequence.
- Keep each Product and named Product feature distinct. Treat an Implementation as the Product's complete
  stack; prepare technology-category, responsibility, rationale, support, dependency, and exit questions as
  entry questions within it, never as child routes.
- For Lifecycle and Use Cases, first derive level-specific scenario candidates from accepted decisions and
  checkpoint level, stable subject key, identity, class, purpose, linked sections, concrete-scenario blocker,
  oracle blocker, and status. Prepare questions only for a concrete-scenario blocker or observable-oracle
  blocker. Derive proactive implementation-neutral development guidance as required output; missing guidance
  alone does not trigger an interview question.
- The manager verifies coverage and accepts the prepared set. On `NEEDS_CONTEXT`, go to Step 2.7. Otherwise
  retitle the item to `INTERVIEW` and continue.

#### 2.4 Conduct the Interview and checkpoint each answer

- The manager asks exactly one prepared question about the current stable subject. Present verified facts for
  confirmation or correction; otherwise ask for a concrete event, constraint, observable behavior, tradeoff,
  authority, or evidence threshold before accepting a preference or forecast.
- Compare each answer with current decisions. When claims conflict, show both claims, their evidence, and
  dependents and let the user decide which is current or when each applies.
- After each answer, give the ordered writer a fresh bounded checkpoint. Preserve meaning; record level,
  stable subject key, phase, alias, answer kind, evidence, strength, correction effects, and iteration; then
  derive the next unanswered question from evidence. Never merge sibling Product or feature answers merely
  because they share an alias.
- On `NEEDS_CONTEXT`, go to Step 2.7. On a correction, apply Step 2.8. When every prepared answer has an
  accepted checkpoint, retitle the item to `DOCUMENTATION` and continue.

#### 2.5 Run delegated Documentation

- Assign the ordered writer to create or revise only the current level/subject section in the matching
  aggregate template: [`templates/problem-definition.md`](templates/problem-definition.md),
  [`templates/design.md`](templates/design.md), [`templates/specification.md`](templates/specification.md),
  or [`templates/lifecycle-and-use-cases.md`](templates/lifecycle-and-use-cases.md).
- Preserve the aggregate Section Register and exact `Project`, `Products`, and `Implementations` sections.
  Include phase-specific decisions and evidence, question coverage, vocabulary, risks and owned deferrals,
  corrections, Review dispositions, and section acceptance state. State `none found` where appropriate.
- Keep Specification at design-contract level. Exclude code signatures, exhaustive schemas, algorithms,
  repository-layout tasks, and implementation tasks. Keep lifecycle guidance implementation-neutral.
- The manager verifies the exact section against accepted evidence and its template. On `NEEDS_CONTEXT`, go
  to Step 2.7. Otherwise checkpoint it as `draft`, recalculate aggregate state, retitle the item to `REVIEW`,
  and continue.

#### 2.6 Run delegated Review and close or repeat the phase

- Assign a fresh read-only specialist that did not author the section when another addressable specialist is
  available. Supply the level bank section, Study evidence, evidence record, aggregate section, and every
  accepted dependency.
- Require evidence, consequence, and one exact follow-up question for each finding under these lenses:
  missing applicable topics; necessary answers too vague for downstream use; undefined, overloaded, or
  conflicting vocabulary; contradictions and broken traceability; unsupported direction; load-bearing open
  decisions; and cold-reader structure, clarity, completeness, and quality. Request no formal verdict or
  evaluation coverage.
- The manager verifies and checkpoints the audit. On `NEEDS_CONTEXT`, go to Step 2.7. Any finding completes
  the item at `REVIEW` and starts a fresh normal iteration for the same tuple at `STUDY`; never route directly
  to Interview, Prepare Topics, or Documentation.
- With no load-bearing finding, checkpoint the section as `reviewed` and ask for explicit user acceptance.
  Delegate a fresh acceptance checkpoint. A correction or refusal completes the current item and starts a
  fresh normal iteration at `STUDY`; acceptance marks only that section `confirmed`, recalculates aggregate
  state, retitles the item to `PASS`, and completes it.
- Return to Step 2.1 for the unique next tuple. During completed-v3 revalidation, keep review-only routing
  until a finding starts the normal five-stage loop.

#### 2.7 Resolve delegated missing context

- When an assignment returns `NEEDS_CONTEXT`, have the ordered writer checkpoint the blocked assignment and
  its one exact question with level, stable subject key, phase, stage, and iteration. Set Current blocker and
  retitle the active item to `CONTEXT`; specialists never question the user or update the lane.
- Let only the manager ask the checkpointed question. Delegate a fresh bounded answer checkpoint, clear the
  blocker after verification, complete the partial item at `CONTEXT`, and start the same normal tuple at
  `STUDY`. For a Finalization confirmation question, apply Step 3.1's correction, refusal, or confirmation
  branch from `CONTEXT` instead.
- If a checkpoint again returns `NEEDS_CONTEXT`, replace it with the new exact question and repeat. If the
  user or writer is unavailable, set status `paused` and retain blocker, assignment, question, and checkpoint
  evidence; recovery reconstructs `CONTEXT` and continues this step.

#### 2.8 Reopen the earliest affected tuple

- Checkpoint the earlier and current decisions, user resolution, earliest owning level/subject/phase, and
  reachable stale set. Complete the active partial item at its current stage before creating a successor.
- Reopen the actual earliest owner. Mark later phases of that subject, dependent descendant sections, cited
  aggregate sections, and `startup.md` stale. Retain unaffected sibling sections when no dependency reaches
  them, recalculate aggregate states, and start the owner at a fresh normal `STUDY` iteration.
- A lower-level contradiction reopens its actual ancestor owner. A newly accepted Product reopens Project
  Design and registers that Product plus its one Implementation. A categorized technology-entry change
  normally reopens the owning Product's Implementation Design; a Product-contract contradiction reopens the
  Product phase that owns it.

#### 2.9 Enforce level and phase boundaries

- Project phases own initiative reality and outcomes; scope and Product inventory; cross-Product design;
  governance, policy, quality, and service operations; and service-wide lifecycle and use cases.
- Product phases own one independently useful application or platform's consumer problem; boundary, runtime
  form, interfaces, and one Implementation relationship; capabilities, experience, behavior, data, safety,
  recovery contracts; and app or platform operation, use, failure, recovery, upgrade, and retirement.
- Implementation phases own the need and constraints for one complete stack; runtime and interface design
  plus categorized entries; support, configuration, compatibility, testing, security, license, and quality
  contracts; and development, build, test, release, stack use, dependency change, migration, and deprecation.
- For example, `Analytics Workspace` may own `Web Dashboard`, `CLI`, and `Data Platform` Products. Web
  Dashboard has one Implementation with React and TypeScript entries; Data Platform has one Implementation
  with Spark, Trino, Iceberg, and Python entries. Project lifecycle covers a Data Platform outage, Product
  lifecycle covers restoring saved dashboard work, and Implementation lifecycle covers upgrading React and
  verifying the complete stack. If TypeScript also appears in the CLI, record a separate categorized entry
  in that Product's Implementation without adding a route. These examples explain the model and prescribe no
  project content.

### Phase 3 — Finalize and Hand Off

#### 3.1 Run Finalization through the same route

- Enter only after every required Project, Product, and Implementation phase section is confirmed. Create a
  Finalization iteration at `STUDY` and apply the Study, Prepare Topics, Interview, Documentation, Review-
  finding, and missing-context mechanics from Phase 2 to the complete phase set.
- Limit Finalization topics to contradictions, missing cross-phase decisions, stale links, inconsistent
  vocabulary, unowned deferrals, traceability breaks, and synthesis choices. Every Review finding completes
  its item at `REVIEW`; the next Finalization iteration starts at `STUDY`.
- Write `startup.md` from [`templates/startup.md`](templates/startup.md). Make it independently readable with
  exactly four child phase links, the integrated Project/Product/Implementation model, key decisions,
  cross-phase traceability, vocabulary, risks, and final Review dispositions. Record schema `3`, both
  identities, final confirmation, and timestamp in `Confirmation`; add no self row.
- Present the five-file set while Finalization remains at `REVIEW` and delegate the confirmation checkpoint.
  On `NEEDS_CONTEXT`, use Step 2.7, which may leave the active item at `CONTEXT`. After an accepted checkpoint,
  take exactly one branch:
  - A correction, including confirmation that changes an accepted decision, checkpoints the correction,
    completes Finalization at its existing `REVIEW` or `CONTEXT` stage, applies Step 2.8, and creates the
    earliest owner at `STUDY`.
  - A refusal without correction checkpoints the refusal, completes Finalization at its existing `REVIEW` or
    `CONTEXT` stage, and creates a normal Finalization iteration at `STUDY`.
  - Confirmation without correction retitles the current item to `PASS`, completes it, and continues to
    Step 3.2.
- Never leave an old Finalization item active when a successor exists. During completed-v3 revalidation, run
  review-only Finalization; a Review finding starts normal Finalization at `STUDY`, and confirmation uses the
  same three branches.

#### 3.2 Complete, pause, or stop

- On verified Finalization `PASS`, confirm all required aggregate sections are currently accepted, all four
  aggregate files are confirmed, `startup.md` contains the four exact child links and current confirmation
  with both identities, all five durable files exist, and no other durable Startup output exists. Complete
  the TODO, remove the matching `startup.tmp.md`, reread the directory, return all five absolute paths, and
  return the uncontested lane to the caller.
- On pause, keep `startup.tmp.md`, set status `paused`, and preserve the blocker and checkpoint evidence. Add
  no future action or Markdown route cursor. Resume through Step 1.1, classify disk before the lane, and
  reconstruct the earliest unproved tuple from evidence.
- On unsafe state, write nothing further and return the exact blocker and refused path. The caller may record
  confirmed documents as session evidence through [`../record/SKILL.md`](../record/SKILL.md); Startup does
  not evaluate, plan implementation, update memory, publish, or choose a memory destination.

## References

- [`topics/project.md`](topics/project.md)
- [`topics/product.md`](topics/product.md)
- [`topics/implementation.md`](topics/implementation.md)
- [`templates/problem-definition.md`](templates/problem-definition.md)
- [`templates/design.md`](templates/design.md)
- [`templates/specification.md`](templates/specification.md)
- [`templates/lifecycle-and-use-cases.md`](templates/lifecycle-and-use-cases.md)
- [`templates/startup.tmp.md`](templates/startup.tmp.md)
- [`templates/startup.md`](templates/startup.md)
