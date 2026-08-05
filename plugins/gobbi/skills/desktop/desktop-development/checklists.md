# Desktop Development Evaluation Checklist

This reusable unchecked source evaluates one Desktop Development coordination run across its ten lifecycle
results, owner routes, evidence states, authority boundaries, recovery, and closure. It evaluates the
coordinator's result assembly; it does not copy specialist policy or independently certify the application.

Architecture judgments belong to
[`desktop-architecture`](../desktop-architecture/SKILL.md), Interface judgments to
[`desktop-interface`](../desktop-interface/SKILL.md), current target facts to the applicable
[`desktop-windows`](../desktop-windows/SKILL.md),
[`desktop-macos`](../desktop-macos/SKILL.md), or
[`desktop-linux`](../desktop-linux/SKILL.md) Manual, and release judgments to
[`desktop-release`](../desktop-release/SKILL.md). Electron lifecycle facts, implementation, tests, and
release mechanisms remain with their exact [`electron`](../../electron/SKILL.md) children. This checklist
owns family-wide Overall closure by requiring current, accepted where needed, and agreeing owner results.

The source is governed by the [`desktop`](../SKILL.md) domain and [Desktop Development](SKILL.md) operation.
The source commit identifies its version, and its stable owner prefix is `DTDLVR`.

A product contract is the accepted, mechanism-free set of product entries for every supported path across
six categories: installation and first launch; ordinary and alternate entry; windows and lifecycle; native
integration; local data; and update and recovery. Each entry states its product meaning and the observable
person or operator result without choosing an Electron or operating-system mechanism.

`Forward fix` means a later compatible release that corrects a faulty version already installed on user
machines.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects
applicable rows, records evidence and findings, and issues the verdict. Preserve every row as an unchecked
binary condition.

## Project

### DTDLVR-SC-PROJECT-12 — Normal case: Implementation returns a substantive exact result

The scoped change reaches Implementation after accepted Requirements and Design decisions. The expected
outcome is one current, integrated implementation handed to its evidence owners; an `Implemented` label on
partial, stale, untraceable, or unowned slices is the failure.

#### Checklist

- [ ] DTDLVR-CK-PROJECT-12-01 — Implementation records exactly `Implemented` only when every retained implementation slice is current, locally integrated, traceable to accepted decisions, and handed to its evidence owners.

### DTDLVR-SC-PROJECT-11 — Normal case: the last five stages return exact results

The run proves the installed artifact, reaches release readiness or its exact terminal branch, and continues
only when matching authority exists. Every continued authorized run closes through Maintenance.

#### Checklist

- [ ] DTDLVR-CK-PROJECT-11-06 — Each last-five stage ends with its named exact result or accepted terminal branch: Installation and installed-artifact verification — exactly `Installed and verified`; Release readiness — `Release-ready` or its exact blocker or cold handoff; Authorized publication/deployment, when that stage runs — exactly `Published/deployed for the authorized action`; Post-release operations, when that stage runs — `Post-release operation observed` or its exact observation blocker or stop result; Maintenance, when an authorized run continues through closure — exactly `Maintenance decision recorded`.

## Structure

### DTDLVR-SC-STRUCTURE-10 — Normal case: each stage record identifies its work

Every completed or blocked stage has one current record. Each required field is explicit in that record;
inference from another stage does not satisfy it.

#### Checklist

- [ ] DTDLVR-CK-STRUCTURE-10-07 — Every stage record contains subject/scope, actor/owner, current inputs, action/method, exact result, and evidence location.

### DTDLVR-SC-STRUCTURE-11 — Expected failure: a stage record cannot explain dependency or recovery

A cold reader must be able to identify why the stage stopped, who owns the next decision, and where the run
continues. Missing fields fail even when the displayed stage result looks successful.

#### Checklist

- [ ] DTDLVR-CK-STRUCTURE-11-06 — Every stage record contains dependencies/routes, failures/limitations, applicable authority, return/reopen condition, and next branch.

### DTDLVR-SC-STRUCTURE-12 — Adversarial: an unsupported product entry makes the contract look complete

The contract covers every supported path but adds an entry for a path or product-contract category the
product does not support. The extra entry fails even when every supported product entry is otherwise
complete.

#### Checklist

- [ ] DTDLVR-CK-STRUCTURE-12-01 — No product-contract entry describes a path or product-contract category the product does not support.

## Performance

### DTDLVR-SC-PERFORMANCE-10 — Edge case: independent slices proceed concurrently

Two complete slices have no unstable shared premise or overlapping writer. Concurrency is valid only while
the coordination boundary remains explicit.

#### Checklist

