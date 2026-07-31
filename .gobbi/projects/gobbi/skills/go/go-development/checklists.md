# Go Development Evaluation Checklist

Unchecked evaluation source for Go work governed by [Go Development](SKILL.md). Apply it to the exact work and
returned outcomes under evaluation.

[Evaluation](../../evaluation/SKILL.md) owns evidence, filled results, findings, and verdicts. This source owns
only reusable scenarios and unchecked conditions.

## Project

### GODEV-SC-PROJECT-01 — Normal case: The implementation contract is locked

The work has a defined author or read-only review mode, scope, success criteria, supported Go contract, target,
and permitted side effects. The returned outcome should satisfy that exact contract; implementation based on
an unstated local assumption fails.

#### Checklist

- [ ] GODEV-CK-PROJECT-01-01 — The work has one explicit author or read-only review mode.
- [ ] GODEV-CK-PROJECT-01-02 — Every changed or reviewed behavior belongs to the agreed scope.
- [ ] GODEV-CK-PROJECT-01-03 — The supported Go contract is explicit.
- [ ] GODEV-CK-PROJECT-01-04 — Every project side effect falls within task authority.
- [ ] GODEV-CK-PROJECT-01-05 — The success criteria are explicit.
- [ ] GODEV-CK-PROJECT-01-06 — The supported target is explicit.

### GODEV-SC-PROJECT-02 — Expected failure: A material ambiguity remains unresolved

An unanswered question could change scope, public behavior, compatibility, external effects, or destructive
action. The work should stop at that decision boundary; silently choosing one branch fails.

#### Checklist

- [ ] GODEV-CK-PROJECT-02-01 — No unresolved ambiguity determines scope.
- [ ] GODEV-CK-PROJECT-02-02 — No unresolved ambiguity determines public behavior.
- [ ] GODEV-CK-PROJECT-02-03 — No unresolved ambiguity determines compatibility.
- [ ] GODEV-CK-PROJECT-02-04 — No unresolved ambiguity determines external effects.
- [ ] GODEV-CK-PROJECT-02-05 — No unresolved ambiguity determines destructive effects.

### GODEV-SC-PROJECT-03 — Rule violation: The change expands beyond the task

The implementation includes an unrelated cleanup, dependency, refactor, public API, or generated change.
Every path should trace to the accepted outcome; useful but unauthorized work still fails.

#### Checklist

- [ ] GODEV-CK-PROJECT-03-01 — Every changed path traces to the task.
- [ ] GODEV-CK-PROJECT-03-02 — No new dependency exists outside the task.
- [ ] GODEV-CK-PROJECT-03-03 — No public API change exists outside the task.
- [ ] GODEV-CK-PROJECT-03-04 — Unrelated user work remains preserved.

## Structure

### GODEV-SC-STRUCTURE-01 — Normal case: The complete affected set is mapped

The change reaches packages, exported declarations, callers, tests, examples, docs, generated state, build
selection, module state, or release targets. The work should identify every consistency-bound surface before
design; a source-file-only view fails.

#### Checklist

- [ ] GODEV-CK-STRUCTURE-01-01 — Every affected package is identified.
- [ ] GODEV-CK-STRUCTURE-01-02 — Every affected caller is identified.
- [ ] GODEV-CK-STRUCTURE-01-03 — Every affected verification surface is identified.
- [ ] GODEV-CK-STRUCTURE-01-04 — Every affected documentation surface is identified.
- [ ] GODEV-CK-STRUCTURE-01-05 — Every affected generated surface is identified.
- [ ] GODEV-CK-STRUCTURE-01-06 — Every affected build surface is identified.
- [ ] GODEV-CK-STRUCTURE-01-07 — Every affected module surface is identified.
- [ ] GODEV-CK-STRUCTURE-01-08 — Every affected release surface is identified.

### GODEV-SC-STRUCTURE-02 — Normal case: CRUD and 5W1H expose propagation

