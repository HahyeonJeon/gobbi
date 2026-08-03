# TypeScript Project-Kind Test Evaluation Checklist

This reusable unchecked source evaluates project-kind selection and consumer-path verification for one set of
TypeScript tests. It is governed by the [`typescript`](../SKILL.md) domain and
[`typescript-testing`](SKILL.md) operation. The sibling [test checklist](checklists.md) evaluates test design,
runtime and type evidence, packages, examples, and suite closure. The source commit that contains this file
identifies the checklist version. Its stable checklist prefix is `TSTESTKIND`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

## Project

### TSTESTKIND-SC-PROJECT-01 — Normal case: every applicable project kind is selected

A repository can produce several TypeScript project kinds, so one primary label can hide tests for another
consumer path. The expected outcome selects every applicable named kind independently and records a literal
fallback only when none fits. Omitting a secondary kind or using fallback to avoid a named kind is the failure.

#### Checklist

- [ ] TSTESTKIND-CK-PROJECT-01-01 — Every applicable web application, command-line application, library, SDK, and desktop application is selected independently.
- [ ] TSTESTKIND-CK-PROJECT-01-02 — A literal fallback project kind is recorded only when none of the five named kinds fits.
- [ ] TSTESTKIND-CK-PROJECT-01-03 — Every selected kind records its named runtimes, generated outputs, direct consumers, and how each consumer starts or imports the output.

## Structure

### TSTESTKIND-SC-STRUCTURE-01 — Normal case: each kind is tested at the layer its consumer uses

Different project kinds expose failures through browsers, processes, imports, service adapters, or packaged
applications. The expected outcome assigns every recorded claim to the layer that can disprove it for that
kind. Reusing a convenient but weaker layer is the failure.

#### Checklist

- [ ] TSTESTKIND-CK-STRUCTURE-01-01 — Every selected kind's claims map to the browser, process, installed import, service adapter, packaged application, or other recorded consumer layer that can disprove them.

## Performance

Not applicable: performance requirements for a selected kind come from its supplied product requirements and
are evaluated by the applicable product-domain checklist. This source adds no independent latency,
throughput, capacity, or recurring-cost requirement.

## Aesthetics

Not applicable: interface presentation, help text, and visual quality belong to the applicable web, CLI, SDK,
or desktop product requirements. This source verifies project-kind selection and consumer paths without
defining their presentation.

## Usage

### TSTESTKIND-SC-USAGE-01 — Normal case: a web application is tested through production entries

A development server can hide a browser, server, or production-loader failure. The expected outcome tests the
affected entries and smoke-tests the production build in each named runtime.

#### Checklist

- [ ] TSTESTKIND-CK-USAGE-01-01 — Tests exercise caller-visible behavior through every affected browser and server entry.
- [ ] TSTESTKIND-CK-USAGE-01-02 — A production-build smoke test runs in every named browser or server runtime affected by the change.

### TSTESTKIND-SC-USAGE-02 — Normal case: a command-line application is tested through its recorded distribution method

A source entry can run while package-backed metadata, a package-archive installation, or direct non-archive
delivery is wrong. The expected outcome uses `typescript-packaging` for command names and entries supplied by
`package.json` `bin`, package scripts, and workspace package links. It uses `typescript-cli-delivery` for a
standalone executable or archive, a script copied or linked directly to an install target, a recorded
workspace or repository revision plus command, or another direct non-archive method whose unit, method, and
consumer command are recorded by name. It proves which executable runs and verifies the process requirements.

#### Checklist

- [ ] TSTESTKIND-CK-USAGE-02-01 — Every package-backed command name or entry, including a `package.json` `bin` entry, package script, or workspace package link, is prepared through `typescript-packaging` with its package behavior.
- [ ] TSTESTKIND-CK-USAGE-02-02 — The test proves that it invoked the recorded output rather than a source file or unrelated command already on `PATH`.
- [ ] TSTESTKIND-CK-USAGE-02-03 — Process tests invoke every recorded consumer command through its consumer entry.
- [ ] TSTESTKIND-CK-USAGE-02-04 — Process tests assert the required arguments, standard input, standard output, standard error, exit status, signals, and cleanup for the applicable success and failure cases.
- [ ] TSTESTKIND-CK-USAGE-02-05 — Every direct non-archive consumer entry is prepared through `typescript-cli-delivery` for a standalone executable or archive, a script copied or linked directly to an install target, a workspace or repository revision plus command, or another method whose unit, method, and consumer command are recorded by name.
- [ ] TSTESTKIND-CK-USAGE-02-06 — A genuine hybrid that distributes the same command through a package archive and a direct non-archive method selects both owners and preserves separate artifact identities and consumer entries.

