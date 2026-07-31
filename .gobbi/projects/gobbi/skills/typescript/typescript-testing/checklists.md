# TypeScript Testing Evaluation Checklist

This reusable unchecked source evaluates one set of TypeScript tests created or reviewed under this operation.
It is governed by the [`typescript`](../SKILL.md) domain and [`typescript-testing`](SKILL.md) operation, with
[`typescript-packaging`](../typescript-packaging/SKILL.md) owning the package contract its consumer evidence
exercises and [`typescript-toolchain`](../typescript-toolchain/SKILL.md) owning the compiler and resolution
profiles it runs under. The source commit that contains this file identifies the checklist version. Its stable
owner prefix is `TSTEST`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### TSTEST-SC-PROJECT-01 — Normal case: the evidence plan comes from the claims

Tests exist to disprove specific claims, so the claims come first and the layers follow. The expected outcome
enumerates what the work asserts and selects the check able to disprove each. Choosing a familiar layer and
fitting claims to it afterwards is the failure.

#### Checklist

- [ ] TSTEST-CK-PROJECT-01-01 — Observable behaviors, failure paths, cleanup obligations, type relationships, rejected programs, public declarations, package resolution paths, and taught examples are enumerated as claims.
- [ ] TSTEST-CK-PROJECT-01-02 — Runtime, type-level, negative, declaration, package, and example checks are selected from the claims being made.
- [ ] TSTEST-CK-PROJECT-01-03 — Every claim is mapped to the layer capable of disproving it.

### TSTEST-SC-PROJECT-02 — Rule violation: a review-only run changes the target

A test review can run and inspect everything, and the tempting next step is to fix what it finds. The expected
outcome marks review-only mode and reports findings. Editing production or test files under that mode breaks
the authority the run was given.

#### Checklist

- [ ] TSTEST-CK-PROJECT-02-01 — Review-only mode is marked whenever edits are not authorized.
- [ ] TSTEST-CK-PROJECT-02-02 — No production or test file is changed in review-only mode, and findings are reported instead.

## Structure

### TSTEST-SC-STRUCTURE-01 — Normal case: nondeterminism is controlled at explicit seams

Time, randomness, scheduling, I/O, processes, and external services decide whether an observation repeats. The
expected outcome identifies those dependencies, controls them at injected or faked boundaries that preserve
the behavior under test, and bounds whatever cannot be controlled.

#### Checklist

- [ ] TSTEST-CK-STRUCTURE-01-01 — Time, randomness, network, filesystem, process, event, and scheduler dependencies are identified.
- [ ] TSTEST-CK-STRUCTURE-01-02 — Time, randomness, scheduling, I/O, and host state are controlled wherever deterministic observation is required.
- [ ] TSTEST-CK-STRUCTURE-01-03 — Project-standard fakes or injected boundaries are used while preserving the behavior under test.
- [ ] TSTEST-CK-STRUCTURE-01-04 — Unavoidable nondeterminism is recorded with the evidence that bounds it.

### TSTEST-SC-STRUCTURE-02 — Poor quality: the test is bound to private structure

The test passes and covers the behavior, but it asserts call order or internal shape, so an unrelated
refactoring turns it red. The expected outcome asserts only what the named contract owns, unless that internal
structure is itself the contract.

#### Checklist

- [ ] TSTEST-CK-STRUCTURE-02-01 — No assertion is tied only to implementation order or private structure unless that structure is the contract.
- [ ] TSTEST-CK-STRUCTURE-02-02 — No test fails for a change that preserves the contract it names.

## Performance

### TSTEST-SC-PERFORMANCE-01 — Poor quality: the suite runs but its result is unreliable

Every gate reports green while cases are skipped, quarantined, or intermittently failing, so the run costs
time without producing trustworthy evidence. The expected outcome reads fresh output for those states and runs
focused checks before the broader gates.

#### Checklist

- [ ] TSTEST-CK-PERFORMANCE-01-01 — Fresh output is reviewed for skipped, quarantined, flaky, and unexpectedly absent cases.
- [ ] TSTEST-CK-PERFORMANCE-01-02 — Focused runtime and type checks are run before the broader test, declaration, build, and package gates.

