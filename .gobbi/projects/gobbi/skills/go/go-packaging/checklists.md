# Go Packaging Evaluation Checklist

Unchecked evaluation source for Go work governed by [Go Packaging](SKILL.md). Its stable owner prefix is
`GOPKG`; apply it only to the exact binary or archive, artifact path, mode, authority, and returned outcome.

[Evaluation](../../evaluation/SKILL.md) owns evidence, filled results, findings, and verdicts. This source owns
only reusable scenarios and unchecked binary conditions; it defines no result, severity, score, or remedy.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere,
carries no checkbox, and creates no second condition.

## Project

### GOPKG-SC-PROJECT-01 — Normal case: One authorized Packaging mode is explicit

The caller asks Packaging to produce or validate one local binary or archive. The work should select exactly
one mode and keep its effect boundary visible; blended modes or inferred authority fail.

#### Checklist

- [ ] GOPKG-CK-PROJECT-01-01 — Exactly one mode is selected from `Produce` and `Validation`.
- [ ] GOPKG-CK-PROJECT-01-02 — Produce's permitted-effect set is exactly project-source reads, one caller-designated local artifact-path write, approved bounded temporary writes, separately classified cache and download effects, separately authorized classified network downloads, and project-command execution limited to the authorized project default build command plus named target and the named isolated smoke-check project command.
- [ ] GOPKG-CK-PROJECT-01-03 — Validation's permitted-effect set is exactly project-source and existing-binary or existing-archive reads, rebuilt comparison or validation writes only in a named isolated temporary location, separately classified cache and download effects, separately authorized classified network downloads, and project-command execution limited to the authorized project default build command plus named target or the named isolated smoke-check project command.
- [ ] GOPKG-CK-PROJECT-01-04 — Both modes report `credential use: none`.
- [ ] GOPKG-CK-PROJECT-01-05 — Both modes report `external mutation: none`.
- [ ] GOPKG-CK-PROJECT-01-06 — Both modes report `release effect: none`.
- Also applies: GOPKG-CK-USAGE-01-01 (Produce returns bytes only at its designated write boundaries).
- Also applies: GOPKG-CK-USAGE-02-03 (Validation binds its result to the exact existing bytes).
- Also applies: GOPKG-CK-USAGE-04-01 (partial bytes use the caller-named retention record).
- Also applies: GOPKG-CK-USAGE-04-02 (partial-byte cleanup uses the caller-named cleanup boundary).
- Also applies: GOPKG-CK-OVERALL-01-01 (each mode returns the universal terminal record).

### GOPKG-SC-PROJECT-02 — Rule violation: Undeclared authority is inferred

A requested `GOOS/GOARCH` target or effect is absent from the bound contract. The operation should pause before
it occurs; using a local default, ambient capability, or apparently harmless effect as authority fails.

#### Checklist

- [ ] GOPKG-CK-PROJECT-02-01 — An undeclared `GOOS/GOARCH` target, binary, archive, artifact path, temporary path, cache, download, network access, source mutation, credential need, publication, destination, or external action causes a user-decision pause before the effect.
- [ ] GOPKG-CK-PROJECT-02-02 — No effect outside the caller's exact authority is represented as ordinary Packaging behavior.

## Structure

### GOPKG-SC-STRUCTURE-01 — Normal case: The complete build contract is bound

Packaging starts from one exact subject and build selection. The record should contain every input that can
change bytes or readiness; an ambient default or incomplete selector fails.

#### Checklist

- [ ] GOPKG-CK-STRUCTURE-01-01 — The subject record contains the mode, acting agent, caller, user or named project decision authority, consumer, binary or archive kind, artifact path, write boundaries, non-goals, compatibility obligation, and requested terminal result.
- [ ] GOPKG-CK-STRUCTURE-01-02 — The build-selection record contains the project default build command plus named target, exact package pattern only as that project command's selector and evidence, selected Go toolchain version, relevant minimum supported Go version, module's Go language version only when language or module behavior selected by the `go` directive matters, `GOOS/GOARCH` target, working directory, and relevant environment inputs.
- [ ] GOPKG-CK-STRUCTURE-01-03 — The input-identity record contains the module or workspace, applicable package name and import path, source identity, build identity, input identity, and effect authority.
- [ ] GOPKG-CK-STRUCTURE-01-04 — The byte-affecting-input record contains cgo state, C compiler and tool identities, system headers and libraries, build tags, flags, generated files, `//go:embed` assets, and adjacent assets.
- [ ] GOPKG-CK-STRUCTURE-01-05 — The binary or archive policy record contains embedded or adjacent metadata kind, value, location, and source; archive format, compression, member, permission, and ordering policies when applicable; checksum algorithm; and reproducibility requirement.

