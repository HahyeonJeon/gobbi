# Electron Testing Evaluation Checklist

This reusable unchecked source evaluates one body of Electron-specific test work and the evidence it returned.
It is governed by the [`electron`](../SKILL.md) domain and [`electron-testing`](SKILL.md) operation, with
[`electron-design`](../electron-design/SKILL.md) owning the security posture under test,
[`electron-development`](../electron-development/SKILL.md) owning the implementation, and
[`electron-release`](../electron-release/SKILL.md) owning artifact creation and publication. The source commit
that contains this file identifies the checklist version. Its stable owner prefix is `ELECTST`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### ELECTST-SC-PROJECT-01 — Normal case: each test is bound to a claim it can settle

Ordinary test work starts from named Electron claims and ends with each claim traced to a seam, a command,
and a retained result. It fails this scenario when a test exists without the requirement it serves, or when a
claim is reported without the evidence that would let another person repeat it.

#### Checklist

- [ ] ELECTST-CK-PROJECT-01-01 — Every test names its Electron requirement, owning process, target operating system, risk, failure mode, and observable pass condition.
- [ ] ELECTST-CK-PROJECT-01-02 — Every claim maps to at least one test seam, exact command, result, and retained evidence.
- [ ] ELECTST-CK-PROJECT-01-03 — Every unrun case names its blocker.

### ELECTST-SC-PROJECT-02 — Rule violation: document reading substituted for behavior

Parsing skill Markdown, extracting fenced code, or generating declarations is offered in place of an executed
Electron test. This operation forbids that substitution outright. The expected outcome runs the semantic test;
a green result produced by reading source or documentation is the failure.

#### Checklist

- [ ] ELECTST-CK-PROJECT-02-01 — No semantic Electron test is replaced by documentation parsing, fenced-code extraction, or declaration-file generation.
- [ ] ELECTST-CK-PROJECT-02-02 — Every security and behavior claim rests on an executed test rather than on a source or document reading.

### ELECTST-SC-PROJECT-03 — Expected failure: a required prerequisite is missing before execution

A runtime, operating system, signing identity, display server, keychain, notification service, or installer
is unavailable, so a bound claim cannot be observed. The expected outcome identifies the gap before execution
and returns the claim as unrun; converting the missing evidence into a pass is the observable failure.

#### Checklist

- [ ] ELECTST-CK-PROJECT-03-01 — Missing or incompatible runtime, operating-system, signing, display-server, keychain, notification, and installer prerequisites are identified before execution.
- [ ] ELECTST-CK-PROJECT-03-02 — Missing evidence is reported as a gap rather than converted into a pass.
- Also applies: ELECTST-CK-PROJECT-01-03 (every unrun case names its blocker).

## Structure

### ELECTST-SC-STRUCTURE-01 — Normal case: the cheapest truthful seam carries each claim

Pure logic, privileged handlers, preload contracts, Electron integration, and packaged smoke observe
different things at different costs. The expected outcome puts each claim at the cheapest seam that can
falsify it and reuses the project's existing framework; a full launch used where a unit seam would do is the
failure.

#### Checklist

- [ ] ELECTST-CK-STRUCTURE-01-01 — Every test uses the cheapest seam that can observe its claim among pure unit, main handler or service, preload or bridge contract, Electron integration, lifecycle or native integration, adversarial security, and packaged smoke.
- [ ] ELECTST-CK-STRUCTURE-01-02 — Every higher-cost layer names the risk that a cheaper layer could not observe.
- [ ] ELECTST-CK-STRUCTURE-01-03 — Every fixture or service double exposes the contract without recreating Electron internals.
- [ ] ELECTST-CK-STRUCTURE-01-04 — The project's existing framework, helpers, launchers, fixtures, and commands are preserved wherever they can observe the bound claim.

## Performance

### ELECTST-SC-PERFORMANCE-01 — Normal case: evidence layers run in rising cost order

Unit and contract checks are cheap and fast, Electron launches and packaged smoke are neither. The expected
outcome runs the cheap layers first and controls time, process exit, and native results at the narrow seam,
so a slow layer runs only for the behavior that needs it.

#### Checklist

- [ ] ELECTST-CK-PERFORMANCE-01-01 — Focused unit and contract checks run before Electron integration, lifecycle or native checks, and packaged smoke.
- [ ] ELECTST-CK-PERFORMANCE-01-02 — Time, process exit, and native results are controlled at the narrow seam wherever the claim allows it, and full Electron launches are reserved for behavior that needs them.

## Aesthetics

### ELECTST-SC-AESTHETICS-01 — Poor quality: results recorded without attributable identity

The tests pass, but the record does not state which commit, Electron version, operating system, or fixture
produced each result, and construction output sits beside runtime output. The expected outcome keeps every
result attributable and every evidence kind distinct.

