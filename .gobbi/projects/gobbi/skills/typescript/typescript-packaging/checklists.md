# TypeScript Packaging Evaluation Checklist

This reusable unchecked source evaluates one package definition produced or validated under this operation. It
is governed by the [`typescript`](../SKILL.md) domain and [`typescript-packaging`](SKILL.md) operation, with
[`typescript-toolchain`](../typescript-toolchain/SKILL.md) defining the build and resolution pipeline and
[`typescript-testing`](../typescript-testing/SKILL.md) defining the consumer and declaration checks it runs.
The source commit that contains this file identifies the checklist version. Its stable checklist prefix is
`TSPKG`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its defining scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### TSPKG-SC-PROJECT-01 — Normal case: the package requirements are defined before anything is built

Package definition starts from consumers, not from build output. The expected outcome fixes the mode, the supported
consumer environments, the public entry points, the compatibility statements, and publication authority. A build
begun before those are recorded is the failure.

#### Checklist

- [ ] TSPKG-CK-PROJECT-01-01 — The task is classified as authorized author mode or review-only validation before later steps are planned.
- [ ] TSPKG-CK-PROJECT-01-02 — Applicable package kinds, supported runtimes, module loaders, resolution modes, TypeScript versions, import forms, command names, operating systems, and CPU architectures are recorded.
- [ ] TSPKG-CK-PROJECT-01-03 — Every public entry point is listed with whether it provides runtime code, types only, or both.
- [ ] TSPKG-CK-PROJECT-01-04 — Compatibility statements, publication authority, and out-of-scope consumers are identified.

### TSPKG-SC-PROJECT-02 — Rule violation: review-only validation changes the subject

A validation run has no authority to write, and building or installing "just to check" quietly turns it into
author mode. The expected outcome inspects existing generated output, collects only disposable command results
outside the reviewed files, and closes with findings. Any write inside the review-only classification exceeds its authority.

#### Checklist

- [ ] TSPKG-CK-PROJECT-02-01 — Under review-only validation, no reviewed file is edited.
- [ ] TSPKG-CK-PROJECT-02-02 — Under review-only validation, no package output is built or created.
- [ ] TSPKG-CK-PROJECT-02-03 — Under review-only validation, nothing is installed into a persistent environment.
- [ ] TSPKG-CK-PROJECT-02-04 — Under review-only validation, no documentation or release note is updated.
- [ ] TSPKG-CK-PROJECT-02-05 — Under review-only validation, nothing is published.

### TSPKG-SC-PROJECT-03 — Normal case: a review-only run closes on inspection results alone

A review-only run reaches the end of its inspection with no authority to change anything. The expected
outcome passes over every mutation step and returns command results, findings, and limitations. A run that performs
a mutation step, or that ends without returning what it found, is the failure.

#### Checklist

- [ ] TSPKG-CK-PROJECT-03-02 — A review-only run finishes with command results, findings, and limitations.
- Also applies: TSPKG-CK-PROJECT-02-01 (reviewed files remain unchanged).
- Also applies: TSPKG-CK-PROJECT-02-02 (package output is not built).
- Also applies: TSPKG-CK-PROJECT-02-03 (nothing is installed persistently).
- Also applies: TSPKG-CK-PROJECT-02-04 (documents remain unchanged).
- Also applies: TSPKG-CK-PROJECT-02-05 (nothing is published).

## Structure

### TSPKG-SC-STRUCTURE-01 — Normal case: every entry point resolves to real files

An export map states that a condition leads to a runtime file and a declaration file that exist. The
expected outcome defines each entry point completely and maps each condition to built output inside the
package. A condition pointing at a missing, external, or source-only path is the failure.

#### Checklist

- [ ] TSPKG-CK-STRUCTURE-01-01 — Every public entry point defines its runtime file, declaration file, module condition, and supported consumer environment.
- [ ] TSPKG-CK-STRUCTURE-01-02 — Every export condition maps to an existing built runtime file and declaration file.
- [ ] TSPKG-CK-STRUCTURE-01-03 — Declarations are decided as emitted, bundled, or maintained.
- [ ] TSPKG-CK-STRUCTURE-01-04 — One exact compiler file produces or validates the declarations.
- [ ] TSPKG-CK-STRUCTURE-01-05 — Every metadata path resolves inside the package.

### TSPKG-SC-STRUCTURE-02 — Rule violation: an internal path becomes reachable

A broad file set, a wildcard export, a leaked declaration, or a source-only path can hand consumers a module
the package never meant to support. The expected outcome keeps internal modules unreachable and declares every
intentional subpath. An accidental reachable path breaks the Rule even when nothing imports it yet.

#### Checklist

- [ ] TSPKG-CK-STRUCTURE-02-01 — No internal path is exposed through a broad file set, a wildcard export, a declaration leak, or a source-only path.
- [ ] TSPKG-CK-STRUCTURE-02-02 — Every module reachable by consumers is an intentional public entry point or subpath.

