# React Design Checklist

Use this unchecked `react-design` source with general `evaluation` when the React root activates the design
child; `RDES` is the stable owner prefix.

## Project

### RDES-SC-PROJECT-01 — Rule violation: Browser design is applied outside its contract

This skill supports browser applications and Electron renderers. Applying its DOM assumptions to React
Native or an unestablished renderer fails the scenario.

#### Checklist

- [ ] RDES-CK-PROJECT-01-01 — Inspected project evidence establishes a browser application or Electron renderer.
- [ ] RDES-CK-PROJECT-01-02 — React Native work uses project-specific guidance instead of this DOM-oriented design.

## Structure

### RDES-SC-STRUCTURE-01 — Normal case: Render, Hooks, state, and identity have explicit owners

Render should be deterministic, Hook placement valid, state minimal, and identity durable. Mutation,
conditional ordinary Hooks, duplicate state, stored derivation, or positional identity fails the scenario.

#### Checklist

- [ ] RDES-CK-STRUCTURE-01-01 — Each component renders deterministically from props, state, and context.
- [ ] RDES-CK-STRUCTURE-01-02 — Every ordinary Hook call occurs at the top level of a component or custom Hook.
- [ ] RDES-CK-STRUCTURE-01-03 — Every conditional or looped `use` call remains inside a component or Hook.
- [ ] RDES-CK-STRUCTURE-01-04 — No `use` call occurs inside `try`/`catch`.
- [ ] RDES-CK-STRUCTURE-01-05 — Each persistent fact has one narrow state owner.
- [ ] RDES-CK-STRUCTURE-01-06 — A value computable during render is not stored as state.
- [ ] RDES-CK-STRUCTURE-01-07 — Each list or remount key represents the intended durable identity.

### RDES-SC-STRUCTURE-02 — Rule violation: An Effect owns internal React causality

An Effect is valid only when it synchronizes an external system. Internal derivation, event handling,
incomplete dependencies, leaked resources, or stale asynchronous results fail the scenario.

#### Checklist

- [ ] RDES-CK-STRUCTURE-02-01 — Every Effect names the external system it synchronizes.
- [ ] RDES-CK-STRUCTURE-02-02 — Every Effect declares all reactive dependencies.
- [ ] RDES-CK-STRUCTURE-02-03 — Every Effect cleanup releases the resources acquired by that Effect.
- [ ] RDES-CK-STRUCTURE-02-04 — An obsolete asynchronous Effect result cannot update current state.
- [ ] RDES-CK-STRUCTURE-02-05 — No Effect handles the user action that caused the change.

### RDES-SC-STRUCTURE-03 — Expected failure: A render subtree fails

An Error Boundary should contain only the failures React routes to it and expose a usable fallback. Claiming
unrelated failure paths or omitting recovery fails the scenario.

#### Checklist

- [ ] RDES-CK-STRUCTURE-03-01 — The boundary catches a render failure from its descendant tree.
- [ ] RDES-CK-STRUCTURE-03-02 — An error thrown inside a function passed to the `startTransition` function returned by `useTransition` reaches an Error Boundary.
- [ ] RDES-CK-STRUCTURE-03-03 — The caught failure produces an observable fallback.
- [ ] RDES-CK-STRUCTURE-03-04 — An ordinary event-handler failure uses its event error path.
- [ ] RDES-CK-STRUCTURE-03-05 — A server-rendering failure uses its server failure path.
- [ ] RDES-CK-STRUCTURE-03-06 — A failure thrown by a boundary uses an owning ancestor boundary.
- [ ] RDES-CK-STRUCTURE-03-07 — An unrelated asynchronous callback failure uses its asynchronous owner.

## Performance

### RDES-SC-PERFORMANCE-01 — Poor quality: An escape hatch replaces ordinary data flow

Effects, refs, and memoization should solve an established external-system, non-rendered-value, or measured
identity/work problem. Using one without that need fails the scenario.

#### Checklist

- [ ] RDES-CK-PERFORMANCE-01-01 — Each Effect states the external-system problem it solves.
- [ ] RDES-CK-PERFORMANCE-01-02 — Each ref states the non-rendered value it owns.
- [ ] RDES-CK-PERFORMANCE-01-03 — Each manual memoization states its measured-work or identity reason.
- [ ] RDES-CK-PERFORMANCE-01-04 — No ref is used as hidden rendered state.

## Aesthetics

### RDES-SC-AESTHETICS-01 — Poor quality: Component boundaries obscure the interface

The component tree and prop surfaces should make the user path and variation clear. Empty extraction,
needless prop plumbing, or opaque configuration fails the scenario.

#### Checklist

- [ ] RDES-CK-AESTHETICS-01-01 — Each extracted component has one coherent responsibility or independent change boundary.
- [ ] RDES-CK-AESTHETICS-01-02 — Props or composition express each supported variation.
- [ ] RDES-CK-AESTHETICS-01-03 — The variation interface exposes no unrelated internals.

## Usage

### RDES-SC-USAGE-01 — Normal case: The rendered interface remains operable

React design should preserve the native semantic, name, keyboard, and focus behavior required by the accepted
interaction. A custom surface without an owning substitute contract fails.

#### Checklist

- [ ] RDES-CK-USAGE-01-01 — Each control uses the native semantic element available for its behavior.
- [ ] RDES-CK-USAGE-01-02 — Each interactive control has an accessible name.
- [ ] RDES-CK-USAGE-01-03 — Required keyboard behavior remains observable.
- [ ] RDES-CK-USAGE-01-04 — Required focus behavior remains observable.

## Consistency

### RDES-SC-CONSISTENCY-01 — Edge case: Ownership or tree position changes

Moving a fact or subtree should preserve or intentionally reset the same state and identity contract. An
accidental remount or a custom Hook without a concrete reusable purpose fails.

#### Checklist

- [ ] RDES-CK-CONSISTENCY-01-01 — A changed tree position preserves or resets state according to the accepted behavior.
- [ ] RDES-CK-CONSISTENCY-01-02 — Each extracted custom Hook represents a concrete stateful behavior boundary.

## Risk

### RDES-SC-RISK-01 — Adversarial: React code reaches through a trust boundary

A convenient component API must not expose privileged server, browser, or Electron capability. Direct access
outside the approved interface fails the scenario.

#### Checklist

- [ ] RDES-CK-RISK-01-01 — React code consumes each privileged capability only through its typed owner.
- [ ] RDES-CK-RISK-01-02 — React code consumes each privileged capability only through its approved owner.

## Overall

### RDES-SC-OVERALL-01 — Adversarial: Correct output hides snapshot mutation

A component can render expected output once while mutating a value React already owns. Any mutation of a
React-owned snapshot fails despite cosmetic success.

#### Checklist

- [ ] RDES-CK-OVERALL-01-01 — Props remain immutable.
- [ ] RDES-CK-OVERALL-01-02 — State snapshots remain immutable.
- [ ] RDES-CK-OVERALL-01-03 — Context values remain immutable after React reads them.
- [ ] RDES-CK-OVERALL-01-04 — Values returned by Hooks remain immutable after transfer.
- [ ] RDES-CK-OVERALL-01-05 — Values already passed to JSX remain immutable.
