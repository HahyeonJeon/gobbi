---
name: go-testing
description: "MUST load when designing, writing, reviewing, or executing Go tests, examples, fuzz targets, benchmarks, coverage checks, or race-detector evidence."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Go Testing

Go Testing designs, authors, reviews, or executes focused evidence for a named Go behavior or risk. It returns
the smallest repeatable result supported by tests, examples, fuzzing, benchmarks, coverage, race detection,
and integration checks, with every evidence limit explicit.

This operation owns the evidence question, test kind, observable test boundary or controllable dependency,
cases, execution choice, and interpretation. `go-design` owns production design, `go-development` owns
production code changes, `go-concurrency` owns synchronization design, and `go-toolchain` owns project command
syntax, exact package pattern semantics, environment facts, and command effects.

## Principles

### Test behavior at its narrowest stable boundary

A test should fail when promised behavior breaks and remain stable when implementation details change. Select
an observable test boundary or controllable dependency from the contract being protected.

### Make failures explain the broken contract

Good evidence shortens diagnosis. A failure should identify the case, operation, observed value, wanted value,
and relevant context without requiring source-level debugging.

### Control nondeterminism at the design boundary

Time, randomness, I/O, concurrency, process state, and shared fixtures must be owned or substituted. Retrying a
flaky assertion hides uncertainty instead of producing evidence.

### Match each tool to its claim

Unit tests, fuzzing, benchmarks, coverage, and the race detector answer different questions. Combine only the
evidence needed for the risk and state every untested path or unsupported `GOOS/GOARCH` target.

## Rules

- **MUST select exactly one author or execution mode before action and bind its complete effect contract.** Every
  project-path write, disposable output, cache or download, project execution, network effect, credential-use
  fact, external-mutation fact, pause point, terminal result, and recovery field must match that mode.
- **MUST make tests deterministic, isolated, and repeatable under the project's supported execution order.**
  Control time, randomness, environment, files, network, and shared state at an observable test boundary or
  controllable dependency.
- **MUST make each failure identify the case and show useful `got` and `want` evidence or an equivalent
  behavioral comparison.** Mark helpers with `t.Helper` so locations point to the failed contract.
- **MUST release test resources and restore process state on every applicable exit path.** Cover success, error,
  cancellation, timeout, skip, and panic exit paths with `t.Cleanup`, temporary directories, test-scoped
  environment helpers, contexts, and close functions as the selected Go toolchain version and fixture require.
- **MUST prevent concurrent tests and subtests from mutating shared fixtures or process-wide state without
  synchronization.** Confirm loop-variable and closure behavior against the module's Go language version before
  using parallel subtests.
- **NEVER present a pass, coverage percentage, benchmark sample, fuzz run, or race-detector run as proof beyond
  the inputs, paths, duration, `GOOS/GOARCH` target, and configuration it exercised.** Report the evidence
  boundary with the result.

## Procedure

### Phase 1 — Bind the Evidence Contract

#### 1.1 Bind the evidence question and boundary

- Read the accepted result, public or package contract, existing evidence, defect report, minimum supported Go
  version, selected Go toolchain version, module's Go language version, build constraints, compatibility
  obligations, supported `GOOS/GOARCH` targets, and applicable success, error, cancellation, timeout, or panic
  exit paths.
- Name the evidence question, observable behavior or risk, test kind, and success condition. Bind the narrowest
  observable test boundary or controllable dependency that can distinguish the promised result.
- Map time, randomness, environment, files, network, process state, concurrency, private dependencies, and slow
  or external systems. If production design supplies no valid boundary, stop and hand the design need to
  `go-design` or the production change to `go-development`; do not add a test-only public hook.
- Record the project test command, exact package pattern only as project-command selection or evidence, flags,
  `GOOS/GOARCH` target, and expected evidence. Use `go-toolchain` for their syntax, semantics, environment, and
  effect classification.

#### 1.2 Bind author or execution mode and effects

- Select exactly one mode. A writing task uses author mode; a review or run that leaves project source unchanged
  uses execution mode. Authority in one mode or sibling never transfers to another effect.
- **Author mode:** project-path writes are limited to authorized test, example, fuzz, or benchmark sources;
  disposable writes are limited to approved temporary, fuzz-corpus, and failure outputs; test and fuzz caches
  require approval; downloads require separate authority; execution is limited to the authorized project test
  command and other named project commands for evidence; network access requires separate authority; credential
  use is none; external mutation is none. Pause before a production-source change, undeclared output, network
  access, or download. The terminal result is a focused repeatable evidence source and result or a production-
  design block; recovery hands production design to its owner and retains evidence limits.
- **Execution mode:** project source is read-only; disposable writes are contained temporary, fuzz, coverage,
  and failure outputs; test and fuzz caches remain contained; downloads require separate authority; execution is
  limited to the authorized project test command, named fuzz targets and benchmarks, coverage, and race checks;
  network access requires separate authority; credential use is none; external mutation is none. Pause before
  source mutation, uncontrolled fuzz output, network access, or download. The terminal result is exact evidence
  and limits or a blocked or flaky result; recovery retains the failing input and first recovery action.

### Phase 2 — Design the Evidence

#### 2.1 Select test kinds and cases

- Use an ordinary test for deterministic behavior, a package-level integration test for component boundaries,
  an executable example for caller-visible documentation, fuzzing for input exploration, and a benchmark only
  for a performance question. Add coverage, race detection, build tags, or `GOOS/GOARCH` target checks only for
  the risk they can answer.
