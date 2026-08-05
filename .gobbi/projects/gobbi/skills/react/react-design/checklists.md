# React Design Checklist

Use this unchecked `react-design` source with general `evaluation` when the React root activates the design
child; `RDES` is the stable checklist prefix.

A row is defined once beneath its defining scenario. An `Also applies` entry points to a row defined elsewhere
that this scenario reuses.

The [React Design Lifecycle Checklist](lifecycle-checklists.md) covers the remaining binding lifecycle
obligations for this operation.

## Project

### RDES-SC-PROJECT-01 — Rule violation: Browser design is applied to an unsupported renderer

This skill supports browser applications and Electron renderers. Applying its DOM assumptions to React
Native or an unestablished renderer fails the scenario.

#### Checklist

- [ ] RDES-CK-PROJECT-01-01 — Inspected project evidence establishes a browser application or Electron renderer.
- [ ] RDES-CK-PROJECT-01-02 — React Native work uses project-specific guidance instead of this DOM-oriented design.

### RDES-SC-PROJECT-02 — Normal case: Study establishes the React design context

React design should start from the requested outcome, current product behavior, active project, and applicable
evidence. A guessed component library, data model, React configuration, user need, or reference fails the
scenario.

#### Checklist

- [ ] RDES-CK-PROJECT-02-01 — The design record states the requested user outcome and current product behavior.
- [ ] RDES-CK-PROJECT-02-02 — Project study covers the active source, existing components, design system, and data model.
- [ ] RDES-CK-PROJECT-02-03 — Project files establish the installed React version and active React configuration.
- [ ] RDES-CK-PROJECT-02-04 — The evidence register includes available user evidence, internal prior art, and current official React guidance.

## Structure

### RDES-SC-STRUCTURE-01 — Normal case: State location, derived values, and identity are explicit

Each state value should have one narrow location, derived values should be computed during render, and keys
should express durable identity across reorder and remount. Duplicate state, stored derivation, or positional
identity fails the scenario.

#### Checklist

- [ ] RDES-CK-STRUCTURE-01-01 — Each persistent state value has one narrow state owner.
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

### RDES-SC-STRUCTURE-03 — Rule violation: An Effect derives render data or handles a user action

An Effect is valid only when it synchronizes an external system. Using one to derive render data or handle the
user action that caused a change, or leaving incomplete dependencies, leaked resources, or stale asynchronous
results, fails the scenario.

#### Checklist

- [ ] RDES-CK-STRUCTURE-03-01 — Every Effect names the external system it synchronizes.
- [ ] RDES-CK-STRUCTURE-03-02 — Every Effect declares all reactive dependencies.
- [ ] RDES-CK-STRUCTURE-03-03 — Every Effect cleanup releases the resources acquired by that Effect.
- [ ] RDES-CK-STRUCTURE-03-04 — An obsolete asynchronous Effect result cannot update current state.
- [ ] RDES-CK-STRUCTURE-03-05 — No Effect handles the user action that caused the change.

### RDES-SC-STRUCTURE-04 — Expected failure: A render subtree fails

An Error Boundary should contain descendant render failures and, only when official documentation for the
exact installed React release supports it, errors thrown inside a function passed to the `startTransition`
function returned by `useTransition`. Claiming transition-function support for an unsupported release,
claiming unrelated failure types, or omitting fallback or recovery fails the scenario.

#### Checklist

- [ ] RDES-CK-STRUCTURE-04-01 — The boundary catches a render failure from its descendant tree and, when official documentation for the exact installed React release supports it, an error thrown inside a function passed to the `startTransition` function returned by `useTransition`.
- [ ] RDES-CK-STRUCTURE-04-02 — The caught failure produces an observable fallback.
- [ ] RDES-CK-STRUCTURE-04-03 — An ordinary event-handler failure, a server-rendering failure, a failure thrown by the boundary itself, an unrelated asynchronous callback failure, and a transition-function failure when the exact installed React release does not support Error Boundary handling each reach the responsible error handler instead of that boundary.

## Performance

### RDES-SC-PERFORMANCE-01 — Poor quality: An escape hatch replaces ordinary data flow

Effects, refs, and memoization should solve an established external-system, non-rendered-value, or measured
identity/work problem. Using one without that need fails the scenario.

#### Checklist

- [ ] RDES-CK-PERFORMANCE-01-01 — Each ref states the non-rendered value it stores.
- [ ] RDES-CK-PERFORMANCE-01-02 — Each manual memoization states its measured-work or identity reason.
- [ ] RDES-CK-PERFORMANCE-01-03 — No ref is used as hidden rendered state.
- Also applies: RDES-CK-STRUCTURE-03-01 (each Effect names the external system it solves for).

### RDES-SC-PERFORMANCE-02 — Normal case: Performance assumptions have a measurement plan

A design may predict expensive rendering or identity-sensitive work, but the prediction should remain a
testable hypothesis. An optimization direction without a named interaction, component tree, or comparison
method fails the scenario.

#### Checklist

- [ ] RDES-CK-PERFORMANCE-02-01 — Each performance hypothesis names the performance-sensitive interaction.
- [ ] RDES-CK-PERFORMANCE-02-02 — Each performance hypothesis names the component tree it concerns.
- [ ] RDES-CK-PERFORMANCE-02-03 — The measurement plan defines the metric, environment, baseline, and comparison method.
- [ ] RDES-CK-PERFORMANCE-02-04 — The measurement plan selects a tool that can measure the stated React behavior.

## Aesthetics

### RDES-SC-AESTHETICS-01 — Poor quality: Component boundaries obscure the interface

