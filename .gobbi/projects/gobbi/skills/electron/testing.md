# Electron — Testing

**Owns** — proving the desktop behavior: the layer table and what each layer cannot prove; the Playwright
`_electron` entry with the vendor's stability caveat carried beside it; main-process unit testing through an
injected Electron surface; the IPC contract test that pins both ends of a channel; the adversarial origin
tests the origin-scoping rule requires; and the seam for driving a null and a detached sender frame.

**Split criterion** — an owned artifact set ([`../skill-writing/SKILL.md`](../skill-writing/SKILL.md)): the
test files for a desktop app are one set that changes together, and a reader opens this doc to write them —
after the design decisions the other children own have already been made.

This doc **deepens, and does not restate,** the *behavioral* half of SKILL.md rules EL-R-04 and EL-R-09. Those
rules state what must be observed: a disallowed input denied for each of the nine code-only items, an allowed
input denied from a disallowed origin for the five origin-sensitive ones, and the four sender inputs — null,
detached, off-origin, malformed payload — denied by every handler. This doc owns the seams that make those
observations possible at all.

| Borrowed fact | Its one owner |
|---|---|
| The nine code-only items, which five are origin-sensitive, and the origin allowlist | [`security.md`](security.md) |
| The channel contract being tested, the sender-state table, and the bridge surface | [`ipc.md`](ipc.md) |
| General test structure, fakes, and type-level testing as language idiom | [`../typescript/testing.md`](../typescript/testing.md) |
| Design for verification as a language-agnostic property | [`../coding/SKILL.md`](../coding/SKILL.md) |
| The React-side subscription lifetime this doc's fake bridge is used to check | [`renderer-react.md`](renderer-react.md) |
| Fuses, the packaged artifact, and how it is inspected | [`packaging-distribution.md`](packaging-distribution.md) |

## Contents

