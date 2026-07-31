---
name: typescript-testing
description: "MUST load when creating or reviewing TypeScript runtime tests, type-level tests, negative tests, declaration checks, package checks, or documented examples."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# TypeScript Testing

TypeScript Testing owns verification of runtime behavior and compile-time contracts. It composes runtime tests, deterministic seams, type-level assertions, expected failures, public declaration checks, built-package checks, and executable documentation without treating any one layer as a substitute for the others.

This operation applies to creating and reviewing tests. A read-only review inspects and runs evidence without inheriting authority to change production or test files.

## Principles

### Test the layer that owns the claim

Runtime behavior needs execution evidence; a type relationship needs compiler evidence; a package promise needs consumer evidence against the artifact.

### Make failures discriminating

A useful test fails for the defect it names and stays green under unrelated refactoring.

### Control nondeterminism at seams

Time, randomness, scheduling, I/O, processes, and external services need explicit controllable boundaries.

### Keep teaching executable

Documented examples are code and require a compatible verification profile with explicit limits.

## Rules

- **MUST** select runtime, type-level, negative, declaration, package, and example checks from the claims being made.
- **NEVER** use a type assertion inside a test as evidence that the asserted type is true.
- **MUST** prove that every expected-error or negative test fails when its expectation is removed or inverted.
- **MUST** test public declarations and resolution from a consumer boundary rather than only inside the source project.
- **MUST** control time, randomness, scheduling, I/O, and host state when deterministic observation is required.
- **NEVER** treat a source-checkout test as proof of built or packed package behavior.

## Procedure

### Phase 1 — Plan the evidence

#### 1.1 Enumerate claims

- List observable behaviors, failure paths, cleanup obligations, type relationships, rejected programs, public declarations, package resolution paths, and taught examples.
- Map each claim to the layer capable of disproving it.
- Mark review-only mode when edits are not authorized.

#### 1.2 Design discriminating cases

- Include ordinary, boundary, failure, cancellation, and adversarial cases that apply.
- Define what mutation or controlled defect would make each test fail.
- Avoid assertions tied only to implementation order or private structure unless that structure is the contract.

#### 1.3 Establish deterministic seams

- Identify time, randomness, network, filesystem, process, event, and scheduler dependencies.
- Use project-standard fakes or injected boundaries while preserving the behavior under test.
- Record unavoidable nondeterminism and the evidence that bounds it.

### Phase 2 — Build runtime tests

#### 2.1 Test observable behavior

- Reach the unit through its public or user-visible surface.
- Assert outputs, state transitions, emitted events, side effects, and failures that consumers observe.
- Verify cleanup after success, failure, cancellation, and early exit when resources are involved.

#### 2.2 Exercise async behavior

- Control completion order and test overlapping operations with inverted results.
- Distinguish cancellation from stale-result suppression and assert the intended one.
- Observe every rejection so the test cannot pass with background failures.

#### 2.3 Verify the failure power

- Introduce or simulate the named defect when practical and confirm the test fails for the expected reason.
- Restore the accepted implementation and run the focused test fresh.
- Reject snapshots or broad assertions that pass under the defect.

### Phase 3 — Build type and declaration tests

#### 3.1 Add positive type cases

- Compile representative valid uses through the public surface.
- Assert inferred or declared relationships with type-level helpers that fail on mismatch.
- Keep runtime assertions separate from compile-time claims.

#### 3.2 Add negative type cases

- Compile intentionally invalid uses with the project's expected-error mechanism.
- Confirm removing the expectation produces the intended diagnostic and that an unused expectation fails.
- Keep diagnostic-sensitive tests narrow enough to reject the targeted misuse rather than any arbitrary error.

#### 3.3 Test declarations and packages

- Emit or obtain the public declarations and type-check isolated consumer fixtures.
- Build or pack the package, install that artifact, and exercise its documented entry points and resolution modes.
- Compare declaration or API surfaces when compatibility is part of the contract.

### Phase 4 — Verify examples and the suite

#### 4.1 Verify documented examples

- Extract every fenced TypeScript example the documentation claims is executable.
- Compile positive, partial-with-prelude, expected-error, and type-level categories according to their declared contract.
- State that the example profile verifies compatible teaching fragments; it does not prove every runtime host, compiler profile, or package artifact mode.

#### 4.2 Run the verification ladder

- Run focused runtime and type checks, then the broader test, declaration, build, and package gates that apply.
- Ensure zero discovered tests or examples fails closed when discovery is part of the claim.
- Review fresh output for skipped, quarantined, flaky, or unexpectedly absent cases.

#### 4.3 Review traceability

- Map every claim to at least one current test and every test to a named contract.
- Record unavailable hosts, tools, or package modes as limitations.
- In review-only mode, report findings without mutating the target.

## References
