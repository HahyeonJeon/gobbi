# Go Development Evaluation Checklist

Unchecked evaluation source for Go work governed by [Go Development](SKILL.md). Apply it to the exact work and
returned outcomes under evaluation.

[Evaluation](../../evaluation/SKILL.md) owns evidence, filled results, findings, and verdicts. This source owns
only reusable scenarios and unchecked conditions.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### GODEV-SC-PROJECT-01 — Normal case: The implementation contract is locked

The work has a defined author or read-only review mode, scope, success criteria, supported Go contract, target,
and permitted side effects. The returned outcome should satisfy that exact contract; implementation based on
an unstated local assumption fails.

#### Checklist

- [ ] GODEV-CK-PROJECT-01-01 — The declared author or read-only review mode, supported Go contract, success criteria, and supported target are each explicit.
- [ ] GODEV-CK-PROJECT-01-02 — Every changed or reviewed behavior and every project side effect stays inside the agreed scope and task authority.

### GODEV-SC-PROJECT-02 — Expected failure: A material ambiguity remains unresolved

An unanswered question could change scope, public behavior, compatibility, external effects, or destructive
action. The work should stop at that decision boundary; silently choosing one branch fails.

#### Checklist

- [ ] GODEV-CK-PROJECT-02-01 — No unresolved ambiguity determines scope, public behavior, compatibility, external effects, or destructive effects.

### GODEV-SC-PROJECT-03 — Rule violation: The change expands beyond the task

The implementation includes an unrelated cleanup, dependency, refactor, public API, or generated change.
Every path should trace to the accepted outcome; useful but unauthorized work still fails.

#### Checklist

- [ ] GODEV-CK-PROJECT-03-01 — Every changed path, new dependency, and public API change traces to the task.
- [ ] GODEV-CK-PROJECT-03-02 — Unrelated user work in the working tree remains preserved.

## Structure

### GODEV-SC-STRUCTURE-01 — Normal case: The complete affected set is mapped

The change reaches packages, exported declarations, callers, tests, examples, docs, generated state, build
selection, module state, or release targets. The work should identify every consistency-bound surface before
design; a source-file-only view fails.

#### Checklist

- [ ] GODEV-CK-STRUCTURE-01-01 — Every affected package, caller, verification surface, documentation surface, generated surface, build surface, module surface, and release surface is identified.

### GODEV-SC-STRUCTURE-02 — Normal case: CRUD and 5W1H expose propagation

The affected set has create, read, update, delete, and dependent co-touch effects. Ownership, behavior,
execution time, location, purpose, propagation, build, verification, release, and recovery should be
understood; an isolated edit plan fails.

#### Checklist

- [ ] GODEV-CK-STRUCTURE-02-01 — Every create, consistency-read, update, delete, and dependent co-touch effect across the affected set is identified.
- [ ] GODEV-CK-STRUCTURE-02-02 — The behavior owner and the runtime, propagation, build, verification, release, and recovery boundaries are identified.

### GODEV-SC-STRUCTURE-03 — Poor quality: The first public shape is accepted without comparison

A package, function, method, type, interface, error, constructor, or dependency becomes caller-visible without
comparison to a viable alternative. The selected shape should be the simplest complete fit for real callers;
first-draft lock-in fails.

#### Checklist

- [ ] GODEV-CK-STRUCTURE-03-01 — Every material caller-visible shape has at least one compared viable alternative.
- [ ] GODEV-CK-STRUCTURE-03-02 — The selected shape is justified by current callers.
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

The work runs an expensive repository-wide command without identifying risk, or only a focused test despite
cross-package, platform, race, cgo, or module effects. Verification cost and coverage should both match the
affected surface.

#### Checklist

- [ ] GODEV-CK-PERFORMANCE-02-01 — Every broad verification layer that was run has a task-specific coverage purpose.
- [ ] GODEV-CK-PERFORMANCE-02-02 — No affected dependent package or applicable target-specific verification layer is omitted.

## Aesthetics

### GODEV-SC-AESTHETICS-01 — Normal case: The code and diff belong in the project

The complete change should use the project's Go conventions, ordinary control flow, clear ownership, and
reviewable slices. A reader should understand the implementation without reconstructing private author
context.

#### Checklist

- [ ] GODEV-CK-AESTHETICS-01-01 — Changed Go source follows the project formatter and naming vocabulary.
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

- [ ] GODEV-CK-USAGE-01-01 — The caller can reach the changed behavior through the intended surface.
- [ ] GODEV-CK-USAGE-01-02 — Caller-visible values, errors, and ownership match the accepted design.

### GODEV-SC-USAGE-02 — Expected failure: An unreproduced defect resists a guessed fix

The reported failure cannot be reproduced under the relevant toolchain, flags, input, or target. Production
code should remain unchanged until a diagnostic or test can distinguish the leading causes; a speculative
workaround fails.

#### Checklist

- [ ] GODEV-CK-USAGE-02-01 — A diagnostic or test seam distinguishes the leading causes before production code changes.
- [ ] GODEV-CK-USAGE-02-02 — No speculative production workaround substitutes for reproduction.
- Also applies: GODEV-CK-OVERALL-03-01 (the reproduction gap remains explicit).

### GODEV-SC-USAGE-03 — Edge case: A public change requires compatibility handling

