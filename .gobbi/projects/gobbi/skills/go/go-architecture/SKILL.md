---
name: go-architecture
description: "MUST load when designing or reviewing the architecture of a Go application, service, command, library, or multi-package system, including package boundaries, dependency direction, process boundaries, configuration ownership, data flow, failure containment, or validation strategy."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Go Architecture

Go Architecture authors or reviews the cross-package, module, and process design of Go software. Author-design
mode returns a user-confirmed design and future validation plan; review mode returns evidence-backed architecture
findings. Either mode can instead return an exact decision block.

This operation owns the ordered architecture process, the integrated architecture model, material-choice gate,
confirmed design, and validation plan. It does not implement source, produce a code skeleton or implementation
plan, execute project code or tools, populate Go caches, download inputs, publish, release, deploy, or mutate
external state.

Architecture integrates singular sibling judgments without taking them over. Project sources remain read-only;
only separately caller-approved design artifacts and author-design scratch may be written.

## Principles

### Design the system that exists

Current consumers, packages, modules, processes, configuration, state, behavior, and failure evidence are the
starting constraints. A preferred pattern cannot turn an existing system into a blank slate.

### Keep material choices with the decision owner

Architecture exposes viable reference-backed alternatives and their trade-offs. A recommendation informs the
user or named project decision authority; it does not replace that authority.

### Make boundaries carry complete contracts

Every package, module, process, configuration, data, and control-flow boundary must name its responsibilities,
dependencies, ownership, failure behavior, compatibility position, and validation question.

### Design for failure and proof

Normal flow is incomplete without cancellation, shutdown, failure containment, recovery, rollback, resource
bounds, diagnostic signals, and evidence that could distinguish the promised result.

## Rules

- **MUST select exactly one author-design or review mode and bind its complete effect contract before any
  reference access or write.** Authority in one mode or sibling does not transfer to another effect.
- **MUST study the current package, module, and process structure before proposing a design.** Never substitute a
  generic Go layout, remembered pattern, or first draft for current consumers, project evidence, and governing
  project decisions.
- **MUST apply the complete material-choice classifier before planning or recording a design-dependent
  selection.** A routine choice proceeds only when accepted design or governing project convention fully
  determines it and it changes no classifier dimension.
- **MUST compare at least two credible reference-backed alternatives whenever more than one viable architecture
  exists.** Every material choice requires an explicit user or named project-authority decision, or a cited
  prior decision for the same decision whose affected context and assumptions still match.
- **MUST keep design-artifact write permission separate from material-decision authority.** Permission to write
  an approved artifact never confirms a design, and a confirmed design never authorizes an unapproved artifact
  write.
- **NEVER implement source, create a code skeleton or implementation plan, execute project code or tools, write
  Go caches, download inputs, use credentials, perform external mutation, or create a release effect.** Route
  every specialist judgment and later implementation or validation action to its named owner.

## Procedure

### Phase 1 — Bind the Architecture Result and Authority

#### 1.1 Bind the actor, result, and exact design object

- Read the request, purpose, accepted scope, success criteria, project instructions, accepted decisions,
  compatibility promise, affected consumers, supplied evidence, requested output, non-goals, and required
  handoff. Name the acting agent, user or named project decision authority, design-artifact owner, each affected
  consumer, and the requested terminal result.
- Select author-design mode for a user-confirmed Go application, service, command, library, or multi-package
  design plus future validation plan. Select review mode for evidence-backed findings about an existing or
  proposed architecture. Do not blend the modes.
- Name the exact design object using its package names, import paths, package directories or placement, package
  boundaries, module paths, public APIs or CLIs, project commands, processes, configuration inputs, data or
  state, and consumers. An exact package pattern is only a future project-command selector or evidence fact;
  it is not a design identity.
- Record what may be created, read for consistency, updated, deleted, or co-touched by a future implementation.
  State who owns each architectural behavior, what it does, when it runs, where it crosses a boundary, why it
  exists, and how a future owner would validate, release, recover, or reverse it.

#### 1.2 Bind the selected mode's complete effect contract

- **Author-design mode:** project source is read-only. Project-path writes are limited to exact design artifacts
  that the caller has separately approved; disposable writes are limited to approved design scratch with a
  named retention or cleanup boundary; Go cache effects and downloads are none; project code or tool execution
  is none; network access is limited to separately authorized read-only reference access for an exact source
  and purpose; `credential use: none`; `external mutation: none`; `release effect: none`. Pause before every
  unresolved material decision and, separately, before any design-artifact or scratch write that lacks exact
  caller permission. The result is a confirmed design and validation plan or decision block. Recovery retains
  the alternatives, recommendation, affected decisions, exact question, approved design evidence, decision
  owner, and first recovery action.
