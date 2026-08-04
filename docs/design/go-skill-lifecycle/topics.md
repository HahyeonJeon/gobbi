# Go Skill Lifecycle Expansion - Topics

> **Role:** Discussion agenda<br>
> **Purpose:** Organize completed requirements and study into topics for discussion.

## Contents

- [Requirements](#requirements)
- [Study](#study)
- [Topics](#topics)
- [Discussion Order](#discussion-order)
- [Family Topology and Routing](#family-topology-and-routing)
- [Operation Boundaries and Lifecycle](#operation-boundaries-and-lifecycle)
- [Language and Handoff Contracts](#language-and-handoff-contracts)
- [Evaluation Assurance](#evaluation-assurance)
- [Dependencies](#dependencies)
- [Coverage](#coverage)

## Requirements

The target is a complete, independently loadable Go skill family that guides material Go work from design and
diagnosis through verified artifacts and authorized release. The current seven-child family has strong
development, design, module, testing, and toolchain contracts. It lacks complete owners for architecture,
debugging, security, standalone observability and crash capture, profiling-led performance, executable
packaging, and publication. Its root also contains Go policy despite the navigation-only domain contract.

The expected result is one policy-free root and exactly sixteen direct children. It serves agents, user and
project decision owners, Go consumers, skill maintainers, evaluators, the manager, the Git operation and
conventions owner, private-module credential and destination owners, and named external-action owners. It accepts the
project contract, affected Go project, user decisions, current Go evidence, official Go documentation, and
workflow authority. It returns selective routing, self-contained child contracts, verified local artifacts,
explicit blocked results and handoffs, and unchecked checklist sources.

| Requirement | Required result |
|---|---|
| Selective Navigation Without Root Policy | Route every supported Go task through the literal `Child skill \| Type \| Load when` root schema, copy child triggers byte for byte, emit no owned-result column, and keep no root policy or mandatory stage chain |
| Complete Independent Lifecycle Coverage | Give each of the approved sixteen concerns an independently loadable owner and observable result or judgment boundary |
| One Semantic Owner and Acyclic Composition | Route every material claim to one owner and compose siblings without reciprocal policy duplication |
| Concrete Development and Design Contracts | Retain `Study -> Design -> Build -> Verify`; classify material choices by contract effect; require reference-backed alternatives plus user confirmation for material choices; let fully determined routine execution choices proceed |
| Exact Operational Results, Blocks, and Handoffs | Define each operation mode's project writes, local outputs, caches or downloads, execution, network, credential use and external mutation as separate binary facts, pause, completion, blocked result, recovery, and exact handoff fields |
| Mainstream and Exact Go Vocabulary | Distinguish package names, import paths, directories or placement, boundaries, and APIs or CLIs from exact package patterns passed to commands; distinguish Go versions, commands, targets, compatibility decisions, test boundaries, results, exit paths, evidence, module facts, and concrete owned objects |
| Atomic and Traceable Evaluation Sources | Give each child an eight-perspective, traceable, atomic checklist that composes with active siblings and rejects cosmetic compliance |
| Preserve Proven Existing Contracts | Retain existing concurrency, conventions, caller-led design, development, module authenticated-read, testing, and toolchain strengths unless an accepted decision supersedes them |

Included work is the `go` root, all sixteen named children, one checklist per child, the bounded release
tag/ref executor consistency touch in the canonical Git operation and conventions, and the
[`domain-skill.md`](../../../.gobbi/projects/gobbi/skills/skill-writing/domain-skill.md) naming-register update
that admits `debugging` and `performance` as free capability words, revises reserved `conventions`, and
reserves `source` and `documentation`. Every other outside-Go edit is excluded
unless this exact naming, bounded Git, or routing consistency contract requires it. Excluded work is
generic deployment, containers, operating-system packaging, installation orchestration, service rollout,
data migration, environment configuration, traffic promotion, and live-health ownership. A fixed Go release,
mandatory third-party tools, and a project-jargon glossary are rejected. No Phase 1 question remains open.
The accepted written-form partition retains `go-conventions` and adds the `go-source` and
`go-documentation` preferences. Their checklist allocation is exactly `47 + 17 + 8 = 72` under `GOCNV`,
`GOSRC`, and `GODOC`. All ten operation results and all twenty-one operation-mode rows remain unchanged.
`go-release` builds, translates, and supplies the Git-owned caller-neutral tag/ref action specification. Only
`go-release` references and calls Git; Git does not reference `go-release` or another skill. This one-way
direction satisfies Gobbi Rule 4 while the eventual Git sources remain caller-neutral and contain no Gobbi or
outside-skill reference.

## Study

### Internal Study

| Source | Location | Assessment | Lesson | Status |
|---|---|---|---|---|
| Current Go root | [`go/SKILL.md`](../../../.gobbi/projects/gobbi/skills/go/SKILL.md) | Canonical project source at base `df18ccda`; directly applicable; same-project reuse | The seven-child routing baseline is sound, but the traced-service paragraph violates the policy-free root contract and admits an observability gap | Adopt |
| Current Go children and checklists | [`go/`](../../../.gobbi/projects/gobbi/skills/go/) | Canonical project sources; directly applicable; same-project reuse | Preserve the existing development lifecycle, preference splits, module consumer checks and authorized authenticated private-module reads, test distinctions, evidence limits, and tool side-effect classes; repair compound rows and uncovered handoffs | Adopt |
| Domain Skill standard | [`domain-skill.md`](../../../.gobbi/projects/gobbi/skills/skill-writing/domain-skill.md) | Governing current standard; directly applicable; same-project reuse | The emitted root must be navigation-only and use exactly `Child skill \| Type \| Load when`; it lists each child once, copies exact triggers, emits no result column, loads every applicable child, and contains at least one operation, tool, and preference; its same-change naming rule requires this design to admit `debugging` and `performance`, revise `conventions`, and reserve `source` and `documentation` | Adopt |
| Ordinary skill standards | [`skill-writing/`](../../../.gobbi/projects/gobbi/skills/skill-writing/) | Governing current standards; directly applicable; same-project reuse | Operations own executable results, preferences own judgment, the tool owns named-tool lookup, and every child is self-contained | Adopt |
| Evaluation Checklist operation | [`evaluation/checklist/SKILL.md`](../../../.gobbi/projects/gobbi/skills/evaluation/checklist/SKILL.md) | Governing current standard; directly applicable; same-project reuse | Use eight perspectives, six literal scenario classes, stable IDs, at most six rows per scenario and fifty-five per source, atomic rows, traceability, and cosmetic-compliance pilots | Adopt |
| Committed Go Conventions checklist | [`go-conventions/checklists.md`](../../../.gobbi/projects/gobbi/skills/go/go-conventions/checklists.md) | Current committed source at `7b668cef`; directly applicable; same-project reuse | The source has 52 rows; one compound dot-import row splits into two; 19 independently uncovered states add 19 rows; a multi-input generator row needs wording-only repair; the atomic minimum is `52 - 1 + 2 + 19 = 72`, 17 above the 55-row cap, so one conventions owner is invalid | Adopt; reopen topology |
| TypeScript Development and Packaging | [`typescript/`](../../../.gobbi/projects/gobbi/skills/typescript/) | Adjacent maintained family; strong structural fit; same-project reuse | A general development operation composes with specialized children; local package artifacts can be verified before the manager grants publication authority | Adopt |
| Web Security and Observability | [`web/`](../../../.gobbi/projects/gobbi/skills/web/) | Adjacent maintained family; behavior fit with a different runtime boundary; same-project reuse | Specialized concerns may own complete changes, redaction, signal verification, and trust-boundary handling | Adopt |
| Electron Release | [`electron-release/SKILL.md`](../../../.gobbi/projects/gobbi/skills/electron/electron-release/SKILL.md) | Adjacent maintained operation; authority and recovery fit; same-project reuse | Artifact identity, checksums, action specification, returned executor evidence, post-action verification, and recovery semantics belong in an explicit release result; manager and effect executors retain their own authority | Adopt |
| Canonical Git operation and conventions | [`git/SKILL.md`](../../../.gobbi/projects/gobbi/skills/git/SKILL.md), [`git/conventions.md`](../../../.gobbi/projects/gobbi/skills/git/conventions.md) | Governing current Git lifecycle and deterministic mappings; directly applicable; same-project reuse | Local commits and branch publication exist, but one caller-neutral bounded release tag/ref executor contract must accept caller-supplied exact inputs plus current manager authority; preserve the exact tag/ref name, target object, repository, remote, tag form, signing or annotation, and non-force publication target; detect conflicts; verify local and remote state; retain recoverable partial state; return exact handoff; and reference no outside skill | Adopt with bounded extension |

### External Study

| Source | Link | Authority | Relevance | Currency | Applicability | License | Reuse status |
|---|---|---|---|---|---|---|---|
| Go Security Best Practices | [go.dev](https://go.dev/doc/security/best-practices) | Official Go team guidance | Direct evidence for supported releases, dependency and vulnerability review, fuzzing, race, and vet obligations | Live page checked 2026-08-03; release-sensitive advice must be reread when used | Applies to Go source, dependency, and verification contracts; project security rules remain controlling | [CC BY 4.0 site content](https://go.dev/copyright) | Adopt; cite and paraphrase |
| Diagnostics | [go.dev](https://go.dev/doc/diagnostics) | Official Go diagnostics guidance | Direct basis for debugging, profiling, tracing, and runtime-statistics boundaries and the `debugging` name | Live page checked 2026-08-03; tool details must be reread for the selected toolchain | Applies to Go diagnostic ownership and evidence; project commands and safety bounds remain inputs | [CC BY 4.0 site content](https://go.dev/copyright) | Adopt; cite and paraphrase |
| Profile-guided optimization | [go.dev](https://go.dev/doc/pgo) | Official Go performance guidance | Direct basis for representative profiles, iterative comparison, and the `performance` name | Live page checked 2026-08-03; version-sensitive PGO behavior must be reread | Applies when PGO or profile-led optimization is in scope; it does not impose PGO on every project | [CC BY 4.0 site content](https://go.dev/copyright) | Adopt; cite and paraphrase |
| Go module release workflow | [go.dev](https://go.dev/doc/modules/release-workflow/) | Official Go module workflow | Direct evidence for module consumer checks, version/tag release inputs, and tag-based publication semantics | Live page checked 2026-08-03; command and policy details must be reread before release work | Applies to Go modules and informs `go-release`; it does not own binary packaging or current authority | [CC BY 4.0 site content](https://go.dev/copyright) | Adopt; cite and paraphrase |
| Organizing a Go module | [go.dev](https://go.dev/doc/modules/layout) | Official Go module layout guidance | Direct evidence for module, package directory, import-path, library, and `cmd/` placement identities | Live page checked 2026-08-03; stable structure guidance with no fixed project layout | Applies as prior art; the project contract selects its actual package placement and boundaries | [CC BY 4.0 site content](https://go.dev/copyright) | Adopt; cite and paraphrase |
| Go command reference | [pkg.go.dev](https://pkg.go.dev/cmd/go) | Official `go` command source documentation | Live syntax owner for project-command effects, exact package-pattern selectors, flags, outputs, and `GOOS/GOARCH` targets | Live page checked 2026-08-03; the operation must bind the selected Go toolchain version | Applies to `go` command semantics; a project wrapper remains the named project command | [BSD-style Go source and API documentation](https://go.dev/LICENSE) | Adopt; cite and paraphrase |
| Go toolchains | [go.dev](https://go.dev/doc/toolchain) | Official Go toolchain-selection guidance | Direct evidence that minimum support, module language version, and selected toolchain are distinct | Live page checked 2026-08-03; selection behavior must be reread when version-sensitive | Applies to toolchain facts; the project supplies its actual minimum and selected versions | [CC BY 4.0 site content](https://go.dev/copyright) | Adopt; cite and paraphrase |
| Go release policy | [go.dev](https://go.dev/doc/devel/release#policy) | Official Go release-support policy | Direct evidence that current supported releases are live facts unsuitable for fixed durable prose | Live page checked 2026-08-03 and explicitly treated as time-sensitive | Applies when assessing support; the project may promise a different supported range | [CC BY 4.0 site content](https://go.dev/copyright) | Adopt as live lookup; cite and paraphrase |
| `runtime/debug` | [pkg.go.dev](https://pkg.go.dev/runtime/debug) | Official standard-library API documentation | Direct evidence for build information, stack capture, crash handling, and runtime diagnostics | Live page checked 2026-08-03; bind claims to the selected Go toolchain version | Applies when those APIs match the diagnostic question; not a universal observability requirement | [BSD-style Go source and API documentation](https://go.dev/LICENSE) | Adopt; cite and paraphrase |
| `testing` | [pkg.go.dev](https://pkg.go.dev/testing) | Official standard-library API documentation | Direct evidence for tests, examples, fuzzing, benchmarks, and their command-visible behavior | Live page checked 2026-08-03; bind details to the selected Go toolchain version | Applies to native Go evidence; project test commands may add stricter behavior | [BSD-style Go source and API documentation](https://go.dev/LICENSE) | Adopt; cite and paraphrase |
| `log/slog` | [pkg.go.dev](https://pkg.go.dev/log/slog) | Official standard-library API documentation | Direct evidence for structured log records, attributes, levels, and handlers | Live page checked 2026-08-03; bind API details to the selected Go toolchain version | Applies when `log/slog` is used or compared; it is not mandated over project-selected logging | [BSD-style Go source and API documentation](https://go.dev/LICENSE) | Adopt as reference, not mandate; cite and paraphrase |
| Go Code Review Comments: Interfaces | [go.dev](https://go.dev/wiki/CodeReviewComments#interfaces) | Official Go-maintained community guidance, not the language specification | Relevant prior art for consumer-defined interfaces and avoiding mock-only abstraction | Live page checked 2026-08-03; community guidance may evolve | Applies as a design preference when project and consumer evidence do not require another shape | [CC BY 4.0 site content](https://go.dev/copyright) | Adopt as preference evidence; cite and paraphrase |

### Lessons

The strongest fit is a full direct-child expansion, not a root policy patch. Official Go sources supply the
mechanism vocabulary and evidence limits, while project standards determine skill type, routing, authority,
and checklist shape. Adjacent project families support three important patterns: general development can
compose with specialized operations; specialized security, observability, and performance work can own a
complete change; and local artifact preparation can stop before separately authorized publication. The
completed conventions audit adds a fourth: naming, source form, and documentation are independently loadable
preference subjects whose atomic checklist coverage cannot share one capped source.

### Rejected

Expanding only the seven current children keeps fewer files but preserves mixed results and missing routes.
A mandatory lifecycle chain makes ordinary work load irrelevant policy and contradicts selective routing.
Putting executable packaging and publication back into `go-modules` confuses a module consumer contract with
binary and archive artifacts. A glossary or mandatory external tools would replace exact local claims with
indirection or unstable project assumptions.

### Gaps and Conflicts

Official Go documents define mechanisms, not this project's skill ownership. Adjacent families define useful
patterns but cannot own standalone Go processes. The user decision resolves those gaps through the exact
sixteen-child family and mixed result boundaries. Live Go releases, project commands, publication systems,
and `GOOS/GOARCH` target matrices remain project inputs; durable skills must name the facts to inspect rather than freeze
their current values. No material evidence conflict remains unresolved.
Accepted GOIDEA-R5-01 closes the dependency conflict by making the Git-owned interface caller-neutral and the
release-to-Git direction one-way. Accepted OPT-R5-01 closes the root-shape ambiguity by treating the richer
child table as a design inventory and reserving the literal three-column schema for emitted `go/SKILL.md`.
The conventions checklist audit later invalidated only the topology branch that assigned all written form to
one child. The accepted correction retains `go-conventions`, adds `go-source` and `go-documentation`, and
preserves every operation result and mode row. Any plan based on fourteen children, one conventions artifact
pair, or fourteen checklist sources is stale and must be regenerated from this design before execution; this
is a downstream shaping consequence, not an ordered implementation task.

## Topics

```text
Complete, selectively loaded Go guidance from design through authorized release
├── Family Topology and Routing
│   ├── Root Navigation Contract
│   ├── Sixteen-Child Ownership Map
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

## Discussion Order

Resolve topology first because every later owner, handoff, and checklist depends on the child partition. Then
resolve operation boundaries and decision authority. With owners fixed, resolve exact vocabulary and terminal
handoffs. Resolve checklist composition and atomicity last because they must trace the settled contracts. A
child that cannot own an independent result, duplicates most of a sibling checklist, or forces ordinary work
to load most children reopens the topology branch.

## Family Topology and Routing

> **Purpose:** Decide the complete family shape and selective routing model.<br>
> **Parent:** `Root`<br>
> **Depends On:** Completed requirements and domain-skill standard.<br>
> **Requirements:** Selective Navigation Without Root Policy; Complete Independent Lifecycle Coverage; One Semantic Owner and Acyclic Composition.<br>
> **Sources:** Current Go root; Domain Skill standard; TypeScript and Web roots.

### Context

The root must cover every supported Go task while remaining policy-free. The current family has seven strong
children, seven uncovered or conflated operation concerns, and one written-form preference whose atomic
coverage must split into three owners.

### Questions

- Should the family expand to sixteen direct children, retain the former fourteen-child partition, or use fewer lifecycle operations?
- How can routing select multiple concerns without imposing a stage chain?

### Options

- **Full sixteen-child family:** strongest independent ownership and selective loading; satisfies the written-form source cap; best fit.
- **Former fourteen-child family:** preserves fewer files but leaves the conventions subject 17 rows over the source cap.
- **Broaden seven current children:** least topology change; preserves missing independent results and mixed policy.
- **Use a few broad lifecycle operations:** smaller table; causes unrelated policy loads and unclear checklist ownership.

### Done When

The root shape, exact child set, selection rule, owner uniqueness, and reopen tests are decided.

### Root Navigation Contract

> **Purpose:** Decide what the `go` root may contain and how it selects children.<br>
> **Parent:** `Family Topology and Routing`<br>
> **Depends On:** Family shape.<br>
> **Requirements:** Selective Navigation Without Root Policy.<br>
> **Sources:** Domain Skill standard; current Go root.

#### Context

The standard permits only frontmatter, title, two or three short orientation paragraphs, and the Child Skills
table. That emitted table has exactly `Child skill | Type | Load when`; every trigger is a byte-for-byte child
copy and no owned-result column appears. A richer table may exist only as a labeled design inventory. The
current traced-service paragraph is policy and belongs to a child.

#### Questions

- Is routing outcome-led and multi-select, or stage-led and sequential?
- May the root define a universal Go policy floor?

#### Options

- **Outcome-led multi-select navigation with no policy:** exact standard fit and no mandatory chain.
- **Stage-led sequence:** predictable order but loads irrelevant children and duplicates operations.
- **Navigation plus universal policy:** centralizes a floor but violates the root shape and policy ownership.

#### Done When

The root is policy-free, may load several children, uses the literal `Child skill | Type | Load when` schema,
copies exact child triggers byte for byte, emits no owned-result column, and requires no mandatory stage chain.

### Sixteen-Child Ownership Map

> **Purpose:** Decide the exact child inventory, type, and independently owned result.<br>
> **Parent:** `Family Topology and Routing`<br>
> **Depends On:** Root Navigation Contract.<br>
> **Requirements:** Complete Independent Lifecycle Coverage; One Semantic Owner and Acyclic Composition.<br>
> **Sources:** Current Go family; type-writing standards; official Go sources.

#### Context

The retained children are `go-concurrency` (preference), a narrowed `go-conventions` (preference), `go-design`
(preference), `go-development` (operation), `go-modules` (operation), `go-testing` (operation), and
`go-toolchain` (tool). Add `go-documentation` and `go-source` as preferences. The proposed operations remain
`go-architecture`, `go-debugging`, `go-security`, `go-observability`, `go-performance`, `go-packaging`, and
`go-release`.

The capability register changes in the same design. `conventions` means the project-overridable naming and
error-text preference, including authority and departure boundaries for written-form choices. `source` means
the source-file organization, formatter layout, import-form, and generated provenance preference.
`documentation` means the public documentation and implementation-comment preference. The trigger candidates
are exact:

- `go-conventions`: `MUST load when choosing or reviewing Go package names, identifiers, receiver names, source file names, import aliases, error text, or project-wide written-form conventions.`
- `go-documentation`: `MUST load when writing or reviewing Go package comments, declaration comments, doc-comment links or headings, or implementation comments.`
- `go-source`: `MUST load when choosing or reviewing Go source file organization, canonical formatting, import grouping, blank or dot imports, or generated source provenance.`

Stable order is architecture, concurrency, conventions, debugging, design, development, documentation,
modules, observability, packaging, performance, release, security, source, testing, and toolchain.

#### Questions

- Does each proposed child own one independently recognizable result?
- Does any child need to split, merge, or change type?

#### Options

- **Exact sixteen-child mixed-type family:** matches all accepted concerns, satisfies checklist atomicity and breadth, and preserves ordinary skill types.
- **Former fourteen-child family:** keeps written form together but requires 72 atomic rows in one 55-row source.
- **Merge specialized operations into development:** fewer files but no independent result or checklist ownership.
- **Split mechanisms into more children:** finer loading but exceeds the approved family and fragments related results.

#### Done When

All sixteen names, types, triggers, results or judgments, and claim owners are exact, direct, globally namespaced, and in
the accepted stable order. The written-form sources total `47 + 17 + 8 = 72` rows without dropping or bundling
a condition.

### Composition and Reopen Tests

> **Purpose:** Decide how siblings compose and what evidence invalidates the partition.<br>
> **Parent:** `Family Topology and Routing`<br>
> **Depends On:** Sixteen-Child Ownership Map.<br>
> **Requirements:** One Semantic Owner and Acyclic Composition; Preserve Proven Existing Contracts.<br>
> **Sources:** Domain Skill standard; current Go family composition; TypeScript Development.

#### Context

Material Go work can activate several concerns. Composition must load all relevant guidance without copying
policy or creating reciprocal completion dependencies.

#### Questions

- Which child coordinates general code change and which owns specialized results?
- What empirical signs show that the partition is too broad or too narrow?

#### Options

- **One semantic owner, siblings route and all applicable children load:** composable and acyclic; best fit.
- **One mandatory coordinator for every task:** simple entry but creates a universal stage chain.
- **Duplicate shared policy in each child:** locally readable but drifts and breaks owner uniqueness.

#### Done When

The design reopens if a child lacks an independent result, more than half its checklist duplicates a sibling,
or normal Go work loads most children. Reopen if evidence shows packaging and publication are one indivisible
result, if either responsibility moves to another durable owner, or if the canonical Git operation cannot
execute the exact authorized tag/ref contract without broader mutation or an invented project-policy input.

### Non-goals and External Owners

> **Purpose:** Decide where the Go family stops and which neighboring owner receives excluded work.<br>
> **Parent:** `Family Topology and Routing`<br>
> **Depends On:** Sixteen-Child Ownership Map.<br>
> **Requirements:** Complete Independent Lifecycle Coverage; Exact Operational Results, Blocks, and Handoffs.<br>
> **Sources:** Current Go Modules boundary; Web Deployment; Electron Release; user scope decision.

#### Context

Go artifacts can participate in broader delivery, but that does not make deployment or operating-system
installation part of a Go language family.

#### Questions

- Which post-release or platform activities remain outside Go ownership?
- Should any durable skill prescribe a fixed Go release or third-party tool?

#### Options

- **Explicit fences with named external ownership:** precise and scope-safe; best fit.
- **Implicit stopping points:** shorter prose but unreliable handoff and checklist coverage.
- **End-to-end deployment inside Go release:** complete for one service shape but exceeds the approved domain.

#### Done When

Generic deployment, containers, operating-system packaging, installation orchestration, service rollout, data
migration, environment configuration, traffic promotion, live-health ownership, fixed Go releases, mandatory
third-party tools, and a project-jargon glossary are expressly outside or rejected.

## Operation Boundaries and Lifecycle

> **Purpose:** Decide the observable result, authority, and composition boundary of every operation.<br>
> **Parent:** `Root`<br>
> **Depends On:** Family Topology and Routing.<br>
> **Requirements:** Concrete Development and Design Contracts; Exact Operational Results, Blocks, and Handoffs; Preserve Proven Existing Contracts.<br>
> **Sources:** Current Go operations; Operation Skill standard; TypeScript Development and Packaging; Web specialized operations; Electron Release.

### Context

Operations earn separate loading through distinct results. Some results are designs or diagnoses. Others must
carry a specialized code or artifact change through verification.

### Questions

- Which operations stop before code change or publication?
- How does `go-development` compose with complete specialized operations?

### Options

- **Mixed result boundaries:** fits each concern and accepted authority; needs exact handoffs; best fit.
- **All operations stop at advice:** prevents overlap but leaves concern results incomplete.
- **All operations implement and publish:** crosses authority and produces a mandatory chain.

### Done When

Every operation has one result, terminal states, permitted side effects, sibling routes, and external authority boundary.

### Development and Design Authority

> **Purpose:** Decide the general code-change lifecycle and user authority over design.<br>
> **Parent:** `Operation Boundaries and Lifecycle`<br>
> **Depends On:** Composition and Reopen Tests.<br>
> **Requirements:** Concrete Development and Design Contracts; One Semantic Owner and Acyclic Composition.<br>
> **Sources:** Current Go Development; Principles; TypeScript Development; Go interface guidance.

#### Context

Current Go Development already uses `Study -> Design -> Build -> Verify` and compares one viable alternative.
Its user-confirmation rule is narrower than the accepted material-decision contract.

#### Questions

- Which design choices require user confirmation?
- When does development load a specialized operation, and when does a specialized operation load development?

#### Options

- **Confirm every material design choice unless a cited prior decision resolves the same decision with matching affected context and assumptions:** preserves user authority; best fit.
- **Confirm only public or breaking choices:** faster but leaves material internal architecture to assumption.
- **Let the agent decide all internal design:** efficient but violates the accepted decision contract.

#### Done When

Development retains all four phases, compares reference-backed alternatives, obtains required user decisions,
and composes bidirectionally by trigger without sharing claim ownership: development loads the specialized
operation when the concern motivates the change; security, observability, or performance loads development
when its accepted result requires code work.

Permission to write a caller-approved design artifact is separate from authority to make a material design
decision. Architecture author-design work pauses unless the user decides the material choice or a cited prior
decision resolves the same decision with matching affected context and assumptions.

The executable decision gate classifies a choice as material when different viable selections would change
task scope or acceptance; user-visible behavior; public API or CLI and compatibility or migration; package,
module, or process boundary or dependency direction; configuration, data, or state flow; mutable-data or
resource ownership or lifetime; concurrency, cancellation, or shutdown; trust, identity, authorization,
cryptography, secrets, protected data, or network exposure; failure containment, recovery, or rollback;
performance or resource budget or measurement strategy; diagnostic signals, redaction, retention, or access;
validation strategy, observable test boundary, controllable dependency, or strength of the completion claim;
or artifact identity, release, external effect, or destructive effect. A routine execution choice is fully
determined by accepted design or governing project convention and changes none of those dimensions; local
syntax, formatting, or a mechanically determined private name can qualify. A prior accepted decision resolves
the gate only for the same decision when affected context and assumptions still match and the source is cited;
changed context reopens it. Development and architecture Procedures and checklists trace this classifier.

### Operation Modes and Permitted Effects

> **Purpose:** Define the supported modes and permitted effects for all ten operations.<br>
> **Parent:** `Operation Boundaries and Lifecycle`<br>
> **Depends On:** Development and Design Authority; Sixteen-Child Ownership Map.<br>
> **Requirements:** Exact Operational Results, Blocks, and Handoffs; One Semantic Owner and Acyclic Composition.<br>
> **Sources:** Current Go operations and toolchain side-effect classes; adjacent security, observability, packaging, and release operations; user-approved effect boundaries; accepted GOIDEA-R4-01 strict-boundary correction.

#### Context

An operation name alone does not state whether a path may write source, create disposable diagnostics, populate
Go caches, download modules or tools, execute project code, use the network, use credentials, or mutate an
external destination. Each supported mode needs an explicit effect contract before action.

#### Questions

- Which modes does each operation support?
- What may each mode write, execute, download, access, or mutate?
- Where must it pause, and what exact terminal result and recovery record does it return?

#### Options

- **Shared effect vocabulary plus one explicit row per supported mode:** complete, comparable, and checklist-traceable; best fit.
- **One effect paragraph per operation:** locally readable but difficult to compare and audit across all ten operations.
- **Infer effects from the operation name:** shortest but cannot establish authority or safe recovery.

#### Done When

One matrix covers architecture author-design and review; debugging diagnosis; development author and review;
modules author and validation; testing author and execution; security review and change; observability
design/review, change, and verification; performance diagnosis/verification and change; packaging produce and
validation; and release preparation, read-only verification coordination, and authorized external-action
coordination. Every row states
project-path writes, disposable local diagnostic or artifact writes, Go caches and downloads, project code or
tool execution, network access, credential use and external mutation as separately reported facts within one
effect dimension, pause point, terminal result, and recovery.
Both module rows preserve separately authorized authenticated reads for exact private module or import-path
scope and destination inputs. They pause before first network or credential use and every scope or destination
change, retain only redacted non-secret evidence, persist no credential or private-module setting, and permit no
external mutation.
General development uses no credentials and performs no external mutation. Any credentialed read belongs to
the applicable specialist or tool owner under that owner's exact mode. When its result depends on an external
action, development coordinates and consumes returned evidence from a named external-action owner or returns
an exact block with owner, prerequisite, retained state, recovery action, and handoff.
A security change uses credentials only under separate exact read or verification authority with protected
scope and destination, ephemeral delivery, redacted evidence, declared cache state, and no credential or
private-setting persistence. It never infers authority, mutates external state, or publishes. Secret rotation
and provider, policy, or destination mutation go to a named external-action owner; security verifies returned
evidence or returns the exact block, handoff, and recovery record.
An observability change uses no credentials and performs no external mutation. Destination provisioning,
configuration, and mutation go to a named external-action owner, whose returned evidence the change consumes
or blocks on exactly. Diagnostic-send verification remains a distinct mode with a named test destination,
separately authorized test credentials, and bounded approved test diagnostic external state.

### Diagnostic and Specialized Change Operations

> **Purpose:** Decide the terminal results for architecture, debugging, security, observability, and performance.<br>
> **Parent:** `Operation Boundaries and Lifecycle`<br>
> **Depends On:** Development and Design Authority.<br>
> **Requirements:** Complete Independent Lifecycle Coverage; Exact Operational Results, Blocks, and Handoffs.<br>
> **Sources:** Official diagnostics, PGO, security, `log/slog`, and `runtime/debug`; Web specialized operations.

#### Context

Architecture and debugging can produce complete pre-implementation results. Security, observability, and
performance often require specialized implementation and verification to close their concern.

#### Questions

- What exact result closes each operation?
- Which evidence gaps produce a bounded plan rather than a false completion claim?

#### Options

- **Mixed boundaries:** architecture ends with confirmed design and validation plan; debugging with reproduced root cause or bounded diagnostic plan; security, observability, and performance may own complete verified concern changes and load development for code work; best fit.
- **All end at recommendations:** clean separation but no complete verified concern-change result.
- **All require code changes:** excludes valid design-only and diagnostic-only results.

#### Done When

Each operation's inputs, result, alternatives, failure, evidence, recovery, code-change route, and handoff are independently recognizable. Security and observability changes retain their Go-domain results while named external-action owners perform forbidden destination effects; general development coordinates only when its result depends on such an action. Each path consumes returned evidence or blocks with the exact owner, prerequisite, retained state, first recovery action, and handoff. Observability diagnostic-send verification keeps its separate bounded test-destination authority.

### Packaging and Release Separation

> **Purpose:** Decide the boundary among modules, local executable artifacts, and external publication.<br>
> **Parent:** `Operation Boundaries and Lifecycle`<br>
> **Depends On:** Sixteen-Child Ownership Map; Non-goals and External Owners.<br>
> **Requirements:** Complete Independent Lifecycle Coverage; One Semantic Owner and Acyclic Composition; Exact Operational Results, Blocks, and Handoffs.<br>
> **Sources:** Go module release workflow; Go command reference; module layout; TypeScript Packaging; Electron Release; canonical Git operation and conventions.

#### Context

Module path, layout, graph, workspace, dependencies, tools, external-consumer validation, and module consumer
compatibility analysis produce the exact facts a release needs. `go-release` owns Go-domain release
classification, release compatibility analysis, the exact version and tag decision, readiness evidence,
action specification, post-action verification of returned results, external-consumer verification, recovery
semantics, and the release result. It builds, translates, and supplies the Git-owned caller-neutral tag/ref
action specification. The manager grants current external or destructive authority. The Git
operation performs only the exact authorized release tag/ref mutation and non-force publication. A named
external-action owner performs each non-Git destination mutation.
The project default build command plus a named target can also produce binaries. Archives, metadata,
checksums, destinations, and recovery add different results and authority.

#### Questions

- Where does local packaging stop?
- Who owns the Go-domain decision and result, who grants authority, and who executes each external effect?

#### Options

- **Separate modules, packaging, release semantics, authority, and effect execution:** modules provide module consumer compatibility analysis without selecting a version or tag; packaging ends with verified local binaries or archives, metadata, checksums, and smoke evidence; `go-release` owns Go-domain release classification, release compatibility analysis, exact version and tag decisions, readiness evidence, action specification, translation into the Git-owned caller-neutral contract, post-action and external-consumer verification, recovery semantics, and the release result; the manager grants current authority; the Git operation performs only the exact authorized release tag/ref mutation and non-force publication from the caller-supplied contract; each named external-action owner performs its non-Git destination mutation; best fit.
- **Combine packaging and release:** fewer handoffs but mixes local writes with external effects.
- **Keep both in modules:** preserves one file but confuses module tags with executable artifacts.

#### Done When

Each artifact has one owner and exact identity; modules never select a version or tag, create a tag, publish,
or own release recovery; no packaging action publishes; and all Git tag/ref or publication mutations and all
non-Git destination mutations remain outside `go-release`. It inherits no manager, Git, credential, network,
publication, or external-mutation authority and coordinates named executors, consumes their returned results,
and verifies them without rebuilding inputs. A binary or archive
release requires packaging evidence. Reopen if evidence shows packaging and publication are one indivisible
result, if either responsibility moves to another durable owner, or if the canonical Git operation cannot
execute the exact authorized tag/ref contract without broader mutation or an invented project-policy input.

Only `go-release` references and calls Git: it builds and supplies the Git-owned caller-neutral specification.
Git does not reference `go-release` or another skill. This one-way direction satisfies Gobbi Rule 4 without
making the eventual Git source reference Gobbi or any outside skill.

The canonical Git operation and conventions form the sole Git executor for this bounded path. They accept the
generic, caller-supplied, caller-neutral action specification plus current manager authority and preserve the exact
tag/ref name, target Git object, repository and remote, required tag form, project signing or annotation rule
when applicable, and exact non-force publication target.
They detect conflicts before mutation, perform only the exact local tag/ref mutation and exact non-force
publication, verify local and remote state, return exact before/after and handoff evidence, and retain a
recoverable partial state on failure. They never force, overwrite a conflict, silently delete a published
tag/ref, rewrite published history, or perform a recovery mutation without separate exact authority. Tag form,
signing or annotation, repository, and remote values remain named project-policy inputs rather than universal
formats.

### Existing Operation Preservation

> **Purpose:** Decide which current Go contracts remain unchanged and which ownership references move.<br>
> **Parent:** `Operation Boundaries and Lifecycle`<br>
> **Depends On:** Diagnostic and Specialized Change Operations; Packaging and Release Separation.<br>
> **Requirements:** Preserve Proven Existing Contracts; One Semantic Owner and Acyclic Composition.<br>
> **Sources:** Current seven Go skills and checklists.

#### Context

The current family contains strong, tested contracts. Expansion should move only policy that now has a clearer
owner and should not erase module consumer, testing, concurrency, convention, design, or toolchain evidence.

#### Questions

- Which current claims are preserved byte-semantically?
- Which release, diagnostic, vulnerability, profiling, or emission claims move to new owners?

#### Options

- **Surgical reconciliation with explicit semantic preservation:** lowest behavior risk; best fit.
- **Rewrite all seven children around the new topology:** uniform prose but high regression risk.
- **Leave all seven untouched:** avoids edits but leaves ownership conflicts and stale routes.

#### Done When

The preserved contracts are named, including authenticated private-module reads in both module modes. Every
moved claim has a new owner, the Git operation and conventions have only the bounded release tag/ref extension,
and no current checklist obligation is lost or duplicated without a decision.

## Language and Handoff Contracts

> **Purpose:** Decide the exact words and terminal records that make every child cold-readable and testable.<br>
> **Parent:** `Root`<br>
> **Depends On:** Operation Boundaries and Lifecycle.<br>
> **Requirements:** Mainstream and Exact Go Vocabulary; Exact Operational Results, Blocks, and Handoffs.<br>
> **Sources:** Official Go toolchain, command, module, testing, diagnostics, and runtime documentation; current Go checklists.

### Context

Terms such as version, command, target, API, result, test seam, and surface can hide distinct facts. A blocked
operation also needs enough context for a downstream owner to resume without repeating diagnosis.

### Questions

- Which exact terms replace the ambiguous forms?
- Which fields must every completion, blocked result, and handoff expose?

### Options

- **Exact mainstream wording at each claim and operation-specific terminal records:** directly testable; best fit.
- **Glossary-backed short forms:** compact but context-dependent and expressly rejected.
- **Flexible prose:** easiest to author but produces inconsistent evidence and checklist judgments.

### Done When

Every ambiguous term has an exact replacement and every operation terminal state maps to checklist conditions.

### Exact Go Vocabulary

> **Purpose:** Decide the required term for each distinct Go fact or record.<br>
> **Parent:** `Language and Handoff Contracts`<br>
> **Depends On:** Existing Operation Preservation.<br>
> **Requirements:** Mainstream and Exact Go Vocabulary.<br>
> **Sources:** Go toolchain, command, module, testing, release policy, and diagnostic documentation.

#### Context

The accepted vocabulary distinguishes support policy, tool selection, module language behavior, executable
commands, public contracts, evidence, and lifecycle exit paths.

#### Questions

- Does every durable claim name the actual version, command, target, object, behavior, or evidence record?
- Can a checklist row distinguish every compatibility or exit state?

#### Options

- **Use the exact accepted vocabulary inline:** clear without a glossary; best fit.
- **Define family-specific shorthand:** shorter but violates mainstream-language and no-glossary decisions.
- **Retain generic terms with examples:** examples cannot remove ambiguity from other claims.

#### Done When

The design mandates: `minimum supported Go version`; `selected Go toolchain version`; `module's Go language
version`; package design identity as the actual package name, import path, package directory or placement,
package boundary, and public API or CLI; `exact package pattern` only for a selector passed to a `go` or project
command; `project command`; `GOOS/GOARCH target`; `project default build command`
plus named target; compatibility decision `compatible`, `migration supplied`, `authorized
break`, or `unsupported`; `project test command`; `observable test boundary` or `controllable dependency`;
`result` or `observable behavior`; exit path `success`, `error`, `cancellation`, `timeout`, or `panic`; an
evidence record that names the project command, exact package pattern, selected Go toolchain version, flags,
`GOOS/GOARCH` target, inputs, duration, and result; explicit module path, `go` directive, dependencies, exact
public package paths, and project commands; and the actual
owned object instead of generic `surface`.

`go-toolchain` alone owns exact package-pattern semantics. Testing, development, packaging, modules, and other
operations record the exact pattern they passed only as project-command selection or evidence.

### Blocked Results and Handoffs

> **Purpose:** Decide the terminal record for completion, deferral, missing evidence, and downstream work.<br>
> **Parent:** `Language and Handoff Contracts`<br>
> **Depends On:** Exact Go Vocabulary; all operation-boundary topics.<br>
> **Requirements:** Exact Operational Results, Blocks, and Handoffs; Atomic and Traceable Evaluation Sources.<br>
> **Sources:** Operation Skill standard; current Go operation exits and checklists; Electron Release.

#### Context

Several current operations say to report a gap, but their reusable checklist does not always trace every
field needed to understand or resume the work.

#### Questions

- Which fields are universal, and which are operation-specific?
- How do checklists prove both a valid completion and an honest blocked result?

#### Options

- **Universal terminal core plus operation-specific fields:** exact and reusable; best fit.
- **One generic prose handoff:** compact but not reliably traceable or binary.
- **Checklist-only fields:** testable but leaves the operation itself incomplete.

#### Done When

Every operation records its mode, accepted result and decisions, exact owned object, terminal state, changed
or reviewed paths when applicable, exact evidence and limits, compatibility decision when applicable,
blocked prerequisite or first useful diagnostic, affected obligation, risk, recovery owner, first recovery
action, and next external authority. Module records also name the private module or import-path scope,
destination, project command, cache/download effect, separately authorized network and credential reads,
redaction and evidence limits, credential/destination owner, retained safe state, and first recovery action.
The bounded Git tag/ref executor returns the exact caller-supplied action specification, authority evidence, tag/ref input
identity, preflight conflict state, local and remote before/after state, verification, partial state, prohibited
or separately authorized recovery boundary, and next handoff. Each child checklist traces every field its
operation can emit.
Development records that credential use and external mutation are both absent, plus any result-dependent
external-action owner, returned evidence, or exact block and handoff. Security records the exact credentialed
read or verification authority and protected handling separately from its forbidden mutation and publication,
plus returned external-owner evidence or its exact block and recovery. Observability change records no
credential use and no external mutation, plus destination-owner evidence or its exact block and handoff;
observability verification records its distinct authorized test-destination effects.

## Evaluation Assurance

> **Purpose:** Decide how each child's complete contract receives independent and composable evaluation coverage.<br>
> **Parent:** `Root`<br>
> **Depends On:** Family Topology and Routing; Operation Boundaries and Lifecycle; Language and Handoff Contracts.<br>
> **Requirements:** Atomic and Traceable Evaluation Sources; Preserve Proven Existing Contracts.<br>
> **Sources:** Evaluation Checklist operation; all current Go checklists.

### Context

The current seven checklists establish a useful sibling-composition rule. The complete topology adds nine
direct owners. The written-form audit proves the former single conventions source needs 72 atomic conditions,
so three owners must preserve those conditions without turning one checklist into a duplicate of another.

### Questions

- Does every child need its own checklist?
- How do all active checklists cover a combined change without repeating semantic owners?

### Options

- **One checklist per child; all active siblings apply:** independent and composable; best fit.
- **One family-wide checklist:** central but not selectively loadable or independently maintainable.
- **Operation checklists only:** smaller but leaves preference and tool judgment untested.

### Done When

Every child owns one source, every active sibling source applies, and checklist overlap remains below the
reopen threshold. The written-form allocation is `GOCNV` 47, `GOSRC` 17, and `GODOC` 8.

### Checklist Ownership and Composition

> **Purpose:** Decide checklist subjects, coverage obligations, and sibling reuse.<br>
> **Parent:** `Evaluation Assurance`<br>
> **Depends On:** Sixteen-Child Ownership Map; Blocked Results and Handoffs.<br>
> **Requirements:** Atomic and Traceable Evaluation Sources; One Semantic Owner and Acyclic Composition.<br>
> **Sources:** Evaluation Checklist operation; current Go checklists.

#### Context

Each checklist must evaluate its child rather than repair sibling policy. Combined work still needs every
active concern's independent conditions.

#### Questions

- Which requirements, decisions, operation exits, risks, and prior failures trace into each source?
- When may one scenario reuse a row owned elsewhere?

#### Options

- **Child-owned sources with stable cross-reference reuse and all active sources applied:** best owner fit.
- **Duplicate shared rows in every source:** self-contained but drifts and inflates overlap.
- **Route missing conditions to another checklist without loading it:** small files but incomplete evaluation.

#### Done When

Each source has all eight perspectives in order, literal applicable scenario classes, stable owner-prefixed IDs,
at most six rows per scenario and fifty-five per source, evidence-based not-applicable reasons, and traceability
for the child lifecycle, blocked results, handoffs, risks, and accepted decisions. The module checklist traces
separately authorized authenticated reads, private scope and destination binding, redacted evidence, credential
non-persistence, no external mutation, and the stop/recovery boundary.
The development author, security change, and observability change checklists each trace credential use and
external mutation as separate binary facts. They also trace the named external-action owner, returned evidence,
or the exact prerequisite, retained state, first recovery action, and handoff. The security source additionally
traces exact read or verification authority, protected scope and destination, ephemeral delivery, redaction,
declared cache state, non-persistence, and forbidden publication. The observability source keeps change-mode
prohibitions separate from authorized test-destination diagnostic-send verification.
The written-form allocation preserves all 52 committed rows, replaces the one compound dot-import row with
two atomic source rows, and adds the 19 independently uncovered states. The generator input row receives only
the wording repair `Every input that determines a generated change has declared ownership`; it does not add a
row. Moved rows receive `GOSRC` or `GODOC` IDs, retired `GOCNV` IDs are not reused, and `Also applies` remains
valid only inside one source.

### Atomicity and Cosmetic Compliance

> **Purpose:** Decide how rows remain independently answerable and catch form-only success.<br>
> **Parent:** `Evaluation Assurance`<br>
> **Depends On:** Checklist Ownership and Composition; Exact Go Vocabulary.<br>
> **Requirements:** Atomic and Traceable Evaluation Sources.<br>
> **Sources:** Evaluation Checklist operation; GOSK-06 examples in Go Development checklist.

#### Context

Rows that join different verbs can pass partly. Conversely, splitting one state across members of a set adds
noise. A source also needs adversarial cases that fail work which matches headings or project command names without
meeting the owned result.

#### Questions

- How does an author decide whether to split or merge a row?
- How does the checklist reject cosmetic compliance without embedding tests or evidence metadata?

#### Options

- **Placeholder and residual-verb test plus representative pass/fail pilots:** exact and resistant to gaming; best fit.
- **Prefer concise compound rows:** fewer lines but hides partial failure.
- **Split every named member:** atomic-looking but duplicates one shared state and breaches caps.

#### Done When

Every row states one binary condition; varying subjects or objects may share a row only when the residual verb
phrase names one required state. Scenarios cover normal, boundary, blocked, poor-quality, rule-violation, and
adversarial cases when material. Superficially compliant but substantively broken work fails at least one row.
For the fixed written-form corpus, `52 - 1 + 2 + 19 = 72`; a single source would exceed the 55-row cap by 17.
The accepted split is `47 + 17 + 8 = 72`. Raising the cap, dropping conditions, or keeping compound rows is
not an admissible repair.

## Dependencies

| Topic | Related Topic | Effect | Resolve When |
|---|---|---|---|
| Family Topology and Routing > Sixteen-Child Ownership Map | Operation Boundaries and Lifecycle | Operation results cannot be assigned before the exact children and types are fixed | Every child has one type and independent result or judgment |
| Family Topology and Routing > Composition and Reopen Tests | Evaluation Assurance | Checklist overlap and ordinary routing load are evidence about the partition | Reopen thresholds are explicit and checkable |
| Family Topology and Routing > Non-goals and External Owners | Operation Boundaries and Lifecycle > Packaging and Release Separation | Deployment, bounded Git tag/ref execution, and publication authority determine where packaging and release stop | Local artifact, Go-domain release, Git executor, and non-Git external-action boundaries are distinct |
| Operation Boundaries and Lifecycle > Development and Design Authority | Operation Boundaries and Lifecycle > Operation Modes and Permitted Effects | Material design gates must run before an author mode makes a design-dependent write | The classifier distinguishes material choices from routine mechanics and stale prior decisions |
| Operation Boundaries and Lifecycle > Operation Modes and Permitted Effects | Evaluation Assurance > Checklist Ownership and Composition | Each operation checklist must trace every supported mode, permitted effect, pause, terminal result, and recovery boundary | All ten operations have complete matrix rows and checklist commitments |
| Operation Boundaries and Lifecycle > Development and Design Authority | Diagnostic and Specialized Change Operations | Specialized code work must compose with general development without duplicating it | Trigger direction and claim ownership are exact |
| Operation Boundaries and Lifecycle > Packaging and Release Separation | Operation Boundaries and Lifecycle > Existing Operation Preservation | The release operation must translate Go-domain decisions into the caller-neutral Git-owned contract without creating a Git-to-release dependency | Only `go-release` references and calls Git; Git accepts a caller-supplied contract and references no outside skill |
| Operation Boundaries and Lifecycle > Packaging and Release Separation | Language and Handoff Contracts > Blocked Results and Handoffs | Artifact identity, Git tag/ref execution, and publication recovery require different handoff fields | Packaging, release, and bounded Git executor terminal records are exact |
| Language and Handoff Contracts > Exact Go Vocabulary | Evaluation Assurance > Atomicity and Cosmetic Compliance | Binary rows need unambiguous facts and states | Every generic term has an accepted exact replacement |
| Language and Handoff Contracts > Blocked Results and Handoffs | Evaluation Assurance > Checklist Ownership and Composition | Every operation exit must trace to reusable conditions | Each emitted field has a checklist owner |

## Coverage

| Concern | Applies | Topic | Basis |
|---|---|---|---|
| Actors | Applicable | Family Topology and Routing; Development and Design Authority; Packaging and Release Separation | Agents, users, consumers, maintainers, evaluators, the manager, the release operation that supplies the caller-neutral Git contract, the Git operation and conventions owner, private-module credential and destination owners, and named external-action owners have distinct authority and results |
| Boundaries and interfaces | Applicable | Sixteen-Child Ownership Map; Packaging and Release Separation | Root routes, child results and judgments, sibling handoffs, artifacts, and external authority are the design's main boundaries |
| State and data | Applicable | Blocked Results and Handoffs | Skill sources, checklist sources, artifact identities, evidence records, and terminal states are durable information; product runtime data is outside this design |
| Resource use | Applicable | Composition and Reopen Tests; Diagnostic and Specialized Change Operations | Selective loading, tool effects, profiles, traces, logs, metrics, crash output, and artifact storage have resource effects |
| Failure and recovery | Applicable | Diagnostic and Specialized Change Operations; Blocked Results and Handoffs; Packaging and Release Separation | Diagnosis gaps, failed checks, release verification, and recovery require explicit terminal paths |
| Trust and governance | Applicable | Development and Design Authority; Operation Modes and Permitted Effects; Non-goals and External Owners; Packaging and Release Separation | Users own material design decisions; the manager grants current external authority; `go-release` alone references Git and supplies its caller-neutral contract; the Git operation references no outside skill and executes only the exact authorized release tag/ref effect; named external-action owners execute their effects; development, security change, and observability change report credential use and external mutation separately and never execute forbidden mutation; private-module authenticated reads separate network and credential authority from forbidden external mutation; security and diagnostic data cross trust boundaries |
| Inclusion and locale | Applicable | Exact Go Vocabulary | Plain mainstream language and cold readability apply; locale-specific program behavior is N/A because the subject is a skill family, not a localized Go product |
| Compatibility and reversal | Applicable | Packaging and Release Separation; Exact Go Vocabulary; Composition and Reopen Tests | Package boundaries and public API or CLI compatibility, module consumer compatibility analysis, release compatibility analysis, release-owned exact version and tag decisions, toolchains, Git and non-Git executor-returned state, recovery semantics, and design reopen conditions are material |
| Evidence, risk, and validation | Applicable | Evaluation Assurance | Every child needs traceable sources, atomic rows, scenario coverage, and anti-cosmetic-compliance checks |
