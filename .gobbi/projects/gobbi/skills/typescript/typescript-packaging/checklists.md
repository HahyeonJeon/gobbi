# TypeScript Packaging Evaluation Checklist

This reusable unchecked source evaluates one package contract produced or validated under this operation. It
is governed by the [`typescript`](../SKILL.md) domain and [`typescript-packaging`](SKILL.md) operation, with
[`typescript-toolchain`](../typescript-toolchain/SKILL.md) owning the build and resolution pipeline and
[`typescript-testing`](../typescript-testing/SKILL.md) owning the consumer and declaration evidence it runs.
The source commit that contains this file identifies the checklist version. Its stable owner prefix is
`TSPKG`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### TSPKG-SC-PROJECT-01 — Normal case: the package contract is defined before anything is built

Package work starts from consumers, not from build output. The expected outcome fixes the mode, the supported
consumer environments, the public entry points, and the promises and authority that bind the result. A build
begun before those are recorded is the failure.

#### Checklist

- [ ] TSPKG-CK-PROJECT-01-01 — The task is classified as authorized author mode or review-only validation before later steps are planned.
- [ ] TSPKG-CK-PROJECT-01-02 — Supported runtimes, module loaders, resolution modes, TypeScript versions, and import forms are recorded.
- [ ] TSPKG-CK-PROJECT-01-03 — Every public entry point is listed with whether it provides runtime code, types only, or both.
- [ ] TSPKG-CK-PROJECT-01-04 — Compatibility promises, publication authority, and out-of-scope consumers are identified.

### TSPKG-SC-PROJECT-02 — Rule violation: review-only validation changes the subject

A validation run has no authority to write, and building or installing "just to check" quietly turns it into
author mode. The expected outcome inspects existing artifacts, collects only non-target disposable evidence,
and closes with findings. Any write inside the review-only classification breaks the boundary.

#### Checklist

- [ ] TSPKG-CK-PROJECT-02-01 — Under review-only validation, no target file is edited.
- [ ] TSPKG-CK-PROJECT-02-02 — Under review-only validation, no target artifact is built or created.
- [ ] TSPKG-CK-PROJECT-02-03 — Under review-only validation, nothing is installed into a persistent environment.
- [ ] TSPKG-CK-PROJECT-02-04 — Under review-only validation, no documentation or release note is updated.
- [ ] TSPKG-CK-PROJECT-02-05 — Under review-only validation, nothing is published.

### TSPKG-SC-PROJECT-03 — Normal case: a review-only run closes on evidence alone

A review-only run reaches the end of its inspection with no authority to change anything. The expected
outcome passes over every mutation step and returns evidence, findings, and limitations. A run that performs
a mutation step, or that ends without returning what it found, is the failure.

#### Checklist

- [ ] TSPKG-CK-PROJECT-03-01 — A review-only run skips every mutation step.
- [ ] TSPKG-CK-PROJECT-03-02 — A review-only run finishes with evidence, findings, and limitations.

## Structure

### TSPKG-SC-STRUCTURE-01 — Normal case: every entry point resolves to real files

An export map is a promise that a condition leads to a runtime file and a declaration file that exist. The
expected outcome defines each entry point completely and maps each condition to built output inside the
package. A condition pointing at a missing, external, or source-only path is the failure.

#### Checklist

- [ ] TSPKG-CK-STRUCTURE-01-01 — Every public entry point defines its runtime file, declaration file, module condition, and supported consumer environment.
- [ ] TSPKG-CK-STRUCTURE-01-02 — Every export condition maps to an existing built runtime file and declaration file.
- [ ] TSPKG-CK-STRUCTURE-01-03 — Declarations are decided as emitted, bundled, or maintained.
- [ ] TSPKG-CK-STRUCTURE-01-04 — One configuration owns the declarations.
- [ ] TSPKG-CK-STRUCTURE-01-05 — Every metadata path resolves inside the package.