### TSTEST-SC-PERFORMANCE-02 — Edge case: discovery finds nothing to run

A glob, a project reference, or an extraction step matches zero tests or examples, and an empty run reports
success in a fraction of the usual time. The expected outcome fails closed wherever discovery is part of the
claim.

#### Checklist

- [ ] TSTEST-CK-PERFORMANCE-02-01 — A run that discovers zero tests or examples fails closed wherever discovery is part of the claim.

## Aesthetics

### TSTEST-SC-AESTHETICS-01 — Poor quality: a failure that does not say what broke

The test catches the defect but its output cannot be read: runtime assertions and compile-time claims are
mixed, and a diagnostic-sensitive case accepts any error. The expected outcome keeps each claim in its own
form and narrows diagnostic expectations to the misuse they target.

#### Checklist

- [ ] TSTEST-CK-AESTHETICS-01-01 — Runtime assertions are kept separate from compile-time claims.
- [ ] TSTEST-CK-AESTHETICS-01-02 — Every diagnostic-sensitive test is narrow enough to reject the targeted misuse rather than any arbitrary error.

## Usage

### TSTEST-SC-USAGE-01 — Normal case: the test observes what a consumer observes

A consumer sees outputs, state transitions, events, side effects, failures, and released resources. The
expected outcome reaches the unit through that surface and asserts those observations, including cleanup on
every exit. A test that reaches past the public surface proves something the consumer cannot rely on.

#### Checklist

- [ ] TSTEST-CK-USAGE-01-01 — The unit is reached through its public or user-visible surface.
- [ ] TSTEST-CK-USAGE-01-02 — Outputs, state transitions, emitted events, side effects, and failures that consumers observe are asserted.
- [ ] TSTEST-CK-USAGE-01-03 — Cleanup is verified after success, failure, cancellation, and early exit wherever resources are involved.

### TSTEST-SC-USAGE-02 — Normal case: declarations and resolution are proved from outside the project

The source project resolves its own paths and types in ways an installed consumer cannot. The expected outcome
type-checks isolated consumer fixtures against the emitted declarations and exercises the installed artifact's
entry points and resolution modes. Evidence collected only inside the source project is the failure.

#### Checklist

- [ ] TSTEST-CK-USAGE-02-01 — Public declarations and resolution are tested from a consumer boundary rather than only inside the source project.
- [ ] TSTEST-CK-USAGE-02-02 — The public declarations are emitted or obtained and isolated consumer fixtures are type-checked against them.
- [ ] TSTEST-CK-USAGE-02-03 — The package is built or packed, that artifact is installed, and its documented entry points and resolution modes are exercised.
- [ ] TSTEST-CK-USAGE-02-04 — Declaration or API surfaces are compared wherever compatibility is part of the contract.

### TSTEST-SC-USAGE-03 — Normal case: documented examples compile as they are taught

Readers copy documented examples and expect them to work. The expected outcome extracts every example the
documentation claims is executable, compiles it under its declared category, and states what the example
profile does not prove. An example that drifts from the code it teaches is the failure.

#### Checklist

- [ ] TSTEST-CK-USAGE-03-01 — Every fenced TypeScript example the documentation claims is executable is extracted.
- [ ] TSTEST-CK-USAGE-03-02 — Each extracted example is compiled according to its declared category among positive, partial-with-prelude, expected-error, and type-level.
- [ ] TSTEST-CK-USAGE-03-03 — The example profile's limit is stated: it verifies compatible teaching fragments and does not prove every runtime host, compiler profile, or package artifact mode.

## Consistency

### TSTEST-SC-CONSISTENCY-01 — Rule violation: source-checkout evidence offered for package behavior

The suite passes in the checkout, and the same code is what the package will ship, so the result looks
transferable. The expected outcome keeps package claims on package evidence. A source-checkout pass presented
as built or packed behavior breaks the Rule.

#### Checklist

