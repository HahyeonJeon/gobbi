# React Testing Checklist

Use this unchecked `react-testing` source for self-verification when the React root activates the testing
child. Use it with general [`Evaluation`](../../evaluation/SKILL.md) only for an independent read-only
judgment. `RTST` is the stable checklist prefix.

A row is defined once beneath its defining scenario. An `Also applies` entry points to a row defined elsewhere
that the scenario reuses.

## Project

### RTST-SC-PROJECT-01 — Normal case: The behavior and installed test setup are established

The test should target one accepted behavior in the renderer, runner, environment, and host the project
actually uses. A guessed stack, missing command, or unauthorized migration fails the scenario.

#### Checklist

- [ ] RTST-CK-PROJECT-01-01 — The test states one observable behavior.
- [ ] RTST-CK-PROJECT-01-02 — The test states every activated success, failure, and recovery state.
- [ ] RTST-CK-PROJECT-01-03 — Project files establish the exact installed React version, renderer, test runner, query library, test environment, host boundary, and applicable test commands.
- [ ] RTST-CK-PROJECT-01-04 — The change introduces no unapproved dependency, renderer migration, runner migration, or test-architecture migration.

### RTST-SC-PROJECT-02 — Expected failure: A required test check cannot run

A selected type, lint, build, browser, server, or host check is unavailable, blocked, or skipped in the current
environment. The handoff should keep the affected behavior unproven; presenting the absent check as evidence
fails the scenario.

#### Checklist

- [ ] RTST-CK-PROJECT-02-01 — Every unavailable, blocked, and skipped check remains visible in the handoff as an evidence gap.
- [ ] RTST-CK-PROJECT-02-02 — No unavailable, blocked, or skipped check is reported as a passed result.

### RTST-SC-PROJECT-03 — Normal case: Study makes the test-authoring task reproducible

The task record and repository evidence should let a cold implementer understand the requested behavior,
authority, installed setup, and current result before design begins. Missing study evidence fails the
scenario.

#### Checklist

- [ ] RTST-CK-PROJECT-03-01 — The task record names scope, authority, affected people, risks, required evidence, excluded work, and completion conditions.
- [ ] RTST-CK-PROJECT-03-02 — The study record names the inspected source and test files, exact installed versions, available commands, and current focused pass or failure.
- Also applies: RTST-CK-PROJECT-01-01 (one observable behavior is stated).
- Also applies: RTST-CK-PROJECT-01-02 (every activated state is stated).
- Also applies: RTST-CK-PROJECT-01-03 (the installed test setup and commands are established).
- Also applies: RTST-CK-PROJECT-01-04 (unauthorized migration is absent).

## Structure

### RTST-SC-STRUCTURE-01 — Normal case: The selected test layer can observe the claim

A component or Hook test should exercise a property visible in its configured renderer. A server, browser,
preload, IPC, navigation, or packaged-runtime claim at the wrong layer fails.

#### Checklist

- [ ] RTST-CK-STRUCTURE-01-01 — The selected test layer can directly observe the asserted behavior.
- [ ] RTST-CK-STRUCTURE-01-02 — Every setup element is necessary to reach the behavior.
- [ ] RTST-CK-STRUCTURE-01-03 — A project render helper preserves every production provider and setting relevant to the behavior.
- [ ] RTST-CK-STRUCTURE-01-04 — Each property outside the renderer is assigned to its applicable test skill.

### RTST-SC-STRUCTURE-02 — Normal case: Design defines every claim and behavior case

The design should choose the lowest layer that can observe each claim and define every applicable case before
test code is written. A missing claim assignment or incomplete case plan fails the scenario.

#### Checklist

- [ ] RTST-CK-STRUCTURE-02-01 — Every claim is assigned to the lowest test layer that can directly observe it.
- [ ] RTST-CK-STRUCTURE-02-02 — The case plan includes each applicable normal, loading, empty, failure, recovery, preservation, reset, keyboard, focus, asynchronous, cleanup, cancellation, stale-result, and adversarial case.
- [ ] RTST-CK-STRUCTURE-02-03 — Each case defines its setup, providers, fixtures, substitutes, render call, queries, interactions, assertions, time control, cleanup, command, and evidence limit.
- Also applies: RTST-CK-STRUCTURE-01-01 (the chosen layer directly observes the claim).
- Also applies: RTST-CK-STRUCTURE-01-04 (claims outside the renderer are assigned elsewhere).

### RTST-SC-STRUCTURE-03 — Normal case: Build starts from a complete test skeleton

