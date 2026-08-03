# React Development Checklist

Use this unchecked `react-development` source with general Evaluation for every React implementation; `RDEV`
is the stable checklist prefix. Complete the checklist of every active React sibling as well.

## Project

### RDEV-SC-PROJECT-01 — Normal case: The task and project setting are established

Implementation should begin from an accepted outcome, React design, and installed project rather than a
guessed API, renderer, or authority boundary. Missing scope, design, or configuration fails the scenario.

#### Checklist

- [ ] RDEV-CK-PROJECT-01-01 — The task states its observable outcome, accepted scope, available authority, material constraints, and completion evidence.
- [ ] RDEV-CK-PROJECT-01-02 — Project files establish the target renderer, installed React and renderer versions, active framework capabilities, affected source language, rendering architecture, and applicable verification commands.
- [ ] RDEV-CK-PROJECT-01-03 — Every applicable React child trigger is recorded before implementation design begins.

### RDEV-SC-PROJECT-02 — Expected failure: The work reaches a condition it cannot decide

A required capability, authority, design, or item of evidence is missing, or implementation exposes a material
choice outside the accepted task. The work should stop and request the responsible decision; supplying the
answer itself fails the scenario.

#### Checklist

- [ ] RDEV-CK-PROJECT-02-01 — The work stops when a required capability or authority is not established.
- [ ] RDEV-CK-PROJECT-02-02 — The work names the missing evidence or user decision when a required capability or authority is not established.
- [ ] RDEV-CK-PROJECT-02-03 — The work pauses at each material design choice outside the accepted task instead of deciding it.
- [ ] RDEV-CK-PROJECT-02-04 — The work sends each material design choice outside the accepted task to `react-design`.
- [ ] RDEV-CK-PROJECT-02-05 — No unestablished React capability, framework feature, or authority is assumed to exist.
- [ ] RDEV-CK-PROJECT-02-06 — A production finding returns as a new scoped `react-development` task instead of changing the completed local task.

## Structure

### RDEV-SC-STRUCTURE-01 — Normal case: One model connects the complete React behavior

The rendered journey, React units, state, external systems, tests, and runtime boundaries should form one
complete implementation model. An unassigned concern or missing behavior fails the scenario.

#### Checklist

- [ ] RDEV-CK-STRUCTURE-01-01 — The model identifies every affected React function, input boundary, user or system action, affected state owner, affected external system, affected test layer, and affected runtime boundary.
- [ ] RDEV-CK-STRUCTURE-01-02 — Each material React concern is assigned to one active React sibling or application skill.

### RDEV-SC-STRUCTURE-02 — Normal case: The complete skeleton precedes detailed behavior

The implementation should establish the whole component, Hook, state, failure, host, test, type, caller,
configuration, and document structure before filling in detailed behavior. A polished fragment with missing
in-scope structure fails the scenario.

#### Checklist

- [ ] RDEV-CK-STRUCTURE-02-01 — A complete implementation skeleton exists before detailed behavior is added.
- [ ] RDEV-CK-STRUCTURE-02-02 — The skeleton gives every modeled component, Hook, state owner, Error Boundary behavior, and host interface an implementation location.
- [ ] RDEV-CK-STRUCTURE-02-03 — The skeleton represents every affected source, test, type, caller, configuration entry, and document.
- [ ] RDEV-CK-STRUCTURE-02-04 — The skeleton has a rendered or static observation and a recorded construction-check result.

### RDEV-SC-STRUCTURE-03 — Normal case: Small verified slices grow the complete result

Each implementation slice should be the smallest remaining behavior that reaches an observable result. A
slice that adds breadth before its own evidence passes fails the scenario.

#### Checklist

- [ ] RDEV-CK-STRUCTURE-03-01 — Each slice is the smallest remaining behavior increment that reaches an observable rendered result.
- [ ] RDEV-CK-STRUCTURE-03-02 — Each slice has passing focused evidence before the next slice begins.

