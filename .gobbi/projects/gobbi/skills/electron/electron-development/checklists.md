# Electron Development Evaluation Checklist

This reusable unchecked source evaluates one Electron platform change delivered and locally verified under
this operation. It is governed by the [`electron`](../SKILL.md) domain and
[`electron-development`](SKILL.md) operation, with [`electron-design`](../electron-design/SKILL.md) owning the
security posture and default choices, [`electron-runtime`](../electron-runtime/SKILL.md) owning mechanism
lookup, [`electron-testing`](../electron-testing/SKILL.md) owning behavioral evidence, and
[`electron-release`](../electron-release/SKILL.md) owning packaged evidence. The source commit that contains
this file identifies the checklist version. Its stable owner prefix is `ELECDEV`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### ELECDEV-SC-PROJECT-01 — Normal case: the change is bound before implementation

An ordinary change starts from a stated outcome, a pinned Electron major, declared targets, the existing
stack, and named process owners. It fails this scenario when the outcome is implied by the diff, when a target
or stack fact is assumed, or when no one is named as the authority for an exception the change needs.

#### Checklist

- [ ] ELECDEV-CK-PROJECT-01-01 — The change names its observable outcome, the behavior that must stay unchanged, and its inputs, outputs, cancellation, and expected failures.
- [ ] ELECDEV-CK-PROJECT-01-02 — The installed and pinned Electron major, target operating systems and architectures, module format, package manager, bundler, and packaging stack are each recorded.
- [ ] ELECDEV-CK-PROJECT-01-03 — Every process owner and trust boundary the change crosses is identified.
- [ ] ELECDEV-CK-PROJECT-01-04 — The person or system authorized for security exceptions, new dependencies, credential use, publication, and platform-scope changes is recorded.

### ELECDEV-SC-PROJECT-02 — Expected failure: a required authority is absent

The change needs an authority that no one present holds, such as a security exception or a new dependency.
The expected outcome is a stop before implementation that names the missing authority; starting the work and
resolving the authority later is the observable failure.

#### Checklist

- [ ] ELECDEV-CK-PROJECT-02-01 — Implementation remains unstarted while a required authority is absent.
- [ ] ELECDEV-CK-PROJECT-02-02 — The stop names the first missing authority and the decision it blocks.

## Structure

### ELECDEV-SC-STRUCTURE-01 — Normal case: the process chain changes in dependency order

A cross-process change touches a shared contract, a privileged owner, a preload adapter, and a renderer
consumer. The expected outcome builds them in that order with each boundary intact; a renderer or preload
written against a contract that does not yet exist, or a contract that imports process-only modules, is the
failure.

#### Checklist

- [ ] ELECDEV-CK-STRUCTURE-01-01 — The change is applied in dependency order: shared contract, privileged owner, preload adapter, renderer consumer, then window, lifecycle, native, configuration, and documentation integration.
- [ ] ELECDEV-CK-STRUCTURE-01-02 — The shared contract imports no process-only runtime module across a boundary.
- [ ] ELECDEV-CK-STRUCTURE-01-03 — Operating-system, filesystem, secret, and process authority stays in main or a bounded utility process while renderer code stays web-shaped.
- [ ] ELECDEV-CK-STRUCTURE-01-04 — Every privileged handler is registered once at the correct lifecycle point, with duplicate registration, restart, and teardown behavior explicit.

### ELECDEV-SC-STRUCTURE-02 — Poor quality: placement chosen by import convenience

The change works, but a capability sits in the process where importing it was easiest rather than where its
required capability, trust, lifecycle, or failure isolation places it. The expected outcome states the
placement reason; a working change with an unexplained owner is the failure.

#### Checklist

- [ ] ELECDEV-CK-STRUCTURE-02-01 — Every placement decision names the required capability, trust, lifecycle, or failure-isolation reason behind it.
- [ ] ELECDEV-CK-STRUCTURE-02-02 — No capability is placed in a process because importing it there was convenient.

## Performance

