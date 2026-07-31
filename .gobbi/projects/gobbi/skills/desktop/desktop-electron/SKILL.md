---
name: desktop-electron
description: "Use when writing or reviewing Electron platform code, configuration, process boundaries, privileged bridges, window lifecycle, native integration, builds, or packages."
allowed-tools: Read, Grep, Glob, Bash, WebSearch, WebFetch
skill-type: tool
---

# Desktop Electron

This tool manual is for agents writing or reviewing Electron JavaScript or TypeScript platform code and configuration. It owns the process, trust, lifecycle, build, and packaged-runtime facts needed to use the Electron versions selected and supported by the project.

It does not own complete application delivery, general JavaScript or TypeScript practice, renderer-framework practice, interface design, release judgment, or generic evaluation. `desktop-delivery` owns the complete outcome, while `desktop-release` owns release evidence and default judgments.

## Principles

### Place code by authority

Choosing a process is a trust decision before it is a code-organization decision. Keep machine authority away from content and expose only the capability the renderer needs.

### Treat the renderer as compromised

A renderer is web content even when the team wrote it. Its bridge calls, URLs, permission requests, and payloads are untrusted input at the main-process boundary.

### Test the runtime that ships

Development and packaged applications use different paths, resources, identities, and native artifacts. A development run cannot prove an installed-artifact property.

### Let the selected version decide

Electron behavior moves with Chromium, Node.js, and Electron itself. Resolve version-sensitive questions from the project's selected version and current official documentation.

## Rules

- **MUST declare** the owning process and target before writing Electron code, and keep main, preload, renderer, and utility builds separate, with separate applicable type environments when the subject is typed. A green combined build or type check does not prove correct placement.
- **MUST preserve** context isolation and renderer sandboxing, keep Node integration off, and deny privileged remote or untrusted content. Treat every `webPreferences` deviation as a security decision.
- **NEVER expose** `ipcRenderer`, Electron objects, internal events, or generic send/invoke functions through `contextBridge`. Expose a narrow, explicit application API with one operation per intended authority.
- **MUST capture and validate** the main-process IPC sender before the first asynchronous boundary, rejecting a missing, detached, or disallowed frame. Validate every payload at runtime before producing an effect.
- **MUST deny by default** permissions, navigation and redirects, new windows, external URLs, and protocol inputs. Parse inputs, compare the exact identity relevant to the scheme, and reject parse failures.
- **NEVER keep** privileged OS access or secrets in a renderer, or treat source, development, or unsigned output as packaged-runtime evidence. If protected storage is unavailable or degraded, fail closed rather than store a secret weakly.

## Manual

### Compatibility and owner boundary

Electron is the named desktop runtime; its version is the one selected and supported by the project. Before an upgrade or when an API, default, event, or platform behavior is uncertain, check the selected version against Electron's current [Process Model](https://www.electronjs.org/docs/latest/tutorial/process-model) and [Security guidance](https://www.electronjs.org/docs/latest/tutorial/security); review the intervening breaking changes one major at a time.

This manual owns Electron-specific build, packaging, signing, and update mechanisms. It stops where `desktop-delivery` begins complete-outcome coordination and where `desktop-release` begins target and obligation selection, mechanism choice, readiness, publication, and update-policy judgments.

### Process and placement

Electron's current [Process Model](https://www.electronjs.org/docs/latest/tutorial/process-model) defines main and renderer as distinct processes, preload as privileged code attached to a renderer, and utility processes as Node.js workers created by main.

| Surface | Runtime and trust | Put here | Keep out |
|---|---|---|---|
| Main | Node.js; highest application authority | app lifecycle, windows, IPC handlers, filesystem and OS access, protocol/session policy | UI rendering, content-derived decisions without validation, blocking or crash-prone computation |
| Preload | privileged code inside a renderer process | `contextBridge` adapter, literal channel calls, payload-only event adapters | business logic, broad Node/Electron exposure, filesystem paths or secrets |
| Renderer | browser-like and untrusted | DOM, presentation, user interaction, calls to the declared bridge API | Electron imports, Node globals, credentials, direct filesystem or shell access |
| Utility | separate Node.js child with explicit communication | CPU-intensive, crash-prone, or deliberately isolated work | window lifecycle, implicit main state, direct renderer authority |

