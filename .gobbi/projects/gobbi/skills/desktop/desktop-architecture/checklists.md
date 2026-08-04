# Desktop Architecture Evaluation Checklist

This reusable unchecked source evaluates one installable Electron desktop application's Architecture
judgments: view hierarchy, navigation, window model, application-state authority and lifetime, restoration,
Activation request behavior, safe failure and recovery, and exact owner routes. It is governed by the
[`desktop`](../SKILL.md) domain and [`desktop-architecture`](SKILL.md) preference; the source commit that
contains this file identifies its version. Its stable owner prefix is `DTARCH`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation consumes the
applicable conditions. Preserve every row as an unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line may point only to a row defined
elsewhere in this file, carries no checkbox, and does not count toward a scenario's row limit.

## Project

### DTARCH-SC-PROJECT-02 — Poor quality: the structure was decided but never recorded

The team agreed the views, way back, and window behavior in discussion, and the application behaves correctly
today. The expected outcome leaves a written structure a later reader can follow; a correct application whose
structure exists only in implementing code is the failure.

#### Checklist

- [ ] DTARCH-CK-PROJECT-02-01 — A written view-structure record exists independently of the implementing code.
- [ ] DTARCH-CK-PROJECT-02-02 — The window-versus-content rule is recorded per view rather than inferable only from the control that opens it.
- [ ] DTARCH-CK-PROJECT-02-03 — Every Preference departure records its applicability and departure evidence beside the decision it affects.

### DTARCH-SC-PROJECT-03 — Normal case: Architecture chooses product behavior and routes adjacent concerns

An ordinary Architecture record decides product structure and runtime outcomes while current facts,
implementation, evidence, intent, coordination, and release judgment remain with their exact owners. The
expected outcome selects Architecture for every pure product judgment and routes each adjacent concern; a
missing Architecture selection or one owner claiming the whole cross-owner outcome is the failure.

#### Checklist

- [ ] DTARCH-CK-PROJECT-03-02 — A pure Activation request product judgment selects `desktop-architecture`, and a multi-owner Activation request keeps that selection while adding every applicable adjacent owner.
- [ ] DTARCH-CK-PROJECT-03-03 — Electron security or structure judgment routes to `electron-design`, current lifecycle, event, delivery, or mechanism facts to `electron-runtime`, implementation to `electron-development`, and evidence to `electron-testing`.
- [ ] DTARCH-CK-PROJECT-03-04 — Current target facts route to the applicable `desktop-windows`, `desktop-macos`, or `desktop-linux` Manual; product intent to `desktop-interface`; coordination to `desktop-development`; and release or data-compatibility judgment to `desktop-release`.
- [ ] DTARCH-CK-PROJECT-03-05 — No OS convention, Electron event, or available mechanism selects a create, reveal, focus, navigate, handle, no-op, or reject product outcome.
- Also applies: DTARCH-CK-OVERALL-02-01 (Architecture product-choice boundary).

## Structure

### DTARCH-SC-STRUCTURE-01 — Normal case: views and their hierarchy are named before the second view

A second view is about to be built, so the structure containing it must already exist. The expected outcome
names every view and its place in one hierarchy; a structure that becomes whatever the first navigation
control happened to do is the failure.

#### Checklist

- [ ] DTARCH-CK-STRUCTURE-01-01 — Every view carries a name in the recorded hierarchy.
- [ ] DTARCH-CK-STRUCTURE-01-02 — The record states, for each view, whether it is a peer, nested, or transient.
- [ ] DTARCH-CK-STRUCTURE-01-03 — The naming and hierarchy record precedes construction of the second view.

### DTARCH-SC-STRUCTURE-02 — Normal case: every state value has one owner and one lifetime

Application state is spread across the main process, one or more renderers, and any remote service the
application depends on. The expected outcome assigns each value one owner and one lifetime; a value two
renderers each treat as authoritative is the failure, even while only one window is open.

#### Checklist

