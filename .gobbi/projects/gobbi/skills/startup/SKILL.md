---
name: startup
description: "Use when a caller needs one evidence-backed software-project design interview that produces five accepted phase documents and one confirmed `startup.md`."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, Agent, Task, TaskCreate, TaskGet, TaskUpdate, TaskList, WebSearch, WebFetch
skill-type: operation
---

# Startup

Startup turns project evidence and user decisions into six durable design documents. The caller supplies an
absolute project root, an absolute output directory, and its sole native TODO lane. The manager owns the
route, delegation, interview, acceptance, verification, and every user decision.

Schema 4 uses `Project -> Product -> Implementation`. A Project owns one or more independently useful
Products. Each Product owns exactly one Implementation for its complete stack; technologies are categorized
entries inside that Implementation, not subjects.

The route completes the Project, every Product, and one Implementation per Product before Finalization. Each
subject runs five phases through delegated Study, Prepare Topics, Documentation, and Review around the
manager's Interview. Startup produces design evidence, not implementation planning, formal evaluation,
memory, publication, or a memory-destination decision.

## Principles

### Let evidence and dependency order shape the design

Resolve ancestors and earlier phases before using them downstream. Treat each direct phase entry as adaptable
coverage, not a script.

### Keep one native route and separate its proof

The TODO selects the current action. Durable section registers and `startup.tmp.md` evidence prove progress
without creating a second route.

### Keep subject identity separate from stack entries

Model one Project, its Products, and one complete Implementation per Product. Record technologies only as
categorized entries inside the owning Implementation.

### Make lifecycle guidance observable at its owning level

Derive scenarios from accepted decisions and give each an observable oracle. Keep Product promises and
complete-stack Development mechanisms separate, linked, and independently accepted.

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

- Take the absolute project root and output directory. Apply [`../record/SKILL.md`](../record/SKILL.md) Step
  1.1: the output directory exists inside the worktree and its resolved path has no symlink or parent traversal.
- Schema 4 has exactly six durable files: `problem-definition.md`, `design.md`, `specification.md`,
  `product-lifecycle.md`, `development-lifecycle.md`, and `startup.md`. Its temporary evidence is
  `startup.tmp.md`, which is never durable output.
- Schema 3 has exactly five durable files: `problem-definition.md`, `design.md`, `specification.md`,
  `lifecycle-and-use-cases.md`, and `startup.md`. It is recognized only as a complete terminal legacy result.
- Schema 2 replaces schema 3's `design.md` and `specification.md` with `project-design.md` and
  `project-specification.md`. Confirmed schema 2 requires no `startup.tmp.md`, that exact five-file set with no
  newer mixture, and a `startup.md` that declares schema `2`, records both exact absolute identities, and
  records terminal user confirmation. Its Phase Document Artifact Register has exactly
  `problem-definition.md`, `project-design.md`, `project-specification.md`, and
  `lifecycle-and-use-cases.md` as child rows, with no duplicate, extra, or self row; every linked child exists
  and is readable, every `Status` resolves to literal `confirmed`, and every `Accepted` value is
  non-placeholder. Those rows own phase acceptance; do not require acceptance inside the child documents.
- Confirmed pre-schema 2 requires `startup.md` as the only Startup artifact, no schema 2, 3, or 4 claim, and a
  `Confirmation` section with both exact identities and user confirmation. A completely proved schema 2 or
  pre-schema-2 shape returns the exact existing `startup.md` unchanged as `legacy-confirmed` before lane
  inspection. Any failed path or field takes the unsafe stop with no write, TODO, cleanup, or migration.
- Classify the directory read-only before inspecting or changing the lane:

| Disk state | Required action |
|---|---|
| No Startup artifact | Select schema-4 creation; validate the lane before creating evidence. |
| Matching schema-4 temporary record with zero or a matching partial schema-4 durable set | Validate identities, exact registers, no cursor, and disk; then validate or reconstruct the native TODO and resume its unique earliest unproved work. |
| Complete confirmed schema 4 without temporary state | Validate it; after lane validation start `completed-v4 revalidation`. |
| Matching schema-4 temporary proof plus complete confirmed schema 4 | Validate agreement and resume the unique revalidation or correction position through the native TODO. |
| Partial schema 4 without valid matching temporary proof | Stop before lane inspection with no write; report every present path and the missing proof. |
| Complete confirmed schema 3 without temporary state or any schema-4 artifact | Return its `startup.md` unchanged as `legacy-confirmed` before lane inspection; do not revalidate or rewrite it. |
| Any schema-3 temporary, partial schema-3 durable set, schema-3 temporary plus confirmed set, or mixed schema 3/4 state | Stop before lane inspection with no write, migration, cleanup, or TODO creation; report every path. |
| Complete confirmed schema 2 without temporary state | Return its `startup.md` unchanged as `legacy-confirmed` before lane inspection. |
| Confirmed pre-schema-2 `startup.md` alone | Return it unchanged as `legacy-confirmed` before lane inspection. |
| Any other partial, mixed, mismatched, unreadable, unowned, extra, or ambiguously owned state | Stop before lane inspection with no write; report every exact path and failed invariant. |