## Performance

### RDEV-SC-PERFORMANCE-01 — Normal case: Material client-render behavior is measured

A performance hypothesis, observed regression, expensive interaction, or identity-sensitive update should be
measured with a React-aware profiler. An intuition-based optimization or unsupported performance claim fails
the scenario.

#### Checklist

- [ ] RDEV-CK-PERFORMANCE-01-01 — Each material performance trigger names the interaction and component tree it concerns.
- [ ] RDEV-CK-PERFORMANCE-01-02 — The selected React Developer Tools Profiler or `Profiler` measurement can observe the stated render behavior.
- [ ] RDEV-CK-PERFORMANCE-01-03 — Each measurement records its environment, metric, baseline, and comparison method.
- [ ] RDEV-CK-PERFORMANCE-01-04 — Each reported measurement comes from the exact final tree.
- [ ] RDEV-CK-PERFORMANCE-01-05 — Every React performance conclusion matches its recorded measurement.

## Aesthetics

### RDEV-SC-AESTHETICS-01 — Poor quality: The handoff hides the completed journey

The returned change should let a cold reader identify the outcome, changed files, evidence, gaps, and risks.
An opaque summary fails even when the implementation works.

#### Checklist

- [ ] RDEV-CK-AESTHETICS-01-01 — The handoff plainly states the outcome, changed files, verification commands, each command result, limitations, evidence gaps, and remaining risks.

## Usage

### RDEV-SC-USAGE-01 — Normal case: The rendered outcome completes

The accepted user journey should be observable through its normal and activated alternative states. A blank,
trapped, falsely successful, or source-only result fails the scenario.

#### Checklist

- [ ] RDEV-CK-USAGE-01-01 — Rendered-interface exercise covers the accepted primary behavior.
- [ ] RDEV-CK-USAGE-01-02 — Each applicable pending, empty, and failure state is observable.
- [ ] RDEV-CK-USAGE-01-03 — Each permitted recovery returns the user to a usable state.

### RDEV-SC-USAGE-02 — Edge case: Component identity preserves or resets state deliberately

A reorder, changed key, conditional branch, or moved component can preserve or reset state. Accidental state
loss or accidental retention fails the scenario.

#### Checklist

- [ ] RDEV-CK-USAGE-02-01 — Each state value whose accepted identity remains stable is preserved through the change.
- [ ] RDEV-CK-USAGE-02-02 — Each state value whose accepted identity changes is reset through the change.

## Consistency

### RDEV-SC-CONSISTENCY-01 — Rule violation: The final tree and evidence disagree

Source, tests, types, documents, consumers, and reported checks should describe the same final behavior. A
stale dependent file or result from an earlier tree fails the scenario.

#### Checklist

- [ ] RDEV-CK-CONSISTENCY-01-01 — Source, tests, types, documents, and affected consumers each match the final behavior.
- [ ] RDEV-CK-CONSISTENCY-01-02 — Every reported command result was produced from the exact final tree.
- [ ] RDEV-CK-CONSISTENCY-01-03 — Every active sibling checklist is complete.
- [ ] RDEV-CK-CONSISTENCY-01-04 — Every not-applicable checklist result states its reason.

### RDEV-SC-CONSISTENCY-02 — Expected failure: Verification exposes an implementation defect

A failed rendered scenario, command, or measurement should lead to the earliest incorrect decision or unit.
Suppressing the symptom or rerunning only the original failure fails the scenario.

#### Checklist

- [ ] RDEV-CK-CONSISTENCY-02-01 — Each failure is traced to its earliest incorrect design decision, model, skeleton unit, or implementation unit.
- [ ] RDEV-CK-CONSISTENCY-02-02 — Each root-cause repair updates the complete affected set.
- [ ] RDEV-CK-CONSISTENCY-02-03 — The narrow check that exposed a repaired failure is rerun after the repair.
- [ ] RDEV-CK-CONSISTENCY-02-04 — Every downstream check affected by a repair is rerun after the narrow check passes.

