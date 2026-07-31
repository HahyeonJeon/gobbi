# Desktop Architecture Evaluation Checklist

This reusable unchecked source evaluates one installed application's in-application information architecture
and renderer state architecture against the view-structure, navigation, state-ownership, and restore
obligations this skill owns. It is governed by the [`desktop`](../SKILL.md) domain and
[`desktop-architecture`](SKILL.md) preferences, with [`desktop-delivery`](../desktop-delivery/SKILL.md) as the
operation that coordinates them, [`desktop-contract`](../desktop-contract/SKILL.md) as the owner of the
observable installed-platform promise these decisions feed, and
[`electron-design`](../../electron/electron-design/SKILL.md) as the owner of the process, privilege, bridge,
and IPC mechanics that carry them. The source commit that contains this file identifies the checklist version.
Its stable owner prefix is `DTARCH`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### DTARCH-SC-PROJECT-01 — Normal case: the decision set stays inside in-application structure

An ordinary architecture decides which views exist, how a person reaches and leaves them, which process owns
each piece of state, and what a relaunch restores. It fails this scenario when it settles an
installed-platform promise, an Electron mechanism, or a design-expression question that belongs to another
owner, or when a departure from a Preference carries no recorded reason.

#### Checklist

- [ ] DTARCH-CK-PROJECT-01-01 — Every decided choice is a view-structure, navigation, state-ownership, window-versus-content, or relaunch-restore choice.
- [ ] DTARCH-CK-PROJECT-01-02 — Every question the structure raises outside its own boundary is routed to its named owner: window creation, restore, focus, and cleanup promises to `desktop-contract`; process, privilege, bridge, and IPC mechanics to `electron-design`; and identity, evidence, concept-exploration, and expression questions to `desktop-interface`.
- [ ] DTARCH-CK-PROJECT-01-03 — Every departure from a Preference records the reason for departing beside the decision it affects.

### DTARCH-SC-PROJECT-02 — Poor quality: the structure was decided but never recorded

The team agreed the views, the way back, and the window behavior in discussion, and the application behaves
correctly today. The expected outcome leaves a written structure a later reader can follow; a correct
application whose structure exists only in the code that implements it is the failure.

#### Checklist

- [ ] DTARCH-CK-PROJECT-02-01 — A written view-structure record exists independently of the implementing code.
- [ ] DTARCH-CK-PROJECT-02-02 — The window-versus-content rule is recorded per view rather than inferable only from the control that opens it.
- Also applies: DTARCH-CK-PROJECT-01-03 (departure reasons recorded).

## Structure

### DTARCH-SC-STRUCTURE-01 — Normal case: views and their hierarchy are named before the second view

A second view is about to be built, so the structure containing it must already exist. The expected outcome
names every view and its place in one hierarchy; a structure that becomes whatever the first navigation
control happened to do is the failure.

#### Checklist

- [ ] DTARCH-CK-STRUCTURE-01-01 — Every view carries a name in the recorded hierarchy.
- [ ] DTARCH-CK-STRUCTURE-01-02 — The record states, for each view, whether it is a peer, nested, or transient.
- [ ] DTARCH-CK-STRUCTURE-01-03 — The naming and hierarchy record precedes construction of the second view.

### DTARCH-SC-STRUCTURE-02 — Normal case: every state value has one owning process and one lifetime

Application state is spread across the main process and one or more renderers. The expected outcome assigns
each value one owner and one lifetime; a value two renderers each treat as authoritative is the failure, even
while only one window is open.

#### Checklist

- [ ] DTARCH-CK-STRUCTURE-02-01 — Every piece of application state names one owning process and one lifetime — durable, session, or derived.
- [ ] DTARCH-CK-STRUCTURE-02-02 — No value has an authoritative copy in two renderers.
- [ ] DTARCH-CK-STRUCTURE-02-03 — Every value a renderer holds is either a view of state the main process owns or state declared genuinely local to that one window.
- [ ] DTARCH-CK-STRUCTURE-02-04 — Every per-window exception — scroll position, transient selection, in-progress form input — is declared as such where that state is declared.

### DTARCH-SC-STRUCTURE-03 — Edge case: a surface is genuinely used beside the main one

A preferences panel, a detached inspector, or a second document is used at the same time as the main content,
so the single-primary-window default does not fit. The expected outcome opens a separate window for that
surface and records why; a separate window opened because a surface felt distinct is the failure.

#### Checklist

- [ ] DTARCH-CK-STRUCTURE-03-01 — Every separate window exists for a surface genuinely used beside the main one rather than for a surface merely reached from it.
- [ ] DTARCH-CK-STRUCTURE-03-02 — The reason each separate surface is separate is recorded with that surface.

### DTARCH-SC-STRUCTURE-04 — Poor quality: the hierarchy is deeper than a person can climb out of

Views nest four or more levels deep, and the application has no address bar to show depth or offer a way up.
The expected outcome keeps application nesting at two or three levels; a deep hierarchy that works only
because the author remembers the path is the failure.

#### Checklist

- [ ] DTARCH-CK-STRUCTURE-04-01 — Application view nesting is at most two or three levels.
- [ ] DTARCH-CK-STRUCTURE-04-02 — Content whose own structure is deep, such as a file tree, carries persistent navigation of its own instead of adding application levels.

## Performance

Not applicable: this skill assigns no latency, throughput, resource, or measurement obligation. Its cost
statements concern the lifecycle, focus, restore, and synchronization work a design imposes on the people
building and using it, and every runtime measurement obligation for an installed outcome sits with
`desktop-delivery` Step 3.2 and Step 4.1 and with the Electron mechanism owners.

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

