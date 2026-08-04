# Electron Runtime Evaluation Checklist

This reusable unchecked source evaluates one Electron runtime lookup or diagnosis produced under the local
manual. The source commit that contains this file identifies the checklist version. Its stable owner prefix
is `ELECRUN`.

This file defines coverage only. The caller selects and resolves applicable rows, records its supporting
observations, and judges the work. Preserve every row as an unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that the scenario reuses.

## Project

### ELECRUN-SC-PROJECT-01 — Normal case: the answer stays inside runtime mechanism

The lookup explains availability, prerequisites, signals, target limits, or an earliest failure boundary.
It does not decide installed behavior or work owned outside this manual.

#### Checklist

- [ ] ELECRUN-CK-PROJECT-01-01 — The subject is one Electron runtime mechanism or one bounded runtime diagnosis.
- [ ] ELECRUN-CK-PROJECT-01-02 — The conclusion does not cross any owner boundary in this set: installed product behavior, source implementation, test design, test execution, test interpretation, environment classification, evidence acceptance, diagnostic-emission design, packaging procedure, and release-readiness decisions.
- [ ] ELECRUN-CK-PROJECT-01-03 — The lookup identifies the pinned Electron major, target operating system, executing process, emitted module format, and lifecycle point.

### ELECRUN-SC-PROJECT-02 — Expected failure: a required runtime fact is missing

One fact needed to distinguish the available mechanisms cannot be established from the project or target.
The answer remains bounded instead of filling the gap from source appearance or another target.

#### Checklist

- [ ] ELECRUN-CK-PROJECT-02-01 — Every unavailable fact needed for the conclusion remains an explicit unresolved fact.
- Also applies: ELECRUN-CK-PROJECT-01-03 (the known compatibility facts are still recorded).

## Structure

### ELECRUN-SC-STRUCTURE-01 — Normal case: process, loader, readiness, and owner form one trace

The expected explanation follows the mechanism from its executing process through module loading and
readiness to the object or process that owns its lifetime.

#### Checklist

- [ ] ELECRUN-CK-STRUCTURE-01-01 — Every Electron API is assigned to a process in which the pinned major documents it.
- [ ] ELECRUN-CK-STRUCTURE-01-02 — Every preload conclusion states its sandbox state, context-isolation boundary, emitted format, and bundle boundary.
- [ ] ELECRUN-CK-STRUCTURE-01-03 — TypeScript path aliases and type declarations are not treated as runtime module resolution.
- [ ] ELECRUN-CK-STRUCTURE-01-04 — Every listener is paired with its registration point, owner, removal point, and end condition.
- [ ] ELECRUN-CK-STRUCTURE-01-05 — Every window or view diagnosis identifies the current owning object and `webContents` identity.
- [ ] ELECRUN-CK-STRUCTURE-01-06 — Cold launch, ready state, an already-running application, quit, and process failure remain distinct lifecycle points.

## Performance

### ELECRUN-SC-PERFORMANCE-01 — Normal case: sustained cross-process work has an explicit lifetime

High-volume messaging and long work can affect main-process responsiveness. The lookup names the transfer,
ownership, and termination behavior needed to understand that cost.

#### Checklist

- [ ] ELECRUN-CK-PERFORMANCE-01-01 — Every streaming answer states the `MessagePort` transfer direction, current endpoint owner, start point, close point, and peer-exit behavior.
- [ ] ELECRUN-CK-PERFORMANCE-01-02 — The answer states both facts about sustained blocking work: its effect on main-process responsiveness and its actual executing process.
- [ ] ELECRUN-CK-PERFORMANCE-01-03 — A missing or slow reply is traced through registration, target lifetime, serialization, handler settlement, and disposal before adding retries.

## Aesthetics

### ELECRUN-SC-AESTHETICS-01 — Poor quality: exact mechanisms are blurred by broad wording

The answer may be broadly correct but hard to reuse because it mixes durable mechanics with transient facts
or replaces exact runtime identifiers with vague terms.

#### Checklist

- [ ] ELECRUN-CK-AESTHETICS-01-01 — Exact identifiers such as `process.platform`, `nativeImage`, `contextBridge`, `powerMonitor`, `webContents`, `render-process-gone`, and `child-process-gone` retain their documented spelling and scope.
- [ ] ELECRUN-CK-AESTHETICS-01-02 — Common words state the target operating system, executing process, owner, input, and lifecycle point without overloaded shorthand.
- [ ] ELECRUN-CK-AESTHETICS-01-03 — Durable mechanism statements are separated from version-dependent or environment-dependent facts that require rechecking.

## Usage

### ELECRUN-SC-USAGE-01 — Normal case: an IPC or bridge path can be traced end to end

