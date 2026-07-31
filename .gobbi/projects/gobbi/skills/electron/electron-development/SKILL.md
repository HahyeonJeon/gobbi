---
name: electron-development
description: "MUST load when implementing or reviewing an Electron platform change across main, preload, renderer, utility, window, lifecycle, or native integration boundaries."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Electron Development

Use this operation to deliver one correctly placed, integrated, and locally verified Electron platform change. It begins from the pinned Electron major, target operating systems, existing stack, process authority, and expected behavior.

This operation ends with local implementation evidence and explicit handoffs to `electron-testing` and, when packaging is affected, `electron-release`. Product experience, renderer-framework methods, full test design, and release execution remain with their owners.

## Principles

### Place behavior before writing code

Choose main, preload, renderer, or utility ownership from required capability, trust, lifecycle, and failure isolation. A convenient import is not placement evidence.

### Change the narrowest complete process chain

Design the smallest bridge and lifecycle change that delivers the outcome. Follow the dependency order from process contract to privileged owner to preload to renderer, then windows and native integration.

### Preserve working foundations

Keep the established package manager, bundler, module format, target split, and packaging stack when they meet the requirement. Change infrastructure only when the task requires it and the evidence explains the migration cost.

### Verification follows the boundary

Static and build checks prove construction, not runtime security or Electron behavior. Route behavioral claims to `electron-testing` and packaged claims to `electron-release`.

## Rules

- **MUST bind the change to an observable outcome, pinned Electron major, target operating systems and architectures, existing stack, process owners, trust boundaries, and user authority before implementation.**
- **MUST inspect current process imports, BrowserWindow or view options, preload exposure, IPC registration, lifecycle hooks, cleanup, build targets, and packaged path assumptions before changing them.**
- **MUST implement a cross-process change in dependency order: shared contract, privileged owner, preload adapter, renderer consumer, then window, lifecycle, native, configuration, and documentation integration.**
- **MUST preserve secure defaults and validate sender and payload data in the privileged process.** Load `electron-design` for the complete non-negotiable posture.
- **NEVER use a successful typecheck or development launch as proof that IPC authorization, preload loading, lifecycle ordering, native outcomes, or packaged paths work.**
- **MUST finish with current code, configuration, and documentation plus exact local verification and explicit remaining test or release evidence.**

## Procedure

### Phase 1 — Bind and Inspect

#### 1.1 Bind the platform outcome

- State the user-visible or integration outcome, unchanged behavior, inputs, outputs, cancellation, and expected failures.
- Record the installed and pinned Electron major, Node and Chromium implications, target operating systems and architectures, module format, package manager, bundler, and packaging stack.
- Record who may authorize security exceptions, new dependencies, credential use, publication, and platform-scope changes. Stop when required authority is absent.

#### 1.2 Map current process ownership

