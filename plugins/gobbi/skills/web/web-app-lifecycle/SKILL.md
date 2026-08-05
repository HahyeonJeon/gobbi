---
name: web-app-lifecycle
description: "MUST load when choosing or reviewing browser or PWA behavior for startup, readiness, restoration, foreground and background transitions, freeze or discard, offline and reconnect, service-worker updates, mixed versions, browser-managed PWA installation state, cleanup, or removal."
allowed-tools: Read, Grep, Glob, WebFetch
skill-type: preference
---

# Web App Lifecycle

Use this preference skill to choose the user-visible browser and PWA state contract for startup, restoration,
visibility changes, freeze or discard, offline and reconnect, service-worker updates, mixed versions,
browser-managed installation state, cleanup, and removal.

`web-platform` supplies browser and compatibility facts. Frontend, backend, service-worker, storage, release,
and deployment owners implement their parts; `web-development` coordinates their handoffs; and `web-testing`
owns evidence design and test execution.

This skill covers browser documents, workers, service workers, browser storage, and browser-managed PWA
installation and removal. Native installed-application behavior remains with Desktop and Electron.

## Principles

### The contract is a state graph, not a callback list

Each applicable state and transition needs an input, visible result, safe failure return, recovery owner, and
next state. Browser events and framework hooks are implementation facts, not the product contract.

### Interruption is normal runtime behavior

Backgrounding, freeze, discard, network loss, restart, and mixed versions can interrupt any assumed sequence.
The contract remains safe when memory, timers, unload work, or an in-flight result does not survive.

### Retained state carries identity and version meaning

Durable, cached, queued, and server-owned values stay distinct. Every retained value is isolated to its
identity and validated against the schema, data, and build version that can safely consume it.

### Browser scope stops at the browser boundary

Browser-managed PWA installation and removal are browser states. Native package installation, application
and process lifecycle, updater behavior, rollback, and uninstall are different Desktop and Electron contracts.

## Rules

- **MUST begin with `web-platform` facts for every supported browser, execution context, storage capability,
  service-worker capability, and browser-managed PWA state.** Keep unknown or conflicting facts explicit.
- **MUST define every applicable lifecycle transition with one semantic owner, material input, success
  output, failure or recovery return, and next handoff.** An omitted transition needs an inspected platform or
  product-scope reason.
- **MUST show an accurate loading, ready, degraded, unauthorized, failed, restored, offline, updating, or
  recovered state.** Never report readiness or completion before its required configuration, identity,
  session, data, server, or cleanup result is confirmed.
- **MUST classify every value as durable, disposable, server-owned, cached, or queued before it crosses a
  transition.** No critical server or data change may depend on background execution, a timer, or unload-time
  work completing.
- **MUST define offline and reconnect reconciliation, service-worker install and activation, mixed-client
  behavior, browser-managed installation state, cleanup, and removal where they apply.** Preserve the current
  safe state when activation, reconciliation, or removal cannot complete.
- **NEVER extend this contract to native package installation or uninstall, application, main-process,
  window, or utility-process lifecycle, signing or notarization, a native updater or channel, or native update
  rollback.** Route those concerns to `desktop-contract`, `desktop-release`, `electron-runtime`, or
  `electron-release` as applicable.

## Preferences

### PREFER the complete browser and PWA state map

PREFER the following map for every applicable target. Remove a row only when inspected platform facts or the
accepted product scope prove that it does not apply; do not infer product behavior from the browser mechanism.

