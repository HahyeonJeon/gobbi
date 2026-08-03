# React TypeScript Checklist

Use this unchecked `react-typescript` source with general `evaluation` when the React root activates the
TypeScript child; `RTSX` is the stable checklist prefix.

A row is defined once beneath its defining scenario. An `Also applies` entry points to a row defined elsewhere
that this scenario reuses.

## Project

### RTSX-SC-PROJECT-01 — Normal case: The installed React TypeScript configuration is established

React type decisions should follow the project's TypeScript, React, renderer, framework, definitions, and
compiler configuration. A copied neighboring-version type or missing type-check command fails.

#### Checklist

- [ ] RTSX-CK-PROJECT-01-01 — Project files establish the exact installed TypeScript version, exact installed React version, installed renderer, active framework, and installed React type definitions.
- [ ] RTSX-CK-PROJECT-01-02 — The active JSX mode, target libraries, strictness settings, and module configuration are recorded.
- [ ] RTSX-CK-PROJECT-01-03 — The project type-check command covers the affected React source or test.

## Structure

### RTSX-SC-STRUCTURE-01 — Normal case: Props and children express the real component boundary

Props and children form the component's public TypeScript API. A broad approximation or unintended breadth
in that API fails the scenario.

#### Checklist

- [ ] RTSX-CK-STRUCTURE-01-01 — Every file containing JSX uses the project-supported `.tsx` file extension.
- [ ] RTSX-CK-STRUCTURE-01-02 — Each public component has a props object that describes every caller-visible input.
- [ ] RTSX-CK-STRUCTURE-01-03 — Renderable children use the installed `ReactNode` type only when that breadth is intended.
- [ ] RTSX-CK-STRUCTURE-01-04 — Element-only children use the installed `ReactElement` type only when primitives are invalid.

### RTSX-SC-STRUCTURE-02 — Normal case: Hook, ref, and JSX-facing values use installed React types

State, callbacks, refs, events, nodes, elements, and styles have installed React definitions. A handwritten
approximation, a redundant type argument, or a ref type that hides absence or its exact target element or
value type fails.

#### Checklist

- [ ] RTSX-CK-STRUCTURE-02-01 — A Hook type argument is added only when inference does not express the complete state or callback type.
- [ ] RTSX-CK-STRUCTURE-02-02 — Each ref type includes its applicable absent state.
- [ ] RTSX-CK-STRUCTURE-02-03 — Each ref type names its exact target element or value.
- [ ] RTSX-CK-STRUCTURE-02-04 — Each JSX-facing event, ref, node, element, or style value uses installed React definitions rather than a handwritten approximation.

### RTSX-SC-STRUCTURE-03 — Rule violation: A type claims an invariant JSX cannot enforce

The JSX type system cannot restrict children to one component type. An annotation written as if it can states
a guarantee the compiler never checks and fails the scenario.

#### Checklist

- [ ] RTSX-CK-STRUCTURE-03-01 — No TypeScript annotation claims to restrict children to a component type that the JSX type system cannot enforce.

## Performance

Not applicable: TypeScript erases at runtime; React performance and compiler behavior belong to the design,
compiler, framework, and measurement skills.

## Aesthetics

### RTSX-SC-AESTHETICS-01 — Poor quality: Type syntax hides the React interface

A component type should help callers understand the public API without repeating inference or exposing
unrelated generic machinery. Unnecessary annotations or opaque broad aliases fail.

#### Checklist

- [ ] RTSX-CK-AESTHETICS-01-01 — Explicit React annotations clarify a public, extracted, nullable, or otherwise incomplete inference boundary.
- [ ] RTSX-CK-AESTHETICS-01-02 — Generic TypeScript detail remains with the `typescript` skill instead of being restated in the React guidance.

## Usage

### RTSX-SC-USAGE-01 — Normal case: Callers and handlers receive usable types

Component callers, event handlers, and ref consumers should receive the exact values the interface permits.
Wrong element events, unusable children, or false non-null guarantees fail.

#### Checklist

- [ ] RTSX-CK-USAGE-01-01 — Each component call accepts every supported prop combination.
- [ ] RTSX-CK-USAGE-01-02 — Each component call rejects an invalid prop combination through its generic TypeScript model.
- [ ] RTSX-CK-USAGE-01-03 — Each extracted event handler uses the exact element-specific installed React event or handler type.
- [ ] RTSX-CK-USAGE-01-04 — Each handler reads `currentTarget` when it needs the element whose handler is executing.
- [ ] RTSX-CK-USAGE-01-05 — Each ref consumer handles absence wherever the lifecycle permits it.

### RTSX-SC-USAGE-02 — Expected failure: A type check fails on the affected source

The focused type check reports an error on the affected React source or test. The repair belongs to the props,
state, event, ref, boundary value, or configuration that contains the mismatch; clearing the error without
repairing that source fails the scenario.

#### Checklist

- [ ] RTSX-CK-USAGE-02-01 — Each type failure is repaired in the props, state, event, ref, boundary value, or project configuration that contains the mismatch.
- Also applies: RTSX-CK-OVERALL-01-02 (a bypass does not stand in for the repair).

## Consistency

### RTSX-SC-CONSISTENCY-01 — Edge case: Framework, JSX, and installed definitions change the types

The same source can type differently under another JSX mode, React version, or framework-generated types.
Build, editor, test, and documentation disagreement fails.

#### Checklist

- [ ] RTSX-CK-CONSISTENCY-01-01 — Framework-generated or renderer-specific types are applied where the installed framework or renderer narrows the generic React types.
- [ ] RTSX-CK-CONSISTENCY-01-02 — The focused type check and affected build resolve the same React and JSX definitions.
- [ ] RTSX-CK-CONSISTENCY-01-03 — Source and documentation examples compile under the installed project configuration.
- [ ] RTSX-CK-CONSISTENCY-01-04 — Version-sensitive ref and JSX patterns match the exact installed React version.

## Risk

### RTSX-SC-RISK-01 — Adversarial: A type assertion replaces runtime proof

Type annotations disappear at runtime and cannot validate client, server, IPC, storage, or network data. A
cast or annotation used as trust-boundary validation fails.

#### Checklist

- [ ] RTSX-CK-RISK-01-01 — Every untrusted runtime value is validated before it enters a typed React public API.
- [ ] RTSX-CK-RISK-01-02 — Each cast or non-null assertion has external runtime evidence for the invariant it claims.

## Overall

### RTSX-SC-OVERALL-01 — Adversarial: A green type check hides the wrong public API

Code can compile while a broad prop, child, event, or ref type permits behavior the component cannot handle.
The public type API must match the accepted runtime behavior.

#### Checklist

- [ ] RTSX-CK-OVERALL-01-01 — The React public type API permits exactly the accepted caller-visible behavior.
- [ ] RTSX-CK-OVERALL-01-02 — No `any`, broad cast, or copied declaration bypasses the installed React types.
