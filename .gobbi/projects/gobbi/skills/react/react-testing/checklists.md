# React Testing Checklist

Use this unchecked `react-testing` source with general `evaluation` when the React root activates the testing
child; `RTST` is the stable owner prefix.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### RTST-SC-PROJECT-01 — Normal case: The behavior and installed test contract are established

The test should target one accepted behavior in the renderer, runner, environment, and host the project
actually uses. A guessed stack, missing command, or unauthorized migration fails the scenario.

#### Checklist

- [ ] RTST-CK-PROJECT-01-01 — The test states one observable behavior.
- [ ] RTST-CK-PROJECT-01-02 — The test states every activated success, failure, and recovery state.
- [ ] RTST-CK-PROJECT-01-03 — Project files establish the installed React line, renderer, test runner, query layer, test environment, host boundary, and applicable test commands.
- [ ] RTST-CK-PROJECT-01-04 — The change introduces no unapproved dependency, renderer migration, runner migration, or test-architecture migration.

### RTST-SC-PROJECT-02 — Expected failure: A required test gate cannot run

A selected type, lint, build, browser, server, or host gate is unavailable, blocked, or skipped in the current
environment. The handoff should keep the affected behavior unproven; presenting the absent gate as evidence
fails the scenario.

#### Checklist

- [ ] RTST-CK-PROJECT-02-01 — Every unavailable, blocked, and skipped gate remains visible in the handoff as an evidence gap.
- [ ] RTST-CK-PROJECT-02-02 — No unavailable, blocked, or skipped gate is reported as a passed result.

## Structure

### RTST-SC-STRUCTURE-01 — Normal case: The selected layer can observe the claim

A component or Hook test should exercise a property visible in its configured renderer. A server, browser,
preload, IPC, navigation, or packaged-runtime claim at the wrong layer fails.

#### Checklist

- [ ] RTST-CK-STRUCTURE-01-01 — The selected test layer can directly observe the asserted behavior.
- [ ] RTST-CK-STRUCTURE-01-02 — Every setup element is necessary to reach the behavior.
- [ ] RTST-CK-STRUCTURE-01-03 — A project render helper preserves every production provider and setting relevant to the behavior.
- [ ] RTST-CK-STRUCTURE-01-04 — Each property outside the renderer is assigned to its applicable test owner.

## Performance

### RTST-SC-PERFORMANCE-01 — Poor quality: The test waits or runs more than its evidence requires

React tests should settle on observable conditions without real sleeps or unnecessary environment scope.
Timing workarounds, uncontrolled clocks, or an oversized gate fails the scenario.

#### Checklist

- [ ] RTST-CK-PERFORMANCE-01-01 — No test uses a real sleep to wait for React behavior.
- [ ] RTST-CK-PERFORMANCE-01-02 — The configured project seam controls behavior-relevant time.
- [ ] RTST-CK-PERFORMANCE-01-03 — The narrow test runs before the smallest affected suite, which runs before the broader required gates.

## Aesthetics

### RTST-SC-AESTHETICS-01 — Poor quality: Test structure hides the behavior

A cold reader should see the setup, interaction, and expected outcome without tracing private implementation
details. Excessive nesting or unrelated assertions fails the scenario.

#### Checklist

- [ ] RTST-CK-AESTHETICS-01-01 — The test name states the observable behavior and the condition that activates it.
- [ ] RTST-CK-AESTHETICS-01-02 — One coherent setup, interaction path, and outcome are each visible.
- [ ] RTST-CK-AESTHETICS-01-03 — The test contains no unrelated assertions.

## Usage

### RTST-SC-USAGE-01 — Normal case: The test operates the rendered surface

The test should find and operate the interface as a user does, then observe every activated state. An
implementation-detail query or incomplete state path fails.

#### Checklist

