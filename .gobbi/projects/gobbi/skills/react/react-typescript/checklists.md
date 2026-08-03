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
- [ ] RTSX-CK-PROJECT-01-04 — Before this Manual is applied, project records name the exact renderer, framework, and installed React type-definition versions, every source extension, and every generated type file used by the affected compilation.
- [ ] RTSX-CK-PROJECT-01-05 — DOM declarations appear only for browser or Electron renderer code that uses DOM types.
- [ ] RTSX-CK-PROJECT-01-06 — The focused type check uses the same TypeScript configuration that builds the affected source.

### RTSX-SC-PROJECT-02 — Rule violation: Server-only or shared targets use the wrong host libraries

Server-only and shared TypeScript targets should use their actual host library declarations. Including DOM
declarations merely because another target renders React broadens the type surface and fails the scenario.

#### Checklist

- [ ] RTSX-CK-PROJECT-02-01 — Server-only and shared targets use their actual host libraries.

## Structure

### RTSX-SC-STRUCTURE-01 — Normal case: Props and children express the real component boundary

Props and children define the TypeScript contract between each component and its callers. A public or private
component type that omits or broadens a caller-provided input fails the scenario.

#### Checklist

- [ ] RTSX-CK-STRUCTURE-01-01 — Each TypeScript source file that contains JSX and uses the project's supported JSX compiler mode has a `.tsx` extension.
- [ ] RTSX-CK-STRUCTURE-01-02 — Each public component has a props object that describes every caller-visible input.
- [ ] RTSX-CK-STRUCTURE-01-03 — Renderable children use the installed `ReactNode` type only when that breadth is intended.
- [ ] RTSX-CK-STRUCTURE-01-04 — Element-only children use the installed `ReactElement` type only when primitives are invalid.
- [ ] RTSX-CK-STRUCTURE-01-05 — Project-authorized `.js` and `.jsx` source files remain valid in mixed-language projects.
- [ ] RTSX-CK-STRUCTURE-01-06 — Each private component that accepts props has an inferred or explicit props object type describing every caller-provided input.

### RTSX-SC-STRUCTURE-02 — Normal case: Hook, ref, and JSX-facing values use installed React types

State, callbacks, refs, events, nodes, elements, and styles have installed React definitions. A handwritten
approximation, a redundant type argument, or a ref type that hides absence or its exact target element or
value type fails. Reading or writing a ref during render also fails.

#### Checklist

- [ ] RTSX-CK-STRUCTURE-02-01 — A Hook type argument is added only when inference does not express the complete state or callback type.
- [ ] RTSX-CK-STRUCTURE-02-02 — Each ref type includes its applicable absent state.
- [ ] RTSX-CK-STRUCTURE-02-03 — Each ref type names its exact target element or value.
- [ ] RTSX-CK-STRUCTURE-02-04 — Each JSX-facing event, ref, node, element, or style value uses installed React definitions rather than a handwritten approximation.
- [ ] RTSX-CK-STRUCTURE-02-05 — No component reads a ref's current value during render.
- [ ] RTSX-CK-STRUCTURE-02-06 — No component writes a ref's current value during render.

### RTSX-SC-STRUCTURE-03 — Rule violation: A type claims an invariant JSX cannot enforce

The JSX type system cannot restrict children to one component type. An annotation written as if it can states
a guarantee the compiler never checks and fails the scenario.

#### Checklist

- [ ] RTSX-CK-STRUCTURE-03-01 — No TypeScript annotation claims to restrict children to a component type that the JSX type system cannot enforce.
- [ ] RTSX-CK-STRUCTURE-03-02 — An exact child-structure requirement is enforced through a narrower prop, composition API, or runtime behavior rather than a TypeScript annotation that JSX cannot enforce.

### RTSX-SC-STRUCTURE-04 — Rule violation: Reducer and Hook annotations hide invalid behavior

