# React Testing Lifecycle Checklist

Use this unchecked supplemental `react-testing` source with the base [React Testing
Checklist](checklists.md) and general Evaluation. It covers binding lifecycle obligations that are not defined
in the saturated base source; `RTST` remains the stable checklist prefix.

## Project

### RTST-SC-PROJECT-04 — Normal case: The accepted task defines the test mutation boundary

The task should begin from accepted behavior and keep every change inside the test-authoring boundary. An
inferred requirement or product-source change fails the scenario.

#### Checklist

- [ ] RTST-CK-PROJECT-04-01 — Phase 1 takes one accepted React behavior and test-authoring task.
- [ ] RTST-CK-PROJECT-04-02 — The mutation boundary is limited to React component and Hook tests and their test-local setup, fixtures, substitutes, and configuration.
- [ ] RTST-CK-PROJECT-04-03 — Test requirements are not inferred from implementation details.

### RTST-SC-PROJECT-05 — Normal case: Stack inspection makes test design reproducible

Test design requires a complete record of the unchanged implementation and installed stack. Missing inputs,
versions, helpers, commands, or behavior-changing configuration fail the scenario.

#### Checklist

- [ ] RTST-CK-PROJECT-05-01 — The implementation and exact installed test stack are inspected before test design.
- [ ] RTST-CK-PROJECT-05-02 — Stack inspection starts from unchanged repository state.
- [ ] RTST-CK-PROJECT-05-03 — Inspection covers affected source and tests, manifests, lockfile, test configuration, setup files, render helpers, providers, fixtures, substitutes, and host boundary.
- [ ] RTST-CK-PROJECT-05-04 — The installed-stack record states inspected files, exact versions, environment, helpers, commands, current result, and every dependency or configuration item that can change behavior.

### RTST-SC-PROJECT-06 — Expected failure: Required context or stack evidence is missing

Missing task authority or evidence that prevents truthful testing must return to its owner before design.
Continuing through an assumption fails the scenario.

#### Checklist

- [ ] RTST-CK-PROJECT-06-01 — Missing or conflicting behavior, scope, authority, or required evidence stops work.
- [ ] RTST-CK-PROJECT-06-02 — A missing required version, environment, helper, command, or current result stops work before design when it prevents truthful testing.
- [ ] RTST-CK-PROJECT-06-03 — Missing or conflicting behavior, scope, authority, or required evidence is returned to the caller.

## Structure

### RTST-SC-STRUCTURE-04 — Normal case: Every claim has a truthful evidence layer

The claim-to-layer design should make each observation, owner, and evidence limit explicit. A mixed or
unassigned claim fails the scenario.

#### Checklist

- [ ] RTST-CK-STRUCTURE-04-01 — The claim-to-layer table states direct observation, responsible skill, and evidence limit for every claim.
- [ ] RTST-CK-STRUCTURE-04-02 — Each mixed claim is split.
- [ ] RTST-CK-STRUCTURE-04-03 — Each part of a split mixed claim goes to the layer that can observe it.

## Performance

### RTST-SC-PERFORMANCE-02 — Poor quality: Evidence work expands without a deterministic premise

Test work should become deterministic and diagnose its first failure before broader execution. Uncontrolled
cases or wider checks run around an unexplained failure make the evidence inefficient and unreliable.

#### Checklist

- [ ] RTST-CK-PERFORMANCE-02-01 — A nondeterministic case is redesigned or recorded as an evidence gap.
- [ ] RTST-CK-PERFORMANCE-02-02 — The first failing command is diagnosed before wider checks run.

## Aesthetics

### RTST-SC-AESTHETICS-02 — Poor quality: The test skeleton hides isolation defects

A readable skeleton should expose case isolation and cleanup directly. A polished structure that conceals
shared state or incomplete cleanup fails the scenario.

#### Checklist

- [ ] RTST-CK-AESTHETICS-02-01 — The test skeleton contains no unnecessary nesting, hidden shared state, or incomplete cleanup.

## Usage

### RTST-SC-USAGE-03 — Normal case: Each case renders through the project test surface

Each case should enter the component or Hook through the installed project helper. Bypassing that surface
can omit production-relevant setup and fails the scenario.

#### Checklist

- [ ] RTST-CK-USAGE-03-01 — Each case renders through the installed project helper.

