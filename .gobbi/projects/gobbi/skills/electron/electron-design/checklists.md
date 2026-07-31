# Electron Design Evaluation Checklist

This reusable unchecked source evaluates one set of Electron design choices against the security posture,
ownership model, naming, and project shape this skill owns. It is governed by the
[`electron`](../SKILL.md) domain and [`electron-design`](SKILL.md) preferences, with
[`electron-development`](../electron-development/SKILL.md) as the operation that applies them,
[`electron-testing`](../electron-testing/SKILL.md) as the operation that proves them, and
[`electron-runtime`](../electron-runtime/SKILL.md) as the mechanism manual. The source commit that contains
this file identifies the checklist version. Its stable owner prefix is `ELECDSN`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### ELECDSN-SC-PROJECT-01 — Normal case: each choice sits inside the owned boundary

An ordinary design decides a security posture, an ownership model, a contract name, or a project shape, and
selects a default within the Rules. It fails this scenario when a product-experience, renderer-framework,
test-methodology, or release question is decided here, or when a departure carries no stated authority.

#### Checklist

- [ ] ELECDSN-CK-PROJECT-01-01 — Every decided choice is an Electron security-posture, ownership, naming, or project-shape choice.
- [ ] ELECDSN-CK-PROJECT-01-02 — Every product-experience, renderer-framework-idiom, test-methodology, and release-command question the design raises is routed to its named owner.
- [ ] ELECDSN-CK-PROJECT-01-03 — Every departure from a Preference carries documented evidence.
- [ ] ELECDSN-CK-PROJECT-01-04 — No departure from a Rule occurs without a change to the governing contract.

### ELECDSN-SC-PROJECT-02 — Expected failure: the authority for a security exception is absent

A design needs a security-reducing setting, but the user authority that could permit it is unavailable. The
expected outcome is a stop that names the setting and the missing authority; applying the setting and
recording the gap as a follow-up is the observable failure.

#### Checklist

- [ ] ELECDSN-CK-PROJECT-02-01 — No security-reducing setting is adopted while documented user authority for it is absent.
- [ ] ELECDSN-CK-PROJECT-02-02 — The stop names the exact setting, the authority it requires, and the verification that would accompany it.

## Structure

### ELECDSN-SC-STRUCTURE-01 — Normal case: privilege follows the process boundary

Operating-system authority, secrets, filesystem access, and process control belong to main or a bounded
utility process, and every renderer is untrusted. The scenario fails when a renderer holds privilege because
its content is packaged locally, or when work lands in main with no reason to be there.

#### Checklist

- [ ] ELECDSN-CK-STRUCTURE-01-01 — Every privileged capability — operating-system authority, secrets, filesystem access, and process control — is placed in main or a bounded utility process.
- [ ] ELECDSN-CK-STRUCTURE-01-02 — Every renderer is treated as untrusted, including a renderer that loads packaged local content.
- [ ] ELECDSN-CK-STRUCTURE-01-03 — Main holds lifecycle, window creation, IPC registration, and orchestration rather than sustained blocking computation.
- [ ] ELECDSN-CK-STRUCTURE-01-04 — Sustained CPU work, crash-prone components, and independently restartable services are placed in a utility process, or their retention in main is justified by measurement and failure analysis.

### ELECDSN-SC-STRUCTURE-02 — Normal case: every long-lived resource has an owner and a disposal path

Windows, views, sessions, listeners, shortcuts, tray items, menus, and native requests outlive the call that
created them. The expected outcome names one owner and one disposal path for each; a resource whose teardown
is unstated is the failure even when the happy path works.

#### Checklist

- [ ] ELECDSN-CK-STRUCTURE-02-01 — Every window, view, session, listener, shortcut, tray item, menu, and native request names one explicit owner.
- [ ] ELECDSN-CK-STRUCTURE-02-02 — Every long-lived resource has a disposal path that runs when its scope ends: listener removal, shortcut unregistration, owned web-contents destruction or close, and tray, menu, session, and native release.
- [ ] ELECDSN-CK-STRUCTURE-02-03 — Cancellation, cleanup, restart, and operating-system differences are defined together with the happy path.

### ELECDSN-SC-STRUCTURE-03 — Edge case: the product needs composed views instead of one window

A surface needs several web contents in one window, so `BrowserWindow` no longer owns the renderer lifecycle.
The expected outcome chooses `BaseWindow` with `WebContentsView` for that need and makes manual teardown part
of the design; a composed design that assumes automatic destruction is the failure.

#### Checklist