#### Checklist

- [ ] ELECTST-CK-AESTHETICS-01-01 — Every run records the exact command, working-tree commit or digest, Electron version, operating system, architecture, environment prerequisites, exit status, and relevant output.
- [ ] ELECTST-CK-AESTHETICS-01-02 — Typecheck and compilation results are kept separate from runtime, semantic security, and packaged evidence in the record.
- [ ] ELECTST-CK-AESTHETICS-01-03 — Every sender fixture states its URL, frame state, and trust classification, and every payload fixture states its valid or invalid reason.

## Usage

### ELECTST-SC-USAGE-01 — Normal case: every success case carries its paired failure cases

A feature's real use includes invalid input, an untrusted origin, a canceled request, and an unavailable
capability. The expected outcome pairs each success with the failure paths the bound feature owns; a suite
that proves only the happy path is the failure even when every test passes.

#### Checklist

- [ ] ELECTST-CK-USAGE-01-01 — Every success case is paired with the applicable invalid payload, untrusted sender or origin, canceled native request, expected failure, and missing-capability cases.
- [ ] ELECTST-CK-USAGE-01-02 — Success, invalid input, untrusted origin, cancellation, cleanup, recreation or restart, single-instance, deep-link, packaged path, and platform cases are covered wherever the bound feature owns them.

### ELECTST-SC-USAGE-02 — Edge case: startup routing, teardown, and platform variation

Cold start, a second instance, a deep link, a window recreation, and a duplicate delivery reach the same code
by different paths, and resources released at one teardown point may leak at another. The expected outcome
tests each path the feature owns rather than one representative route.

#### Checklist

- [ ] ELECTST-CK-USAGE-02-01 — Cold start, second instance, deep-link delivery, window recreation, and duplicate delivery are each tested wherever startup routing changes.
- [ ] ELECTST-CK-USAGE-02-02 — Cleanup is tested after window close, view replacement, renderer reload, subscription disposal, utility-process exit, and app quit wherever the feature owns resources.
- [ ] ELECTST-CK-USAGE-02-03 — Target operating-system and architecture cases exist for native APIs, paths, permissions, installers, and module binaries.

## Consistency

### ELECTST-SC-CONSISTENCY-01 — Normal case: failures classified and reruns complete

A failing run is either a product defect or an environment gap, and a correction invalidates more than the
test that failed. The expected outcome classifies from evidence and reruns every dependent and premise-changed
case; a corrected suite rerun only at the original failure is the failure.

#### Checklist

- [ ] ELECTST-CK-CONSISTENCY-01-01 — Every product failure is classified from an observed violation of the bound requirement.
- [ ] ELECTST-CK-CONSISTENCY-01-02 — Every environment gap is classified from concrete missing or incompatible runtime evidence.
- [ ] ELECTST-CK-CONSISTENCY-01-03 — The focused failing layer, every dependent layer, and every adversarial or packaged case whose premise changed are rerun after a correction.
- [ ] ELECTST-CK-CONSISTENCY-01-04 — The first failing evidence is preserved alongside the corrected result.

### ELECTST-SC-CONSISTENCY-02 — Rule violation: a failure resolved outside the authorized response

A red result is made green by widening the change, suppressing a race, dropping a platform, or renaming a
defect as an environment problem. This operation requires a stop instead. Any of those resolutions is the
failure, regardless of the suite's final result.

#### Checklist

- [ ] ELECTST-CK-CONSISTENCY-02-01 — Every correction stays inside the authorized implementation scope.
- [ ] ELECTST-CK-CONSISTENCY-02-02 — No artifact is created, signed, notarized, published, promoted, or rolled out from this operation.
- [ ] ELECTST-CK-CONSISTENCY-02-03 — No flaky race is suppressed in place of a diagnosis.
- [ ] ELECTST-CK-CONSISTENCY-02-04 — No in-scope target platform is skipped.
- [ ] ELECTST-CK-CONSISTENCY-02-05 — No reproducible product defect is relabeled as an environment gap.

## Risk

### ELECTST-SC-RISK-01 — Normal case: rejection proven where the privilege lives

Security behavior is defined by what the privileged side refuses, and the preload decides what a renderer can
reach at all. The expected outcome asserts rejection before any side effect and gives each activated surface
its own observable case; one assertion standing for several controls is the failure.

#### Checklist

- [ ] ELECTST-CK-RISK-01-01 — The privileged owner is asserted to reject missing, detached, untrusted, and malformed requests before any side effect.
- [ ] ELECTST-CK-RISK-01-02 — The preload is asserted to expose only named domain methods, strip Electron events, serialize supported values, and remove listeners through its disposer.
- [ ] ELECTST-CK-RISK-01-03 — Every activated security surface has an independently observable case so one installed handler cannot stand in for a missing control.