Give each surface its own source root, runtime/module/build environment, entry point, and build target. When a surface is typed, give it a separate type environment with process-appropriate Electron types. A file that needs capabilities from two rows usually belongs behind an explicit message contract, not in a widened target.

### Privilege and content posture

Keep local trusted application content separate from remote or otherwise untrusted content. Electron's current [Security guidance](https://www.electronjs.org/docs/latest/tutorial/security) requires context isolation and sandboxing, prohibits Node integration for remote content, and warns that arbitrary untrusted content is a severe risk.

- Retain a restrictive Content Security Policy, keep `webSecurity` enabled, and keep `allowRunningInsecureContent` disabled, as recommended by Electron's current [Security guidance](https://www.electronjs.org/docs/latest/tutorial/security). Justify every other `webPreferences` option against the selected Electron version.
- Give every `webContents` and session its own reviewed content and permission posture.
- Keep filesystem, shell, dialog, credential, updater, and other native effects in main or a narrowly tasked utility.
- Keep secrets out of source, renderer state, logs, IPC events, packaged resources, and ASAR archives.
- Check the protected-storage backend and its failure signal before persisting a secret; no backend or weak fallback means no persistence.

### Bridge and IPC

Treat the bridge as a public capability API:

1. Name operations by application intent, not by Electron primitive.
2. Expose one function per allowed request and return only serializable application data.
3. For subscriptions, pass payload data only and return an explicit disposer.
4. Keep channel names literal or shared by a contract that cannot add arbitrary channels at runtime.
5. Review every added method as added renderer authority.

In main, each handler follows one order: synchronously capture the sender frame and its URL facts; deny a missing or detached frame; parse and match its allowed identity; narrow the payload from `unknown`; then perform the effect. Electron's [Security guidance](https://www.electronjs.org/docs/latest/tutorial/security#17-validate-the-sender-of-all-ipc-messages) requires validating every IPC sender because frames, including child frames, can invoke main handlers.

Do not defer the sender read until after an `await`: navigation can invalidate or replace the frame whose authority is being checked. TypeScript annotations do not validate a runtime IPC payload.

### Navigation, permissions, and external effects

Start from denial and add the smallest literal allowlist:

| Surface | Decision key | Required denial |
|---|---|---|
| Permissions | requesting origin, permission, and session | unknown origin, capability, or session |
| Navigation and redirects | event coverage plus parsed destination identity | subframe, redirect, programmatic, malformed, or off-allowlist destination |
| New windows | every created `webContents` | any request not explicitly redirected to an allowed behavior |
| External URLs | trusted caller plus parsed destination protocol and authority | user-controlled, malformed, or unapproved scheme |
| Custom protocols and deep links | exact parsed protocol, host/authority, and allowed route | unknown authority, route, argument, or parse failure |

Electron's current [`webContents` event contract](https://www.electronjs.org/docs/latest/api/web-contents) makes `will-navigate` main-frame-only, `will-frame-navigate` the control for main frames and subframes, and `will-redirect` the control for server redirects. Programmatic navigation APIs such as `webContents.loadURL` and `webContents.back` bypass the first two events, so validate each programmatic navigation decision at its caller; a resulting server redirect still enters `will-redirect`.

Use exact parsed identities: tuple-origin schemes normally compare the full origin, while a non-special custom scheme needs its exact protocol and host or authority. Electron's [Security guidance](https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation) rejects string-prefix URL checks; also never allowlist the opaque `"null"` origin or pass unvalidated renderer-controlled data to `shell.openExternal`, `loadURL`, protocol handlers, or native paths.

Install permission policy on every session that can load content. Register navigation, redirect, and window-open policy for every `webContents`; a correct handler on the first window does not protect later windows or embedded views.

### Window lifecycle and native integration

Model lifecycle explicitly rather than relying on incidental event order:

