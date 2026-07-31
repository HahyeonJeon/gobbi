# Go Testing Evaluation Checklist

Unchecked evaluation source for Go work governed by [Go Testing](SKILL.md). Apply it to the exact work and
returned outcomes under evaluation.

[Evaluation](../../evaluation/SKILL.md) owns evidence, filled results, findings, and verdicts. This source owns
only reusable scenarios and unchecked conditions.

## Project

### GOTST-SC-PROJECT-01 — Normal case: The evidence set follows behavior and risk

The work protects a named behavior, failure mode, compatibility promise, regression, or performance question.
Each selected test kind should answer one material question; habit-driven or unrelated testing fails.

#### Checklist

- [ ] GOTST-CK-PROJECT-01-01 — Every selected test kind answers a named behavior or risk question.
- [ ] GOTST-CK-PROJECT-01-02 — Every required behavior has an observable test seam.
- [ ] GOTST-CK-PROJECT-01-03 — The test scope matches the supported Go contract.
- [ ] GOTST-CK-PROJECT-01-04 — The test scope matches the supported platform contract.
- [ ] GOTST-CK-PROJECT-01-05 — The test work declares author mode or read-only review mode.

### GOTST-SC-PROJECT-02 — Expected failure: A regression distinguishes defective and corrected behavior

A test is intended to prevent a reproduced defect. It should fail for the reproduced cause before correction
and pass after correction when that comparison is safe; a test that never detects the defect fails.

#### Checklist

- [ ] GOTST-CK-PROJECT-02-01 — The regression test detects the reproduced defective behavior.
- [ ] GOTST-CK-PROJECT-02-02 — The regression test accepts the corrected behavior.
- [ ] GOTST-CK-PROJECT-02-03 — The original reproducer remains separately accounted for.

### GOTST-SC-PROJECT-03 — Poor quality: Tests freeze implementation details or chase a score

Tests run successfully but assert private call order, internal representation, or arbitrary coverage targets
instead of a promised outcome. The suite should remain stable under valid refactoring; proxy quality fails.

#### Checklist

- [ ] GOTST-CK-PROJECT-03-01 — Each assertion protects caller-visible or package-owned behavior.
- [ ] GOTST-CK-PROJECT-03-02 — Valid internal refactoring does not invalidate the asserted contract.
- [ ] GOTST-CK-PROJECT-03-03 — No test exists solely to raise an unowned coverage percentage.

## Structure

### GOTST-SC-STRUCTURE-01 — Normal case: The package boundary matches the protected contract

The behavior needs either internal package access or an external consumer position. The test package should
choose the narrowest stable boundary; using privileged access for a public contract fails.

#### Checklist

- [ ] GOTST-CK-STRUCTURE-01-01 — Internal-package tests use unexported access only when the contract requires it.
- [ ] GOTST-CK-STRUCTURE-01-02 — Public-client behavior is exercised from an external consumer position.

### GOTST-SC-STRUCTURE-02 — Poor quality: One table hides different workflows

Cases share a table but require different setup, control flow, fixtures, or explanations. A table should
represent one behavior shape; option-heavy rows that conceal distinct contracts fail.

#### Checklist

- [ ] GOTST-CK-STRUCTURE-02-01 — Every table row uses the same behavioral action.
- [ ] GOTST-CK-STRUCTURE-02-02 — Every table row uses the same comparison shape.
- [ ] GOTST-CK-STRUCTURE-02-03 — Cases with distinct fixture lifecycles are separate tests.

### GOTST-SC-STRUCTURE-03 — Edge case: A process-wide or file fixture is genuinely required

The suite uses `TestMain`, `testdata`, or another shared fixture. The fixture should represent stable input or
a real process-wide contract that per-test setup cannot express; convenience-based global state fails.

#### Checklist

- [ ] GOTST-CK-STRUCTURE-03-01 — Every `TestMain` responsibility requires process-wide ownership.
- [ ] GOTST-CK-STRUCTURE-03-02 — Every `testdata` file is a stable input worth retaining.
- [ ] GOTST-CK-STRUCTURE-03-03 — Per-test state remains outside global fixtures.

### GOTST-SC-STRUCTURE-04 — Rule violation: Production internals are exposed only for tests

The test cannot observe behavior without adding an exported hook, broad provider, or mock-oriented interface
that production callers do not need. The design should supply a narrow natural seam; test-only public surface
fails.

