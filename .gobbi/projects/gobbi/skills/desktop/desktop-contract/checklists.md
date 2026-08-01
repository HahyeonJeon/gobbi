# Desktop Contract Evaluation Checklist

This reusable unchecked source evaluates one installed desktop application's observable product contract —
targets, entry modes, windows, lifecycle, native integration, local data, installation, updates, and recovery
— against the definition and evidence obligations this skill owns. It is governed by the
[`desktop`](../SKILL.md) domain and [`desktop-contract`](SKILL.md) manual, with
[`desktop-delivery`](../desktop-delivery/SKILL.md) as the operation that coordinates the outcome,
[`desktop-architecture`](../desktop-architecture/SKILL.md) as the owner of the in-application structure the
contract is built from, [`desktop-release`](../desktop-release/SKILL.md) as the owner of release-facing
defaults, and the [`electron`](../../electron/SKILL.md) family as the owner of the mechanics that realize the
contract. The source commit that contains this file identifies the checklist version. Its stable owner prefix
is `DTCONT`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### DTCONT-SC-PROJECT-01 — Normal case: the contract states behavior and routes mechanism

An ordinary contract entry says what a person observes, what authoritative effect occurs, how failure appears,
and how recovery works, and leaves the API, process, package, and updater choices to their owners. It fails
this scenario when the entry selects a mechanism, or when a required surface has no entry at all.

#### Checklist

- [ ] DTCONT-CK-PROJECT-01-01 — Every entry states the observable result, the authoritative effect, the failure appearance, and the recovery behavior.
- [ ] DTCONT-CK-PROJECT-01-02 — No entry selects an Electron event, process, IPC channel, permission handler, package format, updater, or signing mechanism.
- [ ] DTCONT-CK-PROJECT-01-03 — Every implementation mechanic the contract implies is routed to the selected framework or operating-system owner.
- [ ] DTCONT-CK-PROJECT-01-04 — Every supported entry, window, lifecycle, native, data, installation, update, and recovery path has a contract entry.
- [ ] DTCONT-CK-PROJECT-01-05 — Every unhandled state narrows the stated supported claim rather than being left implicit.

### DTCONT-SC-PROJECT-02 — Rule violation: a platform capability rewrote an accepted requirement

An operating-system convention or a framework limitation makes an accepted product requirement awkward, so the
contract records the platform's behavior as the requirement instead. The expected outcome returns the conflict
to the product owner; treating what the platform does as approval for what the product promises is the
failure.

#### Checklist

- [ ] DTCONT-CK-PROJECT-02-01 — No accepted product requirement or user authority is changed by a platform convention or technical capability.
- [ ] DTCONT-CK-PROJECT-02-02 — Every conflict between a platform capability and an accepted requirement is returned to the product owner with its evidence.

## Structure

### DTCONT-SC-STRUCTURE-01 — Normal case: every contract row carries its full field set

The contract matrix records only supported rows, and each row must be complete enough to build against and
prove. The expected outcome names target, trigger, observable result, authoritative effect, failure,
recovery, owner, and evidence for each row; a row missing one of those fields is the failure.

#### Checklist

- [ ] DTCONT-CK-STRUCTURE-01-01 — Every recorded row names its target, trigger, observable result, authoritative effect, failure, recovery, owner, and evidence.
- [ ] DTCONT-CK-STRUCTURE-01-02 — No recorded row describes a surface the product does not support.
- [ ] DTCONT-CK-STRUCTURE-01-03 — Every one of the six contract surfaces — installation and first launch, ordinary and alternate entry, windows and lifecycle, native integration, local data, update and recovery — is addressed.

### DTCONT-SC-STRUCTURE-02 — Normal case: every window and native integration names its full ownership set

Windows and native integrations outlive the call that created them and differ across targets. The expected
outcome records each one's ownership, behavior, and failure fields; a window or integration defined only by
its happy path is the failure.

#### Checklist

- [ ] DTCONT-CK-STRUCTURE-02-01 — Every window names its purpose, creation owner, restore behavior, close behavior, focus rules, minimum useful state, and cleanup owner.
- [ ] DTCONT-CK-STRUCTURE-02-02 — Every native integration names its support by target, permission or entitlement preconditions, cancellation, duplicate activation, unavailable behavior, returned failure state, cleanup, and accessible alternative.
- [ ] DTCONT-CK-STRUCTURE-02-03 — Every datum in the local-data inventory — settings, documents, caches, credentials, logs, indexes, downloads, application resources — names its owner and lifecycle.