The answer identifies the sender, crossing, receiver, value behavior, and lifetime rather than naming only a
channel or bridge.

#### Checklist

- [ ] ELECRUN-CK-USAGE-01-01 — The sender and receiver processes, channel direction, and registration time are explicit.
- [ ] ELECRUN-CK-USAGE-01-02 — The crossing states whether values are structured-cloned, copied and frozen, proxied, or transferred.
- [ ] ELECRUN-CK-USAGE-01-03 — Unsupported functions, DOM objects, Electron objects, and custom prototypes have an explicit representation or bridge operation.
- [ ] ELECRUN-CK-USAGE-01-04 — Request channels have one owning handler and a defined settlement path for both returned values and thrown errors.
- [ ] ELECRUN-CK-USAGE-01-05 — Listener and port cleanup is tied to the owning renderer, `webContents`, window, view, utility process, or main process.

### ELECRUN-SC-USAGE-02 — Normal case: readiness and teardown are traced separately

The answer shows when registration must happen, when a ready-only API can run, and which events may be absent
during operating-system shutdown.

#### Checklist

- [ ] ELECRUN-CK-USAGE-02-01 — Early `open-url` and `open-file` listeners are registered during module evaluation before a cold-launch event can arrive.
- [ ] ELECRUN-CK-USAGE-02-02 — APIs that require Electron readiness are placed after `app.whenReady()` or its equivalent ready transition.
- [ ] ELECRUN-CK-USAGE-02-03 — Single-instance ownership is decided before primary-window creation.
- [ ] ELECRUN-CK-USAGE-02-04 — Teardown covers every terminal member in this set: listener removal, port closure, termination of each owned child or utility process, and pending-work settlement.
- [ ] ELECRUN-CK-USAGE-02-05 — Ordinary quit, operating-system shutdown, suspend, renderer loss, and process crash are not treated as one event source.

### ELECRUN-SC-USAGE-03 — Normal case: a cold deep link reaches the ready primary

The launch input may arrive before windows and ready-only APIs exist. The expected path captures, validates,
queues, and later routes the URL.

#### Checklist

- [ ] ELECRUN-CK-USAGE-03-01 — Windows and Linux cold-launch arguments and macOS `open-url` delivery are distinguished.
- Also applies: ELECRUN-CK-USAGE-02-01 (the macOS listener is registered before a cold event can arrive).
- Also applies: ELECRUN-CK-USAGE-07-01 (the cold deep-link URL is captured).
- Also applies: ELECRUN-CK-USAGE-07-02 (the cold deep-link URL is validated before queueing).
- Also applies: ELECRUN-CK-USAGE-07-03 (the cold deep-link URL remains queued until readiness).

### ELECRUN-SC-USAGE-04 — Normal case: a running deep link reaches the existing primary

An already-running application receives a different operating-system path than a cold launch.

#### Checklist

- [ ] ELECRUN-CK-USAGE-04-01 — Windows and Linux `second-instance` delivery and macOS `open-url` delivery are distinguished.
- [ ] ELECRUN-CK-USAGE-04-02 — The answer states both `second-instance` input rules: possible argument reordering and validated `additionalData` for exact application-supplied data.

### ELECRUN-SC-USAGE-05 — Normal case: a cold file-open request is retained through readiness

File activation can be delivered through launch arguments or an early macOS event. Registration and launch
delivery remain separate prerequisites.

#### Checklist

- [ ] ELECRUN-CK-USAGE-05-01 — Windows `process.argv`, Linux launcher input, and macOS `open-file` delivery are distinguished.
- Also applies: ELECRUN-CK-USAGE-02-01 (the macOS listener is registered before a cold event can arrive).
- Also applies: ELECRUN-CK-USAGE-07-01 (the cold file-open input is captured).
- Also applies: ELECRUN-CK-USAGE-07-02 (the cold file-open input is validated before queueing).
- Also applies: ELECRUN-CK-USAGE-07-03 (the cold file-open input remains queued until readiness).

### ELECRUN-SC-USAGE-06 — Normal case: a running file-open request reaches the existing primary

The answer distinguishes macOS event delivery from the configured launcher or secondary-instance path on
Windows and Linux.

#### Checklist

- [ ] ELECRUN-CK-USAGE-06-01 — macOS `open-file` and configured Windows or Linux primary-instance routing are distinguished.
- [ ] ELECRUN-CK-USAGE-06-02 — The existing target window or view is resolved at delivery time instead of reusing a stale `webContents` reference.

### ELECRUN-SC-USAGE-07 — Normal case: cold external input survives the readiness boundary