An exported declaration, module consumer, serialized form, error identity, initialization path, or supported
Go floor changes. Existing users should keep their contract or receive an authorized migration or break;
accidental incompatibility fails.

#### Checklist

- [ ] GODEV-CK-USAGE-03-01 — Every affected consumer has a stated compatibility position.
- [ ] GODEV-CK-USAGE-03-02 — Every authorized migration is usable by affected consumers.
- [ ] GODEV-CK-USAGE-03-03 — Every authorized break is visible in caller documentation.

## Consistency

### GODEV-SC-CONSISTENCY-01 — Rule violation: Dependent surfaces remain stale

Code changes while one caller, test, example, document, generated file, build constraint, module file, or
release target still expresses the old behavior. Each verified slice should update all dependent surfaces;
partial propagation fails.

#### Checklist

- [ ] GODEV-CK-CONSISTENCY-01-01 — Every affected caller, test, example, document, generated surface, build surface, module surface, and release surface expresses the current contract.

### GODEV-SC-CONSISTENCY-02 — Rule violation: Read-only review rewrites the subject

Review mode formats, generates, tidies, fixes, or otherwise changes the files being assessed. A read-only
finding set should preserve the exact subject; improving it during review fails.

#### Checklist

- [ ] GODEV-CK-CONSISTENCY-02-01 — Review mode leaves source, generated, module, and workspace files byte-unchanged.

### GODEV-SC-CONSISTENCY-03 — Normal case: Decisions trace to implementation and assurance

Package placement, public shape, errors, ownership, concurrency, compatibility, and test seams were decided
before implementation. The final tree and returned account should express those same decisions.

#### Checklist

- [ ] GODEV-CK-CONSISTENCY-03-01 — Package placement, public shape, ownership, concurrency, error behavior, compatibility, and test seams match the accepted design.
- Also applies: GODEV-CK-PERFORMANCE-01-02 (verification covers the accepted risk decisions).

### GODEV-SC-CONSISTENCY-04 — Edge case: Platform and cgo files form one contract

Build tags, file suffixes, platform-specific implementations, and cgo declarations select different code for
supported targets. Each selected set should expose compatible behavior and required resources; host-only
consistency fails.

#### Checklist

- [ ] GODEV-CK-CONSISTENCY-04-01 — Every supported target resolves a complete build input set, including its selected source files and required cgo inputs.
- [ ] GODEV-CK-CONSISTENCY-04-02 — Platform-specific implementations preserve the shared public contract.

### GODEV-SC-CONSISTENCY-05 — Adversarial: Documentation is written to match the claim

A doc comment, example, README, or handoff account is written from the intended behavior while the
implementation does something else, so the account and the review agree with each other but not with the code.
Documentation should be derived from the implemented behavior; a self-consistent account that contradicts the
code fails.

#### Checklist

- [ ] GODEV-CK-CONSISTENCY-05-01 — Every changed doc comment, example, document statement, and handoff claim is derived from the implemented behavior.
- [ ] GODEV-CK-CONSISTENCY-05-02 — Every runnable example builds and passes against the current implementation.

## Risk

### GODEV-SC-RISK-01 — Rule violation: Local or sensitive state enters the diff

The change accidentally includes secrets, credentials, private paths, temporary replacements, caches,
generated scratch output, or unrelated user edits. Task-owned files should contain no workstation or trust
boundary leakage.

#### Checklist

- [ ] GODEV-CK-RISK-01-01 — No changed file carries a secret, credential, workstation-local path, temporary module or workspace replacement, cache, or generated scratch output.
- Also applies: GODEV-CK-PROJECT-03-02 (unrelated user work preserved).

### GODEV-SC-RISK-02 — Rule violation: A false pass claim hides missing verification

A check was unavailable, skipped, unsupported, cached without useful coverage, or run against another target,
yet the work represents it as passed. Returned assurance should reflect the exact executed surface.

#### Checklist

- [ ] GODEV-CK-RISK-02-01 — Every unavailable check, skipped check, uselessly cached result, and unsupported target remains classified as such.
- [ ] GODEV-CK-RISK-02-02 — Every pass claim names the exact target it exercised.

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

An ordinary change runs formatters, generators, module commands, and tests that write to the working tree,
while staging, commits, publication, cleanup, and persistent toolchain configuration belong to their owning
workflow. The ordinary success path should keep every write inside task authority and leave the owner's
actions untaken; a convenient extra action fails.

#### Checklist

- [ ] GODEV-CK-RISK-05-01 — Every working-tree write on the ordinary path stays inside task authority.
- [ ] GODEV-CK-RISK-05-02 — No staging, commit, publication, cleanup, or persistent toolchain-configuration action is taken from this operation.

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
- [ ] GODEV-CK-OVERALL-02-02 — The original observable path remains covered.
- Also applies: GODEV-CK-CONSISTENCY-01-01 (every affected dependent surface is current).

### GODEV-SC-OVERALL-03 — Expected failure: A required verification gap prevents completion

A required target, dependency, tool, environment, or reproducer remains unavailable. The final account should
name the affected obligation and stop the corresponding completion claim; substituting another check fails.

#### Checklist

- [ ] GODEV-CK-OVERALL-03-01 — Every reproduction gap and every required verification gap remains explicit.
- [ ] GODEV-CK-OVERALL-03-02 — Every required verification gap names the affected obligation.
- [ ] GODEV-CK-OVERALL-03-03 — Completion is not claimed across a required verification gap.