- [ ] ELECDSN-CK-STRUCTURE-03-01 — `BrowserWindow` is chosen for a normal single-web-content window, and `BaseWindow` with `WebContentsView` is chosen only where the product needs composed views.
- [ ] ELECDSN-CK-STRUCTURE-03-02 — Every manually created web contents in a composed-view design has an explicit teardown step in the design.

## Performance

### ELECDSN-SC-PERFORMANCE-01 — Poor quality: a placement defended without measurement

Keeping sustained work in main is defended as simpler, faster, or good enough. The expected outcome carries
measurement and failure analysis showing the extra process boundary adds no value; a placement defended by
convenience or an impression of responsiveness is the failure, even when the application currently behaves.

#### Checklist

- [ ] ELECDSN-CK-PERFORMANCE-01-01 — Every claim that a process boundary would add no value rests on measurement and failure analysis of the affected work.
- [ ] ELECDSN-CK-PERFORMANCE-01-02 — No sustained or crash-prone work stays in main on the basis of implementation convenience.

## Aesthetics

### ELECDSN-SC-AESTHETICS-01 — Poor quality: contracts named after their transport

The bridge and channel names describe how the message travels rather than what the application does, so a
reader cannot tell which domain action a capability performs. The expected outcome names contracts by domain
meaning; a valid but transport-shaped surface is the failure.

#### Checklist

- [ ] ELECDSN-CK-AESTHETICS-01-01 — Every bridge method and channel name describes the domain action, or follows an established project convention that remains narrow and unambiguous.
- [ ] ELECDSN-CK-AESTHETICS-01-02 — Every input and result payload name describes domain meaning, cancellation, or expected failure.

## Usage

### ELECDSN-SC-USAGE-01 — Normal case: the renderer receives the smallest complete capability

A renderer needs a privileged action, so the design exposes one domain-shaped method with its success,
cancellation, and failure outcomes. The scenario fails when the renderer receives transport rather than a
capability, or when an expected outcome is left out of the contract.

#### Checklist

- [ ] ELECDSN-CK-USAGE-01-01 — Every permitted action is exposed as one domain-shaped bridge method.
- [ ] ELECDSN-CK-USAGE-01-02 — No raw `ipcRenderer`, internal Electron event, arbitrary channel parameter, or generic send or invoke function is exposed to a renderer.
- [ ] ELECDSN-CK-USAGE-01-03 — Every exposed callback delivers data with privileged event objects stripped.
- [ ] ELECDSN-CK-USAGE-01-04 — Cancellation, expected errors, startup order, and platform differences are part of the exposed contract rather than unhandled outcomes.

### ELECDSN-SC-USAGE-02 — Adversarial: a bridge widened for convenience

Several call sites need slightly different data, so one general method is added that accepts a channel, path,
command, or destination chosen by the renderer. The expected outcome keeps the privileged side in control of
what may be acted on; a general method accepted because it is still behind `contextBridge` is the failure.

#### Checklist

- [ ] ELECDSN-CK-USAGE-02-01 — No exposed method lets the renderer select the channel, file path, command, or destination the privileged side acts on beyond a closed set the privileged side owns.
- [ ] ELECDSN-CK-USAGE-02-02 — Every added capability or destination names the exact need, validation, and failure behavior that justified adding it.

## Consistency

### ELECDSN-SC-CONSISTENCY-01 — Normal case: one place decides the secure defaults

Windows, views, sessions, protocol handlers, and native integrations should be created where defaults and
disposal stay identical. The scenario fails when a second creation path applies different options, or when an
explicit `webPreferences` key is carried forward without being compared with the pinned Electron default.

#### Checklist

- [ ] ELECDSN-CK-CONSISTENCY-01-01 — Secure windows, views, sessions, protocol handlers, and native integrations are created through central factories, or every call site remains auditable and equivalent in a tiny static application.
- [ ] ELECDSN-CK-CONSISTENCY-01-02 — Every explicitly set `webPreferences` key is audited against the pinned Electron major's default.
- [ ] ELECDSN-CK-CONSISTENCY-01-03 — `nodeIntegration: false`, `contextIsolation: true`, and `sandbox: true` are preserved for every renderer.

### ELECDSN-SC-CONSISTENCY-02 — Rule violation: the project stack is migrated without cause

This skill permits departing from a Preference only with evidence, and the build stack is a Preference with
consumers across development, testing, and release. The expected outcome preserves the working package
manager, bundler, module format, and packaging tool; a migration justified by taste is the failure.

#### Checklist

- [ ] ELECDSN-CK-CONSISTENCY-02-01 — The established package manager, bundler, module format, and packaging tool are preserved unless a measured defect or a required capability justifies migration.
- [ ] ELECDSN-CK-CONSISTENCY-02-02 — Main, preload, and renderer keep separate source roots and build targets with process-correct libraries.