#### Checklist

- [ ] GOTST-CK-STRUCTURE-04-01 — No exported production declaration exists solely for test access.
- [ ] GOTST-CK-STRUCTURE-04-02 — Every test seam has a production design purpose.

## Performance

### GOTST-SC-PERFORMANCE-01 — Edge case: Fuzzing reaches its resource boundary

A fuzz target receives large, malformed, or numerous inputs for a bounded run. It should constrain inputs
outside the real domain and keep resource use proportionate; an unbounded target or seed-only claim fails.

#### Checklist

- [ ] GOTST-CK-PERFORMANCE-01-01 — The fuzz domain excludes inputs the real contract cannot receive.
- [ ] GOTST-CK-PERFORMANCE-01-02 — The fuzz run has a bounded duration.
- [ ] GOTST-CK-PERFORMANCE-01-03 — A seed-only run is not represented as exploratory fuzzing.

### GOTST-SC-PERFORMANCE-02 — Poor quality: A benchmark measures setup or removable work

A benchmark reports numbers, but setup is inside the measured region, the compiler can remove the work, or
one noisy sample supports the conclusion. The measurement should isolate the operation whose cost matters.

#### Checklist

- [ ] GOTST-CK-PERFORMANCE-02-01 — One benchmark iteration measures the intended operation.
- [ ] GOTST-CK-PERFORMANCE-02-02 — Setup outside the measured operation is excluded from timing.
- [ ] GOTST-CK-PERFORMANCE-02-03 — The benchmark consumes the operation's observable result.

### GOTST-SC-PERFORMANCE-03 — Poor quality: Slow external tests burden the default target

Privileged, networked, or external-service tests run in the ordinary fast suite without a project contract.
The default target should remain repeatable and proportionate; hidden environmental cost fails.

#### Checklist

- [ ] GOTST-CK-PERFORMANCE-03-01 — Every slow external test uses the project-selected target or constraint.
- [ ] GOTST-CK-PERFORMANCE-03-02 — The ordinary test target has no undeclared external-service prerequisite.
- [ ] GOTST-CK-PERFORMANCE-03-03 — The ordinary test target has no undeclared privilege prerequisite.

## Aesthetics

### GOTST-SC-AESTHETICS-01 — Normal case: A failure identifies the broken contract

A focused test or subtest fails. Its name and diagnostic should identify the case, operation, observed value,
wanted value, and useful context without source-level debugging.

#### Checklist

- [ ] GOTST-CK-AESTHETICS-01-01 — Every subtest name identifies its case stably.
- [ ] GOTST-CK-AESTHETICS-01-02 — Every behavioral mismatch reports the observed value.
- [ ] GOTST-CK-AESTHETICS-01-03 — Every behavioral mismatch reports the wanted value.
- [ ] GOTST-CK-AESTHETICS-01-04 — Every assertion helper marks itself with `t.Helper`.

### GOTST-SC-AESTHETICS-02 — Poor quality: Failure output is generic or context-free

The suite detects a failure but emits only a generic message, opaque boolean, or helper location. A reviewer
should not need to reproduce the failure to learn which contract broke; uninformative output fails.

#### Checklist

- [ ] GOTST-CK-AESTHETICS-02-01 — No failure message relies on an unexplained boolean.
- [ ] GOTST-CK-AESTHETICS-02-02 — No helper hides the caller location of a failed assertion.
- [ ] GOTST-CK-AESTHETICS-02-03 — Every failure message names the operation under test.

## Usage

### GOTST-SC-USAGE-01 — Normal case: An example presents a real public caller path

A public API benefits from rendered package documentation. The example should use the API as a caller would
and assert output only when that output is deterministic and contractual; decorative or misleading use fails.

#### Checklist

- [ ] GOTST-CK-USAGE-01-01 — The example uses only caller-visible declarations.
- [ ] GOTST-CK-USAGE-01-02 — The example demonstrates a supported public workflow.
- [ ] GOTST-CK-USAGE-01-03 — Any asserted example output is deterministic.

### GOTST-SC-USAGE-02 — Edge case: Example output varies by environment or version

An example prints maps, paths, times, platform text, or release-dependent content. Executable output should
remain stable under the supported contract; an environment-sensitive assertion fails.

