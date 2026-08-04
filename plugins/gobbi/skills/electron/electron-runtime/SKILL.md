---
name: electron-runtime
description: "MUST load when looking up or diagnosing Electron process capabilities, preload constraints, IPC mechanics, application lifecycle, power events, window and process failures, operating-system integrations, or version-specific behavior."
allowed-tools: Read, Grep, Glob, Bash
skill-type: tool
---

# Electron Runtime

Use this tool manual to look up or diagnose Electron mechanisms in main, preload, renderer, and utility
processes. Start with the actual process, emitted module format, target operating system, lifecycle point, and
the project's pinned Electron major.

This skill explains mechanism availability, prerequisites, signals, target limits, and the earliest failure
boundary. It does not own installed product behavior, source implementation, test design, test execution,
test interpretation, environment classification, evidence acceptance, diagnostic-emission design, packaging
procedure, or release-readiness decisions.

## Principles

### Runtime facts precede source appearance

An import, type, or code path can exist while its runtime prerequisite is absent. Identify the executing
process, loader, target operating system, and lifecycle state before interpreting source.

### Diagnose the earliest explanatory boundary

Prefer the first missing prerequisite or failed transition that explains all later symptoms. Keep downstream
effects as consequences, not separate causes.

### Cross-process communication has value and lifetime limits

Every IPC value crosses a serialization or proxy boundary. Every listener, bridge, and transferred port also
has an owner and an end condition.

### Live authority follows the pinned major

Electron mechanisms change across majors and targets. Current official Electron documentation plus the
project's pinned major is the authority for version-sensitive claims.

## Rules

- **MUST identify the pinned Electron major, executing process, emitted module format, target operating system,
  relevant input or URL, and lifecycle point.** Leave any missing fact unresolved rather than guessing it.

- **MUST verify version-sensitive claims against current official Electron documentation and the pinned
  major.** State every prerequisite and unsupported target that affects the answer.

- **MUST keep the answer inside runtime mechanism or diagnosis.** Keep installed product behavior, source
  implementation, test design, test execution, test interpretation, environment classification, evidence
  acceptance, diagnostic-emission design, packaging procedure, and release-readiness decisions outside this
  manual.

- **MUST account for IPC and `contextBridge` crossings.** Name the value shape, direction, serialization or
  proxy behavior, owner, lifetime, disposal point, and transferred-port state when each applies.

- **MUST inspect readiness, listener timing, single-instance state, window and `webContents` ownership, and
  teardown order.** Distinguish cold launch from an already-running application.

- **NEVER infer support or success from a non-throwing call, available type, development behavior, or behavior
  on another operating system.** Use the documented Boolean, rejection, cancellation value, error string,
  event, probe, or external prerequisite.

## Manual

### 1. Build the lookup record and set the compatibility boundary

Record the runtime facts before selecting an API or explaining a symptom.

| Fact | Record |
|---|---|
| Electron identity | Installed version, pinned major, and relevant breaking-change interval |
| Target | Exact operating system, version, session type, and packaged or development launch |
| Process | Main, preload, renderer, utility, or external observer |
| Loader | Emitted CommonJS or ESM, file extension, sandbox state, and bundle boundary |
| Lifecycle | Module evaluation, before ready, ready, running, quitting, suspended, or failed |
| Owner | Object or process that owns the listener, window, `webContents`, port, or child |
| External prerequisite | Registration, desktop environment, portal, permission, policy, or launcher input |

