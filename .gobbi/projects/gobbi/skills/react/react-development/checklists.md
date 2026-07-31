# React Evaluation Checklist

Use this `react-development` source with general `evaluation` after the React root routes applicable children; `RCT` is the stable owner prefix.
Evaluate only scenarios activated by the requested outcome, project configuration, changed paths, and affected boundaries; justify every not-applicable scenario in the completed evaluation.

## Project

### RCT-SC-PROJECT-02 — Rule violation: DOM guidance is applied to an unsupported renderer

This skill applies to browser applications and Electron renderers; inspected configuration must establish that contract, and nominal labels or browser assumptions fail.

#### Checklist

- [ ] RCT-CK-PROJECT-02-01 — Inspected project configuration establishes the task-activating renderer and React capability contract.

## Structure

### RCT-SC-STRUCTURE-01 — Normal case: Render and state have explicit owners

Components, Hooks, state, and applicable React type seams should have explicit owners. Mutation, non-top-level
Hook placement, ambiguous React naming, duplicate state, stored derivation, or a React type seam not owned by
installed React types fails the scenario. Snapshot mutation is checked by `RCT-CK-OVERALL-01-02`.

#### Checklist

- [ ] RCT-CK-STRUCTURE-01-01 — Each component renders deterministically from its inputs.
- [ ] RCT-CK-STRUCTURE-01-02 — Every Hook call occurs at the top level of a component or custom Hook.
- [ ] RCT-CK-STRUCTURE-01-03 — Every component name begins with a capital letter.
- [ ] RCT-CK-STRUCTURE-01-04 — Every custom Hook name begins with `use` followed by a capital letter.
- [ ] RCT-CK-STRUCTURE-01-05 — Each persistent fact has one narrow owner.
- [ ] RCT-CK-STRUCTURE-01-06 — A value computable during render is not stored as state.
- [ ] RCT-CK-STRUCTURE-01-08 — Each applicable TypeScript React seam uses installed React types for props, children, events, refs, and JSX-facing values.

### RCT-SC-STRUCTURE-02 — Rule violation: An Effect owns internal React causality

An Effect is valid only when it synchronizes an external system. Internal derivation, event handling,
incomplete dependencies, unmatched resources, or an obsolete result that can win a race fails the scenario.

#### Checklist

- [ ] RCT-CK-STRUCTURE-02-01 — Every Effect names the external system it synchronizes.
- [ ] RCT-CK-STRUCTURE-02-02 — Every Effect declares all reactive dependencies.
- [ ] RCT-CK-STRUCTURE-02-03 — Every Effect cleanup releases the resources acquired by that Effect.
- [ ] RCT-CK-STRUCTURE-02-04 — An obsolete asynchronous Effect result cannot update current state.
- [ ] RCT-CK-STRUCTURE-02-05 — No Effect handles the user action that caused the change.

### RCT-SC-STRUCTURE-03 — Expected failure: A render subtree fails

An Error Boundary should catch a descendant render failure or an error thrown inside the function passed to `startTransition`, and show a fallback.
Ordinary event-handler, server-rendering, self-boundary, and unrelated asynchronous failures use their actual owners; usable recovery uses `RCT-CK-USAGE-02-04`.

#### Checklist

- [ ] RCT-CK-STRUCTURE-03-01 — The boundary catches a render failure from its descendant tree.
- [ ] RCT-CK-STRUCTURE-03-02 — The caught failure produces an observable fallback.
- [ ] RCT-CK-STRUCTURE-03-04 — An ordinary event-handler failure is routed through its event error path.
- [ ] RCT-CK-STRUCTURE-03-05 — A server-rendering failure is routed through its owning server failure path.
- [ ] RCT-CK-STRUCTURE-03-06 — A failure thrown by the boundary is routed through its owning ancestor boundary.
- [ ] RCT-CK-STRUCTURE-03-07 — An unrelated asynchronous callback failure is routed through its async owner.
- [ ] RCT-CK-STRUCTURE-03-08 — An error thrown inside the function passed to `startTransition` is caught by an Error Boundary.

## Performance

### RCT-SC-PERFORMANCE-01 — Poor quality: Optimization adds cost without evidence

The change should use the configured compiler mode and actual function coverage. Assuming project-wide
coverage or changing manual memoization without focused evidence fails the scenario.

#### Checklist

- [ ] RCT-CK-PERFORMANCE-01-02 — Actual compiler coverage is established for each affected function.
- [ ] RCT-CK-PERFORMANCE-01-03 — Each manual memoization change is justified by focused evidence.
- [ ] RCT-CK-PERFORMANCE-01-04 — The configured `compilationMode` is recorded before any function-level compiler or memoization judgment.

## Aesthetics

### RCT-SC-AESTHETICS-01 — Poor quality: React structure obscures the behavior

