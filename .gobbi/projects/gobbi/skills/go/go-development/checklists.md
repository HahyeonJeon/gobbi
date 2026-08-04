# Go Development Evaluation Checklist

Unchecked evaluation source for Go work governed by [Go Development](SKILL.md). Apply it to the exact work and
returned outcomes under evaluation.

[Evaluation](../../evaluation/SKILL.md) owns evidence, filled results, findings, and verdicts. This source owns
only reusable scenarios and unchecked conditions.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### GODEV-SC-PROJECT-01 — Normal case: The mode and complete effect contract are locked

The work selects exactly one author or read-only review mode. Author mode limits project writes to authorized
paths, classifies every disposable output and cache or download, executes only named authorized project
commands, requires separate network authority, uses no credentials, and performs no external mutation.
Read-only review mode keeps project paths unchanged, limits outputs to approved diagnostics, classifies caches
and downloads, executes only authorized read-only project commands or named tools, requires separate network
authority, uses no credentials, and performs no external mutation. Each mode pauses and returns only at its
own boundary; an inherited or unclassified effect fails.

#### Checklist

- [ ] GODEV-CK-PROJECT-01-01 — Exactly one mode—author or read-only review—and its success criteria, minimum supported Go version, selected Go toolchain version, module's Go language version, and supported `GOOS/GOARCH` targets are explicit.
- [ ] GODEV-CK-PROJECT-01-03 — Every changed or reviewed behavior stays inside the agreed scope.
- [ ] GODEV-CK-PROJECT-01-04 — Every author-mode project-path write, disposable output, cache or download, project execution, network-access, separately reported credential-use, separately reported external-mutation, pause, terminal, and recovery field matches the accepted author contract.
- [ ] GODEV-CK-PROJECT-01-05 — Every read-only-review-mode project-path write, disposable output, cache or download, project execution, network-access, separately reported credential-use, separately reported external-mutation, pause, terminal, and recovery field matches the accepted review contract.

### GODEV-SC-PROJECT-02 — Expected failure: A material choice remains unresolved

Before a design-dependent slice is planned, every viable selection should be classified. A choice is material
when different selections change task scope or acceptance; user-visible behavior; public API or CLI and
compatibility or migration; package, module, or process boundary or dependency direction; configuration, data,
or state flow; mutable-data or resource ownership or lifetime; concurrency, cancellation, or shutdown; trust,
identity, authorization, cryptography, secrets, protected data, or network exposure; failure containment,
recovery, or rollback; performance or resource budget or measurement strategy; diagnostic signals, redaction,
retention, or access; validation strategy, observable test boundary, controllable dependency, or strength of
the completion claim; or artifact identity, release, external effect, or destructive effect. A routine choice
must be fully determined by accepted design or governing convention and change none of those dimensions.
Planning or writing across an unresolved material gate fails.

#### Checklist

- [ ] GODEV-CK-PROJECT-02-02 — Every viable design-dependent selection satisfies the complete material-or-routine classifier before planning or writing proceeds.

### GODEV-SC-PROJECT-03 — Rule violation: The change expands beyond the task

The implementation includes an unrelated cleanup, dependency, refactor, public API, or generated change.
Every path should trace to the accepted outcome; useful but unauthorized work still fails.

#### Checklist

- [ ] GODEV-CK-PROJECT-03-01 — Every changed path, new dependency, and public API change traces to the task.
- [ ] GODEV-CK-PROJECT-03-02 — Unrelated user work in the working tree remains preserved.

## Structure

### GODEV-SC-STRUCTURE-01 — Normal case: The complete affected set is mapped

The change reaches packages, exported declarations, callers, test sources, examples, documentation, generated
inputs or outputs, build constraints, module state, dependencies, artifacts, release use, or consumers. The
work should identify every consistency-bound object before design; a source-file-only view fails.

#### Checklist

- [ ] GODEV-CK-STRUCTURE-01-01 — Every affected package, caller, test source, example, document, generated input or output, build constraint, module file, dependency declaration, artifact, release use, and consumer is identified.

### GODEV-SC-STRUCTURE-02 — Normal case: CRUD and 5W1H expose propagation

The affected set has create, read, update, delete, and dependent co-touch effects. Ownership, behavior,
execution time, location, purpose, propagation, build, verification, release, and recovery should be
understood; an isolated edit plan fails.

#### Checklist

- [ ] GODEV-CK-STRUCTURE-02-01 — Every create, consistency-read, update, delete, and dependent co-touch effect across the affected set is identified.
- [ ] GODEV-CK-STRUCTURE-02-02 — The behavior owner and the runtime, propagation, build, verification, release, and recovery boundaries are identified.

### GODEV-SC-STRUCTURE-03 — Poor quality: A material choice lacks current decision authority

