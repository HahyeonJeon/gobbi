---
name: react-testing
description: "MUST load when creating, revising, or reviewing React tests or selecting React-specific component or Hook test evidence."
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
---

# React Testing

Use this operation to turn one accepted React behavior or defined test review into reliable test evidence
through the project's installed browser or Electron renderer stack.

This child owns React-specific test design, rendered interaction, asynchronous settling, assertions,
diagnosis, and handoff. The project runner, generic TypeScript tests, server integration, and Electron launch
or packaged-artifact checks remain with their owners.

The installed stack is the default. A dependency addition, renderer migration, or new test layer requires
separate authority.

## Principles

### Prove behavior through the user surface

A stable component test drives what a user can perceive and operate rather than component instances or
private state. Its confidence should survive an internal refactor that preserves behavior.

### Test with the installed contract

React, renderer, query library, runner, environment, and host versions determine which helpers and behavior
are available. Inspect them instead of assuming a fashionable stack.

### Let asynchronous work settle honestly

An assertion is meaningful only after the interaction and resulting React work have completed. Await the
user interaction and the observable state rather than sleeping or suppressing scheduling warnings.

### Use the lowest sufficient layer

A component test proves rendered behavior, while server, preload, IPC, navigation, and packaged-runtime
properties require their owning integration layer. Do not make a simulated DOM claim evidence it cannot see.

## Rules

- **MUST begin with an accepted behavior contract or a defined read-only test review.** Record the observable
  outcome, active states, environment, installed test stack, authority, and commands.

- **MUST test rendered behavior instead of React internals.** Query and operate the surface a user reaches,
  and assert output, focus, accessible state, or an approved host effect rather than component instances,
  private state, or implementation call order.

- **MUST use the renderer path supported by the installed React line.** For an installed React 19 line or an
  explicitly approved React 19 migration, apply the removed and deprecated API guidance in the
  [React 19 upgrade guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide); do not treat that
  guidance as migration authority for another installed line.

- **MUST await asynchronous interactions and React work.** Prefer helpers already wrapped with
  [`act`](https://react.dev/reference/react/act); when direct `act` is necessary, use the import and form
  supported by the installed React and renderer contract.

- **MUST preserve the configured runner and test architecture unless the accepted task changes them.** Do not
  install React Testing Library, change a runner, or migrate a suite without explicit authority.

- **MUST route evidence to the layer that can observe it.** Use framework, server, Electron, browser,
  accessibility, and language test owners for properties outside a rendered React unit.

## Procedure

### Phase 1 — Establish the Test Contract

#### 1.1 Inspect behavior and the installed stack

- Read the accepted behavior or review target, affected source and tests, manifests, lockfile, test
  configuration, setup files, renderer, query layer, environment, host, and available commands.
- Record the user-visible success, pending, empty, failure, recovery, preservation, and reset states activated
  by the change.
- Stop when the required behavior, environment, dependency authority, or executable test command is missing.

#### 1.2 Select the evidence layer

- Use a rendered component or Hook test for behavior observable in the configured renderer.
- Use the project integration or end-to-end layer for routing, real browser behavior, server boundaries,
  preload or IPC, and packaged Electron behavior.
- Prefer an installed Testing Library path when available. For a separately approved new browser-component
  stack, prefer React Testing Library because its helpers operate on DOM nodes and encourage user-facing
  tests under its [guiding principles](https://testing-library.com/docs/guiding-principles/).

### Phase 2 — Build or Review the Test

#### 2.1 Establish the behavior skeleton

- Arrange only the inputs, providers, and boundary substitutes needed to reach the behavior.
- Render through the project's normal helper, create one
  [`userEvent.setup()`](https://testing-library.com/docs/user-event/intro/) session when that library is
  installed, and identify the initial observable state.
- In review mode, trace the existing test without editing and record which behavior each setup element
  enables.

#### 2.2 Drive and observe the outcome

- Prefer role and accessible-name queries under Testing Library's
  [query priority](https://testing-library.com/docs/queries/about/); use a test ID only when no user-facing
  query represents the approved surface.
- Await supported user interactions. Use `findBy` for expected asynchronous appearance and reserve `waitFor`
  for an assertion that must retry under the
  [async utility contract](https://testing-library.com/docs/dom-testing-library/api-async/).
- Under an installed React 19 line or explicitly approved React 19 migration, import direct `act` from
  `react` and use its asynchronous form in a configured environment.
- Assert one coherent behavior and its relevant failure or recovery. Avoid direct `act`, manual event
  dispatch, fake time, or mocks unless the installed stack and boundary require them.

### Phase 3 — Verify and Hand Off

#### 3.1 Run and challenge the evidence

- Run the narrow test, then the affected suite and required type, lint, build, browser, server, or host gates.
- Exercise the test against a representative defect or inspect its failure signal so a cosmetic pass cannot
  masquerade as behavioral evidence.
- Complete [React Testing Checklist](checklists.md) and record every unavailable or skipped gate as a gap.

#### 3.2 Repair and complete

- Trace a failure or flaky result to the earliest wrong behavior contract, evidence layer, environment,
  setup, interaction, wait, query, assertion, or production seam.
- Repair the owning cause and rerun the narrow test plus affected downstream gates; never add sleeps,
  blanket warning suppression, or implementation-detail assertions to force a pass.
- Return the tests or review findings, commands and results, layer limitations, remaining gaps, and risks
  without changing dependencies, architecture, or publication outside the accepted scope.

## References

- [React Testing Checklist](checklists.md)