### TSTESTKIND-SC-USAGE-03 — Normal case: a library is tested through its recorded consumer path

A library source project can resolve declarations and runtime imports that fail for its consumer. The expected
outcome uses an isolated representative consumer through the recorded package, workspace, project-reference,
source, or other distribution method. Requiring an archive that the library does not distribute is the failure.

#### Checklist

- [ ] TSTESTKIND-CK-USAGE-03-01 — Type tests exercise every supported library import form from an isolated representative consumer through the recorded distribution method.
- [ ] TSTESTKIND-CK-USAGE-03-02 — From that isolated representative consumer, runtime tests assert caller-visible behavior for every library entry that provides runtime code.

### TSTESTKIND-SC-USAGE-04 — Normal case: an SDK tests validation and documented client behavior

An SDK can expose convincing declarations while trusting decoded service responses or missing documented
failures. The expected outcome tests the adapter and the documented client behavior against supplied service
requirements.

#### Checklist

- [ ] TSTESTKIND-CK-USAGE-04-01 — Network-adapter tests cover accepted and rejected external service payloads.
- [ ] TSTESTKIND-CK-USAGE-04-02 — Tests cover documented client calls, public types, failures, cancellation, and supported consumer compiler configurations where applicable.

### TSTESTKIND-SC-USAGE-05 — Normal case: a desktop application tests every present Electron process

Electron main, preload, and renderer code have different capabilities even inside one application. The
expected outcome tests each present process and IPC path separately, then exercises the packaged application.

#### Checklist

- [ ] TSTESTKIND-CK-USAGE-05-01 — Tests cover Electron main, preload, renderer, and typed IPC behavior separately wherever present.
- [ ] TSTESTKIND-CK-USAGE-05-02 — A packaged-application test exercises the path required by the applicable Electron and desktop skills.

### TSTESTKIND-SC-USAGE-06 — Normal case: a fallback kind tests every recorded consumer path

A server process, build script, test utility, or other fallback kind has no named preset. The expected outcome
uses its recorded runtimes, outputs, and consumers directly. Borrowing evidence from a different named kind is
the failure.

#### Checklist

- [ ] TSTESTKIND-CK-USAGE-06-01 — Tests exercise every named runtime, generated output, and direct consumer recorded for a fallback kind through its recorded consumer path.

### TSTESTKIND-SC-USAGE-07 — Edge case: a package-backed workspace command is delivered directly

A workspace package link can supply the command entry while a direct method supplies its delivery. The
expected outcome loads `typescript-packaging` for the package metadata and `typescript-cli-delivery` for the
direct non-archive target and consumer entry. Treating either owner as sufficient for both obligations is the
failure.

#### Checklist

- [ ] TSTESTKIND-CK-USAGE-07-01 — A package-backed workspace command delivered directly selects `typescript-packaging` for its package metadata and `typescript-cli-delivery` for its direct non-archive delivery.

## Consistency

### TSTESTKIND-SC-CONSISTENCY-01 — Normal case: selected kinds match the implementation records

Testing and implementation can classify the same output differently and silently omit a consumer. The
expected outcome uses the same selected kinds and fallback record throughout both operations.

#### Checklist

- [ ] TSTESTKIND-CK-CONSISTENCY-01-01 — Testing uses the same selected project kinds, fallback record, named runtimes, outputs, and consumers as the implementation record.

## Risk

### TSTESTKIND-SC-RISK-01 — Adversarial: one primary kind hides a second consumer path

A desktop app can also publish a library, or a web repository can also ship a CLI. The expected outcome keeps
every applicable kind selected. Treating one label as exclusive and omitting the other path is the failure.

#### Checklist

- [ ] TSTESTKIND-CK-RISK-01-01 — No primary project-kind label is accepted as evidence that another applicable named kind does not require testing.

## Overall

### TSTESTKIND-SC-OVERALL-01 — Normal case: every selected kind has final-tree consumer evidence

Project-kind results can come from partial builds or unavailable runtimes. The expected outcome uses the final
tree and keeps every unavailable consumer path unproved. A nearby kind's pass cannot replace it.

#### Checklist

- [ ] TSTESTKIND-CK-OVERALL-01-01 — Every selected named or fallback kind has current-tree command evidence for each recorded consumer path.
- [ ] TSTESTKIND-CK-OVERALL-01-02 — Every unavailable project-kind consumer path remains reported as unverified rather than borrowing another kind's result.
