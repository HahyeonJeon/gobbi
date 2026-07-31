---
name: electron-design
description: "MUST load when choosing or reviewing Electron security boundaries, project organization, bridges, IPC contracts, window ownership, native behavior, errors, or platform defaults."
allowed-tools: Read, Grep, Glob
skill-type: preference
---

# Electron Design

Use this preference skill when an Electron design or implementation needs a stable default. It defines the security posture, ownership model, naming, and project-shape choices shared by development, testing, and release work.

This skill does not prescribe product experience, renderer framework idioms, test methodology, or release commands. A project may depart from a preference with evidence, but it may not depart from a rule without changing the governing contract.

## Principles

### Privilege follows the process boundary

Treat every renderer as untrusted, including renderers that load packaged local content. Keep operating-system authority, secrets, filesystem access, and process control in main or a narrowly scoped utility process.

### Capabilities are explicit contracts

Expose the smallest domain capability the renderer needs. Treat every bridge method, channel, payload, return value, and callback as part of the application's security surface.

### Secure defaults define the valid set

Start from isolation, sandboxing, and closed allowlists. Add a capability or destination only after its exact need, validation, and failure behavior are known.

### Ownership includes failure and disposal

Name the owner of windows, views, sessions, listeners, shortcuts, tray items, menus, and native requests. Define cancellation, cleanup, restart, and operating-system differences with the happy path.

## Rules

- **MUST keep privileged work in main or a bounded utility process, load renderer content only from packaged local files or secure-protocol remote sources, and expose only explicit preload capabilities.** Use a restrictive CSP for every renderer document or response, preserve `nodeIntegration: false`, `contextIsolation: true`, and `sandbox: true`, and audit every explicitly set `webPreferences` key against the pinned Electron default; any security-reducing deviation—including `webSecurity: false`, `allowRunningInsecureContent: true`, `experimentalFeatures: true`, or `enableBlinkFeatures`—is prohibited without documented user authority and matching verification.
- **NEVER expose raw `ipcRenderer`, an internal Electron event, an arbitrary channel parameter, or a generic send/invoke function to a renderer.** Wrap each permitted action in one domain-shaped bridge method and strip privileged event objects from callbacks.
- **MUST capture sender evidence synchronously, reject missing, detached, or untrusted frames, and validate payloads at runtime in the privileged handler.** TypeScript types do not validate values that crossed a process boundary.
- **MUST enforce activated content through independent, default-deny controls on every relevant and later-created session, partition, and `webContents`.** Install both `setPermissionCheckHandler` and `setPermissionRequestHandler` with requesting and embedding origin evidence where available; cover `will-navigate`, `will-frame-navigate`, and `will-redirect`; install `setWindowOpenHandler`; validate webview URL, preload, unsafe `webPreferences`, and owning session or partition at `will-attach-webview`; use parsed, closed allowlists for external URLs; and decode, normalize, resolve, and prove custom-protocol paths remain beneath an allowed canonical root before reading them.
- **MUST give every long-lived Electron resource one explicit owner and disposal path.** Remove listeners, unregister shortcuts, destroy or close owned web contents, and release tray, menu, session, and native resources when their scope ends.
- **MUST model cancellation, expected errors, startup order, and platform deltas as normal outcomes.** Inspect each native API's documented return value or failure event instead of treating the absence of an exception as success.

## Preferences

### Keep main a small coordinator

Prefer main for lifecycle, window creation, IPC registration, and orchestration. Prefer a utility process for sustained CPU work, crash-prone components, or independently restartable services; keep work in main only when measurement and failure analysis show the extra boundary adds no value.

### Preserve the project's build stack

Prefer separate main, preload, and renderer source roots and build targets with process-correct libraries. Preserve a working package manager, bundler, module format, and packaging tool unless a measured defect or required capability justifies migration.

### Name contracts by domain

Prefer bridge methods such as `documents.open()` and channels such as `documents:open` over transport names. Prefer input and result payload names that describe domain meaning, cancellation, and expected failure; follow a different established project convention when it remains narrow and unambiguous.

### Centralize privileged factories

Prefer central factories for secure windows, views, sessions, protocol handlers, and native integrations so defaults and disposal stay consistent. A tiny static application may keep creation local when every call site remains auditable and equivalent.

### Choose the simplest window owner

Prefer `BrowserWindow` for a normal single-web-content window because it owns its renderer lifecycle. Use `BaseWindow` with `WebContentsView` when the product truly needs composed views, and make manual `webContents` cleanup part of that design.

## References
