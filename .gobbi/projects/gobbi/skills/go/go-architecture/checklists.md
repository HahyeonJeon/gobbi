# Go Architecture Evaluation Checklist

Unchecked evaluation source for Go architecture work governed by [Go Architecture](SKILL.md). Apply these
scenarios to the exact operation, design subject, and returned architecture outcome under evaluation.

[Evaluation](../../evaluation/SKILL.md) owns filled results, architecture evidence, findings, and verdicts. This
source owns only reusable scenarios and unchecked conditions. A condition is not applicable only when inspected
architecture evidence proves why the named architecture obligation cannot affect the accepted result.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere in
this source that the scenario reuses.

## Project

### GOARC-SC-PROJECT-01 — Normal case: One explicit architecture mode governs the operation

The operation must select author-design mode or review mode before reading an external reference or writing an
approved design artifact. Each mode has a complete, different effect contract. Failure is observable when the
mode is implicit, authority is inherited, or one effect remains unclassified.

#### Checklist

- [ ] GOARC-CK-PROJECT-01-01 — The operation selects exactly one of author-design mode or review mode.
- [ ] GOARC-CK-PROJECT-01-02 — Every author-design project-path write, disposable write, Go cache effect, download, project code or tool execution, network access, pause point, terminal result, and recovery field matches Procedure 1.2.
- [ ] GOARC-CK-PROJECT-01-03 — Every review project-path write, disposable write, Go cache effect, download, project code or tool execution, network access, pause point, terminal result, and recovery field matches Procedure 1.2.
- [ ] GOARC-CK-PROJECT-01-04 — Credential use is a separate recorded fact and is none in both modes.
- [ ] GOARC-CK-PROJECT-01-05 — External mutation is a separate recorded fact and is none in both modes.
- [ ] GOARC-CK-PROJECT-01-06 — Release effect is a separate recorded fact and is none in both modes.

### GOARC-SC-PROJECT-02 — Expected failure: A required decision or effect authority is missing

The operation reaches an unresolved material choice, unapproved design-artifact write, unauthorized reference
read, or proposed mutation. The expected outcome pauses before the effect. Failure is observable when work
continues because the technical path is known or a neighboring action was authorized.

#### Checklist

- [ ] GOARC-CK-PROJECT-02-01 — The operation pauses before every unresolved material choice, unapproved design-artifact or scratch write, unauthorized external reference read, or proposed mutation.
- [ ] GOARC-CK-PROJECT-02-02 — No effect outside the exact selected-mode authority occurs.
- [ ] GOARC-CK-PROJECT-02-03 — The selected mode inherits no authority from a sibling result, cited link, design decision, or earlier mode.

- Also applies: GOARC-CK-PROJECT-01-04 (credential use remains explicit).
- Also applies: GOARC-CK-PROJECT-01-05 (external mutation remains explicit).
- Also applies: GOARC-CK-PROJECT-01-06 (release effect remains explicit).

## Structure

### GOARC-SC-STRUCTURE-01 — Normal case: The exact architecture object and system model are complete

The requested result can span consumers, package identities, modules, processes, configuration, state, and
failure paths. The expected model binds each exact object and architectural relationship before a choice is
confirmed. Failure is observable when a directory tree or diagram substitutes for responsibilities and
runtime contracts.

#### Checklist

- [ ] GOARC-CK-STRUCTURE-01-01 — One bound record names the acting agent, user or named project decision authority, design-artifact owner, affected consumers, accepted result, scope, compatibility target, inputs, outputs, non-goals, and requested terminal result.
- [ ] GOARC-CK-STRUCTURE-01-02 — Every design identity is named as its package name, import path, package directory or placement, package boundary, module path, public API or CLI, project command, process, configuration input, data or state, and consumer that applies.
- [ ] GOARC-CK-STRUCTURE-01-03 — The architecture graph records every package, module, and process boundary with its responsibility, consumer, dependency direction, and invariant.
- [ ] GOARC-CK-STRUCTURE-01-04 — The architecture model records configuration ownership and each data, state, and control-flow transition with its exact source and destination.
- [ ] GOARC-CK-STRUCTURE-01-05 — The architecture model records every mutable-data owner, resource owner and lifetime, goroutine or queue owner, cancellation path, backpressure bound, and shutdown completion path that applies.
- [ ] GOARC-CK-STRUCTURE-01-06 — The architecture model states every applicable trust boundary, protected-data flow, network exposure, failure-containment boundary, recovery or rollback path, performance or resource budget, diagnostic signal, compatibility or migration state, validation question, and evidence limit.