The suite and case structure should be complete before detailed assertions are added. Building several cases
at once or expanding an unproved case fails the scenario.

#### Checklist

- [ ] RTST-CK-STRUCTURE-03-01 — The complete suite names, test names, setup, render helper, providers, fixtures, substitutes, and cleanup are visible before detailed assertions are filled.
- [ ] RTST-CK-STRUCTURE-03-02 — Each smallest complete behavior case is implemented and run before the next case is added.

## Performance

### RTST-SC-PERFORMANCE-01 — Poor quality: The test waits or runs more than its evidence requires

React tests should settle on observable conditions without real sleeps or unnecessary environment scope.
Timing workarounds, uncontrolled clocks, or an oversized check fails the scenario.

#### Checklist

- [ ] RTST-CK-PERFORMANCE-01-01 — No test uses a real sleep to wait for React behavior.
- [ ] RTST-CK-PERFORMANCE-01-02 — The exact installed fake-clock or fake-timer mechanism, or an injected clock dependency, controls behavior-relevant time.
- [ ] RTST-CK-PERFORMANCE-01-03 — The narrow test runs before the smallest affected suite, which runs before the broader required checks.

## Aesthetics

### RTST-SC-AESTHETICS-01 — Poor quality: Test structure hides the behavior

A cold reader should see the setup, interaction, and expected outcome without tracing private implementation
details. Excessive nesting or unrelated assertions fails the scenario.

#### Checklist

- [ ] RTST-CK-AESTHETICS-01-01 — The test name states the observable behavior and the condition that activates it.
- [ ] RTST-CK-AESTHETICS-01-02 — One coherent setup, interaction sequence, and outcome are each visible.
- [ ] RTST-CK-AESTHETICS-01-03 — The test contains no unrelated assertions.

## Usage

### RTST-SC-USAGE-01 — Normal case: The test operates the rendered UI

The test should find and operate the interface as a user does, then observe every activated state. An
implementation-detail query or incomplete state sequence fails the scenario.

#### Checklist

- [ ] RTST-CK-USAGE-01-01 — The test queries each applicable control by semantic role and accessible name.
- [ ] RTST-CK-USAGE-01-02 — A test ID is used only when no user-facing query represents the approved UI.
- [ ] RTST-CK-USAGE-01-03 — Each test using `user-event` creates one `userEvent.setup()` session.
- [ ] RTST-CK-USAGE-01-04 — The test observes each applicable pending, empty, failure, and recovery state.
- [ ] RTST-CK-USAGE-01-05 — Keyboard and focus behavior are exercised when they are part of the accepted interaction.
- [ ] RTST-CK-USAGE-01-06 — The final assertion observes an approved user-facing or host outcome.

### RTST-SC-USAGE-02 — Adversarial: A test reaches a pass through internals

A test can pass by driving component instances, private state, or a test-only query while the UI stays broken.
The test must operate what the user operates; a pass obtained through internals fails.

#### Checklist

- [ ] RTST-CK-USAGE-02-01 — No test drives or asserts a component instance, private state, or implementation call order to reach a passing result.
- Also applies: RTST-CK-USAGE-01-02 (a test ID is justified only by an absent user-facing query).

## Consistency

### RTST-SC-CONSISTENCY-01 — Rule violation: Asynchronous React work is not awaited

Interactions, renders, data, and disappearance must settle through the installed helper behavior before an
assertion. A manual flush, arbitrary delay, or unawaited helper breaks that behavior and fails the scenario.

#### Checklist

- [ ] RTST-CK-CONSISTENCY-01-01 — Every asynchronous interaction and query is awaited.
- [ ] RTST-CK-CONSISTENCY-01-02 — Expected asynchronous appearance uses `findBy` or the installed equivalent.
- [ ] RTST-CK-CONSISTENCY-01-03 — `waitFor` retries an assertion rather than hiding an arbitrary delay.
- [ ] RTST-CK-CONSISTENCY-01-04 — Direct `act` uses the import and form required by the exact installed React and renderer versions.
- [ ] RTST-CK-CONSISTENCY-01-05 — Direct `act` runs only in a configured environment.

### RTST-SC-CONSISTENCY-02 — Edge case: The installed React version changes the available test API

React 19 removed and deprecated renderer test APIs that earlier versions supported. The suite should follow
the exact installed version; depending on a removed or separately unavailable renderer API fails the
scenario.

#### Checklist

