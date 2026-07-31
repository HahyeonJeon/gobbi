---
name: go-testing
description: "Load when designing, writing, reviewing, or executing Go tests, examples, fuzz targets, benchmarks, coverage checks, or race-detector evidence."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Go Testing

Use this operation to design, implement, review, or execute evidence for Go behavior. It produces a focused,
repeatable test result using the smallest applicable mix of tests, examples, fuzzing, benchmarks, coverage,
race detection, and integration checks.

The operation owns test strategy and interpretation, not general code implementation or command lookup.
`go-development` owns production changes, `go-concurrency` owns synchronization design, and `go-toolchain`
owns command side effects and environment diagnosis.

## Principles

### Test behavior at its narrowest stable seam

A test should fail when promised behavior breaks and remain stable when implementation details change. Select
the package boundary, inputs, and observations from the contract being protected.

### Make failures explain the broken contract

Good evidence shortens diagnosis. A failure should identify the case, operation, observed value, wanted value,
and relevant context without requiring source-level debugging.

### Control nondeterminism at the design boundary

Time, randomness, I/O, concurrency, process state, and shared fixtures must be owned or substituted. Retrying a
flaky assertion hides uncertainty instead of producing evidence.

### Match each tool to its claim

Unit tests, fuzzing, benchmarks, coverage, and the race detector answer different questions. Combine only the
evidence needed for the risk and state every untested path or unsupported target.

## Rules

- **MUST establish author or read-only review mode and derive every test from a named behavior, failure mode,
  compatibility promise, or regression.** Review mode may run authorized non-writing checks but must not edit,
  format, generate, or update retained corpora.
- **MUST make tests deterministic, isolated, and repeatable under the project's supported execution order.**
  Control time, randomness, environment, files, network, and shared state at an explicit seam.
- **MUST make each failure identify the case and show useful `got` and `want` evidence or an equivalent
  behavioral comparison.** Mark helpers with `t.Helper` so locations point to the failed contract.
- **MUST release test resources and restore process state on success, failure, skip, and panic paths.** Use
  `t.Cleanup`, temporary directories, test-scoped environment helpers, contexts, and server close functions
  when the selected Go version and fixture require them.
- **MUST prevent concurrent tests and subtests from mutating shared fixtures or process-wide state without
  synchronization.** Confirm loop-variable and closure behavior against the module's language version before
  using parallel subtests.
- **NEVER present a pass, coverage percentage, benchmark sample, fuzz run, or race-detector run as proof beyond
  the inputs, paths, duration, platform, and configuration it exercised.** Report the evidence boundary with
  the result.

## Procedure

### Phase 1 — Plan the Evidence

#### 1.1 Define the behavior and risk

- Read the requested outcome, public or package contract, existing tests, defect report, supported Go version,
  build constraints, platforms, concurrency, and compatibility obligations.
- Name the behavior, observable result, relevant failures, and risk that needs evidence. Decide whether this is
  author mode or a read-only review.
- Map nondeterminism, side effects, private dependencies, and slow or external systems. If the production
  design exposes no stable seam, return that design gap to `go-development` instead of compensating with a
  fragile test.
- Record the package, test kinds, focused command scope, and success evidence before writing or running tests.

#### 1.2 Select the smallest sufficient evidence set

- Use an ordinary test for deterministic examples, a package-level integration test for component boundaries,
  an executable example for user-visible documentation, fuzzing for broad input exploration, and a benchmark
  only for a performance question.
- Add coverage when it can reveal unexercised behavior, the race detector when concurrent access is in scope,
  and platform or build-tag runs when file selection or target behavior can differ.
- Keep expensive, privileged, networked, or external-service tests behind the project's established target or
  constraint. State their prerequisites and skip only when the contract defines that absence as unsupported.
- If no test kind can observe the claimed result, revise the claim or the seam before continuing.

### Phase 2 — Design Cases and Seams

#### 2.1 Choose package and fixture boundaries

- Use the package under test for necessary access to unexported behavior; use an external `_test` package when
  the public client experience is the contract. Do not expose production internals solely for tests.
- Isolate clocks, randomness, I/O, network clients, and dependencies at the narrowest production seam. Prefer a
  small function or consumer-defined interface over a broad mock framework.
