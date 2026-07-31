---
name: electron-testing
description: "MUST load when designing, implementing, running, or interpreting Electron-specific tests across process, bridge, security, lifecycle, native, or packaged boundaries."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Electron Testing

Use this operation to produce truthful Electron-specific evidence at the cheapest seam that can observe the claim. It covers process placement, privileged handlers, preload contracts, renderer integration, security rejection, lifecycle, native behavior, and packaged smoke paths.

This operation does not choose the project's general test framework, parse skill Markdown as a substitute for behavior, create release artifacts, or publish them. It hands packaged and per-operating-system evidence to `electron-release`.

## Principles

### Test the claim at an observable seam

Use a unit seam for pure logic, an Electron process for Electron behavior, and an installed artifact for packaging behavior. A higher-cost layer is justified only when a cheaper layer cannot observe the risk.

### Invalid and untrusted paths are first-class

Pair success checks with malformed payloads, untrusted senders, cancellation, teardown, restart, and platform failure where they apply. Security behavior is defined by rejection as much as success.

### Evidence types stay distinct

Types and compilation prove construction. Runtime integration proves loading and messaging; adversarial tests prove rejection; packaged smoke proves artifact paths and platform integration.

### Failures remain attributable

Preserve exact commands, environment, operating system, architecture, artifact identity, and output. Diagnose an environment gap separately from a product defect before rerunning affected layers.

## Rules

- **MUST bind each test to an Electron requirement, owning process, target operating system, risk, failure mode, and observable pass condition.**
- **MUST choose the cheapest truthful seam among pure unit, main handler or service, preload or bridge contract, Electron integration, lifecycle or native integration, adversarial security, and packaged per-operating-system smoke.**
- **MUST test sender and payload rejection in the privileged process when a renderer can reach the capability.** Typecheck success is not semantic authorization evidence.
- **MUST cover success, invalid input, untrusted origin, cancellation, cleanup, recreation or restart, single-instance, deep-link, packaged path, and platform cases whenever the bound feature owns them.**
- **NEVER replace semantic Electron tests with documentation parsing, fenced-code extraction, or declaration-file generation.**
- **MUST record exact commands and results, classify environment versus product failures, rerun every affected layer after correction, and hand release-owned evidence forward without publishing.**

## Procedure

### Phase 1 — Bind the Evidence Contract

#### 1.1 Map requirements to risk

- List each Electron-specific claim, its main, preload, renderer, utility, window, session, native, or packaging owner, and the operating systems where it can differ.
- Identify privilege escalation, malformed data, wrong origin, lifecycle race, resource leak, cancellation, crash, restart, and development-versus-packaged risks.
- Define the cheapest observable pass condition and the evidence required to distinguish construction, runtime, security, and packaging claims.

#### 1.2 Inspect the existing test surface

- Read the current framework, helpers, process launchers, fixtures, CI matrix, artifact inputs, and test commands before adding a new seam.
- Preserve the project's framework selection and conventions when they can observe the bound claim.
- Identify missing runtime, operating-system, signing, display-server, keychain, notification, or installer prerequisites before execution.

### Phase 2 — Select and Design Seams

#### 2.1 Select the cheapest truthful layer

- Use pure unit tests for parsers, allowlists, validators, path containment, domain services, and result mapping that need no Electron runtime.
- Use main handler or service tests for sender facts, payload rejection, service calls, error mapping, duplicate registration, and cleanup.
- Use preload or bridge tests for exact exposed methods, data-only callbacks, channel mapping, disposer behavior, and unavailable capabilities.
- Use a real Electron integration only for loader, context isolation, sandbox, IPC transport, window, lifecycle, native, or process behavior that substitution cannot prove.
- Use packaged per-operating-system smoke only for emitted entries, resources, ASAR or unpacked content, native modules, protocols, installers, signing, updates, and platform registration.

#### 2.2 Build the case matrix

- Pair each success case with applicable invalid payload, untrusted sender or origin, canceled native request, expected failure, and missing-capability cases.
- Split each activated security surface into an independently observable case so one installed handler cannot stand in for a missing control.
- Give an absent CSP, a weak CSP, and every explicitly set `webPreferences` key separate pinned-default and runtime cases; a generic secure-window assertion is not evidence for any of them.
- Add cleanup after window close, view replacement, renderer reload, subscription disposal, utility-process exit, and app quit where the feature owns resources.
- Add cold start, second instance, deep-link delivery, window recreation, and duplicate-delivery cases where startup routing changes.
- Add target operating-system and architecture cases for native APIs, paths, permissions, installers, or module binaries.