1. [Five layers, and what each cannot prove](#1-five-layers-and-what-each-cannot-prove)
2. [Main-process units without launching Electron](#2-main-process-units-without-launching-electron)
3. [The contract test: pinning both ends of a channel](#3-the-contract-test-pinning-both-ends-of-a-channel)
4. [The sender seam: producing a null and a detached frame](#4-the-sender-seam-producing-a-null-and-a-detached-frame)
5. [The five origin-sensitive adversarial tests](#5-the-five-origin-sensitive-adversarial-tests)
6. [End to end with Playwright `_electron`](#6-end-to-end-with-playwright-_electron)
7. [Components that assume the bridge exists](#7-components-that-assume-the-bridge-exists)

---

## 1. Five layers, and what each cannot prove

The right question for a desktop test is not "does it pass" but "which layer can see this property at all".

| Layer | Launches Electron? | Proves | Cannot prove |
|---|---|---|---|
| main-process unit (§ 2) | no | the verdict a guard returns for a given input, and that a payload is narrowed | that the guard is *wired* to the handler, or that the sender read happens before the first `await` |
| contract (§ 3) | no | both ends agree on the channel name and the payload shape | that a real message survives the wire |
| component (§ 7) | no | what the React tree does with the bridge, including that the disposer ran | anything about the real preload |
| end to end (§ 6) | yes, unpackaged | the app boots, windows appear, main-process state is readable | any property that exists only in a packaged build |
| packaged artifact | not a test run — an inspection | the fuse posture, the absent dev-server literal, deep links | a behavior nobody drove |

The last row is the one that gets skipped. Renderer security warnings, fuses, and the load path all behave
differently in a packaged app, so a full green run of layers 1–4 leaves EL-N-01 unsatisfied.
[`packaging-distribution.md`](packaging-distribution.md) owns that inspection.

---

## 2. Main-process units without launching Electron

***`DERIVED`.*** No Electron document describes this technique. It follows from two facts that are each
verified elsewhere: (1) the main process is Node ([`process-model.md`](process-model.md)), and (2) a unit that
takes its collaborators as parameters can be run against substitutes — the language-agnostic seam property
[`../coding/SKILL.md`](../coding/SKILL.md) owns. Put together: **a main-process module that takes its Electron
surface as an injected parameter is an ordinary Node module, and needs no Electron runtime to test.** That is
this skill's process boundary meeting `coding`'s seam property; it is not an Electron feature, and Electron
neither supports nor obstructs it.

The consequence is a design rule, not a test trick. A module that reaches for `ipcMain`, `app` or `dialog` at
import time can only be tested by launching Electron; the same module with those passed in is testable in
milliseconds:

```ts main
declare function senderIsTrusted(frame: Electron.WebFrameMain | null): boolean;

export type Registrar = Pick<Electron.IpcMain, 'handle'>;

export function registerFileHandlers(ipc: Registrar, readFile: (name: string) => Promise<string>): void {
  ipc.handle('file:read', async (event, payload: unknown): Promise<string | null> => {
    // The sender read is synchronous and first, as EL-R-09 requires; § 4 owns
    // the seam that makes this verdict testable.
    if (!senderIsTrusted(event.senderFrame) || typeof payload !== 'string') {
      return null;
    }
    return await readFile(payload);
  });
}
```

The test passes a `Registrar` that records what was registered, then calls the recorded handler directly. What
this cannot see is the wiring: a handler registered on the wrong channel name is invisible here and § 3 is
what catches it. Keep the injection at the module's edge — one `register…` function per surface — rather than
threading a fake `app` through the whole main process, which trades a launched Electron for a hand-written
one.

---

## 3. The contract test: pinning both ends of a channel

A channel is an agreement between two files that never import each other. The agreement holds only if both
import the same third file — the shared channel module in [`ipc.md`](ipc.md) — and the contract test is what
makes a drift between them a failure rather than a runtime `undefined`.

```ts main
export const CHANNELS = {
  openProject: 'project:open',
  readFile: 'file:read',
} as const;

export type ChannelName = (typeof CHANNELS)[keyof typeof CHANNELS];
export type HandlerMap = { readonly [K in ChannelName]: (payload: unknown) => Promise<unknown> };

declare function openProject(payload: unknown): Promise<boolean>;
declare function readFile(payload: unknown): Promise<string | null>;

// A channel added to CHANNELS with no handler fails here, and so does a handler
// for a channel that has been retired. The check is the assignment; nothing runs.
export const handlers = {
  [CHANNELS.openProject]: openProject,
  [CHANNELS.readFile]: readFile,
} satisfies HandlerMap;
```

Two halves make this a contract test rather than a type exercise:

- **The type half, above** — every channel has a handler and every handler has a channel. It runs in the
  build, not in the runner.
- **The runtime half** — for each channel, drive the payloads the contract allows and observe the result, then
  drive one payload it does not allow and observe the denial. That second case is the runtime narrowing
  [`ipc.md`](ipc.md) requires; a handler whose only payload check is its TypeScript annotation passes the type
  half and fails this one.

The bridge side is pinned by the same module: every exposed method names its channel as a literal (EL-R-07),
so a test that reads the exposed surface can assert each literal is a value of `CHANNELS`. A channel name
typed as a string in three places is the defect this whole section exists to prevent.

---

## 4. The sender seam: producing a null and a detached frame

EL-R-09's behavioral conjunct requires four inputs driven through every handler — a null frame, a detached
frame, an off-allowlist origin, and a malformed payload — with the action not performed in any of the four.
Two of those four cannot be produced by calling a handler: a real `null` needs a cross-origin navigation
staged between the send and the read, and a real `detached === true` needs a frame mid-navigation
([`ipc.md`](ipc.md) owns the sender-state table). **The seam is to make the frame's facts the input to the
decision, so the decision is testable even when the frame state is not producible.**

```ts main
export type SenderFacts = { readonly url: string; readonly detached: boolean } | null;

/** Reads the frame's facts. Call this synchronously, before the handler's first `await`. */
export function senderFacts(frame: Electron.WebFrameMain | null): SenderFacts {
  return frame === null ? null : { url: frame.url, detached: frame.detached };
}

/** The whole verdict, as a pure function of the facts. This is what the tests drive. */
export function senderIsTrusted(facts: SenderFacts, allowed: ReadonlySet<string>): boolean {
  if (facts === null || facts.detached) {
    return false;
  }
  try {
    return allowed.has(new URL(facts.url).origin);
  } catch {
    return false;
  }
}
```

`senderFacts` is the only part that needs a real frame, and it does the one thing that must happen
immediately: it reads the properties. Everything a test needs to drive is in `senderIsTrusted`, whose inputs
are plain objects:

| Test input | Expected verdict | The defect it catches |
|---|---|---|
| `null` | deny | a guard that fails open on null, or one that dereferences `.url` and throws instead of denying |
| `{ url: <allowed origin>, detached: true }` | deny | the detached frame — non-null, allowlisted `.url`, and the one a careful null check still admits |
| `{ url: 'https://evil.example/x', detached: false }` | deny | an allowlist compared against `.host`, or against a string prefix |
| `{ url: 'not a url', detached: false }` | deny | a `catch` that returns `true`, or one that lets the parse error escape |

**The static conjunct is not a test.** No runner can see whether the `senderFacts` call is lexically before the
first `await` — the null outcome only appears when a real navigation races the read, which a test does not
stage. That half is a review check over every handler body, and it is the reason the split above is worth
making: with the read isolated in one named function, "is it called before the first `await`" is a question
about one line per handler.

---

## 5. The five origin-sensitive adversarial tests

For each of the nine code-only items, one disallowed input must be driven through the guard and observed to be
denied. For the five origin-sensitive ones the disallowed-input test is not enough, because a guard can deny
every disallowed input and still grant every allowed one to **any** origin. Those five need a second test with
an inverted shape: **an allowed input, from a disallowed origin, denied.**

| Item | The allowed input | The disallowed origin it must arrive from | What the pair catches |
|---|---|---|---|
| 5 — permissions | `'media'`, or another permission the app really grants | a frame at `https://evil.example` | a handler that filters on the permission name and never reads the requesting origin |
| 13 — navigation | a URL inside the app's own allowlist | a **subframe**, and a redirect | a guard on `will-navigate` alone, which sees main-frame navigations only |
| 14 — window open | an allowlisted external URL | a `webContents` created after startup with no handler of its own | one correct handler on the first window, in an app that makes more |
| 15 — `openExternal` | an allowlisted `https://` URL | a message from an off-allowlist sender | an allowlist checked on the URL while the caller is never checked |
| 17 — sender validation | a well-formed, contract-valid payload | a detached or off-allowlist frame (§ 4) | a handler that validates the payload and trusts the sender |

The mechanics are the same as § 2: the verdict is a pure function of `(input, origin)`, so both tests are
ordinary unit tests. The permission pair is the one worth writing out, because its defeater is a handler that
looks complete:

```ts main
declare const ALLOWED_ORIGINS: ReadonlySet<string>;

const ALLOWED_PERMISSIONS: ReadonlySet<string> = new Set(['notifications', 'media']);

export function permissionVerdict(requestingUrl: string, permission: string): boolean {
  let origin: string;
  try {
    origin = new URL(requestingUrl).origin;
  } catch {
    return false;
  }
  // Both conjuncts, or the app grants the camera to whoever asks.
  return ALLOWED_ORIGINS.has(origin) && ALLOWED_PERMISSIONS.has(permission);
}
```

`permissionVerdict('https://evil.example', 'media') === false` is the whole adversarial test, and a guard
written as `cb(ALLOWED_PERMISSIONS.has(permission))` fails it while passing every disallowed-permission test.
The same verdict function must be registered on **both** the permission request and the permission check
handler ([`security.md`](security.md) owns the pair and the item numbering).

---

## 6. End to end with Playwright `_electron`

Playwright is the recommended end-to-end path for Electron, and its own documentation states the caveat
verbatim: *"Playwright has experimental support for Electron automation."* The underscore in `_electron` is
that caveat in the API surface — an underscore-prefixed export is not a naming quirk, it is the signal that
the entry point carries no stability guarantee and may change between minor releases. Pin the Playwright
version and expect the Electron entry, specifically, to move under you; the rest of Playwright is not what is
experimental here.

Four calls carry most end-to-end work: `_electron.launch({ args })` starts the app, `firstWindow()` waits for
its first window, `windows()` lists them, and `electronApp.evaluate(…)` runs a function **inside the main
process** — which is how a test reads `app`, a session, or any main-process module. That last one is why the
example below is type-checked under the main target: the test file itself runs in Node under the test runner,
but the callback body executes in main.

```ts main
// Playwright's surface, declared locally: the example harness installs no runner.
interface ElectronPage {
  title(): Promise<string>;
}
interface ElectronApplication {
  evaluate<T>(fn: (electron: typeof import('electron')) => T | Promise<T>): Promise<T>;
  firstWindow(): Promise<ElectronPage>;
  windows(): readonly ElectronPage[];
  close(): Promise<void>;
}
declare const _electron: {
  launch(options: { readonly args: readonly string[] }): Promise<ElectronApplication>;
};

export async function readUserDataPath(): Promise<string> {
  const electronApp = await _electron.launch({ args: ['.'] });
  try {
    // This callback runs in the MAIN process, not in the test runner.
    return await electronApp.evaluate(({ app }) => app.getPath('userData'));
  } finally {
    await electronApp.close();
  }
}
```

Two limits to keep in view. The launched app is **unpackaged**, so every property that only exists in a
packaged build is still unproven here (§ 1's last row). And **Spectron does not appear in Electron's
documentation at the anchor version** — a sample that reaches for it is a reliable tell for stale training
data, in the same family as `remote` and `ipcRenderer.sendTo()` (EL-N-05). Do not scaffold it.

---

## 7. Components that assume the bridge exists

A React component under test runs in a DOM environment with no preload, so `window.desktop` is `undefined` and
the component fails on its first call. The fix is not to guard every access — it is to install a fake that
satisfies the same interface the preload exposes, and to make the fake a real emitter, because the property
worth testing is that the disposer ran ([`renderer-react.md`](renderer-react.md) owns the React-side rule).

```ts renderer
export interface DesktopApi {
  readonly openProject: (path: string) => Promise<boolean>;
  readonly onProgress: (listener: (percent: number) => void) => () => void;
}

export function fakeDesktop(): {
  readonly api: DesktopApi;
  readonly emitProgress: (percent: number) => void;
  readonly listenerCount: () => number;
} {
  const listeners = new Set<(percent: number) => void>();
  return {
    api: {
      openProject: (): Promise<boolean> => Promise.resolve(true),
      onProgress: (listener): (() => void) => {
        listeners.add(listener);
        return (): void => {
          listeners.delete(listener);
        };
      },
    },
    emitProgress: (percent): void => {
      for (const listener of listeners) {
        listener(percent);
      }
    },
    listenerCount: (): number => listeners.size,
  };
}
```

`listenerCount()` is what makes the leak visible: mount the component, unmount it, and assert the count is back
to zero. A fake whose `onProgress` returns a no-op disposer passes a component that never cleans up, which is
the same defect one indirection away. Two more properties the fake must keep, because they are the contract it
is standing in for: it returns the payload only, never anything shaped like an `IpcRendererEvent`; and its
interface is the one from [`ipc.md`](ipc.md), imported rather than retyped, so a widened bridge does not leave
a stale fake passing.

---

## References

One owner per borrowed fact: the sections above state the local consequence, and these entries name the source
that validates it.

- [Playwright](https://playwright.dev/docs/api/class-electron) 1.62.0 — § 6's four calls and the verbatim
  *"Playwright has experimental support for Electron automation."* **Ecosystem tier**: read from Playwright's
  own API page, not from an Electron source. `verified-against that page on 2026-07-25`.
- `docs/tutorial/security.md@v43.2.0` — the checklist item numbers in § 5 and which of them are
  origin-sensitive; [`security.md`](security.md) owns the partition itself.
  `verified-against electronjs.org/docs@v43.2.0 on 2026-07-25`.
- Spectron's **absence** from Electron's documentation at the anchor version — the § 6 stale-training-data
  tell. `verified-against electronjs.org/docs@v43.2.0 on 2026-07-25`.
- [`ipc.md`](ipc.md) — the sender-state table § 4's four inputs come from, the shared channel module § 3
  pins, and the bridge surface § 7's fake stands in for.
- [`security.md`](security.md) — the nine code-only items, the five origin-sensitive ones, and the permission
  pair § 5 tests.
- [`../coding/SKILL.md`](../coding/SKILL.md) and [`../typescript/testing.md`](../typescript/testing.md) — the
  seam property § 2 derives from, and how to write the fakes and type-level checks above.
- [`SKILL.md`](SKILL.md) — EL-R-04, EL-R-09 and EL-N-01, whose behavioral halves this doc makes runnable, and
  the supported-majors window every version claim above is read against.