- [ ] DTARCH-CK-STRUCTURE-02-01 — Every piece of application state names one owner — a process, or a remote service the application depends on — and one lifetime: durable, session, or derived.
- [ ] DTARCH-CK-STRUCTURE-02-02 — No value has an authoritative copy in two renderers.
- [ ] DTARCH-CK-STRUCTURE-02-03 — Every value a renderer holds is either a view of state its declared owner holds or state declared genuinely local to that one window.
- [ ] DTARCH-CK-STRUCTURE-02-04 — Every per-window exception — scroll position, transient selection, or in-progress form input — is declared where that state is defined.

### DTARCH-SC-STRUCTURE-03 — Edge case: a view is genuinely used beside the main one

A preferences panel, detached inspector, or second document is used at the same time as the main content, so
the single-primary-window default does not fit. The expected outcome opens a separate window for that view and
records why; a separate window opened only because the view felt distinct is the failure.

#### Checklist

- [ ] DTARCH-CK-STRUCTURE-03-01 — Every separate window exists for a view genuinely used beside the main one rather than for a view merely reached from it.
- [ ] DTARCH-CK-STRUCTURE-03-02 — The reason each separate view is separate is recorded with that view.

### DTARCH-SC-STRUCTURE-04 — Poor quality: the hierarchy is deeper than a person can climb out of

Views nest four or more levels deep, and the application has no address bar to show depth or offer a way up.
The expected outcome keeps application nesting at two or three levels; a deep hierarchy that works only
because the author remembers the path is the failure.

#### Checklist

- [ ] DTARCH-CK-STRUCTURE-04-01 — Application view nesting is at most two or three levels.
- [ ] DTARCH-CK-STRUCTURE-04-02 — Content whose own structure is deep, such as a file tree, carries persistent navigation of its own instead of adding application levels.

### DTARCH-SC-STRUCTURE-05 — Normal case: every view and window has a complete window model

A view may replace current content or require its own window, including a window created after initial
readiness. The expected outcome records the complete product model before implementation; a technical window
factory or happy path standing in for that decision is the failure.

#### Checklist

- [ ] DTARCH-CK-STRUCTURE-05-01 — Every window states its purpose, creation authority, restore behavior, close behavior, focus rules, minimum safe state, cleanup ownership, and later-created failure behavior.

### DTARCH-SC-STRUCTURE-06 — Rule violation: activation can create another authoritative owner

An Activation request reaches a second instance, later window, or recovery path that can mutate shared state
without the declared authority. The expected outcome keeps one authoritative application instance and state
owner through every path; a second effective authority violates the governing ownership rule.

#### Checklist

- [ ] DTARCH-CK-STRUCTURE-06-01 — Exactly one authoritative application instance and state owner applies every accepted Activation request outcome.
- [ ] DTARCH-CK-STRUCTURE-06-02 — No renderer, later window, second instance, rejected request, or recovery attempt creates another authority for the same application state.

## Performance

Not applicable: this preference assigns no latency, throughput, capacity, resource, or measurement obligation;
it judges product structure and runtime-state behavior.

## Aesthetics

### DTARCH-SC-AESTHETICS-01 — Poor quality: the structure is named after its navigation controls

Views are named for the button, menu item, or window that reaches them, so the record reads as a control
inventory rather than a map of places. The expected outcome names locations and the transitions between them;
names a reader cannot turn into a map are the failure even when every view is listed.

#### Checklist

- [ ] DTARCH-CK-AESTHETICS-01-01 — Every view name identifies a product location rather than the control, window, or route that reaches it.
- [ ] DTARCH-CK-AESTHETICS-01-02 — Every transition between locations is named alongside the locations it connects.

## Usage

### DTARCH-SC-USAGE-01 — Normal case: a person can tell where they are and get back

A person moves into a nested view and then wants to return. The expected outcome gives each window one
identifiable current location and one defined way back that does not require closing the window; a return path
that exists only through the pointer, or only by closing the window, is the failure.

#### Checklist

- [ ] DTARCH-CK-USAGE-01-01 — Each window has one identifiable current location and one defined way back.
- [ ] DTARCH-CK-USAGE-01-02 — The way back works without closing a window.
- [ ] DTARCH-CK-USAGE-01-03 — Reaching the current location and returning from it both work from the keyboard alone.

### DTARCH-SC-USAGE-02 — Edge case: Later relaunch after Normal quit and Abnormal termination