The affected set has create, read, update, delete, and dependent co-touch effects. Ownership, behavior,
execution time, location, purpose, propagation, build, verification, release, and recovery should be
understood; an isolated edit plan fails.

#### Checklist

- [ ] GODEV-CK-STRUCTURE-02-01 — Every create effect is identified.
- [ ] GODEV-CK-STRUCTURE-02-02 — Every consistency read is identified.
- [ ] GODEV-CK-STRUCTURE-02-03 — Every update effect is identified.
- [ ] GODEV-CK-STRUCTURE-02-04 — Every delete effect is identified.
- [ ] GODEV-CK-STRUCTURE-02-05 — Every dependent co-touch is identified.
- [ ] GODEV-CK-STRUCTURE-02-06 — The behavior owner is identified.
- [ ] GODEV-CK-STRUCTURE-02-07 — The runtime boundary is identified.
- [ ] GODEV-CK-STRUCTURE-02-08 — The propagation boundary is identified.
- [ ] GODEV-CK-STRUCTURE-02-09 — The build boundary is identified.
- [ ] GODEV-CK-STRUCTURE-02-10 — The verification boundary is identified.
- [ ] GODEV-CK-STRUCTURE-02-11 — The release boundary is identified.
- [ ] GODEV-CK-STRUCTURE-02-12 — The recovery boundary is identified.

### GODEV-SC-STRUCTURE-03 — Poor quality: The first public shape is accepted without comparison

A package, function, method, type, interface, error, constructor, or dependency becomes caller-visible without
comparison to a viable alternative. The selected shape should be the simplest complete fit for real callers;
first-draft lock-in fails.

#### Checklist

- [ ] GODEV-CK-STRUCTURE-03-01 — A material caller-visible shape has at least one viable alternative.
- [ ] GODEV-CK-STRUCTURE-03-02 — The selected shape is justified by current callers.
- [ ] GODEV-CK-STRUCTURE-03-03 — The selected shape preserves the accepted compatibility position.

### GODEV-SC-STRUCTURE-04 — Poor quality: Detailed behavior precedes a compiling skeleton

Implementation logic accumulates before package placement, types, signatures, interfaces, errors, and
build-constrained boundaries compile together. Higher layers should grow from a verified foundation; a large
non-compiling first increment fails.

#### Checklist

- [ ] GODEV-CK-STRUCTURE-04-01 — Package placement exists before dependent behavior.
- [ ] GODEV-CK-STRUCTURE-04-02 — File placement exists before dependent behavior.
- [ ] GODEV-CK-STRUCTURE-04-03 — Caller-visible signatures compile before dependent behavior.
- [ ] GODEV-CK-STRUCTURE-04-04 — Build-constrained boundaries compile before dependent behavior.
- [ ] GODEV-CK-STRUCTURE-04-05 — The skeleton contains no placeholder behavior.

## Performance

### GODEV-SC-PERFORMANCE-01 — Normal case: Verification depth follows the actual risk

The implementation can affect ordinary behavior, concurrency, module resolution, input breadth, platform
selection, cgo, compatibility, or dependency exposure. The selected verification should cover each material
risk without substituting an unrelated broad command.

#### Checklist

- [ ] GODEV-CK-PERFORMANCE-01-01 — Focused verification exercises the changed behavior.
- [ ] GODEV-CK-PERFORMANCE-01-02 — Every material cross-package effect has applicable verification.
- [ ] GODEV-CK-PERFORMANCE-01-03 — Every material platform risk has applicable verification.
- [ ] GODEV-CK-PERFORMANCE-01-04 — Every material cgo risk has applicable verification.
- [ ] GODEV-CK-PERFORMANCE-01-05 — Every material concurrency risk has applicable verification.
- [ ] GODEV-CK-PERFORMANCE-01-06 — Every material module risk has applicable verification.

### GODEV-SC-PERFORMANCE-02 — Poor quality: Verification is blanket or under-scoped

The work runs an expensive repository-wide command without identifying risk, or only a focused test despite
cross-package, platform, race, cgo, or module effects. Verification cost and coverage should both match the
affected surface.

