# Go Modules Evaluation Checklist

Unchecked evaluation source for Go work governed by [Go Modules](SKILL.md). Apply it to the exact work and
returned outcomes under evaluation.

[Evaluation](../../evaluation/SKILL.md) owns evidence, filled results, findings, and verdicts. This source owns
only reusable scenarios and unchecked conditions.

## Project

### GOMOD-SC-PROJECT-01 — Normal case: The module contract is explicit

The work creates, changes, validates, or releases a module. Its durable path, consumers, public packages,
supported Go floor, toolchain policy, platforms, compatibility promise, and release outcome should be clear;
an implicit contract fails.

#### Checklist

- [ ] GOMOD-CK-PROJECT-01-01 — The module path follows its durable publishing location.
- [ ] GOMOD-CK-PROJECT-01-02 — The intended consumers are identified.
- [ ] GOMOD-CK-PROJECT-01-03 — The supported Go floor is identified.
- [ ] GOMOD-CK-PROJECT-01-04 — The release outcome is identified.

### GOMOD-SC-PROJECT-02 — Edge case: The lowest supported Go release constrains the module

The module builds under a newer local release but promises an older Go floor. Syntax, standard-library APIs,
dependencies, and project tools should all support that floor; a directive alone does not establish
compatibility.

#### Checklist

- [ ] GOMOD-CK-PROJECT-02-01 — Source syntax is supported at the declared Go floor.
- [ ] GOMOD-CK-PROJECT-02-02 — Used standard-library APIs exist at the declared Go floor.
- [ ] GOMOD-CK-PROJECT-02-03 — Selected dependencies support the declared Go floor.
- [ ] GOMOD-CK-PROJECT-02-04 — Project tools support the declared Go floor.

### GOMOD-SC-PROJECT-03 — Rule violation: Mode or machine state changes the intended module

Review mode mutates module state, or author mode copies an ambient workspace, replacement, proxy, or local
toolchain value into the contract without project authority. The module should remain derived from the
repository contract; workstation leakage fails.

#### Checklist

- [ ] GOMOD-CK-PROJECT-03-01 — Review mode leaves module files unchanged.
- [ ] GOMOD-CK-PROJECT-03-02 — Review mode leaves workspace files unchanged.
- [ ] GOMOD-CK-PROJECT-03-03 — No ambient local replacement becomes module policy.
- [ ] GOMOD-CK-PROJECT-03-04 — No ambient workspace entry becomes module policy.

## Structure

### GOMOD-SC-STRUCTURE-01 — Normal case: The layout follows package responsibility

The module contains libraries, commands, or internal implementation. Directories should reflect real public
import paths, command ownership, and enforced privacy boundaries; a universal scaffold fails.

#### Checklist

- [ ] GOMOD-CK-STRUCTURE-01-01 — Every package directory has one clear responsibility.
- [ ] GOMOD-CK-STRUCTURE-01-02 — Every `internal` directory expresses an intended import boundary.
- [ ] GOMOD-CK-STRUCTURE-01-03 — Every `cmd` directory represents a distinct command.

### GOMOD-SC-STRUCTURE-02 — Poor quality: A nested module or layer directory lacks ownership

The tree introduces `pkg`, `src`, `util`, a layer directory, or a nested module by convention alone. Every
extra boundary should serve current consumption, versioning, or release needs; decorative structure fails.

#### Checklist

- [ ] GOMOD-CK-STRUCTURE-02-01 — Every generic layer directory has a current ownership purpose.
- [ ] GOMOD-CK-STRUCTURE-02-02 — Every nested module is independently consumed.
- [ ] GOMOD-CK-STRUCTURE-02-03 — Every nested module is independently versioned.
- [ ] GOMOD-CK-STRUCTURE-02-04 — Every nested module is independently released.

### GOMOD-SC-STRUCTURE-03 — Edge case: Public, internal, and command packages share behavior

Reusable logic is needed by a command and another consumer while some implementation remains private. The
layout should keep libraries importable, command orchestration thin, and privacy enforced; duplicated or
unimportable behavior fails.

#### Checklist