#### Checklist

- [ ] GOTST-CK-USAGE-02-01 — Asserted example output is stable across supported platforms.
- [ ] GOTST-CK-USAGE-02-02 — Asserted example output is stable across supported Go versions.
- [ ] GOTST-CK-USAGE-02-03 — Nondeterministic example output is not used as an execution assertion.

### GOTST-SC-USAGE-03 — Expected failure: An integration prerequisite is absent

A selected test needs an external service, privilege, build tag, tool, or target that is unavailable. Skipping
is valid only when the project contract classifies that absence as unsupported; silent success fails.

#### Checklist

- [ ] GOTST-CK-USAGE-03-01 — Every missing prerequisite is identified.
- [ ] GOTST-CK-USAGE-03-02 — Every skip condition follows the project support contract.
- [ ] GOTST-CK-USAGE-03-03 — A skipped required test is not represented as passed.

## Consistency

### GOTST-SC-CONSISTENCY-01 — Rule violation: Nondeterminism remains uncontrolled

The test depends on wall time, random values, network order, file-system state, or process environment without
an explicit seam. Repeated execution should produce the same contract judgment; scheduling or machine luck
fails.

#### Checklist

- [ ] GOTST-CK-CONSISTENCY-01-01 — Time-dependent behavior uses a controlled time seam.
- [ ] GOTST-CK-CONSISTENCY-01-02 — Random-dependent behavior uses a controlled randomness seam.
- [ ] GOTST-CK-CONSISTENCY-01-03 — Environment-dependent behavior uses test-scoped state.
- [ ] GOTST-CK-CONSISTENCY-01-04 — Network-dependent behavior uses the project-selected isolation boundary.

### GOTST-SC-CONSISTENCY-02 — Rule violation: Parallel tests share unsafe state

Tests or subtests call `t.Parallel` while mutating shared fixtures, process environment, current directory, or
another unsynchronized global. Parallel execution should preserve isolation; order-dependent success fails.

#### Checklist

- [ ] GOTST-CK-CONSISTENCY-02-01 — Parallel tests do not mutate shared fixtures without synchronization.
- [ ] GOTST-CK-CONSISTENCY-02-02 — Parallel tests do not mutate process-wide state.
- [ ] GOTST-CK-CONSISTENCY-02-03 — Parallel subtests capture loop values correctly for the module language version.

### GOTST-SC-CONSISTENCY-03 — Rule violation: Test resources outlive a terminal path

A test opens files, servers, processes, timers, contexts, or environment state. Cleanup should run after
success, failure, skip, and panic; a resource or process-state leak fails.

#### Checklist

- [ ] GOTST-CK-CONSISTENCY-03-01 — Every test-owned resource has one cleanup owner.
- [ ] GOTST-CK-CONSISTENCY-03-02 — Cleanup is registered before a later assertion can terminate the test.
- [ ] GOTST-CK-CONSISTENCY-03-03 — Every process-state change has a matching restoration.

### GOTST-SC-CONSISTENCY-04 — Edge case: Test APIs or closure semantics vary by Go version

The suite uses a testing API or loop-variable behavior that changed across supported Go releases. The
implementation should follow the module language version and toolchain floor; local-newest success fails.

#### Checklist

- [ ] GOTST-CK-CONSISTENCY-04-01 — Every testing API exists at the supported Go floor.
- [ ] GOTST-CK-CONSISTENCY-04-02 — Parallel closure behavior is correct for the module language version.

### GOTST-SC-CONSISTENCY-05 — Rule violation: Returned claims exceed executed evidence

The work reports coverage, a race run, a benchmark, fuzzing, or a general pass. The claim should stay within
the executed inputs, paths, duration, platform, and configuration; unsupported expansion fails.

#### Checklist

- [ ] GOTST-CK-CONSISTENCY-05-01 — Coverage claims stay within the generated profile.
- [ ] GOTST-CK-CONSISTENCY-05-02 — Race claims stay within the executed workload.
- [ ] GOTST-CK-CONSISTENCY-05-03 — Fuzz claims stay within the recorded duration.
- [ ] GOTST-CK-CONSISTENCY-05-04 — Fuzz claims stay within the exercised corpus.
- [ ] GOTST-CK-CONSISTENCY-05-05 — Benchmark claims stay within the recorded environment.
- [ ] GOTST-CK-CONSISTENCY-05-06 — Benchmark claims stay within the exercised inputs.