A person moves into a nested view and then wants to return. The expected outcome gives each surface one
identifiable current location and one defined way back that does not require closing a window; a return path
that exists only through the pointer, or only by closing the window, is the failure.

#### Checklist

- [ ] DTARCH-CK-USAGE-01-01 — Each surface has one identifiable current location and one defined way back.
- [ ] DTARCH-CK-USAGE-01-02 — The way back works without closing a window.
- [ ] DTARCH-CK-USAGE-01-03 — Reaching the current location and returning from it both work from the keyboard alone.

### DTARCH-SC-USAGE-02 — Edge case: relaunch after an ordinary quit and relaunch after a crash

A person quits deliberately on one occasion and the application crashes on another, and both end in a
relaunch. The expected outcome defines the two cases separately; one restore rule covering both, or a case
left undefined, is the failure.

#### Checklist

- [ ] DTARCH-CK-USAGE-02-01 — What a relaunch after an ordinary quit restores is defined separately from what a relaunch after a crash restores.
- [ ] DTARCH-CK-USAGE-02-02 — Each case states its behavior for location, selection, unsaved input, and scroll position.
- [ ] DTARCH-CK-USAGE-02-03 — Every class of state that is not restored is stated explicitly rather than left undefined.

### DTARCH-SC-USAGE-03 — Expected failure: the state left behind cannot safely be restored

The person left an expired session, an unavailable document, or an interrupted transaction, so restoring the
last location would be harmful or confusing. The expected outcome opens the nearest safe location and says
what was not restored; a silent fallback to the default view is the failure.

#### Checklist

- [ ] DTARCH-CK-USAGE-03-01 — Relaunch opens the nearest safe location when the state left behind is an expired session, an unavailable document, or an interrupted transaction.
- [ ] DTARCH-CK-USAGE-03-02 — The relaunch tells the person what was not restored.

## Consistency

### DTARCH-SC-CONSISTENCY-01 — Normal case: restored layout is declared as persisted user data

Window layout, last location, and panel arrangement survive a relaunch, so they are data the application
writes and later reads. The expected outcome declares them as persisted data with a named owner; layout
persisted as an implementation detail outside any data inventory is the failure.

#### Checklist

- [ ] DTARCH-CK-CONSISTENCY-01-01 — Window layout, last location, and panel arrangement are declared as persisted data with one named owner.
- [ ] DTARCH-CK-CONSISTENCY-01-02 — That declaration places them under `desktop-release`'s schema-version and corrupt-state recovery obligations.
- [ ] DTARCH-CK-CONSISTENCY-01-03 — Every value genuinely recomputable at each launch is recomputed rather than persisted.

### DTARCH-SC-CONSISTENCY-02 — Rule violation: a window exists that the platform contract never promises

The structure decides that a view opens its own window, but the resulting creation, restore, focus, and
cleanup promise was never routed to `desktop-contract`. The expected outcome carries every such window into
the platform contract; a window that exists only in the architecture record is the failure.

#### Checklist

- [ ] DTARCH-CK-CONSISTENCY-02-01 — Every window this structure creates appears in the window and lifecycle promise `desktop-contract` owns.
- [ ] DTARCH-CK-CONSISTENCY-02-02 — Every state value declared durable appears in the local-data inventory `desktop-contract` owns.

## Risk

### DTARCH-SC-RISK-01 — Normal case: a routing model is adopted with its borrowed concepts decided

The renderer's framework offers a router, and the team is deciding whether to use it. The expected outcome
names the application's locations and transitions first, or records the departure to the framework's
idiomatic router and then defines what its borrowed concepts mean installed; adopting the router for
familiarity is the failure.

#### Checklist

- [ ] DTARCH-CK-RISK-01-01 — The application's locations and the transitions between them are named before a routing library is selected, or the departure to a framework-idiomatic router is recorded with its reason.
- [ ] DTARCH-CK-RISK-01-02 — Refresh, browser history, deep links, and multiple tabs each carry a decided installed meaning or an explicit statement that no installed equivalent exists.
- [ ] DTARCH-CK-RISK-01-03 — No navigation behavior a router supplies by default reaches the person without a decision recording what it means installed.

### DTARCH-SC-RISK-02 — Adversarial: ownership is declared in the record while a renderer keeps its own copy

The state record assigns each value to the main process, and the application passes a read of that record,
while a renderer still mutates and reads a local copy of a shared value. The expected outcome makes the
declared owner the only authority; a record that describes ownership the running application does not honor
is the failure.

#### Checklist

- [ ] DTARCH-CK-RISK-02-01 — No renderer mutates a value the record assigns to the main process.
- [ ] DTARCH-CK-RISK-02-02 — A second window and a reopened window both read a shared value from its declared owner rather than from a local copy.
- [ ] DTARCH-CK-RISK-02-03 — Every value declared derived is recomputed from its owner rather than stored and edited in place.

## Overall

### DTARCH-SC-OVERALL-01 — Normal case: the structure settles views, navigation, state, windows, and restore together

A complete architecture answers which views exist, where a person is and how they return, who owns each
value, whether a view opens a window, and what a relaunch brings back. The scenario fails when one of those
five is unanswered, or when the record claims more than it settled.

#### Checklist

- [ ] DTARCH-CK-OVERALL-01-01 — The record answers view hierarchy, current location and way back, state ownership and lifetime, window-versus-content per view, and relaunch restore.
- [ ] DTARCH-CK-OVERALL-01-02 — The record's claim is no broader than the decisions it actually settles.
