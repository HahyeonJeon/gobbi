# Go Testing Evaluation Checklist

Unchecked evaluation source for Go work governed by [Go Testing](SKILL.md). Apply it to the exact work and
returned outcomes under evaluation.

[Evaluation](../../evaluation/SKILL.md) owns evidence, filled results, findings, and verdicts. This source owns
only reusable scenarios and unchecked conditions.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### GOTST-SC-PROJECT-01 — Normal case: The evidence set follows behavior and risk

The work protects a named behavior, failure mode, compatibility promise, regression, or performance question.
Each selected test kind should answer one material question under exactly one author or execution contract;
habit-driven evidence or a mode with incomplete effects, pauses, terminal state, or recovery fails.
Author mode limits project writes to authorized evidence sources and returns a repeatable source and result or
production-design block. Execution mode keeps project source read-only and returns exact evidence and limits or
a blocked or flaky result. Both modes contain declared outputs and caches, require separate download and network
authority, report credential use and external mutation separately as none, and retain their exact recovery state.

#### Checklist

- [ ] GOTST-CK-PROJECT-01-01 — Every selected test kind answers a named behavior or risk question.
- [ ] GOTST-CK-PROJECT-01-02 — Every required behavior has an observable test boundary or controllable dependency.
- [ ] GOTST-CK-PROJECT-01-03 — The selected author or execution mode, minimum supported Go version, selected Go toolchain version, module's Go language version, and supported `GOOS/GOARCH` target are each explicit.
- [ ] GOTST-CK-PROJECT-01-04 — Every author-mode project-path write, disposable output, cache or download, project execution, network-access, separately reported credential-use, separately reported external-mutation, pause, terminal, and recovery field matches the accepted author contract.
- [ ] GOTST-CK-PROJECT-01-05 — Every execution-mode project-path write, disposable output, cache or download, project execution, network-access, separately reported credential-use, separately reported external-mutation, pause, terminal, and recovery field matches the accepted execution contract.

### GOTST-SC-PROJECT-02 — Expected failure: A regression distinguishes defective and corrected behavior

A test is intended to prevent a reproduced defect. It should fail for the reproduced cause before correction
and pass after correction when that comparison is safe; a test that never detects the defect fails.

#### Checklist

- [ ] GOTST-CK-PROJECT-02-01 — The regression test separates the reproduced defective behavior from the corrected behavior.
- [ ] GOTST-CK-PROJECT-02-02 — The original reproducer remains separately accounted for.

### GOTST-SC-PROJECT-03 — Poor quality: Tests freeze implementation details or chase a score

Tests run successfully but assert private call order, internal representation, or arbitrary coverage targets
instead of a promised outcome. The suite should remain stable under valid refactoring; proxy quality fails.

#### Checklist

- [ ] GOTST-CK-PROJECT-03-01 — Every assertion protects caller-visible or package-owned behavior rather than internal representation or call order.
- [ ] GOTST-CK-PROJECT-03-02 — No test exists solely to raise an unowned coverage percentage.

## Structure

### GOTST-SC-STRUCTURE-01 — Normal case: The package boundary matches the protected contract

The behavior needs either internal package access or an external consumer position. The test package should
choose the narrowest stable boundary; using privileged access for a public contract fails.

#### Checklist

- [ ] GOTST-CK-STRUCTURE-01-01 — Each test takes unexported access or an external consumer position according to the contract it protects.

### GOTST-SC-STRUCTURE-02 — Poor quality: One table hides different workflows

Cases share a table but require different setup, control flow, fixtures, or explanations. A table should
represent one behavior shape; option-heavy rows that conceal distinct contracts fail.

#### Checklist

- [ ] GOTST-CK-STRUCTURE-02-01 — Every row of one table shares the same behavioral action and comparison shape.
- [ ] GOTST-CK-STRUCTURE-02-02 — Cases with distinct fixture lifecycles are separate tests.

### GOTST-SC-STRUCTURE-03 — Edge case: A process-wide or file fixture is genuinely required

The suite uses `TestMain`, `testdata`, or another shared fixture. The fixture should represent stable input or
a real process-wide contract that per-test setup cannot express; convenience-based global state fails.

#### Checklist

