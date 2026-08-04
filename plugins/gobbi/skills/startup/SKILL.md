---
name: startup
description: "Use when a caller needs one evidence-backed software-project design interview that produces four accepted phase documents and one confirmed `startup.md`."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, Agent, Task, TaskCreate, TaskGet, TaskUpdate, TaskList, WebSearch, WebFetch
skill-type: operation
---

# Startup

Startup turns project evidence and user decisions into five durable design documents. The caller supplies an
absolute project root, an absolute output directory, and its sole native TODO lane. The manager owns the
route, delegation, interview, acceptance, verification, and every user decision.

Schema 3 uses `Project -> Product -> Implementation`. A Project owns one or more independently useful
Products. Each Product owns exactly one Implementation for its complete stack; technologies are categorized
entries inside that Implementation, not subjects.

The route completes the Project, every Product, and one Implementation per Product before Finalization. Each
subject runs four phases through delegated Study, Prepare Topics, Documentation, and Review around the
manager's Interview. Startup produces design evidence, not implementation planning, formal evaluation,
memory, publication, or a memory-destination decision.

## Principles

### Let evidence and dependency order shape the design

Resolve ancestors and earlier phases before using them downstream. Treat each level bank as adaptable
coverage, not a script.

### Keep one native route and separate its proof

The TODO selects the current action. Durable section registers and `startup.tmp.md` evidence prove progress
without creating a second route.

### Keep subject identity separate from stack entries

Model one Project, its Products, and one complete Implementation per Product. Record technologies only as
categorized entries inside the owning Implementation.

### Make lifecycle guidance observable at its owning level

Derive scenarios from accepted decisions and give each an observable oracle. Keep Project service use,
Product operation and use, and Implementation development and evolution distinct.

## Rules

- **MUST use the native TODO as Startup's sole progression owner.** Keep at most one item `in_progress`;
  evidence, not its title, proves progress.
- **MUST delegate Study, Prepare Topics, Documentation, and Review in every subject phase and Finalization.**
  Only the manager interviews, asks the user, updates the lane, and accepts results.
- **MUST keep one ordered writer and allow parallel work only for independent read-only Study.** Every
  assignment and checkpoint uses a fresh identity, current evidence, exact authority, and absolute paths.
- **MUST ask one user question at a time and obtain explicit acceptance for every subject phase.** Route every
  decision-changing answer through Step 2.7; a refusal without correction remains a separate branch.
- **MUST apply the exact Review taxonomy in Step 2.5.** A finding needs evidence, consequence, one exact
  follow-up question, and disposition; only owned nonblocking deferrals may remain.
- **NEVER write when ownership, project/output identity, schema, or section ownership is unproved.** Do not
  record raw conversation, secrets, sensitive values, implementation tasks, evaluation, or memory targets.

## Procedure

### Phase 1 — Classify, Open, or Recover the Design Route

#### 1.1 Validate inputs and classify disk before the lane

- Take the absolute project root and output directory. Require both paths to exist inside the verified
  worktree, resolve without a symbolic-link escape or parent-traversal component, and keep every Startup
  output below the resolved output directory.
- Schema 3 is exactly `problem-definition.md`, `design.md`, `specification.md`,
  `lifecycle-and-use-cases.md`, and `startup.md`. Schema 2 replaces `design.md` and `specification.md` with
  `project-design.md` and `project-specification.md`. Confirmed schema 2 requires no `startup.tmp.md`, that
  exact five-file set with no schema-3 mixture, and a `startup.md` that declares schema `2`, records both exact
  absolute identities, and records terminal user confirmation. Its Phase Document Artifact Register has
  exactly `problem-definition.md`, `project-design.md`, `project-specification.md`, and
  `lifecycle-and-use-cases.md` as child rows, with no duplicate, extra, or self row; every linked child exists
  and is readable, every `Status` resolves to literal `confirmed`, and every `Accepted` value is
  non-placeholder. Those rows own phase acceptance; do not require acceptance inside the child documents.
  Confirmed pre-schema 2 requires `startup.md` as the only Startup artifact, no schema 2 or 3 claim, and a
  `Confirmation` section with both exact identities and user confirmation. Only either completely proved
  historical shape returns the exact existing `startup.md` unchanged as `legacy-confirmed` before lane
  inspection; any failed path or field takes the unsafe stop with no write, TODO, cleanup, or migration.
  `startup.tmp.md` is schema-3 evidence, not durable output.
- Classify the directory read-only before inspecting or changing the lane:

| Disk state | Required action |
|---|---|
| No Startup artifact | Select schema-3 creation; validate the lane before creating evidence. |
| Matching schema-3 temporary record | Validate identities, registers, evidence, and disk; then validate the lane and recover from evidence. |
| Complete confirmed schema 3 without temporary state | Validate it; after lane validation start `completed-v3 revalidation`. |
| Matching temporary state plus complete confirmed schema 3 | Resume the earliest unproved normal or revalidation work. |
| Complete confirmed schema 2 without temporary state | Return its `startup.md` unchanged as `legacy-confirmed` before lane inspection. |
| Confirmed pre-schema-2 `startup.md` alone | Return it unchanged as `legacy-confirmed` before lane inspection. |
| Partial, working, unconfirmed, or mixed legacy/current state | Stop before lane inspection with no write, migration, cleanup, or TODO creation; report every path. |
| Unowned, mismatched, unreadable, or ambiguously owned state | Stop before lane inspection with no write; report the exact path and field. |

- A confirmed schema-3 `startup.md` has schema `3`, both absolute identities, terminal confirmation, and
  exactly four aggregate child links with no self row. Each child has a Section Register plus exact
  `Project`, `Products`, and `Implementations` sections.
- For a nonterminal schema-3 action, inspect the caller's sole lane. Use `TaskList`, `TaskGet`, `TaskCreate`,
  and `TaskUpdate` in Claude Code or `update_plan` in Codex. Stop if another item is `in_progress`.
- For new work, create `startup.tmp.md` from its template after lane validation. Record schema `3`, both
  identities, `normal` recovery mode, no blocker, the Project, and stable evidence references; add no cursor.

#### 1.2 Validate owners, evidence, and the native route

- Apply this ownership map. Stop when the same transition or evidence fact has another maintained owner:

| Fact | Canonical owner | Other surfaces may contain |
|---|---|---|
| Current route and progression | Native TODO | Derived display only |
| Active run identity, subject order and parents, checkpoints, answers, scenarios, blockers, corrections, Review findings, and acceptance/revalidation evidence | `startup.tmp.md` | Stable references or accepted synthesis |
| Current section state, Review-evidence reference, and user acceptance | Aggregate phase file's Section Register | Derived state or links |
| Accepted phase content | Owning aggregate subject section | Evidence references and synthesis |
| Alias and question coverage | Topic banks | Coverage records, never route or acceptance state |
| Terminal Finalization state | `startup.md` `Confirmation` | Readiness derived from aggregate rows and Finalization evidence |

- Validate every identity, stable key, parent, dependency, section, assignment, and evidence reference against
  disk. `startup.tmp.md` contains one Project, Products in accepted order, and one stable Implementation per
  Product; no technology is a subject. Its Phase Section Register is a derived index into aggregate rows.
- Each aggregate Section Register owns `absent`, `draft`, `reviewed`, `stale`, or `confirmed`. A file is
  `confirmed` only when all required current rows are confirmed, `stale` when any is stale, and otherwise has
  the earliest incomplete row's state. Whole-file wording never overrides those rows.
- Use this normal title grammar and `Startup · Finalization · <stage> · <iteration>` for Finalization:

```text
Startup · <Project|Product|Implementation> · <stable-subject-key> · <Problem Definition|Design|Specification|Lifecycle and Use Cases> · <STUDY|PREPARE TOPICS|INTERVIEW|DOCUMENTATION|REVIEW|CONTEXT|PASS> · <iteration>
```

- On missing, stale, or cosmetically advanced TODO text—text that names a later stage without its proof—use
  disk and evidence to derive and repair the earliest unproved action. The temporary record states no route
  position, next action, next question, or first recovery action.
- In `completed-v3 revalidation`, Review and explicitly re-accept every current section in route order, then
  Finalization. Apply Step 2.6 to any finding before returning to normal work.
- An addressable specialist is available through the current delegation mechanism for a bounded assignment.
  Give one a fresh ID, current action and iteration, evidence, dependencies, absolute paths, allowed/protected
  files, result, checks, authority, and stops. Re-anchored scope means these paths and current evidence are
  restated in the assignment. If delegation or an addressable specialist is unavailable, use Step 2.6's
  unavailable path and never substitute the manager.

### Phase 2 — Complete Every Subject Cycle

#### 2.1 Select the earliest work unit

- A work unit means one level + subject + phase. Complete the singular Project, all Products in register
  order, one Implementation per Product in the same order, then Finalization. Each subject runs Problem
  Definition, Design, Specification, and Lifecycle and Use Cases.
- One Product still gets one Product and one Implementation cycle. Do not begin Products before the Project,
  Implementations before all Products, or Finalization before every aggregate row is confirmed.
- If Project Design has zero Products, keep that work unit at `CONTEXT` and checkpoint only this manager-owned
  question: `Which independently useful Product must this Project own first?` Invent no placeholder.
- An accepted answer is checkpointed, registers the Product and its one Implementation, clears the blocker,
  closes the current action at `CONTEXT`, and opens the same Project Design work at fresh `STUDY`. A repeated
  exact-context need replaces the question. If the user or writer is unavailable, or no Product is accepted,
  pause with the blocker and resume at `CONTEXT`; create no Product, Implementation, or Finalization successor.
