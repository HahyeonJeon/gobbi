---
name: typescript-development
description: "MUST load when implementing or changing TypeScript code."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# TypeScript Development

TypeScript Development coordinates an authorized TypeScript change from supplied product requirements through typed design, bottom-up construction, project-kind verification, and handoff. It applies only when files may change; read-only review uses the general Evaluation operation with the applicable TypeScript preference children.

This operation composes with `typescript-conventions` and `typescript-typing` for ordinary implementation. Load `typescript-async`, `typescript-toolchain`, `typescript-packaging`, or `typescript-testing` whenever their root trigger also applies. Select every applicable project kind: web application, command-line application (CLI), library, SDK, and desktop application. If none fits, record a literal fallback such as `server process`, `build script`, or `test utility`.

The applicable product domain supplies user experience, command semantics, service behavior, operating-system support, deployment, and release decisions. This operation implements those inputs in TypeScript through type models, runtime parsing, exact compiler files, JavaScript and declaration output, tests, package metadata, consumer checks, and final-tree command results.

## Principles

### Study the supplied requirements first

Read the callers, external inputs, exact compiler files, tests, and prior art that determine what the changed code must preserve.

### Design the typed API before behavior

Settle inputs, outputs, states, failures, responsible scopes, and public declarations before implementation details make them expensive to change.

### Build from foundations upward

Materialize types and integration points first, then grow one caller-visible behavior increment at a time with a current type-check and focused test.

### Verify the delivered path

Type correctness is one check among runtime behavior, integration, build, packaging, installed-consumer, and documentation results.

## Rules

- **MUST** lock scope, success criteria, affected callers, external input data, exact compiler files, and verification commands before editing behavior.
- **MUST** select every applicable project kind and record each named runtime, source entry, generated output, and consumer path before implementation.
- **NEVER** treat a type annotation or assertion as validation of data received from a network, file, process, message, environment variable, or other untyped source.
- **MUST** build the typed skeleton before behavior and keep each behavior increment type-correct and behaviorally verified.
- **NEVER** widen mutation beyond the authorized affected set, turn a local change into an unapproved migration, or edit a generated mirror directly. Edit the canonical source and run the sync command responsible for the mirror.
- **MUST** run every applicable final check from the completed tree and re-run the original reproducer last for a defect.

## Procedure

### Phase 1 — Study

#### 1.1 Lock the change

- Record what changes, why it changes, how success is observed, and what is out of scope.
- Classify the request as implementation; for read-only review, stop and route to the general Evaluation operation.
- Read applicable project rules, mistakes, design decisions, and neighboring examples.

#### 1.2 Classify the TypeScript project

- Select all applicable kinds: web application, command-line application, library, SDK, and desktop application; otherwise record one literal fallback kind.
- For each selected kind, record its named runtimes, source entries, exact `tsconfig.json` files, JavaScript or declaration outputs, and direct consumers.
- Record which product decisions are supplied by the task, `web`, `desktop`, `electron`, or another applicable domain, and route missing product decisions back to that source before encoding them in TypeScript.

#### 1.3 Map the affected files and consumers

- Trace callers, callees, public exports, external inputs, state-holding modules, asynchronous lifetimes, tests, build entries, packages, and documentation.
- Record the TypeScript children whose triggers apply and load them before their decisions.
- Identify the commands and named runtime or installed-consumer paths that will prove each success criterion.

#### 1.4 Reproduce or characterize

- Reproduce a defect before changing it, or capture the current caller-visible behavior for a feature change.
- Inspect the effective compiler configuration and runtime behavior rather than inferring either from file extensions.
- Record assumptions that the repository cannot answer.

### Phase 2 — Design

#### 2.1 Shape typed inputs and outputs

- Define narrow input and output types from the supplied product requirements.
- Make valid states representable with unions or explicit models and define how every state is consumed.
- Treat external input as `unknown` until runtime parsing or narrowing establishes the internal type.

#### 2.2 Place behavior and responsibility

- Assign each state value, promise, resource, side effect, and failure transition to one named function, object, or lifecycle scope.
- Decide which declarations are public and which remain implementation details.
- Map the dependency order from foundational types and utilities to integrations and callers.

#### 2.3 Confirm the typed design

- Compare the proposed public API and internal module interfaces with project prior art and one credible alternative.
- Resolve material API, compatibility, failure, or lifecycle decisions with the user or cite their locked source.
- End the phase with a bounded file and verification plan.

### Phase 3 — Build

#### 3.1 Materialize the skeleton

- Add or change types, interfaces, signatures, modules, and integration interfaces without filling behavior.
- Type-check the skeleton with the exact `tsconfig.json` that includes the changed source entry.
- Return to design when the skeleton exposes a structural mismatch.

#### 3.2 Grow verified behavior increments

- Implement the smallest caller-visible behavior increment and update its affected callers, tests, types, and documentation together.
- Run the focused type and behavior checks for that behavior increment before starting the next.
- Preserve existing behavior outside scope and remove no compatibility path without authorization.

#### 3.3 Complete the affected set

- Trace each scope item to an implementation and each affected file to a change or justified no-op.
- Remove placeholders, dead branches, obsolete suppressions, and temporary diagnostics introduced by the change.
- Inspect the complete diff before final verification.

### Phase 4 — Verify and hand off

#### 4.1 Run static checks

- Run formatting, linting, and every applicable TypeScript project check on the final tree, naming the exact `tsconfig.json` used by each check.
- Inspect effective configuration or declaration output when the change depends on it.
- Fail on warnings or suppressions that invalidate the claimed requirement.

#### 4.2 Run behavioral checks

- Run focused tests, then the broader suite and build paths required by the generated JavaScript, declarations, package archive, or executable.
- Exercise cancellation, failure, cleanup, external-input validation, and differences among the named runtimes when applicable.
- Use the built output, installed package archive, or installed command when source-checkout success cannot prove the consumer path.

#### 4.3 Verify each selected project kind

- For a web application, verify browser and server entries under their exact compiler files, then exercise the production build in each named browser or server runtime that the change affects.
- For a command-line application, install the package archive when one exists, invoke the installed command, and verify arguments, standard streams, exit status, signals, and failure text required by the supplied command specification.
- For a library, inspect public declarations and verify each supported import from an isolated installed consumer.
- For an SDK, validate external service payloads at runtime and verify documented client calls, public declarations, failures, cancellation, and supported consumer configurations against the supplied service requirements.
- For a desktop application, verify Electron main, preload, and renderer entries separately where present, including typed IPC messages and the packaged application path required by the desktop and Electron skills.
- For a fallback project kind, verify every named runtime, generated output, and direct consumer recorded in Phase 1.

#### 4.4 Close traceability and hand off

- Re-run the original defect reproducer last when one exists.
- Map current-tree command output to every success criterion and inspect the final scope for unrelated changes.
- Hand off limitations or unavailable checks literally; do not convert a missing result into a pass.
- Hand off the selected project kinds, named runtimes, exact compiler files, generated outputs, consumer paths, commands run, results, and remaining limitations.
- When this implementation is evaluated, the [evaluation checklist](checklists.md) and every checklist
  provided by an active `typescript` sibling supply the applicable conditions; the general Evaluation
  operation resolves them and issues any verdict.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for changes
  governed by this skill.
