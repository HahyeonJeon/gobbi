# TypeScript Packaging Evaluation Checklist

This reusable unchecked source evaluates package definition, structure, declarations, installed-consumer
behavior, and compatibility claims for one package produced or validated under this operation. It is governed
by the [`typescript`](../SKILL.md) domain and [`typescript-packaging`](SKILL.md) operation, with
[`typescript-toolchain`](../typescript-toolchain/SKILL.md) defining the build and resolution pipeline and
[`typescript-testing`](../typescript-testing/SKILL.md) defining the consumer and declaration checks it runs.
The [installed-command checklist](command-checklists.md) separately evaluates commands supplied by the package.
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
- [ ] TSPKG-CK-PROJECT-01-02 — Applicable package kinds, supported runtimes, module loaders, resolution modes, TypeScript versions, import forms, command names, operating systems, CPU architectures, package-manager versions, and engine, peer-dependency, optional-dependency, and installation policies are recorded.
- [ ] TSPKG-CK-PROJECT-01-03 — Every public entry point is listed with whether it provides runtime code, types only, or both.
- [ ] TSPKG-CK-PROJECT-01-04 — Compatibility statements, publication authority, and out-of-scope consumers are identified.

### TSPKG-SC-PROJECT-02 — Rule violation: review-only validation changes the subject

A validation run has no authority to change the reviewed subject. The expected outcome may inspect existing
generated package output and a pre-existing archive. With command authority, it may create disposable command
state outside reviewed files and install that archive into an isolated disposable consumer. Editing reviewed
files, creating output or an archive, installing persistently, or publishing exceeds its authority.

#### Checklist

- [ ] TSPKG-CK-PROJECT-02-01 — Under review-only validation, no reviewed file is edited.
- [ ] TSPKG-CK-PROJECT-02-02 — Under review-only validation, existing generated package output may be inspected, but generated package output is not built or rebuilt.
- [ ] TSPKG-CK-PROJECT-02-03 — Every package archive inspected or installed under review-only validation existed before the review and is not created or recreated by the review.
- [ ] TSPKG-CK-PROJECT-02-04 — Every command write under review-only validation is disposable command state outside the reviewed files.
- [ ] TSPKG-CK-PROJECT-02-05 — Under review-only validation, nothing is published.
- [ ] TSPKG-CK-PROJECT-02-06 — Every review-only archive installation uses the pre-existing archive in an isolated disposable consumer and never a persistent environment.

### TSPKG-SC-PROJECT-03 — Normal case: a review-only run closes on inspection results alone

A review-only run reaches the end of its inspection with no authority to change the reviewed subject. The
expected outcome leaves documentation and release notes unchanged and returns command results, findings, and
limitations. Evidence that needs a new build or archive remains unavailable or triggers a request for author
mode. Crossing the mode boundary or omitting that result is the failure.

#### Checklist

- [ ] TSPKG-CK-PROJECT-03-02 — A review-only run finishes with command results, findings, and limitations.
- [ ] TSPKG-CK-PROJECT-03-03 — A review-only run leaves documentation and release notes unchanged.
- [ ] TSPKG-CK-PROJECT-03-04 — Required evidence that needs a new build or archive is reported as unavailable or requests author mode.
- Also applies: TSPKG-CK-PROJECT-02-01 (reviewed files remain unchanged).
- Also applies: TSPKG-CK-PROJECT-02-02 (generated package output is not built or rebuilt).
- Also applies: TSPKG-CK-PROJECT-02-03 (only a pre-existing archive is used).
- Also applies: TSPKG-CK-PROJECT-02-04 (command state is disposable and external to reviewed files).
- Also applies: TSPKG-CK-PROJECT-02-05 (nothing is published).
- Also applies: TSPKG-CK-PROJECT-02-06 (archive installation is isolated, disposable, and not persistent).

## Structure

### TSPKG-SC-STRUCTURE-01 — Normal case: every entry point resolves to real files

An export map has declaration branches and runtime branches rather than one uniform file pair. The expected
outcome maps each branch to the file kind it selects, orders versioned and fallback type conditions correctly,
and keeps declaration module formats aligned with their runtime branches. A missing fallback, wrong file kind,
or mismatched module format is the failure.

#### Checklist

- [ ] TSPKG-CK-STRUCTURE-01-01 — Every export condition maps to an existing file of its declared kind: `types` and versioned `types@<selector>` branches to declaration files; runtime branches to runtime files.
- [ ] TSPKG-CK-STRUCTURE-01-02 — Applicable conditions are ordered from versioned `types@<selector>` branches to the ordinary `types` fallback and then to runtime branches within the same condition object.
- [ ] TSPKG-CK-STRUCTURE-01-03 — Every supported compiler that misses the versioned type selectors reaches an ordinary `types` fallback.
- [ ] TSPKG-CK-STRUCTURE-01-04 — Each declaration file's detected module format matches the ESM or CommonJS runtime branch it describes.
- [ ] TSPKG-CK-STRUCTURE-01-05 — Declarations are decided as emitted, bundled, or maintained.
- [ ] TSPKG-CK-STRUCTURE-01-06 — One exact `tsconfig.json` file produces or validates the declarations.
- Also applies: TSPKG-CK-PROJECT-01-03 (each entry records whether it provides runtime code, types only, or both).