- [ ] GOMOD-CK-STRUCTURE-03-01 — Reusable behavior resides in an importable package.
- [ ] GOMOD-CK-STRUCTURE-03-02 — Command packages contain only command-owned orchestration.
- [ ] GOMOD-CK-STRUCTURE-03-03 — Private implementation remains behind an enforced import boundary.

## Performance

### GOMOD-SC-PERFORMANCE-01 — Poor quality: A dependency adds disproportionate graph cost

A new or upgraded dependency works functionally but adds substantial transitive modules, build time, binary
size, platform burden, or download cost without enough benefit. Dependency cost should be deliberate.

#### Checklist

- [ ] GOMOD-CK-PERFORMANCE-01-01 — Every direct dependency has a current API-fit benefit.
- [ ] GOMOD-CK-PERFORMANCE-01-02 — Every material transitive graph increase is justified.
- [ ] GOMOD-CK-PERFORMANCE-01-03 — Every material build-cost increase is justified.
- [ ] GOMOD-CK-PERFORMANCE-01-04 — Every material binary-cost increase is justified.

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

- [ ] GOMOD-CK-AESTHETICS-01-01 — Every direct dependency has a visible project purpose.
- [ ] GOMOD-CK-AESTHETICS-01-02 — Every module directive has a visible contract purpose.
- [ ] GOMOD-CK-AESTHETICS-01-03 — Every workspace entry has a visible development purpose.

### GOMOD-SC-AESTHETICS-02 — Poor quality: Indirect changes and replacements obscure the graph

The files parse, but large unexplained indirect shifts or cluttered replacements make the accepted graph hard
to review. Mechanical graph state should still communicate the intentional change.

#### Checklist

- [ ] GOMOD-CK-AESTHETICS-02-01 — Every unexpected indirect dependency change is explained by the intended graph.
- [ ] GOMOD-CK-AESTHETICS-02-02 — Every retained replacement is part of the accepted contract.
- [ ] GOMOD-CK-AESTHETICS-02-03 — No obsolete graph control remains.

## Usage

### GOMOD-SC-USAGE-01 — Normal case: An external consumer can use the module

An intended consumer imports an exported package or installs a command outside the source directory. The
module path, package paths, public API, required assets, and Go floor should support that position; tests only
from inside the module are insufficient.

#### Checklist

- [ ] GOMOD-CK-USAGE-01-01 — An external consumer can resolve the module path.
- [ ] GOMOD-CK-USAGE-01-02 — An external consumer can import each promised public package.
- [ ] GOMOD-CK-USAGE-01-03 — An installable command works outside its source directory.

### GOMOD-SC-USAGE-02 — Edge case: Version 2 or later uses semantic import versioning

A module prepares or uses major version 2 or later. The `/vN` module path, imports, `go.mod`, documentation,
and `vN.x.y` tag should agree under the applicable module rule; partial suffixing fails.

#### Checklist

- [ ] GOMOD-CK-USAGE-02-01 — The major-version module path is correct.
- [ ] GOMOD-CK-USAGE-02-02 — Public imports use the same major-version path.
- [ ] GOMOD-CK-USAGE-02-03 — Consumer documentation uses the same major-version path.
- [ ] GOMOD-CK-USAGE-02-04 — The proposed tag uses the same major version.

### GOMOD-SC-USAGE-03 — Expected failure: The module fails outside its development workspace

The project succeeds only because `go.work`, a local replacement, or an unpublished sibling module supplies
state absent from the released contract. Verification with the workspace disabled should expose the gap;
workspace-only success fails.

#### Checklist

- [ ] GOMOD-CK-USAGE-03-01 — The module resolves with development workspace assumptions disabled.
- [ ] GOMOD-CK-USAGE-03-02 — Every required sibling module is available to the intended consumer.
- [ ] GOMOD-CK-USAGE-03-03 — No local replacement is required by the intended consumer.

## Consistency

### GOMOD-SC-CONSISTENCY-01 — Rule violation: Module and workspace files describe different graphs

`go.mod`, `go.sum`, `go.work`, vendor state, or tool declarations disagree about the accepted dependency set.
Each source-controlled graph surface should express one intentional contract; local resolution luck fails.