#### Checklist

- [ ] GODEV-CK-PERFORMANCE-02-01 — No broad verification layer lacks a task-specific coverage purpose.
- [ ] GODEV-CK-PERFORMANCE-02-02 — No affected dependent package is omitted.
- [ ] GODEV-CK-PERFORMANCE-02-03 — No applicable target-specific layer is omitted.

## Aesthetics

### GODEV-SC-AESTHETICS-01 — Normal case: The code and diff belong in the project

The complete change should use the project's Go conventions, ordinary control flow, clear ownership, and
reviewable slices. A reader should understand the implementation without reconstructing private author
context.

#### Checklist

- [ ] GODEV-CK-AESTHETICS-01-01 — Changed Go source follows the project formatter.
- [ ] GODEV-CK-AESTHETICS-01-02 — Changed names follow the project vocabulary.
- [ ] GODEV-CK-AESTHETICS-01-03 — Changed control flow exposes error decisions.
- [ ] GODEV-CK-AESTHETICS-01-04 — Changed control flow exposes ownership decisions.
- [ ] GODEV-CK-AESTHETICS-01-05 — The diff contains no unrelated churn.

### GODEV-SC-AESTHETICS-02 — Poor quality: Placeholders and stale language remain

The implementation functions on its main path but retains unconditional panics, deferred-work markers, filler
comments, obsolete names, ignored errors, or compatibility shims with no current owner. Incomplete
presentation and hidden obligations fail.

#### Checklist

- [ ] GODEV-CK-AESTHETICS-02-01 — No in-scope placeholder behavior remains.
- [ ] GODEV-CK-AESTHETICS-02-02 — No stale deferred-work marker remains in the affected set.
- [ ] GODEV-CK-AESTHETICS-02-03 — No affected error is ignored without a contract reason.
- [ ] GODEV-CK-AESTHETICS-02-04 — No obsolete compatibility shim remains.

## Usage

### GODEV-SC-USAGE-01 — Normal case: The caller-visible outcome matches the design

A library, command, service component, generator, helper, or cgo boundary has a concrete consumer path. The
caller should receive the designed values, errors, ownership, and compatibility behavior; internal success
without the promised consumer outcome fails.

#### Checklist

- [ ] GODEV-CK-USAGE-01-01 — The caller can reach the changed behavior through the intended surface.
- [ ] GODEV-CK-USAGE-01-02 — Caller-visible values match the accepted design.
- [ ] GODEV-CK-USAGE-01-03 — Caller-visible errors match the accepted design.
- [ ] GODEV-CK-USAGE-01-04 — Caller-visible ownership matches the accepted design.

### GODEV-SC-USAGE-02 — Expected failure: An unreproduced defect resists a guessed fix

The reported failure cannot be reproduced under the relevant toolchain, flags, input, or target. Production
code should remain unchanged until a diagnostic or test can distinguish the leading causes; a speculative
workaround fails.

#### Checklist

- [ ] GODEV-CK-USAGE-02-01 — The reproduction gap remains explicit.
- [ ] GODEV-CK-USAGE-02-02 — A diagnostic seam distinguishes the leading causes before production change.
- [ ] GODEV-CK-USAGE-02-03 — No speculative production workaround substitutes for reproduction.

### GODEV-SC-USAGE-03 — Edge case: A public change requires compatibility handling

An exported declaration, module consumer, serialized form, error identity, initialization path, or supported
Go floor changes. Existing users should keep their contract or receive an authorized migration or break;
accidental incompatibility fails.

#### Checklist

- [ ] GODEV-CK-USAGE-03-01 — Every affected consumer has a compatibility position.
- [ ] GODEV-CK-USAGE-03-02 — Every authorized migration is usable by affected consumers.
- [ ] GODEV-CK-USAGE-03-03 — Every authorized break is visible in caller documentation.

## Consistency

### GODEV-SC-CONSISTENCY-01 — Rule violation: Dependent surfaces remain stale