### TSPKG-SC-STRUCTURE-02 — Rule violation: an internal path becomes reachable

A broad file set, a wildcard export, a leaked declaration, or a source-only path can hand consumers a module
the package never meant to support. The expected outcome keeps internal modules unreachable and declares every
intentional subpath. An accidental reachable path breaks the Rule even when nothing imports it yet.

#### Checklist

- [ ] TSPKG-CK-STRUCTURE-02-01 — No internal path is exposed through a broad file set, a wildcard export, a declaration leak, or a source-only path.
- [ ] TSPKG-CK-STRUCTURE-02-02 — Every module reachable by consumers is an intentional public entry point or subpath.
- [ ] TSPKG-CK-STRUCTURE-02-03 — Every local file target named by package metadata resolves inside the package archive.

### TSPKG-SC-STRUCTURE-03 — Normal case: dual runtime branches have matching nested declarations

One public entry can provide both ESM and CommonJS runtime branches, and each branch needs declarations with
the same detected module format. The expected outcome nests matching declaration conditions under each runtime
branch. One flat declaration route shared by both runtime branches is the failure.

#### Checklist

- [ ] TSPKG-CK-STRUCTURE-03-01 — A public entry with both ESM and CommonJS runtime branches gives each runtime branch its own nested matching declaration condition and file.

### TSPKG-SC-STRUCTURE-04 — Normal case: dependency and declaration-routing fields match consumer needs

Dependency fields and package-manager policy decide what is required, optional, installed automatically,
supplied compatibly, or bundled into the archive. Declaration routing depends on which package field the
compiler's resolution mode reads. The expected outcome exercises these installed behaviors rather than only
reading their metadata.

#### Checklist

- [ ] TSPKG-CK-STRUCTURE-04-01 — Each package's dependency declaration and any `bundleDependencies` membership match whether it is required, optional, consumer-supplied, authoring-only, or also packed into the archive.
- [ ] TSPKG-CK-STRUCTURE-04-02 — Under each supported package-manager version and peer policy, required-peer installation has the recorded outcome for compatible, missing, and incompatible or conflicting peers.
- [ ] TSPKG-CK-STRUCTURE-04-03 — Under each supported package-manager version and policy, optional-dependency installation has the recorded outcome when installed, omitted, unavailable, or failed.
- [ ] TSPKG-CK-STRUCTURE-04-04 — Every claimed TypeScript-version declaration route resolves from an isolated installed consumer through the package field read by that compiler version and resolution mode.
- [ ] TSPKG-CK-STRUCTURE-04-05 — `engines`, `os`, and `cpu` produce the warning, acceptance, or rejection behavior stated by the support and package-manager policy.
- [ ] TSPKG-CK-STRUCTURE-04-06 — Under each supported package-manager version and policy, optional-peer installation has the recorded outcome when the peer is present or absent, including automatic installation behavior.

### TSPKG-SC-STRUCTURE-05 — Normal case: built output and tree-shaking metadata match package requirements

Package output has observable file paths and loader behavior, while `sideEffects` tells consumers what a
tree-shaker may remove. The expected outcome checks the complete built-output inventory and keeps that metadata
aligned with actual module effects. A mismatched output or unsafe tree-shaking claim is the failure.

#### Checklist

- [ ] TSPKG-CK-STRUCTURE-05-01 — Built-output extensions, directories, source maps, assets, and rewritten import specifiers match the package requirements.
- [ ] TSPKG-CK-STRUCTURE-05-02 — `sideEffects` semantics match actual module side effects and the intended tree-shaking behavior.

### TSPKG-SC-STRUCTURE-06 — Normal case: used package metadata selects the intended files and targets

A package may use private import mappings, legacy top-level entry fields, and a publish file set alongside
`exports`. The expected outcome validates each used field according to its own target rules and keeps fields
that define the same entry aligned. Requiring an external `imports` target inside the archive or leaving any
used field unverified is the failure.

#### Checklist

- [ ] TSPKG-CK-STRUCTURE-06-01 — Every used `imports` key starts with `#`.
- [ ] TSPKG-CK-STRUCTURE-06-02 — Every used `imports` target selects the intended local file or permitted external package under each applicable condition.
- [ ] TSPKG-CK-STRUCTURE-06-03 — Every used top-level `types` field selects an existing declaration file.
- [ ] TSPKG-CK-STRUCTURE-06-04 — Every used top-level `main` and `module` field selects an existing runtime file of its intended module format.
- [ ] TSPKG-CK-STRUCTURE-06-05 — Top-level `types`, `main`, and `module` agree with `exports` wherever both define the same entry.
- [ ] TSPKG-CK-STRUCTURE-06-06 — When `files` is used, its selected archive content matches the intended package inventory.

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

## Risk

Not applicable: This source is bound to package definition and installed-consumer behavior; release risk and
recovery are evaluated by the
[release checklist](release-checklists.md).

## Overall

Not applicable: This source is bound to package definition and installed-consumer behavior; final release
traceability is evaluated by the
[release checklist](release-checklists.md).