- [ ] GOTST-CK-STRUCTURE-03-01 — Every `TestMain` responsibility, `testdata` file, and other shared fixture is required by a process-wide contract or a stable retained input.
- [ ] GOTST-CK-STRUCTURE-03-02 — Per-test state remains outside global fixtures.

### GOTST-SC-STRUCTURE-04 — Rule violation: Production internals are exposed only for tests

The test cannot observe behavior without adding an exported hook, broad provider, or mock-oriented interface
that production callers do not need. The design should supply an observable test boundary or controllable
dependency with a production purpose, or receive an exact production-design handoff; a test-only public API or
CLI or an invented boundary fails.

#### Checklist

- [ ] GOTST-CK-STRUCTURE-04-01 — Every observable test boundary or controllable dependency has a production design purpose rather than test-only existence.
- [ ] GOTST-CK-STRUCTURE-04-02 — Every unobservable promised behavior returns an exact production-design handoff with its evidence limits.

## Performance

### GOTST-SC-PERFORMANCE-01 — Edge case: Fuzzing reaches its resource boundary

A fuzz target receives large, malformed, or numerous inputs for a bounded run. It should constrain inputs
outside the real domain and keep resource use proportionate; an unbounded target or seed-only claim fails.

#### Checklist

- [ ] GOTST-CK-PERFORMANCE-01-01 — The fuzz target bounds both its input domain and its run duration.
- [ ] GOTST-CK-PERFORMANCE-01-02 — A seed-only run is not represented as exploratory fuzzing.

### GOTST-SC-PERFORMANCE-02 — Poor quality: A benchmark measures setup or removable work

A benchmark reports numbers, but setup is inside the measured region, the compiler can remove the work, or
one noisy sample supports the conclusion. The measurement should isolate the operation whose cost matters.

#### Checklist

- [ ] GOTST-CK-PERFORMANCE-02-01 — One benchmark iteration measures the intended operation.
- [ ] GOTST-CK-PERFORMANCE-02-02 — One benchmark iteration excludes the operation's surrounding setup.
- [ ] GOTST-CK-PERFORMANCE-02-03 — The benchmark consumes the operation's observable result.

### GOTST-SC-PERFORMANCE-03 — Poor quality: Slow external tests burden the ordinary project test command

Privileged, networked, or external-service tests run in the ordinary fast suite without a project contract.
The ordinary project test command should remain repeatable and proportionate; hidden environmental cost fails.

#### Checklist

- [ ] GOTST-CK-PERFORMANCE-03-01 — Every expensive, privileged, networked, and external-service test sits behind a named target or constraint in the project test command rather than in its ordinary path.

## Aesthetics

### GOTST-SC-AESTHETICS-01 — Normal case: A failure identifies the broken contract

A focused test or subtest fails. Its name and diagnostic should identify the case, operation, observed value,
wanted value, and useful context without source-level debugging.

#### Checklist

- [ ] GOTST-CK-AESTHETICS-01-01 — Every subtest name identifies its case stably.
- [ ] GOTST-CK-AESTHETICS-01-02 — Every behavioral mismatch reports both the observed and the wanted value.
- [ ] GOTST-CK-AESTHETICS-01-03 — Every assertion helper marks itself with `t.Helper`.

### GOTST-SC-AESTHETICS-02 — Poor quality: Failure output is generic or context-free

The suite detects a failure but emits only a generic message, opaque boolean, or helper location. A reviewer
should not need to reproduce the failure to learn which contract broke; uninformative output fails.

#### Checklist

- [ ] GOTST-CK-AESTHETICS-02-01 — Every failure message names the operation under test instead of relying on an unexplained boolean.
- Also applies: GOTST-CK-AESTHETICS-01-03 (helpers do not hide the failing caller location).

## Usage

### GOTST-SC-USAGE-01 — Normal case: An example presents a real public caller path

A public API benefits from rendered package documentation. The example should use the API as a caller would
and assert output only when that output is deterministic and contractual; decorative or misleading use fails.

#### Checklist

- [ ] GOTST-CK-USAGE-01-01 — The example uses only caller-visible declarations to demonstrate a supported public workflow.
- Also applies: GOTST-CK-USAGE-02-02 (nondeterministic output is not asserted).

### GOTST-SC-USAGE-02 — Edge case: Example output varies by environment or version

