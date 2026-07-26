# Electron — Security

**Owns** — this skill's sole `webPreferences` defaults table; all 20 checklist items on their **two**
independent axes; what the renderer security warnings do and do not cover; the navigation event
surface; the permission pair; the window-open and `openExternal` guards; the session partition and the
custom protocol; and the production fuse **posture**. **Owns no packaging step and no IPC depth.**

**Split criterion** — an independently consumed lookup reference
([`../skill-writing/SKILL.md`](../skill-writing/SKILL.md)): its tables are read at a decision point — a
`webPreferences` key is added, a guard is written, a security review runs — not narratively.

This doc **deepens, and does not restate,** SKILL.md rules EL-R-03 through EL-R-06, EL-R-12, EL-N-01
and EL-N-02, each of which states its invariant with a check and a defeater. This doc owns what a
reader needs to satisfy them: which items are handled already, which are not, which event a guard
attaches to, and what each default is.

| Borrowed fact | Its one owner |
|---|---|
| The bridge surface, sender-validation depth, and the two serialization tables | [`ipc.md`](ipc.md) |
| What runs where, and the sandboxed preload's module surface | [`process-model.md`](process-model.md) |
| When and how the fuse posture is flipped, signed and read back | [`packaging-distribution.md`](packaging-distribution.md) |
| The dev-vs-production renderer load path | [`tooling-config.md`](tooling-config.md) |
| The version window and the rotation procedure behind item 16 | [`SKILL.md`](SKILL.md), [`migration.md`](migration.md) |
| Validating untrusted input at a trust boundary, as a language-agnostic property | [`../coding/SKILL.md`](../coding/SKILL.md) |

## Contents

