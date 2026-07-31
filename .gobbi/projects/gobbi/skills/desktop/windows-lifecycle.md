# Desktop Outcome Projection — Windows and Application Lifecycle

This is a subordinate Desktop outcome projection. It describes the promised user experience across
application and window states; it cannot replace an applicable Electron skill or define Electron lifecycle,
window, launch, protocol, registration, loader, or operating-system mechanisms.

Before using it, **MUST load [`electron`](../electron/SKILL.md)** and:

- [`electron-convention`](../electron/electron-convention/SKILL.md) for window ownership, lifecycle defaults,
  errors, security boundaries, and native conventions;
- [`electron-development`](../electron/electron-development/SKILL.md) for implementing or reviewing window,
  lifecycle, single-instance, deep-link, or native changes;
- [`electron-runtime`](../electron/electron-runtime/SKILL.md) for current lifecycle, window, readiness,
  single-instance, deep-link, and platform-behavior lookup; and
- [`electron-test`](../electron/electron-test/SKILL.md) for recreation, restart, close, reload, single-
  instance, deep-link, platform, and packaged evidence.

Load [`electron-release`](../electron/electron-release/SKILL.md) when the claim depends on packaging,
installation, registration, or a release artifact.

## Desktop projection

Create an entry-mode and lifecycle map for every mode the outcome actually claims:

- first launch;
- ordinary relaunch;
- a second launch while the application is running;
- activation while no window is present;
- a file, link, notification, or other external request;
- a status-area or background-resident entry; and
- automatic start or another operating-system initiated entry.

For each applicable mode, record:

| Field | Outcome contract |
|---|---|
| Starting state | What is already running, visible, restored, or pending? |
| User intent | What did the person ask to happen? |
| Surface result | Which existing or new surface becomes visible, focused, or remains absent? |
| State result | What state is restored, preserved, rejected, or recovered? |
| Concurrency | What happens if the same intent arrives again or while work is incomplete? |
| Failure and recovery | What can the person perceive, refuse, retry, or undo? |
| Operating-system claim | Which targets promise this behavior, and where does the promise differ? |
| Evidence | What direct product observation and Electron test prove the claim? |

Desktop decides the intended behavior and its accessibility and safety acceptance. Give every mechanism,
timing, event, argument, process, registration, and platform fact to `electron-convention`,
`electron-development`, or `electron-runtime`, then give the actual behavior matrix to `electron-test`.

This projection is complete when every applicable entry mode reaches truthful completion or is explicitly
out of scope, each claimed platform difference is visible to the product design, and no Electron mechanism
has been defined here.