### GOPKG-SC-STRUCTURE-02 — Normal case: Final-byte identity is complete

A binary or archive has reached its final bytes. Its identity should connect exact bytes to their build and
content records; a path or source label without byte identity fails.

#### Checklist

- [ ] GOPKG-CK-STRUCTURE-02-01 — Final-byte identity contains binary or archive kind, exact artifact path, byte size, permission mode, checksum algorithm, and checksum value.
- [ ] GOPKG-CK-STRUCTURE-02-02 — Final-byte identity contains source and build identities, project default build command plus named target, exact package pattern as command evidence, selected Go toolchain version, `GOOS/GOARCH` target, cgo and C compiler or system library inputs, flags, and tags.
- [ ] GOPKG-CK-STRUCTURE-02-03 — Final-byte identity contains embedded or adjacent metadata kind, value, location, and source; archive format and member inventory when applicable; embedded and adjacent asset inventory; and creation time only when required.

### GOPKG-SC-STRUCTURE-03 — Rule violation: A sibling or later decision boundary is bypassed

A prerequisite or forward action lies outside Packaging. The work should route the fact to its named operation
and return only local readiness; absorbing another operation's decision fails.

#### Checklist

- [ ] GOPKG-CK-STRUCTURE-03-01 — Packaging's sibling-route map assigns project-command, exact package pattern, selected Go toolchain version, and `GOOS/GOARCH` target facts to `go-toolchain`; module and private-read facts, including a private-module credential need, to the applicable `go-modules` mode; smoke evidence to `go-testing`; and sensitive embedded or adjacent metadata, archive, cgo, or system dependency risk to `go-security`.
- [ ] GOPKG-CK-STRUCTURE-03-02 — The only forward handoff is exact local artifact identity and readiness to `go-release`.

## Performance

### GOPKG-SC-PERFORMANCE-01 — Poor quality: Packaging cost or written bytes are unbounded

An authorized project command completes but uses unbounded temporary space, downloads, cache growth,
repetitions, or bytes at the artifact path. The operation should keep work proportionate to the named binary
or archive; opaque resource use fails.

#### Checklist

- [ ] GOPKG-CK-PERFORMANCE-01-01 — Every artifact path, temporary location, cache effect, download, and repetition stays within a named bound.
- [ ] GOPKG-CK-PERFORMANCE-01-02 — Project-command duration, binary or archive byte size, and retained temporary material are recorded when they constrain recovery or consumer use.

### GOPKG-SC-PERFORMANCE-02 — Edge case: Reproducibility is selected or unavailable

The caller either requires repeated-build comparison or permits no reproducibility claim. The result should
state the selected position and its limits; one build or checksum agreement alone fails as reproducibility.

#### Checklist

- [ ] GOPKG-CK-PERFORMANCE-02-01 — The result states either a selected reproducibility comparison or `reproducibility: not claimed`.
- [ ] GOPKG-CK-PERFORMANCE-02-02 — A selected reproducibility result records exact repeat inputs, environment, comparison method, tolerated differences and reasons, repetition count, and result.
- [ ] GOPKG-CK-PERFORMANCE-02-03 — A single build and a checksum algorithm/value-only observation support no reproducibility claim.

## Aesthetics

### GOPKG-SC-AESTHETICS-01 — Normal case: Every Packaging claim names its exact object

A cold reader follows the record from project selection to exact bytes. The account should use frozen
claim-site forms and concrete binary, archive, path, metadata, and evidence names; bare shorthand fails.

#### Checklist

- [ ] GOPKG-CK-AESTHETICS-01-01 — Every applicable claim uses `project default build command plus named target`, `project command`, `exact package pattern` only as the selector passed to a `go` or project command and only as command evidence, `selected Go toolchain version`, `module's Go language version` only for language or module behavior selected by the `go` directive, `GOOS/GOARCH target`, and the exact binary, archive, artifact path, embedded or adjacent metadata kind/value/location/source, inventory, checksum algorithm/value, smoke result, or reproducibility position it means.

### GOPKG-SC-AESTHETICS-02 — Poor quality: A cosmetic label preserves stale identity

Binary or archive bytes change while the filename or visible version remains the same. The work should treat
identity as stale; a label-only or checksum-only reassurance fails.

#### Checklist

- [ ] GOPKG-CK-AESTHETICS-02-01 — An unchanged filename, version string, or old checksum value never substitutes for recomputed final-byte identity.

## Usage

### GOPKG-SC-USAGE-01 — Normal case: Produce returns verified local binary or archive bytes