### Phase 3 — Implement Focused Tests

#### 3.1 Build deterministic inputs

- Create the smallest fixture or service double that exposes the contract without recreating Electron internals.
- Give every sender fixture an explicit URL, frame state, and trust classification; give every payload fixture a valid or invalid reason.
- Control time, process exit, and native results at the narrow seam when possible, and reserve full Electron launches for behavior that needs them.

#### 3.2 Assert boundary behavior

- Assert the privileged owner rejects missing, detached, untrusted, or malformed requests before side effects.
- Assert the preload exposes only named domain methods, strips Electron events, serializes supported values, and removes listeners through its disposer.
- Assert successful results, cancellation, expected errors, unexpected failures, cleanup, re-registration, and restart behavior against the bound contract.

#### 3.3 Add integration and adversarial coverage

- Launch Electron with the project's actual emitted main and preload entries when testing sandbox, module format, bridge availability, IPC, or lifecycle behavior.
- For every renderer delivery path, test absent and permissive `Content-Security-Policy` values as separate adversarial cases; assert the response header or document meta policy and prove a disallowed script or resource is blocked.
- Exercise unauthorized `webSecurity: false`, `allowRunningInsecureContent: true`, `experimentalFeatures: true`, and `enableBlinkFeatures` settings independently, and reject each before renderer creation. Pair every authorized security-reducing exception with documented user authority and a bounded runtime test.
- Exercise `setPermissionCheckHandler` and `setPermissionRequestHandler` paths separately on the default session and every secondary session or partition; vary requesting and embedding origins and frame facts, and assert default denial.
- Attempt allowed and denied main-frame, subframe, and redirect navigation through `will-navigate`, `will-frame-navigate`, and `will-redirect`, including later-created `webContents`.
- Attempt a new-window request from later-created `webContents`, including one backed by a secondary session or partition, and assert rejection at `setWindowOpenHandler` before the child is created.
- Independently attempt webview attachment with a disallowed URL, unsafe preload, unsafe `webPreferences`, and disallowed requested partition; assert each rejection at `will-attach-webview` before the guest is created and verify the owning session remains controlled.
- Attempt denied external-URL, custom-protocol traversal, wrong-origin IPC, and malformed payload paths that the feature can reach.
- Record renderer console, main process, crash, and native diagnostics without weakening security settings to make the test pass.

### Phase 4 — Execute and Diagnose

#### 4.1 Run evidence layers

- Run focused unit and contract checks first, then Electron integration, lifecycle or native checks, and available packaged smoke in rising cost order.
- Record the exact command, working tree commit or digest, Electron version, operating system, architecture, environment prerequisites, exit status, and relevant output.
- Keep typecheck and compilation results separate from runtime, semantic security, and packaged evidence.

#### 4.2 Classify failures

- Classify a product failure when the observed process, contract, lifecycle, native result, or packaged behavior violates the bound requirement.
- Classify an environment gap only with concrete missing or incompatible runtime evidence, such as unavailable display, signing identity, keychain, permission, operating system, architecture, or artifact.
- Diagnose preload and process failures from emitted format, process ownership, logs, readiness, and paths before changing the test or product.

#### 4.3 Correct and rerun

- Apply corrections only within the authorized implementation scope and preserve the first failing evidence.
- Rerun the focused failing layer, every dependent layer, and any adversarial or packaged case whose premise changed.
- Stop rather than suppressing a flaky race, skipping a target platform, or relabeling a reproducible product defect as environmental.

### Phase 5 — Return Test and Release Evidence

#### 5.1 Complete the test record

- Map every requirement to its test seam, exact command, result, and retained evidence; name each unrun case and its blocker.
- Confirm success and applicable invalid, untrusted, cancellation, cleanup, restart, single-instance, deep-link, platform, and packaged cases have explicit dispositions.
- Return product defects, environment gaps, residual risks, and the narrowest reproduction command.

#### 5.2 Hand packaged evidence to release

- Give `electron-release` the tested artifact identity, operating system and architecture, install or launch path, signature state, update channel, commands, and results.
- Distinguish source or development evidence from packaged and installed evidence.
- Do not create, sign, notarize, publish, promote, or roll out an artifact from this operation.

## References
