---
name: electron-runtime
description: "MUST load when looking up Electron process capabilities, preload constraints, IPC mechanics, lifecycle behavior, native integrations, or platform-specific failures."
allowed-tools: Read, Grep, Glob, Bash
skill-type: tool
---

# Electron Runtime

Use this manual for direct lookup while designing, implementing, or diagnosing Electron platform behavior. Bind every lookup to the project's pinned Electron major, emitted module format, target operating system, and actual process.

This tool explains mechanisms and failure signals. Security posture and default choices belong to `electron-design`; implementation, test, and release procedures belong to their operation skills.

## Principles

### Capability determines placement

Start from the process that can safely own the capability. Cross a process boundary through a narrow contract instead of moving privilege into a renderer.

### Runtime evidence outranks source appearance

Inspect emitted files, actual URLs, process identity, readiness, ownership, and documented return values. Similar TypeScript source can run under different Electron loaders and privileges.

### Cross-process values are data

Inter-process communication (IPC) uses cloneable values and explicit methods. Functions, prototypes, symbols, Electron event objects, and other privileged handles do not become safe data by crossing a bridge.

### Live documentation follows the pinned major

Use current official guidance to find the mechanism, then confirm availability and behavior for the application's pinned Electron major. Do not infer a static version from this manual.

## Rules

- **MUST identify the actual process, pinned Electron major, emitted module format, operating system, URL, and lifecycle point before diagnosing a runtime symptom.**
- **MUST keep main-only, renderer-only, and common Electron APIs in valid processes and treat TypeScript process aliases as type-surface aids, not a runtime security boundary.**
- **MUST wrap every IPC or context-bridge crossing in explicit data and method contracts, including callback disposal and structured-clone limits.**
- **MUST inspect readiness, duplicate registration, window or view ownership, and cleanup before adding retries or global state to a lifecycle failure.**
- **NEVER treat a native call as successful merely because it did not throw.** Check its cancellation field, Boolean, error string, support probe, callback, or failure event.
- **MUST consult the live official API and breaking-change documents when the pinned major differs from the code's original major or the observed behavior conflicts with this manual.**

## Manual

### Process capabilities and placement

