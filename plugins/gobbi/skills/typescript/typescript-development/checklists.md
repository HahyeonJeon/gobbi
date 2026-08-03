# TypeScript Development Evaluation Checklist

This reusable unchecked source evaluates one authorized TypeScript implementation produced under this
operation. It is governed by the [`typescript`](../SKILL.md) domain and
[`typescript-development`](SKILL.md) operation, with
[`typescript-conventions`](../typescript-conventions/SKILL.md) and
[`typescript-typing`](../typescript-typing/SKILL.md) supplying the source and type preferences it composes.
The source commit that contains this file identifies the checklist version. Its stable checklist prefix is
`TSDEV`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its defining scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### TSDEV-SC-PROJECT-01 — Normal case: the task is locked before any behavior changes

An implementation begins from a request that has to become a bounded change. The expected outcome records what
changes, why, how success is observed, and what is out of scope, and locks the affected callers, external input
data, exact `tsconfig.json` files, and verification commands first. Editing behavior before that lock is the failure.

#### Checklist

- [ ] TSDEV-CK-PROJECT-01-01 — Scope, purpose, success criteria, affected callers, external input data, exact `tsconfig.json` files, and verification commands are recorded before behavior is edited.
- [ ] TSDEV-CK-PROJECT-01-03 — Applicable project rules, mistakes, design decisions, and neighboring examples are read before the design.

### TSDEV-SC-PROJECT-02 — Expected failure: the request turns out to be review-only

The task arrives as an implementation request but carries no mutation authority, or resolves into an
assessment of existing code. The expected outcome classifies the request and routes read-only review to the
general Evaluation operation with every child selected by the TypeScript root's trigger table. Editing the reviewed files anyway is the failure.

#### Checklist

- [ ] TSDEV-CK-PROJECT-02-01 — The request is classified as implementation, or routed to the general Evaluation operation when it is read-only review.
- [ ] TSDEV-CK-PROJECT-02-02 — No reviewed file is edited under a read-only classification.

### TSDEV-SC-PROJECT-03 — Rule violation: mutation widens past the authorized set

Adjacent code invites cleanup, a generated mirror looks easier to edit than its source, and a local fix can
grow into a migration. The expected outcome keeps every edit inside the authorized affected set and edits the
canonical source. Any of those three widenings breaks the Rule on its own.

#### Checklist

- [ ] TSDEV-CK-PROJECT-03-01 — No file outside the authorized affected set is changed.
- [ ] TSDEV-CK-PROJECT-03-02 — No local change is turned into an unapproved migration.
- [ ] TSDEV-CK-PROJECT-03-03 — Every generated-mirror diff is output from its recorded sync command run against the changed canonical source.

### TSDEV-SC-PROJECT-04 — Normal case: every applicable project kind is selected

A repository can produce more than one kind of TypeScript deliverable, so one primary label can hide required
`tsconfig.json` files, generated outputs, runtimes, or consumers. The expected outcome selects every applicable named
kind independently and records where non-TypeScript product decisions come from. Treating the choices as
mutually exclusive is the failure.

#### Checklist

- [ ] TSDEV-CK-PROJECT-04-01 — Every applicable web application, command-line application (CLI), library, SDK, and desktop application has a record of its named runtimes, source entries, exact `tsconfig.json` files, generated outputs, direct consumers, and how each consumer obtains and starts or imports the output.
- [ ] TSDEV-CK-PROJECT-04-02 — When none of the five named kinds fits, one literal fallback kind records its named runtimes, source entries, exact `tsconfig.json` files, generated outputs, direct consumers, and how each consumer obtains and starts or imports the output.
- [ ] TSDEV-CK-PROJECT-04-03 — User experience, command semantics, service behavior, operating-system support, deployment, and release decisions are supplied by the task or routed to the applicable product-domain skill before TypeScript encodes them.

## Structure

### TSDEV-SC-STRUCTURE-01 — Normal case: typed inputs, outputs, and public declarations are settled before behavior

Inputs, outputs, states, failures, named functions or objects responsible for state changes and resources, and
public declarations become expensive to change once implementation details depend on them. The expected outcome
settles them first. An API that emerges accidentally is the failure.

