# Electron Runtime Evaluation Checklist

This reusable unchecked source evaluates one Electron runtime lookup or diagnosis produced under this manual.
It is governed by the [`electron`](../SKILL.md) domain and [`electron-runtime`](SKILL.md) manual, with
[`electron-design`](../electron-design/SKILL.md) owning security posture and default choices and
[`electron-development`](../electron-development/SKILL.md), [`electron-testing`](../electron-testing/SKILL.md),
and [`electron-release`](../electron-release/SKILL.md) owning their procedures. The source commit that
contains this file identifies the checklist version. Its stable owner prefix is `ELECRUN`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### ELECRUN-SC-PROJECT-01 — Normal case: the question stays on runtime mechanism

This manual explains process capability, preload constraint, IPC mechanics, lifecycle behavior, native
integration, and platform failure. The scenario fails when the answer decides a security posture, a project
default, or an implementation, test, or release procedure instead of routing it to the owner who holds it.

#### Checklist

- [ ] ELECRUN-CK-PROJECT-01-01 — The inspected question concerns Electron process capability, preload constraint, IPC mechanics, lifecycle behavior, native integration, or platform failure.
- [ ] ELECRUN-CK-PROJECT-01-02 — Every security-posture and default choice the lookup raises is routed to `electron-design`, and every implementation, test, and release procedure to its owning operation.

## Structure

### ELECRUN-SC-STRUCTURE-01 — Normal case: the answer names the process that owns the capability

Placement, privilege, and API availability depend on the actual process rather than on the source that
appears to use them. The expected outcome identifies the runtime facts before explaining a symptom and keeps
each API in a valid process; an answer inferred from source shape is the failure.

#### Checklist

- [ ] ELECRUN-CK-STRUCTURE-01-01 — Every answer identifies the actual process, pinned Electron major, emitted module format, operating system, URL, and lifecycle point before it diagnoses a symptom.
- [ ] ELECRUN-CK-STRUCTURE-01-02 — Every capability is placed in the process that can safely own it, and every boundary crossing is described as a narrow contract rather than moved privilege.
- [ ] ELECRUN-CK-STRUCTURE-01-03 — Main-only, renderer-only, and common Electron APIs are each kept in valid processes.
- [ ] ELECRUN-CK-STRUCTURE-01-04 — TypeScript process aliases are described as type-surface aids rather than a runtime security boundary.

## Performance

### ELECRUN-SC-PERFORMANCE-01 — Normal case: a high-volume crossing described with its cost contract

Streaming and high-volume messaging use transferred ports whose ownership, handshake, close behavior, and
backpressure decide whether the application keeps up. The expected outcome states those terms with the
mechanism, and keeps sustained blocking computation out of main; naming only the transport is the failure.

#### Checklist

- [ ] ELECRUN-CK-PERFORMANCE-01-01 — Every high-volume or streaming IPC answer names port ownership, startup handshake, close behavior, backpressure, and process-exit recovery.
- [ ] ELECRUN-CK-PERFORMANCE-01-02 — Sustained blocking computation is placed in a utility process rather than in main or a renderer.

## Aesthetics

### ELECRUN-SC-AESTHETICS-01 — Poor quality: mechanism and version fact mixed in one answer

The answer is correct today but does not separate the durable mechanism from the fact that depends on the
pinned major, so a later reader cannot tell which part needs rechecking. The expected outcome records
observations before inferences and keeps transient version facts out of durable text.

#### Checklist

- [ ] ELECRUN-CK-AESTHETICS-01-01 — Observations are recorded before any inference drawn from them.
- [ ] ELECRUN-CK-AESTHETICS-01-02 — Every answer separates the durable mechanism from the fact that depends on the pinned Electron major.
- [ ] ELECRUN-CK-AESTHETICS-01-03 — No transient current Electron version is written into durable documentation as a fixed fact.

## Usage

### ELECRUN-SC-USAGE-01 — Normal case: an answer the caller can act on and repeat

A lookup is used to make a decision elsewhere, so it must carry its authority and its limits. The scenario
fails when the answer states a behavior without naming the official document or the observation behind it, or
when what remains unverified for the pinned major is left out.

#### Checklist

- [ ] ELECRUN-CK-USAGE-01-01 — Every answer names its authority: the current official Electron document for the mechanism, or an observation on the pinned major for availability and behavior.
- [ ] ELECRUN-CK-USAGE-01-02 — Every answer states what remains unverified for the pinned major.
- Also applies: ELECRUN-CK-STRUCTURE-01-01 (the answer states its process, major, format, target, and lifecycle point).

### ELECRUN-SC-USAGE-02 — Expected failure: the required runtime observation is unavailable