| State or transition | Semantic owner | Material input | Success output | Failure or recovery return | Next handoff |
|---|---|---|---|---|---|
| Applicability and platform facts | `web-platform` | Supported browsers, execution contexts, storage/service-worker/PWA capabilities, compatibility policy | Specific supported browser state set and unavailable-capability facts | Unknown or conflicting facts remain explicit and return to platform study | `web-app-lifecycle` contract choice |
| Cold start to ready | `web-app-lifecycle` | Entry URL, configuration readiness, identity/session state, network/cache/service-worker state | Accurate loading, ready, degraded, unauthorized, or failed user-visible state | Invalid configuration or failure of a named required service returns to its owner; recoverable start offers retry or support | Active foreground, offline/degraded, or `Startup attempt stopped or failed` |
| Startup attempt stopped or failed | `web-app-lifecycle` | A named startup prerequisite is absent or invalid, the current attempt fails, or the user chooses to leave that attempt | The browser interface shows an accurate stopped or failed result for the current attempt, makes no ready claim, and preserves safe durable and server-owned state under their owners | Retry or reload starts a new cold-start attempt; prerequisite failure returns to its configuration, identity, backend, or platform owner for repair; support or leave remains available as applicable | Terminal `Startup attempt stopped or failed` for the current attempt only; owner repair, retry, or reload returns to `Cold start to ready`, while leave ends the browser visit |
| Session restoration | `web-app-lifecycle` | Durable state, URL/history, identity, storage schema, prior interruption | Restored valid state or explicit safe reset with preserved user understanding | Corrupt, stale, wrong-user, or incompatible state is contained and returned to storage/backend/security owner | Active foreground |
| Active foreground to hidden/background | `web-app-lifecycle` | Current work, pending writes or actions, buffered telemetry, visibility change | Critical state saved at its owner; safe work continues or pauses; telemetry flushes without unload dependency | An unsaved critical write or server action is blocked or recovered before relying on background execution | Background, freeze, discard, or foreground return |
| Background to foreground | `web-app-lifecycle` | Hidden duration, identity/session, network and data versions, pending work | Revalidated state and accurate resumed UI | Expired identity, stale data, or invalid pending work returns to restore/reconnect/owner recovery | Active foreground |
| Background to frozen | `web-app-lifecycle` | Current disposable and durable state, pending work, cleanup contract | No critical server or data change depends on execution while frozen; durable state can resume | Unsafe dependency on timers/unload returns to implementation owner | Resume or discard |
| Frozen to resumed | `web-app-lifecycle` | Restored execution, elapsed time, network/identity/data changes | Re-entry guards run and stale results are rejected | Re-entry or duplicate registration failure returns to implementation and contract owner | Active foreground |
| Discard or termination to restart | `web-app-lifecycle` | URL/history, durable state, server truth, previous build/version | Reconstructed safe state without assuming memory survived | Missing/corrupt state uses explicit reset, recovery, or support path | Ready or restored foreground |
| Online to offline/degraded | `web-app-lifecycle` | Connectivity loss, cached capabilities, pending reads/writes, data sensitivity | Accurate offline/degraded capability and queued-action policy | Unsupported protected-data access or server action is refused; unsafe queue returns to backend/security contract | Offline operation or reconnect |
| Offline to reconnect | `web-app-lifecycle` | Queued writes or actions, server state, identity, versions, conflicts | Reconciled results, explicit conflicts, confirmed completion, and refreshed state | A duplicate, rejected, stale, or conflicting server or data change returns to backend/product recovery | Active foreground or continued degraded state |
| Service-worker install/wait | `web-app-lifecycle` | Candidate worker, current controlling worker, cache schema, active clients | Safe installed/waiting state with explicit activation policy | Install/cache failure preserves current controller and reports recovery | Activate later or remain current |
| Service-worker activation and mixed versions | `web-app-lifecycle` | Waiting worker, old/new clients, cache/data compatibility, update policy | Controlled activation with supported old/new client behavior or explicit reload requirement | Incompatible mixed state blocks activation or returns to release/deployment/contract owner | New controlled version or current version retained |
| Browser-managed PWA installation state | `web-app-lifecycle` | Browser install availability, manifest/service-worker facts, user choice | Accurate install availability, installed state, launch/restore behavior, or unsupported state | Decline/failure leaves browser use intact and names recovery | Browser tab or installed PWA launch |
| Browser-managed PWA removal | `web-app-lifecycle` | User/browser removal event, retained web data policy, active sessions | Installed shell removed while URL-based service and data disposition remain accurate | Ambiguous retained data or a pending server or data change returns to privacy/security/backend owner | Browser-only use or terminal `PWA not installed` |
| Cleanup, logout, or identity switch | `web-app-lifecycle` | User identity boundary, caches/storage, service-worker state, pending work | User-scoped state, sensitive cache, subscriptions, and pending server or data changes are cleared or transferred by contract | Cleanup failure blocks false completion and returns to security/storage/backend owner | Ready signed-out/new-user state |
| Service-worker and browser-cache removal | `web-app-lifecycle` | Approved removal reason, registrations, caches, fallback/network behavior | Registration/cache removed without losing required recovery or current server truth | Partial removal preserves diagnosed state and repeats owned cleanup | Baseline browser runtime or terminal removed capability |
| Implementation and proof handoff | `web-development` | Accepted transition contract and platform facts | Layer ownership and test claims mapped for every applicable transition | Missing implementation or evidence owner returns to `web-app-lifecycle` | Frontend/backend/service-worker/storage/deployment implementation and `web-testing` |

### PREFER explicit state ownership before persistence

PREFER disposable memory until restoration, offline use, or interruption recovery requires something stronger.
When state persists, name its identity partition, schema or version, freshness, capacity, expiry, migration,
cleanup, conflict, and recovery contract. Keep server-owned state as the source of truth for confirmed server
or data changes.

### PREFER safe recovery over invisible continuation

PREFER an accurate degraded, blocked, reset, reload, retry, or support path when a transition cannot complete.
Make the available capability and next action understandable without exposing browser or service-worker
jargon, and preserve current confirmed state until the replacement is safe.

### PREFER an explicit browser and native boundary

PREFER these owner assignments without overlap:

| Concern | Web owner | Desktop/Electron owner |
|---|---|---|
| Browser visibility, freeze, discard, history restoration, offline/reconnect | `web-app-lifecycle` | Not applicable to native application lifecycle unless an Electron renderer separately uses those browser facts. |
| Service-worker install, activate, update, mixed clients, unregister, browser cache cleanup | `web-app-lifecycle` with `web-platform` facts | Not the native updater or application package lifecycle. |
| Browser-managed PWA install availability, installed state, launch mode, and removal | `web-app-lifecycle` | Native package installation and uninstall remain with `desktop-contract` and `electron-release`. |
| Electron main/renderer/utility process readiness, app/window lifecycle, second instance, shutdown, native integration | None | `desktop-contract`, `electron-runtime`, and applicable Electron operations. |
| Native packaged artifact, signing, notarization, updater, update channel, update rollback, installer, uninstall | None | `electron-release` plus the Desktop release/contract owners. |

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