### TSPKG-SC-STRUCTURE-03 — Normal case: every installed command maps to an executable built file

An npm `bin` entry can name a missing source file, lose its shebang during compilation, or arrive without the
permission needed for direct execution. The expected outcome maps every command name to an existing built file
inside the archive and verifies its executable form before publication.

#### Checklist

- [ ] TSPKG-CK-STRUCTURE-03-01 — Every package-defined command name maps through `bin` to an existing built file inside the package archive.
- [ ] TSPKG-CK-STRUCTURE-03-02 — Every built command file begins with the shebang required by its supported runtime.
- [ ] TSPKG-CK-STRUCTURE-03-03 — Every archived command file has executable permissions on supported systems that require them.
- [ ] TSPKG-CK-STRUCTURE-03-04 — `engines`, `os`, and `cpu` produce the warning, acceptance, or rejection behavior stated by the support and package-manager policy.

### TSPKG-SC-STRUCTURE-04 — Normal case: dependency and declaration-routing fields match consumer needs

Dependency fields decide what is required, optional, supplied by a consumer, used only for authoring, or
bundled into the archive. Declaration routing also depends on which package field the compiler's resolution
mode reads. The expected outcome matches each field to installed behavior and exercises the selected route.

#### Checklist

- [ ] TSPKG-CK-STRUCTURE-04-01 — Each package's dependency declaration and any `bundleDependencies` membership match whether it is required, optional, consumer-supplied, authoring-only, or also packed into the archive.
- [ ] TSPKG-CK-STRUCTURE-04-02 — Every optional dependency and optional peer is exercised both present and absent.
- [ ] TSPKG-CK-STRUCTURE-04-03 — Every claimed TypeScript-version declaration route resolves from an isolated installed consumer through the package field read by that compiler version and resolution mode.

## Performance

### TSPKG-SC-PERFORMANCE-01 — Edge case: the package ships more than one copy of itself

Dual formats, duplicated bundles, or several entry points can load the same module twice, so shared state
diverges and the archive carries the cost twice. The expected outcome tests identity and shared state across
entry points and accounts for what the archive weighs. Divergent state or unexplained growth is the failure.

#### Checklist

- [ ] TSPKG-CK-PERFORMANCE-01-01 — Singleton identity and shared state are tested across multiple entry points wherever dual formats or duplicated bundles are possible.
- [ ] TSPKG-CK-PERFORMANCE-01-02 — The archive inventory is inspected for unexpected size changes.

## Aesthetics

### TSPKG-SC-AESTHETICS-01 — Poor quality: declarations compile but do not read as a public API

The emitted declarations type-check while exposing internal paths, globals unavailable in supported runtimes,
and widened or compiler-invented names that consumers must decode. The expected outcome treats public
declarations as authored output and inspects them before publication.

#### Checklist

- [ ] TSPKG-CK-AESTHETICS-01-01 — Entry declarations and transitive public types are inspected for private types and paths, unstable inferred names, globals unavailable in supported consumer runtimes, and accidental widening.
- [ ] TSPKG-CK-AESTHETICS-01-02 — Public declarations are deliberately generated or authored rather than accepted as incidental build output.

## Usage

### TSPKG-SC-USAGE-01 — Normal case: a representative consumer installs, imports, and runs the package

The consumer's position is outside the source checkout, with only the installed archive and its metadata. The
expected outcome installs that archive into isolated consumers and exercises every claimed import form,
resolution mode, and named runtime. A path that was never resolved from a consumer is unproved.

#### Checklist

- [ ] TSPKG-CK-USAGE-01-01 — The archive is installed into isolated representative consumers.
- [ ] TSPKG-CK-USAGE-01-02 — Every public entry is resolved through each claimed import form and compiler resolution mode.
- [ ] TSPKG-CK-USAGE-01-03 — Positive and negative consumer examples are type-checked against the installed archive.
- [ ] TSPKG-CK-USAGE-01-04 — The imported runtime entry is run in every claimed named runtime or module format.

### TSPKG-SC-USAGE-02 — Adversarial: consumer success obtained by bypassing package metadata

A fixture that reaches into the source tree, a workspace link, or a working-tree import can produce a passing
consumer test while the published metadata is never used. The expected outcome rejects a result that skipped
the package metadata; a green result from a bypassed path presented as consumer proof is the failure.

#### Checklist

- [ ] TSPKG-CK-USAGE-02-01 — No source-relative resolution that bypasses the package metadata is accepted as an installed-consumer result.
- [ ] TSPKG-CK-USAGE-02-02 — No working-tree result stands in for a result from the installed package archive.

## Consistency

### TSPKG-SC-CONSISTENCY-01 — Rule violation: a compatibility claim the installed archive never exercised

Support for a module format, runtime, TypeScript version, or resolver is easy to state in metadata or a readme
and hard to prove. The expected outcome exercises each claim with a representative fixture. A claim standing
on plausibility rather than an exercised path breaks the Rule.

