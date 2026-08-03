---
name: react-testing
description: "MUST load when creating or revising React component or Hook tests."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# React Testing

Use this implementation operation to create or revise React component and Hook tests through a concrete
Study → Design → Build → Run → Handoff lifecycle. It converts accepted behavior into verified test changes
for a browser application or Electron renderer.

This child changes only React component and Hook tests and self-verifies them. Route independent read-only
judgment to [`Evaluation`](../../evaluation/SKILL.md). Route real-browser, application-system, Electron process,
native, and packaged-application evidence to the named testing skills in the procedure.

Use the project's installed runner, renderer, helpers, and conventions by default. React Native requires
project-specific guidance, and dependency or test-architecture migration requires separate authority.

## Principles

### Prove behavior through the rendered UI

Drive and observe what a person can perceive or operate. A useful test survives an internal refactor that
preserves the accepted behavior.

### Use the installed test stack

Exact React, renderer, runner, query-library, environment, and helper versions determine the supported APIs.
Inspect them before designing or writing tests.

### Choose the lowest truthful test layer

A component or Hook test proves only what its configured renderer can observe. Route every other claim to a
test that can observe the real system involved.

### Require deterministic failure evidence

A passing test is credible only when a representative defect produces a clear failure. Control asynchronous
work and time explicitly, then repair root causes instead of masking signals.

## Rules

- **MUST begin with accepted behavior and a test-authoring task.** Record scope, authority, cases, risks,
  required evidence, and completion conditions; send independent read-only judgment to
  [`Evaluation`](../../evaluation/SKILL.md).

- **MUST inspect the implementation and exact installed test stack before design.** Observe current behavior
  and keep the runner, renderer, dependencies, and test architecture unchanged unless migration is explicitly
  authorized.

- **MUST design every applicable case and the complete test skeleton before detailed assertions.** Add and
  run one smallest complete behavior case before expanding to the next.

- **MUST use the installed user-facing query, interaction, asynchronous, timer, and React APIs.** Await
  interactions and observable outcomes; do not use component instances, private state, implementation call
  order, real sleeps, warning suppression, or unjustified mocks to obtain a pass.

- **MUST route each claim to a test that can directly observe it.** A simulated renderer never proves a real
  browser, server, Electron process, native integration, security boundary, or packaged application.

- **MUST self-verify and return exact evidence.** Run narrow, affected, and wider required checks in order;
  challenge the failure signal, classify every failure, repair causes inside the tests, rerun affected checks,
  complete the checklist, and never overstate or publish the result.

## Procedure

### Phase 1 — Study

#### 1.1 Bind the test-authoring task

- Input: Take one accepted React behavior, the test-authoring request, the agreed scope, and the caller's
  authority.
- Action: State the observable result and every applicable normal, loading, empty, failure, recovery,
  preservation, reset, keyboard, focus, asynchronous, cleanup, cancellation, stale-result, and adversarial
  case. Record the affected people, risks, required evidence, and excluded work. Send any request for
  independent read-only judgment to [`Evaluation`](../../evaluation/SKILL.md).
- Evidence: Keep a task record that names the behavior, cases, scope, authority, risks, required evidence,
  and completion conditions.
- Recovery: Stop and ask the caller when behavior, scope, authority, or required evidence is missing or
  conflicting. Do not infer a test requirement from implementation details.

#### 1.2 Inspect the implementation and installed test stack

- Input: Use the task record and the unchanged repository state.
- Action: Read the affected source and tests, manifests, lockfile, test configuration, setup files, render
  helpers, providers, fixtures, substitutes, and host boundary. Identify the exact installed React and
  renderer versions, runner, query library, environment, supported test APIs, and available commands. Observe
  the current focused pass or failure when an approved command can run.
- Evidence: Record the inspected files, exact versions, environment, helpers, commands, current result, and
  every dependency or configuration that can change the behavior.
- Recovery: Keep the installed runner and stack unchanged unless the task explicitly authorizes a migration.
  If a required version, environment, helper, command, or current result cannot be established, record the
  evidence gap and stop before design when that gap prevents a truthful test.

### Phase 2 — Design

#### 2.1 Select the lowest truthful test layer

- Input: Use the task record, installed-stack record, and each behavior claim.
- Action: Choose a component or Hook test only when the configured renderer can directly observe the claim.
  Send real-browser, full-application, integration, and end-to-end claims to
  [`web-testing`](../../web/web-testing/SKILL.md). Send Electron process, preload, IPC, security, lifecycle,
  native-integration, packaged-runtime test, and per-operating-system smoke claims to
  [`electron-testing`](../../electron/electron-testing/SKILL.md), which hands packaged evidence forward. Send
  packaging, signing, notarization, update rehearsal, release artifact, and publication handoff claims to
  [`electron-release`](../../electron/electron-release/SKILL.md).
- Evidence: Record a claim-to-layer table that names the direct observation, responsible skill, and evidence
  limit for every claim.
- Recovery: Split a mixed claim and route each part to the layer that can observe it. Do not replace an
  unobservable boundary with a mock and then claim the real boundary passed.

#### 2.2 Design the behavior cases and test mechanics

- Input: Use the applicable behavior cases, claim-to-layer table, installed helpers, and current test style.
- Action: Define the setup, providers, fixtures, boundary substitutes, render call, queries, interactions,
  assertions, cleanup, command order, and evidence limits before writing detailed test code. For
  behavior-relevant time, name the exact installed fake-clock or fake-timer mechanism, or an injected clock
  dependency. Include each applicable normal, loading, empty, failure, recovery, preservation, reset,
  keyboard, focus, asynchronous, cleanup, cancellation, stale-result, and adversarial case.
