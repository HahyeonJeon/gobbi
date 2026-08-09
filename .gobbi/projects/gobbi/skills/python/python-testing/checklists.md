# Python Testing Evaluation Checklist

## Evidence contract

- [ ] The evidence record names the behavior or risk, affected consumer, selected test kind, observable boundary or controllable dependency, and project-selected command.
- [ ] The evidence scope identifies interpreter and configuration facts, inputs, prerequisites, duration or repetition bound, retained outputs, and unexercised limits.
- [ ] The selected boundary observes the promised behavior without adding a test-only public production interface.
- [ ] A missing observable boundary is handed to `python-development` as a design need rather than masked by an implementation-detail assertion.

## Cases and isolation

- [ ] The evidence source covers applicable normal behavior, meaningful boundaries, invalid input, material failure behavior, and a narrow regression for a safely reproduced defect.
- [ ] Each behavioral comparison makes the operation, case, observed value, expected value, and useful context identifiable.
- [ ] Time, randomness, environment, filesystem, network, process, and shared state are controlled, excluded, or explicitly bounded at the selected boundary.
- [ ] Resources and process-wide state have cleanup or restoration coverage for every applicable successful and failing path.

## Execution and limits

- [ ] Test execution uses only the configured interpreter, project-selected command, inputs, prerequisites, output boundary, and authorized external effects.
- [ ] A retained failure or flake identifies its input, conditions, first useful diagnostic, and evidence limit without an added retry or weakened assertion.
- [ ] The evidence record identifies exercised cases, observations, skips, unsupported environments, unavailable prerequisites, and remaining gaps.
- [ ] Installed-distribution behavior is handed to `python-packaging`, and latency, throughput, CPU, allocation, memory, startup, or resource claims are handed to `python-performance`.

## Misleading form

- [ ] No universal test framework, runner, coverage percentage, passing command, or run count is represented as Python-wide proof.
- [ ] No test record presents an installed-distribution, compatibility, or performance conclusion beyond the selected evidence scope.
