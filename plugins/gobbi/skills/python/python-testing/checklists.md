# Python Testing Evaluation Checklist

## Scenario Hierarchy

### Design lifecycle

- Evidence contract framing
  - Behavior and observable boundary
    - The selected evidence observes the promised behavior
  - Configuration and execution scope
    - Interpreter, command, prerequisites, and limits are bound
- Case design
  - Contract variations
    - Normal, boundary, invalid, failure, and regression cases remain distinguishable

### Development lifecycle

- Evidence source construction
  - Deterministic fixtures
    - Nondeterministic effects and cleanup remain controlled
- Bounded evidence execution
  - Configured test run
    - The selected command and external effects remain within scope
  - Flaky or unavailable evidence
    - A missing observation remains visible instead of being hidden

### Product lifecycle

- Evidence consumer handoff
  - Downstream packaging and performance consumers
    - Evidence reaches the owner of installed behavior or resource claims
- Consumer trust
  - Scope-limited correctness claim
    - Test form cannot stand in for unexercised consumer evidence

## Checklist Conditions

### Design lifecycle > Evidence contract framing > Behavior and observable boundary > The selected evidence observes the promised behavior

- [ ] The evidence record names the behavior or risk, affected consumer, selected test kind, observable boundary or controllable dependency, and project-selected command.
- [ ] The selected boundary observes the promised behavior without adding a test-only public production interface.
- [ ] A missing observable boundary is handed to `python-development` as a design need rather than masked by an implementation-detail assertion.

### Design lifecycle > Evidence contract framing > Configuration and execution scope > Interpreter, command, prerequisites, and limits are bound

- [ ] The evidence scope identifies interpreter and configuration facts, inputs, prerequisites, duration or repetition bound, retained outputs, and unexercised limits.
- [ ] A changed public compatibility or support-range claim identifies the project-selected support matrix or explicitly unsupported positions.

### Design lifecycle > Case design > Contract variations > Normal, boundary, invalid, failure, and regression cases remain distinguishable

- [ ] The evidence source covers applicable normal behavior, meaningful boundaries, invalid input, material failure behavior, and a narrow regression for a safely reproduced defect.
- [ ] Each behavioral comparison makes the operation, case, observed value, expected value, and useful context identifiable.

### Development lifecycle > Evidence source construction > Deterministic fixtures > Nondeterministic effects and cleanup remain controlled

- [ ] Time, randomness, environment, filesystem, network, process, and shared state are controlled, excluded, or explicitly bounded at the selected boundary.
- [ ] Resources and process-wide state have cleanup or restoration coverage for every applicable successful and failing path.

### Development lifecycle > Bounded evidence execution > Configured test run > The selected command and external effects remain within scope

- [ ] Test execution uses only the configured interpreter, project-selected command, inputs, prerequisites, output boundary, and authorized external effects.

### Development lifecycle > Bounded evidence execution > Flaky or unavailable evidence > A missing observation remains visible instead of being hidden

- [ ] A retained failure or flake identifies its input, conditions, first useful diagnostic, and evidence limit without an added retry or weakened assertion.

### Product lifecycle > Evidence consumer handoff > Downstream packaging and performance consumers > Evidence reaches the owner of installed behavior or resource claims

- [ ] The evidence record identifies exercised cases, observations, skips, unsupported environments, unavailable prerequisites, and remaining gaps.
- [ ] Installed-distribution behavior is handed to `python-packaging`, and latency, throughput, CPU, allocation, memory, startup, or resource claims are handed to `python-performance`.

### Product lifecycle > Consumer trust > Scope-limited correctness claim > Test form cannot stand in for unexercised consumer evidence

- [ ] No universal test framework, runner, coverage percentage, passing command, or run count is represented as Python-wide proof.
- [ ] No test record presents an installed-distribution, compatibility, or performance conclusion beyond the selected evidence scope.