### ELECDEV-SC-PERFORMANCE-01 — Poor quality: a cross-process contract with no end condition

The bridge works against a fast local response, but the contract states no timeout or cancellation and its
subscriptions have no disposal, so listeners, handlers, and owned web contents accumulate across reloads and
window recreation. The expected outcome bounds each crossing and releases what it created.

#### Checklist

- [ ] ELECDEV-CK-PERFORMANCE-01-01 — Every cross-process contract defines its timeout or cancellation behavior.
- [ ] ELECDEV-CK-PERFORMANCE-01-02 — Every renderer subscription returns a disposer that removes the underlying listener.
- [ ] ELECDEV-CK-PERFORMANCE-01-03 — Repeated window recreation, renderer reload, and handler re-registration leave no accumulated listener, handler, or owned web contents.

## Aesthetics

### ELECDEV-SC-AESTHETICS-01 — Poor quality: a correct change with an unreviewable record

The implementation is sound, but the record merges construction results with behavioral claims and leaves the
touched paths to be discovered from the diff. The expected outcome states the exact commands, the touched
paths, and the evidence boundary so a reviewer can follow the change without rerunning it.

#### Checklist

- [ ] ELECDEV-CK-AESTHETICS-01-01 — Every local verification records its exact command, exit status, and relevant output.
- [ ] ELECDEV-CK-AESTHETICS-01-02 — Every code, configuration, type, build, and documentation path the change touches is listed with the implementation.
- [ ] ELECDEV-CK-AESTHETICS-01-03 — Construction evidence and behavioral claims are presented separately rather than merged into one completion statement.

## Usage

### ELECDEV-SC-USAGE-01 — Normal case: the renderer consumes a narrow bridge

The renderer reaches a privileged capability through one preload method and must remain usable when that
capability is unavailable, rejected, canceled, or torn down with its window. The scenario fails when the
renderer depends on transport details or treats an expected state as an unhandled error.

#### Checklist

- [ ] ELECDEV-CK-USAGE-01-01 — Each capability is exposed as one narrow preload method through `contextBridge`.
- [ ] ELECDEV-CK-USAGE-01-02 — Every subscription callback receives data rather than an Electron event object.
- [ ] ELECDEV-CK-USAGE-01-03 — The renderer depends only on the bridge contract and web APIs.
- [ ] ELECDEV-CK-USAGE-01-04 — Unavailable capability, rejection, cancellation, and stale-window teardown are each handled as normal renderer states.

### ELECDEV-SC-USAGE-02 — Edge case: a native call returns without throwing

Dialogs, shell operations, shortcuts, notifications, and secure storage report cancellation and failure
through return values and events rather than exceptions, and they differ by operating system. The expected
outcome branches on the documented signal; treating a silent return as success is the failure.

#### Checklist

- [ ] ELECDEV-CK-USAGE-02-01 — Every native API result is branched on its documented cancellation field, Boolean, error string, support probe, or failure event.
- [ ] ELECDEV-CK-USAGE-02-02 — No native call is treated as successful because it raised no exception.
- [ ] ELECDEV-CK-USAGE-02-03 — Operating-system differences for each native path are covered rather than assumed uniform.

## Consistency

### ELECDEV-SC-CONSISTENCY-01 — Normal case: code, configuration, and documentation agree

The change alters entries, paths, targets, or behavior that other files describe. The expected outcome leaves
code, configuration, and documentation in agreement and keeps the project's module and preload build format.
A change whose configuration or documentation still describes the previous shape is the failure.

#### Checklist

- [ ] ELECDEV-CK-CONSISTENCY-01-01 — Current code, configuration, and documentation agree after the change.
- [ ] ELECDEV-CK-CONSISTENCY-01-02 — Target configuration, resource inclusion, and path resolution are updated wherever the implementation changed them.
- [ ] ELECDEV-CK-CONSISTENCY-01-03 — The project's module and preload build format is preserved, or its change is explained by the evidence that required it.