### GOARC-SC-STRUCTURE-02 — Poor quality: A preferred pattern replaces current-system study

The proposal starts from a generic layout or fashionable pattern without reconstructing existing consumers,
behavior, project decisions, and failure evidence. The expected outcome studies current project and prior-art
sources with explicit applicability. Failure is observable when missing architecture evidence becomes an
assumption.

#### Checklist

- [ ] GOARC-CK-STRUCTURE-02-01 — Current-system study covers repository rules, accepted design records, source and module layout, configuration declarations, public documentation, project command declarations, test sources, generated provenance, build constraints, consumer evidence, relevant history, and neighboring packages or processes.
- [ ] GOARC-CK-STRUCTURE-02-02 — Every material architecture claim is classified as observed behavior, documented intent, accepted decision, or inference.
- [ ] GOARC-CK-STRUCTURE-02-03 — Every used prior-art source records its authority, relevance, currency, applicability to the compatibility target, reuse constraint when applicable, and separate reuse disposition.

### GOARC-SC-STRUCTURE-03 — Rule violation: Architecture absorbs a sibling judgment

The integrated design needs package-level, concurrency, module, trust, diagnostic, performance, validation, or
project-command judgment. The expected outcome consumes that judgment from its singular sibling without
copying its procedure or widening its authority. Failure is observable when Architecture becomes a universal
Go design policy.

#### Checklist

- [ ] GOARC-CK-STRUCTURE-03-01 — Every package-level, concurrency, module, trust, diagnostic, performance, validation, project-command, and later-construction judgment remains with the exact sibling assigned in Procedure 1.3.
- [ ] GOARC-CK-STRUCTURE-03-02 — Every exact package pattern appears only as a future project-command selector or project-command evidence fact and never as a package design identity.

- Also applies: GOARC-CK-STRUCTURE-01-03 (Architecture still integrates the cross-package, module, and process graph).

## Performance

### GOARC-SC-PERFORMANCE-01 — Normal case: Resource and validation cost are architectural contracts

The architecture changes resource use or the cost of proving its claims. The expected result names budgets,
measurement questions, future validation signals, and accountable specialist judgments. Failure is observable
when scalability language replaces an accepted budget or the validation plan is broader than the claim.

#### Checklist

- [ ] GOARC-CK-PERFORMANCE-01-01 — Every architecture decision that can change latency, throughput, allocation, retained memory, garbage collection, CPU use, contention, startup, binary size, network use, disk use, process count, or build cost names the accepted budget or comparison question and its `go-performance` judgment.
- [ ] GOARC-CK-PERFORMANCE-01-02 — Every future validation item is bounded by its exact question, observable behavior or signal, evidence owner, project-command owner, environment, duration or repetition input, resource limit, and evidence limit.

### GOARC-SC-PERFORMANCE-02 — Edge case: Architecture study itself has bounded effects

The operation may inspect a large project or separately authorized external reference. The expected outcome
keeps all project code and tool execution, Go caches, and downloads absent and bounds every approved scratch or
reference result. Failure is observable when analysis convenience creates an unapproved operational cost.

#### Checklist

- [ ] GOARC-CK-PERFORMANCE-02-01 — Every approved design-scratch path and separately authorized read-only reference access has an exact scope, destination, output bound, retention or cleanup boundary, and current authority.

- Also applies: GOARC-CK-PROJECT-01-02 (author-design mode performs no project code or tool execution, Go cache write, or download).
- Also applies: GOARC-CK-PROJECT-01-03 (review mode performs no project code or tool execution, Go cache write, or download).

## Aesthetics

### GOARC-SC-AESTHETICS-01 — Poor quality: Architecture language hides exact contracts

The design uses labels such as clean, simple, scalable, idiomatic, safe, or service without naming the owned
object and trade-off. The expected outcome is cold-readable in mainstream Go and architecture terms. Failure
is observable when a reader must infer which consumer, boundary, flow, effect, or compatibility promise a
sentence means.