### DTCONT-SC-STRUCTURE-03 — Edge case: a window or instance created after the first one

A second window opens later, a second instance launches, or an external entry arrives while the application is
already running. The expected outcome covers those later-created cases with the same completeness as the first
window; a contract that stops at first launch is the failure.

#### Checklist

- [ ] DTCONT-CK-STRUCTURE-03-01 — Later-created windows and their failure paths are covered, not only the first window.
- [ ] DTCONT-CK-STRUCTURE-03-02 — Cold start, ready, active with windows, active without windows, supported background or tray-only operation, shutdown, restart, update restart, second instance, and external entry each state whether the transition exists on each claimed target.
- [ ] DTCONT-CK-STRUCTURE-03-03 — Every input or resource that must survive a listed transition is named with that transition.

## Performance

Not applicable: this skill assigns no latency, throughput, capacity, or resource obligation. It defines what a
person observes and what evidence proves it; installed performance and resource measurement for a delivered
outcome is assigned by [`desktop-delivery`](../desktop-delivery/SKILL.md) Step 3.2 and Step 4.1, and the
mechanism costs behind each promise belong to the Electron family.

## Aesthetics

### DTCONT-SC-AESTHETICS-01 — Poor quality: entries written as framework callbacks

Each row names an Electron event, a native API, or a test rather than what the product promises, so a reader
cannot tell what a person would observe. The expected outcome states product meaning and observable result;
a technically accurate row that only a maintainer of that mechanism can interpret is the failure.

#### Checklist

- [ ] DTCONT-CK-AESTHETICS-01-01 — No entry is identified only by a framework callback, native API, or test name.
- [ ] DTCONT-CK-AESTHETICS-01-02 — Every entry identifies the product meaning and the result a person or operator can observe.

## Usage

### DTCONT-SC-USAGE-01 — Normal case: every entry mode preserves the input it carried

A person opens the application from a launcher, a file, a protocol link, a notification, a command, or a
second instance. The expected outcome states, for each path, how the input reaches the running application;
an entry mode that reaches the application but drops what it carried is the failure.

#### Checklist

- [ ] DTCONT-CK-USAGE-01-01 — Every supported launcher, file, protocol, notification, command, and second-instance path is listed with how it preserves its input.
- [ ] DTCONT-CK-USAGE-01-02 — Installation and first launch state what is installed, where the person starts, which readiness or permission state can intervene, and how a failure is repaired.
- [ ] DTCONT-CK-USAGE-01-03 — Update and recovery state what the person sees before, during, and after an update, what remains usable after interruption or failure, and where support is found.

### DTCONT-SC-USAGE-02 — Expected failure: a native integration is unavailable or its permission is refused

A menu, tray, dock, shortcut, dialog, notification, clipboard, file, shell, or protocol effect cannot run
because the target lacks it or the person refused a permission. The expected outcome is a visible, recoverable
state with an accessible alternative; a silent no-op is the failure.

#### Checklist

- [ ] DTCONT-CK-USAGE-02-01 — Every native integration states its behavior both when the capability is unavailable on the target and when a required permission or entitlement is refused.
- [ ] DTCONT-CK-USAGE-02-02 — Every native effect states whether it is visible, cancellable, and reversible.
- [ ] DTCONT-CK-USAGE-02-03 — Every native effect names its accessible alternative.

## Consistency

### DTCONT-SC-CONSISTENCY-01 — Rule violation: one wording claims several operating systems without per-target evidence

An entry is written once and applied to every claimed target because the intended behavior sounds the same.
The expected outcome shares wording only where direct evidence proves the same contract on every named target;
shared wording resting on one target's observation is the failure.

#### Checklist

- [ ] DTCONT-CK-CONSISTENCY-01-01 — Every entry whose wording covers more than one operating system carries direct evidence of that contract from each named target.
- [ ] DTCONT-CK-CONSISTENCY-01-02 — No operating system's convention is inferred from another's.
- [ ] DTCONT-CK-CONSISTENCY-01-03 — Intentional differences in close-versus-quit behavior, activation, background presence, installer flow, protocol or file delivery, notification behavior, and native permissions are recorded as differences.