A person completes a Normal quit on one occasion and the application ends through Abnormal termination on
another, and both are followed by a Later relaunch. The expected outcome defines the two restoration cases
separately; one rule covering both, or a case left undefined, is the failure.

#### Checklist

- [ ] DTARCH-CK-USAGE-02-01 — What a Later relaunch after Normal quit restores is defined separately from what a Later relaunch after Abnormal termination restores.
- [ ] DTARCH-CK-USAGE-02-02 — Each case states its behavior for location, selection, unsaved input, and scroll position.
- [ ] DTARCH-CK-USAGE-02-03 — Every class of state that is not restored is stated explicitly rather than left undefined.

### DTARCH-SC-USAGE-03 — Expected failure: the prior state cannot safely be restored

The person left an expired session, unavailable document, or interrupted transaction, so restoring the last
location would be harmful or confusing. The expected outcome opens the nearest safe location and says what
was not restored; a silent fallback to a default view is the failure.

#### Checklist

- [ ] DTARCH-CK-USAGE-03-01 — Later relaunch opens the nearest safe location when the prior state is an expired session, an unavailable document, or an interrupted transaction.
- [ ] DTARCH-CK-USAGE-03-02 — The Later relaunch tells the person what was not restored.

### DTARCH-SC-USAGE-04 — Edge case: Activation requests arrive through different runtime and entry states

An Activation request may address a running application or trigger Launching for a new process, and it may
carry a second-instance, file, protocol, or notification entry. The expected outcome defines each applicable
product case independently of delivery mechanics; a supported case with no accepted outcome, or Launching
treated as the outcome, is the failure.

#### Checklist

- [ ] DTARCH-CK-USAGE-04-01 — Activation request behavior is defined while already running with windows, running with no windows, in background/tray mode, and during an activation-triggered Launching transition wherever each state is supported.
- [ ] DTARCH-CK-USAGE-04-02 — Second-instance, file, protocol, and notification entry each has defined Activation request behavior where applicable.
- [ ] DTARCH-CK-USAGE-04-03 — Every applicable request case selects exactly one accepted create, reveal, focus, navigate, handle, no-op, or reject outcome.
- [ ] DTARCH-CK-USAGE-04-04 — Launching is modeled and proved separately from the Activation request that caused or addressed it.

### DTARCH-SC-USAGE-05 — Expected failure: an invalid or unavailable Activation request cannot change state safely

An Activation request is invalid, untrusted, unavailable, or unsupported for the current target. The expected
outcome classifies and contains it before unsafe change, preserves or restores a named safe state, and permits
only validated recovery; an implicit retry, duplicate effect, partial mutation, or silent fallback is the
failure.

#### Checklist

- [ ] DTARCH-CK-USAGE-05-01 — Duplicate, stale, untrusted, and malformed requests are classified before authoritative product state changes.
- [ ] DTARCH-CK-USAGE-05-02 — Unsupported, unavailable, and target-specific requests, including a target mismatch, are classified before authoritative product state changes.
- [ ] DTARCH-CK-USAGE-05-03 — Rejection or failure records an exact named failure outcome before any partial work becomes authoritative.
- [ ] DTARCH-CK-USAGE-05-04 — Rejection or failure leaves authoritative product state unchanged or restored to a named safe state.
- [ ] DTARCH-CK-USAGE-05-05 — Every recovery attempt has one accepted basis: a newly validated request with revalidated dependencies, or an explicit accepted fallback that cannot repeat a duplicate effect.

## Consistency

### DTARCH-SC-CONSISTENCY-01 — Normal case: restored layout is declared as persisted user data

Window layout, last location, and panel arrangement survive a Later relaunch, so they are data the application
writes and later reads. The expected outcome declares them as persisted data with a named owner; layout
persisted as an implementation detail outside any data inventory is the failure.

#### Checklist

- [ ] DTARCH-CK-CONSISTENCY-01-01 — Window layout, last location, and panel arrangement are declared as persisted data with one named owner.
- [ ] DTARCH-CK-CONSISTENCY-01-02 — That declaration places them under `desktop-release` data-compatibility and corrupt-state recovery judgment.
- [ ] DTARCH-CK-CONSISTENCY-01-03 — Every value genuinely recomputable during each Launching transition is recomputed rather than persisted.