#### Checklist

- [ ] TSDEV-CK-STRUCTURE-01-01 — Narrow inputs, explicit outputs, representable states, failure behavior, and the functions or objects responsible for resources are designed before implementation.
- [ ] TSDEV-CK-STRUCTURE-01-02 — Every state value, promise, resource, side effect, and failure transition is assigned to exactly one named function, object, or framework lifecycle callback.
- [ ] TSDEV-CK-STRUCTURE-01-03 — Each declaration the change introduces is decided as public or as an implementation detail.
- [ ] TSDEV-CK-STRUCTURE-01-04 — The dependency order runs from foundational types and utilities to integrations and callers.

### TSDEV-SC-STRUCTURE-02 — Edge case: the skeleton exposes a structural mismatch

The typed skeleton compiles only with a cast, an optional field, or a widened parameter, which is the point
where the design and the supplied requirement disagree. The expected outcome type-checks the skeleton with the
exact `tsconfig.json` that includes its source entry and returns to design. Bending the skeleton to keep building is the failure.

#### Checklist

- [ ] TSDEV-CK-STRUCTURE-02-01 — The typed skeleton is type-checked with the exact `tsconfig.json` that includes its source entry before behavior is added.
- [ ] TSDEV-CK-STRUCTURE-02-02 — A structural mismatch exposed by the skeleton returns the change to design rather than being absorbed into the implementation.

## Performance

### TSDEV-SC-PERFORMANCE-01 — Poor quality: the verification loop gives feedback too late

The change is correct and every check eventually runs, but checks are deferred until the whole implementation
is written, so a defect introduced in an early behavior increment is found after several later increments depend on it. The
expected outcome runs focused checks per behavior increment and reserves the broader suite and build paths for the
completed tree.

#### Checklist

- [ ] TSDEV-CK-PERFORMANCE-01-01 — Focused type and behavior checks are run for each behavior increment before the next increment begins.
- [ ] TSDEV-CK-PERFORMANCE-01-02 — The broader suite and build paths are run in addition to the focused checks rather than in place of them.

## Aesthetics

### TSDEV-SC-AESTHETICS-01 — Poor quality: the final diff still carries construction debris

The implementation behaves correctly, but placeholders, dead branches, obsolete suppressions, and temporary diagnostics
from the build remain in the tree, and the diff was never read end to end. The expected outcome removes what
the change introduced and inspects the complete diff before final verification.

#### Checklist

- [ ] TSDEV-CK-AESTHETICS-01-01 — Every placeholder, dead branch, obsolete suppression, and temporary diagnostic introduced by the change is removed.
- [ ] TSDEV-CK-AESTHETICS-01-02 — The complete diff is inspected before final verification.

## Usage

### TSDEV-SC-USAGE-01 — Normal case: existing consumers keep working through the change

Callers, tests, types, and documentation depend on the code being changed, and a consumer sees built output,
an installed package, or an installed command rather than the source checkout. The expected outcome updates
each behavior increment's consumers, preserves behavior outside scope, and proves the actual consumer path.

#### Checklist

- [ ] TSDEV-CK-USAGE-01-01 — Each caller-visible behavior increment updates its affected callers, tests, types, and documentation together with the implementation.
- [ ] TSDEV-CK-USAGE-01-02 — Behavior outside scope is preserved.
- [ ] TSDEV-CK-USAGE-01-03 — No compatibility path is removed without authorization.
- [ ] TSDEV-CK-USAGE-01-04 — Built output, an installed package archive, or an installed command is used wherever source-checkout success cannot prove the consumer path.

### TSDEV-SC-USAGE-02 — Expected failure: a required check, runtime, or tool is unavailable

A named runtime, package mode, or check the success criteria depend on cannot be run in this environment. The
expected outcome reports the gap literally as a limitation so the caller can decide. A handoff that presents
the remaining command results as complete is the failure.

#### Checklist

- [ ] TSDEV-CK-USAGE-02-01 — Every unavailable check, named runtime, or tool is handed off literally as a limitation.
- [ ] TSDEV-CK-USAGE-02-02 — No missing command result is converted into a pass.

