# Electron — IPC

**Owns** — the process boundary's data path: the mechanism decision across `invoke`/`handle`, `send`/`on`,
`MessagePort`, and `sendSync`; **both** serialization tables side by side — Structured Clone for IPC and the
wider `contextBridge` table; the four bridge anti-patterns; the complete `senderFrame` contract with the deny
branch for each outcome; the `interface.d.ts` typed-contract shape; and the runtime-validation-on-the-main-side
principle.

**Split criterion** — an independently consumed lookup reference
([`../skill-writing/SKILL.md`](../skill-writing/SKILL.md)): the mechanism table, the two serialization tables
and the sender-state table are read at a decision point — a channel is added, a value is put on the wire, a
handler is written — not narratively.

This doc **deepens, and does not restate,** SKILL.md rules EL-R-07, EL-R-08, EL-R-09, EL-N-03 and EL-N-04, each
of which states its invariant with a check and a defeater. This doc owns what a reader needs to satisfy them:
which transport to pick, which table governs which direction, how the bridge and the guard are actually
written, and what each frame state must produce.

| Borrowed fact | Its one owner |
|---|---|
| Checklist items 17 and 20, the origin allowlist, and the navigation event surface | [`security.md`](security.md) |
| The sandboxed preload's module surface, and why it is one bundled file | [`process-model.md`](process-model.md) |
| How to *write* a discriminated union and a type predicate | [`../typescript/typing.md`](../typescript/typing.md) |
| The removed-in-vN table and the behavior-claim register | [`migration.md`](migration.md) |
| The seam that drives a null and a detached sender frame in a test | [`testing.md`](testing.md) |
| Validating untrusted input at a trust boundary, as a language-agnostic property | [`../coding/SKILL.md`](../coding/SKILL.md) |

## Contents

