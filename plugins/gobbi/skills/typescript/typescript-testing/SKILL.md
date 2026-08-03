---
name: typescript-testing
description: "MUST load when creating or reviewing TypeScript runtime tests, type-level tests, negative tests, declaration checks, package checks, or documented examples."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# TypeScript Testing

TypeScript Testing verifies runtime behavior and compile-time requirements. It composes runtime tests, controllable dependencies, type-level assertions, expected failures, public declaration checks, installed-package checks, and checked documentation examples without treating any one layer as a substitute for the others.

This operation applies to creating and reviewing tests. Review-only mode inspects existing tests and runs authorized commands without inheriting authority to change production or test files.

When review-only package validation applies, it may inspect existing generated package output and a pre-existing
package archive. With command authority, it may write only inside a named temporary directory or isolated
disposable consumer outside reviewed files, remove those writes after review, and install only that pre-existing
archive into the disposable consumer. It may not change the reviewed subject, install persistently, or publish;
evidence that needs a new build or archive remains unavailable unless the task changes to author mode.

## Principles

### Test with the layer that can disprove the claim

Runtime behavior needs an execution result; a type relationship needs a compiler result; a package compatibility statement needs a consumer result against the installed archive.

### Make failures discriminating

A useful test fails for the defect it names and stays green under unrelated refactoring.

### Control nondeterminism at named dependencies

Time, randomness, scheduling, I/O, processes, and external services need explicit controllable adapters.

### Keep teaching executable

Documented examples are code and require a named compiler version and exact compiler options with explicit limits.

## Rules

- **MUST** select runtime, type-level, negative, declaration, package, and example checks from the claims being made.
- **NEVER** use an ordinary type assertion such as `value as Type` or `<Type>value` inside a test as proof that the asserted type is true. `as const` is a const assertion that may construct precise test input, but it does not itself prove a tested type relationship.
- **MUST** prove every expected-error or negative test rejects the intended misuse. For directive-based tests,
  removing the directive must produce the intended diagnostic, and moving it to valid code must produce an
  unused-directive failure.
- **MUST** test public declarations and resolution from an isolated consumer project rather than only inside the source project.
- **MUST** control time, randomness, scheduling, I/O, and named-runtime state when deterministic observation is required.
- **NEVER** treat a source-checkout test as proof of built or packed package behavior.

## Procedure

### Phase 1 — Plan the verification

#### 1.1 Enumerate claims

- List caller-visible behaviors, failure paths, cleanup obligations, type relationships, rejected programs, public declarations, package resolution paths, command distribution and invocation paths, and taught examples.
- Record every TypeScript compiler version claimed for package consumers or taught examples.
- Map each claim to the layer capable of disproving it.
- Mark review-only mode when edits are not authorized.
- Select every applicable project kind: web application, command-line application, library, SDK, desktop application, or a literal fallback.

#### 1.2 Design discriminating cases

- Ensure every applicable ordinary, limit, failure, cancellation, and adversarial case for the tested claims is included.
- Define what mutation or controlled defect would make each test fail.
- Avoid assertions tied only to implementation order or private structure unless that structure is an explicit requirement.

#### 1.3 Establish controllable dependencies

- Identify time, randomness, network, filesystem, process, event, and scheduler dependencies.
- Use project-standard fakes or injected adapters while preserving the behavior under test.
- Record unavoidable nondeterminism and the repeated or statistical result that bounds it.

### Phase 2 — Build runtime tests

#### 2.1 Test observable behavior

- Reach the unit through its public API, command, or user-visible interface.
- Assert outputs, state transitions, emitted events, side effects, and failures that consumers observe.
- Verify cleanup after success, failure, cancellation, and early exit when resources are involved.

#### 2.2 Exercise async behavior

- Control completion order and test overlapping operations with inverted results.
- Distinguish cancellation from stale-result suppression and assert the intended one.
- Observe every rejection so the test cannot pass with background failures.

#### 2.3 Verify the failure power

- Introduce or simulate the named defect when practical and confirm the test fails for the expected reason.
- Restore the accepted implementation and run the focused test again.
- If the test stays green under the defect or stays red after restoration, return to Phase 1.2 for the case design or the owning Phase 2 step for the runtime test.
- Reject snapshots or broad assertions that pass under the defect.

### Phase 3 — Build type and declaration tests

#### 3.1 Add positive type cases