- [ ] RTST-CK-USAGE-01-01 — The test queries each applicable control by semantic role and accessible name.
- [ ] RTST-CK-USAGE-01-02 — A test ID is used only when no user-facing query represents the approved surface.
- [ ] RTST-CK-USAGE-01-03 — Each test using `user-event` creates one `userEvent.setup()` session.
- [ ] RTST-CK-USAGE-01-04 — The test observes each applicable pending, empty, failure, and recovery state.
- [ ] RTST-CK-USAGE-01-05 — Keyboard and focus behavior are exercised when they are part of the accepted interaction.
- [ ] RTST-CK-USAGE-01-06 — The final assertion observes an approved user-facing or host outcome.

### RTST-SC-USAGE-02 — Adversarial: A test reaches a pass through internals

A test can pass by driving component instances, private state, or a test-only query while the surface a user
reaches stays broken. The test must operate what the user operates; a pass obtained through internals fails.

#### Checklist

- [ ] RTST-CK-USAGE-02-01 — No test drives or asserts a component instance, private state, or implementation call order to reach a passing result.
- Also applies: RTST-CK-USAGE-01-02 (a test ID is justified only by an absent user-facing query).

## Consistency

### RTST-SC-CONSISTENCY-01 — Rule violation: Asynchronous React work is not awaited

Interactions, renders, data, and disappearance must settle through the installed helper contract before an
assertion. A manual flush, arbitrary delay, or unawaited helper breaks that contract and fails the scenario.

#### Checklist

- [ ] RTST-CK-CONSISTENCY-01-01 — Every asynchronous interaction and query is awaited.
- [ ] RTST-CK-CONSISTENCY-01-02 — Expected asynchronous appearance uses `findBy` or the installed equivalent.
- [ ] RTST-CK-CONSISTENCY-01-03 — `waitFor` retries an assertion rather than hiding an arbitrary delay.
- [ ] RTST-CK-CONSISTENCY-01-04 — Direct `act` uses the import and form required by the installed test contract.
- [ ] RTST-CK-CONSISTENCY-01-05 — Direct `act` runs only in a configured environment.

### RTST-SC-CONSISTENCY-02 — Edge case: The installed React line changes the available test API

React 19 removed and deprecated renderer test APIs that earlier lines supported. The suite should follow the
installed line's contract; depending on a removed or separately unavailable renderer API fails the scenario.

#### Checklist

- [ ] RTST-CK-CONSISTENCY-02-01 — Under installed React 19 or an explicitly approved React 19 migration, no test depends on behavior removed from `react-dom/test-utils`.
- [ ] RTST-CK-CONSISTENCY-02-02 — Under installed React 19 or an explicitly approved React 19 migration, each `react-test-renderer` use is treated as deprecated.
- [ ] RTST-CK-CONSISTENCY-02-03 — Each shallow-renderer use comes from a separately installed renderer supported by the project.

## Risk

### RTST-SC-RISK-01 — Adversarial: A simulated renderer overclaims a trusted boundary

A passing component test must not be used as proof of a real server, browser, preload, IPC, origin, or
packaged-runtime property. Such an unsupported completion claim fails.

#### Checklist

- [ ] RTST-CK-RISK-01-01 — Every security or privilege assertion is observed at the layer that enforces it.
- [ ] RTST-CK-RISK-01-02 — No simulated-renderer pass is presented as proof of a real server, browser, preload, IPC, origin, or packaged-runtime property.

### RTST-SC-RISK-02 — Normal case: The ordinary test run stays inside its own boundary

A component or Hook test runs in the configured environment on an ordinary developer or continuous-integration
machine. Its success path should read no protected value and reach no real service; a run that leaks a secret
or touches a real boundary fails.

#### Checklist

- [ ] RTST-CK-RISK-02-01 — Test fixtures and diagnostics expose no secret or production-sensitive value.
- [ ] RTST-CK-RISK-02-02 — The ordinary test run reaches no real server, host, or external service.

## Overall

### RTST-SC-OVERALL-01 — Adversarial: A test passes without detecting the defect

Cosmetic rendering or implementation-detail assertions can pass while the user behavior is broken. The test
must fail for a representative defect at its intended seam.

#### Checklist

- [ ] RTST-CK-OVERALL-01-01 — A representative behavior defect causes the test or its reviewed assertion path to fail.
- [ ] RTST-CK-OVERALL-01-02 — The test remains valid when implementation details change without changing the accepted behavior.