The official [process model](https://www.electronjs.org/docs/latest/tutorial/process-model) is the source for current placement and TypeScript alias support.

| Process | Normal capabilities | Place here | Avoid |
|---|---|---|---|
| Main | Full Node.js and main-process Electron APIs; app lifecycle; windows; sessions; native integration | Privileged services, lifecycle coordination, handler registration, window and session ownership | Renderer UI work and sustained blocking computation |
| Preload | Runs in a renderer before page code; sandboxed preload has a restricted Electron and Node subset | Narrow `contextBridge` adapters, IPC translation, safe callback wrapping | Business services, secrets, arbitrary filesystem access, or raw transport exposure |
| Renderer | Chromium web platform in each web contents | Interface state, web APIs, calls to the exposed bridge | Node.js, main-process APIs, secrets, or direct operating-system authority |
| Utility | Node.js environment launched and owned by main; can use MessagePorts | CPU-intensive, crash-prone, untrusted-service, or independently restartable privileged work | App and window lifecycle ownership |

For TypeScript, use `electron/main` for main-process types, `electron/renderer` for renderer-process types, and `electron/common` for APIs valid in both where the pinned package and toolchain support them. These aliases narrow typechecking and autocomplete; they do not change runtime authority. A normal sandboxed renderer consumes its preload bridge rather than importing Electron.

### Sandboxed preload and module loading

Check the official [sandbox](https://www.electronjs.org/docs/latest/tutorial/sandbox/) and [ES module](https://www.electronjs.org/docs/latest/tutorial/esm) guidance against emitted output, not source syntax.

| Context | Loader and constraint | Diagnostic consequence |
|---|---|---|
| Sandboxed preload | Plain JavaScript with a polyfilled `require` limited to allowed Electron renderer modules plus `events`, `timers`, `url`, and matching `node:` forms | General Node or external package imports fail; bundle needed dependencies into one preload output |
| Sandboxed preload with ESM output | Electron does not provide an ESM context | Static `import` fails; emit a compatible CommonJS preload rather than disabling the sandbox |
| Unsandboxed preload | Node loader is available, but native ESM preload requires `.mjs` and ignores package `"type"` | A `.js` ESM preload may not load; empty response bodies can expose preload/page-load ordering races |
| Renderer page | Chromium ESM loader | Node built-ins and direct `node_modules` resolution are unavailable; use a renderer bundler for client-safe packages |
| Main or utility | Node.js loader for the emitted format | Check package type, `.mjs` or `.cjs`, dynamic-import timing, and work required before `ready` |

### IPC and bridge patterns

| Need | Electron mechanism | Contract notes |
|---|---|---|
| Renderer to main, no reply | `ipcRenderer.send` with `ipcMain.on` | Use for commands where acknowledgement is not part of correctness; still validate sender and payload |
| Renderer to main, request and response | `ipcRenderer.invoke` with `ipcMain.handle` | Handler return or rejection becomes the renderer promise result; map expected errors to stable data or documented rejection |
| Main to renderer push | `webContents.send` with a preload-owned `ipcRenderer.on` listener | Strip the Electron event, validate data shape, and return a disposer from the exposed subscription |
| Bidirectional stream or high-volume messages | `MessageChannelMain`, `MessagePortMain`, and transferred ports | Define port ownership, startup handshake, close behavior, backpressure, and process-exit recovery |

IPC arguments and results use the Structured Clone Algorithm. Functions, symbols, weak collections, and Electron objects are not cloneable, and custom prototypes do not survive as domain instances. A `contextBridge` can proxy exposed functions, but the bridge should still expose one narrow domain method per permitted action.

Safe preload subscription example:

```ts
contextBridge.exposeInMainWorld('updates', {
  subscribe(onUpdate: (update: Update) => void) {
    const listener = (_event: Electron.IpcRendererEvent, update: Update) => {
      onUpdate(update)
    }
    ipcRenderer.on('updates:changed', listener)
    return () => ipcRenderer.removeListener('updates:changed', listener)
  }
})
```

Safe privileged handler shape:

```ts
ipcMain.handle('preferences:load', async (event, input: unknown) => {
  const frame = event.senderFrame
  const senderUrl = frame?.url
  if (!frame || frame.detached || !senderUrl) throw new Error('Untrusted sender')

  const sender = new URL(senderUrl)
  if (sender.protocol !== 'app:' || sender.host !== 'bundle') {
    throw new Error('Untrusted sender')
  }
  if (!isPreferencesQuery(input)) throw new TypeError('Invalid request')

  return preferences.load(input.profileId)
})
```

Capture sender facts before the first `await`; a frame may detach while asynchronous work runs. The exact origin check must match the application's closed navigation and protocol policy.

### Activated content security controls

Use the current official [Session](https://www.electronjs.org/docs/latest/api/session), [Security](https://www.electronjs.org/docs/latest/tutorial/security), and [WebContents](https://www.electronjs.org/docs/latest/api/web-contents) references to confirm signatures for the pinned major. These controls are independent; installing one does not close another surface.

| Surface | Current mechanism | Minimum closure | Failure or coverage consequence |
|---|---|---|---|
| Renderer content and CSP | Packaged local content or secure remote protocols; `Content-Security-Policy` response header or document meta tag | Give every renderer response or document a restrictive CSP and load no insecure remote source; confirm the delivery path against the pinned major's [Security guidance](https://www.electronjs.org/docs/latest/tutorial/security) | Insecure transport or an absent or weak CSP exposes privileged desktop impact to content injection |
| Explicit `webPreferences` | Window or view factory options compared with the pinned Electron defaults | Audit every explicitly set key; `webSecurity: false`, `allowRunningInsecureContent: true`, `experimentalFeatures: true`, `enableBlinkFeatures`, or another security reduction requires documented user authority and matching verification | A stale default assumption or unreviewed option silently weakens every created renderer |
| Permission check | `session.setPermissionCheckHandler` | Default-deny on every relevant session or partition; evaluate permission, requesting origin, embedding origin, URL, and frame facts when supplied | A check can bypass a request-only policy |
| Permission request | `session.setPermissionRequestHandler` | Default-deny on every relevant session or partition; validate the requesting web contents and origin facts before invoking the callback | A request can bypass a check-only policy |
| Main, subframe, and redirect navigation | `will-navigate`, `will-frame-navigate`, `will-redirect` | Parse each target through a closed allowlist and prevent disallowed navigation on every current or later-created `webContents` | Omitting one event leaves its navigation path open |
| Renderer-created windows | `webContents.setWindowOpenHandler` | Install on every current or later-created `webContents` and deny unless the parsed target is allowlisted | A secondary view or later window can create an unchecked child |
| Webview attachment | `will-attach-webview` | Before attachment, validate `params.src`, requested partition, preload, and unsafe `webPreferences` against the owning `webContents` and session | DOM-created guests can select an unsafe origin, preload, preference, or partition |
| Lifetime and partition coverage | `app.on('web-contents-created')` and `contents.session` | Apply per-`webContents` controls and idempotently configure each distinct session, including secondary partitions and guests | Protecting only the first window or default session creates an unguarded surface |
| External and custom protocols | Gate `shell.openExternal` and protocol handlers | Use parsed, closed external-URL allowlists; decode, normalize, resolve, and prove canonical-root containment before custom-protocol reads | String checks can permit unintended schemes, origins, or traversal |

### Readiness and lifecycle

| Boundary | Required ordering |
|---|---|
| Module evaluation | Register privileged custom schemes and listeners that must catch early `open-url` or `open-file` delivery before `ready` |
| Single-instance decision | Call `app.requestSingleInstanceLock()` before creating normal application state; quit the losing instance |
| `app.whenReady()` | Register session-dependent handlers, protocol handlers, shortcuts, and create the first window after readiness |
| `window-all-closed` | Quit on platforms where closing all windows ends the app; preserve the project’s macOS behavior |
| `activate` | Recreate a missing window for the platform behavior the product supports |
| Window or view close | Remove owned listeners and references, cancel work, and close manually owned web contents |
| `before-quit` and `will-quit` | Mark intentional shutdown, stop new work, dispose resources, and unregister global integrations |

Async main-process ESM initialization that must precede `ready` needs top-level `await` or another explicit ordering barrier. Dynamic import without `await` can let readiness win the race.

### BrowserWindow and composed views

`BrowserWindow` owns one web contents and destroys it when the window is destroyed. Use its window and `webContents` events to clear references, subscriptions, and pending work.

`BaseWindow` can compose multiple `WebContentsView` instances, but removing a view does not automatically destroy a manually created web contents. Keep one owner map and call `view.webContents.close()` during replacement or window teardown to prevent leaks.

### Single instance and deep links

| Platform path | Startup mechanism |
|---|---|
| First instance | Acquire the single-instance lock, register early link or file listeners, then create state and windows after readiness |
| Windows or Linux cold start | Parse the approved deep-link argument from `process.argv`, after excluding launcher and development noise |
| Windows or Linux second start | Receive `second-instance`, validate the delivered command line and working directory, then focus or create the owned window |
| macOS cold or running app | Register `open-url` and `open-file` before readiness, call `preventDefault()` when handled, queue validated input until services are ready |

Use one validated delivery function for cold start and later delivery. Closed allowlists for protocol, host, route, and payload remain a convention requirement.

For the pinned major, current [Deep Links guidance](https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app) says macOS and Linux protocol registration works only in a packaged application; a command-line development launch cannot verify it.

### Native integrations and explicit outcomes

| Integration | Success or failure signal to inspect |
|---|---|
| `dialog.showOpenDialog` or `showSaveDialog` | Check `canceled` before using paths; an empty path set is not a selection |
| `shell.openPath` | The promise resolves to an empty string on success and an error string on failure |
| `shell.openExternal` | Reject untrusted or non-allowlisted URLs before the call; handle promise rejection |
| `globalShortcut.register` | Check the Boolean result; another application may own the accelerator without an exception |
| `Notification` | Check support where applicable and handle the `failed` event; current [Notifications guidance](https://www.electronjs.org/docs/latest/tutorial/notifications) says macOS notification events require code signing and calls from unsigned applications emit `failed` |
| `safeStorage` | Check encryption availability and, on Linux, the selected backend before treating stored data as protected |
| Tray, menu, dock, or taskbar action | Keep the object alive for its required lifetime and branch on platform availability; on Linux, current [Tray guidance](https://www.electronjs.org/docs/latest/api/tray) requires `tray.setContextMenu()` again after mutating individual menu items |

### Expected errors and diagnosis

| Symptom | Likely boundary | Inspect first |
|---|---|---|
| API is undefined or import fails | Wrong process or incompatible emitted format | Actual process, process alias, output module format, extension, package type |
| Preload never exposes the bridge | Preload path, sandbox, or loader mismatch | Packaged/development path, emitted file, console error, sandbox ESM constraints |
| Handler never fires or fires twice | Registration or channel ownership | Readiness, duplicate registration, channel constant, disposed windows, reload behavior |
| Authorized call later loses sender | Asynchronous lifecycle race | Whether sender URL and frame state were captured before `await`; frame destruction |
| Works in development only | Packaging boundary | Entry paths, resource inclusion, ASAR location, native module rebuild, custom protocol |
| Window, view, or listener leaks | Missing owner or teardown | Reference map, `closed` or destroyed events, subscription disposers, manually owned web contents |
| Deep link is dropped or duplicated | Startup ordering | Early listeners, lock ownership, queued cold-start input, second-instance route |
| Native operation silently does nothing | Explicit result ignored | Boolean, error string, cancellation field, support probe, platform failure event |

## References