Reducer state and actions need an explicit typed boundary, and Hook annotations cannot repair invalid call
placement or naming. A missing reducer variant or an annotation that masks an invalid Hook fails.

#### Checklist

- [ ] RTSX-CK-STRUCTURE-04-01 — Reducer state and actions are typed at the reducer boundary.
- [ ] RTSX-CK-STRUCTURE-04-02 — Every reducer action variant is handled exhaustively through the `typescript-typing` skill.
- [ ] RTSX-CK-STRUCTURE-04-03 — Hook call placement and custom Hook naming follow `react-design` and `react-conventions`, respectively.
- [ ] RTSX-CK-STRUCTURE-04-04 — No type annotation is treated as validation of an invalid Hook call position or invalid Hook name.

### RTSX-SC-STRUCTURE-05 — Normal case: Style and JSX namespace types follow project decisions

An exposed inline-style object and a JSX-facing value should use the types the project permits and installs.
A disallowed inline-style API or a copied JSX namespace approximation fails.

#### Checklist

- [ ] RTSX-CK-STRUCTURE-05-01 — `React.CSSProperties` types an exposed inline-style object only when the project permits that public API.
- [ ] RTSX-CK-STRUCTURE-05-02 — Each JSX-facing value uses the project's installed JSX namespace definitions.

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
- [ ] RTSX-CK-AESTHETICS-01-03 — Private-component props and inline event callbacks use inference when callers and the handled element still receive their complete types.
- [ ] RTSX-CK-AESTHETICS-01-04 — Project CSS policy follows `css-conventions`, and authored style changes follow `css-development`, rather than React TypeScript annotations.

## Usage

### RTSX-SC-USAGE-01 — Normal case: Callers and handlers receive usable types

Component callers, event handlers, and ref consumers should receive the exact values the interface permits.
Wrong element events, unusable children, or false non-null guarantees fail.

#### Checklist

- [ ] RTSX-CK-USAGE-01-01 — Each component call accepts every supported prop combination.
- [ ] RTSX-CK-USAGE-01-02 — The component prop type rejects every invalid prop combination at each component call.
- [ ] RTSX-CK-USAGE-01-03 — Each extracted event handler uses the exact element-specific installed React event or handler type.
- [ ] RTSX-CK-USAGE-01-04 — Each handler reads `currentTarget` when it needs the element whose handler is executing.
- [ ] RTSX-CK-USAGE-01-05 — Each ref consumer handles absence wherever the lifecycle permits it.

### RTSX-SC-USAGE-02 — Expected failure: A type check fails on the affected source

The focused type check reports an error on the affected React source or test. The repair belongs to the props,
state, event, ref, boundary value, or configuration that contains the mismatch; clearing the error without
repairing that source fails the scenario.

#### Checklist

- [ ] RTSX-CK-USAGE-02-01 — Each type failure is repaired in the props, state, event, ref, boundary value, or project configuration that contains the mismatch.
- [ ] RTSX-CK-USAGE-02-02 — Before a cast is added, the installed declaration and inferred call-site type are inspected.
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
- [ ] RTSX-CK-CONSISTENCY-01-05 — The project's JSX configuration follows every restriction imposed by the installed framework.

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

### RTSX-SC-OVERALL-02 — Normal case: Verification and handoff prove the React type contract

The final result needs compiler, test, build, and handoff evidence that names the exact configuration and
installed definitions. Type-check-only evidence, an unnecessary type-level test, or an incomplete handoff fails.

#### Checklist

- [ ] RTSX-CK-OVERALL-02-01 — The focused type check, affected tests, and affected build all complete successfully.
- [ ] RTSX-CK-OVERALL-02-02 — A type-level test is added only when ordinary component use sites cannot protect the public React type contract.
- [ ] RTSX-CK-OVERALL-02-03 — The handoff records the exact configuration, installed type definitions and declarations, command results, known limitations, and every cast whose runtime proof remains external.
