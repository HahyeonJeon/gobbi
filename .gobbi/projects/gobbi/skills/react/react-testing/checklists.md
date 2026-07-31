# React Testing Checklist

Use this unchecked `react-testing` source with general `evaluation` when the React root activates the testing
child; `RTST` is the stable owner prefix.

## Project

### RTST-SC-PROJECT-01 — Normal case: The behavior and installed test contract are established

The test should target one accepted behavior in the renderer, runner, environment, and host the project
actually uses. A guessed stack, missing command, or unauthorized migration fails the scenario.

#### Checklist

- [ ] RTST-CK-PROJECT-01-01 — The test states one observable behavior.
- [ ] RTST-CK-PROJECT-01-02 — The test states every activated success state.
- [ ] RTST-CK-PROJECT-01-03 — The test states every activated failure state.
- [ ] RTST-CK-PROJECT-01-04 — The test states every activated recovery state.
- [ ] RTST-CK-PROJECT-01-05 — Project files establish the installed React line.
- [ ] RTST-CK-PROJECT-01-06 — Project files establish the installed renderer.
- [ ] RTST-CK-PROJECT-01-07 — Project files establish the installed test runner.
- [ ] RTST-CK-PROJECT-01-08 — Project files establish the installed query layer.
- [ ] RTST-CK-PROJECT-01-09 — Project files establish the test environment.
- [ ] RTST-CK-PROJECT-01-10 — Project files establish the host boundary.
- [ ] RTST-CK-PROJECT-01-11 — Project files establish the applicable test commands.
- [ ] RTST-CK-PROJECT-01-12 — The change introduces no unapproved dependency.
- [ ] RTST-CK-PROJECT-01-13 — The change introduces no unapproved renderer migration.
- [ ] RTST-CK-PROJECT-01-14 — The change introduces no unapproved runner migration.
- [ ] RTST-CK-PROJECT-01-15 — The change introduces no unapproved test-architecture migration.

## Structure

### RTST-SC-STRUCTURE-01 — Normal case: The selected layer can observe the claim

A component or Hook test should exercise a property visible in its configured renderer. A server, browser,
preload, IPC, navigation, or packaged-runtime claim at the wrong layer fails.

#### Checklist

- [ ] RTST-CK-STRUCTURE-01-01 — The selected test layer can directly observe the asserted behavior.
- [ ] RTST-CK-STRUCTURE-01-02 — Every setup element is necessary to reach the behavior.
- [ ] RTST-CK-STRUCTURE-01-03 — A project render helper preserves every production provider relevant to the behavior.
- [ ] RTST-CK-STRUCTURE-01-04 — A project render helper preserves every production setting relevant to the behavior.
- [ ] RTST-CK-STRUCTURE-01-05 — Each property outside the renderer is assigned to its applicable test owner.

## Performance

### RTST-SC-PERFORMANCE-01 — Poor quality: The test waits or runs more than its evidence requires

React tests should settle on observable conditions without real sleeps or unnecessary environment scope.
Timing workarounds, uncontrolled clocks, or an oversized gate fails the scenario.

#### Checklist

- [ ] RTST-CK-PERFORMANCE-01-01 — No test uses a real sleep to wait for React behavior.
- [ ] RTST-CK-PERFORMANCE-01-02 — The configured project seam controls behavior-relevant time.
- [ ] RTST-CK-PERFORMANCE-01-03 — The narrow test runs before the smallest affected suite.
- [ ] RTST-CK-PERFORMANCE-01-04 — The affected suite runs before broader required gates.

## Aesthetics

### RTST-SC-AESTHETICS-01 — Poor quality: Test structure hides the behavior

A cold reader should see the setup, interaction, and expected outcome without tracing private implementation
details. Excessive nesting or unrelated assertions fails the scenario.

#### Checklist

- [ ] RTST-CK-AESTHETICS-01-01 — The test name states the observable behavior.
- [ ] RTST-CK-AESTHETICS-01-02 — The test name states the condition that activates the behavior.
- [ ] RTST-CK-AESTHETICS-01-03 — One coherent setup is visible.
- [ ] RTST-CK-AESTHETICS-01-04 — One coherent interaction path is visible.
- [ ] RTST-CK-AESTHETICS-01-05 — One coherent outcome is visible.
- [ ] RTST-CK-AESTHETICS-01-06 — The test contains no unrelated assertions.