#### Checklist

- [ ] GOARC-CK-AESTHETICS-01-01 — Every claim uses the exact package name, import path, package directory or placement, package boundary, module path, public API or CLI, project command, process role, configuration input, data or state, consumer, decision authority, and future validation owner that applies.

- Also applies: GOARC-CK-CONSISTENCY-02-02 (comparative architecture terms resolve to exact trade-offs and distinctions).

### GOARC-SC-AESTHETICS-02 — Adversarial: Correct headings mask an empty design

The artifact contains a package diagram, alternatives table, decision heading, and validation heading but lacks
the contracts those forms imply. Cosmetic completeness must fail.

#### Checklist

- [ ] GOARC-CK-AESTHETICS-02-01 — No heading, diagram, table, cited pattern, or formatted decision record substitutes for the substantive architecture fields required by the Procedure.

- Also applies: GOARC-CK-STRUCTURE-01-06 (failure, resource, diagnostic, compatibility, and validation contracts remain substantive).

## Usage

### GOARC-SC-USAGE-01 — Normal case: Author-design mode returns a confirmed architecture

The caller requests a design for a Go application, service, command, library, or multi-package system. The
expected outcome studies the current system, resolves material choices, and returns the confirmed design plus
future validation plan. Failure is observable when the first proposal becomes final or implementation work
appears in the result.

A choice is material when different viable selections would change task scope or acceptance; user-visible
behavior; public API or CLI and compatibility or migration; package, module, or process boundary or dependency
direction; configuration, data, or state flow; mutable-data or resource ownership or lifetime; concurrency,
cancellation, or shutdown; trust, identity, authorization, cryptography, secrets, protected data, or network
exposure; failure containment, recovery, or rollback; performance or resource budget or measurement strategy;
diagnostic signals, redaction, retention, or access; validation strategy, observable test boundary, controllable
dependency, or strength of the completion claim; or artifact identity, release, external effect, or destructive
effect.

#### Checklist

- [ ] GOARC-CK-USAGE-01-01 — Current-system and applicable-reference study completes before an architecture proposal is recommended.
- [ ] GOARC-CK-USAGE-01-02 — Every viable design-dependent selection passes the complete material-or-routine classifier before design planning proceeds.
- [ ] GOARC-CK-USAGE-01-03 — The author-design result contains the literal user-confirmed integrated design with its exact architecture model, alternatives, decisions, trade-offs, compatibility state, migration obligations, and evidence limits.
- [ ] GOARC-CK-USAGE-01-05 — The result contains the complete future validation plan required by Procedure 4.3.
- [ ] GOARC-CK-USAGE-01-06 — The result contains no code skeleton, implementation plan, source implementation, generated edit, or executed project command.

- Also applies: GOARC-CK-PROJECT-01-02 (author-design writes stay within exact approved design-artifact and scratch boundaries).

### GOARC-SC-USAGE-02 — Normal case: Review mode returns evidence-backed findings

The caller requests review of an existing or proposed architecture. The expected outcome leaves the project and
design outputs unchanged and reports findings another decision owner can act on. Failure is observable when a
finding lacks its affected architecture object or silently becomes a remediation write.

#### Checklist

- [ ] GOARC-CK-USAGE-02-02 — Every finding records the exact architecture object and boundary, current behavior or proposal, architecture evidence, invalid or unsupported assumption, consequence, affected consumer and invariant, compatibility or operational risk, applicable alternative, evidence limit, decision need, and earliest responsible architecture decision.

- Also applies: GOARC-CK-PROJECT-01-03 (review keeps project paths, design outputs, and local outputs within its read-only/no-write boundary).
- Also applies: GOARC-CK-PROJECT-02-01 (review pauses before an unresolved material judgment or proposed mutation).
- Also applies: GOARC-CK-RISK-02-02 (the review decision block retains resumable state).

### GOARC-SC-USAGE-03 — Edge case: A fully determined routine choice proceeds

Accepted design or a governing project convention mechanically determines a local architecture detail and no
classifier dimension changes. The expected outcome records the basis and proceeds without interrupting the
decision authority. Failure is observable when convenience is mislabeled routine or trivial mechanics cause a
material-decision question.