#### Checklist

- [ ] GOMOD-CK-CONSISTENCY-01-01 — `go.mod` declares the accepted direct module graph.
- [ ] GOMOD-CK-CONSISTENCY-01-02 — `go.sum` corresponds to the accepted module graph.
- [ ] GOMOD-CK-CONSISTENCY-01-03 — `go.work` contains only accepted workspace state.
- [ ] GOMOD-CK-CONSISTENCY-01-04 — Vendor state corresponds to the accepted graph when vendoring applies.

### GOMOD-SC-CONSISTENCY-02 — Rule violation: Path, imports, documentation, and tag disagree

A module or major version changes while one consumer-facing reference remains stale. All path-bearing surfaces
should resolve to one published identity; any mixed identity fails.

#### Checklist

- [ ] GOMOD-CK-CONSISTENCY-02-01 — The module path matches every public import path.
- [ ] GOMOD-CK-CONSISTENCY-02-02 — The module path matches consumer documentation.
- [ ] GOMOD-CK-CONSISTENCY-02-03 — The module path matches the proposed release tag.

### GOMOD-SC-CONSISTENCY-03 — Edge case: Tidy changes more than the requested dependency

After source and constraints settle, `go mod tidy` adds or removes direct, indirect, checksum, or Go-version
state beyond the intended edit. Every change should follow the accepted source graph; unexplained tidy output
fails.

#### Checklist

- [ ] GOMOD-CK-CONSISTENCY-03-01 — Every added module is reachable from the intended source graph.
- [ ] GOMOD-CK-CONSISTENCY-03-02 — Every removed module is unreachable from the intended source graph.
- [ ] GOMOD-CK-CONSISTENCY-03-03 — Every directive change is justified independently of tidy execution.

### GOMOD-SC-CONSISTENCY-04 — Normal case: Release contents match the module contract

The release tree should include every file consumers need and exclude temporary development state. Missing
licenses, documentation, generated files, embedded assets, or cgo inputs make the module inconsistent.

#### Checklist

- [ ] GOMOD-CK-CONSISTENCY-04-01 — Required license files are present.
- [ ] GOMOD-CK-CONSISTENCY-04-02 — Required generated files are present.
- [ ] GOMOD-CK-CONSISTENCY-04-03 — Required embedded assets are present.
- [ ] GOMOD-CK-CONSISTENCY-04-04 — Required cgo assets are present.
- [ ] GOMOD-CK-CONSISTENCY-04-05 — Temporary development files are absent.

### GOMOD-SC-CONSISTENCY-05 — Normal case: Every graph control is deliberate

Replacements, retractions, exclusions, workspace entries, vendoring, and tool dependencies can change
resolution or maintenance behavior. Each retained control should have one current project purpose; ambient or
obsolete state fails.

#### Checklist

- [ ] GOMOD-CK-CONSISTENCY-05-01 — Every retained replacement has a current project purpose.
- [ ] GOMOD-CK-CONSISTENCY-05-02 — Every retained retraction has a current project purpose.
- [ ] GOMOD-CK-CONSISTENCY-05-03 — Every retained exclusion has a current project purpose.
- [ ] GOMOD-CK-CONSISTENCY-05-04 — Every workspace entry has a current project purpose.
- [ ] GOMOD-CK-CONSISTENCY-05-05 — The vendor choice has a current project purpose.
- [ ] GOMOD-CK-CONSISTENCY-05-06 — Every tool dependency has a current project purpose.

## Risk

### GOMOD-SC-RISK-01 — Adversarial: Module state exposes private or credential-bearing data

A module, workspace, checksum, log, or release artifact contains workstation paths, private module names,
credential-bearing proxy URLs, or tokens. Published state should preserve the intended privacy boundary;
accidental disclosure fails.

#### Checklist

- [ ] GOMOD-CK-RISK-01-01 — No published file contains a credential value.
- [ ] GOMOD-CK-RISK-01-02 — No published file contains a workstation-local path.
- [ ] GOMOD-CK-RISK-01-03 — No published file exposes an unintended private module name.

### GOMOD-SC-RISK-02 — Adversarial: A dependency appears useful but violates trust obligations