### DTARCH-SC-CONSISTENCY-03 — Rule violation: lifecycle terms collapse different product states

An architecture uses one unqualified lifecycle synonym for several distinct conditions. The expected outcome
names each product state and keeps mechanism or command outcomes separate; wording that lets one condition
stand in for another violates the governing runtime vocabulary.

#### Checklist

- [ ] DTARCH-CK-CONSISTENCY-03-01 — Launching, Activation request, Window close, Normal quit, Abnormal termination, Later relaunch, and every Qualified restart remain distinct product conditions.
- [ ] DTARCH-CK-CONSISTENCY-03-02 — An intentional immediate-exit mechanism is classified as Abnormal termination with its exact cause.
- [ ] DTARCH-CK-CONSISTENCY-03-03 — A command or test exit status is treated only as a tool or test outcome and never as product runtime state.
- [ ] DTARCH-CK-CONSISTENCY-03-04 — Intentional target differences in Window close, Normal quit, Activation request, background presence, file or protocol entry, and notification behavior are recorded from current applicable OS facts rather than inferred across targets.

## Risk

### DTARCH-SC-RISK-02 — Adversarial: ownership is declared while a renderer keeps its own copy

The state record assigns each value to an owner outside the renderer, and the application passes a read of
that record, while a renderer still mutates and reads a local copy of a shared value. The expected outcome
makes the declared owner the only authority; a record that the running application does not honor is the
failure.

#### Checklist

- [ ] DTARCH-CK-RISK-02-01 — No renderer mutates a value the record assigns to another owner.
- [ ] DTARCH-CK-RISK-02-02 — A second window and a reopened window both read a shared value from its declared owner rather than from a local copy.
- [ ] DTARCH-CK-RISK-02-03 — Every value declared derived is recomputed from its owner rather than stored and edited in place.

### DTARCH-SC-RISK-03 — Adversarial: activation evidence hides the source of failure

An Activation request reaches a safe-looking outcome, but the record omits the facts needed to tell whether the
request was rejected, the mechanism failed, the target could not support it, or the product behaved
incorrectly. The expected outcome makes the product transition and failure source attributable; a generic
failure or success label that hides the observed path is the failure.

#### Checklist

- [ ] DTARCH-CK-RISK-03-01 — Activation evidence records request class and trust, target tuple, process, instance, and window state, authoritative owner, selected outcome, state before and after, duplicate handling, rejection or failure, recovery, and limits.
- [ ] DTARCH-CK-RISK-03-02 — Activation evidence distinguishes request rejection, mechanism failure, target limitation, and product defect.

## Overall

### DTARCH-SC-OVERALL-01 — Normal case: the structure settles views, navigation, state, windows, and restoration together

A complete architecture answers which views exist, where a person is and how they return, who owns each state
value, whether a view opens a window, and what a Later relaunch brings back. The scenario fails when one of
those five is unanswered, or when the record claims more than it settled.

#### Checklist

- [ ] DTARCH-CK-OVERALL-01-01 — The record answers view hierarchy, current location and way back, state ownership and lifetime, window-versus-content per view, and Later relaunch restoration.
- [ ] DTARCH-CK-OVERALL-01-02 — The record's claim is no broader than the decisions it actually settles.

### DTARCH-SC-OVERALL-02 — Normal case: the complete Architecture integrates Activation with existing product boundaries

A current Architecture already settles the view, navigation, state, window, and restoration decisions and
also must settle applicable Activation requests through those same boundaries. The expected outcome
integrates every applicable Activation outcome with the complete window model, current location, state
lifetime, restoration, and one authoritative application instance and state owner; a pre-Activation record
or an outcome that bypasses one of those boundaries is the failure.

#### Checklist

- [ ] DTARCH-CK-OVERALL-02-01 — Every local choice is a view-hierarchy, navigation, window-model, application-state, restoration, or Activation request product-outcome judgment.
- Also applies: DTARCH-CK-OVERALL-01-01 (view, navigation, state, window, and restoration decisions).
- Also applies: DTARCH-CK-STRUCTURE-05-01 (complete window model).
- Also applies: DTARCH-CK-STRUCTURE-06-01 (one Activation authority).
- Also applies: DTARCH-CK-USAGE-04-03 (accepted Activation outcomes).