- A confirmed schema-4 result has the exact six durable files, both absolute identities, terminal schema-4
  confirmation, exactly five aggregate child links with no self row, no extra Startup durable output, and no
  temporary file. Every aggregate child has a Section Register plus exact `Project`, `Products`, and
  `Implementations` sections, and every required current row is confirmed.
- A confirmed schema-3 legacy result has schema `3`, both absolute identities, terminal confirmation, exactly
  four aggregate child links with no self row, no temporary or schema-4 artifact, and no extra Startup durable
  output. Each child has a Section Register plus exact `Project`, `Products`, and `Implementations` sections,
  and every required current four-phase row is confirmed.
- For a nonterminal schema-4 action, inspect the caller's sole lane. Use `TaskList`, `TaskGet`, `TaskCreate`,
  and `TaskUpdate` in Claude Code or `update_plan` in Codex. Stop if another item is `in_progress`.
- For new work, create `startup.tmp.md` from its template after lane validation. Record schema `4`, both
  identities, `normal` recovery mode, no blocker, the Project, and stable evidence references; add no cursor.

#### 1.2 Validate owners, evidence, and the native route

- Apply this static phase registry. It is schema, not route state. Native TODO alone owns current work, stage,
  progression, reopen selection, and recovery reconstruction:

| Order | Stable key | Title | Direct topic entry | Aggregate template | Durable artifact | Direct dependencies |
|---:|---|---|---|---|---|---|
| 1 | `problem-definition` | Problem Definition | [`topics/problem-definition.md`](topics/problem-definition.md) | [`templates/problem-definition.md`](templates/problem-definition.md) | `problem-definition.md` | Accepted subject identity and accepted ancestor Problem Definition where applicable |
| 2 | `design` | Design | [`topics/design.md`](topics/design.md) | [`templates/design.md`](templates/design.md) | `design.md` | Same-subject Problem Definition; accepted ancestor Design where applicable |
| 3 | `specification` | Specification | [`topics/specification.md`](topics/specification.md) | [`templates/specification.md`](templates/specification.md) | `specification.md` | Same-subject Problem Definition and Design; accepted ancestor Specification where applicable |
| 4 | `product-lifecycle` | Product Lifecycle | [`topics/product-lifecycle.md`](topics/product-lifecycle.md) | [`templates/product-lifecycle.md`](templates/product-lifecycle.md) | `product-lifecycle.md` | Same-subject first three phases; accepted ancestor lifecycle promises and policy where applicable |
| 5 | `development-lifecycle` | Development Lifecycle | [`topics/development-lifecycle.md`](topics/development-lifecycle.md) | [`templates/development-lifecycle.md`](templates/development-lifecycle.md) | `development-lifecycle.md` | Same-subject first three phases and Product Lifecycle; accepted ancestor Development policy; linked Product-promise records |

- Product Lifecycle always precedes Development Lifecycle. Development may reference accepted Product
  decisions; Product Lifecycle never depends on later Development acceptance.
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
  Product; no technology is a subject. Its Phase Section Register is a derived index into all five aggregate
  rows for each subject.
- Each aggregate Section Register owns `absent`, `draft`, `reviewed`, `stale`, or `confirmed`. A file is
  `confirmed` only when all required current rows are confirmed, `stale` when any is stale, and otherwise has
  the earliest incomplete row's state. Whole-file wording never overrides those rows.
- Use this normal title grammar and `Startup · Finalization · <stage> · <iteration>` for Finalization:

```text
Startup · <Project|Product|Implementation> · <stable-subject-key> · <Problem Definition|Design|Specification|Product Lifecycle|Development Lifecycle> · <STUDY|PREPARE TOPICS|INTERVIEW|DOCUMENTATION|REVIEW|CONTEXT|PASS> · <iteration>
```

- On missing, stale, or cosmetically advanced TODO text—text that names a later stage without its proof—use
  disk and evidence to derive and repair the earliest unproved action. The temporary record states no route
  position, next action, next question, or first recovery action.
- In `completed-v4 revalidation`, Review and explicitly re-accept every current section in registry order, then
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
  Definition, Design, Specification, Product Lifecycle, and Development Lifecycle in registry order.
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
- At `PREPARE TOPICS`, the ordered writer reads the current phase's direct topic entry from the static
  registry and uses its exact `Project`, `Product`, or `Implementation` section. Adapt wording, retain
  applicable aliases, justify exclusions, add evidence-derived questions, and order by dependency,
  uncertainty, and consequence.