Code changes while one caller, test, example, document, generated file, build constraint, module file, or
release target still expresses the old behavior. Each verified slice should update all dependent surfaces;
partial propagation fails.

#### Checklist

- [ ] GODEV-CK-CONSISTENCY-01-01 — Every affected caller uses the current contract.
- [ ] GODEV-CK-CONSISTENCY-01-02 — Every affected test uses the current contract.
- [ ] GODEV-CK-CONSISTENCY-01-03 — Every affected example uses the current contract.
- [ ] GODEV-CK-CONSISTENCY-01-04 — Every affected document describes the current contract.
- [ ] GODEV-CK-CONSISTENCY-01-05 — Every affected generated surface matches the current contract.
- [ ] GODEV-CK-CONSISTENCY-01-06 — Every affected build surface matches the current contract.
- [ ] GODEV-CK-CONSISTENCY-01-07 — Every affected module surface matches the current contract.
- [ ] GODEV-CK-CONSISTENCY-01-08 — Every affected release surface matches the current contract.

### GODEV-SC-CONSISTENCY-02 — Rule violation: Read-only review rewrites the subject

Review mode formats, generates, tidies, fixes, or otherwise changes the files being assessed. A read-only
finding set should preserve the exact subject; improving it during review fails.

#### Checklist

- [ ] GODEV-CK-CONSISTENCY-02-01 — Review mode leaves source files byte-unchanged.
- [ ] GODEV-CK-CONSISTENCY-02-02 — Review mode leaves generated files byte-unchanged.
- [ ] GODEV-CK-CONSISTENCY-02-03 — Review mode leaves module files byte-unchanged.
- [ ] GODEV-CK-CONSISTENCY-02-04 — Review mode leaves workspace files byte-unchanged.

### GODEV-SC-CONSISTENCY-03 — Normal case: Decisions trace to implementation and assurance

Package placement, public shape, errors, ownership, concurrency, compatibility, and test seams were decided
before implementation. The final tree and returned account should express those same decisions.

#### Checklist

- [ ] GODEV-CK-CONSISTENCY-03-01 — Package placement matches the accepted design.
- [ ] GODEV-CK-CONSISTENCY-03-02 — Public shape matches the accepted design.
- [ ] GODEV-CK-CONSISTENCY-03-03 — Ownership matches the accepted design.
- [ ] GODEV-CK-CONSISTENCY-03-04 — Concurrency matches the accepted design.
- [ ] GODEV-CK-CONSISTENCY-03-05 — Error behavior matches the accepted design.
- [ ] GODEV-CK-CONSISTENCY-03-06 — Compatibility matches the accepted design.
- [ ] GODEV-CK-CONSISTENCY-03-07 — Test seams match the accepted design.
- [ ] GODEV-CK-CONSISTENCY-03-08 — Verification covers the accepted risk decisions.

### GODEV-SC-CONSISTENCY-04 — Edge case: Platform and cgo files form one contract

Build tags, file suffixes, platform-specific implementations, and cgo declarations select different code for
supported targets. Each selected set should expose compatible behavior and required resources; host-only
consistency fails.

#### Checklist

- [ ] GODEV-CK-CONSISTENCY-04-01 — Every supported target selects a complete source set.
- [ ] GODEV-CK-CONSISTENCY-04-02 — Platform-specific implementations preserve the shared public contract.
- [ ] GODEV-CK-CONSISTENCY-04-03 — Every cgo target has its required external build inputs.

## Risk

### GODEV-SC-RISK-01 — Adversarial: Local or sensitive state enters the diff

The change accidentally includes secrets, credentials, private paths, temporary replacements, caches,
generated scratch output, or unrelated user edits. Task-owned files should contain no workstation or trust
boundary leakage.

#### Checklist