### ELECDEV-SC-CONSISTENCY-02 — Rule violation: release work performed inside development

Packaging, signing, or publication looks like the fastest way to confirm the change. This operation forbids
executing them and requires routing the affected evidence outward. Any packaging or publication action taken
here is the failure, whatever its result.

#### Checklist

- [ ] ELECDEV-CK-CONSISTENCY-02-01 — No packaging or publication action is executed in this operation.
- [ ] ELECDEV-CK-CONSISTENCY-02-02 — Every entry, resource, preload-format, native-module, ASAR, installer, signing, and update effect is handed to `electron-release`.

## Risk

### ELECDEV-SC-RISK-01 — Normal case: secure defaults survive the change

The change creates or configures web contents, sessions, or privileged handlers, so it can weaken the
established posture without touching a security file. The expected outcome preserves the posture across every
existing and later-created web contents and session; a control applied only to the window under development
is the failure.

#### Checklist

- [ ] ELECDEV-CK-RISK-01-01 — Every explicitly set `webPreferences` key is audited against the pinned Electron default and the secure defaults are preserved.
- [ ] ELECDEV-CK-RISK-01-02 — Every security-reducing deviation carries documented user authority and matching test evidence.
- [ ] ELECDEV-CK-RISK-01-03 — Secure options and controls are applied through the owning factory and one idempotent `web-contents-created` installer to every existing and later-created web contents and each distinct session or partition.
- [ ] ELECDEV-CK-RISK-01-04 — Sender evidence and payload data are validated in the privileged process.

### ELECDEV-SC-RISK-02 — Adversarial: a security setting relaxed to make the change work

A preload does not load or a renderer import fails, and disabling the sandbox, context isolation, or web
security makes the symptom disappear. The expected outcome diagnoses the loader and process boundary first
and moves or bridges the capability; a passing local run bought with a weaker renderer is the failure.

#### Checklist

- [ ] ELECDEV-CK-RISK-02-01 — Every preload loading failure is diagnosed from emitted module format, file extension, bundle shape, and resolved path before any security setting is considered.
- [ ] ELECDEV-CK-RISK-02-02 — Every wrong-process import is resolved by moving or bridging the capability rather than by granting the renderer more authority.
- [ ] ELECDEV-CK-RISK-02-03 — No security setting is reduced to make a local verification pass.

## Overall

### ELECDEV-SC-OVERALL-01 — Normal case: a complete change with routed evidence

Completion means every affected process, contract, resource, and handoff is settled and the remaining
evidence is routed to its owner. The scenario fails when an in-scope process, integration path, failure case,
or handoff is left unspecified while the change is reported as done.

#### Checklist

- [ ] ELECDEV-CK-OVERALL-01-01 — Every affected process owns only valid imports and capabilities.
- [ ] ELECDEV-CK-OVERALL-01-02 — Every long-lived resource the change creates has an owner and a cleanup path.
- [ ] ELECDEV-CK-OVERALL-01-03 — Completion is not claimed while an in-scope process, integration path, failure case, or required handoff remains unspecified.
- Also applies: ELECDEV-CK-RISK-01-04 (privileged validation of sender and payload).

### ELECDEV-SC-OVERALL-02 — Adversarial: construction success presented as runtime proof

A clean typecheck, a successful build, and a working development launch are offered as evidence that IPC
authorization, preload loading, lifecycle ordering, and packaged paths work. The expected outcome keeps each
result inside what it establishes and routes the rest; static success accepted as behavior is the failure.

#### Checklist

- [ ] ELECDEV-CK-OVERALL-02-01 — No construction result is treated as proof of a property it does not establish: a typecheck of IPC authorization, a successful build of preload loading, a development launch of packaged paths, a development launch of lifecycle ordering, and a compiled type of a runtime-validated cross-process payload.
- [ ] ELECDEV-CK-OVERALL-02-02 — Every behavioral claim is routed to `electron-testing` and every packaged claim to `electron-release` rather than asserted here.