- [ ] TSTEST-CK-CONSISTENCY-01-01 — No source-checkout test result is treated as proof of built or packed package behavior.
- Also applies: TSTEST-CK-USAGE-02-03 (the installed artifact is exercised).

### TSTEST-SC-CONSISTENCY-02 — Normal case: claims and tests agree in both directions

Coverage drifts when a claim loses its test or a test outlives the contract it was written for. The expected
outcome traces every claim to a current test and every test back to a named contract.

#### Checklist

- [ ] TSTEST-CK-CONSISTENCY-02-01 — Every claim maps to at least one current test.
- [ ] TSTEST-CK-CONSISTENCY-02-02 — Every test maps to a named contract.

## Risk

### TSTEST-SC-RISK-01 — Rule violation: a type assertion used as type evidence

Writing `as` inside a test makes the compiler accept the line and proves nothing about the relationship the
test claims. The expected outcome asserts type relationships with helpers that fail on mismatch. An assertion
offered as the type evidence breaks the Rule while the test still passes.

#### Checklist

- [ ] TSTEST-CK-RISK-01-01 — No type assertion inside a test is used as evidence that the asserted type is true.
- [ ] TSTEST-CK-RISK-01-02 — Inferred and declared relationships are asserted with type-level helpers that fail on mismatch.

### TSTEST-SC-RISK-02 — Expected failure: an invalid program must be rejected

Negative and expected-error tests exist to prove that the compiler refuses a misuse, and they silently stop
proving it when the misuse becomes legal. The expected outcome verifies the failure power of each expectation
in both directions.

#### Checklist

- [ ] TSTEST-CK-RISK-02-01 — Every expected-error or negative test is proved to fail when its expectation is removed or inverted.
- [ ] TSTEST-CK-RISK-02-02 — Removing an expectation produces the intended diagnostic.
- [ ] TSTEST-CK-RISK-02-03 — An unused expectation fails the run.

### TSTEST-SC-RISK-03 — Normal case: concurrent behavior is observed rather than assumed

Overlapping operations, cancellation, and background rejections decide whether an asynchronous contract holds.
The expected outcome controls completion order, asserts the intended lifetime behavior, and observes every
rejection. A suite that can stay green while work fails in the background is the failure.

#### Checklist

- [ ] TSTEST-CK-RISK-03-01 — Completion order is controlled and overlapping operations are tested with inverted results.
- [ ] TSTEST-CK-RISK-03-02 — Cancellation is distinguished from stale-result suppression and the intended one is asserted.
- [ ] TSTEST-CK-RISK-03-03 — Every rejection is observed so no test can pass with a background failure.

## Overall

### TSTEST-SC-OVERALL-01 — Adversarial: a test that cannot fail for the defect it names

A broad assertion, an accepted snapshot, or a case written after the implementation can cover the code, report
green, and stay green when the behavior it claims to protect is broken. The expected outcome states the defect
each test must catch and demonstrates the failure; coverage accepted as failure power is the failure.

#### Checklist

- [ ] TSTEST-CK-OVERALL-01-01 — The mutation or controlled defect that would make each test fail is defined.
- [ ] TSTEST-CK-OVERALL-01-02 — The named defect is introduced or simulated where practical and the test is confirmed to fail for the expected reason.
- [ ] TSTEST-CK-OVERALL-01-03 — The accepted implementation is restored and the focused test is run fresh afterwards.
- [ ] TSTEST-CK-OVERALL-01-04 — No snapshot or broad assertion that passes under the named defect is retained.

### TSTEST-SC-OVERALL-02 — Expected failure: a host, tool, or package mode is unavailable

Part of the claimed contract cannot be exercised because the host, tool, or package mode is missing here. The
expected outcome records the gap as a limitation and keeps the unproved claim unproved. Letting another
layer's pass stand in for the missing one is the failure.

#### Checklist

- [ ] TSTEST-CK-OVERALL-02-01 — Every unavailable host, tool, and package mode is recorded as a limitation.
- [ ] TSTEST-CK-OVERALL-02-02 — No layer's result is reported as evidence for a claim that a different, unavailable layer owns.
