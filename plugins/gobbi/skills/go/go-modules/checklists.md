# Go Modules Evaluation Checklist

Unchecked evaluation source for Go work governed by [Go Modules](SKILL.md). Apply it to the exact work and
returned outcomes under evaluation.

[Evaluation](../../evaluation/SKILL.md) owns evidence, filled results, findings, and verdicts. This source owns
only reusable scenarios and unchecked conditions.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### GOMOD-SC-PROJECT-01 — Normal case: The module contract is explicit

The work creates, changes, validates, or releases a module. Its durable path, consumers, public packages,
supported Go floor, toolchain policy, platforms, compatibility promise, and release outcome should be clear;
an implicit contract fails.

#### Checklist

- [ ] GOMOD-CK-PROJECT-01-01 — The module path follows its durable publishing location.
- [ ] GOMOD-CK-PROJECT-01-02 — The intended consumers, public packages, supported Go floor, toolchain policy, platforms, compatibility promise, and release outcome are each identified.

### GOMOD-SC-PROJECT-02 — Edge case: The lowest supported Go release constrains the module

The module builds under a newer local release but promises an older Go floor. Syntax, standard-library APIs,
dependencies, and project tools should all support that floor; a directive alone does not establish
compatibility.

#### Checklist

- [ ] GOMOD-CK-PROJECT-02-01 — Source syntax, used standard-library APIs, selected dependencies, and project tools each support the declared Go floor.

### GOMOD-SC-PROJECT-03 — Rule violation: Mode or machine state changes the intended module

Review mode mutates module state, or author mode copies an ambient workspace, replacement, proxy, or local
toolchain value into the contract without project authority. The module should remain derived from the
repository contract; workstation leakage fails.

#### Checklist

- [ ] GOMOD-CK-PROJECT-03-01 — Review mode leaves module and workspace files unchanged.
- [ ] GOMOD-CK-PROJECT-03-02 — No ambient local replacement, workspace entry, proxy value, or local toolchain value becomes module policy.

## Structure

### GOMOD-SC-STRUCTURE-01 — Normal case: The layout follows package responsibility

The module contains libraries, commands, or internal implementation. Directories should reflect real public
import paths, command ownership, and enforced privacy boundaries; a universal scaffold fails.

#### Checklist

- [ ] GOMOD-CK-STRUCTURE-01-01 — Every package, `internal`, and `cmd` directory has one current ownership purpose.

### GOMOD-SC-STRUCTURE-02 — Poor quality: A nested module or layer directory lacks ownership

The tree introduces `pkg`, `src`, `util`, a layer directory, or a nested module by convention alone. Every
extra boundary should serve current consumption, versioning, or release needs; decorative structure fails.

#### Checklist

- [ ] GOMOD-CK-STRUCTURE-02-01 — Every generic layer directory has a current ownership purpose.
- [ ] GOMOD-CK-STRUCTURE-02-02 — Every nested module is an independently consumed, versioned, and released unit.

### GOMOD-SC-STRUCTURE-03 — Edge case: Public, internal, and command packages share behavior

Reusable logic is needed by a command and another consumer while some implementation remains private. The
layout should keep libraries importable, command orchestration thin, and privacy enforced; duplicated or
unimportable behavior fails.

#### Checklist

- [ ] GOMOD-CK-STRUCTURE-03-01 — Reusable behavior, command orchestration, and private implementation each reside in the package layer that owns them.

## Performance

### GOMOD-SC-PERFORMANCE-01 — Poor quality: A dependency adds disproportionate graph cost

A new or upgraded dependency works functionally but adds substantial transitive modules, build time, binary
size, platform burden, or download cost without enough benefit. Dependency cost should be deliberate.

#### Checklist

- [ ] GOMOD-CK-PERFORMANCE-01-01 — Every direct dependency has a current API-fit benefit.
- [ ] GOMOD-CK-PERFORMANCE-01-02 — Every material transitive-graph, build-time, binary-size, platform, and download cost increase is justified.

### GOMOD-SC-PERFORMANCE-02 — Edge case: Workspace or graph resolution multiplies work

A multi-module workspace, replacement chain, vendor state, or tool dependency causes repeated resolution or
toolchain downloads across modules. The graph should remain reproducible and proportionate; hidden repeated
cost fails.

#### Checklist

- [ ] GOMOD-CK-PERFORMANCE-02-01 — Each affected module resolves one deliberate dependency graph.
- [ ] GOMOD-CK-PERFORMANCE-02-02 — Workspace synchronization does not create unexplained repeated downloads.
- [ ] GOMOD-CK-PERFORMANCE-02-03 — Tool dependencies do not enter runtime dependency cost unintentionally.

## Aesthetics

### GOMOD-SC-AESTHETICS-01 — Normal case: Module intent is reviewable from source-controlled state

A reviewer should understand the module path, directives, direct dependencies, tools, workspace entries, and
release intent without private workstation context. Opaque graph changes fail.

#### Checklist

- [ ] GOMOD-CK-AESTHETICS-01-01 — Every direct dependency, module directive, tool declaration, and workspace entry has a visible stated purpose.

