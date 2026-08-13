---
name: python-development
description: "Python Development studies, implements, reviews, and verifies one accepted code change."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Python Development

Python Development studies one accepted change, builds the smallest complete implementation, and verifies the affected tree.

Use it when accepted implementation requirements are studied or Python code is designed, changed, reviewed, or verified. It returns bounded implementation evidence or an exact block while routing specialized concerns to their owners.

## Principles

### Study the affected contract before editing

Requirements, callers, public behavior, configuration, and existing evidence identify the change's actual
boundary. A plausible local edit is incomplete when a dependent consumer or documented contract disagrees.

### Build from stable interfaces upward

Establish the smallest coherent structure before dependent behavior. Add one complete increment at a time so
each review can expose incorrect assumptions while repair remains local.

### Preserve evidence limits

Implementation review can establish only what its selected checks observe. State unexercised behavior and route
test design to its owner instead of treating a clean diff as proof of correctness.

## Rules

- **MUST bind the accepted outcome, affected consumers, and change boundary before editing.** Inspect the relevant
  tree, configuration, public contracts, callers, existing evidence, and sibling-owned concerns.
- **MUST let project configuration override generic guidance.** Do not select a universal framework, formatter,
  checker, test runner, package layout, or supported interpreter for the project.
- **MUST build and review each change as a complete increment.** Keep interfaces, behavior, errors, resources,
  types, documentation, and consumers consistent before proceeding to a dependent increment.
- **MUST route specialized decisions to their owners.** Use conventions, design, typing, toolchain, testing,
  packaging, performance, and debugging guidance only for the concern each owns.
- **NEVER substitute a code-shaped claim for verification.** Do not call a change correct, compatible, packaged,
  released, or performant beyond the evidence supplied by the applicable operation.

## Procedure

### Phase 1 — Bind the Change

#### 1.1 Study requirements and the affected tree

- Record the requested outcome, affected actor, observable contract, acceptance evidence, included work,
  exclusions, compatibility concerns, and recovery expectation. Stop for an unresolved product or authority
  decision rather than encoding it as an implementation default.
- Inspect the affected modules, package boundaries, callers, public names, configuration, tests, documentation,
  generated or derived paths, and prior behavior. List every surface that expresses the same contract.
- Classify sibling concerns before design: conventions and writing form, API and resource design, typing, project
  tool facts, test evidence, distribution behavior, performance claims, and failures each keep their own owner.

#### 1.2 Define the implementation seam

- Name the smallest stable interface, data boundary, or behavior that satisfies the accepted outcome. Model normal,
  invalid, boundary, error, cancellation, and resource-lifetime paths that apply to it.
- Choose a minimal skeleton: public surface, internal seam, error behavior, state transition, and required caller
  updates. When the change affects installed imports, build metadata, or artifacts, hand that concern to
  `python-packaging` before choosing the layout.
- Identify the project-selected checks that can observe the change. `python-testing` decides test strategy and
  evidence strength; this operation only supplies the implementation contract it must exercise.

### Phase 2 — Build the Complete Increment

#### 2.1 Establish the foundation

- Create or revise the lowest stable unit first: module boundary, function or class interface, data model,
  validation boundary, resource lifetime, or error representation. Use the project's configured Python support
  and style rules where they exist.
- Keep names, annotations, docstrings, imports, and error behavior truthful to the current interface. Load
  `python-conventions`, `python-design`, or `python-typing` when their separate judgment is material.
- Review the foundation against callers and failure paths before adding dependent behavior. Repair an incorrect
  boundary instead of layering a special case over it.

#### 2.2 Add behavior and integrations

- Add one behavior increment that reaches the bound observable contract. Update each affected caller, user-facing
  message, configuration surface, and documentation in the same increment when it expresses that behavior.
- Keep I/O, time, randomness, environment, network, and process effects explicit at the implementation seam so
  `python-testing` can control them without adding a test-only public contract.
- If a runtime symptom appears, preserve it and route reproduction and causal analysis to `python-debugging`.
  If the change creates a measured resource claim, route it to `python-performance` before claiming improvement.

### Phase 3 — Review, Verify, and Hand Off

#### 3.1 Review the affected result

- Compare the completed increment with the accepted outcome and affected-tree inventory. Check contracts,
  compatibility, error paths, resource cleanup, configuration, documentation, and every updated consumer.
- Run only the project-selected implementation checks that are authorized and relevant. Record their exact scope,
  configuration, inputs, and limits; a clean command does not prove unexercised paths.
- Return to the earliest incorrect interface, design, or behavior when review exposes a problem. Do not mask a
  failure by weakening an assertion, swallowing an error, or changing an unrelated caller.

#### 3.2 Return the implementation handoff

- Return changed or reviewed paths, the accepted contract, implementation decisions, checks and their limits,
  compatibility position, unresolved risk, and first recovery action when blocked.
- Hand test design and execution evidence to `python-testing`; installed-distribution validation to
  `python-packaging`; and immutable artifact readiness to `python-release` only after packaging has produced
  the necessary artifact evidence.
- Leave publication, credentials, tagging, and external mutation outside this operation.

## References

- [Evaluation checklist](checklists.md) supplies local unchecked evaluation conditions.
- [Python language reference](https://docs.python.org/3/reference/) owns Python language semantics.
