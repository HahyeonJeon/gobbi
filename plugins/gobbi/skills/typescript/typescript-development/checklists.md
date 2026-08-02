# TypeScript Development Evaluation Checklist

This reusable unchecked source evaluates one authorized TypeScript implementation produced under this
operation. It is governed by the [`typescript`](../SKILL.md) domain and
[`typescript-development`](SKILL.md) operation, with
[`typescript-conventions`](../typescript-conventions/SKILL.md) and
[`typescript-typing`](../typescript-typing/SKILL.md) supplying the source and type preferences it composes.
The source commit that contains this file identifies the checklist version. Its stable owner prefix is
`TSDEV`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### TSDEV-SC-PROJECT-01 — Normal case: the task is locked before any behavior changes

An implementation begins from a request that has to become a bounded task. The expected outcome records what
changes, why, how success is observed, and what is out of scope, and locks the affected callers, boundary
data, configuration, and verification commands first. Editing behavior before that lock is the failure.

#### Checklist

- [ ] TSDEV-CK-PROJECT-01-01 — Scope, success criteria, affected callers, boundary data, configuration, and verification commands are locked before behavior is edited.
- [ ] TSDEV-CK-PROJECT-01-02 — What changes, why it changes, how success is observed, and what is out of scope are recorded.
- [ ] TSDEV-CK-PROJECT-01-03 — Applicable project rules, mistakes, design decisions, and neighboring examples are read before the design.

### TSDEV-SC-PROJECT-02 — Expected failure: the request turns out to be review-only

The task arrives as an implementation request but carries no mutation authority, or resolves into an
assessment of existing code. The expected outcome classifies the work and routes review-only work to the
general Evaluation owner with the applicable preference children. Editing target files anyway is the failure.

#### Checklist

- [ ] TSDEV-CK-PROJECT-02-01 — The work is classified as implementation, or routed to the general Evaluation owner when it is review-only.
- [ ] TSDEV-CK-PROJECT-02-02 — No target file is edited under a review-only classification.

### TSDEV-SC-PROJECT-03 — Rule violation: mutation widens past the authorized set

Adjacent code invites cleanup, a generated mirror looks easier to edit than its source, and a local fix can
grow into a migration. The expected outcome keeps every edit inside the authorized affected set and edits the
canonical owner. Any of those three widenings breaks the Rule on its own.

#### Checklist

- [ ] TSDEV-CK-PROJECT-03-01 — No file outside the authorized affected set is changed.
- [ ] TSDEV-CK-PROJECT-03-02 — No local change is turned into an unapproved migration.
- [ ] TSDEV-CK-PROJECT-03-03 — No generated mirror is edited directly.
- [ ] TSDEV-CK-PROJECT-03-04 — The canonical owner is edited instead of its generated mirror.
- [ ] TSDEV-CK-PROJECT-03-05 — The sync mechanism owning the generated mirror is run after the canonical owner is edited.

## Structure

### TSDEV-SC-STRUCTURE-01 — Normal case: the typed surface is settled before behavior

Inputs, outputs, states, failures, ownership, and public declarations become expensive to change once
implementation details depend on them. The expected outcome settles them first and gives every state fact and
side effect one owner. A surface that emerges from the implementation is the failure.

#### Checklist

- [ ] TSDEV-CK-STRUCTURE-01-01 — Narrow inputs, explicit outputs, representable states, failure behavior, and resource ownership are designed before implementation.
- [ ] TSDEV-CK-STRUCTURE-01-02 — Every state fact, promise, resource, side effect, and failure boundary has exactly one owner.
- [ ] TSDEV-CK-STRUCTURE-01-03 — Each declaration the change introduces is decided as public or as an implementation detail.
- [ ] TSDEV-CK-STRUCTURE-01-04 — The dependency order runs from foundational types and utilities to integrations and callers.

### TSDEV-SC-STRUCTURE-02 — Edge case: the skeleton exposes a structural mismatch

The typed skeleton compiles only with a cast, an optional field, or a widened parameter, which is the point
where the design and the real contract disagree. The expected outcome type-checks the skeleton with the
profile that owns the artifact and returns to design. Bending the skeleton to keep building is the failure.

#### Checklist

- [ ] TSDEV-CK-STRUCTURE-02-01 — The typed skeleton is type-checked with the project profile that owns the artifact before behavior is added.
- [ ] TSDEV-CK-STRUCTURE-02-02 — A structural mismatch exposed by the skeleton returns the work to design rather than being absorbed into the implementation.

## Performance

### TSDEV-SC-PERFORMANCE-01 — Poor quality: the verification loop gives feedback too late

The change is correct and every gate eventually runs, but checks are deferred until the whole implementation
is written, so a defect introduced in an early slice is found after several later slices depend on it. The
expected outcome runs focused checks per slice and reserves the broader suite and build paths for the
completed tree.

#### Checklist

- [ ] TSDEV-CK-PERFORMANCE-01-01 — Focused type and behavior checks are run for each slice before the next slice begins.
- [ ] TSDEV-CK-PERFORMANCE-01-02 — The broader suite and build paths are run in addition to the focused checks rather than in place of them.

## Aesthetics

### TSDEV-SC-AESTHETICS-01 — Poor quality: the delivered diff still carries construction debris

The implementation works, but placeholders, dead branches, obsolete suppressions, and temporary diagnostics
from the build remain in the tree, and the diff was never read end to end. The expected outcome removes what
the work introduced and inspects the complete diff before final verification.

#### Checklist

- [ ] TSDEV-CK-AESTHETICS-01-01 — Every placeholder, dead branch, obsolete suppression, and temporary diagnostic introduced by the work is removed.
- [ ] TSDEV-CK-AESTHETICS-01-02 — The complete diff is inspected before final verification.

