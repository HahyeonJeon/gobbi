# Electron — Renderer and React

**Owns** — the Electron↔React seam: the router-strategy fork under the packaged origin; mounting under that
origin; path resolution and the dev-works/production-breaks class as React meets it; the pattern for moving an
IPC push into React state without leaking the internal `event`; the development-only DevTools load; and the
explicit statement that general React guidance is out of scope. **Owns no load-path switch.**

**Split criterion** — a distinct decision fork ([`../skill-writing/SKILL.md`](../skill-writing/SKILL.md)): the
router strategy, what a component may hold, and where a subscription's lifetime ends are decided once, when a
React tree is first put inside a packaged renderer, and they are decided against facts no general React
document carries.

**General React work routes through the [`../react/SKILL.md`](../react/SKILL.md) domain root to its applicable
child guidance and remains out of scope here.** Nothing below is advice about writing React. Every item here
exists because the renderer is an Electron window: it loads from two different origins, it has no filesystem,
and its data arrives from another process.

This doc **deepens, and does not restate,** EL-R-11's *consequence* for the React tree. EL-R-11 itself — one
branch, no dev-server literal in the artifact — is owned by [`tooling-config.md`](tooling-config.md), the
single owner of the switch. This doc reads that load path as an input and never sets it.

| Borrowed fact | Its one owner |
|---|---|
| The single dev-vs-production renderer load-path switch, and the build wiring behind it | [`tooling-config.md`](tooling-config.md) |
| The bridge surface a component consumes, the disposer contract, and the typed `Window` augmentation | [`ipc.md`](ipc.md) |
| Why the packaged renderer is served over a custom protocol rather than `file://` | [`security.md`](security.md) |
| Why the renderer imports nothing from `electron`, and what the sandbox removes | [`process-model.md`](process-model.md) |
| ASAR itself, `app.asar.unpacked`, and what ASAR is not | [`packaging-distribution.md`](packaging-distribution.md) |
| Driving a fake bridge through a component test, and asserting the disposer ran | [`testing.md`](testing.md) |

## Contents

