# TypeScript Testing Evaluation Checklist

This reusable unchecked source evaluates one set of TypeScript tests created or reviewed under this operation.
It is governed by the [`typescript`](../SKILL.md) domain and [`typescript-testing`](SKILL.md) operation, with
[`typescript-packaging`](../typescript-packaging/SKILL.md) defining the package metadata its consumer checks
exercise and [`typescript-toolchain`](../typescript-toolchain/SKILL.md) defining the exact `tsconfig.json` files and
resolution modes they use. The source commit that contains this file identifies the checklist version. Its
stable checklist prefix is `TSTEST`.

The [project-kind checklist](project-kind-checklists.md) separately evaluates kind selection and the web,
command-line, library, SDK, desktop, and fallback consumer paths.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its defining scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### TSTEST-SC-PROJECT-01 — Normal case: the verification plan comes from the claims

Tests exist to disprove specific claims, so the claims come first and the layers follow. The expected outcome
enumerates what the change asserts and selects the check able to disprove each. Choosing a familiar layer and
fitting claims to it afterwards is the failure.

#### Checklist

- [ ] TSTEST-CK-PROJECT-01-01 — Caller-visible behaviors, failure paths, cleanup obligations, type relationships, rejected programs, public declarations, package resolution paths, command distribution and invocation paths, and taught examples are enumerated as claims for every selected project kind.
- [ ] TSTEST-CK-PROJECT-01-02 — Every TypeScript compiler version claimed for package consumers or taught examples is recorded.
- [ ] TSTEST-CK-PROJECT-01-03 — Every claim is mapped to the layer capable of disproving it.
- [ ] TSTEST-CK-PROJECT-01-04 — Every applicable ordinary, limit, failure, cancellation, and adversarial case for the tested claims is included.

### TSTEST-SC-PROJECT-02 — Rule violation: a review-only run crosses its authority boundary

A test review may inspect existing files. When review-only package validation applies, it may also inspect
existing generated package output and a pre-existing package archive. With command authority, it may create
command state inside a named temporary directory or isolated disposable consumer outside reviewed files,
remove those writes after review, and install that archive in the disposable consumer. The expected outcome
reports results without changing the reviewed subject, installing persistently, or publishing. Crossing any
of those boundaries is the failure.

#### Checklist

- [ ] TSTEST-CK-PROJECT-02-01 — Review-only mode is marked whenever edits are not authorized.
- [ ] TSTEST-CK-PROJECT-02-02 — Every review-only write is confined to a named temporary directory or isolated disposable consumer outside production, test, package, documentation, and release-note files.
- [ ] TSTEST-CK-PROJECT-02-03 — Review-only mode returns command results, findings, and limitations rather than applying a finding.
- [ ] TSTEST-CK-PROJECT-02-04 — Nothing is published in review-only mode.
- [ ] TSTEST-CK-PROJECT-02-05 — All command state created by the review is removed before the review finishes.

## Structure

### TSTEST-SC-STRUCTURE-01 — Normal case: nondeterminism is controlled at explicit adapters

Time, randomness, scheduling, I/O, processes, and external services decide whether an observation repeats. The
expected outcome identifies those dependencies, controls them at injected or faked adapters that preserve
the behavior under test, and bounds whatever cannot be controlled.

#### Checklist

- [ ] TSTEST-CK-STRUCTURE-01-01 — Time, randomness, network, filesystem, process, event, and scheduler dependencies are identified.
- [ ] TSTEST-CK-STRUCTURE-01-02 — Time, randomness, scheduling, I/O, and named-runtime state are controlled wherever deterministic observation is required.
- [ ] TSTEST-CK-STRUCTURE-01-03 — Project-standard fakes or injected adapters are used while preserving the behavior under test.
- [ ] TSTEST-CK-STRUCTURE-01-04 — Unavoidable nondeterminism is recorded with the repeated or statistical result that bounds it.

### TSTEST-SC-STRUCTURE-02 — Poor quality: the test is bound to private structure

The test passes and covers the behavior, but it asserts call order or internal shape, so an unrelated
refactoring turns it red. The expected outcome asserts only what the named requirement specifies, unless that internal
structure is itself an explicit requirement.

#### Checklist

- [ ] TSTEST-CK-STRUCTURE-02-01 — No assertion is tied only to implementation order or private structure unless that structure is an explicit requirement.
- [ ] TSTEST-CK-STRUCTURE-02-02 — No test fails for a change that preserves the requirement it names.

## Performance

### TSTEST-SC-PERFORMANCE-01 — Poor quality: the suite runs but its result is unreliable

Every check reports green while cases are skipped, quarantined, or intermittently failing, so the run costs
time without producing a trustworthy result. The expected outcome reads output from the final-tree run for those states and runs
focused checks before the broader checks.

#### Checklist