- Evidence: Keep a case plan that maps each test name to its setup, trigger, observable result, time control,
  cleanup, command, and evidence limit.
- Recovery: Remove unnecessary setup or substitutes. If a case cannot be controlled and observed
  deterministically with the installed stack, redesign it or record an evidence gap; never add a real sleep.

### Phase 3 — Build

#### 3.1 Establish the complete test skeleton

- Input: Use the case plan and the project's existing test organization.
- Action: Lay out every planned suite and test name before filling detailed behavior logic. Establish the
  shared setup, normal render helper, relevant providers and settings, fixtures, boundary substitutes,
  cleanup, and one [`userEvent.setup()`](https://testing-library.com/docs/user-event/intro/) instance per
  applicable test when `user-event` is installed.
- Evidence: Compare the complete skeleton with the case plan so each accepted case has one visible place
  and every setup element has a stated purpose.
- Recovery: Repair missing cases, unnecessary nesting, hidden shared state, or incomplete cleanup in the
  skeleton before adding detailed assertions.

#### 3.2 Add and run the smallest behavior cases

- Input: Take the approved skeleton, starting with the smallest complete behavior case.
- Action: Render through the installed helper. Prefer semantic role and accessible-name queries under
  [Testing Library's query guidance](https://testing-library.com/docs/queries/about/) when that library is
  installed; use a test ID only when no user-facing query can represent the element. Await supported
  interactions and observable asynchronous outcomes. With Testing Library, use `findBy` for expected
  asynchronous appearance and use `waitFor` only to retry an assertion under its
  [asynchronous-method guidance](https://testing-library.com/docs/dom-testing-library/api-async/). Prefer helpers already
  wrapped with [`act`](https://react.dev/reference/react/act); when direct `act` is necessary, use the import
  and asynchronous form supported by the exact installed React and renderer versions in a configured
  environment. Add one coherent case, run its focused command, and only then add the next case.
- Evidence: Keep the changed test, its focused command and result, and the observable result that each
  assertion proves. When the installed version is React 19, confirm removed or deprecated test APIs against
  the [React 19 upgrade guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide).
- Recovery: Fix the earliest wrong setup, query, interaction, wait, assertion, time control, or cleanup before
  expanding. Do not use component instances, private state, implementation call order, real sleeps, warning
  suppression, or unjustified mocks to obtain a pass.

### Phase 4 — Run

#### 4.1 Run the evidence sequence and challenge the failure signal

- Input: Use the completed tests, focused command results, required project checks, and
  [React Testing Checklist](checklists.md).
- Action: Run the narrow test, then the smallest affected suite, then each wider required check in that
  order. Exercise a representative behavior defect or inspect the direct failure signal. Complete every
  applicable checklist row.
- Evidence: Record each exact command, exit result, relevant failure output, checklist result, and defect
  challenge. Record unavailable, blocked, and skipped checks as evidence gaps.
- Recovery: Diagnose the first failing command before running wider checks. Never report an unavailable,
  blocked, skipped, or unchallenged check as passed.

#### 4.2 Classify failures, repair causes inside the tests, and rerun

- Input: Use every failure, warning, flaky result, and evidence gap from Step 4.1.
- Action: Classify each item as a product defect, test defect, environment gap, unsupported claim, or flake.
  Repair the root cause when it is inside the tests, setup, fixtures, substitutes, or test configuration, then
  rerun the narrow test, affected suite, and required wider checks. Send a product-source defect to
  [`react-development`](../react-development/SKILL.md) instead of changing product code under this operation.
- Evidence: Record the classification, root cause, test-local repair, and exact rerun result for each item.
- Recovery: Keep an environment gap, unsupported claim, or unresolved flake visible. After two or three
  failed repairs, stop and reassess the design or request missing context; do not loop on retries or suppress
  the signal.

### Phase 5 — Handoff

#### 5.1 Return the verified test result and route remaining evidence

- Input: Use the changed tests, completed checklist, command results, classifications, and unresolved items.
- Action: Return the changed test files, behavior cases, exact commands and results, exact installed versions
  and environment, real dependencies and substitutes, evidence limits, gaps, flakes, and risks. Route any
  remaining real-browser or full-application evidence to
  [`web-testing`](../../web/web-testing/SKILL.md). Route Electron process, native, packaged-runtime test, and
  per-operating-system smoke evidence to [`electron-testing`](../../electron/electron-testing/SKILL.md), which
  hands packaged evidence forward. Route packaging, signing, notarization, update rehearsal, release
  artifacts, and publication handoff to [`electron-release`](../../electron/electron-release/SKILL.md);
  product-source repair to [`react-development`](../react-development/SKILL.md); and independent read-only judgment to
  [`Evaluation`](../../evaluation/SKILL.md).
- Evidence: Return exactly one status: `DONE` when all required test work and checks pass;
  `DONE_WITH_CONCERNS` when the tests are complete but named risks or evidence gaps remain; `NEEDS_CONTEXT`
  when a missing decision or requirement prevents correct work; or `BLOCKED` when a required command,
  environment, or dependency prevents completion.
- Recovery: Correct an incomplete or overstated handoff before returning it. This operation does not publish,
  claim downstream evidence, or perform work assigned to another skill.

## References

- [React Testing Checklist](checklists.md)