1. [Routing under the packaged origin](#1-routing-under-the-packaged-origin)
2. [Mounting, and the two origins](#2-mounting-and-the-two-origins)
3. [`__dirname`, ASAR, and the paths a component must never build](#3-__dirname-asar-and-the-paths-a-component-must-never-build)
4. [Moving an IPC push into React state](#4-moving-an-ipc-push-into-react-state)
5. [React DevTools is a session, not a window](#5-react-devtools-is-a-session-not-a-window)

---

## 1. Routing under the packaged origin

A packaged renderer has no server behind it. That one fact decides the router, and it decides it for a reason
no React Router page states.

**What a history router does.** `BrowserRouter` writes the location into the URL **path** with
`history.pushState`. In-session navigation is fine — `pushState` performs no load. The break is at the next
*load* of that URL: a reload, a DevTools reload, a crash restore, a deep link that opens the app at a route.
That load re-requests the path the router wrote. Under `file://` the path resolves against the filesystem,
there is no file at `…/settings`, and nothing exists to rewrite it — the rewrite a web deployment gets from
its server has no counterpart here. Under a custom protocol the same request reaches **your** protocol
handler, which returns whatever you wrote it to return.

**What a hash router does.** React Router's documentation says `HashRouter` *"stores the location in the
`hash` portion of the URL so it is not sent to the server."* The part of the URL that gets resolved as a path
therefore never changes, so every reload re-requests the same entry document and the location is restored from
the fragment after it loads.

> ***`DERIVED` — the Electron recommendation.*** The sentence quoted above is the vendor's, and it is about
> servers. **React Router's documentation never mentions `file://`, Electron, or a packaged renderer**, so the
> conclusion below is derived, not quoted. Its premises are: (1) the quoted hash behavior; (2) `file://`
> resolves a URL path against the filesystem, so a path with no file behind it fails to load; (3) a packaged
> renderer is reloaded in normal operation — DevTools, a crash restore, a deep link. That `BrowserRouter`
> breaks under `file://` follows from (2) and `pushState`'s effect on the path, not from any vendor statement
> about Electron.

**So the rule is a fork against the load path, not a single router.**

| Load path | Router strategy | Why |
|---|---|---|
| `file://`, either mode | `HashRouter`, or `MemoryRouter` when no route needs to survive a load | no rewrite exists and none can be added; the resolved path must stay constant |
| custom protocol **without** an entry-document fallback | `HashRouter` | the handler fails an unknown in-app path exactly as the filesystem does |
| custom protocol **with** a fallback that serves the entry document for unknown in-app paths | a history router is viable | the handler *is* the rewrite — but it is code you own, and it is a security surface ([`security.md`](security.md)) |
| a secondary window showing one screen, never deep-linked | `MemoryRouter` | the location never needs to survive a load, and keeping it out of the URL keeps it out of the origin |

Two consequences worth stating plainly. A `BrowserRouter` app that works in `bun run dev` proves nothing about
the packaged build, because the dev server rewrites unknown paths and hides the whole failure — that is
EL-N-01's shape applied to routing. And the third row is why "use `HashRouter`" is not itself the rule: the
decision is read off the load path, which [`tooling-config.md`](tooling-config.md) owns.

---

## 2. Mounting, and the two origins

The mount itself is ordinary React and this skill has nothing to add to it. What the mount sits inside is not
ordinary: **the renderer runs at a different origin in each mode** — the dev server's `http://` origin in
development, the packaged origin in production. Three things follow.

- **Anything in the React tree keyed on the origin comes from one constant.** A fetch base, a router
  `basename`, an allowlist the UI displays: derive them from the same constant the load-path switch uses, or
  they disagree with it in exactly one of the two modes. That constant is
  [`tooling-config.md`](tooling-config.md)'s.
- **An asset URL that resolves against a dev-server root is a different URL under the packaged origin.** The
  build's base setting is what makes the emitted URLs correct in both modes; that is build wiring, owned by
  [`tooling-config.md`](tooling-config.md), not by any component.
- **The React tree imports nothing from `electron`.** Its entire view of the main process is the object the
  preload exposed, typed by the `interface.d.ts` shape in [`ipc.md`](ipc.md). A renderer-target type-check
  rejects an `electron` import outright ([`process-model.md`](process-model.md)).

---

## 3. `__dirname`, ASAR, and the paths a component must never build

A sandboxed renderer is a browser document. It has no `__dirname`, no `require`, and no filesystem. Every path
in the application is therefore computed in the main process and reaches React as data — which is exactly
where this failure class hides.

**In main, `__dirname` moves when the app is packaged.** In a packaged build it resolves *inside* the archive
(`…/app.asar/…`). Reads through `fs` still work, because `fs` sees through ASAR; anything that hands the path
to a consumer which is not Electron's `fs` does not. A child process, a native library, a shell command, and a
URL built for the document all take the path at face value and find no such directory.

**The failure class is dev-works / production-breaks.** In development the app runs from a real directory, so
every one of those paths resolves and every one of them looks correct. The archive does not exist until the
app is packaged, so the packaged artifact is the *first* runtime in which the property is tested at all
([`packaging-distribution.md`](packaging-distribution.md) owns ASAR and the unpacked escape hatch).

**The React-side rule that follows:** a component never receives a filesystem path and never builds a URL from
one. Putting `/home/…/app.asar/logo.png` into an `src` or an `href` builds a `file://` URL inside a document
whose origin is not `file://` — it fails in the packaged app, and where it does load it is a renderer reaching
the disk directly. Send the bytes, a data URL, or a URL on the app's own protocol over the bridge instead, and
let main resolve the path on the side that has one.

---

## 4. Moving an IPC push into React state

A main → renderer push is a subscription, and a subscription has an owner with a lifetime. The bridge already
hands back the disposer that ends it — [`ipc.md`](ipc.md) owns that contract, and owns why the internal
`IpcRendererEvent` never crosses the bridge. **This section owns only the React-side consumption: the disposer
must reach the effect's cleanup, every time.**

```tsx uncompiled
// renderer. Not compiled by the example harness: no JSX runtime is installed there.
import { useEffect, useState, type JSX } from 'react';

export function ProgressBar(): JSX.Element {
  const [percent, setPercent] = useState(0);

  // `onProgress` returns its own disposer, so returning it directly makes the
  // subscription's lifetime exactly the effect's lifetime.
  useEffect(() => window.desktop.onProgress(setPercent), []);

  return <progress value={percent} max={100} />;
}
```

The shape to reject is one line different. It compiles, it renders correctly, and it passes a test that mounts
once:

```tsx uncompiled
// renderer. The same component, subscribed and never unsubscribed.
useEffect(() => {
  window.desktop.onProgress(setPercent);
}, []);
```

Nothing throws and nothing logs. Each mount adds another listener on the same `ipcRenderer` channel and none is
ever removed, so the count grows with every remount — a route change under § 1's router, a tab switch, a
development double-invoke of the effect. Every surviving listener still fires when main sends, calling
`setPercent` on a tree that is gone, and the retained closure keeps that tree's captures alive. The leak is not
local to the component: main keeps sending on a channel whose renderer-side listener list only grows.

**The check, and where it has to live.** The observable is the listener count on the channel, and the sandboxed
React tree cannot read it — `ipcRenderer` exists only in the preload. So the check is written against a fake
bridge: mount, unmount, and assert the fake's listener set is empty. [`testing.md`](testing.md) owns that fake.
Reviewing the component for "has a cleanup" is the weaker check, and it passes a cleanup that disposes a
different subscription than the one the effect created.

Two more rules for the same seam:

- **What `useState` holds is a payload, never anything read from the event.** The bridge hands over
  structured-clone data only, and a component must not ask it for "the event" — the widening happens on the
  preload side, where EL-R-08 and [`ipc.md`](ipc.md) reject it.
- **An `invoke` result can arrive after the component is gone.** It is a round trip to another process, so the
  window may have navigated or closed before main answers. Guard the state write as you would guard any async
  result; the general React pattern for doing that is out of scope here.

---

## 5. React DevTools is a session, not a window

React DevTools is a Chrome extension, and Electron loads extensions **on a session** — never on a window, and
never out of a packaged bundle. The current surface is `session.extensions.loadExtension(path)`; the older
`ses.loadExtension` is marked deprecated in favor of it
(`verified-against node_modules/electron/electron.d.ts@v43.2.0 on 2026-07-26`).

Four constraints come from that same source, and each is a real failure when it is missed:

- it **cannot be called before the `app` `ready` event**;
- it **does not support packed `.crx` extensions** — the extension must be an unpacked directory on disk;
- a loaded extension is **not remembered across boots**, so the call runs on every start;
- loading into an **in-memory (non-persistent) session throws**.

Electron also does not support the full range of Chrome extension APIs; when an extension asks for one that is
missing, the warning is **logged to the console** rather than thrown — so a partially working DevTools panel
is the expected symptom, not an error.

```ts main
import { app, session } from 'electron';

declare const REACT_DEVTOOLS_PATH: string;

void app.whenReady().then(async (): Promise<void> => {
  // Development-only wiring: it must not run, and its path must not be present,
  // in the packaged app.
  if (app.isPackaged) {
    return;
  }
  await session.defaultSession.extensions.loadExtension(REACT_DEVTOOLS_PATH);
});
```

Two Electron obligations attach to that block. It is **main-process code behind an `app.isPackaged` branch**,
so it carries the same obligation as every other dev-only branch: the packaged artifact must not contain the
literal path either ([`tooling-config.md`](tooling-config.md) owns the switch and the no-literal rule). And the
extension directory is a real directory on disk — resolving it from inside the archive is § 3's failure class.

---

## References

One owner per borrowed fact: the sections above state the local consequence, and these entries name the source
that validates it.

- [React Router](https://reactrouter.com/api/declarative-routers/HashRouter) 8.3.0 — § 1's verbatim
  *"stores the location in the `hash` portion of the URL so it is not sent to the server."*
  **Ecosystem tier**: read from the project's own documentation, not from an Electron source.
  `verified-against that page on 2026-07-25`. The same page is the evidence for the absence claim that
  **React Router's documentation does not mention `file://` or Electron**, which is why § 1's recommendation
  is marked `DERIVED` rather than attributed.
- `node_modules/electron/electron.d.ts@v43.2.0` — § 5's `session.extensions.loadExtension` surface, the
  deprecation note on `ses.loadExtension`, and all four constraints listed beside them, read from the typings'
  own documentation comments. `verified-against that file on 2026-07-26`.
- [`tooling-config.md`](tooling-config.md) — the dev-vs-production load path, the build base, and the
  no-dev-literal rule. This doc reads the load path and owns no part of it.
- [`ipc.md`](ipc.md) — the bridge surface § 4 consumes, the disposer contract, and the `interface.d.ts`
  augmentation that types `window.desktop`.
- [`security.md`](security.md) — why the packaged renderer is served over a custom protocol, and what a
  protocol handler with an entry-document fallback is responsible for.
- [`process-model.md`](process-model.md) — the sandboxed renderer's surface: no `require`, no `__dirname`, no
  `electron` import.
- [`testing.md`](testing.md) — the fake bridge § 4's check runs against.
- [`SKILL.md`](SKILL.md) — EL-R-11 and EL-N-01, whose consequences this doc carries into the React tree, and
  the supported-majors window every version claim above is read against.