1. [The 20 items, on two axes](#1-the-20-items-on-two-axes)
2. [Why a clean dev console proves almost nothing](#2-why-a-clean-dev-console-proves-almost-nothing)
3. [The `webPreferences` defaults](#3-the-webpreferences-defaults)
4. [Bucket B: the ten controls you must write](#4-bucket-b-the-ten-controls-you-must-write)
5. [Item 5: permissions are a pair](#5-item-5-permissions-are-a-pair)
6. [Item 13: the navigation event surface](#6-item-13-the-navigation-event-surface)
7. [Items 14 and 15: opening windows and opening URLs](#7-items-14-and-15-opening-windows-and-opening-urls)
8. [Items 12 and 18: the webview guard and the packaged origin](#8-items-12-and-18-the-webview-guard-and-the-packaged-origin)
9. [Item 19: the fuse posture](#9-item-19-the-fuse-posture)
10. [Items 17 and 20: the boundary this file does not own](#10-items-17-and-20-the-boundary-this-file-does-not-own)

---

## 1. The 20 items, on two axes

The checklist has **20 items** (`verified-against docs/tutorial/security.md@v43.2.0 on 2026-07-25` —
twenty `### N.` headings). One axis cannot place them. Collapsing the two into "the flags are correct
by default, plus nine things to write" mislabels a control that ships **absent** as one that ships
**handled**. **Axis 1 — what work does the item require?** Every item lands in exactly one bucket.
**Axis 2 — does a renderer security warning fire for it?** Eight do; twelve do not.

| # | Item | Axis 1 | Warning? |
|---|---|---|---|
| 1 | Only load secure content | C — practice | yes |
| 2 | Do not enable Node.js integration for remote content | A — default | yes |
| 3 | Enable context isolation | A — default | no |
| 4 | Enable process sandboxing | A — default | no |
| 5 | Handle session permission requests from remote content | **B — you write it** | no |
| 6 | Do not disable `webSecurity` | A — default | yes |
| 7 | Define a Content-Security-Policy | **B — you write it** | yes |
| 8 | Do not set `allowRunningInsecureContent` to `true` | A — default | yes |
| 9 | Do not enable experimental features | A — default | yes |
| 10 | Do not use `enableBlinkFeatures` | A — default | yes |
| 11 | Do not use `allowpopups` for `<webview>` | A — default | yes |
| 12 | Verify `webview` options before creation | **B — you write it** | no |
| 13 | Disable or limit navigation | **B — you write it** | no |
| 14 | Disable or limit creation of new windows | **B — you write it** | no |
| 15 | Do not use `shell.openExternal` with untrusted content | **B — you write it** | no |
| 16 | Use a current version of Electron | C — practice | no |
| 17 | Validate the sender of all IPC messages | **B — you write it** | no |
| 18 | Avoid `file://`; prefer a custom protocol | **B — you write it** | no |
| 19 | Check which fuses you can change | **B — you write it** | no |
| 20 | Do not expose Electron APIs to untrusted web content | **B — you write it** | no |

Bucket A = {2, 3, 4, 6, 8, 9, 10, 11} (8). Bucket B = {5, 7, 12, 13, 14, 15, 17, 18, 19, 20} (10).
Bucket C = {1, 16} (2). 8 + 10 + 2 = 20. Warning coverage = {1, 2, 6, 7, 8, 9, 10, 11} (8).

**The nine code-only items are the intersection** of bucket B with "no warning fires":
**#5, #12, #13, #14, #15, #17, #18, #19, #20**. That set — and only that set — is what EL-R-04 binds.

**Item 7 is in bucket B, not bucket A.** Electron ships **no** default Content-Security-Policy. Item
7's own `#### How?` answers with main-process code — a
`session.defaultSession.webRequest.onHeadersReceived(...)` handler that sets the header (`#### How?` at
file line 371, sample at line 394, `verified-against docs/tutorial/security.md@v43.2.0 on 2026-07-25`).
It is excluded from the nine for one reason only: a dev-console warning happens to cover it, and § 2
shows how little that is worth. Filing item 7 as already-correct-by-default tells an author a control is
handled when nothing has been written — a security claim that fails unsafe.

**Item 1 is a practice, not a default.** "Only load secure content" is a discipline over every URL the
app loads, not a key with a safe value. It sits in bucket C with item 16, whose rotation procedure is
owned by SKILL.md's version window and [`migration.md`](migration.md).

---

## 2. Why a clean dev console proves almost nothing

Electron's renderer emits security warnings from `lib/renderer/security-warnings.ts@v43.2.0`. They
cover **doc items 1, 2, 6, 7, 8, 9, 10 and 11** — eight of twenty — and they fire **only in unpackaged
development builds**. Two consequences, and the second is the rule-level one:

1. **The warning set is disjoint from the nine.** {1, 2, 6, 7, 8, 9, 10, 11} ∩ {5, 12, 13, 14, 15, 17,
   18, 19, 20} = ∅. **Zero of the nine code-only items fire a warning.** That is proved by the
   disjointness of the two sets, not by any source comment.
2. **A clean console is not an acceptance signal** (EL-N-01). It is evidence about eight items in one
   build mode. The nine that carry the trust boundary are invisible to it, and so is every property
   that exists only in a packaged build (§ 9). Security evidence for a change names the nine
   individually, each with its own result.

The source's comments confirm parts of this, but their scope is narrower than it looks: *"still
experimental"* covers context isolation alone (line 140), *"we can't easily programmatically check for
those cases"* covers the permission handler alone (line 143), and *"we can't easily programmatically
check for it"* covers the `webview`, navigation, new-window and `openExternal` items (line 251). They
are **silent** about doc items 16 through 20. Cite the disjointness, not the comments.

### The numbering offset — read this before re-verifying

`security-warnings.ts` numbers its own checklist differently from the live document, because the
source's numbering predates the insertion of doc item 4 ("Enable process sandboxing"). A rotator who
re-fetches the source and compares raw numbers will conclude this file is wrong and "correct" it to the
stale numbering.

**Translation rule: doc item = source `#N` for N ≤ 3; doc item = source `#N` + 1 for N ≥ 4.**

| `security-warnings.ts` comment | Subject | Live doc item | Warning? |
|---|---|---|---|
| `#1` (line 87) | Only load secure content | **1** | yes |
| `#2` (line 119) | Node.js integration | **2** | yes |
| `#3` (line 141) | Context isolation | **3** | no |
| `#4` (line 144) | `setPermissionRequestHandler` | **5** | no |
| `#5` (line 147) | Do not disable `webSecurity` | **6** | yes |
| `#6` (line 161) | Content-Security-Policy | **7** | yes |
| `#7` (line 177) | `allowRunningInsecureContent` | **8** | yes |
| `#8` (line 192) | Experimental features | **9** | yes |
| `#9` (line 209) | `enableBlinkFeatures` | **10** | yes |
| `#10` (line 230) | `allowpopups` | **11** | yes |
| `#11`–`#14` (lines 252–255) | `webview` options, navigation, new windows, `openExternal` | **12, 13, 14, 15** | no |

`verified-against lib/renderer/security-warnings.ts@v43.2.0 on 2026-07-25`.

---

## 3. The `webPreferences` defaults

**No file in Electron's documentation carries this table.** `docs/tutorial/security.md@v43.2.0`
contains **zero** Markdown table rows, and four of the options below appear in it zero times. The real
owner of the defaults is `docs/api/structures/web-preferences.md@v43.2.0`, which documents **44**
top-level options as prose bullets. The table below is a composite assembled from that file plus the
only three "Since" values stated anywhere — prose sentences in the security tutorial, not a column
(`verified-against both documents on 2026-07-25`).

| Option | Default | Since | "Since" sourced from |
|---|---|---|---|
| `nodeIntegration` | `false` | 5.0.0 | `security.md:161` (prose) |
| `contextIsolation` | `true` | 12.0.0 | `security.md:226` (prose) |
| `sandbox` | `true` | 20.0.0 | `security.md:252` (prose) |
| `webSecurity` | `true` | — | no "since" stated anywhere |
| `nodeIntegrationInWorker`, `webviewTag`, `allowRunningInsecureContent`, `experimentalFeatures`, `safeDialogs`, `navigateOnDragDrop`, `plugins` | `false` | — | `structures/web-preferences.md` (prose bullets) |
| `nodeIntegrationInSubFrames` | `false` | — | states no default in either file |

**Twelve is not the surface.** EL-R-03 is a closed property — *no* key is set to a value less safe than
its documented default — and it is checked against the **44**, not against these twelve.
`enableBlinkFeatures` is checklist item 10 and sits outside this table; so do 31 other options. The
residue is explicit: at review time, read the remaining defaults from
`structures/web-preferences.md@v43.2.0`. A diff scoped to a twelve-row summary passes an application
that sets any of the other 32 unsafely.

The posture is to write as little as possible. Every key present in a `webPreferences` object is a claim
that needs justification against its documented default; a window that needs a preload sets `preload`
and nothing else, leaving `contextIsolation`, `sandbox` and `nodeIntegration` absent by design.

### `nodeIntegration: true` is a triple regression

It does not add one capability. It removes three protections at once — Node in the renderer, context
isolation **off**, and process sandboxing **off** for that process, *regardless of the `sandbox`
setting*. Verbatim from `docs/tutorial/security.md@v43.2.0`:

> "Beware that *disabling context isolation* for a renderer process by setting `nodeIntegration: true`
> *also disables process sandboxing* for that process."

> "*Disabling context isolation* (see above) *also disables process sandboxing*, regardless of the
> default, `sandbox: false` or globally enabled sandboxing!"

The sandbox half is the one that gets missed: with the sandbox off, the nine-module preload surface in
[`process-model.md`](process-model.md) stops describing the preload at all. EL-N-02 states the
prohibition — and grepping for the literal `nodeIntegration: true` does not enforce it, because
`nodeIntegrationInWorker: true` puts Node back with the named key untouched.

---

## 4. Bucket B: the ten controls you must write

Ten items are code that does not exist unless someone writes it. Nine fire no warning; item 7 is the
tenth and fires one.

| # | What you write | Denies by default? | Depth |
|---|---|---|---|
| 5 | `setPermissionRequestHandler` **and** `setPermissionCheckHandler`, both scoped by origin | required | § 5 |
| 7 | A `Content-Security-Policy` response header | n/a — a policy, not a branch | § 4 below |
| 12 | A `will-attach-webview` handler that strips `preload` and verifies `src` | required | § 8 |
| 13 | A navigation allowlist on the right event | required | § 6 |
| 14 | `setWindowOpenHandler` on every `webContents` | required | § 7 |
| 15 | An `openExternal` allowlist over the parsed protocol | required | § 7 |
| 17 | Sender validation in every `ipcMain` handler | required | [`ipc.md`](ipc.md) |
| 18 | A custom protocol for the packaged renderer | n/a — a load path | § 8 |
| 19 | The production fuse posture, flipped at packaging time | n/a — a build step | § 9 |
| 20 | A narrow, explicit `contextBridge` surface | required | [`ipc.md`](ipc.md) |

For every row marked "required", EL-R-04 binds two properties, not one: the default branch **denies and
is reachable**, and for the origin-sensitive items — 5, 13, 14, 15, 17 — an **allowed input arriving
from a disallowed origin is also denied**. A guard that filters only on the *name* of the thing being
asked for grants it to every origin in the session. The existence of a guard module is never evidence
for any of these rows.

### Item 7 — the CSP you have to add

There is no default to leave alone. The response-header form covers every document the session loads,
including ones a `<meta>` tag in one HTML file would miss:

```ts main
import { session } from 'electron';

const POLICY = "default-src 'self'; script-src 'self'; object-src 'none'";

export function applyContentSecurityPolicy(): void {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: { ...details.responseHeaders, 'Content-Security-Policy': [POLICY] },
    });
  });
}
```

A CSP is a policy, not a deny branch, so the check on it differs in kind: read the directives, not the
presence of the call. `script-src 'self' 'unsafe-inline'` is a registered, header-setting,
warning-silencing CSP that permits inline script.

---

## 5. Item 5: permissions are a pair

Checklist item 5 prescribes `setPermissionRequestHandler`, and its sample scopes the decision by origin
— it builds `new URL(webContents.getURL())` and rejects unless the protocol is `https:` and the host
matches (`security.md@v43.2.0:272-313`).

***`DERIVED` — the pair.*** `setPermissionCheckHandler` appears **zero** times in
`docs/tutorial/security.md@v43.2.0`. The obligation to register both comes from a different document:
`docs/api/session.md@v43.2.0:951` states, verbatim, *"Most web APIs do a permission check and then make
a permission request if the check is denied."* Two premises follow — the check and the request are
separate documented entry points, and the check runs **first** — so an application that registers only
the request handler leaves the check handler on its default path. The conclusion is an inference from
the session doc, not a quoted checklist requirement.

```ts main
import { session } from 'electron';

const APP_ORIGIN = 'https://app.example.com';
const GRANTED: ReadonlySet<string> = new Set(['notifications']);

function isAppOrigin(url: string): boolean {
  try {
    return new URL(url).origin === APP_ORIGIN;
  } catch {
    return false; // a parse failure denies
  }
}

export function installPermissionHandlers(): void {
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(isAppOrigin(webContents.getURL()) && GRANTED.has(permission));
  });
  session.defaultSession.setPermissionCheckHandler((_webContents, permission, requestingOrigin) => {
    return requestingOrigin === APP_ORIGIN && GRANTED.has(permission);
  });
}
```

Both handlers decide on the origin **and** the permission. `setPermissionCheckHandler` receives
`requestingOrigin` as a string, so there is nothing to parse; the request handler parses the URL it
reads from the `webContents`, and a parse failure denies. Dropping either conjunct is EL-R-04's
defeater: `callback(GRANTED.has(permission))` denies every unlisted permission, passes a
disallowed-permission test, and grants the listed ones to every origin in the session.

---

## 6. Item 13: the navigation event surface

The origin comparison is only half of this control. **The guard's coverage is a property of the event it
is attached to**, and the vendor's own item-13 sample attaches to the event with the narrowest coverage.
From `docs/api/web-contents.md@v43.2.0` (`verified-against that document on 2026-07-25`):

| Event | Covers | The gap |
|---|---|---|
| `will-navigate` | **the main frame only** — *"only fired when main frame navigates"* (line 32), repeated at line 49 | every subframe navigation |
| `will-frame-navigate` | *"the main frame or any of its subframes"* (line 300) | — |
| `will-redirect` | redirects **during** a navigation (line 336) | a separate event and a separate registration |

**Both** navigation events skip programmatic navigation. Identical sentences at lines 271 and 302:
*"This event will not emit when the navigation is started programmatically with APIs like
`webContents.loadURL` and `webContents.back`."* Both also skip in-page navigation — anchor links,
`window.location.hash` — which is observable through `did-navigate-in-page`.

So a flawless `.origin` allowlist attached to `will-navigate` alone is silently incomplete **twice
over**: subframes are never seen, and neither is anything the app navigates itself. The vendor's item-13
sample (`security.md@v43.2.0:595-641`) has exactly that shape.

- **The subframe hole is closable by event choice**: attach to `will-frame-navigate`, and to
  `will-redirect` for redirect coverage.
- **The programmatic hole is not.** It is by design — the app's own code called `loadURL`. The paired
  obligation is a review point, not a listener: **main-process code never passes an untrusted URL to
  `loadURL` or `loadFile`.** A URL that arrived over IPC, from a deep link, or from a file on disk is
  untrusted.

```ts main
const ALLOWED_ORIGINS: ReadonlySet<string> = new Set(['https://app.example.com']);

function navigationIsAllowed(url: string): boolean {
  try {
    return ALLOWED_ORIGINS.has(new URL(url).origin);
  } catch {
    return false; // an unparseable or relative URL denies
  }
}

export function guardNavigation(contents: Electron.WebContents): void {
  contents.on('will-frame-navigate', (details) => {
    if (!navigationIsAllowed(details.url)) details.preventDefault();
  });
  contents.on('will-redirect', (details) => {
    if (!navigationIsAllowed(details.url)) details.preventDefault();
  });
}
```

### Compare the parsed security identity, never a string prefix

The comparison is `new URL(url).origin` against a literal allowlist. The security document makes the
prefix failure explicit at `security.md@v43.2.0:622`: `startsWith('https://example.com')` admits
`https://example.com.attacker.com`. `.includes(...)` and `.host.endsWith(...)` are evadable the same way
— and `.host` additionally drops the scheme and the port, so an `http://` peer on the same host passes a
host comparison. For tuple-origin schemes such as `https:`, this skill therefore teaches `.origin`,
including where the vendor's item-17 sample compares `.host` (`DERIVED`, stated in SKILL.md EL-R-05;
depth in [`ipc.md`](ipc.md)).

That rule has one security-critical boundary: a non-special custom scheme such as the packaged
`app://bundle/index.html` has an opaque origin, and `new URL(...).origin` serializes it as `"null"`.
Never put `"null"` in an allowlist. `file:`, `data:`, and `about:` URLs serialize opaque origins to the
same sentinel, so a derived `Set([new URL(PACKAGED_ENTRY).origin])` admits all of them. Match an explicitly
allowed custom scheme by its exact parsed `.protocol` and `.host` instead, adding a path check when the
application grants authority more narrowly than the whole custom-protocol host:

```ts main
const ALLOWED_APP_AUTHORITIES = [
  { protocol: 'app:', host: 'bundle' },
] as const;

function packagedAppUrlIsAllowed(raw: string): boolean {
  try {
    const parsed = new URL(raw);
    return ALLOWED_APP_AUTHORITIES.some(
      (allowed) => parsed.protocol === allowed.protocol && parsed.host === allowed.host,
    );
  } catch {
    return false;
  }
}
```

The parse-failure path **denies**. `catch { return true }` is the shape that passes a reviewer reading
for "parses with `new URL`, compares `.origin`, has an allowlist" and admits every malformed URL.

---

## 7. Items 14 and 15: opening windows and opening URLs

**Item 14 — `setWindowOpenHandler` returns `{ action: 'deny' }` by default.** It decides every
`window.open`, every `target="_blank"`, and every window Chromium would otherwise create. The
fall-through branch denies; an allowlisted external URL goes to the OS browser instead of a renderer.

**It is per-`webContents`.** A correct handler registered once on the first `BrowserWindow` leaves every
later window — child windows and `WebContentsView`s created after startup — with no handler at all, and
a single-window test never sees it. Register where `webContents` are created, not where the first window
is built.

**Item 15 — `shell.openExternal` hands a string to the operating system.** The allowlist is over the
parsed protocol, not over the string: a `file:`, `smb:` or custom-scheme URL reaching it is a
local-execution path on some platforms.

```ts main
import { app, shell } from 'electron';

const EXTERNAL_PROTOCOLS: ReadonlySet<string> = new Set(['https:']);

export function openExternalIfSafe(url: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return;
  }
  if (EXTERNAL_PROTOCOLS.has(parsed.protocol)) void shell.openExternal(url);
}

export function denyWindowOpenEverywhere(): void {
  app.on('web-contents-created', (_event, contents) => {
    contents.setWindowOpenHandler((details) => {
      openExternalIfSafe(details.url);
      return { action: 'deny' };
    });
  });
}
```

Registering through `web-contents-created` is what makes the coverage complete: every `webContents` the
app ever creates passes through it, including ones a later feature adds. Both guards deny on a parse
failure, and `openExternalIfSafe` is the only path to `shell.openExternal` in the application — a second
call site that skips the allowlist makes the guard decorative.
[`windows-native.md`](windows-native.md) owns the rest of the `shell` surface; `shell.openPath` and
`shell.showItemInFolder` take the same "the argument is untrusted" reading.

---

## 8. Items 12 and 18: the webview guard and the packaged origin

**Item 12 — `webview`.** The tag is off by default (`webviewTag: false`, § 3), and leaving it off is the
whole control. If it must be on, the embedder verifies every tag before it attaches: handle
`will-attach-webview` on the parent `webContents`, **delete `preload` from the passed `webPreferences`**
so the page cannot choose its own preload, and verify the `src` origin against the same allowlist § 6
uses. Item 11 belongs to this surface too — `allowpopups` on a `<webview>` reopens item 14 inside it.

**Item 18 — serve the packaged renderer over a custom protocol, not `file://`.** Under `file://` the
renderer's origin is opaque, so same-origin policy, `fetch` and storage all behave differently from the
development runtime, and `grantFileProtocolExtraPrivileges` exists because applications worked around
that. A standard, secure scheme gives the packaged renderer a real origin — which is what makes the § 6
allowlist and the § 5 origin checks meaningful in production:

```ts main
import { app, net, protocol } from 'electron';
import { pathToFileURL } from 'node:url';

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);

export function serveRendererOverAppProtocol(rendererRoot: string): void {
  void app.whenReady().then(() => {
    protocol.handle('app', (request) => {
      const { pathname } = new URL(request.url);
      return net.fetch(new URL(`.${pathname}`, pathToFileURL(`${rendererRoot}/`)).toString());
    });
  });
}
```

`registerSchemesAsPrivileged` runs **before** the app is ready — a hard ordering constraint, not a style
choice. Development does not take this path: it loads from the dev server's `http://localhost` origin,
so the two modes meet **different** origins, and the § 6 allowlist must contain the one live in the mode
being run. [`tooling-config.md`](tooling-config.md) is the single owner of that switch (EL-R-11).

**Session partitions.** Untrusted content that must be loaded at all belongs in its own partition —
`partition: 'persist:untrusted'`, or an in-memory one — so its cookies, storage and permission grants
are not the application's. The § 5 handlers are registered **per session**: what is installed on
`session.defaultSession` does not apply to a named partition, and a partition created without them has
no handlers at all.

---

## 9. Item 19: the fuse posture

Fuses are boolean flags flipped **into the packaged binary**, at packaging time and **before code
signing** — flipping after signing invalidates the signature. This file owns the *posture*: which fuses
and why. [`packaging-distribution.md`](packaging-distribution.md) owns the flip, its place in the build,
and the signing order (SKILL.md design note 3).

| Posture | Fuse | Why |
|---|---|---|
| **disable** | `runAsNode` | it lets the packaged binary be started as a plain Node process |
| **disable** | `nodeOptions` | `NODE_OPTIONS` in the environment injects into the app |
| **disable** | `nodeCliInspect` | `--inspect` attaches a debugger to a shipped app |
| **disable** | `grantFileProtocolExtraPrivileges` | the `file://` privileges item 18 exists to stop needing |
| **enable** | `embeddedAsarIntegrityValidation` | validates the ASAR against an embedded hash |
| **enable** | `onlyLoadAppFromAsar` | the app loads from the validated archive and nowhere else |

**The last two are one control, not two.** `embeddedAsarIntegrityValidation` alone is bypassable:
validation applies to the ASAR, so an attacker who arranges for the app to load from an unpacked
directory never presents an archive to validate. `onlyLoadAppFromAsar` closes the path that makes the
bypass reachable. Enabling one and not the other reads as a partial posture and is not one. The exact
flag identifiers the tooling accepts are owned by the `@electron/fuses` README and by
[`packaging-distribution.md`](packaging-distribution.md); the names above are the posture's subjects.

**Verification is a read-back from the shipped artifact**, per platform and architecture:

```text
npx @electron/fuses read --app <path-to-signed-artifact>
```

`UNVERIFIED-AGAINST-ARTIFACT`: this invocation is transcribed from the `@electron/fuses` README and has
not been run against a packaged build here. Two failures the read-back is written against (EL-R-12): a
green result taken from the x64 build while the arm64 build ships unflipped, and a comparison scored
only over the fuses the tool happened to report — a posture entry missing from the output is a
**failure**, not a match.

**ASAR is not a security boundary** and the fuses do not make it one. `original-fs` reads straight
through it. Secrets do not go in the bundle (EL-N-06).

---

## 10. Items 17 and 20: the boundary this file does not own

Both are in the nine, so both are listed here — but their implementation depth belongs to
[`ipc.md`](ipc.md), and this file does not restate it (SKILL.md design note 1).

- **Item 17 — validate the sender of all IPC messages.** Every `ipcMain.handle` and `ipcMain.on` body
  proves its sender before it acts, against the same allowlist § 6 uses. `event.senderFrame` has **two**
  documented failure outcomes since Electron 33 — `null`, and a non-null frame with `detached === true`
  — and it is read **synchronously, before the first `await`**, because a navigation between the send
  and the read changes what it reports. The vendor's own item-17 sample does not null-check it. How each
  branch is written, and why a detached frame survives both a null check and an origin allowlist:
  [`ipc.md`](ipc.md).
- **Item 20 — do not expose Electron APIs to untrusted web content.** Whatever `contextBridge` exposes
  is callable by every script the renderer ever runs, so the exposed surface is the attack surface and
  every widening is a reviewed API change. The bridge's shape and the four anti-patterns:
  [`ipc.md`](ipc.md).

The review of the nine records items 17 and 20 individually, like the other seven. Routing their depth
elsewhere does not remove them from the list.

---

## References

One owner per borrowed fact: the sections above state the local consequence, and these entries name the
source that validates it. Each is `verified-against that source on 2026-07-25`.

- `docs/tutorial/security.md@v43.2.0` — the 20 items and their `#### How?` sections; the `startsWith`
  warning at line 622 and the `parsedUrl.origin` sample at line 634; the item-5 sample at lines 272-313;
  the item-13 sample at lines 595-641; item 7's `#### How?` at line 371 with its sample at line 394;
  both context-isolation coupling quotes in § 3. It contains **no** defaults table — zero Markdown table
  rows.
- `docs/api/structures/web-preferences.md@v43.2.0` — the real owner of the `webPreferences` defaults,
  **44** documented options as prose bullets. § 3's table is a composite assembled from it; no vendor
  file carries that table.
- `docs/api/web-contents.md@v43.2.0` — § 6's event surface: the main-frame-only scope of `will-navigate`
  (lines 32 and 49), the subframe coverage of `will-frame-navigate` (line 300), the identical
  programmatic-navigation exclusions (lines 271 and 302), and `will-redirect` (line 336).
- `docs/api/session.md@v43.2.0:951` — the premise behind § 5's `DERIVED` permission pair: *"Most web
  APIs do a permission check and then make a permission request if the check is denied."*
- [WHATWG URL Standard § 4.7](https://url.spec.whatwg.org/#origin), verified 2026-07-26 — tuple origins
  for the special network schemes and opaque origins for other schemes; the latter serialize through the
  URL API as `"null"`.
- `lib/renderer/security-warnings.ts@v43.2.0` — the eight-item warning coverage, the dev-build-only
  condition, the three "currently missing" comments with their exact scopes, and § 2's numbering offset.
- [`@electron/fuses`](https://github.com/electron/fuses) — the fuse flags and the
  `npx @electron/fuses read --app <path>` invocation in § 9, with its `UNVERIFIED-AGAINST-ARTIFACT`
  marker.
- [`SKILL.md`](SKILL.md) — EL-R-03 through EL-R-06, EL-R-12, EL-N-01 and EL-N-02, which this doc deepens
  and does not restate, and the supported-majors window every claim above is read against.