- **Review mode:** project sources and design outputs are read-only; project-path writes, disposable writes, Go
  cache effects, downloads, and project code or tool execution are none; network access is limited to separately
  authorized read-only reference access for an exact source and purpose; `credential use: none`; `external
  mutation: none`; `release effect: none`. Pause before an unresolved material judgment or any proposed
  mutation. The result is evidence-backed architecture findings or a decision block. Recovery retains invalid
  assumptions, architecture evidence, evidence limits, the next decision owner, and the first recovery action.
- Local project reads stay within the accepted design subject. Before any external reference read, bind its
  authority, exact destination, purpose, expected relevance, and retention boundary; changed scope or
  destination requires new authority. Neither mode inherits network authority from a cited link.

#### 1.3 Bind sibling owners and non-goals

- Route package names, import paths, package directories or placement, package boundaries, public APIs or CLIs,
  types, errors, mutable-data ownership, and ordinary resource lifetime to `go-design`. Route concurrent
  ownership, synchronization, cancellation, queue bounds, backpressure, and shutdown to `go-concurrency`.
- Route module paths, layouts, dependency graphs, workspaces, exact public package paths, and module consumer
  compatibility analysis to `go-modules`. Route trust boundaries, protected-data handling, dependency
  vulnerability decisions, and network exposure to `go-security`.
- Route diagnostic records and signals to `go-observability`; performance questions, budgets, measurement
  strategies, and resource trade-offs to `go-performance`; validation questions, test kinds, observable test
  boundaries, and controllable dependencies to `go-testing`; and project-command syntax, exact package patterns,
  selected Go toolchain version, `GOOS/GOARCH` target facts, caches, downloads, and command effects to
  `go-toolchain`.
- Route later construction or code review to `go-development`. Exclude a code skeleton, implementation plan,
  source write, generated edit, project command execution, release decision, publication, deployment, rollout,
  environment mutation, data migration execution, and live-health ownership from this operation.

### Phase 2 — Study the Current System and Applicable References

#### 2.1 Reconstruct the current architecture

- Read repository rules, architecture and design records, source layout, module and workspace files,
  configuration declarations, public documentation, project command declarations, test sources, generated
  provenance, build constraints, consumer evidence, relevant history, and neighboring packages or processes.
  Record absence as an evidence limit rather than filling it with a preferred pattern.
- Map current package names, import paths, package directories or placement, package and module boundaries,
  process roles, public APIs or CLIs, entry points, dependency direction, configuration ownership, and data,
  state, and control flow. Include startup, steady state, success, error, cancellation, timeout, shutdown,
  recovery, and rollback behavior when applicable.
- Identify every mutable-data owner, resource owner and lifetime, goroutine or queue owner, trust boundary,
  failure-containment boundary, diagnostic signal, resource budget, compatibility promise, migration state,
  validation question, and current evidence limit. Distinguish observed behavior, documented intent, accepted
  decision, and inference.
- Trace every affected consumer and neighboring responsibility. A package directory alone does not prove a
  package boundary, and a process diagram alone does not prove runtime ownership or failure containment.

#### 2.2 Assess reference-backed prior art

- Inspect applicable project precedents, neighboring code, official Go or platform documentation, and accepted
  external prior art. For every used source, record authority, relevance to this exact decision, currency,
  applicability to the project's compatibility target, license or reuse constraint when external text is
  reused, and the separate reuse disposition.
