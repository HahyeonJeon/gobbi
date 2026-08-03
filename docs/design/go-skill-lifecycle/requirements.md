# Go Skill Lifecycle Expansion - Requirements

## Contents

- [Goal](#goal)
- [Problem](#problem)
- [Result](#result)
- [Requirements](#requirements)
- [Scope](#scope)
- [Open Questions](#open-questions)

## Goal

> **Target:** A complete, independently loadable Go skill family that guides material Go work from design and diagnosis through verified artifacts and authorized release.<br>
> **Purpose:** Give agents one clear owner, route, operating boundary, vocabulary, and evaluation source for each supported Go concern.<br>
> **Why now:** The current seven-child family preserves strong development, design, module, testing, and toolchain practice, but it leaves security, standalone observability and crash capture, profiling-led performance, executable packaging, publication, architecture, and debugging without complete Go owners.

## Problem

### Current Situation

The current [`go` root](../../../.gobbi/projects/gobbi/skills/go/SKILL.md) routes seven children. It also carries a policy paragraph about traced services and an open observability gap, although the domain-skill standard requires a policy-free navigation root. The current children provide useful boundaries for concurrency, conventions, design, development, modules, testing, and toolchain use. Their sources and checklists preserve evidence that the revised family must not lose.

Inspection found six material weaknesses:

- **GOSK-01:** Go has no owner or complete route for security, standalone observability and crash capture, or profiling-led performance work.
- **GOSK-02:** executable and archive packaging is not separated from Go release classification, release compatibility analysis, exact version and tag decisions, readiness evidence, action specification, manager-granted authority, Git tag/ref or Git publication execution, named non-Git destination execution, post-action and external-consumer verification, and recovery semantics.
- **GOSK-03:** the current design lifecycle requires user confirmation only for selected public or compatibility decisions, not every material design decision lacking a cited prior decision for the same decision with matching context and assumptions.
- **GOSK-04:** procedures and checklists do not consistently trace every blocked-result and handoff field.
- **GOSK-05:** several contract terms are broad enough to hide different Go facts, commands, targets, interfaces, results, and compatibility states.
- **GOSK-06:** some checklist rows combine conditions that can pass or fail independently. For example, `GODEV-CK-PROJECT-01-02` combines behavior scope with side-effect authority, and `GODEV-CK-CONSISTENCY-05-02` combines building with passing.

These findings come from the current Go sources and checklists, the domain and type-writing standards, the evaluation checklist operation, adjacent TypeScript, Web, and Electron skill families, and official Go documentation cited in the final design.
The external evidence is sufficient only where its authority, relevance, currency, applicability, and license
are explicit and its reuse disposition remains separate. Later evaluation also found that the canonical Git
operation lacked the bounded release tag/ref executor contract, private-module validation lost its existing
authenticated-read path, package-command selectors had been used as package design identities, and three
change modes did not state credential use and external mutation as separate binary facts with exact external-owner handoffs.
The latest accepted review also found two projection errors: Git-owned definitions named `go-release`, which
would violate Gobbi Rule 4, and the richer design inventory did not distinguish itself from the literal
three-column root table.

### Problem and Impact

When a concern has no Go owner, an agent must improvise, borrow a partial contract from another domain, or overload a nearby child. That makes routing incomplete and can leave security, diagnostic, performance, artifact, and publication obligations unverified. When two results share one owner or one checklist row, a pass can hide an unperformed action or a blocked result. Ambiguous vocabulary also lets two agents report different contracts with the same words.

### Current and No-Change Context

The current family can continue to guide ordinary source changes, Go test sources and commands, module graph work, and tool use. With no change, work that crosses the uncovered lifecycle areas will keep relying on local judgment. The root will also continue to violate the navigation-only family shape. Adding isolated paragraphs to current skills would reduce some symptoms but would not create independently loadable results or separate local artifact preparation from externally authorized release.

## Result

### Actors and Outcomes

| Actor | Need | Desired observable outcome |
|---|---|---|
| Agent performing or reviewing Go work | Load only the guidance that matches the task | Every supported Go task routes to at least one applicable child, and multi-concern work loads all applicable children |
| User or project decision owner | Retain authority over material design | Every material design choice is classified by its effect on the accepted contract, supported by alternatives, and resolved by an explicit user decision or a cited prior decision for the same decision with matching context and assumptions |
| Manager | Grant current external or destructive authority | No release readiness claim authorizes a credential, network, Git, publication, or external mutation effect; the manager grants current authority for the exact effect and inputs |
| Git operation and conventions | Execute one caller-authorized release tag/ref lifecycle | The Git operation accepts a generic, caller-supplied, caller-neutral action specification and current manager authority for the same effect and inputs; preserves the exact tag/ref name, target Git object, repository, remote, tag form, signing or annotation rule, and non-force publication target; detects conflicts before mutation; performs only the exact local tag/ref mutation and non-force publication; verifies local and remote state; and returns exact recovery and handoff evidence; conventions define deterministic input and evidence fields without imposing project values |
| Named external-action owner | Execute authorized non-Git destination effects | Each non-Git destination mutation runs through its named owner with separately granted credential and network authority and returns exact external state |
| Private-module credential and destination owner | Supply the authorized authenticated-read boundary | The named private module or import-path scope, destination, credential delivery, redaction, and retention limits are exact; credentials and private-module settings are never persisted, exposed, copied into evidence, or logged |
| Go consumer of a package import path, public API or CLI, project command, or module path | Receive a stable and understandable contract | Each package import path, public API or CLI, project command, module path, binary, archive, and release claim states exact compatibility and evidence boundaries |
| Skill maintainer | Change one concern without duplicating sibling policy | Each claim and lifecycle result has one semantic owner and sibling relationships remain acyclic |
| Evaluator | Judge each active concern independently | Every child owns a traceable, atomic checklist and all active sibling checklists apply together |

### Expected Result

The result is one navigation-only Go root and fourteen direct, independently loadable children. The revised family retains the seven current capabilities and adds complete Go operations for architecture, debugging, security, observability, performance, packaging, and release. It defines exact result boundaries, composition rules, decision authority, blocked-result and handoff contracts, mainstream Go vocabulary, and checklist assurance for the whole family.

### External Boundary

| Aspect | Description |
|---|---|
| Inputs | The user-approved scope and decisions; project rules and contracts; the affected Go project; current Go family evidence; official Go documentation; applicable workflow authority |
| Outputs | Selective routing; self-contained child contracts; local verified artifacts; explicit blocked results and handoffs; unchecked evaluation checklist sources |
| Integration boundary | The family owns Go work, Go artifacts, and Go-domain release semantics. General Evaluation owns evidence resolution and verdicts. The manager grants current external or destructive authority. `go-release` builds, translates, and supplies the Git-owned caller-neutral action specification. The Git operation and conventions accept that caller-supplied specification plus current manager authority and own only the exact release tag/ref effect, including conflict detection, local mutation, non-force publication, local/remote verification, recoverable partial state, and handoff evidence. Only `go-release` references and calls Git; Git does not reference `go-release` or another skill. This one-way direction satisfies Gobbi Rule 4 while the eventual Git sources remain caller-neutral and contain no Gobbi or outside-skill reference. A named external-action owner performs each non-Git destination mutation. Authorized private-module network reads and credential use remain read-only external effects and never authorize external mutation. |
| Unchanged behavior | Principles, the four skill types, policy-free domain routing, existing Go development lifecycle strengths, project authority, and sibling checklist composition remain intact. Other domain families retain their own non-Go responsibilities. |

## Requirements

### Selective Navigation Without Root Policy

> **Statement:** The Go entry must route every supported Go task to all and only its applicable children, while owning no Go policy or procedure itself.<br>
> **Affected actors:** Agent performing or reviewing Go work; skill maintainer.<br>
> **Basis:** The domain-skill standard requires a navigation-only root, GOSK-01 identifies policy and a gap in the current root, and accepted OPT-R5-01 distinguishes design inventory from emitted schema.<br>
> **Observable result:** The root contains only domain frontmatter, a short orientation, and one exact routing row for each direct child in the literal three-column schema `Child skill | Type | Load when`; every trigger is copied byte for byte from its child, no owned-result column is emitted, and ordinary and multi-concern tasks select at least one child without a mandatory stage chain.

### Complete Independent Lifecycle Coverage

> **Statement:** Every approved Go lifecycle concern must have one independently loadable result owner with a clear completion boundary.<br>
> **Affected actors:** Agent performing or reviewing Go work; Go consumer; skill maintainer.<br>
> **Basis:** GOSK-01 and GOSK-02 show uncovered or conflated work, and the user selected a fourteen-child family.<br>
> **Observable result:** The family contains exactly the approved fourteen children, and each can state the result it owns without depending on sibling prose to complete it.

### One Semantic Owner and Acyclic Composition

> **Statement:** Every material claim, action, decision, and evidence obligation must have one owner, with siblings routing to rather than restating one another.<br>
> **Affected actors:** Agent performing or reviewing Go work; skill maintainer; evaluator.<br>
> **Basis:** Duplicate policy drifts, while broad operations must still compose for multi-concern changes.<br>
> **Observable result:** Child boundaries and handoffs identify one owner per claim, cross-skill dependencies point in one direction for that claim, and no pair of skills requires each other to supply the same missing contract. For release tag/ref execution, only `go-release` references and calls Git: it builds and supplies the caller-neutral contract that Git owns, while Git references no outside skill.

### Concrete Development and Design Contracts

> **Statement:** General Go code changes and material Go design choices must retain a complete study, design, bottom-up construction, and verification contract with explicit decision authority.<br>
> **Affected actors:** Agent changing Go code; user or project decision owner; Go consumer.<br>
> **Basis:** The existing Go Development operation is valuable, while GOSK-03 shows that its confirmation boundary is too narrow.<br>
> **Observable result:** Development retains `Study -> Design -> Build -> Verify`; development and architecture Procedures and checklists apply the same executable material-choice classifier before planning; material choices compare credible reference-backed alternatives and receive explicit user confirmation; routine execution choices proceed without a user question; code work composes with every applicable specialized operation.<br>
> **Material-choice classifier:** A choice is material when different viable selections would change task scope or acceptance; user-visible behavior; public API or CLI and compatibility or migration; package, module, or process boundary or dependency direction; configuration, data, or state flow; mutable-data or resource ownership or lifetime; concurrency, cancellation, or shutdown; trust, identity, authorization, cryptography, secrets, protected data, or network exposure; failure containment, recovery, or rollback; performance or resource budget or measurement strategy; diagnostic signals, redaction, retention, or access; validation strategy, observable test boundary, controllable dependency, or strength of the completion claim; or artifact identity, release, external effect, or destructive effect.<br>
> **Routine boundary:** A routine execution choice is fully determined by accepted design or governing project convention and changes none of those dimensions. Local syntax, formatting, or a mechanically determined private name can qualify. A prior accepted decision satisfies the gate only when it resolves the same decision, the affected context and assumptions still match, and its source is cited; changed context reopens it.
> **Architecture authority boundary:** Permission to write a caller-approved design artifact does not authorize a material design decision. Architecture author-design mode pauses unless the user decides the material choice or a cited prior decision resolves the same decision with matching context and assumptions.

### Exact Operational Results, Blocks, and Handoffs

> **Statement:** Every operation must define its observable completion, permitted side effects, terminal blocked result, recovery boundary, and exact handoff fields.<br>
> **Affected actors:** Agent performing Go work; user or project decision owner; downstream owner; evaluator.<br>
> **Basis:** GOSK-04 shows that blocked-result and handoff obligations are not consistently traceable; accepted GOIDEA-R4-01 requires strict binary credential-use and external-mutation facts for the three corrected change modes; accepted GOIDEA-R5-01 requires a caller-neutral, Rule-4-safe Git contract.<br>
> **Observable result:** Architecture, debugging, development, modules, testing, security, observability, performance, packaging, and release each define supported modes through one shared effect vocabulary. Every mode states project-path writes; disposable local diagnostic or artifact writes; Go cache and download effects; project code or tool execution; network access; credential use and external mutation as separate binary facts in one effect dimension; pause point; terminal result; and recovery. General development uses no credentials and performs no external mutation; any credentialed read belongs to the applicable specialist or tool owner under that owner's exact mode, while a result-dependent external action is coordinated through a named external-action owner and returned evidence or ends in an exact block and handoff. A security change uses credentials only under separate exact read or verification authority with protected scope and destination, ephemeral delivery, redacted evidence, declared cache state, and no credential or private-setting persistence; it never infers authority, performs external mutation, or publishes, and it sends secret rotation and provider, policy, or destination mutation to a named external-action owner. An observability change uses no credentials and performs no external mutation; destination provisioning, configuration, and mutation go to a named external-action owner, while diagnostic-send verification remains a distinct mode with a named test destination, separately authorized test credentials, and bounded approved test diagnostic external state. Both module modes preserve separately authorized authenticated reads for an exact private module or import-path scope and destination without persisting secrets or permitting external mutation. Each operation checklist traces these fields and its operation-specific terminal fields. The bounded Git release tag/ref executor separately accepts a caller-supplied, caller-neutral action specification plus current manager authority and preserves the exact tag/ref name, target Git object, repository, remote, tag form, signing or annotation input, conflict preflight, exact local mutation, non-force publication, local and remote verification, recoverable partial state, prohibited effects, recovery authority, and exact handoff evidence. Each path ends in a recognizable result or a bounded stop whose missing prerequisite, affected obligation, evidence, risk, owner, retained state, first recovery action, and handoff are explicit.

### Mainstream and Exact Go Vocabulary

> **Statement:** Durable guidance must use ordinary Go terms and distinguish facts that have different owners or effects.<br>
> **Affected actors:** All Go skill consumers and maintainers.<br>
> **Basis:** GOSK-05 and official Go documentation distinguish Go version selection, module language version, toolchain selection, package patterns, targets, commands, and consumer contracts.<br>
> **Observable result:** The family distinguishes package design identities — package name, import path, package directory or placement, package boundary, and public API or CLI — from an exact package pattern passed to a `go` or project command. `go-toolchain` owns package-pattern semantics; an operation may record the exact pattern it passed as command evidence. The family uses the accepted exact vocabulary for versions, commands, targets, APIs, compatibility decisions, observable test boundaries or controllable dependencies, results, exit paths, evidence records, module facts, and concrete owned objects; it does not use a project glossary to repair unclear prose.

### Atomic and Traceable Evaluation Sources

> **Statement:** Each child must own an unchecked evaluation checklist whose scenarios and rows independently cover its complete contract and compose with active sibling checklists.<br>
> **Affected actors:** Evaluator; skill maintainer; agent returning Go work.<br>
> **Basis:** GOSK-04 and GOSK-06, plus the Checklist operation's fixed perspective, scenario, traceability, and atomicity rules.<br>
> **Observable result:** Each checklist covers all eight perspectives or gives an evidence-based not-applicable reason, traces requirements and operation exits, uses stable IDs and source caps, splits independently answerable verbs with the placeholder test, and rejects cosmetic compliance.

### Preserve Proven Existing Contracts

> **Statement:** Expansion must preserve the current Go family's proven boundaries and evidence unless an accepted decision explicitly supersedes them.<br>
> **Affected actors:** Existing Go skill consumers; skill maintainer; evaluator.<br>
> **Basis:** Current sources already separate concurrency, conventions, design, development, modules, testing, and toolchain concerns well.<br>
> **Observable result:** The revised family retains concurrency and written-form preferences, caller-led design, the development lifecycle, module consumer, graph, workspace, private-module authenticated-read support, and compatibility checks, test-kind and evidence-limit distinctions, and toolchain side-effect classification while routing newly owned concerns to their dedicated children. Module authenticated reads require exact current manager authority, named private module or import-path scope and destination, ephemeral credential handling, redacted evidence, and no external mutation.

## Scope

| Item | Status | Reason |
|---|---|---|
| `go` navigation root | Included | It must become policy-free and route the complete approved family |
| `go-concurrency` preference | Included | Preserve and reconcile concurrent ownership, cancellation, synchronization, and race-safety judgment |
| `go-conventions` preference | Included | Preserve and reconcile Go names, files, imports, documentation, error text, and formatting judgment |
| `go-design` preference | Included | Preserve and strengthen package name, import path, package directory or placement, package boundary, public API or CLI, type, error, ownership, and resource-lifetime judgment |
| `go-development` operation | Included | Preserve `Study -> Design -> Build -> Verify`; in general development, credential use is none and external mutation is forbidden; compose with the exact credentialed-read owner; coordinate and consume returned external-action evidence or return an exact owner, prerequisite, retained-state, recovery-action, and handoff block |
| `go-modules` operation | Included | Own module path, layout, graph, workspace, dependencies, tools, external-consumer validation, module consumer compatibility analysis, and the exact facts release needs; preserve authorized authenticated reads for private modules in author and validation modes without persisting credentials or permitting external mutation; own no version or tag decision, tag creation, publication, or recovery |
| `go-testing` operation | Included | Preserve distinct test kinds, evidence boundaries, regressions, race, fuzz, benchmark, and blocked-test results |
| `go-toolchain` tool | Included | Preserve named Go tool behavior, project command side effects, selected Go toolchain version, diagnostics, exact package patterns, and `GOOS/GOARCH` target facts |
| `go-architecture` operation | Included | Own a confirmed project or multi-package design and its validation plan |
| `go-debugging` operation | Included | Own reproduction and root-cause diagnosis or a bounded diagnostic plan |
| `go-security` operation | Included | Own Go security risk and result; bind any credentialed read or verification to exact separate authority and protected handling; perform no external mutation or publication; verify returned evidence from the named external-action owner or return an exact block and handoff |
| `go-observability` operation | Included | Own Go logs, metrics, traces, crash capture, redaction, and signal verification; in change mode, credential use is none and external mutation is forbidden, with destination provisioning or mutation handed to its named owner, while diagnostic-send verification keeps its separate bounded test-destination contract |
| `go-performance` operation | Included | Own profiling-led performance investigation and complete verified performance changes |
| `go-packaging` operation | Included | Own verified local Go binaries, archives, metadata, checksums, and smoke evidence |
| `go-release` operation | Included | Own Go-domain release classification, release compatibility analysis, exact version and tag decisions, readiness evidence, action specification, post-action and external-consumer verification, recovery semantics, and the release result; build, translate, and supply the Git-owned caller-neutral tag/ref action specification; reference and call Git in that one direction; coordinate and verify returned executor results without inheriting manager, Git, credential, network, publication, or external-mutation authority |
| [`git/SKILL.md`](../../../.gobbi/projects/gobbi/skills/git/SKILL.md) | Included, bounded consistency touch | Add only a caller-neutral authorized release tag/ref executor lifecycle that consumes a caller-supplied action specification and current manager authority, rejects conflicts, performs the exact local mutation and non-force publication, verifies local and remote state, retains recoverable partial state, returns exact handoff evidence, and references no outside skill |
| [`git/conventions.md`](../../../.gobbi/projects/gobbi/skills/git/conventions.md) | Included, bounded consistency touch | Define caller-neutral deterministic action-specification and result fields for the release tag/ref lifecycle while keeping tag form, signing or annotation, repository, and remote as caller-supplied project-policy inputs and referencing no outside skill |
| [`skill-writing/domain-skill.md`](../../../.gobbi/projects/gobbi/skills/skill-writing/domain-skill.md) | Included | Admit the free capability words `debugging` and `performance` under the naming register's same-change rule; Official Go Diagnostics and PGO or performance material support the selected names |
| One checklist per child | Included | Each active concern needs a separately loadable evaluation source that composes with siblings |
| Other outside-Go edits | Excluded | Only the included naming-register admission, bounded Git operation/conventions consistency touch, and exact naming or routing consistency co-touches are authorized |
| Generic deployment and service rollout | Excluded | Go release stops at published Go artifacts and their recovery; runtime rollout belongs to deployment owners |
| Containers and operating-system packaging | Excluded | These are distinct artifact and platform concerns outside this Go family expansion |
| Installation orchestration and environment configuration | Excluded | They belong to their platform or configuration owners |
| Data migration, traffic promotion, and live-health ownership | Excluded | They require service or product deployment contracts not granted here |
| A fixed Go release in durable guidance | Rejected | The project contract and live Go policy determine supported versions |
| Mandatory third-party tools | Rejected | Project-selected tools may supplement the Go distribution but cannot become a universal family requirement |
| Project-jargon glossary | Rejected | Mainstream exact wording must appear at each claim rather than through indirection |

## Open Questions

No Phase 1 question remains open. The user has fixed the family size, child types, ownership boundaries,
vocabulary replacements, checklist model, non-goals, and reopen conditions. Later evidence may reopen a design
decision only through the conditions recorded in the integrated Ideation result.