Use the [process model](https://www.electronjs.org/docs/latest/tutorial/process-model) to establish process
roles. Use the [`app` API](https://www.electronjs.org/docs/latest/api/app) for lifecycle semantics. Check the
[breaking-changes index](https://www.electronjs.org/docs/latest/breaking-changes) for the interval between the
pinned major and current documentation. A page labeled “latest” does not prove behavior in the pinned major.

When the installed version and lockfile disagree, keep both facts visible. The runtime version explains the
observation; the project pin explains the intended compatibility boundary.

### 2. Determine process capabilities and runtime imports

| Process | Runtime capabilities to verify |
|---|---|
| Main | Electron main-process modules, Node.js, application lifecycle, windows, and operating-system APIs |
| Preload | The renderer's preload context, sandbox restrictions, `contextBridge`, and the emitted loader format |
| Renderer | Web APIs by default; Electron or Node.js access only when an explicit configuration supplies it |
| Utility | A separately spawned Node.js service process, its entry module, message channel, and parent-owned lifetime |

TypeScript path aliases and editor resolution do not change runtime resolution. Verify the emitted import
specifier and the loader that consumes it. Keep exact runtime identifiers exact: `process.platform` reports a
Node.js target code, while `nativeImage` is an Electron module namespace. Neither name proves that an
operating-system service is present or configured.

For an “API is undefined” symptom, first locate the executing process. Then inspect the import source,
sandbox state, context-isolation boundary, and emitted file. A process mismatch usually explains more than a
downstream null check.

### 3. Resolve preload sandbox and module-loading constraints

Use the [sandbox guide](https://www.electronjs.org/docs/latest/tutorial/sandbox) and
[ES modules guide](https://www.electronjs.org/docs/latest/tutorial/esm) together.

| Runtime shape | Constraint |
|---|---|
| Sandboxed preload | Its limited `require` supports only the documented subset; bundle other dependencies into the preload output |
| Sandboxed preload with ESM output | Sandboxed preloads do not support ESM; emit a compatible bundled script |
| Unsandboxed ESM preload | Use the `.mjs` extension; a nearby `package.json` `type` field does not select the preload loader |
| Renderer page | ESM follows Chromium page-loading rules and the page's security and URL context |
| Main or utility entry | ESM follows Electron's documented Node.js integration and the actual file or package format |

An ESM preload can run after an empty response body finishes loading. If preload work must precede renderer
code, check whether the page response creates that race. Do not diagnose it as an IPC failure until loader
completion is known.

A sandboxed preload that imports a package successfully in development may still fail after emission. Inspect
whether the dependency was bundled, left as an external import, or resolved only by the development tool.

### 4. Trace IPC, `contextBridge`, listeners, and ports

Use the [IPC guide](https://www.electronjs.org/docs/latest/tutorial/ipc), the
[`contextBridge` API](https://www.electronjs.org/docs/latest/api/context-bridge), and the
[message-ports guide](https://www.electronjs.org/docs/latest/tutorial/message-ports).

| Need | Mechanism and boundary |
|---|---|
| Renderer command | `ipcRenderer.send` to a named main-process listener; no reply is implied |
| Renderer request | `ipcRenderer.invoke` to one `ipcMain.handle`; the returned value or thrown error crosses serialization |
| Main-process push | `webContents.send` to a renderer listener after the target `webContents` exists |
| Preload bridge | `contextBridge.exposeInMainWorld`; functions are proxied, while supported non-function values are copied and frozen |
| Long-lived channel | Transfer a `MessagePort`; start it when required, assign one owner, and close it during teardown |

Structured clone does not preserve every JavaScript value. Functions, DOM objects, Electron objects, and
custom prototypes need an explicit representation or a bridge function. Inspect the documented serialization
limit before treating the receiver as faulty.

For each listener, locate both registration and removal. A preload wrapper should return or expose a bounded
unsubscribe operation without leaking the raw event object. For each transferred port, record which process
owns the current endpoint. Transfer changes ownership; a sender cannot continue using an endpoint it no
longer owns.

If a message disappears, check in this order: sender process, channel spelling, registration time, target
identity, serialization, receiver lifetime, and disposal. For a reply failure, also check that only one
handler owns the request channel and that its promise settled.

### 5. Distinguish readiness, window lifetime, teardown, and quit

Use the [`app` lifecycle](https://www.electronjs.org/docs/latest/api/app) and
[`webContents` lifecycle](https://www.electronjs.org/docs/latest/api/web-contents) as separate timelines.

| Point | Runtime meaning |
|---|---|
| Module evaluation | Register early operating-system and single-instance listeners before a cold-launch event can arrive |
| `app.whenReady()` | Electron initialization has completed for APIs that require readiness |
| Single-instance acquisition | Decide primary or secondary ownership before creating primary windows |
| Window closure | A `BrowserWindow` owns its `webContents`; closure and destruction end that renderer target |
| Quit request | `before-quit`, window closure, `will-quit`, and `quit` have distinct cancellation and cleanup semantics |
| Teardown | Remove listeners, close ports, stop owned children, and reject or settle pending work once |

`window-all-closed` and `activate` have operating-system-specific conventions; they are not substitutes for a
declared installed behavior. When a window is recreated, use the new `webContents` identity. A stale
reference can accept a call just before destruction and still never deliver it.

When a renderer is hosted through manually composed views, identify the object that owns each `webContents`.
Do not assume every renderer belongs to a top-level `BrowserWindow`.

### 6. Trace single-instance state and four external-entry paths

Use the [`app` event reference](https://www.electronjs.org/docs/latest/api/app) and the
[deep-link guide](https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app).

| Entry path | Windows and Linux | macOS |
|---|---|---|
| Cold deep link | Read the installed launch arguments and queue the URL until ready | Register `open-url` before ready and queue its URL |
| Running deep link | The primary receives `second-instance`; use validated `additionalData` when exact data matters | The running app receives `open-url` |
| Cold file open | Windows supplies the file through `process.argv`; Linux behavior follows the configured desktop launcher | Register `open-file` before ready; it may arrive during launch |
| Running file open | Route the configured launcher or secondary-instance input to the primary | The running app receives `open-file` |

Call `requestSingleInstanceLock` before primary-window creation. The secondary instance should exit when the
lock fails. The primary receives `second-instance` only after it is ready, but its argument order can vary.
Use `additionalData` for exact application-supplied data and validate all external input.

Registration and delivery are different mechanisms. A successful handler does not prove protocol or file
registration. The deep-link guide documents packaged-only registration limits for some macOS and Linux
paths. Keep registration, launcher delivery, parsing, readiness queueing, and user-visible routing as
separate boundaries.

### 7. Interpret power, suspend, resume, and shutdown signals

Use the [`powerMonitor` API](https://www.electronjs.org/docs/latest/api/power-monitor).

| Signal | Meaning and limit |
|---|---|
| `suspend` | The system is about to suspend; work may stop before asynchronous cleanup finishes |
| `resume` | The system resumed; clocks, network state, devices, and renderer assumptions may have changed |
| `shutdown` | Documented on Linux and macOS; cancellation only attempts a delay and the app should exit promptly |
| Windows system exit | System shutdown, restart, or logout may omit normal `before-quit`, `will-quit`, and `quit` events |

Create `powerMonitor` listeners only where the API is available and early enough for the intended signal.
Treat ordinary application quit, operating-system shutdown, suspend, renderer loss, and process crash as
different event sources. One callback cannot prove coverage of the others.

After resume, re-check the resource whose continuity matters. A `resume` event proves only that the process
received the signal; it does not prove that sockets, credentials, devices, or renderer state survived.

### 8. Separate renderer, child, utility, and main-process failure

Use [`webContents`](https://www.electronjs.org/docs/latest/api/web-contents),
[`app`](https://www.electronjs.org/docs/latest/api/app),
[`utilityProcess`](https://www.electronjs.org/docs/latest/api/utility-process), and
[`crashReporter`](https://www.electronjs.org/docs/latest/api/crash-reporter).

| Failure | Earliest direct signal |
|---|---|
| Renderer exit | `render-process-gone` on the affected `webContents`, with its reason and exit code |
| Renderer hang | `unresponsive`; a later `responsive` means the same target responded again |
| Electron child exit | `child-process-gone` on `app`; its details exclude renderer processes |
| Owned utility process | Its direct `spawn`, `error`, `exit`, and `message` events |
| Main-process crash or exit | An external observer or supervisor; in-process listeners cannot run after the main process exits |

`crashReporter` uses Crashpad and should start early in each process that needs it. A main-process start can
establish collection for subsequent Electron process crashes, but collection is not a live recovery signal.
Confirm where reports are stored or uploaded and what the pinned major supports without designing a logging
or reporting policy.

A renderer crash, a navigation, a destroyed window, and a hung renderer require different interpretations.
Check `webContents.isDestroyed()`, the failure reason, the current URL, and the owning window or view before
attributing all missing messages to a crash.

### 9. Read operating-system integration outcomes explicitly

Use the current [`app`](https://www.electronjs.org/docs/latest/api/app),
[`dialog`](https://www.electronjs.org/docs/latest/api/dialog),
[`shell`](https://www.electronjs.org/docs/latest/api/shell),
[`globalShortcut`](https://www.electronjs.org/docs/latest/api/global-shortcut),
[`Notification`](https://www.electronjs.org/docs/latest/api/notification), and
[`nativeImage`](https://www.electronjs.org/docs/latest/api/native-image) API pages for the mechanisms below,
then confirm each claim against the pinned Electron major.

| Mechanism | Truthful success or failure boundary |
|---|---|
| Protocol or login registration | Read the documented Boolean or query API, then verify required installed metadata and target support |
| Electron dialog | Inspect cancellation and selected paths or button response; an empty selection is not an exception |
| Promise-based shell action | Handle rejection; for `shell.openPath()`, a non-empty returned string is the error |
| Global shortcut | Check the registration Boolean and later `isRegistered`; another application may own the key |
| Notification or portal | Check the documented support probe plus desktop environment, permission, and portal prerequisites |
| `nativeImage` creation | Inspect `isEmpty()`, size, scale factors, and the target-specific source representation |

The absence of a thrown exception proves little for APIs that report failure through another channel.
Capture the API's documented outcome before checking downstream behavior. `process.platform` selects a target
branch; it does not prove the operating-system version, desktop session, default handler, entitlement,
registry state, or policy.

For a development-only success, compare launch arguments, application identity, installed metadata,
environment variables, and working directory. Keep the missing external prerequisite visible rather than
adding a retry around the final API.

### 10. Locate the earliest explanatory boundary

| Boundary | Questions |
|---|---|
| Process | Is this code executing where the API exists? |
| Loader | Can the emitted file and every remaining import load in that process? |
| Readiness | Was the listener registered or the API called at the required lifecycle point? |
| Ownership | Is the window, `webContents`, listener, child, or port still owned and alive? |
| Target support | Does the pinned Electron major document this mechanism for this operating system? |
| External environment | Did registration, launcher delivery, permission, policy, portal, or system state satisfy the prerequisite? |

Report the mechanism, prerequisite, direct signal, target or version limit, and next unresolved fact. A good
diagnosis stops at the first boundary that explains the symptom and names the observation that would
distinguish it from the next plausible cause.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