- [ ] RTST-CK-CONSISTENCY-02-01 — Under installed React 19 or an explicitly approved React 19 migration, no test depends on behavior removed from `react-dom/test-utils`.
- [ ] RTST-CK-CONSISTENCY-02-02 — Under installed React 19 or an explicitly approved React 19 migration, each `react-test-renderer` use is treated as deprecated.
- [ ] RTST-CK-CONSISTENCY-02-03 — Each shallow-renderer use comes from a separately installed renderer supported by the project.

### RTST-SC-CONSISTENCY-03 — Expected failure: Run finds a failing or unreliable result

Every failure, warning, flaky result, and gap should be classified before repair. A retry without diagnosis,
a masked signal, or a product edit under this operation fails the scenario.

#### Checklist

- [ ] RTST-CK-CONSISTENCY-03-01 — Each failing or unreliable result is classified as a product defect, test defect, environment gap, unsupported claim, or flake.
- [ ] RTST-CK-CONSISTENCY-03-02 — A root cause inside the tests is repaired before the narrow test, affected suite, and wider required checks are rerun.
- [ ] RTST-CK-CONSISTENCY-03-03 — A product-source defect is returned to `react-development` without changing product code under this operation.
- Also applies: RTST-CK-PERFORMANCE-01-03 (checks run from narrow to wider).
- Also applies: RTST-CK-PROJECT-02-01 (unavailable, blocked, and skipped checks remain visible).
- Also applies: RTST-CK-PROJECT-02-02 (an absent check is not reported as passed).

## Risk

### RTST-SC-RISK-01 — Adversarial: A simulated renderer overclaims a trusted boundary

A passing component test must not be used as proof of a real server, browser, preload, IPC, origin, or
packaged-runtime property. Such an unsupported completion claim fails.

#### Checklist

- [ ] RTST-CK-RISK-01-01 — Every security or privilege assertion is observed at the layer that enforces it.
- [ ] RTST-CK-RISK-01-02 — No simulated-renderer pass is presented as proof of a real server, browser, preload, IPC, origin, or packaged-runtime property.

### RTST-SC-RISK-02 — Normal case: The ordinary test run stays inside its own boundary

A component or Hook test runs in the configured environment on an ordinary developer or continuous-integration
machine. Its successful sequence should read no protected value and reach no real service; a run that leaks a
secret or touches a real boundary fails.

#### Checklist

- [ ] RTST-CK-RISK-02-01 — Test fixtures and diagnostics expose no secret or production-sensitive value.
- [ ] RTST-CK-RISK-02-02 — The ordinary test run reaches no real server, host, or external service.

## Overall

### RTST-SC-OVERALL-01 — Adversarial: A test passes without detecting the defect

Cosmetic rendering or implementation-detail assertions can pass while the user behavior is broken. The test
must fail for a representative defect in the behavior it observes.

#### Checklist

- [ ] RTST-CK-OVERALL-01-01 — A representative behavior defect causes the test or its directly inspected behavior assertion to fail.
- [ ] RTST-CK-OVERALL-01-02 — The test remains valid when implementation details change without changing the accepted behavior.

### RTST-SC-OVERALL-02 — Normal case: The implementation lifecycle closes with exact evidence

The returned result should make every lifecycle phase and test claim reproducible. Missing phase evidence or
an incomplete handoff fails the scenario.

#### Checklist

- [ ] RTST-CK-OVERALL-02-01 — The evidence shows Study, Design, Build, Run, and Handoff completed in order.
- [ ] RTST-CK-OVERALL-02-02 — The handoff names changed test files, behavior cases, exact commands and results, exact installed versions and environment, real dependencies and substitutes, evidence limits, gaps, flakes, and risks.

### RTST-SC-OVERALL-03 — Rule violation: The handoff claims work assigned elsewhere

This operation ends with verified component or Hook test changes. Claiming routed evidence, product repair,
independent judgment, or publication as part of its own result fails the scenario.

#### Checklist

- [ ] RTST-CK-OVERALL-03-01 — Real-browser, full-application, integration, and end-to-end evidence is assigned to `web-testing`.
- [ ] RTST-CK-OVERALL-03-02 — Electron process, preload, IPC, security, lifecycle, and native-integration evidence is assigned to `electron-testing`.
- [ ] RTST-CK-OVERALL-03-03 — Packaged-application and release evidence is assigned to `electron-release`.
- [ ] RTST-CK-OVERALL-03-04 — Independent read-only judgment is assigned to general `Evaluation`.
- [ ] RTST-CK-OVERALL-03-05 — The handoff neither publishes the change nor reports routed evidence as completed.
- Also applies: RTST-CK-CONSISTENCY-03-03 (product-source repair is assigned to `react-development`).