#### Checklist

- [ ] GOARC-CK-USAGE-03-01 — Every routine choice is fully determined by a recorded accepted-design or governing-project-convention basis and changes no material-classifier dimension.
- [ ] GOARC-CK-USAGE-03-02 — Every eligible routine choice proceeds without a user-decision question.

### GOARC-SC-USAGE-04 — Edge case: A current prior decision resolves the same choice

A cited prior decision appears to resolve the pending material choice. The expected outcome uses it only when
the exact decision, affected context, and assumptions still match. Failure is observable when a citation alone
is treated as current authority.

#### Checklist

- [ ] GOARC-CK-USAGE-04-01 — A prior decision satisfies the material gate only when it resolves the same decision, its affected context and assumptions still match, and its source is cited.
- [ ] GOARC-CK-USAGE-04-02 — The prior-decision record names the exact decision, decision owner, source, affected context, assumptions, consumers, compatibility target, resulting contracts, and reopen trigger.

### GOARC-SC-USAGE-05 — Expected failure: Changed context makes a prior decision stale

A consumer, boundary, dependency, trust model, failure model, resource budget, validation strategy, or
compatibility promise differs from the cited decision's assumptions. The expected outcome reopens the material
choice and asks the exact question. Failure is observable when historical acceptance becomes permanent policy.

#### Checklist

- [ ] GOARC-CK-USAGE-05-01 — Every context or assumption change that can alter the prior decision reopens that decision.
- [ ] GOARC-CK-USAGE-05-02 — The reopened unresolved choice returns a decision block before any design-dependent plan or write.

- Also applies: GOARC-CK-USAGE-04-01 (a citation alone cannot satisfy the gate).

## Consistency

### GOARC-SC-CONSISTENCY-01 — Rule violation: Artifact permission is treated as decision authority

The caller permits a design document write while the material architecture choice remains unresolved, or
confirms the choice without permitting a file write. The two authorities must remain independent. Failure is
observable when either one is inferred from the other.

#### Checklist

- [ ] GOARC-CK-CONSISTENCY-01-01 — Design-artifact write permission grants no material-decision authority.
- [ ] GOARC-CK-CONSISTENCY-01-02 — A material architecture decision grants no design-artifact write permission.
- [ ] GOARC-CK-CONSISTENCY-01-03 — The operation records the decision authority and exact artifact path permission as separate facts.

### GOARC-SC-CONSISTENCY-02 — Normal case: Alternatives and the decision remain traceable

More than one credible architecture can satisfy the accepted scope. The expected outcome compares the choices
through the same architectural dimensions, recommends one from current architecture evidence, and preserves
the literal decision. Failure is observable when the chosen alternative is not reconstructable from the record.

#### Checklist

- [ ] GOARC-CK-CONSISTENCY-02-01 — Every material choice with more than one viable architecture compares at least two credible reference-backed alternatives.
- [ ] GOARC-CK-CONSISTENCY-02-02 — Each alternative records affected consumers, invariants, boundaries, dependencies, configuration/data/state/control flow, ownership and lifetime, concurrency and shutdown, failure containment and recovery, compatibility and migration, resource trade-offs, trust and diagnostic consequences, validation questions, preconditions, known failure modes, and evidence limits.
- [ ] GOARC-CK-CONSISTENCY-02-03 — The recommendation traces to current consumer, project, and reference evidence rather than familiarity or first-draft order.
- [ ] GOARC-CK-CONSISTENCY-02-04 — The decision record preserves the literal user or named-authority decision, decision owner, source, basis, accepted alternative, rejected alternatives, trade-offs, resulting contracts and compatibility state, reopen trigger, and unresolved questions.

## Risk

### GOARC-SC-RISK-01 — Adversarial: Happy-path structure hides failure or ownership gaps

The proposed package and process graph handles ordinary flow but breaks under cancellation, timeout, partial
failure, shutdown, resource pressure, protected input, rollback, migration, or missing diagnostics. The expected
outcome exposes those paths before confirmation. Failure is observable when the architecture depends on
unstated lifetime or operational assumptions.

#### Checklist