- [ ] TSTEST-CK-PERFORMANCE-01-01 — Output from the final-tree run is reviewed for skipped, quarantined, flaky, and unexpectedly absent cases.
- [ ] TSTEST-CK-PERFORMANCE-01-02 — Focused runtime and type checks are run before the broader test, declaration, build, and package checks.

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
form and narrows diagnostic expectations to the misuse they identify.

#### Checklist

- [ ] TSTEST-CK-AESTHETICS-01-01 — Runtime assertions are kept separate from compile-time claims.
- [ ] TSTEST-CK-AESTHETICS-01-02 — Every diagnostic-sensitive test is narrow enough to reject the targeted misuse rather than any arbitrary error.

## Usage

### TSTEST-SC-USAGE-01 — Normal case: the test observes what a consumer observes

A consumer sees outputs, state transitions, events, side effects, failures, and released resources. The
expected outcome reaches the unit through its public API, recorded consumer command, or user-visible interface.
It asserts those observations, including cleanup on every exit. A test of private implementation proves
something the consumer cannot rely on.

#### Checklist

- [ ] TSTEST-CK-USAGE-01-01 — The unit is reached through its public API, recorded consumer command, or user-visible interface.
- [ ] TSTEST-CK-USAGE-01-02 — Outputs, state transitions, emitted events, side effects, and failures that consumers observe are asserted.
- [ ] TSTEST-CK-USAGE-01-03 — Cleanup is verified after success, failure, cancellation, and early exit wherever resources are involved.

### TSTEST-SC-USAGE-02 — Normal case: declarations are proved from an isolated consumer project

The source project resolves its own types in ways an installed consumer cannot. The expected outcome
type-checks isolated consumer fixtures against the emitted declarations and compares the public declarations
wherever compatibility is promised. Declaration results collected only inside the source project are the
failure.

#### Checklist

- [ ] TSTEST-CK-USAGE-02-01 — Representative valid uses compile through the public API.
- [ ] TSTEST-CK-USAGE-02-02 — The public declarations are emitted or obtained.
- [ ] TSTEST-CK-USAGE-02-03 — Isolated consumer fixtures are type-checked against the public declarations.
- [ ] TSTEST-CK-USAGE-02-04 — Public declarations or exported APIs are compared wherever compatibility is a stated requirement.

### TSTEST-SC-USAGE-03 — Normal case: documented examples compile as they are taught

Readers copy documented examples and expect them to compile. The expected outcome extracts every `ts` example,
compiles it exactly as displayed with named compiler versions and options, verifies intentional errors, and
states what those compiler runs do not prove. An example that drifts from the code it teaches is the failure.

#### Checklist

- [ ] TSTEST-CK-USAGE-03-01 — Every fenced `ts` example presented as valid or intentionally rejected is extracted exactly as displayed.
- [ ] TSTEST-CK-USAGE-03-03 — The check's limit is stated: it proves only those examples under the recorded compiler versions and options, not every named runtime, project `tsconfig.json`, or installed package path.
- [ ] TSTEST-CK-USAGE-03-04 — Every extracted example is compiled with each named compiler version and the recorded compiler options.
- Also applies: TSTEST-CK-RISK-02-02 (removing an expectation produces the intended diagnostic).
- Also applies: TSTEST-CK-RISK-02-03 (an unused expectation fails the run).

### TSTEST-SC-USAGE-04 — Normal case: resolution is proved on the installed package archive

A package archive carries different files, entry points, and resolution conditions than the checkout it came
from. The expected outcome installs what a consumer would receive and exercises its documented entry
points and resolution modes there. A resolution result taken from the source project is the failure.

#### Checklist

- [ ] TSTEST-CK-USAGE-04-01 — In author mode the package is built or packed; in review-only package validation generated package output is inspected only when it already exists and is not built or rebuilt.
- [ ] TSTEST-CK-USAGE-04-02 — In author mode the package archive is installed into an isolated consumer; in review-only package validation every inspected or installed archive existed before the review, is not created or recreated, and is installed only into an isolated disposable consumer rather than a persistent environment.
- [ ] TSTEST-CK-USAGE-04-03 — The installed package's documented entry points and documented resolution modes are exercised.

## Consistency

### TSTEST-SC-CONSISTENCY-01 — Rule violation: a source-checkout result offered for package behavior

The suite passes in the checkout, and the same code is what the package will ship, so the result looks
transferable. The expected outcome keeps package claims on installed-package results. A source-checkout pass presented
as built or packed behavior breaks the Rule.

#### Checklist