## Usage

### RTST-SC-USAGE-01 — Normal case: The test operates the rendered surface

The test should find and operate the interface as a user does, then observe every activated state. An
implementation-detail query or incomplete state path fails.

#### Checklist

- [ ] RTST-CK-USAGE-01-01 — The test queries each applicable control by semantic role.
- [ ] RTST-CK-USAGE-01-02 — The test queries each applicable control by accessible name.
- [ ] RTST-CK-USAGE-01-03 — A test ID is used only when no user-facing query represents the approved surface.
- [ ] RTST-CK-USAGE-01-04 — Each test using `user-event` creates one `userEvent.setup()` session.
- [ ] RTST-CK-USAGE-01-05 — The test observes each applicable pending state.
- [ ] RTST-CK-USAGE-01-06 — The test observes each applicable empty state.
- [ ] RTST-CK-USAGE-01-07 — The test observes each applicable failure state.
- [ ] RTST-CK-USAGE-01-08 — The test observes each applicable recovery state.
- [ ] RTST-CK-USAGE-01-09 — Keyboard behavior is exercised when it is part of the accepted interaction.
- [ ] RTST-CK-USAGE-01-10 — Focus behavior is exercised when it is part of the accepted interaction.
- [ ] RTST-CK-USAGE-01-11 — The final assertion observes an approved user-facing or host outcome.

## Consistency

### RTST-SC-CONSISTENCY-01 — Edge case: Asynchronous React work settles

Interactions, renders, data, and disappearance should settle through the installed helper contract before an
assertion. Manual flushes, stale APIs, or unawaited helpers fail the scenario.

#### Checklist

- [ ] RTST-CK-CONSISTENCY-01-01 — Every asynchronous interaction is awaited.
- [ ] RTST-CK-CONSISTENCY-01-02 — Every asynchronous query is awaited.
- [ ] RTST-CK-CONSISTENCY-01-03 — Expected asynchronous appearance uses `findBy` or the installed equivalent.
- [ ] RTST-CK-CONSISTENCY-01-04 — `waitFor` retries an assertion rather than hiding an arbitrary delay.
- [ ] RTST-CK-CONSISTENCY-01-05 — Direct `act` uses the import required by the installed test contract.
- [ ] RTST-CK-CONSISTENCY-01-06 — Direct `act` uses the form required by the installed test contract.
- [ ] RTST-CK-CONSISTENCY-01-07 — Direct `act` runs only in a configured environment.
- [ ] RTST-CK-CONSISTENCY-01-08 — Under installed React 19 or an explicitly approved React 19 migration, no test depends on behavior removed from `react-dom/test-utils`.
- [ ] RTST-CK-CONSISTENCY-01-09 — Under installed React 19 or an explicitly approved React 19 migration, each `react-test-renderer` use is treated as deprecated.
- [ ] RTST-CK-CONSISTENCY-01-10 — Each shallow-renderer use comes from a separately installed renderer supported by the project.

## Risk

### RTST-SC-RISK-01 — Adversarial: A simulated renderer overclaims a trusted boundary

A passing component test must not be used as proof of a real server, browser, preload, IPC, origin, or
packaged-runtime property. Such an unsupported completion claim fails.

#### Checklist

- [ ] RTST-CK-RISK-01-01 — Every security or privilege assertion is observed at the layer that enforces it.
- [ ] RTST-CK-RISK-01-02 — Test fixtures expose no secret.
- [ ] RTST-CK-RISK-01-03 — Test fixtures expose no production-sensitive value.
- [ ] RTST-CK-RISK-01-04 — Test diagnostics expose no secret.
- [ ] RTST-CK-RISK-01-05 — Test diagnostics expose no production-sensitive value.

## Overall

### RTST-SC-OVERALL-01 — Adversarial: A test passes without detecting the defect

Cosmetic rendering or implementation-detail assertions can pass while the user behavior is broken. The test
must fail for a representative defect at its intended seam.

#### Checklist

- [ ] RTST-CK-OVERALL-01-01 — A representative behavior defect causes the test or its reviewed assertion path to fail.
- [ ] RTST-CK-OVERALL-01-02 — The test remains valid when implementation details change without changing the accepted behavior.