### ELECTST-SC-RISK-02 — Adversarial: content policy and renderer preferences attacked on their own paths

An attacker reaches content policy through every renderer delivery path and reaches each unsafe
`webPreferences` key through its own creation call. The expected outcome attacks each independently and
proves the rejection happens before the renderer is created.

#### Checklist

- [ ] ELECTST-CK-RISK-02-01 — Absent and permissive `Content-Security-Policy` values are tested as separate cases on every renderer delivery path, and a disallowed script or resource is proven blocked.
- [ ] ELECTST-CK-RISK-02-02 — `webSecurity: false`, `allowRunningInsecureContent: true`, `experimentalFeatures: true`, and `enableBlinkFeatures` are each exercised independently.
- [ ] ELECTST-CK-RISK-02-03 — `webSecurity: false`, `allowRunningInsecureContent: true`, `experimentalFeatures: true`, and `enableBlinkFeatures` are each rejected before renderer creation.

### ELECTST-SC-RISK-03 — Adversarial: the test environment weakened to produce a pass

A security setting is relaxed, a generic secure-window assertion replaces the per-key cases, or an exception
is exercised without its authority so the suite goes green. The expected outcome records diagnostics without
weakening anything and keeps every reachable denied path under test.

#### Checklist

- [ ] ELECTST-CK-RISK-03-01 — Denied external-URL, custom-protocol traversal, wrong-origin IPC, and malformed-payload paths the feature can reach are each attempted.
- [ ] ELECTST-CK-RISK-03-02 — Renderer console, main-process, crash, and native diagnostics are recorded without weakening a security setting to make a test pass.
- [ ] ELECTST-CK-RISK-03-03 — Every authorized security-reducing exception is paired with documented user authority and a bounded runtime test.
- [ ] ELECTST-CK-RISK-03-04 — Every explicitly set `webPreferences` key has separate pinned-default and runtime cases rather than one generic secure-window assertion.

### ELECTST-SC-RISK-04 — Adversarial: each activated session surface attacked on its own path

An attacker reaches permissions, navigation, new windows, and webview attachment through separate paths,
including later-created web contents and secondary sessions or partitions. The expected outcome attacks each
path independently and proves the rejection happens before the child or guest is created.

#### Checklist

- [ ] ELECTST-CK-RISK-04-01 — `setPermissionCheckHandler` and `setPermissionRequestHandler` paths are exercised separately on the default session and every secondary session or partition, with varied requesting and embedding origins and frame facts, asserting default denial.
- [ ] ELECTST-CK-RISK-04-02 — Allowed and denied main-frame, subframe, and redirect navigation is attempted through `will-navigate`, `will-frame-navigate`, and `will-redirect`, including on later-created web contents.
- [ ] ELECTST-CK-RISK-04-03 — A new-window request from a later-created web contents, including one backed by a secondary session or partition, is rejected at `setWindowOpenHandler` before the child is created.
- [ ] ELECTST-CK-RISK-04-04 — Webview attachment with a disallowed URL, an unsafe preload, unsafe `webPreferences`, and a disallowed requested partition is each rejected at `will-attach-webview` before the guest is created.

## Overall

### ELECTST-SC-OVERALL-01 — Normal case: a complete record handed to its next owner

The test record must let another person reproduce the failures and let release work continue from the tested
artifact. The scenario fails when a defect is returned without its narrowest reproduction, or when packaged
evidence reaches release without the identity it was produced against.

#### Checklist

- [ ] ELECTST-CK-OVERALL-01-01 — Product defects, environment gaps, residual risks, and the narrowest reproduction command are each returned.
- [ ] ELECTST-CK-OVERALL-01-02 — The tested artifact identity, operating system and architecture, install or launch path, signature state, update channel, commands, and results are handed to `electron-release`.
- [ ] ELECTST-CK-OVERALL-01-03 — Source or development evidence is distinguished from packaged and installed evidence.

### ELECTST-SC-OVERALL-02 — Adversarial: a passing suite presented as complete assurance

A green run on one machine is offered as proof that authorization, runtime behavior, packaging, and every
other target are sound. The expected outcome keeps the claim inside the executed cases; coverage inferred
from a passing result rather than from the cases that ran is the failure.

#### Checklist

- [ ] ELECTST-CK-OVERALL-02-01 — No result is treated as proof of a property it does not establish: a typecheck of semantic authorization, a passing unit test of Electron runtime behavior, an unpackaged run of packaged path behavior, one installed handler of another control's coverage, and one operating system of another target.
- [ ] ELECTST-CK-OVERALL-02-02 — The completion claim is no broader than the executed cases and their recorded dispositions.
