# Electron Design Evaluation Checklist

This reusable unchecked source evaluates one Electron technical design. It covers process architecture,
security and trust boundaries, project structure, preload bridges, IPC contracts, state ownership, window
and view ownership, resource lifetimes, performance placement, and technical failure isolation. The
[`electron-runtime`](../electron-runtime/SKILL.md) mechanism manual resolves current API, version, process
capability, and mechanism facts. The source commit that contains this file identifies the checklist version.
Its stable owner prefix is `ELECDSN`.

Evaluation owns applicability decisions, filled copies, evidence, row results, findings, coverage closure,
and verdicts. This source owns only reusable scenario coverage and unchecked binary conditions. It defines no
test procedure, environment classification, evidence threshold, or remediation.

A row is defined once beneath its owning scenario. An `Also applies` line is one resolvable pointer to a row
defined elsewhere.

## Project

### ELECDSN-SC-PROJECT-01 — Normal case: each choice stays inside technical design ownership

An ordinary design chooses process, trust, structure, bridge, IPC, state, window, resource, performance, or
technical failure boundaries. The expected outcome stays within those decisions. It fails when the design
decides an excluded concern or treats a Preference departure as self-justifying.

#### Checklist

- [ ] ELECDSN-CK-PROJECT-01-01 — Every decided choice concerns process architecture, a trust boundary, project structure, a preload bridge, an IPC contract, state or resource ownership, window or view ownership, performance placement, or technical failure isolation.
- [ ] ELECDSN-CK-PROJECT-01-02 — No choice decides product or interface judgment, installed behavior or recovery promises, source implementation, testing, environment classification, acceptance of evaluation inputs, diagnostic-emission policy, packaging, release, or delivery coordination.
- [ ] ELECDSN-CK-PROJECT-01-03 — Each Preference departure names the accepted project constraint, repository fact, or measurement that justifies it.
- [ ] ELECDSN-CK-PROJECT-01-04 — No Rule conflict is accepted as a Preference departure.

### ELECDSN-SC-PROJECT-02 — Expected failure: authority for a security exception is absent

A required capability appears to need a renderer security reduction, but the user authority that could
accept it is absent. The expected outcome is a stop that names the exact gap. Applying the reduction while
leaving authority unresolved is the observable failure.

#### Checklist

- [ ] ELECDSN-CK-PROJECT-02-01 — No renderer security reduction is adopted without accepted user authority for that exact reduction.
- [ ] ELECDSN-CK-PROJECT-02-02 — Each proposed security exception names the affected renderer, exact setting, incompatible required capability, authority, and compensating controls.

## Structure

### ELECDSN-SC-STRUCTURE-01 — Normal case: privilege, work, and state follow process boundaries

The main process coordinates application lifetime and privileged operations while renderers receive narrow
capabilities. Sustained or failure-prone work and authoritative state have named process owners. The scenario
fails when packaged renderer content is trusted, main is blocked without cause, or state has competing
writers.

#### Checklist

- [ ] ELECDSN-CK-STRUCTURE-01-01 — Operating-system authority, secrets, filesystem access, and process control remain in the main process or a bounded utility process.
- [ ] ELECDSN-CK-STRUCTURE-01-02 — Every renderer is treated as untrusted, including a renderer that loads packaged local content.
- [ ] ELECDSN-CK-STRUCTURE-01-03 — The main process holds application lifecycle, window and view creation, IPC registration, and coordination rather than sustained blocking computation.
- [ ] ELECDSN-CK-STRUCTURE-01-04 — CPU-intensive work, crash-prone components, untrusted services, and independently restartable work use a utility process unless measurement and failure analysis justify another placement.
- [ ] ELECDSN-CK-STRUCTURE-01-05 — Each state value names one authoritative process, its permitted mutation callers, and the event that ends its lifetime.

### ELECDSN-SC-STRUCTURE-02 — Normal case: every long-lived resource has an owner and disposal path