#### Checklist

- [ ] TSPKG-CK-CONSISTENCY-01-01 — No compatibility with a module format, runtime, TypeScript version, or resolver is claimed unless an installed package archive exercised it.
- [ ] TSPKG-CK-CONSISTENCY-01-02 — Every claimed module and resolution path has a representative consumer fixture.

### TSPKG-SC-CONSISTENCY-02 — Normal case: the API change is classified and carried into the documents

A release changes the public exports, declarations, or runtime behavior, and consumers learn about it from the classification and the notes. The
expected outcome compares those public elements with the prior released API, classifies what changed, and updates
the consumer documents. An unclassified or undocumented change is the failure.

#### Checklist

- [ ] TSPKG-CK-CONSISTENCY-02-01 — The public exports and declarations are compared with the prior released API.
- [ ] TSPKG-CK-CONSISTENCY-02-02 — Additions, deprecations, removals, behavioral changes, and minimum-toolchain changes are classified.
- [ ] TSPKG-CK-CONSISTENCY-02-03 — Consumer documentation and release notes are updated for the classified change.

## Risk

### TSPKG-SC-RISK-01 — Rule violation: publication without classification and authority

Publishing is irreversible for consumers, and a compatibility statement changes what they may rely on. The
expected outcome classifies the change, obtains release authority, and publishes only through the authorized
workflow. Publishing outside that path, or without the classification, breaks the Rule.

#### Checklist

- [ ] TSPKG-CK-RISK-01-01 — Public API changes are classified before publishing or changing a compatibility statement.
- [ ] TSPKG-CK-RISK-01-02 — Release authority is obtained before publishing or changing a compatibility statement.
- [ ] TSPKG-CK-RISK-01-03 — Publication happens only through the repository's authorized release workflow.
- [ ] TSPKG-CK-RISK-01-04 — Registry metadata and installation are verified after publication, or the task stops at a publication-ready archive when publication is not authorized.

### TSPKG-SC-RISK-02 — Normal case: the archive contains exactly what it should

What is packed is what consumers receive, including anything the working tree left behind. The expected
outcome builds cleanly, inspects the inventory for missing generated files and unwanted source or secrets, and has
defined its checks before building. Discovering the contents after publication is the failure.

#### Checklist

- [ ] TSPKG-CK-RISK-02-01 — The build runs clean without relying on stale output.
- [ ] TSPKG-CK-RISK-02-02 — The archive inventory is inspected for missing generated files and for unwanted source or secrets.
- [ ] TSPKG-CK-RISK-02-03 — Archive-content, installation, runtime, and rollback checks are defined before building.

### TSPKG-SC-RISK-03 — Expected failure: a required package check fails

A pre-publication build, declaration, metadata, consumer, or final-check failure must keep the archive
unpublished. A post-publication failure must become a release-authority incident. The expected outcome repairs
and recreates an unpublished archive or follows an
authorized rollback, deprecation, or corrective release after publication. Silent publication or republishing
is the failure.

#### Checklist

- [ ] TSPKG-CK-RISK-03-01 — An archive with any failed pre-publication check remains unpublished.
- [ ] TSPKG-CK-RISK-03-02 — A repaired package returns to release authority only as a recreated archive that passes every affected final check.
- [ ] TSPKG-CK-RISK-03-03 — Every post-publication verification failure remains an unresolved release-authority incident until an authorized rollback, deprecation, or corrective release completes.

## Overall

### TSPKG-SC-OVERALL-01 — Normal case: every result belongs to the package archive being proposed

Command results collected across a long package run can come from several builds. The expected outcome rebuilds from
the accepted tree, re-runs the required checks, and binds every result to the exact archive being proposed. A
result carried over from an earlier archive is the failure.

#### Checklist

- [ ] TSPKG-CK-OVERALL-01-01 — The build output is rebuilt from the accepted tree.
- [ ] TSPKG-CK-OVERALL-01-02 — The archive is recreated from that rebuilt output.
- [ ] TSPKG-CK-OVERALL-01-03 — The repository's required package metadata, declaration, consumer, license, provenance, and vulnerability checks are re-run.
- [ ] TSPKG-CK-OVERALL-01-04 — Every command result is bound to the exact archive digest or contents being proposed.

### TSPKG-SC-OVERALL-02 — Expected failure: a claimed named runtime, consumer, or check cannot be run here

An isolated consumer, a named runtime, or a required check is unavailable in this environment, so part of the
claimed behavior cannot be exercised. The expected outcome withdraws or marks the affected claim and reports the
limit. Presenting the remaining command results as complete is the failure.

#### Checklist

- [ ] TSPKG-CK-OVERALL-02-01 — Every claim whose required command could not be run is withdrawn or reported as unverified.
- [ ] TSPKG-CK-OVERALL-02-02 — Unavailable named runtimes, consumers, and checks are reported with the findings as limitations.
