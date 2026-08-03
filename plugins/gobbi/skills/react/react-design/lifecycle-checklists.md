# React Design Lifecycle Checklist

Use this unchecked supplemental `react-design` source with the base [React Design
Checklist](checklists.md) and general `evaluation`. It covers binding lifecycle obligations that are not
defined in the saturated base source; `RDES` remains the stable checklist prefix.

## Project

### RDES-SC-PROJECT-03 — Normal case: The design context is bound before React choices

React design starts from a complete, located, and authorized context. Missing people, boundaries, evidence,
or record ownership makes later design choices unsupported and fails the scenario.

#### Checklist

- [ ] RDES-CK-PROJECT-03-01 — Step 1.1 records the affected people.
- [ ] RDES-CK-PROJECT-03-02 — Step 1.1 records the included React design questions and explicit exclusions.
- [ ] RDES-CK-PROJECT-03-03 — Step 1.1 records the accepted design authority.
- [ ] RDES-CK-PROJECT-03-04 — Step 1.1 records the project-native design-record location.
- [ ] RDES-CK-PROJECT-03-05 — Step 1.1 continues only after the React component-design boundary is clear.
- [ ] RDES-CK-PROJECT-03-06 — The evidence register names each source, applicability and limits, current behavior, preserved patterns, conflicts, and constrained React decisions.

### RDES-SC-PROJECT-04 — Expected failure: Context or evidence cannot support design

Missing authority or conflicting evidence must stop invention and unsupported alternatives. Continuing into
component design without returning the gap to its owner fails the scenario.

#### Checklist

- [ ] RDES-CK-PROJECT-04-01 — Missing outcome, authority, or record location is requested instead of invented.
- [ ] RDES-CK-PROJECT-04-02 — A material evidence conflict or missing application decision returns to the user or named application skill.
- [ ] RDES-CK-PROJECT-04-03 — Phase 2 starts only when evidence supports credible React alternatives.

## Structure

### RDES-SC-STRUCTURE-05 — Rule violation: Component design skips its structural foundation

The hierarchy, skeleton, interfaces, and data flow must precede behavior while render remains pure. A design
that skips one of those foundations or derives render data through an Effect fails the scenario.

#### Checklist

- [ ] RDES-CK-STRUCTURE-05-01 — Components and Hooks remain pure, and render causes no side effect.
- [ ] RDES-CK-STRUCTURE-05-02 — No Effect derives render data.
- [ ] RDES-CK-STRUCTURE-05-03 — The component hierarchy is mapped top-down.
- [ ] RDES-CK-STRUCTURE-05-04 — A static implementation skeleton is defined before interactivity.
- [ ] RDES-CK-STRUCTURE-05-05 — The props-and-events table states each unit's responsibility, inputs, supplied structure, emitted event, and consumer.
- [ ] RDES-CK-STRUCTURE-05-06 — One-way data and event flow is explicit.

### RDES-SC-STRUCTURE-06 — Normal case: Failure-boundary ownership is explicit

The design decides whether a boundary exists and limits any included boundary to the recoverable subtree it
owns. An omitted decision, overbroad boundary, or boundary without observable recovery fails the scenario.

#### Checklist

- [ ] RDES-CK-STRUCTURE-06-01 — Error Boundary inclusion or exclusion is explicit.
- [ ] RDES-CK-STRUCTURE-06-02 — Each included Error Boundary owns the smallest recoverable subtree.
- [ ] RDES-CK-STRUCTURE-06-03 — Each included Error Boundary has an observable recovery path.

## Performance

### RDES-SC-PERFORMANCE-03 — Poor quality: Prototype work exceeds its evidence purpose

A prototype exists only to resolve an identified design gap and records the limits of what it can prove.
Unneeded construction, missing inspection, or unrecorded measurement limits fails the scenario.

#### Checklist

- [ ] RDES-CK-PERFORMANCE-03-01 — Step 3.2 runs only for uncertain behavior, unresolved evidence, or a material conflict.
- [ ] RDES-CK-PERFORMANCE-03-02 — A static implementation or bounded prototype is built only when an evidence gap requires it.
- [ ] RDES-CK-PERFORMANCE-03-03 — Each prototype is inspected with project tools.
- [ ] RDES-CK-PERFORMANCE-03-04 — Render behavior is measured when the performance plan requires it.
- [ ] RDES-CK-PERFORMANCE-03-05 — The scenario/design record states prototype limits, observations, measurements, and explicit user decisions.