Windows, views, sessions, listeners, shortcuts, tray items, menus, and operating-system requests can outlive
their creator call. The expected outcome gives each one owner and an end-of-scope action. An unstated owner or
teardown path is the failure even when creation succeeds.

#### Checklist

- [ ] ELECDSN-CK-STRUCTURE-02-01 — Every window, view, session, listener, shortcut, tray item, menu, and operating-system request names one explicit technical owner.
- [ ] ELECDSN-CK-STRUCTURE-02-02 — Every long-lived resource names the removal, unregistration, close, destruction, or release action that ends its lifetime.
- [ ] ELECDSN-CK-STRUCTURE-02-03 — Each resource lifetime states its cancellation, cleanup, restart, startup-order, and relevant operating-system cases.

### ELECDSN-SC-STRUCTURE-03 — Edge case: one window needs composed web contents

An accepted composition need requires several web contents in one window. The expected outcome chooses
`BaseWindow` with `WebContentsView` and gives each web contents an explicit close path. Assuming that
closing `BaseWindow` destroys its child web contents is the failure.

#### Checklist

- [ ] ELECDSN-CK-STRUCTURE-03-01 — `BrowserWindow` is chosen for a normal window with one full-size web content.
- [ ] ELECDSN-CK-STRUCTURE-03-02 — `BaseWindow` with `WebContentsView` is chosen only for an accepted multi-view composition need.
- Also applies: ELECDSN-CK-STRUCTURE-02-02

## Performance

### ELECDSN-SC-PERFORMANCE-01 — Poor quality: process placement is defended without measurement

Sustained or failure-prone work stays in main because that placement seems simpler or fast enough. The
expected outcome uses measurement and failure analysis to compare responsiveness and isolation. Convenience
or an unmeasured impression is the failure even when the application currently appears responsive.

#### Checklist

- [ ] ELECDSN-CK-PERFORMANCE-01-01 — Each claim that another process would add no value is supported by measurement of the affected work and analysis of its failure reach.
- [ ] ELECDSN-CK-PERFORMANCE-01-02 — No sustained, blocking, or crash-prone work remains in the main process solely for implementation convenience.

## Aesthetics

### ELECDSN-SC-AESTHETICS-01 — Poor quality: contracts are named after transport

Bridge methods and channels describe how messages travel rather than the application action they permit. The
expected outcome uses narrow names that let a reader identify the capability and its data. A valid but
transport-named surface is the failure.

#### Checklist

- [ ] ELECDSN-CK-AESTHETICS-01-01 — Every bridge method and channel name describes its permitted application action or follows an established convention that remains narrow and unambiguous.
- [ ] ELECDSN-CK-AESTHETICS-01-02 — Every request and response field name describes its application meaning, cancellation, or expected-error case.

## Usage

### ELECDSN-SC-USAGE-01 — Normal case: a renderer receives the smallest complete capability

A renderer needs one privileged application action. The expected outcome exposes one filtered
`contextBridge` method with explicit request, response, cancellation, and expected-error shapes. Passing
transport power or an Electron event through the bridge is the failure.

#### Checklist

- [ ] ELECDSN-CK-USAGE-01-01 — Each permitted action is exposed through one narrow application-action method.
- [ ] ELECDSN-CK-USAGE-01-02 — No raw `ipcRenderer`, internal Electron event, caller-selected channel, or generic send or invoke function is exposed through `contextBridge`.
- [ ] ELECDSN-CK-USAGE-01-03 — Each exposed callback passes only the data the renderer needs.
- [ ] ELECDSN-CK-USAGE-01-04 — Each exposed contract defines cancellation, expected errors, startup order, and relevant operating-system differences.

### ELECDSN-SC-USAGE-02 — Adversarial: a bridge is widened for convenience

Several renderer call sites are combined behind a general method that accepts a channel, path, command, or
destination. The expected outcome keeps the permitted action and destination under privileged-side control.
Accepting caller-selected authority because the method crosses `contextBridge` is the failure.