1. [Choosing the mechanism](#1-choosing-the-mechanism)
2. [Serialization over IPC: the Structured Clone table](#2-serialization-over-ipc-the-structured-clone-table)
3. [Serialization across the bridge: the contextBridge table](#3-serialization-across-the-bridge-the-contextbridge-table)
4. [Where the two tables disagree](#4-where-the-two-tables-disagree)
5. [The bridge surface: one method per message](#5-the-bridge-surface-one-method-per-message)
6. [The four bridge anti-patterns](#6-the-four-bridge-anti-patterns)
7. [The sender contract: two failure outcomes, two deny branches](#7-the-sender-contract-two-failure-outcomes-two-deny-branches)
8. [Runtime validation lives on the main side](#8-runtime-validation-lives-on-the-main-side)
9. [The typed channel contract](#9-the-typed-channel-contract)

---

## 1. Choosing the mechanism

Four transports, one selection condition each. The default is `invoke`/`handle`; the others earn their use.

| Transport | Direction | Choose it when | Cost |
|---|---|---|---|
| `ipcRenderer.invoke` / `ipcMain.handle` | renderer → main, with a reply | the renderer needs an answer — this is the default | a promise per call |
| `ipcRenderer.send` / `ipcMain.on` | renderer → main, no reply | the message is fire-and-forget and nothing waits on it | no reply path, so no error path either |
| `webContents.send` / `ipcRenderer.on` | main → renderer | main pushes an event the renderer did not ask for | addressed to one `webContents`, never broadcast |
| `MessagePort` | either, peer to peer | a stream, a high-volume channel, or a direct renderer-to-renderer link | the port is a resource the holder must close |
| `ipcRenderer.sendSync` | renderer → main, blocking | **never** | it blocks the renderer until main replies |

`sendSync` is not a fourth valid choice. `docs/api/ipc-renderer.md@v43.2.0` says of it, verbatim, *"avoid this
API for performance reasons"* — and the verdict this skill attaches to that sentence is **do not use it**: the
renderer's whole event loop, including painting and input, stops until main answers. Every case for it is an
`invoke` the caller has not been rewritten to await.

`ipcRenderer.sendTo()` was removed in Electron 28; renderer-to-renderer traffic goes over a `MessagePort`
([`migration.md`](migration.md)).

Main holds one end of a channel and hands the other to a renderer:

```ts main
import { MessageChannelMain, type WebContents } from 'electron';

// Main -> renderer push: addressed to one `webContents`, not broadcast to all.
export function publishProgress(target: WebContents, percent: number): void {
  target.send('job:progress', percent);
}

// A streaming channel: main keeps `port1`, the renderer receives `port2`.
export function openLogStream(target: WebContents): Electron.MessagePortMain {
  const { port1, port2 } = new MessageChannelMain();
  target.postMessage('log:stream', null, [port2]);
  port1.start();
  return port1;
}
```

A port is transferred, not copied: it is passed in `postMessage`'s transfer list, never inside the payload.
Everything arriving on that port is untrusted for the same reason everything arriving on a channel is
(§ 8) — a port handed to a renderer is reachable by every script that renderer runs.

---

## 2. Serialization over IPC: the Structured Clone table

**Direction: between main and a renderer — `send`, `invoke`, `postMessage`, and a `MessagePort`.** Electron
does not define this table. It delegates to the **HTML Structured Clone Algorithm**, which is the owner of the
complete type list; the rows below are the ones that decide an Electron design.

| Value | Crosses IPC? | What arrives |
|---|---|---|
| plain object, array, `Map`, `Set`, `Date`, `RegExp`, `ArrayBuffer`, typed array | yes | a copy, structurally equal |
| **function** | **no** | nothing — a function has no clone step, so the send fails |
| `Symbol` | no | nothing — same reason |
| `Error` | yes | name, message and stack; **custom properties are lost** |
| class instance | values only | a plain object; the prototype and every method on it are gone |
| `Promise` | no | nothing — but a `handle` callback may *return* a promise; Electron awaits it and clones the resolved value |
| `MessagePort` | only as a transfer | passed in `postMessage`'s transfer list, never as part of the payload |

The function row is the load-bearing one: a callback cannot be sent to main and called back later. A renderer
that wants to be told about something registers for a **channel** and main pushes to that channel (§ 1) — the
callback stays on the renderer side of the wire.

---

## 3. Serialization across the bridge: the contextBridge table

**Direction: from the preload's isolated world into the renderer's main world — `contextBridge`.** This is a
different mechanism with a **wider** table, documented by `docs/api/context-bridge.md@v43.2.0`. It is not the
table in § 2, and the difference is not a detail.

| Value | Crosses the bridge? | What arrives |
|---|---|---|
| plain object, array, `Date`, `RegExp`, typed array | yes | a copy |
| **function** | **yes** | a proxy — callable from the renderer, executing in the preload's world |
| `Symbol` | **no** | nothing |
| `Error` | yes | the error; **custom properties are lost** |
| class instance | values only | verbatim: *"Prototype modifications are dropped. Sending custom classes will copy values but not the prototype."* |
| `Promise` | yes | a promise the renderer can await — this is what makes an `invoke`-backed bridge method work |

Because functions cross, a bridge method may take a renderer callback and hold it — which is exactly what a
listener registration does (§ 5). Because prototypes do not, a class instance handed across the bridge arrives
as data with no methods: expose a plain object of functions, not an instance.

---

## 4. Where the two tables disagree

They are not one table with two names, and reading them as a union produces a bug in whichever direction the
union is wrong for (EL-N-04).

| Value | Over IPC (§ 2) | Across the bridge (§ 3) |
|---|---|---|
| **function** | **cannot cross** | **crosses, as a callable proxy** |
| `Symbol` | no | no |
| prototype of a class instance | dropped; the value arrives as a plain object | dropped, and the vendor states so explicitly |
| `Promise` | not clonable in a payload | crosses |

The trap is a value that is legal in one direction and silently wrong in the other. A callback the renderer
hands to a bridge method crosses fine — and the moment that bridge method puts it into an `invoke` payload, it
hits § 2's function row. The value did not change; the direction did. Check every value against the table for
**its own** direction, at the point it crosses.

---

## 5. The bridge surface: one method per message

Whatever `contextBridge` exposes is callable by every script the renderer ever runs, so the exposed object is
the application's public API and its width is the attack surface (checklist item 20, framed in
[`security.md`](security.md)). Three properties make a surface reviewable:

1. **The key set is written out**, not computed from a manifest or a loop.
2. **Each function names its own channel as a literal in its own body** — no channel arrives as a parameter.
3. **Every argument is written out** with its type; nothing is forwarded as `...args` to a channel the caller
   chose.

```ts preload
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('desktop', {
  // Request-response: one method, one channel literal, arguments written out.
  openProject: (path: string): Promise<boolean> => ipcRenderer.invoke('project:open', path),

  // Fire-and-forget: no reply, so no promise and no error path.
  reportView: (screen: string): void => {
    ipcRenderer.send('telemetry:view', screen);
  },

  // Push from main: the callback is wrapped, and the caller gets a disposer.
  onProgress: (listener: (percent: number) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, percent: number): void => {
      listener(percent);
    };
    ipcRenderer.on('job:progress', handler);
    return () => {
      ipcRenderer.removeListener('job:progress', handler);
    };
  },
});
```

`onProgress` is the shape EL-R-08 requires: the internal `IpcRendererEvent` is bound to a parameter the wrapper
keeps, and only the payload reaches `listener`. Handing the renderer *anything* read from that event — most
temptingly `event.senderFrame`, which is a live `WebFrameMain` — hands a page script a main-process object.
The disposer is returned rather than exposing a `removeListener` method, because a `removeListener` on the
bridge would take a channel name as a parameter and reopen property 2.

The preload is one bundled file ([`process-model.md`](process-model.md)), so this surface is written in one
place. That is a build constraint, and it is also why a growing bridge is visible in review rather than spread
across modules.

---

## 6. The four bridge anti-patterns

Every line in the block below **type-checks**. That is the point: none of these is a compiler problem, and
three of the four produce no runtime error either.

```ts preload
import { contextBridge, ipcRenderer } from 'electron';

// 1. Wholesale exposure. Since Electron 29 the renderer receives an EMPTY OBJECT.
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);

// 2. A passthrough method: any script in the page can now send any channel.
contextBridge.exposeInMainWorld('bridgeA', { send: ipcRenderer.send });

// 3. A channel-parameterized generic: the same footgun, one indirection later.
contextBridge.exposeInMainWorld('bridgeB', {
  invoke: (channel: string, ...args: unknown[]): Promise<unknown> =>
    ipcRenderer.invoke(channel, ...args),
});

// 4. An unwrapped callback: the renderer receives the internal event.
contextBridge.exposeInMainWorld('bridgeC', {
  onProgress: (listener: (event: Electron.IpcRendererEvent, percent: number) => void): void => {
    ipcRenderer.on('job:progress', listener);
  },
});
```

1. **`ipcRenderer` exposed wholesale.** Since **Electron 29** this does not leak the module — it **silently
   yields an empty object** on the receiving side, and the release notes call it a security footgun. Both
   halves matter. An author who believes it leaks expects a security review to catch it; an author who believes
   it works gets `{}` and a `TypeError` at a call site far from the bridge, with nothing pointing back here.
   The row for this behavior lives in [`migration.md`](migration.md).
2. **A `send` or `invoke` passthrough.** The vendor's own words: it *"would allow any website to send arbitrary
   IPC messages."* Every handler in the application becomes reachable from any script the page loads.
3. **A channel-parameterized generic.** `invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)`
   passes any check that reads "no exposed key is named `ipcRenderer`" and grants exactly what anti-pattern 2
   grants. The vendor prescribes the alternative directly: **one method per IPC message**. A bridge generated
   by iterating a channel manifest is the same defect with a review step removed — every generated function
   closes over a literal, and the surface is still whatever the manifest holds (EL-R-07).
4. **An unwrapped listener callback.** The renderer's callback is invoked with Electron's `IpcRendererEvent` as
   its first argument. Wrap it (§ 5).

---

## 7. The sender contract: two failure outcomes, two deny branches

Checklist item 17 requires every `ipcMain` handler to prove its sender ([`security.md`](security.md) owns the
checklist framing and the origin allowlist). The property that makes this hard is that `event.senderFrame` has
**two** documented failure outcomes since **Electron 33**, and they defeat different checks.

From `docs/breaking-changes.md@v43.2.0`, *"Behavior Changed: frame properties may retrieve detached
`WebFrameMain` instances or none at all"*, verbatim:

> "APIs which provide access to a `WebFrameMain` instance may return an instance with `frame.detached` set to
> `true`, or possibly return `null`."

> "When receiving an event, it's important to access WebFrameMain properties immediately upon being received.
> Otherwise, it's not guaranteed to point to the same webpage as when received. To avoid misaligned
> expectations, Electron will return `null` in the case of late access where the webpage has changed."

| Sender state | `senderFrame` reads as | Survives a null check? | Survives an origin allowlist? | Required verdict |
|---|---|---|---|---|
| attached, allowlisted origin | the frame | yes | yes | proceed |
| attached, other origin | the frame | yes | no | deny |
| **detached**, mid cross-origin navigation | the frame, `detached === true` | **yes** | **yes** — `.url` still reads as the pre-navigation origin | **deny** |
| **late read**, after an `await` | **`null`** | no | dereferencing `.url` **throws** | **deny** |

Read the table rows as the two things a handler must do, in order:

- **Read `senderFrame` synchronously, before the first `await`.** The null outcome is a property of *when* the
  read happens, not of what the sender did. The vendor's own sample marks the synchronous read
  `// ✅ accessed immediately` and the same read after `await crossOriginNavigationPromise`
  `// ❌ returns null due to late access`.
- **Deny on both outcomes.** A `null` frame denies; a frame with `detached === true` denies. The detached row
  is the one a careful implementation still gets wrong: the frame is non-null, so a null check passes it, and
  its `.url` is the pre-navigation value, so an origin allowlist passes it too. It is the exact state the flag
  was added to expose.

**The rejection path returns without performing the action.** It does not throw past the handler and does not
fall through to the work. Under `ipcMain.handle`, a thrown error is serialized back to the caller's promise —
which reports a failure but does not, by itself, mean the action was skipped; making the return the deny branch
is what guarantees it.

**The vendor's item-17 sample does neither.** It reads `if (!validateSender(event.senderFrame)) return null`,
and `validateSender` immediately dereferences `frame.url` — so a null frame **throws** instead of denying, and
a detached frame is **accepted**. Copied verbatim into an `async` handler it fails both ways. The safe form is
the guarded handler in SKILL.md's P6; this file states why each branch is there. That sample also compares
`(new URL(frame.url)).host`, which drops the scheme and the port; this skill compares `.origin` everywhere
(EL-R-05, sourced in [`security.md`](security.md)).

Here is the shape to recognize in review, which type-checks and is wrong twice over:

```ts main
import { ipcMain } from 'electron';

declare function loadDocument(id: string): Promise<string>;
declare function senderIsTrusted(frame: Electron.WebFrameMain | null): boolean;

ipcMain.handle('doc:load', async (event, id: string): Promise<string | null> => {
  const document = await loadDocument(id);
  // Late read: after the `await` the frame may have navigated, so this is `null`,
  // and a guard that dereferences `.url` throws instead of denying. The work has
  // also already been done, so the check can no longer prevent the action.
  if (!senderIsTrusted(event.senderFrame)) {
    return null;
  }
  return document;
});
```

Driving a real `null` and a real `detached === true` through a handler needs a cross-origin navigation staged
between the send and the read — [`testing.md`](testing.md) owns that seam. A handler is not proven by a test
that never produced either state.

---

## 8. Runtime validation lives on the main side

***`DERIVED`.*** No vendor sentence states this. It follows from three verified facts:

1. **TypeScript erases.** A channel's parameter annotation exists in the source and is gone in the running
   program; the value arriving at `ipcMain.handle` is whatever was on the wire.
2. **The preload is a trust boundary, and the renderer is on the far side of it.** A renderer is a browser tab
   an attacker may already control ([`process-model.md`](process-model.md)), so the bridge's argument list
   constrains a cooperating caller and nothing else.
3. **Checklist item 17 requires proving the *sender*, and says nothing about the *payload*.** A message from a
   trusted, allowlisted, attached frame can still carry an arbitrary value.

The conclusion: **every `ipcMain` handler narrows its payload at runtime, on the main side, next to the sender
check.** Typing the handler parameter is not that check; neither is validating in the preload, which runs where
the attacker already is.

```ts main
export type OpenRequest = {
  readonly projectId: string;
  readonly readOnly: boolean;
};

export function isOpenRequest(value: unknown): value is OpenRequest {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return typeof candidate['projectId'] === 'string' && typeof candidate['readOnly'] === 'boolean';
}
```

The handler takes its payload as `unknown`, narrows it with a predicate like this one, and denies on failure —
the same return-without-acting branch § 7 requires for the sender. For how to write predicates, discriminated
unions and exhaustive narrowing well, read [`../typescript/typing.md`](../typescript/typing.md); this file owns
only the placement, which is main-side and per handler.

---

## 9. The typed channel contract

Types are worth writing — they keep both ends of a channel in agreement and they make a widening visible in
review. They are **not** the check in § 8. The vendor's shape is an `interface.d.ts` that exports the API
interface and augments `Window` (`docs/tutorial/context-isolation.md@v43.2.0`):

```ts renderer
export interface DesktopApi {
  readonly openProject: (path: string) => Promise<boolean>;
  readonly reportView: (screen: string) => void;
  readonly onProgress: (listener: (percent: number) => void) => () => void;
}

declare global {
  interface Window {
    readonly desktop: DesktopApi;
  }
}
```

The interface belongs to the renderer's type surface, and the payload types belong to a shared module both
sides import — one definition, two consumers, so a change to a payload breaks the side that has not caught up:

```text
src/shared/channels.ts        payload types and channel-name constants (main + preload import this)
src/main/handlers.ts          ipcMain.handle: sender check, then runtime narrowing
src/preload/index.ts          the contextBridge surface, one method per channel
src/renderer/interface.d.ts   the DesktopApi interface and the Window augmentation
```

Two properties keep this honest:

- **The renderer never imports from `electron`.** Its only view of main is `window.desktop`
  ([`process-model.md`](process-model.md)).
- **The shared module is type-only plus channel-name constants.** A helper that both processes call would be a
  module the preload bundles and main also loads; the preload's module surface is narrower than main's, so a
  shared runtime helper is how a main-only import reaches a preload bundle (EL-R-10).

---

## References

One owner per borrowed fact: the sections above state the local consequence, and these entries name the source
that validates it. Each is `verified-against that source on 2026-07-25`.

- `docs/api/context-bridge.md@v43.2.0` — § 3's table, including the verbatim *"Prototype modifications are
  dropped. Sending custom classes will copy values but not the prototype."*
- `docs/api/ipc-renderer.md@v43.2.0` — the `sendSync` entry and its *"avoid this API for performance reasons"*
  sentence; the `send` / `invoke` / `on` / `postMessage` signatures behind § 1.
- `docs/breaking-changes.md@v43.2.0` — § 7's two quoted sentences, from the *"frame properties may retrieve
  detached `WebFrameMain` instances or none at all"* change under `## Planned Breaking API Changes (33.0)`;
  also the removal of `ipcRenderer.sendTo()` in 28 and the empty-object behavior of wholesale `ipcRenderer`
  exposure since 29.
- `docs/api/web-frame-main.md@v43.2.0` — the `detached` property § 7's third row turns on.
- `docs/tutorial/security.md@v43.2.0` — checklist items 17 and 20, and the item-17 sample § 7 is deliberately
  stricter than: it dereferences `frame.url` without a null check and compares `.host`.
- `docs/tutorial/context-isolation.md@v43.2.0` — the `interface.d.ts` shape in § 9, and the
  *"would allow any website to send arbitrary IPC messages"* verdict on a `send` passthrough.
- The **HTML Structured Clone Algorithm** — the owner of § 2's complete type list. Electron delegates to it;
  this file reproduces only the rows that change an Electron design.
- [`SKILL.md`](SKILL.md) — EL-R-07, EL-R-08, EL-R-09, EL-N-03 and EL-N-04, which this doc deepens and does not
  restate, and the P6 guarded-handler example § 7 explains. The supported-majors window every version claim
  above is read against lives there; each such claim is registered in [`migration.md`](migration.md)'s
  behavior-claim register.