## Aesthetics

### RDES-SC-AESTHETICS-02 — Normal case: Material choices expose their rationale

Each material React choice should show credible options, their costs, and the accepted direction. A polished
choice with hidden trade-offs, no recommendation, or an incomplete decision record fails the scenario.

#### Checklist

- [ ] RDES-CK-AESTHETICS-02-01 — Each credible alternative has explicit trade-offs.
- [ ] RDES-CK-AESTHETICS-02-02 — The design record gives a recommendation for each material choice.
- [ ] RDES-CK-AESTHETICS-02-03 — The decision record contains the accepted alternative, supporting references, rejected alternatives and trade-offs, the user decision, and any constraint leaving one credible option.

## Usage

### RDES-SC-USAGE-03 — Normal case: The acceptance walk covers observable behavior

The acceptance walk must cover each applicable state and trace its expected behavior through the design maps.
A missing state, map, result, or assumption makes the walk incomplete and fails the scenario.

#### Checklist

- [ ] RDES-CK-USAGE-03-01 — The scenario walk covers applicable normal, loading, empty, failure, recovery, preservation, reset, accessibility, and performance-sensitive cases.
- [ ] RDES-CK-USAGE-03-02 — Each scenario is traced through the applicable component, state, Effect, identity, failure, and host maps.
- [ ] RDES-CK-USAGE-03-03 — Each scenario record contains its expected observable result, applicable design decisions, pass/fail self-validation result, and remaining assumptions.

### RDES-SC-USAGE-04 — Expected failure: A scenario exposes an earlier design defect

A failed scenario must reopen the first design decision responsible for the failure. Treating the scenario as
an isolated validation defect leaves the design inconsistent and fails the scenario.

#### Checklist

- [ ] RDES-CK-USAGE-04-01 — Each failed scenario returns to its earliest design step.

## Consistency

### RDES-SC-CONSISTENCY-03 — Rule violation: Lifecycle gates or handoff evidence disagree

Each phase gate and the final handoff must describe the same validated design state. Advancing early or
handing off conflicting records fails the scenario.

#### Checklist

- [ ] RDES-CK-CONSISTENCY-03-01 — Phase 3 starts only after every React behavior has a defined result or named application skill.
- [ ] RDES-CK-CONSISTENCY-03-02 — Phase 4 starts only after the complete React design self-validates and required user decisions are resolved.
- [ ] RDES-CK-CONSISTENCY-03-03 — Handoff citations, design record, prototype limits, and scenario results agree.

## Risk

### RDES-SC-RISK-02 — Expected failure: The skeleton exposes an unresolved material choice

A static skeleton can reveal a structural decision that the earlier alternatives did not settle. Continuing
without returning that choice to the user creates unapproved architecture and fails the scenario.

#### Checklist

- [ ] RDES-CK-RISK-02-01 — A material structural choice exposed by the skeleton returns to alternatives and user choice.

## Overall

### RDES-SC-OVERALL-03 — Normal case: The validated design reaches the correct owners

Handoff requires complete current design evidence and exact routing of every remaining application claim.
Missing prerequisites or a claim assigned to the wrong owner fails the scenario.

#### Checklist

- [ ] RDES-CK-OVERALL-03-01 — Handoff requires an accepted design, completed scenario walk, resolved material conflicts, and current design evidence.
- [ ] RDES-CK-OVERALL-03-02 — The routing record assigns remaining application claims exactly: integration and release readiness to `web-feature`; production build, deployment, live verification, and rollback to `web-deployment`; production logs, metrics, traces, crashes, errors, and destination feedback to `web-observability`; complete installed outcomes to `desktop-delivery`; desktop target, data, update, and release judgments to `desktop-release`; Electron platform changes to `electron-development`; Electron process, security, lifecycle, native, and packaged-runtime evidence to `electron-testing`; and packaging, signing, notarization, and update rehearsal to `electron-release`.
