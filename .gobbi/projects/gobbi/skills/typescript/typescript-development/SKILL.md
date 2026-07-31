---
name: typescript-development
description: "MUST load when implementing or changing TypeScript code."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# TypeScript Development

TypeScript Development carries an authorized implementation from the existing contract through a typed design, bottom-up construction, and final verification. It applies to mutation work only; read-only review uses the general Evaluation operation with the applicable TypeScript preference children.

This operation composes with TypeScript Conventions and TypeScript Typing for ordinary implementation. Load TypeScript Async, Toolchain, Packaging, or Testing whenever their root trigger also applies.

## Principles

### Study the executable contract first

Read the callers, boundaries, configurations, tests, and prior art that determine what the changed code must preserve.

### Design the typed surface before behavior

Settle inputs, outputs, states, failures, ownership, and public declarations before implementation details make them expensive to change.

### Build from foundations upward

Materialize types and structural seams first, then grow one observable slice at a time with fresh evidence.

### Verify the delivered path

Type correctness is one gate among runtime behavior, integration, build, packaging, and documentation evidence.

## Rules

- **MUST** lock scope, success criteria, affected callers, boundary data, configuration, and verification commands before editing behavior.
- **MUST** design narrow inputs, explicit outputs, representable states, failure behavior, and resource ownership before implementation.
- **NEVER** treat a type annotation or assertion as validation of data that entered from an external boundary.
- **MUST** build the typed skeleton before behavior and keep each implementation slice type-correct and behaviorally verified.
- **NEVER** widen mutation beyond the authorized affected set, turn a local change into an unapproved migration, or edit a generated mirror directly. Edit the canonical owner and run its owning sync mechanism.
- **MUST** run every applicable final gate from the completed tree and re-run the original reproducer last for a defect.

## Procedure

### Phase 1 — Study

#### 1.1 Lock the task

- Record what changes, why it changes, how success is observed, and what is out of scope.
- Classify the work as implementation; for review-only work, stop and route to the general Evaluation owner.
- Read applicable project rules, mistakes, design decisions, and neighboring examples.

#### 1.2 Map the affected system

- Trace callers, callees, public exports, boundary inputs, state owners, async lifetimes, tests, build entries, packages, and documentation.
- Record the TypeScript children whose triggers apply and load them before their decisions.
- Identify the commands and runtime paths that will prove each success criterion.

#### 1.3 Reproduce or characterize

- Reproduce a defect before changing it, or capture the current observable behavior for feature work.
- Inspect the effective compiler and runtime contracts rather than inferring them from file extensions.
- Record assumptions that the repository cannot answer.

### Phase 2 — Design

#### 2.1 Shape the typed boundary

- Define narrow input and output types from the domain contract.
- Make valid states representable with unions or explicit models and define how every state is consumed.
- Treat external input as `unknown` until runtime parsing or narrowing establishes the internal type.

#### 2.2 Place behavior and ownership

- Assign each state fact, promise, resource, side effect, and failure boundary one owner.
- Decide which declarations are public and which remain implementation details.
- Map the dependency order from foundational types and utilities to integrations and callers.

#### 2.3 Confirm the design

- Compare the proposed surface with project prior art and one credible alternative.
- Resolve material API, compatibility, failure, or lifecycle decisions with the user or cite their locked source.
- End the phase with a bounded file and verification plan.

### Phase 3 — Build

#### 3.1 Materialize the skeleton

- Add or change types, interfaces, signatures, modules, and structural seams without filling behavior.
- Type-check the skeleton with the project profile that owns the artifact.
- Return to design when the skeleton exposes a structural mismatch.

#### 3.2 Grow verified slices

- Implement the smallest observable slice and update its affected callers, tests, types, and docs together.
- Run the focused type and behavior checks for that slice before starting the next.
- Preserve existing behavior outside scope and remove no compatibility path without authorization.

#### 3.3 Complete the affected set

- Trace each scope item to an implementation and each affected file to a change or justified no-op.
- Remove placeholders, dead branches, obsolete suppressions, and temporary diagnostics introduced by the work.
- Inspect the complete diff before final verification.

### Phase 4 — Verify

#### 4.1 Run static gates

- Run formatting, linting, and every applicable TypeScript project check on the final tree.
- Inspect effective configuration or declaration output when the change depends on it.
- Fail on warnings or suppressions that invalidate the claimed contract.

#### 4.2 Run behavioral gates

- Run focused tests, then the broader suite and build paths the delivered artifact requires.
- Exercise cancellation, failure, cleanup, boundary validation, and runtime-host differences when applicable.
- Use the built or packed artifact when source-checkout success cannot prove the consumer path.

#### 4.3 Close traceability

- Re-run the original defect reproducer last when one exists.
- Map fresh evidence to every success criterion and inspect the final scope for unrelated changes.
- Hand off limitations or unavailable gates literally; do not convert missing evidence into a pass.

## References
