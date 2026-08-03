---
name: electron-design
description: "MUST load when choosing or reviewing Electron process architecture, security boundaries, project structure, preload bridges, IPC contracts, state ownership, window and view ownership, resource lifetimes, or technical failure isolation."
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
skill-type: preference
---

# Electron Design

Use this preference skill to choose or review one Electron technical design. It owns process architecture,
trust boundaries, project structure, preload bridges, IPC contracts, state and resource ownership, window and
view ownership, performance placement, and technical failure isolation.

Start from the accepted application intent and repository constraints. Resolve current API, version, process
capability, and mechanism facts through [Electron Runtime](../electron-runtime/SKILL.md) and current official
Electron documentation before making a technical choice.

This skill excludes product and interface judgment, installed application behavior and recovery promises,
source implementation, test design or execution or interpretation, environment classification, evidence
acceptance, diagnostic-emission policy, packaging, release, and delivery coordination. Rules override
Preferences; a convenient implementation or a Preference cannot justify a Rule conflict.

## Principles

### Privilege follows trust

Give each process and renderer frame only the operating-system capabilities it needs. Treat renderer content
as untrusted even when it is packaged with the application.

### Crossings are narrow contracts

Make every renderer-to-preload and process-to-process crossing explicit. Validate both the caller identity
and the values that cross it.

### Ownership includes lifetime and failure

Give state, windows, views, sessions, listeners, and requests one owner. Define creation, disposal, failure
containment, cancellation, and restart together.

### Technical judgment stays current and bounded

Base choices on the pinned Electron major, repository facts, and accepted constraints. State what the design
settles, why it is acceptable, and which changed fact would reopen it.

## Rules

- **MUST resolve every API, version, process-capability, default, and mechanism claim through Electron Runtime
  and current official Electron documentation for the pinned Electron major.** Stop when a conflict between
  the project, pinned major, and current documentation would change an API identifier, default, process
  placement, capability, security control, or resource lifetime.

- **NEVER approve a renderer security reduction without the exact affected renderer, accepted user authority,
  the incompatible required capability, and compensating controls.** Start each renderer with
  `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`, `webSecurity: true`,
  `allowRunningInsecureContent: false`, neither `experimentalFeatures` nor `enableBlinkFeatures` enabled,
  a packaged local source or an allowed secure-protocol remote source, and a restrictive Content Security
  Policy delivered by that source.

- **NEVER expose raw `ipcRenderer`, an internal Electron event, a caller-selected channel, or a generic send
  or invoke function through `contextBridge`.** Expose one narrow application-action method for each
  permitted capability, filter its arguments, and pass callbacks only the data the renderer needs.

- **MUST read and validate sender identity, URL origin, and frame role from `event.senderFrame` before
  asynchronous work, and reject a missing, destroyed, or untrusted frame at that point.** Validate every
  payload value in the privileged handler; a TypeScript type, preload wrapper, or renderer-supplied identity
  is not runtime authorization.

- **MUST give renderer documents, frames, popups, webviews, external URLs, and custom-protocol paths separate
  default-deny controls on every existing and later-created session or partition that can grant a permission,
  and every existing and later-created `webContents` that can load renderer content.** Install both
  `setPermissionCheckHandler` and `setPermissionRequestHandler`; cover `will-navigate`,
  `will-frame-navigate`, `will-redirect`, `setWindowOpenHandler`, and `will-attach-webview`; parse
  external URLs against closed allowlists; and prove decoded, normalized, resolved custom-protocol paths stay
  beneath an allowed canonical root before reading them.

- **MUST assign one technical owner to each state value, long-lived Electron resource, and failure boundary.**
  The design defines creation, mutation authority, cancellation, cleanup, restart, startup order, and
  operating-system differences that change those decisions, including explicit destruction of
  `WebContentsView.webContents` added to a `BaseWindow`.

## Preferences

### Keep the main process responsive

Prefer the main process for application lifecycle, window and view creation, IPC registration, and
coordination. Avoid synchronous IPC, blocking input/output, and sustained computation there. Prefer a utility
process for CPU-intensive work, crash-prone components, untrusted services, or independently restartable
work. Keep such work in main only when measurements and failure analysis show that another process would not
improve responsiveness or isolation. Electron documents the
[process model](https://www.electronjs.org/docs/latest/tutorial/process-model) and
[main-process performance constraints](https://www.electronjs.org/docs/latest/tutorial/performance).

### Separate code by process and capability

Prefer distinct main, preload, renderer, and utility-process source roots and build targets. Import only
libraries supported in the process where they run. Preserve an established package manager, bundler, and
module format unless a measured defect or required capability justifies a migration.

### Put each state value under one authority

Name the process that stores each state value, the callers allowed to request a change, and the event that
ends its lifetime. Prefer a single authoritative copy with snapshots or notifications across a process
boundary. Use replicated state only when the consistency rule, conflict owner, and stale-data behavior are
explicit.

### Expose application actions, not transport

Prefer methods such as `documents.open(input)` over `send(channel, payload)`. Name channel, input, response,
cancellation, and expected-error fields after their application meaning. Keep the privileged side in control
of file paths, commands, and destinations. Electron's
[context isolation guidance](https://www.electronjs.org/docs/latest/tutorial/context-isolation) recommends
one filtered method per IPC message, and the
[`contextBridge` API](https://www.electronjs.org/docs/latest/api/context-bridge) does not allow the complete
`ipcRenderer` module to cross the bridge.

### Authorize callers and validate values independently

Read `event.senderFrame` and validate its sender identity, URL origin, and frame role before the first
asynchronous suspension. Reject a missing, destroyed, or untrusted frame during that check. Electron may
return `null` when `senderFrame` is accessed after its frame navigates or is destroyed; retaining a
`WebFrameMain` object does not prove the frame's later URL or lifecycle state. Validate payload values
separately in the privileged process. Electron documents this lifetime on
[`IpcMainInvokeEvent.senderFrame`](https://www.electronjs.org/docs/latest/api/structures/ipc-main-invoke-event/).

### Centralize renderer security controls

Prefer small factories for windows, views, sessions, and protocol handlers so every creation path receives
the same defaults and disposal rules. Configure both
[`setPermissionCheckHandler` and `setPermissionRequestHandler`](https://www.electronjs.org/docs/latest/api/session)
for each session used by renderer content. Validate request origins in `setPermissionRequestHandler` through
`details.requestingUrl`. In `setPermissionCheckHandler`, validate `requestingOrigin` and optional
`details.embeddingOrigin`. Apply navigation and redirect controls to all frames, use
`setWindowOpenHandler` for renderer-created windows, and validate webview options before attachment.
Electron's
[security guide](https://www.electronjs.org/docs/latest/tutorial/security) defines these controls as separate
recommendations.

### Choose the simplest window owner that meets the composition need

Prefer `BrowserWindow` for one full-size web content because it owns the window and renderer lifecycle
together. Use `BaseWindow` with `WebContentsView` when one window must compose several web contents.
Electron's [`BaseWindow` resource guidance](https://www.electronjs.org/docs/latest/api/base-window) requires
the application to close each owned `WebContentsView.webContents`; closing `BaseWindow` does not destroy it
automatically.

### Make the judgment explicit

For each process, trust, structure, bridge, IPC, state, resource, window, view, performance, or
failure-isolation choice, state the accepted constraint, considered technical alternatives, selected option,
and reason. Classify the design as accept, revise, or reject. A justified Preference departure names its
repository fact or measurement. A Rule conflict is rejected. The handoff states settled contracts, owners,
security exceptions, open technical facts, and the conditions that reopen the decision.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