## Consistency

### RTST-SC-CONSISTENCY-04 — Normal case: Run evidence remains complete and reproducible

Run should keep its checklist, case evidence, commands, classifications, and reruns aligned. An omitted
result, field, or classified item makes the record incomplete and fails the scenario.

#### Checklist

- [ ] RTST-CK-CONSISTENCY-04-01 — Every applicable checklist row is completed during Run.
- [ ] RTST-CK-CONSISTENCY-04-02 — Per-case evidence records changed test, focused command and result, and observable result proved by each assertion.
- [ ] RTST-CK-CONSISTENCY-04-03 — The Run record states each exact command, exit result, relevant failure output, checklist result, defect challenge, and unavailable, blocked, or skipped evidence gap.
- [ ] RTST-CK-CONSISTENCY-04-04 — Every failure, warning, flaky result, and evidence gap is classified.
- [ ] RTST-CK-CONSISTENCY-04-05 — Each test-defect record includes its classification, root cause, test-local repair, and results from rerunning the narrow test, affected suite, and required wider checks.

### RTST-SC-CONSISTENCY-05 — Expected failure: An incorrect case blocks expansion

A case with an incorrect test mechanic must be repaired at its earliest cause before another case is added.
Expanding around that defect fails the scenario.

#### Checklist

- [ ] RTST-CK-CONSISTENCY-05-01 — The earliest wrong setup, query, interaction, wait, assertion, time control, or cleanup is repaired before expansion.

### RTST-SC-CONSISTENCY-06 — Normal case: Product defects and unresolved results keep branch-specific evidence

Evidence for a product defect must name its product failure evidence and the receiving skill,
`react-development`. The record for each environment gap, unsupported claim, or unresolved flake must be
limited to its exact gap or reason for stopping and matching terminal status. A record that implies test-local
repair for one of these classifications fails the scenario.

#### Checklist

- [ ] RTST-CK-CONSISTENCY-06-01 — Each product-defect record includes product failure evidence and the receiving skill, `react-development`.
- [ ] RTST-CK-CONSISTENCY-06-02 — The record for each environment gap, unsupported claim, or unresolved flake is limited to its exact gap or reason for stopping and matching terminal status, with no test-local repair claim.

### RTST-SC-CONSISTENCY-07 — Normal case: A test-root-cause repair receives complete reruns

A repair inside the tests needs fresh narrow, affected-suite, and wider evidence. Omitting any required
rerun leaves the repaired behavior unproved and fails the scenario.

#### Checklist

- [ ] RTST-CK-CONSISTENCY-07-01 — After a root cause inside the tests is repaired, the narrow test, affected suite, and wider required checks are rerun.

## Risk

### RTST-SC-RISK-03 — Adversarial: A manufactured pass or retry loop hides missing evidence

Mocks and repeated repairs must not turn unsupported behavior into a pass. An unjustified substitute or
continued retry after repeated failure hides the unresolved problem and fails the scenario.

#### Checklist

- [ ] RTST-CK-RISK-03-01 — No unjustified mock is used to obtain a pass.
- [ ] RTST-CK-RISK-03-02 — After two or three failed repairs, work stops to reassess design or request context.

## Overall

### RTST-SC-OVERALL-04 — Normal case: Handoff returns one exact terminal status

The handoff should express one unambiguous result whose status matches the completed work and remaining
constraint. Multiple statuses or weakened meanings fail the scenario.

#### Checklist

- [ ] RTST-CK-OVERALL-04-01 — Handoff returns exactly one terminal status.
- [ ] RTST-CK-OVERALL-04-02 — Terminal status semantics are exact: `DONE` only when all required test work and checks pass; `DONE_WITH_CONCERNS` only when tests are complete with named risks or gaps; `NEEDS_CONTEXT` only when a missing decision or requirement prevents correct work; `BLOCKED` only when a required command, environment, or dependency prevents completion.

### RTST-SC-OVERALL-05 — Rule violation: Handoff overstates routed evidence

The handoff may route evidence to another owner without proving that evidence. Reporting routed work as
completed overstates the React Testing result and fails the scenario.

#### Checklist

- [ ] RTST-CK-OVERALL-05-01 — The handoff does not report routed evidence as completed.