- [ ] GODEV-CK-RISK-01-01 — No changed file contains a secret.
- [ ] GODEV-CK-RISK-01-02 — No changed file contains a credential.
- [ ] GODEV-CK-RISK-01-03 — No changed file contains a workstation-local path.
- [ ] GODEV-CK-RISK-01-04 — No temporary module replacement remains.
- [ ] GODEV-CK-RISK-01-05 — No temporary workspace replacement remains.
- [ ] GODEV-CK-RISK-01-06 — No unrelated user edit is absorbed into the task.

### GODEV-SC-RISK-02 — Rule violation: A false pass claim hides missing verification

A check was unavailable, skipped, unsupported, cached without useful coverage, or run against another target,
yet the work represents it as passed. Returned assurance should reflect the exact executed surface.

#### Checklist

- [ ] GODEV-CK-RISK-02-01 — Every unavailable check remains classified as unavailable.
- [ ] GODEV-CK-RISK-02-02 — Every skipped check remains classified as skipped.
- [ ] GODEV-CK-RISK-02-03 — Every unsupported target remains classified as unsupported.
- [ ] GODEV-CK-RISK-02-04 — Every pass claim names the target it exercised.

### GODEV-SC-RISK-03 — Adversarial: A workaround masks the root cause

The implementation suppresses a diagnostic, loosens an assertion, retries nondeterminism, or special-cases the
reported input while the underlying failure remains. The change should remove the reproduced cause; cosmetic
success fails.

#### Checklist

- [ ] GODEV-CK-RISK-03-01 — No diagnostic is suppressed instead of resolving its cause.
- [ ] GODEV-CK-RISK-03-02 — No assertion is weakened instead of resolving its cause.
- [ ] GODEV-CK-RISK-03-03 — No retry hides unresolved nondeterminism.
- [ ] GODEV-CK-RISK-03-04 — No reported input receives a cause-free special case.

### GODEV-SC-RISK-04 — Edge case: Generated Go appears directly editable

A generated file contains the visible defect or desired behavior. The durable source and declared generator
should own the change unless the project explicitly treats the file as editable source; a hand-edited output
that regeneration erases fails.

#### Checklist

- [ ] GODEV-CK-RISK-04-01 — Every generated change originates from its owned source.
- [ ] GODEV-CK-RISK-04-02 — Every generated change uses the declared generator.
- [ ] GODEV-CK-RISK-04-03 — Regeneration preserves every accepted generated change.

## Overall

### GODEV-SC-OVERALL-01 — Normal case: The complete development outcome is coherent

Author mode should return a scoped, project-consistent, current, verified tree. Review mode should return an
evidence-backed finding set without mutation. Either outcome should explain the design, affected surface,
compatibility, targets, checks, gaps, and remaining concerns.

#### Checklist

- [ ] GODEV-CK-OVERALL-01-01 — The final outcome matches the selected mode.
- [ ] GODEV-CK-OVERALL-01-02 — Every in-scope surface is complete.
- [ ] GODEV-CK-OVERALL-01-03 — Every completion claim matches the exact final tree.

### GODEV-SC-OVERALL-02 — Adversarial: A focused green test masks incomplete work

One narrow test passes while a caller, document, generated artifact, module state, platform target, race path,
or original reproducer remains stale or unverified. Local test success must not substitute for whole-task
completion.

#### Checklist

- [ ] GODEV-CK-OVERALL-02-01 — Acceptance is not based solely on one focused test.
- [ ] GODEV-CK-OVERALL-02-02 — Every affected dependent surface is current.
- [ ] GODEV-CK-OVERALL-02-03 — The original observable path remains covered.

### GODEV-SC-OVERALL-03 — Expected failure: A required verification gap prevents completion

A required target, dependency, tool, environment, or reproducer remains unavailable. The final account should
name the affected obligation and stop the corresponding completion claim; substituting another check fails.

#### Checklist

- [ ] GODEV-CK-OVERALL-03-01 — Every required verification gap remains explicit.
- [ ] GODEV-CK-OVERALL-03-02 — Every gap identifies the affected obligation.
- [ ] GODEV-CK-OVERALL-03-03 — Completion is not claimed across a required verification gap.