- [ ] DTDLVR-CK-PERFORMANCE-10-01 — Concurrent work has stable requirements, authority, owner, write boundary, and evidence subject.
- [ ] DTDLVR-CK-PERFORMANCE-10-02 — Each concurrent slice advances only from its own current dependencies.
- [ ] DTDLVR-CK-PERFORMANCE-10-03 — A later contradiction returns to the earliest owning decision.

### DTDLVR-SC-PERFORMANCE-11 — Adversarial: stale evidence and indefinite work appear current

A later change invalidates a dependency while the old result stays green, or post-release observation has no
finite stop. Both conditions fail even when progress reporting looks healthy.

#### Checklist

- [ ] DTDLVR-CK-PERFORMANCE-11-03 — For Software testing and verification after a correction, the failed layer and every dependent layer remain stale until repeated or proved unaffected for the same evidence subject.
- [ ] DTDLVR-CK-PERFORMANCE-11-02 — Post-release observation has a finite window, named threshold, stop condition, and bounded recovery action.

### DTDLVR-SC-PERFORMANCE-12 — Normal case: representative work proves responsiveness and resource use

A completed slice is exercised under representative work. The expected outcome measures both main-process
responsiveness and bounded resource use; either unmeasured result fails this scenario.

#### Checklist

- [ ] DTDLVR-CK-PERFORMANCE-12-01 — Main-process responsiveness is measured under representative work for each completed slice.
- [ ] DTDLVR-CK-PERFORMANCE-12-02 — Bounded resource use is measured under representative work for each completed slice.

### DTDLVR-SC-PERFORMANCE-13 — Poor quality: installed targets lack exact measurement evidence

An installed performance or resource claim is recorded without measurement under its declared conditions or
without the measurement's exact artifact and conditions. Either omission fails this scenario.

#### Checklist

- [ ] DTDLVR-CK-PERFORMANCE-13-01 — Every claimed installed performance target and every claimed installed resource target is measured under its declared conditions.
- [ ] DTDLVR-CK-PERFORMANCE-13-02 — Every recorded performance or resource measurement names the exact artifact measured and the conditions under which it was taken.

## Aesthetics

### DTDLVR-SC-AESTHETICS-10 — Poor quality: broad words hide the affected object or action

The text sounds plausible but leaves developers unable to identify the object changed or the operation
performed, or identifies a product entry only by a callback, native API, or test. The expected outcome names
the product meaning and observable person or operator result; mechanism-only wording is the failure.

#### Checklist

- [ ] DTDLVR-CK-AESTHETICS-10-01 — Binding prose names the concrete view, window, page, panel, dialog, control, renderer, or native integration when known.
- [ ] DTDLVR-CK-AESTHETICS-10-02 — Binding prose distinguishes build, package, distribute, publish, deploy, promote, install, update, repair, and uninstall.
- [ ] DTDLVR-CK-AESTHETICS-10-03 — Every product entry identifies its product meaning and the result a person or operator can observe, never only a framework callback, native API, or test name.

### DTDLVR-SC-AESTHETICS-11 — Adversarial: generic exit language hides runtime meaning

An unqualified `exit` is presented as a desktop product state, or a command result is confused with product
runtime behavior. `Qualified restart` means a named stop and a later start, each proved with version, input,
state, authority, and failure evidence.

#### Checklist

- [ ] DTDLVR-CK-AESTHETICS-11-01 — Runtime records use Not running, Launching, Activation request, Running with windows, Running with no windows, Background/tray mode, Window close, Normal quit, Abnormal termination, Later relaunch, Qualified restart, and exact OS power or session events instead of generic `exit`.
- [ ] DTDLVR-CK-AESTHETICS-11-05 — Electron `app.exit(code)` remains a mechanism fact, and a command or test `exit status` remains a tool or test result.

## Usage

### DTDLVR-SC-USAGE-10 — Normal case: Requirements accepts the complete product contract

The accepted request becomes a mechanism-free product contract before dependent work. A technically detailed
brief still fails when it omits a supported path in any of the six product-contract categories, a product
outcome, a native-integration field, a local-data behavior, or an update and recovery obligation.

#### Checklist

