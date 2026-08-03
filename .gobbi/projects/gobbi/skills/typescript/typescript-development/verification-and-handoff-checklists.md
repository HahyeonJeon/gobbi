# TypeScript Development Verification and Handoff Evaluation Checklist

This reusable unchecked source evaluates consumer-path verification and the final handoff for one authorized
TypeScript implementation produced under this operation. It is governed by the
[`typescript`](../SKILL.md) domain and [`typescript-development`](SKILL.md) operation. The
[base development checklist](checklists.md) separately evaluates the operation's project, structure,
performance, aesthetics, consistency, and risk concerns. The source commit that contains this file identifies
the checklist version. Its stable checklist prefix is `TSDEV`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its defining scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

Not applicable: This source is bound to consumer-path verification and final handoff; task authority and
project-kind selection remain in the [base development checklist](checklists.md).

## Structure

Not applicable: This source is bound to consumer-path verification and final handoff; typed design and
skeleton scenarios remain in the [base development checklist](checklists.md).

## Performance

Not applicable: This source is bound to consumer-path verification and final handoff; verification-loop
cadence remains in the [base development checklist](checklists.md).

## Aesthetics

Not applicable: This source is bound to consumer-path verification and final handoff; final-diff cleanliness
remains in the [base development checklist](checklists.md).

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

A source entry can run while a package command, bundled executable, installed script, workspace-distributed
command, or literal other non-package command is wrong. The expected outcome takes npm and package-archive
commands from `typescript-packaging`, takes non-package commands from `typescript-cli-delivery`, and selects
both owners for a hybrid. It rejects a source file or unrelated command already on `PATH` as proof.

#### Checklist

- [ ] TSDEV-CK-USAGE-04-01 — The invoked executable is the output of the recorded command distribution method rather than a source file or unrelated command already on `PATH`.
- [ ] TSDEV-CK-USAGE-04-02 — Required arguments, standard input, standard output, standard error, exit status, signals, and failure text are verified.
- [ ] TSDEV-CK-USAGE-04-03 — Every npm or package-archive command consumer entry is supplied through `typescript-packaging`.
- [ ] TSDEV-CK-USAGE-04-04 — Every bundled executable, installed script, workspace-distributed command, or literal other non-package command consumer entry is supplied through `typescript-cli-delivery`.
- [ ] TSDEV-CK-USAGE-04-05 — A hybrid command distribution selects both `typescript-packaging` and `typescript-cli-delivery`.

### TSDEV-SC-USAGE-05 — Normal case: a library is verified through its recorded consumer path

A library's source project can resolve declarations and imports that its consumer cannot. The expected outcome
uses an isolated representative consumer through the recorded package, workspace, project-reference, source,
or other distribution method. Substituting an installed archive for a library that has no package distribution
is the failure.

#### Checklist

- [ ] TSDEV-CK-USAGE-05-01 — Public declarations are inspected for every supported library entry point whose recorded consumer path exposes declarations.
- [ ] TSDEV-CK-USAGE-05-02 — Every supported import form is type-checked from an isolated representative consumer through the recorded distribution method.
- [ ] TSDEV-CK-USAGE-05-03 — Every supported library runtime entry is run from that isolated representative consumer where runtime code exists.

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

### TSDEV-SC-USAGE-08 — Normal case: a fallback kind is verified through every recorded consumer path

A fallback project kind can name several runtimes, generated outputs, and direct consumers while verification
uses only a convenient subset. The expected outcome verifies every recorded member through its recorded
consumer path. An omitted member or a source-checkout substitute is the failure.

#### Checklist

- [ ] TSDEV-CK-USAGE-08-01 — Every recorded fallback runtime, generated output, and direct consumer is verified through its recorded consumer path.

## Consistency

Not applicable: This source is bound to consumer-path verification and final handoff; effective-configuration
and scope-traceability scenarios remain in the [base development checklist](checklists.md).

## Risk

Not applicable: This source is bound to consumer-path verification and final handoff; external-input and
failure-path scenarios remain in the [base development checklist](checklists.md).

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

- [ ] TSDEV-CK-OVERALL-02-01 — Every applicable final check, including formatting, linting, and each applicable TypeScript project check, is run from the completed tree rather than from an earlier or partial state.
- [ ] TSDEV-CK-OVERALL-02-02 — No check result is obtained by narrowing, suppressing, or asserting away the condition it depends on.
- [ ] TSDEV-CK-OVERALL-02-03 — Every TypeScript project check names the exact `tsconfig.json` file it uses.
- Also applies: TSDEV-CK-AESTHETICS-01-01 (suppressions introduced by the change are removed).

### TSDEV-SC-OVERALL-03 — Expected failure: a required check runs and fails

A required check can run against the completed tree and report a real defect. The expected outcome returns to
the phase that owns the cause and repeats affected verification after repair, or stops with a literal failure
when repair is not authorized or in scope. Treating a red result as an unavailable check is the failure.

#### Checklist

- [ ] TSDEV-CK-OVERALL-03-01 — Every failed required check returns the change to the earliest phase that owns its cause, or stops with the failed requirement when repair is unauthorized or outside scope.
- [ ] TSDEV-CK-OVERALL-03-02 — A repaired change passes the failed check, every affected downstream check, and every applicable final check from the repaired tree before successful handoff.

### TSDEV-SC-OVERALL-04 — Normal case: the final handoff carries the complete verification inventory

The final handoff must let its reader connect every selected project kind and output to the configuration,
consumer path, command result, and limitation that apply. The expected outcome presents that complete
inventory. An omitted field leaves the handoff incomplete.

#### Checklist

- [ ] TSDEV-CK-OVERALL-04-01 — The final handoff contains selected project kinds, named runtimes, exact `tsconfig.json` files, generated outputs, how each consumer receives each output and then starts or imports that output, commands, results, and limitations.