The authorized project default build command plus named target builds one binary or archive for the bound
`GOOS/GOARCH` target. The result should contain designated final bytes and bounded behavior evidence; project-
command success alone fails.

#### Checklist

- [ ] GOPKG-CK-USAGE-01-01 — The exact authorized project default build command plus named target creates final bytes only at the caller-designated artifact path and approved temporary boundaries.
- [ ] GOPKG-CK-USAGE-01-02 — Direct inspection validates expected files, paths, permission modes, `GOOS/GOARCH` target identity, embedded or adjacent metadata kind/value/location/source, archive member inventory, and embedded or adjacent asset inventory against the bound contract.
- [ ] GOPKG-CK-USAGE-01-03 — The named isolated smoke-check project command records the selected startup, help, version, or equivalent bounded behavior in the named isolated environment.
- Also applies: GOPKG-CK-STRUCTURE-02-01 (the produced binary or archive has exact final-byte identity).

### GOPKG-SC-USAGE-02 — Normal case: Validation binds a result to existing bytes

An existing binary or archive is checked without changing it. Any rebuild should remain isolated, and the
returned result should identify the existing binary or archive actually inspected; source-mode or rebuilt-byte
substitution fails.

#### Checklist

- [ ] GOPKG-CK-USAGE-02-01 — Validation leaves project source and the existing binary or archive unchanged.
- [ ] GOPKG-CK-USAGE-02-02 — Every rebuilt comparison or validation byte stays in its named isolated temporary location.
- [ ] GOPKG-CK-USAGE-02-03 — The validation result is bound to the checksum value of the exact existing binary or archive bytes inspected.

### GOPKG-SC-USAGE-03 — Expected failure: A build prerequisite is missing

The selected Go toolchain version or `GOOS/GOARCH` target, cgo input, system dependency, generated input,
embedded input, or adjacent asset is unavailable. The operation should preserve the exact gap; a weaker
`GOOS/GOARCH` target or silently omitted input fails.

#### Checklist

- [ ] GOPKG-CK-USAGE-03-01 — A missing selected Go toolchain version or unsupported `GOOS/GOARCH` target remains an explicit binary or archive block.
- [ ] GOPKG-CK-USAGE-03-02 — A missing cgo compiler, system header, or system library remains an explicit binary or archive block.
- [ ] GOPKG-CK-USAGE-03-03 — A missing generated file, `//go:embed` input, or adjacent asset remains an explicit binary or archive block.

### GOPKG-SC-USAGE-04 — Edge case: Partial binary or archive bytes need bounded recovery

A Packaging project command stops after writing some bytes. The operation should preserve evidence without
deleting or retaining beyond authority; implicit cleanup or hidden partial bytes fail.

#### Checklist

- [ ] GOPKG-CK-USAGE-04-01 — The partial-byte retention record contains the exact partial binary or archive state, caller-named retention boundary, and first recovery action.
- [ ] GOPKG-CK-USAGE-04-02 — Partial binary or archive bytes are cleaned only at the caller-named cleanup boundary after exact path resolution.

## Consistency

### GOPKG-SC-CONSISTENCY-01 — Rule violation: Changed bytes retain old evidence

Final bytes change after identity or behavior evidence is recorded. Every dependent observation should become
stale and be recomputed; selective retention of apparently unaffected evidence fails.

#### Checklist

- [ ] GOPKG-CK-CONSISTENCY-01-01 — Any final-byte change invalidates the checksum algorithm/value, archive member inventory, embedded or adjacent asset inventory, embedded or adjacent metadata observations, smoke result, reproducibility position, and local readiness state.
- [ ] GOPKG-CK-CONSISTENCY-01-02 — Every invalidated evidence item is recomputed before local readiness is returned.

### GOPKG-SC-CONSISTENCY-02 — Adversarial: Identity fields disagree with inspected bytes

A final-byte record carries a checksum algorithm/value, embedded or adjacent metadata, inventory, or build
trace from another result. Each field should agree with the same final bytes; mixed identities or copied
records fail.

#### Checklist

- [ ] GOPKG-CK-CONSISTENCY-02-01 — The recorded checksum algorithm/value matches the exact final bytes at the recorded artifact path.
- [ ] GOPKG-CK-CONSISTENCY-02-02 — Recorded embedded or adjacent metadata kind/value/location/source, archive member inventory, and embedded or adjacent asset inventory match direct inspection of those final bytes and adjacent assets.
- [ ] GOPKG-CK-CONSISTENCY-02-03 — Recorded source identity, build identity, project default build command plus named target, exact package pattern as command evidence, selected Go toolchain version, `GOOS/GOARCH` target, cgo state, flags, and tags match the inputs that produced those final bytes.

## Risk