The component tree and props should make the interaction and variation clear. Empty extraction,
needless prop plumbing, or opaque configuration fails the scenario.

#### Checklist

- [ ] RDES-CK-AESTHETICS-01-01 — Each extracted component has one coherent responsibility or independent change boundary.
- [ ] RDES-CK-AESTHETICS-01-02 — Props or composition express each supported variation.
- [ ] RDES-CK-AESTHETICS-01-03 — The variation interface exposes no unrelated internals.

## Usage

### RDES-SC-USAGE-01 — Normal case: The rendered interface remains operable

React design should preserve the native semantic, name, keyboard, and focus behavior required by the accepted
interaction. A custom control without defined substitute behavior fails.

#### Checklist

- [ ] RDES-CK-USAGE-01-01 — Each control uses the native semantic element available for its behavior.
- [ ] RDES-CK-USAGE-01-02 — Each interactive control has an accessible name.
- [ ] RDES-CK-USAGE-01-03 — Required keyboard and focus behavior remains observable.

### RDES-SC-USAGE-02 — Expected failure: Alternative states lack validated behavior

Loading, empty, failure, recovery, preservation, and reset behavior can expose a design gap that the normal
case hides. A state without an expected observable result or a validated route fails the scenario.

#### Checklist

- [ ] RDES-CK-USAGE-02-01 — The validation walk covers each applicable loading state and its expected observable result.
- [ ] RDES-CK-USAGE-02-02 — The validation walk covers each applicable empty state and its expected observable result.
- [ ] RDES-CK-USAGE-02-03 — The validation walk covers each applicable failure state and its expected observable result.
- [ ] RDES-CK-USAGE-02-04 — The validation walk covers each permitted recovery and its expected observable result.
- [ ] RDES-CK-USAGE-02-05 — The validation walk covers each required state-preservation case and its expected observable result.
- [ ] RDES-CK-USAGE-02-06 — The validation walk covers each intentional reset and its expected observable result.

## Consistency

### RDES-SC-CONSISTENCY-01 — Edge case: State location or tree position changes

Moving a state value or subtree should preserve or intentionally reset the accepted state and identity
behavior. An
accidental remount or a custom Hook without a concrete reusable purpose fails.

#### Checklist

- [ ] RDES-CK-CONSISTENCY-01-01 — A changed tree position preserves or resets state according to the accepted behavior.
- [ ] RDES-CK-CONSISTENCY-01-02 — Each extracted custom Hook represents a concrete stateful behavior boundary.

### RDES-SC-CONSISTENCY-02 — Rule violation: Design maps disagree

The component, props, state, identity, Effect, and failure maps describe one React design. A static skeleton
or acceptance scenario that contradicts one of those maps fails the scenario.

#### Checklist

- [ ] RDES-CK-CONSISTENCY-02-01 — The static skeleton and component map define the same component hierarchy.
- [ ] RDES-CK-CONSISTENCY-02-02 — The props-and-events table and data-flow map agree on every input and event.
- [ ] RDES-CK-CONSISTENCY-02-03 — The state map and identity decisions agree on every state owner, preservation case, and reset case.
- [ ] RDES-CK-CONSISTENCY-02-04 — The Effect map and acceptance scenarios agree on each external system, dependency, cleanup, and obsolete-result protection.
- [ ] RDES-CK-CONSISTENCY-02-05 — The Error Boundary map and acceptance scenarios agree on fallback, recovery, and uncaught failure routes.

## Risk

### RDES-SC-RISK-01 — Adversarial: React code reaches through a trust boundary

A convenient component API must not expose privileged server, browser, or Electron capability. Direct access
outside the approved interface fails the scenario.

#### Checklist

- [ ] RDES-CK-RISK-01-01 — React code consumes each privileged capability only through its typed, approved interface.

## Overall

### RDES-SC-OVERALL-01 — Adversarial: Correct output hides snapshot mutation

A component can render expected output once while mutating props, a state snapshot, a context value, a value
returned by a Hook, or a value already passed to JSX. Any such mutation fails despite cosmetic success.

#### Checklist

- [ ] RDES-CK-OVERALL-01-01 — Props, state snapshots, context values, values returned by Hooks, and values already passed to JSX remain immutable.

### RDES-SC-OVERALL-02 — Adversarial: A polished handoff hides an incomplete lifecycle

A design document can look implementation-ready while skipping study, a required user decision, scenario validation,
required handoff fields, or a required application-skill route. Cosmetic completeness without the full lifecycle
fails the scenario.

#### Checklist

- [ ] RDES-CK-OVERALL-02-01 — The design record contains completion evidence for Study, Design, Validate, and Handoff.
- [ ] RDES-CK-OVERALL-02-02 — Each material React choice is explicitly user-accepted after credible reference-backed alternatives are presented.
- [ ] RDES-CK-OVERALL-02-03 — The handoff to `react-development` contains the accepted component map, props and events, state and data-flow map, Effect and external-system map, identity and reset decisions, Error Boundary and recovery map, accessibility obligations, performance hypotheses and measurement plan, acceptance scenarios, decisions, limits, and verification plan.
- [ ] RDES-CK-OVERALL-02-04 — The routing record assigns complete browser interface and experience design to `web-frontend`, browser identity, concept, and aesthetic judgment to `web-interface`, installed-application identity, concept, and aesthetic judgment to `desktop-interface`, and installed renderer view and state structure to `desktop-architecture`.
- [ ] RDES-CK-OVERALL-02-05 — React design self-validation contains no independent Evaluation verdict.
- [ ] RDES-CK-OVERALL-02-06 — An unresolved material conflict stops handoff instead of appearing as an approved decision.