A material package, API, ownership, evidence, effect, or other classified choice reaches the plan without
credible alternatives, a recommendation, and current decision authority. Each material choice should compare
at least two reference-backed alternatives and receive an explicit user or named project-authority decision.
A cited prior decision is valid only for the same decision while affected context and assumptions still match;
changed context reopens it. First-draft or stale-prior lock-in fails.

#### Checklist

- [ ] GODEV-CK-STRUCTURE-03-02 — The selected shape is justified by current callers.
- [ ] GODEV-CK-STRUCTURE-03-03 — Every material choice compares at least two credible reference-backed alternatives.
- [ ] GODEV-CK-STRUCTURE-03-04 — Every material choice has one explicit recommendation.
- [ ] GODEV-CK-STRUCTURE-03-05 — Every material choice is resolved by an explicit user or named project-authority decision, or by a cited prior decision for the same decision whose affected context and assumptions still match.
- Also applies: GODEV-CK-USAGE-03-01 (compatibility position for every affected consumer).

### GODEV-SC-STRUCTURE-04 — Poor quality: Detailed behavior precedes a compiling skeleton

Implementation logic accumulates before package placement, types, signatures, interfaces, errors, and
build-constrained boundaries compile together. Higher layers should grow from a verified foundation; a large
non-compiling first increment fails.

#### Checklist

- [ ] GODEV-CK-STRUCTURE-04-01 — Package placement, file placement, caller-visible signatures, and build-constrained boundaries exist before dependent behavior.
- [ ] GODEV-CK-STRUCTURE-04-02 — Package placement, file placement, caller-visible signatures, and build-constrained boundaries compile before dependent behavior.
- Also applies: GODEV-CK-AESTHETICS-02-01 (no placeholder behavior remains).

## Performance

### GODEV-SC-PERFORMANCE-01 — Normal case: Verification depth follows the actual risk

The implementation can affect ordinary behavior, concurrency, module resolution, input breadth, platform
selection, cgo, compatibility, or dependency exposure. The selected verification should cover each material
risk without substituting an unrelated broad command.

#### Checklist

- [ ] GODEV-CK-PERFORMANCE-01-01 — Focused verification exercises the changed behavior.
- [ ] GODEV-CK-PERFORMANCE-01-02 — Every material cross-package, platform, cgo, concurrency, and module risk has applicable verification.

### GODEV-SC-PERFORMANCE-02 — Poor quality: Verification is blanket or under-scoped

The work runs an expensive repository-wide project command without identifying risk, or only a focused test
despite cross-package, platform, race, cgo, or module effects. Verification cost and coverage should both
match the affected package set, inputs, and targets.

#### Checklist

- [ ] GODEV-CK-PERFORMANCE-02-01 — Every broad verification layer that was run has a task-specific coverage purpose.
- [ ] GODEV-CK-PERFORMANCE-02-02 — No affected dependent package or applicable `GOOS/GOARCH`-specific verification layer is omitted.

## Aesthetics

### GODEV-SC-AESTHETICS-01 — Normal case: The code and diff belong in the project

The complete change should use the project's Go conventions, ordinary control flow, clear ownership, and
reviewable slices. A reader should understand the implementation without reconstructing private author
context.

#### Checklist

- [ ] GODEV-CK-AESTHETICS-01-03 — Changed Go source follows the project formatter.
- [ ] GODEV-CK-AESTHETICS-01-04 — Changed Go source follows the project naming vocabulary.
- [ ] GODEV-CK-AESTHETICS-01-02 — Changed control flow exposes its error and ownership decisions.
- Also applies: GODEV-CK-PROJECT-03-01 (no unrelated churn in the diff).

### GODEV-SC-AESTHETICS-02 — Poor quality: Placeholders and stale language remain

The implementation functions on its main path but retains unconditional panics, deferred-work markers, filler
comments, obsolete names, ignored errors, or compatibility shims with no current owner. Incomplete
presentation and hidden obligations fail.

#### Checklist

- [ ] GODEV-CK-AESTHETICS-02-01 — No in-scope placeholder behavior, unconditional panic, stale deferred-work marker, filler comment, obsolete name, or ownerless compatibility shim remains in the affected set.
- [ ] GODEV-CK-AESTHETICS-02-02 — No affected error is ignored without a stated contract reason.

## Usage

### GODEV-SC-USAGE-01 — Normal case: The caller-visible outcome matches the design

A library, command, service component, generator, helper, or cgo boundary has a concrete consumer path. The
caller should receive the designed values, errors, ownership, and compatibility behavior; internal success
without the promised consumer outcome fails.

#### Checklist

- [ ] GODEV-CK-USAGE-01-01 — The caller can reach the changed behavior through the intended public API or CLI or project command.
- [ ] GODEV-CK-USAGE-01-02 — Caller-visible values, errors, and ownership match the accepted design.