An example prints maps, paths, times, `GOOS/GOARCH` target text, or release-dependent content. Executable
output should remain stable under the supported contract; an environment-sensitive assertion fails.

#### Checklist

- [ ] GOTST-CK-USAGE-02-01 — Asserted example output is stable across supported `GOOS/GOARCH` targets and project-supported selected Go toolchain versions.
- [ ] GOTST-CK-USAGE-02-02 — Nondeterministic example output is not used as an execution assertion.

### GOTST-SC-USAGE-03 — Expected failure: An integration prerequisite is absent

A selected test needs an external service, privilege, build tag, tool, named target in the project test
command, or `GOOS/GOARCH` target that is unavailable. Skipping is valid only when the project contract
classifies that absence as unsupported; silent success fails.

#### Checklist

- [ ] GOTST-CK-USAGE-03-01 — Every skip names its missing prerequisite.
- [ ] GOTST-CK-USAGE-03-02 — Every skip follows the project support contract.
- [ ] GOTST-CK-USAGE-03-03 — A skipped required test is not represented as passed.

### GOTST-SC-USAGE-04 — Adversarial: An expected value is fitted to the observed output

A golden file, `Output:` comment, or expected literal is written or regenerated from what the code currently
produces rather than from the named behavior it protects. The expectation should come from the contract, so a
defect in the current output makes the test fail; an expectation fitted to observed output passes forever and
proves nothing.

#### Checklist

- [ ] GOTST-CK-USAGE-04-01 — Every golden file, example output, and expected literal is derived from the named behavior rather than from the current implementation's output.
- [ ] GOTST-CK-USAGE-04-02 — Every regenerated expectation was reviewed against the contract before acceptance.

## Consistency

### GOTST-SC-CONSISTENCY-01 — Rule violation: Nondeterminism remains uncontrolled

The test depends on wall time, random values, network order, file-system state, or process environment without
an observable test boundary or controllable dependency. Repeated execution should produce the same contract
judgment; scheduling or machine luck fails.

#### Checklist

- [ ] GOTST-CK-CONSISTENCY-01-01 — Time-dependent, randomness-dependent, environment-dependent, file-system-dependent, and network-dependent behavior each use an observable test boundary or controllable dependency.

### GOTST-SC-CONSISTENCY-02 — Rule violation: Parallel tests share unsafe state

Tests or subtests call `t.Parallel` while mutating shared fixtures, process environment, current directory, or
another unsynchronized global. Parallel execution should preserve isolation; order-dependent success fails.

#### Checklist

- [ ] GOTST-CK-CONSISTENCY-02-01 — Parallel tests do not mutate shared fixtures or process-wide state without synchronization.
- Also applies: GOTST-CK-CONSISTENCY-04-01 (parallel closure behavior follows the module language version).

### GOTST-SC-CONSISTENCY-03 — Rule violation: Test resources outlive a terminal path

A test opens files, servers, processes, timers, contexts, or environment state. Cleanup should run after
success, failure, skip, and panic; a resource or process-state leak fails.

#### Checklist

- [ ] GOTST-CK-CONSISTENCY-03-01 — Every test-owned resource and process-state change has one cleanup or restoration owner.
- [ ] GOTST-CK-CONSISTENCY-03-02 — Cleanup is registered before a later assertion can terminate the test.

### GOTST-SC-CONSISTENCY-04 — Edge case: Test APIs or closure semantics vary by Go version

The suite uses a testing API or loop-variable behavior that changed across Go releases. The implementation
should follow the module's Go language version, minimum supported Go version, and selected Go toolchain
version; local-newest success fails.

#### Checklist

- [ ] GOTST-CK-CONSISTENCY-04-01 — Every used testing API and closure behavior matches the module's Go language version, minimum supported Go version, and selected Go toolchain version.

### GOTST-SC-CONSISTENCY-05 — Rule violation: Returned claims exceed executed evidence

The work reports coverage, a race run, a benchmark, fuzzing, or a general pass. The claim should stay within
the executed inputs, paths, duration, `GOOS/GOARCH` target, and configuration; unsupported expansion fails.

#### Checklist

- [ ] GOTST-CK-CONSISTENCY-05-01 — Every coverage, race, fuzz, and benchmark claim stays within the generated profile, executed workload, recorded duration, exercised corpus, recorded environment, and exercised inputs it came from.

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