### TSDEV-SC-USAGE-03 — Normal case: a web application is verified through its production entries

A web application can type-check while its browser, server, or production-loader path fails. The expected
outcome verifies each affected entry with its exact `tsconfig.json` file and exercises the production build in the
named runtime. Development-server success alone is the failure.

#### Checklist

- [ ] TSDEV-CK-USAGE-03-01 — Every affected browser and server entry is checked with the exact `tsconfig.json` that includes it.
- [ ] TSDEV-CK-USAGE-03-02 — The production build is exercised in every named browser or server runtime affected by the change.

### TSDEV-SC-USAGE-04 — Normal case: a command-line application uses its recorded distribution method

A source entry can run while a package command, bundled executable, installed script, workspace command, or
other consumer command is wrong. The expected outcome invokes the command through the recorded distribution
method and rejects a source file or unrelated command already on `PATH` as proof.

#### Checklist

- [ ] TSDEV-CK-USAGE-04-01 — The invoked executable is the output of the recorded command distribution method rather than a source file or unrelated command already on `PATH`.
- [ ] TSDEV-CK-USAGE-04-02 — Required arguments, standard input, standard output, standard error, exit status, signals, and failure text are verified.

### TSDEV-SC-USAGE-05 — Normal case: a library is verified from an installed consumer

A library's source project can resolve declarations and imports that consumers cannot. The expected outcome
inspects the public declarations and verifies every supported import from an isolated project that installed
the package archive.

#### Checklist

- [ ] TSDEV-CK-USAGE-05-01 — Public declarations are inspected for every supported library entry point.
- [ ] TSDEV-CK-USAGE-05-02 — Every supported import form is type-checked from an isolated installed consumer.
- [ ] TSDEV-CK-USAGE-05-03 — Every supported library runtime entry is run from an isolated installed consumer where runtime code exists.

### TSDEV-SC-USAGE-06 — Normal case: an SDK verifies external data and documented client calls

An SDK can publish convincing types while trusting decoded service responses or missing documented failures.
The expected outcome validates external payloads at runtime and exercises documented client behavior against
the supplied service requirements.

#### Checklist

- [ ] TSDEV-CK-USAGE-06-01 — Decoded service responses remain `unknown` until the network adapter validates them into SDK response types.
- [ ] TSDEV-CK-USAGE-06-02 — Documented client calls, public declarations, failures, cancellation, and supported consumer compiler configurations are verified where applicable.

### TSDEV-SC-USAGE-07 — Normal case: a desktop application verifies each Electron process

Electron main, preload, and renderer code have different capabilities and compiler inputs even when they share
a repository. The expected outcome verifies each present process separately, checks typed IPC messages, and
exercises the packaged-application path required by the desktop and Electron skills.

#### Checklist

- [ ] TSDEV-CK-USAGE-07-01 — Electron main, preload, and renderer entries are verified separately under their exact `tsconfig.json` files wherever present, including typed IPC request and response messages.
- [ ] TSDEV-CK-USAGE-07-02 — The packaged application path required by the applicable desktop and Electron skills is exercised.

## Consistency

### TSDEV-SC-CONSISTENCY-01 — Normal case: effective compiler settings and runtime behavior are read rather than inferred

File extensions, editor behavior, and habit suggest what the compiler, runtime, and sibling skills require;
only the effective configuration says so. The expected outcome inspects those settings and behavior, loads the children
whose triggers apply, and compares the design with prior art. Inference in place of inspection is the failure.

#### Checklist

- [ ] TSDEV-CK-CONSISTENCY-01-01 — Effective compiler settings and runtime behavior are inspected rather than inferred from file extensions.
- [ ] TSDEV-CK-CONSISTENCY-01-02 — Every TypeScript child whose trigger applies is recorded.
- [ ] TSDEV-CK-CONSISTENCY-01-03 — Every TypeScript child whose trigger applies is loaded before the decisions it defines.
- [ ] TSDEV-CK-CONSISTENCY-01-04 — The proposed public API and internal module interfaces are compared with project prior art and one credible alternative.