## Risk

### RDEV-SC-RISK-01 — Rule violation: A change exceeds its accepted authority

A React change must stay inside its accepted scope and local implementation authority. An implicit dependency,
migration, architecture change, publication action, observable scope expansion, or use of React Development
for independent read-only review fails the scenario.

#### Checklist

- [ ] RDEV-CK-RISK-01-01 — The change introduces no unapproved dependency, migration, architecture change, publication action, or observable scope expansion.
- [ ] RDEV-CK-RISK-01-02 — Independent read-only review is handed to Evaluation instead of being performed inside React Development.

### RDEV-SC-RISK-02 — Normal case: Privileged capability remains behind an approved interface

An ordinary React change may need browser, framework, Electron, or server capability. It should reach each
capability only through its typed, approved interface; direct privileged access from React fails the scenario.

#### Checklist

- [ ] RDEV-CK-RISK-02-01 — Every privileged capability remains behind its typed, approved interface.
- [ ] RDEV-CK-RISK-02-02 — Electron renderer code reaches Node and IPC only through the typed preload bridge.

## Overall

### RDEV-SC-OVERALL-01 — Adversarial: Cosmetic success hides incomplete work

A change can look complete while skipping a failed check, leaving modeled behavior unfinished, or omitting a
lifecycle phase. Any such cosmetic completion fails regardless of source appearance.

#### Checklist

- [ ] RDEV-CK-OVERALL-01-01 — Every required verification check is reported with its actual result.
- [ ] RDEV-CK-OVERALL-01-02 — Every in-scope behavior reaches observable completion, a permitted recovery, or an explicit stop condition.
- [ ] RDEV-CK-OVERALL-01-03 — The completion record contains evidence for Study, Design, Build, Verify, and Handoff.

### RDEV-SC-OVERALL-02 — Normal case: Browser and desktop application work has exact handoffs

React-local completion should name the application skill responsible for every broader claim. Assigning an
application outcome to React Development or omitting the responsible skill fails the scenario.

#### Checklist

- [ ] RDEV-CK-OVERALL-02-01 — Complete browser journeys are handed to `web-frontend`.
- [ ] RDEV-CK-OVERALL-02-02 — Cross-layer integration and release readiness are handed to `web-feature`.
- [ ] RDEV-CK-OVERALL-02-03 — Production build, deployment, live verification, and rollback are handed to `web-deployment`.
- [ ] RDEV-CK-OVERALL-02-04 — Production log, metric, trace, crash, and error emission plus destination feedback are handed to `web-observability`.
- [ ] RDEV-CK-OVERALL-02-05 — Complete installed outcomes are handed to `desktop-delivery`.
- [ ] RDEV-CK-OVERALL-02-06 — Desktop target, data, update, and release judgments are handed to `desktop-release`.

### RDEV-SC-OVERALL-03 — Rule violation: Downstream evidence is claimed as React-local completion

Electron mechanisms, React sibling migrations, independent judgment, and publication require their named
skills or authority. Claiming any of them from local React implementation fails the scenario.

#### Checklist

- [ ] RDEV-CK-OVERALL-03-01 — Electron platform changes are handed to `electron-development`.
- [ ] RDEV-CK-OVERALL-03-02 — Electron process, security, lifecycle, native, and packaged-runtime evidence is handed to `electron-testing`.
- [ ] RDEV-CK-OVERALL-03-03 — Packaging, signing, notarization, and update rehearsal are handed to `electron-release`.
- [ ] RDEV-CK-OVERALL-03-04 — Compiler, server, TypeScript, and test migrations are handed to `react-compiler`, `react-server`, `react-typescript`, and `react-testing` respectively.
- [ ] RDEV-CK-OVERALL-03-05 — Independent judgment is handed to Evaluation.
- [ ] RDEV-CK-OVERALL-03-06 — Publication requires separate explicit authority after React-local completion.