### TSPKG-SC-STRUCTURE-02 — Rule violation: an internal path becomes reachable

A broad file set, a wildcard export, a leaked declaration, or a source-only path can hand consumers a module
the package never meant to support. The expected outcome keeps internal modules unreachable and declares every
intentional subpath. An accidental reachable path breaks the Rule even when nothing imports it yet.

#### Checklist

- [ ] TSPKG-CK-STRUCTURE-02-01 — No internal path is exposed through a broad file set, a wildcard export, a declaration leak, or a source-only path.
- [ ] TSPKG-CK-STRUCTURE-02-02 — Every module reachable by consumers is an intentional public entry point or subpath.

## Performance

### TSPKG-SC-PERFORMANCE-01 — Edge case: the package ships more than one copy of itself

Dual formats, duplicated bundles, or several entry points can load the same module twice, so shared state
diverges and the archive carries the cost twice. The expected outcome tests identity and shared state across
entry points and accounts for what the archive weighs. Divergent state or unexplained growth is the failure.

#### Checklist

- [ ] TSPKG-CK-PERFORMANCE-01-01 — Singleton identity and shared state are tested across multiple entry points wherever dual formats or duplicated bundles are possible.
- [ ] TSPKG-CK-PERFORMANCE-01-02 — The archive inventory is inspected for unexpected size changes.

## Aesthetics

### TSPKG-SC-AESTHETICS-01 — Poor quality: declarations that compile but do not read as a contract

The emitted declarations type-check while exposing internal paths, host globals, and widened or
compiler-invented names that consumers must decode. The expected outcome treats the declaration surface as
authored output and inspects it before it becomes the published contract.

#### Checklist

- [ ] TSPKG-CK-AESTHETICS-01-01 — Entry declarations and transitive public types are inspected for private types and paths, unstable inferred names, host globals and consumer-host dependencies, and accidental widening.
- [ ] TSPKG-CK-AESTHETICS-01-02 — Public declarations are deliberately generated or authored rather than accepted as incidental build output.

## Usage

### TSPKG-SC-USAGE-01 — Normal case: a representative consumer installs, imports, and runs the package

The consumer's position is outside the source checkout, with only the installed archive and its metadata. The
expected outcome installs that archive into isolated consumers and exercises every claimed import form,
resolution mode, and host. A path that was never resolved from a consumer is unproved.

#### Checklist

- [ ] TSPKG-CK-USAGE-01-01 — The archive is installed into isolated representative consumers.
- [ ] TSPKG-CK-USAGE-01-02 — Every public entry is resolved through each claimed import form and compiler resolution mode.
- [ ] TSPKG-CK-USAGE-01-03 — Positive and negative consumer examples are type-checked against the installed archive.
- [ ] TSPKG-CK-USAGE-01-04 — The imported runtime entry is run in every claimed host or module format.

### TSPKG-SC-USAGE-02 — Adversarial: consumer success obtained by bypassing the package contract

A fixture that reaches into the source tree, a workspace link, or a working-tree import can produce a passing
consumer test while the published metadata is never used. The expected outcome rejects evidence that skipped
the package contract; a green result from a bypassed path presented as consumer proof is the failure.

#### Checklist

- [ ] TSPKG-CK-USAGE-02-01 — No source-relative resolution that bypasses the package metadata is accepted as consumer evidence.
- [ ] TSPKG-CK-USAGE-02-02 — No working-tree result stands in for evidence from the packed or built artifact.

## Consistency

### TSPKG-SC-CONSISTENCY-01 — Rule violation: a compatibility claim the artifact never exercised

Support for a module format, runtime, TypeScript version, or resolver is easy to state in metadata or a readme
and hard to prove. The expected outcome exercises each claim with a representative fixture. A claim standing
on plausibility rather than an exercised path breaks the Rule.

#### Checklist

