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
  and current official Electron documentation for the pinned Electron major.** Stop on a material conflict
  between the project, the pinned major, and the current documentation instead of filling the gap from memory.

- **NEVER approve a renderer security reduction without the exact affected renderer, accepted user authority,
  the incompatible required capability, and compensating controls.** Start each renderer with
  `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`, `webSecurity: true`,
  `allowRunningInsecureContent: false`, no `experimentalFeatures`, no `enableBlinkFeatures`, a secure
  content source, and a restrictive Content Security Policy delivered by that source.

- **NEVER expose raw `ipcRenderer`, an internal Electron event, a caller-selected channel, or a generic send
  or invoke function through `contextBridge`.** Expose one narrow application-action method for each
  permitted capability, filter its arguments, and pass callbacks only the data the renderer needs.

- **MUST capture `event.senderFrame` before asynchronous work, reject a missing, destroyed, navigated, or
  untrusted sender frame, and validate every payload value in the privileged handler.** A TypeScript type,
  preload wrapper, or renderer-supplied identity is not runtime authorization.

- **MUST give renderer documents, frames, popups, webviews, external URLs, and custom-protocol paths separate
  default-deny controls on every relevant and later-created session, partition, and `webContents`.** Install
  both `setPermissionCheckHandler` and `setPermissionRequestHandler`; cover `will-navigate`,
  `will-frame-navigate`, `will-redirect`, `setWindowOpenHandler`, and `will-attach-webview`; parse
  external URLs against closed allowlists; and prove decoded, normalized, resolved custom-protocol paths stay
  beneath an allowed canonical root before reading them.

- **MUST assign one technical owner to each state value, long-lived Electron resource, and failure boundary.**
  The design defines creation, mutation authority, cancellation, cleanup, restart, startup order, and relevant
  operating-system differences, including explicit destruction of `WebContentsView.webContents` added to a
  `BaseWindow`.

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

Capture `event.senderFrame` synchronously because Electron may later return `null` after the frame
navigates or is destroyed. Check the captured frame against the allowed renderer origin and frame role, then
validate the payload in the privileged process. Electron documents this lifetime on
[`IpcMainInvokeEvent.senderFrame`](https://www.electronjs.org/docs/latest/api/structures/ipc-main-invoke-event/).

### Centralize renderer security controls

Prefer small factories for windows, views, sessions, and protocol handlers so every creation path receives
the same defaults and disposal rules. Configure both
[`setPermissionCheckHandler` and `setPermissionRequestHandler`](https://www.electronjs.org/docs/latest/api/session)
for each relevant session, using requesting and embedding origins when Electron supplies them. Apply
navigation and redirect controls to all frames, use `setWindowOpenHandler` for renderer-created windows, and
validate webview options before attachment. Electron's
[security guide](https://www.electronjs.org/docs/latest/tutorial/security) defines these controls as separate
recommendations.

### Choose the simplest window owner that meets the composition need

Prefer `BrowserWindow` for one full-size web content because it owns the window and renderer lifecycle
together. Use `BaseWindow` with `WebContentsView` when one window must compose several web contents.
Electron's [`BaseWindow` resource guidance](https://www.electronjs.org/docs/latest/api/base-window) requires
the application to close each owned `WebContentsView.webContents`; closing `BaseWindow` does not destroy it
automatically.

### Make the judgment explicit

For each material choice, state the accepted constraint, considered technical alternatives, selected option,
and reason. Classify the design as accept, revise, or reject. A justified Preference departure names its
repository fact or measurement. A Rule conflict is rejected. The handoff states settled contracts, owners,
security exceptions, open technical facts, and the conditions that reopen the decision.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