- [ ] GOARC-CK-RISK-01-01 — The architecture model covers every applicable success, error, cancellation, timeout, startup, shutdown, partial-failure, recovery, rollback, migration, resource-pressure, trust-boundary, protected-data, and missing-diagnostic path.
- [ ] GOARC-CK-RISK-01-02 — No responsibility, dependency, mutable state, resource lifetime, goroutine, queue, trust crossing, failure, compatibility promise, resource budget, diagnostic question, or validation claim lacks its exact accountable architecture or sibling owner.

### GOARC-SC-RISK-02 — Expected failure: The operation must stop with resumable state

Author-design mode lacks a required consumer, boundary, decision, sibling judgment, or artifact permission, or
review mode reaches an unresolved material judgment or proposed mutation. The expected outcome preserves the
exact state needed by the next decision owner. Failure is observable when the stop loses alternatives,
assumptions, retained artifacts, or the next action.

#### Checklist

- [ ] GOARC-CK-RISK-02-01 — Every author-design block preserves the alternatives, recommendation, affected decisions and obligations, exact question, current architecture evidence, evidence limits, risk, approved retained artifacts, decision owner, first recovery action, and handoff.
- [ ] GOARC-CK-RISK-02-02 — Every review block preserves the invalid or unsupported assumptions, current architecture evidence, evidence limits, affected consumers and obligations, risk, next decision owner, exact question or action, first recovery action, and handoff.

- Also applies: GOARC-CK-PROJECT-02-02 (no unauthorized effect occurs before the block).

## Overall

### GOARC-SC-OVERALL-01 — Normal case: The complete architecture outcome is coherent

The operation reaches its selected mode's recognized boundary and returns enough state for implementation,
future validation, or the next decision without private conversation context. The expected outcome includes
the universal and architecture-specific terminal fields. Failure is observable when a valid-looking artifact
omits an effect, decision, consumer, architecture object, evidence limit, or recovery path.

#### Checklist

- [ ] GOARC-CK-OVERALL-01-01 — The terminal result is exactly a user-confirmed design and future validation plan, evidence-backed architecture findings, or a decision block allowed by the selected mode.
- [ ] GOARC-CK-OVERALL-01-02 — The terminal record names operation and mode, accepted result, decision basis, actual owned object, terminal state, changed or reviewed paths, architecture and reference evidence, evidence limits, external reads or effects, compatibility decision, block, recovery, and handoff, or gives an architecture-evidence-based reason a field is not applicable.
- [ ] GOARC-CK-OVERALL-01-03 — The terminal record names the package identities and boundaries, module and process graph, process roles, public APIs or CLIs, dependency direction, invariants, configuration and flow, ownership and lifetimes, concurrency and shutdown, trust and failure containment, recovery and rollback, budgets, diagnostic signals, alternatives, decisions or findings, consumers, compatibility and migration, validation questions and signals, unresolved questions, artifact-write permission, and non-goals that apply.
- [ ] GOARC-CK-OVERALL-01-04 — Evaluation applies the unchecked checklist source of every active Go sibling in addition to this source.
- [ ] GOARC-CK-OVERALL-01-05 — The terminal state is exactly one of `success`, `error`, `cancellation`, `timeout`, `blocked`, or `user-decision pause`.
- [ ] GOARC-CK-OVERALL-01-06 — The compatibility decision is exactly one of `compatible`, `migration supplied`, `authorized break`, or `unsupported` when applicable; otherwise it is explicitly not applicable.

### GOARC-SC-OVERALL-02 — Adversarial: A partial architecture result is called success

The subject may contain a credible first draft, one confirmed choice, one reviewed boundary, or one strong
validation question while required fields remain unresolved. The expected outcome uses the matching
incomplete terminal state. Any broadened success claim fails.

#### Checklist

- [ ] GOARC-CK-OVERALL-02-01 — No incomplete, blocked, errored, cancelled, timed-out, or decision-paused architecture outcome is reported as success.

- Also applies: GOARC-CK-AESTHETICS-02-01 (cosmetic completeness cannot supply missing substance).
- Also applies: GOARC-CK-RISK-02-01 (an author-design stop retains resumable state).
- Also applies: GOARC-CK-RISK-02-02 (a review stop retains resumable state).