- Use [Organizing a Go module](https://go.dev/doc/modules/layout) as official Go prior art for module, package
  directory, library, and command placement; the current project contract selects its architecture.
- Treat [Go Code Review Comments: Interfaces](https://go.dev/wiki/CodeReviewComments#interfaces) only as
  Go-maintained community guidance for consumer-defined interfaces, not as a project decision or language
  requirement.
- Recheck live official documentation when a claim depends on current Go or platform behavior. Do not freeze a
  current Go release, mandate a third-party framework, or treat community guidance as a project decision.
- Reject a reference whose context, operational assumptions, trust model, failure model, or consumer needs do
  not match the design object. Preserve the rejection reason so a later review can distinguish inapplicability
  from omission.

#### 2.3 Validate accepted and prior decisions

- Inventory every accepted decision that could constrain the architecture. Name its exact decision, source,
  decision owner, affected context, assumptions, current consumers, compatibility target, and reopen trigger.
- Treat a prior decision as current authority only when it resolves the same decision, the affected context and
  assumptions still match, and its source is cited. A changed consumer, package or process boundary, dependency,
  trust model, failure model, budget, evidence strategy, or compatibility promise reopens the decision.
- Record a routine choice only when accepted design or governing project convention mechanically determines it
  and no material-classifier dimension changes. Local syntax, formatting, or a mechanically determined private
  name can qualify; convenience or familiarity cannot.

### Phase 3 — Model Alternatives and Resolve Material Choices

#### 3.1 Build the exact architecture model

- Define package names, import paths, package directories or placement, package boundaries, module paths,
  module boundaries, process roles and boundaries, public APIs or CLIs, project commands, and dependency
  direction. State the responsibility and consumer of every boundary and prohibit dependencies that invert the
  accepted direction.
- Define configuration ownership and loading; data, state, and control flow; mutable-data and resource
  ownership; resource lifetime; concurrency; cancellation; startup; steady-state operation; shutdown; and
  cleanup. Name every state transition and owner that affects the result.
- Define trust boundaries, identity or authorization assumptions, protected-data flow, network exposure,
  failure containment, failure propagation, recovery, retry, rollback, and partial-state behavior. Route the
  specialist judgment while retaining its accepted result in the integrated model.
- Define performance and resource budgets, diagnostic questions and signals, compatibility state as
  `compatible`, `migration supplied`, `authorized break`, or `unsupported`, affected consumers, migration
  obligations, and future validation questions, observable signals, evidence limits, and claim strength.

#### 3.2 Apply the complete material-choice classifier

- A choice is material when different viable selections would change task scope or acceptance; user-visible
  behavior; public API or CLI and compatibility or migration; package, module, or process boundary or
  dependency direction; configuration, data, or state flow; mutable-data or resource ownership or lifetime;
  concurrency, cancellation, or shutdown; trust, identity, authorization, cryptography, secrets, protected
  data, or network exposure; failure containment, recovery, or rollback; performance or resource budget or
  measurement strategy; diagnostic signals, redaction, retention, or access; validation strategy, observable
  test boundary, controllable dependency, or strength of the completion claim; or artifact identity, release,
  external effect, or destructive effect.
- For every candidate choice, state which dimensions change and why. If no dimension changes and Step 2.3 proves
  the routine boundary, record the determining accepted design or project convention and proceed without a user
  question. Otherwise treat the choice as material.
- Do not let a design-artifact path, editing permission, first draft, existing code shape, reference popularity,
  or implementation convenience classify a material decision as routine.

#### 3.3 Compare viable alternatives

- When more than one credible architecture is viable, compare at least two reference-backed alternatives. For
  each alternative, record the affected consumers; responsibilities and invariants; package, module, and process
  boundaries; dependency direction; configuration, data, state, and control flow; mutable-data and resource
  ownership; concurrency and shutdown; failure containment and recovery; compatibility and migration;
  performance and resource budgets; security and diagnostic consequences; and future validation questions,
  signals, controllable dependencies, and evidence limits.
- Record each alternative's dependencies and preconditions, known failure modes, operational trade-offs, and
  reason it remains viable or is rejected. A label such as simple, idiomatic, scalable, safe, or testable is not
  a comparison.
- Recommend one alternative and connect the recommendation to current consumer and project evidence. Preserve
  the rejected alternatives and trade-offs; do not rewrite the comparison after the decision.

#### 3.4 Obtain and record the decision

- For a material choice, ask the user or named project decision authority the exact unresolved question. Do not
  plan the design or make a design-dependent write until that authority gives a literal decision or Step 2.3
  proves a valid cited prior decision.
- Record the literal user or named-authority decision, decision owner, source, basis, accepted alternative,
  rejected alternatives, trade-offs, resulting contracts and compatibility state, reopen trigger, and any
  unresolved questions. Record the same fields for a valid cited prior decision.
- Separately obtain exact caller permission before writing a design artifact or scratch path. Bind its path,
  content boundary, retention or cleanup owner, and allowed create or update effect. No decision record can
  imply this permission.

### Phase 4 — Confirm the Design or Produce Review Findings

#### 4.1 Integrate sibling-owned judgments

- Load every sibling whose trigger applies and consume its exact accepted judgment or result. Use it to complete
  the architecture model without reproducing the sibling's procedure, changing its decision, or widening its
  authority.
- Reconcile conflicts by identifying the affected architectural obligation, the singular judgment owner, the
  conflicting assumptions or evidence, available alternatives, and the next decision owner. Stop rather than
  choose across an unresolved specialist-owned judgment.
- Check the integrated graph for an unowned responsibility, hidden dependency, reciprocal claim ownership,
  mutable state without one owner, resource without a lifetime, goroutine without shutdown, failure without a
  containment or recovery boundary, compatibility claim without affected consumers, and validation claim
  without an observable question.

#### 4.2 Produce the mode-specific result

- **Author-design mode:** assemble the integrated design for confirmation, naming the exact package names,
  import paths, package directories or placement, package boundaries, module paths, module and process graph,
  process roles, public APIs or CLIs, project commands, dependency direction, invariants, configuration
  ownership, data/state/control flow, ownership and lifetimes, concurrency and shutdown, trust and failure
  containment, recovery and rollback, budgets, diagnostic signals, compatibility and migration, alternatives,
  decisions, and evidence limits. Write it only to a separately approved design-artifact path.
- **Review mode:** return each finding with the exact architecture object, location or boundary, current
  behavior or proposal, architecture evidence, invalid or unsupported assumption, consequence, affected
  consumer and invariant, compatibility or operational risk, applicable alternative, evidence limit, decision
  need, and earliest responsible architecture decision. Keep every project path and design output unchanged.
- Author-design mode produces no code skeleton or implementation plan. Review mode proposes no mutation. A
  future implementation or remediation route names its owner, prerequisites, accepted design identity, and
  authority still required without decomposing construction work here.

#### 4.3 Define the future validation plan

- For every invariant and consumer-visible claim, name the validation question, observable behavior or signal,
  observable test boundary or controllable dependency, ordinary and failure cases, process or package boundary,
  compatibility case, resource budget, diagnostic signal, and evidence that could support or refute the claim.
- Name the future evidence owner and project command owner. Record expected project commands, exact package
  patterns only as future project-command selectors, selected Go toolchain version inputs, `GOOS/GOARCH` target
  inputs, environments, consumers, durations, results, and evidence limits without executing them.
- Include failure containment, cancellation, timeout, shutdown, recovery, rollback, migration, unsupported
  consumer, and contradictory-assumption validation when applicable. State the accepted completion strength and
  every unvalidated claim.
- Present the exact integrated design and complete future validation plan to the user or named project decision
  authority. Obtain literal confirmation of that revision; a requested material change returns to Step 3.2,
  and missing confirmation returns the decision block in Step 5.1.

### Phase 5 — Stop, Recover, and Return

#### 5.1 Preserve an exact decision block or recovery record

- In author-design mode, stop on a missing consumer, project boundary, decision owner, accepted compatibility
  target, applicable reference, sibling judgment, material decision, or design-artifact permission. Preserve
  the alternatives, recommendation, affected decisions and obligations, exact question, current architecture
  evidence, evidence limits, risk, approved retained artifacts, decision owner, first recovery action, and
  handoff. Make no design-dependent write or implementation plan.
- In review mode, stop before an unresolved material judgment or proposed mutation. Preserve invalid or
  unsupported assumptions, current architecture evidence, evidence limits, affected consumers and obligations,
  risk, next decision owner, exact question or action, first recovery action, and handoff.
- For an error, cancellation, or timeout, retain only approved architecture evidence and scratch at its named
  boundary. State the unfinished obligation and resume point; do not convert partial analysis into a confirmed
  design or evidence-backed finding.

#### 5.2 Return the terminal record

- Return the universal fields, naming why any field is not applicable: operation and mode; accepted result;
  decision basis; actual owned object; terminal state selected from exactly `success`, `error`, `cancellation`,
  `timeout`, `blocked`, or `user-decision pause`; changed or reviewed paths; architecture and reference evidence;
  evidence limits; external reads or effects; compatibility decision; block; recovery; and handoff.
- The decision basis contains alternatives, sources, recommendation, literal user or named-authority decision or
  valid cited prior decision, trade-offs, resulting contracts, and reopen evidence. External reads or effects
  name the reference destination, exact current authority, retained output, and the separate facts `credential
  use: none`, `external mutation: none`, and `release effect: none`. Project-command evidence is not applicable
  because this operation executes no project code or tools; the validation plan records only future inputs.
- Add the package names, import paths, package directories or placement, package boundaries, module paths,
  module and process graph, process roles, public APIs or CLIs, dependency direction, invariants, configuration
  ownership, data/state/control flow, mutable-data and resource ownership and lifetime, concurrency and shutdown,
  trust and failure containment, recovery and rollback, budgets, diagnostic signals, alternatives, confirmed
  decisions or findings, affected consumers, compatibility and migration, validation questions and signals,
  evidence limits, unresolved questions, artifact-write permission, and non-goals.
- Complete author-design mode only with literal user confirmation of the integrated design, every material
  choice resolved by a literal user or named-authority decision or a valid cited prior decision, and the
  complete future validation plan. Complete review mode only with evidence-backed architecture findings.
  Otherwise return the exact decision block and recovery fields without calling it success.

## References

- [Evaluation checklist](checklists.md) is the local unchecked evaluation source for this skill.
