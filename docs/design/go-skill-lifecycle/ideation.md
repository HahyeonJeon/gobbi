# Go Skill Lifecycle Expansion — Ideation

> **Document role:** Integrated Ideation result<br>
> **Purpose:** Preserve the finalized problem, study foundation, hierarchical decisions, and integrated design as one independently readable result.<br>
> **Output boundary:** This document contains no ordered implementation tasks, implementation diff, prototype, code spike, benchmark, experiment, or completed future validation. Planned validation remains future work.

## Contents

- [Summary](#summary)
- [Requirements](#requirements)
- [Study](#study)
- [Topics](#topics)
- [Decisions](#decisions)
- [Design](#design)
- [Quality and Operations](#quality-and-operations)
- [Risks and Validation](#risks-and-validation)
- [Deferred and Rejected](#deferred-and-rejected)

## Summary

The current Go domain family routes seven useful children but leaves architecture, debugging, security,
standalone observability and crash capture, profiling-led performance, executable packaging, and external
publication without complete Go owners. Its root also contains traced-service policy even though a domain
root must own navigation only. Current procedure exits and checklist rows do not consistently expose all
blocked-result and handoff facts, and some checklist rows join conditions that can pass independently.

The selected direction is a policy-free `go` root with exactly fourteen direct children. The existing three
preferences, three operations, and one tool remain. Seven operations are added: `go-architecture`,
`go-debugging`, `go-security`, `go-observability`, `go-performance`, `go-packaging`, and `go-release`. Routing
is outcome-led and may load several children; it imposes no mandatory stage chain. Each material claim has one
semantic owner.

The decisive evidence is the project's domain and ordinary skill standards, the current Go sources and
checklists, adjacent TypeScript, Web, and Electron patterns, and official Go documentation for security,
diagnostics, profile-guided optimization, modules, the `go` command, toolchain selection, testing, structured
logging, and runtime crash information. The main trade-off is maintenance: fourteen skills and checklists cost
more to keep current, but they give each concern an independent result, selective route, and evaluation owner.

The final scope covers the root, all fourteen children, a checklist for each child, the naming-register touch
that admits `debugging` and `performance` as free capability words, and only the canonical Git operation and
conventions changes needed for one caller-neutral authorized release tag/ref executor lifecycle. `go-release`
builds and supplies that Git-owned contract in the only skill-reference direction; Git references no outside
skill. It excludes generic
deployment, containers, operating-system packaging, installation orchestration, service rollout, data
migration, environment configuration, traffic promotion, and live-health ownership. Durable guidance does not
freeze a Go release, require third-party tools, or depend on a project-jargon glossary.

## Requirements

### Goal

> **Target:** A complete, independently loadable Go skill family that guides material Go work from design and diagnosis through verified artifacts and authorized release.<br>
> **Purpose:** Give agents one clear owner, route, operating boundary, vocabulary, and evaluation source for each supported Go concern.<br>
> **Why now:** The current family has strong foundations but seven missing or conflated owners, a policy-bearing root, ambiguous terminal contracts, and non-atomic checklist evidence.

### Problem

The current [`go` root](../../../.gobbi/projects/gobbi/skills/go/SKILL.md) routes concurrency, conventions,
design, development, modules, testing, and toolchain guidance. The current children preserve valuable Go
practice. Six findings define the supported problem:

- **GOSK-01:** security, standalone observability and crash capture, and profiling-led performance need Go owners and routes.
- **GOSK-02:** executable or archive packaging must be distinct from Go-domain release classification, release compatibility analysis, exact version and tag decisions, readiness evidence, action specification, manager-granted authority, Git tag/ref or Git publication execution, named non-Git destination execution, post-action and external-consumer verification, and recovery semantics.
- **GOSK-03:** every material design decision, including internal design, needs reference-backed alternatives and user confirmation unless a cited prior decision resolves the same decision with matching affected context and assumptions.
- **GOSK-04:** procedures and checklists must trace all blocked-result and handoff fields.
- **GOSK-05:** durable claims must use exact mainstream Go vocabulary.
- **GOSK-06:** checklist rows must not combine independently answerable verb phrases.

With no change, agents will continue to improvise uncovered Go concerns or overload nearby skills. A partial
pass can hide an unfinished operation, and different agents can interpret the same generic term as different
Go facts.

### Result

| Actor | Need | Observable result |
|---|---|---|
| Agent performing or reviewing Go work | Select only relevant guidance | Every supported task routes to at least one child, and multi-concern work loads all applicable children |
| User or project decision owner | Keep material design authority | Every material design choice is classified by contract effect, has compared evidence, and receives an explicit decision or a cited prior decision for the same decision with matching affected context and assumptions |
| Manager | Grant current external or destructive authority | No release-readiness result authorizes an external effect; the manager grants the exact effect and inputs to a named executor |
| Git operation and conventions | Execute one caller-authorized release tag/ref lifecycle | The Git operation accepts a caller-supplied, caller-neutral action specification and current manager authority for the same effect and inputs; preserves the exact tag/ref name, target Git object, repository, remote, tag form, signing or annotation rule, and non-force publication target; detects conflicts before mutation; performs only the exact local tag/ref mutation and non-force publication; verifies local and remote state; and returns exact recovery and handoff evidence; conventions define deterministic fields without imposing project values |
| Named external-action owner | Execute an authorized non-Git destination effect | The named owner uses only separately granted credential and network authority and returns exact destination state |
| Private-module credential and destination owner | Supply the authorized authenticated-read boundary | The named private module or import-path scope, destination, credential delivery, redaction, and retention limits are exact; credentials and private-module settings are never persisted, exposed, copied into evidence, or logged |
| Go consumer of a package import path, public API or CLI, project command, or module path | Receive an exact stable contract | Each package import path, public API or CLI, project command, module path, binary, archive, and release claim states compatibility and evidence limits |
| Skill maintainer | Evolve one concern without sibling drift | Every claim and independently observable result has one owner |
| Evaluator | Judge active concerns independently and together | Every child owns one atomic checklist and all active sibling checklists apply |

Inputs are the accepted task and project contract, affected Go project, user decisions, current Go family,
official Go documentation, and workflow authority. Outputs are selective routing, self-contained child
contracts, verified local artifacts, terminal records, and unchecked checklist sources. General Evaluation
owns evidence resolution and verdicts. The manager grants current external or destructive authority. Git
performs only the exact authorized release tag/ref mutation and non-force publication through the bounded
Git executor contract. A named external-action owner performs each non-Git
destination mutation. Authorized private-module network reads and credential use are read-only external
effects, not authority for external mutation.
`go-release` builds, translates, and supplies the Git-owned caller-neutral action specification. Only
`go-release` references and calls Git; Git does not reference `go-release` or another skill. This one-way
direction satisfies Gobbi Rule 4 while the eventual Git sources remain caller-neutral and contain no Gobbi or
outside-skill reference.

### Required Outcomes

#### Selective Navigation Without Root Policy

> **Statement:** The Go entry routes every supported task to all and only its applicable children and owns no Go policy or procedure.<br>
> **Affected actors:** Acting agent; skill maintainer.<br>
> **Basis:** Domain Skill standard and GOSK-01.<br>
> **Observable result:** The root has only domain frontmatter, a short orientation, and fourteen exact routing rows in the literal schema `Child skill | Type | Load when`; every trigger is copied byte for byte from its child, no owned-result column is emitted, it may load several children, and it defines no mandatory stage chain.

#### Complete Independent Lifecycle Coverage

> **Statement:** Each approved Go concern has one independently loadable result owner.<br>
> **Affected actors:** Acting agent; Go consumer; skill maintainer.<br>
> **Basis:** GOSK-01, GOSK-02, and the user-selected family.<br>
> **Observable result:** Exactly fourteen direct children can each state a recognizable result without sibling prose repairing the contract.

#### One Semantic Owner and Acyclic Composition

> **Statement:** Every material claim, action, decision, and evidence obligation has one owner; siblings route rather than restate.<br>
> **Affected actors:** Acting agent; maintainer; evaluator.<br>
> **Basis:** Domain Skill standard and current duplication risk.<br>
> **Observable result:** Claim ownership is singular, sibling links are directional for each claim, and no pair reciprocally supplies the same missing contract. For release tag/ref execution, only `go-release` references and calls Git: it builds and supplies the caller-neutral contract that Git owns, while Git references no outside skill.

#### Concrete Development and Design Contracts

> **Statement:** General Go code changes retain `Study -> Design -> Build -> Verify`, and every material design choice receives reference-backed comparison and user confirmation unless a cited prior decision resolves the same decision with matching affected context and assumptions.<br>
> **Affected actors:** Agent changing Go code; user or project decision owner; Go consumer.<br>
> **Basis:** Current Go Development, Principles, and GOSK-03.<br>
> **Observable result:** Development and architecture run the same executable material-choice classifier before planning. Material choices record evidence and authority before a compiling skeleton; routine execution choices fully determined by accepted design or governing convention proceed without a user question; specialized code work composes with development without duplicate policy.<br>
> **Material-choice classifier:** A choice is material when different viable selections would change task scope or acceptance; user-visible behavior; public API or CLI and compatibility or migration; package, module, or process boundary or dependency direction; configuration, data, or state flow; mutable-data or resource ownership or lifetime; concurrency, cancellation, or shutdown; trust, identity, authorization, cryptography, secrets, protected data, or network exposure; failure containment, recovery, or rollback; performance or resource budget or measurement strategy; diagnostic signals, redaction, retention, or access; validation strategy, observable test boundary, controllable dependency, or strength of the completion claim; or artifact identity, release, external effect, or destructive effect.<br>
> **Routine and prior-decision boundary:** A routine execution choice is fully determined by accepted design or governing project convention and changes none of those dimensions. Local syntax, formatting, or a mechanically determined private name can qualify. A prior accepted decision satisfies the gate only when it resolves the same decision, the affected context and assumptions still match, and its source is cited; changed context reopens it.
> **Architecture authority boundary:** Permission to write a caller-approved design artifact is separate from authority to make a material design decision. Architecture author-design mode pauses unless the user decides the material choice or a cited prior decision resolves the same decision with matching affected context and assumptions.

#### Exact Operational Results, Blocks, and Handoffs

> **Statement:** Every operation defines success, permitted side effects, blocked result, recovery boundary, and exact handoff fields.<br>
> **Affected actors:** Acting agent; downstream owner; evaluator.<br>
> **Basis:** Operation Skill standard and GOSK-04.<br>
> **Observable result:** Every supported mode for architecture, debugging, development, modules, testing, security, observability, performance, packaging, and release states project-path writes; disposable local diagnostic or artifact writes; Go cache and download effects; project code or tool execution; network access; credential use and external mutation as separate binary facts; pause point; terminal result; and recovery. General development uses no credentials and performs no external mutation; it routes credentialed reads to the applicable specialist or tool owner under that owner's exact mode and coordinates any result-dependent external action through a named external-action owner. Security change binds credential use to separately authorized exact read or verification needs and protected handling, performs no external mutation or publication, and verifies returned external-owner evidence. Observability change uses no credentials and performs no external mutation; destination provisioning, configuration, and mutation go to a named external-action owner, while diagnostic-send verification retains its distinct bounded test-destination authority. Both module modes preserve separately authorized authenticated reads for an exact private module or import-path scope and destination without persisting secrets or permitting external mutation. The bounded Git release tag/ref executor separately accepts a caller-supplied, caller-neutral action specification plus current manager authority and preserves the exact tag/ref name, target Git object, repository, remote, tag form, signing or annotation input, conflict preflight, exact local mutation, non-force publication, local and remote verification, recoverable partial state, prohibited effects, recovery authority, and exact handoff evidence. Every path reaches a recognizable completion, recoverable state, or explicit stop with the affected obligation, evidence, risk, owner, prerequisite, retained state, first recovery action, and handoff.

#### Mainstream and Exact Go Vocabulary

> **Statement:** Every durable claim distinguishes package design identity — package name, import path, package directory or placement, package boundary, and public API or CLI — from an exact package pattern passed to a `go` or project command; it names the minimum supported Go version, selected Go toolchain version, module's Go language version, project command, `GOOS/GOARCH` target, behavior, owned object, state, and evidence record.<br>
> **Affected actors:** All family consumers and maintainers.<br>
> **Basis:** GOSK-05 and official Go documentation.<br>
> **Observable result:** Version, project command, `GOOS/GOARCH` target, compatibility, testing, evidence, module, and lifecycle claims use the accepted exact vocabulary inline.

#### Atomic and Traceable Evaluation Sources

> **Statement:** Every child owns one unchecked checklist with independent conditions and full contract traceability; all active sibling sources apply.<br>
> **Affected actors:** Evaluator; maintainer; acting agent.<br>
> **Basis:** Checklist operation, GOSK-04, and GOSK-06.<br>
> **Observable result:** Sources cover eight perspectives, applicable scenario classes, stable IDs, source caps, atomic rows, blocked results, handoffs, and anti-cosmetic-compliance cases.

#### Preserve Proven Existing Contracts

> **Statement:** Expansion retains existing Go strengths unless the accepted ownership map expressly moves a claim.<br>
> **Affected actors:** Existing family consumers; maintainer; evaluator.<br>
> **Basis:** Current Go skills and checklists.<br>
> **Observable result:** Concurrency, written-form, caller-led design, four-phase development, module consumer, workspace and private-module authenticated-read support, testing evidence, and toolchain side-effect contracts remain available and coherent. Module authenticated reads require exact current manager authority, named private scope and destination inputs, ephemeral credential handling, redacted evidence, and no external mutation.

### Scope

| Item | Status | Reason |
|---|---|---|
| `go` and all fourteen named children | Included | They are the complete accepted family |
| One checklist per child | Included | Each independently loadable concern needs reusable evaluation conditions |
| [`git/SKILL.md`](../../../.gobbi/projects/gobbi/skills/git/SKILL.md) | Included, bounded consistency touch | Add only a caller-neutral authorized release tag/ref executor lifecycle that consumes a caller-supplied action specification and current manager authority, rejects conflicts, performs the exact local mutation and non-force publication, verifies local and remote state, retains recoverable partial state, returns exact handoff evidence, and references no outside skill |
| [`git/conventions.md`](../../../.gobbi/projects/gobbi/skills/git/conventions.md) | Included, bounded consistency touch | Define caller-neutral deterministic action-specification and result fields while keeping tag form, signing or annotation, repository, and remote as caller-supplied project-policy inputs and referencing no outside skill |
| [`skill-writing/domain-skill.md`](../../../.gobbi/projects/gobbi/skills/skill-writing/domain-skill.md) | Included | Admit the free capability words `debugging` and `performance` under the naming register's same-change rule; official Go Diagnostics and PGO or performance material support the selected names |
| Other outside-Go edits | Excluded | Only the included naming-register admission, bounded Git operation/conventions consistency touch, and exact naming or routing consistency co-touches are authorized |
| Generic deployment, containers, operating-system packaging, installation orchestration, service rollout | Excluded | They have different platform, authority, artifact, and recovery owners |
| Data migration, environment configuration, traffic promotion, live-health ownership | Excluded | They belong to service, product, configuration, deployment, or operational owners |
| Fixed Go release in durable guidance | Rejected | The project contract and live Go release policy determine it |
| Mandatory third-party tools | Rejected | Project-selected tools may supplement but not define universal family behavior |
| Project-jargon glossary | Rejected | Exact mainstream terms must appear where each claim is made |

### Questions

| Question | Resolution | Effect |
|---|---|---|
| Which family size and shape? | Exactly fourteen direct children under a policy-free root | Fixes the topology and maintenance trade-off |
| Which operations stop before code or publication? | Mixed result boundaries | Fixes composition and authority |
| Who confirms design? | The user confirms every material design choice unless a cited prior decision resolves the same decision with matching affected context and assumptions | Strengthens development and architecture contracts |
| How are checklists owned? | One per child; all active sibling sources apply | Fixes evaluation composition |
| Are later design questions open? | No | The design is ready for validation and later planning without guessing |

## Study

### Internal Study

| Source | Location | Assessment | License | Lesson |
|---|---|---|---|---|
| Current Go family | [`go/`](../../../.gobbi/projects/gobbi/skills/go/) | Canonical at base `df18ccda`; direct evidence | Same project | Preserve seven strong owners, checklists, module consumer checks, and authorized authenticated private-module reads; close root policy, lifecycle, handoff, vocabulary, and atomicity gaps |
| Skill Writing and type standards | [`skill-writing/`](../../../.gobbi/projects/gobbi/skills/skill-writing/) | Governing current standards | Same project | Use a policy-free root whose literal table is exactly `Child skill \| Type \| Load when`, copies triggers byte for byte, and emits no result column; keep the richer child/result table as design inventory; use self-contained operation, preference, and tool children; admit new free capability words in the same change |
| Evaluation Checklist operation | [`evaluation/checklist/SKILL.md`](../../../.gobbi/projects/gobbi/skills/evaluation/checklist/SKILL.md) | Governing current checklist standard | Same project | Use eight perspectives, literal scenario classes, stable IDs, caps, traceability, atomicity, and cosmetic-compliance pilots |
| TypeScript family | [`typescript/`](../../../.gobbi/projects/gobbi/skills/typescript/) | Maintained adjacent family | Same project | General development composes with specialized operations; local artifacts can precede publication |
| Web family | [`web/`](../../../.gobbi/projects/gobbi/skills/web/) | Maintained adjacent family with different runtime | Same project | Security and observability may own complete verified concern changes |
| Electron Release | [`electron-release/SKILL.md`](../../../.gobbi/projects/gobbi/skills/electron/electron-release/SKILL.md) | Maintained authority and recovery prior art | Same project | Bind the release result to exact artifacts, action specification, returned executor evidence, post-action verification, and recovery semantics while manager and effect executors retain authority |
| Canonical Git operation and conventions | [`git/SKILL.md`](../../../.gobbi/projects/gobbi/skills/git/SKILL.md), [`git/conventions.md`](../../../.gobbi/projects/gobbi/skills/git/conventions.md) | Governing current Git lifecycle and deterministic mappings; directly applicable | Same project | Preserve the local-first session lifecycle and add only a caller-neutral bounded release tag/ref executor that accepts caller-supplied exact inputs plus current manager authority; preserves the exact tag/ref, target, repository, remote, tag form, signing or annotation, and publication target; detects conflicts; verifies local and remote state; retains recoverable partial state; returns exact handoff; and references no outside skill |

### External Study

| Source | Link | Authority | Relevance | Currency | Applicability | License | Reuse disposition | Lesson |
|---|---|---|---|---|---|---|---|---|
| Go Security Best Practices | [go.dev](https://go.dev/doc/security/best-practices) | Official Go team guidance | Direct evidence for supported releases, dependency and vulnerability review, fuzzing, race, and vet obligations | Live page checked 2026-08-03; release-sensitive advice must be reread when used | Applies to Go source, dependency, and verification contracts; project security rules remain controlling | [CC BY 4.0 site content](https://go.dev/copyright) | Adopt; cite and paraphrase | Security combines supported releases, dependency review, vulnerability analysis, fuzzing, race, and vet evidence |
| Diagnostics | [go.dev](https://go.dev/doc/diagnostics) | Official Go diagnostics guidance | Direct basis for debugging, profiling, tracing, runtime-statistics boundaries, and the `debugging` name | Live page checked 2026-08-03; tool details must be reread for the selected toolchain | Applies to Go diagnostic ownership and evidence; project commands and safety bounds remain inputs | [CC BY 4.0 site content](https://go.dev/copyright) | Adopt; cite and paraphrase | Keep profiling, tracing, debugging, and runtime statistics distinct |
| Profile-guided optimization | [go.dev](https://go.dev/doc/pgo) | Official Go performance guidance | Direct basis for representative profiles, iterative comparison, and the `performance` name | Live page checked 2026-08-03; version-sensitive PGO behavior must be reread | Applies when PGO or profile-led optimization is in scope; it does not impose PGO on every project | [CC BY 4.0 site content](https://go.dev/copyright) | Adopt; cite and paraphrase | PGO needs representative profiles and iterative comparison |
| Module release workflow | [go.dev](https://go.dev/doc/modules/release-workflow/) | Official Go module workflow | Direct evidence for module consumer checks, version/tag release inputs, and tag-based publication semantics | Live page checked 2026-08-03; command and policy details must be reread before release work | Applies to Go modules and informs `go-release`; it does not own binary packaging or current authority | [CC BY 4.0 site content](https://go.dev/copyright) | Adopt; cite and paraphrase | Module evidence informs release-owned exact version and tag decisions |
| Module layout | [go.dev](https://go.dev/doc/modules/layout) | Official Go module layout guidance | Direct evidence for module, package directory, import-path, library, and `cmd/` placement identities | Live page checked 2026-08-03; stable structure guidance with no fixed project layout | Applies as prior art; the project contract selects its actual package placement and boundaries | [CC BY 4.0 site content](https://go.dev/copyright) | Adopt; cite and paraphrase | Modules may hold libraries and `cmd/` commands with different consumer paths |
| Go command reference | [pkg.go.dev](https://pkg.go.dev/cmd/go) | Official `go` command source documentation | Live syntax owner for project-command effects, exact package-pattern selectors, flags, outputs, and `GOOS/GOARCH` targets | Live page checked 2026-08-03; the operation must bind the selected Go toolchain version | Applies to `go` command semantics; a project wrapper remains the named project command | [BSD-style Go source and API documentation](https://go.dev/LICENSE) | Adopt; cite and paraphrase | Exact package patterns select command inputs; they do not identify package design ownership |
| Go toolchains | [go.dev](https://go.dev/doc/toolchain) | Official Go toolchain-selection guidance | Direct evidence that minimum support, module language version, and selected toolchain are distinct | Live page checked 2026-08-03; selection behavior must be reread when version-sensitive | Applies to toolchain facts; the project supplies its actual minimum and selected versions | [CC BY 4.0 site content](https://go.dev/copyright) | Adopt; cite and paraphrase | Keep support, module language, and selected toolchain facts separate |
| Go release policy | [go.dev](https://go.dev/doc/devel/release#policy) | Official Go release-support policy | Direct evidence that current supported releases are live facts unsuitable for fixed durable prose | Live page checked 2026-08-03 and explicitly treated as time-sensitive | Applies when assessing support; the project may promise a different supported range | [CC BY 4.0 site content](https://go.dev/copyright) | Adopt as live lookup; cite and paraphrase | Durable skills record selected values rather than freezing a release number |
| `runtime/debug` | [pkg.go.dev](https://pkg.go.dev/runtime/debug) | Official standard-library API documentation | Direct evidence for build information, stack capture, crash handling, and runtime diagnostics | Live page checked 2026-08-03; bind claims to the selected Go toolchain version | Applies when those APIs match the diagnostic question; not a universal observability requirement | [BSD-style Go source and API documentation](https://go.dev/LICENSE) | Adopt; cite and paraphrase | Use native build-info, stack, and crash terms |
| `testing` | [pkg.go.dev](https://pkg.go.dev/testing) | Official standard-library API documentation | Direct evidence for tests, examples, fuzzing, benchmarks, and command-visible behavior | Live page checked 2026-08-03; bind details to the selected Go toolchain version | Applies to native Go evidence; project test commands may add stricter behavior | [BSD-style Go source and API documentation](https://go.dev/LICENSE) | Adopt; cite and paraphrase | Preserve distinct evidence kinds and limits |
| `log/slog` | [pkg.go.dev](https://pkg.go.dev/log/slog) | Official standard-library API documentation | Direct evidence for structured log records, attributes, levels, and handlers | Live page checked 2026-08-03; bind API details to the selected Go toolchain version | Applies when `log/slog` is used or compared; it is not mandated over project-selected logging | [BSD-style Go source and API documentation](https://go.dev/LICENSE) | Adopt as reference, not mandate; cite and paraphrase | Use native structured-record terms without mandating one logger |
| Go interface guidance | [go.dev](https://go.dev/wiki/CodeReviewComments#interfaces) | Official Go-maintained community guidance, not the language specification | Relevant prior art for consumer-defined interfaces and avoiding mock-only abstraction | Live page checked 2026-08-03; community guidance may evolve | Applies as a design preference when project and consumer evidence do not require another shape | [CC BY 4.0 site content](https://go.dev/copyright) | Adopt as preference evidence; cite and paraphrase | Prefer consumer-defined interfaces and avoid mock-only abstraction |

### Gaps and Conflicts

Official sources own Go mechanisms but not Gobbi skill topology. Adjacent project families supply ownership
patterns but not standalone Go process policy. The accepted user decisions resolve both gaps. Live Go release
numbers, project commands, `GOOS/GOARCH` target matrices, and publication systems remain runtime inputs and are not frozen
here. No unresolved source conflict changes the design.
Every external row records authority, relevance, currency, applicability, and license from direct evidence;
reuse disposition remains separate. A paraphrase-only label is not used as a license assessment.
Accepted R3 corrections close at design level by separating package identities from command selectors,
specifying the bounded canonical Git tag/ref executor, restoring authenticated private-module reads in both
module modes, and completing the external-source assessment schema. Later implementation and evaluation must
still realize and verify those contracts.
Accepted R4 correction GOIDEA-R4-01 closes the remaining strict-boundary ambiguity at design level. General
development, security change, and observability change now state credential use and external mutation as
separate binary facts, forbid their assigned external mutations, identify the external-action owner, and bind
returned evidence or exact block, retained-state, recovery, and handoff fields. Observability diagnostic-send
verification remains a separate bounded test-destination path. Later implementation and evaluation must still
realize and verify these contracts.
Accepted GOIDEA-R5-01 closes the dependency conflict at design level. `go-release` builds, translates, and
supplies the Git-owned caller-neutral action specification. Only `go-release` references and calls Git; Git
does not reference `go-release` or another skill. This one-way direction satisfies Gobbi Rule 4 while the
eventual Git sources remain caller-neutral and contain no Gobbi or outside-skill reference. Accepted OPT-R5-01
also labels the richer four-column child table as design inventory and reserves the literal three-column
`Child skill | Type | Load when` schema for emitted `go/SKILL.md`. Later implementation and evaluation must
still realize and verify these contracts.
Accepted GOIDEA-R6-01 removes a stale direct packaging-to-executor projection. `go-packaging` ends at an exact
local artifact identity and readiness handoff to `go-release`; it has no direct Git, publication, or non-Git
destination-executor route. `go-release` alone selects and coordinates release executors, builds, translates,
and supplies the Git-owned caller-neutral action specification, and references and calls Git. This correction
adds no new design decision and preserves the accepted one-way dependency.

## Topics

```text
Complete, selectively loaded Go guidance from design through authorized release
├── Family Topology and Routing
│   ├── Root Navigation Contract
│   ├── Fourteen-Child Ownership Map
│   ├── Composition and Reopen Tests
│   └── Non-goals and External Owners
├── Operation Boundaries and Lifecycle
│   ├── Development and Design Authority
│   ├── Operation Modes and Permitted Effects
│   ├── Diagnostic and Specialized Change Operations
│   ├── Packaging and Release Separation
│   └── Existing Operation Preservation
├── Language and Handoff Contracts
│   ├── Exact Go Vocabulary
│   └── Blocked Results and Handoffs
└── Evaluation Assurance
    ├── Checklist Ownership and Composition
    └── Atomicity and Cosmetic Compliance
```

## Decisions

### Family Topology and Routing

> **Question:** Which family shape provides complete ownership and selective loading?<br>
> **Decision:** Use a policy-free root and exactly fourteen direct children with outcome-led multi-select routing.<br>
> **Status:** `Resolved`<br>
> **Requirement connection:** Selective Navigation Without Root Policy; Complete Independent Lifecycle Coverage; One Semantic Owner and Acyclic Composition.<br>
> **Source basis:** Domain Skill standard; current Go family; TypeScript and Web roots; user decision.

#### Context

Seven current children are valuable, but seven concerns lack independent owners. The root must route rather than decide.

#### Options

| Option | Pros | Cons | Fit | Risks |
|---|---|---|---|---|
| Fourteen direct children | Independent results, selective loads, exact checklist owners | More maintenance | Best | Child overlap if boundaries drift |
| Broaden current seven | Fewer files | Mixed results and uncovered routes remain | Poor | Repeated policy and incomplete evaluation |
| A few lifecycle operations | Small root table | Normal work loads irrelevant policy | Poor | Mandatory stage chain |

#### Decision

The user selected the fourteen-child family. It best satisfies the domain standard and all six findings.

#### Rejected Options

Broader existing children and a small lifecycle set cannot preserve independent results and selective loading.

#### Consequences

The root doubles its routing rows. Each child must justify its independent result and checklist.

#### Reopen When

A child lacks an independent result; more than half its checklist duplicates a sibling; or normal Go work
loads most children. Reopen if evidence shows packaging and publication are one indivisible result, if either
responsibility moves to another durable owner, or if the canonical Git operation cannot execute the exact
authorized tag/ref contract without broader mutation or an invented project-policy input.

#### Root Navigation Contract

> **Question:** What may the root contain?<br>
> **Decision:** Navigation only: exact domain frontmatter, short orientation, and a literal `Child skill | Type | Load when` table with byte-copied triggers and no owned-result column; no policy or stage chain.<br>
> **Status:** `Resolved`<br>
> **Requirement connection:** Selective Navigation Without Root Policy.<br>
> **Source basis:** Domain Skill standard; current root gap.

**Context:** The current traced-service paragraph is child policy.

**Options:**

| Option | Pros | Cons | Fit | Risks |
|---|---|---|---|---|
| Policy-free multi-select root | Exact standard fit | Policy must move | Best | Stale trigger copies |
| Root policy floor | Central | Violates root shape | Poor | Duplicate owners |
| Stage-led root | Predictable order | Loads irrelevant children | Poor | Operation cycles |

**Decision:** Use the exact navigation-only shape, emit only `Child skill | Type | Load when`, and copy child
triggers byte for byte. The richer child/type/trigger/result table belongs only to the design inventory.

**Rejected options:** Root policy and stage ordering.

**Consequences:** The traced-service claim moves to `go-observability`.

**Reopen when:** A supported task selects no child or root prose makes a Go judgment.

#### Fourteen-Child Ownership Map

> **Question:** Which children and types make the family complete?<br>
> **Decision:** Retain the current seven types and add seven operations.<br>
> **Status:** `Resolved`<br>
> **Requirement connection:** Complete Independent Lifecycle Coverage; One Semantic Owner and Acyclic Composition.<br>
> **Source basis:** Current family; type-writing standards; official Go sources; user decision.

**Context:** Each added concern has an ordered independent result rather than only judgment or named-tool lookup.

**Options:**

| Option | Pros | Cons | Fit | Risks |
|---|---|---|---|---|
| Exact fourteen mixed-type children | Complete and selective | More files | Best | Boundary drift |
| Merge additions into development | Fewer files | No independent result | Poor | One oversized checklist |
| Add smaller mechanism children | Fine-grained | Fragmented results | Poor | Excess routing |

**Decision:** Add `go-architecture`, `go-debugging`, `go-security`, `go-observability`, `go-performance`,
`go-packaging`, and `go-release` as operations.

**Rejected options:** Merge or further split.

**Consequences:** The emitted root contains fourteen stable-name-ordered three-column rows and the family
retains at least one preference, operation, and tool. The richer ownership result remains in the design
inventory, not the emitted root.

The same design change updates the free-word register in
[`domain-skill.md`](../../../.gobbi/projects/gobbi/skills/skill-writing/domain-skill.md) to admit `debugging` and
`performance`. Official Go Diagnostics supplies the debugging and performance-diagnosis terms, and official Go
PGO or performance material supports performance. It also updates only the canonical Git operation and
conventions fields needed for the bounded authorized release tag/ref executor. All other outside-Go edits
remain excluded unless this exact naming, bounded Git, or routing consistency contract requires them.

**Reopen when:** A child type review shows no ordered result or a different primary subject.

#### Composition and Reopen Tests

> **Question:** How do siblings compose without duplicate owners?<br>
> **Decision:** Load every applicable child; keep each claim with one owner; route rather than restate.<br>
> **Status:** `Resolved`<br>
> **Requirement connection:** One Semantic Owner and Acyclic Composition; Preserve Proven Existing Contracts.<br>
> **Source basis:** Domain Skill standard; current Go composition; TypeScript Development.

**Context:** Multi-concern work needs several children, but policy duplication creates cycles.

**Options:**

| Option | Pros | Cons | Fit | Risks |
|---|---|---|---|---|
| Multi-select with one claim owner | Composable | Requires boundary discipline | Best | Missing route |
| Universal coordinator | Simple | Stage chain | Poor | Context bloat |
| Duplicate shared policy | Local reading | Drift | Poor | Conflicting rules |

**Decision:** General development and specialized operations load one another only when both triggers apply.

**Rejected options:** Universal coordinator and duplicated policy.

**Consequences:** Composition direction varies by task trigger, but semantic claim ownership stays singular and acyclic.

**Reopen when:** Any of the four family reopen tests fails.

#### Non-goals and External Owners

> **Question:** Where does Go family ownership stop?<br>
> **Decision:** Fence the accepted exclusions and hand them to platform, deployment, configuration, or service owners.<br>
> **Status:** `Resolved`<br>
> **Requirement connection:** Complete Independent Lifecycle Coverage; Exact Operational Results, Blocks, and Handoffs.<br>
> **Source basis:** User scope; current Go Modules; Web Deployment; Electron Release.

**Context:** A Go artifact can enter broader delivery without making Go guidance own that delivery.

**Options:**

| Option | Pros | Cons | Fit | Risks |
|---|---|---|---|---|
| Explicit fences and handoffs | Scope-safe | Requires neighboring owner | Best | Handoff gap |
| Implicit stop | Short | Ambiguous | Poor | Accidental rollout |
| Go owns deployment | End-to-end for one shape | Exceeds domain | Rejected | Unauthorized effects |

**Decision:** Keep every accepted non-goal outside the family and name the external authority at handoff.

**Rejected options:** Implicit or end-to-end deployment ownership.

**Consequences:** `go-release` may verify returned evidence for published Go artifacts but does not own the
publication mutation, rollout, or live health.

**Reopen when:** The user expands scope or another durable owner changes the boundary.

### Operation Boundaries and Lifecycle

> **Question:** Which operations stop at design or diagnosis, and which may complete verified concern changes?<br>
> **Decision:** Use mixed result boundaries.<br>
> **Status:** `Resolved`<br>
> **Requirement connection:** Concrete Development and Design Contracts; Exact Operational Results, Blocks, and Handoffs; Preserve Proven Existing Contracts.<br>
> **Source basis:** Operation Skill standard; current Go operations; adjacent TypeScript, Web, and Electron operations; official Go diagnostics.

#### Context

Operations must end in one recognizable result. That result need not always be code or publication.

#### Options

| Option | Pros | Cons | Fit | Risks |
|---|---|---|---|---|
| Mixed result boundaries | Matches real results and authority | More handoffs | Best | Boundary ambiguity if fields are vague |
| Advice-only specialists | No code overlap | Incomplete changes | Poor | Deferred in-scope work |
| Every operation publishes | End-to-end | Crosses authority | Rejected | External side effects |

#### Decision

Architecture and debugging may complete before code. Security, observability, and performance may complete
verified concern changes. Packaging stops at verified local artifacts. Release owns action specification and
the verified release result, including translation and supply of the Git-owned caller-neutral tag/ref contract;
the manager, Git operation, and named external-action owners retain their own
authority and execution.

#### Rejected Options

Uniform advice-only or publish-through operations do not match independent results.

#### Consequences

Every operation needs exact terminal records and sibling handoffs.

#### Reopen When

An operation cannot complete without duplicating most of a sibling procedure.

#### Development and Design Authority

> **Question:** Which lifecycle and decision authority govern general Go changes?<br>
> **Decision:** Preserve `Study -> Design -> Build -> Verify`; require user confirmation for every material design choice unless a cited prior decision resolves the same decision with matching affected context and assumptions.<br>
> **Status:** `Resolved`<br>
> **Requirement connection:** Concrete Development and Design Contracts.<br>
> **Source basis:** Current Go Development; Principles; TypeScript Development; user decision.

**Context:** Current development compares an alternative but asks the user only for selected public decisions.

**Options:**

| Option | Pros | Cons | Fit | Risks |
|---|---|---|---|---|
| Confirm every material choice | Preserves user authority | More pauses | Best | Over-classifying trivial choices |
| Confirm public choices only | Faster | Internal architecture assumed | Poor | Wrong hidden design |
| Agent decides internal design | Efficient | Violates accepted authority | Rejected | Unreviewed trade-offs |

**Decision:** Record alternatives, sources, recommendation, user or cited prior decision, trade-off, and reopen evidence before the compiling skeleton.

A choice is material when different viable selections would change task scope or acceptance; user-visible
behavior; public API or CLI and compatibility or migration; package, module, or process boundary or dependency
direction; configuration, data, or state flow; mutable-data or resource ownership or lifetime; concurrency,
cancellation, or shutdown; trust, identity, authorization, cryptography, secrets, protected data, or network
exposure; failure containment, recovery, or rollback; performance or resource budget or measurement strategy;
diagnostic signals, redaction, retention, or access; validation strategy, observable test boundary, controllable
dependency, or strength of the completion claim; or artifact identity, release, external effect, or destructive
effect. A routine execution choice is fully determined by accepted design or governing project convention and
changes none of those dimensions; local syntax, formatting, or a mechanically determined private name can
qualify. A prior accepted decision resolves the gate only when it covers the same decision, the affected
context and assumptions still match, and the source is cited. Changed context reopens the choice.

**Rejected options:** Narrow or automatic confirmation.

**Consequences:** Development and architecture Procedures run this classifier before planning. Their
checklists trace every classifier dimension, the routine-choice boundary, and the validity of cited prior
decisions without turning minor mechanics into user questions.

Permission to write a caller-approved design artifact is separate from authority to make a material design
decision. Architecture author-design work pauses at every material decision unless the user decides it or a
cited prior decision resolves the same decision with matching affected context and assumptions.

**Reopen when:** A durable project authority explicitly receives a named decision class.

#### Operation Modes and Permitted Effects

> **Question:** Which supported modes and effects can each Go operation use?<br>
> **Decision:** Use a shared effect vocabulary and one explicit matrix row for every supported mode across all ten operations.<br>
> **Status:** `Resolved`<br>
> **Requirement connection:** Exact Operational Results, Blocks, and Handoffs; One Semantic Owner and Acyclic Composition.<br>
> **Source basis:** Current Go operations and toolchain side-effect classes; adjacent security, observability, packaging, and release operations; user-approved effect boundaries.

**Context:** An operation name cannot prove write, execution, download, network, credential, or external-mutation
authority. These effects vary by mode and must be classified before action.

**Options:**

| Option | Pros | Cons | Fit | Risks |
|---|---|---|---|---|
| Shared vocabulary and explicit mode matrix | Complete and comparable | Larger design | Best | Matrix drift if Procedures omit rows |
| Separate effect prose per operation | Locally readable | Hard to audit as a family | Partial | Missing cross-operation boundary |
| Infer effects from operation names | Short | No authority proof | Rejected | Unauthorized or destructive action |

**Decision:** Define project-path write, disposable/local output, Go cache/download, project execution, network
access, credential use and external mutation as separate binary facts within one dimension, pause, and terminal/recovery once. Apply every field to each supported
mode in the Design matrix.

**Rejected options:** Unstructured or inferred effect contracts.

**Consequences:** Every operation Procedure and checklist must trace its exact matrix rows. Modes cannot inherit
writes, credentials, network access, publication, or other external effects from a sibling or from technical
readiness. Release modes also cannot inherit manager, Git, credential, network, publication, or
external-mutation authority.
General development has no credential use and no external mutation. Security change may use credentials only
for a separately authorized exact read or verification need with exact protected handling, but it performs no
external mutation or publication. Observability change has no credential use and no external mutation;
diagnostic-send verification remains distinct under its bounded test-destination authority. Each change mode
uses returned evidence from its named external-action owner or blocks with the exact prerequisite, retained
state, recovery action, and handoff.

**Reopen when:** A mode cannot state one shared field, or evidence shows its permitted effect crosses the
assigned owner or authority boundary.

#### Diagnostic and Specialized Change Operations

> **Question:** What result closes architecture, debugging, security, observability, and performance?<br>
> **Decision:** Architecture ends with confirmed design plus validation plan; debugging with reproduced root cause or bounded diagnostic plan; security, observability, and performance may complete verified concern changes.<br>
> **Status:** `Resolved`<br>
> **Requirement connection:** Complete Independent Lifecycle Coverage; Exact Operational Results, Blocks, and Handoffs.<br>
> **Source basis:** Official diagnostics, PGO, security, `runtime/debug`, `log/slog`; Web specialized operations; user decision.

**Context:** Official sources distinguish the mechanisms, while operation boundaries follow observable results.

**Options:**

| Option | Pros | Cons | Fit | Risks |
|---|---|---|---|---|
| Mixed design, diagnosis, and complete-change results | Complete and accurate | Requires composition | Best | Duplicate development prose |
| All recommendations | Simple | Incomplete concern changes | Poor | In-scope deferral |
| All code changes | Concrete | Excludes valid design or diagnosis | Poor | Unnecessary mutation |

**Decision:** Apply the mixed boundaries and load development for code work.

**Rejected options:** Uniform stopping points.

**Consequences:** Each specialized operation owns its named concern result and validation; development owns general code construction.

**Reopen when:** A specialized operation repeats rather than loads the development lifecycle.

#### Packaging and Release Separation

> **Question:** Who owns modules, local artifacts, Go-domain release semantics, current authority, and external-effect execution?<br>
> **Decision:** Modules own module path, layout, graph, workspace, dependencies, tools, external-consumer validation, module consumer compatibility analysis, and exact facts for release; they own no version or tag selection. Packaging owns verified local binaries or archives. `go-release` owns Go-domain release classification, release compatibility analysis, exact version and tag decisions, readiness evidence, action specification, translation and supply of the Git-owned caller-neutral tag/ref contract, post-action and external-consumer verification, recovery semantics, and the release result. The manager grants current authority, the Git operation performs only the exact authorized release tag/ref mutation and non-force publication from a caller-supplied specification, and each named external-action owner performs its non-Git destination mutation.<br>
> **Status:** `Resolved`<br>
> **Requirement connection:** Complete Independent Lifecycle Coverage; One Semantic Owner and Acyclic Composition; Exact Operational Results, Blocks, and Handoffs.<br>
> **Source basis:** Official Go module and command documentation; TypeScript Packaging; Electron Release; canonical Git operation and conventions; user decision.

**Context:** Module tags and executable artifacts have different consumers, evidence, and side effects.

**Options:**

| Option | Pros | Cons | Fit | Risks |
|---|---|---|---|---|
| Three separate owners | Exact authority and artifacts | More handoffs | Best | Stale artifact identity |
| Combine packaging and release | Fewer handoffs | Mixes local and external effects | Poor | Unauthorized publication |
| Modules own all | Existing location | Confuses results | Poor | Binary gaps |

**Decision:** Keep the module, packaging, release-semantic, authority, and execution results distinct. Bind
release evidence to exact module facts or artifact checksums. `go-modules` owns no version or tag proposal,
exact version or tag decision, tag creation, publication, or recovery. `go-release` coordinates the manager,
builds, translates, and supplies the Git-owned caller-neutral contract, calls the Git operation, coordinates
named external-action owners, consumes returned results, and verifies them without inheriting their authority.

**Rejected options:** Combined packaging/release or module ownership.

**Consequences:** A binary or archive release consumes a packaging handoff. A module-only release may consume
a module result. All Git tag/ref and publication mutations and all non-Git destination mutations remain
outside `go-release`; release never rebuilds the bound inputs.

Only `go-release` references and calls Git; Git does not reference `go-release` or another skill. This one-way
direction satisfies Gobbi Rule 4 while the eventual Git sources remain caller-neutral and contain no Gobbi or
outside-skill reference.

The canonical Git operation and conventions accept a caller-supplied, caller-neutral release tag/ref action
specification and current manager authority. They preserve the exact tag/ref name, target Git object,
repository and remote, project-required tag form, signing or annotation rule when applicable, and exact
non-force publication target. They detect conflicts before mutation, perform only
the exact local tag/ref mutation and non-force publication, verify local and remote state, preserve recoverable
partial state, and return exact handoff evidence. Project tag form, signing or annotation, repository, and
remote remain named inputs. The Git operation never forces, overwrites a conflict, silently deletes a
published tag/ref, rewrites published history, broadens the published ref set, changes configuration, or
mutates recovery state without separate exact authority.

**Reopen condition:** Reopen if evidence shows packaging and publication are one indivisible result, if either
responsibility moves to another durable owner, or if the canonical Git operation cannot execute the exact
authorized tag/ref contract without broader mutation or an invented project-policy input.

#### Existing Operation Preservation

> **Question:** How much of the current seven children changes semantically?<br>
> **Decision:** Preserve their proven contracts and move only claims with a new owner.<br>
> **Status:** `Resolved`<br>
> **Requirement connection:** Preserve Proven Existing Contracts; One Semantic Owner and Acyclic Composition.<br>
> **Source basis:** Current Go sources and checklists.

**Context:** A full rewrite would risk regression without new evidence.

**Options:**

| Option | Pros | Cons | Fit | Risks |
|---|---|---|---|---|
| Surgical reconciliation | Low regression risk | Requires traceability | Best | Stale cross-reference |
| Full rewrite | Uniform wording | High semantic risk | Poor | Lost evidence |
| No current-child changes | Minimal diff | Ownership conflicts remain | Poor | Duplicate policy |

**Decision:** Preserve concurrency, conventions, caller-led design, development, module consumer checks and
authorized authenticated private-module reads, testing, and toolchain strengths; move specialized concern
claims.

**Rejected options:** Full rewrite and no reconciliation.

**Consequences:** Semantic-diff validation is required before implementation acceptance.

**Reopen when:** A preserved claim conflicts with the final ownership map.

### Language and Handoff Contracts

> **Question:** Which language and terminal records make every contract exact?<br>
> **Decision:** Use mainstream Go vocabulary inline and a universal terminal core with operation-specific fields.<br>
> **Status:** `Resolved`<br>
> **Requirement connection:** Mainstream and Exact Go Vocabulary; Exact Operational Results, Blocks, and Handoffs.<br>
> **Source basis:** Official Go documentation; Operation Skill standard; current checklist gaps; user decision.

#### Context

Generic nouns hide different facts and make checklist judgments inconsistent.

#### Options

| Option | Pros | Cons | Fit | Risks |
|---|---|---|---|---|
| Exact inline vocabulary and records | Cold-readable and testable | More precise prose | Best | Missed generic term |
| Glossary | Compact | Context-dependent | Rejected | Drift |
| Flexible prose | Easy | Ambiguous | Poor | False pass |

#### Decision

Use the accepted exact forms and trace every terminal field into the owning checklist.

#### Rejected Options

Glossary and broad prose.

#### Consequences

Every skill and checklist needs a vocabulary and terminal-field audit.

#### Reopen When

A claim still needs private interpretation.

#### Exact Go Vocabulary

> **Question:** Which exact forms replace ambiguous language?<br>
> **Decision:** Use the accepted version, command, target, public-contract, compatibility, testing, evidence, module, and owned-object terms.<br>
> **Status:** `Resolved`<br>
> **Requirement connection:** Mainstream and Exact Go Vocabulary.<br>
> **Source basis:** Go toolchain, command, module, testing, release-policy, and diagnostic documentation.

**Context:** Minimum support, toolchain selection, and module language behavior are different facts.

**Options:**

| Option | Pros | Cons | Fit | Risks |
|---|---|---|---|---|
| Exact terms at each claim | Direct | Longer | Best | Incomplete audit |
| Project shorthand | Short | Non-mainstream | Rejected | Reader confusion |
| Generic term plus example | Familiar | Other uses stay vague | Poor | Indeterminate rows |

**Decision:** The exact mapping appears in the Design section and binds every child and checklist.

**Rejected options:** Shorthand, glossary, and example-only repair.

**Consequences:** Generic `surface` is replaced by the actual owned object.

**Reopen when:** Official Go vocabulary changes or one term denotes two facts.

#### Blocked Results and Handoffs

> **Question:** Which facts must a terminal operation record expose?<br>
> **Decision:** Use a universal terminal core plus operation-specific additions, all traced by checklists.<br>
> **Status:** `Resolved`<br>
> **Requirement connection:** Exact Operational Results, Blocks, and Handoffs; Atomic and Traceable Evaluation Sources.<br>
> **Source basis:** Operation Skill standard; current Go exits; Electron Release; user decision.

**Context:** A prose-only gap does not reliably support resumption or binary evaluation.

**Options:**

| Option | Pros | Cons | Fit | Risks |
|---|---|---|---|---|
| Universal core plus specific fields | Complete and traceable | More schema | Best | Missing operation field |
| Generic handoff | Short | Ambiguous | Poor | Repeated diagnosis |
| Checklist-only fields | Testable | Operation incomplete | Rejected | Hidden contract |

**Decision:** Record result, authority, actual object, terminal state, paths, evidence, compatibility, block,
risk, recovery, and next owner, plus concern-specific facts.

**Rejected options:** Generic or checklist-only terminal contracts.

**Consequences:** Every operation success and block has independently answerable checklist conditions.

**Reopen when:** A downstream owner repeats an in-scope lookup the prior operation could return.

### Evaluation Assurance

> **Question:** How does evaluation remain independent and composable across fourteen children?<br>
> **Decision:** One checklist per child; apply every active sibling checklist.<br>
> **Status:** `Resolved`<br>
> **Requirement connection:** Atomic and Traceable Evaluation Sources; Preserve Proven Existing Contracts.<br>
> **Source basis:** Checklist operation; current Go checklist pattern; user decision.

#### Context

Independent child results need independent sources, while combined work needs combined coverage.

#### Options

| Option | Pros | Cons | Fit | Risks |
|---|---|---|---|---|
| Child-owned sources plus sibling composition | Selective and complete | More maintenance | Best | Duplicate rows |
| Family-wide source | Central | Not independently loadable | Poor | One oversized subject |
| Operations only | Smaller | Preferences and tool uncovered | Poor | Missing judgment evidence |

#### Decision

Use fourteen child-owned sources. Reuse a row only between scenarios in the same source; Evaluation applies
each active sibling source separately.

#### Rejected Options

Family-wide or operation-only checklists.

#### Consequences

Every child contract, terminal result, and active sibling concern receives reusable conditions.

#### Reopen When

A child lacks independent conditions or duplicates more than half a sibling source.

#### Checklist Ownership and Composition

> **Question:** Which source shape and traceability rules apply?<br>
> **Decision:** Use all eight perspectives, literal applicable scenario classes, stable IDs, caps, exact reuse, and full child traceability.<br>
> **Status:** `Resolved`<br>
> **Requirement connection:** Atomic and Traceable Evaluation Sources; One Semantic Owner and Acyclic Composition.<br>
> **Source basis:** Checklist operation; current Go checklists.

**Context:** A checklist evaluates its child; it does not repair sibling policy.

**Options:**

| Option | Pros | Cons | Fit | Risks |
|---|---|---|---|---|
| Child ownership with same-source `Also applies` reuse | One owner per row | Requires exact IDs | Best | Stale reference |
| Duplicate rows | Self-contained | Drift | Poor | Conflicting answers |
| Route without loading | Small | Incomplete | Rejected | Missing evaluation |

**Decision:** Each source traces its child requirements, decisions, lifecycle, terminal fields, risks, and prior
failures. Development and architecture trace the material-choice classifier, routine boundary, and cited
prior-decision validity. Every operation traces each supported mode's complete effect row.

**Rejected options:** Row duplication and missing-source routing.

**Consequences:** Development and architecture explicitly trace material decision authority; every operation
traces project writes, local outputs, caches/downloads, execution, network, credentials/external mutation,
pause, terminal result, recovery, blocks, and handoffs.

**Reopen when:** Atomic coverage exceeds fifty-five rows after fan-out merging; the subject then needs reclassification.

#### Atomicity and Cosmetic Compliance

> **Question:** How does each row remain binary and resistant to form-only success?<br>
> **Decision:** Apply the placeholder and residual-verb test; pilot representative pass, fail, and cosmetically compliant subjects.<br>
> **Status:** `Resolved`<br>
> **Requirement connection:** Atomic and Traceable Evaluation Sources.<br>
> **Source basis:** Checklist operation; GOSK-06 examples.

**Context:** Compound verbs hide partial failure, while splitting one state across a named set adds noise.

**Options:**

| Option | Pros | Cons | Fit | Risks |
|---|---|---|---|---|
| Residual-verb test and pilots | Binary and robust | More review | Best | Misapplied placeholder |
| Compound rows | Short | Partial pass hidden | Poor | False assurance |
| One row per member | Looks atomic | Duplicates one state | Poor | Cap pressure |

**Decision:** Split different required states, keep a named set together for one state, and require broken-but-conformant work to fail.

**Rejected options:** Compound verbs and indiscriminate fan-out.

**Consequences:** Source caps measure real subject breadth and cannot justify compound rows.

**Reopen when:** A row can be both yes and no for separate verb phrases or cosmetic compliance passes all rows.

## Design

### Actors

| Actor | Responsibility | Authority boundary |
|---|---|---|
| Acting agent | Load the root, select every matching child, follow each owned contract, and return exact evidence | Cannot invent scope, user decisions, external authority, or a missing owner |
| User or accepted project decision owner | Confirm every material design decision | A cited prior decision resolves only the same decision while affected context and assumptions still match |
| Go consumer of a package import path, public API or CLI, project command, module path, binary, or archive | Supplies the observable contract and compatibility position | Does not define internal implementation unless the contract requires it |
| Child skill owner | Owns one concern's judgment, operation, or named-tool lookup | Routes sibling claims instead of restating them |
| Evaluator | Applies every active child checklist and resolves evidence through general Evaluation | Does not change checklist sources or implementation subjects during review |
| Manager | Grants current external or destructive authority for exact inputs and effects | Local packaging, release readiness, or an action specification does not imply this authority |
| Git operation and conventions owner | Executes the bounded caller-authorized release tag/ref lifecycle | Accepts a caller-supplied, caller-neutral specification and current manager authority; preserves caller-supplied tag/ref inputs and project policy; rejects conflicts; performs only the exact local mutation and non-force publication; verifies local/remote state; returns recoverable partial state and exact handoff; references no outside skill and receives no Go-domain release decision ownership |
| Private-module credential and destination owner | Supplies the exact authenticated-read scope, destination, ephemeral credential delivery, redaction, and retention boundary | Does not grant network or credential authority and does not permit module external mutation |
| Named external-action owner | Performs one authorized non-Git destination mutation or destination read | Uses only separately granted credential and network authority and returns exact destination state |
| External platform or delivery owner | Receives excluded deployment, installation, migration, rollout, configuration, or live-health work | Go skills hand off exact Go artifacts and evidence but do not copy external procedures |

### Structure

#### Root contract

The `go` root uses the exact domain root shape. Its frontmatter remains:

```yaml
---
name: go
description: "MUST load before working in Go. Go is a domain skill that routes the task to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---
```

After `# Go`, the root contains two or three short paragraphs that identify the domain and say to load every
matching row. `## Child Skills` is the final section. Its literal table schema is exactly
`Child skill | Type | Load when`; each trigger is copied byte for byte from the child, and no owned-result
column is emitted. The root contains no Principles, Rules, Preferences, Manual, Procedure, References, Go
policy, universal floor, or mandatory stage order.

The following four-column table is the stable-name-ordered design inventory, not the literal root table. Every
`Exact load trigger` value is the exact one-sentence child description and begins `MUST load when`. The owned
result column records design ownership only and is omitted from emitted `go/SKILL.md`.

| Child | Type | Exact load trigger | Owned result or judgment |
|---|---|---|---|
| `go-architecture` | operation | MUST load when designing or reviewing the architecture of a Go application, service, command, library, or multi-package system, including package boundaries, dependency direction, process boundaries, configuration ownership, data flow, failure containment, or validation strategy. | Confirmed project or multi-package design and validation plan |
| `go-concurrency` | preference | MUST load when working with goroutines, channels, context.Context, sync, atomics, timers, concurrent ownership, cancellation, shutdown, backpressure, or race safety. | Concurrent ownership, lifetime, synchronization, bounds, and race-safety judgment |
| `go-conventions` | preference | MUST load when choosing or reviewing Go names, files, packages, imports, documentation, comments, error text, or formatting. | Written-form judgment and project-overridable defaults |
| `go-debugging` | operation | MUST load when reproducing, diagnosing, or isolating a Go failure, panic, deadlock, race symptom, leak, corruption, unexpected result, or tool diagnostic. | Reproduced root cause or bounded diagnostic plan |
| `go-design` | preference | MUST load when designing or reviewing Go packages, public APIs or CLIs, functions, structs, methods, values and pointers, interfaces, errors, generics, mutable-data ownership, or ordinary resource lifetime. | Package name, import path, package directory or placement, package boundary, public API or CLI, type, error, ownership, and ordinary resource judgment |
| `go-development` | operation | MUST load when implementing, changing, or reviewing Go code through study, design, bottom-up construction, and verification. | Verified general Go code change or read-only finding set |
| `go-modules` | operation | MUST load when creating, changing, or validating a Go module, including its path, layout, go.mod, go.work, dependencies, tools, external-consumer validation, and compatibility analysis. | Coherent module path, graph, workspace, dependency and tool declarations, external-consumer validation, and module consumer compatibility analysis |
| `go-observability` | operation | MUST load when designing, implementing, reviewing, or verifying logs, metrics, traces, trace-context propagation, crash capture, diagnostic redaction, correlation, or runtime health signals in Go software. | Verified Go diagnostic emission, correlation, redaction, and arrival result |
| `go-packaging` | operation | MUST load when producing or validating Go binaries or archives, including the project default build command, named GOOS/GOARCH targets, metadata, checksums, reproducibility, and artifact smoke checks. | Verified local binaries or archives and exact artifact evidence |
| `go-performance` | operation | MUST load when diagnosing or changing Go latency, throughput, allocation, memory retention, garbage collection, CPU use, contention, binary size, startup time, or profile-guided optimization. | Representative-profile diagnosis or verified performance change |
| `go-release` | operation | MUST load when versioning, publishing, verifying, or recovering a Go module, binary, or archive release. | Go-domain release classification, release compatibility analysis, exact version and tag decision, readiness evidence, action specification, verified returned executor evidence, external-consumer verification, recovery semantics, and release result |
| `go-security` | operation | MUST load when Go work crosses a trust boundary; handles untrusted input, identity, authorization, cryptography, secrets, sensitive data, dependencies, vulnerability findings, network exposure, or security review. | Verified security review or complete verified security change |
| `go-testing` | operation | MUST load when designing, writing, reviewing, or executing Go tests, examples, fuzz targets, benchmarks, coverage checks, or race-detector evidence. | Focused repeatable evidence for a named behavior or risk |
| `go-toolchain` | tool | MUST load when using or diagnosing the Go distribution, go command, compiler, formatter, vet, generators, build constraints, GOOS/GOARCH targets, or project-pinned Go tools. | Named-tool lookup, project command effect classification, exact package pattern and `GOOS/GOARCH` target facts, and tool diagnosis |

The emitted root projects the first three design facts into `Child skill | Type | Load when`, renames the
first and third headers exactly, and copies each child `description` byte for byte. Every supported root task
selects at least one row. A task may select any number of rows whose triggers apply.

#### Child shape and ownership contract

Every child has four-key frontmatter, a two-or-three-paragraph Intro, no more than four Principles, no more
than six self-contained `MUST` or `NEVER` Rules, its type-specific core, and local References. An operation
uses `Principles -> Rules -> Procedure -> References`; the Procedure has numbered phases and decimal steps and
owns all paths to its result. A preference uses `Principles -> Rules -> Preferences -> References`, with real
overridable defaults. `go-toolchain` uses `Principles -> Rules -> Manual -> References` and remains the only
named-tool manual.

Each child owns `checklists.md` beneath its own directory and links it from References. Supporting documents
may explain the same child but do not become independently loadable grandchildren. Cross-references use the
backticked sibling slug.

The semantic owner map is:

| Claim or result | Owner | Required route rather than restatement |
|---|---|---|
| Cross-package and application architecture process, confirmed design, and validation plan | `go-architecture` | Load `go-design`, `go-concurrency`, `go-modules`, `go-security`, `go-observability`, or `go-performance` for their own judgments when applicable |
| Concurrent lifetime and synchronization judgment | `go-concurrency` | Development and specialized operations load it when concurrent behavior enters their result |
| Written Go form and project-overridable language conventions | `go-conventions` | Every authoring operation loads it for names, docs, comments, imports, or formatting |
| Failure reproduction, causal diagnosis, and bounded diagnostic plan | `go-debugging` | Route project command and tool behavior to `go-toolchain`, evidence design to `go-testing`, and accepted fixes to the applicable change operation |
| Package name, import path, package directory or placement, package boundary, public API or CLI, type, error, ownership, and ordinary resource judgment | `go-design` | Architecture and development load it; it owns no ordered work |
| General Go code-change construction and read-only code review | `go-development` | Load the specialized operation when security, observability, or performance motivates the change; general development uses no credentials and performs no external mutation, routes credentialed reads to the applicable specialist or tool owner under that owner's exact mode, and coordinates and consumes returned evidence from a named external-action owner or returns an exact block and handoff when its result depends on external action |
| Module path, layout, graph, `go` directive, workspace, dependencies, tools, exact public package paths and project commands, authorized authenticated reads for named private module or import-path scope and destination, external-consumer validation, module consumer compatibility analysis, and exact facts needed by release | `go-modules` | Route Go-domain release classification, release compatibility analysis, exact version and tag decisions, readiness evidence, action specification, post-action and external-consumer verification, recovery semantics, and release result to `go-release`; route binary/archive output to `go-packaging`; permit no module external mutation |
| Log records, metrics, spans, trace propagation, crash reports, diagnostic redaction, correlation, and verified destination arrival | `go-observability` | Route general code construction to `go-development`, protected-data decisions to `go-security`, and project command behavior to `go-toolchain`; in change mode, credential use is none and external mutation is forbidden, so destination provisioning, configuration, or mutation routes to a named external-action owner, while verification keeps its distinct bounded test-destination authority |
| Local binary or archive assembly, metadata, checksums, and smoke evidence | `go-packaging` | Return exact local artifact identity and readiness evidence to `go-release`; route project command syntax and effects to `go-toolchain`; do not reference or call Git and do not route directly to publication or non-Git destination executors |
| Representative profiles, performance diagnosis, comparison, and verified resource change | `go-performance` | Route general code construction to `go-development` and benchmark/test mechanics to `go-testing` |
| Go-domain release classification, release compatibility analysis, exact version and tag decisions, readiness evidence, action specification, post-action and external-consumer verification, recovery semantics, and release result for modules, binaries, and archives | `go-release` | Consume module facts or packaging identities without rebuilding them; build, translate, and supply the Git-owned caller-neutral action specification; request current authority from the manager; reference and call the Git operation for the exact authorized release tag/ref mutation and non-force publication; coordinate each named external-action owner for its non-Git destination effect; verify returned results; route deployment beyond publication to external owners |
| Authorized release tag/ref preflight, local mutation, non-force publication, local/remote verification, recoverable partial state, and exact handoff | Canonical Git operation and conventions | Consume a caller-supplied, caller-neutral action specification and current manager authority without choosing version or tag; use caller-supplied project tag-form, signing or annotation, repository, and remote inputs; return exact state to the caller; reference no outside skill |
| Trust boundary, threat analysis, protected-data handling, dependency vulnerability decision, and verified security change | `go-security` | Route code construction to `go-development`, module graph edits to `go-modules`, and tool behavior to `go-toolchain`; bind any credentialed read or verification to separate exact authority and protected handling; route secret rotation and provider, policy, destination, or other external mutation to a named external-action owner; verify returned evidence without performing mutation or publication |
| Test kind, observable test boundary or controllable dependency, cases, execution, and evidence interpretation | `go-testing` | Route production design gaps to `go-design` or `go-development` and project command effects to `go-toolchain` |
| Go distribution and project-selected tool lookup, project command selection, side effects, diagnostics, build constraints, exact package pattern facts, and `GOOS/GOARCH` target facts | `go-toolchain` | Operations decide why and whether the tool runs |

#### Operation contracts

Every operation Procedure owns actor, trigger, preconditions, authority, inputs, outputs, ordered decisions,
valid alternatives, failures, recovery, evidence, completion, non-goals, and handoff. These are design
contracts, not implementation tasks.

| Operation | Normal result boundary | Alternative or blocked boundary | Required sibling composition |
|---|---|---|---|
| `go-architecture` | A user-confirmed design for package names, import paths, package directories or placement, package boundaries, module paths, each public API or CLI, project commands, or processes, with invariants, dependencies, failure containment, compatibility decision, and validation plan | Missing consumer, project boundary, or user decision stops with compared options, affected decisions, and exact question | Loads applicable preferences and specialized operations for their judgments; does not implement |
| `go-debugging` | A reproduced failure and causal chain ending at the root cause | If reproduction is impossible, a bounded plan states leading causes, one discriminating diagnostic per cause, prerequisites, owner, and stop condition | Uses `go-toolchain` for project command facts, `go-testing` for evidence, and concern owners for security, observability, performance, or concurrency diagnosis |
| `go-development` | Author mode returns a project-consistent verified tree, including exact returned external-action evidence when required; review mode returns an evidence-backed finding set without mutation | Missing material user decision, unreproduced defect, unsafe write boundary, required verification, credentialed-read owner, or result-dependent external-action result stops with the exact owner, prerequisite, retained state, recovery action, and handoff | Loads every matching preference, module, testing, toolchain, architecture, debugging, security, observability, performance, packaging, or release child; general development uses no credentials, never executes external mutation, and only coordinates and consumes returned evidence |
| `go-modules` | A coherent module path, layout, graph, workspace, dependencies, tools, exact public package paths and project commands, external-consumer result, and module consumer compatibility analysis; authorized private-module evidence binds named scope, destination, redaction, and cache/download effects without external mutation | Workspace-only success, conflict with the project-supplied minimum supported Go version, hidden replacement, consumer failure, unavailable private-module authority or credential, unsafe credential handling, or incomplete module consumer compatibility evidence blocks the module result; every exact version or tag decision and every tag, publication, or recovery effect remains outside module ownership | Loads `go-toolchain`, `go-testing`, `go-security`, `go-packaging`, or `go-release` when their triggers apply |
| `go-testing` | The smallest sufficient repeatable evidence set for a named observable behavior or risk | A missing prerequisite, flaky project test command, unsupported promised `GOOS/GOARCH` target, or unobservable behavior remains a blocked evidence result | Loads `go-toolchain`; returns production design gaps to `go-design` or `go-development`; combines active sibling checklists |
| `go-security` | A verified security review or complete change owns the Go-domain risk and result; change mode uses credentials only for a separately authorized exact read or verification need with exact protected handling, performs no external mutation or publication, and verifies returned external-owner evidence | Missing threat context, protected-data authority, exact credentialed-read or verification authority, dependency evidence, returned external-owner evidence, or verification keeps residual risk explicit and returns the exact owner, prerequisite, retained state, recovery action, and handoff | Loads `go-development` for code work, `go-modules` for graph work, `go-testing` for evidence, and `go-toolchain` for project commands; secret rotation and provider, policy, destination, or other external mutation go to a named external-action owner |
| `go-observability` | Diagnostic questions map to bounded logs, metrics, traces, and crash reports that arrive, correlate, redact protected data, and have access and retention owners; in change mode, credential use is none and external mutation is forbidden, and it consumes exact returned destination-owner evidence | A signal or required destination action that cannot be emitted, correlated, redacted, delivered, read, or returned remains an accepted or blocked gap with exact owner, prerequisite, retained state, recovery action, and handoff | Loads `go-development`, `go-security`, `go-testing`, `go-toolchain`, and `go-concurrency` as applicable; destination provisioning, configuration, and mutation go to a named external-action owner, while diagnostic-send verification retains its distinct bounded test-destination authority |
| `go-performance` | A representative baseline profile identifies the bottleneck, an accepted design addresses it, and comparable evidence verifies the result and resource trade-off | Non-representative workload, absent baseline, noisy comparison, unsupported `GOOS/GOARCH` target, or regression risk produces a bounded investigation or block | Loads `go-development`, `go-testing`, `go-toolchain`, and `go-concurrency` as applicable |
| `go-packaging` | Clean local binaries or archives from the project default build command plus named target for exact `GOOS/GOARCH` targets, with embedded or adjacent metadata, inventory, checksums, reproducibility position, and isolated smoke results | Missing selected Go toolchain version for a `GOOS/GOARCH` target, cgo inputs, build identity, required asset, reproducibility prerequisite, or smoke environment blocks that artifact claim | Loads `go-toolchain`, `go-modules`, `go-testing`, and `go-security` as applicable; never publishes |
| `go-release` | A release result binds Go-domain classification, release compatibility analysis, exact version and tag decision, readiness evidence, action specification, verified executor-returned state, consumer verification, and recovery semantics to exact module facts or artifact checksums | Missing manager authority, named executor, credentials, destination, exact module facts or input checksum, returned executor evidence, consumer verification, or safe recovery stops before or after the exact external action | Consumes `go-modules` and `go-packaging` results without rebuilding inputs; builds, translates, and supplies the Git-owned caller-neutral action specification; references and calls Git in that one direction; the manager grants authority; the Git operation performs only the exact authorized release tag/ref mutation and non-force publication; each named external-action owner performs its non-Git destination mutation; and `go-release` coordinates and verifies returned results |

`go-security`, `go-observability`, and `go-performance` own their full specialized result. When code changes
are required, they load `go-development` and use its study, design, bottom-up construction, and verification
discipline. `go-development` loads the specialized operation when that concern motivates the change. This is
not a cycle in claim ownership: the general construction lifecycle and the concern result remain distinct.

#### Mode and effect matrix

The matrix uses one shared effect vocabulary:

| Term | Meaning |
|---|---|
| Project-path write | A persistent create, update, or delete under the project root; the row must name its caller-authorized subset |
| Disposable/local output | An approved diagnostic, temporary, or artifact path that owns no project-source contract and has an explicit retention or cleanup boundary |
| Go cache/download | Build, module, test, fuzz, or tool cache writes and fetched module or tool bytes, classified separately from project writes |
| Project execution | Running project code through the project default build command plus named target, project test command, project reproducer command, scanner, generator, or other named project tool |
| Network access | Any outbound request, download, destination read, or diagnostic send, even without a credential |
| Credential/external mutation | Two separately reported facts within one matrix dimension: credential use and external state mutation. An authenticated read does not imply mutation. The manager grants current authority, the Git operation performs only the exact authorized release tag/ref mutation and non-force publication, and a named external-action owner performs each non-Git destination mutation |
| Pause | The exact decision or authority gate before an effect can occur |
| Terminal/recovery | The mode's recognizable result, retained state, recovery owner, and first recovery action |

Every supported mode has an explicit effect row:

| Operation and mode | Project-path writes | Disposable/local writes | Go caches/downloads | Project code/tool execution | Network access | Credential use/external mutation | Pause point | Terminal result | Recovery |
|---|---|---|---|---|---|---|---|---|---|
| `go-architecture` author-design | Only caller-authorized design artifacts; no source implementation | Approved design scratch only | None | None | Authorized read-only reference access only | None | Before any material decision unless a cited prior decision resolves the same decision with matching affected context and assumptions; separately before any design-artifact write lacking caller permission | Confirmed design and validation plan, or decision block | Retain alternatives and exact question; name the decision owner |
| `go-architecture` review | None; project is read-only | None | None | None | Authorized read-only reference access only | None | Before an unresolved material judgment unless a cited prior decision resolves the same decision with matching affected context and assumptions; before any proposed mutation | Evidence-backed design findings or decision block | Retain invalid assumptions and next decision owner |
| `go-debugging` diagnosis | None; project source is read-only | Approved disposable diagnostics | Approved caches; downloads require separate authority | Authorized project reproducer command and named diagnostic tools | Requires separate authority | None | Before unsafe execution, download, network access, or source fix | Reproduced root cause, bounded diagnostic plan, or exact block | Retain reproducer and first useful diagnostic; name recovery owner and action |
| `go-development` author | Only caller-authorized project paths; no implicit persistent configuration | Approved temporary outputs | Every effect classified and authorized | Authorized project default build command plus named target, project test command, and each named project command for a generator or tool | Separately authorized | Credential use: none in general development; any credentialed read belongs to the applicable specialist or tool owner under that owner's exact mode. External mutation: forbidden, including publication; hand off to a named external-action owner. When the requested result depends on that action, coordinate and consume returned result or evidence, or block; never execute the mutation. | Before a material choice, out-of-scope write, download, network access, credentialed-read handoff, result-dependent external action, or unsupported verification | Verified project-consistent tree with any exact returned external-action evidence, or exact block | Retain changed paths and safe state; name the external-action owner, prerequisite, first recovery action, and handoff when applicable |
| `go-development` review | None; project is read-only | Approved disposable diagnostics | Every effect classified and authorized | Authorized read-only project commands and named tools | Separately authorized | None | Before mutation or any unclassified effect | Evidence-backed finding set or bounded evidence gap | Retain evidence limits and first recovery action |
| `go-modules` author | Only authorized module, layout, workspace, dependency, and tool-declaration paths | Approved validation outputs; no secret material | Named and authorized cache, module, or tool effects; private downloads use the declared cache and retention boundary | Authorized project commands for module, workspace, external-consumer, private module or import-path scope, and project test evidence | None by default; authenticated read or download only for the named private module or import-path scope and proxy or VCS destination under exact current manager authority | Credential use only for that authenticated read under exact current manager authority and named ephemeral delivery; external mutation is forbidden; never persist, expose, copy into evidence, or log credentials or private-module settings | Before the first network or credential use, every scope or destination change, a compatibility break, or a release decision | Coherent module facts and module consumer compatibility analysis with redacted authenticated-read and cache/download evidence for release, or exact block | Retain module and consumer evidence, redacted failure evidence, and safe cache state; name the credential/destination owner and first recovery action |
| `go-modules` validation | None; project is read-only | Specified temporary outputs; no secret material | Contained as declared; private downloads use the declared cache and retention boundary | Authorized project commands for module, external-consumer, and named private module or import-path validation | None by default; authenticated read or download only for the named private module or import-path scope and proxy or VCS destination under exact current manager authority | Credential use only for that authenticated read under exact current manager authority and named ephemeral delivery; external mutation is forbidden; never persist, expose, copy into evidence, or log credentials or private-module settings | Before the first network or credential use, every scope or destination change, an undeclared download, or a project write | Validation result with exact release facts and redacted authenticated-read and cache/download evidence, or bounded evidence gap | Retain consumer and graph evidence, redacted failure evidence, and safe cache state; name the credential/destination owner and first recovery action |
| `go-testing` author | Only authorized test, example, fuzz, or benchmark sources | Approved temp, fuzz-corpus, and failure outputs | Approved test/fuzz caches; downloads separately authorized | Authorized project test command and other named project commands for evidence | Separately authorized | None | Before production-source change, undeclared output, network, or download | Focused repeatable evidence source and result, or production-design block | Hand production design to its owner; retain evidence limits |
| `go-testing` execution | None; project source is read-only | Contained temp, fuzz, coverage, and failure outputs | Contained test/fuzz caches; downloads separately authorized | Authorized project test command, named fuzz targets and benchmarks, coverage, and race checks | Separately authorized | None | Before source mutation, uncontrolled fuzz output, network, or download | Exact evidence and limits, or blocked/flaky result | Retain failing input and first recovery action |
| `go-security` review | None; project is read-only | Approved scanner reports and diagnostics | Scanner/cache/download effects separately authorized | Authorized named scanner and other project commands | Every effect separately authorized | Named credential use separately authorized; no external mutation or publication | Before credentials, scanner download/network access, protected-data exposure, or mutation | Verified review and residual risk, or exact trust/evidence block | Retain protected evidence safely; name recovery owner and action |
| `go-security` change | Only authorized writes through `go-development` or `go-modules` | Approved diagnostics | Scanner/cache/download effects separately authorized | Authorized project commands for verification and named scanners | Separately authorized | Credential use: separately authorized only for an exact named read or verification need, exact protected scope and destination, ephemeral delivery, redacted evidence, declared cache state, and no credential or private-setting persistence; never infer authority. External mutation: forbidden, including publication; secret rotation and provider, policy, destination, or other external state mutation go to a named external-action owner. | Before a material trust choice, exact credentialed read or verification, download/network access, or any external mutation or publication request | Verified Go security change and residual risk using exact returned external-owner evidence, or exact block | Retain protected redacted evidence, declared cache state, and safe project state; name the external-action owner, prerequisite, first recovery action, and handoff |
| `go-observability` design/review | None; project is read-only | Approved local design evidence only | Separately authorized | Read-only analysis only | Separately authorized | None | Before code mutation, production signal emission, or protected-data decision | Confirmed signal design, review findings, or exact block | Retain redaction, access, and retention decisions; name recovery owner |
| `go-observability` change | Only authorized writes through `go-development` | Approved local diagnostics | Separately authorized | Authorized project commands for verification | Separately authorized | Credential use: none. External mutation: forbidden; destination provisioning, configuration, and mutation go to a named external-action owner. When the result depends on that action, coordinate and consume returned evidence, or block; never execute the mutation. | Before protected diagnostic fields, network use, or any destination provisioning, configuration, or mutation request | Verified local signal change with any exact returned destination-owner evidence, or exact delivery/redaction block | Retain changed paths and safe state; name the destination owner, prerequisite, first recovery action, and handoff |
| `go-observability` verification | None; project source is read-only | Approved captured test diagnostics | Separately authorized | Authorized project commands that emit test diagnostics | Only to a named authorized test destination | Only named credentials and approved test diagnostics, with redaction/access/retention bounds; no production mutation | Before first diagnostic send or changed destination bounds | Arrival, redaction, and correlation evidence, or contained failure | Record destination state; stop further sends; name recovery action |
| `go-performance` diagnosis/verification | None; project source is read-only | Profiles, traces, and temp data only at approved locations | Approved caches; downloads separately authorized | Authorized project command for the representative workload and named tools | Separately authorized | None; no release effect | Before nonrepresentative execution, download/network access, or unbounded output | Profile-backed diagnosis, comparable verification, or bounded investigation | Retain profiles and comparison limits; name first recovery action |
| `go-performance` change | Only authorized writes through `go-development` | Approved profiles, traces, and temp data | Approved caches; downloads separately authorized | Authorized project commands for the representative workload and verification | Separately authorized | None; no release effect | Before material budget/measurement choice, network/download, or out-of-scope write | Verified performance change and regression guard, or exact block | Retain baseline; name rollback or recovery action |
| `go-packaging` produce | No project-source writes; only designated local artifact/output paths when authorized | Exact artifact outputs | Classified build cache and downloads | Authorized project default build command plus named target and named smoke-check project command | Only for classified downloads | No publication credentials or external mutation | Before an undeclared `GOOS/GOARCH` target, output, cache/download, network, or source mutation | Verified local binaries/archives and exact evidence, or exact block | Retain identified partial outputs or clean them at the named recovery boundary |
| `go-packaging` validation | None; project source is read-only | Isolated temporary validation outputs | Classified caches/downloads | Authorized project default build command plus named target or named smoke-check project command in isolation | Only for classified downloads | None | Before nonisolated output, undeclared network/download, or publication | Validation result bound to exact artifacts, or contained failure | Clean isolated outputs or retain named failure evidence; give first recovery action |
| `go-release` preparation | Only authorized local release metadata; no artifact rebuild | Approved local release records | None | Metadata and identity checks only | None | None; preparation grants no manager, Git, credential, network, publication, or external-mutation authority | Before an unresolved exact version/tag decision or action specification | Prepared exact inputs, release compatibility analysis, version/tag decision, readiness evidence, action specification, authority request, recovery semantics, or block | Retain exact inputs and metadata; name the manager, required executor, and first recovery action |
| `go-release` read-only verification coordination | None; project and local artifacts are read-only | Approved local verification record | None; no rebuild effect | Inspect exact local inputs and returned executor evidence; never rebuild | None; a named external-action owner performs any destination read | None; a named owner uses separately authorized read credentials | Before requesting destination access or state-changing recovery | Post-action verification or exact destination/evidence block from local and returned evidence | Retain returned destination state; name recovery owner and action |
| `go-release` authorized external-action coordination | None beyond authorized local release metadata; never rebuild | Approved returned-action log and external-state record | None | No Git tag/ref or destination-mutation execution; verify returned results only | None inherited; named executors use only manager-authorized network effects | None inherited; the manager grants exact authority, the Git operation performs only the exact authorized release tag/ref mutation and non-force publication, and each named external-action owner performs its non-Git destination mutation | Before the manager grants the exact effect and names its executor; repeat after any input, authority, or destination change | Verified release result for the exact module/binary/archive, or exact partial executor-returned state | Apply specified recovery semantics through the authorized executor, or stop with retained state and first recovery action |

The twenty-one rows above remain the complete Go-operation matrix. The external Git executor has one separate,
bounded release tag/ref contract:

| Git executor field | Exact contract |
|---|---|
| Inputs | Generic, caller-supplied, caller-neutral action specification; current manager authority for the same effect and inputs; exact tag/ref name; target Git object; repository and remote; required tag form; project signing or annotation rule when applicable; exact non-force publication target |
| Preflight and pause | Prove the repository, remote, target object, tag/ref absence or exact compatible state, credential and network authority, and unchanged inputs before mutation; stop on any conflict, ambiguity, missing authority, or changed input |
| Permitted effects | The Git operation alone performs the exact authorized local tag/ref mutation and exact non-force publication; conventions define deterministic input and evidence fields without choosing project values |
| Forbidden effects | Never force, overwrite a conflicting ref, silently delete a published tag/ref, rewrite published history, broaden the published ref set, change configuration, or perform recovery mutation without separate exact authority |
| Verification and result | Verify the local tag/ref name, form, target object, signing or annotation state when required, and the remote ref at the same target; return exact commands or API actions, before/after local and remote state, result, evidence limits, and handoff |
| Failure and recovery | Preserve the exact local/remote partial state and unique objects; name the conflict or first diagnostic, affected release obligation, risk, recovery owner, first non-mutating recovery action, and any separately authorized mutation required next |

`go-release` builds, translates, and supplies this Git-owned caller-neutral specification, then consumes the
returned evidence. Only `go-release` references and calls Git; Git does not reference `go-release` or another
skill. This one-way direction satisfies Gobbi Rule 4 without making the eventual Git source reference Gobbi
or any outside skill.

The three corrected change rows are strict boundaries. General development has no credential use and no
external mutation. Security change binds any credentialed read or verification exactly and performs no
external mutation or publication. Observability change has no credential use and no external mutation.
Their named external-action owners perform any required external state change and return evidence for the
owning Go operation to verify. Observability diagnostic-send verification remains distinct: it may use a
named test destination, separately authorized test credentials, and bounded approved test diagnostic external
state exactly as its unchanged matrix row states.

Architecture never implements source. Debugging diagnosis never fixes source. Module work never chooses a
version or tag, creates a tag, publishes, or owns release recovery. Testing execution never changes production
design. Packaging never publishes or uses publication credentials. Release never rebuilds artifacts, performs
Git tag/ref or destination mutations, or owns deployment. It never inherits manager, Git, credential, network,
publication, or external-mutation authority. No mode inherits network, download, cache, credential, or
external-mutation authority from another row.

#### Development and design obligations

`go-development` retains these four observable phases:

- **Study:** bind author or read-only review mode, exact scope, success criteria, project instructions,
  minimum supported Go version, selected Go toolchain version, module's Go language version, exact package
  patterns passed to affected `go` or project commands, consumers, project default build command plus named target,
  `GOOS/GOARCH` targets, project test command and test sources, generated sources, module path, `go` directive,
  dependency graph, workspace, exact public package paths and project commands, and intended
  module, binary, or archive release use.
- **Design:** name every material package choice by its actual package name, import path, package directory or placement, package boundary, public API or CLI, type, error, ownership, concurrency,
  compatibility, observable test boundary, and controllable dependency decision. For each material decision,
  compare at least two credible reference-backed alternatives, recommend one, and record explicit user
  confirmation or the cited prior decision that resolves the same decision with matching affected context and
  assumptions.
- **Build:** materialize a compiling skeleton before dependent behavior, then grow the smallest complete
  verified slices. Update callers, test sources, docs, generated sources, `go.mod`, `go.work`, dependency graph,
  and applicable specialist-owned behavior in the same slice.
- **Verify:** run the selected project default build command plus named target, project test command, other
  project commands, and `GOOS/GOARCH` targets against the final tree. Re-run the original reproducer. State
  every unsupported or blocked check without converting it into a pass.

Before development plans a design-dependent slice, it applies the material-choice classifier to each viable
selection. If no classifier dimension changes and accepted design or a governing convention fully determines
the selection, it records the owner and proceeds as a routine execution choice. Otherwise it cites at least two
credible alternatives and asks for the user or named project authority's decision. A cited prior decision skips
the question only when it resolves the same decision and its affected context and assumptions still match;
changed context reopens the choice. No design-dependent planning or write crosses an unresolved material gate.

`go-architecture` applies the same material-decision authority to project and multi-package design. It studies
current project structure and at least two applicable reference-backed alternatives, exposes trade-offs to the
user, applies the same routine-choice and prior-decision tests before planning the design, and stops only at a
confirmed design plus future validation plan. It does not produce a code skeleton or implementation plan.
Permission to write a caller-approved design artifact is checked separately and never satisfies the material
decision gate.

`go-design` remains a preference skill. Its Rules define valid package names, import paths, package directories
or placement, package boundaries, and each public API or CLI, ownership, errors, receiver and method sets,
resources, and panic. Its Preferences retain caller-led package design,
useful zero values, consumer-defined interfaces, concrete returns, deliberate copying, ordinary error flow,
and evidence-backed generics. It gains no Procedure.

#### Checklist design

Every child owns one unchecked `checklists.md` source. Existing owner prefixes remain stable:

| Child | Owner prefix |
|---|---|
| `go-architecture` | `GOARC` |
| `go-concurrency` | `GOCON` |
| `go-conventions` | `GOCNV` |
| `go-debugging` | `GODBG` |
| `go-design` | `GODSN` |
| `go-development` | `GODEV` |
| `go-modules` | `GOMOD` |
| `go-observability` | `GOOBS` |
| `go-packaging` | `GOPKG` |
| `go-performance` | `GOPRF` |
| `go-release` | `GOREL` |
| `go-security` | `GOSEC` |
| `go-testing` | `GOTST` |
| `go-toolchain` | `GOTCH` |

Scenario IDs use `<OWNER>-SC-<PERSPECTIVE>-NN`. Row IDs use
`<OWNER>-CK-<PERSPECTIVE>-NN-NN`. Each source contains Project, Structure, Performance, Aesthetics, Usage,
Consistency, Risk, and Overall in that order. It uses the six literal scenario classes only when material:
Normal case, Edge case, Expected failure, Poor quality, Rule violation, and Adversarial. An inapplicable
perspective has an inspected evidence-based reason.

Each scenario has one to six rows. Each source has at most fifty-five rows. A cap never authorizes dropping a
traced condition or joining different states. More than fifty-five atomic conditions means the child subject
is too broad and reopens its ownership. Existing IDs remain only when the condition's meaning remains exact.
A split compound row receives new IDs, every `Also applies` reference is updated, and a retired ID is not
reused for a different condition.

Each row states one binary independently answerable condition. The author replaces only the varying subject
or object with a placeholder and leaves every verb phrase. Rows merge only when the residual verb phrases name
one required state. One state applied to a named set stays one row. Different required states split even when
the source cap becomes harder to meet. This design does not prescribe the new checklist rows themselves.

Every checklist traces:

- the child's requirements, Principles, Rules, and Preferences, Manual, or Procedure;
- every material user decision or cited prior decision for the same decision with matching affected context and assumptions;
- the complete material-choice classifier, routine-choice boundary, and prior-decision validity gate for `go-development` and `go-architecture`;
- normal, alternative-valid, boundary, blocked, recovery, adversarial, change, and cosmetic-compliance behavior when applicable;
- every supported operation mode's project writes, disposable/local outputs, Go caches or downloads, project execution, network access, credential use and external mutation as separate binary facts, pause point, terminal result, and recovery boundary;
- every terminal result, evidence limit, blocked-result field, handoff field, risk, and prior failure;
- the development and architecture design-decision lifecycle when either child is active;
- the boundary to sibling-owned concerns, while Evaluation applies every active sibling source separately;
  `Also applies` reuses an exact row only between scenarios in the same source.

The module checklist additionally traces named private module or import-path scope, proxy or VCS destination,
separate network and credential-read authority, ephemeral credential handling, redacted evidence,
private-setting and credential non-persistence, forbidden external mutation, retained safe state, the
credential/destination owner, and the first recovery action.
Development author, security change, and observability change checklists additionally trace their separate
credential-use and external-mutation facts, named external-action owner, returned evidence, or exact
prerequisite, retained state, first recovery action, and handoff. Security also traces exact read or
verification authority, protected scope and destination, ephemeral delivery, redaction, declared cache state,
credential and private-setting non-persistence, and forbidden publication. Observability keeps change-mode
prohibitions separate from authorized test-destination diagnostic-send verification.
Design and architecture sources name package names, import paths, package directories or placement, package
boundaries, and public APIs or CLIs. Exact package patterns appear only in project-command selection or
evidence conditions and keep their semantics with `go-toolchain`.

The current compound examples named by GOSK-06 must undergo the residual-verb test. The revision must not
write replacement rows by intuition. It must audit the complete corpus so the repair is structural rather
than limited to two known examples. A representative subject that merely has the right headings, runs a
project command without the claimed inputs, or reports one half of a terminal record must fail at least one row.
A private-module subject also fails if it merely names authentication while omitting current authority, exact
scope and destination, redacted evidence, credential non-persistence, no external mutation, or recovery.
A change-mode subject also fails if it merges credential use with external mutation, lets development,
security, or observability perform a forbidden external mutation, weakens security credential handling, or
moves the bounded diagnostic-send verification authority into observability change mode.

### Data and State

#### Routing and operation states

The root transforms one task description into a set of applicable child slugs. The set is unordered for
authority: each operation owns its own preconditions and dependencies. A child can be loaded because of the
initial task or because another child reaches a boundary it does not own.

Every operation uses these conceptual states:

```text
eligible -> bound -> active -> success
                    |       -> blocked
                    |       -> error with recovery
                    |       -> cancellation or timeout when the operation permits them
                    `------ -> user-decision pause
```

`panic` is a returned Go exit-path fact when relevant, not an acceptable agent-operation state. A child must
not call a blocked result success. A user-decision pause retains compared alternatives, recommendation,
affected obligations, and the exact question.

#### Terminal record

Every operation returns this universal core, omitting only fields that are provably not applicable and naming why:

| Field | Exact content |
|---|---|
| Operation and mode | Child slug plus author, read-only review, preparation, or authorized external-action coordination mode as the operation defines it |
| Accepted result | Named result and observable behavior the operation was asked to produce |
| Decision basis | Material alternatives, sources, recommendation, user decision or cited prior decision for the same decision with matching affected context and assumptions, and reopen evidence |
| Owned object | Package name, import path, package directory or placement, package boundary, public API or CLI, module path, project command, binary, archive, log record, metric, span, crash report, profile, or release destination |
| Terminal state | Success, error, cancellation, timeout, blocked, or user-decision pause; Go panic is recorded as diagnosed program behavior when relevant |
| Changed or reviewed paths | Exact project paths when files are part of the result |
| Evidence | Project command, exact package pattern, selected Go toolchain version, flags, `GOOS/GOARCH` target, inputs, duration, and result |
| Evidence limit | Unexecuted exact package patterns, inputs, `GOOS/GOARCH` targets, exit paths, environments, or consumers excluded from the claim |
| External read or effect | Named network destination, cache/download scope, credential use, current authority, redaction, retained state, and whether external mutation occurred |
| Compatibility decision | `compatible`, `migration supplied`, `authorized break`, or `unsupported`, with affected consumers |
| Block | Missing prerequisite or first useful diagnostic, affected obligation, current evidence, and risk |
| Recovery | Recovery owner, first recovery action, rollback or retry boundary, and retained inputs or artifact identity |
| Handoff | Next child, manager, Git operation, or named external-action owner; authority still required; exact input identity it receives |

Operation-specific terminal fields are additive:

| Operation | Additional terminal fields |
|---|---|
| `go-architecture` | Package names, import paths, package directories or placement, package boundaries, module/process graph, invariants, dependency direction, alternatives, confirmed design, validation questions and signals |
| `go-debugging` | Original symptom, reproducer, environment, first useful diagnostic, causal chain, root cause or leading causes, distinguishing diagnostic plan |
| `go-development` | Author or review mode, bound scope, material-choice and prior-decision gates, compiling skeleton and complete slices when authoring, changed or reviewed paths, original reproducer, project verification, unsupported claims, separate no-credential and no-external-mutation facts in author mode, and any result-dependent external-action owner, returned evidence, prerequisite, retained state, recovery action, and handoff |
| `go-modules` | Module path, layout, graph, workspace, `go` directive, dependencies, tools, exact public package paths and project commands, external-consumer result, module consumer compatibility analysis, private module or import-path scope, proxy or VCS destination, authorized network and credential reads, redacted evidence and limits, cache/download effects, credential/destination owner, retained safe state, first recovery action; no external mutation or version or tag proposal or decision |
| `go-testing` | Evidence question and test kind, observable test boundary or controllable dependency, cases, project test command, exact package pattern, `GOOS/GOARCH` target, cache/temp/fuzz outputs, flakes, repetitions, evidence limits, production-design handoff |
| `go-security` | Trust boundary, assets, threats, protected data, dependency and vulnerability position, residual risk, exact credentialed-read or verification authority and protected handling, separate forbidden external mutation and publication facts, returned external-owner evidence, or exact owner, prerequisite, retained state, recovery action, and handoff |
| `go-observability` | Diagnostic questions, signal schema, propagation, redaction allow-list, destination, retention/access owner, arrival evidence; change-mode no-credential and no-external-mutation facts plus destination-owner result or exact block and handoff; distinct verification-mode test destination, authorized test credential, and bounded test diagnostic external state |
| `go-performance` | Performance question, representative workload, baseline profile, bottleneck, comparison method, result profile, resource trade-off, regression guard |
| `go-packaging` | Project default build command plus named target, exact package pattern, `GOOS/GOARCH` target, cgo state, artifact path, metadata, inventory, checksum, smoke result |
| `go-release` | Go-domain release classification, release compatibility analysis, exact version and tag decision, readiness evidence, action specification, translation and supply of the Git-owned caller-neutral contract, manager-granted authority, named executor, returned Git or non-Git destination state, post-action verification, external-consumer verification, recovery semantics, and release result; the caller-neutral Git executor handoff also carries exact tag/ref inputs, preflight conflict state, local and remote before/after state, verification, retained partial state, and separately authorized recovery boundary |

#### Exact vocabulary

The family uses these exact forms at the claim site:

| When the claim means | Required words |
|---|---|
| Oldest Go release the project promises | `minimum supported Go version` |
| Go binary selected to run a command | `selected Go toolchain version` |
| Language and module behavior selected by the `go` directive | `module's Go language version` |
| Code or build selection | Exact package pattern passed to a `go` or project command, project command, or `GOOS/GOARCH` target |
| Ordinary build entry | Project default build command plus named target |
| Consumer contract | Public API or CLI, naming which one |
| Compatibility state | `compatible`, `migration supplied`, `authorized break`, or `unsupported` |
| Test entry | Project test command |
| Testability | Observable test boundary or controllable dependency |
| Claimed outcome | Result or observable behavior |
| Program termination | Success, error, cancellation, timeout, or panic exit path |
| Command evidence | Project command, exact package pattern, selected Go toolchain version, flags, `GOOS/GOARCH` target, inputs, duration, and result |
| Module contract | Module path, `go` directive, dependencies, exact public package paths, and project commands, each named separately |
| Anything previously called a surface | The actual owned object: for example package name, import path, package directory or placement, package boundary, public API or CLI, module path, project command, binary, archive, log record, metric, span, crash report, profile, or release destination |

`go-toolchain` alone owns exact package-pattern semantics. Testing, development, packaging, modules, and other
operations record the exact package pattern they passed only as part of project-command selection or evidence.

No durable skill fixes a current Go release number. A current support claim reads the live official policy at
the time of work and records the exact selected values in the operation evidence.

### Behavior and Recovery

#### Normal routing and composition

1. The acting agent loads `go` for any Go task and evaluates all fourteen triggers against the requested result.
2. It loads every matching child. A general code change normally loads `go-development` plus applicable preferences, testing, and toolchain guidance. It does not load architecture, release, or another specialist without that trigger.
3. Each child binds its result, authority, inputs, owned claims, applicable sibling routes, and evidence before action.
4. Each viable design choice runs through the material classifier. A material choice pauses at compared reference-backed alternatives unless a cited prior decision resolves the same decision and its affected context and assumptions still match; changed context reopens it. A fully determined routine choice proceeds. Permission to write a caller-approved design artifact is checked separately.
5. Operations reach their own success, block, error with recovery, cancellation/timeout, or decision pause and return the exact terminal record.
6. Evaluation applies the checklist of every active child. No single focused test, clean build, checklist, or artifact substitutes for the other active concerns.

This numbered behavior describes the designed runtime contract, not an implementation task list.

#### Representative multi-child paths

- A public API change at a named package import path loads `go-development`, `go-design`, `go-conventions`, `go-testing`, and
  `go-toolchain`; it adds `go-modules` only when the module consumer contract changes.
- A deadlock diagnosis loads `go-debugging`, `go-concurrency`, `go-testing`, and `go-toolchain`; an accepted fix
  then adds `go-development`.
- Adding trace propagation and crash capture to a Go service loads `go-observability`, `go-security`,
  `go-development`, `go-concurrency`, `go-testing`, and `go-toolchain`. `go-observability` owns emitted records
  and arrival; `go-security` owns protected diagnostic data.
- Reducing allocation under a representative workload loads `go-performance`, `go-development`,
  `go-testing`, and `go-toolchain`; concurrency is added if contention or scheduling enters the diagnosis.
- Producing binaries for a `GOOS/GOARCH` target loads `go-packaging`, `go-toolchain`, `go-testing`, and often
  `go-modules`. A later release of those exact checksums adds `go-release` for the Go-domain decision and
  result and for translation and supply of the caller-neutral Git contract, the manager for current authority,
  the Git operation for any Git effect, and a named external-action owner for each non-Git destination effect.
- Validating a private dependency loads `go-modules`, `go-toolchain`, and applicable `go-testing` and
  `go-security` guidance. Before the first authenticated read it binds current manager authority, the exact
  private module or import-path scope, proxy or VCS destination, ephemeral credential delivery, project
  command, declared cache/download effects, and redacted evidence limits. It performs no external mutation.

#### Failure containment and recovery

- **No route:** The root design is invalid. Add no catch-all policy; reopen the ownership map.
- **Material decision missing:** Preserve alternatives and recommendation. Ask through the owning user-decision channel; make no design-dependent mutation.
- **Diagnosis not reproduced:** Return a bounded diagnostic plan. Do not guess a production change.
- **Required evidence unavailable:** Name the project command or consumer that could not run, the prerequisite, first useful diagnostic, affected obligation, risk, owner, and first recovery action. Do not claim completion across it.
- **Private-module read failed:** Stop further network and credential use. Preserve the module and consumer
  graph, redacted first diagnostic, and declared safe cache state. Do not persist or report the credential or
  private-module settings. Name the credential/destination owner and first recovery action; changing the
  scope, destination, or credential requires new current manager authority.
- **Forbidden external action required:** General development, security change, or observability change never
  performs the mutation. Preserve changed paths, redacted evidence, declared cache state, and other safe
  retained state that applies. Name the exact external-action owner, prerequisite, affected obligation, risk,
  first recovery action, and handoff. The Go operation may consume exact returned evidence and continue its
  result, or remain blocked; it never infers credential, mutation, publication, or recovery authority.
- **Git tag/ref conflict or partial publication:** Stop without force, overwrite, deletion, history rewrite,
  configuration change, or implicit recovery mutation. Preserve exact local and remote state and unique
  objects. Return the conflict, affected release obligation, risk, recovery owner, first non-mutating recovery
  action, and any separately authorized mutation needed next.
- **Artifact identity changed:** Invalidate packaging or release evidence bound to the old checksum. Rebuild or reverify through the owning operation before publication.
- **Publication failed or verification found a defect:** Stop promotion. Preserve exact executor-returned state and logs. `go-release` applies its specified recovery semantics by requesting the manager and named executor for any required effect; never rewrite published history implicitly.
- **Checklist overlap or excess breadth:** Merge only true fan-out, run the atomicity test, and reopen the child boundary if more than fifty-five distinct conditions remain.
- **Protected diagnostic data found:** Treat it as a `go-security` failure, correct destination retention and access through its owner, and reverify the `go-observability` result.

## Quality and Operations

| Concern | Design obligation |
|---|---|
| Performance and resource use | The root loads only matching children. `go-performance` requires representative workloads and profiles. Tool, test, diagnostic, and packaging project commands record duration and resource-relevant limits. Checklist caps expose an oversized child rather than hiding conditions. |
| Security and privacy | `go-security` owns trust boundaries, protected data, dependency vulnerabilities, secrets, and residual risk. Security change binds credential use to a separately authorized exact read or verification need, exact protected scope and destination, ephemeral delivery, redacted evidence, declared cache state, and no credential or private-setting persistence; it performs no external mutation or publication and verifies returned evidence from the named external-action owner. `go-observability` allow-lists diagnostic fields and verifies stored output; change mode uses no credentials and performs no external mutation, while verification uses only its distinct bounded authorized test-destination path. `go-modules` may use an ephemeral credential only for an exactly authorized authenticated private-module read; it persists or reports no credential or private setting and performs no external mutation. `go-release` uses no credentials; a named executor uses them only under manager-granted authority. |
| Governance | Development and architecture apply the complete material-choice classifier before planning. The user or accepted project authority decides every material design choice. In general development, credential use is none and external mutation is forbidden. In observability change, credential use is none and external mutation is forbidden. Security change binds exact credential authority separately and forbids external mutation and publication. The manager grants current external or destructive authority. `go-release` alone references Git and supplies its caller-neutral contract. The Git operation references no outside skill and owns only the exact authorized Git effect. Each named external-action owner owns its non-Git destination effects. Result-dependent operations consume returned evidence or preserve an exact block, retained state, recovery action, and handoff. Routine choices must be fully determined and change no classifier dimension. A skill cannot infer credential use, publication, destructive change, compatibility break, scope expansion, or external mutation from technical readiness. |
| Accessibility and inclusion | The artifacts are plain, literal, cold-readable Markdown with descriptive headings and mainstream terms. User-interface accessibility is not applicable because the subject is a non-visual skill family. |
| Locale | Locale-specific Go program behavior is not applicable to the skill topology. Durable prose avoids local project jargon; project commands, paths, and Go identifiers remain exact. |
| Compatibility and migration | Package boundary, public API or CLI, module path or consumer contract, minimum supported Go version, module's Go language version, selected Go toolchain version, project command, and artifact changes use the four-state compatibility decision. A migration is a supplied usable path, not a label. `go-modules` owns module consumer compatibility analysis; `go-release` owns release compatibility analysis and every exact version and tag decision. |
| Reversal and rollback | Skill-source reversal belongs to the workflow owner. Git-effect recovery execution belongs to the caller-neutral Git operation under separate exact manager authority. The bounded Git executor retains exact partial state and performs no recovery mutation without that authority. `go-release` specifies publication recovery semantics, requests the authorized Git action, and verifies returned recovery results without rewriting published history. Packaging evidence can be regenerated from frozen inputs but cannot silently replace a released checksum. |
| Observability | `go-observability` owns emission and verification of Go diagnostic records. It does not own live-health response, on-call policy, traffic decisions, or service rollout. |
| Maintenance | Official live documentation is read when version-sensitive claims matter. Every external study row records authority, relevance, currency, applicability, license, and a separate reuse disposition. No fixed Go release or mandatory third-party tool appears in durable guidance. Each claim and checklist row has one semantic owner. |
| Operational readiness | Every supported Go operation mode has an explicit effect row with credential use and external mutation reported separately. Development author, security change, and observability change identify forbidden external actions, their named external-action owners, returned evidence or exact block, retained state, recovery action, and handoff. Observability diagnostic-send verification stays a distinct bounded test-destination path. The separate bounded Git executor contract is caller-neutral and names its caller-supplied inputs, current authority, conflicts, effects, verification, partial state, and handoff. `go-release` builds and supplies that contract in the sole skill-reference direction; Git references no outside skill. Local preparation, manager-granted authority, Git or named non-Git execution, returned state, post-action verification, and recovery semantics are distinct states. Terminal records let the next owner resume without private conversation context. |

## Risks and Validation

| Risk or Assumption | Impact | Evidence | Question | Method | Signals | Owner and Timing | Reopen When |
|---|---|---|---|---|---|---|---|
| Fourteen children may over-partition routine work | Agents load too many skills and lose selective value | Current seven-child baseline; domain selective-loading rule | Does ordinary Go work usually load a small relevant subset? | Future route walkthrough over representative package-boundary or public-API change, bug, module edit, security review, observability change, performance diagnosis, packaging, and release prompts | Pass: ordinary prompts select a bounded subset and every prompt selects at least one child; Fail: normal prompts select most children or any prompt selects none | Skill author and fresh evaluator before accepting family implementation | Normal work selects most children or a supported task selects none |
| A proposed child may lack an independent result | Duplicate procedures and checklist ownership | Accepted boundary analysis | Can each child finish or block without sibling prose repairing it? | Future operation-state walkthrough for normal, alternative, blocked, and handoff paths | Pass: every child has one recognizable terminal result; Fail: a child ends only by invoking an undefined sibling result | Skill author during skeleton review; evaluator before acceptance | Any child cannot state independent completion |
| Current proven behavior may be lost during reconciliation | Existing users receive weaker guidance | Current seven skills and checklists | Does each preserved claim retain normative force and evidence? | Future semantic owner and before/after contract comparison, including all current checklist traces | Pass: every preserved claim maps to unchanged meaning or an accepted new owner; Fail: an obligation disappears, weakens, or duplicates | Skill author after each child revision; evaluator on final family | A preserved claim lacks an owner or changes without decision |
| Material-decision confirmation may become cosmetic or excessive | Users either lose authority or face trivial questions | GOSK-03; Principles; accepted classifier | Are material decisions distinguished from routine execution choices and stale prior decisions? | Future scenario pilot across every classifier dimension, plus local syntax, formatting, a mechanically determined private name, same-context prior decisions, and changed-context prior decisions | Pass: every changed dimension pauses, fully determined mechanics proceed, same-context decisions are cited, and changed context reopens; Fail: a material choice is assumed or a routine choice pauses | Development and architecture authors before acceptance | Pilots cannot distinguish material, routine, current-prior, and stale-prior choices |
| Specialized operations may duplicate development | Cyclic procedures and maintenance drift | TypeScript and Web prior art; semantic owner map | Does specialized code work load rather than restate general construction? | Future cross-reference and claim-owner audit | Pass: concern result stays specialized and general build steps have one owner; Fail: most development phases appear independently in a specialist | Skill author after each specialist; evaluator on full family | A specialist repeats most of development |
| An operation mode may hide an effect | A review or diagnostic path could write source, download data, use credentials, or mutate an external destination without authority | Accepted mode/effect matrix; current toolchain side-effect classes; accepted GOIDEA-R4-01 strict boundary | Does every supported mode classify credential use and external mutation as separate binary facts and trace exact external-owner results, blocks, recovery, and handoffs into its Procedure and checklist? | Future matrix-to-Procedure-to-checklist trace plus author/review, diagnostic, cache/download, network, credential, publication, external-mutation, returned-evidence, retained-state, handoff, and recovery pilots; include development author, security change, observability change, and distinct observability diagnostic-send verification | Pass: all rows and fields trace; general development and observability change use no credentials; all three change modes execute no external mutation; security credential use binds exact separate authority and protected handling; named owners return evidence or exact blocks retain recovery and handoff fields; observability verification keeps its bounded test-destination authority. Fail: a mode inherits or omits an effect, merges the two facts, executes forbidden mutation, weakens security credential handling, or moves verification authority into change mode | Each operation author, then evaluator on the full family | Any supported mode lacks a field, merges credential use with external mutation, crosses its assigned owner or authority boundary, or loses the change/verification distinction |
| Private-module support may leak credentials or lose authenticated validation | Existing private consumers become unverifiable or secret material enters durable state | Current Go Modules contract; accepted authenticated-read path | Do both module modes bind current authority, exact private scope and destination, ephemeral credential use, redacted evidence, no persistence, and no external mutation? | Future author/validation pilots for authorized success, missing authority, changed destination, failed authentication, cache partial state, and cosmetic authentication claims | Pass: authorized reads succeed or block with redacted recoverable evidence and no mutation or secret persistence; Fail: a credential is exposed or persisted, a destination changes without authority, external state mutates, or private support is silently dropped | Module and security authors; evaluator before acceptance | Either module mode cannot validate an authorized private dependency safely |
| Packaging and release may blur authority | Local readiness could trigger unauthorized publication | GOSK-02; adjacent packaging and release prior art | Can every path keep module consumer compatibility analysis, local artifact production, release decisions and caller-neutral contract translation, manager authority, Git effects, and named non-Git destination effects distinct? | Future tabletop walkthrough for module-only, binary, failed publish, and withdrawal cases | Pass: exact inputs, release compatibility analysis, exact version/tag decision, action specification, caller-neutral Git translation and supply, manager authority, named executor, returned state, post-action verification, and recovery semantics are explicit; only `go-release` references Git. Fail: modules make a release decision, packaging publishes, any external mutation is assigned to `go-release`, release rebuilds an input, Git references an outside skill, or an executor acts without current authority | Module, packaging, and release authors; manager, Git operation, and named external-action contract owners; evaluator before acceptance | Reopen if evidence shows packaging and publication are one indivisible result, either responsibility moves to another durable owner, or the canonical Git operation cannot execute the exact authorized tag/ref contract without broader mutation or an invented project-policy input. |
| Bounded Git tag/ref execution may broaden, depend outward, or become destructive | A release can violate Rule 4, overwrite a ref, publish the wrong object, or leave an unsafe partial state | Canonical Git operation and conventions; accepted R3 scope expansion and GOIDEA-R5-01 | Does the Git executor consume a caller-supplied, caller-neutral action specification and current authority, reference no outside skill, reject conflicts, mutate and publish only the named ref without force, verify local/remote identity, and retain exact recovery evidence? | Future Git contract trace and table-top pilots for caller identity, local conflict, remote conflict, changed target object, signing or annotation input, network failure after local tag creation, remote verification mismatch, and recovery without authority | Pass: every exact input and effect is bound, Git remains caller-neutral, conflicts stop before mutation, non-force state verifies, partial state is retained, and recovery mutation requires new authority; Fail: the executor names an outside skill, guesses a format or remote, forces, overwrites, deletes, rewrites, changes configuration, or hides partial state | Git operation and conventions author, release author, manager, then evaluator before acceptance | Planning or execution must invent a caller, tag/ref input, authority, effect, verification, or recovery field |
| Selected capability names may be absent from the register | The root could violate the governing naming standard even when its routes are otherwise correct | Domain Skill same-change rule; official Go Diagnostics and PGO/performance material | Are `debugging` and `performance` admitted as free words in the same change and used with their authoritative Go meanings? | Future naming-register diff and root/child identity audit | Pass: both words appear once in the free register and every child identity and route agrees; Fail: either word is missing, overloaded, or changed only in a generated view | Domain-family author before child creation; evaluator before acceptance | Authoritative Go usage changes or a selected word collides with a reserved meaning |
| Vocabulary may remain ambiguous | Different agents record different facts | GOSK-05; official Go terminology | Does every package identity, package-pattern selector, version, command, target, compatibility, test, module, result, and owned object claim identify one fact and owner? | Future cold-reader terminology audit and search for package-pattern use outside project-command selection or evidence | Pass: design claims name package name/import path/directory or placement/boundary/API or CLI, command claims name the exact pattern passed, and every other claim is answerable without private context; Fail: a reader must infer an identity, selector, version, target, command, object, or owner | Maintainer after prose completion; evaluator before acceptance | One term still denotes distinct facts or an exact package pattern is used as a design or consumer identity |
| Checklist rows may hide partial failure | A checked row overstates completion | GOSK-06; current compound examples; Checklist operation | Is every row independently binary after placeholder substitution? | Future full-corpus residual-verb audit plus passing, failing, and cosmetic subject pilots | Pass: different required states have different rows and cosmetic subjects fail; Fail: a row can be both yes and no or form-only work passes | Checklist authors, then fresh evaluator | Any row has independent verb results or cosmetic compliance passes |
| New checklist sources may exceed the breadth cap | A child is too broad or authors bundle conditions | Checklist fifty-five-row cap | Does each source remain complete and atomic within fifty-five rows? | Future trace matrix, fan-out merge, atomic split, and final count | Pass: all obligations trace within cap; Fail: more than fifty-five distinct conditions remain or a condition is dropped/bundled | Checklist author before preservation; evaluator before acceptance | Complete atomic coverage exceeds the cap |
| Official documentation may change | Durable mechanism claims become stale | Live official sources and no fixed release decision | Are version-sensitive facts read from current owners at use time? | Future link and claim verification against official documentation during authoring and later maintenance | Pass: live claims are cited and durable prose fixes no transient release; Fail: current version or unsupported project command is frozen | Skill author during implementation and maintainer on affected updates | Official owner changes a material mechanism or term |
| External-source assessment may become incomplete | Planning reuses stale, inapplicable, or license-unclear material | Ideation templates; direct official license sources | Does every external source still state authority, relevance, currency, applicability, license, and separate reuse disposition? | Future study-table schema and link audit against the cited official source and licensing page | Pass: all six facts remain explicit and supported; Fail: one dimension is absent, inferred, or replaced by a paraphrase label | Ideation author when study changes; evaluator before acceptance | A source changes owner, material content, applicability, or license, or its assessment cannot be established |

No validation in this table has been performed by this Ideation work. The listed methods are commitments for
the later skill-authoring and evaluation work.

## Deferred and Rejected

| Idea | Status | Reason | Next Step |
|---|---|---|---|
| Generic deployment and service rollout | Excluded | Different runtime, traffic, authority, and recovery owners | Hand an exact published artifact and evidence to the applicable deployment owner when separately requested |
| Containers | Excluded | Container construction is not a Go language artifact contract | Route to the applicable platform or deployment owner |
| Operating-system packaging and installation orchestration | Excluded | Installers and system packages have platform-specific identity, signing, and recovery | Route to the applicable desktop or operating-system packaging owner |
| Data migration | Excluded | Data compatibility and recovery depend on the product and storage owner | Route through the owning feature, service, or release design when in scope |
| Environment configuration | Excluded | Per-environment values and secrets have another configuration owner | Load the applicable configuration guidance |
| Traffic promotion and live-health ownership | Excluded | Publication does not authorize rollout or operational response | Route to deployment and operational owners after artifact verification |
| Fixed Go release number in durable skills | Rejected | The project contract and official live support policy change | Read and record the current values during each operation |
| Mandatory third-party tools | Rejected | Projects choose, pin, authorize, and support different tools | Use a project-selected tool only when the task and project contract activate it |
| Project-jargon glossary | Rejected | It makes each claim depend on private vocabulary | Use exact mainstream Go terms inline |
| Mandatory stage chain | Rejected | It defeats selective routing and loads irrelevant concerns | Keep outcome-led multi-select routing |
| Family-wide checklist | Rejected | It removes independent child ownership and exceeds one subject's breadth | Keep one checklist per child and combine active sources during Evaluation |