A cold deep-link URL or file-open input may arrive before the application state that routes it exists. The
shared path must preserve the input while keeping capture, validation, and readiness retention independently
checkable.

#### Checklist

- [ ] ELECRUN-CK-USAGE-07-01 — Each cold external input is captured before launch delivery can be lost.
- [ ] ELECRUN-CK-USAGE-07-02 — Each captured cold external input is validated before it enters the readiness queue.
- [ ] ELECRUN-CK-USAGE-07-03 — Each validated cold external input remains queued until its owning application state is ready.

## Consistency

### ELECRUN-SC-CONSISTENCY-01 — Rule violation: current prose replaces pinned-major authority

The pinned major differs from current documentation, observed behavior conflicts with the manual, or a
version-sensitive claim lacks a live source.

#### Checklist

- [ ] ELECRUN-CK-CONSISTENCY-01-01 — Current official Electron API, tutorial, and breaking-change documents are consulted for every version-sensitive claim.
- [ ] ELECRUN-CK-CONSISTENCY-01-02 — Current documentation is reconciled with the project's pinned Electron major before availability is asserted.
- [ ] ELECRUN-CK-CONSISTENCY-01-03 — A conflict between observed behavior and this manual remains visible until the runtime version, target, loader, and live documentation explain it.

## Risk

### ELECRUN-SC-RISK-01 — Normal case: power transitions use the signals the target supplies

Power events are distinct from ordinary application quit and have operating-system limits.

#### Checklist

- [ ] ELECRUN-CK-RISK-01-01 — `suspend` and `resume` are treated as signals, not proof that asynchronous cleanup finished or resources survived.
- [ ] ELECRUN-CK-RISK-01-02 — `shutdown` use is limited to the operating systems documented for the pinned major.
- [ ] ELECRUN-CK-RISK-01-03 — The shutdown-delay conclusion includes both documented limits: an attempted delay from event prevention and a prompt application exit.
- [ ] ELECRUN-CK-RISK-01-04 — Windows shutdown, restart, and logout do not rely on `before-quit`, `will-quit`, or `quit` being emitted.

### ELECRUN-SC-RISK-02 — Expected failure: a process or window disappears

Each failure class has a different direct signal and owner. The answer does not collapse renderer, child,
utility, and main-process failure into one callback.

#### Checklist

- [ ] ELECRUN-CK-RISK-02-01 — The renderer-exit diagnosis states the `render-process-gone` signal, affected `webContents`, reason, and exit code.
- [ ] ELECRUN-CK-RISK-02-02 — The renderer-hang diagnosis distinguishes `unresponsive` from a later `responsive` signal on the same target.
- [ ] ELECRUN-CK-RISK-02-03 — The child-process diagnosis limits `child-process-gone` to the non-renderer process classes it reports.
- [ ] ELECRUN-CK-RISK-02-04 — An owned utility process uses its direct `spawn`, `error`, `exit`, and `message` events.
- [ ] ELECRUN-CK-RISK-02-05 — Main-process crash or exit relies on an external observer because in-process listeners cannot run afterward.
- [ ] ELECRUN-CK-RISK-02-06 — Crash collection is not treated as a live recovery signal or proof that an owning process remained alive.

### ELECRUN-SC-RISK-03 — Adversarial: a plausible success signal is offered as proof

The API did not throw, the type exists, development worked, or another operating system succeeded. None of
those observations proves the required target outcome.

#### Checklist

- [ ] ELECRUN-CK-RISK-03-01 — A non-throwing call is not accepted when the API reports failure through a Boolean, rejection, cancellation value, error string, event, or query.
- [ ] ELECRUN-CK-RISK-03-02 — An available type or successful typecheck is not accepted as proof of runtime process validity or module loading.
- [ ] ELECRUN-CK-RISK-03-03 — Development behavior or success on another operating system is not accepted as proof of installed target behavior.

## Overall

### ELECRUN-SC-OVERALL-01 — Edge case: several boundaries can explain the same symptom

A missing bridge, dropped deep link, absent event, or vanished message can come from process, loader,
readiness, ownership, target support, or an external prerequisite.

#### Checklist

- [ ] ELECRUN-CK-OVERALL-01-01 — The diagnosis inspects process, loader, readiness, ownership, target support, and external environment in earliest-boundary order.
- [ ] ELECRUN-CK-OVERALL-01-02 — Each rejected cause names the observation that rules it out.
- [ ] ELECRUN-CK-OVERALL-01-03 — The first boundary that explains all downstream symptoms is stated as the cause rather than one symptom among many.
- [ ] ELECRUN-CK-OVERALL-01-04 — The conclusion names the mechanism, prerequisite, direct signal, target or version limit, and next unresolved fact.