- [ ] GOTST-CK-RISK-02-01 — A test cannot retain a process-state change, a temporary file outside its owned location, or a live owned goroutine after completion.

### GOTST-SC-RISK-03 — Adversarial: A clean race run is treated as proof

The race detector reports no issue on the selected run. That covers only executed paths on supported
`GOOS/GOARCH` targets; representing it as proof that all concurrent behavior is race-free fails.

#### Checklist

- [ ] GOTST-CK-RISK-03-01 — No unexecuted concurrent path or unexercised `GOOS/GOARCH` target is included in the race-free conclusion.
- Also applies: GOTST-CK-CONSISTENCY-05-01 (race claims stay within the executed workload).

### GOTST-SC-RISK-04 — Expected failure: A flaky project test command or unsupported `GOOS/GOARCH` target remains unresolved

A required project test command is nondeterministic or prohibitively expensive, or one promised
`GOOS/GOARCH` target is unsupported. The work should preserve the resulting evidence gap; retries, exclusions,
or another target's pass do not close it.

#### Checklist

- [ ] GOTST-CK-RISK-04-01 — Every unresolved flaky project test command and unsupported promised `GOOS/GOARCH` target remains visible.
- [ ] GOTST-CK-RISK-04-02 — No retry converts an indeterminate test into reliable evidence.

### GOTST-SC-RISK-05 — Normal case: The ordinary run stays inside the test's own boundary

The ordinary project test command runs on a developer or continuous-integration machine. Its success path
should need no elevated privilege, write only inside test-owned temporary locations, and make no unauthorized
external call; an ordinary run that touches the real machine or a real service fails.

#### Checklist

- [ ] GOTST-CK-RISK-05-01 — The ordinary project test command needs no elevated privilege or undeclared external service.
- [ ] GOTST-CK-RISK-05-02 — Every file the ordinary project test command writes stays inside a test-owned temporary location.

## Overall

### GOTST-SC-OVERALL-01 — Normal case: The complete suite gives proportionate assurance

The selected tests, examples, fuzz targets, benchmarks, coverage, race runs, and `GOOS/GOARCH` target checks
should form the smallest coherent evidence set for the named behavior and risk. Each layer should add distinct
assurance and return its exact evidence and limits in the operation terminal record.

#### Checklist

- [ ] GOTST-CK-OVERALL-01-01 — Every selected layer protects a distinct material concern.
- [ ] GOTST-CK-OVERALL-01-02 — Every applicable testing terminal field is explicit: evidence question and test kind, observable test boundary or controllable dependency, cases, changed or reviewed paths, project test command, exact package pattern, flags, `GOOS/GOARCH` target, inputs, duration, repetitions, result, cache, temporary, fuzz, coverage, and failure outputs, flakes, evidence limits, and production-design handoff.
- Also applies: GOTST-CK-CONSISTENCY-01-01 (each layer is deterministic within its intended contract).

### GOTST-SC-OVERALL-02 — Adversarial: High coverage masks missing behavioral assurance

The suite reports a high coverage percentage while omitting a failure path, compatibility case, concurrency
workload, or consumer boundary. Executed statements should not substitute for the promised behavior; cosmetic
coverage success fails.

#### Checklist

- [ ] GOTST-CK-OVERALL-02-01 — Acceptance is not based solely on a coverage percentage.
- [ ] GOTST-CK-OVERALL-02-02 — Every critical failure path and material consumer boundary has a direct behavioral assertion.

### GOTST-SC-OVERALL-03 — Expected failure: A material assurance gap blocks completion

One selected layer cannot run, a project test command is flaky, a promised `GOOS/GOARCH` target is unsupported,
or no observable test boundary or controllable dependency exposes the promised result. The terminal record
should retain the exact block and recovery fields; declaring the evidence set complete fails.

#### Checklist

- [ ] GOTST-CK-OVERALL-03-01 — Every applicable blocked-result field is explicit: the missing prerequisite or first useful diagnostic, affected obligation, evidence limit, risk, owner, retained state, first recovery action, and handoff.
- [ ] GOTST-CK-OVERALL-03-02 — Every terminal result keeps a material assurance gap outside its completion claim.
