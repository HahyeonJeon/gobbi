# React TypeScript Checklist

Use this unchecked `react-typescript` source with general `evaluation` when the React root activates the
TypeScript child; `RTSX` is the stable owner prefix.

## Project

### RTSX-SC-PROJECT-01 — Normal case: The installed TypeScript React seam is established

React type decisions should follow the project's TypeScript, React, renderer, framework, definitions, and
compiler configuration. A copied neighboring-version type or missing type-check command fails.

#### Checklist

- [ ] RTSX-CK-PROJECT-01-01 — Project files establish the installed TypeScript line.
- [ ] RTSX-CK-PROJECT-01-02 — Project files establish the installed React line.
- [ ] RTSX-CK-PROJECT-01-03 — Project files establish the installed renderer.
- [ ] RTSX-CK-PROJECT-01-04 — Project files establish the active framework.
- [ ] RTSX-CK-PROJECT-01-05 — Project files establish the installed React type definitions.
- [ ] RTSX-CK-PROJECT-01-06 — The active JSX mode is recorded.
- [ ] RTSX-CK-PROJECT-01-07 — The active target libraries are recorded.
- [ ] RTSX-CK-PROJECT-01-08 — The active strictness settings are recorded.
- [ ] RTSX-CK-PROJECT-01-09 — The active module configuration is recorded.
- [ ] RTSX-CK-PROJECT-01-10 — The project type-check command covers the affected React source or test.

## Structure

### RTSX-SC-STRUCTURE-01 — Normal case: React-facing types express the real component boundary

Props, children, state, events, refs, and JSX-facing values should use the installed React contract without
hiding invalid states. A broad approximation, missing absence, or unsupported child claim fails.

#### Checklist

- [ ] RTSX-CK-STRUCTURE-01-01 — Every file containing JSX uses the project-supported `.tsx` path.
- [ ] RTSX-CK-STRUCTURE-01-02 — Each public component has a props object that describes every caller-visible input.
- [ ] RTSX-CK-STRUCTURE-01-03 — Renderable children use the installed `ReactNode` contract only when that breadth is intended.
- [ ] RTSX-CK-STRUCTURE-01-04 — Element-only children use the installed `ReactElement` contract only when primitives are invalid.
- [ ] RTSX-CK-STRUCTURE-01-05 — No TypeScript annotation claims to restrict children to a component type that the JSX type system cannot enforce.
- [ ] RTSX-CK-STRUCTURE-01-06 — A Hook type argument is added only when inference does not express the complete state or callback contract.
- [ ] RTSX-CK-STRUCTURE-01-07 — Each ref type includes its applicable absent state.
- [ ] RTSX-CK-STRUCTURE-01-08 — Each ref type names its exact owned target.
- [ ] RTSX-CK-STRUCTURE-01-09 — Each JSX-facing event, ref, node, element, or style value uses installed React definitions rather than a handwritten approximation.

## Performance

Not applicable: TypeScript erases at runtime; React performance and compiler behavior belong to the design,
compiler, framework, and measurement owners.

## Aesthetics

### RTSX-SC-AESTHETICS-01 — Poor quality: Type syntax hides the React interface

A component type should help callers understand the surface without repeating inference or exposing
unrelated generic machinery. Unnecessary annotations or opaque broad aliases fail.

#### Checklist

- [ ] RTSX-CK-AESTHETICS-01-01 — Explicit React annotations clarify a public, extracted, nullable, or otherwise incomplete inference boundary.
- [ ] RTSX-CK-AESTHETICS-01-02 — Generic TypeScript detail remains with the language owner instead of being restated in the React surface.

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

## Consistency

### RTSX-SC-CONSISTENCY-01 — Edge case: Framework, JSX, and installed definitions change the seam

The same source can type differently under another JSX mode, React line, or framework-generated contract.
Build, editor, test, and documentation disagreement fails.

#### Checklist

- [ ] RTSX-CK-CONSISTENCY-01-01 — Framework-generated or renderer-specific types are applied where that owner narrows the generic React contract.
- [ ] RTSX-CK-CONSISTENCY-01-02 — The focused type check and affected build resolve the same React definitions.
- [ ] RTSX-CK-CONSISTENCY-01-03 — The focused type check and affected build resolve the same JSX definitions.
- [ ] RTSX-CK-CONSISTENCY-01-04 — Source examples compile under the installed project configuration.
- [ ] RTSX-CK-CONSISTENCY-01-05 — Documentation examples compile under the installed project configuration.
- [ ] RTSX-CK-CONSISTENCY-01-06 — Version-sensitive ref patterns match the installed React line.
- [ ] RTSX-CK-CONSISTENCY-01-07 — Version-sensitive JSX patterns match the installed React line.

## Risk

### RTSX-SC-RISK-01 — Adversarial: A type assertion replaces runtime proof

Type annotations disappear at runtime and cannot validate client, server, IPC, storage, or network data. A
cast or annotation used as trust-boundary validation fails.

#### Checklist

- [ ] RTSX-CK-RISK-01-01 — Every untrusted runtime value is validated before it enters a typed React surface.
- [ ] RTSX-CK-RISK-01-02 — Each cast or non-null assertion has external runtime evidence for the invariant it claims.

## Overall

### RTSX-SC-OVERALL-01 — Adversarial: A green type check hides the wrong public contract

Code can compile while a broad prop, child, event, or ref type permits behavior the component cannot handle.
The type surface must match the accepted runtime behavior.

#### Checklist

- [ ] RTSX-CK-OVERALL-01-01 — The React type surface permits exactly the accepted caller-visible behavior.
- [ ] RTSX-CK-OVERALL-01-02 — No `any` bypasses the installed React contract.
- [ ] RTSX-CK-OVERALL-01-03 — No broad cast bypasses the installed React contract.
- [ ] RTSX-CK-OVERALL-01-04 — No copied declaration bypasses the installed React contract.