### GOMOD-SC-AESTHETICS-02 — Poor quality: Indirect changes and replacements obscure the graph

The files parse, but large unexplained indirect shifts or cluttered replacements make the accepted graph hard
to review. Mechanical graph state should still communicate the intentional change.

#### Checklist

- [ ] GOMOD-CK-AESTHETICS-02-01 — Every unexpected indirect dependency change is explained by the intended graph.
- Also applies: GOMOD-CK-CONSISTENCY-05-01 (every retained graph control has a current purpose).

## Usage

### GOMOD-SC-USAGE-01 — Normal case: An external consumer can use the module

An intended consumer imports an exported package or installs a command outside the source directory. The
module path, package paths, public API, required assets, and Go floor should support that position; tests only
from inside the module are insufficient.

#### Checklist

- [ ] GOMOD-CK-USAGE-01-01 — An external consumer can resolve the module path outside its source directory.
- [ ] GOMOD-CK-USAGE-01-02 — An external consumer can import each promised public package outside its source directory.
- [ ] GOMOD-CK-USAGE-01-03 — An external consumer can run each installable command outside its source directory.

### GOMOD-SC-USAGE-02 — Edge case: Version 2 or later uses semantic import versioning

A module prepares or uses major version 2 or later. The `/vN` module path, imports, `go.mod`, documentation,
and `vN.x.y` tag should agree under the applicable module rule; partial suffixing fails.

#### Checklist

- [ ] GOMOD-CK-USAGE-02-01 — The `/vN` path form follows the applicable module rule for the declared major version.
- Also applies: GOMOD-CK-CONSISTENCY-02-01 (every path-bearing surface matches the module path).

### GOMOD-SC-USAGE-03 — Expected failure: The module fails outside its development workspace

The project succeeds only because `go.work`, a local replacement, or an unpublished sibling module supplies
state absent from the released contract. Verification with the workspace disabled should expose the gap;
workspace-only success fails.

#### Checklist

- [ ] GOMOD-CK-USAGE-03-01 — The module resolves with development workspace assumptions disabled.
- [ ] GOMOD-CK-USAGE-03-02 — No unpublished sibling module or local replacement is required by the intended consumer.

### GOMOD-SC-USAGE-04 — Adversarial: The consumer instructions only work for the maintainer

The published import, install, or upgrade instructions are validated in an environment that already holds the
module cache, credentials, workspace, or private proxy access. A consumer following the instructions from a
clean environment should reach the same result; instructions that pass only under maintainer state fail.

#### Checklist

- [ ] GOMOD-CK-USAGE-04-01 — Every documented import, install, and upgrade instruction is validated from a clean consumer environment.
- [ ] GOMOD-CK-USAGE-04-02 — No documented consumer instruction depends on maintainer-only cache, credential, or private-access state.

## Consistency

### GOMOD-SC-CONSISTENCY-01 — Rule violation: Module and workspace files describe different graphs

`go.mod`, `go.sum`, `go.work`, vendor state, or tool declarations disagree about the accepted dependency set.
Each source-controlled graph surface should express one intentional contract; local resolution luck fails.

#### Checklist

- [ ] GOMOD-CK-CONSISTENCY-01-01 — `go.mod`, `go.sum`, `go.work`, applicable vendor state, and tool declarations each express the accepted module graph.

### GOMOD-SC-CONSISTENCY-02 — Rule violation: Path, imports, documentation, and tag disagree

A module or major version changes while one consumer-facing reference remains stale. All path-bearing surfaces
should resolve to one published identity; any mixed identity fails.

#### Checklist

- [ ] GOMOD-CK-CONSISTENCY-02-01 — The module path matches every public import path, consumer document, and proposed release tag.

### GOMOD-SC-CONSISTENCY-03 — Edge case: Tidy changes more than the requested dependency

After source and constraints settle, `go mod tidy` adds or removes direct, indirect, checksum, or Go-version
state beyond the intended edit. Every change should follow the accepted source graph; unexplained tidy output
fails.

#### Checklist

- [ ] GOMOD-CK-CONSISTENCY-03-01 — Every module that tidy added or removed follows the intended source graph.
- [ ] GOMOD-CK-CONSISTENCY-03-02 — Every directive change is justified independently of tidy execution.

### GOMOD-SC-CONSISTENCY-04 — Normal case: Release contents match the module contract

The release tree should include every file consumers need and exclude temporary development state. Missing
licenses, documentation, generated files, embedded assets, or cgo inputs make the module inconsistent.

#### Checklist

- [ ] GOMOD-CK-CONSISTENCY-04-01 — Required license, documentation, generated, embedded-asset, and cgo-asset files are present in release contents.
- [ ] GOMOD-CK-CONSISTENCY-04-02 — Temporary development files are absent from release contents.

### GOMOD-SC-CONSISTENCY-05 — Normal case: Every graph control is deliberate

Replacements, retractions, exclusions, workspace entries, vendoring, and tool dependencies can change
resolution or maintenance behavior. Each retained control should have one current project purpose; ambient or
obsolete state fails.