- [ ] DTDLVR-CK-USAGE-10-11 — Requirements records exactly `Requirements accepted` only when the accepted product contract defines the product problem, actors, supported targets, entry modes, and every supported path across installation and first launch; ordinary and alternate entry; windows and lifecycle; native integration; local data; and update and recovery.
- [ ] DTDLVR-CK-USAGE-10-02 — Requirements distinguishes observable completion, authoritative system completion, and false completion.
- [ ] DTDLVR-CK-USAGE-10-08 — Requirements defines normal and alternate paths for application use, runtime behavior, installation, exact-version update, repair or recovery, and uninstall, including what the person sees before, during, and after update, the usable state after interruption or failure, and the support route.
- [ ] DTDLVR-CK-USAGE-10-09 — Requirements records failure, recovery, support, authority, constraints, and explicit non-goals, plus each native integration's target support, permission or entitlement preconditions, cancellation, duplicate activation, unavailable behavior, returned failure state, cleanup, accessible alternative, and whether its effects are visible, cancellable, and reversible.
- [ ] DTDLVR-CK-USAGE-10-10 — For every affected datum — including each setting, document, cache, credential, log, index, download, and application resource — Requirements records its owner and lifecycle, installed location and protection, absent, corrupt, locked, and incompatible behavior, and create, read, update, delete, retention, export, backup, migration, compatibility, corruption, interruption, and recovery behavior.
- [ ] DTDLVR-CK-USAGE-10-05 — Requirements records trace, reopen conditions, and exact owner routes.

### DTDLVR-SC-USAGE-11 — Edge case: design evidence is reused or not applicable

No fresh design activity is performed for some accepted decisions. The coordinator must still assemble a
current result for Discovery research, Problem framing and design requirements, Concept alternatives,
Prototyping, Representative-user testing, Design–implementation collaboration, and Post-release measurement
and improvement without copying Interface policy.

#### Checklist

- [ ] DTDLVR-CK-USAGE-11-05 — Design collaboration records exactly `Design decisions accepted for the current subject` only when a current result exists for Discovery research, Problem framing and design requirements, Concept alternatives, Prototyping, Representative-user testing, Design–implementation collaboration, and Post-release measurement and improvement.
- [ ] DTDLVR-CK-USAGE-11-04 — Each design-activity result has exactly one disposition: `Performed for the current subject`, `Reused current evidence`, or `Not applicable with exact reason`.

### DTDLVR-SC-USAGE-12 — Adversarial: one state model proves another or required input is lost

Packaged, installed, and running states are treated as interchangeable, or an entry or transition omits an
input or resource it must preserve. The expected outcome keeps state evidence and preserved input explicit;
any hidden transfer is the failure.

#### Checklist

- [ ] DTDLVR-CK-USAGE-12-07 — Every applicable installed-application condition is recorded on the installed-state axis with its exact name — `Not installed`, `Installation in progress`, `Installed at exact version`, `Optional first-use pending/completed`, `Update in progress from A to B`, `Repair or recovery in progress`, `Uninstall in progress`, `Removed`, or `Recovered installed state` — or, for intentional residual state, with its explicit disposition, never as runtime evidence.
- [ ] DTDLVR-CK-USAGE-12-06 — Each supported launcher, file, protocol, notification, command, and second-instance path, and each applicable runtime transition, names every input or resource it must preserve and how that value survives.

### DTDLVR-SC-USAGE-13 — Normal case: installation and first launch state the complete entry

The product contract names installation and first launch but is complete only when a person can tell what is
installed, where to begin, what readiness or permission state can intervene, and how to repair a failure.

#### Checklist

- [ ] DTDLVR-CK-USAGE-13-01 — Every installation-and-first-launch entry states what is installed, where the person starts, every readiness or permission state that can intervene, and how failure is repaired.

### DTDLVR-SC-USAGE-14 — Expected failure: native integration is unavailable or permission is refused

A native integration cannot run because the target lacks the capability or a required permission or
entitlement is refused. Permission preconditions plus a generic failure state do not satisfy either required
product behavior.

#### Checklist

- [ ] DTDLVR-CK-USAGE-14-01 — Every native integration defines product behavior both when the target capability is unavailable and when a required permission or entitlement is refused.

## Consistency

### DTDLVR-SC-CONSISTENCY-10 — Rule violation: one lifecycle result is used as proof of another

The run closes a later gate with a cheaper proxy. Each distinction below must remain visible in the stage
records and evidence routes.

#### Checklist

- [ ] DTDLVR-CK-CONSISTENCY-10-07 — Software testing and verification records exactly `Software-tested and verified` only when every retained claim and applicable case is supported by separate current, bounded, contradiction-free testing and verification evidence for the exact evidence subject.
- [ ] DTDLVR-CK-CONSISTENCY-10-02 — A development run, unpacked build, package, archive, or source build never proves installed performance, installed resource use, or any other installed-artifact behavior.
- [ ] DTDLVR-CK-CONSISTENCY-10-03 — Release readiness never grants authority for an external action.
- [ ] DTDLVR-CK-CONSISTENCY-10-04 — An upload response or control-plane label never proves the destination bytes or deployed state.
- [ ] DTDLVR-CK-CONSISTENCY-10-06 — Launching remains distinct from an Activation request.

### DTDLVR-SC-CONSISTENCY-11 — Rule violation: a platform capability rewrites an accepted product decision

A platform convention or technical capability conflicts with an accepted product requirement or user
authority, and the coordinator records an implementation disposition instead of returning the conflict. The
accepted decision remains unchanged until the user or product authority accepts a new product decision.

