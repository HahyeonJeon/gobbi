# React Server Checklist

Use this unchecked `react-server` source with general `evaluation` when the React root activates the
`react-server` child; `RSRV` is the stable owner prefix.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### RSRV-SC-PROJECT-01 — Normal case: The framework establishes the feature

Server rendering, hydration, Server Components, Server Functions, and directives exist only through a
compatible installed React and framework or bundler contract. Assuming a feature from React alone fails.

#### Checklist

- [ ] RSRV-CK-PROJECT-01-01 — Project evidence establishes the installed React line and a compatible framework or bundler feature.
- [ ] RSRV-CK-PROJECT-01-02 — Every framework-specific restriction is applied where it narrows the React platform contract.

## Structure

### RSRV-SC-STRUCTURE-01 — Rule violation: A directive marks the wrong module or function

Directives define module and function boundaries that React and the framework enforce. A misplaced directive,
an unmarked async contract, or an unsupported import fails the scenario.

#### Checklist

- [ ] RSRV-CK-STRUCTURE-01-01 — Each `'use client'` directive starts a client module graph.
- [ ] RSRV-CK-STRUCTURE-01-02 — Every transitive dependency below a `'use client'` module is valid client code.
- [ ] RSRV-CK-STRUCTURE-01-03 — Every function marked by `'use server'`, at module level or inline, is an async Server Function.
- [ ] RSRV-CK-STRUCTURE-01-04 — No Server Component is assigned a component directive, including `'use server'`.
- [ ] RSRV-CK-STRUCTURE-01-05 — A Server Function imported directly into client code comes from a module marked with module-level `'use server'`.
- [ ] RSRV-CK-STRUCTURE-01-06 — Each inline Server Function reference crosses only a framework-supported prop, form action, or equivalent boundary.

### RSRV-SC-STRUCTURE-02 — Poor quality: The client boundary is wider than the interaction needs

A `'use client'` module marks its whole transitive graph as client code. The boundary should be the smallest
interactive subtree; a wider one still renders but ships unnecessary client code and fails the scenario.

#### Checklist

- [ ] RSRV-CK-STRUCTURE-02-01 — Each client module graph uses the smallest interactive subtree unless framework support, a required dependency, or measured transfer cost justifies a wider boundary.

### RSRV-SC-STRUCTURE-03 — Rule violation: A value crosses in an unsupported direction

Server-to-client props and results and client-to-Server-Function arguments have different supported value
sets. A value valid in one direction can be invalid in the other, and using it there fails the scenario.

#### Checklist

- [ ] RSRV-CK-STRUCTURE-03-01 — Each server-to-client prop or result value and each client-to-Server-Function argument is supported in that exact direction.

## Performance

Not applicable: this manual establishes server/client correctness and hydration identity; streaming,
caching, transport, and latency performance belong to the active framework and project measurement owners.

## Aesthetics

Not applicable: this manual defines module, value, endpoint, and hydration mechanics, not presentation or
formatting judgment.

## Usage

### RSRV-SC-USAGE-01 — Expected failure: A server operation cannot complete

Expected validation failures and unexpected server failures should reach an observable, recoverable owner. A
blank, secret-bearing, or falsely successful interface fails.

#### Checklist

- [ ] RSRV-CK-USAGE-01-01 — Each expected validation failure produces an approved user-visible outcome.
- [ ] RSRV-CK-USAGE-01-02 — Each unexpected server failure remains observable at the nearest recoverable owner.
- [ ] RSRV-CK-USAGE-01-03 — Each permitted server-operation recovery returns the user to a usable state.

## Consistency

### RSRV-SC-CONSISTENCY-01 — Rule violation: A Server Function is invoked outside its contract

Server Functions carry mutations and need Transition scheduling outside forms. General data fetching or an
unwrapped outside-form call fails the scenario.

#### Checklist

- [ ] RSRV-CK-CONSISTENCY-01-01 — Each Server Function performs a mutation rather than general data fetching.
- [ ] RSRV-CK-CONSISTENCY-01-02 — A caller invokes an outside-form Server Function within a Transition.
- [ ] RSRV-CK-CONSISTENCY-01-03 — A `<form action>` or `formAction` Server Function relies only on its framework-provided Transition wrapping.

### RSRV-SC-CONSISTENCY-02 — Edge case: Server output and first client output must agree

Hydration compares the server-rendered tree with the first client render. The two should match, and the
bounded suppression escape hatch should stay inside its documented extent; drift fails the scenario.

#### Checklist

- [ ] RSRV-CK-CONSISTENCY-02-01 — The first hydrated client output matches the server output except for a documented bounded suppression.
- [ ] RSRV-CK-CONSISTENCY-02-02 — Every avoidable hydration mismatch is repaired at its source.
- [ ] RSRV-CK-CONSISTENCY-02-03 — Each `suppressHydrationWarning` use covers a genuinely unavoidable text or attribute mismatch on one element.
- [ ] RSRV-CK-CONSISTENCY-02-04 — Each `suppressHydrationWarning` use relies on suppression only one level deep.

### RSRV-SC-CONSISTENCY-03 — Expected failure: An unsupported boundary crossing is recovered

An import or value that the boundary cannot carry should be replaced by a supported module marking or transfer
representation and rebuilt at its owner. Passing the unsupported form anyway fails the scenario.

#### Checklist

- [ ] RSRV-CK-CONSISTENCY-03-01 — An unsupported inline Server Function direct import is recovered by a marked module or supported reference boundary.
- [ ] RSRV-CK-CONSISTENCY-03-02 — Each unsupported boundary value is replaced by a supported transfer representation.
- [ ] RSRV-CK-CONSISTENCY-03-03 — Each transferred representation is reconstructed only at its owning boundary.

## Risk

### RSRV-SC-RISK-01 — Adversarial: A client invokes a trusted endpoint

Server Function arguments and imports are client-controlled even when trusted UI normally produces them.
Missing validation, identity, current-state authorization, capability containment, or disclosure control
fails.

#### Checklist

- [ ] RSRV-CK-RISK-01-01 — Every Server Function argument is validated before use.
- [ ] RSRV-CK-RISK-01-02 — Caller identity is established when the operation requires identity.
- [ ] RSRV-CK-RISK-01-03 — The exact Server Function action is authorized against current server state.
- [ ] RSRV-CK-RISK-01-04 — Each privileged capability remains behind its approved server boundary.
- [ ] RSRV-CK-RISK-01-05 — Each Server Function discloses only information permitted by a server-owned decision.

### RSRV-SC-RISK-02 — Normal case: Server-only material stays out of the client graph

An ordinary feature ships its client module graph and every transitive dependency to the browser. Secrets,
credentials, and server-only modules should stay outside that graph; a reachable server-only value fails.

#### Checklist

- [ ] RSRV-CK-RISK-02-01 — No secret, credential, or server-only module is reachable from a `'use client'` module graph.
- Also applies: RSRV-CK-RISK-01-05 (disclosure follows a server-owned decision).

## Overall

### RSRV-SC-OVERALL-01 — Adversarial: One valid direction hides another invalid direction

A value or function valid in one transfer direction can be invalid in another. Generic serialization or a
single happy-path call must not stand in for exact directional proof.

#### Checklist

- [ ] RSRV-CK-OVERALL-01-01 — Every crossed module, function reference, argument, prop, and result is checked in its actual direction.
- [ ] RSRV-CK-OVERALL-01-02 — No JSON round-trip or trusted-UI call is used as a proxy for the boundary contract.