#### Checklist

- [ ] GOMOD-CK-CONSISTENCY-05-01 — Every retained replacement, retraction, exclusion, workspace entry, vendor choice, and tool dependency has a current project purpose.

## Risk

### GOMOD-SC-RISK-01 — Rule violation: Module state exposes private or credential-bearing data

A module, workspace, checksum, log, or release artifact contains workstation paths, private module names,
credential-bearing proxy URLs, or tokens. Published state should preserve the intended privacy boundary;
accidental disclosure fails.

#### Checklist

- [ ] GOMOD-CK-RISK-01-01 — No published module file, checksum file, log, or release artifact carries a credential, credential-bearing proxy URL, workstation-local path, or unintended private module name.

### GOMOD-SC-RISK-02 — Adversarial: A dependency appears useful but violates trust obligations

A new or upgraded dependency has questionable provenance, maintenance, license, vulnerability, platform, or
transitive behavior. Functional API fit alone should not authorize the graph addition.

#### Checklist

- [ ] GOMOD-CK-RISK-02-01 — Every new or upgraded dependency has an acceptable provenance, maintenance, license, known-vulnerability, platform-support, and transitive position.

### GOMOD-SC-RISK-03 — Rule violation: Temporary graph state enters a release

A local `replace`, development workspace module, or unavailable generated input remains necessary when the
module is tagged. The released graph and contents should stand alone; publishing temporary state fails.

#### Checklist

- [ ] GOMOD-CK-RISK-03-01 — No temporary local replacement or unpublished workspace module remains required by the release graph.
- Also applies: GOMOD-CK-CONSISTENCY-04-01 (required generated artifacts present in release contents).

### GOMOD-SC-RISK-04 — Rule violation: A release side effect exceeds authority

The work chooses or validates a version but then creates a remote tag or publishes without explicit external
authority. Release preparation should stop at the authorized boundary; an otherwise correct unauthorized
publication fails.

#### Checklist

- [ ] GOMOD-CK-RISK-04-01 — Every remote tag creation and module publication has explicit external authority.

### GOMOD-SC-RISK-05 — Expected failure: Consumer or Go-floor validation fails

An external consumer, supported platform, or declared Go floor cannot build or use the proposed module. The
release should remain blocked until the contract or implementation changes; another environment's pass does
not close the failure.

#### Checklist

- [ ] GOMOD-CK-RISK-05-01 — Every failing promised consumer, platform, and declared Go floor remains visible.
- [ ] GOMOD-CK-RISK-05-02 — Release readiness is not claimed across a promised-surface failure.

### GOMOD-SC-RISK-06 — Normal case: An ordinary graph change keeps its verification intact

An accepted dependency change downloads modules through the project's proxy, checksum, and private-module
settings. The ordinary success path should leave every selected module verified against its recorded checksum
and leave those settings as the project defines them; resolving by relaxing verification fails.

#### Checklist

- [ ] GOMOD-CK-RISK-06-01 — Every module in the accepted graph has its recorded checksum entry.
- [ ] GOMOD-CK-RISK-06-02 — No checksum, proxy, or private-module setting is relaxed to make the change resolve.

## Overall

### GOMOD-SC-OVERALL-01 — Normal case: The module is coherent and releasable

The complete work should align path, packages, Go floor, dependencies, tools, workspace boundary,
compatibility, consumer behavior, release contents, version, and authority. Any hidden development-only
assumption fails the whole.

#### Checklist

- [ ] GOMOD-CK-OVERALL-01-01 — The complete module contract serves the intended consumers.
- [ ] GOMOD-CK-OVERALL-01-02 — The proposed release matches the classified compatibility change.
- Also applies: GOMOD-CK-USAGE-03-01 (reproducible outside the development workspace).

### GOMOD-SC-OVERALL-02 — Adversarial: Tidy and internal tests mask a broken consumer contract

Module files are tidy and project tests pass, but an external consumer cannot resolve an import, use the Go
floor, obtain an asset, or follow the major-version path. Mechanical project success must not substitute for
consumer validation.

#### Checklist

- [ ] GOMOD-CK-OVERALL-02-01 — Acceptance is not based solely on tidy module files or on tests run inside the module.
- Also applies: GOMOD-CK-USAGE-01-01 (the module path resolves for an external consumer).
- Also applies: GOMOD-CK-USAGE-01-02 (every promised public package imports for an external consumer).
- Also applies: GOMOD-CK-USAGE-01-03 (every installable command runs for an external consumer).

### GOMOD-SC-OVERALL-03 — Edge case: A released compatibility defect needs reversal

A prepared or existing release exposes a compatibility, graph, or content defect. The module position should
account for a compatible repair, retraction, or other authorized recovery without rewriting published history.

#### Checklist

- [ ] GOMOD-CK-OVERALL-03-01 — The recovery preserves published module history.
- [ ] GOMOD-CK-OVERALL-03-02 — The recovery communicates the affected version to consumers.
- [ ] GOMOD-CK-OVERALL-03-03 — The recovery path matches the project's release authority.