- Trace every affected path through main, preload, renderer, utility processes, windows or views, sessions, and native APIs.
- Inspect the current trust boundary against the official [process model](https://www.electronjs.org/docs/latest/tutorial/process-model), [sandbox](https://www.electronjs.org/docs/latest/tutorial/sandbox/), and [security guidance](https://www.electronjs.org/docs/latest/tutorial/security).
- Inspect every renderer content source and its actual CSP delivery path, whether a response header or local document meta tag. Compare every explicitly set `webPreferences` key with the pinned Electron default, and record documented user authority plus required test evidence for each security-reducing deviation.
- Capture current lifecycle creation and disposal, sender checks, payload validation, module loading, development paths, packaged paths, and existing verification commands.

### Phase 2 — Design the Smallest Complete Change

#### 2.1 Choose placement and contract

- Put operating-system, filesystem, secret, and process authority in main or a bounded utility process; keep renderer code web-shaped.
- Define a domain-shaped input, success result, cancellation result, expected error, and event or subscription disposal contract before transport code.
- For cross-process behavior, define channel ownership, allowed sender, runtime payload validation, return serialization, timeout or cancellation, and cleanup.

#### 2.2 Plan lifecycle and integration

- Define when each handler, protocol, session, window, view, listener, shortcut, tray item, menu, and utility process is created and disposed.
- Distinguish work that must occur before `ready`, after `whenReady`, during window recreation, on second-instance or deep-link delivery, and during quit.
- List exact code, configuration, type, build, and documentation paths. Explain any departure from the current project stack before applying it.

### Phase 3 — Implement in Dependency Order

#### 3.1 Implement the contract and privileged owner

- Add or update the smallest shared contract without importing process-only runtime modules across boundaries.
- Implement the main or utility service first, including runtime input checks, synchronously captured sender evidence, cancellation, expected error mapping, and deterministic cleanup.
- Register the privileged handler once at the correct lifecycle point and make duplicate registration, restart, and teardown behavior explicit.

#### 3.2 Implement preload and renderer integration

- Expose one narrow preload method per capability through `contextBridge`; wrap subscriptions so callbacks receive data, not Electron event objects, and return a disposer.
- Keep the renderer dependent only on the bridge contract and web APIs. Handle unavailable capability, rejection, cancellation, and stale-window teardown as normal states.
- Preserve the project's module and preload build format. If loading fails, compare the emitted preload format and path with the pinned Electron sandbox and ESM constraints before changing security settings.

#### 3.3 Integrate windows, native behavior, and project files

- Through the owning factory and one idempotent `web-contents-created` installer, apply secure options and controls to every existing and later-created `webContents` and to every distinct session or partition it uses.
- Load only packaged local or secure-protocol remote content, and deliver a restrictive CSP through every renderer response or document. Audit every explicit `webPreferences` key against the pinned Electron default; apply no security-reducing deviation without documented user authority and matching test evidence.
- Install both `setPermissionCheckHandler` and `setPermissionRequestHandler` with requesting and embedding origin evidence where available. Cover `will-navigate`, `will-frame-navigate`, `will-redirect`, and `setWindowOpenHandler` on each `webContents`; at `will-attach-webview`, reject an unsafe URL, preload, `webPreferences`, or requested partition before attachment.
- Keep external URLs behind parsed, closed allowlists and keep custom-protocol reads behind decode, normalization, resolution, and canonical-root containment.
- For native APIs, branch on documented cancellation, Boolean, error-string, support, or failure-event outcomes and cover operating-system differences.
- Update target configuration, resource inclusion, path resolution, and documentation that changed with the implementation; do not execute packaging or publication here.

### Phase 4 — Verify and Diagnose Locally

#### 4.1 Run construction checks

- Run the repository's focused formatting, lint, type, unit, and main/preload/renderer build commands that apply to the changed paths.
- Inspect emitted entries and development loading for the pinned module format; record exact commands, exit status, and relevant output.
- Treat static success as construction evidence only. Hand IPC, security, lifecycle, native, and Electron integration claims to `electron-testing`.

#### 4.2 Diagnose boundary failures

- For wrong-process imports, identify the runtime owner and move or bridge the capability instead of weakening the renderer.
- For preload failures, compare sandbox availability, CommonJS or ESM output, file extension, bundle shape, and resolved path. For lifecycle races, trace registration and delivery against readiness, recreation, and disposal events.
- For native failures, inspect the API's return or failure event and reproduce on the affected operating system. For development-only success, route emitted entries, resources, ASAR, native modules, and packaged paths to `electron-release`.

### Phase 5 — Complete the Handoff

#### 5.1 Prove the development outcome

- Confirm each affected process owns only valid imports and capabilities, each bridge is narrow, each privileged handler validates trust and data, and each resource has cleanup.
- Confirm current code, configuration, and documentation agree and that every local construction command has recorded evidence.
- Return changed paths, process ownership, contract behavior, known platform limits, and unresolved environmental constraints.

#### 5.2 Route remaining evidence

- Load `electron-testing` with the outcome, process map, security claims, failure modes, local commands, and cheapest truthful runtime seams.
- Load `electron-release` when entries, resources, preload format, native modules, ASAR placement, installers, signing, updates, or per-operating-system artifacts may change.
- Do not claim completion when an in-scope process, integration path, failure case, or required handoff remains unspecified.

## References