- Use `t.TempDir`, `t.Cleanup`, and test-scoped environment helpers where supported. Use `TestMain` only for a
  real process-wide fixture or setup contract that per-test cleanup cannot express.
- Put file fixtures under `testdata` when they are stable inputs worth reading; generate small cases in the test
  when that makes intent clearer.

#### 2.2 Design cases and failure output

- Cover the ordinary case, boundary values, invalid input, important failure paths, and compatibility cases
  supported by the contract. For a defect, first create the narrowest regression that fails for the reproduced
  cause.
- Use a table when cases share one behavior, setup, action, and comparison. Split cases that need different
  control flow, fixtures, or explanations rather than forcing them into a large option table.
- Give subtests stable case names and capture loop values according to the selected language version before
  parallel execution. Call `t.Parallel` only when every fixture and process-level dependency is safe to share.
- Design messages from the failure backward: name the operation, input or case, `got`, `want`, and any
  comparison detail needed to act.

### Phase 3 — Implement the Evidence

#### 3.1 Write focused tests and examples

- Build the smallest test that reaches the chosen seam, performs one behavioral action, and asserts the
  complete result. Keep setup helpers small, mark them with `t.Helper`, and return useful values rather than
  hiding assertions in a generic helper.
- Compare structured values in a way that reports meaningful differences. Use project-selected comparison
  tools only when they reduce test complexity enough to justify the dependency.
- Write examples for public usage that benefits from rendered documentation. Add an output assertion only when
  the output is deterministic and should be executed as a test, following the
  [`testing` package example rules](https://pkg.go.dev/testing#hdr-Examples).
- Run the focused test after each complete increment. If the failure contradicts the planned contract, stop
  and resolve the contract or seam instead of loosening the assertion.

#### 3.2 Add fuzz or benchmark evidence when selected

- Seed a fuzz target with representative valid, boundary, and regression inputs before allowing generated
  cases. Validate one behavior per target, reject or normalize inputs outside the real domain, and preserve any
  failure corpus needed for regression; follow the [Go fuzzing guide](https://go.dev/doc/security/fuzz/).
- Fuzz for a bounded, recorded duration and rerun discovered failures deterministically. A seed-only test run
  checks the retained corpus but does not replace exploratory fuzzing.
- Benchmark the operation whose cost matters, control setup outside the measured region, and consume results
  so work is not optimized away. Use the benchmark APIs supported by the selected project toolchain; gate
  newer forms such as `B.Loop` rather than assuming they exist.
- Record environment, inputs, count, and comparison method. Prefer repeated before-and-after samples and a
  project-approved statistical comparison tool over one timing.

### Phase 4 — Verify and Interpret

#### 4.1 Run the applicable verification layers

- Run the focused package tests first, then the project test target or applicable `go test ./...` scope.
  Include selected build tags, integration prerequisites, and supported platforms that can change behavior.
- Run fuzz seed corpora, bounded fuzzing, benchmarks, coverage, and `-race` only when Phase 1 selected them.
  Use `go-toolchain` to confirm flags, environment, downloads, and platform support before execution.
- For a regression, prove the test failed against the defective behavior before the fix and passes afterward
  when that comparison is safely reproducible. Rerun the original reproducer as separate evidence.
- If a check fails, preserve its command, environment, and first useful diagnostic; repair the test or return
  a production defect to its owner, then repeat every affected layer.

#### 4.2 Interpret and hand off the result

- Treat coverage as a map of executed statements or profiles, not a fixed quality score. Investigate important
  uncovered behavior and reject a universal percentage when the project has not established one; see the
  [Go coverage overview](https://go.dev/blog/cover).
- Treat race reports as defects in an executed path and clean runs as limited evidence, as documented by the
  [race detector](https://go.dev/doc/articles/race_detector). Record unsupported platforms, prohibitive cost,
  or unexercised workloads.
- Review the final tests for contract focus, useful failures, deterministic resources, safe parallelism, and
  unnecessary coupling. In read-only review mode, report proposed checks without editing or formatting files.
- Hand off the behavior protected, changed test paths, exact commands and results, evidence limits, remaining
  gaps, and any production design issue. Completion means every selected layer has passed or has an explicit
  in-scope blocker.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