- Compile representative valid uses through the public API.
- Assert inferred or declared relationships with type-level helpers that fail on mismatch.
- Keep runtime assertions separate from compile-time claims.

#### 3.2 Add negative type cases

- Compile intentionally invalid uses with the project's expected-error mechanism.
- Confirm removing the expectation produces the intended diagnostic and that an unused expectation fails.
- If either mutation does not discriminate the intended misuse, return to Phase 1.2 or revise the negative case in this step before continuing.
- Keep diagnostic-sensitive tests narrow enough to reject the targeted misuse rather than any arbitrary error.

#### 3.3 Test declarations, packages, and commands

- In author mode, emit or obtain the public declarations and type-check isolated consumer fixtures.
- In author mode, build or pack the package, install that archive into an isolated consumer, and exercise its documented entry points and resolution modes.
- In review-only package validation, inspect only existing declarations and generated package output. Inspect or install only a package archive that existed before the review, and install it only into an isolated disposable consumer when command authority permits.
- In review-only package validation, do not edit reviewed files, build or rebuild generated package output, create or recreate an archive, install into a persistent environment, update documentation or release notes, or publish. Report required evidence that needs a new build or archive as unavailable, or request author mode.
- For every command supplied through a package archive, capture command-name resolution in the isolated consumer. Prove that it selects the executable created by that archive installation.
- Invoke the installed command and assert the arguments, standard streams, exit status, signals, and failure text required by the supplied command specification.
- Compare declarations or exported APIs when compatibility is a stated requirement.

### Phase 4 — Verify examples and the suite

#### 4.1 Verify documented examples

- Extract every fenced `ts` example the documentation presents as valid or intentionally rejected.
- Compile each self-contained example exactly as displayed with every compiler version claimed for it. For an `@ts-expect-error` example, also prove that removing or moving the directive produces the intended diagnostic or an unused-directive failure under each version.
- Record every compiler version, option set, and result. State that these checks prove only those examples under those versions and options; they do not prove every named runtime, project `tsconfig.json`, or installed package path.

#### 4.2 Run the verification ladder

- Run focused runtime and type checks, then the broader test, declaration, build, and package checks that apply.
- In review-only mode, run only authorized checks that preserve the review-only package-validation boundary. Report a required check that needs new generated package output or a new archive as unavailable or request author mode.
- Ensure zero discovered tests or examples fails closed when discovery is part of the claim.
- Review output from the final-tree run for skipped, quarantined, flaky, or unexpectedly absent cases.
- When a check fails in author mode, return to Phase 1 for a claim or case-design mismatch, Phase 2 for a runtime-test defect, or Phase 3 for a type, declaration, package, or command-test defect.
- After repair, re-run the failed check and every affected downstream check from the final tree.
- In review-only mode, or when repair is unauthorized or outside scope, stop with the failed claim and command evidence. A check that ran and failed is not an unavailable-check limitation.

#### 4.3 Verify each selected project kind

- For a web application, test affected browser and server behavior at the layer that exposes it and smoke-test the production build in the named runtime.
- For a command-line application, prepare the recorded distribution method in an isolated consumer and invoke its consumer command.
  For an npm-style package command, prove command resolution selects the archive installation.
  For a bundled executable, installed script, workspace command, or other method, prove the invoked executable
  is the recorded output rather than an unrelated command already on `PATH`.
  Verify the command specification, including failure and signal paths that apply.
- For a library, type-check and run representative imports from an isolated installed consumer.
- For an SDK, verify external payload parsing, documented client calls, public types, failures, cancellation, and supported consumer compiler configurations.
- For a desktop application, test main, preload, renderer, and typed IPC behavior separately where present, then exercise the packaged application path required by the Electron and desktop skills.
- For a fallback project kind, test every named runtime, generated output, and direct consumer recorded by `typescript-development`.

#### 4.4 Review traceability

- Map every claim to at least one current test and every test to a named requirement.
- Record unavailable runtimes, tools, or package modes as limitations.
- In review-only mode, report findings without mutating the reviewed files.
- When this test change is evaluated, the [test checklist](checklists.md), [project-kind checklist](project-kind-checklists.md), and every checklist provided by
  an active `typescript` sibling supply the applicable conditions; the general Evaluation operation
  resolves them and issues any verdict.

## References

- [Test checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for test design and evidence.
- [Project-kind checklist](project-kind-checklists.md) supplies reusable unchecked scenarios and atomic conditions for web, CLI, library, SDK, desktop, and fallback verification.