- [ ] TSTEST-CK-CONSISTENCY-01-01 — No source-checkout test result is treated as proof of built or packed package behavior.
- Also applies: TSTEST-CK-USAGE-04-03 (the installed package's entry points and resolution modes are exercised).

### TSTEST-SC-CONSISTENCY-02 — Normal case: claims and tests agree in both directions

Coverage drifts when a claim loses its test or a test outlives the requirement it was written for. The expected
outcome traces every claim to a current test and every test back to a named requirement.

#### Checklist

- [ ] TSTEST-CK-CONSISTENCY-02-01 — Every claim maps to at least one current test.
- [ ] TSTEST-CK-CONSISTENCY-02-02 — Every test maps to a named requirement.

## Risk

### TSTEST-SC-RISK-01 — Rule violation: an ordinary type assertion used as proof of a type relationship

Writing an ordinary type assertion such as `value as Type` or `<Type>value` inside a test makes the compiler
accept the line and proves nothing about the relationship the test claims. The expected outcome asserts type
relationships with helpers that fail on mismatch. `as const` may construct precise test input through literal
and readonly inference, but it does not itself prove a tested type relationship.

#### Checklist

- [ ] TSTEST-CK-RISK-01-01 — No ordinary type assertion such as `value as Type` or `<Type>value` inside a test is used as proof that the asserted type is true; `as const` used only for precise test-input inference is not treated as that escape hatch.
- [ ] TSTEST-CK-RISK-01-02 — Inferred and declared relationships are asserted with type-level helpers that fail on mismatch.

### TSTEST-SC-RISK-02 — Expected failure: an invalid program must be rejected

Negative and expected-error tests exist to prove that the compiler refuses a misuse, and they silently stop
proving it when the misuse becomes legal. The expected outcome verifies the failure power of each expectation
in both directions.

#### Checklist

- [ ] TSTEST-CK-RISK-02-02 — Removing an expectation produces the intended diagnostic.
- [ ] TSTEST-CK-RISK-02-03 — An unused expectation fails the run.

### TSTEST-SC-RISK-03 — Normal case: concurrent behavior is observed rather than assumed

Overlapping operations, cancellation, and background rejections decide whether an asynchronous requirement holds.
The expected outcome controls completion order, asserts the intended lifetime behavior, and observes every
rejection. A suite that can stay green while an operation fails in the background is the failure.

#### Checklist

- [ ] TSTEST-CK-RISK-03-01 — Completion order is controlled.
- [ ] TSTEST-CK-RISK-03-02 — Overlapping operations are tested with inverted results.
- [ ] TSTEST-CK-RISK-03-03 — Cancellation is distinguished from stale-result suppression.
- [ ] TSTEST-CK-RISK-03-04 — The intended one of cancellation and stale-result suppression is asserted.
- [ ] TSTEST-CK-RISK-03-05 — Every rejection is observed so no test can pass with a background failure.

## Overall

### TSTEST-SC-OVERALL-01 — Adversarial: a test that cannot fail for the defect it names

A broad assertion, an accepted snapshot, or a case written after the implementation can cover the code, report
green, and stay green when the behavior it claims to protect is broken. The expected outcome states the defect
each test must catch and demonstrates the failure; coverage accepted as failure power is the failure.

#### Checklist

- [ ] TSTEST-CK-OVERALL-01-01 — The mutation or controlled defect that would make each test fail is defined.
- [ ] TSTEST-CK-OVERALL-01-02 — The named defect is introduced or simulated where practical.
- [ ] TSTEST-CK-OVERALL-01-03 — The test is confirmed to fail for the expected reason.
- [ ] TSTEST-CK-OVERALL-01-04 — The accepted implementation is restored.
- [ ] TSTEST-CK-OVERALL-01-05 — The focused test is run again after the accepted implementation is restored.
- [ ] TSTEST-CK-OVERALL-01-06 — No snapshot or broad assertion that passes under the named defect is retained.

### TSTEST-SC-OVERALL-02 — Expected failure: a named runtime, tool, or package mode is unavailable

Part of the claimed behavior cannot be exercised because the named runtime, tool, or package mode is missing here. The
expected outcome records the gap as a limitation and keeps the unproved claim unproved. Letting another
layer's pass stand in for the missing one is the failure.

#### Checklist

- [ ] TSTEST-CK-OVERALL-02-01 — Every unavailable named runtime, tool, and package mode, and every review-only package check that needs a new build or archive, is recorded as a limitation or requests author mode.
- [ ] TSTEST-CK-OVERALL-02-02 — No layer's result is reported as proof of a claim that requires a different, unavailable layer.

### TSTEST-SC-OVERALL-03 — Expected failure: a verification check runs and fails

A check can run and produce valid evidence that a claim does not hold. The expected outcome returns author
mode to the phase that owns the cause and repeats affected checks after repair, or stops with the failed claim
when correction is unauthorized or outside scope. Calling the failure an unavailable-check limitation is the defect.

#### Checklist

- [ ] TSTEST-CK-OVERALL-03-01 — Every failed check returns author mode to the earliest phase that owns its cause, or stops with the failed claim when correction is unauthorized or outside scope.
- [ ] TSTEST-CK-OVERALL-03-02 — A repaired test set passes the failed check and every affected downstream check from the final tree before completion.