The component tree, names, JSX, and state transitions should make the user path easy to review. Needless
wrappers, broad props, or fragmented render logic fails the scenario even when it runs.

#### Checklist

- [ ] RCT-CK-AESTHETICS-01-01 — The React structure makes the user path easy to review.

## Usage

### RCT-SC-USAGE-01 — Normal case: A user can operate the rendered outcome

The rendered surface should communicate meaning, support the accepted interaction, and be exercised through every
requested or changed path. Missing semantics, names, keyboard or focus behavior, or source-only checks fail the scenario.

#### Checklist

- [ ] RCT-CK-USAGE-01-01 — Each control uses the native semantic element available for its behavior.
- [ ] RCT-CK-USAGE-01-02 — Each interactive control has an accessible name.
- [ ] RCT-CK-USAGE-01-03 — Each required keyboard interaction works.
- [ ] RCT-CK-USAGE-01-04 — Focus moves or remains where the accepted interaction requires.
- [ ] RCT-CK-USAGE-01-05 — Rendered-surface exercise covers the requested behavior and every changed failure or recovery path.

### RCT-SC-USAGE-02 — Expected failure: The primary path cannot complete immediately

When the accepted path can wait, return no data, fail, or recover, the user should understand the current
state and available recovery. A blank, trapped, or falsely successful surface fails the scenario.

#### Checklist

- [ ] RCT-CK-USAGE-02-01 — An applicable pending state is observable.
- [ ] RCT-CK-USAGE-02-02 — An applicable empty state is observable.
- [ ] RCT-CK-USAGE-02-03 — An applicable failure state is observable.
- [ ] RCT-CK-USAGE-02-04 — A permitted recovery returns the user to a usable state.

## Consistency

### RCT-SC-CONSISTENCY-01 — Edge case: Identity or execution environment changes

The contract should survive reordered data, server/client execution, and hydration. A broad client graph,
misapplied directive, synchronous or general-fetching Server Function, unsupported boundary or recovery,
position key, unsupported directional value, scheduling drift, or hydration mismatch fails the scenario.

#### Checklist

- [ ] RCT-CK-CONSISTENCY-01-01 — Each list or remount key represents the intended durable identity.
- [ ] RCT-CK-CONSISTENCY-01-03 — Each boundary value is supported in the exact direction it crosses.
- [ ] RCT-CK-CONSISTENCY-01-04 — A caller invokes an outside-form Server Function within a Transition.
- [ ] RCT-CK-CONSISTENCY-01-05 — The first hydrated client output matches the server output.
- [ ] RCT-CK-CONSISTENCY-01-06 — A Server Function imported directly into client code comes from a module marked with module-level `'use server'`.
- [ ] RCT-CK-CONSISTENCY-01-07 — No Server Component is assigned its own component directive, including `'use server'`.
- [ ] RCT-CK-CONSISTENCY-01-08 — Each inline Server Function reference crosses only a framework-supported boundary such as a prop or form action.
- [ ] RCT-CK-CONSISTENCY-01-09 — An unsupported inline Server Function direct-import attempt is recovered by moving the function to a module marked with module-level `'use server'` or passing its reference through a supported boundary.
- [ ] RCT-CK-CONSISTENCY-01-10 — Each applicable `'use client'` boundary begins the client module graph at the smallest interactive subtree.
- [ ] RCT-CK-CONSISTENCY-01-11 — Each Server Function performs a mutation rather than general data fetching.
- [ ] RCT-CK-CONSISTENCY-01-12 — Every function marked by `'use server'` is async.

## Risk

### RCT-SC-RISK-01 — Adversarial: A client controls a trusted boundary

Browser code and Server Function callers must not gain privileged access through chosen arguments or imports. Missing
validation, identity establishment, current-state authorization, disclosure control, or capability containment fails the scenario.

#### Checklist

- [ ] RCT-CK-RISK-01-01 — Every Server Function argument is validated before use.
- [ ] RCT-CK-RISK-01-02 — Caller identity is established when the operation requires identity.
- [ ] RCT-CK-RISK-01-03 — The exact Server Function action is authorized against current server state.
- [ ] RCT-CK-RISK-01-04 — Each privileged capability remains behind its approved boundary.
- [ ] RCT-CK-RISK-01-05 — Each Server Function discloses only information permitted by a server-owned disclosure decision.

## Overall

### RCT-SC-OVERALL-01 — Adversarial: Cosmetic compliance hides a broken outcome

A change can render expected output while mutating a React-owned snapshot, hiding future instability behind
cosmetic compliance. Mutation after React owns a value fails even when isolated output checks pass.

#### Checklist

- [ ] RCT-CK-OVERALL-01-02 — Under the [Rules of React](https://react.dev/reference/rules), props, state, context, Hook arguments and returns after transfer, and values already passed to JSX remain immutable.