### GODEV-SC-USAGE-02 — Expected failure: An unreproduced defect resists a guessed fix

The reported failure cannot be reproduced under the selected Go toolchain version, project-command flags,
input, or `GOOS/GOARCH` target. Production code should remain unchanged until a diagnostic or test can
distinguish the leading causes; a speculative workaround fails.

#### Checklist

- [ ] GODEV-CK-USAGE-02-01 — A diagnostic, observable test boundary, or controllable dependency distinguishes the leading causes before production code changes.
- [ ] GODEV-CK-USAGE-02-02 — No speculative production workaround substitutes for reproduction.
- Also applies: GODEV-CK-OVERALL-03-01 (the reproduction gap remains explicit).

### GODEV-SC-USAGE-03 — Edge case: A public change requires compatibility handling

An exported declaration, module consumer, serialized form, error identity, initialization path, or minimum
supported Go version changes. Existing users should keep their contract or receive an authorized migration or
break; accidental incompatibility fails.

#### Checklist

- [ ] GODEV-CK-USAGE-03-01 — Every affected consumer has a stated compatibility position.
- [ ] GODEV-CK-USAGE-03-02 — Every authorized migration is usable by affected consumers.
- [ ] GODEV-CK-USAGE-03-03 — Every authorized break is visible in caller documentation.

## Consistency

### GODEV-SC-CONSISTENCY-01 — Rule violation: Dependent objects remain stale

Code changes while one caller, test source, example, document, generated input or output, build constraint,
module file, dependency declaration, artifact, release use, or consumer still expresses the old behavior. Each
verified slice should update every consistency-bound object; partial propagation fails.

#### Checklist

- [ ] GODEV-CK-CONSISTENCY-01-01 — Every affected caller, test source, example, document, generated input or output, build constraint, module file, dependency declaration, artifact, release use, and consumer expresses the current contract.

### GODEV-SC-CONSISTENCY-02 — Rule violation: Read-only review rewrites the subject

Review mode formats, generates, tidies, fixes, or otherwise changes the files being assessed. A read-only
finding set should preserve the exact subject; improving it during review fails.

#### Checklist

- [ ] GODEV-CK-CONSISTENCY-02-01 — Review mode leaves source, generated, module, and workspace files byte-unchanged.

### GODEV-SC-CONSISTENCY-03 — Normal case: Decisions trace to implementation and assurance

Package name, import path, package directory or placement, package boundary, public API or CLI, errors,
ownership, concurrency, compatibility, observable test boundary, and controllable dependency were decided
before implementation. The final tree and returned account should express those same decisions.

#### Checklist

- [ ] GODEV-CK-CONSISTENCY-03-01 — Package name, import path, package directory or placement, package boundary, public API or CLI, ownership, concurrency, error behavior, compatibility, observable test boundary, and controllable dependency match the accepted design.
- Also applies: GODEV-CK-PERFORMANCE-01-02 (verification covers the accepted risk decisions).

### GODEV-SC-CONSISTENCY-04 — Edge case: Platform and cgo files form one contract

Build tags, file suffixes, platform-specific implementations, and cgo declarations select different code for
supported `GOOS/GOARCH` targets. Each selected set should expose compatible behavior and required resources;
host-only consistency fails.

#### Checklist

- [ ] GODEV-CK-CONSISTENCY-04-01 — Every supported `GOOS/GOARCH` target resolves a complete build input set, including its selected source files and required cgo inputs.
- [ ] GODEV-CK-CONSISTENCY-04-02 — Platform-specific implementations preserve the shared public contract.

### GODEV-SC-CONSISTENCY-05 — Adversarial: Documentation is written to match the claim

A doc comment, example, README, or handoff account is written from the intended behavior while the
implementation does something else, so the account and the review agree with each other but not with the code.
Documentation should be derived from the implemented behavior; a self-consistent account that contradicts the
code fails.

#### Checklist

- [ ] GODEV-CK-CONSISTENCY-05-01 — Every changed doc comment, example, document statement, and handoff claim is derived from the implemented behavior.
- [ ] GODEV-CK-CONSISTENCY-05-03 — Every runnable example builds against the current implementation.
- [ ] GODEV-CK-CONSISTENCY-05-04 — Every runnable example passes against the current implementation.

## Risk

### GODEV-SC-RISK-01 — Rule violation: Local or sensitive state enters the diff

The change accidentally includes secrets, credentials, private paths, temporary replacements, caches,
generated scratch output, or unrelated user edits. Task-owned files should contain no workstation or trust
boundary leakage.

#### Checklist

- [ ] GODEV-CK-RISK-01-01 — No changed file carries a secret, credential, workstation-local path, temporary module or workspace replacement, cache, or generated scratch output.
- Also applies: GODEV-CK-PROJECT-03-02 (unrelated user work preserved).