- Open every selected normal work unit at `STUDY`; never skip a stage because evidence looks complete.

#### 2.2 Run delegated Study and Prepare Topics

- At `STUDY`, delegate read-only review of current project evidence, accepted dependencies, and the working
  record. Require sources, verified facts, contradictions, missing evidence, vocabulary, and material questions.
  Parallelize only independent read-only Study; accept a fresh checkpoint before the next stage.
- At `PREPARE TOPICS`, the ordered writer reads the exact phase in [`topics/project.md`](topics/project.md),
  [`topics/product.md`](topics/product.md), or [`topics/implementation.md`](topics/implementation.md). Adapt
  wording, retain applicable aliases, justify exclusions, add evidence-derived questions, and order by
  dependency, uncertainty, and consequence.
- Keep one coverage record per alias. Mark it `evidence-derived` when accepted evidence determines its answer;
  equivalent aliases may share one answer and evidence reference and produce at most one user question.
  Product `[software-type]` and `[application-deliverable-type]` share type evidence. Product
  `[building-block-inventory]` and `[building-block-parent]` derive from accepted Product/Implementation identity.
- Keep Products and named Product features distinct. Stack questions stay categorized entries inside one
  Implementation. Preserve all distinct unresolved questions.
- For Lifecycle and Use Cases, derive level-specific scenario candidates first. Ask only for a
  concrete-scenario or observable-oracle blocker, and always produce proactive implementation-neutral
  development guidance; missing guidance alone is not a user question.
- Apply Step 2.6 after each delegated result.

#### 2.3 Interview and checkpoint answers

- Only the manager asks one prepared question about the current subject. Confirm verified facts; otherwise ask
  for a concrete event, constraint, observable behavior, tradeoff, authority, or evidence threshold.
- When claims conflict, show each claim, evidence, and dependent and let the user decide what is current or
  when each applies. The writer checkpoints each answer with level, key, phase, alias, answer kind, evidence,
  strength, correction effects, and iteration; equivalent aliases may point to that same accepted checkpoint.
- Use Step 2.7 for every decision-changing answer. After all other answers are accepted, apply Step 2.6.

#### 2.4 Document the accepted phase content

- The ordered writer changes only the current subject section in the matching aggregate template. Preserve
  its Section Register and exact Project, Products, and Implementations sections.
- Record accepted decisions, evidence references, coverage, vocabulary, risks, owned deferrals, corrections,
  Review dispositions, and section content. The Section Register alone records state, Review evidence, and
  user acceptance. State `none found` when applicable.
- Keep Specification at design-contract level and lifecycle guidance implementation-neutral. Exclude code
  signatures, exhaustive schemas, algorithms, repository tasks, and implementation tasks. Apply Step 2.6.

#### 2.5 Review and obtain phase acceptance

- Prefer a fresh read-only specialist who did not author the section. Supply the exact bank section, Study
  evidence, working evidence, aggregate section, and accepted dependencies.
- Use exactly these eight lenses: `coverage`, `specificity`, `vocabulary`, `consistency`, `traceability`,
  `unsupported direction`, `load-bearing open decisions`, and `cold-reader quality`. A load-bearing open
  decision is unresolved and blocks a safe downstream choice. Every finding records evidence, consequence,
  one exact follow-up question, and disposition.
- The manager validates and checkpoints the audit. A finding follows Step 2.6. With no finding, record
  `reviewed`, ask for explicit acceptance, and give the writer a fresh acceptance checkpoint.
- A correction uses Step 2.7. A refusal without correction uses Step 2.6 and creates no correction evidence.
  Acceptance changes only the aggregate Section Register row to `confirmed`, then Step 2.6 selects the route.

#### 2.6 Apply the shared stage, context, finding, refusal, and success transitions

- This step is the sole owner of common transition mechanics. Before any successor, validate the result and
  its checkpoint, close the current action at its actual stage, and keep at most one item `in_progress`.
- Accepted stage proof advances as follows: Study checkpoint -> `PREPARE TOPICS`; prepared-set checkpoint ->
  `INTERVIEW`; all answer checkpoints -> `DOCUMENTATION`; verified exact-section checkpoint -> `REVIEW`;
  accepted audit plus explicit acceptance -> `PASS`; final confirmation plus durable checks -> final `PASS`.
- On `NEEDS_CONTEXT`, the writer records the blocked assignment and one exact question with work identity,
  stage, and iteration. Set the blocker and change the active stage to `CONTEXT`; specialists never ask or
  update the lane. The manager asks and the writer checkpoints and verifies the answer.