## Risk

### GOTST-SC-RISK-01 — Adversarial: Fuzz input amplifies memory, time, or external effects

A generated input intentionally triggers large allocation, recursion, path expansion, subprocesses, or remote
calls. The fuzz target should contain exploration inside the real contract and test boundary; resource or
side-effect amplification fails.

#### Checklist

- [ ] GOTST-CK-RISK-01-01 — Untrusted fuzz input cannot bypass the target's resource bound.
- [ ] GOTST-CK-RISK-01-02 — Untrusted fuzz input cannot trigger unauthorized external effects.
- [ ] GOTST-CK-RISK-01-03 — A discovered crashing input can be rerun deterministically.

### GOTST-SC-RISK-02 — Adversarial: Test process state contaminates another test

One test intentionally leaves environment variables, files, goroutines, servers, globals, or current-directory
state behind. Later tests should remain independent; contamination that only appears under shuffled or
parallel order fails.

#### Checklist

- [ ] GOTST-CK-RISK-02-01 — A test cannot retain a process-state change after completion.
- [ ] GOTST-CK-RISK-02-02 — A test cannot retain a temporary file outside its owned location.
- [ ] GOTST-CK-RISK-02-03 — A test cannot retain a live owned goroutine after completion.

### GOTST-SC-RISK-03 — Rule violation: A clean race run is treated as proof

The race detector reports no issue on the selected run. That covers only executed paths on supported
platforms; representing it as proof that all concurrent behavior is race-free fails.

#### Checklist

- [ ] GOTST-CK-RISK-03-01 — Race acceptance includes the exact executed workload.
- [ ] GOTST-CK-RISK-03-02 — Race acceptance includes the exact executed platform.
- [ ] GOTST-CK-RISK-03-03 — Unexecuted concurrent paths remain outside the race claim.

### GOTST-SC-RISK-04 — Expected failure: A flaky or unsupported surface remains unresolved

A required test is nondeterministic, prohibitively expensive, or unsupported on one promised target. The work
should preserve the resulting evidence gap; retries, exclusions, or another platform's pass do not close it.

#### Checklist

- [ ] GOTST-CK-RISK-04-01 — Every unresolved flaky test remains visible.
- [ ] GOTST-CK-RISK-04-02 — Every unsupported promised target remains visible.
- [ ] GOTST-CK-RISK-04-03 — No retry converts an indeterminate test into reliable evidence.

## Overall

### GOTST-SC-OVERALL-01 — Normal case: The complete suite gives proportionate assurance

The selected tests, examples, fuzz targets, benchmarks, coverage, race runs, and target checks should form the
smallest coherent evidence set for the named behavior and risk. Each layer should add distinct assurance.

#### Checklist

- [ ] GOTST-CK-OVERALL-01-01 — Every selected layer protects a distinct material concern.
- [ ] GOTST-CK-OVERALL-01-02 — Every selected layer is deterministic within its intended contract.
- [ ] GOTST-CK-OVERALL-01-03 — Every selected layer has an explicit coverage boundary.

### GOTST-SC-OVERALL-02 — Adversarial: High coverage masks missing behavioral assurance

The suite reports a high coverage percentage while omitting a failure path, compatibility case, concurrency
workload, or consumer boundary. Executed statements should not substitute for the promised behavior; cosmetic
coverage success fails.

#### Checklist

- [ ] GOTST-CK-OVERALL-02-01 — Acceptance is not based solely on a coverage percentage.
- [ ] GOTST-CK-OVERALL-02-02 — Every critical failure path has a behavioral assertion.
- [ ] GOTST-CK-OVERALL-02-03 — Every material consumer boundary has direct assurance.

### GOTST-SC-OVERALL-03 — Expected failure: A material assurance gap blocks completion

One selected test layer cannot run or cannot observe the promised result. The final account should retain the
affected behavior and risk as unresolved; declaring the evidence set complete fails.

#### Checklist

- [ ] GOTST-CK-OVERALL-03-01 — Every unobservable promised behavior remains explicit.
- [ ] GOTST-CK-OVERALL-03-02 — Every blocked selected layer remains explicit.
- [ ] GOTST-CK-OVERALL-03-03 — Completion is not claimed across a material assurance gap.