### GODEV-SC-RISK-02 — Rule violation: A false pass claim hides missing verification

A check was unavailable, skipped, unsupported, cached without useful coverage, or run against another
`GOOS/GOARCH` target, yet the work represents it as passed. Returned assurance should reflect the exact
executed project command, package pattern, `GOOS/GOARCH` target, and inputs.

#### Checklist

- [ ] GODEV-CK-RISK-02-01 — Every unavailable check, skipped check, uselessly cached result, and unsupported `GOOS/GOARCH` target remains classified as such.
- [ ] GODEV-CK-RISK-02-02 — Every pass claim names the exact package pattern and `GOOS/GOARCH` target it exercised.

### GODEV-SC-RISK-03 — Adversarial: A workaround masks the root cause

The implementation suppresses a diagnostic, loosens an assertion, retries nondeterminism, or special-cases the
reported input while the underlying failure remains. The change should remove the reproduced cause; cosmetic
success fails.

#### Checklist

- [ ] GODEV-CK-RISK-03-01 — No suppressed diagnostic, weakened assertion, added retry, or reported-input special case substitutes for resolving the cause.

### GODEV-SC-RISK-04 — Edge case: Generated Go appears directly editable

A generated file contains the visible defect or desired behavior. The durable source and declared generator
should own the change unless the project explicitly treats the file as editable source; a hand-edited output
that regeneration erases fails.

#### Checklist

- [ ] GODEV-CK-RISK-04-01 — Every generated change originates from its owned source through the declared generator.
- [ ] GODEV-CK-RISK-04-02 — Regeneration preserves every accepted generated change.

### GODEV-SC-RISK-05 — Normal case: Owner-controlled actions stay with their owner

An ordinary change may run authorized formatters, generators, module commands, and tests. Commit, publication,
cleanup, persistent toolchain configuration, credentialed reads, and external mutations remain with their
named owners. A convenient extra action or inferred authority fails.

#### Checklist

- [ ] GODEV-CK-RISK-05-02 — No staging, commit, publication, cleanup, or persistent toolchain-configuration action is taken from this operation.

## Overall

### GODEV-SC-OVERALL-01 — Normal case: The complete development outcome is coherent

Author mode should return a scoped, project-consistent verified tree. Read-only review mode should return an
evidence-backed finding set without mutation. The work should follow `Study -> Design -> Build -> Verify` and
return the universal terminal core plus development-specific decision, skeleton, slice, effect, reproducer,
verification, and external-owner facts. A private or incomplete terminal account fails.

#### Checklist

- [ ] GODEV-CK-OVERALL-01-05 — The final outcome follows `Study -> Design -> Build -> Verify` under the selected mode.
- [ ] GODEV-CK-OVERALL-01-04 — Every applicable terminal field is explicit: operation and mode, accepted result, decision basis, actual owned object, terminal state, changed or reviewed paths, project-command evidence, evidence limits, external reads or effects, compatibility decision, block, recovery, handoff, bound scope, material-choice and cited-prior-decision gates, author-mode compiling skeleton and complete slices, original reproducer, final project verification, unsupported claims, author-mode no-credential and no-external-mutation facts, and result-dependent external-action owner, returned evidence, prerequisite, retained state, first recovery action, and handoff.
- [ ] GODEV-CK-OVERALL-01-03 — Every completion claim matches the exact final tree.

### GODEV-SC-OVERALL-02 — Adversarial: A focused green test masks incomplete work

One narrow test passes while a caller, document, generated artifact, module state, `GOOS/GOARCH` target, race
path, or original reproducer remains stale or unverified. Local test success must not substitute for whole-task
completion.

#### Checklist

- [ ] GODEV-CK-OVERALL-02-01 — Acceptance is not based solely on one focused test.
- [ ] GODEV-CK-OVERALL-02-02 — The original observable path remains covered.
- Also applies: GODEV-CK-CONSISTENCY-01-01 (every affected dependent object is current).

### GODEV-SC-OVERALL-03 — Expected failure: A required verification gap prevents completion

A required `GOOS/GOARCH` target, dependency, named tool, environment, or reproducer remains unavailable. The
final account should name the affected obligation and stop the corresponding completion claim; substituting
another check fails.

#### Checklist

- [ ] GODEV-CK-OVERALL-03-01 — Every reproduction gap and every required verification gap remains explicit.
- [ ] GODEV-CK-OVERALL-03-04 — Every block names its missing prerequisite or first useful diagnostic, affected obligation, current evidence, risk, owner, retained state, first recovery action, and handoff.
- [ ] GODEV-CK-OVERALL-03-03 — Completion is not claimed across a required verification gap.