A new or upgraded dependency has questionable provenance, maintenance, license, vulnerability, platform, or
transitive behavior. Functional API fit alone should not authorize the graph addition.

#### Checklist

- [ ] GOMOD-CK-RISK-02-01 — Every new dependency has acceptable provenance.
- [ ] GOMOD-CK-RISK-02-02 — Every new dependency has an acceptable license.
- [ ] GOMOD-CK-RISK-02-03 — Every new dependency has an acceptable known-vulnerability position.
- [ ] GOMOD-CK-RISK-02-04 — Every new dependency supports the promised platforms.

### GOMOD-SC-RISK-03 — Rule violation: Temporary graph state enters a release

A local `replace`, development workspace module, or unavailable generated input remains necessary when the
module is tagged. The released graph and contents should stand alone; publishing temporary state fails.

#### Checklist

- [ ] GOMOD-CK-RISK-03-01 — No temporary local replacement remains in the release graph.
- [ ] GOMOD-CK-RISK-03-02 — No unpublished workspace module remains required by the release graph.
- [ ] GOMOD-CK-RISK-03-03 — Every required generated artifact is present in release contents.

### GOMOD-SC-RISK-04 — Rule violation: A release side effect exceeds authority

The work chooses or validates a version but then creates a remote tag or publishes without explicit external
authority. Release preparation should stop at the authorized boundary; an otherwise correct unauthorized
publication fails.

#### Checklist

- [ ] GOMOD-CK-RISK-04-01 — Every remote tag creation has explicit authority.
- [ ] GOMOD-CK-RISK-04-02 — Every module publication has explicit authority.

### GOMOD-SC-RISK-05 — Expected failure: Consumer or Go-floor validation fails

An external consumer, supported platform, or declared Go floor cannot build or use the proposed module. The
release should remain blocked until the contract or implementation changes; another environment's pass does
not close the failure.

#### Checklist

- [ ] GOMOD-CK-RISK-05-01 — Every failing promised consumer remains visible.
- [ ] GOMOD-CK-RISK-05-02 — Every failing promised platform remains visible.
- [ ] GOMOD-CK-RISK-05-03 — Every failing declared Go floor remains visible.
- [ ] GOMOD-CK-RISK-05-04 — Release readiness is not claimed across a promised-surface failure.

## Overall

### GOMOD-SC-OVERALL-01 — Normal case: The module is coherent and releasable

The complete work should align path, packages, Go floor, dependencies, tools, workspace boundary,
compatibility, consumer behavior, release contents, version, and authority. Any hidden development-only
assumption fails the whole.

#### Checklist

- [ ] GOMOD-CK-OVERALL-01-01 — The complete module contract is reproducible outside the development workspace.
- [ ] GOMOD-CK-OVERALL-01-02 — The complete module contract serves the intended consumers.
- [ ] GOMOD-CK-OVERALL-01-03 — The proposed release matches the classified compatibility change.

### GOMOD-SC-OVERALL-02 — Adversarial: Tidy and internal tests mask a broken consumer contract

Module files are tidy and project tests pass, but an external consumer cannot resolve an import, use the Go
floor, obtain an asset, or follow the major-version path. Mechanical project success must not substitute for
consumer validation.

#### Checklist

- [ ] GOMOD-CK-OVERALL-02-01 — Acceptance is not based solely on tidy module files.
- [ ] GOMOD-CK-OVERALL-02-02 — Acceptance is not based solely on tests run inside the module.
- [ ] GOMOD-CK-OVERALL-02-03 — Every promised external consumer path remains usable.

### GOMOD-SC-OVERALL-03 — Edge case: A released compatibility defect needs reversal

A prepared or existing release exposes a compatibility, graph, or content defect. The module position should
account for a compatible repair, retraction, or other authorized recovery without rewriting published history.

#### Checklist

- [ ] GOMOD-CK-OVERALL-03-01 — The recovery preserves published module history.
- [ ] GOMOD-CK-OVERALL-03-02 — The recovery communicates the affected version to consumers.
- [ ] GOMOD-CK-OVERALL-03-03 — The recovery path matches the project's release authority.