### DTCONT-SC-CONSISTENCY-02 — Edge case: the product chooses a non-native convention

The product deliberately departs from what the operating system's users expect, for a reason the team accepts.
The expected outcome records the evidence that supports the departure; an undocumented departure that reads as
an oversight is the failure.

#### Checklist

- [ ] DTCONT-CK-CONSISTENCY-02-01 — Every non-native convention records the user need that motivates it.
- [ ] DTCONT-CK-CONSISTENCY-02-02 — Every non-native convention records its discoverability, accessibility, and recovery evidence.

## Risk

### DTCONT-SC-RISK-01 — Normal case: local data states its protection and its full lifecycle

Settings, documents, caches, credentials, logs, indexes, and downloads each live somewhere, are written at
some time, and can be lost. The expected outcome states the whole lifecycle and protection for each; a datum
whose creation is defined but whose deletion, retention, or protection is not is the failure.

#### Checklist

- [ ] DTCONT-CK-RISK-01-01 — Every datum states its create, read, update, delete, retention, export, backup, and migration behavior.
- [ ] DTCONT-CK-RISK-01-02 — Every datum states where it lives and how it is protected.
- [ ] DTCONT-CK-RISK-01-03 — Release-facing compatibility defaults are left to `desktop-release` rather than decided here.

### DTCONT-SC-RISK-02 — Expected failure: a datum is absent, corrupt, locked, or incompatible

The application starts and finds a file missing, a structure it cannot read, a lock it cannot take, or a
version it does not support. The expected outcome is defined, observable behavior with a recovery; an
undefined state that surfaces as a crash or a silent reset is the failure.

#### Checklist

- [ ] DTCONT-CK-RISK-02-01 — Every datum states its behavior when it is absent, corrupt, locked, or incompatible, and its interruption and recovery behavior.
- [ ] DTCONT-CK-RISK-02-02 — No security, accessibility, consent, data, or authority boundary is weakened to make a failure symptom disappear.

### DTCONT-SC-RISK-03 — Adversarial: the packaged artifact treated as a secrecy boundary

A value is placed inside the archive, bundle, or installer on the reasoning that a person will not open it.
The expected outcome keeps secrets out of the artifact and verifies the artifact's contents directly; an
assumption of opacity standing in for a protection is the failure.

#### Checklist

- [ ] DTCONT-CK-RISK-03-01 — No archive, bundle, or installer is treated as a secrecy boundary.
- [ ] DTCONT-CK-RISK-03-02 — Packaged resources, writable data, native dependencies, protocol identities, and permissions are verified from the exact artifact.
- [ ] DTCONT-CK-RISK-03-03 — Every path is resolved from the installed environment rather than from the source tree.

## Overall

### DTCONT-SC-OVERALL-01 — Normal case: every claimed target has its own evidence row

The contract claims a set of operating-system and architecture pairs, and each claim needs matching
observation. The expected outcome collects one target row per pair with its exact artifact and conditions; a
claim covered by a neighbouring target's row is the failure.

#### Checklist

- [ ] DTCONT-CK-OVERALL-01-01 — One target row exists for every claimed operating-system and architecture pair.
- [ ] DTCONT-CK-OVERALL-01-02 — Every target row names the exact artifact, installed state, entry and lifecycle paths exercised, native results, data fixtures, recovery observations, conditions, limitations, and evidence class.
- [ ] DTCONT-CK-OVERALL-01-03 — The exact operating system, architecture, application version, artifact, and delivery state are named before any platform behavior is judged.

### DTCONT-SC-OVERALL-02 — Adversarial: a development run presented as installed proof

The behavior works in a development run, the native call returns without throwing, and the source shows the
intended handling, so the contract is offered as proven. The expected outcome rests on the exact installed
artifact and the native operation's real result or failure signal; the appearance of working accepted as
evidence is the failure.

#### Checklist

- [ ] DTCONT-CK-OVERALL-02-01 — No claim about installed behavior rests on a development run, an unpacked build, or source inspection.
- [ ] DTCONT-CK-OVERALL-02-02 — No native result is inferred from a call that did not throw.
- [ ] DTCONT-CK-OVERALL-02-03 — Every native result is read from the mechanism owner's documented return value, event, state, or installed observation.
- [ ] DTCONT-CK-OVERALL-02-04 — No evidence from one target or delivery state substitutes for another's.