| Moment or mode | Required decision |
|---|---|
| Initial synchronous evaluation | acquire the single-instance lock; attach launch-time deep-link and open-file listeners; arrange cleanup ownership |
| Application ready | create windows and readiness-dependent native resources; install session-dependent policy |
| All windows closed | choose whether to quit; Electron's [Process Model](https://www.electronjs.org/docs/latest/tutorial/process-model#application-lifecycle) shows the ordinary non-macOS quit convention |
| Activation with no window | restore or create the primary window according to the platform contract |
| Second instance or deep-link/file delivery | parse untrusted input, route it to the primary instance, focus deliberately, and preserve cold-start input |
| Shutdown or window close | unregister shortcuts/listeners, stop workers, release native handles, and close manually owned child `webContents` |

Record macOS, Windows, and Linux behavior separately for launch inputs, application activation, tray/menu behavior, protocol registration, and native API failure signals. Read returned booleans, error strings, backend states, and failure events; a non-throwing call is not necessarily a successful one.

### Build and packaged runtime

Build main, preload, renderer, and any utility process as separate targets with runtime-correct module formats and globals. When a target is typed, give it process-appropriate Electron types and verify its type result separately. Bundle each preload into an artifact that can execute within the selected Electron sandbox, and inspect the emitted bundle for accidental imports outside that surface.

Make development and packaged renderer paths explicit. The packaged entry, preload path, application resources, native dependencies, and protocol identities must resolve from installed locations rather than source-tree or dev-server assumptions.

Electron's [Application Packaging guide](https://www.electronjs.org/docs/latest/tutorial/application-distribution) distinguishes application resources and optional ASAR layout from the development tree. Treat ASAR as packaging, not secrecy or an authorization boundary; unpack or rebuild native dependencies as required for Electron's ABI and the target platform.

Packaging creates the distributable, signing establishes publisher and artifact integrity, and updating delivers a later release; they are separate systems. Electron's [Updating Applications guide](https://www.electronjs.org/docs/latest/tutorial/updates) also shows that update metadata and artifacts vary by platform, so `desktop-release` owns their chosen mechanism and acceptance evidence.

Set the intended [fuse posture](https://www.electronjs.org/docs/latest/tutorial/security#19-check-which-fuses-you-can-change) during packaging and before signing, then read it back from every installed artifact. Verify the installed application—not only unpackaged output—for boot, preload loading, packaged resources, native modules, deep links, protocol registration, absence of development URLs and credentials, signing state, and update behavior.

### Failure diagnosis

| Symptom | Inspect first |
|---|---|
| Renderer cannot import Node or Electron | correct result for renderer; move the capability behind the bridge |
| Preload boots in development but fails packaged | emitted preload format, bundled dependencies, configured path, sandbox-compatible imports |
| IPC fails during navigation or accepts the wrong caller | sender capture position, missing/detached branches, exact parsed identity, payload narrowing |
| A later window bypasses policy | per-`webContents` and per-session registration coverage |
| Packaged window is blank or assets disappear | packaged entry, custom-protocol mapping, router behavior, resource paths, dev-only assumptions |
| Native dependency loads locally but not installed | Electron ABI, target architecture, rebuild output, ASAR unpacking, packaged resource location |
| Cold-start link or file is lost | listener and single-instance-lock timing, platform delivery route, preserved startup arguments |
| Native feature silently does nothing | platform support, return value, failure event, permission/entitlement, signing, cleanup lifetime |
| Update works on one target only | platform/architecture metadata, signed artifact identity, feed/channel selection, installed-version path |

Diagnose in that order: placement, trust guard, lifecycle timing, build output, then installed artifact. Avoid weakening sandboxing, broadening the bridge, or bypassing validation to make a symptom disappear.

### Evidence to collect

- Selected Electron version and the current official pages used for every version-sensitive decision.
- Process map, per-target build results, type environments and type-check results when the subject is typed, window `webPreferences`, and emitted preload inspection.
- Bridge surface, IPC channel contract, synchronous sender checks, payload validators, and denial tests.
- Session, navigation, redirect, window-open, external-URL, custom-protocol, and deep-link allowlists with negative cases.
- Lifecycle traces for cold start, activation, second instance, open-file/deep-link delivery, window closure, and cleanup on each supported OS.
- Installed-artifact results by platform and architecture: resources, native modules, fuses, credentials scan, signing state, update path, and development-literal scan.
- Upgrade evidence from the selected old and new versions, including current security guidance and each intervening breaking change.

## References