Protocol registration needs a packaged application, macOS notification events need a signed application, and
secure storage needs a known Linux backend, so some answers cannot be observed in the available environment.
The expected outcome reports the conclusion as unavailable with its condition; an inferred answer is the
failure.

#### Checklist

- [ ] ELECRUN-CK-USAGE-02-01 — Every conclusion depending on an unavailable target, packaged build, signature, or platform backend is reported as unavailable rather than inferred.
- [ ] ELECRUN-CK-USAGE-02-02 — Every protocol-registration, notification, and secure-storage answer states the packaging, signing, or backend condition its evidence requires.

## Consistency

### ELECRUN-SC-CONSISTENCY-01 — Rule violation: this manual used in place of live documentation

The pinned major differs from the major the code was written against, or observed behavior conflicts with
this manual, and the answer is given from the manual alone. The expected outcome consults the live official
API and breaking-change documents; a stale mechanism repeated with confidence is the failure.

#### Checklist

- [ ] ELECRUN-CK-CONSISTENCY-01-01 — The live official API and breaking-change documents are consulted whenever the pinned major differs from the major the code was written against.
- [ ] ELECRUN-CK-CONSISTENCY-01-02 — The live official documents are consulted whenever observed behavior conflicts with this manual.
- [ ] ELECRUN-CK-CONSISTENCY-01-03 — No behavior is asserted for the pinned major from this manual alone where the manual points to a live official source.

## Risk

### ELECRUN-SC-RISK-01 — Normal case: cross-process values described as data

Inter-process communication moves cloneable values, and a bridge can proxy a function without making the
handle behind it safe. The expected outcome describes each crossing as an explicit data and method contract
with disposal and clone limits; describing a value as safe because it crossed a bridge is the failure.

#### Checklist

- [ ] ELECRUN-CK-RISK-01-01 — Every IPC or context-bridge crossing is described with explicit data and method contracts, including callback disposal and structured-clone limits.
- [ ] ELECRUN-CK-RISK-01-02 — Functions, symbols, weak collections, Electron event objects, and custom prototypes are described as values that do not survive the crossing as safe domain instances.
- [ ] ELECRUN-CK-RISK-01-03 — Every sender-trust answer captures sender facts before the first asynchronous suspension.

### ELECRUN-SC-RISK-02 — Adversarial: one installed control offered as complete closure

A caller asks whether a window is safe after installing a single handler, and an answer that says yes leaves
an open surface behind a confident conclusion. The expected outcome keeps the activated-content controls
independent and requires closed allowlists and canonical-root containment rather than a string check.

#### Checklist

- [ ] ELECRUN-CK-RISK-02-01 — No activated-content control is described as closing another surface: a permission check for a permission request, a navigation handler for a window-open handler, a window-open handler for webview attachment, a default-session configuration for a secondary partition, and a first-window configuration for later-created web contents.
- [ ] ELECRUN-CK-RISK-02-02 — Every external-URL and custom-protocol answer requires parsed, closed allowlists and canonical-root containment rather than a string check.

## Overall

### ELECRUN-SC-OVERALL-01 — Adversarial: a plausible signal accepted as the missing evidence

A similar-looking source file, an absent exception, a development launch, or a passing typecheck can be
offered as the evidence the question needs, producing an answer that looks settled. The expected outcome
keeps each observation inside what it establishes and leaves the missing part unknown.

#### Checklist

- [ ] ELECRUN-CK-OVERALL-01-01 — No observation is treated as proof of a property it does not establish: source similarity of runtime privilege, an absent exception of a successful native call, a development launch of packaged behavior, a passing typecheck of process validity, and a documentation statement of pinned-major behavior.
- [ ] ELECRUN-CK-OVERALL-01-02 — Every unavailable observation remains an open unknown rather than an inferred result.

### ELECRUN-SC-OVERALL-02 — Edge case: a symptom with several plausible boundaries

A handler never fires, a bridge is missing, or a deep link is dropped, and process, loader, readiness, and
ownership could each explain it. The expected outcome inspects the earliest boundary that can explain the
symptom and reports the remaining unknowns; a retry or a global variable added in place of a diagnosis is the
failure.

#### Checklist

- [ ] ELECRUN-CK-OVERALL-02-01 — The earliest boundary that can explain the symptom is inspected before any retry or global state is added.
- [ ] ELECRUN-CK-OVERALL-02-02 — Readiness, duplicate registration, window or view ownership, and cleanup are each inspected for a lifecycle failure.
- [ ] ELECRUN-CK-OVERALL-02-03 — The report states the inspected boundary, the evidence, and the remaining unknowns.
