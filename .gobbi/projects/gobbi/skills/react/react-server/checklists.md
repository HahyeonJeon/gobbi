# React Server Checklist

Use this unchecked `react-server` source with general `evaluation` when the React root activates the
`react-server` child; `RSCL` is the stable owner prefix.

## Project

### RSCL-SC-PROJECT-01 — Normal case: The framework establishes the feature

Server rendering, hydration, Server Components, Server Functions, and directives exist only through a
compatible installed React and framework or bundler contract. Assuming a feature from React alone fails.

#### Checklist

- [ ] RSCL-CK-PROJECT-01-01 — Project evidence establishes the installed React line.
- [ ] RSCL-CK-PROJECT-01-02 — Project evidence establishes a compatible framework or bundler feature.
- [ ] RSCL-CK-PROJECT-01-03 — Every framework-specific restriction is applied where it narrows the React platform contract.

## Structure

### RSCL-SC-STRUCTURE-01 — Rule violation: Module and value directions are confused

Directives define module or function boundaries, while runtime values have direction-specific transfer sets.
A misplaced directive, unsupported import, or unsupported value fails.

#### Checklist

- [ ] RSCL-CK-STRUCTURE-01-01 — Each `'use client'` directive starts a client module graph.
- [ ] RSCL-CK-STRUCTURE-01-02 — Each client module graph uses the smallest interactive subtree unless framework support, a required dependency, or measured transfer cost justifies a wider boundary.
- [ ] RSCL-CK-STRUCTURE-01-03 — Every transitive dependency below a `'use client'` module is valid client code.
- [ ] RSCL-CK-STRUCTURE-01-04 — Every module-level `'use server'` export is an async Server Function.
- [ ] RSCL-CK-STRUCTURE-01-05 — No Server Component is assigned a component directive, including `'use server'`.
- [ ] RSCL-CK-STRUCTURE-01-06 — A Server Function imported directly into client code comes from a module marked with module-level `'use server'`.
- [ ] RSCL-CK-STRUCTURE-01-07 — Each inline Server Function reference crosses only a framework-supported prop, form action, or equivalent boundary.
- [ ] RSCL-CK-STRUCTURE-01-08 — Each server-to-client prop or result value is supported in that exact direction.
- [ ] RSCL-CK-STRUCTURE-01-09 — Each client-to-Server-Function argument is supported in that exact direction.

## Performance

Not applicable: this manual establishes server/client correctness and hydration identity; streaming,
caching, transport, and latency performance belong to the active framework and project measurement owners.

## Aesthetics

Not applicable: this manual defines module, value, endpoint, and hydration mechanics, not presentation or
formatting judgment.

## Usage

### RSCL-SC-USAGE-01 — Expected failure: A server operation cannot complete

Expected validation failures and unexpected server failures should reach an observable, recoverable owner. A
blank, secret-bearing, or falsely successful interface fails.

#### Checklist

- [ ] RSCL-CK-USAGE-01-01 — Each expected validation failure produces an approved user-visible outcome.
- [ ] RSCL-CK-USAGE-01-02 — Each unexpected server failure remains observable at the nearest recoverable owner.
- [ ] RSCL-CK-USAGE-01-03 — Each permitted server-operation recovery returns the user to a usable state.

## Consistency

### RSCL-SC-CONSISTENCY-01 — Edge case: Execution environment or hydration changes

Module imports, endpoint calls, and first client output should agree with the server contract. Unsupported
recovery, scheduling drift, general-fetching functions, or hydration mismatch fails.

#### Checklist

- [ ] RSCL-CK-CONSISTENCY-01-01 — An unsupported inline Server Function direct import is recovered by a marked module or supported reference boundary.
- [ ] RSCL-CK-CONSISTENCY-01-02 — Every function marked by `'use server'` is async.
- [ ] RSCL-CK-CONSISTENCY-01-03 — Each Server Function performs a mutation rather than general data fetching.
- [ ] RSCL-CK-CONSISTENCY-01-04 — A caller invokes an outside-form Server Function within a Transition.
- [ ] RSCL-CK-CONSISTENCY-01-05 — A `<form action>` or `formAction` Server Function relies only on its framework-provided Transition wrapping.
- [ ] RSCL-CK-CONSISTENCY-01-06 — The first hydrated client output matches the server output except for a documented bounded suppression.
- [ ] RSCL-CK-CONSISTENCY-01-07 — Every avoidable hydration mismatch is repaired at its source.
- [ ] RSCL-CK-CONSISTENCY-01-08 — Each unsupported boundary value is replaced by a supported transfer representation.
- [ ] RSCL-CK-CONSISTENCY-01-09 — Each transferred representation is reconstructed only at its owning boundary.
- [ ] RSCL-CK-CONSISTENCY-01-10 — Each `suppressHydrationWarning` use covers a genuinely unavoidable text or attribute mismatch on one element.
- [ ] RSCL-CK-CONSISTENCY-01-11 — Each `suppressHydrationWarning` use relies on suppression only one level deep.

## Risk

### RSCL-SC-RISK-01 — Adversarial: A client invokes a trusted endpoint

Server Function arguments and imports are client-controlled even when trusted UI normally produces them.
Missing validation, identity, current-state authorization, capability containment, or disclosure control
fails.

#### Checklist

- [ ] RSCL-CK-RISK-01-01 — Every Server Function argument is validated before use.
- [ ] RSCL-CK-RISK-01-02 — Caller identity is established when the operation requires identity.
- [ ] RSCL-CK-RISK-01-03 — The exact Server Function action is authorized against current server state.
- [ ] RSCL-CK-RISK-01-04 — Each privileged capability remains behind its approved server boundary.
- [ ] RSCL-CK-RISK-01-05 — Each Server Function discloses only information permitted by a server-owned decision.

## Overall

### RSCL-SC-OVERALL-01 — Adversarial: One valid direction hides another invalid direction

A value or function valid in one transfer direction can be invalid in another. Generic serialization or a
single happy-path call must not stand in for exact directional proof.

#### Checklist

- [ ] RSCL-CK-OVERALL-01-01 — Every crossed module is checked in its actual direction.
- [ ] RSCL-CK-OVERALL-01-02 — Every crossed function reference is checked in its actual direction.
- [ ] RSCL-CK-OVERALL-01-03 — Every crossed argument is checked in its actual direction.
- [ ] RSCL-CK-OVERALL-01-04 — Every crossed prop is checked in its actual direction.
- [ ] RSCL-CK-OVERALL-01-05 — Every crossed result is checked in its actual direction.
- [ ] RSCL-CK-OVERALL-01-06 — No JSON round-trip is used as a proxy for the boundary contract.
- [ ] RSCL-CK-OVERALL-01-07 — No trusted-UI call is used as a proxy for the boundary contract.