### GOPKG-SC-RISK-01 — Adversarial: An archive contains absolute, traversal, or unexpected members

An archive includes traversal, absolute, duplicate, special, missing, or unexpected entries. The operation
should reject the archive before local readiness; trusting an extraction tool or intended inventory fails.

#### Checklist

- [ ] GOPKG-CK-RISK-01-01 — Archive member paths contain no absolute path or parent traversal.
- [ ] GOPKG-CK-RISK-01-02 — Archive links, special entries, duplicate paths, permission modes, format, and compression all satisfy the bound archive policy.
- [ ] GOPKG-CK-RISK-01-03 — The inspected archive inventory contains every declared member and no unexpected member.

### GOPKG-SC-RISK-02 — Adversarial: A smoke check escapes isolation

A named isolated smoke-check project command writes outside its temporary boundary, contacts an undeclared
service, persists a process, or performs a later-lifecycle action. The check should stop without local
readiness; cosmetic standard output fails.

#### Checklist

- [ ] GOPKG-CK-RISK-02-01 — The named isolated smoke-check project command's permitted-effect set contains only its named isolated working directory, environment, file, process, and cache boundaries and excludes network access.
- [ ] GOPKG-CK-RISK-02-02 — The named isolated smoke-check project command leaves no file, process, service, or external effect outside its named boundary.
- [ ] GOPKG-CK-RISK-02-03 — The named isolated smoke-check project command performs no install, publication, deployment, production-service contact, or persistent-service start.

### GOPKG-SC-RISK-03 — Rule violation: Credentials or later actions leak into Packaging

A private dependency or destination appears to require expanded access. Packaging should consume only
returned resolution evidence and stop at local readiness; receiving protected values or acting outward fails.

#### Checklist

- [ ] GOPKG-CK-RISK-03-01 — Packaging's returned private-module fact set contains only cache, module, and resolution evidence and no credential value.
- [ ] GOPKG-CK-RISK-03-02 — Undeclared cache writes, downloads, network access, and project-source writes stop before they occur.
- [ ] GOPKG-CK-RISK-03-03 — Packaging has no external destination, publication, or external action.
- Also applies: GOPKG-CK-STRUCTURE-03-01 (the private-module credential need reaches the applicable `go-modules` mode).
- Also applies: GOPKG-CK-STRUCTURE-03-02 (the only forward handoff goes to `go-release`).

## Overall

### GOPKG-SC-OVERALL-01 — Normal case: The terminal Packaging record is complete

Packaging reaches one terminal state for one exact binary or archive. The result should carry universal
operation fields and Packaging-specific identity without claiming more than the evidence; a partial success
record fails.

#### Checklist

- [ ] GOPKG-CK-OVERALL-01-01 — The terminal record contains operation and mode, accepted result, decision basis, actual binary or archive and artifact path, acting agent, caller, user or named project decision authority, consumer, changed or reviewed paths, project-command evidence, evidence limits, external reads or effects, compatibility decision when applicable, block, recovery, and handoff.
- [ ] GOPKG-CK-OVERALL-01-02 — The terminal record contains binary or archive kind, artifact path, byte size, permission mode, checksum algorithm/value, project default build command plus named target, exact package pattern as command evidence, selected Go toolchain version, `GOOS/GOARCH` target, source/build/input identities, cgo state and C compiler or system library inputs, flags and build tags, embedded or adjacent metadata kind/value/location/source, archive format and compression, archive member and embedded or adjacent asset inventories, contract-required creation time, smoke result, and reproducibility position.
- [ ] GOPKG-CK-OVERALL-01-03 — The terminal state is exactly one of `success`, `error`, `cancellation`, `timeout`, `blocked`, and `user-decision pause`.
- [ ] GOPKG-CK-OVERALL-01-04 — An applicable affected-consumer compatibility decision is exactly one of `compatible`, `migration supplied`, `authorized break`, and `unsupported`; an omitted decision has an explicit not-applicable reason.

### GOPKG-SC-OVERALL-02 — Expected failure: An incomplete result is called complete

One identity field, required check, effect fact, limitation, or recovery field is missing. The result should
remain blocked with its obligation visible; claiming success from the remaining fields fails.

#### Checklist

- [ ] GOPKG-CK-OVERALL-02-01 — Completion is not claimed while any universal field, Packaging-specific field, required check, effect fact, limitation, block, recovery action, or handoff field is incomplete.
- Also applies: GOPKG-CK-PROJECT-01-04 (credential use remains none in every terminal state).
- Also applies: GOPKG-CK-PROJECT-01-05 (external mutation remains none in every terminal state).
- Also applies: GOPKG-CK-PROJECT-01-06 (release effect remains none in every terminal state).