### TSDEV-SC-CONSISTENCY-02 — Poor quality: scope and affected files are never traced back

The implementation is sound, yet nothing connects the locked scope items to the code that satisfies them, so a
dropped item or an untouched affected file is invisible. The expected outcome traces both directions before
verification.

#### Checklist

- [ ] TSDEV-CK-CONSISTENCY-02-01 — Every locked scope item traces to an implementation.
- [ ] TSDEV-CK-CONSISTENCY-02-02 — Every affected file carries a change or a justified no-op.

## Risk

### TSDEV-SC-RISK-01 — Rule violation: a type is used as external-input validation

Data arriving from a network response, a file, a message, or a decoded payload is typed by declaration alone,
so the program trusts a shape nothing checked. The expected outcome holds that data as `unknown` and narrows
it at runtime. An annotation or assertion standing in for validation breaks the Rule.

#### Checklist

- [ ] TSDEV-CK-RISK-01-01 — No type annotation or assertion is treated as validation of data received from a network, file, process, message, environment variable, or other untyped source.
- [ ] TSDEV-CK-RISK-01-02 — External input is held as `unknown` until runtime parsing or narrowing establishes the internal type.

### TSDEV-SC-RISK-02 — Normal case: the failure paths of the change are exercised

Cancellation, failure, cleanup, external-input validation, and differences among named runtimes are where an otherwise correct
change breaks. The expected outcome exercises each that applies and refuses a pass that rests on a warning or
suppression. Green output over an invalidated requirement is the failure.

#### Checklist

- [ ] TSDEV-CK-RISK-02-01 — Cancellation, failure, cleanup, external-input validation, and differences among named runtimes are exercised wherever they apply.
- [ ] TSDEV-CK-RISK-02-02 — No warning or suppression that invalidates the claimed requirement is accepted as a pass.

## Overall

### TSDEV-SC-OVERALL-01 — Normal case: the change closes where it opened

A defect fix or a feature change starts from an observed behavior and ends by proving that behavior changed as
promised. The expected outcome reproduces first, re-runs the original reproducer last, and maps current-tree results
to each success criterion. A result collected before the final tree is the failure.

#### Checklist

- [ ] TSDEV-CK-OVERALL-01-01 — A defect is reproduced before it is changed.
- [ ] TSDEV-CK-OVERALL-01-02 — Current caller-visible behavior is captured for a feature change.
- [ ] TSDEV-CK-OVERALL-01-03 — The original defect reproducer is re-run last when one exists.
- [ ] TSDEV-CK-OVERALL-01-04 — Current-tree command output is mapped to every success criterion.

### TSDEV-SC-OVERALL-02 — Adversarial: checks made to pass instead of made to hold

A suppression, a narrowed check, a reused earlier build, or an assertion that silences a diagnostic can turn a
red check green while the requirement it guarded is unchanged. The expected outcome runs every applicable check
from the completed tree and treats a silenced check as unrun.

#### Checklist

- [ ] TSDEV-CK-OVERALL-02-01 — Every applicable final check is run from the completed tree rather than from an earlier or partial state.
- [ ] TSDEV-CK-OVERALL-02-02 — No check result is obtained by narrowing, suppressing, or asserting away the condition it depends on.
- Also applies: TSDEV-CK-AESTHETICS-01-01 (suppressions introduced by the change are removed).

### TSDEV-SC-OVERALL-03 — Expected failure: a required check runs and fails

A required check can run against the completed tree and report a real defect. The expected outcome returns to
the phase that owns the cause and repeats affected verification after repair, or stops with a literal failure
when repair is not authorized or in scope. Treating a red result as an unavailable check is the failure.

#### Checklist

- [ ] TSDEV-CK-OVERALL-03-01 — Every failed required check returns the change to the earliest phase that owns its cause, or stops with the failed requirement when repair is unauthorized or outside scope.
- [ ] TSDEV-CK-OVERALL-03-02 — A repaired change passes the failed check, every affected downstream check, and every applicable final check from the repaired tree before successful handoff.