- Cover ordinary behavior, boundary values, invalid input, material failure paths, compatibility cases, and every
  applicable termination exit path. For a defect, first define the narrowest regression that distinguishes the
  reproduced defective behavior from the corrected result.
- Keep expensive, privileged, networked, or external-service tests behind a named target or constraint in the
  project test command. Name each prerequisite, and skip only when the project contract makes its absence
  unsupported rather than required.
- If no selected test kind can observe the promised result, stop with the affected obligation and production-
  design handoff instead of weakening the claim.

#### 2.2 Design fixtures, isolation, and failure output

- Use the package under test only when its contract requires unexported access; use an external `_test` package
  for the public caller contract. Prefer a small natural function or consumer-defined interface when a
  controllable dependency is needed.
- Use `t.TempDir`, `t.Cleanup`, test-scoped environment helpers, contexts, and close functions. Use `TestMain`
  only for a real process-wide contract, and keep stable retained file inputs under `testdata`.
- Use a table only when every case shares one setup, behavioral action, and comparison. Give subtests stable
  names, capture loop values according to the module's Go language version, and call `t.Parallel` only when no
  fixture or process-wide state can race.
- Design each failure to name the operation and case and report `got`, `want`, and useful context. Mark assertion
  helpers with `t.Helper`.

### Phase 3 — Produce the Evidence

#### 3.1 Author evidence sources when selected

- In author mode, build the smallest source that reaches the selected boundary, performs one behavioral action,
  and compares the complete result. Make structured differences useful, keep helpers narrow, and use project-
  selected comparison tools only when they reduce current complexity enough to justify their dependency. After
  each complete increment, run the focused project test command; stop when its result contradicts the contract
  instead of loosening the assertion. In execution mode, skip source authoring and keep every project source
  read-only.
- Write examples only for supported caller-visible workflows. Add an output assertion only when it is stable and
  contractual under the [`testing` package example rules](https://pkg.go.dev/testing#hdr-Examples).
- Seed each fuzz target with representative valid, boundary, and regression inputs, constrain inputs outside the
  real domain, test one observable behavior per target, and preserve an authorized failure corpus for regression;
  follow the [Go fuzzing guide](https://go.dev/doc/security/fuzz/). A seed-only run is not exploratory fuzzing.
- Benchmark only the operation whose cost matters, keep setup outside the measured region, consume the result,
  and use APIs supported by the selected Go toolchain version. Gate newer forms such as `B.Loop` instead of
  assuming they exist.

#### 3.2 Execute the selected evidence

- Run the focused project test command first, then the broader project test command with the exact package
  pattern selected by the project. Include only the build tags, prerequisites, and `GOOS/GOARCH` targets bound
  in Phase 1.
- Run retained fuzz seeds, bounded fuzzing, benchmarks, coverage, and race checks only when Phase 2 selected
  them. Record fuzz duration, benchmark repetitions and comparison method, coverage outputs, race workload, and
  every contained cache, temporary, fuzz, coverage, or failure output. Prefer repeated before-and-after
  benchmark samples and a project-approved statistical comparison method over one timing.
- For a regression, prove the evidence fails for the reproduced defective behavior and passes for the corrected
  result when that comparison is safely reproducible. Keep the original reproducer as separate evidence.
- Use `go-toolchain` to bind the exact invocation and effects before execution. On failure, preserve the project
  command, environment, result, and first useful diagnostic; never mutate production source from this operation.

### Phase 4 — Interpret and Return the Result

#### 4.1 Interpret and challenge the evidence

- Treat coverage as an executed-statement or profile map, not a universal quality score; see the
  [Go coverage overview](https://go.dev/blog/cover). Treat a race report as a defect in an executed path and a
  clean run as limited evidence; see the [race detector](https://go.dev/doc/articles/race_detector). Investigate
  material uncovered behavior without inventing an unowned coverage percentage.
- Treat one benchmark sample, a seed-only fuzz run, a retry, a skip, or another `GOOS/GOARCH` target's pass as
  bounded evidence. Keep flakes, unsupported `GOOS/GOARCH` targets, prohibitive cost, unexecuted paths, and
  unexercised exit paths outside the completion claim.
- Review authored sources and executed evidence for contract focus, useful failures, deterministic resources,
  safe parallelism, resource cleanup, and unnecessary coupling. Repair only authorized evidence sources and
  repeat every affected layer.
- Apply [the evaluation checklist](checklists.md) and every active `go` sibling checklist when the result enters
  Evaluation; the general Evaluation operation owns evidence resolution and verdicts.

#### 4.2 Return completion, block, and recovery records

- Return the mode; evidence question and test kind; observable test boundary or controllable dependency; cases;
  changed or reviewed paths; project test command; exact package pattern; `GOOS/GOARCH` target; flags, inputs,
  duration, repetitions, and result; cache, temporary, fuzz, coverage, and failure outputs; flakes; evidence
  limits; and any production-design handoff. State why any listed field is not applicable.
- In author mode, return the focused repeatable evidence source and result or the exact production-design block.
  In execution mode, return exact evidence and limits or the exact blocked or flaky result. Record whether every
  applicable success, error, cancellation, timeout, or panic exit path was exercised.
- For a block, name the missing prerequisite or first useful diagnostic, affected obligation, current evidence,
  risk, owner, retained state, first recovery action, and handoff. Retain the failing input when one exists, and
  never convert an unobservable behavior, flaky project test command, unsupported promised `GOOS/GOARCH` target,
  skipped required test, or unavailable selected layer into completion.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