- Generally prepare common lifecycle questions. Accepted Product-form evidence activates any applicable
  Product Lifecycle overlay; accepted categorized-entry or platform evidence activates every applicable
  Development Lifecycle overlay. Several overlays may compose, but no overlay creates a subject, route row,
  aggregate artifact, or acceptance owner.
- Keep one coverage record per alias. Mark it `evidence-derived` when accepted evidence determines its answer;
  questions may share one answer and evidence reference only when that evidence proves each oracle. Merge
  only an identical normalized owner, purpose, and oracle triple. Preserve distinct or paired questions when
  any part differs.
- Keep Products and named Product features distinct. Stack questions stay categorized entries inside one
  Implementation. Preserve all distinct unresolved questions.
- For Product Lifecycle, derive candidates from accepted evidence across stage or moment, path variant, and
  perspective. Record stable scenario and decision references, trigger and context, observable Product oracle,
  state/data invariants, selected overlays, coverage, and any linked Development record.
- For Development Lifecycle, derive complete-stack candidates across change, environment, implementation,
  verification, release, delivery, maintenance/security, migration/rollback, retirement, and handoff
  dimensions. Record the mechanism or obligation, participating categorized entries, claim-specific evidence,
  Development oracle, recovery, selected overlays, and linked Product promises.
- Keep Product-promise and Development-mechanism records paired by stable scenario and decision references
  whenever owner, purpose, or oracle differs. Shared evidence may answer both but never merges their Review or
  acceptance. Ask only for a concrete-scenario or observable-oracle blocker, and always produce proactive
  implementation-neutral Development guidance; missing guidance alone is not a user question.
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
- Apply this exact reachability map:

| Earliest corrected owner | Reopen | Mark stale | Preserve confirmed |
|---|---|---|---|
| Project Problem Definition | That Project row at fresh `STUDY` | All later Project phases; all Product and Implementation rows; all five affected aggregates; synthesis | Nothing downstream of the corrected Project contract |
| Project Design | That Project Design row | Later Project phases and reachable Product/Implementation rows; affected aggregates; synthesis | Project Problem Definition and unrelated external evidence |
| Project Specification | That Project Specification row | Both Project lifecycle rows and only descendant rows that rely on the corrected specification; affected aggregates; synthesis | Earlier Project rows and unrelated sibling branches |
| Project Product Lifecycle | That Product Lifecycle row | Project Development Lifecycle and reachable Product/Implementation lifecycle rows; both lifecycle aggregates; synthesis | First three Project rows and unrelated siblings |
| Project Development Lifecycle | That Development Lifecycle row | Reachable descendant Development Lifecycle rows and synthesis | Product Lifecycle unless the correction contradicts a Product-owned promise |
| Product Problem Definition, Design, or Specification | The exact earliest Product row | Later rows for that Product and its one Implementation; affected aggregates; synthesis | Other Products and their Implementations |
| Product Product Lifecycle | That Product Lifecycle row | Same Product Development Lifecycle, reachable Implementation lifecycle rows, both lifecycle aggregates, synthesis | Earlier Product rows and unrelated Products |
| Product Development Lifecycle | That Development Lifecycle row | Same Product's reachable Implementation Development Lifecycle and synthesis | Product Lifecycle unless a Product promise is contradicted |
| Implementation Problem Definition, Design, or Specification | The exact earliest Implementation row | Later rows for that Implementation; affected aggregates; synthesis | Parent Product rows and sibling Implementations |
| Implementation Product Lifecycle | That Product Lifecycle row | Its Development Lifecycle and both lifecycle aggregate sections; synthesis | Earlier Implementation rows |
| Implementation Development Lifecycle | That row | Its Development aggregate section and synthesis | Product Lifecycle unless the mechanism correction changes the owned Product promise |
| New Product | Project Design | Register its exactly one Implementation; stale all reachable Project and new-subject aggregates; synthesis | Existing unrelated Product decisions unless the Project inventory change reaches them |
| Categorized technology-entry change | Owning Product's Implementation Design | Later reachable Implementation rows and affected aggregate sections; synthesis | Technology remains an entry; other Products and entries stay confirmed |

- A Development correction that reveals a wrong Product promise routes to the actual Product owner. It does
  not stale Product Lifecycle from below. Parent corrections stale reachable descendants; unrelated siblings
  remain confirmed.

#### 2.8 Enforce level and phase boundaries