#### Checklist

- [ ] ELECDSN-CK-USAGE-02-01 — No exposed method lets a renderer select a channel, file path, command, or destination outside a closed set owned by the privileged side.
- [ ] ELECDSN-CK-USAGE-02-02 — Each added renderer capability names its required action, admitted inputs, privileged-side validation, and expected failure.

## Consistency

### ELECDSN-SC-CONSISTENCY-01 — Normal case: secure defaults and current facts have one source

Windows, views, sessions, and protocol handlers share creation paths, and explicit `webPreferences` match
the pinned Electron major. The expected outcome centralizes the security posture and resolves current facts
from the project and official Electron documentation. A later creation path or remembered default that
changes the posture is the failure.

#### Checklist

- [ ] ELECDSN-CK-CONSISTENCY-01-01 — Secure windows, views, sessions, and protocol handlers use central factories unless every call site in a tiny static application is auditable and equivalent.
- [ ] ELECDSN-CK-CONSISTENCY-01-02 — Each explicitly set `webPreferences` key is compared with the pinned Electron major's documented default.
- [ ] ELECDSN-CK-CONSISTENCY-01-03 — Every renderer starts with `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`, `webSecurity: true`, `allowRunningInsecureContent: false`, no `experimentalFeatures`, and no `enableBlinkFeatures`.
- [ ] ELECDSN-CK-CONSISTENCY-01-04 — Each API, version, process-capability, default, and mechanism claim matches the pinned Electron major and current official Electron documentation.

### ELECDSN-SC-CONSISTENCY-02 — Rule violation: a structure migration crosses a process trust boundary

A project-structure migration is proposed for taste, then combines process roots or places a library where
its capability is unsupported. The expected outcome preserves the established build conventions and process
separation unless a measured defect or required capability justifies the change. Collapsing a trust boundary
or importing a privileged library into renderer content is the Rule violation.

#### Checklist

- [ ] ELECDSN-CK-CONSISTENCY-02-01 — The established package manager, bundler, and module format are preserved unless a measured defect or required capability justifies migration.
- [ ] ELECDSN-CK-CONSISTENCY-02-02 — Main, preload, renderer, and utility-process code keep distinct source roots and build targets with libraries supported in each process.

## Risk

### ELECDSN-SC-RISK-01 — Normal case: renderer content and capabilities have separate controls

Permissions, frame navigation, redirects, popups, webview attachment, and external URLs are independent
surfaces. The expected outcome closes each surface on every relevant and later-created session, partition,
and `webContents`. Treating one installed control as coverage for another surface is the failure.

#### Checklist

- [ ] ELECDSN-CK-RISK-01-01 — Both `setPermissionCheckHandler` and `setPermissionRequestHandler` default to denial on every relevant and later-created session or partition and use the requesting and embedding origins Electron provides.
- [ ] ELECDSN-CK-RISK-01-02 — `will-navigate`, `will-frame-navigate`, and `will-redirect` each enforce the admitted navigation set on every relevant and later-created `webContents`.
- [ ] ELECDSN-CK-RISK-01-03 — `setWindowOpenHandler` enforces the admitted popup set on every relevant and later-created `webContents`.
- [ ] ELECDSN-CK-RISK-01-04 — `will-attach-webview` validates the requested URL, preload, security-relevant `webPreferences`, and intended session or partition before attachment.
- [ ] ELECDSN-CK-RISK-01-05 — Each URL passed to `shell.openExternal` is parsed and matched by scheme, origin, and admitted path against a closed allowlist.

### ELECDSN-SC-RISK-02 — Edge case: a renderer loads secure remote content

An accepted need requires a renderer to load content that is not packaged with the application. The expected
outcome uses a secure protocol, retains renderer isolation, and delivers a restrictive Content Security
Policy through the actual source. Treating an intended policy as delivered is the failure.

#### Checklist