- [ ] TSPKG-CK-CONSISTENCY-01-01 — No compatibility with a module format, runtime, TypeScript version, or resolver is claimed unless the artifact exercised it.
- [ ] TSPKG-CK-CONSISTENCY-01-02 — Every claimed module and resolution path has a representative consumer fixture.

### TSPKG-SC-CONSISTENCY-02 — Normal case: the API change is classified and carried into the documents

A release changes the public surface, and consumers learn about it from the classification and the notes. The
expected outcome compares the surface with the prior released contract, classifies what changed, and updates
the consumer documents. An unclassified or undocumented change is the failure.

#### Checklist

- [ ] TSPKG-CK-CONSISTENCY-02-01 — The public export and declaration surface is compared with the prior released contract.
- [ ] TSPKG-CK-CONSISTENCY-02-02 — Additions, deprecations, removals, behavioral changes, and minimum-toolchain changes are classified.
- [ ] TSPKG-CK-CONSISTENCY-02-03 — Consumer documentation and release notes are updated for the classified change.

## Risk

### TSPKG-SC-RISK-01 — Rule violation: publication without classification and authority

Publishing is irreversible for consumers, and a compatibility promise changes what they may rely on. The
expected outcome classifies the change, obtains release authority, and publishes only through the authorized
workflow. Publishing outside that path, or without the classification, breaks the Rule.

#### Checklist

- [ ] TSPKG-CK-RISK-01-01 — Public API changes are classified before publishing or changing a compatibility promise.
- [ ] TSPKG-CK-RISK-01-02 — Release authority is obtained before publishing or changing a compatibility promise.
- [ ] TSPKG-CK-RISK-01-03 — Publication happens only through the repository's authorized release workflow.
- [ ] TSPKG-CK-RISK-01-04 — Registry metadata and installation are verified after publication, or the work stops at a publication-ready artifact when publication is not authorized.

### TSPKG-SC-RISK-02 — Normal case: the archive contains exactly what it should

What is packed is what consumers receive, including anything the working tree left behind. The expected
outcome builds cleanly, inspects the inventory for missing artifacts and unwanted source or secrets, and has
defined its evidence before building. Discovering the contents after publication is the failure.

#### Checklist

- [ ] TSPKG-CK-RISK-02-01 — The build runs clean without relying on stale output.
- [ ] TSPKG-CK-RISK-02-02 — The archive inventory is inspected for missing artifacts and for unwanted source or secrets.
- [ ] TSPKG-CK-RISK-02-03 — Packed-content, installation, runtime, and rollback evidence is defined before building.

## Overall

### TSPKG-SC-OVERALL-01 — Normal case: every result belongs to the artifact being proposed

Evidence collected across a long package run can come from several builds. The expected outcome rebuilds from
the accepted tree, re-runs the required gates, and binds every result to the exact archive being proposed. A
result carried over from an earlier archive is the failure.

#### Checklist

- [ ] TSPKG-CK-OVERALL-01-01 — The build output is rebuilt from the accepted tree.
- [ ] TSPKG-CK-OVERALL-01-02 — The archive is recreated from that rebuilt output.
- [ ] TSPKG-CK-OVERALL-01-03 — The repository's required package metadata, declaration, consumer, license, provenance, and vulnerability gates are re-run.
- [ ] TSPKG-CK-OVERALL-01-04 — Every piece of evidence is bound to the exact archive digest or contents being proposed.

### TSPKG-SC-OVERALL-02 — Expected failure: a claimed host, consumer, or gate cannot be run here

An isolated consumer, a runtime host, or a required gate is unavailable in this environment, so part of the
contract cannot be exercised. The expected outcome withdraws or marks the affected claim and reports the
limit. Presenting the remaining evidence as a complete result is the failure.

#### Checklist

- [ ] TSPKG-CK-OVERALL-02-01 — Every claim whose evidence could not be run is withdrawn or reported as unverified.
- [ ] TSPKG-CK-OVERALL-02-02 — Unavailable hosts, consumers, and gates are reported with the findings as limitations.
