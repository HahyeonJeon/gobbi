# React Design Checklist

Use this unchecked `react-design` source with general `evaluation` when the React root activates the design
child; `RDES` is the stable owner prefix.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### RDES-SC-PROJECT-01 — Rule violation: Browser design is applied outside its contract

This skill supports browser applications and Electron renderers. Applying its DOM assumptions to React
Native or an unestablished renderer fails the scenario.

#### Checklist

- [ ] RDES-CK-PROJECT-01-01 — Inspected project evidence establishes a browser application or Electron renderer.
- [ ] RDES-CK-PROJECT-01-02 — React Native work uses project-specific guidance instead of this DOM-oriented design.

## Structure

### RDES-SC-STRUCTURE-01 — Normal case: State, derivation, and identity have explicit owners

State should be minimal, derivable values computed during render, and identity durable across reorder and
remount. Duplicate state, stored derivation, or positional identity fails the scenario.

#### Checklist

- [ ] RDES-CK-STRUCTURE-01-01 — Each persistent fact has one narrow state owner.
- [ ] RDES-CK-STRUCTURE-01-02 — A value computable during render is not stored as state.
- [ ] RDES-CK-STRUCTURE-01-03 — Each list or remount key represents the intended durable identity.

### RDES-SC-STRUCTURE-02 — Rule violation: Render purity or Hook position breaks the Rules of React

Render must stay a pure calculation and every Hook must sit where React permits it. Mutation during render, a
conditional ordinary Hook, or a `use` call outside a component or inside `try`/`catch` fails the scenario.

#### Checklist

- [ ] RDES-CK-STRUCTURE-02-01 — Each component renders deterministically from props, state, and context.
- [ ] RDES-CK-STRUCTURE-02-02 — Every ordinary Hook call occurs at the top level of a component or custom Hook.
- [ ] RDES-CK-STRUCTURE-02-03 — Every conditional or looped `use` call remains inside a component or Hook.
- [ ] RDES-CK-STRUCTURE-02-04 — No `use` call occurs inside `try`/`catch`.

### RDES-SC-STRUCTURE-03 — Rule violation: An Effect owns internal React causality

An Effect is valid only when it synchronizes an external system. Internal derivation, event handling,
incomplete dependencies, leaked resources, or stale asynchronous results fail the scenario.

#### Checklist

- [ ] RDES-CK-STRUCTURE-03-01 — Every Effect names the external system it synchronizes.
- [ ] RDES-CK-STRUCTURE-03-02 — Every Effect declares all reactive dependencies.
- [ ] RDES-CK-STRUCTURE-03-03 — Every Effect cleanup releases the resources acquired by that Effect.
- [ ] RDES-CK-STRUCTURE-03-04 — An obsolete asynchronous Effect result cannot update current state.
- [ ] RDES-CK-STRUCTURE-03-05 — No Effect handles the user action that caused the change.

### RDES-SC-STRUCTURE-04 — Expected failure: A render subtree fails

An Error Boundary should contain only the failures React routes to it and expose a usable fallback. Claiming
unrelated failure paths or omitting recovery fails the scenario.

#### Checklist

- [ ] RDES-CK-STRUCTURE-04-01 — The boundary catches a render failure from its descendant tree and an error thrown inside a function passed to the `startTransition` function returned by `useTransition`.
- [ ] RDES-CK-STRUCTURE-04-02 — The caught failure produces an observable fallback.
- [ ] RDES-CK-STRUCTURE-04-03 — An ordinary event-handler failure, a server-rendering failure, a failure thrown by the boundary itself, and an unrelated asynchronous callback failure each reach their own owner instead of that boundary.

## Performance

### RDES-SC-PERFORMANCE-01 — Poor quality: An escape hatch replaces ordinary data flow

Effects, refs, and memoization should solve an established external-system, non-rendered-value, or measured
identity/work problem. Using one without that need fails the scenario.

#### Checklist

- [ ] RDES-CK-PERFORMANCE-01-01 — Each ref states the non-rendered value it owns.
- [ ] RDES-CK-PERFORMANCE-01-02 — Each manual memoization states its measured-work or identity reason.
- [ ] RDES-CK-PERFORMANCE-01-03 — No ref is used as hidden rendered state.
- Also applies: RDES-CK-STRUCTURE-03-01 (each Effect names the external system it solves for).

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
- [ ] RDES-CK-USAGE-01-03 — Required keyboard and focus behavior remains observable.

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

- [ ] RDES-CK-RISK-01-01 — React code consumes each privileged capability only through its typed, approved owner.

## Overall

### RDES-SC-OVERALL-01 — Adversarial: Correct output hides snapshot mutation

A component can render expected output once while mutating a value React already owns. Any mutation of a
React-owned snapshot fails despite cosmetic success.

#### Checklist

- [ ] RDES-CK-OVERALL-01-01 — Props, state snapshots, context values, values returned by Hooks, and values already passed to JSX each remain immutable once React owns them.