## Usage

### TSDEV-SC-USAGE-01 — Normal case: existing consumers keep working through the change

Callers, tests, types, and documentation depend on the code being changed, and a consumer sees the built
artifact rather than the source checkout. The expected outcome carries each slice's consumers with it,
preserves behavior outside scope, and proves the consumer path from the artifact when the source cannot.

#### Checklist

- [ ] TSDEV-CK-USAGE-01-01 — Each slice updates its affected callers, tests, types, and documentation together with the implementation.
- [ ] TSDEV-CK-USAGE-01-02 — Behavior outside scope is preserved.
- [ ] TSDEV-CK-USAGE-01-03 — No compatibility path is removed without authorization.
- [ ] TSDEV-CK-USAGE-01-04 — The built or packed artifact is used wherever source-checkout success cannot prove the consumer path.

### TSDEV-SC-USAGE-02 — Expected failure: a required gate, host, or tool is unavailable

A runtime host, package mode, or check the success criteria depend on cannot be run in this environment. The
expected outcome reports the gap literally as a limitation so the caller can decide. A handoff that presents
the remaining evidence as complete is the failure.

#### Checklist

- [ ] TSDEV-CK-USAGE-02-01 — Every unavailable gate, host, or tool is handed off literally as a limitation.
- [ ] TSDEV-CK-USAGE-02-02 — No missing evidence is converted into a pass.

## Consistency

### TSDEV-SC-CONSISTENCY-01 — Normal case: effective contracts are read rather than inferred

File extensions, editor behavior, and habit suggest what the compiler, runtime, and sibling skills require;
only the effective configuration says so. The expected outcome inspects those contracts, loads the children
whose triggers apply, and compares the design with prior art. Inference in place of inspection is the failure.

#### Checklist

- [ ] TSDEV-CK-CONSISTENCY-01-01 — The effective compiler and runtime contracts are inspected rather than inferred from file extensions.
- [ ] TSDEV-CK-CONSISTENCY-01-02 — Every TypeScript child whose trigger applies is recorded.
- [ ] TSDEV-CK-CONSISTENCY-01-03 — Every TypeScript child whose trigger applies is loaded before the decisions it owns.
- [ ] TSDEV-CK-CONSISTENCY-01-04 — The proposed surface is compared with project prior art and one credible alternative.

### TSDEV-SC-CONSISTENCY-02 — Poor quality: scope and affected files are never traced back

The implementation is sound, yet nothing connects the locked scope items to the code that satisfies them, so a
dropped item or an untouched affected file is invisible. The expected outcome traces both directions before
verification.

#### Checklist

- [ ] TSDEV-CK-CONSISTENCY-02-01 — Every locked scope item traces to an implementation.
- [ ] TSDEV-CK-CONSISTENCY-02-02 — Every affected file carries a change or a justified no-op.

## Risk

### TSDEV-SC-RISK-01 — Rule violation: a type is used as boundary validation

Data arriving from a network response, a file, a message, or a decoded payload is typed by declaration alone,
so the program trusts a shape nothing checked. The expected outcome holds that data as `unknown` and narrows
it at runtime. An annotation or assertion standing in for validation breaks the Rule.

#### Checklist

- [ ] TSDEV-CK-RISK-01-01 — No type annotation or assertion is treated as validation of data that entered from an external boundary.
- [ ] TSDEV-CK-RISK-01-02 — External input is held as `unknown` until runtime parsing or narrowing establishes the internal type.

### TSDEV-SC-RISK-02 — Normal case: the failure paths of the change are exercised

Cancellation, failure, cleanup, boundary validation, and host differences are where an otherwise working
change breaks. The expected outcome exercises each that applies and refuses a pass that rests on a warning or
suppression. Green output over an invalidated contract is the failure.

#### Checklist

- [ ] TSDEV-CK-RISK-02-01 — Cancellation, failure, cleanup, boundary validation, and runtime-host differences are exercised wherever they apply.
- [ ] TSDEV-CK-RISK-02-02 — No warning or suppression that invalidates the claimed contract is accepted as a pass.

## Overall

### TSDEV-SC-OVERALL-01 — Normal case: the work closes where it opened

A defect fix or a feature change starts from an observed behavior and ends by proving that behavior changed as
promised. The expected outcome reproduces first, re-runs the original reproducer last, and maps fresh evidence
to each success criterion. Evidence collected before the final tree is the failure.

#### Checklist

- [ ] TSDEV-CK-OVERALL-01-01 — A defect is reproduced before it is changed.
- [ ] TSDEV-CK-OVERALL-01-02 — Current observable behavior is captured for feature work.
- [ ] TSDEV-CK-OVERALL-01-03 — The original defect reproducer is re-run last when one exists.
- [ ] TSDEV-CK-OVERALL-01-04 — Fresh evidence from the final tree is mapped to every success criterion.

### TSDEV-SC-OVERALL-02 — Adversarial: gates made to pass instead of made to hold

A suppression, a narrowed check, a reused earlier build, or an assertion that silences a diagnostic can turn a
red gate green while the contract it guarded is unchanged. The expected outcome runs every applicable gate
from the completed tree and treats a silenced check as unrun.

#### Checklist

- [ ] TSDEV-CK-OVERALL-02-01 — Every applicable final gate is run from the completed tree rather than from an earlier or partial state.
- [ ] TSDEV-CK-OVERALL-02-02 — No gate result is obtained by narrowing, suppressing, or asserting away the check it depends on.
- Also applies: TSDEV-CK-AESTHETICS-01-01 (suppressions introduced by the work are removed).