- Project phases own initiative reality, outcomes, Product inventory, cross-Product design, governance,
  policy, quality, and phase-specific cross-Product lifecycle policy. Product phases own one Product's
  consumer problem, boundary, interfaces, capabilities, behavior, data, safety, recovery, operation, use,
  upgrade, and retirement promises. Implementation phases own one complete stack's need, design, categorized
  entries, support, configuration, compatibility, testing, security, licensing, Development mechanisms,
  release, migration, and end.
- Product Lifecycle owns actor-visible promises. Its Implementation section identifies participating
  boundaries and handoffs without choosing Development mechanisms. Development Lifecycle owns
  complete-stack mechanisms and evidence; its Product section links Product promises to resulting obligations.

### Phase 3 — Finalize and Hand Off

#### 3.1 Run Finalization through the same route

- Enter after every aggregate Section Register row is confirmed. Run Finalization through Study, Prepare
  Topics, Interview, Documentation, and Review using Steps 2.2–2.6. Limit topics to contradictions, missing
  cross-phase decisions, stale links, vocabulary, unowned deferrals, traceability, and synthesis choices.
- Write [`startup.md`](templates/startup.md) as an independent synthesis with exactly five aggregate child
  links, no self row, the integrated hierarchy, separate Product-promise and Development-mechanism
  traceability, decisions, vocabulary, risks, and Review dispositions. Its `Confirmation` section is the sole
  owner of terminal Finalization state, schema `4`, both
  identities, confirmation decision, and timestamp.
- Present the six-file set at `REVIEW` and delegate the confirmation checkpoint. Missing context uses Step
  2.6. A decision-changing correction closes Finalization at `REVIEW` or `CONTEXT` and uses Step 2.7. Refusal
  without correction closes that stage and opens Finalization at `STUDY`, with refusal evidence only.
  Confirmation without correction writes `Confirmation`, changes the active stage to `PASS`, and proceeds.
- In `completed-v4 revalidation`, Review Finalization after every current aggregate row has been reviewed and
  explicitly re-accepted in registry order. Apply Step 2.6 to a finding; the same correction,
  refusal, and confirmation branches apply.

#### 3.2 Complete, pause, or stop

- At verified Finalization `PASS`, confirm current acceptance in every aggregate row, five confirmed
  aggregate files, a current sole terminal schema-4 `Confirmation`, both identities, exactly five child links,
  all six durable files, no stale row, and no other durable Startup output. Remove the matching
  `startup.tmp.md`, reread the directory, return all six absolute paths, and return the uncontested lane.
- On pause, keep proof-only temporary evidence, set `paused`, and retain the blocker. Resume through Step 1.1
  and reconstruct from evidence. On unsafe state, write nothing further and return the exact blocker/path.
- The caller may record confirmed documents through [`../record/SKILL.md`](../record/SKILL.md). Startup does
  not implement, plan implementation, evaluate, update memory, publish, or choose a memory destination.

## References

- [`topics/problem-definition.md`](topics/problem-definition.md)
- [`topics/design.md`](topics/design.md)
- [`topics/specification.md`](topics/specification.md)
- [`topics/product-lifecycle.md`](topics/product-lifecycle.md)
- [`topics/product-lifecycle/web.md`](topics/product-lifecycle/web.md)
- [`topics/product-lifecycle/desktop.md`](topics/product-lifecycle/desktop.md)
- [`topics/product-lifecycle/cli.md`](topics/product-lifecycle/cli.md)
- [`topics/product-lifecycle/library.md`](topics/product-lifecycle/library.md)
- [`topics/product-lifecycle/sdk.md`](topics/product-lifecycle/sdk.md)
- [`topics/product-lifecycle/mobile.md`](topics/product-lifecycle/mobile.md)
- [`topics/product-lifecycle/data.md`](topics/product-lifecycle/data.md)
- [`topics/development-lifecycle.md`](topics/development-lifecycle.md)
- [`topics/development-lifecycle/tool.md`](topics/development-lifecycle/tool.md)
- [`topics/development-lifecycle/framework.md`](topics/development-lifecycle/framework.md)
- [`topics/development-lifecycle/language.md`](topics/development-lifecycle/language.md)
- [`topics/development-lifecycle/desktop.md`](topics/development-lifecycle/desktop.md)
- [`topics/development-lifecycle/network.md`](topics/development-lifecycle/network.md)
- [`templates/problem-definition.md`](templates/problem-definition.md)
- [`templates/design.md`](templates/design.md)
- [`templates/specification.md`](templates/specification.md)
- [`templates/product-lifecycle.md`](templates/product-lifecycle.md)
- [`templates/development-lifecycle.md`](templates/development-lifecycle.md)
- [`templates/startup.tmp.md`](templates/startup.tmp.md)
- [`templates/startup.md`](templates/startup.md)