- Before clearing the blocker or opening a successor, compare that answer with every accepted decision.
  Ordinary missing context that changes none closes the current action at `CONTEXT`, clears the blocker, and
  opens the same subject phase or nonterminal Finalization work at fresh `STUDY`.
- A decision-changing answer takes no ordinary path: use Step 2.7, close the current action at its actual
  `CONTEXT` stage, reopen the earliest owner, stale only reachable dependents, and keep unaffected siblings
  confirmed. Refusal without correction remains outside Step 2.7. A terminal Finalization confirmation
  question retains Step 3.1's correction, refusal, and confirmation branches.
- Another exact-context need replaces the stored question. An unavailable user, writer, delegation path, or
  specialist pauses with all blocker evidence and later reconstructs `CONTEXT`.
- A Review finding opens the same normal work at `STUDY`. Phase refusal without correction does the same and
  records refusal evidence only. Finalization refusal is owned by Step 3.1. `PASS` returns to Step 2.1 for the
  unique next work unit.

#### 2.7 Reopen the earliest owner after any correction

- This is the only correction procedure. Use it for decision-changing Interview answers, phase-acceptance and
  Finalization-confirmation corrections, late Product discovery, lower-level contradictions, Product-contract
  corrections, and technology-entry corrections; refusal without correction never enters this step.
- Record old and current decisions, user resolution, the exact owning level/subject/phase, and its reachable
  stale set. Close the current action at its actual stage before changing any dependent state.
- Reopen the earliest owner. Mark only its later phases, reachable descendant and aggregate sections, and
  synthesis stale; keep unaffected siblings confirmed. Recalculate derived artifact readiness and open the
  owner at fresh `STUDY`.
- A new Product reopens Project Design and registers its Implementation. A technology-entry change normally
  reopens that Product's Implementation Design. A Product-contract contradiction reopens its actual Product
  owner; a lower-level contradiction reopens the ancestor that owns the contradicted decision.

#### 2.8 Enforce level, phase, and example boundaries

- Project phases own initiative reality, outcomes, Product inventory, cross-Product design, governance,
  policy, quality, service operation, and Project-wide lifecycle. Product phases own one app/platform's
  consumer problem, boundary, interfaces, capabilities, behavior, data, safety, recovery, operation, use,
  upgrade, and retirement. Implementation phases own one complete stack's need, design, categorized entries,
  support, configuration, compatibility, testing, security, licensing, development, release, migration, and end.
- For example, `Analytics Workspace` may own `Web Dashboard`, `CLI`, and `Data Platform`. Web Dashboard's one
  Implementation may contain React and TypeScript; Data Platform's may contain Spark, Trino, Iceberg, and
  Python. The same technology under several Products is a separate categorized entry in each Implementation,
  never a subject. These examples prescribe no project content.

### Phase 3 — Finalize and Hand Off

#### 3.1 Run Finalization through the same route

- Enter after every aggregate Section Register row is confirmed. Run Finalization through Study, Prepare
  Topics, Interview, Documentation, and Review using Steps 2.2–2.6. Limit topics to contradictions, missing
  cross-phase decisions, stale links, vocabulary, unowned deferrals, traceability, and synthesis choices.
- Write [`startup.md`](templates/startup.md) as an independent synthesis with exactly four aggregate child
  links, no self row, the integrated hierarchy, decisions, traceability, vocabulary, risks, and Review
  dispositions. Its `Confirmation` section is the sole owner of terminal Finalization state, schema `3`, both
  identities, confirmation decision, and timestamp.
- Present the five-file set at `REVIEW` and delegate the confirmation checkpoint. Missing context uses Step
  2.6. A decision-changing correction closes Finalization at `REVIEW` or `CONTEXT` and uses Step 2.7. Refusal
  without correction closes that stage and opens Finalization at `STUDY`, with refusal evidence only.
  Confirmation without correction writes `Confirmation`, changes the active stage to `PASS`, and proceeds.
- In completed-v3 revalidation, Review Finalization only. Apply Step 2.6 to a finding; the same correction,
  refusal, and confirmation branches apply.

#### 3.2 Complete, pause, or stop

- At verified Finalization `PASS`, confirm current acceptance in every aggregate row, four confirmed
  aggregate files, a current sole terminal `Confirmation`, both identities, exactly four child links, all
  five durable files, and no other durable Startup output. Remove the matching `startup.tmp.md`, reread the
  directory, return all five absolute paths, and return the uncontested lane.
- On pause, keep proof-only temporary evidence, set `paused`, and retain the blocker. Resume through Step 1.1
  and reconstruct from evidence. On unsafe state, write nothing further and return the exact blocker/path.
- The caller may capture confirmed documents through [Memory](../memory/SKILL.md) `Temporary Record` only when
  it supplies an exact session root and output. Startup does not implement, plan implementation, evaluate,
  update durable memory, publish, or choose a memory destination.

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
