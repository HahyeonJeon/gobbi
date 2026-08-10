---
name: python-testing
description: "MUST load when Python tests or other executable correctness evidence are designed, written, reviewed, or run."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Python Testing

Python Testing designs, writes, reviews, or runs executable correctness evidence for one Python behavior or risk.
It returns the smallest repeatable evidence record that the selected tests can support, including explicit limits
for unexercised behavior and unavailable prerequisites.

This operation owns test design, isolation, execution, and interpretation. `python-development` owns production
implementation, `python-packaging` owns installed-distribution behavior, `python-performance` owns performance
claims, and `python-toolchain` owns concrete project command and tool facts.

## Principles

### Test the promised behavior at a stable boundary

Evidence should observe a public contract or controllable dependency, not an incidental implementation shape.
A useful failure identifies the behavior, case, observed value, expected value, and relevant context.

### Control sources of nondeterminism

Time, randomness, environment, files, network, processes, and shared state make evidence unreliable unless the
test boundary controls or explicitly excludes them. Retrying a flaky assertion is not a substitute for isolation.

### Keep every claim within its exercised scope

A passing test, example, or other executable check proves only its selected inputs, configuration, and paths.
Coverage, run count, or a successful command does not establish an untested compatibility or performance claim.

## Rules

- **MUST bind one evidence question and observable boundary before writing or running tests.** Record the behavior
  or risk, affected consumer, selected test kind, controllable dependency, cases, and project-selected command.
- **MUST make fixtures deterministic, isolated, and clean on every applicable exit path.** Control or restore time,
  randomness, environment, filesystem, network, process, and shared state within the selected boundary.
- **MUST cover normal behavior, meaningful boundaries, invalid input, and material failure behavior.** A defect
  needs a narrow regression that distinguishes the reproduced behavior from the corrected contract when safe.
- **MUST state the execution scope and evidence limits.** Include the interpreter and configuration facts, inputs,
  selected command, prerequisites, result, and unexercised or unsupported paths.
- **NEVER present tests as installed-distribution or performance proof without their owners' evidence.** Do not
  select a universal test runner, replace a missing boundary with a test-only public API, or hide a flaky result.

## Procedure

### Phase 1 — Bind the Evidence Contract

#### 1.1 Study the behavior and project test context

- Read the accepted behavior, public or internal contract, relevant prior evidence, defect report, supported
  interpreter and environment facts, configuration, compatibility expectations, and applicable error or resource
  exit paths.
- For a changed public compatibility or support-range claim, bind the evidence to the project-selected support
  matrix or explicitly unsupported positions. State unavailable evidence as a limit instead of implying support.
- Name the evidence question, affected consumer, normal result, meaningful boundaries, invalid inputs, material
  failures, and the narrowest observable behavior or controllable dependency that can distinguish the contract.
- Use `python-toolchain` for concrete project command and tool facts. If the production design has no stable
  observable boundary, hand the design need to `python-development` rather than exposing a test-only interface.

#### 1.2 Choose evidence and execution limits

- Select test, example, integration check, property-oriented input exploration, or another project-supported
  evidence form based on the question. Do not infer a project runner, framework, or coverage target.
- Bind the project-selected command, configuration, inputs, repetition or duration bound, temporary outputs,
  external prerequisites, and authority for any network, download, credential, or external effect. Stop before
  an unbounded or unauthorized run.
- State what the selected evidence cannot prove, including unexercised platforms, external services, installed
  behavior, or measured performance. Route those claims to their owners.

### Phase 2 — Design or Review the Evidence Source

#### 2.1 Define cases and observable assertions

- Cover normal behavior, boundary values, invalid input, material error behavior, and a narrow defect regression
  where they apply. Each assertion should expose the operation, case, observed value, expected value, and useful
  context without coupling to incidental implementation details.
- Use tables or parameterization only when cases share the same setup, behavior, and comparison. Keep distinct
  workflows and incompatible setup in separate evidence sources.
- Keep production contract decisions with `python-development` and do not expand a public API solely because a
  test is inconvenient to write.

#### 2.2 Build isolated fixtures

- Control or substitute time, randomness, environment, filesystem, network, process, and shared state at the
  selected boundary. Give temporary paths, cleanup, retained failures, and external prerequisites explicit owners.
- Restore process-wide state and release resources for successful and failing paths. Keep parallel or concurrent
  tests away from shared fixtures unless the project contract provides safe coordination.
- Review existing tests for false positives from the working tree, import path, stale outputs, or unbounded external
  access. Installed-consumer validation belongs to `python-packaging`.

### Phase 3 — Execute and Interpret the Evidence

#### 3.1 Write, review, or run the selected evidence

- In an authoring task, make the smallest source that reaches the selected observable boundary. In a review or run,
  keep project sources read-only unless a separate change authorizes test-source edits.
- Run only the bound project-selected command with the configured interpreter, inputs, prerequisites, duration,
  and output limits. Record command identity, result, first useful diagnostic, and every relevant retained output.
- Preserve a failing input or flake with its conditions. Do not weaken assertions, add retries, skip required cases,
  or alter production code from this operation to make the result look clean.

#### 3.2 Return bounded correctness evidence

- Compare the observations with the bound behavior and report which normal, boundary, invalid, and failure cases
  were exercised. State every gap, skip, flake, unsupported environment, or prerequisite that limits the claim.
- For a safe regression, distinguish the reproduced defective behavior from the corrected result; otherwise state
  why the before comparison is unavailable and retain the original diagnostic evidence.
- Hand production changes to `python-development`, installed artifact evidence to `python-packaging`, and any
  latency, throughput, CPU, allocation, memory, startup, or resource conclusion to `python-performance`.

## References

- [Evaluation checklist](checklists.md) supplies local unchecked evaluation conditions.
- [Python `unittest` module](https://docs.python.org/3/library/unittest.html) documents the standard test framework.
- [Python `doctest` module](https://docs.python.org/3/library/doctest.html) documents executable documentation examples.