#### Checklist

- [ ] DTDLVR-CK-CONSISTENCY-11-01 — An accepted product requirement or user authority changes after a platform-convention or technical-capability conflict only through a newly accepted product decision from the user or product authority, never through an implementation disposition.

## Risk

### DTDLVR-SC-RISK-10 — Expected failure: matching authority is absent at the action boundary

The artifact may be release-ready, but the next signing, notarization, credential, store, feed, publication,
deployment, promotion, or rollout action lacks exact current authority.

#### Checklist

- [ ] DTDLVR-CK-RISK-10-01 — Point-of-action authority binds the exact action, artifact, target, version, channel, environment, destination, credential or identity, actor, evidence, and recovery boundary.
- [ ] DTDLVR-CK-RISK-10-02 — Missing, declined, expired, or narrower authority returns artifact, target, next action and actor, credential boundary, checks, thresholds, recovery route, retained work, and resume point before action.
- [ ] DTDLVR-CK-RISK-10-04 — A failed external action stops every later external action.
- [ ] DTDLVR-CK-RISK-10-05 — Every retry, withdrawal, pause, rollback, Forward fix, or other recovery has its own matching point-of-action authority.

### DTDLVR-SC-RISK-11 — Adversarial: coordination claims action, health, or safe progress without proof

Documentation appears complete while a mechanism owner, destination result, blocker record, or bounded
observation contract is absent, or a correction hides failure by weakening a protected boundary. The expected
outcome keeps mechanism ownership and every security, accessibility, consent, data, and authority boundary
intact; mechanism selection by the contract or coordinator and weakened-boundary repair are failures.

#### Checklist

- [ ] DTDLVR-CK-RISK-11-04 — Every external action is assigned to its mechanism owner rather than the desktop development coordinator.
- [ ] DTDLVR-CK-RISK-11-05 — No product entry selects an Electron callback, event, process, IPC channel, permission handler, package format, updater, or signing mechanism.
- [ ] DTDLVR-CK-RISK-11-02 — A proved blocker records the exact blocked result, current states, bounds, missing dependency, retained work, safe stop, required actor and action, and resume condition.
- [ ] DTDLVR-CK-RISK-11-03 — Post-release work names its questions, signals, owners, consumers, destinations, allowed data, retention, window, thresholds, support, stop, and recovery.
- [ ] DTDLVR-CK-RISK-11-06 — No correction or failure repair weakens a security, accessibility, consent, data, or authority boundary.

## Overall

### DTDLVR-SC-OVERALL-10 — Normal case: current owner results close the family-wide claim

The coordinator reaches release readiness and, when authorized, Maintenance without turning another owner's
policy into a local checklist.

#### Checklist

- [ ] DTDLVR-CK-OVERALL-10-08 — Packaging records exactly `Packaged` only when the current `electron-release` owner result for the exact subject identifies the artifact identity, version, target, checksum, contents, frozen inputs, build environment, build logs, signature and notarization status, and limitations.
- [ ] DTDLVR-CK-OVERALL-10-09 — Every retained claim has a current `desktop-release` judgment and every applicable `electron-release` result, plus each required Architecture, Interface, applicable OS Manual, Electron runtime, Electron development, and Electron testing result, all for the exact evidence subject.
- [ ] DTDLVR-CK-OVERALL-10-06 — Each required owner result is accepted when its owner requires acceptance.
- [ ] DTDLVR-CK-OVERALL-10-07 — Required owner results agree with their dependencies and support the retained claim.
- [ ] DTDLVR-CK-OVERALL-10-02 — Release readiness includes current artifact, installed, transition, compatibility, recovery, support, observation, stop, Evaluation, rollback or Forward fix, and limitation results.
- [ ] DTDLVR-CK-OVERALL-10-03 — Maintenance records exactly one of `no change`, `new accepted scoped change returning Requirements`, or `retirement trigger produces separate Retirement handoff`.

### DTDLVR-SC-OVERALL-11 — Adversarial: Maintenance is omitted or Retirement becomes an eleventh stage

Post-release status is treated as closure without a decision, or retirement actions are appended to the
current run.

#### Checklist

- [ ] DTDLVR-CK-OVERALL-11-01 — A new accepted scoped change returns to Requirements with its own scope and authority.
- [ ] DTDLVR-CK-OVERALL-11-03 — The separate Retirement handoff contains affected people and installed versions, target, channel/store/feed, usage/support evidence, data export/retention/deletion/migration, replacement/update/uninstall effects, communication/support obligations, external systems, stop conditions, first irreversible action, authority, and resume point.
- [ ] DTDLVR-CK-OVERALL-11-05 — This operation executes no Retirement action.