## Risk

### ELECDSN-SC-RISK-01 — Normal case: activated content is closed by independent controls

Permissions, navigation, new windows, webview attachment, external URLs, and custom protocols are separate
surfaces, and installing one control closes only its own. The expected outcome applies default-deny controls
to every relevant and later-created session, partition, and web contents; one uncovered surface is the failure.

#### Checklist

- [ ] ELECDSN-CK-RISK-01-01 — Both `setPermissionCheckHandler` and `setPermissionRequestHandler` are installed with default denial on every relevant and later-created session and partition, using requesting and embedding origin evidence where available.
- [ ] ELECDSN-CK-RISK-01-02 — `will-navigate`, `will-frame-navigate`, and `will-redirect` are each covered on every relevant and later-created web contents.
- [ ] ELECDSN-CK-RISK-01-03 — `setWindowOpenHandler` is installed on every relevant and later-created web contents.
- [ ] ELECDSN-CK-RISK-01-04 — `will-attach-webview` validates the requested URL, preload, unsafe `webPreferences`, and owning session or partition before attachment.
- [ ] ELECDSN-CK-RISK-01-05 — Every external URL is admitted through a parsed, closed allowlist.
- [ ] ELECDSN-CK-RISK-01-06 — Every custom-protocol path is decoded, normalized, resolved, and proven to remain beneath an allowed canonical root before it is read.

### ELECDSN-SC-RISK-02 — Edge case: a renderer loads content from a secure remote source

The product needs remote content, so the renderer no longer loads only packaged local files. The expected
outcome restricts loading to packaged local files or secure-protocol remote sources and delivers a restrictive
CSP through the actual delivery path; an assumed policy that no response carries is the failure.

#### Checklist

- [ ] ELECDSN-CK-RISK-02-01 — Every renderer document or response is loaded from a packaged local file or a secure-protocol remote source.
- [ ] ELECDSN-CK-RISK-02-02 — Every renderer document or response carries a restrictive CSP through its actual delivery path, whether a response header or a document meta tag.

### ELECDSN-SC-RISK-03 — Adversarial: the privileged side trusts a fact the caller controls

A handler authorizes by a value the renderer supplied, or reads sender facts after asynchronous work has let
the frame change. The expected outcome captures sender evidence synchronously and validates every payload in
the privileged process; a check that a caller can shape or outlive is the failure.

#### Checklist

- [ ] ELECDSN-CK-RISK-03-01 — Every privileged handler captures its sender evidence synchronously, before the first asynchronous suspension.
- [ ] ELECDSN-CK-RISK-03-02 — Every privileged handler rejects a missing, detached, or untrusted frame.
- [ ] ELECDSN-CK-RISK-03-03 — Every privileged handler validates payload values at runtime rather than relying on a TypeScript type.
- [ ] ELECDSN-CK-RISK-03-04 — No authorization decision rests on a value the calling renderer supplies.

## Overall

### ELECDSN-SC-OVERALL-01 — Normal case: the design settles posture, ownership, and failure together

A complete design states the security posture, the owner of every long-lived resource, and the behavior of
each failure and platform difference. The scenario fails when an unresolved security deviation remains, or
when the design claims more than the decisions it actually settled.

#### Checklist

- [ ] ELECDSN-CK-OVERALL-01-01 — Every design decision names the owner of its failure, disposal, restart, and operating-system difference.
- [ ] ELECDSN-CK-OVERALL-01-02 — No security-reducing deviation remains without documented user authority and matching verification.
- [ ] ELECDSN-CK-OVERALL-01-03 — The design's claim is no broader than the postures, contracts, and ownership it settles.

### ELECDSN-SC-OVERALL-02 — Adversarial: secure defaults presented as a finished posture

Isolation, a sandbox flag, and a `contextBridge` surface are present, so the design is offered as secure while
a channel still accepts arbitrary input or a control covers only the first session. The expected outcome keeps
each claim inside what its own setting establishes; the appearance of a secure default accepted as the posture
is the failure.

#### Checklist

- [ ] ELECDSN-CK-OVERALL-02-01 — No secure default is treated as proof of a property it does not establish: `contextIsolation` of payload validation, `sandbox` of sender authorization, a `contextBridge` surface of channel narrowness, a preload wrapper of default-deny coverage, and a TypeScript contract of a runtime-validated value.
- [ ] ELECDSN-CK-OVERALL-02-02 — Every claimed control is established by its own evidence rather than inferred from another installed control.