- [ ] ELECDSN-CK-RISK-02-01 — Each renderer document and subresource loads from a packaged local source or an admitted secure-protocol remote source.
- [ ] ELECDSN-CK-RISK-02-02 — Each renderer document receives a restrictive Content Security Policy through its actual response header or document meta tag.

### ELECDSN-SC-RISK-03 — Adversarial: a privileged handler trusts caller-controlled identity or data

A handler authorizes from a renderer-supplied value or reads `event.senderFrame` after asynchronous work has
allowed the frame to navigate or disappear. The expected outcome captures sender identity synchronously and
validates payload values in the privileged process. A caller-shaped or stale authorization fact is the
failure.

#### Checklist

- [ ] ELECDSN-CK-RISK-03-01 — Each privileged handler captures `event.senderFrame` before its first asynchronous suspension.
- [ ] ELECDSN-CK-RISK-03-02 — Each privileged handler rejects a missing, destroyed, navigated, or untrusted sender frame.
- [ ] ELECDSN-CK-RISK-03-03 — Each privileged handler validates payload values at runtime in the privileged process.
- [ ] ELECDSN-CK-RISK-03-04 — No authorization decision uses an identity or authority value supplied by the calling renderer.

### ELECDSN-SC-RISK-04 — Adversarial: a custom-protocol path escapes its allowed root

A custom-protocol handler converts caller-controlled path text into a file read. Percent encoding, traversal
segments, and link resolution can each move the target outside the intended root. The expected outcome proves
canonical containment before reading. Trusting the path's literal appearance is the failure.

#### Checklist

- [ ] ELECDSN-CK-RISK-04-01 — Each custom-protocol path is decoded before any file read.
- [ ] ELECDSN-CK-RISK-04-02 — Each custom-protocol path is normalized before any file read.
- [ ] ELECDSN-CK-RISK-04-03 — Each custom-protocol path is resolved to its canonical target before any file read.
- [ ] ELECDSN-CK-RISK-04-04 — Each custom-protocol target is proven to remain beneath an allowed canonical root before any file read.

## Overall

### ELECDSN-SC-OVERALL-01 — Normal case: the technical design closes its decisions

A complete design settles its technical boundaries, owners, exceptions, and failure isolation. The expected
outcome gives an explicit judgment, a bounded handoff, and changed facts that reopen the choice. An unresolved
Rule conflict or a claim broader than the settled design is the failure.

#### Checklist

- [ ] ELECDSN-CK-OVERALL-01-01 — Each technical failure names the component that contains it and the component that handles it.
- [ ] ELECDSN-CK-OVERALL-01-02 — No renderer security reduction remains without accepted user authority and named compensating controls.
- [ ] ELECDSN-CK-OVERALL-01-03 — The design claim is no broader than the process, trust, contract, state, resource, and failure decisions it settles.
- [ ] ELECDSN-CK-OVERALL-01-04 — The design states one explicit accept, revise, or reject judgment.
- [ ] ELECDSN-CK-OVERALL-01-05 — The technical handoff states settled contracts, owners, security exceptions, and open technical facts.
- [ ] ELECDSN-CK-OVERALL-01-06 — Each material choice names the project, requirement, measurement, or Electron fact whose change reopens it.

### ELECDSN-SC-OVERALL-02 — Adversarial: secure defaults are presented as a complete posture

`contextIsolation`, `sandbox`, and a `contextBridge` surface are present, so the design is described as
secure while caller authorization, payload validation, or later-created resources remain open. The expected
outcome keeps each claim within the property its own control establishes. Cosmetic security treated as a
complete posture is the failure.

#### Checklist

- [ ] ELECDSN-CK-OVERALL-02-01 — No secure default is treated as proof of a property it does not establish: `contextIsolation` for payload validation, `sandbox` for sender authorization, `contextBridge` for channel narrowness, a preload wrapper for default-deny coverage, or a TypeScript type for runtime validation.
- [ ] ELECDSN-CK-OVERALL-02-02 — Each claimed control is supported by the specific setting, handler, owner, or contract that establishes it.
